"use client"

import { useEffect, useRef } from 'react';
import { vertexShader, fragmentShader } from './shaders';
import * as THREE from 'three';

interface InversionLensProps {
  src: string;
  className?: string;
}

const InversionLens: React.FC<InversionLensProps> = ({ src, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const uniformsRef = useRef<Record<string, THREE.IUniform> | null>(null);
  const isSetupCompleteRef = useRef<boolean>(false);
  const animationFrameId = useRef<number | null>(null);

  const config = {
    maskRadius: 0.5,
    maskSpeed: 0.75,
    lerpFactor: 0.05,
    radiusLerpSpeed: 0.1,
    turbulenceIntensity: 0.075,
  };

  const targetMouse = useRef<THREE.Vector2>(new THREE.Vector2(0.5, 0.5));
  const lerpedMouse = useRef<THREE.Vector2>(new THREE.Vector2(0.5, 0.5));
  const targetRadius = useRef<number>(0.0);
  const isInView = useRef<boolean>(false);
  const isMouseInsideContainer = useRef<boolean>(false);
  const lastMouseX = useRef<number>(0);
  const lastMouseY = useRef<number>(0);

  const updateCursorState = (x: number, y: number) => {
    if (!containerRef.current) return;

    lastMouseX.current = x;
    lastMouseY.current = y;
    const rect = containerRef.current.getBoundingClientRect();
    const inside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

    isMouseInsideContainer.current = inside;

    if (inside) {
      targetMouse.current.x = (x - rect.left) / rect.width;
      targetMouse.current.y = 1.0 - (y - rect.top) / rect.height;
      targetRadius.current = config.maskRadius;
    } else {
      targetRadius.current = 0.0;
    }
  };

  const setupEventListeners = () => {
    const handleMouseMove = (e: MouseEvent) => {
      updateCursorState(e.clientX, e.clientY);
    };

    const handleScroll = () => {
      updateCursorState(lastMouseX.current, lastMouseY.current);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("scroll", handleScroll);

    if (containerRef.current) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isInView.current = entry.isIntersecting;
          if (!isInView.current) {
            targetRadius.current = 0.0;
          }
        });
      }, { threshold: 0.1 });

      observer.observe(containerRef.current);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("scroll", handleScroll);
        observer.disconnect();
      };
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("scroll", handleScroll);
    };
  };

  const setupScene = (texture: THREE.Texture) => {
    if (!containerRef.current) return;

    const imageAspect = texture.image.width / texture.image.height;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 16;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    cameraRef.current = camera;

    const uniforms = {
      u_texture: { value: texture },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(width, height) },
      u_radius: { value: 0.0 },
      u_speed: { value: new THREE.Vector2(config.maskSpeed, config.maskSpeed) },
      u_imageAspect: { value: new THREE.Vector2(imageAspect, 1.0) },
      u_turbulenceIntensity: { value: config.turbulenceIntensity },
    };
    uniformsRef.current = uniforms;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });
    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    rendererRef.current = renderer;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    if (renderer.capabilities.getMaxAnisotropy) {
      renderer.capabilities.getMaxAnisotropy();
    }

    containerRef.current.appendChild(renderer.domElement);

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !uniformsRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      rendererRef.current.setSize(width, height);
      uniformsRef.current.u_resolution.value.set(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  };

  const animate = () => {
    if (
      !uniformsRef.current ||
      !rendererRef.current ||
      !cameraRef.current ||
      !sceneRef.current
    ) {
      animationFrameId.current = requestAnimationFrame(animate);
      return;
    }

    lerpedMouse.current.lerp(targetMouse.current, config.lerpFactor);
    uniformsRef.current.u_mouse.value.copy(lerpedMouse.current);
    uniformsRef.current.u_time.value += 0.01;
    uniformsRef.current.u_radius.value += (targetRadius.current - uniformsRef.current.u_radius.value) * config.radiusLerpSpeed;
    rendererRef.current.render(sceneRef.current, cameraRef.current);

    animationFrameId.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Initialize on first render
    isSetupCompleteRef.current = true;

    if (!containerRef.current || !src) return;

    const loader = new THREE.TextureLoader();
    const loadTexture = () => {
      loader.load(src, (texture) => {
        setupScene(texture);
        setupEventListeners();
        animate();
      });
    };

    loadTexture();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      if (rendererRef.current) {
        if (containerRef.current) {
          const canvas = containerRef.current.querySelector("canvas");
          if (canvas) {
            containerRef.current.removeChild(canvas);
          }
        }
      }
    };
  }, [src]);

  return (
    <div ref={containerRef} className={`inversion-lens ${className || ''}`}>
      <img src={src} style={{ display: "none" }} alt="" />
    </div>
  );
};

export default InversionLens;