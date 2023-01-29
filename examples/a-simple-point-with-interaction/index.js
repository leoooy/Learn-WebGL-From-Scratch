import { createShaderProgram, clear, randomColor } from './utils.js';


// 顶点着色器
const vsSource = `
// 设置浮点数精度为中等精度
precision mediump float;

// 接收点在 canvas 坐标系上的坐标 (x, y)
attribute vec2 a_Position;

// 接收 canvas 的宽高尺寸
attribute vec2 a_Screen_Size;

void main(){
  //start 将屏幕坐标系转化为裁剪坐标（裁剪坐标系）
  vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0; // 转化到[-1,1]之间的值，即 NDC 坐标系（设备坐标），后面用更通用的转换方式矩阵变换
  position = position * vec2(1.0, -1.0);
  gl_Position = vec4(position, 0, 1);
  //end 将屏幕坐标系转化为裁剪坐标（裁剪坐标系）
  
  //声明待绘制的点的大小。
  gl_PointSize = 10.0;
}
`;

// 片段着色器
const fsSource = `
// 设置浮点数精度为中等精度
precision mediump float;

// 用于接收 JavaScript 传过来的颜色值（RGBA）。
uniform vec4 u_Color;

void main(){
  // 将普通的颜色表示转化为 WebGL 需要的表示方式，即将【0-255】转化到【0,1】之间。
   vec4 color = u_Color / vec4(255, 255, 255, 1);
   gl_FragColor = color; 

  /* old code */
  // 设置像素的填充颜色为红色。
  // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); 
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
  render(gl, shaderProgram);
}

const points = [];

// 绘制函数
function render(gl, shaderProgram) {
  const canvas = document.querySelector('#glcanvas');

  //找到顶点着色器中的变量a_Position
  const a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
  //找到顶点着色器中的变量a_Screen_Size
  const a_Screen_Size = gl.getAttribLocation(shaderProgram, 'a_Screen_Size');
  //找到片元着色器中的变量u_Color
  const u_Color = gl.getUniformLocation(shaderProgram, 'u_Color');

  //为顶点着色器中的 a_Screen_Size 传递 canvas 的宽高信息
  gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height);

  canvas.addEventListener('click', e => {
    const x = e.pageX;
    const y = e.pageY;
    const color = randomColor();
    points.push({ x: x, y: y, color: color });
    clear(gl);

    for (let i = 0; i < points.length; i++) {
      const currColor = points[i].color;
      //为片元着色器中的 u_Color 传递随机颜色
      gl.uniform4f(u_Color, currColor.r, currColor.g, currColor.b, currColor.a);

      //为顶点着色器中的 a_Position 传递顶点坐标。
      gl.vertexAttrib2f(a_Position, points[i].x, points[i].y);

      //绘制点
      gl.drawArrays(gl.POINTS, 0, 1);
    }
  });
}

// 主程序入口
main();