export interface Unary {
    (x: number): number;
}

export interface NoArg {
    (): number;
}

export function liner(start: number, end: number): Unary {
    return function (x: number): number {
        return x * (end - start) + start;
    }
}

export function quadratic(start: number, end: number): Unary {
    return function (x: number): number {
        return x * x * (end - start) + start;
    }
}

export function sin1(start: number, end: number): Unary {
    return function (x: number): number {
        return Math.sin(0.5 * Math.PI * x) * (end - start) + start;
    }
}