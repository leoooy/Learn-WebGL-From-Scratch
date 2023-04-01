
## 引擎 API 研发技巧
- addComponent 的返回值是 Script 实例
```js
const camera = cameraEntity.addComponent(Camera); 
camera.isOrthographic = true;
```

- onUpdate 按照固定时间间隔写逻辑而不是按每帧做什么，不然：
  - 卡帧的时候出现跳帧的异常
  - 按时间持续的游戏逻辑不稳定

## 游戏设计技巧
> flappy-bird 这个 demo 很好，给了我很多指导和整体设计的灵感
1. 梳理出游戏的状态（各模块响应对应游戏状态的处理逻辑）
  a. IDEL、START、END
2. 梳理出游戏的事件
3. 对于游戏生命周期的更深理解：
  a. onAwake 函数中：1.处理初始化逻辑 2.处理触发式逻辑的监听（监听游戏状态逻辑、监听游戏事件）
  b. onUpdate 函数中：处理根据时间变化的游戏逻辑
  c. onLateUpdate 函数中：处理检测类逻辑（碰撞检测、交互检测）
4. GameControll 负责游戏的整体控制
  a. 统一响应游戏事件
  b. 统一流转游戏状态
  c. 统一管理游戏更新的逻辑
  d. 统一响应用户的操作