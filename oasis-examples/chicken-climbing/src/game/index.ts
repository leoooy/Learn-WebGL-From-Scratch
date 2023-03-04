import {
  BlinnPhongMaterial,
  Camera,
  MeshRenderer,
  PrimitiveMesh,
  Vector3,
  WebGLEngine,
  Script,
  GLTFResource,
  Keys,
} from 'oasis-engine';
import { OrbitControl } from '@oasis-engine-toolkit/controls';
import { context } from './context';
import { initChicken } from './chicken';
import { initStairs } from './stairs';
import { LitePhysics } from '@oasis-engine/physics-lite';
import { PhysXPhysics } from '@oasis-engine/physics-physx';

import { WireframeManager } from '@oasis-engine-toolkit/auxiliary-lines';
import pane, { paneData, field } from './controls';

class KeyScript extends Script {
  onUpdate() {
    const { inputManager } = this.engine;
    if (inputManager.isKeyDown(Keys.Space)) {
      // 这帧按下过空格键
      this.engine.pause();
    }
  }
}

export async function createOasis() {
  await PhysXPhysics.initialize();
  const engine = new WebGLEngine('canvas');
  engine.canvas.resizeByClientSize();

  // 初始化物理引擎
  engine.physicsManager.initialize(PhysXPhysics);

  const scene = engine.sceneManager.activeScene;
  const rootEntity = scene.createRootEntity();

  // 监听键盘时间，按下空格暂停、恢复
  rootEntity.addComponent(KeyScript);
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;

    if (engine.isPaused) {
      engine.resume();
    } else engine.pause();
  });

  const wireframe = rootEntity.addComponent(WireframeManager); // debug draw
  context.initContext({ engine, rootEntity, wireframe });

  // init camera
  const cameraEntity = rootEntity.createChild('camera');
  cameraEntity.addComponent(Camera);
  cameraEntity.transform.setPosition(0, 8, 15);
  cameraEntity.transform.lookAt(new Vector3(0, 0, 0));
  cameraEntity.addComponent(OrbitControl);

  // init light
  scene.ambientLight.diffuseSolidColor.set(1, 1, 1, 1);
  scene.ambientLight.diffuseIntensity = paneData.diffuseIntensity;

  // init duck
  initChicken();
  initStairs();
  engine.run();
  // engine.pause();
}
