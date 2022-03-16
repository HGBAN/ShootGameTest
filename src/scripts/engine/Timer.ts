import {Time} from "@/scripts/engine/Time";

export interface TimeOverCallback {
    (overflowTime: number): void;
}

export class Timer {
    currentTime: number;
    private _targetTime: number;
    timeOverCallback: TimeOverCallback | null = null;

    constructor(targetTime: number, reset = true) {
        this._targetTime = targetTime;
        this.currentTime = reset ? 0 : targetTime;
    }

    setTargetTime(targetTime: number, reset = true): void {
        this._targetTime = targetTime;
        if (reset)
            this.currentTime = 0;
    }

    get targetTime(): number {
        return this._targetTime;
    }

    get isOver(): boolean {
        return this.currentTime == this.targetTime;
    }

    get progress(): number {
        return this.currentTime / this.targetTime;
    }

    reset(): void {
        this.currentTime = 0;
    }

    update(time = Time.deltaTime): void {
        // console.log(this.currentTime,this.targetTime);
        if (this.isOver)
            return;
        this.currentTime += time;
        if (this.currentTime >= this.targetTime) {
            const overflowTime = this.targetTime - this.currentTime;
            this.currentTime = this.targetTime;
            this.timeOverCallback?.(overflowTime);
        }
    }
}
