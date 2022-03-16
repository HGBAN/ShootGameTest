import {Emitter} from "@/scripts/game/Emitter";
import {Vec2} from "@/scripts/engine/Vec2";
import {EntityEvent} from "@/scripts/game/EntityEventList";
import {PropChanger, PropMutation} from "@/scripts/engine/PropTransformer";
import {Bullet} from "@/scripts/game/Bullet";
import {Enemy} from "@/scripts/game/Enemy";
import {Enemies} from "@/scripts/function/Enemies";
import {Scene} from "@/scripts/engine/Scene";

export abstract class EnemyEmitters {
    static line(scene: Scene | null = null): Emitter {
        const emitter: Emitter = new Emitter(Vec2.zero, Enemies.sniper1);
        if (scene)
            emitter.setScene(scene);
        return emitter;
    }
}
