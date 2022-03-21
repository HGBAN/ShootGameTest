import {bulletPool} from "@/scripts/game/ObjectPool";

export abstract class Bullets {
    static default() {
        return bulletPool.get();
    }
}
