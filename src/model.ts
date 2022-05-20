//键值对
export interface Pair<K, T> {
    key: K;
    value: T;
}

//用户信息
export interface User {
    id: number;
    username: string;
    nickname: string;
    money: number;
    registerTime: number;
    lastLoginTime: number;
}

//武器信息
export interface WeaponInfo {
    //武器标签名
    tag: string;
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
    //是否已经装备
    equip: boolean;
}

//后台错误代码
export const enum ErrCode {
    SUCCESS = 0,

    NO_LOGIN = 101,
    LOGIN_FAILED = 102,

    INSERT_FAILED = 201,
    QUERY_FAILED = 202,
    DELETE_FAILED = 203,
}

//后台响应格式
export interface ResponseData {
    errCode: number;
    errMsg: string;
    data: any;
}