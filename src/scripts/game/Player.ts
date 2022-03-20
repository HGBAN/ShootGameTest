import {Entity} from "@/scripts/game/Entity";
import {Scene, SSCD} from "@/scripts/engine/Scene";
import {Bullet, PlayerBullet} from "@/scripts/game/Bullet";
import {Input} from "@/scripts/engine/Input";
import {Vec2} from "@/scripts/engine/Vec2";
import {Timer} from "@/scripts/engine/Timer";
import {Elimination} from "@/scripts/game/Elimination";
import {Container, Graphics} from "pixi.js";
import {GameObject} from "@/scripts/engine/GameObject";

interface RubEffect {
    timer: Timer;
    display: Graphics;
}

export class Player extends Entity {
    radius = 2;
    shootTimer: Timer;
    life = 100;
    maxLife = 100;
    hitTimer: Timer = new Timer(1, false);
    static playerPos: Vec2;
    rubRadius = 35;
    rubCollision: any;
    // rubTimer: Set<Timer> = new Set<Timer>();
    rubEffects: Set<RubEffect> = new Set<RubEffect>();

    static rubTimes = 0;
    rubValue = 0;
    rubValueMax = 20;
    //允许消弹次数
    elimination = 1;
    eliminationTimer = new Timer(1, false);

    static score = 0;

    display = new Graphics();

    // selfDisplay = new Graphics();

    constructor(pos: Vec2) {
        super(pos);
        this.shootTimer = new Timer(0.1);
        this.rubCollision = new SSCD.Circle(new SSCD.Vector(pos.x, pos.y), this.rubRadius);
        Player.playerPos = pos;

        this.collision = new SSCD.Circle(new SSCD.Vector(pos.x, pos.y), this.radius);
        this.collision.entity = this;

        this.hitTimer.timeOverCallback=()=>{
            this.initGraphics();
        }
        // this.initGraphics();
    }

    set pos(value: Vec2) {
        super.pos = value;
        // this.d.position.set(this.pos.x, this.pos.y);
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

    initGraphics() {
        //绘制自身
        this.display.lineStyle(1, 0x8C1A1A, 1);
        this.display.clear();
        this.display.beginFill(0xDD2222, 1);
        this.display.drawCircle(0, 0, 4);
        this.display.endFill();

        // this.display.addChild(this.display);
        // console.log(1);
        // this.display.position.set();
    }

    addRubEffect() {
        const effect: RubEffect = {timer: new Timer(0.5), display: new Graphics()};
        this.display.addChild(effect.display);
        this.rubEffects.add(effect);
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
        // for (const timer of this.rubTimer) {
        //     if (timer.isOver) {
        //         this.rubTimer.delete(timer);
        //         continue;
        //     }
        //     const pro = timer.progress;
        //     ctx.beginPath();
        //     ctx.ellipse(this.pos.x, this.pos.y, this.rubRadius * pro, this.rubRadius * pro, 0, 0, 2 * Math.PI);
        //     ctx.globalAlpha = 1 - pro;
        //     ctx.stroke();
        // }

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

    update() {
        //更新受创效果
        if (!this.hitTimer.isOver) {
            this.display.clear();
            this.display.beginFill(0xDD2222, Math.cos(this.hitTimer.progress * Math.PI * 8) / 2.3 + (1 - 1 / 2.3));
            this.display.drawCircle(0, 0, 4);
            this.display.endFill();
        }
        //更新擦弹效果
        for (const effect of this.rubEffects) {
            const pro = effect.timer.progress;

            effect.display.clear();
            effect.display.lineStyle(1, 0xDD2222, 1 - pro);
            effect.display.drawCircle(0, 0, this.rubRadius * pro);
        }
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

        // for (const timer of this.rubTimer)
        //     timer.update(time);
        for (const effect of this.rubEffects) {
            effect.timer.update(time);
            if (effect.timer.isOver) {
                this.rubEffects.delete(effect);
                this.display.removeChild(effect.display);
            }
        }

        if (this.scene) {
            const rubCollisionObjs: Array<any> = [];
            this.scene.collisionWorld.test_collision(this.rubCollision, 'bullet', rubCollisionObjs);
            for (const obj of rubCollisionObjs) {
                if (!obj.rubbed) {
                    //一个子弹只能擦一次
                    obj.rubbed = true;
                    //添加擦弹效果
                    // this.rubTimer.add(new Timer(0.5));
                    this.addRubEffect();
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
