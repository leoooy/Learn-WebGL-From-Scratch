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

  // 使用缓冲区传递数据
  initBuffer(gl, shaderProgram);

  // 清空画布
  clear(gl);

  //绘制点
  render(gl, shaderProgram);
}

const positions = []; // 三角形顶点

function initBuffer(gl, shaderProgram) {
  // 创建了一个缓冲区
  const buffer = gl.createBuffer();
  // 绑定 buffer 为当前缓冲区
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  // 向缓冲区写入数据
  // new Float32Array(positions) 将顶点数组转化为更严谨的类型化数组。
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW); // gl.STATIC_DRAW 提示 WebGL 我们不会频繁改变缓冲区中的数据，WebGL 会根据这个参数做一些优化处理。

  const a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
  
  // 我们需要告诉 WebGL 如何从之前创建的缓冲区中获取数据，并且传递给顶点着色器中的 a_Position 属性。 那么，首先启用对应属性 a_Position：
  gl.enableVertexAttribArray(a_Position);

  /* 定义如何从缓冲区取数据 */
  //每次取两个数据
  const size = 2;
  //每个数据的类型是32位浮点型
  const type = gl.FLOAT;
  //不需要归一化数据
  const normalize = false;
  // 每次迭代运行需要移动数据数 * 每个数据所占内存 到下一个数据开始点。
  const stride = 0;
  // 从缓冲起始位置开始读取     
  const offset = 0;
  // 将 a_Position 变量获取数据的缓冲区指向当前绑定的 buffer。
  gl.vertexAttribPointer(
    a_Position, size, type, normalize, stride, offset);

  /* gl.vertexAttribPointer (target, size, type, normalize, stride, offset)。
      target： 允许哪个属性读取当前缓冲区的数据。
      size：一次取几个数据赋值给 target 指定的目标属性。在我们的示例中，顶点着色器中 a_Position 是 vec2 类型，即每次接收两个数据，所以 size 设置为 2。以后我们绘制立体模型的时候，a_Position 会接收三个数据，size 相应地也会设置成 3。
      type：数据类型，一般而言都是浮点型。
      normalize：是否需要将非浮点类型数据单位化到【-1, 1】区间。
      stride：步长，即每个顶点所包含数据的字节数，默认是 0 ，0 表示一个属性的数据是连续存放的。在我们的例子中，我们的一个顶点包含两个分量，X 坐标和 Y 坐标，每个分量都是一个 Float32 类型，占 4 个字节，所以，stride = 2 * 4 = 8 个字节。但我们的例子中，缓冲区只为一个属性a_Position服务，缓冲区的数据是连续存放的，因此我们可以使用默认值 0 来表示。但如果我们的缓冲区为多个属性所共用，那么 stride 就不能设置为 0 了，需要进行计算。
      offset：在每个步长的数据里，目标属性需要偏移多少字节开始读取。在我们的例子中，buffer 只为 a_Position 一个属性服务，所以 offset 为 0 * 4 = 0。 
  */

}

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

  const draw = (gl) => {
    clear(gl);
    const primitiveType = gl.TRIANGLES;
    const drawOffset = 0;
    if (positions.length > 0) {
      gl.drawArrays(primitiveType, drawOffset, positions.length / 2);
    }
  };
  canvas.addEventListener('click', e => {
    const x = e.pageX;
    const y = e.pageY;
    // const color = randomColor();
    positions.push(x, y);

    // 顶点信息为6个数据即3个顶点时执行绘制操作，因为三角形由三个顶点组成。
    if (positions.length % 6 == 0) {
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
      let color = randomColor();
      gl.uniform4f(u_Color, color.r, color.g, color.b, color.a);
      draw(gl);
    }
  });
  draw(gl);
}

// 主程序入口
main();