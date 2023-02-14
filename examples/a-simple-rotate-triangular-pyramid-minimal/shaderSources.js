// 顶点着色器
export const vsSource = `
  // 设置精度
  precision mediump float;

  attribute vec4 aVertexPosition;  
  uniform mat4 u_worldViewProjection;
  
  void main(void) {
    // 计算顶点位置
    gl_Position = u_worldViewProjection * aVertexPosition; 
  }
`;

// 片段着色器
export const fsSource = `
  // 设置精度
  precision mediump float;

  void main(void) {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`;