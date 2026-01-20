/**
 * @typedef {Object} Rect
 * @property {number} x - X座標 (0.0 - 1.0)
 * @property {number} y - Y座標 (0.0 - 1.0)
 * @property {number} w - 幅 (0.0 - 1.0)
 * @property {number} h - 高さ (0.0 - 1.0)
 */

/**
 * @typedef {Object} Variant
 * @property {string} id - GlyphWikiのID (例: "u6728-01")
 * @property {number[]} rect - グリフの有効領域 [x, y, w, h] (例: [0, 0, 0.5, 1])
 */

/**
 * @typedef {Object} CharConfig
 * @property {string} char - 表示文字
 * @property {string[]} layouts - 許可されるレイアウトIDの配列
 * @property {Object.<string, Variant|string>} [variants] - レイアウトごとの代替グリフ定義
 */

/**
 * 設定・定数管理クラス
 * アプリケーション全体で使用される定数定義を提供します。
 */
class GlyphConfig {
    /**
     * 各漢字の設定定義を取得します。
     * @returns {CharConfig[]}
     */
    static get CHARS() {
        return [
            { 
                char: "木", 
                layouts: ["ADD_RIGHT", "ADD_LEFT", "ADD_TOP", "ADD_BOTTOM"],
                variants: { "ADD_LEFT": { id: "u6728-01", rect: [0, 0, 0.45, 1] } } // きへん
            },
            { 
                char: "日", 
                layouts: ["ADD_RIGHT", "ADD_TOP", "ADD_BOTTOM"] 
            },
            { 
                char: "口", 
                layouts: ["ADD_RIGHT", "ADD_LEFT", "ADD_TOP", "ADD_BOTTOM"] 
            },
            { 
                char: "田", 
                layouts: ["ADD_RIGHT", "ADD_TOP", "ADD_BOTTOM"] 
            },
            { 
                char: "門", 
                layouts: ["ADD_RIGHT", "ADD_LEFT", "ENCLOSE_GATE"] 
            },
            { 
                char: "人", 
                layouts: ["ADD_RIGHT", "ADD_TOP", "ADD_LEFT"],
                variants: { "ADD_LEFT": { id: "u4ebb-01", rect: [0, 0, 0.5, 1] } } // にんべん
            },
            { 
                char: "水", 
                layouts: ["ADD_LEFT", "ADD_BOTTOM"],
                variants: { "ADD_LEFT": { id: "u6c35-01", rect: [0, 0, 0.45, 1] } } // さんずい
            },
            { 
                char: "火", 
                layouts: ["ADD_LEFT", "ADD_BOTTOM"],
                variants: { 
                    "ADD_LEFT": { id: "u706b-01", rect: [0, 0, 0.5, 1] }, // ひへん
                    "ADD_BOTTOM": { id: "u706c-04", rect: [0, 0.6, 1, 0.4] } // れっか (下部に配置されている前提)
                } 
            },
            { 
                char: "土", 
                layouts: ["ADD_RIGHT", "ADD_BOTTOM", "ADD_LEFT"],
                variants: { "ADD_LEFT": { id: "u571f-01", rect: [0, 0, 0.55, 1] } } // 土偏
            },
            { 
                char: "山", 
                layouts: ["ADD_TOP", "ADD_LEFT"] 
            },
            { 
                char: "雨", 
                layouts: ["ADD_TOP", "ADD_RIGHT"],
                variants: { "ADD_TOP": { id: "u96e8-03", rect: [0, 0, 1, 0.5] } } // 雨冠 (上60%くらい)
            },
            { 
                char: "言", 
                layouts: ["ADD_LEFT", "ADD_RIGHT", "ADD_BOTTOM"],
                variants: { "ADD_LEFT": { id: "u8a00-01", rect: [0, 0, 0.4, 1] } } // 言偏
            },
            { 
                char: "心", 
                layouts: ["ADD_BOTTOM", "ADD_RIGHT", "ADD_LEFT"],
                variants: { 
                    "ADD_LEFT": { id: "u5fc4-01", rect: [0, 0, 0.4, 1] }, // りっしんべん
                    "ADD_BOTTOM": { id: "u5fc3-04", rect: [0, 0.6, 1, 0.4] } // したごころ
                }
            },
            {
                char: "手",
                layouts: ["ADD_LEFT", "ADD_BOTTOM"],
                variants: { "ADD_LEFT": { id: "u624c-01", rect: [0, 0, 0.45, 1] } } // 手偏
            },
            {
                char: "示",
                layouts: ["ADD_LEFT", "ADD_BOTTOM"],
                variants: { "ADD_LEFT": { id: "u793b-01", rect: [0, 0, 0.45, 1] } } // しめすへん
            },
            { 
                char: "辶",
                layouts: ["NYOU"],
                variants: { "NYOU": { id: "u8fb6-g", rect: [0, 0, 1, 1] } } // しんにょう
            },
            { 
                char: "囗", 
                layouts: ["ENCLOSE"] 
            }
        ];
    }

    /**
     * レイアウトIDと表示ラベルの対応マップを取得します。
     * @returns {Object.<string, string>}
     */
    static get LAYOUT_LABELS() {
        return {
            ADD_RIGHT: "右に追加 (つくり)",
            ADD_LEFT:  "左に追加 (へん)",
            ADD_TOP:   "上に載せる (かんむり)",
            ADD_BOTTOM: "下に追加 (あし)",
            NYOU:      "しんにょう (左下囲み)",
            ENCLOSE:   "囲む (くにがまえ)",
            ENCLOSE_GATE: "門構え (内側下配置)",
            TRIANGLE:  "品字型 (3つ複製)"
        };
    }

    /**
     * 指定された文字設定とレイアウトモードに対するバリアント情報（グリフIDと有効領域）を解決します。
     * @param {CharConfig} charConfig - 対象の文字設定オブジェクト
     * @param {string} layoutMode - 適用するレイアウトモード
     * @returns {{id: string, rect: Rect|null}} グリフIDと有効領域(Rect)のペア
     */
    static getVariantInfo(charConfig, layoutMode) {
        let id;
        let rect = null;

        const variant = charConfig.variants ? charConfig.variants[layoutMode] : undefined;

        if (variant) {
            if (typeof variant === 'object' && variant.id) {
                id = variant.id;
                if (variant.rect) {
                    rect = {
                        x: variant.rect[0],
                        y: variant.rect[1],
                        w: variant.rect[2],
                        h: variant.rect[3]
                    };
                }
            } else if (typeof variant === 'string') {
                id = variant;
            }
        }

        if (!id) {
            id = charConfig.char;
        }

        return { id, rect };
    }
}

/**
 * データローダークラス
 * GlyphWiki APIを通じてKAGEデータを取得し、キャッシュ管理を行います。
 */
class GlyphLoader {
    constructor() {
        /** @type {Object.<string, string>} グリフデータのキャッシュ */
        this.cache = {};
    }

    /**
     * 文字からGlyphWiki ID (uXXXX) を生成します。
     * @param {string} char - 変換する文字
     * @returns {string|null} ID (例: "u6728")
     */
    charToId(char) {
        if (!char) return null;
        return 'u' + char.codePointAt(0).toString(16).toLowerCase();
    }

    /**
     * GlyphWikiからデータを非同期で取得します。
     * 再帰的な部品参照 (99:...) も自動的に解決します。
     * @param {string} nameOrId - 文字またはID ("木" or "u6728")
     * @returns {Promise<string|null>} KAGEフォーマットのデータ文字列
     */
    async load(nameOrId) {
        const id = nameOrId.startsWith('u') ? nameOrId : this.charToId(nameOrId);
        if (!id) return null;
        if (this.cache[id]) return this.cache[id];

        try {
            const url = `https://glyphwiki.org/api/glyph?name=${id}`;
            const res = await fetch(url);
            const json = await res.json();
            const data = json.data;
            this.cache[id] = data;

            // 依存データ（部品）の再帰読み込み
            const lines = data.split('$');
            const promises = [];
            for (const line of lines) {
                const cols = line.split(':');
                if (cols[0] === '99') { // 部品参照
                    const refId = cols[7];
                    if (refId && !this.cache[refId]) {
                        promises.push(this.load(refId));
                    }
                }
            }
            await Promise.all(promises);
            return data;
        } catch (e) {
            console.error(`Failed to load ${id}`, e);
            return null;
        }
    }

    /**
     * 現在のキャッシュオブジェクトを返します。
     * @returns {Object.<string, string>}
     */
    getCache() { return this.cache; }
}

/**
 * 漢字合成クラス
 * アフィン変換、レイアウト計算、ストローク操作を担当します。
 * DOM操作は行わず、データの計算のみを行います。
 */
class KanjiComposer {
    /**
     * @param {GlyphLoader} glyphLoader 
     */
    constructor(glyphLoader) {
        this.loader = glyphLoader;
    }

    /**
     * 内部計算用にKAGEエンジンのインスタンスを生成し、キャッシュ済み部品を登録します。
     * @returns {Kage}
     * @private
     */
    _getKageInstance() {
        const kage = new Kage();
        const cache = this.loader.getCache();
        for (const [id, data] of Object.entries(cache)) {
            kage.kBuhin.push(id, data);
        }
        return kage;
    }

    /**
     * KAGE文字列を絶対座標のストローク配列に分解・展開します。
     * 部品参照(99)はすべて絶対座標の線分に変換されます。
     * @param {string} kageData - KAGEデータ文字列
     * @returns {number[][]} ストローク配列
     */
    flatten(kageData) {
        const kage = this._getKageInstance();
        kage.kBuhin.push("u_temp", kageData);
        return kage.getEachStrokes(kageData);
    }

    /**
     * ストローク配列を指定されたターゲット領域に合わせて座標変換します。
     * ソースデータの有効領域(srcRect)を考慮してマッピングを行います。
     * * @param {number[][]} strokes - ストローク配列
     * @param {Rect} targetBox - 配置先の領域 {x, y, w, h} (論理座標系)
     * @param {Rect} [srcRect] - ソースデータの有効領域 {x, y, w, h} (0.0~1.0の比率)
     * @returns {number[][]} 変換後のストローク配列
     */
    transformStrokes(strokes, targetBox, srcRect) {
        // ソース領域のピクセル換算 (KAGE標準は200x200)
        // srcRectが未指定の場合は全体(0,0,1,1)を使用
        const sX = (srcRect ? srcRect.x : 0) * 200;
        const sY = (srcRect ? srcRect.y : 0) * 200;
        const sW = (srcRect ? srcRect.w : 1) * 200;
        const sH = (srcRect ? srcRect.h : 1) * 200;

        // マッピング計算:
        const scaleX = targetBox.w / sW;
        const scaleY = targetBox.h / sH;
        
        const offsetX = targetBox.x - sX * scaleX;
        const offsetY = targetBox.y - sY * scaleY;

        return strokes.map(s => {
            const newStroke = [...s];
            // KAGEデータの座標はインデックス3以降に X, Y, X, Y... と並ぶ
            let startIndex = 3; 
            for (let i = startIndex; i < newStroke.length; i++) {
                const val = newStroke[i];
                if ((i - startIndex) % 2 === 0) {
                    // X座標変換
                    newStroke[i] = Math.floor(val * scaleX + offsetX);
                } else {
                    // Y座標変換
                    newStroke[i] = Math.floor(val * scaleY + offsetY);
                }
            }
            return newStroke;
        });
    }

    /**
     * ストローク配列をKAGE文字列形式に再結合します。
     * @param {number[][]} strokes 
     * @returns {string}
     */
    stringify(strokes) {
        return strokes.map(s => s.join(':')).join('$');
    }

    /**
     * 2つのパーツを合成し、新しい漢字データを生成します。
     * 面積保存則に基づき、新しい論理サイズと面積を計算します。
     * * @param {string} currentData - 現在のキャンバス上の漢字データ
     * @param {string} partData - 追加するパーツのデータ
     * @param {string} layoutMode - 合成レイアウトモード (ADD_RIGHT, ADD_LEFT 等)
     * @param {number} currentLogicalSize - 現在の論理サイズ (一辺の長さ)
     * @param {number} currentArea - 現在の論理面積
     * @param {number} areaFactor - 面積増加係数 (ユーザー調整用)
     * @param {Rect} [partRect] - 追加パーツの有効領域情報
     * @returns {{data: string, logicalSize: number, area: number}} 合成結果
     */
    compose(currentData, partData, layoutMode, currentLogicalSize, currentArea, areaFactor, partRect) {
        const strokesCurrent = this.flatten(currentData);
        const strokesPart = this.flatten(partData);

        let nextLogicalSize = currentLogicalSize;
        let boxCurrent = {}, boxPart = {};

        // デフォルトのパーツRect (指定なければフルサイズ)
        const srcPartRect = partRect || { x:0, y:0, w:1, h:1 };
        
        // --- 1. レイアウトごとの配置計算と論理サイズの決定 ---

        if (layoutMode === 'ADD_RIGHT') {
            const addW = 300;
            nextLogicalSize = currentLogicalSize + addW;
            boxCurrent = { x: 0, y: 0, w: currentLogicalSize, h: nextLogicalSize };
            boxPart = { x: currentLogicalSize, y: 0, w: addW, h: nextLogicalSize };
        } else if (layoutMode === 'ADD_LEFT') {
            const addW = 120;
            nextLogicalSize = currentLogicalSize + addW;
            boxPart = { x: 0, y: 0, w: addW, h: nextLogicalSize };
            boxCurrent = { x: addW, y: 0, w: currentLogicalSize, h: nextLogicalSize };
        } else if (layoutMode === 'ADD_TOP') {
            const addH = 150;
            nextLogicalSize = currentLogicalSize + addH;
            boxPart = { x: 0, y: 0, w: nextLogicalSize, h: addH };
            boxCurrent = { x: 0, y: addH, w: nextLogicalSize, h: currentLogicalSize };
        } else if (layoutMode === 'ADD_BOTTOM') {
            const addH = 150;
            nextLogicalSize = currentLogicalSize + addH;
            boxCurrent = { x: 0, y: 0, w: nextLogicalSize, h: currentLogicalSize };
            boxPart = { x: 0, y: currentLogicalSize, w: nextLogicalSize, h: addH };
        } else if (layoutMode === 'NYOU') {
            // しんにょう: 既存パーツを縮小して右上に配置
            nextLogicalSize = currentLogicalSize / 0.7;
            const margin = nextLogicalSize - currentLogicalSize;
            const offsetY = nextLogicalSize * 0.1;
            boxPart = { x: 0, y: 0, w: nextLogicalSize, h: nextLogicalSize };
            boxCurrent = { x: margin, y: offsetY, w: currentLogicalSize, h: currentLogicalSize };
        } else if (layoutMode === 'ENCLOSE') {
            // 囲み: 既存パーツを中心に配置
            nextLogicalSize = currentLogicalSize + 70;
            const boxSize = nextLogicalSize * 1.4 - 70;
            const boxPadding = (nextLogicalSize - boxSize) / 2;
            const padding = (nextLogicalSize - currentLogicalSize) / 2;
            boxPart = { x: boxPadding, y: boxPadding, w: boxSize, h: boxSize };
            boxCurrent = { x: padding, y: padding, w: currentLogicalSize, h: currentLogicalSize };
        } else if (layoutMode === 'ENCLOSE_GATE') {
            // 門構え: 中身を縮小して下部に配置
            const innerRatio = 0.75; 
            nextLogicalSize = currentLogicalSize / innerRatio;
            boxPart = { x: 0, y: 0, w: nextLogicalSize, h: nextLogicalSize };
            const contentScale = 0.5;
            const contentW = nextLogicalSize * contentScale;
            const contentH = nextLogicalSize * contentScale;
            const offsetX = (nextLogicalSize - contentW) / 2;
            const offsetY = nextLogicalSize * 0.45;
            boxCurrent = { x: offsetX, y: offsetY, w: contentW, h: contentH };
        } else if (layoutMode === 'TRIANGLE') {
            // 品字型: 既存を無視してパーツを3つ配置する特殊モード
            nextLogicalSize = currentLogicalSize * 2;
            const nextArea = (40000 * 3) * areaFactor; 
            const half = nextLogicalSize / 2;
            const boxTop = { x: half/2, y: 0, w: half, h: half };
            const boxLeft = { x: 0, y: half, w: half, h: half };
            const boxRight = { x: half, y: half, w: half, h: half };
            
            const s1 = this.transformStrokes(strokesPart, boxTop, srcPartRect);
            const s2 = this.transformStrokes(strokesPart, boxLeft, srcPartRect);
            const s3 = this.transformStrokes(strokesPart, boxRight, srcPartRect);
            return {
                data: this.stringify([...s1, ...s2, ...s3]),
                logicalSize: nextLogicalSize,
                area: nextArea
            };
        }

        // --- 2. 面積計算 (Area Preservation) ---
        const baseRatio = nextLogicalSize / currentLogicalSize;
        const baseNextArea = currentArea * baseRatio;
        const deltaArea = baseNextArea - currentArea;
        const adjustedDelta = deltaArea * areaFactor;
        const nextArea = currentArea + adjustedDelta;

        // --- 3. 変形適用 (Affine Transform) ---
        
        // 既存データの変換:
        const scaleX_curr = boxCurrent.w / currentLogicalSize;
        const scaleY_curr = boxCurrent.h / currentLogicalSize;
        const offsetX_curr = boxCurrent.x;
        const offsetY_curr = boxCurrent.y;
        
        const transCurrent = strokesCurrent.map(s => {
            const newStroke = [...s];
            for (let i = 3; i < newStroke.length; i+=2) {
                newStroke[i] = Math.floor(newStroke[i] * scaleX_curr + offsetX_curr);
                newStroke[i+1] = Math.floor(newStroke[i+1] * scaleY_curr + offsetY_curr);
            }
            return newStroke;
        });

        // 新規パーツの変換 (Rect対応):
        const transPart = this.transformStrokes(strokesPart, boxPart, srcPartRect);
        
        return {
            data: this.stringify([...transCurrent, ...transPart]),
            logicalSize: Math.floor(nextLogicalSize),
            area: nextArea
        };
    }

    /**
     * ランダムに漢字を選んで合成を行います。
     * 設定リスト(GlyphConfig.CHARS)からランダムにパーツと配置を選択し、
     * バリアント解決とロードを行ってから合成結果を返します。
     * * @param {string} currentData - 現在の漢字データ
     * @param {number} currentLogicalSize - 現在の論理サイズ
     * @param {number} currentArea - 現在の論理面積
     * @param {number} areaFactor - 面積係数
     * @returns {Promise<{data: string, logicalSize: number, area: number, info: {char: string, layout: string}}>}
     */
    async composeRandom(currentData, currentLogicalSize, currentArea, areaFactor) {
        // 1. ランダムなパーツを選択
        const charList = GlyphConfig.CHARS;
        const charConfig = charList[Math.floor(Math.random() * charList.length)];
        
        // 2. そのパーツが許可するレイアウトからランダムに選択
        const layoutMode = charConfig.layouts[Math.floor(Math.random() * charConfig.layouts.length)];
        
        // 3. バリアントとRectの解決 (GlyphConfigに委譲)
        const { id, rect: partRect } = GlyphConfig.getVariantInfo(charConfig, layoutMode);
        const partDataStr = await this.loader.load(id);

        // 4. 合成実行
        const result = this.compose(
            currentData, 
            partDataStr, 
            layoutMode, 
            currentLogicalSize, 
            currentArea, 
            areaFactor,
            partRect
        );
        
        // 結果と、何を追加したかの情報を返す
        return {
            ...result,
            info: {
                char: charConfig.char,
                layout: layoutMode
            }
        };
    }
}

/**
 * 編集状態管理クラス (State)
 * 履歴管理、JSON入出力APIを提供します。
 */
class KanjiEditorState {
    constructor() {
        this.history = [];
        this.state = this._getInitialState();
    }
    _getInitialState() {
        return { data: "", logicalSize: 200, area: 40000 };
    }
    
    /**
     * 状態をリセットします。
     * @param {string} initialData - 初期データ
     */
    reset(initialData) {
        this.history = [];
        this.state = { data: initialData, logicalSize: 200, area: 40000 };
    }
    
    /**
     * 新しい状態に更新し、履歴に追加します。
     */
    update(newData, newSize, newArea) {
        this.history.push({ ...this.state });
        this.state.data = newData;
        this.state.logicalSize = newSize;
        this.state.area = newArea;
    }
    
    /**
     * ひとつ前の状態に戻します。
     * @returns {boolean} 成功したかどうか
     */
    undo() {
        if (this.history.length > 0) {
            this.state = this.history.pop();
            return true;
        }
        return false;
    }
    
    getCurrent() { return this.state; }
    
    /**
     * 現在の状態をJSON文字列としてエクスポートします。
     */
    exportJson() { return JSON.stringify(this.state, null, 2); }
    
    /**
     * JSON文字列から状態を復元します。
     * @param {string} jsonString 
     * @returns {boolean} 成功したかどうか
     */
    importJson(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            if (typeof parsed.data === 'string' && typeof parsed.logicalSize === 'number' && typeof parsed.area === 'number') {
                this.history = [];
                this.state = parsed;
                return true;
            } else { return false; }
        } catch (e) { return false; }
    }
}