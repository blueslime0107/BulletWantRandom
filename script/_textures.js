
const TextureAssets = {
    player:'player.png',
    bullet:'bullet.png',
    titleBG:'title/background.png',
    utility:'utility/item.png',
    enemy:'utility/enemy.png',
    ui_background:'utility/ui_background.png',
    playerArea:'utility/playerArea.png',
    distortion:'distortion.jpeg',
    stage1_midBoss:'stage/stage1/midBoss.png',
    stage1_boss1:'stage/stage1/boss1.png',
    stage1_boss1_Stand:'stage/stage1/boss1_stand.png',
    stage1_boss1_bg: 'stage/stage1/boss1_bg.png',
    playerStand:'player_stand.png',
}

function cropImg(source, x, y, width, height, col=1, row=1){
    if(col > 1 || row > 1){
        const list = []
        for(let j=0;j<row;j++){
            for(let i=0;i<col;i++){
                const tex = new PIXI.Texture({
                    source: source,
                    frame: { x: x+width*i, y: y+height*j, width: width, height: height }
                })
                list.push(tex)
            }
        }
        return list
    }
    return new PIXI.Texture({
        source: source,
        frame: { x: x, y: y, width: width, height: height }
    })
}

const Stands = {
    ballballY: function(){
        const base = cropImg(Img.assets.playerStand, 0, 0, 630, 903)
        const feels = cropImg(Img.assets.playerStand, 678, 0, 265, 146, 2,2)
        return {base, feels }
    },
    sizuku: function(){
        const base = cropImg(Img.assets.stage1_boss1_Stand, 0, 0, 730, 923)
        const feels = cropImg(Img.assets.stage1_boss1_Stand, 744, 0, 297, 213, 1,4)
        return {base, feels }
    }
}

const Enemys = {
    enemyButterfly1: () => cropImg(Img.assets.enemy, 0, 0, 32, 32, 4, 1),
    enemyButterfly2: () => cropImg(Img.assets.enemy, 0, 32, 32, 32, 4, 1),
    enemyBird1 : () => cropImg(Img.assets.enemy, 0, 64, 48, 48, 6, 1),
    enemySlime1 : () => cropImg(Img.assets.enemy, 0, 112, 48, 48, 3, 1),
    enemySnake1 : () => cropImg(Img.assets.enemy, 0, 160, 48, 48, 6, 1),
    stage1_midBoss: () => cropImg(Img.assets.stage1_midBoss, 0, 0, 64, 64, 2, 1),
    stage1_boss1: () => cropImg(Img.assets.stage1_boss1, 0, 0, 81, 108, 4, 1),
}

const Utilitys = {
    live: () => cropImg(Img.assets.utility, 0, 0, 64, 64),
    liveEmpty: () => cropImg(Img.assets.utility, 64, 0, 64, 64),
    bomb: () => cropImg(Img.assets.utility, 0, 64, 64, 64),
    bombEmpty: () => cropImg(Img.assets.utility, 64, 64, 64, 64),
    spellNameBg: () => cropImg(Img.assets.utility, 224, 0, 176, 24),
}

const Textures = {
    ...Stands,
    ...Enemys,
    ...Utilitys,
    rect: function () {
        let g = new Graphics();
        g.rect(0, 0, 1, 1).fill({ color: 0xffffff })
        return app.generateTexture({ target: g });
    },
    circle: function () {
        let g = new Graphics();
        g.circle(0, 0, 64).fill({ color: 0xffffff })
        return app.generateTexture({ target: g });
    },
    gradiusCircle: function () {
        let g = new Graphics();
        // 반지름 64 크기로 중앙에서 가장자리로 갈 수록 투명해지는 원을 그립니다.
        for (let r = 64; r > 0; r -= 2) {
            g.circle(0, 0, r).fill({ color: 0xffffff, alpha: 0.1 });
        }
        return app.generateTexture({ target: g });
    },
    plus: function () {
        const SIZE = 96;
        const THICK = 24;
        let g = new Graphics();
        g.rect(0, (SIZE - THICK) / 2, SIZE, THICK);
        g.rect((SIZE - THICK) / 2, 0, THICK, SIZE);
        g.fill({ color: 0xffffff });
        return app.generateTexture({
            target: g
        });
    },
    triangle: function () {
        const g = new PIXI.Graphics();

        const size = 72;
        const h = size * Math.sqrt(3) / 2;

        // 🔥 중앙 보정용 오프셋
        const offsetY = h / 3;

        g.moveTo(0, -h / 2);
        g.lineTo(-size / 2, h / 2);
        g.lineTo(size / 2, h / 2);
        g.closePath();
        g.fill(0xffffff);
        g.moveTo(0, -h / 2);
        g.lineTo(0, h / 2 + offsetY);
        g.closePath();
        g.fill(0xffffff);

        return app.textureGenerator.generateTexture({
            target: g,
            antialias: false
        });
    },
    playerIdle: () => cropImg(Img.assets.player, 0, 0, 32, 48, 8, 1),
    playerLeft: () => cropImg(Img.assets.player, 0, 48, 32, 48, 8, 1),
    playerRight: () => cropImg(Img.assets.player, 0, 96, 32, 48, 8, 1),
    playerOption: () => cropImg(Img.assets.player, 0, 144, 16, 16),
    playerMainShot: () => cropImg(Img.assets.player, 0, 160, 64, 16),
    playerSubShot: () => cropImg(Img.assets.player, 0, 176, 64, 16),
    itemPoint:() => cropImg(Img.assets.bullet, 465, 388, 16, 16),
    itemBombPiece:() => cropImg(Img.assets.bullet, 353, 388, 32, 32),
    bulletLazer: ()=>smallBullet(0, 0),
    bulletSpear: ()=>smallBullet(0, 16),
    bulletRing: ()=>smallBullet(0, 16*2),
    bulletCircle: ()=>smallBullet(0, 16*3),
    bulletRice: ()=>smallBullet(0, 16*4),
    bulletKunai: ()=>smallBullet(0, 16*5),
    bulletIce: ()=>smallBullet(0, 16*6),
    bulletPaper: ()=>smallBullet(0, 16*7),
    bulletGun: ()=>smallBullet(0, 16*8),
    bulletDarkRice: ()=>smallBullet(0, 16*9),
    bulletStar: ()=>smallBullet(0, 16*10),
    bulletSmallDisappear: ()=>smallBullet(0, 16*11),
    bulletTear: ()=>smallBullet(0, 448),
    bulletDarksnow: ()=>verySmallBullet(0,192),
    bulletSmallrice: ()=>verySmallBullet(64,192),
    bulletSnow: ()=>verySmallBullet(0,240),
    bulletHeart: () => normalBullet(0,256),
    bulletArrow: () => normalBullet(0,256+32),
    bulletBigStar: () => normalBullet(256,32*0),
    bulletBig: () => normalBullet(256,32*1),
    bulletFairy: () => normalBullet(256,32*2),
    bulletKnife: () => normalBullet(256,32*3),
    bulletOval: () => normalBullet(256,32*4),
    bulletStone: () => normalBullet(256*2,32*3),
    bulletBigTear: () => normalBullet(256*2,32*4),
    bulletYinyang: () => normalBullet(256*2,32*5),
    bulletVeryBig: () => cropImg(Img.assets.bullet, 256,192, 64, 64, 4,1),
    bulletSpawn: () => normalBullet(256,32*5),
    bulletLight: function(){
        const list = []
        list.push(new PIXI.Texture({source: Img.assets.bullet,
            frame: { x: 256, y: 256, width: 64, height: 64 }
        }))
        list.push(new PIXI.Texture({source: Img.assets.bullet,
            frame: { x: 256+64, y: 256, width: 64, height: 64 }
        }))
        list.push(new PIXI.Texture({source: Img.assets.bullet,
            frame: { x: 256+64*3, y: 256+64, width: 64, height: 64 }
        }))
        list.push(new PIXI.Texture({source: Img.assets.bullet,
            frame: { x: 256+64*2, y: 256+64, width: 64, height: 64 }
        }))
        list.push(new PIXI.Texture({source: Img.assets.bullet,
            frame: { x: 256+64, y: 256+64, width: 64, height: 64 }
        }))
        list.push(new PIXI.Texture({source: Img.assets.bullet,
            frame: { x: 256, y: 256+64, width: 64, height: 64 }
        }))
        list.push(new PIXI.Texture({source: Img.assets.bullet,
            frame: { x: 256+64*3, y: 256, width: 64, height: 64 }
        }))
        list.push(new PIXI.Texture({source: Img.assets.bullet,
            frame: { x: 256+64*2, y: 256, width: 64, height: 64 }
        }))
        return list
    },
    bulletBentLazer: function () {
        const list = []
        const colorIndex = [0,2,14,13,10,8,6,4]
        for(let i=0;i<8;i++){
            const tex = new PIXI.Texture({
                source: Img.assets.bullet,
                frame: { x: 512, y: 224+36+24*colorIndex[i], width: 256, height: 16 }
            })
            list.push(tex)
        }
        return list
    },

}

function smallBullet(x,y){
    const list = []
    const colorIndex = [0,2,14,13,10,8,6,4,15]
    for(let i=0;i<colorIndex.length;i++){
        const tex = new PIXI.Texture({
            source: Img.assets.bullet,
            frame: { x: x+16*colorIndex[i], y: y, width: 16, height: 16 }
        })
        list.push(tex)
    }
    return list
}

function verySmallBullet(x,y){
    const list = []
    list.push(new PIXI.Texture({source: Img.assets.bullet,
        frame: { x: x, y: y, width: 8, height: 8 }
    }))
    list.push(new PIXI.Texture({source: Img.assets.bullet,
        frame: { x: x+8*2, y: y, width: 8, height: 8 }
    }))
    list.push(new PIXI.Texture({source: Img.assets.bullet,
        frame: { x: x+8*6, y: y+8, width: 8, height: 8 }
    }))
    list.push(new PIXI.Texture({source: Img.assets.bullet,
        frame: { x: x+8*5, y: y+8, width: 8, height: 8 }
    }))
    list.push(new PIXI.Texture({source: Img.assets.bullet,
        frame: { x: x+8*2, y: y+8, width: 8, height: 8 }
    }))
    list.push(new PIXI.Texture({source: Img.assets.bullet,
        frame: { x: x, y: y+8, width: 8, height: 8 }
    }))
    list.push(new PIXI.Texture({source: Img.assets.bullet,
        frame: { x: x+8*6, y: y, width: 8, height: 8 }
    }))
    list.push(new PIXI.Texture({source: Img.assets.bullet,
        frame: { x: x+8*4, y: y, width: 8, height: 8 }
    }))
    list.push(new PIXI.Texture({source: Img.assets.bullet,
        frame: { x: x+8*7, y: y+8, width: 8, height: 8 }
    }))
    return list
}

function normalBullet(x,y){
    const list = []
    const colorIndex = [0,1,7,6,5,4,3,2]
    for(let i=0;i<9;i++){
        const tex = new PIXI.Texture({
            source: Img.assets.bullet,
            frame: { x: x+32*colorIndex[i], y: y, width: 32, height: 32 }
        })
        list.push(tex)
    }
    return list
}

async function LoadTexture() {

}
