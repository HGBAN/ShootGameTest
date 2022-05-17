// export class Weapons{
//
//     static primary() {
//
//     }
// }

import {Weapon} from "@/scripts/game/weapon/Weapon";
import {Player} from "@/scripts/game/Player";
import {Emitter} from "@/scripts/game/Emitter";
import {Emitters} from "@/scripts/data/Emitters";
import {PlayerBullet} from "@/scripts/game/Bullet";
import {Vec2} from "@/scripts/engine/Vec2";
import {Entity} from "@/scripts/game/Entity";

//玩家武器数据
export namespace Weapons {
    //主武器，向前发射子弹
    export class Primary extends Weapon {
        static playerPrimaryArgs = {
            // //子弹数量
            // num: [2, 2, 3, 3, 3, 5, 5, 5, 7, 7] as number[],
            //射击间隔时间
            period: [0.2, 0.19, 0.18, 0.17, 0.16, 0.15, 0.13, 0.11, 0.1, 0.08] as number[],
            //伤害
            damage: [10, 15, 15, 18, 20, 20, 23, 25, 25, 27] as number[],
        };

        constructor(player: Player, level: number, slot: number) {
            super(player, level, slot);
            // emitter: Emitter=Emitters.
            // const emitters = PlayerEmitters.playerPrimary(level);
            // const num = this.playerPrimaryArgs.num[level];
            const period = Primary.playerPrimaryArgs.period[level - 1];
            const damage = Primary.playerPrimaryArgs.damage[level - 1];

            const emitters: Emitter[] = [];

            const bulletGenerator = () => {
                const bullet: PlayerBullet = new PlayerBullet(Vec2.zero);
                bullet.damage = damage;
                return bullet;
            }

            const emitter1: Emitter = new Emitter(Vec2.zero, bulletGenerator);
            emitter1.numberAtOnce = 1;
            emitter1.entityDecorator = (entity: Entity) => {
                entity.pos = entity.pos.add(new Vec2(-10));
            }

            const emitter2: Emitter = new Emitter(Vec2.zero, bulletGenerator);
            emitter2.numberAtOnce = 1;
            emitter2.entityDecorator = (entity: Entity) => {
                entity.pos = entity.pos.add(new Vec2(10));
            }

            emitters.push(emitter1, emitter2);

            if (level > 2) {
                const emitter: Emitter = new Emitter(Vec2.zero, bulletGenerator);
                emitter.numberAtOnce = 1;
                emitter.entityDecorator = (entity: Entity) => {
                    entity.pos = entity.pos.add(new Vec2(0, -5));
                }
                emitters.push(emitter);
            }

            if (level > 5) {
                const emitter: Emitter = new Emitter(Vec2.zero, bulletGenerator);
                if (level > 8)
                    emitter.numberAtOnce = 4;
                else
                    emitter.numberAtOnce = 2;
                emitter.fixedAngle = 45;
                emitters.push(emitter);
            }

            for (const emitter of emitters) {
                emitter.duration = -1;
                emitter.period = period;
                emitter.dir = new Vec2(0, -1);
            }

            for (const emitter of emitters) {
                this.emitters.add(emitter);
                this.player.addEmitter(emitter);
            }
        }
    }
}