import {Emitter} from "@/scripts/game/Emitter";
import {Vec2} from "@/scripts/engine/Vec2";
import {Enemy} from "@/scripts/game/Enemy";
import {BulletEmitters} from "@/scripts/data/BulletEmitters";
import {Scene} from "@/scripts/engine/Scene";
import {EntityEvent} from "@/scripts/game/EntityEventList";
import {PropMutation} from "@/scripts/engine/PropTransformer";
import {Player} from "@/scripts/game/Player";
import {Bullet} from "@/scripts/game/Bullet";
import {bulletPool} from "@/scripts/game/ObjectPool";

export abstract class Enemies {
    static sniper1(): Enemy {
        const enemy: Enemy = new Enemy(Vec2.zero);
        enemy.setMaxLife(50);
        enemy.speed = 100;
        const emitter = BulletEmitters.snipe();
        emitter.numberAtOnce = 1;
        emitter.period = 1;
        emitter.duration = -1;
        enemy.addEmitter(emitter);

        return enemy;
    }

    static sin1(): Enemy {
        const enemy: Enemy = new Enemy(Vec2.zero);
        enemy.setMaxLife(200);
        enemy.speed = 100;
        enemy.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 2,
            new PropMutation(enemy, 'speed', 0)));
        enemy.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 7, () => {
            enemy.speed = -100;
        }));
        const emitter = BulletEmitters.sin();
        emitter.numberAtOnce = 0;
        emitter.period = 0.2;
        emitter.duration = -1;
        emitter.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 2,
            new PropMutation(emitter, 'numberAtOnce', 1)));
        emitter.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 6,
            new PropMutation(emitter, 'numberAtOnce', 0)));
        const emitter2 = BulletEmitters.sin(true);
        emitter2.numberAtOnce = 0;
        emitter2.period = 0.2;
        emitter2.duration = -1;
        emitter2.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 2,
            new PropMutation(emitter2, 'numberAtOnce', 1)));
        emitter2.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 6,
            new PropMutation(emitter2, 'numberAtOnce', 0)));

        enemy.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 2, () => {
            emitter.dir = Player.toPlayerDir(enemy.pos);
            emitter2.dir = Player.toPlayerDir(enemy.pos);
        }));
        enemy.addEmitter(emitter);
        enemy.addEmitter(emitter2);

        return enemy;
    }

    static circle2(): Enemy {
        const enemy: Enemy = new Enemy(Vec2.zero);
        enemy.setMaxLife(300);
        enemy.speed = 200;
        enemy.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 2,
            new PropMutation(enemy, 'speed', 0)));
        enemy.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 9, () => {
            enemy.speed = -200;
        }));
        const emitter = BulletEmitters.circle2(7);
        emitter.numberAtOnce = 0;
        emitter.period = 0.1;
        emitter.duration = -1;
        emitter.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 2,
            new PropMutation(emitter, 'numberAtOnce', 5)));
        emitter.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 7,
            new PropMutation(emitter, 'numberAtOnce', 0)));
        enemy.addEmitter(emitter);

        return enemy;
    }

    static lineRandom(): Enemy {
        const enemy: Enemy = new Enemy(Vec2.zero);
        enemy.setMaxLife(50);
        enemy.speed = 200;

        const emitter = BulletEmitters.lineRandom();
        emitter.numberAtOnce = 1;
        emitter.period = 3;
        emitter.duration = -1;
        emitter.active = false;
        emitter.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 2,
            () => emitter.dir = Player.toPlayerDir(enemy.pos)));
        emitter.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 5,
            () => emitter.dir = Player.toPlayerDir(enemy.pos)));
        emitter.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 2,
            () => emitter.active = true));
        emitter.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 6,
            () => emitter.active = false));
        enemy.addEmitter(emitter);

        return enemy;
    }

    static boss1(): Enemy {
        const enemy: Enemy = new Enemy(Vec2.zero);
        enemy.setMaxLife(3000);
        // enemy.showBar = true;
        enemy.speed = 400;
        // enemy.speed = 300;

        const emitter = BulletEmitters.circle1();
        emitter.numberAtOnce = 4;
        emitter.period = 0.03;
        emitter.duration = -1;
        emitter.active = false;
        emitter.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 1,
            () => {
                emitter.active = true;
                emitter.survivalTime = 0;
            }));
        emitter.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 1, () => {
            // console.log(emitter.numberAtOnce);
            emitter.entity = () => {
                const bullet: Bullet = bulletPool.get();
                bullet.speed = 300;
                bullet.texture = 'bullet_1';
                return bullet;
            }
        }));
        emitter.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 1.5, () => {
            // console.log(emitter.numberAtOnce);
            emitter.entity = () => {
                const bullet: Bullet = bulletPool.get();
                bullet.speed = 500;
                bullet.texture = 'bullet_1';
                return bullet;
            }
        }));
        emitter.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 2, () => {
            emitter.entity = () => {
                const bullet: Bullet = bulletPool.get();
                bullet.speed = 700;
                bullet.texture = 'bullet_1';
                return bullet;
            }
        }));
        emitter.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 2.5,
            () => emitter.active = false));
        enemy.addEmitter(emitter);

        const emitter2 = BulletEmitters.waveParticle();
        emitter2.numberAtOnce = 5;
        emitter2.period = 0.08;
        emitter2.duration = -1;
        emitter2.active = false;

        emitter2.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 6.5,
            () => {
                emitter2.active = true;
                emitter2.survivalTime = 0;
            }));
        enemy.addEmitter(emitter2);

        enemy.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 1,
            () => {
                enemy.speed = 0;
            }));
        enemy.eventList.addEvent(new EntityEvent(null,
            () => {
                if (enemy.scene)
                    enemy.scene.playerUI.boss = enemy;
            }));
        enemy.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 12.5,
            () => {
                emitter2.active = false;
                emitter.reset();
                emitter2.reset();
                enemy.reset();
            }));

        return enemy;
    }
}
