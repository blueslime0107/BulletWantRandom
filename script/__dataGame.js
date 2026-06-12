const enemyArcaive = {
    rush: {
        enemy: "slime1",
        health: 1,
        blue: 10,
        red: 0,
        spawnRate: 60,
        spell: function (self) {
            if(this.whenTime(0)){
                self.MoveDir(lookPoint(self,gm.player),4)
            }
        }
    },
    smallBullet: {
        enemy: "butterfly2",
        health: 3,
        blue: 0,
        red: 1,
        spawnRate: 117,
        spell: function (self) {
            if(this.whenTime(0)){
                self.MoveDir(90,2)
            }
            this.whenTime(60)
            if(this.whileTime(2,this.repeat < 10)){
                Am.playSFX("tan1")
                gm.spawnBullet(BData.gun,6,self).MoveDirSpdEase(getRandomF(-30,30)+90,8,4,60,Easing.linear)
            }
        }
    },
    redLazer: {
        enemy: "snake1",
        health: 2,
        blue: 2,
        red: 3,
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
        enemy: "snake1",
        health: 5,
        blue: 2,
        red: 3,
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
        enemy: "bird1",
        health: 2,
        blue: 2,
        red: 3,
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
        enemy: "bird1",
        health: 2,
        blue: 2,
        red: 3,
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
        enemy: "snake1",
        health: 2,
        blue: 2,
        red: 3,
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
        enemy: "butterfly2",
        health: 2,
        blue: 2,
        red: 3,
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
        enemy: "slime1",
        health: 2,
        blue: 2,
        red: 3,
        spawnRate: 62,
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
        enemy: "slime1",
        health: 2,
        blue: 2,
        red: 3,
        spawnRate: 87,
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

const enemyArcaiveList = Object.keys(enemyArcaive)