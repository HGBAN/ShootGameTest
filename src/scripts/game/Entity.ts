import {GameObject} from "@/scripts/engine/GameObject";
import {Unary} from "@/scripts/data/Functions";
import {Vec2} from "@/scripts/engine/Vec2";
import {EntityEventList} from "@/scripts/game/EntityEventList";
import {Timer} from "@/scripts/engine/Timer";
import {Scene, SSCD} from "@/scripts/engine/Scene";
import {Emitter} from "@/scripts/game/Emitter";
import {Enemy} from "@/scripts/game/Enemy";
import {Player} from "@/scripts/game/Player";


export class Entity extends GameObject {
    time = 0;
    // radius = 10;
    speed = 0;
    protected _dir: Vec2 = new Vec2(1, 0);
    duration = 9999;

    survivalTime = 0;
    eventList: EntityEventList;

    collision: any;

    protected emitters: Set<Emitter> = new Set<Emitter>();

    active = true;
    activeTime = 0;

    updateExtension?: (time:number) => void;

    constructor(pos: Vec2) {
        super(pos);
        this.eventList = new EntityEventList();
        // this.collision = new SSCD.Circle(new SSCD.Vector(pos.x, pos.y), this.radius);
        // this.collision.entity = this;
    }

    set pos(value: Vec2) {
        super.pos = value;
        // if (this.emitter)
        //     this.emitter.pos = this._pos;
        for (const emitter of this.emitters) {
            emitter.pos = this._pos.clone;
        }
        this.collision?.set_position(new SSCD.Vector(this._pos.x, this._pos.y));
    }

    get pos() {
        return this._pos;
    }

    set dir(value: Vec2) {
        this._dir = value;
        // if (this.emitter)
        //     this.emitter.dir = this._dir;
        // for (const emitter of this.emitters) {
        //     emitter.dir = this._dir.clone;
        // }
        if (this.display)
            this.display.angle = this.angle;
    }

    get dir() {
        return this._dir;
    }

    addEmitter(emitter: Emitter) {
        // this.emitter = emitter;
        if (this.scene)
            this.scene.addObject(emitter);
        emitter.pos = this._pos.clone;
        // emitter.dir = this._dir.clone;
        emitter.bindingEntity = this;
        this.emitters.add(emitter);
        // this.emitter.pos = this.pos;
        // this.emitter.dir = this.dir;
    }

    removeEmitter(emitter: Emitter) {
        this.emitters.delete(emitter);
    }

    getEmitters() {
        return this.emitters;
    }

    setScene(scene: Scene) {
        if (this.scene == scene)
            return;
        this.scene = scene;
        this.initGraphics();
        if (this.display)
            this.scene.addChild(this.display);
        // if (this.emitter) {
        //     this.scene.addObject(this.emitter);
        // }
        for (const emitter of this.emitters) {
            this.scene.addObject(emitter);
        }
        if (this.collision)
            this.scene.collisionWorld.add(this.collision);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        // this.collision.render(ctx, new SSCD.Vector(10, 10));
    }

    update(): void {

    }

    fixedUpdate(time: number): void {
        super.fixedUpdate(time);
        this.survivalTime += time;
        this.eventList.update(time);

        if (!this.active) {
            return;
        }
        this.activeTime += time;
        if (this.survivalTime >= this.duration && this.duration != -1) {
            this.destroy();
            return;
        }
        if (this.pos.x < -100 || this.pos.x > 820 || this.pos.y < -100 || this.pos.y > 1380) {
            this.destroy();
            return;
        }

        this.pos = this.pos.add(this.dir.mul(this.speed * time));

        this.updateExtension?.(time);
        // if (this.emitter) {
        //     // this.emitter.fixedUpdate(time);
        //     this.emitter.pos = this.pos;
        //     this.emitter.dir = this.dir;
        //
        // }
        // this.collision.set_position(new SSCD.Vector(this.pos.x, this.pos.y));

        // this.eventList.update(time);
    }

    // get angle(){
    //
    // }

    set angle(angle: number) {
        const rad = angle * Math.PI / 180;
        // this.dir.x = ;
        // this.dir.y = ;
        this.dir = new Vec2(Math.cos(rad), Math.sin(rad));
    }

    get angle(): number {
        return Math.atan2(this.dir.y, this.dir.x) * 180 / Math.PI;
    }

    destroy(): void {
        super.destroy();
        // this.emitter?.destroy();
        for (const emitter of this.emitters) {
            emitter.destroy();
        }
        if (this.scene) {
            if (this.collision)
                this.scene.collisionWorld.remove(this.collision);
        }
    }

    reset() {
        this.eventList.reset();
        this.survivalTime = this.activeTime = 0;
    }

    initGraphics(): void {
    }
}
