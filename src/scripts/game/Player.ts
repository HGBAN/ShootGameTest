import {Entity} from "@/scripts/game/Entity";
import {Scene, SSCD} from "@/scripts/engine/Scene";
import {Bullet, PlayerBullet} from "@/scripts/game/Bullet";
import {Input} from "@/scripts/engine/Input";
import {Vec2} from "@/scripts/engine/Vec2";
import {Timer} from "@/scripts/engine/Timer";
import {Elimination} from "@/scripts/game/Elimination";

export class Player extends Entity {
    radius = 2;
    shootTimer: Timer;
    life = 100;
    maxLife = 100;
    hitTimer: Timer = new Timer(1, false);
    static playerPos: Vec2;
    rubRadius = 35;
    rubCollision: any;
    rubTimer: Set<Timer> = new Set<Timer>();

    static rubTimes = 0;
    rubValue = 0;
    rubValueMax = 20;
    //允许消弹次数
    elimination = 1;
    eliminationTimer = new Timer(1, false);

    static score = 0;

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
        //绘制自身
        ctx.beginPath();
        ctx.ellipse(this.pos.x, this.pos.y, 4, 4, 0, 0, 2 * Math.PI);
        // ctx.fillRect(this.pos.x, this.pos.y, this.radius, this.radius);
        // ctx.lineWidth = 4;
        ctx.strokeStyle = '#DD2222';

        const grd = ctx.createRadialGradient(this.pos.x, this.pos.y, 0, this.pos.x, this.pos.y, 4);
        grd.addColorStop(0, 'red');
        grd.addColorStop(1, '#DD2222');
        ctx.fillStyle = grd;

        //受创效果
        ctx.globalAlpha = Math.cos(this.hitTimer.progress * Math.PI * 8) / 2.3 + (1 - 1 / 2.3);
        ctx.stroke();
        ctx.fill();

        //绘制擦弹效果
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

        //绘制血条
        ctx.fillRect(680, 20, 20, 10);
        ctx.fillRect(685, 15, 10, 20);
        ctx.strokeRect(680, 40, 20, 200);
        const healthRate = this.life / this.maxLife;
        ctx.fillRect(683, 43 + 194 * (1 - healthRate), 14, 194 * healthRate);

        //绘制擦弹条
        ctx.fillStyle = '#3c79d5';
        ctx.strokeStyle = '#3c79d5';
        ctx.beginPath();
        ctx.ellipse(660, 25, 10, 10, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeRect(650, 40, 20, 200);
        const rubRate = this.rubValue / this.rubValueMax;
        ctx.fillRect(653, 43 + 194 * (1 - rubRate), 14, 194 * rubRate);
        ctx.fillText(this.elimination.toString(), 648, 285);

        //绘制分数
        ctx.textAlign = "center";
        ctx.fillStyle = '#9f65ff';
        ctx.fillText(Player.score.toString(), 360, 1164);
        //绘制擦弹数
        ctx.fillStyle = '#ff6593';
        ctx.fillText(Player.rubTimes.toString(), 360, 1224);
        ctx.textAlign = "left";
    }

    fixedUpdate(time: number) {
        super.fixedUpdate(time);
        // if (Input.getKey('a').isDown) {
        //     this.pos = this.pos.add(new Vec2(-1, 0).mul(100 * time));
        // }
        this.hitTimer.update(time);
        this.eliminationTimer.update(time);
        let dir: Vec2 = Vec2.zero;
        if (Input.doubleTap) {
            this.eliminate();
            Input.doubleTap = false;
        }
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
            if (Input.getKey('k').isDown) {
                this.eliminate();
            }
            dir = dir.normalize;
        } else {
            dir = Input.moveDir;
        }

        const newPos = this.pos.add(dir.mul(200 * time));
        if (newPos.x > 0 && newPos.y > 0 && newPos.x < 720 && newPos.y < 1280) {
            this.pos = newPos;
            Player.playerPos = this.pos;
        }

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
            const rubCollisionObjs: Array<any> = [];
            this.scene.collisionWorld.test_collision(this.rubCollision, 'bullet', rubCollisionObjs);
            for (const obj of rubCollisionObjs) {
                if (!obj.rubbed) {
                    //一个子弹只能擦一次
                    obj.rubbed = true;
                    //添加擦弹效果
                    this.rubTimer.add(new Timer(0.5));
                    Player.rubTimes++;
                    this.rubValue++;
                    if (this.rubValue >= this.rubValueMax) {
                        this.rubValue -= this.rubValueMax;
                        this.elimination++;
                    }
                }
            }
            if (rubCollisionObjs.length > 0) {
                const collisionObj = this.scene.collisionWorld.pick_object(this.collision, 'bullet');
                if (collisionObj != null) {
                    const bullet: Bullet = collisionObj.entity;
                    bullet.destroy();
                    this.hit(bullet.damage);
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

    hit(damage: number) {
        //受创硬直
        if (!this.hitTimer.isOver)
            return;
        this.life -= damage;
        if (this.life < 0)
            this.life = 0;
        this.hitTimer.reset();
    }

    eliminate() {
        if (this.eliminationTimer.isOver) {
            if (this.elimination >= 1) {
                this.elimination--;
                this.eliminationTimer.reset();
                this.scene?.addObject(new Elimination(this.pos.clone, this.scene));
            }
        }
    }
}
