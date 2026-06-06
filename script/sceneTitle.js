class SceneTitle extends SceneObject {
  constructor() {
    super();
    this.currentInputGroup = null;
  }

  init() {

    this.background = new Sprite(Img.assets.titleBG);
    this.addChild(this.background);

    this.titleText = new TextObject({
      text: '몽상탄형수',
      style: Data.styles.titleHeader,
      anchor: 0.5,
      position: { x: SW * 0.5-400, y: -48} // SH * 0.16 
    });
    this.addChildUpdate(this.titleText)

    this.buildMenu();
    this.buildOptionMenu();
    this.buildDifficultyMenu();
  }

  buildMenu() {
    this.menuContainer = new Container({ position: { x: SW * 0.5, y: SH * 0.45 } }); this.addChild(this.menuContainer);
    this.menuGroup = new InputUIGroup({ curIndex: 0, skipNotAvailableUI: true });

    const entries = [
      { key: 'menu_tutorial',
        onPress: () => {
          Scene.enter(Scene.sceneList.MainGame, { mode: 'tutorial', stageId: 1 })
          this.visible = false
        }
      },
      {
        key: 'menu_start',
        onPress: () => this.openDifficulty('new-game')
      },
      {
        key: 'menu_extra',
        onPress: () => this.openDifficulty('extra')
      },
      {
        key: 'menu_practice',
        onPress: () => this.openDifficulty('practice')
      },
      {
        key: 'menu_replay',
        onPress: () => Scene.enter(Scene.sceneList.MainGame, { mode: 'replay', stageId: 1 })
      },
      {
        key: 'menu_playerData',
        onPress: () => Scene.enter(Scene.sceneList.MainGame, { mode: 'player-data', stageId: 1 })
      },
      {
        key: 'menu_option',
        onPress: () => this.openOption()
      },
      {
        key: 'menu_exit',
        onPress: () => {
          if (typeof nw !== 'undefined') {
            nw.Window.get().close();
          } else {
            window.close();
          }
        }
      }
    ];
    entries.forEach((entry, i) => {
      const ui = new Button({
        id: i,
        langKey: entry.key,
        style: Data.styles.menuItem,
        onHighlight: function(isActive){
          this.scale.set(isActive ? 1.08 : 1);
          this.tint = isActive ? 0xfff26b : 0xffffff;
        },
        onPress: () => {
          entry.onPress();
        }
      });

      this.menuContainer.addChild(ui);
      this.addUpdate(ui);

      this.menuGroup.addItem(ui, {
        UP: () => { this.menuGroup.nextIndex(-1); },
        DOWN: () => { this.menuGroup.nextIndex(1);},
        OK: () => entry.onPress(),
      });
    });
    this.replcaeMenuItems()
  }

  replcaeMenuItems(){
      this.menuGroup.items.forEach((obj,i) => {
        obj.x = 200
        obj.y = i *70-200
      })
  }

  buildOptionMenu() {
    this.optionContainer = new Container({
      position: { x: SW * 0.5, y: SH * 0.45 }
    });
    this.addChild(this.optionContainer);

    const makeOptionText = (key, valueGetter) => {
      const btn = new Button({
        langKey: key,
        style: Data.styles.optionItem,
        onHighlight: function(isActive){
          this.scale.set(isActive ? 1.08 : 1);
          this.tint = isActive ? 0xfff26b : 0xffffff;
        },
      });
      btn.setFormat((text) => `${text} : ${valueGetter()}`);
      return btn;
    };

    const bgmText = makeOptionText('option_bgm', () => Math.round(Opt.option.bgmVolume * 500));
    const sfxText = makeOptionText('option_sfx', () => Math.round(Opt.option.sfxVolume * 500));
    const langText = makeOptionText('option_language', () => {
      const langObj = Data.languages[Opt.option.language - 1];
      return langObj?.langName || `#${Opt.option.language}`;
    });
    const fullText = makeOptionText('option_fullscreen', () => Opt.option.fullscreen ? 'ON' : 'OFF');
    const backText = new Button({
      langKey: 'menu_back',
      style: Data.styles.optionBack,
      onHighlight: function(isActive){
        this.scale.set(isActive ? 1.08 : 1);
        this.tint = isActive ? 0xfff26b : 0xffffff;
      },
    });

    const options = [
      {
        ui: bgmText,
        left: () => this.adjustVolume('bgmVolume', -0.01),
        right: () => this.adjustVolume('bgmVolume', 0.01)
      },
      {
        ui: sfxText,
        left: () => this.adjustVolume('sfxVolume', -0.01),
        right: () => this.adjustVolume('sfxVolume', 0.01)
      },
      {
        ui: langText,
        left: () => {
          Opt.cycleLanguage(-1);
        },
        right: () => {
          Opt.cycleLanguage(1);
        }
      },
      {
        ui: fullText,
        left: () => {
          Opt.toggleFullscreen();
        },
        right: () => {
          Opt.toggleFullscreen();
        }
      },
      {
        ui: backText,
        left: () => this.closeOption(),
        right: () => this.closeOption(),
        ok: () => this.closeOption()
      }
    ];

    options.forEach((item, i) => {
      item.ui.y = i * 54;
      item.ui.onPress = () => {
        this.optionGroup.curIndex = i;
        (item.ok || item.right)();
      };
      item.ui.alpha = 0
      item.ui.toggleValiable(false)
      this.optionContainer.addChild(item.ui);
      this.addUpdate(item.ui);
    });

    this.optionGroup = new InputUIGroup({ curIndex: 0, skipNotAvailableUI: true });
    const navOptUp = () => { this.optionGroup.nextIndex(-1);};
    const navOptDown = () => { this.optionGroup.nextIndex(1); };
    options.forEach((item) => {
      this.optionGroup.addItem(item.ui, {
        UP: navOptUp,
        DOWN: navOptDown,
        LEFT: () => { item.left?.(); item.ui.refreshText();},
        RIGHT: () => { item.right?.(); item.ui.refreshText();},
        OK: () => { (item.ok || item.right)?.(); item.ui.refreshText();},
        CANCEL: () => this.closeOption(),
      });
    });
  }

  adjustVolume(key, delta) {
    const next = Math.max(0, Math.min(0.2, Opt.option[key] + delta));
    Opt.setOption({ [key]: next });
  }

  buildDifficultyMenu() {
    
    this.diffContainer = new Container({
      position: { x: SW * 0.5, y: SH * 0.45 }
    });
    this.addChild(this.diffContainer);

    const difficulties = [
      { key: 'easy', color: 0x44cc44 },
      { key: 'normal', color: 0x44bbee },
      { key: 'hard', color: 0x2244aa },
      { key: 'lunatic', color: 0x9933cc },
    ];

    this.diffGroup = new InputUIGroup({ curIndex: 0, skipNotAvailableUI: true });
    const navUp = () => this.diffGroup.nextIndex((this.diffGroup.curIndex == 0) ? -2 : -1);
    const navDown = () => this.diffGroup.nextIndex((this.diffGroup.curIndex == 3) ? 2 :1);
    const spacing = 54;

    difficulties.forEach((diff, i) => {
      const ui = new Button({
        langKey: `diff_${diff.key}`,
        style: Data.styles.menuItem,
        onHighlight: function(isActive) {
          this.scale.set(isActive ? 1.08 : 1);
          this.tint = isActive ? 0xffffff : diff.color;
        },
        onPress: () => {
          this.diffGroup.curIndex = i;
          this.selectDifficulty(diff.key);
        }
      });
      ui.tint = diff.color;
      ui.y = i * spacing;
      ui.alpha = 0;

      this.diffContainer.addChild(ui);
      this.addUpdate(ui);

      this.diffGroup.addItem(ui, {
        UP: navUp,
        DOWN: navDown,
        OK: () => this.selectDifficulty(diff.key),
        CANCEL: () => this.closeDifficulty(),
      });
    });

    const backUi = new Button({
      langKey: 'menu_back',
      style: Data.styles.menuItem,
      onHighlight: function(isActive) {
        this.scale.set(isActive ? 1.08 : 1);
        this.tint = isActive ? 0xfff26b : 0xffffff;
      },
      onPress: () => this.closeDifficulty()
    });
    backUi.y = difficulties.length * spacing;
    backUi.alpha = 0;

    this.diffContainer.addChild(backUi);
    this.addUpdate(backUi);

    this.diffGroup.addItem(backUi, {
      UP: navUp,
      DOWN: navDown,
      OK: () => this.closeDifficulty(),
      CANCEL: () => this.closeDifficulty(),
    });
  }

  selectDifficulty(diffKey) {
    for(let obj of this.diffGroup.items){
      obj.alpha = 0
    }
    Scene.enter(Scene.sceneList.MainGame, {
      mode: this.diffMode,
      stageId: 1,
      difficulty: diffKey
    });
    this.visible = false
  }

  openDifficulty(mode) {
    this.diffMode = mode;
    this.endRoutine("diffAnim");
    this.startRoutine("diffAnim", /** @param {SceneTitle} self */ function (self) {
      if(this.whenTime(0)){
        self.setInputGroup(null);
        self.titleText.MoveTime(pos(self.titleText.x, self.titleText.y-100), 30, Easing.easeOutCubic).SetValue('alpha', 0, 30, Easing.easeOutCubic);
        for(let obj of self.menuGroup.items){
          obj.MoveTime(pos(obj.x-300, obj.y), 30, Easing.easeOutCubic).SetValue('alpha', 0, 30, Easing.easeOutCubic);
        }
        for(let obj of self.diffGroup.items){
          obj.x = 300;
          obj.MoveTime(pos(obj.x-300, obj.y), 30, Easing.easeOutCubic).SetValue('alpha', 1, 30, Easing.easeOutCubic);
        }
      }
      if(this.whenTime(30)){
        self.setInputGroup(self.diffGroup);
      }
    });
  }

  closeDifficulty() {
    this.endRoutine("diffAnim");
    this.startRoutine("diffAnim", /** @param {SceneTitle} self */ function (self) {
      if(this.whenTime(0)){
        self.setInputGroup(null);
        self.titleText.MoveTime(pos(self.titleText.x, self.titleText.y+100), 30, Easing.easeOutCubic).SetValue('alpha', 0, 30, Easing.easeOutCubic);
        for(let obj of self.menuGroup.items){
          obj.MoveTime(pos(obj.x+300, obj.y), 30, Easing.easeOutCubic).SetValue('alpha', 1, 30, Easing.easeOutCubic);
        }
        for(let obj of self.diffGroup.items){
          obj.MoveTime(pos(obj.x+300, obj.y), 30, Easing.easeOutCubic).SetValue('alpha', 0, 30, Easing.easeOutCubic);
        }
      }
      if(this.whenTime(30)){
        self.setInputGroup(self.menuGroup);
      }
    });
  }

  openOption() {
    this.endRoutine("optionAnim");
    this.startRoutine("optionAnim", /** @param {SceneTitle} self */ function (self) {
      if(this.whenTime(0)){
        self.setInputGroup(null);
        self.titleText.MoveTime(pos(self.titleText.x, self.titleText.y-100), 30, Easing.easeOutCubic).SetValue('alpha', 0, 30, Easing.easeOutCubic);
        for(let obj of self.menuGroup.items){
          obj.MoveTime(pos(obj.x-300, obj.y), 30, Easing.easeOutCubic).SetValue('alpha', 0, 30, Easing.easeOutCubic);
        }
        for(let obj of self.optionGroup.items){
          obj.x = 300
          obj.MoveTime(pos(obj.x-300, obj.y), 30, Easing.easeOutCubic).SetValue('alpha', 1, 30, Easing.easeOutCubic);
        }
      }
      if(this.whenTime(30)){
        self.setInputGroup(self.optionGroup);
      }
    })
  }

  closeOption() {
    this.endRoutine("optionAnim");
    this.startRoutine("optionAnim", /** @param {SceneTitle} self */ function (self) {
      if(this.whenTime(0)){
        self.setInputGroup(null);
        self.titleText.MoveTime(pos(self.titleText.x, self.titleText.y+100), 30, Easing.easeOutCubic).SetValue('alpha', 0, 30, Easing.easeOutCubic);
        for(let obj of self.menuGroup.items){
          obj.MoveTime(pos(obj.x+300, obj.y), 30, Easing.easeOutCubic).SetValue('alpha', 1, 30, Easing.easeOutCubic);
        }
        for(let obj of self.optionGroup.items){
          obj.MoveTime(pos(obj.x+300, obj.y), 30, Easing.easeOutCubic).SetValue('alpha', 0, 30, Easing.easeOutCubic);
        }
      }
      if(this.whenTime(30)){
        self.setInputGroup(self.menuGroup);
      }
    })
  }

  enter() {
    this.startRoutine("titleAnim", /** @param {SceneTitle} self */ function (self) {
      if(this.whenTime(0)){
        self.titleText.MoveTime(pos(SW * 0.5, SH * 0.16), 30, Easing.easeOutCubic);
        for(let obj of self.menuGroup.items){
          obj.alpha = 0;
          obj.x = -300
        }
      }
      if(this.whileTime(4,this.repeat<self.menuGroup.items.length)){
        const obj = self.menuGroup.items[this.repeat-1]
        obj.MoveTime(pos(obj.x+300, obj.y), 30, Easing.easeOutCubic).SetValue('alpha', 1, 30, Easing.easeOutCubic);
      }
      if(this.whenTime(30)){
        self.setInputGroup(self.menuGroup);
      }
    });
  }

  setInputGroup(group) {
    this.currentInputGroup?.exit();
    this.currentInputGroup = group;
    if(this.currentInputGroup == null) return
    for(let obj of this.currentInputGroup.items){
      obj.toggleValiable(true)
    }
    this.currentInputGroup?.enter();
  }

  update() {
    super.update()
    this.currentInputGroup?.update();
  }
}

window.sceneTitle = new SceneTitle();
