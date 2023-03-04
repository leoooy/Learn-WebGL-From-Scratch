import {
  Animator,
  DynamicCollider,
  GLTFResource,
  MeshRenderer,
  SphereColliderShape,
} from 'oasis-engine';
import { context } from './context';

import { Script, Vector3 } from 'oasis-engine';
import { GlTFCollider } from './scripts/GLTFCollider';
import { animationControl, data } from './controls';

export class Jump extends Script {
  flag = 0;
  onUpdate() {
    const jump = this.flag % 100 > 50;
    this.entity.transform.translate(new Vector3(0, jump ? 0.01 : -0.01, 0));
    this.flag++;
  }
}

export async function initChicken() {
  const gltf = await context.engine.resourceManager.load<GLTFResource>(
    'https://gw.alipayobjects.com/os/raptor/9140174156005314/chicken1.gltf'
  );
  const { defaultSceneRoot: chicken, animations } = gltf;

  // chicken
  // 将小鸡添加到场景中
  chicken.transform.translate(0, 1, 0);
  context.rootEntity.addChild(chicken);
  chicken.addComponent(Jump);

  // 播放动画
  const animation = chicken.getComponent(Animator);

  // 网格
  const meshRenderer = chicken.addComponent(MeshRenderer);

  console.log(gltf);
  
  animationControl.on('change', (ev) => {
    animation.play(ev.value);
  });

  animation.play(data.animation);

  // const radius = 1.25;
  // const physicsSphere = new SphereColliderShape();
  // physicsSphere.radius = radius;
  // physicsSphere.material.staticFriction = 0.1;
  // physicsSphere.material.dynamicFriction = 0.2;
  // physicsSphere.material.bounciness = 1;

  // const gltfCollider = chicken.addComponent(GlTFCollider);
  // gltfCollider.isKinematic = true;

  // const sphereCollider = chicken.addComponent(DynamicCollider);
  // sphereCollider.isKinematic = true;
  // sphereCollider.addShape(physicsSphere);

  // Add Script
  // chicken.addComponent(Rotate);
}
