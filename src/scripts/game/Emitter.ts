import {Entity} from "@/scripts/game/Entity";
import {Bullet} from "@/scripts/game/Bullet";
import {Vec2} from "@/scripts/engine/Vec2";
import {EntityEventList} from "@/scripts/game/EntityEventList";
import {Scene} from "@/scripts/engine/Scene";

export interface BulletEventGenerator {
    (bullet: Bullet): void;
}

export class Emitter extends Entity {
    numberAtOnce = 4;
    period = 1;
    private currentPeriod = 0;
    radius = 100;
    randomMinAngle = 0;
    randomMaxAngle = 0;
    fixedAngle = 360;
    duration = 5;

    bulletEvent: BulletEventGenerator | null;
    bullet: BulletEventGenerator | null;

    constructor(pos: Vec2, bulletEvent: BulletEventGenerator | null = null, bullet: BulletEventGenerator | null = null) {
        super(pos);
        this.bulletEvent = bulletEvent;
        this.bullet = bullet;
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
            const bullet: Bullet = new Bullet(this.pos.add(dir.mul(this.radius)));
            bullet.dir = dir;
            // bullet.setScene(this.scene);
            // bullet.speed = 200;
            this.bullet?.(bullet);
            this.bulletEvent?.(bullet);
            this.scene.addObject(bullet);

            currentAngle += addAngle;
        }
    }

    fixedUpdate(time: number) {
        super.fixedUpdate(time);
        if (this.survivalTime >= this.duration) return;
        if (this.currentPeriod < this.survivalTime / this.period) {
            this.currentPeriod++;
            this.shoot();
        }
    }
}
