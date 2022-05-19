// export class Weapons{
//
//     static primary() {
//
//     }
// }

import {Weapon} from "@/scripts/game/weapon/Weapon";
import {Player} from "@/scripts/game/Player";
import {Emitter} from "@/scripts/game/Emitter";
import {Emitters} from "@/scripts/data/Emitters";
import {PlayerBullet} from "@/scripts/game/Bullet";
import {Vec2} from "@/scripts/engine/Vec2";
import {Entity} from "@/scripts/game/Entity";
import {GameObject} from "@/scripts/engine/GameObject";
import {Timer} from "@/scripts/engine/Timer";
import {EntityEvent} from "@/scripts/game/EntityEventList";
import {WeaponInfo} from "@/model";

//武器商店数据
export function weaponInfos(): WeaponInfo[] {
    return [
        {
            tag: 'primary',
            name: '主炮',
            price: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
            currentLevel: 1,
            maxLevel: 10,
            description: '会向正前方发射连续、密集的子弹',
            equip: true
        },
        {
            tag: 'missile',
            name: '导弹发射器',
            price: [200, 300, 350, 450, 500, 700, 900, 1100, 1350, 1500],
            currentLevel: 0,
            maxLevel: 10,
            description: '发射会自动跟踪敌人的导弹',
            equip: false
        },
        {
            tag: 'fire',
            name: '火焰喷射器',
            price: [200, 300, 350, 450, 500, 700, 900, 1100, 1350, 1500],
            currentLevel: 0,
            maxLevel: 10,
            description: '每隔一段时间发射一道火焰',
            equip: false
        }
    ];
}

//玩家武器数据
export namespace Weapons {

    //主武器，向前发射子弹
    export class Primary extends Weapon {
        static args = {
            // //子弹数量
            // num: [2, 2, 3, 3, 3, 5, 5, 5, 7, 7] as number[],
            //射击间隔时间
            period: [0.2, 0.19, 0.18, 0.17, 0.16, 0.15, 0.13, 0.11, 0.1, 0.08] as number[],
            //伤害
            damage: [10, 15, 15, 18, 20, 20, 23, 25, 25, 27] as number[],
        };

        constructor(player: Player, level: number, slot: number) {
            super(player, level, slot);
            // emitter: Emitter=Emitters.
            // const emitters = PlayerEmitters.playerPrimary(level);
            // const num = this.playerPrimaryArgs.num[level];
            const period = Primary.args.period[level - 1];
            const damage = Primary.args.damage[level - 1];

            const emitters: Emitter[] = [];

            const bulletGenerator = () => {
                const bullet: PlayerBullet = new PlayerBullet(Vec2.zero);
                bullet.damage = damage;
                return bullet;
            }

            const emitter1: Emitter = new Emitter(Vec2.zero, bulletGenerator);
            emitter1.numberAtOnce = 1;
            emitter1.entityDecorator = (entity: Entity) => {
                entity.pos = entity.pos.add(new Vec2(-10));
            }

            const emitter2: Emitter = new Emitter(Vec2.zero, bulletGenerator);
            emitter2.numberAtOnce = 1;
            emitter2.entityDecorator = (entity: Entity) => {
                entity.pos = entity.pos.add(new Vec2(10));
            }

            emitters.push(emitter1, emitter2);

            if (level > 2) {
                const emitter: Emitter = new Emitter(Vec2.zero, bulletGenerator);
                emitter.numberAtOnce = 1;
                emitter.entityDecorator = (entity: Entity) => {
                    entity.pos = entity.pos.add(new Vec2(0, -5));
                }
                emitters.push(emitter);
            }

            if (level > 5) {
                const emitter: Emitter = new Emitter(Vec2.zero, bulletGenerator);
                if (level > 8)
                    emitter.numberAtOnce = 4;
                else
                    emitter.numberAtOnce = 2;
                emitter.fixedAngle = 45;
                emitters.push(emitter);
            }

            for (const emitter of emitters) {
                emitter.duration = -1;
                emitter.period = period;
                emitter.dir = new Vec2(0, -1);
                emitter.lockEdge = true;
            }

            for (const emitter of emitters) {
                this.emitters.add(emitter);
                this.player.addEmitter(emitter);
            }
        }
    }

    //跟踪导弹发射器
    export class MissileLauncher extends Weapon {
        //当前锁定的目标
        target: GameObject | null = null;
        //导弹的转向速度，单位度
        // turningSpeed = 100;
        //
        shootTimer: Timer;

        //等级参数
        static args = {
            //导弹的转向速度，单位度/秒
            turningSpeed: [100, 110, 120, 130, 140, 150, 160, 170, 180, 190] as number[],
            //伤害
            damage: [10, 15, 15, 18, 20, 20, 23, 25, 25, 27] as number[],
            //导弹速度
            speed: [400, 420, 440, 460, 480, 500, 520, 540, 560, 580] as number[],
            //射击间隔时间
            period: [0.5, 0.46, 0.42, 0.38, 0.34, 0.30, 0.26, 0.22, 0.18, 0.14] as number[],
        };

        update(time: number) {
            super.update(time);
            this.shootTimer.update(time);
            if (this.shootTimer.isOver) {
                this.shoot();
                this.shootTimer.reset();
            }
            if (this.target) {
                if (this.target.dead)
                    this.target = null;
            } else {
                const enemies: Set<GameObject> | undefined = this.player.scene?.objectsWithTag.get('enemy');
                if (enemies) {
                    this.target = enemies.values().next().value;

                    // for (const enemy of enemies) {
                    //     this.target = enemy;
                    //     break;
                    // }
                }
            }
        }

        constructor(player: Player, level: number, slot: number) {
            super(player, level, slot);
            this.shootTimer = new Timer(MissileLauncher.args.period[level - 1]);
            const damage = MissileLauncher.args.damage[level - 1];
            const bulletSpeed = MissileLauncher.args.speed[level - 1];
            const turningSpeed = MissileLauncher.args.turningSpeed[level - 1];

            const emitters: Emitter[] = [];

            const bulletGenerator = () => {
                const bullet: PlayerBullet = new PlayerBullet(Vec2.zero);
                bullet.speed = bulletSpeed;
                bullet.texture = 'player_bullet_missile';
                bullet.radius = 10;
                bullet.updateExtension = (time: number) => {
                    if (this.target) {
                        const dir: Vec2 = this.target.pos.sub(bullet.pos).normalize;
                        const angle = Math.atan2(dir.y, dir.x) * 180 / Math.PI;
                        let bulletAngle = bullet.angle;
                        let diffAngle = bulletAngle - angle;
                        // const sign = diffAngle > 0 ? 1 : -1;
                        if (diffAngle < 0) {
                            if (-diffAngle > 180) {
                                diffAngle += 360;
                            }
                        } else {
                            if (diffAngle > 180) {
                                diffAngle -= 360;
                            }
                        }
                        if (diffAngle < -5) {
                            bulletAngle += turningSpeed * time;
                        }
                        if (diffAngle > 5) {
                            bulletAngle -= turningSpeed * time;
                        }
                        // if (bulletAngle - angle > 5) {
                        //     bulletAngle -= this.turningSpeed * time;
                        // } else if (bullet.angle - angle < -5) {
                        //     bulletAngle += this.turningSpeed * time;
                        // }
                        bullet.angle = bulletAngle;
                    }
                };
                bullet.damage = damage;
                return bullet;
            }

            if (level >= 7) {
                const emitter1: Emitter = new Emitter(Vec2.zero, bulletGenerator);
                emitter1.numberAtOnce = 2;
                emitter1.duration = -1;
                emitter1.period = -1;
                emitter1.dir = new Vec2(0, -1);
                emitter1.fixedAngle = 90;
                emitters.push(emitter1);
            }

            const emitter2: Emitter = new Emitter(Vec2.zero, bulletGenerator);
            emitter2.numberAtOnce = 2;
            emitter2.duration = -1;
            emitter2.period = -1;
            emitter2.dir = new Vec2(0, -1);
            emitter2.fixedAngle = 180;
            emitters.push(emitter2);


            if (level >= 4) {
                const emitter3: Emitter = new Emitter(Vec2.zero, bulletGenerator);
                emitter3.numberAtOnce = 2;
                emitter3.duration = -1;
                emitter3.period = -1;
                emitter3.dir = new Vec2(0, 1);
                emitter3.fixedAngle = 90;
                emitters.push(emitter3);
            }

            // for (const emitter of emitters) {
            //     emitter.duration = -1;
            //     emitter.period = 0.5;
            //     emitter.dir = new Vec2(0, -1);
            // }

            for (const emitter of emitters) {
                emitter.lockEdge = true;
                this.emitters.add(emitter);
                this.player.addEmitter(emitter);
            }
        }

        shoot() {
            for (const emitter of this.emitters) {
                emitter.shoot();
            }
        }
    }

    //喷火器
    export class Fire extends Weapon {
        //射击间隔计时器
        shootTimer: Timer;
        //喷火持续时间计时器
        fireTimer: Timer;

        //等级参数
        static args = {
            //两次发射之间的间隔，不包括发射的持续时间
            period: [3, 2.9, 2.8, 2.7, 2.6, 2.5, 2.4, 2.3, 2.2, 2.1] as number[],
            //发射的持续时间
            fireDuration: [2, 2.2, 2.4, 2.6, 2.8, 3.0, 3.2, 3.4, 3.6, 3.8] as number[],
            //子弹伤害
            damage: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29] as number[],
            //发射器的发射间隔
            emitterPeriod: [0.1, 0.097, 0.094, 0.091, 0.088, 0.085, 0.082, 0.079, 0.076, 0.073] as number[],
            //子弹存在时间
            existTime: [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9] as number[]
        };

        update(time: number) {
            super.update(time);
            this.shootTimer.update(time);

            if (this.shootTimer.isOver) {
                this.fireTimer.update(time);
                // if (this.fireTimer.isOver) {
                //     this.shootTimer.reset();
                // }
            }
        }

        constructor(player: Player, level: number, slot: number) {
            super(player, level, slot);
            this.shootTimer = new Timer(Fire.args.period[level - 1]);
            this.shootTimer.timeOverCallback = () => {
                for (const emitter of this.emitters) {
                    emitter.active = true;
                }
            };
            this.fireTimer = new Timer(Fire.args.fireDuration[level - 1]);
            this.fireTimer.timeOverCallback = () => {
                this.shootTimer.reset();
                this.fireTimer.reset();
                for (const emitter of this.emitters) {
                    emitter.active = false;
                }
            };

            // const damage = MissileLauncher.args.damage[level - 1];
            // const bulletSpeed = MissileLauncher.args.speed[level - 1];
            // const turningSpeed = MissileLauncher.args.turningSpeed[level - 1];

            const emitters: Emitter[] = [];

            const existTime = Fire.args.existTime[level - 1];
            const bulletGenerator = () => {
                const bullet: PlayerBullet = new PlayerBullet(Vec2.zero);
                bullet.damage = Fire.args.damage[level - 1];
                bullet.speed = 300;
                bullet.eventList.addEvent(new EntityEvent(() => bullet.survivalTime >= existTime, () => bullet.destroy()))
                bullet.updateExtension = (time: number) => {
                    bullet.display.scale.set(Math.sin(Math.PI * (bullet.survivalTime / existTime)));
                }
                return bullet;
            }

            const emitter1: Emitter = new Emitter(Vec2.zero, bulletGenerator);
            emitter1.numberAtOnce = 2;
            emitter1.duration = -1;
            emitter1.period = Fire.args.emitterPeriod[level - 1];
            emitter1.active = false;
            emitter1.random = true;
            emitter1.dir = new Vec2(0, -1);
            emitter1.fixedAngle = 45;
            emitters.push(emitter1);

            for (const emitter of emitters) {
                emitter.lockEdge = true;
                this.emitters.add(emitter);
                this.player.addEmitter(emitter);
            }
        }
    }
}