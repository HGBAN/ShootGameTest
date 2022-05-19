import {Entity} from "@/scripts/game/Entity";
import {Scene, SSCD} from "@/scripts/engine/Scene";
import {Bullet, PlayerBullet} from "@/scripts/game/Bullet";
import {Input} from "@/scripts/engine/Input";
import {Vec2} from "@/scripts/engine/Vec2";
import {Timer} from "@/scripts/engine/Timer";
import {Elimination} from "@/scripts/game/Elimination";
import {Container, Graphics} from "pixi.js";
import {GameObject} from "@/scripts/engine/GameObject";
import {Weapon} from "@/scripts/game/weapon/Weapon";
import {weaponInfos, Weapons} from "@/scripts/data/Weapons";
import {ErrCode, ResponseData, WeaponInfo} from "@/model";
import axios from "axios";
import Primary = Weapons.Primary;
import {Coin} from "@/scripts/game/Coin";

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
    //金币碰撞箱
    coinRadius = 70;
    coinCollision: any;
    // rubTimer: Set<Timer> = new Set<Timer>();
    rubEffects: Set<RubEffect> = new Set<RubEffect>();

    static rubTimes = 0;
    rubValue = 0;
    rubValueMax = 1000;
    //允许消弹次数
    elimination = 1;
    eliminationTimer = new Timer(1, false);

    static score = 0;

    display = new Graphics();

    //武器
    weapons: Weapon[] = [];

    // selfDisplay = new Graphics();

    constructor(pos: Vec2) {
        super(pos);
        this.shootTimer = new Timer(0.1);
        this.rubCollision = new SSCD.Circle(new SSCD.Vector(pos.x, pos.y), this.rubRadius);
        this.coinCollision = new SSCD.Circle(new SSCD.Vector(pos.x, pos.y), this.coinRadius);
        Player.playerPos = pos;
        Player.rubTimes = Player.score = 0;

        this.collision = new SSCD.Circle(new SSCD.Vector(pos.x, pos.y), this.radius);
        this.collision.entity = this;

        this.hitTimer.timeOverCallback = () => {
            this.initGraphics();
        }
        // this.initGraphics();


        // new Weapons.Primary(this, 4, 1);
        // new Weapons.MissileLauncher(this, 4, 0);
        // new Weapons.Fire(this, 10, 0);
        // this.weaponInfo = weaponInfos();

    }

    set pos(value: Vec2) {
        super.pos = value;
        // this.d.position.set(this.pos.x, this.pos.y);
        this.rubCollision.set_position(new SSCD.Vector(this._pos.x, this._pos.y));
        this.coinCollision.set_position(new SSCD.Vector(this._pos.x, this._pos.y));
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
        this.scene?.collisionWorld.add(this.coinCollision);
        this.rubCollision.set_collision_tags('rub');
        this.coinCollision.set_collision_tags('coin_collision');
        this.setWeapons();
    }

    reset() {
        this.pos = new Vec2(360, 1000);
        this.collision = new SSCD.Circle(new SSCD.Vector(this.pos.x, this.pos.y), this.radius);
        this.collision.entity = this;
        this.rubCollision = new SSCD.Circle(new SSCD.Vector(this.pos.x, this.pos.y), this.rubRadius);
        this.coinCollision = new SSCD.Circle(new SSCD.Vector(this.pos.x, this.pos.y), this.coinRadius);
        this.dead = false;
        this.life = this.maxLife;
        // for (const weapon of this.weapons) {
        //     if (weapon)
        //         weapon.destroy();
        // }
        // new Weapons.MissileLauncher(this, 4, 0);
        // this.setWeapons();
    }

    setWeapons() {
        if (!this.scene)
            return;
        for (const weapon of this.weapons) {
            if (weapon) {
                weapon.destroy();
            }
        }
        for (const info of this.scene.gameMain.weaponInfo) {
            // console.log(info);
            if (info.equip) {
                if (info.tag == 'primary') {
                    new Weapons.Primary(this, info.currentLevel, -1);
                } else if (info.tag == 'missile') {
                    new Weapons.MissileLauncher(this, info.currentLevel, -1);
                } else if (info.tag == 'fire') {
                    new Weapons.Fire(this, info.currentLevel, -1);
                }
            }
        }
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
        if (newPos.x < 0)
            newPos.x = 0;
        if (newPos.y < 0)
            newPos.y = 0;
        if (newPos.x > 720)
            newPos.x = 720;
        if (newPos.y > 1280)
            newPos.y = 1280;
        this.pos = newPos;
        Player.playerPos = this.pos;
        // if (newPos.x > 0 && newPos.y > 0 && newPos.x < 720 && newPos.y < 1280) {
        //     this.pos = newPos;
        //     Player.playerPos = this.pos;
        // }

        // this.shootTimer.update(time);
        // if (this.shootTimer.isOver) {
        //     // if (Input.getKey('j').isDown) {
        //     this.shoot();
        //     this.shootTimer.reset();
        //     // }
        // }

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
            //判断擦弹的碰撞
            const rubCollisionObjs: Array<any> = [];
            this.scene.collisionWorld.test_collision(this.rubCollision, 'bullet', rubCollisionObjs);
            for (const obj of rubCollisionObjs) {
                const bullet = obj.entity as Bullet;
                if (!bullet.rubbed) {
                    //一个子弹只能擦一次
                    bullet.rubbed = true;
                    //添加擦弹效果
                    // this.rubTimer.add(new Timer(0.5));
                    this.addRubEffect();
                    Player.rubTimes++;
                    this.rubValue += bullet.rubValue;
                    if (this.rubValue >= this.rubValueMax) {
                        this.rubValue -= this.rubValueMax;
                        this.elimination++;
                    }
                }
            }
            //判断子弹的碰撞
            if (rubCollisionObjs.length > 0) {
                const collisionObj = this.scene.collisionWorld.pick_object(this.collision, 'bullet');
                if (collisionObj != null) {
                    const bullet: Bullet = collisionObj.entity;
                    bullet.destroy();
                    this.hit(bullet.damage);
                }
            }
            //判断与金币的碰撞
            let coinCollisionObjs: Array<any> = [];
            this.scene.collisionWorld.test_collision(this.coinCollision, 'coin', coinCollisionObjs);
            for (const obj of coinCollisionObjs) {
                const coin = obj.entity as Coin;
                coin.adsorbent = true;
            }

            coinCollisionObjs = [];
            this.scene.collisionWorld.test_collision(this.collision, 'coin', coinCollisionObjs);
            for (const obj of coinCollisionObjs) {
                const coin = obj.entity as Coin;
                this.scene.gameMain.money += coin.value;
                coin.destroy();
            }
        }

        //更新武器
        for (const weapon of this.weapons) {
            if (!weapon)
                continue;
            weapon.update(time);
        }
    }

    //弃用，由武器代替
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
        if (this.life <= 0) {
            this.life = 0;
            this.dead = true;
        }
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
