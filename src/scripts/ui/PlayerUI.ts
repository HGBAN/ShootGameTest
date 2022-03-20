import {GameObject} from "@/scripts/engine/GameObject";
import {Container} from "pixi.js";
import {Player} from "@/scripts/game/Player";

export class PlayerUI extends GameObject {
    display = new Container();
    player: Player;

    constructor(player: Player) {
        super();
        this.player = player;
    }

    initGraphics(): void {
    }

    update(): void {
    }


}
