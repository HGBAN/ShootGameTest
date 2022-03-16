import {Emitter} from "@/scripts/game/Emitter";
import {Vec2} from "@/scripts/engine/Vec2";
import {Enemy} from "@/scripts/game/Enemy";
import {BulletEmitters} from "@/scripts/function/BulletEmitters";
import {Scene} from "@/scripts/engine/Scene";

export abstract class Enemies {
    static sniper1(scene: Scene | null = null): Enemy {
        const enemy: Enemy = new Enemy(Vec2.zero);
        enemy.maxLife = 50;
        enemy.speed = 100;
        if (scene)
            enemy.setScene(scene);
        const emitter = BulletEmitters.snipe();
        emitter.numberAtOnce = 1;
        emitter.period = 1;
        emitter.duration = -1;
        enemy.addEmitter(emitter);

        return enemy;
    }

    static sin1(scene: Scene | null = null): Enemy {
        const enemy: Enemy = new Enemy(Vec2.zero);
        enemy.maxLife = 80;
        enemy.speed = 100;
        if (scene)
            enemy.setScene(scene);
        const emitter = BulletEmitters.sin();
        emitter.numberAtOnce = 1;
        emitter.period = 1;
        emitter.duration = -1;
        enemy.addEmitter(emitter);

        return enemy;
    }
}
