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
import {Timer} from "@/scripts/engine/Timer";
import {GameScene} from "@/scripts/game/GameScene";
import {GameMain} from "@/scripts/engine/GameMain";
import {Bullets} from "@/scripts/data/Bullets";

export class TestScene extends GameScene {
    // emitterLine1: Emitter;
    timer: Timer = new Timer(1);

    constructor(gameMain: GameMain) {
        super(gameMain);


        // const bullet: Bullet = Bullets.drop();
        // bullet.pos = new Vec2(360, 400);
        // this.addObject(bullet);

        // const emitter: Emitter = new Emitter(Vec2.zero, Bullets.rotate.bind(undefined, this));
        // emitter.period = 10;
        // emitter.duration = -1;
        // emitter.numberAtOnce = 8;
        // emitter.pos = new Vec2(360, 400);
        // this.addObject(emitter);

        const boss1: Enemy = Enemies.boss1(this);
        boss1.pos = new Vec2(360, 0);
        boss1.dir = new Vec2(0, 1);
        // boss1.speed = 0;
        this.addObject(boss1);
        //
        // const boss2: Enemy = Enemies.boss1();
        // boss2.pos = new Vec2(360, 450);
        // boss2.speed = 0;
        // this.addObject(boss2);
        //
        // const boss3: Enemy = Enemies.boss1();
        // boss3.pos = new Vec2(360, 500);
        // boss3.speed = 0;
        // this.addObject(boss3);
        //
        // const boss4: Enemy = Enemies.boss1();
        // boss4.pos = new Vec2(360, 550);
        // boss4.speed = 0;
        // this.addObject(boss4);
        //
        // const boss5: Enemy = Enemies.boss1();
        // boss5.pos = new Vec2(360, 600);
        // boss5.speed = 0;
        // this.addObject(boss5);
    }

    fixedUpdate(time: number) {
        super.fixedUpdate(time);
        // this.timer.update(time);
        // if(this.timer.isOver){
        //     this.timer.reset();
        //     console.log(this.objects.size);
        // }
    }
}
