import {Entity} from "@/scripts/game/Entity";
import {Vec2} from "@/scripts/engine/Vec2";

export abstract class Entities {
    //给实体添加重力
    static drop(entity: Entity, gravityDir: Vec2 = new Vec2(0, 1), gravity: number = 500) {
        const extensionBefore = entity.updateExtension;
        entity.updateExtension = (time) => {
            extensionBefore?.(time);
            let velocity = entity.dir.mul(entity.speed);
            velocity = velocity.add(gravityDir.mul(gravity * time));
            const dis = velocity.dis;
            entity.dir = new Vec2(velocity.x / dis, velocity.y / dis);
            entity.speed = dis;
        }
    }

    //
}
