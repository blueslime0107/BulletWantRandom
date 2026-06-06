# ThreeBG 시스템 인수인계

## 파일 위치
- 데이터 정의: `script/_three.js`
- 렌더 매니저: `script/core/gameManagers.js` → `ThreeManager` (`window.Tm`)
- 진입점: `script/core/_main.js` (GUI 디버그 패널 포함)

---

## 전체 흐름

```
ThreeBG[key]          ← BG 설정 데이터 (script/_three.js)
ThreeTextures[key]    ← 텍스처 경로 정의 (script/_three.js)
Tm.init()             ← gameData.defaultBG 키로 initBG + initSky 호출
Tm.update()           ← 매 프레임: 카메라 이동, 세그먼트 풀, 파티클 업데이트
```

---

## ThreeBG 항목 구조

```js
const ThreeBG = {
  myBG: {
    scrollSpeed: 0.1,                             // 카메라 X축 이동 속도 (프레임당)
    camPosition: { x, y, z },                    // 초기 카메라 위치
    comRotation: { x, y, z },                    // 초기 카메라 회전 (도 단위, 내부에서 라디안 변환)
    fogSetting:  { color: '#hex', near, far },   // Three.js Fog 설정 (near=0도 정상 작동)
    sky: "ThreeTextures_키",                      // 스카이박스 텍스처 키
    skyRadius: 220,                               // CylinderGeometry 반지름
    skyHeight: 80,                                // CylinderGeometry 높이
    skyY: 10,                                     // 스카이 Y 위치

    particles: { ... },   // 생략 가능. 없으면 파티클 없음

    segmentsData: {
      "segName": { name, segLen, init: function() { /* this.group에 Three.js 오브젝트 추가 */ } }
    },
    initialSegments: ['segName', ...],  // 맨 처음 스폰 순서 (중복 허용, loopSegments는 Set으로 중복 제거)
  }
}
```

---

## 세그먼트 시스템

- `ThreeManager.initBG(bg)` 에서 segmentsData를 순회해 `this.segments[name]`에 등록
- `BGSegment(data)` 인스턴스를 생성해 `three.scene`에 추가
- 오브젝트 풀(`this.segmentPool`): 화면 뒤로 벗어나면 `hide()` + 풀에 반환, 재사용 시 `show()` + `setPosition()`
- **카메라 기준** `camX + 100` 앞쪽 미리 스폰, `camX - 150` 뒤쪽 회수
- `loopSegments` 배열에서 순환 스폰. `transitionQueue`가 있으면 먼저 소비
- BG 전환 시 `resetBGSetting()`이 `this.segments`, `this.segmentPool` 초기화하므로 이전 BG 잔재 없음

### 세그먼트 공유
여러 BG에서 동일한 세그먼트를 쓰려면 최상단에 상수로 추출 후 참조:
```js
const _plainSegment = { name: "plain", segLen: 50, init: function() { ... } }
// ThreeBG.stage1.segmentsData["plain"] = _plainSegment
// ThreeBG.forest.segmentsData["plain"] = _plainSegment
```

---

## 텍스처 등록

```js
const ThreeTextures = {
  myKey: { texture: 'stage/stage1/floor' },        // .png 자동 추가, 경로는 resources/textures/ 기준
  myKey2: { texture: 'Bg1', crop: [x, y, w, h] }, // crop: 이미지 일부만 잘라서 사용
}
```

`Tm.loadTextures()`가 로드 후 `ThreeTextures[key]` 를 `THREE.Texture`로 **덮어씀** (원본 객체 파괴됨). 재로드 불가이므로 주의.

---

## 파티클 시스템

`particles` 필드가 있으면 `Tm._initParticles(cfg)`가 자동 호출됨. 없으면 파티클 없음.

```js
particles: {
  texture: 'ThreeTextures_키',
  count: 200,                      // 파티클 수 (변경 시 ↺ Reinit 필요)
  size: 0.5,                       // 파티클 크기 (ShaderMaterial uSize uniform)
  spawnX: [-80, 80],               // 최초 스폰 X 범위
  spawnY: [1, 40],                 // 최초 스폰 Y 범위 (전체 높이에 고르게 분포)
  spawnZ: [-50, 50],               // 최초 스폰 Z 범위
  fallSpeed: [0.05, 0.09],         // Y 낙하 속도 min/max (파티클마다 다름)
  forwardSpeed: [0.03, 0.06],      // Z 전진 속도 min/max (뒤→앞)
  swayAmp: 0.02,                   // X 흔들림 진폭 (sin파 기반)
  rotationSpeed: [-0.03, 0.03],    // 개별 회전 속도 min/max (음수=시계방향)
  recycleY: -2,                    // 이 Y 아래면 → 리스폰
  recycleZ: 55,                    // 이 Z 넘으면 → Z 뒤쪽으로 리셋
  respawnY: [12, 36],              // 리스폰 시 Y 범위 (spawnY와 분리 — 상단 근처만)
}
```

### spawnY vs respawnY를 분리하는 이유
- **`spawnY`**: 게임 시작 시 파티클을 Y 전체 범위에 고르게 분포시켜 처음부터 화면 가득 채움
- **`respawnY`**: 파티클이 바닥에 닿아 재활용될 때 상단 근처에서만 리스폰 → 위에서 떨어지는 흐름 유지
- 둘을 합치면 시작 시 폭포처럼 한꺼번에 쏟아지거나, 재활용 시 중간에서 뚝 나타나는 현상 발생

### 렌더링: ShaderMaterial
`THREE.PointsMaterial`은 per-particle 회전 불가 → `ShaderMaterial` 사용.
- `rotation` attribute (Float32Array, 1개/파티클) → 프래그먼트에서 UV 회전 후 샘플링
- `uSize` uniform → GUI에서 실시간 수정 가능

### 파티클 전환
BG 전환(`resetBGSetting`) 시 자동으로 `three.scene.remove` + `dispose` 처리됨.

---

## ThreeManager 주요 필드 (window.Tm)

| 필드 | 설명 |
|------|------|
| `particles` | 현재 `THREE.Points` 인스턴스 |
| `particleCfg` | 현재 파티클 cfg 객체 (GUI에서 직접 수정) |
| `particlePhase` | 파티클별 사인파 phase |
| `particleRate` | 파티클별 속도 비율 (0~1) |
| `particleRotation` | 파티클별 현재 회전각 |
| `particleRotSpeed` | 파티클별 회전 속도 |
| `particleTime` | 누적 시간 (sway 계산용) |

---

## 테마 전환 API

```js
Tm.changeTheme(['loopSeg1', 'loopSeg2'], ['transitionSeg'])
// transitionQueue를 먼저 소비한 뒤 loop 순환으로 전환
```

---

## GUI 디버그 패널 (`gameData.showThreeEdit`가 true일 때만 표시)

- Camera Position / Camera Rotation / Fog 폴더
- **Particles 폴더**: Count, Size, Sway Amp, Recycle Y/Z, Spawn XYZ, Respawn Y, Fall Speed, Forward Speed, Rot Speed
  - min/max 쌍은 CSS grid로 2열 배치 (슬라이더 없는 number input)
  - `↺ Reinit` 버튼: count 변경 등 geometry 재생성이 필요한 경우 클릭

---

## 주의사항

- `fog.near: 0`은 정상 동작함. `|| 300` 폴백 사용하면 안 됨 → `?? 300` 사용
- `three.camera.x = 0` 은 무효 (Three.js Camera에 `.x` 없음) → `three.camera.position.x = 0`
- BG 재진입 시 이전 sky Mesh를 반드시 `scene.remove + dispose` 해야 중복 추가 방지
- `gameData.defaultBG` 키가 `ThreeBG`에 없으면 `Tm.init()`에서 undefined 접근으로 크래시
