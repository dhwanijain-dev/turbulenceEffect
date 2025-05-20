"use client"

interface InversionLensProps {
  src: string;
  className?: string;
}
import { useEffect, useRef } from 'react';
import {vertexShader, fragmentShader} from './shaders'
import * as THREE from 'three';
const InversionLens: React.FC<InversionLensProps> = ({ src, className }) => {
  const containerRef=useRef<HTMLDivElement>(null)
  const rendererRef=useRef<WebGLRenderingContext | null>(null)
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const uniformsRef= useRef<any>(null)
  const isSetupCompleteRef = useRef(false);

 
  const config={
    maskRadius: 0.5,
    maskSpeed:0.75,
    lerpFactor:0.05,
    radiusLerpSpeed:0.1,
    turbulenceIntensity:0.075,


  }


  const targetMouse = useRef(new THREE.Vector2(0.5,0.5));
  const lerpedMouse = useRef(new THREE.Vector2(0.5,0.5));
  const targetRadius = useRef(0.0);
  const inInView = useRef(false);
  const inMouseInsideContainer = useRef(false);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);
  const animationFrameId = useRef(null);


useEffect(() => {
 if(!isSetupCompleteRef.current || !containerRef.current || !src) return;
 const loader = new THREE.TextureLoader();
  const loadTexture = () => {
    loader.load(src,(texture)=>{
      setupScene(texture);
      setupEventListeners();
      animate();
      isSetupCompleteRef.current = true;
    })

  }
  loadTexture();
   return()=>{
    if(animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    if(rendererRef.current){
      if(containerRef.current){
        const canvas = containerRef.current.querySelector("canvas");
        if(canvas){
          containerRef.current.removeChild(canvas);
        }

      }

    }
},[src]);

 const setupScene = (texture: THREE.Texture) => {
  if(!containerRef.current) return;

  const imageAspect = texture.image.width / texture.image.height;
  texture.minFilter = THREE.LinearMipMapLinearFilter
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;

  const scene = new THREE.Scene();
  sceneRef.current = scene;

  const width= containerRef.current.clientWidth;
  const height= containerRef.current.clientHeight;

  const camera = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  cameraRef.current = camera;
  const uniforms = {
    u_texture:{value:texture},
    u_mouse:{value:new THREE.Vector2(0.5,0.5)},
    u_time:{value:0.0},
    u_resolution:{value:new THREE.Vector2(width,height)},
    u_radius:{value:0.0},
    u_speed:{value:new THREE.Vector2(config.maskSpeed,config.maskSpeed)},
    u_imageAspect:{value:new THREE.Vector2(imageAspect,1.0)},
    u_turbulenceIntensity:{value:config.turbulenceIntensity},
  }
  uniformsRef.current = uniforms;

  const geometry = new THREE.PlaneGeometry(2,2);
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent:true,
  });
  const mesh = new THREE.Mesh(geometry,material);

  scene.add(mesh);
  const renderer = new THREE.WebGLRenderer({
    alpha:true,   
    antialias:true,
    powerPreference: "high-performance",
  });
  rendererRef.current = renderer
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width,height);
  renderer.capabilities.anisotropy = 10;

  containerRef.current.appendChild(renderer.domElement);
  const handleResize = () => {  
    if(!containerRef.current || !rendererRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    rendererRef.current.setSize(width,height);
    uniformsRef.u_resolution.value.set(width,height);


  };


  window.addEventListener("resize",handleResize);
  return () => {
    window.removeEventListener("resize",handleResize);
  };



  const setupEventListeners =()=>{
    const handle
  }


 };


  return (
    <div ref={containerRef} className={`inversion-lens ${className || ''}`}>
      <img src={src} style={{ display: "none" }} alt="" />
    </div>
  )
}

export default InversionLens