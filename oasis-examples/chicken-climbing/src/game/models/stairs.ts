import { Animator, GLTFResource } from 'oasis-engine';
import { context } from '../context';

import { Script, Vector3 } from 'oasis-engine';
import { GlTFCollider } from '../scripts/GLTFCollider';
import { gameStart } from '../controls';

const stairStartPosition = new Vector3(0, -3, 3);

export class StairsMovement extends Script {
  onStart(): void {
    console.log('this', this);
  }
  onPhysicsUpdate() {
    if (!context.controls.gameStart) return;

    // 如何让场景无限循环下去？
    // 创建两块草地，以一个给定的速率向 X 轴负方向移动，在视野内消失后拼接到右边，参考：https://oasisengine.cn/#/docs/latest/cn/first-game
    if (this.entity.transform.worldPosition.z < 40) {
      this.entity.transform.translate(new Vector3(0, -0.04, 0.1));
    } else {
      this.entity.transform.position = stairStartPosition;
    }
  }
}

export async function initStairs() {
  const gltf = await context.engine.resourceManager.load<GLTFResource>(
    'https://mdn.alipayobjects.com/afts/file/A*QpYQQpIfG8kAAAAAAAAAAAAADrd2AQ/stairs.gltf'
  );
  const { defaultSceneRoot: stairs, animations, entities } = gltf;

  console.log('stairs', gltf);

  // 将梯子添加到场景中
  context.rootEntity.addChild(stairs);

  stairs.transform.translate(stairStartPosition);
  entities.forEach((el) => {
    if (/stair/.test(el.name)) return;
    el.addComponent(GlTFCollider);
  });
  // const animation = stairs.getComponent(Animator);

  // Add Script
  stairs.addComponent(StairsMovement);
}
