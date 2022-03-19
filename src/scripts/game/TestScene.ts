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

        this.player = new Player(new Vec2(360, 1000));
        // this.player.setScene(this);
        this.addObject(this.player);

        // const boss1: Enemy = Enemies.boss1();
        // boss1.pos = new Vec2(360, 400);
        // boss1.speed = 0;
        // this.addObject(boss1);
    }

    fixedUpdate(time: number) {
        super.fixedUpdate(time);
        this.time += time;
    }
}
