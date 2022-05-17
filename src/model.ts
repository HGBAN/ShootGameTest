//键值对
export interface Pair<K, T> {
    key: K;
    value: T;
}

//武器信息
export interface WeaponInfo {
    //武器名
    name: string;
    //武器各个等级的价格
    price: number[];
    //武器当前等级
    currentLevel: number;
    //武器最大等级
    maxLevel: number;
    //武器描述
    description: string;
}