import {Vec2} from "@/scripts/engine/Vec2";

export class KeyState {
    isDown = false;
    isPressed = false;
}

export abstract class Input {
    static keyState: Map<string, KeyState> = new Map<string, KeyState>();

    static moveDir: Vec2 = Vec2.zero;
    static doubleTap = false;

    static keyDown(key: string) {
        this.getKey(key).isDown = true;
    }

    static keyUp(key: string) {
        const keyState = this.getKey(key);
        keyState.isDown = false;
        keyState.isPressed = true;
    }

    static getKey(key: string): KeyState {
        const k = this.keyState.get(key);
        if (!k) {
            const keyState = new KeyState();
            this.keyState.set(key, keyState);
            return keyState;
        }
        return k;
    }

    static update() {
        for (const state of this.keyState.values()) {
            state.isPressed = false;
        }
        // this.moveDir = Vec2.zero;
        // this.doubleTap = false;
    }

    static reset() {
        for (const state of this.keyState.values()) {
            state.isPressed = false;
            state.isDown = false;
        }
        this.moveDir = Vec2.zero;
        // this.doubleTap = false;
    }
}
