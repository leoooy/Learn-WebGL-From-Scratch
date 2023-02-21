import {
	BlinnPhongMaterial,
	Camera,
	MeshRenderer,
	PrimitiveMesh,
	Vector3,
	WebGLEngine,
} from "oasis-engine";

export function createOasis() {
  // 初始化 engine 实例
	const engine = new WebGLEngine("canvas");
  // 自动适配浏览器窗口变化
	engine.canvas.resizeByClientSize();

  // 创建场景根节点
	const scene = engine.sceneManager.activeScene;
	const rootEntity = scene.createRootEntity();

	// 创建相机实体
	const cameraEntity = rootEntity.createChild("camera");
	cameraEntity.addComponent(Camera);
  // 设置相机位置
	const pos = cameraEntity.transform.position;
	pos.set(10, 10, 10);
	cameraEntity.transform.position = pos;
	cameraEntity.transform.lookAt(new Vector3(0, 0, 0));

	// 创建光照
	scene.ambientLight.diffuseSolidColor.set(1, 1, 1, 1);
	scene.ambientLight.diffuseIntensity = 1.2;

	// 创建物体
	const cubeEntity = rootEntity.createChild("cube");
	const cube = cubeEntity.addComponent(MeshRenderer);
  // 设置物体属性
	const mtl = new BlinnPhongMaterial(engine); // 材质
	const color = mtl.baseColor; // 材质颜色
	color.r = 0.0;
	color.g = 0.8;
	color.b = 0.5;
	color.a = 1.0;  
	cube.mesh = PrimitiveMesh.createCuboid(engine);
	cube.setMaterial(mtl);

	engine.run();
}
