import {Random} from "@/scripts/engine/Random";

export class Range {
    private _min: number = Number.MIN_VALUE;
    private _max: number = Number.MAX_VALUE;

    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }

    get min() {
        return this._min;
    }

    set min(val) {
        if (this._min <= this._max)
            this._min = val;
        else
            throw new Error('最小值不能大于最大值');
    }

    get max() {
        return this._max;
    }

    set max(val) {
        if (this._max >= this._min)
            this._max = val;
        else
            throw new Error('最大值不能小于最小值');
    }

    rand() {
        return Random.range(this.min, this.max);
    }
}