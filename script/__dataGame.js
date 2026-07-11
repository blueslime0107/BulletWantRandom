
const enemyArcaive = {
    rush: {
        enemy: EData.stupid,
        health: 3,
        blue: 10,
        red: 0,
        upgradeBlueRed: {blue: 5, red: 0},
        spawnRate: 60,
        spell: function (self) {
            let time = [120,80,60,50,40,30,20,15,10][self.level-1]
            if(this.whenTime(0)){
                self.health = 3 * self.level
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
        blue: 20,
        red: 0,
        upgradeBlueRed: {blue: 10, red: 0},
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
        blue: 0,
        red: 1,
        upgradeBlueRed: {blue: 1, red: 1},
        spawnRate: 40,
        spell: function (self) {
            if(this.whenTime(0)){
                self.MoveDir(90,1)
            }
            this.whenTime(30)
            if(this.whenTime(60)){
                Am.playSFX("lazer")
                for(let i=0;i<self.level;i++){
                gm.spawnBentLazer(1,self,12).MoveDir(lookPoint(self,gm.player)+getRandom(-10,10),8).startRoutine('',function(self){
                    if(this.whenTime(0)){
                        self.count = getRandomF(0.1,0.5)
                    }
                    if(this.whileTime(0)){
                        self.dir += self.count
                    }
                })
            }
            }
        }
    },
    orangeLazer: {
        enemy: EData.orangeLazer,
        health: 20,
        blue: 5,
        red: 1,
        upgradeBlueRed: {blue: 5, red: 1},
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
        blue: 30,
        red: 0,
        upgradeBlueRed: {blue: 60, red: 0},
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
        blue: 15,
        red: 1,
        upgradeBlueRed: {blue: 5, red: 1},
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
        blue: 50,
        red: 0,
        upgradeBlueRed: {blue: 50, red: 1},
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
        health: 50,
        blue: 20,
        red: 1,
        upgradeBlueRed: {blue: 30, red: 2},
        spawnRate: 120,
        spell: function (self) {
            if(this.whenTime(0)){
                self.MoveDir(getRandom(-4,4)+90,4)
            }
            this.whenTime(30)
            if(this.whileTime(5,this.repeat < 4 + 2*self.level)){
                const rnd = getRandom(0,119)
                for(let i=0;i<360;i+=120){
                    Am.playSFX("tan2")
                    gm.spawnBullet(BData.ring,4,self).MoveDirSpdEase(i+rnd,5,getRandomF(2,3),60,Easing.linear)
                }
            }
        }
    },
    bomb1: {
        enemy: EData.whiteBomb,
        health: 10,
        blue: 20,
        red: 2,
        upgradeBlueRed: {blue: 100, red: 0},
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
        health: 10,
        blue: 20,
        red: 2,
        upgradeBlueRed: {blue: 0, red: 3},
        spawnRate: 128,
        spell: function (self) {
            if(this.whenTime(0)){
                self.MoveDir(getRandom(-4,4)+90,4)
            }
            if(this.whenTime(60)){
                gm.spawnBullet(BData.light,1,self).MoveDirSpdEase(getRandom(0,360),4,0,60,Easing.linear).startRoutine("",function(self){
                    if(this.whenTime(0)){
                        this.list = []
                        const rnd = getRandomList([0,45])
                        Am.playSFX("lazer")
                        for(let i=0;i<360;i+=90){
                            this.list.push(gm.spawnLazer(BData.spear,1,self.pos,goAngle(self.pos,i+rnd,300),60,50+10*self.level))
                        }
                    }
                    if(this.whileTime(0,this.repeat < 60)){
                        for(const lazer of this.list){
                            lazer.startPos = self.pos
                            lazer.endPos = goAngle(self.pos,lazer.dir,300)
                            lazer.replaceBullet()
                        }
                    }
                    if(this.whenTime(0)){self.kill()}
                }).blendMode = "add"
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
                    gm.spawnBullet(BData.gun,6,self).MoveDirSpdEase(i,8,getRandomF(3,5),60,Easing.linear)
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
                    })
                    gm.spawnBentLazer(2,self,40).MoveDir(i,6)
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
                    })
                }
            }
        }
    }
]


const enemyItem = {
    coin: {
        imageId: 0,
        price:8,
        onDeath: function(){
            sys.coin += 1 * Math.floor(this.maxHealth / 3 * this.level)
        }
    },
    killCircle: {
        imageId: 2,
        price:12,
        onDeath: function(stack){
            gm.spawnKillCircle(this.pos,30+20*stack)
        }
    },
    levelUp: {
        temporary: true,
        negative: true,
        imageId: 3,
        onEquip: function(){ // onEquip의 this는 EnemyData다
            this.setLevel(this.level+1)
            this.setBlue(this.blue + this.upgradeBlueRed.blue)
            this.setRed(this.red + this.upgradeBlueRed.red)
        }
    },
    counterBullet: {
        imageId: 4,
        negative: true,
        onDeath: function(stack){
            const enemy = this
            const dir = lookPoint(enemy,gm.player)
            gm.startRoutine("counterBullet",function(self){
                if(this.whileTime(Math.max(1,6-stack),this.repeat<6*stack)){
                    Am.playSFX("tan1")
                    gm.spawnBullet(BData.kunai,1,enemy).MoveDir(dir+getRandom(-3,3),10)
                }
            })
        }
    },
    healthUP: {
        imageId: 5,
        temporary: true,
        negative: true,
        onEquip: function(){
            this.setHealth(this.health*2)
            this.setBlue(this.blue + this.upgradeBlueRed.blue)
            this.setRed(this.red + this.upgradeBlueRed.red)
        }
    },
    barrier: {
        imageId: 7,
        negative: true,
        onSpawn: function(stack){
            this.getGodTime(40*stack)
        },
        onEquip: function(){
            this.setBlue(this.blue + this.upgradeBlueRed.blue)
            this.setRed(this.red + this.upgradeBlueRed.red)
        }
    },
    killEnemy: {
        imageId: 1,
        price: 20,
        onEquip: function(){
            sys.removeEnemy(this)
        }
    }
}

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
                this.x = gm.player.x + centerSpread(length,38,this.index)
                this.y = gm.player.y + 32
            }
            option.updateShot = function(shotCount){
                if(shotCount % 5 == 0){
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
    speedUp: {
        imageId: 4,
        price: 50,
        onEquip: function(){
            this.speed += 2
        }
    },
    healthUp: {
        imageId: 5,
        price: 100,
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

    }
    // barrier: { 
    //     imageId: 5
    // },
}