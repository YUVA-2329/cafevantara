import React, { useEffect, useRef } from 'react';

interface ForestShaderCanvasProps {
  className?: string;
  speedMultiplier?: number;
}

export const ForestShaderCanvas: React.FC<ForestShaderCanvasProps> = ({
  className = 'w-full h-full',
  speedMultiplier = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    if (!gl) return;

    let animationFrameId: number;

    const syncSize = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    syncSize();

    const resizeObserver = new ResizeObserver(syncSize);
    resizeObserver.observe(canvas);

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;

      float noise(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      void main() {
          vec2 uv = v_texCoord;
          
          // Base forest green gradient
          vec3 color1 = vec3(0.027, 0.067, 0.047); // #07110C
          vec3 color2 = vec3(0.043, 0.094, 0.067); // #0B1811
          vec3 color = mix(color1, color2, uv.y);
          
          // Moving shaft of sunlight
          float shaft = smoothstep(0.4, 0.5, uv.x + sin(u_time * 0.2 + uv.y * 2.0) * 0.1);
          shaft *= smoothstep(0.6, 0.5, uv.x + sin(u_time * 0.2 + uv.y * 2.0) * 0.1);
          color += vec3(0.2, 0.15, 0.05) * shaft * 0.3;
          
          // Floating dust particles
          float n = noise(uv * 10.0 + u_time * 0.1);
          if (n > 0.98) {
              color += vec3(0.12);
          }
          
          gl_FragColor = vec4(color, 1.0);
      }
    `;

    const createShader = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const posLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLocation);
    gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0);

    const uTimeLocation = gl.getUniformLocation(program, 'u_time');
    const uResLocation = gl.getUniformLocation(program, 'u_resolution');

    let startTime = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTime) * 0.001 * speedMultiplier;
      gl.viewport(0, 0, canvas.width, canvas.height);

      if (uTimeLocation) gl.uniform1f(uTimeLocation, elapsed);
      if (uResLocation) gl.uniform2f(uResLocation, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [speedMultiplier]);

  return <canvas ref={canvasRef} className={className} style={{ display: 'block' }} />;
};
