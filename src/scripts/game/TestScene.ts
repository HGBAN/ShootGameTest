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

export class TestScene extends Scene {
    time = 0;
    player: Player;

    // emitterLine1: Emitter;
    timer: Timer = new Timer(1);

    constructor() {
        super();

        this.player = new Player(new Vec2(360, 1000));
        // this.player.setScene(this);
        this.addObject(this.player);

        const boss1: Enemy = Enemies.boss1();
        boss1.pos = new Vec2(360, 400);
        boss1.speed = 0;
        this.addObject(boss1);

        const boss2: Enemy = Enemies.boss1();
        boss2.pos = new Vec2(360, 450);
        boss2.speed = 0;
        this.addObject(boss2);

        const boss3: Enemy = Enemies.boss1();
        boss3.pos = new Vec2(360, 500);
        boss3.speed = 0;
        this.addObject(boss3);

        const boss4: Enemy = Enemies.boss1();
        boss4.pos = new Vec2(360, 550);
        boss4.speed = 0;
        this.addObject(boss4);

        const boss5: Enemy = Enemies.boss1();
        boss5.pos = new Vec2(360, 600);
        boss5.speed = 0;
        this.addObject(boss5);
    }

    fixedUpdate(time: number) {
        super.fixedUpdate(time);
        this.time += time;
        // this.timer.update(time);
        // if(this.timer.isOver){
        //     this.timer.reset();
        //     console.log(this.objects.size);
        // }
    }
}
