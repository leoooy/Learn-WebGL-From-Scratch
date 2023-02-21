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

export function createOasis() {
  const engine = new WebGLEngine('canvas');
  engine.canvas.resizeByClientSize();
  const scene = engine.sceneManager.activeScene;
  const rootEntity = scene.createRootEntity();

  // init camera
  const cameraEntity = rootEntity.createChild('camera');
  cameraEntity.addComponent(Camera);
  cameraEntity.transform.setPosition(3, 3, 3);
  cameraEntity.transform.lookAt(new Vector3(0, 0, 0));
  cameraEntity.addComponent(OrbitControl);

  // init light
  scene.ambientLight.diffuseSolidColor.set(1, 1, 1, 1);
  scene.ambientLight.diffuseIntensity = 1.2;

  class Rotate extends Script {
    private roatate_y = new Vector3(0, 0.8, 0);
    private roatate_z = new Vector3(0, 0, 0.6);
    private roatate_x = new Vector3(1, 0, 0);
    onUpdate() {
      this.entity.transform.rotate(this.roatate_x);
      this.entity.transform.rotate(this.roatate_y);
      this.entity.transform.rotate(this.roatate_z);
    }
  }

  // init duck
  engine.resourceManager
    .load<GLTFResource>(
      'https://gw.alipayobjects.com/os/OasisHub/267000040/9994/%25E5%25BD%2592%25E6%25A1%25A3.gltf'
    )
    .then((gltf) => {
      const duck = gltf.defaultSceneRoot;

      rootEntity.addChild(duck);

      // Add Script
      duck.addComponent(Rotate);
    });

  engine.run();
}
