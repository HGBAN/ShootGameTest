//从敌人身上掉落的可拾取的金币
import {Entity} from "@/scripts/game/Entity";
import {Sprite} from "pixi.js";
import {Vec2} from "@/scripts/engine/Vec2";
import {Scene, SSCD} from "@/scripts/engine/Scene";
import {GameScene} from "@/scripts/game/GameScene";

export class Coin extends Entity {
    radius = 15;
    //金币价值
    value = 1;
    display = new Sprite();
    texture: string = 'crystal';
    scene: GameScene | null = null;
    //是否处于吸附状态
    adsorbent: boolean = false;

    constructor(pos: Vec2) {
        super(pos);
        this.speed = 300;
        this.dir = new Vec2(0, -1);

        this.collision = new SSCD.Circle(new SSCD.Vector(pos.x, pos.y), this.radius);
        this.collision.entity = this;
    }

    set dir(value: Vec2) {
        this._dir = value;
    }

    get dir() {
        return this._dir;
    }

    setScene(scene: Scene) {
        super.setScene(scene);
        this.display = new Sprite(this.scene?.gameMain.getTexture(this.texture));
        this.scene?.addChild(this.display);
        this.display.angle = this.angle;
        this.display.anchor.x = 0.5;
        this.display.anchor.y = 0.5;
        this.display.width = this.display.height = this.radius * 2;

        // console.log(this.display.texture);
        this.collision.set_collision_tags('coin');
    }

    fixedUpdate(time: number) {
        super.fixedUpdate(time);

        if (!this.scene)
            return;

        if (this.adsorbent) {
            this.dir = this.scene.player.pos.sub(this.pos).normalize;
            this.speed = 300;
            return;
        }
        if (this.dir.equals(new Vec2(0, 1)) && this.speed >= 200) {
            this.speed = 200;
        } else {
            let velocity = this.dir.mul(this.speed);
            velocity = velocity.add(new Vec2(0, 1).mul(500 * time));
            const dis = velocity.dis;
            this.dir = new Vec2(velocity.x / dis, velocity.y / dis);
            this.speed = dis;
        }
    }
}