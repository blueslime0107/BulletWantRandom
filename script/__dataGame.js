/**
 * @typedef {{enemy: EDataObject, health: number, color: string, value: number, upgrade: number, spawnRate: number}} EnemyDataBase
 */
/** @type {Record<string, EnemyDataBase>} */
const enemyArcaive = {
    rush: {
        enemy: EData.stupid,
        health: 3,
        color: 'blue',
        value: 10,
        upgrade: 5,
        spawnRate: 60,
        spell: function (self) {
            let time = [120,80,60,50,40,30,20,15,10][self.level-1]
            if(this.whenTime(0)){
                self.MoveDir(lookPoint(self,gm.player),4)
            }
            if(self.level > 1){
                if(this.whileFrame(360)){
                    if(this.repeat % time == 0){
                        Am.playSFX("tan2")
                        gm.spawnBullet(BData.snow,6,self).MoveDirSpdEase(getRandom(0,360),5,1,30,Easing.linear)
                    }
                }
            }
        }
    },
    smallBullet: {
        enemy: EData.normal,
        health: 5,
        color: 'red',
        value: 1,
        upgrade: 1,
        spawnRate: 120,
        spell: function (self) {
            if(this.whenTime(0)){
                self.MoveDir(90,2)
            }
            this.whenTime(60)
            if(this.whileTime(2,this.repeat < self.level * 3 + 3)){
                Am.playSFX("tan1")
                gm.spawnBullet(BData.gun,6,self).MoveDirSpdEase(getRandomF(-30,30)+90,8,getRandomF(3,5),60,Easing.linear)
            }
        }
    },
    redLazer: {
        enemy: EData.redLazer,
        health: 5,
        color: 'red',
        value: 2,
        upgrade: 2,
        spawnRate: 240,
        spell: function (self) {
            if(this.whenTime(0)){
                self.MoveDir(90,1)
            }
            this.whenTime(90)
            if(this.whileTime(5,this.repeat < self.level)){
                Am.playSFX("lazer")
                gm.spawnBentLazer(1,self,24).MoveDir(lookPoint(self,gm.player)+getRandom(-10,10),4).startRoutine('',function(self){
                    if(this.whenTime(0)){
                        self.count = getRandomF(0.1,0.5)
                    }
                    if(this.whileTime(0)){
                        self.dir += self.count
                    }
                })
            }
        }
    },
    orangeLazer: {
        enemy: EData.orangeLazer,
        health: 20,
        color: 'red',
        value: 1,
        upgrade: 1,
        spawnRate: 120,
        spell: function (self) {
            if(this.whenTime(0)){
                self.MoveDirSpdEase(90,10,0,30,Easing.linear)
            }
            if(this.whenTime(60)){
                Am.playSFX("lazer")
                let list = centerSpread(self.level,[80,80,64,64,48,48,32,32,16,16][self.level-1])
                for(let i=0;i<list.length;i++){
                    let pos = {x:self.pos.x+list[i],y:self.pos.y}
                    gm.spawnLazer(BData.lazer,2,pos,goAngle(pos,90+getRandomF(-5,5),900),60,[10,10,10,10,20,20,20,30,30,30,40][self.level-1])
                }
                // startRoutine("",function(self){
                //     if(this.whileFrame(60)){
                //         self.setDir(self.dir+0.15)
                //     }
                // })
            }
            if(this.whenTime(120)){
                self.MoveDirSpdEase(getRandom(-5,5)+90,0,3,60,Easing.linear)
            }
        }
    },
    growingBullet: {
        enemy: EData.cyanBigger,
        health: 20,
        color: 'blue',
        value: 30,
        upgrade: 60,
        spawnRate: 80,
        spell: function (self) {
            if(this.whenTime(0)){
                self.MoveDirSpdEase(90+getRandom(-3,3),6,0,60,Easing.linear)
                self.startRoutine('',function(self){
                    if(this.whileTime(60)){
                        self.MoveDirSpdEase(90+getRandom(-3,3),4,0,60,Easing.linear)
                    }
                })
            }
            if(this.whileTime([60,60,60,45,45,45,30,30,30,15][self.level-1],this.repeat<[1,2,3,4,5,6,7,8,9,10][self.level-1])){
                Am.playSFX("kira1")
                gm.spawnBullet(BData.spear,5,self).MoveDirSpdEase(lookPoint(self,gm.player),8,2,60,Easing.linear)
                .startRoutine("",function(self){
                    if(this.whileTime(0)){
                        self.setScale(1+this.repeat/60)
                    }
                })
            }
        }
    },
    homingBullet: {
        enemy: EData.pinkHoming,
        health: 15,
        color: 'blue',
        value: 15,
        upgrade: 5,
        spawnRate: 74,
        spell: function (self) {
            if(this.whenTime(0)){
                self.MoveDirSpdEase(90,10,0,30,Easing.linear)
            }
            this.whenTime(30)
            if(this.whileTime(20,this.repeat < self.level)){
                Am.playSFX("tan2")
                gm.spawnBullet(BData.paper,7,self).MoveDirSpdEase(90,8,4,30,Easing.linear)
                .startRoutine("",function(self){
                    if(this.whileTime(0)){
                        self.dir = getHomingAngle(self.dir,lookPoint(self,gm.player),5)
                        if(getDist(self,gm.player) < 100){
                            this.endWhile()
                        }
                    }
                })
            }
            if(this.whenTime(120)){
                self.MoveDirSpdEase(getRandom(-5,5)+90,0,3,60,Easing.linear)
            }
        }
    },
    electricRush: {
        enemy: EData.yellowSpread,
        health: 10,
        color: 'blue',
        value: 50,
        upgrade: 50,
        spawnRate: 120,
        spell: function (self) {
            if(this.whenTime(0)){
                self.MoveDir(getRandom(-4,4)+90,4)
            }
            this.whenTime(30)
            if(this.whileTime(2,this.repeat < 5 + 2*self.level)){
                for(let i=0;i<360;i+=90){
                    Am.playSFX("tan1")
                    gm.spawnBullet(BData.ring,3,self).MoveDirSpdEase(i+this.repeat*7.2,1,5,60,Easing.linear)
                }
            }
        }
    },
    electricRush2: {
        enemy: EData.greenSpread,
        health: 70,
        color: 'blue',
        value: 50,
        upgrade: 50,
        spawnRate: 240,
        spell: function (self) {
            if(this.whenTime(0)){
                self.MoveDirSpdEase(getRandom(-4,4)+90,6,0,60,Easing.linear)
            }
            if(this.whenTime(30)){
                this.count = 1
                self.MoveDirSpdEase(getRandom(0,360),4,0,120,Easing.linear)
            }
            if(this.whileTime(5,this.repeat < 4 + 2*self.level)){
                const rnd = getRandom(0,119)
                for(let i=0;i<360;i+=120){
                    Am.playSFX("tan2")
                    gm.spawnBullet(BData.ring,4,self).MoveDirSpdEase(i+rnd,5,getRandomF(2,3),60,Easing.linear)
                }
            }
            if(this.whenTime(120)){
                this.currentLine = 1
            }
            if(this.count == 1){
                self.x = Math.max(200,Math.min(GS-200,self.x))
                self.y = Math.max(100,Math.min(280,self.y))
            }
        }
    },
    bomb1: {
        enemy: EData.whiteBomb,
        health: 10,
        color: 'blue',
        value: 30,
        upgrade: 20,
        spawnRate: 128,
        spell: function (self) {
            if(this.whenTime(0)){
                self.MoveDir(getRandom(-4,4)+90,4)
            }
            if(this.whenTime(40)){
                const level = self.level + 3
                gm.spawnBullet(BData.veryBig,0,self).MoveDirSpdEase(lookPoint(self,gm.player),8,0,60,Easing.linear).startRoutine("",function(self){
                    this.whenTime(60)
                    if(this.whileTime(5,this.repeat<6)){
                        Am.playSFX("tan3")
                        for(let i=0;i<level;i++){
                            gm.spawnBullet(BData.circle,0,self).MoveDirSpdEase(getRandom(0,360),7,getRandomF(1,4),30,Easing.linear).blendMode = "add"
                        }
                        self.setScale((6-this.repeat)/12)
                    }
                    if(this.whenTime(0)){self.kill()}
                }).blendMode = "add"
            }
        }
    },
    bomb2: {
        enemy: EData.redCross,
        health: 100,
        color: 'red',
        value: 2,
        upgrade: 3,
        spawnRate: 360,
        spell: function (self) {
            if(this.whenTime(0)){
                self.MoveDirSpdEase(getRandom(-4,4)+90,5,0,180,Easing.linear)
            }
            if(this.whenTime(120)){
                const enemy = self
                gm.spawnBullet(BData.light,1,self).MoveDirSpdEase(lookPoint(self,gm.player)+getRandom(-30,30),4,0,60,Easing.linear).startRoutine("",function(self){
                    if(this.whenTime(0)){
                        this.list = []
                        const rnd = getRandomList([0,45])
                        Am.playSFX("lazer")
                        for(let i=0;i<360;i+=[90,90,60,60,45,45,30,30,15,15][enemy.level-1]){
                            this.list.push(gm.spawnLazer(BData.spear,1,self.pos,goAngle(self.pos,i+rnd,[100,150,200,250,300,320,340,360,360,360][enemy.level-1]),60,60))
                        }
                    }
                    if(this.whileTime(0,this.repeat < 60)){
                        for(const lazer of this.list){
                            lazer.startPos = self.pos
                            lazer.endPos = goAngle(self.pos,lazer.dir,300)
                            lazer.setDir(lazer.dir+0.5)
                            lazer.replaceBullet()
                        }
                    }
                    if(this.whenTime(0)){self.kill()}
                }).blendMode = "add"
            }
            if(this.whenTime(120)){
                self.MoveDirSpdEase(getRandom(-4,4)+90,0,3,60,Easing.linear)
            }
        }
    }
}

const bossArcaive = [
    {
        enemy: EData.normal,
        spell: function (self) {
            if(this.whileTime(40)){
                Am.playSFX("tan1")
                for(let i=0;i<360;i+=10){
                    gm.spawnBullet(BData.gun,6,self).MoveDirSpdEase(i,8,getRandomF(3,5),60,Easing.linear).noBonusKill = true
                }
                if(this.repeat % 3 == 0){
                    self.MoveTime(pos(GS*0.5+getRandom(-100,100),GS*0.25+getRandom(-20,40)),30,Easing.easeInOutCubic)
                }
            }
        }
    },
    {
        enemy: EData.redLazer,
        spell: function (self) {
            if(this.whenTime(0)){this.frame = 110}
            if(this.whileTime(120)){
                Am.playSFX("lazer")
                for(let i=0;i<360;i+=30){
                    gm.spawnBentLazer(1,self,40).MoveDir(i,6).startRoutine('',function(self){
                        if(this.whileFrame(60)){
                            self.dir += 1
                        }
                    }).noBonusKill = true
                    gm.spawnBentLazer(2,self,40).MoveDir(i,6).noBonusKill = true
                }
                self.MoveTime(pos(gm.player.x,GS*0.25+getRandom(-20,40)),60,Easing.easeInCubic)
            }
        }
    },
    {
        enemy: EData.cyanBigger,
        spell: function (self) {
            if(this.whenTime(0)){this.frame = 110}
            if(this.whileTime(120)){
                Am.playSFX("kira1")
                for(let i=0;i<360;i+=60){
                    gm.spawnBullet(BData.spear,5,self).MoveDir(i+this.repeat*4.7,4).startRoutine("",function(self){
                        if(this.whileTime(0,self.count < 3)){
                            if(self.x < 0 || self.x > GS){
                                self.dir = 180 - self.dir
                                self.count++
                            }
                            if(self.y < 0 || self.y > GS){
                                self.dir = -self.dir
                                self.count++
                            }
                            self.setScale(1+this.repeat/60)
                        }
                    }).noBonusKill = true
                }
            }
        }
    },
    {
        enemy: EData.pinkHoming,
        spell: function (self) {
            if(this.whenTime(10)){
                Am.playSFX("tan2")
                for(let i=0;i<360;i+=30){
                    for(let j=0;j<2;j++){
                        gm.spawnBullet(BData.paper,7,self).MoveDirSpdEase(i+this.repeat*4.7,[4,8][j],0,60,Easing.linear).startRoutine("",function(self){
                            if(this.whenTime(90)){
                                Am.playSFX("kira2")
                                self.MoveDirSpdEase(lookPoint(self,gm.player),4,0,60,Easing.linear)
                            }
                            if(this.whenTime(60)){
                                Am.playSFX("kira2")
                                self.MoveDir(lookPoint(self,gm.player),4)
                            }
                        }).noBonusKill = true
                    }
                }
            }
            if(this.whenTime(90)){
                self.MoveTime(pos([getRandom(100,200),getRandom(200,480),getRandom(480,580)][this.count % 3],getRandom(100,280)),60,Easing.easeInOutCubic)
                this.count++
            }
            if(this.whileTime(10,this.repeat < 3)){
                for(let i=0;i<360;i+=20){
                    for(let j=0;j<2;j++){
                        gm.spawnBullet(BData.paper,8,self).MoveDirSpdEase(i+this.repeat*4.7,0,[4,6][j],60,Easing.linear).noBonusKill = true
                    }
                }
            }
            if(this.whenTime(60)){
                this.currentLine = 0
            }
        }
    },
    {
        enemy: EData.yellowSpread,
        spell: function (self) {
            if(this.whenTime(10)){
                Am.playSFX("kira1")
                self.startRoutine('',function(self){
                    if(this.whenTime(0)){this._pos = self.pos}
                    if(this.whileTime(2,this.repeat < 20)){
                        for(let i=0;i<360;i+=90){
                            let bullet = gm.spawnBullet(BData.ring,3,pos(this._pos.x,this._pos.y+this.repeat*20))
                            .MoveDirSpdEase(i+this.repeat*8.2,5,0,20,Easing.linear)
                            .startRoutine('',function(self){if(this.whenTime(20)){self.MoveDirSpdEase(self.dir,0,6,120,Easing.linear)}})
                            bullet.blendMode = "add"
                            bullet.noBonusKill = true
                        }
                    }
                })
            }
            if(this.whenTime(90)){
                self.MoveTime(pos(gm.player.x+getRandom(-20,20), getRandom(150,250)),60,Easing.easeInOutCubic)
            }
            if(this.whenTime(10)){
                this.currentLine = 0
            }
        }
    },
    {
        enemy: EData.greenSpread,
        spell: function (self) {
            if(this.whileTime(4)){
                Am.playSFX("tan1")
                self.startRoutine('',function(self){
                    for(let i=0;i<5;i++){
                        let b = gm.spawnBullet([BData.circle,BData.darksnow,BData.big,BData.oval,BData.veryBig][i],4,self).MoveDir(getRandom(0,360),getRandomF(4,8)).blendMode = "add"
                        b.noBonusKill = true
                    }
                })
            }
        }
    },
    {
        enemy: EData.orangeLazer,
        spell: function (self) {
            if(this.whenTime(0)){
                this.count =  lookPoint(self,gm.player)
            }
            if(this.whileTime(2,this.repeat<12)){
                Am.playSFX("lazer1")
                for(let i=0;i<2;i++){
                    const startPos = goAngle(self.pos,this.count-90+180*i,(this.repeat-1)*15)
                    gm.spawnLazer(BData.lazer,2,startPos,goAngle(startPos,this.count,900),60,30).noBonusKill = true
                }
            }
            if(this.whenTime(60)){
                self.MoveDirSpdEase([0,180][getRandom(0,2)],3,0,60,Easing.linear)
            }
            if(this.whenTime(60)){
                this.currentLine = 0
            }
            self.x = Math.max(100,Math.min(GS-100,self.x))
        }
    },


]

/** @typedef {{imageId:number, price: number, accessorie: boolean, negative?: boolean, onDeath?: Function, onEquip?: Function, onSpawn?: Function}} ItemObject */
/** @type {Object.<string, ItemObject>} */
const enemyItem = {
    coin: {
        imageId: 0,
        price:8,
        accessorie: true,
        onDeath: function(stack){
            const value = enemyItem.coin.coinFunc(this.maxHealth, this.level, stack)
            sys.coin += value
            gm.effectBox.spawnNumberBubble(this,value,'rgb(252, 255, 48)')
        },
        coinFunc: function(health,level,stack){
            return stack * Math.floor(health / 3 * level)
        }
    },
    killCircle: {
        imageId: 2,
        price:12,
        accessorie: true,
        onDeath: function(stack){
            gm.spawnKillCircle(this.pos,30+20*stack,'enemy')
        }
    },
    levelUp: {
        imageId: 3,
        accessorie: false,
        negative: true,
        onEquip: function(){ // onEquip의 this는 EnemyData다
            this.setLevel(this.level+1)
            this.setValue(this.value + this.upgrade)
        }
    },
    counterBullet: {
        imageId: 4,
        accessorie: false,
        negative: true,
        onDeath: function(stack){
            const enemy = this
            const dir = lookPoint(enemy,gm.player)
            gm.startRoutine("counterBullet",function(self){
                if(this.whileTime(Math.max(1,6-stack),this.repeat<2*stack)){
                    Am.playSFX("tan1")
                    gm.spawnBullet(BData.kunai,1,enemy).MoveDir(dir+getRandom(-3,3),10)
                }
            })
        }
    },
    healthUP: {
        imageId: 5,
        accessorie: false,
        negative: true,
        onEquip: function(){
            this.setHealth(this.health*2)
            this.setValue(this.value + this.upgrade)
        }
    },
    barrier: {
        imageId: 8,
        accessorie: false,
        negative: true,
        onSpawn: function(stack){
            this.getGodTime(40*stack)
        },
        onEquip: function(){
            this.setValue(this.value + this.upgrade)
        }
    },
    killEnemy: {
        imageId: 1,
        price: 20,
        accessorie: false,
        onEquip: function(){
            sys.removeEnemy(this)
        }
    },
    // killCircleBarrier: {
    //     imageId: 6,
    //     price: 5,
    //     negative: true,
    //     static: true, // 하나만 획득 가능
    //     onDamage: function(stack,count,attacker){
    //         if(attacker == 'killCircle'){
    //             this.health += count
    //         }
    //     }
    // },
    lucky: {
        imageId: 7,
        price: 100,
        accessorie: true,
        onDeath: function(stack){
            if(getRandom(0,100) < 10*stack){
                this.whenDeadScore()
                this.whenDeadScore()
                this.whenDeadScore()
                this.whenDeadScore()
                this.whenDeadScore()
            }
        }
    },
    healthDown: {
        imageId: 9,
        price: 300,
        accessorie: false,
        onEquip: function(){
            this.setHealth(this.data.health)
        }
    },
    timer: {
        imageId: 10,
        price: 20,
        accessorie: false,
        negative: true,
        onEquip: function(){
            this.setSpawnRate(Math.ceil(this.spawnRate * 0.7))
        }
    },
    accessoriePower: {
        imageId: 11,
        price: 20,
        accessorie: false,
        onEquip: function(){
            if(this.accessorie){
                this.accessorie.stack = this.items.find(i => i.data == enemyItem.accessoriePower)?.stack+1 || 1
            }
        }
    }
}
/** @type {{ [key: string]: ItemObject }} */
const playerItem = {
    shotUp: {
        imageId: 0,
        price: 75,
        onEquip: function(){
            this.power++
        }
    },
    optionCircle: {
        imageId: 1,
        price: 100,
        onEquip: function(){
            if(!this.options.circle) {
                this.options.circle = new GameObjectGroup()
                gm.addUpdate(this.options.circle)
            }
            const option = new GameObject()
            option.sprite = new Sprite({
                texture: Textures.playerOptionCircle,
                scale: 2,
                anchor: 0.5
            })
            option.addChild(option.sprite)
            option.update = function(){
                const length = gm.player.options.circle.length
                const pos = goAngle(gm.player, 360 * this.index / length + gm.player.shotCount*2, 64)
                this.x = pos.x
                this.y = pos.y
            }
            option.updateShot = function(shotCount){
                if(shotCount % 8 == 0){
                    gm.player.spawnShot({texture:Img.texture.playerSubShotCircle, scale:2,anchor:0.5}, 5, this)
                    .MoveDir(-90,10).startRoutine("",function(self){
                        if(this.whileTime(0)){
                            self.angle = self.dir
                            if(!this.enemy){
                                for(let enemy of gm.getEnemys()){
                                    if(getDist(self,enemy) < 200){
                                        this.enemy = enemy
                                        break
                                    }
                                }
                            }else{
                                self.dir = getHomingAngle(self.dir,lookPoint(self,this.enemy),10)
                                if(!this.enemy.valiable){
                                    this.enemy = null
                                    this.endWhile()
                                }
                            }
                        }
                    }).angle = -90
                }
            }
            option.index = this.options.circle.length


            
            this.options.circle.push(option)
            gm.pOptionLayer.addChild(option)
        }
    },
    optionTri: {
        imageId: 2,
        price: 50,
        onEquip: function(){
            if(!this.options.triangle) {
                this.options.triangle = new GameObjectGroup()
                gm.addUpdate(this.options.triangle)
            }
            const option = new GameObject()
            option.sprite = new Sprite({
                texture: Textures.playerOptionTriangle,
                scale: 2,
                anchor: 0.5
            })
            option.addChild(option.sprite)
            option.update = function(){
                const length = gm.player.options.triangle.length
                const pos = goAngle(gm.player, centerSpread(length,40,this.index)-90, 64)
                this.x = pos.x
                this.y = pos.y
            }
            option.updateShot = function(shotCount){
                if(shotCount % 5 == 0){
                    const side = getSide(this.index, gm.player.options.triangle.length)
                    const add = side == 1 ? 15 : 0
                    const angle = side != 0 ? Graph.sin(shotCount/5+add,-10,10,30)-90 : -90
                    gm.player.spawnShot({texture:Img.texture.playerSubShotTriangle, scale:2,anchor:0.5,angle:20+angle}, 5, this).MoveDir(20+angle,20)
                    gm.player.spawnShot({texture:Img.texture.playerSubShotTriangle, scale:2,anchor:0.5,angle:-20+angle}, 5, this).MoveDir(-20+angle,20)
                }
            }
            option.index = this.options.triangle.length

            this.options.triangle.push(option)
            gm.pOptionLayer.addChild(option)
        }
    },
    optionSquare:{
        imageId: 3,
        price: 200,
        onEquip: function(){
            if(!this.options.square) {
                this.options.square = new GameObjectGroup()
                gm.addUpdate(this.options.square)
            }
            const option = new GameObject()
            option.sprite = new Sprite({
                texture: Textures.playerOptionSquare,
                scale: 2,
                anchor: 0.5
            })
            option.addChild(option.sprite)
            option.update = function(){
                this.x = gm.player.x
                this.y = gm.player.y + this.index *20 + 48
            }
            option.updateShot = function(shotCount){
                if(shotCount % 4 == 0){
                    gm.player.spawnShot({texture:Img.texture.playerSubShotSquare, scale:2,anchor:0.5}, 5, this)
                    .MoveDir(-90,40).startRoutine("",function(self){
                        if(this.whileTime(0)){
                            self.x = gm.player.x
                        }
                    }).angle = -90
                }
            }
            option.index = this.options.square.length

            
            this.options.square.push(option)
            gm.pOptionLayer.addChild(option)
        }
    },
    speedUp: {
        imageId: 4,
        price: 50,
        onEquip: function(){
            this.speed += 1
        }
    },
    healthUp: {
        imageId: 5,
        price: 100,
        priceFormula: function(){
            return 100 * Math.max(1, (sys.liveMax - 2) * 5)
        },
        onEquip: function(){
            sys.liveMax += 1
            sys.setLive(sys.liveMax)
        }
    },
    bombPowerget: {
        imageId: 6,
        price: 200,
        onGraze: function(stack){
            gm.player.setBombPower(gm.player.bombPower + stack)
        }
    },
    bombSpeedUp: {
        imageId: 8,
        price: 30,
        onEquip: function(){
            gm.player.bombSpeed += 0.5
        }
    },
    bombRadiusUp: {
        imageId: 7,
        price: 200,
        onEquip: function(){
            gm.player.bombRadius += 0.5
        }
    },
    grazeRadiusUp: {
        imageId: 9,
        price: 200,
        onEquip: function(){
            gm.player.grazeRadius += 12
        }
    },
    shopReroll: {
        imageId: 10,
        price: 5000,
        accessorie: true,
        onReroll: function(){
            this.shopRerollConsumed = this.shopRerollConsumed || false
            if(!gm.ui.enemyLeft.purchased){return}
            if(!gm.ui.enemyRight.purchased){return}
            for(let i=0;i<4;i++){
                if(!gm.ui.enemyItemBtns[i].purchased){return}
            }
            for(let i=0;i<4;i++){
                if(!gm.ui.playerItemBtns[i].purchased){return}
            }
            gm.ui.enemyLeft.purchased = false; gm.ui.enemyLeft.toggleValiable(true)
            gm.ui.enemyRight.purchased = false; gm.ui.enemyRight.toggleValiable(true)
            for(let i=0;i<4;i++){
                gm.ui.enemyItemBtns[i].purchased = false; gm.ui.enemyItemBtns[i].toggleValiable(true)
                gm.ui.playerItemBtns[i].purchased = false; gm.ui.playerItemBtns[i].toggleValiable(true)
            }
            this.shopRerollConsumed = true
        },
        onRoundEnd: function(){
            this.shopRerollConsumed = false
        }
    },
    goldEqualsBlue: {
        imageId: 11,
        price: 1000,
        accessorie: true,
        onRoundEnd: function(){
            sys.blueScore += sys.coin
        }
    },
    autoBomb: {
        imageId: 12,
        price: 1500,
        accessorie: true,
        onDeath: function(stack){
            if(this.ableToTriggerBomb()){
                this.deathCancel = true
                this.triggerBomb()
            }
        }
    }
}