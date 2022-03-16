import {Emitter} from "@/scripts/game/Emitter";
import {Vec2} from "@/scripts/engine/Vec2";
import {EntityEvent} from "@/scripts/game/EntityEventList";
import {PropChanger, PropMutation} from "@/scripts/engine/PropTransformer";

export abstract class BulletEmitters {
    static line():Emitter{
        const emitter: Emitter = new Emitter(Vec2.zero);
        emitter.entityEvent = (entity) => {
            entity.eventList.addEvent(new EntityEvent(() => entity.survivalTime >= 0, new PropChanger(entity, 'angle', 1.5, 90)));
            entity.eventList.addEvent(new EntityEvent(() => entity.survivalTime >= 1.5, new PropMutation(entity, 'speed', 0)));
            entity.eventList.addEvent(new EntityEvent(() => entity.survivalTime >= 1.5, new PropMutation(entity, 'angle', entity.angle + 30)));
            entity.eventList.addEvent(new EntityEvent(() => emitter.survivalTime >= 3, new PropMutation(entity, 'speed', -100)));
        }
        return emitter;
    }
}
