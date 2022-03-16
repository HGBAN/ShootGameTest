import {GameObject} from "@/scripts/engine/GameObject";
import {Unary} from "@/scripts/function/Functions";
import {Vec2} from "@/scripts/engine/Vec2";
import {EntityEventList} from "@/scripts/game/EntityEventList";
import {Timer} from "@/scripts/engine/Timer";
import {Scene, SSCD} from "@/scripts/engine/Scene";
import {Emitter} from "@/scripts/game/Emitter";
import {Enemy} from "@/scripts/game/Enemy";


export class Entity extends GameObject {
    time = 0;
    radius = 10;
    speed = 0;
    protected _dir: Vec2 = new Vec2(1, 0);
    duration = 9999;

    survivalTime = 0;
    eventList: EntityEventList;

    collision: any;

    protected emitter: Emitter | null = null;

    constructor(pos: Vec2) {
        super(pos);
        this.eventList = new EntityEventList();
        this.collision = new SSCD.Circle(new SSCD.Vector(pos.x, pos.y), this.radius);
        this.collision.entity = this;
    }

    set pos(value: Vec2) {
        this._pos = value;
        if (this.emitter)
            this.emitter.pos = this._pos;
        this.collision.set_position(new SSCD.Vector(this._pos.x, this._pos.y));
    }

    get pos() {
        return this._pos;
    }

    set dir(value: Vec2) {
        this._dir = value;
        if (this.emitter)
            this.emitter.dir = this._dir;
    }

    get dir() {
        return this._dir;
    }

    setEmitter(emitter: Emitter) {
        this.emitter = emitter;
        if (this.scene)
            this.scene.addObject(this.emitter);
        this.emitter.pos = this.pos;
        this.emitter.dir = this.dir;
    }

    getEmitter() {
        return this.emitter;
    }

    setScene(scene: Scene) {
        if (this.scene == scene)
            return;
        this.scene = scene;
        if (this.emitter) {
            this.scene.addObject(this.emitter);
        }
        this.scene.collisionWorld.add(this.collision);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        // this.collision.render(ctx, new SSCD.Vector(10, 10));
    }

    update(): void {

    }

    fixedUpdate(time: number): void {
        this.survivalTime += time;
        if (this.survivalTime >= this.duration && this.duration != -1) {
            this.destroy();
            return;
        }
        if (this.pos.x < -100 || this.pos.x > 1700 || this.pos.y < -100 || this.pos.y > 1300) {
            this.destroy();
            return;
        }

        this.pos = this.pos.add(this.dir.mul(this.speed * time));
        // if (this.emitter) {
        //     // this.emitter.fixedUpdate(time);
        //     this.emitter.pos = this.pos;
        //     this.emitter.dir = this.dir;
        //
        // }
        // this.collision.set_position(new SSCD.Vector(this.pos.x, this.pos.y));

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
        this.emitter?.destroy();
        if (this.scene) {
            this.scene.collisionWorld.remove(this.collision);
        }
    }
}
