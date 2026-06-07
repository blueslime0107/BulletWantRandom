/** @type {import("../sceneMainGame").StageRoutine} */
export const stage = {
    name: 'stage1',
    update: function () {


        return
        if(this.whenTime(0)){
            gm.spawnEnemy(pos(getRandom(60,GS-60),-60),enemyArcaive[eArcaiveKeys[getRandom(0,eArcaiveKeys.length)]])
        }
        if(this.whenTime(5)){
            this.currentLine = 0
        }

        if(this.whenTime(0)){
            gm.spawnEnemy(pos(getRandom(60,GS-60),-60),enemyArcaive.bomb2)
        }
        if(this.whenTime(60)){
            this.currentLine = 0
        }
    }
}



const eArcaiveKeys = Object.keys(enemyArcaive)