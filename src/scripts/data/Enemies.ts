import {Emitter} from "@/scripts/game/Emitter";
import {Vec2} from "@/scripts/engine/Vec2";
import {Enemy} from "@/scripts/game/Enemy";
import {BulletEmitters} from "@/scripts/data/BulletEmitters";
import {Scene} from "@/scripts/engine/Scene";
import {EntityEvent, EntityEventList} from "@/scripts/game/EntityEventList";
import {PropMutation} from "@/scripts/engine/PropTransformer";
import {Player} from "@/scripts/game/Player";
import {Bullet} from "@/scripts/game/Bullet";
import {bulletPool} from "@/scripts/game/ObjectPool";
import {Emitters} from "@/scripts/data/Emitters";
import {GameScene} from "@/scripts/game/GameScene";
import {Entities} from "@/scripts/data/Entities";
import {Bullets} from "@/scripts/data/Bullets";
import {Color} from "@/scripts/engine/Color";
import {EntityState} from "@/scripts/game/EntityState";

export abstract class Enemies {
    static sniper1(): Enemy {
        const enemy: Enemy = new Enemy(Vec2.zero);
        enemy.setMaxLife(50);
        enemy.speed = 100;
        const emitter = BulletEmitters.snipe();
        emitter.numberAtOnce = 1;
        emitter.period = 1;
        emitter.duration = -1;
        enemy.addEmitter(emitter);

        return enemy;
    }

    static sin1(): Enemy {
        const enemy: Enemy = new Enemy(Vec2.zero);
        enemy.setMaxLife(200);
        enemy.speed = 100;
        enemy.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 2,
            new PropMutation(enemy, 'speed', 0)));
        enemy.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 7, () => {
            enemy.speed = -100;
        }));
        const emitter = BulletEmitters.sin();
        emitter.numberAtOnce = 0;
        emitter.period = 0.2;
        emitter.duration = -1;
        emitter.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 2,
            new PropMutation(emitter, 'numberAtOnce', 1)));
        emitter.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 6,
            new PropMutation(emitter, 'numberAtOnce', 0)));
        const emitter2 = BulletEmitters.sin(true);
        emitter2.numberAtOnce = 0;
        emitter2.period = 0.2;
        emitter2.duration = -1;
        emitter2.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 2,
            new PropMutation(emitter2, 'numberAtOnce', 1)));
        emitter2.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 6,
            new PropMutation(emitter2, 'numberAtOnce', 0)));

        enemy.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 2, () => {
            emitter.dir = Player.toPlayerDir(enemy.pos);
            emitter2.dir = Player.toPlayerDir(enemy.pos);
        }));
        enemy.addEmitter(emitter);
        enemy.addEmitter(emitter2);

        return enemy;
    }

    static circle2(): Enemy {
        const enemy: Enemy = new Enemy(Vec2.zero);
        enemy.setMaxLife(300);
        enemy.speed = 200;
        enemy.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 2,
            new PropMutation(enemy, 'speed', 0)));
        enemy.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 9, () => {
            enemy.speed = -200;
        }));
        const emitter = BulletEmitters.circle2(7);
        emitter.numberAtOnce = 0;
        emitter.period = 0.1;
        emitter.duration = -1;
        emitter.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 2,
            new PropMutation(emitter, 'numberAtOnce', 5)));
        emitter.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 7,
            new PropMutation(emitter, 'numberAtOnce', 0)));
        enemy.addEmitter(emitter);

        return enemy;
    }

    static lineRandom(): Enemy {
        const enemy: Enemy = new Enemy(Vec2.zero);
        enemy.setMaxLife(50);
        enemy.speed = 200;

        const emitter = BulletEmitters.lineRandom();
        emitter.numberAtOnce = 1;
        emitter.period = 3;
        emitter.duration = -1;
        emitter.active = false;
        emitter.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 2,
            () => emitter.dir = Player.toPlayerDir(enemy.pos)));
        emitter.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 5,
            () => emitter.dir = Player.toPlayerDir(enemy.pos)));
        emitter.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 2,
            () => emitter.active = true));
        emitter.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 6,
            () => emitter.active = false));
        enemy.addEmitter(emitter);

        return enemy;
    }

    static boss1(): Enemy {
        const enemy: Enemy = new Enemy(Vec2.zero);
        enemy.setMaxLife(3000);
        // enemy.showBar = true;
        enemy.speed = 400;
        // enemy.speed = 300;

        const emitter = BulletEmitters.circle1();
        emitter.numberAtOnce = 4;
        emitter.period = 0.03;
        emitter.duration = -1;
        emitter.active = false;
        emitter.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 1,
            () => {
                emitter.active = true;
                emitter.survivalTime = 0;
            }));
        emitter.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 1, () => {
            // console.log(emitter.numberAtOnce);
            emitter.entity = () => {
                const bullet: Bullet = new Bullet(Vec2.zero);
                bullet.speed = 300;
                bullet.texture = 'bullet_1';
                return bullet;
            }
        }));
        emitter.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 1.5, () => {
            // console.log(emitter.numberAtOnce);
            emitter.entity = () => {
                const bullet: Bullet = new Bullet(Vec2.zero);
                bullet.speed = 500;
                bullet.texture = 'bullet_1';
                return bullet;
            }
        }));
        emitter.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 2, () => {
            emitter.entity = () => {
                const bullet: Bullet = new Bullet(Vec2.zero);
                bullet.speed = 700;
                bullet.texture = 'bullet_1';
                return bullet;
            }
        }));
        emitter.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 2.5,
            () => emitter.active = false));
        enemy.addEmitter(emitter);

        const emitter2 = BulletEmitters.waveParticle();
        emitter2.numberAtOnce = 5;
        emitter2.period = 0.08;
        emitter2.duration = -1;
        emitter2.active = false;

        emitter2.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 6.5,
            () => {
                emitter2.active = true;
                emitter2.survivalTime = 0;
            }));
        enemy.addEmitter(emitter2);

        enemy.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 1,
            () => {
                enemy.speed = 0;
            }));
        enemy.eventList.addEvent(new EntityEvent(null,
            () => {
                if (enemy.scene)
                    enemy.scene.playerUI.boss = enemy;
            }));
        enemy.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 12.5,
            () => {
                emitter2.active = false;
                emitter.reset();
                emitter2.reset();
                enemy.reset();
            }));

        return enemy;
    }

    static explosion(scene: GameScene): Enemy {
        const enemy: Enemy = new Enemy(Vec2.zero);
        enemy.setMaxLife(50);
        enemy.speed = 200;

        const emitter = Emitters.line1(() => {
            const bullet: Bullet = new Bullet(Vec2.zero);
            bullet.speed = 300;
            bullet.texture = 'bullet_3'
            Entities.drop(bullet);
            return bullet;
        });
        emitter.numberAtOnce = 16;
        emitter.period = 99;
        emitter.duration = -1;
        emitter.active = false;
        emitter.bindingObj = enemy;

        emitter.eventList.addEvent(new EntityEvent(() => enemy.dead,
            () => {
                emitter.shoot();
                emitter.destroy();
            }));
        scene.addObject(emitter);

        return enemy;
    }

    static fire(): Enemy {
        const enemy: Enemy = new Enemy(Vec2.zero);
        enemy.setMaxLife(200);
        // const emitter: Emitter = Emitters.fire(Emitters.line1(Bullets.default));
        const emitter = BulletEmitters.fire();
        emitter.numberAtOnce = 1;
        emitter.duration = -1;
        emitter.period = 1.5;
        emitter.angle = 90;
        enemy.addEmitter(emitter);
        enemy.normalColor = new Color('#d3780a');
        return enemy;
    }

    static randomCircle(): Enemy {
        const enemy: Enemy = new Enemy(Vec2.zero);
        enemy.setMaxLife(800);
        enemy.addEmitter(BulletEmitters.randomCircle());
        // enemy.width = enemy.height = 100;

        return enemy;
    }

    static unDownThree(): Enemy {
        const enemy: Enemy = new Enemy(Vec2.zero);
        enemy.setMaxLife(100);
        let emitter = Emitters.three();
        emitter.angle = 90;
        enemy.addEmitter(emitter);
        emitter = Emitters.three();
        emitter.angle = -90;
        enemy.addEmitter(emitter);
        enemy.normalColor = new Color('#d3ab0a');
        return enemy;
    }

    static shot(): Enemy {
        const enemy: Enemy = new Enemy(Vec2.zero);
        enemy.setMaxLife(150);
        const emitter: Emitter = BulletEmitters.shot();
        emitter.angle = 90;
        enemy.addEmitter(emitter);
        enemy.normalColor = new Color('#d3ab0a');
        return enemy;
    }

    static boss2(scene: GameScene): Enemy {
        const enemy: Enemy = new Enemy(Vec2.zero);
        enemy.setMaxLife(4000);
        enemy.normalColor = new Color('#d37c0a');

        //亮血条
        enemy.eventList.addEvent(new EntityEvent(null,
            () => {
                if (enemy.scene)
                    enemy.scene.playerUI.boss = enemy;
                enemy.states.changeState('mine');
            }));

        const traceEmitter: Emitter = BulletEmitters.trace();
        const mineEmitter: Emitter = BulletEmitters.mineShooter(scene);

        const meteoriteEmitter: Emitter = BulletEmitters.meteorite(scene, () => enemy.dead);

        const circleEmitter: Emitter = BulletEmitters.circleBack();

        const chainEmitter: Emitter = Emitters.edgeShoot(Bullets.chain);
        chainEmitter.eventList.addEvent(new EntityEvent(() => enemy.dead, () => {
            chainEmitter.destroy()
        }));
        scene.addObject(chainEmitter);

        enemy.addEmitter(traceEmitter, mineEmitter, meteoriteEmitter, circleEmitter);

        //布雷阶段
        const mineState: EntityState = new EntityState(new EntityEventList());
        mineState.addEmitters(traceEmitter, mineEmitter);
        mineState.events.addEvent(new EntityEvent(() => mineState.time >= 21, () => {
            enemy.states.changeState('meteorite');
        }));

        //陨石阶段
        const meteoriteState: EntityState = new EntityState(new EntityEventList());
        meteoriteState.addEmitters(meteoriteEmitter);
        meteoriteState.events.addEvent(new EntityEvent(() => meteoriteState.time >= 10, () => {
            enemy.states.changeState('circle');
        }));
        meteoriteState.events.addEvent(new EntityEvent(null, () => {
            enemy.speed = 150;
            enemy.angle = 180;
        }));
        meteoriteState.events.addEvent(new EntityEvent(()=>meteoriteState.time >= 2, () => {
            enemy.speed = 150;
            enemy.angle = 0;
        }));
        meteoriteState.events.addEvent(new EntityEvent(()=>meteoriteState.time >= 6, () => {
            enemy.speed = 150;
            enemy.angle = 180;
        }));
        meteoriteState.events.addEvent(new EntityEvent(()=>meteoriteState.time >= 8, () => {
            enemy.speed = 0;
        }));

        //圆环阶段
        const circleState: EntityState = new EntityState(new EntityEventList());
        circleState.addEmitters(circleEmitter);
        circleState.events.addEvent(new EntityEvent(() => circleState.time >= 10, () => {
            enemy.states.changeState('chain');
        }));

        //锁链阶段
        const chainState: EntityState = new EntityState(new EntityEventList());
        chainState.addEmitters(chainEmitter);
        chainState.events.addEvent(new EntityEvent(() => chainState.time >= 6, () => {
            enemy.states.changeState('mine');
        }));

        enemy.states.addState('mine', mineState);
        enemy.states.addState('meteorite', meteoriteState);
        enemy.states.addState('circle', circleState);
        enemy.states.addState('chain', chainState);

        return enemy;
    }
}
