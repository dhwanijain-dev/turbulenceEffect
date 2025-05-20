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

  const

 };


  return (
    <div ref={containerRef} className={`inversion-lens ${className || ''}`}>
      <img src={src} style={{ display: "none" }} alt="" />
    </div>
  )
}

export default InversionLens