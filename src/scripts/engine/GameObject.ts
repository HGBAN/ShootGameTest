import {Vec2} from "@/scripts/engine/Vec2";
import {Scene} from "@/scripts/engine/Scene";

export abstract class GameObject {
    protected _pos: Vec2;
    scene: Scene | null = null;

    protected constructor(pos: Vec2 = Vec2.zero) {
        // this.scene = scene;
        this._pos = pos;
    }

    set pos(value: Vec2) {
        this._pos = value;
    }

    get pos(){
        return this._pos;
    }

    abstract update(): void;

    abstract draw(ctx: CanvasRenderingContext2D): void;

    fixedUpdate(time: number): void {

    }

    destroy(): void {
        if (this.scene) {
            this.scene.objects.delete(this);
        }
    }

    setScene(scene: Scene) {
        this.scene = scene;
    }
}
