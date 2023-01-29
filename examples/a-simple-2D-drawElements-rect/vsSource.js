// 顶点着色器
export const vsSource = `
// 设置浮点数精度为中等精度
precision mediump float;

// 接收点在 canvas 坐标系上的坐标 (x, y)
attribute vec2 a_Position;

// 接收 canvas 的宽高尺寸
attribute vec2 a_Screen_Size;

attribute vec4 a_Color;
varying vec4 v_Color;

void main(){
  //start 将屏幕坐标系转化为裁剪坐标（裁剪坐标系）
  vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0; // 转化到[-1,1]之间的值，即 NDC 坐标系（设备坐标），后面用更通用的转换方式矩阵变换
  position = position * vec2(1.0, -1.0);
  gl_Position = vec4(position, 0.0, 1.0);
  //end 将屏幕坐标系转化为裁剪坐标（裁剪坐标系）

  // 将顶点颜色传递给片段着色器
	v_Color = a_Color;
}
`;