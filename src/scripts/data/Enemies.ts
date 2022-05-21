import {Emitter} from "@/scripts/game/Emitter";
import {Vec2} from "@/scripts/engine/Vec2";
import {Enemy} from "@/scripts/game/Enemy";
import {BulletEmitters} from "@/scripts/data/BulletEmitters";
import {Scene} from "@/scripts/engine/Scene";
import {EntityEvent, EntityEventList} from "@/scripts/game/EntityEventList";
import {PropChanger, PropMutation, PropTween} from "@/scripts/engine/PropTransformer";
import {Player} from "@/scripts/game/Player";
import {Bullet} from "@/scripts/game/Bullet";
import {bulletPool} from "@/scripts/game/ObjectPool";
import {Emitters} from "@/scripts/data/Emitters";
import {GameScene} from "@/scripts/game/GameScene";
import {Entities} from "@/scripts/data/Entities";
import {Bullets} from "@/scripts/data/Bullets";
import {Color} from "@/scripts/engine/Color";
import {EntityState} from "@/scripts/game/EntityState";
import {Random} from "@/scripts/engine/Random";
import {liner} from "@/scripts/data/Functions";

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

    static boss1(scene: GameScene): Enemy {
        const enemy: Enemy = new Enemy(Vec2.zero);
        enemy.setMaxLife(5000);
        // enemy.showBar = true;
        enemy.speed = 400;

        //亮血条
        enemy.eventList.addEvent(new EntityEvent(null,
            () => {
                if (enemy.scene)
                    enemy.scene.playerUI.boss = enemy;
            }));

        enemy.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 1,
            () => {
                enemy.speed = 0;
                enemy.states.changeState('state1');
            }));

        //---1阶段---
        //招式1
        const state1: EntityState = new EntityState(new EntityEventList());
        // const emitter1: Emitter = BulletEmitters.circle1();
        const emitter1: Emitter = new Emitter(Vec2.zero, () => {
            const bullet: Bullet = new Bullet(Vec2.zero);
            bullet.speed = 300;
            bullet.texture = 'bullet_1';
            return bullet;
        });
        emitter1.numberAtOnce = 4;
        emitter1.period = 0.03;
        emitter1.duration = -1;

        let emitter1Time = scene.time;
        emitter1.entityEvent = (entity) => {
            entity.eventList.addEvent(new EntityEvent(() => entity.survivalTime >= 0, new PropChanger(entity, 'angle', 0.5, 90)));
            entity.eventList.addEvent(new EntityEvent(() => entity.survivalTime >= 0.5, new PropMutation(entity, 'speed', 0)));

            // const time = scene.time;
            entity.eventList.addEvent(new EntityEvent(() => scene.time - emitter1Time >= 4, new PropMutation(entity, 'speed', 300)));
            // entity.eventList.addEvent(new EntityEvent(() => emitter.survivalTime >= 3, () => {
            //     entity.angle += 210;
            // }));
            entity.eventList.addEvent(new EntityEvent(() => scene.time - emitter1Time >= 4,
                new PropChanger(entity, 'angle', 0.5, 210)));
        }

        state1.events.addEvent(new EntityEvent(null, new PropChanger(emitter1, 'angle', 1.5, 270)));

        state1.events.addEvent(new EntityEvent(() => state1.time >= 0.5, () => {
            // console.log(emitter.numberAtOnce);
            emitter1.entity = () => {
                const bullet: Bullet = new Bullet(Vec2.zero);
                bullet.speed = 500;
                bullet.texture = 'bullet_1';
                return bullet;
            }
        }));
        state1.events.addEvent(new EntityEvent(() => state1.time >= 1, () => {
            emitter1.entity = () => {
                const bullet: Bullet = new Bullet(Vec2.zero);
                bullet.speed = 700;
                bullet.texture = 'bullet_1';
                return bullet;
            }
        }));
        state1.events.addEvent(new EntityEvent(() => state1.time >= 1.5, () => {
            emitter1.active = false;
        }));

        state1.events.addEvent(new EntityEvent(() => state1.time >= 1.5, () => {
            // console.log(emitter.numberAtOnce);
            emitter1.entity = () => {
                const bullet: Bullet = new Bullet(Vec2.zero);
                bullet.speed = 300;
                bullet.texture = 'bullet_1';
                return bullet;
            }
        }));

        enemy.addEmitter(emitter1);
        state1.addEmitters(emitter1);
        state1.events.addEvent(new EntityEvent(() => state1.time >= 3, () => {
            enemy.states.changeState('state2');
        }));

        //招式2
        const state2: EntityState = new EntityState(new EntityEventList())
        const emitter2 = BulletEmitters.waveParticle();
        emitter2.numberAtOnce = 5;
        emitter2.period = 0.08;
        emitter2.duration = -1;
        enemy.addEmitter(emitter2);
        state2.addEmitters(emitter2);
        state2.events.addEvent(new EntityEvent(() => state2.time >= 5, () => {
            emitter2.active = false;
        }));
        state2.events.addEvent(new EntityEvent(() => state2.time >= 6, () => {
            emitter1Time = scene.time;
            enemy.states.changeState('state1');
        }));

        const changeEvent = new EntityEvent(() => enemy.life <= enemy.maxLife / 2, () => {
            enemy.states.changeState('pauseState');
        });
        state1.events.addEvent(changeEvent);
        state2.events.addEvent(changeEvent);

        //---中间暂停阶段---
        const pauseState: EntityState = new EntityState(new EntityEventList());
        pauseState.events.addEvent(new EntityEvent(null, () => {
            pauseState.events.addEvent(new EntityEvent(null, new PropTween(enemy, 'life', 1.5, liner(enemy.life, enemy.maxLife))));
        }));

        pauseState.events.addEvent(new EntityEvent(() => pauseState.time >= 1.5, () => enemy.states.changeState('state3')));

        //---2阶段---，生命低于一半进入
        //招式3
        const state3: EntityState = new EntityState(new EntityEventList());
        const emitter3: Emitter = new Emitter(Vec2.zero, Bullets.rotate.bind(undefined, scene));
        emitter3.numberAtOnce = 8;
        emitter3.period = 1;
        emitter3.duration = -1;

        enemy.addEmitter(emitter3);

        state3.events.addEvent(new EntityEvent(() => state3.time >= 0.5, () => emitter3.active = false));
        state3.addEmitters(emitter3);
        state3.events.addEvent(new EntityEvent(() => state3.time >= 8, () => enemy.states.changeState('state4')));

        //招式4
        const state4: EntityState = new EntityState(new EntityEventList());
        const emitter4: Emitter = new Emitter(Vec2.zero, Bullets.sinDown);
        emitter4.numberAtOnce = 1;
        emitter4.period = -1;
        emitter4.duration = -1;
        emitter4.dir = new Vec2(1, 0);
        emitter4.entityDecorator = (entity) => {
            entity.eventList.addEvent(new EntityEvent(() => enemy.dead || state4.time >= 10, () => entity.destroy()));
        };
        emitter4.eventList.addEvent(new EntityEvent(() => enemy.dead, () => emitter4.destroy()));
        state4.events.addEvent(new EntityEvent(null, () => {
            emitter4.pos = new Vec2(100, 30);
            emitter4.shoot();
            emitter4.pos = new Vec2(400, 30);
            emitter4.shoot();
        }));
        scene.addObject(emitter4);
        state4.addEmitters(emitter4);

        const emitter5: Emitter = new Emitter(Vec2.zero, Bullets.drop);
        emitter5.numberAtOnce = 1;
        emitter5.period = -1;
        emitter5.duration = -1;
        emitter5.dir = new Vec2(0, 1);
        emitter5.eventList.addEvent(new EntityEvent(() => enemy.dead, () => emitter5.destroy()));

        const eventList: EntityEventList = new EntityEventList();
        eventList.repeatTime = -1;
        eventList.addEvent(new EntityEvent(null, () => {
            emitter5.pos = new Vec2(Random.range(10, 710), 0);
            emitter5.shoot();
        }));
        eventList.addEvent(new EntityEvent(() => eventList.currentPeriodTime >= 3, () => {
        }));
        emitter5.eventList.addEvent(new EntityEvent(() => state4.time >= 10, () => emitter5.active = false));
        emitter5.eventList.addEvent(eventList);

        scene.addObject(emitter5);
        state4.addEmitters(emitter5);

        state4.events.addEvent(new EntityEvent(null, () => {
            enemy.speed = 150;
            enemy.angle = 180;
        }));
        state4.events.addEvent(new EntityEvent(() => state4.time >= 2, () => {
            enemy.speed = 150;
            enemy.angle = 0;
        }));
        state4.events.addEvent(new EntityEvent(() => state4.time >= 6, () => {
            enemy.speed = 150;
            enemy.angle = 180;
        }));
        state4.events.addEvent(new EntityEvent(() => state4.time >= 8, () => {
            enemy.speed = 0;
        }));

        state4.events.addEvent(new EntityEvent(() => state4.time >= 15, () => enemy.states.changeState('state3')));

        enemy.states.addState('state1', state1);
        enemy.states.addState('state2', state2);
        enemy.states.addState('pauseState', pauseState);
        enemy.states.addState('state3', state3);
        enemy.states.addState('state4', state4);

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
        emitter.period = -1;
        emitter.duration = -1;
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
        enemy.speed = 60;
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
        enemy.speed = 400;
        enemy.setMaxLife(1200);

        const emitter = BulletEmitters.randomCircle();
        emitter.active = false;
        enemy.addEmitter(emitter);
        enemy.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 1, () => {
            enemy.speed = 0;
            emitter.active = true
        }));
        enemy.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 9, () => {
            enemy.speed = -400;
            emitter.active = false;
        }));
        // enemy.width = enemy.height = 100;

        return enemy;
    }

    static unDownThree(): Enemy {
        const enemy: Enemy = new Enemy(Vec2.zero);
        enemy.setMaxLife(100);
        enemy.speed = 100;
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
        enemy.speed = 100;
        const emitter: Emitter = BulletEmitters.shot();
        emitter.angle = 90;
        enemy.addEmitter(emitter);
        enemy.normalColor = new Color('#d3ab0a');
        return enemy;
    }

    static boss2(scene: GameScene): Enemy {
        const enemy: Enemy = new Enemy(Vec2.zero);
        enemy.setMaxLife(5000);
        enemy.normalColor = new Color('#d37c0a');
        enemy.speed = 400;

        //亮血条
        enemy.eventList.addEvent(new EntityEvent(null,
            () => {
                if (enemy.scene)
                    enemy.scene.playerUI.boss = enemy;
            }));

        enemy.eventList.addEvent(new EntityEvent(() => enemy.survivalTime >= 1,
            () => {
                enemy.speed = 0;
                enemy.states.changeState('mine');
            }));

        const traceEmitter: Emitter = BulletEmitters.trace();
        const mineEmitter: Emitter = BulletEmitters.mineShooter(scene);

        const meteoriteEmitter: Emitter = BulletEmitters.meteorite(scene, () => enemy.dead);

        const circleEmitter: Emitter = BulletEmitters.circleBack();
        const enemyEmitter: Emitter = Emitters.line1(Enemies.shot);
        enemyEmitter.pos = new Vec2(720, 400);
        enemyEmitter.duration = -1;
        enemyEmitter.period = 2;
        enemyEmitter.numberAtOnce = 1;
        enemyEmitter.angle = 180;
        scene.addObject(enemyEmitter);
        enemyEmitter.eventList.addEvent(new EntityEvent(() => enemy.dead, () => {
            enemyEmitter.destroy()
        }));

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
        meteoriteState.events.addEvent(new EntityEvent(() => meteoriteState.time >= 2, () => {
            enemy.speed = 150;
            enemy.angle = 0;
        }));
        meteoriteState.events.addEvent(new EntityEvent(() => meteoriteState.time >= 6, () => {
            enemy.speed = 150;
            enemy.angle = 180;
        }));
        meteoriteState.events.addEvent(new EntityEvent(() => meteoriteState.time >= 8, () => {
            enemy.speed = 0;
        }));

        //圆环阶段
        const circleState: EntityState = new EntityState(new EntityEventList());
        circleState.addEmitters(circleEmitter, enemyEmitter);
        circleState.events.addEvent(new EntityEvent(() => circleState.time >= 8, () => {
            enemyEmitter.active = false;
        }));
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
