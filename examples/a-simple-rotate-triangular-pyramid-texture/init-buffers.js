function initBuffers(gl) {
  const positionBuffer = initPositionBuffer(gl);

  const colorBuffer = initColorBuffer(gl);
  // const indexBuffer = initIndexBuffer(gl);

  return {
    position: positionBuffer,
    color: colorBuffer,
    // indices: indexBuffer, 使用 drawArrays 绘制，暂时用不上索引数据
  };
}

// 顶点位置 Buffer
function initPositionBuffer(gl) {
  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const sqrt = Math.sqrt;

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
    // 逆时针，代表正面
    ...top,
    ...left,
    ...back,

    // buttom face
    // 顺时针，代表背面
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
    // ...red,
    // ...blue,
    // ...yellow,
    


  ];

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(faceColors), gl.STATIC_DRAW);

  return colorBuffer;
}

// 索引 Buffer
// function initIndexBuffer(gl) {
//   const indexBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

//   // This array defines each face as two triangles, using the
//   // indices into the vertex array to specify each triangle's
//   // position.

//   const indices = [
//     0, t, 3, // front
//     0, 2, 1, // right
//     1, 2, 3, // up
//     0, 3, 2, // back
//   ];

//   // Now send the element array to GL
//   gl.bufferData(
//     gl.ELEMENT_ARRAY_BUFFER,
//     new Uint16Array(indices),
//     gl.STATIC_DRAW
//   );

//   return indexBuffer;
// }

export { initBuffers };