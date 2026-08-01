
export class Routine {
    constructor() {
        this.tag = ""
        this.debugIn = false
        this.debugIngEnded = false
        this.frame = 0
        this.pc = 0
        this.currentLine = 0
        this.repeat = 0
        this.ended = false // 파괴
        this.pause = false
        this.self = null // 실행 오브젝트
        this.route = null
        this.routeAllCleared = false
        this.debugTriggered = false
        this.count = 0 // 마킹용
        this.time = 0
    }

    update() {
        if (this.pause || this.ended) { return }
        this.route(this.self)
        if (this.pc == this.currentLine) {
            this.routeAllCleared = true
        }
        this.pc = 0;
    }

    debugJumpStart() {
        if (!this.debugIngEnded) {
            this.frame = 0
            this.debugIng = true
            this.debugTriggered = true
        }
    }
    debugJumpEnd() {
        if (this.debugIng && !this.debugIngEnded) {
            this.currentLine = this.pc
            this.debugIngEnded = true
            this.debugIng = false
        }
    }
    whenTime(frame) {
        if (this.debugIng) {
            this.pc++; return false
        }
        if (this.pc == this.currentLine) {
            if (this.frame == frame) {
                this.currentLine++
                this.pc++
                this.frame = 0
                return true
            } else {
                this.frame++;
            }
        }
        this.pc++
        return false
    }
    waitIf(boolen) {
        if (this.debugIng) {
            this.pc++; return false
        }
        if (this.pc == this.currentLine) {
            if (boolen) {
                this.currentLine++
                this.pc++
                return true
            }
        }
        this.pc++
        return false
    }
    whileTime(frame = 0, boolen = true) {
        if (this.debugIng) {
            this.pc++; return false
        }
        if (this.pc == this.currentLine) {
            if (!boolen) {
                this.pc++
                this.endWhile()
                return false
            }
            if (this.frame == frame) {
                this.frame = 0
                this.repeat++;
                this.pc++
                return true
            } else {
                this.frame++;
            }
        }
        this.pc++
        return false
    }
    whileFrame(frame){
        this.time = frame
        return this.whileTime(0,this.repeat<frame)
    }
    end() {
        this.ended = true
    }
    $end() {
        if (this.whenTime(0)) {
            this.end()
        }
    }
    endWhile() {
        this.currentLine++
        this.frame = 0;
        this.repeat = 0
    }
    reset() {
        this.frame = 0
        this.currentLine = 0
    }
    die() {
        this.self.die()
        this.ended = true
    }
    $die() {
        if (this.whenTime(0)) {
            this.die()
        }
    }
}
window.Routine = Routine

export const GameObjectBase = Base => class extends Base {
    constructor(args) {
        super(args)
        this.x = args?.position?.x || 0
        this.y = args?.position?.y || 0
        this.radius = 0
        this.hasBeenShowed = false

        // moveDir
        this.speed = 0
        this.dir = 0
        this.delta = pos(0, 0)

        // moveTime
        this.startPos = null
        this.endPos = null
        this.movingTime = 0
        this.easeMode = "linear"

        // moveRotate
        this.rotateSpeed = 0
        this.rotateDist = 0
        this.rotatePoint = null

        //moveVector
        this.vector = posZero

        /** @type {Routine[]} */
        this.routes = []
        /** @type {GameObjectGroup} */
        this.group = null
        this._killed = false

        this.isMoving = false

        this.count = 0 //마킹용
        this.frame = 0
        this.updateObjects = []
    }

    get pos() {
        return { x: this.x, y: this.y }
    }

    addUpdate(...objs){
        this.updateObjects.push(...objs);
    }

    addUpdateIndex(obj, index){
        this.updateObjects.splice(index, 0, obj);
    }

    addChildUpdate(...objs){
        this.addChild(...objs)
        this.updateObjects.push(...objs);
    }

    update() {
        const oldX = this.x
        const oldY = this.y
        const activeRoutes = [...this.routes]
        for (let i = activeRoutes.length - 1; i >= 0; i--) {
            const r = activeRoutes[i];
            if (!this.routes.includes(r)) {
                continue
            }
            r.update?.();
            if (r.ended || r.routeAllCleared) { // 파괴하거나 모든 코드가 실행되면 삭제
                const routeIndex = this.routes.indexOf(r)
                if (routeIndex >= 0) {
                    this.routes.splice(routeIndex, 1);
                }
            }
        }
        this.isMoving = this.x != oldX || this.y != oldY
        for(let obj of this.updateObjects){
            obj.update()
        }
        for(let obj of this.updateObjects){
            obj.lateUpdate?.()
        }
        let w = 0;
        for (let i = 0; i < this.updateObjects.length; i++) {
            if (this.updateObjects[i]._killed) {
                if (this.updateObjects[i].parent) this.updateObjects[i].parent.removeChild(this.updateObjects[i]);
            } else {
                this.updateObjects[w++] = this.updateObjects[i];
            }
        }
        this.updateObjects.length = w;
    }
    /**
     * 
     * @param {string} tag 이 루틴의 태그
     * @param {boolean} instant false이면 루틴 내부에서 end() 호출 시 제거
     */
    endRoutine(tag, instant = true) {
        // 태그 기반 제거
        for (let i = this.routes.length - 1; i >= 0; i--) {
            const r = this.routes[i];
            if (r.tag !== tag) continue;
            if (instant) {
                this.routes.splice(i, 1);
            } else {
                r.end();
            }
        }
    }
    endAllRoutine(instant = true) {
        // 태그 기반 제거
        for (let i = this.routes.length - 1; i >= 0; i--) {
            const r = this.routes[i];
            if (instant) {
                this.routes.splice(i, 1);
            } else {
                r.end();
            }
        }
    }
    hasRoutine(tag) {
        return this.routes.filter(x => x.tag == tag).length > 0
    }
    /**
     * @param {string} tag 루틴 태그
     * @param {function} routeFunc 루틴 함수, this는 Routine 객체, this.self는 루틴을 실행하는 오브젝트
     * @returns {this}
     */
    startRoutine(tag, routeFunc) {
        if(!routeFunc){
            debugger
            console.error("route should be function")
        }
        const r = new Routine();
        r.tag = tag;
        r.self = this
        // 안전 바인딩: route 내부에서 this 를 routeObject 로 사용 가능
        r.route = routeFunc;
        this.routes.push(r);
        return this;  // 필요시 접근 가능
    }
    set(ref, ref2 = null) {
        if (ref2 != undefined) {
            this.x = ref
            this.y = ref2

        } else {
            this.x = ref.x
            this.y = ref.y
        }
    }
    move(ref, ref2) {
        if (ref2 != undefined) {
            this.x += ref
            this.y += ref2
        } else {
            this.x += ref.x
            this.y += ref.y

        }
    }
    die() {
        this._killed = true
    }
    stopMove() {
        this.endRoutine("move", true)
    }
    _moveDir() {
        this.delta = goAngle(posZero, this.dir, this.speed)
        this.move(this.delta)
    }
    MoveDir(dir, speed) {
        this.stopMove()
        this.dir = dir
        this.speed = speed
        this.startRoutine("move", function () {
            if (this.whileTime(0)) {
                this.self._moveDir()
            }
        })
        return this
    }
    MoveDirEase(dir, length, time, ease) {
        this.MoveTime(goAngle(this, dir, length), time, ease)
        return this
    }
    MoveDirSpdEase(dir, startSpd, endSpd, time, ease) {
        this.stopMove()
        this.dir = dir
        this.speed = startSpd
        this.startRoutine("move", function () {
            if (this.whileTime(0)) {
                this.self._moveDir()
                if (this.self.speed != endSpd) {
                    this.self.speed = frameMove(startSpd, endSpd, this.repeat, time, ease)
                }
            }
        })
        return this
    }

    _moveTime(frame) {
        this.set(
            frameMove(this.startPos.x, this.endPos.x, frame, this.movingTime, this.easeMode),
            frameMove(this.startPos.y, this.endPos.y, frame, this.movingTime, this.easeMode)
        )
        if (frame == this.movingTime) {
            this.set(this.endPos.x, this.endPos.y)
            return true
        }
        return false
    }
    MoveTime(end, time, ease) {
        this.stopMove()
        this.startPos = this.pos
        this.endPos = end
        this.movingTime = time
        this.easeMode = ease
        this.startRoutine("move", function (self) {
            if (this.whileTime(0)) {
                let old = self.pos
                if (self._moveTime(this.repeat)){
                    this.endWhile()
                }
                self.dir = lookPoint(old,self.pos)
            }
        })
        return this
    }
    _moveRotate() {
        const dir = lookPoint(this.rotatePoint, this)
        const newDist = Math.max(0, getDist(this.rotatePoint, this) + this.rotateDist)
        this.set(goAngle(this.rotatePoint, dir + this.rotateSpeed, newDist))
        return newDist === 0
        // this.rotatePoint에 도착하면 그 포인트로 위치 조정
    }
    MoveRotate(point, spin, invade) {
        this.stopMove()
        this.rotatePoint = point
        this.rotateSpeed = spin
        this.rotateDist = invade
        this.startRoutine("move", function (self) {
            if (this.whileTime(0)) {
                const oldX = self.x
                const oldY = self.y
                if (self._moveRotate()) this.endWhile()
                const deltaX = self.x - oldX
                const deltaY = self.y - oldY
                self.speed = Math.hypot(deltaX, deltaY)
                self.dir = (Math.atan2(deltaY, deltaX) * 180 / Math.PI + 360) % 360
            }
        })
        return this
    }
    MoveVector(vector){
        this.stopMove()
        this.vector = vector
        this.startRoutine("move", function (self) {
            if (this.whileTime(0)) {
                self.dir = lookPoint(self,posAdd(self,self.vector))
                self.x += self.vector.x
                self.y += self.vector.y
            }
        })
        return this
    }
    SetValueObj(object, key, endV, time, ease){
        // endV가 길이2의 배열이면 startV,endV로 분리, 아니면 startV는 현재값, endV는 인자로 받는 값으로
        const obj = object
        const startV = (Array.isArray(endV) && endV.length === 2) ? endV[0] : obj[key];
        const end = (Array.isArray(endV) && endV.length === 2) ? endV[1] : endV;
        this.startRoutine("setvalue", function (self) {
            if (this.whileFrame(time)) {
                obj[key] = frameMove(startV, end, this.repeat, time, ease)
            }
        })
        return this
    }
    SetValue(key, endV, time, ease){
        // endV가 길이2의 배열이면 startV,endV로 분리, 아니면 startV는 현재값, endV는 인자로 받는 값으로
        const startV = (Array.isArray(endV) && endV.length === 2) ? endV[0] : this[key];
        endV = (Array.isArray(endV) && endV.length === 2) ? endV[1] : endV;
        this[key] = startV
        this.startRoutine("setvalue", function (self) {
            if (this.whileFrame(time)) {
                self[key] = frameMove(startV, endV, this.repeat, time, ease)
            }
        })
        return this
    }
    MoveValue(key, speed, time){
        this.startRoutine("setvalue", function (self) {
            if (this.whileFrame(time)) {
                self[key] += speed
            }
        })
        return this
    }
    RunFuncByFrame(func, time, ease){
        this.startRoutine("runFunc", function (self) {
            if (this.whileFrame(time)) {
                func.bind(self,frameMove(0,1,this.repeat,time,ease))
            }
        })
        return this
    }
    outofWindow(){
        const p = this.getGlobalPosition();
        const r = this.radius + Math.max(this.width,this.height);

        return (
            p.x + r < 0 ||
            p.x - r > app.screen.width ||
            p.y + r < 0 ||
            p.y - r > app.screen.height
        );
    }
}

class GameObjectCore extends PIXI.Container { }

export class GameObject extends GameObjectBase(GameObjectCore) {
    constructor(prop) {
        super(prop)
    }

}
window.GameObject = GameObject

class TextObjectCore extends PIXI.Text { }

export class TextObject extends GameObjectBase(TextObjectCore) {
    constructor(prop) {
        super(prop)
    }
}
window.TextObject = TextObject

// 오브젝트 자동 업데이트
export class GameObjectGroup extends Array {

    push(obj) {
        obj.group = this
        super.push(obj)
    }

    update() {
        for (let obj of this) {
            if (obj._killed) { continue }
            obj.update();
        }
    }

    lateUpdate() { // 죽은 오브젝트 삭제
        let w = 0;
        for (let i = 0; i < this.length; i++) {
            if (this[i]._killed) {
                if (this[i].parent) this[i].parent.removeChild(this[i]);
            } else {
                this[w++] = this[i];
            }
        }
        this.length = w;
    }
}
window.GameObjectGroup = GameObjectGroup

// context 그래픽
export class BitmapGraphic extends PIXI.Graphics {

    drawRect(x, y, width, height, color = 0xffffff) {
        const ctx = this.context;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    }

    strokeRect(x, y, width, height, lineWidth = 2, color = 0xffffff) {
        const ctx = this.context;
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(x, y, width, height);
    }

    blt(texture, sx, sy, sw, sh, dx, dy, dw, dh) {
        const ctx = this.context;
        ctx.drawImage(texture.baseTexture.resource.source, sx, sy, sw, sh, dx, dy, dw, dh);
    }

    drawLine(x1, y1, x2, y2, width = 2, color = 0xffffff) {
        const ctx = this.context;
        ctx.stroke({
            width,
            color,
            // cap: 'round'/
        });

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    drawArc(radius, startDir, endDir, stroke) {
        const ctx = this.context;

        // degree → radian
        const toRad = d => d * Math.PI / 180;

        const s = toRad(startDir);
        const e = toRad(endDir);

        ctx.save();

        /* ===== 0) 배경 원 (흐릿한 회색) ===== */
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        /* ===== 1) 부채꼴 채우기 (흰색) ===== */
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, s, e, false);
        ctx.closePath();
        ctx.fill();

        /* ===== 2) 외곽 원 stroke (흰색, 보정 없음) ===== */
        ctx.stroke({
            width: stroke,
            color: "#ffffff"
        });
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();

        return this;
    }

    drawDashedCircle(x, y, r, dashCount = 12, gap = 20, width = 4, color = 0xffffff) {
        const ctx = this.context;

        const circumference = Math.PI * 2 * r;

        // gap(빈칸 길이)은 사용자가 직접 조절
        // dashLength(그려지는 길이)는 자동 계산
        const dashLength = (circumference - (gap * dashCount)) / dashCount;

        const total = dashLength + gap;

        for (let i = 0; i < dashCount; i++) {
            const a1 = (i * total) / r;
            const a2 = a1 + dashLength / r;

            ctx.beginPath();
            ctx.arc(x, y, r, a1, a2);
            ctx.stroke({ width, color });
        }
    }

    drawCircleGague(r, color, value, maxValue) {
        const ctx = this.context;
        const ratio = Math.max(0, Math.min(1, value / maxValue));

        // 게이지 각도
        const start = -Math.PI / 2; // 위쪽 기준
        const end = start + (Math.PI * 2 * ratio);

        // 기존 도형 삭제
        ctx.clear();

        // stroke 스타일 설정
        ctx.stroke({
            width: r,
            color: color
        });

        // 경로 시작
        ctx.beginPath();
        ctx.arc(0, 0, r, start, end);

        // 그리기
        ctx.stroke();
    }


    update() { }

    clear() {
        this.context.clear();
    }
}
window.BitmapGraphic = BitmapGraphic

export class Bitmap extends PIXI.Sprite{
    constructor(props) {
        super(props)
        this.canvas = document.createElement("canvas");
        this.canvas.width = props.width;
        this.canvas.height = props.height;

        this.context = this.canvas.getContext("2d");
        this._initTexture();
    }

    _initTexture() {
        this.texture = PIXI.Texture.from(this.canvas);
        this._lastTextureId = this.texture.uid;
    }

    _ensureTexture() {
        this._initTexture();
    }

    clear(){
        this._ensureTexture();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.texture.update();
    }

    drawRect(x, y, width, height, color = 0xffffff) {
        this._ensureTexture();
        const ctx = this.context;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
        this._updateTexture();
    }

    strokeRect(x, y, width, height, lineWidth = 2, color = 0xffffff) {
        this._ensureTexture();
        const ctx = this.context;
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(x, y, width, height);
        this._updateTexture();
    }

    blt(texture, sx, sy, sw, sh, dx, dy, dw, dh) {
        this._ensureTexture();
        const source = texture.source.resource;

        dw = dw || sw;
        dh = dh || sh;

        this.context.drawImage(
            source,
            sx+texture.frame.x, sy+texture.frame.y, sw, sh,
            dx, dy, dw, dh
        );

        this._updateTexture();
    }

    drawCircle(x,y,radius,color,startAngle=0, endAngle=360){
        this._ensureTexture();
        const ctx = this.context;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, radian(startAngle), radian(endAngle));
        ctx.closePath();
        ctx.fill();
        this._updateTexture();
    }

    strokeCircle(x,y,radius,lineWidth=2,color,startAngle=0, endAngle=360){
        this._ensureTexture();
        const ctx = this.context;
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.arc(x, y, radius, radian(startAngle), radian(endAngle));
        ctx.stroke();
        this._updateTexture();
    }


    _updateTexture() {
        if (!this.texture) return;
        
        // BaseTexture 동기화
        if (this.texture.baseTexture) {
            this.texture.baseTexture.update();
        }
        
        // Texture 자체 업데이트
        this.texture.update();
        
        // PIXI 렌더러에 변경 알림
        if (this.texture.source) {
            this.texture.source.update();
        }
    }
}
window.Bitmap = Bitmap

// 언어별 폰트 자동변경 클래스
export class LangTextStyle extends PIXI.TextStyle {
    constructor(style) {
        super(style)
        if (!style.langId) {
            throw new Error("Missing Attribute: LangId is undefined!");
        }
        this.langId = style.langId
    }
}
window.LangTextStyle = LangTextStyle

// 씬 오브젝트
export class SceneObject extends GameObject {
    constructor() {
        super()
        this.visible = false
        this.exitHide = false
        /** @type {typeof import("./uiObject").InputUIGroup} */
        this.inputGroup = null
        Scene.addScene(this)
    }

    setInputGroup(group) {
        this.inputGroup?.exit();
        this.inputGroup = group;
        if(this.inputGroup == null) return
        // for(let obj of this.inputGroup.items){
        //     obj.toggleValiable(true)
        // }
        this.inputGroup.enter();
    }

    init() { }
    lateUpdate() { }
    update(){
        if(this.inputGroup){
            this.inputGroup.update()
        }
        
        super.update()
    }
    enter() { }
}
window.SceneObject = SceneObject

// 효과 오브젝트
export class EffectObject extends GameObject {
    constructor(eft, pos, option) {
        super()
        this.efc = eft
        this.op = option
        this.set(pos)
        eft.init.call(this)
        this.startRoutine("effect", eft.update)
    }
    update(){
        super.update()
        if(this.outofWindow()){
            this.die()
        }
    }
}
window.EffectObject = EffectObject

// 3d 배경 세그먼트
export class BGSegment {
    constructor(obj) {
        this.name = obj.name;
        this.xStart = 0;
        this.xEnd = 0;
        this.segLen = obj.segLen;
        this.group = new THREE.Group();
        this.deco = new THREE.Group();
        this.group.add(this.deco);
        this._init = obj.init.bind(this);
        this._respawn = obj.respawn?.bind(this);
        this._init();
        this.hide();
        this.materials = []
        // 초기에는 숨김    
    }
    show() {
        this.group.visible = true;
    }
    hide() {
        this.group.visible = false;
    }
    setPosition(x) {
        this.group.position.x = x;
        this.xStart = x;
        this.xEnd = x + this.segLen;
    }
}
window.BGSegment = BGSegment


Object.defineProperties(PIXI.Rectangle.prototype, {
    centerX: {
        get() {
            return this.left + this.width * 0.5;
        }
    },
    centerY: {
        get() {
            return this.top + this.height * 0.5
        }
    }
});

window.Sprite = PIXI.Sprite;
window.Text = PIXI.Text;
window.Texture = PIXI.Texture;
window.Container = PIXI.Container;
window.Graphics = PIXI.Graphics;
window.Color = PIXI.Color;
window.BitmapText = PIXI.BitmapText
window.TextStyle = PIXI.TextStyle
window.Rectangle = PIXI.Rectangle
window.AnimatedSprite = PIXI.AnimatedSprite
