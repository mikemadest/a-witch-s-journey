import { Scene } from 'phaser'

class BaseScene extends Scene {
    constructor() {
        super({ key: "Boot", active: true });
    }

    init() {
        this.URL = this.sys.game.URL;
        this.CONFIG = this.sys.game.CONFIG;
        this.language = this.CONFIG.language;
    }

    preload() {
    }

    create() {
    }

    update() {
    }
}

export default BaseScene;