import {GameObject} from "@/scripts/engine/GameObject";
import {Unary} from "@/scripts/function/Functions";
import {Vec2} from "@/scripts/engine/Vec2";
import {EntityEventList} from "@/scripts/game/EntityEventList";
import {Timer} from "@/scripts/engine/Timer";
import {Scene, SSCD} from "@/scripts/engine/Scene";


export class Entity extends GameObject {
    time = 0;
    radius = 10;
    speed = 0;
    dir: Vec2 = new Vec2(1, 0);
    duration = 9999;

    survivalTime = 0;
    eventList: EntityEventList;

    collision: any;

    constructor(pos: Vec2) {
        super(pos);
        this.eventList = new EntityEventList();
        this.collision = new SSCD.Circle(new SSCD.Vector(0, 0), this.radius);
        this.collision.entity = this;
    }

    setScene(scene: Scene) {
        this.scene = scene;
        this.scene.collisionWorld.add(this.collision);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        // this.collision.render(ctx, new SSCD.Vector(10, 10));
    }

    update(): void {

    }

    fixedUpdate(time: number): void {
        this.survivalTime += time;
        if (this.survivalTime >= this.duration) {
            this.destroy();
            return;
        }
        this.pos = this.pos.add(this.dir.mul(this.speed * time));
        this.collision.set_position(new SSCD.Vector(this.pos.x, this.pos.y));

        this.eventList.update(time);
    }

    // get angle(){
    //
    // }

    set angle(angle: number) {
        const rad = angle * Math.PI / 180;
        this.dir.x = Math.cos(rad);
        this.dir.y = Math.sin(rad);
    }

    get angle(): number {
        return Math.atan2(this.dir.y, this.dir.x) * 180 / Math.PI;
    }

    destroy(): void {
        super.destroy();
        if (this.scene) {
            this.scene.collisionWorld.remove(this.collision);
        }
    }
}
