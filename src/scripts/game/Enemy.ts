import {Entity} from "@/scripts/game/Entity";
import {Vec2} from "@/scripts/engine/Vec2";
import {Bullet, PlayerBullet} from "@/scripts/game/Bullet";
import {Scene, SSCD} from "@/scripts/engine/Scene";
import {Timer} from "@/scripts/engine/Timer";
import {Color} from "@/scripts/engine/Color";

export class Enemy extends Entity {
    private _maxLife = 100;
    width = 60;
    height = 60;
    private life = 100;
    hitTimer: Timer = new Timer(0.1, false);

    normalColor: Color = new Color('#9f4747');
    hitColor: Color = new Color('#1f5b8d');

    showBar = false;

    constructor(pos: Vec2) {
        super(pos);
        // this.life = this.maxLife;
        this.collision = new SSCD.Rectangle(new SSCD.Vector(pos.x - this.width / 2, pos.y - this.height / 2), new SSCD.Vector(this.width, this.height));
    }

    set pos(value: Vec2) {
        this._pos = value;
        for (const emitter of this.emitters) {
            emitter.pos = this._pos;
        }
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

    setScene(scene: Scene) {
        super.setScene(scene);
        this.collision.set_collision_tags('enemy');
    }

    fixedUpdate(time: number) {
        super.fixedUpdate(time);
        this.hitTimer.update(time);
        if (this.scene) {
            const collisionObj = this.scene.collisionWorld.pick_object(this.collision, 'player_bullet');
            if (collisionObj != null) {
                const bullet: PlayerBullet = collisionObj.entity;
                // // eslint-disable-next-line no-debugger
                // debugger;
                this.hit(bullet.damage);
                bullet.destroy();
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx);
        // this.collision.render(ctx, new SSCD.Vector(0, 0));
        ctx.beginPath();
        // ctx.ellipse(this.pos.x, this.pos.y, this.radius, this.radius, 0, 0, 2 * Math.PI);
        // ctx.fillRect(this.pos.x, this.pos.y, this.radius, this.radius);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#fab2b2";

        // const grd = ctx.createRadialGradient(this.pos.x, this.pos.y, 0, this.pos.x, this.pos.y, this.radius);
        // grd.addColorStop(0, "white");
        // grd.addColorStop(1, "#e5e5d1");
        ctx.fillStyle = this.normalColor.mix(this.hitColor, this.hitTimer.progress * 0.8 + 0.2).toString();
        ctx.fillRect(this.pos.x - this.width / 2, this.pos.y - this.height / 2, this.width, this.height);
        ctx.strokeRect(this.pos.x - this.width / 2, this.pos.y - this.height / 2, this.width, this.height);

        ctx.fillStyle = new Color('#d93f3f').mix(this.hitColor, this.hitTimer.progress * 0.5 + 0.5).toString();
        ctx.strokeStyle = "#d93f3f";
        ctx.lineWidth = 2;
        if (this.showBar) {
            ctx.fillRect(83, 43, 554 * this.life / this.maxLife, 14);
            ctx.strokeRect(80, 40, 560, 20);
            // ctx.strokeRect(680, 40, 20, 200);
            // const healthRate = this.life / this.maxLife;
            // ctx.fillRect(683, 43 + 194 * (1 - healthRate), 14, 194 * healthRate);
        }
        // ctx.stroke();
        // ctx.fill();
    }

    hit(damage: number) {
        this.life -= damage;
        this.hitTimer.reset();
        if (this.life <= 0) {
            this.destroy();
        }
    }
}
