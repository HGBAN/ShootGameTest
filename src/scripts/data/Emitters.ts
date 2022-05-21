import {Emitter, EntityGenerator} from "@/scripts/game/Emitter";
import {Enemies} from "@/scripts/data/Enemies";
import {Vec2} from "@/scripts/engine/Vec2";
import {Bullets} from "@/scripts/data/Bullets";
import {Entities} from "@/scripts/data/Entities";
import {EntityEvent, EntityEventList} from "@/scripts/game/EntityEventList";
import {Bullet, PlayerBullet} from "@/scripts/game/Bullet";
import {bulletPool} from "@/scripts/game/ObjectPool";
import {GameScene} from "@/scripts/game/GameScene";
import {Random} from "@/scripts/engine/Random";
import {PropChanger, PropMutation} from "@/scripts/engine/PropTransformer";
import {Entity} from "@/scripts/game/Entity";

export abstract class Emitters {
    static line1(entity: EntityGenerator = Enemies.sniper1): Emitter {
        const emitter: Emitter = new Emitter(Vec2.zero, entity);
        return emitter;
    }

    static sin(entity: EntityGenerator = Bullets.default, reverse: boolean = false): Emitter {
        const emitter: Emitter = new Emitter(Vec2.zero, entity);

        emitter.entityEvent = (entity) => {
            const eventList: EntityEventList = new EntityEventList(null, -1);
            if (!reverse) {
                eventList.addEvent(new EntityEvent(null, new PropMutation(entity, 'angle', entity.angle + 45)));
                eventList.addEvent(new EntityEvent(null, new PropChanger(entity, 'angle', 1, -90, (x) => (Math.sin((2 * x - 1) * Math.PI / 2) + 1) / 2)));
                eventList.addEvent(new EntityEvent(() => eventList.currentPeriodTime >= 1, new PropChanger(entity, 'angle', 1, 90, (x) => (Math.sin((2 * x - 1) * Math.PI / 2) + 1) / 2)));
            } else {
                eventList.addEvent(new EntityEvent(null, new PropMutation(entity, 'angle', entity.angle - 45)));
                eventList.addEvent(new EntityEvent(null, new PropChanger(entity, 'angle', 1, 90, (x) => (Math.sin((2 * x - 1) * Math.PI / 2) + 1) / 2)));
                eventList.addEvent(new EntityEvent(() => eventList.currentPeriodTime >= 1, new PropChanger(entity, 'angle', 1, -90, (x) => (Math.sin((2 * x - 1) * Math.PI / 2) + 1) / 2)));
            }
            entity.eventList.addEvent(eventList);
        };

        return emitter;
    }

    //不停往反方向喷出会向下掉落的实体
    static fire(emitter: Emitter, entity: EntityGenerator = Bullets.default) {
        emitter.numberAtOnce = 3;
        emitter.fixedAngle = 90;
        emitter.random = true;
        emitter.duration = -1;
        emitter.period = 1;
        emitter.entity = entity;
        emitter.entityDecorator = (entity) => {
            Entities.drop(entity);
        }
        return emitter;
    }

    //三连发
    static three(entity: EntityGenerator = Bullets.default) {
        const emitter: Emitter = new Emitter(Vec2.zero, entity);
        emitter.period = 0.1;
        emitter.numberAtOnce = 1;
        emitter.duration = -1;
        const eventList: EntityEventList = new EntityEventList();
        eventList.repeatTime = -1;
        eventList.addEvent(new EntityEvent(() => eventList.currentPeriodTime >= 0, () => {
            emitter.numberAtOnce = 1;
        }));
        eventList.addEvent(new EntityEvent(() => eventList.currentPeriodTime >= 0.3, () => {
            emitter.numberAtOnce = 0;
        }));
        eventList.addEvent(new EntityEvent(() => eventList.currentPeriodTime >= 1.5, () => {

        }));
        emitter.eventList.addEvent(eventList);
        return emitter;
    }

    //定时随机移动到屏幕边缘并随机发射
    static edgeShoot(entity: EntityGenerator = Bullets.default, numberAtOnce = 1, step = 0.5,
                     repeatTime = 10) {
        const emitter: Emitter = new Emitter(Vec2.zero, entity);
        emitter.period = -1;
        emitter.numberAtOnce = 1;
        emitter.duration = -1;

        const eventList = new EntityEventList();
        eventList.repeatTime = -1;
        let currentRepeat = 0;
        eventList.addEvent(new EntityEvent(null, () => {
            if (!emitter.active)
                return;
            for (let i = 0; i < numberAtOnce; i++) {
                //0右，1下，2左，3上
                const type = Random.range(0, 3);
                let x: number, y: number, angle: number;
                if (type == 0) {
                    [x, y, angle] = [720, Random.range(0, 1280), Random.range(120, 240)];
                } else if (type == 1) {
                    [x, y, angle] = [Random.range(0, 720), 1280, Random.range(210, 330)];
                } else if (type == 2) {
                    [x, y, angle] = [0, Random.range(0, 1280), Random.range(-60, 60)];
                } else {
                    [x, y, angle] = [Random.range(0, 720), 0, Random.range(30, 150)];
                }
                emitter.pos = new Vec2(x, y);
                emitter.angle = angle;
                emitter.shoot();
            }
            currentRepeat++;
            if (currentRepeat >= repeatTime)
                emitter.destroy();
        }));
        eventList.addEvent(new EntityEvent(() => eventList.currentPeriodTime >= step, () => {
        }));

        emitter.eventList.addEvent(eventList);
        return emitter;
    }

    //发射旋转的子弹
    static rotate(entity: EntityGenerator = Bullets.default) {
        const emitter: Emitter = new Emitter(Vec2.zero, entity);
        emitter.period = -1;
        emitter.numberAtOnce = 8;
        emitter.duration = -1;
        const eventList: EntityEventList = new EntityEventList();
        eventList.repeatTime = -1;
        eventList.addEvent(new EntityEvent(() => eventList.currentPeriodTime >= 0, () => {
            emitter.numberAtOnce = 1;
        }));
        eventList.addEvent(new EntityEvent(() => eventList.currentPeriodTime >= 0.3, () => {
            emitter.numberAtOnce = 0;
        }));
        eventList.addEvent(new EntityEvent(() => eventList.currentPeriodTime >= 1.5, () => {

        }));
        emitter.eventList.addEvent(eventList);
        return emitter;
    }
}

// //玩家发射器
// export abstract class PlayerEmitters {
//
//     //默认发射器
//
//     //发射器等级参数
//     static playerPrimaryArgs = {
//         // //子弹数量
//         // num: [2, 2, 3, 3, 3, 5, 5, 5, 7, 7] as number[],
//         //射击间隔时间
//         period: [0.2, 0.19, 0.18, 0.17, 0.16, 0.15, 0.13, 0.11, 0.1, 0.08] as number[],
//         //伤害
//         damage: [10, 15, 15, 18, 20, 20, 23, 25, 25, 27] as number[],
//     };
//
//     static playerPrimary(level: number) {
//         // const num = this.playerPrimaryArgs.num[level];
//         const period = this.playerPrimaryArgs.period[level - 1];
//         const damage = this.playerPrimaryArgs.damage[level - 1];
//
//         const emitters: Emitter[] = [];
//
//         const bulletGenerator = () => {
//             const bullet: PlayerBullet = new PlayerBullet(Vec2.zero);
//             bullet.damage = damage;
//             return bullet;
//         }
//
//         const emitter1: Emitter = new Emitter(Vec2.zero, bulletGenerator);
//         emitter1.numberAtOnce = 1;
//         emitter1.entityDecorator = (entity: Entity) => {
//             entity.pos = entity.pos.add(new Vec2(-10));
//         }
//
//         const emitter2: Emitter = new Emitter(Vec2.zero, bulletGenerator);
//         emitter2.numberAtOnce = 1;
//         emitter2.entityDecorator = (entity: Entity) => {
//             entity.pos = entity.pos.add(new Vec2(10));
//         }
//
//         emitters.push(emitter1, emitter2);
//
//         if (level > 2) {
//             const emitter: Emitter = new Emitter(Vec2.zero, bulletGenerator);
//             emitter.numberAtOnce = 1;
//             emitter.entityDecorator = (entity: Entity) => {
//                 entity.pos = entity.pos.add(new Vec2(0, -5));
//             }
//             emitters.push(emitter);
//         }
//
//         if (level > 5) {
//             const emitter: Emitter = new Emitter(Vec2.zero, bulletGenerator);
//             if (level > 8)
//                 emitter.numberAtOnce = 4;
//             else
//                 emitter.numberAtOnce = 2;
//             emitter.fixedAngle = 45;
//             emitters.push(emitter);
//         }
//
//         for (const emitter of emitters) {
//             emitter.duration = -1;
//             emitter.period = period;
//             emitter.dir = new Vec2(0, -1);
//         }
//
//         // if (level > 8) {
//         //
//         // }
//
//         return emitters;
//     }
// }