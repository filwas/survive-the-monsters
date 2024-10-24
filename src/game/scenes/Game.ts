import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    platforms!: Phaser.Physics.Arcade.StaticGroup;
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    character: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super("Game");
    }
    
    preload() {
        this.load.image("sky", "assets/sky.png");
        this.load.image("ground", "assets/platform.png");
        this.load.image("star", "assets/star.png");
        this.load.image("bomb", "assets/bomb.png");
    }

    create() {
        this.camera = this.cameras.main;
        this.cursors = this.input.keyboard.createCursorKeys();

        this.add.image(400, 300, "sky");
        this.platforms =  this.physics.add.staticGroup();

        this.platforms.create(400, 568, "ground").setScale(2).refreshBody();

        this.platforms.create(600, 400, "ground");
        this.platforms.create(50, 250, "ground");
        this.platforms.create(750, 220, "ground");

        this.player = this.physics.add.sprite(100, 450, "dude");
        this.character = this.physics.add.sprite(100, 450, "characters", "elisa-spritesheet1-0.png");
        this.player.setInteractive();

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);


        this.physics.add.collider(this.player, this.platforms);

        if (this.anims.exists('turn')) {
            this.player.anims.play('turn');
        } else {
            console.error("Animation 'turn' not found!");
        }

        EventBus.emit("current-scene-ready", this);
    }

    update() {

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);

            this.player.anims.play("left", true);

        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);

            this.player.anims.play("right", true);
        } else {
            this.player.setVelocityX(0);

            this.player.anims.play("turn");
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}

