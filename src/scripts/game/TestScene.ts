import {Scene} from "@/scripts/engine/Scene";
import {Bullet} from "@/scripts/game/Bullet";
import {Vec2} from "@/scripts/engine/Vec2";
import {Emitter} from "@/scripts/game/Emitter";
import {EntityEvent} from "@/scripts/game/EntityEventList";
import {PropChanger, PropMutation, PropTween} from "@/scripts/engine/PropTransformer";
import {BulletEmitters} from "@/scripts/data/BulletEmitters";
import {Player} from "@/scripts/game/Player";
import {Enemy} from "@/scripts/game/Enemy";
import {EnemyEmitters} from "@/scripts/data/EnemyEmitters";
import {GameObject} from "@/scripts/engine/GameObject";
import {Enemies} from "@/scripts/data/Enemies";
import {Random} from "@/scripts/engine/Random";

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
        emitterLine2.pos = new Vec2(720, 0);
        emitterLine2.angle = 155;
        emitterLine2.numberAtOnce = 0;
        emitterLine2.duration = -1;
        this.addObject(emitterLine2);

        const emitterSin1: Emitter = EnemyEmitters.sin1();
        emitterSin1.pos = new Vec2(720, 300);
        emitterSin1.angle = 180;
        emitterSin1.numberAtOnce = 0;
        emitterSin1.duration = -1;
        this.addObject(emitterSin1);

        const emitterSin2: Emitter = EnemyEmitters.sin1();
        emitterSin2.pos = new Vec2(0, 300);
        emitterSin2.angle = 0;
        emitterSin2.numberAtOnce = 0;
        emitterSin2.duration = -1;
        this.addObject(emitterSin2);

        const emitterCircle1: Emitter = EnemyEmitters.circle2();
        emitterCircle1.pos = new Vec2(360, 0);
        emitterCircle1.angle = 90;
        emitterCircle1.numberAtOnce = 0;
        emitterCircle1.duration = -1;
        this.addObject(emitterCircle1);

        const emitterLineRandom1: Emitter = EnemyEmitters.line1(18, 4, Enemies.lineRandom);
        emitterLineRandom1.pos = new Vec2(180, 0);
        emitterLineRandom1.angle = 90;
        emitterLineRandom1.numberAtOnce = 0;
        emitterLineRandom1.duration = -1;
        this.addObject(emitterLineRandom1);

        const emitterLineRandom2: Emitter = EnemyEmitters.line1(18, 4, Enemies.lineRandom);
        emitterLineRandom2.pos = new Vec2(540, 0);
        emitterLineRandom2.angle = 90;
        emitterLineRandom2.numberAtOnce = 0;
        emitterLineRandom2.duration = -1;
        this.addObject(emitterLineRandom2);

        this.player = new Player(new Vec2(360, 1000));
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
        // const emitter = BulletEmitters.lineRandom();
        // emitter.pos = new Vec2(800, 600);
        // emitter.numberAtOnce = 4;
        // emitter.period = 1;
        // emitter.duration = 5;
        // emitter.radius=20;
        // this.addObject(emitter);

        // const emitter = BulletEmitters.circle2();
        // emitter.pos = new Vec2(360, 640);
        // // emitter.scene = this;
        // // emitter.setScene(this);
        // emitter.radius = 0;
        // emitter.numberAtOnce = 16;
        // emitter.period = 0.1;
        // emitter.duration = 100;
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
