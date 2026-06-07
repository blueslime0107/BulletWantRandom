
export class StageRoutine extends Routine {

    bullet(pos, dir, speed) {
        return gm.spawnBullet(pos, dir, speed)
    }

    enemy(pos){
        return gm.spawnEnemy(pos, 180, 1)
    }

    bossAppear(pos,enemy){
        gm.spawnBoss(pos,enemy)
    }

    bossActivate(spell,time=0,final=0,wait=true){
        if(this.whenTime(time)){
            gm.activeBoss(spell)
            gm.boss.finalMode = final
            if(spell.name){ 
                gm.spawnEffect(EFC.spellAlert,gm.efcLayer3,posZero,{spell:spell.name})
                gm.spawnEffect(EFC.spellBG,gm.efcLayer1,posZero,{profile:spell.spellProfile})
                gm.spawnEffect(EFC.spellStand,gm.efcLayer2,posZero,{texture:spell.spellProfile})
                gm.spellCount--;
                gm.ui.updateBossSpells(gm.ui.spellCount-1)
            }
        }
        if(wait){
            this.waitIf(gm.boss && gm.boss.health <= 0)
        }
    }

    clearAll(){
        gm.killAll() 
        gm.killEffect(EFC.spellBG)
    }

    dialogStart(){
        if(this.whenTime(0)){
            gm.dialog.startDialog()
        }  
    }
    addStand(char,side){
        if(this.whenTime(0)){
            gm.dialog.addStand(char,side)
        }  
    }
    dialog(char, feel, text){
        if(this.whenTime(1)){
        gm.dialog.dialog(char, feel, text)
        }  
        this.waitIf(Input.isPressed(KeyBind.OK))
    }
    dialogEnd(){
        if(this.whenTime(0)){
            gm.dialog.endDialog()
        }
    }
}

export class ShotObject extends GameObject {
    constructor() {
        super()
        this.showed = false
        this.valiable = true
        this.vars = [0]
    }

    setVar(...vars) {
        this.vars = [...vars]
        return this
    }

    kill(){
        this.valiable = false
    }

    onceShowAndOffScreen() {
        if (this.outOfScreen()) {
            if(!this.showed){
                return false
            }else{
                return true
            }
        }else{
            this.showed = true
            return false
        }
    }

    outOfScreen = function () {
        return this.x + this.width < 0 || this.x - this.width > GS || this.y + this.height < 0 || this.y - this.height > GS
    }
}

class Enemy extends ShotObject {
    constructor(){
        super()
        this.darkAura = this.addChild(Img.sprite('gradiusCircle', 92, 'rgba(0, 0, 0, 0.43)'))
        this.baseSprite = new Sprite({anchor:0.5,scale:2})
        if(gm.showHitCircle) {
            this.baseSprite.addChild(Img.sprite('circle', this.radius, 'rgb(30, 255, 0)'))
        }
        this.addChild(this.baseSprite)

        this.health = 0

        this.animationRate = 6
        this.oldX = 0
        this.textureFrame = 0
        this.textureIndex = 0
        this.texture = null
        this.spriteState = "idle"
        this.pendingState = null
        this.isFadeTransition = false
        this.fadeIndex = 0
    }

    applyEnemyData(enemy){
        const data = EData[enemy]
        this.radius = data.radius
        if(gm.showHitCircle) {
            this.baseSprite.removeChildren()
            this.baseSprite.addChild(Img.sprite('circle', this.radius, 'rgb(30, 255, 0)'))
        }
        this.texture = Textures[data.texture]
        this.idleFrame = data.idleFrame
        this.moveFrame = data.moveFrame
        this.fadeFrame = data.fadeFrame
        this.spcialFrame = data.special
        this.textureFrame = 0
        this.textureIndex = 0
        this.spriteState = "idle"
        this.pendingState = null
        this.isFadeTransition = false
        this.fadeIndex = 0
        if(this.idleFrame && this.idleFrame.length > 0){
            this.baseSprite.texture = this.texture[this.idleFrame[0]]
        }
    }

    activeSpell(spell){
        this.health = spell.health
        this.spell = spell
        this.startRoutine("spell",spell.spell)
    }

    damage(count){
        this.health -= count
        if(this.health <= 0){
            this.kill()
        }
    }

    updateSprite(){
        let state = "idle"
        if(this.oldX < this.x){
            state = "right"
        }else if(this.oldX > this.x){
            state = "left"
        }

        const absScaleX = Math.abs(this.baseSprite.scale.x)
        if(state == "left"){
            this.baseSprite.scale.x = -absScaleX
        }else if(state == "right"){
            this.baseSprite.scale.x = absScaleX
        }

        this.textureFrame++
        if(this.animationRate > this.textureFrame){
            return
        }
        this.textureFrame = 0

        if(this.isFadeTransition){
            if(!this.fadeFrame || this.fadeFrame.length == 0){
                this.isFadeTransition = false
                this.spriteState = this.pendingState || this.spriteState
                this.pendingState = null
                this.textureIndex = 0
            }else{
                this.baseSprite.texture = this.texture[this.fadeFrame[this.fadeIndex]]
                this.fadeIndex++
                if(this.fadeIndex >= this.fadeFrame.length){
                    this.isFadeTransition = false
                    this.spriteState = this.pendingState || this.spriteState
                    this.pendingState = null
                    this.textureIndex = 0
                }
                return
            }
        }

        if(state != this.spriteState){
            if(this.fadeFrame && this.fadeFrame.length > 0){
                this.pendingState = state
                this.isFadeTransition = true
                this.fadeIndex = 0
                this.baseSprite.texture = this.texture[this.fadeFrame[this.fadeIndex]]
                this.fadeIndex++
                if(this.fadeIndex >= this.fadeFrame.length){
                    this.isFadeTransition = false
                    this.spriteState = this.pendingState
                    this.pendingState = null
                    this.textureIndex = 0
                }
                return
            }
            this.spriteState = state
            this.textureIndex = 0
        }

        const frameList = ((this.spriteState == "left" || this.spriteState == "right") && this.moveFrame && this.moveFrame.length > 0)
            ? this.moveFrame
            : (this.idleFrame && this.idleFrame.length > 0 ? this.idleFrame : [])
        if(frameList.length == 0){
            return
        }
        this.baseSprite.texture = this.texture[frameList[this.textureIndex]]
        this.textureIndex = (this.textureIndex + 1) % frameList.length
    }

    update(){
        this.oldX = this.x
        super.update()
        this.updateSprite()
        if(this.onceShowAndOffScreen()){
            this.die()
        }
    }

    kill(){
        super.kill()
        this.endAllRoutine()
        gm.spawnEffect(EFC.enemyBlast,gm.gameLayer,this)
        // gm.spawnItem(this,"point")
        Am.playSFX("eDead")
        this.die()
    }
}

class Boss extends Enemy {

    constructor(){
        super()
        this.finalMode = 0
        this.healthMax = 0
        this._sin = 0
        this._specialMoving = false
    }

    kill(){
        console.log("kill")
        this.setHealth(0)
        this.endAllRoutine()
        if(this.finalMode == 0){
            gm.killAll() 
            gm.killEffect(EFC.spellBG)
            Am.playSFX("eDead")
        }
        if(this.finalMode == 1){
            gm.spawnEffect(EFC.bossBlast,gm.playLayer,gm.boss,{color:'rgb(255, 255, 255)'})
            Am.playSFX("bossDead")
            this.final()
            gm.killAll() 
        }
        if(this.finalMode == 2){
            this.startRoutine('death',function(self){
                if (this.whenTime(0)) { 
                    self.MoveDir(getRandom(0,360),1)
                    gm.player.godMode = true
                    gm.spawnEffect(EFC.bossBlast,gm.playLayer,self,{color:'rgb(255, 255, 255)'})
                    Am.playSFX("bossDead")
                }
                if(this.whenTime(60)){
                    gm.spawnEffect(EFC.bossBlast,gm.playLayer,self,{color:'rgb(0, 84, 180)'})
                    Am.playSFX("bossDead")
                    self.final()
                    gm.killAll() 
                    gm.killEffect(EFC.spellBG)
                }
            })
        }
    } // 비우기

    final(){
        gm.spawnEffect(EFC.enemyBlast,gm.gameLayer,this)
        gm.spawnItem(this,"point")
        gm.ui.bossBottomAlert.visible = false
        gm.ui.bossName.text = ""
        Am.playSFX("eDead")
        this.die()
    }

    activeSpell(spell){
        super.activeSpell(spell)
        this.setHealth(spell.health)
        gm.startTimer(spell.timer)
        gm.ui.updateBossHealth()
    }

    setHealth(value){
        this.healthMax = value
        this.health = value
        gm.ui.updateBossHealth()
    }
    
    damage(count){
        if(this.health <= 0){return}
        this.health = Math.max(0,this.health - count)
        if(this.health <= 0){
            this.kill()
        }
        gm.ui.updateBossHealth()
    }

    haveBorder(left,right,top,bottom){
        this.x = Math.max(left, Math.min(right, this.x))
        this.y = Math.max(top, Math.min(bottom, this.y))
    }

    update(){
        if(!this.isMoving){
            this.baseSprite.y = Math.sin(this._sin*Math.PI/180)*4
            this._sin+=5
        }else{this._sin = 0; this.baseSprite.y = 0}
        super.update()
    }

    spcialMove(index){
        this._specialMoving = true
        this.baseSprite.texture = this.texture[this.spcialFrame[index]]
    }

    updateSprite(){
        if(this.isMoving){this._specialMoving = false}
        if(this._specialMoving){return}
        super.updateSprite()
    }
}

class Bullet extends ShotObject {
    constructor() {
        super()
        this.baseSprite = new Sprite({
            anchor: 0.5,
            scale:2
        })

        this.data = null
        this.shape = 0
        this.color = 0
        this.spinMode = 0

        this.noDamage = false

        this.autoDie = {
            outScreen: true
        }

        this.addChild(this.baseSprite)

        if(gm.showHitCircle) {
            this.hitCircleSprite = Img.sprite('circle', this.radius, 'rgb(255, 0, 0)')
            this.baseSprite.addChild(this.hitCircleSprite)
        }
    }

    /** 
     * option = {
     *   outScreen: true/false (화면 밖에서 자동으로 제거 여부, 기본값: true)
     *        outScreenCount: n (화면 밖에서 제거까지 허용할 프레임 수, 기본값: 0)
     */
    setAutoDie(option){
        this.autoDie = {
            ...this.autoDie,
            ...option
        }
        return this
    }

    setScale(value){
        this.baseSprite.scale.set(value+1)
        this.radius = this.data.radius + value*0.5
        if(gm.showHitCircle) {
            this.hitCircleSprite.scale.set(this.radius / 128)
        }
    }

    setBullet(data,color){
        this.data = data
        this.radius = data.radius
        this.spinMode = data.spinMode
        this.zIndex = data.z
        this.baseSprite.anchor.set(0.5)
        this.baseSprite.texture = Textures[data.texture][color]
        this.shape = data.name
        this.color = color
        if(gm.showHitCircle) {
            this.hitCircleSprite.scale.set(this.radius / 128) // 히트박스 원 크기에 맞게 조정
        }
        if(this.shape == "arrow"){
            this.baseSprite.anchor.set(0.5,0.25)
        }
    }

    update() {
        super.update()
        if(!this.valiable){
            return
        }
        if(this.autoDie.outScreen && this.onceShowAndOffScreen()){
            this.die()
        }
        if(!this.noDamage && collideCircle(this, gm.player)){
            gm.player.damage()
        }
        if(this.spinMode == 1){
            this.angle = this.dir+90
        }
        if(this.spinMode == 2){
            this.angle+=2
        }
    }

    kill(){
        super.kill()
        this.endAllRoutine()
        this.startRoutine("die",function(self){
            if(this.whileFrame(20)){
                self.scale.x = frameMove(1,1.5,this.repeat,20,Easing.easeOutSine)
                self.scale.y = frameMove(1,1.5,this.repeat,20,Easing.easeOutSine)
                self.alpha = frameMove(1,0,this.repeat,20,Easing.easeOutSine)
            }
            if(this.whenTime(0)){self.die()}
        })
    }
}

class Lazer extends GameObject {
    constructor(data = {shape,color,startPos,endPos,guideTime,atkTime}){
        super()
        this.bullets = []
        this.startPos = data.startPos
        this.endPos = data.endPos
        this.shape = null
        this.color = data.color
        
        this.guideTime = data.guideTime || 0
        this.atkTime = data.atkTime || 60
        this.attacking = false

        
        this.lazerPoints = [new PIXI.Point(this.x, this.y), new PIXI.Point(this.x, this.y)]
        this.lazerWidth = 4
        this.lazerMesh = new PIXI.MeshRope({
            texture: PIXI.Texture.EMPTY,
            points: this.lazerPoints,
            textureScale: 0,
            blendMode: 'add'
        })
        this.setLazer(data.shape,data.color)
        // _render가 매 프레임 _width를 texture.height로 덮어쓰므로 onRender 교체
        this.lazerMesh.onRender = () => {
            this.lazerMesh.geometry._width = this.lazerWidth
            this.lazerMesh.geometry.update()
        }
        this.lazerMesh.alpha = 0.9
        this.lazerMesh.visible = false
        gm.bulletLayer.addChild(this.lazerMesh)
        this.lazerFrame = 0

        this.spawnEffectSprite = new Sprite({
            texture: Img.texture.bulletSpawn[this.color],
            anchor: 0.5,
            scale: 0,
            position: this.startPos
        })
        gm.efcLayer3.addChild(this.spawnEffectSprite)

        this.length = getDist(this.startPos,this.endPos)
        this.dir = lookPoint(this.startPos,this.endPos)
        this.initBullet()
    }
    setDir(value){
        this.dir = value
        this.endPos = goAngle(this.startPos,this.dir,this.length)
    }
    setWidth(value){
        this.lazerWidth = 4 + 36 * value
    }
    setLazer(data,color){
        const bt = Textures[data.texture][color]
        const frame = bt.frame.clone()
        frame.y += 1
        frame.height -= 2
        this.lazerMesh.texture = new PIXI.Texture({ 
            source: bt.source, 
            frame: frame, 
            rotate: 2 
        })
        this.shape = data
        this.color = color
    }
    spBullet(){
        const bullet = gm.spawnBullet(BData.circle,6,this.startPos,0,0)
        bullet.setAutoDie({outScreen:false})
        bullet.baseSprite.visible = false
        // bullet.baseSprite.alpha = 0.2
        bullet.noDamage = true
        this.bullets.push(bullet)
        return bullet
    }
    initBullet(){
        let count = 0
        while(count < this.length){
            const bullet = this.spBullet()
            bullet.count = count // 이동
            count += 30
            bullet.set(lerpPos(this.startPos,this.endPos,bullet.count/this.length))
        }
    }
    replaceBullet(){
        for(let bullet of this.bullets){
            bullet.set(lerpPos(this.startPos,this.endPos,bullet.count/this.length))
        }
    }
    update(){
        super.update()
        this.spBullet()

        this.spawnEffectSprite.angle += 25
        this.spawnEffectSprite.position.set(this.startPos.x,this.startPos.y)
        
        this.bullets = this.bullets.filter(bullet => bullet.valiable && !bullet._killed)
        const count = this.bullets.length
        if(count < 2){
            this.lazerMesh.visible = false
        }else{
            // 포인트 수가 바뀌면 버퍼 재할당 (_build 필수)
            if(this.lazerPoints.length !== count){
                this.lazerPoints = Array.from({ length: count }, () => new PIXI.Point())
                this.lazerMesh.geometry.points = this.lazerPoints
                this.lazerMesh.geometry._width = this.lazerWidth
                this.lazerMesh.geometry._build()
            }

            for(let i = 0; i < count; i++){
                const bullet = this.bullets[i]
                if(!bullet.valiable){continue}
                const point = this.lazerPoints[i]
                point.x = bullet.x
                point.y = bullet.y
            }
            this.lazerMesh.visible = true
        }

        for(let i=0;i<this.bullets.length;i++){
            const bullet = this.bullets[i]
            bullet.noDamage = !this.attacking
            bullet.count+=30 // 이동
            const value = bullet.count/this.length
            if(value > 1){bullet.die(); this.bullets.splice(i, 1); i--; continue;}
            bullet.set(lerpPos(this.startPos,this.endPos,value))
        }

        this.updateGuideAtk()
    }
    updateGuideAtk(){
        this.lazerFrame++
        const guideEnd = this.guideTime
        const atkEnd = guideEnd + this.atkTime
        if(this.lazerFrame <= guideEnd){
            if(this.lazerFrame <= 10) this.spawnEffectSprite.scale.set(this.lazerFrame/10*3)
            // 가이드 구간: 가늘게 유지
        }else if(this.lazerFrame <= guideEnd + 10){
            this.attacking = true
            // 가이드 끝 → 1초(60프레임) 동안 width 키우기
            this.setWidth(frameMove(0, 1, this.lazerFrame - guideEnd, 10, Easing.easeOutSine))
        }else if(this.lazerFrame <= atkEnd){
            // 공격 유지 구간
            this.setWidth(1)
        }else if(this.lazerFrame <= atkEnd + 10){
            this.attacking = false
            // 공격 끝 → 1초(60프레임) 동안 width 줄이기
            this.spawnEffectSprite.scale.set(3-(this.lazerFrame - atkEnd)/10*3)
            this.setWidth(frameMove(1, 0, this.lazerFrame - atkEnd, 10, Easing.easeInSine))
        }else{
            // 줄이기 완료 → kill
            this.kill()
        }
    }


    kill(){
        this.lazerMesh.destroy()
        this.spawnEffectSprite.destroy()
        for(let i=0;i<this.bullets.length;i++){
            const bullet = this.bullets[i]
            bullet.die();
        }
        this.die()
    }
}

class BentLazer extends ShotObject {
    constructor(pos, color, length, width) {
        super()
        this.set(pos.x, pos.y)
        this.startPos = pos

        this.bullets = []
        this.color = color
        this.length = length
        this._frame = 0
        this.posHistory = []
        this.initMesh(width)
    }

    initMesh(width){
        this.lazerPoints = [new PIXI.Point(this.x, this.y), new PIXI.Point(this.x, this.y)]
        this.lazerWidth = width + 24
        this.lazerMesh = new PIXI.MeshRope({
            texture: Textures.bulletBentLazer[this.color],
            points: this.lazerPoints,
            textureScale: 0,
            blendMode: 'add'
        })
        // _render가 매 프레임 _width를 texture.height로 덮어쓰므로 onRender 교체
        this.lazerMesh.onRender = () => {
            this.lazerMesh.geometry._width = this.lazerWidth
            this.lazerMesh.geometry.update()
        }
        // this.lazerMesh.alpha = 0.9/
        // this.lazerMesh.visible = false
        gm.bulletLayer.addChild(this.lazerMesh)
    }

    setScale(scale){
        this.lazerWidth = scale
    }

    setLazerRoutine(func){
        this.lazerRoutine = func
    }

    update(){
        super.update()

        this.posHistory.push(this.pos)
        if(this.posHistory.length > this.length){
            this.posHistory.shift()
        }

        if(this._frame < this.length){
            const bullet = gm.spawnBullet(BData.circle,this.color,this.startPos)
            bullet.baseSprite.visible = false
            this.bullets.push(bullet)
            this._frame++
        }

        // 이미 제거된 탄은 연결 목록에서 제외
        this.bullets = this.bullets.filter(bullet => !bullet._killed)
        while(this.bullets.length > this.posHistory.length){
            this.bullets.shift().die()
        }

        for(let i = 0; i < this.bullets.length; i++){
            const bullet = this.bullets[i]
            const targetPos = this.posHistory[i]
            bullet.set(targetPos)
        }

        const count = this.bullets.length
        if(count < 2){
            this.lazerMesh.visible = false
        }else{
            // 포인트 수가 바뀌면 버퍼 재할당 (_build 필수)
            if(this.lazerPoints.length !== count){
                this.lazerPoints = Array.from({ length: count }, () => new PIXI.Point())
                this.lazerMesh.geometry.points = this.lazerPoints
                this.lazerMesh.geometry._width = this.lazerWidth
                this.lazerMesh.geometry._build()
            }

            for(let i = 0; i < count; i++){
                const bullet = this.bullets[i]
                const point = this.lazerPoints[i]
                point.x = bullet.x
                point.y = bullet.y
            }
            this.lazerMesh.visible = true
        }

        if(this._frame >= this.length && this.bullets.length == 0){
            this.die()
        }
    }

    die(){
        if(this.lazerMesh && this.lazerMesh.parent){
            this.lazerMesh.parent.removeChild(this.lazerMesh)
        }
        this.lazerMesh = null
        super.die()
    }

    kill(){
        this._frame = this.length
        for(let i = 0; i < this.bullets.length; i++){
            this.bullets[i].die()
        }
        this.bullets.length = 0
        this.posHistory.length = 0
        this.die()
    }
}

class PlayerShot extends ShotObject {
    constructor(data) {
        super()
        this.zIndex = -1
        this.baseSprite = new Sprite(data.sprite)
        this.radius = data.radius
        if(gm.showHitCircle){
            this.baseSprite.addChild(Img.sprite('circle', this.radius, 'rgb(30, 255, 0)'))
        }
        this.addChild(this.baseSprite)
    }

    update(){
        if(!this.valiable){
            this.scale.x += 1
            this.scale.y += 1
            this.alpha -= 4/10
            if(this.alpha <= 0){
                this.die()
            }
            return
        }
        super.update()

        if(this.onceShowAndOffScreen()){
            this.die()
        }
        for(let i=0;i<gm.enemys.length;i++){
            const enemy = gm.enemys[i]
            if(!enemy.valiable){return}
            if(collideCircle(this,enemy)){
                enemy.damage(1)
                this.kill()
            }
        }
    }
}

class PlayerOption extends GameObject {
    constructor() {
        super()
        this.baseSprite = new Sprite({
            texture: Textures.playerOption,
            anchor: 0.5,
            scale: 2
        })
        this.fullPSprite = new Sprite({
            texture: Textures.playerOption,
            anchor: 0.5,
            scale: 2.5,
            alpha: 0.3
        })
        this.addChild(this.fullPSprite)  
        this.addChild(this.baseSprite)  
    }

    update(){
        super.update()
        this.baseSprite.angle -= 8
        this.fullPSprite.angle += 8
    }
}

class Item extends GameObject {
    constructor(pos,type){
        super()
        this.type = type
        this.radius = 12
        let tex = 'itemPoint'
        if(type == "bomb"){tex = 'itemBombPiece'}
        this.baseSprite = new Sprite({
            texture: Img.texture[tex],
            anchor: 0.5,
            scale: 2
        })
        this.addChild(this.baseSprite)
        this.set(pos)
        this.grav = -5
        this.magnified = false
        this.SetValue("rotation",radian(360),30,Easing.linear)
    }

    update(){
        super.update()
        if(this.grav < 3){
            this.grav += 0.1
        }
        if(this.magnified){
            this.move(goAngle(posZero,lookPoint(this,gm.player),12))
        }else{
            this.y += this.grav
        }
        if(collideCircle(this, gm.player)){
            this.collected()
            this.die()
        }
        if(!this.magnified && (collideCircle(this, gm.player, 100) || gm.player.y < gm.player.itemgetline)){
            this.magnified = true
        }
        if(this.y > GS+10){
            this.die()
        }
    }

    collected(){
        Am.playSFX("item")
    }
}

class Player extends GameObject {
    constructor() {
        super()
        this.radius = 12
        this.speed = 10
        this.borderOffset = 8
        this.itemgetline = 250

        // this.darkCircle = Img.sprite('gradiusCircle', 128, 'rgb(0, 36, 77)')
        // this.addChild(this.darkCircle)

        this.baseSprite = new Sprite({
            texture: Textures.playerIdle[0],
            anchor: 0.5,
            scale:2
        })
        this.addChild(this.baseSprite)

        this.hitSprite = Img.sprite('circle', this.radius, 'rgb(255, 0, 0)')
        this.addChild(this.hitSprite)


        this.options = new GameObjectGroup()
        this.addUpdate(this.options)
        for(let i=0;i<4;i++){
            const option = new PlayerOption()
            option.startRoutine("option",function(self){
                if(this.whenTime(0)){
                    self.MoveTime(goAngle(posZero,i*80-210,70),20,Easing.easeOutSine)
                }
            })
            this.options.addObject(option)
            this.addChild(option)
        }

        
        this.shots = new GameObjectGroup()
        this.addUpdate(this.shots)

        // 스프라이트 애니메이션 관련 변수
        this.spriteIndex = 0
        this.spriteCount = 0
        this.spriteDelay = 2
        this.spriteState = 'idle'
        this.transitioning = false
        this.pendingState = null

        this.reset()
    }

    reset(){
        this.position.set(GS * 0.5, GS * 0.75)
        this.shotSubDelay = 4
        this.shotMainDelay = 2
        this.shotCount = 0
        this.godMode = false
        this.shotAble = true
        this.blockMove = false
    }


    update() {
        super.update()
        this.updateMove()
        this.updateOptions()
        this.updateShots()
        this.updateSprite()
    }

    updateMove(){
        if(this.blockMove){return}
        let inputX = 0
        let inputY = 0
        if (Input.isDown(KeyBind.LEFT)) inputX -= 1
        if (Input.isDown(KeyBind.RIGHT)) inputX += 1
        if (Input.isDown(KeyBind.UP)) inputY -= 1
        if (Input.isDown(KeyBind.DOWN)) inputY += 1
        const length = Math.sqrt(inputX * inputX + inputY * inputY)
        if (length > 0) {
            inputX /= length
            inputY /= length
        }
        let speed = (Input.isDown(KeyBind.SLOW)) ? this.speed * 0.5 : this.speed
        this.x += inputX * speed
        this.y += inputY * speed

        if (this.x < 0 + this.radius + this.borderOffset) this.x = 0 + this.radius + this.borderOffset
        if (this.x > GS - this.radius - this.borderOffset) this.x = GS - this.radius - this.borderOffset
        if (this.y < 0 + this.radius + this.borderOffset) this.y = 0 + this.radius + this.borderOffset
        if (this.y > GS - this.radius - this.borderOffset) this.y = GS - this.radius - this.borderOffset
    }

    updateOptions(){
        if(Input.isReleased(KeyBind.SLOW)){
            for(let i=0;i<this.options.length;i++){
                const option = this.options[i]
                option.MoveTime(goAngle(posZero,i*80-210,100),20,Easing.easeOutSine)
            }
        }
        if(Input.isPressed(KeyBind.SLOW)){
            for(let i=0;i<this.options.length;i++){
                const option = this.options[i]
                option.MoveTime(goAngle(posZero,i*40-150,70),20,Easing.easeOutCubic)
            }
        }
    }
    updateShots(){
        if(!this.shotAble) return
        this.shotCount++
        if(Input.isDown(KeyBind.OK)){
            if(this.shotCount % this.shotMainDelay == 0){
                this.spawnShot({sprite: {texture: Textures.playerMainShot, angle:-90,scale:2,anchor:{x:0.8,y:0.5}},radius:10}, pos(this.x-10,this.y), 270, 40)
                this.spawnShot({sprite: {texture: Textures.playerMainShot, angle:-90,scale:2,anchor:{x:0.8,y:0.5}},radius:10}, pos(this.x+10,this.y), 270, 40)
            }
            if(this.shotCount % this.shotSubDelay == 0){
                for(let option of this.options){
                    this.spawnShot({sprite: {texture: Textures.playerSubShot, angle:-90,scale:2,anchor:{x:0.8,y:0.5}},radius:10}, posAdd(option,this), 270, 40)
                }
            }
        }
    }

    damage(){
        if(this.godMode){return}
        gm.killAll()
        this.hitSprite.visible = false
        this.godMode = true
        this.shotAble = false
        this.blockMove = true
        this.startRoutine("damage",function(self){
            if(this.whenTime(0)){
                Am.playSFX("pDead")
                gm.spawnEffect(EFC.plDie,gm.gameLayer,self)
                self.SetValueObj(self.baseSprite.scale,'x',0,60,Easing.linear)
                self.SetValueObj(self.baseSprite.scale,'y',4,60,Easing.linear)
                self.SetValue('alpha',0,60,Easing.linear)
            }
            if(this.whenTime(60)){
                self.appear()
            }
        })
    }
    appear(){
        this.blockMove = true
        this.startRoutine("appear",function(self){
            if(this.whenTime(0)){
                self.alpha = 1
                self.baseSprite.scale.set(2)
                self.set(pos(GS * 0.5, GS))
                self.MoveTime(pos(GS * 0.5, GS * 0.75),60,Easing.easeOutCubic)
            }
            if(this.whenTime(60)){
                self.blockMove = false
                self.shotAble = true
                self.getGodTime(120)
            }
        })
    }
    getGodTime(time){
        this.startRoutine("godTime",function(self){
            if(this.whenTime(0)){
                self.baseSprite.alpha = 0.7
                self.baseSprite.tint = 'rgb(0, 119, 255)'
            }
            if(this.whenTime(time)){
                self.baseSprite.alpha = 1
                self.baseSprite.tint = 0xffffff
                self.godMode = false
            }
        })
    }

    spawnShot(sprite,pos,dir,spd ){
        const shot = new PlayerShot(sprite)
        shot.set(pos)
        shot.MoveDir(dir,spd)
        this.shots.addObject(shot)
        gm.playLayer.addChild(shot)
    }

    updateSprite(){
        let desired = 'idle'
        if( Input.isDown(KeyBind.LEFT) && !Input.isDown(KeyBind.RIGHT)){ desired = 'left' }
        else if( Input.isDown(KeyBind.RIGHT) && !Input.isDown(KeyBind.LEFT)){ desired = 'right' }

        // 전환 중이 아닐 때 상태 변경 감지
        if (!this.transitioning && desired !== this.spriteState) {
            if (this.spriteState === 'idle') {
                // idle → left/right: 바로 진입
                this.spriteState = desired
                this.spriteIndex = 0
                this.spriteCount = this.spriteDelay
            } else if (desired === 'idle') {
                // left/right → idle: 되감기 시작 (3→0)
                this.transitioning = true
                this.pendingState = desired
                this.spriteIndex = 3
                this.spriteCount = this.spriteDelay
            } else {
                // left ↔ right: 즉시 새 방향 배열 0부터
                this.spriteState = desired
                this.spriteIndex = 0
                this.spriteCount = this.spriteDelay
            }
            return
        }

        // 되감기 중 방향 전환 감지
        if (this.transitioning && desired !== this.pendingState) {
            if (desired !== 'idle' && desired !== this.spriteState) {
                // 되감기 중 방향 전환 → 즉시 새 방향
                this.transitioning = false
                this.spriteState = desired
                this.pendingState = null
                this.spriteIndex = 0
                this.spriteCount = this.spriteDelay
                return
            } else if (desired === this.spriteState) {
                // 되감기 중 원래 방향 복귀 → 되감기 취소
                this.transitioning = false
                this.pendingState = null
                this.spriteCount = this.spriteDelay
                return
            }
        }

        // 프레임 카운터
        if (this.spriteCount < this.spriteDelay) {
            this.spriteCount++
            return
        }
        this.spriteCount = 0

        if (this.transitioning) {
            // 되감기: 현재 배열의 3,2,1,0
            const arr = (this.spriteState == 'left') ? Textures.playerLeft : (this.spriteState == 'right') ? Textures.playerRight : Textures.playerIdle
            this.baseSprite.texture = arr[this.spriteIndex]
            if (this.spriteIndex <= 0) {
                // 되감기 완료 → 새 상태 진입
                this.transitioning = false
                this.spriteState = this.pendingState
                this.pendingState = null
                this.spriteIndex = 0
                this.spriteCount = this.spriteDelay
            } else {
                this.spriteIndex--
            }
        } else if (this.spriteState === 'idle') {
            // idle: 0~7 순환
            this.spriteIndex = (this.spriteIndex >= 7) ? 0 : this.spriteIndex + 1
            this.baseSprite.texture = Textures.playerIdle[this.spriteIndex]
        } else {
            // left/right: 0~7, 이후 4~7 반복
            this.spriteIndex = (this.spriteIndex >= 7) ? 4 : this.spriteIndex + 1
            this.baseSprite.texture = (this.spriteState == 'left') ? Textures.playerLeft[this.spriteIndex] : Textures.playerRight[this.spriteIndex]
        }
    }

    
}


//대화 시스템
class GameDialog extends GameObject {
  constructor() {
    super()
    this.stands = new Map()
    this.curText = ""
  }

  init() {
    this.set(GX + GS*0.5,GY + GS*0.8)
    this.standLayer = new Container()
    this.textBox = new Container()
    this.textBFrame = this.textBox.addChild(Img.sprite("rect", [800, 160], 'rgba(0,0,0,0.8)'))
    this.textBFrame.scale.x = 0
    this.textNameFrame = this.textBox.addChild(Img.sprite("rect", [300, 45], 'rgba(0,0,0,0.8)',{
        position: {x:0,y:-110}, 
    }))
    this.textNameFrame.scale.x = 0
    this.textObj = this.textBox.addChild(new Text({ 
        text: "", 
        style: Data.styles.dialog,
        position:{x:-350,y:0},
        anchor:{x:0,y:0.5} 
    }))
    this.nameObj = this.textBox.addChild(new Text({ 
        text: "", 
        style: Data.styles.dialog,
        position:{x:this.textNameFrame.position.x,y:this.textNameFrame.position.y},
        anchor:{x:0.5,y:0.5} 
    }))
    this.plzInputArrow = this.textBox.addChild(Img.sprite("rect", 16, 0xffffff,{
        rotation: Math.PI / 4,
        position: {x:0,y:70},
        visible: false
    }))
    this.startRoutine("arrow", function (self) {
      if (this.whileTime(0)) {
        if ((this.repeat % 60) < 30) {
          self.plzInputArrow.position.y += 0.5
        } else {
          self.plzInputArrow.position.y -= 0.5
        }
      }
    })
    this.addChild(this.standLayer, this.textBox)
    this.initValue()
  }

  initValue() {
    this.curText = ""
  }

  startDialog() {
    gm.player.shotAble = false
    this.startRoutine("start", function (self) {
      if (this.whileTime(0, this.repeat < 30)) {
        self.textBFrame.scale.x = frameMove(0, 800, this.repeat, 30, Easing.easeOutBack)
        self.textNameFrame.scale.x = frameMove(0, 300, this.repeat, 30, Easing.easeOutCirc)
      }
    })
  }

  addStand(char,side="left") {
    const stand = (typeof char === "string") ? dialogChar[char] : char
    const standSprite = new GameObject()
    const standBase = new Sprite({
        texture: Img.texture[stand.texture].base,
        anchor: 0.5,
    })
    standSprite.addChild(standBase)
    const standFeel = new Sprite({
        position:{x:stand.feelingPos.x-standBase.width/2, y:stand.feelingPos.y-standBase.height/2},
        anchor: 0,
    })
    standSprite.addChild(standFeel)
    this.stands.set(stand.name, {
        name: Data.text('character')[stand.name],
        color: stand.color,
        texture: stand.texture,
        stand: standSprite,
        feel: standFeel,
        side: side
    })
    standSprite.tint = 'rgb(46, 46, 46)'
    standSprite.SetValue('alpha', [0,1], 20, Easing.linear)
    if(side == "left"){
        standSprite.set(-1000,0)
        standSprite.MoveTime(pos(-350, 0), 20, Easing.easeOutCubic)
    }else{
        standSprite.set(1000,0)
        standSprite.MoveTime(pos(350, 0), 20, Easing.easeOutCubic)
    }
    // standSprite.addChild(Img.sprite("rect", 999, 'rgb(255, 0, 0)'))
    this.standLayer.addChild(standSprite)
  }

  getChar(text){
    return this.stands.get(text)
  }

  dialog(char, feel, text) {
    this.curText = text
    const character = this.getChar(char) || {
        name: dialogChar.null.name,
        color: dialogChar.null.color,
    }
    for(let [key, s] of this.stands){
        const stand = s.stand
        if(key != char){
            stand.tint = 'rgb(46, 46, 46)'
            if(s.side == "left"){
                stand.MoveTime(pos(-350, 0), 20, Easing.easeOutCubic)
            }else{
                stand.MoveTime(pos(350, 0), 20, Easing.easeOutCubic)
            }
        }
    }
    this.nameObj.text = character.name
    this.nameObj.tint = character.color
    this.setStandFeel(char, feel)
    this.startRoutine("texting", function (self) {
        if(character.stand){
            if(this.whenTime(0)){
                character.stand.tint = 'rgb(255, 255, 255)'
                if(character.side == "left"){
                    character.stand.MoveTime(pos(-300, -50), 20, Easing.easeOutCubic)
                }else{
                    character.stand.MoveTime(pos(300, -50), 20, Easing.easeOutCubic)
                }
            }
        }
      if (this.whileTime(0, this.repeat < self.curText.length)) {
        self.textObj.text = self.curText.slice(0, this.repeat)
      }
      if (this.whenTime(0)) {
        self.plzInputArrow.visible = true
      }
    })
  }

  setStandFeel(char, feel){
    let character = this.getChar(char)
    if(character == null){return}
    character.feel.texture = (feel > 0) ? Img.texture[character.texture].feels[feel-1] : null
  }

  endDialog() {
    gm.player.shotAble = true
    this.endAllRoutine(true)
    this.nameObj.text = ""
    this.textObj.text = ""
    this.plzInputArrow.visible = false
    this.startRoutine("end", function (self) {
        if(this.whenTime(0)){
            for(let [key, s] of self.stands){
                const stand = s.stand
                stand.tint = 'rgb(46, 46, 46)'
                if(s.side == "left"){
                    stand.MoveTime(pos(-1000, 0), 20, Easing.easeInCubic)
                }
                else{
                    stand.MoveTime(pos(1000, 0), 20, Easing.easeInCubic)
                }
            }
        }
        if(this.whenTime(20)){
            for(let [key, s] of self.stands){
                self.standLayer.removeChild(s.stand)
            }
            self.stands.clear()
        }
      if (this.whileTime(0, this.repeat < 30)) {
        self.textBFrame.scale.x = frameMove(800, 0, this.repeat, 30, Easing.easeOutSine)
        self.textNameFrame.scale.x = frameMove(300, 0, this.repeat, 30, Easing.easeOutSine)
      }
    })
  }

  updateStands(){
    for(let [char, stand] of this.stands){
        stand.stand.update()
    }
  }

  update(){
    super.update()
    this.updateStands()
  }
}

class GameUI extends Container{
    constructor(){
        super()
        this.spellCount = 0
    }

    init(){
        this.removeChildren()

        this.textStyle = new TextStyle({
            fontFamily: 'Cafe24Ohsquare',
            fontSize: 24,
            fill: 'rgb(255, 255, 255)',
            stroke: {
                color: 'rgba(0, 0, 0, 1)',
                width: 5
            }
        }); 

        this.bossHealth = new GagueBar({
            size:[GS-80, 15],
            background: 'rgba(0, 0, 0, 0)',
            color: 'rgb(255, 118, 118)',
            position: {x:310, y:40}
        })
        this.addChild(this.bossHealth)

        this.bossSpells = new Container({
            position: {x:GX+4,y:GY+38}
        })
        this.bossSpellIcons = []
        for(let i=0;i<10;i++){
            const sprite = new Sprite({
                texture: Img.texture.bomb,
                scale: 0.25,
                visible: false
            })
            sprite.position.set(i*20, 0)
            this.bossSpells.addChild(sprite)
            this.bossSpellIcons.push(sprite)
        }
        this.addChild(this.bossSpells)

        this.bossName = new Text({
            text: "",
            style: new TextStyle({
                fontFamily: 'KaiseiHarunoUmi',
                fontSize: 24,
                fill: 'rgb(0, 255, 21)',
                stroke: {
                    color: 'rgb(8, 92, 0)',
                    width: 2
                }
            }),
            position:{x:GX + 4,y:GY + 52},
        })
        this.addChild(this.bossName)

        this.bossBottomAlert = Img.sprite('rect',50,'rgba(160, 0, 0, 0.8)',{
            position:{x:0,y:GB},
            anchor:{x:0.5,y:0},
            visible: false
        })
        this.addChild(this.bossBottomAlert)

        this.spellTimer = new Text({
            text: "00",
            style: this.textStyle,
            position:{x:GR-50,y:GY-4},
            scale: 1.3,
            tint:'rgb(255, 255, 255)',
            visible: false
        })
        this.addChild(this.spellTimer)

        this.updateBossHealth()
    }

    update(){
        if(gm.boss){
            this.bossBottomAlert.visible = true
            this.bossBottomAlert.x = gm.boss.x + GX
        }else{
            this.bossBottomAlert.visible = false
        }
    }

    updateBossHealth(){
        this.bossHealth.visible = !!gm.boss && gm.boss.health > 0
        if(!this.bossHealth.visible) return
        this.bossHealth.update(gm.boss.health, gm.boss.healthMax)
    }

    updateBossSpells(count){
        this.spellCount = count
        for(let i=0;i<this.bossSpellIcons.length;i++){
            this.bossSpellIcons[i].visible = i < this.spellCount
        }
    }

    updateTimer(){
        this.spellTimer.visible = gm.timer > 0
        this.spellTimer.text = String(Math.ceil(gm.timer / 60)).padStart(2,'0')
    }
}

export class GameManager extends SceneObject {
    constructor() {
        super()
        this.session = {
            mode: 'new-game',
            stage: gameData.defaultStage
        }
        this.stage = null

        this.bullets = new GameObjectGroup()
        this.items = new GameObjectGroup()
        this.enemys = new GameObjectGroup()
        this.effects = new GameObjectGroup()
        this.boss = null

        this.gameLayer = new Container({
            position: {x:GX,y:GY}
        })
        threeBgSprite.position.set(GX, GY)
        this.addChild(this.gameLayer)

        this.playLayer = new Container()
        this.enemyLayer = new Container()
        this.itemsLayer = new Container()
        this.bulletLayer = new Container()

        this.efcLayer1 = new Container()
        this.efcLayer2 = new Container()
        this.efcLayer3 = new Container()

        this.addUpdate(this.bullets, this.enemys, this.effects, this.items)
        this.gameLayer.addChild(this.efcLayer1,this.efcLayer2,this.enemyLayer, this.playLayer, this.itemsLayer, this.bulletLayer, this.efcLayer3)

        this.gameBackGround = new Container()
        this.backGround = Img.sprite('rect', [gameData.resolution[0], gameData.resolution[1]], 'rgb(26, 26, 26)',{anchor:0})
        this.blackGround = Img.sprite('rect', GS+8, 'rgb(255, 255, 255)',{anchor:0,position:{x:GX-4, y:GY-4}})
        this.gameBackGround.addChild(this.backGround, this.blackGround)

        this.playGround = Img.sprite('rect', GS, 'rgb(0, 0, 0)',{anchor:0,position:{x:GX,y:GY}})
        this.gameBackGround.setMask({ mask: this.playGround, inverse: true })
        this.addChild(this.gameBackGround, this.playGround)

        this.ui = new GameUI()
        this.addChild(this.ui)

        this.dialog = new GameDialog()
        this.addChild(this.dialog)

        this.showHitCircle = false

        this.timer = 0
    }

    getBullets(){
        return this.bullets.filter(x => x.valiable)
    }

    init() {
        this.ui.init()
        this.dialog.init()
        this.player = new Player()
        this.addUpdate(this.player)
        this.playLayer.addChild(this.player)
    }

    enter(option = null) {
        if (option) {
            this.session = {
                ...this.session,
                ...option
            }
            this.stage = Data.stages[this.session.stageId]
            this.startStage()
        }
    }

    startStage() {
        const r = new StageRoutine();
        r.tag = "stage";
        r.self = this
        r.route = this.stage.update
        this.routes.push(r);

        Rnd.init()
    }

    spawnBullet(data, color, pos) {
        const bullet = new Bullet()
        bullet.setBullet(data,color)
        bullet.set(pos.x, pos.y)

        this.bullets.addObject(bullet) // 오브젝트 업데이트
        this.bulletLayer.addChild(bullet) // 스프라이트 레이어
        return bullet
    }
    /**
     * @param {Object} data
     * @param {string} data.shape - 탄 모양 키 (예: "circle", "arrow")
     * @param {number} data.color - 탄 색상 인덱스
     * @param {{x:number, y:number}} data.startPos - 레이저 시작 좌표
     * @param {{x:number, y:number}} data.endPos - 레이저 끝 좌표
     * @param {number} [data.guideTime=0] - 가이드 표시 프레임 수
     * @param {number} [data.atkTime=60] - 공격 지속 프레임 수
     */
    spawnLazer(shape, color, startPos, endPos, guideTime = 60, atkTime = 60) {
        const lazer = new Lazer({shape, color, startPos, endPos, guideTime, atkTime})
        this.bullets.addObject(lazer) // 오브젝트 업데이트
        return lazer
    }
    spawnBentLazer(color, pos, length, width = 32){
        const bentLazer = new BentLazer(pos, color, length, width)
        this.bullets.addObject(bentLazer) // 오브젝트 업데이트
        return bentLazer
    }
    spawnEnemy(pos, spell) {
        const enemy = new Enemy()
        enemy.set(pos)
        enemy.applyEnemyData(spell.enemy)
        enemy.activeSpell(spell)

        // enemy.MoveDir(dir, speed)

        this.enemys.addObject(enemy) // 오브젝트 업데이트
        this.enemyLayer.addChild(enemy) // 스프라이트 레이어
        return enemy
    }
    spawnItem(pos, type){
        const item = new Item(type)
        item.set(pos)
        this.items.addObject(item) // 오브젝트 업데이트
        this.itemsLayer.addChild(item) // 스프라이트 레이어
        return item
    }
    /** @param {Container} parent
     * playLayer, enemyLayer, bulletLayer 등 효과를 보여줄 레이어
    */
    spawnEffect(data,parent,pos,option={}){
        const object = new GameObject()
        object.set(pos)
        object.data = data
        data.init.call(object,option)
        object.startRoutine("effect",data.update)
        parent.addChild(object)
        this.effects.addObject(object)
    }
    killEffect(effect){
        for(let efc of this.effects){
            if(efc.data == effect){
                efc.die()
                break
            }
        }
    }
    spawnBoss(pos, enemy) {
        this.boss = new Boss()
        this.boss.set(pos.x, pos.y)
        this.boss.applyEnemyData(enemy)
        if(EData[enemy].name){
            this.ui.bossName.text = EData[enemy].name
        }
        this.ui.bossBottomAlert.visible = true
        this.enemys.addObject(this.boss) // 오브젝트 업데이트
        this.enemyLayer.addChild(this.boss) // 스프라이트 레이어
    }
    activeBoss(spell){
        this.boss.activeSpell(spell)
    }
    bossDead(){
        return this.boss && this.boss.health <= 0
    }

    killAll(){
        for(let bullet of this.bullets){
            bullet.kill()
        }
        for(let enemy of this.enemys){
            if(enemy.health <= 0){continue}
            enemy.kill()
        }
        this.stopTimer()
    }

    startTimer(value){
        this.timer = value*60
    }
    stopTimer(){
        this.timer = 0
        this.ui.updateTimer()
    }

    subUpdate(){
        if(this.timer > 0){
            this.timer--;
            if(this.timer < 600 && this.timer % 60 == 0){
                Am.playSFX("timer")
            }
            if(this.timer == 0){
                this.killAll()
            }
            this.ui.updateTimer()
        }
    }


    update() {
        super.update()
        this.subUpdate()
        this.ui.update()
        this.dialog.update()
        if (Input.isPressed(KeyBind.CANCEL)) {
            Scene.enter(Scene.sceneList.Pause)
        }
    }
}



window.gm = new GameManager()