import {Entity} from "@/scripts/game/Entity";
import {Bullet} from "@/scripts/game/Bullet";
import {Vec2} from "@/scripts/engine/Vec2";
import {EntityEventList} from "@/scripts/game/EntityEventList";
import {Scene} from "@/scripts/engine/Scene";

export interface EntityEventGenerator {
    (entity: Entity): void;
}

export interface EntityGenerator {
    (): Entity;
}

export class Emitter extends Entity {
    numberAtOnce = 4;
    period = 1;
    private currentPeriod = 0;
    radius = 0;
    randomMinAngle = 0;
    randomMaxAngle = 0;
    fixedAngle = 360;
    duration = 5;

    bindingEntity?: Entity;

    entityEvent: EntityEventGenerator | null;
    entity: EntityGenerator;

    active = true;

    constructor(pos: Vec2, entity: EntityGenerator, bulletEvent: EntityEventGenerator | null = null) {
        super(pos);
        this.entityEvent = bulletEvent;
        this.entity = entity;
    }

    setScene(scene: Scene) {
        super.setScene(scene);
        this.collision.set_collision_tags('emitter');
    }

    shoot() {
        if (!this.scene)
            return;
        const addAngle = this.fixedAngle / this.numberAtOnce;
        let currentAngle = this.angle;
        if (this.numberAtOnce % 2 == 0)
            currentAngle += addAngle / 2;

        for (let i = 0; i < this.numberAtOnce; i++) {
            const rad = currentAngle * Math.PI / 180;
            const dir: Vec2 = new Vec2(Math.cos(rad), Math.sin(rad));
            const entity: Entity = this.entity();
            entity.dir = dir;
            entity.pos = this.pos.add(dir.mul(this.radius));

            // console.log(entity.pos,entity.collision.__position);
            // entity.setScene(this.scene);
            // bullet.speed = 200;
            // this.entity?.(entity);
            this.entityEvent?.(entity);
            this.scene.addObject(entity);

            currentAngle += addAngle;
        }
    }

    fixedUpdate(time: number) {
        if (!this.active) {
            this.eventList.update(time);
            return;
        }
        super.fixedUpdate(time);
        if (this.duration != -1 && this.survivalTime >= this.duration) return;
        if (this.currentPeriod < this.survivalTime / this.period) {
            this.currentPeriod++;
            this.shoot();
        }
    }

    destroy() {
        super.destroy();
        this.bindingEntity?.removeEmitter(this);
    }
}
