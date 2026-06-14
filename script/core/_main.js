const W = gameData.resolution[0]
const H = gameData.resolution[1]
const GW = gameData.gameArea.width
const GH = gameData.gameArea.height

window.IsPortrait = gameData.isPortrait; // 세로 회상도
window.noPortrait = gameData.noPortrait; // 세로 회상도 비활성
window.SW = W
window.SH = H

function resizeCanvas() {

  if (!noPortrait) {
    IsPortrait = window.innerHeight > window.innerWidth
    SW = (IsPortrait) ? H : W
    SH = (IsPortrait) ? W : H
  }

  const scaleX = window.innerWidth / SW;
  const scaleY = window.innerHeight / SH;
  const scale = Math.min(scaleX, scaleY);
  const canvasWidth = SW * scale;
  const canvasHeight = SH * scale;
  const left = (window.innerWidth - canvasWidth) / 2;
  const top = (window.innerHeight - canvasHeight) / 2;

  // PixiJS 캔버스 스타일 설정
  app.resize(SW, SH)
  app.canvas.style.width = `${canvasWidth}px`;
  app.canvas.style.height = `${canvasHeight}px`;
  app.canvas.style.left = `${left}px`;
  app.canvas.style.top = `${top}px`;
  app.canvas.style.position = 'absolute';
  app.canvas.style.imageRendering = 'pixelated';

  resize()
}

window.addEventListener('resize', resizeCanvas);

/* Three Inint */
const threeScene = new THREE.Scene();
const _camera = new THREE.PerspectiveCamera(75, GW / GH, 0.1, 1000);
const threeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
threeRenderer.setSize(GW, GH);
threeScene.background = new THREE.Color(0x000000);
threeScene.fog = new THREE.Fog(
  'rgb(0,0,0)',   // 안개 색 (하늘/배경색과 맞추는 게 핵심)
  300,         // fogNear
  500         // fogFar
);
export const __three = {
  scene: threeScene,
  camera: _camera,
  background: threeScene.background,
  fog: threeScene.fog,
  renderer: threeRenderer
};



window.three = __three;

/* lil-gui: Three.js 디버그 패널 */
const gui = new GUI({ title: 'Three.js Debug' });

// 카메라 위치
const camPos = gui.addFolder('Camera Position');
camPos.add(_camera.position, 'x', -100, 100, 0.1).name('pos X').listen();
camPos.add(_camera.position, 'y', -100, 100, 0.1).name('pos Y').listen();
camPos.add(_camera.position, 'z', -100, 100, 0.1).name('pos Z').listen();

// 카메라 회전 (도 단위로 표시)
const camRot = gui.addFolder('Camera Rotation');
const rotProxy = { x: 0, y: 0, z: 0 };
const degToRad = Math.PI / 180;
const radToDeg = 180 / Math.PI;
camRot.add(rotProxy, 'x', -180, 180, 0.1).name('rot X (°)').listen().onChange(v => { _camera.rotation.x = v * degToRad; });
camRot.add(rotProxy, 'y', -180, 180, 0.1).name('rot Y (°)').listen().onChange(v => { _camera.rotation.y = v * degToRad; });
camRot.add(rotProxy, 'z', -180, 180, 0.1).name('rot Z (°)').listen().onChange(v => { _camera.rotation.z = v * degToRad; });

// 안개
const fogFolder = gui.addFolder('Fog');
const fogParams = {
  color: '#000000',
  near: threeScene.fog.near,
  far: threeScene.fog.far
};
fogFolder.addColor(fogParams, 'color').name('Fog Color').listen().onChange(v => {
  threeScene.fog.color.set(v);
  threeScene.background.set(v);
});
fogFolder.add(fogParams, 'near', 0, 100, 1).name('Fog Near').listen().onChange(v => { threeScene.fog.near = v; });
fogFolder.add(fogParams, 'far', 0, 200, 1).name('Fog Far').listen().onChange(v => { threeScene.fog.far = v; });

// CSS 주입 — 파티클 서브폴더 2열
const _pairStyle = document.createElement('style');
_pairStyle.textContent = `.particle-pair > .children { display: grid; grid-template-columns: 1fr 1fr; } .particle-pair > .children .controller { min-width: 0; }`;
document.head.appendChild(_pairStyle);

// 파티클
const particleFolder = gui.addFolder('Particles');
particleFolder.close();
const particleParams = {
  count:           800,
  size:            0.8,
  swayAmp:         0.02,
  spawnXMin: -80,  spawnXMax:  80,
  spawnYMin:   1,  spawnYMax:  40,
  spawnZMin: -50,  spawnZMax:  50,
  fallSpeedMin:    0.05,  fallSpeedMax:    0.09,
  forwardSpeedMin: 0.03,  forwardSpeedMax: 0.06,
  rotSpeedMin:    -0.03,  rotSpeedMax:     0.03,
  recycleY:       -2,
  recycleZ:        55,
  respawnYMin:     12,    respawnYMax:     36,
  reinit: () => { if (Tm.particleCfg) Tm._initParticles(Tm.particleCfg); }
};

particleFolder.add(particleParams, 'count', 50, 2000, 1).name('Count').listen().onChange(v => {
  if (Tm.particleCfg) Tm.particleCfg.count = v;
});
particleFolder.add(particleParams, 'size', 0.1, 5, 0.05).name('Size').listen().onChange(v => {
  if (!Tm.particleCfg) return;
  Tm.particleCfg.size = v;
  if (Tm.particles) Tm.particles.material.uniforms.uSize.value = v;
});
particleFolder.add(particleParams, 'swayAmp', 0, 0.2, 0.001).name('Sway Amp').listen().onChange(v => {
  if (Tm.particleCfg) Tm.particleCfg.swayAmp = v;
});
particleFolder.add(particleParams, 'recycleY').name('Recycle Y').listen().onChange(v => {
  if (Tm.particleCfg) Tm.particleCfg.recycleY = v;
});
particleFolder.add(particleParams, 'recycleZ').name('Recycle Z').listen().onChange(v => {
  if (Tm.particleCfg) Tm.particleCfg.recycleZ = v;
});

const mkPair = (parent, label) => {
  const f = parent.addFolder(label);
  f.domElement.classList.add('particle-pair');
  f.open();
  return f;
};

const spawnFolder = mkPair(particleFolder, 'Spawn');
spawnFolder.add(particleParams, 'spawnXMin').name('X min').listen().onChange(v => { if (Tm.particleCfg) Tm.particleCfg.spawnX[0] = v; });
spawnFolder.add(particleParams, 'spawnXMax').name('X max').listen().onChange(v => { if (Tm.particleCfg) Tm.particleCfg.spawnX[1] = v; });
spawnFolder.add(particleParams, 'spawnYMin').name('Y min').listen().onChange(v => { if (Tm.particleCfg) Tm.particleCfg.spawnY[0] = v; });
spawnFolder.add(particleParams, 'spawnYMax').name('Y max').listen().onChange(v => { if (Tm.particleCfg) Tm.particleCfg.spawnY[1] = v; });
spawnFolder.add(particleParams, 'spawnZMin').name('Z min').listen().onChange(v => { if (Tm.particleCfg) Tm.particleCfg.spawnZ[0] = v; });
spawnFolder.add(particleParams, 'spawnZMax').name('Z max').listen().onChange(v => { if (Tm.particleCfg) Tm.particleCfg.spawnZ[1] = v; });

const respawnFolder = mkPair(particleFolder, 'Respawn Y');
respawnFolder.add(particleParams, 'respawnYMin').name('min').listen().onChange(v => { if (Tm.particleCfg) Tm.particleCfg.respawnY[0] = v; });
respawnFolder.add(particleParams, 'respawnYMax').name('max').listen().onChange(v => { if (Tm.particleCfg) Tm.particleCfg.respawnY[1] = v; });

const fallFolder = mkPair(particleFolder, 'Fall Speed');
fallFolder.add(particleParams, 'fallSpeedMin').name('min').listen().onChange(v => { if (Tm.particleCfg) Tm.particleCfg.fallSpeed[0] = v; });
fallFolder.add(particleParams, 'fallSpeedMax').name('max').listen().onChange(v => { if (Tm.particleCfg) Tm.particleCfg.fallSpeed[1] = v; });

const fwdFolder = mkPair(particleFolder, 'Forward Speed');
fwdFolder.add(particleParams, 'forwardSpeedMin').name('min').listen().onChange(v => { if (Tm.particleCfg) Tm.particleCfg.forwardSpeed[0] = v; });
fwdFolder.add(particleParams, 'forwardSpeedMax').name('max').listen().onChange(v => { if (Tm.particleCfg) Tm.particleCfg.forwardSpeed[1] = v; });

const rotFolder = mkPair(particleFolder, 'Rot Speed');
rotFolder.add(particleParams, 'rotSpeedMin').name('min').listen().onChange(v => { if (Tm.particleCfg) Tm.particleCfg.rotationSpeed[0] = v; });
rotFolder.add(particleParams, 'rotSpeedMax').name('max').listen().onChange(v => { if (Tm.particleCfg) Tm.particleCfg.rotationSpeed[1] = v; });

particleFolder.add(particleParams, 'reinit').name('\u21ba Reinit');

// 외부 변경 → GUI 동기화
function syncDebugGui() {
  rotProxy.x = _camera.rotation.x * radToDeg;
  rotProxy.y = _camera.rotation.y * radToDeg;
  rotProxy.z = _camera.rotation.z * radToDeg;
  fogParams.near = threeScene.fog.near;
  fogParams.far = threeScene.fog.far;
  fogParams.color = '#' + threeScene.fog.color.getHexString();
  if (Tm.particleCfg) {
    const cfg = Tm.particleCfg;
    particleParams.count          = cfg.count;
    particleParams.size           = cfg.size;
    particleParams.swayAmp        = cfg.swayAmp;
    particleParams.spawnXMin      = cfg.spawnX[0];
    particleParams.spawnXMax      = cfg.spawnX[1];
    particleParams.spawnYMin      = cfg.spawnY[0];
    particleParams.spawnYMax      = cfg.spawnY[1];
    particleParams.spawnZMin      = cfg.spawnZ[0];
    particleParams.spawnZMax      = cfg.spawnZ[1];
    particleParams.fallSpeedMin   = cfg.fallSpeed[0];
    particleParams.fallSpeedMax   = cfg.fallSpeed[1];
    particleParams.forwardSpeedMin= cfg.forwardSpeed[0];
    particleParams.forwardSpeedMax= cfg.forwardSpeed[1];
    particleParams.rotSpeedMin    = cfg.rotationSpeed[0];
    particleParams.rotSpeedMax    = cfg.rotationSpeed[1];
    particleParams.recycleY       = cfg.recycleY;
    particleParams.recycleZ       = cfg.recycleZ;
    particleParams.respawnYMin    = cfg.respawnY[0];
    particleParams.respawnYMax    = cfg.respawnY[1];
  }
}

gui.domElement.style.position = 'absolute';
gui.domElement.style.top = '0';
gui.domElement.style.right = '0';
gui.domElement.style.zIndex = '100';
window.debugGui = gui;

(async () => {
  //  PIXI init
  window.app = new PIXI.WebGLRenderer();
  await window.app.init({
    width: W,
    height: H,
    hello: true,
    backgroundAlpha: 0,
    resolution: 1,
  });
  document.body.appendChild(window.app.canvas);
  window.app.stage = new Container()

  // Three.js → PixiJS 렌더러 통합 (오프스크린 Three.js 캔버스를 배경 스프라이트로 사용)
  threeBgTex = PIXI.Texture.from(threeRenderer.domElement);
  threeBgSprite = new PIXI.Sprite(threeBgTex);
  threeBgSprite.width = GW;
  threeBgSprite.height = GH;
  app.stage.addChild(threeBgSprite);
  window.threeBgSprite = threeBgSprite;

  // 폰트 로딩
  await document.fonts.load('24px Cafe24Ohsquare');
  await document.fonts.load('24px AnonymousPro');
  await document.fonts.load('24px KaiseiHarunoUmi');
  await document.fonts.ready;

  // 텍스쳐 로딩
  await Img.loadTextures()
  await Tm.loadTextures()

  // 오디오 로딩
  await Am._ensureCtxResumed();
  await Am.loadAudios(BGM, SFX);


  // async 로딩
  await Data.earlyinit()
  init()
  resizeCanvas()
  requestAnimationFrame(loop);
})();

let threeBgTex = null;
let threeBgSprite = null;
if(gameData.showThreeEdit) {debugGui.show()} else {debugGui.hide()}

let lastFrameTime = 0
const frameInterval = 1000 / 60;
let startTime = null;


const meter = new FPSMeter({
  position: 'absolute',
  top: '10px',
  left: '10px',
  heat: true,
  theme: 'dark', // light/dark/transparent/colorful
  graph: 1,
});

function loop(ts) {
  if (!startTime) startTime = ts;
  let delta = ts - lastFrameTime
  startTime = ts
  if (delta >= frameInterval) {
    lastFrameTime = ts - (delta % frameInterval)
    if (Input.isDown(KeyBind.SKIP)) {
      for (let i = 0; i < 5; i++) {
        update()
      }
    } else {
      update()
    }
    syncDebugGui()
    if(!gameData.no3dupdate) {
      threeRenderer.render(threeScene, _camera);
      threeBgTex.source.update();
    }
    app.render(app.stage)
    Input.endFrame()
    meter.tick()
  }
  requestAnimationFrame(loop);
}

function init(){
  Data.init()
  Opt.init()
  Scene.init()
  Tm.init()
}

function update() {
  Input.update()
  Scene.update()
  Scene.lateUpdate()
  Tm.update()
}
function resize() {
}

// ============ DEBUG HELPERS ============
window.debugBitmap = function(index = 0) {
  const block = gm.ui.enemyBlocks[index];
  if (!block) {
    console.error(`[debugBitmap] Block not found at index ${index}`);
    return;
  }
  
  const bitmap = block.sprite.itemUI;
  console.group(`🔍 Bitmap Debug [Block ${index}]`);
  console.log('Bitmap Object:', bitmap);
  console.log('Canvas:', {
    width: bitmap.canvas?.width,
    height: bitmap.canvas?.height,
    inDOM: !!bitmap.canvas?.parentElement,
    created: !!bitmap.canvas
  });
  console.log('Texture:', {
    exists: !!bitmap.texture,
    valid: bitmap.texture?.valid,
    uid: bitmap.texture?.uid,
    baseTextureValid: !!bitmap.texture?.baseTexture?.valid,
    baseTextureLive: !bitmap.texture?.baseTexture?.destroyed
  });
  console.log('Context:', {
    exists: !!bitmap.context,
    imageData: bitmap.context?.getImageData?.(0, 0, 1, 1)?.data
  });
  console.groupEnd();
  
  // 테스트 드로우
  console.log('🎨 Testing drawRect...');
  bitmap.drawRect(10, 5, 8, 8, 'rgb(255,100,100)');
  console.log('✓ drawRect completed. Check screen for red square.');
};

window.testBitmapDraw = function(index = 0, x = 0, y = 0, w = 8, h = 8, color = 'rgb(0,255,0)') {
  const block = gm.ui.enemyBlocks[index];
  if (!block?.sprite?.itemUI) {
    console.error(`[testBitmapDraw] Invalid block or bitmap at index ${index}`);
    return false;
  }
  
  const bitmap = block.sprite.itemUI;
  console.log(`📍 Drawing at (${x},${y}) size ${w}x${h} color ${color}`);
  bitmap.drawRect(x, y, w, h, color);
  console.log('✓ Test draw completed');
  return true;
};