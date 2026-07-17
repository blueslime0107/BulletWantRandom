
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
                gm.spawnEffect(EFC.spellAlert,gm.efcBulletAbove,posZero,{spell:spell.name})
                gm.spawnEffect(EFC.spellBG,gm.efcEnemyUnder,posZero,{profile:spell.spellProfile})
                gm.spawnEffect(EFC.spellStand,gm.efcEnemyUnder,posZero,{texture:spell.spellProfile})
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
        this.baseSprite = new Sprite({anchor:0.5,scale:2})
        if(gm.showHitCircle) {
            this.baseSprite.addChild(Img.sprite('circle', this.radius, 'rgb(30, 255, 0)'))
        }
        this.addChild(this.baseSprite)

        this.health = 0
        this.maxHealth = 0

        this.animationRate = 6
        this.oldX = 0
        this.textureFrame = 0
        this.textureIndex = 0
        this.texture = null
        this.spriteState = "idle"
        this.pendingState = null
        this.isFadeTransition = false
        this.fadeIndex = 0

        this.red = 0
        this.blue = 0
        this.level = 1
        this.items = []
        this.data = null

        this.godMode = false
        this.rushMode = false
    }

    applyEnemyData(enemy){
        const data = enemy
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
        }else{ // 단일 스프라이트
            this.baseSprite.texture = this.texture
        }
    }

    activeSpell(spell){
        this.data = spell
        this.health = spell.health
        this.maxHealth = spell.health
        this.level = spell.level || 1
        this.spell = spell
        this.red = spell.red
        this.blue = spell.blue
        this.items = spell.items || []

        this.triggerItem('onSpawn')
        this.startRoutine("spell",spell.spell)
    }

    damage(count){
        if(this.godMode){return}
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

        if(!this.idleFrame){return}

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

    kill(caller = 'player'){
        super.kill()
        this.endAllRoutine()
        gm.spawnEffect(EFC.enemyBlast,gm.gameLayer,this)
        if(caller == 'player'){
            this.whenDeadScore()
            sys.addCombo()
            this.triggerItem('onDeath')
        }
        Am.playSFX("eDead")
        this.die()
    }

    triggerItem(trigger){
        for(let item of this.items){
            item.data[trigger]?.call(this, item.stack)
        }
    }

    whenDeadScore(){
        sys.blueScore += this.blue
        sys.redScore += this.red
    }

    getGodTime(time){
        if(time == 0){
            this.endRoutine("godTime")
            this.baseSprite.alpha = 1
            this.baseSprite.tint = 0xffffff
            this.godMode = false
        }
        this.startRoutine("godTime",function(self){
            if(this.whenTime(0)){
                self.baseSprite.alpha = 0.7
                self.baseSprite.tint = 'rgb(0, 119, 255)'
                self.godMode = true
            }
            if(this.whenTime(time)){
                self.baseSprite.alpha = 1
                self.baseSprite.tint = 0xffffff
                self.godMode = false
            }
        })
    }

    toggleRush(value){
        // this.rushMode = value
        // if(this.rushMode){
        //     this.endRoutine('rushMode')
        //     this.startRoutine("rushMode",function(self){
        //         if(this.whenTime(0)){
        //             self.baseSprite.alpha = 0.7
        //             self.baseSprite.tint = 'rgb(0, 119, 255)'
        //             self.godMode = true
        //         }
        //     })
        // }
    }
}

class Boss extends Enemy {

    constructor(){
        super()
        this.finalMode = 0 // 0: 일반, 1: 최종보스, 2: 최종보스(2페이즈)
        this.healthMax = 0
        this._sin = 0
        this._specialMoving = false
        this.baseSprite.scale.set(2)
    }

    applyEnemyData(enemy){
        super.applyEnemyData(enemy)
        this.radius *= 1.5
        this.baseSprite.scale.set(3)
    }

    kill(){
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
        // gm.spawnItem(this,"point")
        sys.setTime(Math.min(sys.timer + (sys.roundTime-10)*60,sys.roundTime*60)) // 최대 30초까지만 시간 회복시켜줌
        gm.ui.toggleKillBoss(false)
        gm.ui.bossBottomAlert.visible = false
        gm.ui.bossName.text = ""
        Am.playSFX("eDead")
        this.die()
        gm.boss = null
    }

    activeSpell(spell){
        super.activeSpell(spell)
        this.setHealth(spell.health)
        if(spell.timer) gm.startTimer(spell.timer)
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
        this.subSprite = new Sprite({
            anchor: 0.5,
            scale:4
        })

        this.data = null
        this.shape = 0
        this.color = 0
        this.spinMode = 0

        this.grazed = false

        this.defaultTint = 'rgb(255, 255, 255)'

        this.noDamage = false

        this.autoDie = {
            outScreen: true
        }

        this.addChild(this.baseSprite,this.subSprite)

        if(gm.showHitCircle) {
            this.hitCircleSprite = Img.sprite('circle', this.radius, 'rgb(255, 0, 0)')
            this.baseSprite.addChild(this.hitCircleSprite)
        }
        this.appear = 0
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
        this.subSprite.texture = Textures.bulletSpawn[color]
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
        if(this.appear == 0){
            if(this.subSprite.scale.x > 0){
                this.subSprite.scale.x -= 0.5
                this.subSprite.scale.y -= 0.5
            }else{this.appear = 1}
        }
        this.tint = this.defaultTint
        if(this.autoDie.outScreen && this.onceShowAndOffScreen()){
            this.die()
        }
        if(!this.noDamage && collideCircle(this, gm.player)){
            gm.player.damage()
        }
        if(!this.noDamage && collideCircle(this, gm.player, 64)){
            this.tint = 'rgb(255, 145, 145)'
            if(!this.grazed){
                gm.player.grazed(this)
                this.grazed = true
            }
        }
        if(this.spinMode == 1){
            this.angle = this.dir+90
        }
        if(this.spinMode == 2){
            this.angle+=2
        }
    }

    kill(tag){
        super.kill()
        this.endAllRoutine()
        if(tag == 'bonus'){
            sys.redScore+=1
        }
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
            if(!this.lazerMesh){return}
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
        gm.efcBulletAbove.addChild(this.spawnEffectSprite)

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
        bullet.subSprite.visible = false
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
        for(let i=0;i<this.bullets.length;i++){
            const bullet = this.bullets[i]
            bullet.die();
        }
        this.die()
    }

    die(){
        this.lazerMesh.destroy()
        this.spawnEffectSprite.destroy()
        super.die()
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
            if(!this.lazerMesh){return}
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
            bullet.subSprite.visible = false
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
    constructor(sprite, radius) {
        super()
        this.zIndex = -1
        this.baseSprite = new Sprite(sprite)
        this.radius = radius
        if(gm.showHitCircle){
            this.baseSprite.addChild(Img.sprite('circle', this.radius, 'rgb(30, 255, 0)'))
        }
        this.addChild(this.baseSprite)
    }

    update(){
        if(!this.valiable){
            this.scale.x += 0.2
            this.scale.y += 0.2
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

class KillCircle extends GameObject {
    constructor(pos,radius=50){
        super()
        console.log(radius)
        this.endRadius = radius
        this.set(pos)
        this.baseSprite = Img.sprite('reverseGradiusCircle', 100, 'rgba(255, 255, 255, 0.56)')
        this.addChild(this.baseSprite)
        gm.efcBulletAbove.addChild(this)
        gm.addUpdate(this)
        this.startRoutine("test",function(self){
            if(this.whileFrame(30)){
                self.scale.x = frameMove(1,self.endRadius/25,this.repeat,this.time,Easing.linear)
                self.radius = self.scale.x * 50
                self.alpha = frameMove(1,0,this.repeat,this.time,Easing.linear)
                self.scale.y = self.scale.x
            }
            if(this.whenTime(0)){
                self.die()
            }
        })
    }

    update(){
        super.update()
        for(let bullet of gm.getBullets()){
            if(collideCircle(bullet,this)){
                bullet.kill('bonus')
            }
        }
        for(let enemy of gm.getEnemys()){
            if(collideCircle(enemy,this)){
                enemy.damage(1)
            }
        }
    }
}

class Player extends GameObject {
    constructor() {
        super()
        this.borderOffset = 8
        this.itemgetline = 250

        this.baseSprite = new Sprite({
            texture: Textures.playerIdle[0],
            anchor: 0.5,
            scale:2
        })
        this.addChild(this.baseSprite)

        this.hitSprite = Img.sprite('circle', this.radius, 'rgb(255, 0, 0)')
        this.addChild(this.hitSprite)

        this.options = {}
        this.items = []
        this.shots = new GameObjectGroup()

        this.addUpdate(this.shots)

        // 스프라이트 애니메이션 관련 변수
        this.spriteIndex = 0
        this.spriteCount = 0
        this.spriteDelay = 2
        this.spriteState = 'idle'
        this.transitioning = false
        this.pendingState = null

        this.bombGague = new Bitmap({
            anchor: {x: 0.5, y: 0.5},
            width: 150,
            height: 150,
            alpha: 0.5
        })
        this.addChild(this.bombGague)
        this.bombGague.strokeCircle(75,75,68,12,'rgba(87, 87, 87, 0.53)')

        this.reset()
    }

    reset(){
        this.radius = 12
        this.speed = 6
        this.power = 1
        this.position.set(GS * 0.5, GS * 0.75)
        this.shotMainDelay = 2
        this.shotCount = 0
        this.godMode = false
        this.shotAble = true
        this.blockMove = false
        this.bombPower = 0
    }


    update() {
        super.update()
        this.updateMove()
        this.updateOptions()
        this.updateShots()
        this.updateBomb()
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
        // if(Input.isReleased(KeyBind.SLOW)){
        //     for(let i=0;i<this.options.length;i++){
        //         const option = this.options[i]
        //         option.MoveTime(goAngle(posZero,i*80-210,100),20,Easing.easeOutSine)
        //     }
        // }
        // if(Input.isPressed(KeyBind.SLOW)){
        //     for(let i=0;i<this.options.length;i++){
        //         const option = this.options[i]
        //         option.MoveTime(goAngle(posZero,i*40-150,70),20,Easing.easeOutCubic)
        //     }
        // }
    }
    
    updateShots(){
        if(!this.shotAble) return
        this.shotCount++
        if(Input.isDown(KeyBind.OK)){
            if(this.shotCount % this.shotMainDelay == 0){
                for(let i=0;i<this.power;i++){
                    this.spawnShot({texture: Textures.playerMainShot, angle:-90,scale:2,anchor:{x:0.8,y:0.5}},10, 
                        pos(this.x+centerSpread(this.power,30,i),this.y)).MoveDir(-90,40)
                }
            }
            for(let optionKey in this.options){
                for(let option of this.options[optionKey]){
                    option.updateShot(this.shotCount)
                }
            }
        }
    }

    damage(){
        if(this.godMode){return}
        gm.killAll(['bullet','enemy'])
        this.hitSprite.visible = false
        this.godMode = true
        this.shotAble = false
        this.blockMove = true
        sys.playerKilled()
        this.startRoutine("damage",function(self){
            if(this.whenTime(0)){
                Am.playSFX("pDead")
                gm.spawnEffect(EFC.plDie,gm.gameLayer,self)
                self.SetValueObj(self.baseSprite.scale,'x',0,60,Easing.linear)
                self.SetValueObj(self.baseSprite.scale,'y',4,60,Easing.linear)
                self.SetValue('alpha',0,60,Easing.linear)
            }
            if(this.whenTime(60)){
                if(sys.live < 0){
                    sys.gameOver()
                }else{
                    self.appear()
                }
            }
        })
    }
    grazed(bullet){
        Am.playSFX('graze')
        this.setBombPower(this.bombPower + 1)
        this.triggerItem('onGraze')
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
        if(time == 0){
            this.endRoutine("godTime")
            this.baseSprite.alpha = 1
            this.baseSprite.tint = 0xffffff
            this.godMode = false
        }
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

    updateBomb(){
        if(Input.isPressed(KeyBind.SUBKEY) && this.bombPower >= 100){
            this.spawnBomb()
            this.setBombPower(0)
            Am.playSFX('slash')
        }
    }

    spawnBomb(){
        const sprite = new GameObject({
            position: {x:this.x, y:this.y}
        })
        const baseSprite = Img.sprite('circle', 100, 'rgba(255, 255, 255, 0.56)')
        sprite.addChild(baseSprite)
        gm.efcBulletAbove.addChild(sprite)
        gm.addUpdate(sprite)
        sprite.MoveDir(-90,1)
        sprite.startRoutine("test",function(self){
            if(this.whileFrame(10)){
                self.scale.x = frameMove(1,2,this.repeat,10,Easing.linear)
                self.radius = self.scale.x * 50
                self.scale.y = self.scale.x
            }
            this.whenTime(60)
            if(this.whileFrame(10)){
                self.scale.x = frameMove(2,0,this.repeat,10,Easing.linear)
                self.radius = self.scale.x * 50
                self.scale.y = self.scale.x
            }
            if(this.whenTime(0)){
                const mult = 1 + 0.1 * (self.count / 20)
                gm.spawnEffect(EFC.text, gm.efcBulletAbove, self, {text: `BONUS MULT\nx${mult.toFixed(1)}`, color: 'rgb(255, 120, 120)'})
                sys.redScore *= mult
                Am.playSFX(SFX.songPeunMade)
                self.die()
            }
        })
        sprite.startRoutine("test2",function(self){
            if(this.whileTime(0)){
                for(let bullet of gm.getBullets()){
                    if(collideCircle(bullet,self)){
                        bullet.kill('bonus')
                        self.count++
                    }
                }
                for(let enemy of gm.getEnemys()){
                    if(collideCircle(enemy,self)){
                        enemy.damage(1)
                    }
                }
            }
        })
    }

    setBombPower(value){
        this.bombPower = Math.min(100, value)
        
        this.bombGague.clear()
        this.bombGague.strokeCircle(75,75,68,12,'rgba(87, 87, 87, 0.53)')
        this.bombGague.strokeCircle(75,75,68,8,'rgba(255, 255, 255, 1)',-90,360 * (this.bombPower / 100)-90)
        if(this.bombPower >= 100){
            if(!this.hasRoutine("bombPowerFull")){
            this.startRoutine("bombPowerFull",function(self){
                if(this.whileTime(20)){
                    self.bombGague.visible = !self.bombGague.visible
                }
            })
        }
        }else{
            this.endRoutine("bombPowerFull")
            this.bombGague.visible = true
        }
    }

    spawnShot(sprite,radius,pos){
        const shot = new PlayerShot(sprite,radius)
        shot.set(pos)
        this.shots.push(shot)
        gm.pShotLayer.addChild(shot)
        return shot
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

    getItem(item){
        const existingItem = this.items.find(i => i.data === item);
        if(existingItem){
            existingItem.stack += 1
        } else {
            this.items.push({
                stack: 1,
                data:item
            })
        }
        if(item.onEquip){
            item.onEquip.call(this)
        }
    }

    triggerItem(trigger){
        for(let item of this.items){
            item.data[trigger]?.call(this, item.stack)
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


class EffectPlayBox {
    constructor(){
    }
    
    init(){
        this.initRoundAlert()
        this.initRoundScoreAlert()
        this.initPlayerKillCircle()
    }

    initRoundAlert(){
        this.roundAlertObject = new GameObject()
        gm.efcEnemyUnder.addChild(this.roundAlertObject)
        gm.addUpdate(this.roundAlertObject)
        this.roundAlertText = new Text({
            style: new TextStyle({
                fontFamily: 'Cafe24Ohsquare',
                fontSize: 72,
                fill: 'rgb(255, 255, 255)'
            }),
            anchor: 0.5
        })
        this.roundAlertObject.addChild(this.roundAlertText)
        this.roundAlertObject.visible = false
    }

    initRoundScoreAlert(){
        this._scoreContainer = new Container() 
        this._redScore = new Text({
            style: new TextStyle({
                fontFamily: 'Cafe24Ohsquare',
                fontSize: 72,
                fill: 'rgb(255, 60, 60)'
            }),
            anchor: 0.5,
            position:{x:GS*0.5,y:GS*0.5+100},
            visible: false
        })
        this._blueScore = new Text({
            style: new TextStyle({
                fontFamily: 'Cafe24Ohsquare',
                fontSize: 72,
                fill: 'rgb(47, 78, 255)'
            }),
            anchor: 0.5,
            position:{x:GS*0.5,y:GS*0.5-100},
            visible: false
        })
        this._totalScore = new Text({
            style: new TextStyle({
                fontFamily: 'Cafe24Ohsquare',
                fontSize: 72,
                fill: 'rgb(255, 255, 255)'
            }),
            anchor: 0.5,
            position:{x:GS*0.5,y:GS*0.5},
            visible: false
        })
        this._scoreContainer.addChild(this._redScore, this._blueScore, this._totalScore)
        gm.efcEnemyUnder.addChild(this._scoreContainer)
    }

    initPlayerKillCircle(){
        this._playerKillCircle = Img.sprite('gradiusCircle', 100, 'rgb(255, 92, 92)',{visible:false})
        gm.efcBulletAbove.addChild(this._playerKillCircle)
    }

    stageAlert(num){
        this.roundAlertObject.visible = true
        this.roundAlertText.text = `Stage ${String(num).padStart(2,'0')}`
        this.roundAlertObject.startRoutine("roundAlert", function(self){
            if(this.whenTime(0)){
                self.set(GS,GS*0.5)
                self.MoveTime(pos(GS*0.5,GS*0.5), 30, Easing.easeOutCubic)
            }
            if(this.whenTime(60)){
                self.MoveTime(pos(-200,GS*0.5), 30, Easing.easeOutCubic)
            }
        })
    }

    scoreAlert(){
        gm.endRoutine('scoreAlert',true)
        this._redScore.text = sys.redScore
        this._blueScore.text = sys.blueScore
        this._totalScore.text = sys.totalScore
        gm.startRoutine('scoreAlert',function(){
            if(this.whileFrame(30)){
                gm.effectBox._redScore.visible = true
                gm.effectBox._blueScore.visible = true
                gm.effectBox._redScore.scale.x = frameMove(0,1,this.repeat,this.time,Easing.easeOutCubic)
                gm.effectBox._redScore.scale.y = frameMove(0,1,this.repeat,this.time,Easing.easeOutCubic)
                gm.effectBox._blueScore.scale.x = frameMove(0,1,this.repeat,this.time,Easing.easeOutCubic)
                gm.effectBox._blueScore.scale.y = frameMove(0,1,this.repeat,this.time,Easing.easeOutCubic)
            }
            if(this.whenTime(30)){
                gm.effectBox._redScore.visible = false
                gm.effectBox._blueScore.visible = false
                gm.effectBox._totalScore.visible = true
                Am.playSFX("cardGet")
            }
            if(this.whileTime(5,this.repeat<12)){
                gm.effectBox._totalScore.tint = this.repeat % 2 == 0 ? 'rgb(255, 255, 255)' : 'rgb(138, 138, 138)'
            }
            if(this.whenTime(0)){
                gm.effectBox._totalScore.visible = false
            }
        })
    }

    killPlayer(){
        gm.endRoutine('playerKillCircle',true)
        gm.startRoutine('playerKillCircle',function(){
            if(this.whenTime(0)){
                gm.effectBox._playerKillCircle.alpha = 0
            }
            if(this.whileFrame(30)){
                gm.effectBox._playerKillCircle.position.set(gm.player.x,gm.player.y)
                gm.effectBox._playerKillCircle.visible = true
                gm.effectBox._playerKillCircle.alpha = frameMove(0,1,this.repeat,this.time,Easing.easeOutCubic)
                gm.effectBox._playerKillCircle.scale.x = frameMove(15,0,this.repeat,this.time,Easing.linear)
                gm.effectBox._playerKillCircle.scale.y = frameMove(15,0,this.repeat,this.time,Easing.linear)
            }
        })
    }
}

class GameUIEnemyBlock extends GameObject {
    constructor(props){
        super(props)
        this.outLine = Img.sprite('rect', [180,80], 'rgba(255, 255, 255, 1)')
        this.inBase = Img.sprite('rect', [175, 75], 'rgb(0, 0, 0)')
        this.enemyImage = new Sprite({anchor:0.5,position:{x:-50,y:0}})
        this.levelText = new Text({
            text:'LV 0',
            style: Data.styles.enemyBlockText,
            tint: 'rgb(255, 255, 255)',
            position: {x:-15,y:-18},
            anchor: {x:0,y:0.5}
        })
        this.blueText = new Text({
            text:'0',
            style: Data.styles.enemyBlockText,
            tint: 'rgb(69, 97, 255)',
            position: {x:-15,y:16},
            anchor: {x:0,y:0.5}
        })
        this.redText = new Text({
            text:'0',
            style: Data.styles.enemyBlockText,
            tint: 'rgb(255, 57, 57)',
            position: {x:30,y:16},
            anchor: {x:0,y:0.5}
        })
        this.crossText = new Text({
            text:'x',
            style: Data.styles.enemyBlockText,
            scale: 0.5,
            position: {x:27,y:16},
            anchor: {x:0,y:0.5}
        })
        this.itemUI = new Bitmap({
            position: {x:-85,y:20},
            width:80, height:16
        })
        this.healthText = new Text({
            text:'0',
            style: Data.styles.enemyBlockText,
            tint: 'rgb(255, 116, 225)',
            scale: 0.8,
            position: {x:-50,y:-20},
            anchor: {x:0.5,y:0.5}
        })
        this.spawnRateText = new Text({
            text:'0',
            style: Data.styles.enemyBlockText,
            tint: 'rgb(133, 133, 133)',
            scale: 0.8,
            position: {x:60,y:15}
        })
        this.spawnRate = new Container({position:{x:50,y:40}})
        this.sROutline = Img.sprite('rect', [20, 80], 'rgba(255, 255, 255, 1)',{anchor:{x:0.5,y:1},position:{x:50,y:0}})
        this.sRInBase = Img.sprite('rect', [15, 75], 'rgb(0, 0, 0)',{anchor:{x:0.5,y:1},position:{x:50,y:-2.5}})
        this.sRInBaseGague = Img.sprite('rect', [15, 75], 'rgb(109, 109, 109)',{anchor:{x:0.5,y:1},position:{x:50,y:-2.5}})
        this.spawnRate.addChild(this.sROutline, this.sRInBase, this.sRInBaseGague)
        this.addChild(this.outLine, this.inBase, this.enemyImage, this.levelText, this.blueText, this.redText, this.crossText, this.spawnRate, this.itemUI, this.healthText, this.spawnRateText)

        this.frame = 0
    }

    updateData(data){
        this.data = data || this.data
        this.blueText.text = String(this.data.blue)
        this.redText.text = String(this.data.red)
        this.levelText.text = this.data.level ? 'LV '+ String(this.data.level) : ''
        if(this.data.level >= 10){
            this.levelText.text = 'LV MAX'
        }
        this.healthText.text = '♥'+ String(this.data.health)
        this.spawnRateText.text = (this.data.spawnRate/60).toFixed(1) + 's'

        const enemyTexture = Textures[this.data.enemy.texture]
        this.enemyImage.texture = enemyTexture
        this.enemyImage.width = 65
        this.enemyImage.height = 65

        if(!this.data.items){return}
        this.itemUI.clear()
        let j = 0
        for(let i=0;i<this.data.items.length;i++){
            for(let k=0;k<this.data.items[i].stack;k++){
                this.itemUI.blt(Img.texture.itemEnemy[this.data.items[i].data.imageId], 0,0,64,64,j*18,0,16,16)
                j++
            }
        }
    }

    _debugItemUI() {
        // 콘솔에서 호출 가능한 헬퍼
        console.log('[DEBUG] Current itemUI state:', {
            isValid: !!this.itemUI,
            texture: this.itemUI.texture,
            baseTexture: this.itemUI.texture?.baseTexture,
            canvas: this.itemUI.canvas,
            visible: this.itemUI.visible,
            parent: this.itemUI.parent?.constructor.name
        });
        return this.itemUI;
    }

    update(){
        super.update()
        this.frame++
        this.angle = Graph.sin(this.frame, -0.5,0.5,60)
    }
}

class ShopButton extends Button {
    constructor(){
        super({
            id: 0,
            touchArea: {width:120,height:120},
            onHighlight: function(isActive){
                this.SetValueObj(this.scale,'x',isActive ? [1,1.08] : [1.08,1],10,Easing.easeOutCubic)
                this.SetValueObj(this.scale,'y',isActive ? [1,1.08] : [1.08,1],10,Easing.easeOutCubic)
                if(isActive) Am.playSFX('select')
            },
            onPress: () => {
                // entry.onPress();
            },
            onToggle: function(toggle){
                this.alpha = toggle ? 1 : 0.5
            },
            scale: {x:0,y:1}
        })

        this.data = null
        this.baseSprite = Img.sprite('rect',120,'rgb(56, 56, 56)',{anchor:0.5})
        this.addChild(this.baseSprite)
        this.price = new Text({
            text: "0",
            style: new TextStyle({
                fontFamily: 'Cafe24Ohsquare',
                fontSize: 36,
                fill: 'rgb(255, 253, 124)',
                stroke: { color: 'rgba(0, 0, 0, 1)', width: 8 },
            }),
            position: {x:0,y:60},
            anchor: {x:0.5,y:0.5}
        })
        this.addChild(this.price)
        
        this.image = new Sprite({anchor:0.5})
        this.addChild(this.image)
    }

    updateData(data,enemy = true){
        this.data = data
        this.image.texture = (enemy) ? Textures.itemEnemy[data.imageId] : Textures.itemPlayer[data.imageId]
        this.price.text = String(data.price || '')
        this.baseSprite.tint = data.negative ? 'rgb(255, 119, 119)' : 'rgb(56, 56, 56)'
        this.toggleValiable(true)
    }

}

class GameUI extends GameObject{
    constructor(){
        super()
        this.spellCount = 0
    }

    reset(){
        this.leftSide.removeChildren()
        this.updateObjects.length = 0
        gm.ui.enemyBlocks.length = 0
        
        this.updateEnemyblockData()
        this.updateEnemyblockSpawnRate(0)
        this.hideShop()
    }

    init(){
        this.removeChildren()
        this._initSideUI()
        this._initLeftSide()
        this._initPlayerAreaUI()
        this._initShop()

        this.updateBossHealth()
    }

    _initSideUI(){
        this.textStyle = new TextStyle({
            fontFamily: 'Cafe24Ohsquare',
            fontSize: 36,
            fill: 'rgb(255, 255, 255)',
            stroke: {
                color: 'rgba(0, 0, 0, 1)',
                width: 5
            }
        }); 

        this.goalScoreText = new Text({ text: "목표점수", style: this.textStyle })
        this.goalScore = new Text({ text: "000,000,000", style: this.textStyle })

        this.curScoreText = new Text({ text: "점수", style: this.textStyle })
        this.curScore = new Text({ text: "000,000,000", style: this.textStyle })

        this.blueScore = new Text({ text: "0", style: this.textStyle, tint: 'rgb(69, 97, 255)' })
        this.bigX = new Text({ text: "X", style: this.textStyle, tint: 'rgb(255, 255, 255)' })
        this.redScore = new Text({ text: "1", style: this.textStyle, tint: 'rgb(255, 0, 0)' })

        this.coinText = new Text({ text: "Coin", style: this.textStyle, tint: 'rgb(255, 234, 49)' })
        this.coin = new Text({ text: "0", style: this.textStyle, tint: 'rgb(255, 234, 49)' })

        this.addChild(this.goalScoreText, this.goalScore, this.curScoreText, this.curScore, this.blueScore, this.bigX, this.redScore, this.coinText, this.coin)
        let stack = 0
        for(let i=0;i<this.children.length;i++){
            const child = this.children[i]
            child.anchor.set(0.5)
            child.x = GR + 150
            child.y = GY + 20 + stack
            stack += [40,60,40,60,40,40,60,40][i]
        }

        this.killBoss = new Container({
            position: {x: GR + 150, y: GY + 300},
            visible: false
        })
        this.killBossBox = Img.sprite('rect', [150, 64], 'rgb(61, 0, 0)', {anchor: 0.5})
        this.killBossMask = Img.sprite('rect', [150, 64], 'rgb(255, 255, 255)', {anchor: 0.5})
        this.killBossText = new Text({ text: "NULLITY", style: this.textStyle, tint: 'rgb(255, 255, 255)', anchor: 0.5 })
        this.killBossMask.visible = false
        this.killBossText.setMask({ mask: this.killBossMask})
        this.killBoss.addChild(this.killBossBox, this.killBossMask, this.killBossText)
        this.addChild(this.killBoss)
    }

    _initLeftSide(){
        this.leftSide = new Container({
            position: {x:GX*0.5,y:GY+20}
        })
        this.enemyBlocks = new GameObjectGroup()
        this.addChild(this.leftSide)
        gm.addUpdate(this.enemyBlocks)
    }

    _initShop(){
        this.shopContainer = new Container({
            position: {x: GX, y: GY}
        })
        this.shopButtons = new GameObjectGroup()

        const addButton = (obj) => {
            this.shopContainer.addChild(obj)
            this.shopButtons.push(obj)
        }

        this.shopGroup = new InputUIGroup({ curIndex: 0, skipNotAvailableUI: true });

        const enemyBtnData = {
            id: 0,
            touchArea: {width:220,height:80},
            onHighlight: function(isActive){
                this.SetValueObj(this.scale,'x',isActive ? [1,1.08] : [1.08,1],10,Easing.easeOutCubic)
                this.SetValueObj(this.scale,'y',isActive ? [1,1.08] : [1.08,1],10,Easing.easeOutCubic)
                if(isActive) Am.playSFX('select')
            },
            onPress: function(){
                sys.addEnemy(this.data)
                gm.ui.updateShopButtons()
                this.purchased = true
                this.toggleValiable(false)
                Am.playSFX('ok')
            },
            onToggle: function(toggle){
                this.alpha = toggle ? 1 : 0.5
            },
            scale: {x:0,y:1}
        }

        this.enemyLeft = new Button({...enemyBtnData, position: {x:150,y:74}, id:0});
        this.enemyLeft.baseSprite = new GameUIEnemyBlock({scale: 1.5})
        this.enemyLeft.addChild(this.enemyLeft.baseSprite)
        addButton(this.enemyLeft)
        this.shopGroup.addItem(this.enemyLeft,{
            RIGHT: () => { this.shopGroup.setItem(1) },
            DOWN: () => { this.shopGroup.setItem(2) }
        })

        
        this.enemyRight = new Button({...enemyBtnData, position: {x:500,y:74}, id:1});
        this.enemyRight.baseSprite = new GameUIEnemyBlock({scale: 1.5})
        this.enemyRight.addChild(this.enemyRight.baseSprite)
        addButton(this.enemyRight)
        this.shopGroup.addItem(this.enemyRight,{
            LEFT: () => { this.shopGroup.setItem(0) },
            DOWN: () => { this.shopGroup.setItem(5) }
        })

        const itemBtnList = () => {
            const list = []
            for(let i=0;i<4;i++){
                const btn = new ShopButton();
                addButton(btn)
                list.push(btn)
            }
            return list
        }
        this.enemyItemBtns = itemBtnList()
        for(let i=0;i<this.enemyItemBtns.length;i++){ 
            this.enemyItemBtns[i].id = i+2
            this.enemyItemBtns[i].set(170 * i + 85, 220)   
            this.enemyItemBtns[i].onPress = function(){
                if(gm.selectedEnemyItem == this){
                    this.endRoutine("select")
                    this.SetValueObj(this.scale,'x',1,10,Easing.easeOutCubic)
                    this.SetValueObj(this.scale,'y',1,10,Easing.easeOutCubic)
                    this.SetValue('angle',0,10,Easing.easeOutCubic)
                    gm.selectedEnemyItem = null
                    return
                }
                if(this.data.price > sys.coin){return}
                const d = gm.selectedEnemyItem
                gm.selectedEnemyItem = this
                if(d){
                    d.onHighlight(false)
                }
                this.endAllRoutine(true)
                this.scale.set(1.2)
                this.startRoutine("select", function(self){
                    if(this.whileTime(0)){
                        self.angle = Graph.sin(this.repeat, -5,5,20)
                    }
                })
                Am.playSFX('ok')
                gm.ui.updateShopButtons()
            }      
            this.enemyItemBtns[i].onHighlight = function(isActive){
                if(gm.selectedEnemyItem == this){return}
                this.endAllRoutine(true)
                this.SetValueObj(this.scale,'x',isActive ? [1,1.08] : [1.08,1],10,Easing.easeOutCubic)
                this.SetValueObj(this.scale,'y',isActive ? [1,1.08] : [1.08,1],10,Easing.easeOutCubic)
                if(isActive) Am.playSFX('select')
            }     
            this.shopGroup.addItem(this.enemyItemBtns[i])
        }


        this.playerItemBtns = itemBtnList()
        for(let i=0;i<this.playerItemBtns.length;i++){ 
            this.playerItemBtns[i].id = i+6
            this.playerItemBtns[i].set(170 * i + 85, 370)    
            this.playerItemBtns[i].onPress = function(){
                if(this.data.price > sys.coin){return}
                gm.player.getItem(this.data)
                sys.coin -= this.data.price || 0
                this.toggleValiable(false)
                gm.ui.updateShopButtons()
                Am.playSFX('ok')
            }        
            this.shopGroup.addItem(this.playerItemBtns[i])
        }

        this.rerollBtn = new Button({
            id: 10,
            touchArea: {width:150,height:120},
            onHighlight: function(isActive){
                this.SetValueObj(this.scale,'x',isActive ? [1,1.08] : [1.08,1],10,Easing.easeOutCubic)
                this.SetValueObj(this.scale,'y',isActive ? [1,1.08] : [1.08,1],10,Easing.easeOutCubic)
                if(isActive) Am.playSFX('select')
            },
            onPress: () => {
                if(sys.coin < sys.rerollPrice){return}
                sys.coin -= sys.rerollPrice
                sys.rerollPrice *= 2
                gm.ui.rerollBtn.price.text = String(sys.rerollPrice)
                sys.openShop()
                Am.playSFX('ok')
            },
            position: {x: 170, y:550},
            scale: {x:0,y:1}
        });
        this.rerollBtn.addChild(Img.sprite('rect',[150,120],'rgb(43, 43, 43)',{anchor:0.5}))   
        this.rerollBtn.addChild(new Text({
            text: "Reroll",
            anchor: 0.5,
            style: Data.styles.menuItem
        }))       
        this.rerollBtn.price = new Text({
            text: String(sys.rerollPrice),
            style: new TextStyle({
                fontFamily: 'Cafe24Ohsquare',
                fontSize: 36,
                fill: 'rgb(255, 253, 124)',
                stroke: { color: 'rgba(0, 0, 0, 1)', width: 8 },
            }),
            position: {x:0,y:60},
            anchor: {x:0.5,y:0.5}
        })
        this.rerollBtn.addChild(this.rerollBtn.price)   
        this.shopGroup.addItem(this.rerollBtn)
        addButton(this.rerollBtn)

        this.continueBtn = new Button({
            id: 11,
            touchArea: {width:150,height:120},
            onHighlight: function(isActive){
                this.SetValueObj(this.scale,'x',isActive ? [1,1.08] : [1.08,1],10,Easing.easeOutCubic)
                this.SetValueObj(this.scale,'y',isActive ? [1,1.08] : [1.08,1],10,Easing.easeOutCubic)
                if(isActive) Am.playSFX('select')
            },
            onPress: () => {
                gm.ui.clearShopRoutine()
                sys.startRound()
                Am.playSFX('ok')
            },
            position: {x: GS-170, y:550},
            scale: {x:0,y:1}
        });
        this.continueBtn.addChild(Img.sprite('rect',[150,120],'rgb(49, 49, 49)',{anchor:0.5}))  
        this.continueBtn.addChild(new Text({
            text: "Continue",
            anchor: 0.5,
            style: Data.styles.menuItem
        }))        
        this.shopGroup.addItem(this.continueBtn)
        addButton(this.continueBtn)

        this.addChild(this.shopContainer)
        gm.addUpdate(this.shopButtons)
    }

    _initPlayerAreaUI(){
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

        this.timer = new Text({
            text: "00",
            style: this.textStyle,
            position:{x:950,y:GY-10},
            tint:'rgb(255, 255, 255)',
            anchor: {x:0.5, y:0},
            visible: true
        })
        this.addChild(this.timer)

        this.comboText = new Text({
            text: "x1",
            style: this.textStyle,
            position:{x:GX,y:GY+40},
            tint:'rgb(255, 255, 255)',
            anchor: 0,
            visible: false
        })

        this.comboGague = Img.sprite('rect',[100,36],'rgb(255, 255, 255)',{
            position:{x:GX,y:GY+50},
            anchor: 0,
            visible: false
        })
        this.addChild(this.comboGague)
        this.addChild(this.comboText)
        // this.round = new Text({
        //     text: "ROUND 01",
        //     style:this.textStyle,
        //     position:{x:GX,y:GY-10},
        //     tint:'rgb(255, 255, 255)',
        //     anchor: 0,
        //     visible: true
        // })
        // this.addChild(this.round)
        this.liveGague = new Container({position:{x:GX,y:GY}})
        this.lives = []
        this.addChild(this.liveGague)
    }

    update(){
        super.update()
        if(gm.boss){
            this.bossBottomAlert.visible = true
            this.bossBottomAlert.x = gm.boss.x + GX
        }else{
            this.bossBottomAlert.visible = false
        }
        this.updateComboGagueBar()
    }

    updateLive(){
        while(this.lives.length < sys.liveMax){
            const life = new Sprite({
                texture: Img.texture.ui_heartEmpty,
                scale: 0.75,
                position: {x: GS - 48, y:GS - 48 - this.lives.length*48}
            })
            this.liveGague.addChild(life)
            this.lives.push(life)
        }
        for(let i=0;i<this.lives.length;i++){
            this.lives[i].texture = i >= sys.live ? Img.texture.ui_heart : Img.texture.ui_heartEmpty
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

    toggleKillBoss(value){
        this.killBoss.visible = value
        if(this.killBoss.visible){
            this.startRoutine('killBoss', function(self){
                if(this.whileTime(0)){
                    self.killBoss.angle = Graph.sin(this.repeat, -5,5,60)
                }
            })
        }else{
            this.endRoutine('killBoss')
        }
    }

    updateTimer(){
        this.timer.visible = sys.timer > 0
        this.timer.text = String(Math.ceil(sys.timer / 60)).padStart(2,'0')
    }

    updateCombo(){
        this.comboGague.visible = true
        this.comboText.visible = true
        this.comboText.text = "x" + String(sys.combo)
    }

    updateComboGagueBar(){
        if(sys.comboTime > 0){
            this.comboGague.width = 100 * (sys.comboTime / sys.comboTimeMax)
            if(sys.comboTime < sys.comboTimeMax * 0.25 && sys.comboTime % 2 == 0){
                this.comboText.visible = !this.comboText.visible
            }
        }else{
            this.comboGague.visible = false
            this.comboText.visible = false
        }
    }

    updateEnemyblockData(){
        for(let i=0;i<sys.enemys.length;i++){
            const enemy = sys.enemys[i]
            if(this.enemyBlocks.length <= i){
                const b = new Button({
                    id:0, 
                    touchArea: {width:180,height:80},
                    onHighlight: function(isActive){
                        this.endAllRoutine()
                        this.SetValueObj(this.scale,'x',isActive ? [1,1.08] : [1.08,1],10,Easing.easeOutCubic)
                        this.SetValueObj(this.scale,'y',isActive ? [1,1.08] : [1.08,1],10,Easing.easeOutCubic)
                        if(isActive) Am.playSFX('select')
                    },
                    onPress: function(){
                        if(gm.selectedEnemyItem){
                            this.sprite.data.getItem(gm.selectedEnemyItem.data)
                            sys.coin -= gm.selectedEnemyItem.data.price || 0
                            console.log('Enemy item purchased:', gm.selectedEnemyItem.data)
                            const d = gm.selectedEnemyItem // 임시 저장
                            gm.selectedEnemyItem = null // 본인이 아니면 하이라이트 해제를 위한 초기화
                            d.toggleValiable(false)
                            d.onHighlight(false)
                            gm.ui.updateShopButtons()
                            Am.playSFX('ok')
                        }
                    },
                    onToggle: function(toggle){
                        this.alpha = toggle ? 1 : 0.5
                    }
                }
                )
                b.sprite = new GameUIEnemyBlock()
                b.sprite.startRoutine('update', function(self){if(this.whileTime(0)){self.angle = Graph.sin(this.repeat, -5,5,20)}})
                b.addChild(b.sprite)
                b.addUpdate(b.sprite)
                this.enemyBlocks.push(b)
                enemy.blockUI = b.sprite
                this.leftSide.addChild(b)
            }
            const block = this.enemyBlocks[i]
            block.sprite.updateData(enemy)
        }
        const maxHeight = Math.min(GS, sys.enemys.length * 95)
        for(let i=0;i<this.enemyBlocks.length;i++){
            const block = this.enemyBlocks[i]
            block.position.y = i*(maxHeight / this.enemyBlocks.length) + GY
        }
    }
    updateEnemyblockSpawnRate(frame){
        for(let i=0;i<this.enemyBlocks.length;i++){
            const block = this.enemyBlocks[i].sprite
            block.sRInBaseGague.height = 75 * ((frame % sys.enemys[i].spawnRate) / sys.enemys[i].spawnRate)
        }
    }
    openShop(){
        this.endAllRoutine()
        this.updateShopData()
        this.startRoutine('open',function(self){
            for(let i=0;i<self.shopButtons.length;i++){
                if(this.whenTime(5)){
                    self.SetValueObj(self.shopButtons[i].scale,'x',1,60,Easing.easeOutBack)
                    self.SetValueObj(self.shopButtons[i],'angle',0,10,Easing.easeOutBack)
                }
            }
            if(gm.inputGroup != self.shopGroup){
                if(this.whenTime(20)){
                    gm.setInputGroup(self.shopGroup)
                }
            }
        })
    }
    updateShopData(){
        const data = sys.shopData
        this.enemyLeft.data = data.leftEnemy
        this.enemyLeft.purchased = false
        this.enemyLeft.baseSprite.updateData(data.leftEnemy)
        this.enemyRight.data = data.rightEnemy
        this.enemyRight.purchased = false
        this.enemyRight.baseSprite.updateData(data.rightEnemy)

        for(let i=0;i<4;i++){
            this.enemyItemBtns[i].updateData(data.enemyItems[i],true)
        }
        for(let i=0;i<4;i++){
            this.playerItemBtns[i].updateData(data.playerItems[i],false)
        }
        this.updateShopButtons() 
    }
    updateShopButtons(){
        const newEnemyAble = sys.maxEnemyLength > sys.enemys.length

        const hasLeftEnemy = sys.enemys.find(enemy => enemy.enemy === this.enemyLeft.data.enemy);
        this.enemyLeft.toggleValiable((newEnemyAble || hasLeftEnemy) && !this.enemyLeft.purchased)
        const hasRightEnemy = sys.enemys.find(enemy => enemy.enemy === this.enemyRight.data.enemy);
        this.enemyRight.toggleValiable((newEnemyAble || hasRightEnemy) && !this.enemyRight.purchased)
    }
    hideShop(){
        this.endAllRoutine()
        gm.setInputGroup(null)
        this.startRoutine('open',function(self){
            for(let i=0;i<self.shopButtons.length;i++){
                if(this.whenTime(5)){
                    self.SetValueObj(self.shopButtons[i].scale,'x',0,60,Easing.easeOutCubic)
                }
            }
        })
    }

    clearShopRoutine(){
        for(let item of this.shopGroup.items){
            item.endAllRoutine(true)
        }
        gm.selectedEnemyItem = null
    }
}

class EnemyData {
    constructor(data){
        this.enemy = data.enemy
        this.health = data.health
        this.level = 1
        this.blue = data.blue
        this.red = data.red
        this.spawnRate = data.spawnRate
        this.spell = data.spell
        this.items = []

        this.blockUI = null

        this.upgradeBlueRed = data.upgradeBlueRed
    }

    getItem(item){
        if(!item.temporary){
            // 이미 item이 존재하는지 확인
            const existingItem = this.items.find(i => i.data === item);
            if(existingItem){
                existingItem.stack += 1
            } else {
                this.items.push({
                    stack: 1,
                    data:item
                })
            }
        }
        if(item.onEquip){
            item.onEquip.call(this)
        }
        this.blockUI.updateData(this)
    }

    setLevel(level){
        this.level = Math.min(level,10)
        this.blockUI.updateData(this)
    }

    setBlue(value){
        this.blue = value
        this.blockUI.updateData(this)
    }

    setRed(value){
        this.red = value
        this.blockUI.updateData(this)
    }

    setHealth(value){
        this.health = value
    }
}

export class SystemManager {
    constructor(){
        this._blueScore = 0
        this._redScore = 1
        this._coin = 0
        this._score = 0

        this.maxEnemyLength = 8

        this._baseScore = 5000
        this._growthScore = 1.5
        this.reset()
    }

    reset(){
        this.stage = 0
        this.goalScore = 0

        this.blueScore = 0
        this.redScore = 1
        this.coin = 10
        this.score = 0
        this.totalScore = 0

        this.roundTime = 30
        this.liveMax = 2
        this.live = 0

        this.shopData = {
            leftEnemy: '',
            rightEnemy: '',
            enemyItems: ['', '', '', ''],
            playerItems: ['', '', '', '']
        }

        this.timer = 0

        this.combo = 0
        this.comboTime = 0
        this.comboTimeMax = 0
        this.comboTimeDefaultMax = 60
        
        this.enemys = [ ]
        this.bossHealth = 100
        this.bossSpawned = false

        this.rerollPrice = 5

        this.gameover = false
    }

    set coin(value){
        this._coin = value
        if(!gm){return}
        gm.ui.coin.text = String(this._coin)
    }

    get coin(){
        return this._coin
    }

    set score(value){
        this._score = value
        if(!gm){return}
        gm.ui.curScore.text = String(this._score)
    }

    get score(){
        return this._score
    }

    set blueScore(value){
        this._blueScore = value
        if(!gm){return}
        gm.ui.blueScore.text = String(this._blueScore)
        this.updateTotalScore()
    }

    get blueScore(){
        return this._blueScore
    }

    set redScore(value){
        this._redScore = Math.floor(value)
        if(!gm){return}
        if(gm.boss){
            this._redScore = 1
            return
        }
        gm.ui.redScore.text = String(this._redScore)
        this.updateTotalScore()
    }

    get redScore(){
        return this._redScore
    }

    update(){
        this.updateTimer()
    }

    updateTimer(){
        if(this.timer > 0){
            this.setTime(this.timer - 1)
            if(this.timer < 600 && this.timer % 60 == 0){
                Am.playSFX("timer")
            }
        }
        if(this.comboTime > 0){
            this.comboTime--
            if(this.comboTime <= 0){
                this.combo = 0
            }
        }
    }

    updateTotalScore(){
        this.totalScore = Math.floor(this._blueScore * this._redScore)
    }

    setTime(value){
        this.timer = value
        gm.ui.updateTimer()
    }

    addCombo(){
        this.combo++
        this.comboTime = Math.max(10,this.comboTimeDefaultMax - this.combo + 1)
        this.comboTimeMax = this.comboTime
        gm.ui.updateCombo()
    }

    setLive(value){
        this.live = value
        if(this.liveMax < this.live){this.liveMax = this.live}
        gm.ui.updateLive()
    }

    setGoalScore(value){
        this.goalScore = value
        gm.ui.goalScore.text = String(this.goalScore)
    }

    addEnemy(data){
        // 복사해 저장
        // 같은 데이터가 있음
        const existingEnemy = this.enemys.find(enemy => enemy.enemy === data.enemy);
        if(existingEnemy){
            existingEnemy.spawnRate = Math.ceil(Math.max(existingEnemy.spawnRate * 0.5,10))
        }else{
            const enemy = new EnemyData(data)
            this.enemys.push(enemy)
        }
        gm.ui.updateEnemyblockData()
    }
    removeEnemy(data){
        const index = this.enemys.indexOf(data)
        this.enemys.splice(index,1)
        gm.ui.enemyBlocks[index].sprite.die()
        gm.ui.leftSide.removeChild(gm.ui.enemyBlocks[index])
        gm.ui.enemyBlocks.splice(index,1)
        gm.ui.updateEnemyblockData()
    }

    firstStage(){
        this.addEnemy(enemyArcaive.rush)
        this.addEnemy(enemyArcaive.smallBullet)
        this.enemys[0].getItem(enemyItem.coin)
        this.stage = 1
        const constScore = [1000, this._baseScore]
        this.setGoalScore((constScore.length >= this.stage) ? constScore[this.stage-1] : this._baseScore * Math.pow(this._growthScore, this.stage-1))
    }

    startStage(){
        if(this.stage == 0){
            this.firstStage()
        }else{
            for(let enemy of this.enemys){
                enemy.setLevel(enemy.level+1)
            }
        }
        this.setLive(this.liveMax)
        this.score = 0
        this.rerollPrice = 5
        this.bossSpawned = false
        gm.ui.rerollBtn.price.text = String(sys.rerollPrice)
        Am.playSFX("powerGraze")
        this.openShop()
        // this.startRound()
    }

    openShop(){
        const eNegList = Object.keys(enemyItem).filter(key => enemyItem[key].negative)
        const eNotNegList = Object.keys(enemyItem).filter(key => !enemyItem[key].negative)
        const elist = Object.keys(enemyArcaive)
        const eilist = Object.keys(enemyItem)
        const pilist = Object.keys(playerItem)
        this.shopData = {
            leftEnemy: enemyArcaive[elist[getRandom(0, elist.length)]],
            rightEnemy: enemyArcaive[elist[getRandom(0, elist.length)]],
            enemyItems: [
                enemyItem[eNegList[getRandom(0, eNegList.length)]],
                enemyItem[eNegList[getRandom(0, eNegList.length)]],
                enemyItem[eNotNegList[getRandom(0, eNotNegList.length)]],
                enemyItem[eNotNegList[getRandom(0, eNotNegList.length)]]
            ],
            playerItems: Array.from({length: 4}, () => playerItem[pilist[getRandom(0, pilist.length)]]),
        }

        // this.shopData.enemyItems[0] = enemyItem.killEnemy
        // this.shopData.enemyItems[1] = enemyItem.levelUp

        gm.ui.openShop()
    }

    startRound(){
        gm.ui.hideShop()
        gm.endRoutine('round',true)
        gm.startRoutine("round",function(){
            if(this.whenTime(60)){
                gm.effectBox.stageAlert(sys.stage)
                sys.setTime(sys.roundTime*60)
                Am.playSFX("startStage")
                // sys.spawnBoss(bossArcaive[2])
                if(sys.stage % 2 == 0){
                    sys.spawnBoss(bossArcaive[sys.stage /2-1])
                }
            }
            if(this.whileTime(0,sys.timer > 0)){
                gm.ui.updateEnemyblockSpawnRate(this.repeat)
                for(let i=0;i<sys.enemys.length;i++){
                    if(this.repeat % sys.enemys[i].spawnRate != 0){continue}
                    const e = sys.enemys[i]
                    gm.spawnEnemy(pos(getRandom(60,GS-60),-60),e)
                }
            }
            if(this.whenTime(0)){
                Am.playSFX("endStage")
                sys.roundEnd()
            }
            if(sys.score > sys.goalScore){
                if(this.whenTime(120)){
                    sys.stageEnd()
                }
            }else{
                if(this.whenTime(120)){
                    gm.effectBox.killPlayer()
                }
                if(this.whenTime(30)){
                    Am.playSFX("penaltyKill")
                    gm.player.damage()
                }
                if(this.whenTime(30)){
                    sys.startRound()
                }
            }
        })
    }

    beforeRound(){
    }

    roundEnd(){
        if(gm.boss) gm.boss.finalMode = 0
        gm.killAll()
        gm.player.getGodTime(0)
        gm.effectBox.scoreAlert()
        this.score += this.totalScore
        this.blueScore = 0
        this.redScore = 1
        
    }

    stageEnd(){
        gm.killAll()
        if(gm.boss) {gm.boss.finalMode = 1; gm.boss.kill()}
        this.blueScore = 0
        this.redScore = 1
        this.stage++
        this.setGoalScore(Math.floor(this.goalScore * 5))
        this.startStage() // 다음 라운드 시작
    }

    playerKilled(){
        this.setLive(this.live - 1)
    }

    terminatePlayer(){
        gm.effectBox.killPlayer()
    }

    spawnBoss(data){
        gm.startRoutine('spawnBoss',function(self){
            if(this.whenTime(0)){
                if(!sys.bossSpawned){
                    if(!gm.boss || gm.boss._killed){
                        gm.spawnBoss(pos(0,0),data.enemy)
                        gm.boss.MoveTime(pos(GS*0.5,GS*0.25),60,Easing.easeOutCubic)
                        gm.ui.toggleKillBoss(true)
                        sys.bossSpawned = true
                    }
                }
            }
            if(this.whenTime(60)){
                gm.boss.finalMode = 2
                data.health = sys.bossHealth * Math.pow(2, sys.stage - 1)
                gm.activeBoss(data)
            }
        })
    }

    gameOver(){
        this.gameover = true
        Scene.enter(Scene.sceneList.Pause,{mode:'gameover'})
    }
}

export class GameManager extends SceneObject {
    constructor() {
        super()
        this.session = {
            mode: 'new-game'
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
        this.pOptionLayer = new Container()
        this.pShotLayer = new Container({alpha:0.5})
        this.bulletLayer = new Container()

        this.efcEnemyUnder = new Container()
        this.efcBulletAbove = new Container()

        this.ui = new GameUI()
        this.effectBox = new EffectPlayBox()

        this.addUpdate(this.bullets, this.enemys, this.effects, this.items, this.ui)
        this.gameLayer.addChild(this.efcEnemyUnder,this.enemyLayer, this.pShotLayer, this.playLayer, this.pOptionLayer, this.bulletLayer, this.efcBulletAbove)

        this.gameBackGround = new Container()
        this.backGround = Img.sprite('rect', [gameData.resolution[0], gameData.resolution[1]], 'rgb(26, 26, 26)',{anchor:0})
        this.blackGround = Img.sprite('rect', GS+8, 'rgb(255, 255, 255)',{anchor:0,position:{x:GX-4, y:GY-4}})
        this.gameBackGround.addChild(this.backGround, this.blackGround)

        this.playGround = Img.sprite('rect', GS, 'rgb(0, 0, 0)',{anchor:0,position:{x:GX,y:GY}})
        this.gameBackGround.setMask({ mask: this.playGround, inverse: true })
        this.addChild(this.gameBackGround, this.playGround)

        this.addChild(this.ui)


        this.dialog = new GameDialog()
        this.addChild(this.dialog)

        this.showHitCircle = false

        this.selectedEnemyItem = null
    }

    getBullets(){
        return this.bullets.filter(x => x.valiable)
    }

    getEnemys(){
        return this.enemys.filter(x => x.valiable)
    }

    init() {
        this.ui.init()
        this.effectBox.init()
        this.dialog.init()
        this.player = new Player()
        this.addUpdateIndex(this.player,0)
        this.playLayer.addChild(this.player)
    }

    enter(option = null) {
        if(option?.mode == 'new-game'){
            this.startGame()    
        }
    }

    reset(){
        for(let bullet of this.bullets){ bullet.die() }
        for(let enemy of this.enemys){ enemy.die() }
        for(let item of this.items){ item.die() }
        if(this.boss){ this.boss.die() }
        this.endAllRoutine(true)
        this.ui.endAllRoutine(true)
        sys.reset()
        this.ui.reset()
    }

    startGame() {
        Rnd.init()
        this.reset()
        sys.startStage()
    }

    // startRound(){
    //     this.endAllRoutine(true)
    //     const r = new StageRoutine();
    //     r.tag = "stage";
    //     r.self = this
    //     r.route = this.stage.update
    //     this.routes.push(r);
    // }

    spawnBullet(data, color, pos) {
        const bullet = new Bullet()
        bullet.setBullet(data,color)
        bullet.set(pos.x, pos.y)

        this.bullets.push(bullet) // 오브젝트 업데이트
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
        this.bullets.push(lazer) // 오브젝트 업데이트
        return lazer
    }
    spawnBentLazer(color, pos, length, width = 32){
        const bentLazer = new BentLazer(pos, color, length, width)
        this.bullets.push(bentLazer) // 오브젝트 업데이트
        return bentLazer
    }
    spawnEnemy(pos, spell) {
        const enemy = new Enemy()
        enemy.set(pos)
        enemy.applyEnemyData(spell.enemy)
        enemy.activeSpell(spell)

        // enemy.MoveDir(dir, speed)

        this.enemys.push(enemy) // 오브젝트 업데이트
        this.enemyLayer.addChild(enemy) // 스프라이트 레이어
        return enemy
    }
    spawnItem(pos, type){
        const item = new Item(type)
        item.set(pos)
        this.items.push(item) // 오브젝트 업데이트
        this.pOptionLayer.addChild(item) // 스프라이트 레이어
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
        this.effects.push(object)
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
        if(enemy.name){
            this.ui.bossName.text = enemy.name
        }
        this.ui.bossBottomAlert.visible = true
        this.enemys.push(this.boss) // 오브젝트 업데이트
        this.enemyLayer.addChild(this.boss) // 스프라이트 레이어
    }
    spawnKillCircle(pos,radius){
        let circle = new KillCircle(pos,radius)
    }
    activeBoss(spell){
        this.boss.activeSpell(spell)
    }
    bossDead(){
        return this.boss && this.boss.health <= 0
    }

    killAll(killList=['bullet','enemy','boss'],bonus = false){
        if(killList.includes('bullet')){
            for(let bullet of this.bullets){
                bullet.kill()
                if(bonus) sys.blueScore++
                    
            }
        }
        if(killList.includes('enemy')){
            for(let enemy of this.enemys){
                if(enemy.health <= 0){continue}
                if(enemy == gm.boss && !killList.includes('boss')){continue}
                enemy.kill(bonus ? 'player': 'system')
            }
        }
    }


    subUpdate(){
    }


    update() {
        super.update()
        sys.update()
        this.subUpdate()
        this.ui.update()
        this.dialog.update()
        if (Input.isPressed(KeyBind.CANCEL)) {
            Scene.enter(Scene.sceneList.Pause)
        }
    }
}


window.sys = new SystemManager()
window.gm = new GameManager()