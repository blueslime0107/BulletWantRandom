# 기본적인 사용방법

- 게임 오브젝트를 생성하고 루틴을 진행시키는 방법
```js
const sprite = new GameObject()
// self는 startRoutine을 진행하는 오브젝트(sprite)를 의미한다
sprite.startRoutine('tag',function(self){
    ...
})
```

# Routine 메소드 설명

- whileTime
- this.repeat는 반복횟수를 의미, 1부터 시작
```js
if (this.whileTime(0)) {
    self.y += Math.sin(this.repeat / 20) * 0.5;
}
```

- whileFrame
- this.time은 whileFrame으로 반복시 몇초 동안 실행되는지를 가님
```js
// this.time = 60
if (this.whileFrame(60)) {
    self.y = frameMove(0,100,this.repeat,this.time,Easing.linear)
}
```
