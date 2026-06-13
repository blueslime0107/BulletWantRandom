
const TextureAssets = {
    player:'player.png',
    bullet:'bullet.png',
    titleBG:'title/background.png',
    utility:'utility/item.png',
    enemy:'enemy.png',
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
    // enemyButterfly1: () => cropImg(Img.assets.enemy, 0, 0, 32, 32, 4, 1),
    // enemyButterfly2: () => cropImg(Img.assets.enemy, 0, 32, 32, 32, 4, 1),
    // enemyBird1 : () => cropImg(Img.assets.enemy, 0, 64, 48, 48, 6, 1),
    // enemySlime1 : () => cropImg(Img.assets.enemy, 0, 112, 48, 48, 3, 1),
    // enemySnake1 : () => cropImg(Img.assets.enemy, 0, 160, 48, 48, 6, 1),
    // stage1_midBoss: () => cropImg(Img.assets.stage1_midBoss, 0, 0, 64, 64, 2, 1),
    // stage1_boss1: () => cropImg(Img.assets.stage1_boss1, 0, 0, 81, 108, 4, 1),
    enemy_stupid: () => cropImg(Img.assets.enemy, 0, 0, 32, 32),
    enemy_normal: () => cropImg(Img.assets.enemy, 32, 0, 32, 32),
    enemy_redLazer: () => cropImg(Img.assets.enemy, 64, 0, 32, 32),
    enemy_orangeLazer: () => cropImg(Img.assets.enemy, 96, 0, 32, 32),
    enemy_cyanBigger: () => cropImg(Img.assets.enemy, 0, 32, 32, 32),
    enemy_pinkHoming: () => cropImg(Img.assets.enemy, 64, 32, 32, 32),
    enemy_yellowSpread: () => cropImg(Img.assets.enemy, 128, 0, 32, 32),
    enemy_greenSpread: () => cropImg(Img.assets.enemy, 32, 32, 32, 32),
    enemy_whiteBomb: () => cropImg(Img.assets.enemy, 160, 0, 32, 32),
    enemy_redCross: () => cropImg(Img.assets.enemy, 96, 32, 32, 32)
}

const Bullets = {
    bulletLazer: ()=> cropImg(Img.assets.bullet, 0, 0, 16, 16, 9,1),
    bulletSpear: ()=>cropImg(Img.assets.bullet, 0, 16, 16, 16, 9,1),
    bulletRing: ()=>cropImg(Img.assets.bullet, 0, 32, 16, 16, 9,1),
    bulletCircle: ()=>cropImg(Img.assets.bullet, 0, 48, 16, 16, 9,1),
    bulletRice: ()=>cropImg(Img.assets.bullet, 0, 64, 16, 16, 9,1),
    bulletKunai: ()=>cropImg(Img.assets.bullet, 0, 80, 16, 16, 9,1),
    bulletIce: ()=>cropImg(Img.assets.bullet, 0, 96, 16, 16, 9,1),
    bulletPaper: ()=>cropImg(Img.assets.bullet, 0, 112, 16, 16, 9,1),
    bulletGun: ()=>cropImg(Img.assets.bullet, 0, 128, 16, 16, 9,1),
    bulletDarkRice: ()=>cropImg(Img.assets.bullet, 0, 144, 16, 16, 9,1),
    bulletStar: ()=>cropImg(Img.assets.bullet, 0, 160, 16, 16, 9,1),
    bulletTear: ()=>cropImg(Img.assets.bullet, 0, 176, 16, 16, 9,1),
    bulletSmallDisappear: ()=>cropImg(Img.assets.bullet, 0, 192, 16, 16, 9,1),
    bulletDarksnow: ()=>cropImg(Img.assets.bullet, 0,208, 8, 8, 9,1),
    bulletSmallrice: ()=>cropImg(Img.assets.bullet, 0,216, 8, 8, 9,1),
    bulletSnow: ()=>cropImg(Img.assets.bullet, 0,224, 8, 8, 9,1),
    bulletBigStar: () => cropImg(Img.assets.bullet, 144,0, 32, 32, 9,1),
    bulletBig: () => cropImg(Img.assets.bullet, 144,32, 32, 32, 9,1),
    bulletFairy: () => cropImg(Img.assets.bullet, 144,64, 32, 32, 9,1),
    bulletKnife: () => cropImg(Img.assets.bullet, 144,96, 32, 32, 9,1),
    bulletOval: () => cropImg(Img.assets.bullet, 144,128, 32, 32, 9,1),
    bulletRest: () => cropImg(Img.assets.bullet, 144,160, 32, 32, 9,1),
    bulletStone: () => cropImg(Img.assets.bullet, 144,192, 32, 32, 9,1),
    bulletBigTear: () => cropImg(Img.assets.bullet, 144,224, 32, 32, 9,1),
    bulletYinyang: () => cropImg(Img.assets.bullet, 144,256, 32, 32, 9,1),
    bulletHeart: () => cropImg(Img.assets.bullet, 144,288, 32, 32, 9,1),
    bulletArrow: () => cropImg(Img.assets.bullet, 144,320, 32, 32, 9,1),
    bulletSpawn: () => cropImg(Img.assets.bullet, 144,384, 32, 32, 9,1),
    bulletVeryBig: () => cropImg(Img.assets.bullet, 432,0, 64, 64, 5,2),
    bulletBigYinyang: () => cropImg(Img.assets.bullet, 432,128, 64, 64, 5,2),
    bulletLight: () => cropImg(Img.assets.bullet, 432,256, 64, 64, 5,2),
    bulletBentLazer: () => cropImg(Img.assets.bullet, 144,512, 256, 16, 1,9),
    bulletNuke: () => cropImg(Img.assets.bullet, 432,384, 256, 256, 1,1),
}

const Utilitys = {
    live: () => cropImg(Img.assets.utility, 0, 0, 64, 64),
    liveEmpty: () => cropImg(Img.assets.utility, 64, 0, 64, 64),
    bomb: () => cropImg(Img.assets.utility, 0, 64, 64, 64),
    bombEmpty: () => cropImg(Img.assets.utility, 64, 64, 64, 64),
    spellNameBg: () => cropImg(Img.assets.utility, 224, 0, 176, 24),
}

const PlayerThings = {
    playerIdle: () => cropImg(Img.assets.player, 0, 0, 32, 48, 8, 1),
    playerLeft: () => cropImg(Img.assets.player, 0, 48, 32, 48, 8, 1),
    playerRight: () => cropImg(Img.assets.player, 0, 96, 32, 48, 8, 1),
    playerOption: () => cropImg(Img.assets.player, 32, 144, 16, 16),
    playerMainShot: () => cropImg(Img.assets.player, 0, 144, 32, 16),
    playerSubShot: () => cropImg(Img.assets.player, 80, 144, 32, 16),
}

const Textures = {
    ...Stands,
    ...Enemys,
    ...Bullets,
    ...Utilitys,
    ...PlayerThings,

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
    itemPoint:() => cropImg(Img.assets.bullet, 16, 528, 16, 16),
    itemBombPiece:() => cropImg(Img.assets.bullet, 353, 388, 32, 32),
}

async function LoadTexture() {

}
