import {Emitter, EntityGenerator} from "@/scripts/game/Emitter";
import {Vec2} from "@/scripts/engine/Vec2";
import {EntityEvent} from "@/scripts/game/EntityEventList";
import {PropChanger, PropMutation} from "@/scripts/engine/PropTransformer";
import {Bullet} from "@/scripts/game/Bullet";
import {Enemy} from "@/scripts/game/Enemy";
import {Enemies} from "@/scripts/function/Enemies";
import {Scene} from "@/scripts/engine/Scene";

export abstract class EnemyEmitters {
    static line1(delay: number = 2, duration: number = 5, enemy: EntityGenerator = Enemies.sniper1): Emitter {
        const emitter: Emitter = new Emitter(Vec2.zero, enemy);
        emitter.eventList.addEvent(new EntityEvent(() => emitter.survivalTime >= delay,
            new PropMutation(emitter, 'numberAtOnce', 1)));
        emitter.eventList.addEvent(new EntityEvent(() => emitter.survivalTime >= delay + duration,
            new PropMutation(emitter, 'numberAtOnce', 0)));
        return emitter;
    }

    static sin1(): Emitter {
        const emitter: Emitter = new Emitter(Vec2.zero, Enemies.sin1);
        emitter.eventList.addEvent(new EntityEvent(() => emitter.survivalTime >= 10,
            new PropMutation(emitter, 'numberAtOnce', 1)));
        emitter.eventList.addEvent(new EntityEvent(() => emitter.survivalTime >= 11,
            new PropMutation(emitter, 'numberAtOnce', 0)));
        return emitter;
    }

    static circle2(): Emitter {
        const emitter: Emitter = new Emitter(Vec2.zero, Enemies.circle2);
        emitter.eventList.addEvent(new EntityEvent(() => emitter.survivalTime >= 14,
            new PropMutation(emitter, 'numberAtOnce', 1)));
        emitter.eventList.addEvent(new EntityEvent(() => emitter.survivalTime >= 15,
            new PropMutation(emitter, 'numberAtOnce', 0)));
        return emitter;
    }
}
