"use client"

interface InversionLensProps {
  src: string;
  className?: string;
}
import { useRef } from 'react';
import {vertexShader, fragmentShader} from './shaders'
const InversionLens: React.FC<InversionLensProps> = ({ src, className }) => {
  const containerRef=useRef<HTMLDivElement>(null)
  const rendererRef=useRef<WebGLRenderingContext | null>(null)
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const uniformsRef= useRef<any>(null)
  const isSetupCompleteRef = useRef(false);

  const setup = () => {
    if (isSetupCompleteRef.current) return;
    isSetupCompleteRef.current = true;

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const canvas = document.createElement("canvas");
    container.appendChild(canvas);

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    canvas.width = width;
    canvas.height = height;

    rendererRef.current = gl;
  };

  const config={
    maskRadius: 0.5,
    maskSpeed:0.75,
    lerpFactor:0.05,
    radiusLerpSpeed:0.1,
    turbulenceIntensity:0.075,


  }


  ocnst targetMouse = useRef(new THREE.Vec)
  return (
    <div ref={containerRef} className={`inversion-lens ${className || ''}`}>
      <img src={src} style={{ display: "none" }} alt="" />
    </div>
  )
}

export default InversionLens