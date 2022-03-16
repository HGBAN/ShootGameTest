import {Emitter} from "@/scripts/game/Emitter";
import {EntityEvent, EntityEventList} from "@/scripts/game/EntityEventList";
import {PropChanger, PropMutation, PropTween} from "@/scripts/engine/PropTransformer";
import {Vec2} from "@/scripts/engine/Vec2";

export abstract class Emitters {
    static circle1(): Emitter {
        const emitter: Emitter = new Emitter(Vec2.zero);
        emitter.eventList.addEvent(new EntityEvent(() => true, new PropChanger(emitter, 'angle', 1, 90)));
        emitter.eventList.addEvent(new EntityEvent(() => emitter.survivalTime >= 1, new PropMutation(emitter, 'numberAtOnce', 0)));
        emitter.bulletEvent = (bullet) => {
            bullet.eventList.addEvent(new EntityEvent(() => bullet.survivalTime >= 0, new PropChanger(bullet, 'angle', 1.5, 90)));
            bullet.eventList.addEvent(new EntityEvent(() => bullet.survivalTime >= 1.5, new PropMutation(bullet, 'speed', 0)));
            bullet.eventList.addEvent(new EntityEvent(() => bullet.survivalTime >= 1.5, new PropMutation(bullet, 'angle', bullet.angle + 30)));
            bullet.eventList.addEvent(new EntityEvent(() => emitter.survivalTime >= 3, new PropMutation(bullet, 'speed', -100)));
        }
        return emitter;
    }

    static waveParticle(): Emitter {
        const emitter: Emitter = new Emitter(Vec2.zero);
        emitter.eventList.addEvent(new EntityEvent(() => true, new PropChanger(emitter, 'angle', 100, 360000, (x) => x * x)));

        return emitter;
    }

    static sin(reverse:boolean=false): Emitter {
        const emitter: Emitter = new Emitter(Vec2.zero);

        emitter.bulletEvent = (bullet) => {
            const eventList: EntityEventList = new EntityEventList(null, -1);//(Math.sin((2*x-1)*Math.PI/2)+1)/2
            if(!reverse) {
                eventList.addEvent(new EntityEvent(null, new PropMutation(bullet, 'angle', bullet.angle + 45)));
                eventList.addEvent(new EntityEvent(null, new PropChanger(bullet, 'angle', 1, -90, (x) => (Math.sin((2 * x - 1) * Math.PI / 2) + 1) / 2)));
                eventList.addEvent(new EntityEvent(() => eventList.currentPeriodTime >= 1, new PropChanger(bullet, 'angle', 1, 90, (x) => (Math.sin((2 * x - 1) * Math.PI / 2) + 1) / 2)));
                // eventList.addEvent(new EntityEvent(null,new PropTween(bullet.pos,'x',)))
            }else{
                eventList.addEvent(new EntityEvent(null, new PropMutation(bullet, 'angle', bullet.angle - 45)));
                eventList.addEvent(new EntityEvent(null, new PropChanger(bullet, 'angle', 1, 90, (x) => (Math.sin((2 * x - 1) * Math.PI / 2) + 1) / 2)));
                eventList.addEvent(new EntityEvent(() => eventList.currentPeriodTime >= 1, new PropChanger(bullet, 'angle', 1, -90, (x) => (Math.sin((2 * x - 1) * Math.PI / 2) + 1) / 2)));
            }
            bullet.eventList.addEvent(eventList);
        };
        // emitter.eventList.addEvent(new EntityEvent(() => true, new PropChanger(emitter, 'angle', 100, 360000, (x) => Math.sin(x))));

        return emitter;
    }
}
