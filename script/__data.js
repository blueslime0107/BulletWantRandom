const gameData = {
    showThreeEdit: false,
    "resolution": [1280, 720],
    "gameArea": {
        x: 300,
        y: 20,
        width: 680,
        height: 680
    },
    "scaleMode": 'linear',
    "scene":[
        "Title",
        "MainGame",
        "Pause"
    ],
    "startScene": "MainGame",
    "startSceneOption": {
        stageId:1
    },
    "defaultBG": 'stage1',
    "defaultOption": {
      bgmVolume: 50,
      sfxVolume: 20,
      language: 1,
      fullscreen: 0
    },
    isPortrait: false,
    noPortrait: true,
    no3dupdate: true
}

const BGM = {
    stage1_field: "bgm/bgm2.mp3",
    stage1_boss: "bgm/bgm3.mp3"
}

const SFX = {
    tan1: "se/se_tan00.wav",
    tan2: "se/se_tan01.wav",
    tan3: "se/se_tan02.wav",
    kira1: "se/se_kira00.wav",
    kira2: "se/se_kira01.wav",
    kira3: "se/se_kira02.wav",
    select: "se/se_select00.wav",
    ok: "se/se_ok00.wav",
    cancel: "se/se_cancel00.wav",
    pShot: "se/se_plst00.wav",
    eDead: "se/se_enep00.wav",
    barrier: "se/se_enep02.wav",
    barrierGet: "se/se_powerup.wav",
    songPeunMade: "se/se_bonus2.wav",
    songPeunMade2: "se/se_enep02.wav",
    blast: "se/se_enep02.wav",
    cardGet: "se/se_cardget.wav",
    spellCardActive: "se/se_cat00.wav",
    charge: "se/se_ch02.wav",
    dmg: "se/se_damage00.wav",
    dmgLittle: "se/se_damage01.wav",
    bossDead: "se/se_enep01.wav",
    extend: "se/se_extend.wav",
    graze: "se/se_graze.wav",
    invalid: "se/se_invalid.wav",
    item: "se/se_item00.wav",
    powerGraze: "se/se_item01.wav",
    slash: "se/se_slash.wav",
    optionBarrier: "se/se_power0.wav",
    pause: "se/se_pause.wav",
    pDead: "se/se_pldead00.wav",
    warning: "se/se_ufoalert.wav",
    releaseAble: "se/se_ch01.wav",
    release: "se/se_focusfix.wav",
    timer: "se/se_nice.wav",
}


const KeyBind = {
    ONE: [KeyCode.Num1, KeyCode.Numpad1],
    TWO: [KeyCode.Num2, KeyCode.Numpad2],
    THREE: [KeyCode.Num3, KeyCode.Numpad3],
    FOUR: [KeyCode.Num4, KeyCode.Numpad4],
    FIVE: [KeyCode.Num5, KeyCode.Numpad5],
    SIX: [KeyCode.Num6, KeyCode.Numpad6],
    SEVEN: [KeyCode.Num7, KeyCode.Numpad7],
    EIGHT: [KeyCode.Num8, KeyCode.Numpad8],
    NINE: [KeyCode.Num9, KeyCode.Numpad9],
    OK: [KeyCode.Z, KeyCode.Enter],
    CANCEL: [KeyCode.X, KeyCode.Escape, KeyCode.Backspace],
    UP: [KeyCode.ArrowUp],
    DOWN: [KeyCode.ArrowDown],
    LEFT: [KeyCode.ArrowLeft],
    RIGHT: [KeyCode.ArrowRight],
    SKIP: [KeyCode.Control],
    SLOW: [KeyCode.Shift],
    SUB: [KeyCode.C]
};

const gameTxtsty = {
    default: {
        langId: 1,
        fontSize: 32,
        fill: 'rgba(255, 255, 255, 1)',
        align: 'left'
    },
    number: {
        langId: 1,
        fontSize: 36,
        fill: 'rgba(255, 255, 255, 1)',
        align: 'left'
    },
    dialog: {
        langId: 1,
        fontSize: 40,
        fill: 'rgba(255, 255, 255, 1)',
        align: 'left'
    },
    textBubble: {
        langId: 1,
        fontSize: 40,
        fill: 'rgba(255, 255, 255, 1)',
        align: 'center'
    },
    phazeMainText: {
        langId: 1,
        fontSize: 90,
        fill: 'rgba(255, 255, 255, 1)',
        align: 'center'
    },
    debug: {
        fontFamily: 'AnonymousPro',
        fontSize: 20,
        fill: 'rgb(255,255,255)',
        stroke: {
            color: 'rgba(0, 0, 0, 1)',
            width: 5
        }
    },
    stageTitle: {
        langId: 1,
        fontSize: 72,
        fill: 'rgba(255, 255, 255, 1)',
        stroke: {
            color: 'rgba(0, 0, 0, 1)',
            width: 10
        },
        align: 'center'
    },
    stageSubTitle: {
        langId: 1,
        fontSize: 36,
        fill: 'rgba(255, 255, 255, 1)',
        stroke: {
            color: 'rgba(0, 0, 0, 1)',
            width: 10
        },
        align: 'center'
    },
    gagueText: {
        langId: 1,
        fontSize: 32,
        fill: 'rgba(255, 255, 255, 1)',
        stroke: {
            color: 'rgba(0, 0, 0, 1)',
            width: 5
        },
        align: 'left',
        tagStyle: true
    },
    titleHeader: {
        langId: 1,
        fontSize: 64,
        fill: 'rgba(255, 255, 255, 1)',
        stroke: { color: 'rgba(16, 24, 32, 1)', width: 8 },
        align: 'center'
    },
    subtitle: {
        fontFamily: 'AnonymousPro',
        fontSize: 24,
        fill: 'rgba(216, 231, 255, 1)',
        align: 'center'
    },
    menuItem: {
        langId: 1,
        fontSize: 44,
        fill: 'rgba(255, 255, 255, 1)',
        stroke: { color: 'rgba(11, 16, 37, 1)', width: 6 },
        align: 'center'
    },
    optionItem: {
        fontFamily: 'AnonymousPro',
        fontSize: 34,
        fill: 'rgba(245, 252, 255, 1)',
        stroke: { color: 'rgba(8, 16, 32, 1)', width: 5 },
        align: 'center'
    },
    optionBack: {
        langId: 1,
        fontSize: 40,
        fill: 'rgba(255, 255, 255, 1)',
        stroke: { color: 'rgba(8, 16, 32, 1)', width: 5 },
        align: 'center'
    },
    toast: {
        fontFamily: 'AnonymousPro',
        fontSize: 28,
        fill: 'rgba(255, 246, 163, 1)',
        stroke: { color: 'rgba(0, 0, 0, 1)', width: 5 },
        align: 'center'
    },
    info: {
        fontFamily: 'AnonymousPro',
        fontSize: 26,
        fill: 'rgba(198, 212, 255, 1)',
        lineHeight: 36,
        align: 'center'
    },
    helpText: {
        fontFamily: 'AnonymousPro',
        fontSize: 22,
        fill: 'rgba(155, 176, 217, 1)',
        align: 'center'
    },
    pauseTitle: {
        langId: 1,
        fontSize: 64,
        fill: 'rgba(255, 255, 255, 1)',
        stroke: { color: 'rgba(0, 0, 0, 1)', width: 8 },
        align: 'center'
    },
    pauseMenu: {
        langId: 1,
        fontSize: 44,
        fill: 'rgba(255, 255, 255, 1)',
        stroke: { color: 'rgba(0, 0, 0, 1)', width: 6 },
        align: 'center'
    }
}

const dialogChar = {
    null: { name: "???", color: 'rgba(255, 255, 255, 1)' },
    ballballY:{
        name: "ballballY",
        color: 'rgb(0, 162, 255)',
        texture: "ballballY",
        feelingPos: {x:189,y:132}
    },
    sizuku:{
        name: "sizuku",
        color: 'rgb(0, 96, 185)',
        texture: "sizuku",
        feelingPos: {x:180,y:12}
    }

}

const BData = {
    lazer: { name: 'lazer', texture:"bulletLazer",radius: 2, spinMode:1,z:0},
    spear: { name: 'spear', texture:"bulletSpear",radius: 2, spinMode:1,z:0},
    ring: { name: 'ring', texture:"bulletRing",radius: 2, spinMode:0,z:0},
    circle: { name: 'circle', texture:"bulletCircle",radius: 4, spinMode:0,z:0},
    kunai: { name: 'kunai', texture:"bulletKunai",radius: 2, spinMode:1,z:0},
    ice: { name: 'ice', texture:"bulletIce",radius: 2, spinMode:1,z:0},
    rice: { name: 'rice', texture:"bulletRice",radius: 2, spinMode:1,z:0},
    paper: { name: 'paper', texture:"bulletPaper",radius: 2, spinMode:1,z:0},
    gun: { name: 'gun', texture:"bulletGun",radius: 2, spinMode:1,z:0},
    darkrice: { name: 'darkrice', texture:"bulletDarkRice",radius: 2, spinMode:1,z:0},
    star: { name: 'star', texture:"bulletStar",radius: 2, spinMode:2,z:0},
    tear: { name: 'tear', texture:"bulletTear",radius: 2, spinMode:1,z:0},

    darksnow: { name: 'darksnow', texture:"bulletDarkSnow",radius: 4, spinMode:2,z:1},
    smallrice: { name: 'smallrice', texture:"bulletSmallRice",radius: 4, spinMode:1,z:1},
    snow: { name: 'snow', texture:"bulletSnow",radius: 4, spinMode:0,z:1},

    heart: { name: 'heart', texture:"bulletHeart",radius: 6, spinMode:1,z:-1},
    arrow: { name: 'arrow', texture:"bulletArrow",radius: 2, spinMode:1,z:-1},
    bigStar: { name: 'bigStar', texture:"bulletBigStar",radius: 6, spinMode:2,z:-1},
    big: { name: 'big', texture:"bulletBig",radius: 6, spinMode:0,z:-1},
    fairy: { name: 'fairy', texture:"bulletFairy",radius: 6, spinMode:1,z:-1},
    knife: { name: 'knife', texture:"bulletKnife",radius: 6, spinMode:1,z:-1},
    oval: { name: 'oval', texture:"bulletOval",radius: 6, spinMode:1,z:-1},
    stone: { name: 'stone', texture:"bulletStone",radius: 6, spinMode:1,z:-1},
    bigtear: { name: 'bigtear', texture:"bulletBigTear",radius: 6, spinMode:1,z:-1},
    yinyang: { name: 'yinyang', texture:"bulletYinYang",radius: 6, spinMode:2,z:-1},

    veryBig: { name: 'veryBig', texture:"bulletVeryBig",radius: 32, spinMode:2,z:-1},

    light: { name: 'light', texture:"bulletLight",radius: 8, spinMode:0,z:-2},
}

const EData = {
    butterfly1: { radius: 16, texture: 'enemyButterfly1', idleFrame:[0,1], moveFrame:[2,3]},
    butterfly2: { radius: 16, texture: 'enemyButterfly2', idleFrame:[0,1], moveFrame:[2,3]},
    bird1: { radius: 24, texture: 'enemyBird1', idleFrame:[0,1,2], fadeFrame:[3],moveFrame:[4,5]},
    slime1: {radius: 24, texture: 'enemySlime1', idleFrame:[0,1,2]},
    snake1: { radius: 24, texture: 'enemySnake1', idleFrame:[0,1,2], fadeFrame:[3],moveFrame:[4,5]},
    stage1_midBoss: { radius: 48, texture: 'stage1_midBoss', idleFrame:[0], moveFrame:[1] },
    stage1_boss1: { radius: 64, name:'Sizuku',texture: 'stage1_boss1', idleFrame:[0], fadeFrame:[1],moveFrame:[2],special:[3] },
}

const EFC = {
    spellAlert: {
        init: function (option) {
            this.set(GS,600)
            this.bg = new Sprite({
                texture: Img.texture.spellNameBg,
                anchor:{x:1,y:1},

            })
            this.addChild(this.bg)
            this.name = new Text({
                text: option.spell,
                style: Data.styles.gagueText,
                scale:0.4,
                position: { x: 0, y: -8 },
                anchor:1
            })
            this.alpha = 0
            this.addChild(this.name)
        },
        update(self){
            if(this.whileFrame(30)){
                self.scale.set(frameMove(10,2,this.repeat,30,Easing.easeOutCubic))
                self.alpha = frameMove(0,1,this.repeat,30,Easing.linear)
            }
            if(this.whenTime(30)){
                self.MoveTime(pos(self.x,96),60,Easing.easeOutCubic)
            }
            if(this.waitIf(gm.boss && gm.boss.health <= 0)){
                self.SetValue('alpha',0,10,Easing.linear)
            }
            this.whenTime(10)
            this.$die()
        }
    },
    spellBG: {
        init: function (option) {
            this.bgObj = SPELLBG[option.profile]
            this.bgObj.init.call(this,option)
        },
        update:function(self){
            if(this.whenTime(0)){
                self.startRoutine('',self.bgObj.update)
            }
        }
    },
    spellStand: {
        init:function(option){
            this.stand = new Sprite({ texture: Img.texture[option.texture].base })
            this.alpha = 0
            this.set(100,-50)
            this.addChild(this.stand)
            Am.playSFX("spellCardActive")
        },
        update:function(self){
            if(this.whenTime(0)){
                self.SetValue('alpha',[0,1],10,Easing.linear)
                self.MoveTime(pos(0,0),10,Easing.linear)
            }
            if(this.whenTime(10)){
                self.MoveTime(pos(-75,50),60,Easing.linear)
            }
            if(this.whenTime(60)){
                self.SetValue('alpha',0,20,Easing.linear)
                self.MoveTime(pos(-150,100),20,Easing.linear)
            }
            this.whenTime(20)
            this.$die()
        }
    },
    bossCharge: {
        init: function(option){
            this.alpha = 0
            this.chargeCircle = Img.sprite('gradiusCircle',64,option.color)
            this.addChild(this.chargeCircle)
            this.particles = []
            for(let i=0;i<15;i++){
                const pos = goAngle(posZero,getRandom(-180,180),getRandom(500,800))
                const p = {
                    pos,
                    sprite: Img.sprite('triangle', getRandom_(48,100), 'rgb(255, 255, 255)',{
                        position: pos,
                        rotation:radian(getRandom_(0,90))
                        
                    })
                }
                this.particles.push(p)
                this.addChild(p.sprite)
            }
            Am.playSFX("charge")
        },
        update: function(self){
            if(this.whileFrame(40)){
                self.alpha = frameMove(0,0.5,this.repeat,40,Easing.linear)
                self.chargeCircle.scale.set(frameMove(10,0,this.repeat,40,Easing.easeInCubic))
                for(let p of self.particles){
                    p.sprite.x = frameMove(p.pos.x,0,this.repeat,40,Easing.linear)
                    p.sprite.y = frameMove(p.pos.y,0,this.repeat,40,Easing.linear)
                    p.sprite.angle += 10
                }
            }
            this.$die()
        }
    },
    bossBlast: {
        init: function(option){
            this.alpha = 0
            this.chargeCircle = Img.sprite('gradiusCircle',64,option.color)
            this.addChild(this.chargeCircle)
            this.particles = []
            for(let i=0;i<15;i++){
                const pos = goAngle(posZero,getRandom(-180,180),getRandom(500,800))
                const p = {
                    pos,
                    sprite: Img.sprite('triangle', getRandom_(48,100), 'rgb(255, 255, 255)',{
                        position: pos,
                        rotation:radian(getRandom_(0,90))
                        
                    })
                }
                this.particles.push(p)
                this.addChild(p.sprite)
            }
            Am.playSFX("blast")
        },
        update: function(self){
            if(this.whileFrame(40)){
                self.alpha = frameMove(0.5,0,this.repeat,40,Easing.linear)
                self.chargeCircle.scale.set(frameMove(0,10,this.repeat,40,Easing.easeOutCubic))
                for(let p of self.particles){
                    p.sprite.x = frameMove(0,p.pos.x,this.repeat,40,Easing.linear)
                    p.sprite.y = frameMove(0,p.pos.y,this.repeat,40,Easing.linear)
                    p.sprite.angle += 10
                }
            }
            this.$die()
        }
    },
    plDie: {
        init: function () {
            this.base = new Container()
            this.particles = []
            for(let i=0;i<15;i++){
                const p = {
                    pos: goAngle(posZero,getRandom(-180,180),getRandom(20,100)),
                    sprite: Img.sprite('rect', getRandom_(12,48), 'rgb(0, 38, 255)',{rotation:radian(45)})
                }
                this.particles.push(p)
                this.base.addChild(p.sprite)
            }
            this.addChild(this.base)
        },
        update: function(self){
            if(this.whileFrame(60)){
                for(let p of self.particles){
                    p.sprite.x = frameMove(0,p.pos.x,this.repeat,60,Easing.easeOutCubic)
                    p.sprite.y = frameMove(0,p.pos.y,this.repeat,60,Easing.easeOutCubic)
                    p.sprite.alpha = frameMove(1,0,this.repeat,60,Easing.linear)
                }
            }
            this.$die()
        }
    },
    stageAlert: {
        init: function (option) {
            this.base = new Container()
            this.stageNum = this.base.addChild(new Text({ alpha:0,position:{x:-120-100,y:-70},text: `Stage ${option.stageId}`, style: Data.styles.stageSubTitle , tint:'rgb(0, 140, 255)',anchor:0.5 }))
            this.stageLocation = this.base.addChild(new Text({ alpha:0,position:{x:100,y:0}, text: `${option.location}`, style: Data.styles.stageTitle ,anchor:0.5}))
            this.addChild(this.base)
        },
        update: function (self) {
            if(this.whileTime(0, this.repeat < 60)){
                self.stageNum.x = frameMove(-120-100, -120, this.repeat, 120, Easing.easeOutExpo)
                self.stageLocation.x = frameMove(100, 0, this.repeat, 120, Easing.easeOutExpo)
                self.stageNum.alpha = this.repeat / 60
                self.stageLocation.alpha = this.repeat / 60
            }
            this.whenTime(120)
            if(this.whileTime(0, this.repeat < 60)){
                self.stageNum.alpha = 1 - this.repeat / 60
                self.stageLocation.alpha = 1 - this.repeat / 60
            }
            this.$die()
        }
    },
    enemyBlast: {
        init: function () {
            let circle = Img.sprite('circle', 32)
            this.addChild(circle)
        },
        update: function (self) {
            if (this.whileTime(0, this.repeat < 60)) {
                self.scale.set(frameMove(1, 2, this.repeat, 60, Easing.easeOutSine))
                self.alpha = (1 - this.repeat / 60)
            }
            this.$die()
        }
    },
    bBarrierCircle: {
        /**@type {{ owner: import("./sceneBullet").Player , power: Number}}*/op: null,
        init: function () {
            this.radius = 60
            let circle = Img.sprite('circle', 60,'rgba(255,0,0,0.5)')
            this.addChild(circle)
        },
        update: function (self) {
            for(let b of self.op.owner.getBullets()){
                if(collideCircle(self,b)){
                    b.owner = self.op.owner
                    b.MoveDir(getRandom(-45,45)+self.op.owner.faceDir,b.speed)
                }
            }
            if (this.whileTime(0, this.repeat < 60)) {
                self.radius = frameMove(60, 60*self.op.power, this.repeat, 60, Easing.easeOutSine)
                self.alpha = frameMove(1,0.2,this.repeat,60,Easing.easeOutSine)
                self.scale.set(self.radius/60)
            }
            this.$die()
        }
    },
    bullet: {
        init: function () {
            let circle = Img.sprite('circle', 32)
            this.addChild(circle)
        },
        update() { }
    },
    enemyShot: {
        /**@type {{ radius:number, color:string, damage:number }}*/op: null,
        init: function () {
            this.radius = 16
            this.damage = this.op.damage
            let circle = Img.sprite('circle', this.radius, this.op.color)
            this.addChild(circle)
        },
        update(self) {
            this.whenTime(1)
            if (this.whileTime(0)) {
                for (let enemy of gm.enemyGroup) {
                    if (collideCircle(self, enemy)) {
                        enemy.dealDamage(self.damage)
                        self.stopMove()
                        this.endWhile()
                        break
                    }
                }
            }
            if (this.whileTime(0, this.repeat < 60)) {
                self.scale.set(frameMove(1, 2, this.repeat, 60, Easing.easeOutCubic))
                self.alpha = frameMove(1, 0, this.repeat, 60, Easing.easeOutCubic)
            }
            this.$die()
        }
    },
    line: {
        /**@type {{ endPos:any, width:number, color:string }}*/op: null,
        init: function () {
            this.line = Img.line(this, this.op.endPos, this.op.width, this.op.color)
            this.line.position.x -= this.x
            this.line.position.y -= this.y
            this.addChild(this.line)
            this.zIndex = 1
        },
        update(self) {
            if (this.whileTime()) {
                self.line.scale.y -= self.op.width / 30
                if (self.line.scale.y <= 0) {
                    this.die()
                }
            }
        }
    }
}

const SPELLBG = {
    'sizuku': {
        init: function () {
            this.alpha = 0
            this.bg = new Sprite({texture: Img.assets.stage1_boss1_bg, scale: 680/Img.assets.stage1_boss1_bg.width})
            this.addChild(this.bg)
            this.distortion = new Sprite({ texture: Img.assets.distortion, alpha: 0 })
            Img.assets.distortion.source.wrapMode = 'repeat'
            this.addChild(this.distortion)
            this.displacementFilter = new PIXI.DisplacementFilter(this.distortion)
            this.displacementFilter.scale.set(18, 10)
            this.bg.filters = [this.displacementFilter]
            this.startRoutine('',function(self){
                if(this.whileTime(0)){
                    self.distortion.x += 5.2
                    self.distortion.y += 3.45
                    const wave = Math.sin(this.repeat * 0.07)
                    self.displacementFilter.scale.x = 16 + wave * 6
                    self.displacementFilter.scale.y = 8 + wave * 4
                }
            })
        },
        update:function(self){
            if(this.whenTime(0)){
                self.SetValue('alpha',[0,1],10,Easing.linear)
            }
        }
    }
}
