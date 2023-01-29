import { createShaderProgram } from './utils.js';


// 顶点着色器
const vsSource = `
void main(){
  //声明顶点位置
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  //声明待绘制的点的大小。
  gl_PointSize = 10.0;
}
`;

// 片段着色器
const fsSource = `
void main(){
  //设置像素的填充颜色为红色。
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); 
}
`;

function main() {
  const canvas = document.querySelector('#glcanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const gl = canvas.getContext('webgl') || canvas.getContext("experimental-webgl");

  // 创建着色器程序
  const shaderProgram = createShaderProgram(gl, vsSource, fsSource);

  // 使用刚创建好的着色器程序。
  gl.useProgram(shaderProgram);

  // 清空画布
  clear(gl);

  //绘制点
  render(gl);
}

// 清空画布
function clear(gl) {
  //设置清空画布颜色为黑色。
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  //用上一步设置的清空画布颜色清空画布。
  gl.clear(gl.COLOR_BUFFER_BIT);
}

// 绘制函数
function render(gl) {
  gl.drawArrays(gl.POINTS, 0, 1);
}

// 主程序入口
main();