import { Animator, GLTFResource } from 'oasis-engine';
import { context } from './context';

import { Script, Vector3 } from 'oasis-engine';

export class StairsMovement extends Script {
  onUpdate() {
    this.entity.transform.translate(new Vector3(0, -0.021, 0.05));
  }
}

export async function initStairs() {
  const gltf = await context.engine.resourceManager.load<GLTFResource>(
    'https://mdn.alipayobjects.com/afts/file/A*QpYQQpIfG8kAAAAAAAAAAAAADrd2AQ/stairs.gltf'
  );
  const { defaultSceneRoot: stairs, animations } = gltf;

  // 将小鸡添加到场景中
  context.rootEntity.addChild(stairs);

  //
  const animation = stairs.getComponent(Animator);

  // Add Script
  stairs.addComponent(StairsMovement);
}
