export abstract class Time {
    static lastTime = 0;
    // currentTime = 0;
    private static _deltaTime = 0;
    static timeScale = 1;

    // constructor() {
    //
    // }

    static update(time: number): void {
        this._deltaTime = (time - this.lastTime) / 1000;
        this.lastTime = time;
    }

    static get deltaTime(): number {
        const fps = 1 / this._deltaTime;
        if (fps < 30) {
            this.timeScale = fps / 30;
        } else
            this.timeScale = 1;
        return this._deltaTime * this.timeScale;
    }

}

// export const $time = new Time();
