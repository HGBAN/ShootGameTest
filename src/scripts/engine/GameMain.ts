// import {$time} from "@/scripts/engine/Time";
import {Time} from "@/scripts/engine/Time";
import {Fps} from "@/scripts/engine/Fps";
import {Scene} from "@/scripts/engine/Scene";
import {Scene1} from "@/scripts/scenes/Scene1";
import {Timer} from "@/scripts/engine/Timer";
import {Input} from "@/scripts/engine/Input";
import {TestScene} from "@/scripts/game/TestScene";

import * as PIXI from 'pixi.js';
import {Scene2} from "@/scripts/scenes/Scene2";
import {SceneRandom} from "@/scripts/scenes/SceneRandom";
import axios from "axios";
import {ErrCode, ResponseData, WeaponInfo} from "@/model";
import {weaponInfos} from "@/scripts/data/Weapons";

export class GameMain {
    readonly app = new PIXI.Application({width: 720, height: 1280});
    fps: Fps;
    scene?: Scene;
    fixedTimeStep = 0.016;
    fixedTime = 0;
    resetTime = false;
    resources: Map<string, string> = new Map<string, string>();

    //金钱数据
    money: number;
    //武器数据
    weaponInfo: WeaponInfo[];
    //武器数据索引
    weaponInfoIndex: { [index: string]: WeaponInfo };

    //---游戏记录数据---
    gameId = 0;
    highScore = 0;
    rubTimes = 0;
    level = '未通过';

    constructor() {
        this.app.ticker.add(delta => this.gameLoopCallback(delta));
        this.app.renderer.backgroundColor = 0x36424B;
        this.fps = new Fps();

        this.weaponInfo = weaponInfos();
        this.weaponInfoIndex = {};
        this.money = 0;

        //建立武器索引
        for (const info of this.weaponInfo) {
            this.weaponInfoIndex[info.tag] = info;
        }

        //等待所有异步执行完成后加载场景
        Promise.all([this.loadResources(), this.loadWeaponInfo(), this.createGameRecord()]).then(() => {
            this.setScene(new Scene1(this));
        });
        // this.loadResources().then(() => {
        //     this.setScene(new Scene1(this));
        //     // this.setScene(new Scene2(this));
        //     // this.setScene(new SceneRandom(this));
        // });
    }

    destroy() {
        this.app.destroy();
    }

    setScene(scene: Scene) {
        this.updateMoney().then(() => {
            this.scene = scene;
            this.scene.addObject(this.fps);
            this.app.stage = this.scene;
        })
    }

    loadResources() {
        return new Promise((resolve) => {
            this.resources.set('player_bullet', require('@/assets/player_bullet.png'));
            this.resources.set('player_bullet_missile', require('@/assets/player_bullet_missile.png'));
            this.resources.set('bullet_1', require('@/assets/1.png'));
            this.resources.set('bullet_2', require('@/assets/2.png'));
            this.resources.set('bullet_3', require('@/assets/3.png'));
            this.resources.set('bullet_4', require('@/assets/4.png'));
            this.resources.set('back_1', require('@/assets/back_1.png'));
            this.resources.set('crystal', require('@/assets/crystal.png'));
            this.resources.set('coin', require('@/assets/coin.png'));

            for (const path of this.resources.values()) {
                this.app.loader.add(path);
            }
            this.app.loader.load(() => {
                resolve(null);
            });
        });
    }

    loadWeaponInfo() {
        return axios.get('/game/shopInfo').then((res) => {
            const data: ResponseData = res.data;
            if (data.errCode == ErrCode.SUCCESS) {
                this.money = data.data.money;
                for (const info of data.data.weaponInfos) {
                    this.weaponInfoIndex[info.tag].currentLevel = info.level;
                    this.weaponInfoIndex[info.tag].equip = info.equip;
                }
            }
        });
    }

    //向后台服务器创建游戏记录
    createGameRecord() {
        return axios.put('/game/addGameRecord', {
            score: this.highScore,
            rubTimes: this.rubTimes,
            level: this.level
        }).then((res) => {
            const data: ResponseData = res.data;
            if (data.errCode == ErrCode.SUCCESS) {
                this.gameId = data.data;
            }
        });
    }

    //更新游戏记录
    updateGameRecord() {
        axios.put('/game/updateGameRecord', {
            id: this.gameId,
            score: this.highScore,
            rubTimes: this.rubTimes,
            level: this.level
        }).then((res) => {
            const data: ResponseData = res.data;
            if (data.errCode == ErrCode.SUCCESS) {
                // this.gameId = data.data;
            }
        });
    }

    updateMoney() {
        return axios.put('/game/updateMoney', {
            money: this.money
        }).then(res => {
            // const data: ResponseData = res.data;
        });
    }

    getTexture(key: string) {
        const path = this.resources.get(key);
        if (!path)
            return undefined;
        return this.app.loader.resources[path].texture;
    }

    update(): void {
        this.fps.update();
        Input.update();
        this.scene?.update();
    }

    fixedUpdate(): void {
        this.scene?.fixedUpdate(this.fixedTimeStep);
    }

    // draw(): void {
    // this.fps.draw(this.context);
    // this.scene.draw(this.context);
    // }

    gameLoopCallback = (delta: number): void => {

        let time = (delta / 60);
        if (this.resetTime) {
            time = 0;
            this.resetTime = false;
        }

        Time.update(time);
        // if (this.resetTime) {
        //     Time.update(time);
        //     this.resetTime = false;
        // }

        this.update();

        this.fixedTime += Time.deltaTime;
        while (this.fixedTime >= this.fixedTimeStep) {
            this.fixedTime -= this.fixedTimeStep;
            this.fixedUpdate();
        }
    }
}
