import {
  Animator,
  DynamicCollider,
  GLTFResource,
  MeshRenderer,
  PBRMaterial,
  PrimitiveMesh,
  SphereColliderShape,
} from 'oasis-engine';
import { context } from '../context';

import { Script, Vector3 } from 'oasis-engine';
import { GlTFCollider } from '../scripts/GLTFCollider';
import pane, { animationControl, chickenCollider, paneData } from '../controls';

class CollisionScript extends Script {
  onTriggerExit() {}

  onTriggerStay() {}

  onTriggerEnter(other) {
    console.log('onTriggerEnter', this.entity, other, other._collider.name);
  }
}

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
  const { defaultSceneRoot: chickenEntity, animations, entities } = gltf;

  // 将小鸡添加到场景中
  context.rootEntity.addChild(chickenEntity);

  // 播放动画
  const animation = chickenEntity.getComponent(Animator);

  console.log(gltf);

  animationControl.on('change', (ev) => {
    animation.play(ev.value);
  });

  animation.play(paneData.animation);

  // 给碰撞球包个材质
  // const sphereMtl = new PBRMaterial(context.engine);
  // const meshRenderer = chickenEntity.addComponent(MeshRenderer);
  // sphereMtl.baseColor.set(Math.random(), Math.random(), Math.random(), 1.0);
  // sphereMtl.metallic = 0.0;
  // sphereMtl.roughness = 0.5;
  // meshRenderer.mesh = PrimitiveMesh.createSphere(
  //   context.engine,
  //   chickenCollider.radius
  // );
  // meshRenderer.setMaterial(sphereMtl);

  const sphereColliderShape = new SphereColliderShape();
  sphereColliderShape.radius = chickenCollider.radius;
  sphereColliderShape.material.staticFriction = 1;
  sphereColliderShape.material.dynamicFriction = 0.2;
  sphereColliderShape.material.bounciness = 1;
  sphereColliderShape.setPosition(0, 1, 0);

  const sphereCollider = chickenEntity.addComponent(DynamicCollider);
  sphereCollider.isKinematic = true;
  sphereCollider.addShape(sphereColliderShape);

  // pane.on('change', (ev) => {
  //   console.log('ev', ev.presetKey, ev);
  //   switch (ev.presetKey) {
  //     case 'radius':
  //       sphereColliderShape.radius = ev.value;
  //       sphereCollider.addShape(sphereColliderShape);
  //       break;
  //     default:
  //       return;
  //   }
  // });

  context.wireframe.addCollideWireframe(sphereCollider);
  chickenEntity.addComponent(CollisionScript);
  // chickenEntity.transform.translate(0, 5, 0);
}
