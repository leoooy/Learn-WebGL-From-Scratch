const sqrt = Math.sqrt;

function initBuffers(gl) {
  const positionBuffer = initPositionBuffer(gl);

  const colorBuffer = initColorBuffer(gl);
  // const indexBuffer = initIndexBuffer(gl);

  const textureCoordBuffer = initTextureBuffer(gl);
  const normalBuffer = initNormalBuffer(gl);

  return {
    position: positionBuffer,
    textureCoord: textureCoordBuffer,
    normal: normalBuffer,
    color: colorBuffer,
    // indices: indexBuffer, 使用 drawArrays 绘制，暂时用不上索引数据
  };
}

// 顶点位置 Buffer
function initPositionBuffer(gl) {
  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const top = [0.0, 2 * sqrt(6) / 3, 0.0];
  const left = [-1.0, 0.0, -sqrt(1 / 3)];
  const right = [1.0, 0, -sqrt(1 / 3)];
  const back = [0.0, 0.0, 2 * sqrt(1 / 3)];

  // 顺时针，代表背面
  // 逆时针，代表正面  
  const positions = [
    // Front face
    ...top,
    ...right,
    ...left,

    // Right face
    ...top,
    ...back,
    ...right,

    // left face
    ...top,
    ...left,
    ...back,

    // buttom face
    ...back,
    ...left,
    ...right,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return positionBuffer;
}

// 颜色 Buffer
function initColorBuffer(gl) {

  const red = [1.0, 0.0, 0.0, 1.0];
  const yellow = [0.0, 1.0, 0.0, 1.0];
  const blue = [0.0, 0.0, 1.0, 1.0];
  const white = [1.0, 1.0, 1.0, 1.0];
  const faceColors = [
    // Front face
    ...red,
    ...yellow,
    ...blue,

    // Right face
    ...red,
    ...yellow,
    ...blue,

    // left face
    ...red,
    ...yellow,
    ...blue,

    // buttom face    
    ...yellow,
    ...yellow,
    ...yellow,
  ];

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(faceColors), gl.STATIC_DRAW);

  return colorBuffer;
}

function initTextureBuffer(gl) {
  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

  // 为顶点指定纹理坐标
  const textureCoordinates = [
    // Front    
    1, 1, 0, 1, 1, 0,
    // Right
    1, 1, 0, 1, 1, 0,
    // Left
    1, 1, 0, 1, 1, 0,
    // Bottom
    1, 1, 0, 1, 1, 0,
  ];

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(textureCoordinates),
    gl.STATIC_DRAW
  );

  return textureCoordBuffer;
}

// 法线位置
function initNormalBuffer(gl) {
  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

  const top = [0.0, 2 * sqrt(6) / 3, 0.0];
  const left = [-1.0, 0.0, -sqrt(1 / 3)];
  const right = [1.0, 0, -sqrt(1 / 3)];
  const back = [0.0, 0.0, 2 * sqrt(1 / 3)];

  const fromValues = (p) => { return vec3.fromValues(p[0], p[1], p[2]); };
  const subtract = (a, b) => {
    const out = vec3.create();
    vec3.subtract(out, a, b);
    return out;
  };
  const cross = (a, b) => {
    const out = vec3.create();
    vec3.cross(out, a, b);
    return [...out];
  };
  const _top = fromValues(top);
  const _left = fromValues(left);
  const _right = fromValues(right);
  const _back = fromValues(back);


  const left_top = subtract(_left, _top);
  const right_top = subtract(_right, _top);
  const back_top = subtract(_back, _top);
  const left_back = subtract(_left, _back);
  const right_back = subtract(_right, _back);

  const front_normal = cross(right_top, left_top);
  const right_normal = cross(back_top, right_top);
  const left_normal = cross(left_top, back_top);
  const back_normal = cross(left_back, right_back);

  // debugger
  const vertexNormals = [
    // Front    
    ...front_normal, ...front_normal, ...front_normal,
    // 1.0, 0.0, 0.0,
    // 1.0, 0.0, 0.0,
    // 1.0, 0.0, 0.0,

    // Right
    ...right_normal, ...right_normal, ...right_normal,
    // 0.0, 0.0, 1.0,
    // 0.0, 0.0, 1.0,
    // 0.0, 0.0, 1.0,

    // Left
    ...left_normal, ...left_normal, ...left_normal,
    // -1.0, 0.0, 0.0,
    // -1.0, 0.0, 0.0,
    // -1.0, 0.0, 0.0,

    // Bottom
    ...back_normal, ...back_normal, ...back_normal,
    // 0.0, -1.0, 0.0,
    // 0.0, -1.0, 0.0,
    // 0.0, -1.0, 0.0,
  ];

  // const vertexNormals = [
  //   // Front
  //   0.0, 0.0, 1.0,
  //   0.0, 0.0, 1.0,
  //   0.0, 0.0, 1.0,
  //   // 0.0, 0.0, 1.0,

  //   // Right
  //   1, 0.0, -0.2, 1.0, 0.0, -0.2, 1.0, 0.0, -0.2,

  //   // Left
  //   -1.0, 0.0, -0.5, -1.0, 0.0, -0.5, -1.0, 0.0, -0.5,

  //   // Bottom
  //   0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
  // ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
  return normalBuffer;
}
export { initBuffers };