/** @type {import("../sceneMainGame").StageRoutine} */
export const stage = {
    name: 'stage1',
    update: function () {
        if(this.whenTime(0)){
            gm.spawnEnemy(pos(getRandom(60,GS-60),-60),/*enemyArcaive[eArcaiveKeys[getRandom(0,eArcaiveKeys.length)]]*/enemyArcaive.growingBullet)
        }
        // if(this.whenTime(10)){
        //     this.currentLine = 0
        // }
    }
}

/**@type {import("../sceneMainGame").EnemyDataArchive} */
const enemyArcaive = {
    rush: {
        enemy: "slime1",
        health: 20,
        spell: function (self) {
            if(this.whenTime(0)){
                self.MoveDir(lookPoint(self,gm.player),4)
            }
        }
    },
    normal: {
        enemy: "butterfly1",
        health: 10,
        spell: function (self) {
            if(this.whenTime(0)){
                self.MoveDir(90,2)
            }
        }
    },
    smallBullet: {
        enemy: "butterfly2",
        health: 10,
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
    growingBullet: {
        enemy: "bird1",
        health: 10,
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
    }
}

const eArcaiveKeys = Object.keys(enemyArcaive)