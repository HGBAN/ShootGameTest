import {Entity} from "@/scripts/game/Entity";
import {Vec2} from "@/scripts/engine/Vec2";
import {Bullet, PlayerBullet} from "@/scripts/game/Bullet";
import {Scene, SSCD} from "@/scripts/engine/Scene";
import {Timer} from "@/scripts/engine/Timer";
import {Color} from "@/scripts/engine/Color";
import {Player} from "@/scripts/game/Player";
import {Graphics} from "pixi.js";
import {GameScene} from "@/scripts/game/GameScene";
import {Random} from "@/scripts/engine/Random";
import {Coin} from "@/scripts/game/Coin";
import {PropTween} from "@/scripts/engine/PropTransformer";
import {liner, quadratic, sin1, Unary} from "@/scripts/data/Functions";

export class Enemy extends Entity {
    private _maxLife = 100;
    width = 60;
    height = 60;
    life = 100;
    hitTimer: Timer = new Timer(0.1, false);
    score = 500;

    normalColor: Color = new Color('#9f4747');
    hitColor: Color = new Color('#1f5b8d');

    scene: GameScene | null = null;
    // showBar = false;
    display = new Graphics();

    tag = 'enemy';

    moveTransformer: PropTween[] = [];
    movingPos = Vec2.zero;

    //金币掉落概率
    coinDropRate = 0.5;

    constructor(pos: Vec2) {
        super(pos);
        // this.life = this.maxLife;
        this.collision = new SSCD.Rectangle(new SSCD.Vector(pos.x - this.width / 2, pos.y - this.height / 2), new SSCD.Vector(this.width, this.height));
        this.collision.entity = this;

        this.hitTimer.timeOverCallback = () => {
            this.initGraphics();
        }
    }

    set pos(value: Vec2) {
        super.pos = value;
        // this.display.position.set(this.pos.x - this.width / 2, this.pos.y - this.height / 2);
        // for (const emitter of this.emitters) {
        //     emitter.pos = this._pos;
        // }
        this.collision.set_position(new SSCD.Vector(this._pos.x - this.width / 2, this._pos.y - this.height / 2));
    }

    get pos() {
        return this._pos;
    }

    get maxLife() {
        return this._maxLife;
    }

    set maxLife(value) {
        this._maxLife = value;
        if (this.life > this._maxLife)
            this.life = this._maxLife;
    }

    setMaxLife(value: number, recover = true) {
        this._maxLife = value;
        if (recover)
            this.life = this._maxLife;
        else if (this.life > this._maxLife)
            this.life = this._maxLife;
    }

    setScene(scene: GameScene) {
        super.setScene(scene);
        this.collision.set_collision_tags('enemy');
    }

    update() {
        if (!this.hitTimer.isOver) {
            this.display.clear();
            this.display.lineStyle(4, 0xfab2b2, 1);
            this.display.beginFill(this.normalColor.mix(this.hitColor, this.hitTimer.progress * 0.5 + 0.5).valueOf());
            this.display.drawRect(-this.width / 2, -this.height / 2, this.width, this.height);
            this.display.endFill();
        }
    }

    fixedUpdate(time: number) {
        super.fixedUpdate(time);
        this.hitTimer.update(time);
        if (this.moveTransformer.length > 0) {
            for (const transformer of this.moveTransformer) {
                transformer.update(time);
                // console.log(transformer.obj==this.pos);
            }
            this.pos = this.movingPos;
            for (let i = 0; i < this.moveTransformer.length; i++) {
                if (this.moveTransformer[i].isOver)
                    this.moveTransformer.splice(i, 1);
            }
        }
        if (this.scene) {
            const collisionObjs: Array<any> = [];
            this.scene.collisionWorld.test_collision(this.collision, 'player_bullet', collisionObjs);
            for (const obj of collisionObjs) {
                const bullet: PlayerBullet = obj.entity;
                // // eslint-disable-next-line no-debugger
                // debugger;
                this.hit(bullet.damage);
                bullet.destroy();
                if (this.life == 0)
                    return;
            }

            // const collisionObj = this.scene.collisionWorld.pick_object(this.collision, 'player_bullet');
            // if (collisionObj != null) {
            //     const bullet: PlayerBullet = collisionObj.entity;
            //     // // eslint-disable-next-line no-debugger
            //     // debugger;
            //     this.hit(bullet.damage);
            //     bullet.destroy();
            // }
        }
    }

    moveTo(pos: Vec2, time: number, func = sin1) {
        this.moveTransformer = [];
        this.movingPos = this.pos;
        this.moveTransformer[0] = new PropTween(this.movingPos, 'x', time, func(this.movingPos.x, pos.x));
        this.moveTransformer[1] = new PropTween(this.movingPos, 'y', time, func(this.movingPos.y, pos.y));
    }

    initGraphics() {
        this.display.clear();
        this.display.lineStyle(4, 0xfab2b2, 1);
        this.display.beginFill(this.normalColor.valueOf());
        this.display.drawRect(-this.width / 2, -this.height / 2, this.width, this.height);
        this.display.endFill();
    }

    hit(damage: number) {
        this.life -= damage;
        Player.score += Math.floor(100 * (1 + Player.rubTimes / 100));
        this.hitTimer.reset();
        if (this.life <= 0) {
            this.life = 0;

            //掉落金币
            if (this.scene) {
                this.scene.createCoins(this.pos);
                // this.scene.player.urgentValue += 20;
                this.scene.player.addUrgentValue(20);
            }
            // if (Random.probability(this.coinDropRate)) {
            //     const coin: Coin = new Coin(this.pos.clone);
            //     this.scene?.addObject(coin);
            // }
            this.destroy();
        }
    }

    destroy() {
        if (this.dead)
            return;
        super.destroy();
        // // eslint-disable-next-line no-debugger
        // debugger;
        Player.score += Math.floor(this.score * (1 + Player.rubTimes / 100));
    }
}
