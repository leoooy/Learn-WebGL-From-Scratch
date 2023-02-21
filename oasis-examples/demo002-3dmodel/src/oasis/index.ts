import {
	BlinnPhongMaterial,
	Camera,
	GLTFResource,
	MeshRenderer,
	PrimitiveMesh,
	Vector3,
	WebGLEngine,
} from "oasis-engine";
import { OrbitControl } from "@oasis-engine-toolkit/controls";

export function createOasis() {
	const engine = new WebGLEngine("canvas");
	engine.canvas.resizeByClientSize();
	const scene = engine.sceneManager.activeScene;
	const rootEntity = scene.createRootEntity();

	// init camera
	const cameraEntity = rootEntity.createChild("camera");
	cameraEntity.addComponent(Camera);
	const pos = cameraEntity.transform.position;
	pos.set(10, 10, 10);
	cameraEntity.transform.position = pos;
	cameraEntity.transform.lookAt(new Vector3(0, 0, 0));
  cameraEntity.addComponent(OrbitControl);
  
	// init light
	scene.ambientLight.diffuseSolidColor.set(1, 1, 1, 1);
	scene.ambientLight.diffuseIntensity = 1.2;

  // load model
	engine.resourceManager
  .load<GLTFResource>("https://gw.alipayobjects.com/os/OasisHub/267000040/9994/%25E5%25BD%2592%25E6%25A1%25A3.gltf")
  .then((gltf) => {
    rootEntity.addChild(gltf.defaultSceneRoot);
  });
	

	engine.run();
}
