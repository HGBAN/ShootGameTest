import {Player} from "@/scripts/game/Player";
import {Emitter} from "@/scripts/game/Emitter";
import {GameObject} from "@/scripts/engine/GameObject";

//玩家武器类，就是发射器的集合
export abstract class Weapon {
    //绑定的玩家
    protected player: Player;
    // //价格数组，对应每一级的价格，数组的大小就是武器的最大等级
    // private prices: number[];
    //参数数组，对应每一级的武器参数

    //武器的当前等级
    private level: number;
    private slot: number;
    //发射器集合
    protected emitters: Set<Emitter> = new Set<Emitter>();

    protected constructor(player: Player, level: number = 1, slot: number = -1) {
        this.player = player;
        // this.prices = [];
        this.level = level;
        this.slot = slot;

        if (slot >= 0) {
            if (this.player.weapons[slot]) {
                this.player.weapons[slot].destroy();
                this.player.weapons[slot] = this;
            }
        } else {
            this.player.weapons.push(this);
        }
    }

    destroy() {
        delete this.player.weapons[this.slot];
        for (const emitter of this.emitters) {
            emitter.destroy();
        }
    }

    // addEmitter(...emitters: Emitter[]) {
    //     // this.emitter = emitter;
    //     for(const emitter of emitters) {
    //         if (this.player.scene)
    //             this.player.scene.addObject(emitter);
    //         emitter.pos = this.player.pos.clone;
    //         emitter.bindingEntity = this;
    //         this.emitters.add(emitter);
    //     }
    // }
    //
    // update(time: number): void {
    //     for (const emitter of this.emitters) {
    //         emitter.pos = this.player.pos.clone;
    //     }
    // }
}

// export interface EmitterGenerator {
//     (level: number): Emitter[];
// }
//
// export interface WeaponInfo {
//     //价格数组，对应每一级的价格，数组的大小就是武器的最大等级
//     prices: number[];
//     //武器的当前等级
//     level: number;
//     //武器生成函数
//     generator: EmitterGenerator;
// }
//
// export class Weapon {
//     private generator: EmitterGenerator;
//     private level: number;
//     private prices: number[];
//
//     constructor(info: WeaponInfo) {
//         [this.generator, this.level, this.prices] = [info.generator, info.level, info.prices];
//     }
//
//     get emitters() {
//         return this.generator(this.level);
//     }
// }