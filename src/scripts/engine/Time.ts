export abstract class Time {
    static lastTime = 0;
    // currentTime = 0;
    private static _deltaTime = 0;

    // constructor() {
    //
    // }

    static update(time: number): void {
        this._deltaTime = (time - this.lastTime) / 1000;
        this.lastTime = time;
    }

    static get deltaTime(): number {
        return this._deltaTime;
    }

}

// export const $time = new Time();
