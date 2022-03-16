import {Entity} from "@/scripts/game/Entity";
import {Vec2} from "@/scripts/engine/Vec2";
import {Bullet, PlayerBullet} from "@/scripts/game/Bullet";
import {Scene, SSCD} from "@/scripts/engine/Scene";

export class Enemy extends Entity {
    private _maxLife = 100;
    width = 60;
    height = 60;
    private life = 100;

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

    setScene(scene: Scene) {
        super.setScene(scene);
        this.collision.set_collision_tags('enemy');
    }

    fixedUpdate(time: number) {
        super.fixedUpdate(time);
        if (this.scene) {
            const collisionObj = this.scene.collisionWorld.pick_object(this.collision, 'player_bullet');
            if (collisionObj != null) {
                const bullet: PlayerBullet = collisionObj.entity;
                // eslint-disable-next-line no-debugger
                debugger;
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
        ctx.fillStyle = "#9f4747";
        ctx.fillRect(this.pos.x - this.width / 2, this.pos.y - this.height / 2, this.width, this.height);
        ctx.strokeRect(this.pos.x - this.width / 2, this.pos.y - this.height / 2, this.width, this.height);

        // ctx.stroke();
        // ctx.fill();
    }

    hit(damage: number) {
        this.life -= damage;
        if (this.life <= 0) {
            this.destroy();
        }
    }
}
