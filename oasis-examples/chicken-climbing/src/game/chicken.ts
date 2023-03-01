import { GLTFResource } from 'oasis-engine';
import { context } from './context';
import { Rotate } from './scripts/Rotate';

export function chicken() {
  context.engine.resourceManager
    .load<GLTFResource>(
      'https://gw.alipayobjects.com/os/raptor/9140174156005314/chicken1.gltf'
    )
    .then((gltf) => {
      const { defaultSceneRoot: chicken, animations } = gltf;

      // 将小鸡添加到场景中
      context.rootEntity.addChild(chicken);

      // 
      const animation = chicken.getComponent(Animator);

      // Add Script
      // chicken.addComponent(Rotate);
    });
}
