/* 
  创建着色器程序 shaderProgram，将着色器绑定并 link 到 shaderProgram，
  以便 WebGL 知晓如何绘制我们的数据  
*/
export function createShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = createShaderFromSource(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = createShaderFromSource(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        shaderProgram
      )}`
    );
    return null;
  }

  return shaderProgram;
}


/* 
  创建特定类型的 shader, 上传 source 到 GPU 并编译
*/
function createShaderFromSource(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}