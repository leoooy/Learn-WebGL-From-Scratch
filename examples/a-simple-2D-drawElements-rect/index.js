import { createShaderProgram, clear, randomColor } from './utils.js';
import { vsSource } from './vsSource.js';
import { fsSource } from './fsSource.js';



function main() {
  const canvas = document.querySelector('#glcanvas');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const gl = canvas.getContext('webgl') || canvas.getContext("experimental-webgl");

  // 创建着色器程序
  const shaderProgram = createShaderProgram(gl, vsSource, fsSource);

  // 使用刚创建好的着色器程序。
  gl.useProgram(shaderProgram);

  //找到片元着色器中的变量 u_Color
  const u_Color = gl.getUniformLocation(shaderProgram, 'u_Color');
  // 随机生成一个颜色。
  let color = randomColor();
  // 将随机颜色传递给给全局变量
  gl.uniform4f(u_Color, color.r, color.g, color.b, color.a);

  //找到顶点着色器中的变量a_Screen_Size
  const a_Screen_Size = gl.getAttribLocation(shaderProgram, 'a_Screen_Size');
  //为顶点着色器中的 a_Screen_Size 传递 canvas 的宽高信息
  gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height);

  // 使用缓冲区传递数据
  initBuffer(gl, shaderProgram);

  // 定义索引数组
  initIndices(gl, shaderProgram);

  // 清空画布
  clear(gl);

  //绘制点
  render(gl, shaderProgram);
}

// 定义组成矩形的两个三角形，共计六个顶点，每个顶点包含2个坐标分量和4个颜色分量。
const positions = [
  //V0
  30, 30, 255, 0, 0, 1,
  //V1
  30, 300, 0, 255, 0, 1, 
  //V2
  300, 300, 0, 255, 0, 1, 
  //V3
  300, 30, 0, 0, 255, 1
];

function initBuffer(gl, shaderProgram) {
  // 创建了一个缓冲区
  const buffer = gl.createBuffer();
  
  // 绑定 buffer 为当前缓冲区
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // 向缓冲区写入数据
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW); // gl.STATIC_DRAW 提示 WebGL 我们不会频繁改变缓冲区中的数据，WebGL 会根据这个参数做一些优化处理。

  const a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
  const a_Color = gl.getAttribLocation(shaderProgram, 'a_Color');
  // 我们需要告诉 WebGL 如何从之前创建的缓冲区中获取数据，并且传递给顶点着色器中的 a_Position 属性。 那么，首先启用对应属性 a_Position：
  
  gl.enableVertexAttribArray(a_Position);
  gl.enableVertexAttribArray(a_Color);

  /* 定义如何从缓冲区取数据 */
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 24, 0);
  gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 24, 8); // 8：从第三位开始取颜色


  

  /* gl.vertexAttribPointer (target, size, type, normalize, stride, offset)。
      target： 允许哪个属性读取当前缓冲区的数据。
      size：一次取几个数据赋值给 target 指定的目标属性。在我们的示例中，顶点着色器中 a_Position 是 vec2 类型，即每次接收两个数据，所以 size 设置为 2。以后我们绘制立体模型的时候，a_Position 会接收三个数据，size 相应地也会设置成 3。
      type：数据类型，一般而言都是浮点型。
      normalize：是否需要将非浮点类型数据单位化到【-1, 1】区间。
      stride：步长，即每个顶点所包含数据的字节数，默认是 0 ，0 表示一个属性的数据是连续存放的。在我们的例子中，我们的一个顶点包含两个分量，X 坐标和 Y 坐标，每个分量都是一个 Float32 类型，占 4 个字节，所以，stride = 2 * 4 = 8 个字节。但我们的例子中，缓冲区只为一个属性a_Position服务，缓冲区的数据是连续存放的，因此我们可以使用默认值 0 来表示。但如果我们的缓冲区为多个属性所共用，那么 stride 就不能设置为 0 了，需要进行计算。
      offset：在每个步长的数据里，目标属性需要偏移多少字节开始读取。在我们的例子中，buffer 只为 a_Position 一个属性服务，所以 offset 为 0 * 4 = 0。 
  */

}

//定义绘制索引数组
const indices = [0, 1, 2, 0, 2, 3];
function initIndices(gl, shaderProgram) {
  //创建索引缓冲区
  const indicesBuffer = gl.createBuffer();
  //绑定索引缓冲区
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
  //向索引缓冲区传递索引数据
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

}
// 绘制函数
function render(gl) {
  clear(gl);
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}

// 主程序入口
main();