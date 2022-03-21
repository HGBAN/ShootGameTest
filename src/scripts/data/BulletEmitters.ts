import {Emitter} from "@/scripts/game/Emitter";
import {EntityEvent, EntityEventList} from "@/scripts/game/EntityEventList";
import {PropChanger, PropMutation, PropTween} from "@/scripts/engine/PropTransformer";
import {Vec2} from "@/scripts/engine/Vec2";
import {Bullet} from "@/scripts/game/Bullet";
import {Player} from "@/scripts/game/Player";
import {Random} from "@/scripts/engine/Random";
import {bulletPool} from "@/scripts/game/ObjectPool";
import {Emitters} from "@/scripts/data/Emitters";
import {Bullets} from "@/scripts/data/Bullets";
import {Entities} from "@/scripts/data/Entities";

export abstract class BulletEmitters {
    static bulletGenerator() {
        return bulletPool.get();
    }

    static snipe(): Emitter {
        const emitter: Emitter = new Emitter(Vec2.zero, () => {
            const bullet: Bullet = bulletPool.get();
            bullet.speed = 400;
            bullet.texture = 'bullet_1'
            return bullet;
        });

        emitter.entityEvent = (entity) => {
            entity.eventList.addEvent(new EntityEvent(null, () => {
                entity.dir = Player.toPlayerDir(entity.pos);
            }));
        }

        return emitter;
    }

    static circle1(): Emitter {
        const emitter: Emitter = new Emitter(Vec2.zero, () => {
            const bullet: Bullet = bulletPool.get();
            bullet.speed = 300;
            bullet.texture = 'bullet_1';
            return bullet;
        });
        emitter.eventList.addEvent(new EntityEvent(null, new PropChanger(emitter, 'angle', 1.5, 270)));
        // emitter.eventList.addEvent(new EntityEvent(() => emitter.survivalTime >= 1, new PropMutation(emitter, 'numberAtOnce', 0)));

        emitter.entityEvent = (entity) => {
            entity.eventList.addEvent(new EntityEvent(() => entity.survivalTime >= 0, new PropChanger(entity, 'angle', 0.5, 90)));
            entity.eventList.addEvent(new EntityEvent(() => entity.survivalTime >= 0.5, new PropMutation(entity, 'speed', 0)));
            // entity.eventList.addEvent(new EntityEvent(() => entity.survivalTime >= 0.5, new PropMutation(entity, 'angle', entity.angle + 30)));

            entity.eventList.addEvent(new EntityEvent(() => entity.survivalTime >= 0.5, () => {
                entity.eventList.addEvent(new EntityEvent(() => emitter.dead, new PropMutation(entity, 'speed', 300)));
            }));
            entity.eventList.addEvent(new EntityEvent(() => emitter.survivalTime >= 3, new PropMutation(entity, 'speed', 300)));
            // entity.eventList.addEvent(new EntityEvent(() => emitter.survivalTime >= 3, () => {
            //     entity.angle += 210;
            // }));
            entity.eventList.addEvent(new EntityEvent(() => emitter.survivalTime >= 3,
                new PropChanger(entity, 'angle', 0.5, 210)));
        }
        return emitter;
    }

    static circle2(time: number = 5, angle: number = 720): Emitter {
        const emitter: Emitter = new Emitter(Vec2.zero, this.bulletGenerator);
        emitter.eventList.addEvent(new EntityEvent(() => true, new PropChanger(emitter, 'angle', time, angle)));
        return emitter;
    }

    static waveParticle(): Emitter {
        const emitter: Emitter = new Emitter(Vec2.zero, this.bulletGenerator);
        emitter.eventList.addEvent(new EntityEvent(null, new PropChanger(emitter, 'angle', 100, 720000, (x) => x * x + 1000)));
        // emitter.eventList.addEvent(new EntityEvent(null, new PropChanger(emitter, 'angle', 5, 10000, (x) => x)));
        return emitter;
    }

    static sin(reverse: boolean = false): Emitter {
        const emitter: Emitter = new Emitter(Vec2.zero, this.bulletGenerator);

        emitter.entityEvent = (entity) => {
            const eventList: EntityEventList = new EntityEventList(null, -1);//(Math.sin((2*x-1)*Math.PI/2)+1)/2
            if (!reverse) {
                eventList.addEvent(new EntityEvent(null, new PropMutation(entity, 'angle', entity.angle + 45)));
                eventList.addEvent(new EntityEvent(null, new PropChanger(entity, 'angle', 1, -90, (x) => (Math.sin((2 * x - 1) * Math.PI / 2) + 1) / 2)));
                eventList.addEvent(new EntityEvent(() => eventList.currentPeriodTime >= 1, new PropChanger(entity, 'angle', 1, 90, (x) => (Math.sin((2 * x - 1) * Math.PI / 2) + 1) / 2)));
                // eventList.addEvent(new EntityEvent(null,new PropTween(bullet.pos,'x',)))
            } else {
                eventList.addEvent(new EntityEvent(null, new PropMutation(entity, 'angle', entity.angle - 45)));
                eventList.addEvent(new EntityEvent(null, new PropChanger(entity, 'angle', 1, 90, (x) => (Math.sin((2 * x - 1) * Math.PI / 2) + 1) / 2)));
                eventList.addEvent(new EntityEvent(() => eventList.currentPeriodTime >= 1, new PropChanger(entity, 'angle', 1, -90, (x) => (Math.sin((2 * x - 1) * Math.PI / 2) + 1) / 2)));
            }
            entity.eventList.addEvent(eventList);
        };
        // emitter.eventList.addEvent(new EntityEvent(() => true, new PropChanger(emitter, 'angle', 100, 360000, (x) => Math.sin(x))));

        return emitter;
    }

    static random1(): Emitter {
        const emitter: Emitter = new Emitter(Vec2.zero, () => {
            const bullet: Bullet = bulletPool.get();
            bullet.texture = 'bullet_1';
            return bullet;
        });

        emitter.entityEvent = (entity) => {
            entity.eventList.addEvent(new EntityEvent(() => entity.survivalTime >= 0, () => entity.speed = 0));
            entity.eventList.addEvent(new EntityEvent(() => entity.survivalTime >= 1.5, new PropChanger(entity, 'speed', 1, 200)));
            entity.eventList.addEvent(new EntityEvent(() => entity.survivalTime >= 0, () => entity.angle = Random.range(0, 360)));
        }
        // emitter.eventList.addEvent(new EntityEvent(() => true, new PropChanger(emitter, 'angle', 100, 360000, (x) => Math.sin(x))));

        return emitter;
    }

    static lineRandom(): Emitter {
        const emitter: Emitter = new Emitter(Vec2.zero, () => {
            const bullet: Bullet = bulletPool.get();
            const emitter: Emitter = this.random1();
            // emitter.radius = 10;
            emitter.numberAtOnce = 1;
            emitter.active = false;
            emitter.eventList.addEvent(new EntityEvent(() => bullet.survivalTime >= 0.5, () => emitter.active = true));
            bullet.addEmitter(emitter);
            return bullet;
        });

        // emitter.eventList.addEvent(new EntityEvent(() => true, new PropChanger(emitter, 'angle', 100, 360000, (x) => Math.sin(x))));

        return emitter;
    }

    static fire(): Emitter {
        const emitter: Emitter = new Emitter(Vec2.zero, () => {
            const bullet: Bullet = bulletPool.get();
            const emitter: Emitter = Emitters.fire(Emitters.line1());
            // emitter.radius = 10;
            bullet.texture = 'bullet_2';
            bullet.radius = 20;
            emitter.angle = -90;
            bullet.addEmitter(emitter);
            return bullet;
        });

        return emitter;
    }

    static randomCircle(): Emitter {
        const emitter: Emitter = new Emitter(Vec2.zero, Bullets.default);
        emitter.duration = -1;
        emitter.period = 0.1;
        emitter.numberAtOnce = 4;
        emitter.random = true;
        return emitter;
    }

    static shot(): Emitter {
        const emitter: Emitter = new Emitter(Vec2.zero, Bullets.default);
        emitter.duration = -1;
        emitter.period = 1;
        emitter.numberAtOnce = 8;
        emitter.fixedAngle = 60;
        emitter.random = true;
        emitter.entityDecorator = (entity) => {
            entity.speed = Random.range(700, 900);
            Entities.drop(entity, new Vec2(0, -1));
        }

        return emitter;
    }
}
