// import {GameObject} from "@/scripts/engine/GameObject";
// import {Unary} from "@/scripts/data/Functions";
// import {Vec2} from "@/scripts/engine/Vec2";
//
// export class ControlObject extends GameObject {
//     xFunc: Unary | null = null;
//     yFunc: Unary | null = null;
//     speedFunc: Unary | null = null;
//     dirXFunc: Unary | null = null;
//     dirYFunc: Unary | null = null;
//
//     time = 0;
//     radius = 20;
//     speed = 0;
//     dir: Vec2 = new Vec2(1, 0);
//
//     constructor(pos: Vec2) {
//         super(pos);
//
//     }
//
//     draw(ctx: CanvasRenderingContext2D): void {
//     }
//
//     update(): void {
//
//     }
//
//     fixedUpdate(time: number): void {
//         if (this.xFunc)
//             this.pos.x = this.xFunc(this.time);
//         if (this.yFunc)
//             this.pos.y = this.yFunc(this.time);
//         if (this.speedFunc)
//             this.speed = this.speedFunc(this.time);
//         if (this.dirXFunc)
//             this.dir.x = this.dirXFunc(this.time);
//         if (this.dirYFunc)
//             this.dir.y = this.dirYFunc(this.time);
//
//         this.pos.add(this.dir.mul(this.speed * time));
//     }
// }
