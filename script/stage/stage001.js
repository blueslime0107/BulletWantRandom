/** @type {import("../sceneMainGame").StageRoutine} */
export const stage = {
    name: 'stage1',
    update: function () {
        if(this.whenTime(0)){
            gm.spawnEnemy(pos(getRandom(60,GS-60),-60),enemyArcaive.normal).MoveDir(90,2)
        }
        if(this.whenTime(60)){
            this.currentLine = 0
        }
    }
}

/**@type {import("../sceneMainGame").EnemyDataArchive} */
const enemyArcaive = {
    normal: {
        enemy: "butterfly1",
        health: 10,
        spell: function (self) {
            if(this.whileTime(60,this.repeat < 3)){
                Am.playSFX("tan1")
                gm.spawnBullet(BData.circle,getRandom(5,7),self).MoveDirSpdEase(lookPoint(self,gm.player),8,4,60,Easing.linear)
            }
        }
    },

}