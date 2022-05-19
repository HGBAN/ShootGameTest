import {GameObject} from "@/scripts/engine/GameObject";
import {Container, Graphics, Sprite, Text} from "pixi.js";
import {Player} from "@/scripts/game/Player";
import * as TextStyles from "@/scripts/data/TextStyles";
import {Enemy} from "@/scripts/game/Enemy";
import {Scene} from "@/scripts/engine/Scene";

export class PlayerUI extends GameObject {
    display = new Container();
    statusBar = new Graphics();
    rubTimesText: Text;
    scoreText: Text;
    eliminationText: Text;
    moneyText: Text;
    player: Player;
    boss?: Enemy;
    coinIcon = new Sprite();

    constructor(player: Player) {
        super();
        this.player = player;
        this.rubTimesText = new Text(Player.rubTimes.toString(), TextStyles.rubTimesText);
        this.scoreText = new Text(Player.score.toString(), TextStyles.scoreValueText);
        this.eliminationText = new Text(player.elimination.toString(), TextStyles.eliminationText);
        this.moneyText = new Text('0', TextStyles.moneyText);
    }

    updateStatusBar() {
        this.statusBar.clear();
        const healthRate = this.player.life / this.player.maxLife;
        this.statusBar.beginFill(0xDD2222, 1);
        this.statusBar.drawRect(680, 20, 20, 10);
        this.statusBar.drawRect(685, 15, 10, 20);
        this.statusBar.drawRect(683, 43 + 194 * (1 - healthRate), 14, 194 * healthRate);
        this.statusBar.endFill();

        const rubRate = this.player.rubValue / this.player.rubValueMax;
        this.statusBar.beginFill(0x3c79d5, 1);
        this.statusBar.drawCircle(660, 25, 10);
        this.statusBar.drawRect(653, 43 + 194 * (1 - rubRate), 14, 194 * rubRate);
        this.statusBar.endFill();

        this.statusBar.lineStyle(2, 0xDD2222, 1);
        this.statusBar.drawRect(680, 40, 20, 200);
        this.statusBar.lineStyle(2, 0x3c79d5, 1);
        this.statusBar.drawRect(650, 40, 20, 200);

        if (this.boss) {
            if (this.boss.dead) {
                this.boss = undefined;
            } else {
                this.statusBar.lineStyle(0);
                this.statusBar.beginFill(0xd93f3f, 1);
                this.statusBar.drawRect(83, 43, 554 * this.boss.life / this.boss.maxLife, 14);
                this.statusBar.endFill();
                this.statusBar.lineStyle(2, 0xd93f3f, 1);
                this.statusBar.drawRect(80, 40, 560, 20);
            }
        }
    }

    setScene(scene: Scene) {
        super.setScene(scene);
    }

    updateTexts() {
        this.scoreText.text = Player.score.toString();
        this.rubTimesText.text = Player.rubTimes.toString();
        this.eliminationText.text = this.player.elimination.toString();
        if (this.scene)
            this.moneyText.text = this.scene.gameMain.money.toString();

        this.scoreText.position.set(360 - this.scoreText.width / 2, 1124);
        this.rubTimesText.position.set(360 - this.rubTimesText.width / 2, 1184);
        this.eliminationText.position.set(658 - this.eliminationText.width / 2, 245);
        // this.moneyText.position.set(628, 285);
    }

    initGraphics(): void {
        // this.statusBar.clear();
        this.scoreText.position.set(360, 1124);
        this.rubTimesText.position.set(360, 1184);
        this.eliminationText.position.set(658, 245);
        this.moneyText.position.set(628, 285);

        this.display.addChild(this.statusBar, this.rubTimesText, this.eliminationText, this.scoreText, this.moneyText);

        this.coinIcon = new Sprite(this.scene?.gameMain.getTexture('coin'));
        this.coinIcon.width = 30;
        this.coinIcon.height = 30;
        this.coinIcon.position.set(590, 290);
        this.display.addChild(this.coinIcon);
    }

    update(): void {
        this.updateStatusBar();
        this.updateTexts();
    }


}
