import {bulletPool} from "@/scripts/game/ObjectPool";
import {GameScene} from "@/scripts/game/GameScene";
import {Enemy} from "@/scripts/game/Enemy";
import {Vec2} from "@/scripts/engine/Vec2";
import {Emitters} from "@/scripts/data/Emitters";
import {Bullet} from "@/scripts/game/Bullet";
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
}
