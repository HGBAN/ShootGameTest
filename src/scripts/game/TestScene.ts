import {Scene} from "@/scripts/engine/Scene";
import {Bullet} from "@/scripts/game/Bullet";
import {Vec2} from "@/scripts/engine/Vec2";
import {Emitter} from "@/scripts/game/Emitter";
import {EntityEvent} from "@/scripts/game/EntityEventList";
import {PropChanger, PropMutation, PropTween} from "@/scripts/engine/PropTransformer";
import {BulletEmitters} from "@/scripts/function/BulletEmitters";
import {Player} from "@/scripts/game/Player";
import {Enemy} from "@/scripts/game/Enemy";
import {EnemyEmitters} from "@/scripts/function/EnemyEmitters";
import {GameObject} from "@/scripts/engine/GameObject";
import {Enemies} from "@/scripts/function/Enemies";

export class TestScene extends Scene {
    time = 0;
    player: Player;

    // emitterLine1: Emitter;

    constructor() {
        super();
        const emitterLine1: Emitter = EnemyEmitters.line1();
        emitterLine1.pos = new Vec2(0, 0);
        emitterLine1.angle = 25;
        emitterLine1.numberAtOnce = 0;
        emitterLine1.duration = -1;
        this.addObject(emitterLine1);

        const emitterLine2: Emitter = EnemyEmitters.line1();
        emitterLine2.pos = new Vec2(1600, 0);
        emitterLine2.angle = 155;
        emitterLine2.numberAtOnce = 0;
        emitterLine2.duration = -1;
        this.addObject(emitterLine2);

        this.player = new Player(new Vec2(800, 1000));
        // this.player.setScene(this);
        this.addObject(this.player);

        // const enemy = Enemies.sniper1(this);
        // enemy.pos = new Vec2(800, 600);
        // enemy.speed = 0;
        // this.addObject(enemy);

        // this.addObject(new Enemy(new Vec2(600, 200)));
        // const emitter: Emitter = new Emitter(new Vec2(800, 600));
        // emitter.scene = this;
        // emitter.numberAtOnce = 4;
        // emitter.period = 0.08;
        // emitter.duration = 5;
        // emitter.eventList.addEvent(new EntityEvent(() => true, new PropChanger(emitter, 'angle', 1, 90)));
        // emitter.eventList.addEvent(new EntityEvent(() => emitter.survivalTime >= 1, new PropMutation(emitter, 'numberAtOnce', 0)));
        // emitter.bulletEvent = (bullet) => {
        //     bullet.eventList.addEvent(new EntityEvent(() => bullet.survivalTime >= 0, new PropChanger(bullet, 'angle', 1.5, 90)));
        //     bullet.eventList.addEvent(new EntityEvent(() => bullet.survivalTime >= 1.5, new PropMutation(bullet, 'speed', 0)));
        //     bullet.eventList.addEvent(new EntityEvent(() => bullet.survivalTime >= 1.5, new PropMutation(bullet, 'angle', bullet.angle +30)));
        //     bullet.eventList.addEvent(new EntityEvent(() => emitter.survivalTime >= 3, new PropMutation(bullet, 'speed', -100)));
        // }
        // const emitter = BulletEmitters.circle1();
        // emitter.pos = new Vec2(800, 600);
        // emitter.scene = this;
        // emitter.numberAtOnce = 4;
        // emitter.period = 0.08;
        // emitter.duration = 5;
        // emitter.radius=10;
        // this.addObject(emitter);

        const emitter = BulletEmitters.waveParticle();
        emitter.pos = new Vec2(800, 600);
        // emitter.scene = this;
        // emitter.setScene(this);
        emitter.radius = 0;
        emitter.numberAtOnce = 4;
        emitter.period = 0.08;
        emitter.duration = 100;
        // this.addObject(emitter);

        // const emitter = BulletEmitters.sin(true);
        // emitter.pos = new Vec2(800, 600);
        // emitter.setScene(this);
        // emitter.radius = 0;
        // emitter.numberAtOnce = 5;
        // emitter.period = 0.1;
        // emitter.duration = 5;
        // this.addObject(emitter);
        // const emitter2 = BulletEmitters.sin();
        // emitter2.pos = new Vec2(800, 600);
        // emitter2.setScene(this);
        // emitter2.radius = 0;
        // emitter2.numberAtOnce = 5;
        // emitter2.period = 0.1;
        // emitter2.duration = 5;
        // this.addObject(emitter2);
    }

    fixedUpdate(time: number) {
        super.fixedUpdate(time);
        this.time += time;
    }
}
