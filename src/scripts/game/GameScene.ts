import {Scene} from "@/scripts/engine/Scene";
import {Player} from "@/scripts/game/Player";
import {PlayerUI} from "@/scripts/ui/PlayerUI";
import {Vec2} from "@/scripts/engine/Vec2";
import {GameMain} from "@/scripts/engine/GameMain";
import {Background} from "@/scripts/game/Background";
import {EntityEvent, EntityEventList} from "@/scripts/game/EntityEventList";

export class GameScene extends Scene {
    time = 0;
    player: Player;
    playerUI: PlayerUI;

    //玩家初始数据，复活时恢复用
    initElimination = 1;
    initRubValue = 0;
    initScore = 0;
    initRubTimes = 0;

    events: EntityEventList = new EntityEventList();

    constructor(gameMain: GameMain, player?: Player) {
        super(gameMain);

        if (player) {
            this.player = player;
            this.player.reset();
            this.initElimination = this.player.elimination;
            this.initRubValue = this.player.rubValue;
            this.initScore = Player.score;
            this.initRubTimes = Player.rubTimes;
        } else
            this.player = new Player(new Vec2(360, 1000));
        // this.player.setScene(this);

        this.addObject(this.player);

        this.playerUI = new PlayerUI(this.player);
        this.addObject(this.playerUI);
    }

    createCurrentScene() {
        return new GameScene(this.gameMain, this.player);
    }

    fixedUpdate(time: number) {
        super.fixedUpdate(time);
        this.time += time;
        this.events.update(time);
        if (this.player.dead && this.transition.transitionIn) {
            this.transition.triggerOut();
            const outTime = this.time;
            this.events.addEvent(new EntityEvent(() => this.time - outTime >= 2, () => {
                this.player.reset();
                this.player.elimination = this.initElimination;
                this.player.rubValue = this.initRubValue;
                Player.score = this.initScore;
                Player.rubTimes = this.initRubTimes;
                this.gameMain.setScene(this.createCurrentScene());
            }));
        }
    }
}
