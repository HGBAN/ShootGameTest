import {Scene} from "@/scripts/engine/Scene";
import {Bullet} from "@/scripts/game/Bullet";
import {Vec2} from "@/scripts/engine/Vec2";
import {Emitter} from "@/scripts/game/Emitter";
import {EntityEvent} from "@/scripts/game/EntityEventList";
import {PropChanger, PropMutation, PropTween} from "@/scripts/engine/PropTransformer";
import {BulletEmitters} from "@/scripts/data/BulletEmitters";
import {Player} from "@/scripts/game/Player";
import {Enemy} from "@/scripts/game/Enemy";
import {EnemyEmitters} from "@/scripts/data/EnemyEmitters";
import {GameObject} from "@/scripts/engine/GameObject";
import {Enemies} from "@/scripts/data/Enemies";
import {Random} from "@/scripts/engine/Random";
import {PlayerUI} from "@/scripts/ui/PlayerUI";
import {GameScene} from "@/scripts/game/GameScene";
import {GameMain} from "@/scripts/engine/GameMain";
import {bulletPool} from "@/scripts/game/ObjectPool";
import {Background} from "@/scripts/game/Background";
import {Bullets} from "@/scripts/data/Bullets";
import {Emitters} from "@/scripts/data/Emitters";

export class Scene2 extends GameScene {
    back: Background;

    constructor(gameMain: GameMain) {
        super(gameMain);
        this.back = new Background(this, 'back_1');
        this.addObject(this.back);

        const explosionEnemy = Enemies.explosion.bind(undefined, this);

        const enemyEmitter: Emitter = new Emitter(new Vec2(200, 0), explosionEnemy);
        enemyEmitter.angle = 90;


        // const enemy: Enemy = Enemies.explosion(this);
        // enemy.pos = new Vec2(360, 300);
        // enemy.speed = 0;
        // this.addObject(enemy);
        //
        // const enemy2: Enemy = Enemies.fire();
        // enemy2.pos = new Vec2(360, 400);
        // enemy2.speed = 0;
        // this.addObject(enemy2);
        //
        // const enemy3: Enemy = Enemies.randomCircle();
        // enemy3.pos = new Vec2(360, 500);
        // enemy3.speed = 0;
        // this.addObject(enemy3);
        //
        // const enemy4: Enemy = Enemies.unDownThree();
        // enemy4.pos = new Vec2(460, 500);
        // enemy4.speed = 0;
        // this.addObject(enemy4);
        //
        // const enemy5: Enemy = Enemies.shot();
        // enemy5.pos = new Vec2(460, 400);
        // enemy5.speed = 0;
        // this.addObject(enemy5);

        // const bullet: Bullet = Bullets.mine(this);
        // bullet.pos = new Vec2(460, 600);
        // this.addObject(bullet);

        // const bullet: Bullet = Bullets.chain();
        // bullet.pos = new Vec2(460, 600);
        // this.addObject(bullet);

        // const emitter: Emitter = BulletEmitters.trace();
        // emitter.pos = new Vec2(360, 500);
        // this.addObject(emitter);
        //
        // const emitter2: Emitter = BulletEmitters.mineShooter(this);
        // emitter2.pos = new Vec2(360, 500);
        // this.addObject(emitter2);

        // const emitter3: Emitter = BulletEmitters.meteorite(this, () => this.time >= 10);
        // this.addObject(emitter3);

        // const emitter4: Emitter = BulletEmitters.circleBack();
        // emitter4.pos = new Vec2(360, 500);
        // this.addObject(emitter4);

        // const emitter5: Emitter = Emitters.edgeShoot(Bullets.chain);
        // this.addObject(emitter5);

        const boss: Enemy = Enemies.boss2(this);
        boss.pos = new Vec2(360, 500);
        this.addObject(boss);
    }
}
