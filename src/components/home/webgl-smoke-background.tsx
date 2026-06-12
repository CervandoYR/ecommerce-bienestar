"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Environment } from "@react-three/drei";

const fragmentShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

varying vec2 vUv;

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  
  // Calculate mouse distance
  float d = distance(uv, uMouse);
  float mouseEffect = smoothstep(0.5, 0.0, d) * 0.15;
  
  // Base movement
  float time = uTime * 0.05;
  
  // Fractal Brownian Motion (fBM)
  float noise = 0.0;
  vec2 p = uv * 3.0 - vec2(0.0, time * 0.5) + mouseEffect * normalize(uv - uMouse);
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    noise += a * snoise(p);
    p = 2.0 * p + vec2(time * 0.1, -time * 0.2);
    a *= 0.5;
  }
  
  // Create beautiful luxury colors (Warm off-whites and light sage greens)
  vec3 color1 = vec3(0.92, 0.94, 0.91); // Very light sage / warm white
  vec3 color2 = vec3(0.85, 0.88, 0.84); // Muted sage
  vec3 color3 = vec3(0.98, 0.98, 0.96); // Pure warm white
  
  // Map noise to colors
  float n = noise * 0.5 + 0.5; // normalize 0 to 1
  vec3 finalColor = mix(color1, color2, smoothstep(0.2, 0.6, n));
  finalColor = mix(finalColor, color3, smoothstep(0.5, 0.9, n));
  
  // Add subtle gradient mask for the edges
  float vignette = smoothstep(1.5, 0.1, length(uv - 0.5));
  finalColor *= mix(0.7, 1.0, vignette);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  // Bypassing view matrices renders exactly to full screen bounds when using a 2x2 plane
  gl_Position = vec4(position, 1.0);
}
`;

function SmokeShader() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [mousePos, setMousePos] = useState(new THREE.Vector2(0.5, 0.5));
  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    []
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates to 0-1
      targetMouse.current.x = e.clientX / window.innerWidth;
      targetMouse.current.y = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Smooth mouse movement (lerp)
      mousePos.lerp(targetMouse.current, 0.05);
      materialRef.current.uniforms.uMouse.value.copy(mousePos);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export function WebGLSmokeBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Do not render on server, causes hydration mismatches with WebGL
  if (!mounted) return <div className="absolute inset-0 bg-[#080d0a]" />;

  return (
    <div className="absolute inset-0 w-full h-full bg-[#080d0a]">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ powerPreference: "high-performance", alpha: false, antialias: false }}
        dpr={[1, 1.5]} // cap pixel ratio for performance
      >
        {/* The OrthographicCamera fits the plane perfectly to screen */}
        <OrthographicCamera makeDefault position={[0, 0, 1]} zoom={1} />
        <SmokeShader />
      </Canvas>
    </div>
  );
}

import { OrthographicCamera } from "@react-three/drei";
