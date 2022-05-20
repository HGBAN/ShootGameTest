import {Scene} from "@/scripts/engine/Scene";
import {Player} from "@/scripts/game/Player";
import {PlayerUI} from "@/scripts/ui/PlayerUI";
import {Vec2} from "@/scripts/engine/Vec2";
import {GameMain} from "@/scripts/engine/GameMain";
import {Background} from "@/scripts/game/Background";
import {EntityEvent, EntityEventList} from "@/scripts/game/EntityEventList";
import {Emitter} from "@/scripts/game/Emitter";
import {Coin} from "@/scripts/game/Coin";
import {Random} from "@/scripts/engine/Random";

export class GameScene extends Scene {
    time = 0;
    player: Player;
    playerUI: PlayerUI;

    //玩家初始数据，复活时恢复用
    initElimination = 1;
    initRubValue = 0;
    initScore = 0;
    initRubTimes = 0;

    initUrgentTimes = 0;
    initUrgentValue = 0;
    initUrgentTime: number;

    events: EntityEventList = new EntityEventList();

    //金币生成器
    coinEmitter: Emitter;

    //正常状态金币掉率
    coinDropRate = 0.5;
    //急迫状态下金币数量及对应掉率
    urgentCoinDrop = {
        num: [1, 2, 3, 4, 5],
        rate: [0.1, 0.3, 0.3, 0.2]
    };

    constructor(gameMain: GameMain, player?: Player) {
        super(gameMain);

        if (player) {
            this.player = player;
            this.player.reset();
            this.initElimination = this.player.elimination;
            this.initRubValue = this.player.rubValue;
            this.initScore = Player.score;
            this.initRubTimes = Player.rubTimes;
            this.initUrgentTimes = this.player.urgentTimes;
            this.initUrgentValue = this.player.urgentValue;
            this.initUrgentTime = this.player.urgentTimer.currentTime;
        } else {
            this.player = new Player(new Vec2(360, 1000));
            this.initUrgentTime = this.player.urgentTimer.targetTime;
        }
        // this.player.setScene(this);


        this.addObject(this.player);

        this.playerUI = new PlayerUI(this.player);
        this.addObject(this.playerUI);

        this.coinEmitter = new Emitter(Vec2.zero, () => {
            return new Coin(Vec2.zero);
        });
        this.coinEmitter.period = -1;
        this.coinEmitter.duration = -1;
        this.coinEmitter.fixedAngle = 180;
        this.coinEmitter.angle = -90;
        // this.addObject(this.coinEmitter);
        this.coinEmitter.scene = this;
        // this.coinEmitter.numberAtOnce = 1;

    }

    //生成金币
    createCoins(pos: Vec2) {
        if (this.player.urgent) {
            let urgentCoinDrop;
            if (this.player.coinWeaponSlot) {
                urgentCoinDrop = this.player.coinWeaponSlot.urgentCoinDrop;
            } else {
                urgentCoinDrop = this.urgentCoinDrop;
            }
            this.coinEmitter.pos = pos.clone;
            this.coinEmitter.numberAtOnce = urgentCoinDrop.num[Random.choose(urgentCoinDrop.rate)];
            this.coinEmitter.shoot();
        } else {
            let coinDropRate;
            if (this.player.coinWeaponSlot) {
                coinDropRate = this.player.coinWeaponSlot.coinDropRate;
            } else {
                coinDropRate = this.coinDropRate;
            }
            if (Random.probability(coinDropRate)) {
                this.coinEmitter.pos = pos.clone;
                this.coinEmitter.numberAtOnce = 1;
                this.coinEmitter.shoot();
            }
        }
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
                this.player.urgentTimer.currentTime = this.initUrgentTime;
                this.player.urgentTimes = this.initUrgentTimes;
                this.player.urgentValue = this.initUrgentValue;
                Player.score = this.initScore;
                Player.rubTimes = this.initRubTimes;
                this.gameMain.setScene(this.createCurrentScene());
            }));
        }
    }
}
