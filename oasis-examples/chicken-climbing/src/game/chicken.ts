import { Animator, GLTFResource } from 'oasis-engine';
import { context } from './context';

import { Script, Vector3 } from 'oasis-engine';

export class Jump extends Script {
  flag = 0;
  onUpdate() {
    const jump = this.flag % 100 > 50;
    this.entity.transform.translate(new Vector3(0, jump ? 0.01 : -0.01, 0));
    this.flag++;
    // this.entity.transform.rotate(this.roatate_x);
    // this.entity.transform.rotate(this.roatate_y);
    // this.entity.transform.rotate(this.roatate_z);
  }
}

export async function initChicken() {
  const gltf = await context.engine.resourceManager.load<GLTFResource>(
    'https://gw.alipayobjects.com/os/raptor/9140174156005314/chicken1.gltf'
  );
  const { defaultSceneRoot: chicken, animations } = gltf;

  // chicken
  // 将小鸡添加到场景中
  chicken.transform.translate(0, 2, 0);
  context.rootEntity.addChild(chicken);
  chicken.addComponent(Jump);

  // 播放动画
  const animation = chicken.getComponent(Animator);

  console.log(animations);
  animation.play('-3038@jump_b');

  // Add Script
  // chicken.addComponent(Rotate);
}
