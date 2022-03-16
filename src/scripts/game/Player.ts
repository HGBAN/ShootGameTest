import {Entity} from "@/scripts/game/Entity";
import {Scene} from "@/scripts/engine/Scene";
import {Bullet} from "@/scripts/game/Bullet";
import {Input} from "@/scripts/engine/Input";
import {Vec2} from "@/scripts/engine/Vec2";

export class Player extends Entity {
    radius = 5;

    setScene(scene: Scene) {
        super.setScene(scene);
        this.collision.set_collision_tags('player');
    }

    draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);
        ctx.beginPath();
        ctx.ellipse(this.pos.x, this.pos.y, this.radius, this.radius, 0, 0, 2 * Math.PI);
        // ctx.fillRect(this.pos.x, this.pos.y, this.radius, this.radius);
        // ctx.lineWidth = 4;
        ctx.strokeStyle = '#DD2222';

        const grd = ctx.createRadialGradient(this.pos.x, this.pos.y, 0, this.pos.x, this.pos.y, this.radius);
        grd.addColorStop(0, 'red');
        grd.addColorStop(1, '#DD2222');
        ctx.fillStyle = grd;

        ctx.stroke();
        ctx.fill();
        // ctx.fill();

    }

    fixedUpdate(time: number) {
        super.fixedUpdate(time);
        // if (Input.getKey('a').isDown) {
        //     this.pos = this.pos.add(new Vec2(-1, 0).mul(100 * time));
        // }
        let dir: Vec2 = Vec2.zero;
        if (Input.getKey('a').isDown) {
            dir.x -= 1;
        }
        if (Input.getKey('d').isDown) {
            dir.x += 1;
        }
        if (Input.getKey('w').isDown) {
            dir.y -= 1;
        }
        if (Input.getKey('s').isDown) {
            dir.y += 1;
        }
        dir = dir.normalize;
        this.pos = this.pos.add(dir.mul(200 * time));

        if (this.scene) {
            const collisionObj = this.scene.collisionWorld.pick_object(this.collision, 'bullet');
            if (collisionObj != null) {
                const bullet: Bullet = collisionObj.entity;
                bullet.destroy();
            }
        }
    }
}
