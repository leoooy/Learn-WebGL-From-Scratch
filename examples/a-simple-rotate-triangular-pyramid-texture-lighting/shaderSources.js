// 顶点着色器
export const vsSource = `
  precision mediump float;

  attribute vec4 aVertexPosition;
  attribute vec3 aVertexNormal;
  attribute vec2 aTextureCoord;
  
  uniform vec3 u_lightWorldPosition;
  uniform vec3 u_viewWorldPosition;


  uniform mat4 u_world;
  uniform mat4 u_worldViewProjection;
  uniform mat4 u_worldInverseTranspose;
  
  varying vec3 v_normal;

  varying vec3 v_surfaceToLight;
  varying vec3 v_surfaceToView;

  varying vec2 vTextureCoord;


  void main(void) {
    // 计算顶点位置
    gl_Position = u_worldViewProjection * aVertexPosition;
    
    // 重定向法向量并传递到片段着色器
    v_normal = mat3(u_worldInverseTranspose) * aVertexNormal;

    // 计算纹理
    vTextureCoord = aTextureCoord;

    // 计算世界表面的坐标
    vec3 surfaceWorldPosition = (u_world * aVertexPosition).xyz;

    // 计算表面到光源的方向
    // 然后传递到片段着色器
    v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;

    // 计算表面到相机的方向
    // 然后传递到片段着色器
    v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;    
  }
`;

// 片段着色器
export const fsSource = `
  precision mediump float;
  varying vec3 v_normal;
  varying vec3 v_surfaceToLight;
  varying vec3 v_surfaceToView;
 
  varying vec2 vTextureCoord;
  uniform sampler2D uSampler;

  // 高光
  uniform float u_shininess;

  void main(void) {
    // 由于 v_normal 是可变量，所以经过插值后不再是单位向量，
    // 单位化后会成为单位向量
    vec3 normal = normalize(v_normal);
    
    vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
    vec3 surfaceToViewDirection = normalize(v_surfaceToView);
    vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

     
    float light = dot(normal, surfaceToLightDirection);

    // 高光
    float specular = 0.0;
    float light_default = 0.0;
    if (light > 0.0) {
      light_default = light;
      specular = pow(dot(normal, halfVector), u_shininess);
    }else{
      light_default = 0.5;
    }
    
    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

    
    
    // 只将颜色部分（不包含 alpha） 和光照相乘
    gl_FragColor = vec4(texelColor.rgb * light_default, texelColor.a);

    // 直接加上高光
    gl_FragColor.rgb += specular;
    
  }
`;