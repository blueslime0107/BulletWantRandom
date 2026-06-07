/** @type {import("../sceneMainGame").StageRoutine} */
export const stage = {
    name: 'stage1',
    update: function () {
        this.debugJumpStart()
        if(this.whenTime(0)){Am.playBGM('stage1_field')}

        // 구간1
        if(this.whileTime(15,this.repeat<10)){
            gm.spawnEnemy(pos(-100,getRandom(0,200)), enemyArcaive.small).MoveDirSpdEase(0,4,1,120,Easing.linear)
        }
        if(this.whileTime(15,this.repeat<10)){
            gm.spawnEnemy(pos(680+100,getRandom(0,200)), enemyArcaive.small).MoveDirSpdEase(180,4,1,120,Easing.linear)
        }
        if(this.whileTime(15,this.repeat<10)){
            gm.spawnEnemy(pos(getRandom(0,680),-50), enemyArcaive.small).MoveDirSpdEase(90,4,1,120,Easing.linear)
        }
        // 스테이지 알람
        if(this.whenTime(120)){
            gm.spawnEffect(EFC.stageAlert,gm.efcBulletAbove,pos(340,200),{stageId:1,color: "#26bafa", location: "눈꽃 정원"})
        }
        // 구간2
        this.whenTime(180)
        if(this.whileTime(20,this.repeat<20)){
            gm.spawnEnemy(pos(getRandom(0,680),-50), enemyArcaive.small).MoveDirSpdEase(90,4,1,120,Easing.linear)
        }
        if(this.whenTime(120)){
            gm.spawnEnemy(pos(-48,0), enemyArcaive.mid1).MoveDir(10,2)
        }
        this.whenTime(120)
        if(this.whileTime(15,this.repeat<10)){
            gm.spawnEnemy(pos(680+100,getRandom(0,200)), enemyArcaive.small2).MoveDirSpdEase(170,4,2,120,Easing.linear)
        }
        if(this.whenTime(120)){
            gm.spawnEnemy(pos(680+48,0), enemyArcaive.mid1).MoveDir(170,2)
        }
        if(this.whenTime(120)){
            gm.spawnEnemy(pos(-48,0), enemyArcaive.mid1).MoveDir(10,2)
        }
        this.whenTime(120)
        if(this.whileTime(15,this.repeat<10)){
            gm.spawnEnemy(pos(-100,getRandom(0,200)), enemyArcaive.small2).MoveDirSpdEase(10,4,2,120,Easing.linear)
        }
        if(this.whenTime(150)){
            gm.spawnEnemy(pos(340,0), enemyArcaive.mid1).MoveDir(90,2)
        }
        // 구간2B
        this.whenTime(150)
        if(this.whileTime(20,this.repeat<30)){
            gm.spawnEnemy(pos(getRandom(50,200)+getRandomList([0,430]),-48), enemyArcaive.small2).MoveDirSpdEase(90,4,2,120,Easing.linear)
        }
        if(this.whenTime(150)){
            gm.killAll()
        }
        // 중보스
        if (this.whenTime(60)) {
            Am.playSFX("charge")
            Am.playSFX("kira1")
            this.bossAppear({ x: 680, y: 200 }, "stage1_midBoss")
            gm.boss.MoveTime(pos(200+getRandom(-20,20),150+getRandom(-20,20)), 120, Easing.easeOutCubic)
        }
        this.bossActivate(midSpell.nonSpell1,120,1,false)
        this.whenTime(60*10)
        if(this.whileTime(20,this.repeat<24)){
            if(gm.bossDead()){
                gm.spawnEnemy(pos(getRandom(50,200)+getRandomList([0,430]),-48), enemyArcaive.small2).MoveDirSpdEase(90,4,2,120,Easing.linear)
            }
        }
        if(this.whileTime(120,this.repeat<5)){
            gm.spawnEnemy(pos(GS*0.5,-48), enemyArcaive.slime1)
            .MoveTime(pos(GS*0.5+[0,-100,250,100,-250][this.repeat-1],150),60,Easing.easeOutSine)
            .startRoutine('',function(self){
                if(this.whenTime(180)){
                    self.MoveDirSpdEase(0,0,3,120,Easing.linear)
                }
                if(this.whileTime(0)){
                    self.dir = lookPoint(self,gm.player)
                    if(getDist(self,gm.player) <= 200){
                        this.endWhile()
                    }
                }
            })
        }
        if(this.whenTime(240)){
            gm.spawnEnemy(pos(-48,-48), enemyArcaive.mid1).MoveTime(pos(GS-200,150),120,Easing.easeOutBack)
            gm.spawnEnemy(pos(GS+48,-48), enemyArcaive.mid1).MoveTime(pos(200,150),120,Easing.easeOutBack)
        }
        if(this.whenTime(240)){
            gm.spawnEnemy(pos(GS*0.5,-48), enemyArcaive.slime1)
            .MoveTime(pos(GS*0.5,150),60,Easing.easeOutSine)
            .startRoutine('',function(self){
                if(this.whenTime(180)){
                    self.MoveDirSpdEase(0,0,3,120,Easing.linear)
                }
                if(this.whileTime(0)){
                    self.dir = lookPoint(self,gm.player)
                    if(getDist(self,gm.player) <= 200){
                        this.endWhile()
                    }
                }
            })
        }
        if(this.whileTime(30,this.repeat<15)){
            gm.spawnEnemy(pos(getRandom(0,680),-50), enemyArcaive.small).MoveDirSpdEase(90,4,1,120,Easing.linear)
        }

        if(this.whenTime(300)){
            this.clearAll()
        }
        // this.debugJumpEnd()
        this.dialogStart()
        this.addStand(dialogChar.ballballY,"left")
        this.whenTime(40)
        this.dialog('ballballY',1,'우와 눈온다!')
        this.dialog('ballballY',0,'뽀리는 눈딸기를 찾아야겠서')
        this.dialog('ballballY',4,'뽀리 행복해!!')
        if (this.whenTime(0)) {
            Am.playSFX("charge")
            this.bossAppear({ x: 340, y: -70 },"stage1_boss1")
            gm.boss.MoveTime({ x: GS*0.5, y: GS*0.25 }, 60, Easing.easeOutSine)
            gm.ui.updateBossSpells(2)
        }
        this.dialog('???',1,'역시나 역시나')
        this.addStand(dialogChar.sizuku,"right")
        if(this.whenTime(0)){gm.dialog.setStandFeel('ballballY',2)}
        this.dialog('sizuku',1,'볼볼이구나~')
        this.dialog('ballballY',0,'앗 시즈쿠 오랫만이야!')
        this.dialog('sizuku',2,'여김없이 눈딸기 찾니?')
        this.dialog('ballballY',1,'음... 아니? 생각이 바뀌었어')
        if(this.whenTime(0)){Am.playBGM('stage1_boss')} // BGM change
        this.dialog('ballballY',2,'이런 날씨니깐 몸좀 날리고 싶어졌어')
        if(this.whenTime(0)){gm.dialog.setStandFeel('sizuku',3)}
        this.dialog('ballballY',4,'눈싸움 하자!!')
        this.dialog('sizuku',4,'볼볼이 오늘따라 왤케 건방지니?')
        this.dialogEnd()
        this.bossActivate(sizukuSpell.nonSpell1,60)
        if(this.whenTime(0)){gm.boss.MoveTime({ x: GS*0.5, y: GS*0.25 }, 60, Easing.easeOutSine)}
        this.bossActivate(sizukuSpell.spell2,60)
        if(this.whenTime(0)){gm.boss.MoveTime({ x: GS*0.5, y: GS*0.25 }, 60, Easing.easeOutSine)}
        this.bossActivate(sizukuSpell.nonSpell2,60)
        if(this.whenTime(0)){gm.boss.MoveTime({ x: GS*0.5, y: GS*0.25 }, 60, Easing.easeOutSine)}
        this.bossActivate(sizukuSpell.spell1,60,2)

        this.whenTime(60)
        this.dialogStart()
        this.addStand(dialogChar.ballballY,"left")
        this.addStand(dialogChar.sizuku,"right")
        this.whenTime(40)
        this.dialog('ballballY',1,'이겼다! 뽀리 최고!!')
        this.dialog('sizuku',1,'눈 덕분엔가 볼볼이 강해!')
        this.dialog('sizuku',0,'(뭘 잘못 먹었나?)\n(봐주긴 했지만 이 힘...')
        this.dialogEnd()

        this.debugJumpEnd()
        if (this.whenTime(0)) {
            Am.playSFX("charge")
            this.bossAppear({ x: 340, y: -70 },"stage1_boss1")
            gm.boss.MoveTime({ x: GS*0.5, y: GS*0.25 }, 60, Easing.easeOutSine)
            gm.ui.updateBossSpells(2)
        }
        if(this.whenTime(0)){gm.boss.MoveTime({ x: GS*0.5, y: GS*0.25 }, 60, Easing.easeOutSine)}
        this.bossActivate(sizukuSpell.spell1,60,2)



        return
    }
}

const enemyArcaive = {
    small: {
        enemy: "butterfly1",
        health: 10,
        spell: function (self) {
            if(this.whileTime(60,this.repeat < 4)){
                Am.playSFX("tan1")
                gm.spawnBullet(BData.circle,getRandom(5,7),self).MoveDirSpdEase(lookPoint(self,gm.player),8,4,60,Easing.linear)
            }
        }
    },
    small2: {
        enemy: "butterfly1",
        health: 1,
        spell: function (self) {
            if(this.whileTime(30)){
                Am.playSFX("tan1")
                gm.spawnBullet(BData.snow,getRandom(5,7),self).MoveDirSpdEase(lookPoint(self,gm.player),8,4,60,Easing.linear)
            }
        }
    },
    mid1: {
        enemy: "bird1",
        health: 60,
        spell: function (self) {
            if(this.whileTime(15)){
                Am.playSFX("kira1")
                const rnd = getRandomF(0,360)
                 for(let i=0;i<360;i+=30){
                    gm.spawnBullet(BData.ice,5,self).MoveDirSpdEase(i+rnd,6,2,60,Easing.linear)
                    gm.spawnBullet(BData.ice,6,self).MoveDirSpdEase(i+rnd,8,2,60,Easing.linear)
                }
            }
        }
    },
    slime1: {
        enemy: "slime1",
        health: 120,
        spell: function(self){
            if(this.whenTime(0)){
                this.count = getRandom(0,360)
            }
            if(this.whileTime(2,this.repeat<5)){
                Am.playSFX("tan1")
                for(let i=0;i<360;i+=30){
                    gm.spawnBullet(BData.rice,5,self).MoveDir(i+this.count,6)
                }
            }
            if(this.whenTime(40)){
                this.currentLine = 1
            }
        }
    }
}

const midSpell = {
    nonSpell1: {
        health: 750,
        timer: 20,
        spell: function (self) {
            if(this.whileTime(20,this.repeat<6)){
                Am.playSFX('tan1')
                for(let i=0;i<360;i+=30){
                    for(let indx=0;indx<3;indx++){
                        gm.spawnBullet(BData.spear,1,self).MoveDirSpdEase(i+indx*3.7+this.repeat*16.7,5,1+indx,60,Easing.linear)
                    }
                }
            }
            if(this.whenTime(0)){
                Am.playSFX("kira1")
                self.MoveTime(pos(GS*0.5+200+getRandom(-20,20),150+getRandom(-20,20)),60,Easing.easeOutCubic)
            }
            this.whenTime(60)
            if(this.whileTime(20,this.repeat<6)){
                Am.playSFX('tan1')
                for(let i=0;i<360;i+=30){
                    for(let indx=0;indx<3;indx++){
                        gm.spawnBullet(BData.spear,2,self).MoveDirSpdEase(i+indx*3.7+this.repeat*16.7,5,1+indx,60,Easing.linear)
                    }
                }
            }
            if(this.whenTime(0)){
                Am.playSFX("kira1")
                self.MoveTime(pos(200+getRandom(-20,20),150+getRandom(-20,20)),60,Easing.easeOutCubic)
            }
            if(this.whenTime(60)){this.currentLine = 0}
            
        }
    },
}

const sizukuSpell = {
    nonSpell1:{
        health: 1000,
        timer: 30,
        spell: function(self){
            if(this.whileTime(60)){
                Am.playSFX("tan1")
                gm.spawnBullet(BData.big,6,self).MoveDirSpdEase(lookPoint(self,gm.player)+getRandom(-30,30),8,0,60,Easing.linear).startRoutine('',function(self){
                    if(this.whenTime(60)){
                        Am.playSFX("kira2")
                        for(let i=0;i<360;i+=30){
                            gm.spawnBullet(BData.circle,5,self).MoveDirSpdEase(i,8,1,10,Easing.linear)
                        }
                        self.MoveDir(lookPoint(self,gm.player),3)
                    }
                })
                if(this.repeat % 3 == 0){
                    self.MoveDirEase(getBorderSafeAngle(self, { left: 150, right: 680 - 150, top: 100, bottom: 220 }), 90, 30, Easing.easeOutCubic)
                }
            }
            self.haveBorder(150, 680 - 150, 100, 340 - 100)
        }
    },
    spell1:{
        spellProfile: 'sizuku',
        name: '몽상 <맴도는 추억>',
        health: 1500,
        timer: 30,
        spell: function(self){
            if(this.whenTime(0)){
                gm.spawnEffect(EFC.bossCharge,gm.playLayer,self,{color:'rgb(0, 119, 255)'})
            }
            if(this.whenTime(60)){
                self.spcialMove(0)
                gm.spawnEffect(EFC.bossBlast,gm.playLayer,self,{color:'rgb(0, 119, 255)'})
                console.log("special")
                let bullet = gm.spawnBullet(BData.veryBig,1,self).MoveDirSpdEase(90,5,0,60,Easing.linear).setVar((self.vars[0] % 2 == 0) ? -1:1).startRoutine('',function(self){
                    if(this.whenTime(60)){
                        console.log(self,self.vars[0])
                        self.MoveRotate(gm.boss.pos,self.vars[0],0)
                    }
                    if(this.whileTime(0)){
                        self.rotateDist += 0.005
                        if(this.repeat % 2 == 0){
                            Am.playSFX("tan2")
                            let bullet = gm.spawnBullet(BData.circle,6,goAngle(self,getRandom(0,360),64)).startRoutine('',function(self){
                                if(this.whenTime(120)){
                                    gm.spawnBullet(BData.darkrice,6,self).MoveDirSpdEase(getRandom(0,360),0,1,360,Easing.linear)
                                    self.kill()
                                }
                                
                            })
                            bullet.blendMode = 'screen'
                        }
                        if(this.repeat > 400){
                            Am.playSFX("kira1")
                            this.endWhile()
                            self.kill()
                        }
                    }
                }).setAutoDie({outScreen:false,areaKill:false})
                bullet.blendMode = 'screen'
            }
            if(this.whenTime(120)){
                self.MoveTime(pos(gm.player.x+getRandom(-20,20),GS*0.25+getRandom(-10,10)),60,Easing.easeOutCubic)
            }
            if(this.whenTime(60)){
                this.currentLine = 0
                self.vars[0]++
            }
        }
    },
    nonSpell2:{
        health: 1000,
        timer: 30,
        spell: function(self){
            if(this.whileTime(30)){
                Am.playSFX("tan2")
                gm.spawnBullet(BData.big,0,self).MoveDirSpdEase(lookPoint(self,gm.player),8,0,60,Easing.linear).startRoutine('',function(self){
                    if(this.whenTime(60)){
                        Am.playSFX("kira2")
                        for(let i=0;i<3;i++){
                            gm.spawnBullet(BData.snow,5,self).MoveDirSpdEase(i*4+lookPoint(self,gm.player),8,4-(i+1),10,Easing.linear)
                            gm.spawnBullet(BData.snow,5,self).MoveDirSpdEase(-i*4+lookPoint(self,gm.player),8,4-(i+1),10,Easing.linear)
                        }
                        self.MoveDir(lookPoint(self,gm.player),3)
                    }
                })
                if(this.repeat % 3 == 0){
                    self.MoveDirEase(getBorderSafeAngle(self, { left: 150, right: 680 - 150, top: 100, bottom: 220 }), 90, 30, Easing.easeOutCubic)
                }
            }
            self.haveBorder(150, 680 - 150, 100, 340 - 100)
        }
    },
    spell2: {
        spellProfile: 'sizuku',
        name: '몽상 <꿈좋은 향기에 취한다>',
        health: 1500,
        timer: 40,
        spell: function(self){
            if(this.whileTime(10,this.repeat < 30)){
                Am.playSFX("tan1")
                if(this.repeat == 26){
                    self.spcialMove(0)
                    gm.spawnEffect(EFC.bossCharge,gm.playLayer,self,{color:'rgb(0, 119, 255)'})
                }
                for(let i=0;i<360;i+=30){
                    gm.spawnBullet([BData.snow,BData.circle][this.repeat % 2],6,self).MoveDirSpdEase(i+this.repeat*4.7,5,3,60,Easing.easeInCubic).startRoutine('',function(self){
                        if(this.waitIf(getDist(self,gm.player)<=100)){
                            self.MoveRotate(gm.player,2,0)
                            self.setAutoDie({outScreen:false})
                        }
                    })
                }
            }
            if(this.whenTime(0)){
                gm.spawnEffect(EFC.bossBlast,gm.playLayer,self,{color:'rgb(0, 119, 255)'})
                Am.playSFX("kira1")
                for(let bullet of gm.getBullets()){
                    bullet.MoveDirSpdEase(lookPoint(bullet,gm.player),0,2,60,Easing.linear)
                }
            }
            if(this.whenTime(30)){
                self.MoveTime(pos(self.x+getRandom(-20,20),self.y+getRandom(-10,10)),60,Easing.easeOutCubic)
            }
            if(this.whenTime(60)){
                for(let bullet of gm.getBullets()){
                    bullet.kill()
                }
                this.currentLine = 0
            }
        }
    }
}