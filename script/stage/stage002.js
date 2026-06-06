
/** @type {import("../sceneMainGame").StageRoutine} */
export const stage = {
    name: 'stage1',
    update: function () {

        // if(this.whileTime(20)){
        //     gm.spawnEnemy(pos(getRandom(48,680-48),-48), enemySpell.test1(getRandom(0,9))).MoveDir(90,2)
        // // }
        if (this.whenTime(10)) {
            this.bossAppear({ x: 340, y: -70 })
            gm.boss.MoveTime({ x: 340, y: 100 }, 60, Easing.easeOutElastic)
        }
        // if (this.whenTime(60)) { this.bossActivate(bossSpell.spellLazer) }

        // if(this.whenTime(60)){
        //     for(let i=0;i<360;i+=45){
        //         gm.spawnLazer({
        //             shape: "rice",
        //             color: 6,
        //             startPos: gm.boss,
        //             endPos: goAngle(gm.boss,i,480),
        //             guideTime: 60,
        //             atkTime: 120
        //         }).startRoutine("",function(self){
        //             if(this.whileTime(0)){
        //                 self.dir += 1
        //                 self.endPos = goAngle(gm.boss,self.dir,480)
        //             }
        //         })
        //     }
        // }
        // if (this.whenTime(60)) { this.bossActivate(bossSpell.nonSpell7) }
        // if (this.waitIf(gm.boss && gm.boss.health <= 0)) { gm.killAll() }
        // return
        if (this.whenTime(60)) { this.bossActivate(bossSpell.nonSpell1) }
        if (this.waitIf(gm.boss && gm.boss.health <= 0)) { gm.killAll() }
        if (this.whenTime(60)) { this.bossActivate(bossSpell.spell1) }
        if (this.waitIf(gm.boss && gm.boss.health <= 0)) { gm.killAll() }
        if (this.whenTime(60)) { this.bossActivate(bossSpell.nonSpell2) }
        if (this.waitIf(gm.boss && gm.boss.health <= 0)) { gm.killAll() }
        if (this.whenTime(60)) { this.bossActivate(bossSpell.spell2) }
        if (this.waitIf(gm.boss && gm.boss.health <= 0)) { gm.killAll() }
        if (this.whenTime(60)) { this.bossActivate(bossSpell.nonSpell3) }
        if (this.waitIf(gm.boss && gm.boss.health <= 0)) { gm.killAll() }
        if (this.whenTime(60)) { this.bossActivate(bossSpell.spell3) }
        if (this.waitIf(gm.boss && gm.boss.health <= 0)) { gm.killAll() }
        if (this.whenTime(60)) { this.bossActivate(bossSpell.nonSpell4) }
        if (this.waitIf(gm.boss && gm.boss.health <= 0)) { gm.killAll() }
        if (this.whenTime(60)) { this.bossActivate(bossSpell.spell4) }
        if (this.waitIf(gm.boss && gm.boss.health <= 0)) { gm.killAll() }
        if (this.whenTime(60)) { this.bossActivate(bossSpell.nonSpell5) }
        if (this.waitIf(gm.boss && gm.boss.health <= 0)) { gm.killAll() }
    }
}

const enemySpell = {
    test1: (color) => {return {
        health: 20,
        spell: function (self) {
            if(this.whenTime(getRandom(30,60))){
                for(let i=0;i<360;i+=10){
                    gm.spawnBullet("star",color,self).MoveDirSpdEase(i,5,3,60,Easing.linear)
                }
                for(let i=0;i<360;i+=90){
                    const lazer = gm.spawnLazer({
                        shape: "rice",
                        color: 6,
                        startPos: self,
                        endPos: goAngle(self,getRandom(-30,30)+90,700),
                        guideTime: 60,
                        atkTime: 240
                    })
                    lazer.parent = self
                    lazer.startRoutine("",function(self){
                        if(this.whileTime(0)){
                            self.startPos = goAngle(self.parent,i-45+this.repeat,120)
                            self.endPos = goAngle(self.parent,i+45+this.repeat,60)
                            if(!self.parent.valiable){self.kill()}
                        }
                    })
                }
            }
        }
    }}
}

const bossSpell = {
    spellLazer: {
        health: 2000,
        spell: function(self){
            if(this.whileTime(0,this.repeat < 60)){
                const lazer = gm.spawnLazer({
                    shape: "lazer",
                    color: 6,
                    startPos: self,
                    endPos: goAngle(self,-this.repeat*6,1400),
                    guideTime: 60, 
                    atkTime: 999
                })
                lazer.startRoutine("",function(self){
                    if(this.whileTime(0)){
                        for(let bullet of self.bullets){
                            if(collideCircle(bullet,gm.player,100)){
                                bullet.die()
                            }
                        }
                    }
                })
            }
            // if(this.whileTime(0,this.repeat < 60)){
            //     const lazer = gm.spawnLazer({
            //         shape: "lazer",
            //         color: 1,
            //         startPos: self,
            //         endPos: goAngle(self,this.repeat*6-180,1400),
            //         guideTime: 60, 
            //         atkTime: 60
            //     })
            // }
        }
    },
    nonSpell1: {
        health: 1000,
        spell: function (self) {
            if (this.whileTime(60)) {
                for (let i = 0; i < 360; i += 30) {
                    gm.spawnBullet("fairy", 6, self, i + this.repeat * 3.7, 5)
                }
                if (this.repeat % 2 == 0) {
                    for (let i = 0; i < 360; i += 10) {
                        const bullet = gm.spawnBullet("fairy", 5, self, i + this.repeat * 3.7, 5)
                        bullet.startRoutine("", function (self) {
                            if (this.whenTime(0)) {
                                self.MoveDirSpdEase(self.dir, 3, 0, 60, Easing.linear)
                            }
                            if (this.whenTime(70)) {
                                self.MoveDirSpdEase(lookPoint(self, gm.player) + getRandom(-45, 45), 0, 5, 60, Easing.linear)
                            }
                        })
                    }
                }
                if (this.repeat % 4 == 0) {
                    self.MoveDirEase(getBorderSafeAngle(self, { left: 150, right: 680 - 150, top: 100, bottom: 220 }), 30, 30, Easing.easeOutCubic)
                }
            }

            self.haveBorder(150, 680 - 150, 100, 340 - 100)
        }
    },
    spell1: {
        health: 1500,
        spell: function (self) {
            if (this.whenTime(0)) {
                self.MoveTime({ x: 340, y: 100 }, 60, Easing.easeOutQuad)
            }
            if (this.whenTime(60)) {
                self.startRoutine("", function (self) {
                    this.whenTime(120)
                    if (this.whileTime(20)) {
                        const rnd = getRandom(0, 20)
                        for (let i = 0; i < 360; i += 20) {
                            gm.spawnBullet("bigStar", 5, self, i + rnd, 5)
                        }
                    }
                })
            }
            if (this.whileTime(2)) {
                const rndX = getRandom(4, 680 - 4)
                self.startRoutine("", function (self) {
                    if (this.whileTime(1, this.repeat < 5)) {
                        gm.spawnBullet("ice", 6, pos(rndX, 0), 90, 7)
                    }
                })
            }
        }
    },
    nonSpell2: {
        health: 1000,
        spell: function (self) {
            if (this.whileTime(40)) {
                for (let i = 0; i < 360; i += 30) {
                    gm.spawnBullet("fairy", 6, self, i + this.repeat * 23.7, 4)
                }
                if (this.repeat % 2 == 0) {


                    for (let i = 0; i < 360; i += 10) {
                        const bullet = gm.spawnBullet("fairy", 5, self, i + this.repeat * 3.7, 5)
                        bullet.startRoutine("", function (self) {
                            if (this.whenTime(0)) {
                                self.MoveDirSpdEase(self.dir, 3, 0, 60, Easing.linear)
                            }
                            if (this.whenTime(70)) {
                                self.MoveDirSpdEase(lookPoint(self, gm.player) + getRandom(-45, 45), 0, 2, 60, Easing.linear)
                            }
                        })
                    }
                }
                if (this.repeat % 4 == 0) {
                    self.MoveDirEase(getBorderSafeAngle(self, { left: 150, right: 680 - 150, top: 100, bottom: 220 }), 30, 30, Easing.easeOutCubic)
                }
            }
            self.x = Math.max(150, Math.min(680 - 150, self.x))
            self.y = Math.max(100, Math.min(340 - 100, self.y))
        }
    },
    spell2: {
        health: 1500,
        spell: function (self) {
            if (this.whenTime(0)) {
                self.MoveTime({ x: 340, y: 100 }, 60, Easing.easeOutQuad)
            }
            if (this.whileTime(0)) {
                if (this.repeat % 120 == 0) {
                    self.MoveTime(pos(gm.player.x + getRandom(-100, 100), self.y), 60, Easing.easeOutCubic)
                }
                if (this.repeat % 4 == 0) {
                    const bulletFunc = function (self) {
                        if (this.whenTime(0)) {
                            self.count = getRandom(550, 640)
                            self.MoveDirSpdEase(90, 0, 4, 60, Easing.linear)
                        }
                        if (this.waitIf(self.y > self.count)) {
                            self.MoveDirSpdEase(90, 4, 0, 40, Easing.linear)
                        }
                        if (this.whenTime(120)) {
                            if (self.shape == "ring") {
                                gm.spawnBullet("fairy", 5, self).MoveDirSpdEase(lookPoint(self, gm.boss), 0, 3, 60, Easing.linear)
                            }
                            self.kill()
                        }
                    }
                    gm.spawnBullet("circle", 0, pos(getRandom(-200, 680 + 200), 0)).startRoutine("", bulletFunc)
                    gm.spawnBullet("ring", 0, pos(getRandom(-200, 680 + 200), 0)).startRoutine("", bulletFunc)
                }
            }
        }
    },
    nonSpell3: {
        health: 1000,
        spell: function (self) {
            if (this.whileTime(40)) {
                for (let i = 0; i < 360; i += 30) {
                    gm.spawnBullet("fairy", 6, self, i + this.repeat * 23.7 - 5, 7)
                    gm.spawnBullet("fairy", 6, self, i + this.repeat * 23.7 + 5, 7)
                }
                if (this.repeat % 2 == 0) {
                    for (let i = 0; i < 360; i += 20) {
                        const bullet = gm.spawnBullet("fairy", 5, self, i + this.repeat * 3.7, 5)
                        bullet.startRoutine("", function (self) {
                            if (this.whenTime(0)) {
                                self.MoveDirSpdEase(self.dir, getRandom(5, 3), 0, 60, Easing.linear)
                            }
                            if (this.whenTime(70)) {
                                self.MoveDirSpdEase(lookPoint(self, gm.player) + getRandom(-45, 45), 0, 10, 60, Easing.linear)
                            }
                        })
                    }
                }
                if (this.repeat % 4 == 0) {
                    self.MoveDirEase(getBorderSafeAngle(self, { left: 150, right: 680 - 150, top: 100, bottom: 220 }), 30, 30, Easing.easeOutCubic)
                }
            }
            self.x = Math.max(150, Math.min(680 - 150, self.x))
            self.y = Math.max(100, Math.min(340 - 100, self.y))
        }
    },
    spell3: {
        health: 1500,
        spell: function (self) {
            if (this.whileTime(10, this.repeat < 4)) {
                const bullet = gm.spawnBullet("light", 5, self).MoveDirSpdEase(195 - 40 * this.repeat, 8, 0, 90, Easing.linear)
                bullet.startRoutine("", bulletTypes.angry)
            }
            if(this.whenTime(60)){
                self.MoveTime(pos(getRandom(300,680-300), getRandom(100,340-100)), 60, Easing.easeOutCubic)
            }
            this.whenTime(60)
            if (this.whileTime(20, this.repeat < 4)) {
                const bullet = gm.spawnBullet("light", 5, self).MoveDirSpdEase(195 - 40 * this.repeat, 8, 0, 90, Easing.linear)
                bullet.startRoutine("", bulletTypes.angry)
            }
            if(this.whenTime(120)){
                this.reset()
            }
        }
    },
    nonSpell4: {
        health: 1000,
        spell: function (self) {
            if (this.whenTime(0)) {
                self.MoveTime({ x: 340, y: 100 }, 60, Easing.easeOutQuad)
            }
            if(this.whileTime(40)){
                for(let i=0;i<360;i+=10){
                    gm.spawnBullet("stone",6,self,i+this.repeat*23,2)
                    gm.spawnBullet("arrow",5,self,i+this.repeat*23-1,4)
                    gm.spawnBullet("arrow",5,self,i+this.repeat*23+1,4)
                }
            }
        }
    },
    spell4:{
        health: 1500,
        spell: function(self){
            if(this.whenTime(0)){
                gm.boss.MoveTime({x:340,y:340},60,Easing.easeOutCubic)
                gm.boss.count = 35
            }
            this.whenTime(60)

            if(this.whileFrame(180)){
                if(this.repeat % 3 == 0){
                    for(let i=0;i<360;i+=90){
                        const bullet = gm.spawnBullet("stone",6,gm.boss,i-45,10)
                    }
                }
            }
            if(this.whenTime(0)){
                gm.boss.startRoutine("spell2",function(self){
                    if(this.whileTime(5)){
                        const bullet = gm.spawnBullet("fairy",2,self,getRandom(0,360),2)
                        bullet.zIndex = 55
                    }
                })
            }
            if(this.whileTime(3)){
                for(let i=0;i<360;i+=90){
                    const bullet = gm.spawnBullet("stone",6,gm.boss,i+this.repeat*frameMove(0,3,this.repeat,120,Easing.linear)-45,10)
                    bullet.startRoutine("",function(self){
                        if(this.whenTime(gm.boss.count)){
                            self.MoveDirSpdEase(self.dir, self.speed, 0, 30, Easing.easeOutCubic)
                        }
                        if(this.whenTime(60*3)){
                            self.setBullet("spear",8)
                            self.MoveDir(self.dir+getRandom(-3,3),2)
                        }
                    })
                }
                if(this.repeat % 30 == 0){
                    gm.boss.count = Math.max(10, gm.boss.count-1);
                }
            }
        }
    },
    nonSpell5: {
        health: 1000,
        spell: function (self) {
            if (this.whenTime(0)) {
                self.MoveTime({ x: 340, y: 100 }, 60, Easing.easeOutQuad)
            }
            if(this.whileTime(40)){
                for(let i=0;i<30;i++){
                    gm.spawnBullet("stone",6,self).MoveDirSpdEase(getRandomF(0,360),getRandomF(2,6),getRandomF(2,6),60,Easing.linear)
                    gm.spawnBullet("arrow",5,self).MoveDirSpdEase(getRandomF(0,360),getRandomF(2,6),getRandomF(2,6),60,Easing.linear)
                }
            }
        }
    },
    spell5:{
        health: 1500,
        spell:function(self){
            this.whenTime(60)
            if(this.whenTime(0)){
                self.startRoutine("",function(self){
                    if(this.whileTime(1)){
                        const bullet = gm.spawnBullet("darkrice",8,goAngle(gm.player,getRandom(0,360),90),getRandom(0,360),0.2)
                        bullet.startRoutine("",function(self){if(this.whenTime(60)){self.kill()}})
                    }
                })
                self.startRoutine("",function(self){
                    if(this.whileTime(30)){
                        const rnd = getRandomF(0,30)
                        for(let i=0;i<360;i+=10){
                            const bullet = gm.spawnBullet("circle",6,gm.boss,i+rnd,2)
                        }
                    }
                })
            }
            if(this.whileTime(240)){
                self.MoveTime(pos(getRandom(100,240)+340*(this.repeat % 2), getRandom(100,240)),120,Easing.easeOutCubic)
                self.startRoutine("",function(self){
                        if(this.whenTime(0)){this.count = gm.player.pos}
                        if(this.whileFrame(120)){
                            if(this.repeat % 5 == 0){
                                gm.spawnBullet("arrow",5,gm.boss).MoveDirSpdEase(lookPoint(self,this.count),1,20,240,Easing.linear)
                                gm.spawnBullet("ring",8,gm.boss).MoveDirSpdEase(lookPoint(self,this.count)+8,1,20,240,Easing.linear)
                                gm.spawnBullet("ring",8,gm.boss).MoveDirSpdEase(lookPoint(self,this.count)-8,1,20,240,Easing.linear)
                            }
                        }
                    })
            }
            self.haveBorder(150, 680 - 150, 100, 340 - 100)
        }
    },
    nonSpell6: {
        health: 1000,
        spell: function(self){
            if(this.whileTime(0)){
                if(this.repeat % 20 == 0){
                    for(let i=0;i<360;i+=30){
                        gm.spawnBullet("arrow",4,self,i+this.repeat*7.7,4)
                        gm.spawnBullet("arrow",5,self,i+this.repeat*7.7,2)
                    }
                }
                if(this.repeat % 300 == 0){
                    for(let i=0;i<360;i+=20){
                        const bullet = gm.spawnBullet("fairy",2,self)
                        bullet.dir = i
                        bullet.startRoutine("",function(self){
                            if(this.whenTime(0)){self.MoveDirSpdEase(self.dir,6,0,60,Easing.linear)}
                            if(this.whenTime(60)){self.MoveDirSpdEase(lookPoint(self,gm.player),5,0,120,Easing.linear)}
                            if(this.whenTime(180)){self.MoveDirSpdEase(lookPoint(self,gm.player),0,5,120,Easing.linear)}
                        })
                    }
                }
            }
        }
    },
    nonSpell7: {
        health: 1000,
        spell: function(self){
            if(this.whileTime(0)){
                if(this.repeat % 8 == 0){
                    for(let i=0;i<360;i+=45){
                        gm.spawnBullet("arrow",6,self,i+this.repeat*7.7,6)
                        gm.spawnBullet("arrow",5,self,i+this.repeat*-7.7,3)
                    }
                }
                if(this.repeat % 180 == 0){
                    for(let i=0;i<360;i+=20){
                        const bullet = gm.spawnBullet("fairy",2,self)
                        bullet.dir = i
                        bullet.startRoutine("",function(self){
                            if(this.whenTime(0)){self.MoveDirSpdEase(self.dir,6,0,60,Easing.linear)}
                            if(this.whenTime(60)){self.MoveDirSpdEase(lookPoint(self,gm.player),0,10,120,Easing.linear)}
                        })
                    }
                }
            }
        }
    }
}

const bulletTypes = {
    angry: function (self) {
        if (this.whenTime(120)) {
            const lazer = gm.spawnBentLazer(7, self, 100)
            lazer.setScale(92)
            lazer.setLazerRoutine(function (self) {
                if (this.whenTime(0)) {
                    self.MoveDir(-80, 5)
                }
                if (this.whileFrame(90)) {
                    self.dir = -90 + 20 * Math.sin(this.repeat * 5 * Math.PI / 180)
                }
            })

            for (let i = 0; i < 40; i++) {
                const bullet = gm.spawnBullet(["ring", "smallrice", "tear"][getRandom(0, 3)], 8, self)
                bullet.MoveVector(pos(getRandomF(-3, 3), getRandomF(-6, -3)))
                bullet.startRoutine("", function (self) {
                    if (this.whileTime(0)) {
                        self.vector.y = Math.min(2, self.vector.y + 0.04)
                    }
                })
            }
        }
        if (this.whenTime(120)) {
            for(let i=0;i<360;i+=30){
                gm.spawnBullet("circle",6,self,i,1)
            }
            self.kill()
        }
    }
}