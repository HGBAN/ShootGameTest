import {Emitter} from "@/scripts/game/Emitter";
import {Vec2} from "@/scripts/engine/Vec2";
import {Enemy} from "@/scripts/game/Enemy";
import {BulletEmitters} from "@/scripts/data/BulletEmitters";
import {Scene} from "@/scripts/engine/Scene";
import {EntityEvent} from "@/scripts/game/EntityEventList";
import {PropMutation} from "@/scripts/engine/PropTransformer";
import {Player} from "@/scripts/game/Player";

export abstract class Enemies {
    static sniper1(): Enemy {
        const enemy: Enemy = new Enemy(Vec2.zero);
        enemy.maxLife = 50;
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
        enemy.maxLife = 120;
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
        enemy.maxLife = 200;
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
        enemy.maxLife = 50;
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
}
