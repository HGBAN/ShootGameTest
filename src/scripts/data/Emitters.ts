import {Emitter, EntityGenerator} from "@/scripts/game/Emitter";
import {Enemies} from "@/scripts/data/Enemies";
import {Vec2} from "@/scripts/engine/Vec2";

export abstract class Emitters {
    static line1(entity: EntityGenerator = Enemies.sniper1): Emitter {
        const emitter: Emitter = new Emitter(Vec2.zero, entity);
        return emitter;
    }
}
