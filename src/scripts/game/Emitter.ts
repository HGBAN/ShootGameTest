import {Entity} from "@/scripts/game/Entity";
import {Vec2} from "@/scripts/engine/Vec2";
import {Scene} from "@/scripts/engine/Scene";
import {Random} from "@/scripts/engine/Random";

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
    // randomMinAngle = 0;
    // randomMaxAngle = 0;
    random = false;
    // shootAtOnce = true;
    fixedAngle = 360;
    duration = 5;

    bindingEntity?: Entity;

    entityEvent: EntityEventGenerator | null;
    entity: EntityGenerator;
    entityDecorator?: (entity: Entity) => void;

    constructor(pos: Vec2, entity: EntityGenerator, bulletEvent: EntityEventGenerator | null = null) {
        super(pos);
        this.entityEvent = bulletEvent;
        this.entity = entity;
    }

    setScene(scene: Scene) {
        super.setScene(scene);
        // this.collision.set_collision_tags('emitter');
    }

    shoot() {
        if (!this.scene)
            return;
        if(!this.active)
            return;
        // console.log(1);
        const addAngle = this.fixedAngle / this.numberAtOnce;
        let currentAngle = this.angle;
        if (this.numberAtOnce % 2 == 0)
            currentAngle += addAngle / 2;

        for (let i = 0; i < this.numberAtOnce; i++) {
            const entity: Entity = this.entity();
            if (!this.random) {
                const rad = currentAngle * Math.PI / 180;
                entity.dir = new Vec2(Math.cos(rad), Math.sin(rad));
            } else {
                entity.angle = this.angle + Random.range(-this.fixedAngle / 2, this.fixedAngle / 2);
            }
            entity.pos = this.pos.add(entity.dir.mul(this.radius));
            this.entityDecorator?.(entity);
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
        super.fixedUpdate(time);
        if (!this.active) {
            return;
        }

        if (this.period == -1)
            return;
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

    reset() {
        super.reset();
        this.currentPeriod = 0;
    }
}
