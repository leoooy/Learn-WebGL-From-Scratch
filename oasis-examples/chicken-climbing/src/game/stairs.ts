import { Animator, GLTFResource } from 'oasis-engine';
import { context } from './context';

import { Script, Vector3 } from 'oasis-engine';
import { GlTFCollider } from './scripts/GLTFCollider';

export class StairsMovement extends Script {
  onUpdate() {
    // console.log(this.entity.transform.position);
    // if ( > 54) {
    // this.entity.transform.position = new Vector3(0, 0, 0);
    // } else {
    // if (context.controls.start) {
    this.entity.transform.translate(new Vector3(0, -0.021, 0.05), true);
    // }

    // }
  }
}

export async function initStairs() {
  const gltf = await context.engine.resourceManager.load<GLTFResource>(
    'https://mdn.alipayobjects.com/afts/file/A*QpYQQpIfG8kAAAAAAAAAAAAADrd2AQ/stairs.gltf'
  );
  const { defaultSceneRoot: stairs, animations, entities } = gltf;

  console.log('stairs', gltf);

  // 将小鸡添加到场景中
  context.rootEntity.addChild(stairs);

  //
  entities.forEach((el) => {
    if (/stair/.test(el.name)) return;
    el.addComponent(GlTFCollider);
    // onTriggerEnter
  });
  // const gltfCollider = stairs.addComponent(GlTFCollider);
  //
  const animation = stairs.getComponent(Animator);

  // Add Script
  stairs.addComponent(StairsMovement);
}
