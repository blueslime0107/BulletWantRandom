
const enemyArcaive = {
    rush: {
        enemy: EData.stupid,
        health: 3,
        blue: 10,
        red: 0,
        spawnRate: 60,
        spell: function (self) {
            if(this.whenTime(0)){
                self.health = 3 * self.level
                self.MoveDir(lookPoint(self,gm.player),4)
            }
        }
    },
    smallBullet: {
        enemy: EData.normal,
        health: 5,
        blue: 20,
        red: 0,
        spawnRate: 120,
        spell: function (self) {
            if(this.whenTime(0)){
                self.MoveDir(90,2)
            }
            this.whenTime(60)
            if(this.whileTime(2,this.repeat < self.level * 3 + 3)){
                Am.playSFX("tan1")
                gm.spawnBullet(BData.gun,6,self).MoveDirSpdEase(getRandomF(-30,30)+90,8,4,60,Easing.linear)
            }
        }
    },
    redLazer: {
        enemy: EData.redLazer,
        health: 2,
        blue: 10,
        red: 1,
        spawnRate: 40,
        spell: function (self) {
            if(this.whenTime(0)){
                self.MoveDir(90,2)
            }
            if(this.whenTime(60)){
                gm.spawnBentLazer(1,self,12).MoveDir(lookPoint(self,gm.player),8)
                gm.spawnBentLazer(1,self,12).MoveDir(lookPoint(self,gm.player),8).startRoutine("",function(self){
                    if(this.whenTime(0)){
                        this.count = self.dir
                    }
                    if(this.whileTime(0)){
                        self.dir = this.count + Graph.sin(this.repeat+15,-30,30,60)
                    }
                })
                gm.spawnBentLazer(1,self,12).MoveDir(lookPoint(self,gm.player),8).startRoutine("",function(self){
                    if(this.whenTime(0)){
                        this.count = self.dir
                    }
                    if(this.whileTime(0)){
                        self.dir = this.count - Graph.sin(this.repeat+15,-30,30,60)
                    }
                })
            }
        }
    },
    orangeLazer: {
        enemy: EData.orangeLazer,
        health: 5,
        blue: 5,
        red: 1,
        spawnRate: 120,
        spell: function (self) {
            if(this.whenTime(0)){
                self.MoveDirSpdEase(90,10,0,30,Easing.linear)
            }
            if(this.whenTime(60)){
                Am.playSFX("tan2")
                gm.spawnLazer(BData.lazer,2,self.pos,goAngle(self.pos,lookPoint(self,gm.player)-10,1000),60,10).
                startRoutine("",function(self){
                    if(this.whileFrame(60)){
                        self.setDir(self.dir+0.15)
                    }
                })
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
        spawnRate: 80,
        spell: function (self) {
            if(this.whenTime(0)){
                self.MoveDir(90,2)
            }
            this.whenTime(60)
            if(this.whenTime(0)){
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
        spawnRate: 74,
        spell: function (self) {
            if(this.whenTime(0)){
                self.MoveDirSpdEase(90,10,0,30,Easing.linear)
            }
            if(this.whenTime(60)){
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
        blue: 40,
        red: 0,
        spawnRate: 88,
        spell: function (self) {
            if(this.whenTime(0)){
                self.MoveDir(getRandom(-4,4)+90,4)
            }
            this.whenTime(30)
            if(this.whileTime(2,this.repeat < 10)){
                for(let i=0;i<360;i+=90){
                    Am.playSFX("tan1")
                    gm.spawnBullet(BData.ring,3,self).MoveDirSpdEase(i+this.repeat*7.2,1,5,60,Easing.linear)
                }
            }
        }
    },
    electricRush2: {
        enemy: EData.greenSpread,
        health: 20,
        blue: 50,
        red: 0,
        spawnRate: 77,
        spell: function (self) {
            if(this.whenTime(0)){
                self.MoveDir(getRandom(-4,4)+90,4)
            }
            this.whenTime(30)
            if(this.whileTime(5,this.repeat < 10)){
                const rnd = getRandom(0,119)
                for(let i=0;i<360;i+=120){
                    Am.playSFX("tan1")
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
        spawnRate: 128,
        spell: function (self) {
            if(this.whenTime(0)){
                self.MoveDir(getRandom(-4,4)+90,4)
            }
            if(this.whenTime(40)){
                gm.spawnBullet(BData.veryBig,0,self).MoveDirSpdEase(lookPoint(self,gm.player),8,0,60,Easing.linear).startRoutine("",function(self){
                    this.whenTime(60)
                    if(this.whileTime(5,this.repeat<6)){
                        for(let i=0;i<5;i++){
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
                        for(let i=0;i<360;i+=90){
                            this.list.push(gm.spawnLazer(BData.spear,1,self.pos,goAngle(self.pos,i+rnd,300),60,60))
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

const enemyItem = {
    coin: {
        imageId: 0,
        price:8,
        onDeath: function(){
            sys.coin += 1
        }
    },
    killCircle: {
        imageId: 2,
        price:12,
        onDeath: function(){
            gm.spawnKillCircle(this.pos)
        }
    },
    levelUp: {
        temporary: true,
        negative: true,
        imageId: 3,
        onEquip: function(){
            this.setLevel(this.level+1)
            this.setBlue(this.blue*2)
            this.setRed(this.red*2)
        }
    },
    counterBullet: {
        imageId: 4,
        negative: true,
        onDeath: function(){
            const enemy = this
            const dir = lookPoint(enemy,gm.player)
            gm.startRoutine("counterBullet",function(self){
                if(this.whileTime(5,this.repeat<6)){
                    gm.spawnBullet(BData.kunai,1,enemy).MoveDir(dir+getRandom(-5,5),10)
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
            this.setBlue(this.blue*2)
            this.setRed(this.red*2)
        }
    },
    barrier: {
        imageId: 7,
        negative: true,
        onSpawn: function(){
            this.getGodTime(60)
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
                                self.dir = getHomingAngle(self.dir,lookPoint(self,this.enemy),5)
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
    // optionSquare: {
    //     imageId: 3
    // },
    speedUp: {
        imageId: 4,
        price: 50,
        onEquip: function(){
            this.speed += 2
        }
    },
    // barrier: { 
    //     imageId: 5
    // },
    // grazeArea: {
    //     imageId: 6
    // }
}