// A small, finite cloth mesh. The texture bends with the falling edge instead of
// moving a rectangular image across the page. No render loop remains after intro.
export function createSilkCurtainRenderer(canvas: HTMLCanvasElement, image: HTMLImageElement, lite: boolean) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: !lite, depth: false, powerPreference: 'low-power' });
  if (!gl) return null;

  const vertexSource = `
    attribute vec2 a_uv;
    uniform float u_progress;
    uniform float u_time;
    varying vec2 v_uv;
    varying float v_light;
    void main() {
      float p = u_progress;
      float motion = sin(p * 3.14159265);
      float fold = sin(a_uv.x * 34.0 + a_uv.y * 5.0 - u_time * 1.8);
      float broad = sin(a_uv.x * 13.0 + u_time * 1.2);
      // The middle releases first; neighbouring folds fall at slightly different rates.
      float release = pow(p, 1.42) * 1.48;
      float sag = sin(a_uv.x * 3.14159265) * 0.19 * motion;
      float edge = (broad * 0.045 + fold * 0.018) * motion;
      float height = 1.13 - 0.50 * p;
      float x = (a_uv.x - 0.5) * 1.10 + 0.5;
      x += fold * (0.003 + motion * 0.014) * sin(a_uv.y * 3.14159265);
      float y = -0.055 + release + sag + edge + a_uv.y * height;
      y += sin(a_uv.y * 13.0 + a_uv.x * 19.0 - u_time * 2.1) * 0.022 * motion * sin(a_uv.y * 3.14159265);
      gl_Position = vec4(x * 2.0 - 1.0, 1.0 - y * 2.0, 0.0, 1.0);
      v_uv = a_uv;
      float rimShadow = exp(-a_uv.y * 45.0) * 0.22 * motion;
      float rimLight = exp(-pow((a_uv.y - 0.035) * 32.0, 2.0)) * 0.15 * motion;
      v_light = 1.0 + cos(a_uv.x * 34.0 + a_uv.y * 5.0 - u_time * 1.8) * (0.018 + 0.085 * motion) - rimShadow + rimLight;
    }
  `;
  const fragmentSource = `
    precision mediump float;
    uniform sampler2D u_texture;
    uniform vec2 u_crop;
    varying vec2 v_uv;
    varying float v_light;
    void main() {
      vec2 uv = (v_uv - 0.5) * u_crop + 0.5;
      vec4 silk = texture2D(u_texture, uv);
      gl_FragColor = vec4(silk.rgb * v_light, 1.0);
    }
  `;

  const shaders: WebGLShader[] = [];
  const program = gl.createProgram();
  if (!program) return null;
  for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]] as const) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    shaders.push(shader);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      shaders.forEach(item => gl.deleteShader(item));
      gl.deleteProgram(program);
      return null;
    }
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    shaders.forEach(item => gl.deleteShader(item));
    gl.deleteProgram(program);
    return null;
  }
  gl.useProgram(program);

  const columns = lite ? 48 : 80;
  const rows = lite ? 20 : 32;
  const vertices = new Float32Array((columns + 1) * (rows + 1) * 2);
  const indices = new Uint16Array(columns * rows * 6);
  let vertex = 0;
  let index = 0;
  for (let y = 0; y <= rows; y++) {
    for (let x = 0; x <= columns; x++) {
      vertices[vertex++] = x / columns;
      vertices[vertex++] = y / rows;
      if (x < columns && y < rows) {
        const a = y * (columns + 1) + x;
        const b = a + columns + 1;
        indices.set([a, b, a + 1, a + 1, b, b + 1], index);
        index += 6;
      }
    }
  }

  const vertexBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();
  const texture = gl.createTexture();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  const uvLocation = gl.getAttribLocation(program, 'a_uv');
  gl.enableVertexAttribArray(uvLocation);
  gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.clearColor(0, 0, 0, 0);

  const progressLocation = gl.getUniformLocation(program, 'u_progress');
  const timeLocation = gl.getUniformLocation(program, 'u_time');
  const cropLocation = gl.getUniformLocation(program, 'u_crop');
  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, lite ? 1 : 1.5);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    gl!.viewport(0, 0, canvas.width, canvas.height);
    const imageAspect = image.naturalWidth / image.naturalHeight;
    const aspect = (width * 1.10) / (height * 1.13);
    gl!.uniform2f(cropLocation, Math.min(1, aspect / imageAspect), Math.min(1, imageAspect / aspect));
  }
  resize();

  return {
    resize,
    render(progress: number, time: number) {
      if (gl.isContextLost()) return;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(progressLocation, progress);
      gl.uniform1f(timeLocation, time);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    },
    dispose() {
      gl.deleteTexture(texture);
      gl.deleteBuffer(vertexBuffer);
      gl.deleteBuffer(indexBuffer);
      shaders.forEach(shader => gl.deleteShader(shader));
      gl.deleteProgram(program);
    },
  };
}
