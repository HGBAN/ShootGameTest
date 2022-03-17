import {Entity} from "@/scripts/game/Entity";
import {Scene, SSCD} from "@/scripts/engine/Scene";
import {Bullet, PlayerBullet} from "@/scripts/game/Bullet";
import {Input} from "@/scripts/engine/Input";
import {Vec2} from "@/scripts/engine/Vec2";
import {Timer} from "@/scripts/engine/Timer";

export class Player extends Entity {
    radius = 5;
    shootTimer: Timer;
    life = 100;
    static playerPos: Vec2;
    rubRadius = 30;
    rubCollision: any;
    rubTimer: Set<Timer> = new Set<Timer>();

    constructor(pos: Vec2) {
        super(pos);
        this.shootTimer = new Timer(0.1);
        this.rubCollision = new SSCD.Circle(new SSCD.Vector(pos.x, pos.y), this.rubRadius);
        Player.playerPos = pos;
    }

    set pos(value: Vec2) {
        super.pos = value;
        this.rubCollision.set_position(new SSCD.Vector(this._pos.x, this._pos.y));
    }

    get pos() {
        return this._pos;
    }

    static toPlayerDir(pos: Vec2) {
        return this.playerPos.sub(pos).normalize;
    }

    setScene(scene: Scene) {
        super.setScene(scene);
        this.collision.set_collision_tags('player');
        this.scene?.collisionWorld.add(this.rubCollision);
        this.rubCollision.set_collision_tags('rub');
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


        for (const timer of this.rubTimer) {
            if (timer.isOver) {
                this.rubTimer.delete(timer);
                continue;
            }
            const pro = timer.progress;
            ctx.beginPath();
            ctx.ellipse(this.pos.x, this.pos.y, this.rubRadius * pro, this.rubRadius * pro, 0, 0, 2 * Math.PI);
            ctx.globalAlpha = 1 - pro;
            ctx.stroke();
        }

        ctx.globalAlpha = 1;

        // if (!this.rubTimer.isOver) {
        //
        // }
    }

    fixedUpdate(time: number) {
        super.fixedUpdate(time);
        // if (Input.getKey('a').isDown) {
        //     this.pos = this.pos.add(new Vec2(-1, 0).mul(100 * time));
        // }
        let dir: Vec2 = Vec2.zero;
        if (Input.moveDir.equals(Vec2.zero)) {
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
        } else {
            dir = Input.moveDir;
            // Input.moveDir = Vec2.zero;
        }

        this.pos = this.pos.add(dir.mul(200 * time));
        Player.playerPos = this.pos;

        this.shootTimer.update(time);
        if (this.shootTimer.isOver) {
            // if (Input.getKey('j').isDown) {
            this.shoot();
            this.shootTimer.reset();
            // }
        }

        for (const timer of this.rubTimer)
            timer.update(time);

        if (this.scene) {
            const rubCollisionObj = this.scene.collisionWorld.pick_object(this.rubCollision, 'bullet');
            if (rubCollisionObj != null) {
                if (!rubCollisionObj.rubbed) {
                    rubCollisionObj.rubbed = true;
                    this.rubTimer.add(new Timer(0.5));
                }

                // for (const timer of this.rubTimer)
                //     timer.reset();

                const collisionObj = this.scene.collisionWorld.pick_object(this.collision, 'bullet');
                if (collisionObj != null) {
                    const bullet: Bullet = collisionObj.entity;
                    bullet.destroy();
                }
            }
        }
    }

    shoot() {
        const bullet: PlayerBullet = new PlayerBullet(this.pos.sub(new Vec2(-10, 0)));
        bullet.dir = new Vec2(0, -1);
        this.scene?.addObject(bullet);
        const bullet2: PlayerBullet = new PlayerBullet(this.pos.sub(new Vec2(10, 0)));
        bullet2.dir = new Vec2(0, -1);
        this.scene?.addObject(bullet2);
    }

    destroy() {
        super.destroy();
        this.scene?.collisionWorld.remove(this.rubCollision);
    }
}
