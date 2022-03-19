import {Timer} from "@/scripts/engine/Timer";
import {NoArg, Unary} from "@/scripts/data/Functions";

export interface IndexObject {
    [index: string]: any;
}

export interface EventFunc {
    (): void;
}

export type Transformer = PropTransformer | EventFunc | null;

export class PropTransformer {
    protected obj: IndexObject;
    protected prop: string;
    protected timer: Timer;
    // repeatTimes = 1;
    // protected currentRepeat = 0;

    constructor(obj: IndexObject, prop: string, targetTime: number = 0) {
        this.obj = obj;
        this.prop = prop;
        this.timer = new Timer(targetTime);
        // this.timer.timeOverCallback = (overflowTime) => {
        //     if (this.repeatTimes == -1 || ++this.currentRepeat < this.repeatTimes) {
        //         this.timer.currentTime = overflowTime;
        //     }
        // }
    }

    update(time: number): void {
        if (this.isOver)
            return;
        if (this.obj['active'] === false)
            return;
        this.timer.update(time);
    }

    get isOver(): boolean {
        return this.timer.isOver;
    }

    reset() {
        this.timer.reset();
    }
}

export class PropChanger extends PropTransformer {
    private readonly value: number;
    private readonly func: Unary;
    private accumulation = 0;

    // private lastProgress = 0;

    constructor(obj: IndexObject, prop: string, targetTime: number = 0, value: number = 0, func: Unary = (x) => x) {
        super(obj, prop, targetTime);
        this.value = value;
        this.func = func;
    }

    update(time: number): void {
        super.update(time);
        // const currentProgress = this.timer.progress;
        // this.obj[this.prop] += (currentProgress - this.lastProgress) * this.value;
        // this.lastProgress = currentProgress;
        const current = this.func(this.timer.progress) * this.value;
        this.obj[this.prop] += current - this.accumulation;
        this.accumulation = current;
    }

    reset() {
        super.reset();
        this.accumulation = 0;
    }
}

export class PropTween extends PropTransformer {
    private readonly func: Unary;

    constructor(obj: IndexObject, prop: string, targetTime: number = 0, func: Unary) {
        super(obj, prop, targetTime);
        this.func = func;
    }

    update(time: number): void {
        super.update(time);
        this.obj[this.prop] = this.func(this.timer.progress);
    }
}

export class PropMutation extends PropTransformer {
    private readonly value: number | NoArg;
    private over = false;

    constructor(obj: IndexObject, prop: string, value: number | NoArg) {
        super(obj, prop, 0);
        this.value = value;
    }

    update(time: number): void {
        // super.update(time);
        if (typeof this.value == 'number')
            this.obj[this.prop] = this.value;
        else
            this.obj[this.prop] = this.value();
        this.over = true;
    }

    get isOver(): boolean {
        return this.over;
    }
}
