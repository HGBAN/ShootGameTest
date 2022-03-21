import {Emitter, EntityGenerator} from "@/scripts/game/Emitter";
import {Enemies} from "@/scripts/data/Enemies";
import {Vec2} from "@/scripts/engine/Vec2";
import {Bullets} from "@/scripts/data/Bullets";
import {Entities} from "@/scripts/data/Entities";
import {EntityEvent, EntityEventList} from "@/scripts/game/EntityEventList";

export abstract class Emitters {
    static line1(entity: EntityGenerator = Enemies.sniper1): Emitter {
        const emitter: Emitter = new Emitter(Vec2.zero, entity);
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
}
