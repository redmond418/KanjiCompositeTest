/**
 * 漢字レンダラークラス
 * Canvasへの描画と、表示サイズに応じた線の太さ補正を担当します。
 */
class KanjiRenderer {
    /**
     * @param {GlyphLoader} glyphLoader 
     */
    constructor(glyphLoader) {
        this.loader = glyphLoader;
    }

    /**
     * KAGEエンジンの線幅パラメータをスケーリングします。
     * これにより、Canvasのscaleで縮小されても線が細くなりすぎないようにします。
     * @param {Kage} kage - KAGEインスタンス
     * @param {number} s - スケール倍率 (補正値)
     * @private
     */
    _applyKageScale(kage, s) {
        kage.kWidth *= s;
        kage.kMinWidthT *= s;
        kage.kMinWidthY *= s;
        kage.kMinWidthU *= s;
        kage.kMage *= s;
        const scaleArray = (arr) => { if(arr) for(let i=0; i<arr.length; i++) arr[i] *= s; };
        scaleArray(kage.kAdjustKakatoL);
        scaleArray(kage.kAdjustKakatoR);
        if(Array.isArray(kage.kAdjustKakatoRangeX)) scaleArray(kage.kAdjustKakatoRangeX);
        else kage.kAdjustKakatoRangeX *= s;
        scaleArray(kage.kAdjustKakatoRangeY);
        scaleArray(kage.kAdjustUrokoX);
        scaleArray(kage.kAdjustUrokoY);
        scaleArray(kage.kAdjustUrokoLength);
        scaleArray(kage.kAdjustUrokoLine);
        kage.kAdjustUroko2Length *= s;
    }

    /**
     * 漢字データをCanvasに描画します。
     * @param {HTMLCanvasElement} canvas - 描画対象のCanvas要素
     * @param {string} kageData - 描画するKAGEデータ
     * @param {number} logicalSize - 論理サイズ (座標系の最大値)
     * @param {number} area - 論理面積 (視覚サイズの算出に使用)
     * @returns {{visualSize: number, scaleFactor: number}|null} 描画メトリクス
     */
    draw(canvas, kageData, logicalSize, area) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);
        if (!kageData) return null;

        // 視覚的なサイズとスケーリング係数の計算
        const visualSize = Math.sqrt(area);
        const scaleFactor = visualSize / logicalSize;

        ctx.save();
        
        // 1. 画面(Canvas)に収めるためのスケーリング
        const fitScale = width / visualSize; 
        ctx.scale(fitScale, fitScale);
        
        // 2. 論理座標から視覚座標へのスケーリング
        ctx.scale(scaleFactor, scaleFactor);

        // 3. 線幅補正
        // 画面上で小さく表示されるほど、相対的に太く描画して視認性を保つ
        const totalScale = fitScale;
        const compensation = 1.0 / totalScale * 2.0;

        const kage = new Kage(); 
        this._applyKageScale(kage, compensation);
        
        const polygons = new Polygons();
        const cache = this.loader.getCache();
        for (const [id, data] of Object.entries(cache)) {
            kage.kBuhin.push(id, data);
        }
        kage.kBuhin.push("u_render", kageData);
        kage.makeGlyph(polygons, "u_render");

        ctx.fillStyle = "black";
        ctx.beginPath();
        for (let i = 0; i < polygons.array.length; i++) {
            const poly = polygons.array[i];
            if(poly.array.length > 0) {
                ctx.moveTo(poly.array[0].x, poly.array[0].y);
                for (let j = 1; j < poly.array.length; j++) {
                    ctx.lineTo(poly.array[j].x, poly.array[j].y);
                }
            }
        }
        ctx.fill();
        ctx.restore();
        
        return { visualSize, scaleFactor };
    }
}