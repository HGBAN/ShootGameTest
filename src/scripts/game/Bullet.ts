import {GameObject} from "@/scripts/engine/GameObject";
import {Vec2} from "@/scripts/engine/Vec2";
import {Time} from "@/scripts/engine/Time";
import {liner, Unary} from "@/scripts/function/Functions";
import {IndexObject, PropChanger, PropTween} from "@/scripts/engine/PropTransformer";
import {Entity} from "@/scripts/game/Entity";
import {EntityEvent} from "@/scripts/game/EntityEventList";
import {Scene} from "@/scripts/engine/Scene";

export class Bullet extends Entity implements IndexObject {

    damage = 10;
    // radius = 20;
    // speed = 200;
    // direction = new Vec2(1, 0);
    // timeFunc: Unary;
    // xFunc: Unary;
    // yFunc: Unary;
    // direction: Unary;
    // dirSign = 1;
    // time = 0;
    // changer: PropChanger;

    // tween: PropTween;

    constructor(pos: Vec2) {
        super(pos);
        this.speed = 200;
        // this.eventList.addEvent(new EntityEvent(() => this.survivalTime > 3, new PropChanger(this, 'angle', 5, 360)));
        // this.changer = new PropChanger(this, 'angle', 5, 360);
        // this.tween = new PropTween(this.pos, 'x', 5, liner(0, 200));
        // this.timeFunc = (x) => {
        //     return x * 10;
        // };
        // this.xFunc = (x) => {
        //     return Math.cos(0.1 * x) * x + 800;
        // };
        // this.yFunc = (x) => {
        //     return Math.sin(0.1 * x) * x + 600;
        // };
        // this.direction = (x) => {
        //     return x;
        // };
    }

    setScene(scene: Scene) {
        super.setScene(scene);
        this.collision.set_collision_tags('bullet');
    }

    draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);
        ctx.beginPath();
        ctx.ellipse(this.pos.x, this.pos.y, this.radius, this.radius, 0, 0, 2 * Math.PI);
        // ctx.fillRect(this.pos.x, this.pos.y, this.radius, this.radius);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#DD2222";

        const grd = ctx.createRadialGradient(this.pos.x, this.pos.y, 0, this.pos.x, this.pos.y, this.radius);
        grd.addColorStop(0, "white");
        grd.addColorStop(1, "#e5e5d1");
        ctx.fillStyle = grd;

        ctx.stroke();
        ctx.fill();
        // ctx.fill();

    }

    update(): void {
        // this.pos = this.pos.add(this.direction.mul(this.speed * Time.deltaTime));
    }

    fixedUpdate(time: number) {
        super.fixedUpdate(time);
        if (this.pos.x < -100 || this.pos.x > 1700 || this.pos.y < -100 || this.pos.y > 1300)
            this.destroy();
        // this.changer.update(time);
        // this.tween.update(time);

        // this.time += time;
        // const k = this.direction(this.time);
        // let direction = new Vec2();
        // direction.x = Math.sqrt(1 / (k * k + 1));
        // direction.y = k * direction.x;
        // direction = direction.mul(this.dirSign);
        // this.pos = this.pos.add(direction.mul(this.speed(this.time) * time));

        // const t = this.timeFunc(this.time);
        // this.pos.x = this.xFunc(t);
        // this.pos.y = this.yFunc(t);
    }
}

export class PlayerBullet extends Bullet {
    speed = 1000;
    radius = 5;

    setScene(scene: Scene) {
        super.setScene(scene);
        this.collision.set_collision_tags('player_bullet');
    }

    draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);
        ctx.beginPath();
        ctx.ellipse(this.pos.x, this.pos.y, this.radius, this.radius, 0, 0, 2 * Math.PI);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#2279dd";

        const grd = ctx.createRadialGradient(this.pos.x, this.pos.y, 0, this.pos.x, this.pos.y, this.radius);
        grd.addColorStop(0, "white");
        grd.addColorStop(1, "#e5e5d1");
        ctx.fillStyle = grd;

        ctx.stroke();
        ctx.fill();

    }
}
