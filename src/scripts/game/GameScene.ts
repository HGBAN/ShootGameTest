import {Scene} from "@/scripts/engine/Scene";
import {Player} from "@/scripts/game/Player";
import {PlayerUI} from "@/scripts/ui/PlayerUI";
import {Vec2} from "@/scripts/engine/Vec2";
import {GameMain} from "@/scripts/engine/GameMain";
import {Background} from "@/scripts/game/Background";

export class GameScene extends Scene {
    time = 0;
    player: Player;
    playerUI: PlayerUI;

    constructor(gameMain: GameMain, player?: Player) {
        super(gameMain);

        if (player) {
            this.player = player;
            this.player.reset();
        }
        else
            this.player = new Player(new Vec2(360, 1000));
        // this.player.setScene(this);

        this.addObject(this.player);

        this.playerUI = new PlayerUI(this.player);
        this.addObject(this.playerUI);
    }


    fixedUpdate(time: number) {
        super.fixedUpdate(time);
        this.time += time;
    }
}
