# Copilot Instructions — Game Engine Core

## Project Overview

PixiJS + Three.js 기반 게임 프레임워크. `main/`이 공통 코어이며, `game/`, `arithmos/`는 파생 프로젝트.
NW.js(우선) + 브라우저 겸용. 해상도 1280×720, 60FPS 고정 루프.

## Architecture

```
main/
  index.html          ← 진입점 (스크립트 로드 순서 중요!)
  script/
    __globalCustom.js  ← 커스텀 전역 선언
    _gameD.js          ← 게임 데이터/설정 (const로 선언)
    sceneTitle.js      ← 씬 구현 파일 (scene + 이름)
    sceneMainGame.js
    core/
      _global.js       ← var 전역 변수 선언
      _main.js         ← 부팅 시퀀스 + 게임 루프
      gameManagers.js  ← 모든 매니저 클래스
      gameObjects.js   ← GameObject, SceneObject 등
      uiObject.js      ← UI 컴포넌트
      utils.js         ← 유틸리티 함수
  resources/
    textures/          ← 이미지 에셋 (경로: ./resources/textures/)
    translate/         ← 언어 JSON + langList.txt
```

## Script Loading Order (CRITICAL)

index.html에서 순서가 보장되어야 함:
1. fpsmeter → __globalCustom → _global → utils
2. gameObjects → gameManagers → uiObject (module)
3. pixi.js → pixi-filters → three.module (라이브러리)
4. _gameD.js (게임 데이터)
5. _main.js (부팅, module)

## Key Global Objects

| 전역변수 | 클래스 | 역할 |
|---------|--------|------|
| `Input` | InputManager | 키보드/마우스/터치 입력 |
| `Img` | TextureManager | 스프라이트 생성 |
| `Tm` | ThreeManager | 3D 배경 관리 |
| `Am` | AudioManager | BGM/SFX 재생 |
| `Save` | SaveManager | 저장 (NW.js 파일/localStorage) |
| `Scene` | SceneManager | **씬 전환은 반드시 Scene.enter()만 사용** |
| `Data` | DataManager | 텍스트 스타일, 캐릭터, 언어 데이터, 번역 텍스트 |
| `Opt` | OptionManager | 게임 옵션 (볼륨/언어/전체화면) |
| `Dm` | DialogManager | 대화 시스템 |
| `Rnd` | RandomManager | 시드 기반 랜덤 |

## Code Conventions

### 씬 정의
- `SceneObject`를 상속, `init()` / `enter(option)` / `update()` 구현
- 파일명: `scene{Name}.js`, gameData.scene 배열 이름과 일치
- **씬 이동은 항상 `Scene.enter(Scene.sceneList.Name, option)`으로만 수행** — 다른 매니저에 씬 이동 메서드 금지

### 매니저 패턴
```js
export class FooManager {
  constructor() { /* state */ }
}
window.Foo = new FooManager();
```

### 텍스트 스타일
- 모든 텍스트 스타일은 `_gameD.js`의 `gameTxtsty`에 정의
- `Data.styles.xxx`로 참조 — **인라인 스타일 객체 직접 작성 금지**
- `langId` 있으면 언어별 폰트 자동 적용 (LangTextStyle)

### 스프라이트/텍스트 생성
- `anchor`, `position`은 생성자 옵션에 포함 — 생성 후 `.set()` 호출 금지
```js
// Good
Img.sprite('rect', [100, 50], 'rgba(255,0,0,1)', {
  anchor: 0.5,
  position: { x: 100, y: 200 }
});

new Text({
  text: Data.text('key', 'fallback'),
  style: Data.styles.menuItem,
  anchor: 0.5,
  position: { x: SW * 0.5, y: SH * 0.5 }
});

// Bad — 중복 호출
const t = new Text({ text: '...', style: Data.styles.menuItem });
t.anchor.set(0.5);          // ← 금지
t.position.set(640, 360);   // ← 금지
```

### 번역
- `Data.text('tag')` 사용
- 언어 순환: `Opt.cycleLanguage(step)` — step 기본값 1 (다음), -1 (이전)
- 언어 파일: `resources/translate/{lang}.json`
- `langList.txt`에 언어 코드 나열

### 입력
```js
Input.isPressed(KeyBind.OK)   // 이번 프레임에 눌림
Input.isDown(KeyBind.UP)      // 누르고 있는 중
```

### 경로
- 텍스처: `./resources/textures/` (index.html 기준)
- 번역: `./resources/translate/`
- `../`로 상위 참조 금지 — 항상 `./` 기준

## Init Sequence
```
Data.earlyinit()  → 씬 import + 언어 로드 + 스테이지 로드
Img.loadTextures() → TextureAssets 로드
Tm.loadTextures()  → ThreeTextures 로드
Am.loadAudios()    → 오디오 디코딩
Data.init()        → 텍스트 스타일/키바인드/캐릭터
Opt.init()         → 옵션 데이터 복원 및 적용
Scene.init()       → 모든 씬 init + 시작 씬 enter
```

### Button / UI 컴포넌트

- 씬에서 클릭 가능한 텍스트를 만들 때는 `new Text(...)` 직접 사용 금지 — 반드시 `new Button(options)` 사용
- `Button` 생성자는 단일 options 객체만 받는다:
```js
// Good
new Button({
  langKey: 'menu_start',       // 번역 키 (있으면 텍스트 자동 갱신)
  text: 'Start',               // langKey 없을 때 폴백 텍스트
  style: Data.styles.menuItem, // 반드시 Data.styles.xxx 참조
  onPress: () => { ... },      // 버튼 선택 콜백
  onHighlight: (isActive) => { ... } // 하이라이트 콜백
});

// Bad
new Text({ text: Data.text('menu_start'), style: Data.styles.menuItem });
// ↑ 씬 메뉴에서 클릭 가능 요소에 Text 직접 사용 금지
```

### InputUIGroup

- `addItem(ui, keyMap)`의 첫 번째 인수에는 반드시 `Button` 인스턴스를 전달한다 (`null` 금지)
- `SceneObject.update()` 안에서 `Input.isPressed` 분기를 직접 작성 금지 — `currentInputGroup.update()`에 위임
- 씬은 `currentInputGroup` 변수를 갖고 `setInputGroup(group)`으로 전환한다
```js
// Good — update()는 단순 위임
update() {
  super.update();
  this.currentInputGroup?.update();
}

// Bad — 씬 update에 직접 분기
update() {
  if (Input.isPressed(KeyBind.UP)) { ... }
}
```

- 엔트리 데이터의 액션 함수명은 `onPress`로 통일 (`onSelect` 사용 금지):
```js
const entries = [
  { key: 'menu_start', onPress: () => Scene.enter(...) }, // Good
  { key: 'menu_start', onSelect: () => Scene.enter(...) } // Bad
];
```

### 씬 UI 오브젝트 네이밍

- 씬에서 `Button` 또는 UI 오브젝트를 담는 변수/프로퍼티명은 `ui`로 통일한다 (`label` 금지)
- 메뉴 설정 배열의 항목 필드명도 `ui:`를 사용한다:
```js
// Good
const ui = new Button({ langKey: 'menu_start', style: Data.styles.menuItem });
const options = [ { ui: bgmBtn, left: () => {}, right: () => {} } ];

// Bad
const label = new Button({ ... });      // ← 변수명 label 금지
const options = [ { label: bgmBtn } ];  // ← 필드명 label 금지
```

### 메뉴 로컬라이징 동기화

- 메뉴 키를 추가·수정·삭제할 때는 `en.json`, `ja.json`, `ko.json` 3개 파일을 **같은 작업에서 동시에** 수정한다
- 하나라도 누락되면 작업 미완료로 간주한다

### 코어 클래스 필드 삭제

- `script/core/` 파일에서 필드(변수)를 삭제할 때는 해당 필드를 참조하는 **메서드·조건 분기·관련 로직 전체를 함께 제거**한다
- 삭제 후 파일 전체에서 해당 이름이 남아 있지 않은지 반드시 검증한다

## Anti-patterns

- ❌ 씬 이동을 Scene 외 클래스에서 수행
- ❌ `new Text({ style: { fontSize: 32, ... } })` 인라인 스타일
- ❌ `.anchor.set()` / `.position.set()` 생성 후 별도 호출
- ❌ `../resources/` 상대경로 (반드시 `./resources/`)
- ❌ `AppShell` 참조 (삭제됨 → `Opt` + `Data`로 분리)
- ❌ `Lang.t(...)` 사용 — `LocalizeManager` 삭제됨, `Data.text(...)` 사용
- ❌ `Opt.saveAll()` — `Save.saveAll(Opt.option)` 사용
- ❌ `Opt.playerData`, `Opt.playTime`, `Opt.session` 참조 — `OptionManager`는 옵션 전용
- ❌ 씬 메뉴에서 `new Text(...)` 직접 사용 — `new Button(...)` 사용
- ❌ `InputUIGroup.addItem(null, keyMap)` — 첫 번째 인수에 반드시 Button 전달
- ❌ `SceneObject.update()`에서 `Input.isPressed` 직접 분기 — `InputUIGroup.update()`에 위임
- ❌ 엔트리 액션 함수명 `onSelect` — `onPress`로 통일
- ❌ UI 오브젝트 변수/프로퍼티명 `label` — `ui`로 통일
- ❌ 메뉴 키 변경 시 일부 언어 파일만 수정 — en/ja/ko 3개 동시 수정 필수
- ❌ 코어 클래스 필드만 삭제하고 의존 메서드·분기 방치 — 관련 코드 전체 함께 정리


## 일반 코딩 원칙

### 클래스 중복 최소화
- 클래스 구조로 중복을 줄인다. 좌/우, 플레이어 등 대칭적인 데이터는 반드시 클래스 인스턴스의 프로퍼티로 중첩해 표현한다.
  ```js
  // 좋음 — 중첩 구조
  bm.left.player
  bm.right.player

  // 나쁨 — 플랫 구조
  bm.leftPlayer
  bm.rightPlayer
  ```

### 일회성 함수 인라인
- **단 한 번만 호출되는 함수는 별도 메서드로 분리하지 않고 호출 위치에 인라인으로 작성한다.**
- 재사용되거나 이름이 있을 때만 메서드로 추출한다.
- 단 initialize, init, update 등 초기화하는 요소, 라이프사이클 메서드는 예외적으로 일회성이라도 메서드로 분리한다.

### 전역 접근 가능한 값을 파라미터로 넘기지 않는다
- `gm`, `bm`, `gameWindow` 등 전역으로 접근 가능한 객체의 값을 굳이 파라미터로 받아 처리하지 않는다.
  ```js
  // 좋음 — 전역에서 직접 읽기
  method() { console.log(this.param); }
  gm.method();

  // 나쁨 — 전역 값을 파라미터로 전달
  method(text) { console.log(text); }
  gm.method(gm.param);
  ```

### 과도한 방어적 코드 금지
- 버그나 에러를 직접 보고받기 전까지 불필요한 방어 코드를 추가하지 않는다.
- 특히 아래 패턴은 지시 없이 사용하지 않는다:
  - `Array.isArray(x)` 검사
  - `null`로의 선제적 초기화
  - `if (!x);` 형식의 도달 불가능한 경우에 대한 예외 처리
  - `typeof` 검사
  ```js
  // 나쁨 — 지시 없는 방어 코드
  if (!Array.isArray(skillIds) || !Array.isArray(window.chocoSkills)) return result;

  // 좋음 — 그냥 사용
  for (let i = 0; i < skillIds.length; i++) { ... }
  ```

### update()에서 그리기 금지
- **그리기/렌더링 함수는 값이 실제로 변경될 때만 호출한다.** `update()`에 그리기 함수를 넣지 않는다.
- 세터에서 즉시 렌더링을 트리거하는 구조로 작성한다.
  ```js
  // 좋음 — 값 변경 시점에 직접 그리기
  setHealth(value) {
      this.health = value;
      this.updateHealthDisplay();
  }
  update() { /* 그리기 없음 */ }

  // 나쁨 — 매 프레임 그리기
  setHealth(value) { this.health = value; }
  update() { this.updateHealthDisplay(); }
  ```

### 전역 변수 앞에 `window.` 붙이지 않기
- `window`에 노출된 전역 변수는 접근 시 `window.` 접두사를 붙이지 않는다.
  ```js
  // 좋음
  chocoCombos[i]
  chocoSkills[id]

  // 나쁨
  window.chocoCombos[i]
  window.chocoSkills[id]
  ```
- 단, 전역에 **등록**할 때(`window.xxx = ...`)는 `window.`을 사용한다.

### 일회성 함수 인라인
- **단 한 번만 호출되는 함수는 별도 메서드로 분리하지 않고 호출 위치에 인라인으로 작성한다.**
- 재사용되거나 이름이 있을 때만 메서드로 추출한다.
- 단 initialize, init, update 등 초기화하는 요소, 라이프사이클 메서드는 예외적으로 일회성이라도 메서드로 분리한다.
