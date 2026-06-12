
class UIObject extends GameObject {
    constructor(props) {
        super(props)
        this.parentPanel = null
        this.inputGroup = null
        this.valiable = true
    }

    setVisible(bool) {
        this.visible = bool;
        this.parentPanel?.updateLayout(); // Optional Chaining 사용
    }

    toggleVisible() {
        if (this.visible) {
            this.hide()
        }
        else {
            this.show()
        }
    }
}

export class TextObject extends UIObject {
    constructor(option) {
        super()
        this.textClass = new Text(option)
        this.textClass.x = 0
        this.textClass.y = 0
        if(option.position){
            this.x = option.position.x
            this.y = option.position.y
        }
        this.addChild(this.textClass)
    }
}
window.TextObject = TextObject

export class Button extends UIObject {
    /**
     * @param {Object} options - 버튼 옵션
     * @param {number} options.id - 버튼 ID (선택적)
     * @param {Point} options.pos - 버튼 위치
     * @param {string} [options.text] - 버튼 텍스트
     * @param {string} [options.langKey] - 현재 언어 기준 텍스트 키
     * @param {PIXI.Sprite|PIXI.Texture} [options.texture] - 버튼 텍스처 또는 스프라이트
     * @param {{width:number,height:number}} [options.touchArea] - 버튼 터치 범위
     * @param {Function} [options.onHighlight] - 하이라이트 상태 변경 시 실행될 함수
     * @param {Function} [options.onPress] - 버튼 선택 시 실행될 함수
     * @param {Function} [options.onToggle] - 버튼 토글 시 실행될 함수
     */
    constructor(options = {}) {
        super(options);

        const {
            pos,
            text = '',
            id = 0,
            langKey = null,
            texture = null,
            touchArea = null,
            onHighlight = null,
            onPress = null,
            onToggle = null,
            style = Data.styles.default
        } = options;

        if (pos) {
            this.set(pos);
        }

        this.id = id;
        this.defaultText = text;
        this.langKey = langKey;
        this.textStyle = style;
        this.touchAreaOption = touchArea;
        this.onHighlight = onHighlight;
        this.onPress = onPress;
        this.onToggle = onToggle;
        this.baseSprite = this.createBaseSprite(texture);
        this.textObject = null;

        /** @type {Function|null} */
        this.textFormat = null

        this.negFilter = new PIXI.ColorMatrixFilter();
        this.negFilter.negative();
        
        this.glowFilter = new PIXI.ColorMatrixFilter();
        this.glowFilter.brightness(1.5);

        this.init();
    }

    createBaseSprite(texture) {
        if (!texture) {
            return null;
        }
        if (texture instanceof PIXI.Sprite) {
            return texture;
        }
        return new Sprite({
            texture,
            anchor: 0.5
        });
    }

    init() {
        
        this.hitAreaRect = Img.sprite("rect", 1, "rgba(255,255,255,1)", { anchor: { x: 0.5, y: 0.5 } });
        this.hitAreaRect.cursor = 'pointer';
        this.hitAreaRect.eventMode = 'static';
        this.addChild(this.hitAreaRect)

        if (this.baseSprite) {
            this.baseSprite.anchor.set(0.5);
            this.addChild(this.baseSprite);
        }
        else {
            this.textObject = new Text({
                text: this.defaultText,
                style: this.textStyle,
                anchor: 0.5,
                position: { x: 0, y: 0 }
            });
            this.addChild(this.textObject);
        }

        if (this.langKey) {
            this.refreshText();
        }
        else {
            this.updateTouchArea();
        }

        this.hitAreaRect.on('pointerover', () => this.toggleHighlight(true));
        this.hitAreaRect.on('pointerout', () => this.toggleHighlight(false));
        this.hitAreaRect.on('pointerdown', () => this.toggleHighlight(true));
        this.hitAreaRect.on('pointerup', () => {
            this.toggleHighlight(false);
            this.press();
        });
        this.hitAreaRect.on('pointerupoutside', () => this.toggleHighlight(false));
    }

    refreshText() {
        if (!this.textObject) { return; }
        this.textObject.text = this.textFormat ? this.textFormat(Data.text(this.langKey) ?? this.defaultText) : Data.text(this.langKey) ?? this.defaultText;
        this.updateTouchArea();
    }

    setFormat(format){
        this.textFormat = format
        this.refreshText()
    }

    updateTouchArea() {
        const source = this.baseSprite ?? this.textObject;
        const width = this.touchAreaOption?.width ?? source?.width ?? 0;
        const height = this.touchAreaOption?.height ?? source?.height ?? 0;
        this.hitAreaRect.scale.set(width, height)
    }

    setFilter(type){
        switch (type) {
            case 'glow':
                this.filters = isActive ? [this.glowFilter] : [];
                break;
            case 'negative':
                this.filters = isActive ? [this.negFilter] : [];
                break;
        }
    }

    toggleHighlight(isActive) {
        if(this.inputGroup?.valiable === false) return
        this.onHighlight?.(isActive);
    }

    toggleValiable(boolean){
        this.valiable = boolean
        this.hitAreaRect.interactive = boolean
        this.onToggle?.(boolean)
    }

    press() {
        if(this.inputGroup?.valiable === false) return
        if (this.valiable) {
            this.onPress();
        }
    }
}
window.Button = Button

export class InputUIGroup {
    /**
     * @param {Object} [options]
     * @param {number} [options.curIndex=0] - 현재 선택 인덱스
     * @param {boolean} [options.skipNotAvailableUI=true] - isAvailable가 false인 항목 건너뜀
     */
    constructor(options = {}) {
        this.curIndex = -1;
        this.skipNotAvailableUI = options.skipNotAvailableUI ?? true;
        /** @type {Array<{ui: UIObject|null, keyMap: Object.<string, Function>}>} */
        this.inputObjs = [];
        this.item = null;
        this.valiable = false
    }
    /** UI 오브젝트 배열을 반환한다 */
    get items(){
        return this.inputObjs.map(obj => obj.ui)
    }

    /**
     * UI 항목과 키 맵을 등록한다
     * @param {UIObject|null} ui - isAvailable 체크용 UI 오브젝트 (없으면 null)
     * @param {Object.<string, Function>} keyMap - KeyBind 속성명 → 실행 함수
     * @returns {InputUIGroup}
     */
    addItem(ui, keyMap = {}) {
        this.inputObjs.push({ ui:ui, keyMap });
        ui.inputGroup = this;
        return this;
    }

    /**
     * 그룹을 활성화하고 시작 인덱스를 설정한다
     * @param {number} [startIndex=0]
     */
    enter() {
        if(this.curIndex < 0) this.curIndex = 0
        this.valiable = true
        this.setItem(this.curIndex);
    }

    /** 그룹 비활성화 */
    exit() { 
        this.valiable = false 
    }

    /**
     * 다음/이전 항목으로 인덱스를 이동한다
     * @param {number} [step=1] 1: 다음, -1: 이전
     * @returns {number} 새 curIndex
     */
    nextIndex(step = 1) {
        const len = this.inputObjs.length;
        if (len === 0) return this.curIndex;
        let next = this.curIndex;
        for (let i = 0; i < len; i++) {
            next = ((next + step) % len + len) % len;
            if (!this.skipNotAvailableUI || this.inputObjs[next].ui?.valiable !== false) {
                this.curIndex = next;
                break
            }
        }
        this.setItem(this.curIndex);
    }

    setItem(index){
        if(this.item){
            this.item.ui.toggleHighlight(false)
        }
        this.item = this.inputObjs[index]
        this.item.ui.toggleHighlight(true)
    }

    /** 현재 항목의 키 맵을 기준으로 이번 프레임의 입력을 처리한다 */
    update() {
        if(this.item == null) return
        for (const [keyName, fn] of Object.entries(this.item.keyMap)) {
            if (Input.isPressed(KeyBind[keyName])) {
                fn();
            }
        }
    }
}
window.InputUIGroup = InputUIGroup;

export class GagueBar extends PIXI.Container {
    /**
     * @param {Object} options - 옵션
     * @param {number[]} options.size - 옵션
     * @param {string} options.color - 기본 버튼 스프라이트
     * @param {boolean} options.outLine - 'glow' | 'negative' | 'custom'
     * @param {string} options.background - 'custom' 모드일 때 보여줄 스프라이트
     * @param {string} options.numType - 클릭 시 실행될 함수
     * @param {Point} options.textPos - 클릭 시 실행될 함수
     */
    constructor(options) {
        super(options)
        const {
            size,
            color,
            numType = 'none',
            textPos = {x:0,y:0},
            outLine = true,
            background = 'rgba(255,255,255,0.1)'
        } = options;

        this.barWidth = size[0]
        this.barHeight = size[1]
        this.color = color
        this.numType = numType
        this.textPos = textPos
        this.outLine = outLine
        this.background = background
        this.initGague()
    }

    initGague() {
        this.innerBlack = Img.sprite("rect", 1,this.background,{anchor:{x:0,y:0.5}})

        this.inner = Img.sprite("rect", 1, this.color,{anchor:{x:0,y:1}})

        this.gagueFrame = new Graphics()
        this.setWidthHeight(this.barWidth, this.barHeight)

        this.currValueText = new BitmapText({
            text: "",
            style: Data.styles.gagueText,
            anchor: 0.5,
            position: this.textPos,
            tint: this.color
        })

        this.addChild(this.innerBlack, this.inner, this.gagueFrame, this.currValueText)
    }

    setWidthHeight(w, h) {
        this.barWidth = w
        this.barHeight = h
        this.gagueFrame.clear()
        let s = this.outLine ? 7 : 0
        let s2 = this.outLine ? 4 : 0
        this.gagueFrame.rect(0, -this.barHeight * 0.5, this.barWidth, this.barHeight).stroke({ width: s, color: this.color, alignment: 0 })
        this.gagueFrame.rect(0, -this.barHeight * 0.5, this.barWidth, this.barHeight).stroke({ width: s2, color: 0, alignment: 0 })
        this.innerBlack.scale.set(w, h)
        this.inner.position.y = this.barHeight / 2
        this.inner.scale.set(0)
    }

    update(value, maxValue) {
        const scale = this.barWidth * value / maxValue
        this.inner.scale.set((scale<0) ? 0 : scale, this.barHeight)
        if(this.numType == 'none'){
            this.currValueText.text = ""
        }
        if(this.numType == 'number'){
            this.currValueText.text = `${value}/${maxValue}`
        }
        if(this.numType == 'percent'){
            this.currValueText.text = `${String(Math.floor(value/maxValue*100)).padStart(2,'0')}%`
        }
    }
}
window.GagueBar = GagueBar
