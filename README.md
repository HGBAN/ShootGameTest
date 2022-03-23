# 介绍

使用TypeScript开发的简单的网页端弹幕射击游戏，目前处于测试中，只做了两关，9种敌人，2种boss

游戏地址：

[http://139.9.58.231:8081/shooting/](http://139.9.58.231:8081/shooting/)

用浏览器打开网址就可以直接开始了，推荐使用现在主流的浏览器，旧的浏览器可能无法支持

支持移动端



Github地址：

[https://github.com/HGBAN/ShootGameTest](https://github.com/HGBAN/ShootGameTest)

Gitee地址：

[https://gitee.com/HGBA/ShootGameTest](https://gitee.com/HGBA/ShootGameTest)



第一次做这样的游戏，代码有很多不完善不合理和不符合规范的地方，有意见或发现bug欢迎提出

# 操作

电脑端可使用wasd来控制方向，k键释放消弹

移动端可通过向上下左右进行滑动来控制方向，快速双击屏幕释放消弹（可能不太灵敏，请多点几次）

# 机制

非常普通的小游戏，唯一需要说明的是，当玩家靠近子弹时，会积攒消弹槽：

![1](http://139.9.58.231:8081/images/1.jpg)

当消弹槽满了以后，会增加下方的数字，代表可进行全屏消弹的次数：

![1](http://139.9.58.231:8081/images/2.jpg)

之后就可以按下k键或双击屏幕来释放消弹效果了

# 截图

![1](http://139.9.58.231:8081/images/1.gif)

![1](http://139.9.58.231:8081/images/2.gif)

![1](http://139.9.58.231:8081/images/3.gif)

# 库

前端框架：Vue3

渲染库：Pixi.js

触屏手势库：Hammer.js

碰撞检测库：SSCD