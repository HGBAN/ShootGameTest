import {bulletPool} from "@/scripts/game/ObjectPool";
import {GameScene} from "@/scripts/game/GameScene";
import {Enemy} from "@/scripts/game/Enemy";
import {Vec2} from "@/scripts/engine/Vec2";
import {Emitters} from "@/scripts/data/Emitters";
import {Bullet, PlayerBullet} from "@/scripts/game/Bullet";
import {Entities} from "@/scripts/data/Entities";
import {EntityEvent} from "@/scripts/game/EntityEventList";
import {PropChanger, PropTween} from "@/scripts/engine/PropTransformer";
import {Emitter} from "@/scripts/game/Emitter";
import {liner} from "@/scripts/data/Functions";
import {Random} from "@/scripts/engine/Random";

export abstract class Bullets {
    static default() {
        return new Bullet(Vec2.zero);
    }

    //朝上方喷射的子弹
    static fire() {
        const bullet: Bullet = new Bullet(Vec2.zero);
        const emitter: Emitter = Emitters.fire(Emitters.line1());
        bullet.texture = 'bullet_2';
        bullet.radius = 20;
        emitter.angle = -90;
        bullet.addEmitter(emitter);
        return bullet;
    }

    //当玩家靠近时引爆的地雷
    static mine(scene: GameScene, dis: number = 100) {
        const bullet = new Bullet(Vec2.zero);
        bullet.speed = 0;
        bullet.radius = 20;
        bullet.texture = 'bullet_4';

        bullet.updateExtension = (time) => {
            const disToPlayer: number = bullet.pos.sub(scene.player.pos).disSquare;
            if (disToPlayer <= dis * dis) {
                bullet.destroy();
            }
        }

        const emitter = Emitters.line1(() => {
            const bullet: Bullet = new Bullet(Vec2.zero);
            bullet.speed = 300;
            return bullet;
        });
        emitter.numberAtOnce = 8;
        emitter.period = -1;
        emitter.duration = -1;
        // emitter.active = false;
        emitter.bindingObj = bullet;

        emitter.eventList.addEvent(new EntityEvent(() => bullet.dead,
            () => {
                emitter.shoot();
                emitter.destroy();
            }));
        scene.addObject(emitter);

        return bullet;
    }

    //缓慢停下后朝反方向运动的子弹
    static stopBack() {
        const bullet: Bullet = new Bullet(Vec2.zero);
        bullet.texture = 'bullet_4';
        bullet.rubValue = 10;
        bullet.speed = 300;
        bullet.updateExtension = (time) => {
            if (bullet.speed > -300)
                bullet.speed -= 160 * time;
        }

        return bullet;
    }

    //原地停留一段时间后朝反方向随机运动的子弹
    static stopBackRandom() {
        const bullet: Bullet = new Bullet(Vec2.zero);
        bullet.texture = 'bullet_4';
        bullet.speed = 0;
        bullet.eventList.addEvent(new EntityEvent(() => bullet.survivalTime >= 5, () => {
            bullet.speed = -300;
            bullet.angle += Random.range(-30, 30);
        }));

        return bullet;
    }

    //锁链
    static chain() {
        const bullet: Bullet = new Bullet(Vec2.zero);
        bullet.texture = 'bullet_1';
        bullet.speed = 400;

        const emitter: Emitter = new Emitter(Vec2.zero, Bullets.stopBackRandom);// Emitters.line1(this.stopBackRandom);
        emitter.period = 0.1;
        emitter.numberAtOnce = 1;
        emitter.duration = -1;
        emitter.angle = bullet.angle;
        bullet.addEmitter(emitter);

        return bullet;
    }

    //螺旋并放出朝固定点移动的子弹
    static rotate(scene: GameScene) {
        const bullet: Bullet = new Bullet(Vec2.zero);
        bullet.texture = 'bullet_3';
        bullet.speed = 100;

        let pos = Vec2.zero;
        bullet.eventList.addEvent(new EntityEvent(null, () => pos = bullet.pos))

        bullet.updateExtension = (time) => {
            bullet.speed += 200 * time;
            bullet.angle += 120 * time;
        }

        const startTime = scene.time;
        const emitter: Emitter = new Emitter(Vec2.zero, () => {
            const bullet1 = new Bullet(Vec2.zero);
            bullet1.speed = 0;
            bullet1.texture = 'bullet_4';
            bullet1.eventList.addEvent(new EntityEvent(() => scene.time - startTime >= 5, () => {
                bullet1.speed = 300;
            }));
            return bullet1;
        });
        emitter.entityDecorator = entity => {
            entity.dir = pos.sub(entity.pos).normalize;
        };
        emitter.period = 0.2;
        emitter.duration = -1;
        emitter.numberAtOnce = 1;
        bullet.addEmitter(emitter);

        return bullet;
    }

    //一边左右摇晃一边向下发出子弹
    static sinDown() {
        const bullet: Bullet = new Bullet(Vec2.zero);
        bullet.texture = 'bullet_4';
        bullet.speed = 100;
        bullet.dir = new Vec2(1, 0);

        bullet.updateExtension = (time) => {
            bullet.speed = Math.sin(bullet.activeTime) * 100;
        }

        const emitter: Emitter = new Emitter(Vec2.zero, () => {
            const bullet1 = new Bullet(Vec2.zero);
            bullet1.speed = 100;
            bullet1.texture = 'bullet_4';
            return bullet1;
        });

        emitter.period = 0.2;
        emitter.duration = -1;
        emitter.numberAtOnce = 1;
        emitter.dir = new Vec2(0, 1);
        bullet.addEmitter(emitter);

        return bullet;
    }

    //向下坠落并弹起的子弹
    static drop() {
        const bullet: Bullet = new Bullet(Vec2.zero);
        bullet.texture = 'bullet_4';
        bullet.speed = 0;

        bullet.dir = new Vec2(0, 1);

        const emitter: Emitter = new Emitter(Vec2.zero, Bullets.default);
        emitter.period = -1;
        emitter.duration = -1;
        emitter.numberAtOnce = 16;
        bullet.addEmitter(emitter);

        bullet.updateExtension = (time) => {
            bullet.speed += 300 * time;
            if (bullet.speed >= 300) {
                bullet.speed = -200;
                emitter.angle += 5;
                emitter.shoot();
            }
        }

        return bullet;
    }
}

//
// //玩家子弹
// export abstract class PlayerBullets {
//     //默认子弹
//     static default() {
//         const bullet: PlayerBullet = new PlayerBullet(Vec2.zero);
//         bullet.dir = new Vec2(0, -1);
//         return bullet;
//     }
//
//     //跟踪导弹
//     static missile(){
//         const bullet: PlayerBullet = new PlayerBullet(Vec2.zero);
//
//         return bullet;
//     }
// }