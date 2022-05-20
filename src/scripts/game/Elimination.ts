import {Entity} from "@/scripts/game/Entity";
import {Timer} from "@/scripts/engine/Timer";
import {Scene, SSCD} from "@/scripts/engine/Scene";
import {Bullet} from "@/scripts/game/Bullet";
import {Vec2} from "@/scripts/engine/Vec2";
import {Graphics} from "pixi.js";

export class Elimination extends Entity {
    radius = 0;
    maxRadius = 1000;
    duration = -1;
    eliminationTimer: Timer = new Timer(1);
    display = new Graphics();

    constructor(pos: Vec2, scene: Scene) {
        super(pos);
        this.collision = new SSCD.Circle(new SSCD.Vector(pos.x, pos.y), this.radius);
        this.collision.entity = this;
        this.setScene(scene);
    }

    initGraphics() {
        this.display.lineStyle(2, 0x226DDD, 1);
        this.display.drawCircle(0, 0, this.radius);
    }

    update() {
        this.display.clear();
        this.display.lineStyle(2, 0x226DDD, 1 - this.eliminationTimer.progress);
        this.display.drawCircle(0, 0, this.radius);
    }

    draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx);
        ctx.beginPath();
        ctx.ellipse(this.pos.x, this.pos.y, this.radius, this.radius, 0, 0, 2 * Math.PI);

        ctx.strokeStyle = '#226ddd';
        ctx.globalAlpha = 1 - this.eliminationTimer.progress;
        ctx.stroke();

        ctx.globalAlpha = 1;
    }

    setScene(scene: Scene) {
        super.setScene(scene);
        this.collision.set_collision_tags('elimination');
    }

    fixedUpdate(time: number) {
        super.fixedUpdate(time);
        this.eliminationTimer.update(time);
        if (this.eliminationTimer.isOver) {
            this.destroy();
            return;
        }
        this.radius = this.maxRadius * this.eliminationTimer.progress;

        // this.collision.__radius = this.radius;
        // this.collision.__size = new SSCD.Vector(this.radius, this.radius).multiply_scalar_self(2);
        // this.collision.set_position(this._pos);
        if (this.scene) {
            this.scene.collisionWorld.remove(this.collision);
            this.collision = new SSCD.Circle(new SSCD.Vector(this.pos.x, this.pos.y), this.radius);
            this.scene.collisionWorld.add(this.collision);
            this.collision.set_collision_tags('elimination');
        }

        if (this.scene) {
            let collisionObj = this.scene.collisionWorld.pick_object(this.collision, 'bullet');
            while (collisionObj != null) {
                const bullet: Bullet = collisionObj.entity;
                bullet.destroy();
                collisionObj = this.scene.collisionWorld.pick_object(this.collision, 'bullet');
            }
        }
    }
}
