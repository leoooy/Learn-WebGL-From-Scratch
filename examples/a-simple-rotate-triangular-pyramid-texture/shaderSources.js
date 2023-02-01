// 顶点着色器
export const vsSource = `
  attribute vec4 aVertexPosition;
  attribute vec2 aTextureCoord;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying highp vec2 vTextureCoord;

  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    // vColor = aVertexColor;
    vTextureCoord = aTextureCoord;
  }
`;

// 片段着色器
export const fsSource = `
  varying highp vec2 vTextureCoord;
  uniform sampler2D uSampler;

  void main(void) {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
  }
`;