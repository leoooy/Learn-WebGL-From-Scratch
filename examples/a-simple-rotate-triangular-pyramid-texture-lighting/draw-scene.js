import { radToDeg, degToRad, lookAt } from './utils.js';

// 模型变换
function modalViewOperation(rotation) {
  const modelViewMatrix = mat4.create();

  // 平移物体
  // mat4.translate(
  //   modelViewMatrix, // destination matrix
  //   modelViewMatrix, // matrix to translate
  //   [-0.0, -0.0, -6.0]
  // ); // amount to translate

  // 定义模型绕 x 轴旋转
  // mat4.rotate(
  //   modelViewMatrix, // destination matrix
  //   modelViewMatrix, // matrix to rotate
  //   cubeRotation, // amount to rotate in radians
  //   [1, 0, 0]
  // ); // axis to rotate around (Z)

  // 定义模型绕 z 轴旋转
  // mat4.rotate(
  //   modelViewMatrix, // destination matrix
  //   modelViewMatrix, // matrix to rotate
  //   cubeRotation, // amount to rotate in radians
  //   [0, 0, 1]
  // ); // axis to rotate around (Z)

  // 定义模型绕 y 轴旋转
  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    -rotation * 0.5, // amount to rotate in radians
    [0, 1, 0]
  ); // axis to rotate around (Y)

  return modelViewMatrix;
}

function drawScene(gl, programInfo, buffers, texture, rotation) {
  // gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  // 处理投影
  // 投影各个参数效果参见：https://webglfundamentals.org/webgl/frustum-diagram.html
  const fieldOfView = degToRad(60); // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = .1;
  const zFar = 2000;

  // 初始化投影变化矩阵
  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // 初始化相机位置矩阵
  // const cameraMatrix = mat4.create();


  const camera = [0, 2, 5];
  const target = [0, 1, 0];
  const up = [0, 1, 0];
  const cameraMatrix = lookAt(camera, target, up);

  // 绕 x 轴旋转相机（相机向上倾斜一定角度）
  // mat4.fromXRotation(cameraMatrix, degToRad(10));
  // 向下、先后移动相机
  // const camera = [20, 30, 20];
  // mat4.translate(cameraMatrix, cameraMatrix, [0, -3, 0]);

  // 求相机视角矩阵的逆（相机和物体是逆），参考 WebGL 三维相机：https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-3d-camera.html
  const viewMatrix = mat4.create();
  mat4.invert(viewMatrix, cameraMatrix);

  // 投影矩阵和相机矩阵相乘得到最终的投影变换矩阵
  const viewProjectionMatrix = mat4.create();
  mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);



  // 模型变换矩阵
  const worldMatrix = modalViewOperation(rotation);

  const normalMatrix = mat4.create();
  mat4.invert(normalMatrix, worldMatrix);
  mat4.transpose(normalMatrix, normalMatrix);

  // 世界矩阵
  const worldViewProjectionMatrix = mat4.create();
  mat4.multiply(worldViewProjectionMatrix, viewProjectionMatrix, worldMatrix);

  // 求逆矩阵
  const worldInverseMatrix = mat4.create();
  mat4.invert(worldInverseMatrix, worldMatrix);

  // 求转置
  const worldInverseTransposeMatrix = mat4.create();
  mat4.transpose(worldInverseTransposeMatrix, worldInverseMatrix);

  // 定义如何从缓冲区 buffer 中取 位置、纹理、法线 数据
  setPositionAttribute(gl, buffers, programInfo);
  // setColorAttribute(gl, buffers, programInfo);
  setTextureAttribute(gl, buffers, programInfo);
  setNormalAttribute(gl, buffers, programInfo);

  // 使用 main 函数中初始化好了的 program
  gl.useProgram(programInfo.program);


  // 投影变换
  gl.uniformMatrix4fv(programInfo.uniformLocations.worldViewProjection, false, worldViewProjectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.worldInverseTranspose, false, worldInverseTransposeMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.world, false, worldMatrix);
  // 法线矩阵
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.normalMatrix,
    false,
    normalMatrix
  );
  // 相机方向
  gl.uniform3fv(programInfo.uniformLocations.viewWorldPosition, camera);
  // 设置光线方向
  gl.uniform3fv(programInfo.uniformLocations.lightWorldPosition, [0, 2, 2]);
  // 调整高光
  const shininess = 150;
  gl.uniform1f(programInfo.uniformLocations.shininess, shininess);

  // Tell WebGL we want to affect texture unit 0
  gl.activeTexture(gl.TEXTURE0);

  // Bind the texture to texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Tell the shader we bound the texture to texture unit 0
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

  gl.drawArrays(gl.TRIANGLES, 0, 3 * 4); // 使用 drawArrays 绘制每个面的顶点都需要绘制一遍，即每个面 3个顶点*4个面

}

// 告诉 WebGL 如何从缓冲区读取数据到 vertexPosition
function setPositionAttribute(gl, buffers, programInfo) {
  const size = 3;
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set of values to the next
  // 0 = use type and numComponents above
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    size,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

// 告诉 WebGL 如何从缓冲区读取数据到 vertexColor
function setColorAttribute(gl, buffers, programInfo) {
  const size = 4;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexColor,
    size,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}

function setTextureAttribute(gl, buffers, programInfo) {
  const num = 2; // every coordinate composed of 2 values
  const type = gl.FLOAT; // the data in the buffer is 32-bit float
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set to the next
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
  gl.vertexAttribPointer(
    programInfo.attribLocations.textureCoord,
    num,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
}

function setNormalAttribute(gl, buffers, programInfo) {
  const numComponents = 3;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexNormal,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
}

export { drawScene };