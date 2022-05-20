const seedRandom = require('seedrandom');

//随机数生成类，可以设定随机种子
export abstract class Random {
    static ran: any = seedRandom(Date.now());

    static set seed(seed: any) {
        this.ran = seedRandom(seed);
    }

    //输入两个整数，随机返回两个数（包括）之间的一个整数
    static range(min: number, max: number): number {
        return Math.floor(this.ran() * (max - min + 1)) + min;
    }

    //输入一个0到1之间的数作为该方法返回true的概率
    static probability(rate: number) {
        return this.ran() <= rate;
    }

    //输入一组0到1之间的概率，随机返回对应概率的索引值
    //如输入概率[0.5,0.2]，将有50%的概率返回0
    //有20%概率返回1，剩下30%的概率返回2
    static choose(rates: number[]) {
        const rand = this.ran();
        let now = 0;
        for (let i = 0; i < rates.length; i++) {
            now += rates[i];
            if (rand <= now) {
                return i;
            }
        }
        return rates.length;
    }
}
