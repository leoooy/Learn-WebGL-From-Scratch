import {
  BlinnPhongMaterial,
  Camera,
  MeshRenderer,
  PrimitiveMesh,
  Vector3,
  WebGLEngine,
  Script,
  GLTFResource,
} from 'oasis-engine';
import { OrbitControl } from '@oasis-engine-toolkit/controls';
import { context } from './context';
import { initChicken } from './chicken';
import { initStairs } from './stairs';

export function createOasis() {
  const engine = new WebGLEngine('canvas');
  engine.canvas.resizeByClientSize();
  const scene = engine.sceneManager.activeScene;
  const rootEntity = scene.createRootEntity();

  context.initContext({ engine, rootEntity });

  // init camera
  const cameraEntity = rootEntity.createChild('camera');
  cameraEntity.addComponent(Camera);
  cameraEntity.transform.setPosition(0, 8, 15);
  cameraEntity.transform.lookAt(new Vector3(0, 0, 0));
  cameraEntity.addComponent(OrbitControl);

  // init light
  scene.ambientLight.diffuseSolidColor.set(1, 1, 1, 1);
  scene.ambientLight.diffuseIntensity = 1.2;

  // init duck
  initChicken();
  initStairs();
  engine.run();
}
