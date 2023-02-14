import { initBuffers } from "./init-buffers.js";
import * as utils from "./utils.js";
import { fsSource, vsSource } from "./shaderSources.js";
import { drawScene } from './draw-scene.js';

main();

function main() {
  // 初始化 gl 上下文
  const selector = '#glcanvas';
  const gl = utils.getGlContext(selector);

  // 清空屏幕
  utils.clearScreen(gl);

  // 缓冲区数据初始化
  const buffers = initBuffers(gl);

  // 初始化着色器程序
  const shaderProgram = utils.initShaderProgram(gl, vsSource, fsSource);

  // 将变量收纳到 programInfo 中便于使用
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),      
    },
    uniformLocations: {
      worldViewProjection: gl.getUniformLocation(shaderProgram, "u_worldViewProjection"),      
    },
  };


  let then = 0;
  let rotation = 0.0;
  let deltaTime = 0;

  // 渲染主循环
  function render(now) {
    now *= 0.001; // convert to seconds
    deltaTime = now - then;
    then = now;

    drawScene(gl, programInfo, buffers, rotation);
    rotation += deltaTime;

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
