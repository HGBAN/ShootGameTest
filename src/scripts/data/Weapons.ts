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
}