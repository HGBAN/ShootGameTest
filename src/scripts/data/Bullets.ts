import {bulletPool} from "@/scripts/game/ObjectPool";
import {GameScene} from "@/scripts/game/GameScene";
import {Enemy} from "@/scripts/game/Enemy";
import {Vec2} from "@/scripts/engine/Vec2";
import {Emitters} from "@/scripts/data/Emitters";
import {Bullet} from "@/scripts/game/Bullet";
import {Entities} from "@/scripts/data/Entities";
import {EntityEvent} from "@/scripts/game/EntityEventList";
import {PropChanger} from "@/scripts/engine/PropTransformer";
import {Emitter} from "@/scripts/game/Emitter";

export abstract class Bullets {
    static default() {
        return bulletPool.get();
    }

    //朝上方喷射的子弹
    static fire(){
        const bullet: Bullet = bulletPool.get();
        const emitter: Emitter = Emitters.fire(Emitters.line1());
        bullet.texture = 'bullet_2';
        bullet.radius = 20;
        emitter.angle = -90;
        bullet.addEmitter(emitter);
        return bullet;
    }

    //当玩家靠近时引爆的地雷
    static mine(scene: GameScene, dis: number = 100) {
        const bullet = bulletPool.get();
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
            const bullet: Bullet = bulletPool.get();
            bullet.speed = 300;
            return bullet;
        });
        emitter.numberAtOnce = 8;
        emitter.period = 99;
        emitter.duration = -1;
        emitter.active = false;
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
    static stopBack(){
        const bullet: Bullet = bulletPool.get();
        const emitter: Emitter = Emitters.fire(Emitters.line1());
        bullet.texture = 'bullet_2';
        bullet.radius = 20;
        emitter.angle = -90;
        bullet.addEmitter(emitter);
        return bullet;
    }
}
