const seedRandom = require('seedrandom');

export abstract class Random {
    static ran: any = seedRandom(Date.now());

    static set seed(seed: any) {
        this.ran = seedRandom(seed);
    }

    static range(min: number, max: number): number {
        return Math.floor(this.ran() * (max - min + 1)) + min;
    }
}
