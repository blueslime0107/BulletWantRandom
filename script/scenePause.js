class ScenePause extends SceneObject {
    constructor() {
        super()
        this.exitHide = true
        this.currentInputGroup = null
    }

    init() {
        this.root = new Container()
        this.addChild(this.root)

        this.bg = Img.sprite('rect', [SW, SH], 'rgba(0, 0, 0, 0.6)', {
            anchor: 0.5,
            position: { x: SW * 0.5, y: SH * 0.5 }
        })
        this.root.addChild(this.bg)

        this.pauseTitle = new Text({
            text: Data.text('pause_title', 'PAUSED'),
            style: Data.styles.pauseTitle,
            anchor: 0.5,
            position: { x: SW * 0.5, y: SH * 0.25 }
        })
        this.root.addChild(this.pauseTitle)

        this.menuContainer = new Container({ position: { x: SW * 0.5, y: SH * 0.5 } })
        this.root.addChild(this.menuContainer)

        this.optionContainer = new Container({ position: { x: SW * 0.5, y: SH * 0.5 } })
        this.root.addChild(this.optionContainer)

        this.buildMenu()
        this.buildOptionMenu()
    }

    buildMenu() {
        this.menuGroup = new InputUIGroup({ curIndex: 0, skipNotAvailableUI: true })

        const entries = [
            {
                key: 'pause_resume',
                onPress: () => this.resume()
            },
            {
                key: 'pause_restart',
                onPress: () => Scene.enter(Scene.sceneList.MainGame, gm.session)
            },
            {
                key: 'pause_option',
                onPress: () => this.openOption()
            },
            {
                key: 'pause_back_title',
                onPress: () => {
                    Scene.enter(Scene.sceneList.Title)
                    Scene.sceneList.MainGame.visible = false
                }
            }
        ]

        entries.forEach((entry, i) => {
            const ui = new Button({
                langKey: entry.key,
                style: Data.styles.pauseMenu,
                onHighlight: function(isActive) {
                    this.scale.set(isActive ? 1.08 : 1)
                    this.tint = isActive ? 0xfff26b : 0xffffff
                },
                onPress: () => entry.onPress(),
                onToggle: function(toggle){
                    this.alpha = toggle ? 1 : 0.5
                }
            })

            ui.y = i * 58
            this.menuContainer.addChild(ui)
            this.addUpdate(ui)

            this.menuGroup.addItem(ui, {
                UP: () => this.menuGroup.nextIndex(-1),
                DOWN: () => this.menuGroup.nextIndex(1),
                OK: () => entry.onPress(),
                CANCEL: () => this.resume(),
            })
        })
    }

    buildOptionMenu() {
        const makeOptionText = (key, valueGetter) => {
            const btn = new Button({
                langKey: key,
                style: Data.styles.optionItem,
                onHighlight: function(isActive) {
                    this.scale.set(isActive ? 1.08 : 1)
                    this.tint = isActive ? 0xfff26b : 0xffffff
                },
            })
            btn.setFormat((text) => `${text} : ${valueGetter()}`)
            return btn
        }

        const bgmText = makeOptionText('option_bgm', () => Opt.option.bgmVolume)
        const sfxText = makeOptionText('option_sfx', () => Opt.option.sfxVolume)
        const langText = makeOptionText('option_language', () => {
            const langObj = Data.languages[Opt.option.language - 1]
            return langObj?.langName || `#${Opt.option.language}`
        })
        const fullText = makeOptionText('option_fullscreen', () => Opt.option.fullscreen ? 'ON' : 'OFF')
        const backText = new Button({
            langKey: 'menu_back',
            style: Data.styles.optionBack,
            onHighlight: function(isActive) {
                this.scale.set(isActive ? 1.08 : 1)
                this.tint = isActive ? 0xfff26b : 0xffffff
            },
        })

        const options = [
            {
                ui: bgmText,
                left: () => this.adjustVolume('bgmVolume', -5),
                right: () => this.adjustVolume('bgmVolume', 5)
            },
            {
                ui: sfxText,
                left: () => this.adjustVolume('sfxVolume', -5),
                right: () => this.adjustVolume('sfxVolume', 5)
            },
            {
                ui: langText,
                left: () => Opt.cycleLanguage(-1),
                right: () => Opt.cycleLanguage(1)
            },
            {
                ui: fullText,
                left: () => Opt.toggleFullscreen(),
                right: () => Opt.toggleFullscreen()
            },
            {
                ui: backText,
                left: () => this.closeOption(),
                right: () => this.closeOption(),
                ok: () => this.closeOption()
            }
        ]

        options.forEach((item, i) => {
            item.ui.y = i * 54
            item.ui.onPress = () => {
                this.optionGroup.curIndex = i;
                (item.ok || item.right)()
            }
            item.ui.alpha = 0
            item.ui.toggleValiable(false)
            this.optionContainer.addChild(item.ui)
            this.addUpdate(item.ui)
        })

        this.optionGroup = new InputUIGroup({ curIndex: 0, skipNotAvailableUI: true })
        const navOptUp = () => this.optionGroup.nextIndex(-1)
        const navOptDown = () => this.optionGroup.nextIndex(1)
        options.forEach((item) => {
            this.optionGroup.addItem(item.ui, {
                UP: navOptUp,
                DOWN: navOptDown,
                LEFT: () => { item.left?.(); item.ui.refreshText() },
                RIGHT: () => { item.right?.(); item.ui.refreshText() },
                OK: () => { (item.ok || item.right)?.(); item.ui.refreshText() },
                CANCEL: () => this.closeOption(),
            })
        })
    }

    adjustVolume(key, delta) {
        const next = Math.max(0, Math.min(100, Opt.option[key] + delta))
        Opt.setOption({ [key]: next })
    }

    openOption() {
        this.endRoutine("optionAnim")
        this.startRoutine("optionAnim", /** @param {ScenePause} self */ function(self) {
            if (this.whenTime(0)) {
                self.setInputGroup(null)
                for (let obj of self.menuGroup.items) {
                    obj.MoveTime(pos(obj.x - 300, obj.y), 30, Easing.easeOutCubic).SetValue('alpha', 0, 30, Easing.easeOutCubic)
                }
                for (let obj of self.optionGroup.items) {
                    obj.x = 300
                    obj.MoveTime(pos(obj.x - 300, obj.y), 30, Easing.easeOutCubic).SetValue('alpha', 1, 30, Easing.easeOutCubic)
                }
            }
            if (this.whenTime(30)) {
                self.setInputGroup(self.optionGroup)
            }
        })
    }

    closeOption() {
        this.endRoutine("optionAnim")
        this.startRoutine("optionAnim", /** @param {ScenePause} self */ function(self) {
            if (this.whenTime(0)) {
                self.setInputGroup(null)
                for (let obj of self.menuGroup.items) {
                    obj.MoveTime(pos(obj.x + 300, obj.y), 30, Easing.easeOutCubic).SetValue('alpha', 1, 30, Easing.easeOutCubic)
                }
                for (let obj of self.optionGroup.items) {
                    obj.MoveTime(pos(obj.x + 300, obj.y), 30, Easing.easeOutCubic).SetValue('alpha', 0, 30, Easing.easeOutCubic)
                }
            }
            if (this.whenTime(30)) {
                self.setInputGroup(self.menuGroup)
            }
        })
    }

    resume() {
        Am.resumeBGM()
        Scene.enter(Scene.sceneList.MainGame)
    }

    enter(option) {
        Am.pauseBGM()
        this.pauseTitle.text = Data.text('pause_title')
        for (let obj of this.menuGroup.items) {
            obj.alpha = 1
            obj.x = 0
        }
        for (let obj of this.optionGroup.items) {
            obj.alpha = 0
            obj.toggleValiable(false)
        }
        this.setInputGroup(this.menuGroup)
        if(sys.gameover) {
            this.pauseTitle.text = Data.text('gameover')
            this.menuGroup.items[0].toggleValiable(false) // Disable Resume button
            this.menuGroup.setItem(1)
        }
    }

    setInputGroup(group) {
        this.currentInputGroup?.exit()
        this.currentInputGroup = group
        if (this.currentInputGroup == null) return
        for (let obj of this.currentInputGroup.items) {
            obj.toggleValiable(true)
        }
        this.currentInputGroup?.enter()
    }

    update() {
        super.update()
        this.currentInputGroup?.update()
    }
}

window.scenePause = new ScenePause()
