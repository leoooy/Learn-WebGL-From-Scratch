import { initBuffers } from "./init-buffers.js";
import { getGlContext, clearScreen, initShaderProgram, loadTexture } from "./utils.js";
import { fsSource, vsSource } from "./shaderSources.js";
import { drawScene } from './draw-scene.js';

main();

function main() {
  // 初始化 gl 上下文
  const selector = '#glcanvas';
  const gl = getGlContext(selector);

  // 清空屏幕
  clearScreen(gl);

  // 初始化着色器程序
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // 将变量收纳到 programInfo 中便于使用
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
      textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),

    },
    uniformLocations: {
      worldViewProjection: gl.getUniformLocation(shaderProgram, "u_worldViewProjection"),
      worldInverseTranspose: gl.getUniformLocation(shaderProgram, "u_worldInverseTranspose"),

      // 光照位置
      lightWorldPosition: gl.getUniformLocation(shaderProgram, "u_lightWorldPosition"),
      viewWorldPosition: gl.getUniformLocation(shaderProgram, "u_viewWorldPosition"),
      world: gl.getUniformLocation(shaderProgram, "u_world"),
      // 高光
      shininess: gl.getUniformLocation(shaderProgram, "u_shininess"),

      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
      normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
      uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
    },
  };

  // 缓冲区数据初始化
  const buffers = initBuffers(gl);

  // 加载纹理
  const texture = loadTexture(gl, "cubetexture.png");
  // Flip image pixels into the bottom-to-top order that WebGL expects.
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);


  let then = 0;
  let rotation = 0.0;
  let deltaTime = 0;

  // 渲染主循环
  function render(now) {
    now *= 0.001; // convert to seconds
    deltaTime = now - then;
    then = now;

    drawScene(gl, programInfo, buffers, texture, rotation);
    rotation += deltaTime;

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
