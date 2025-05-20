"use client"

interface InversionLensProps {
  src: string;
  className?: string;
}
import {vertexShader, fragmentShader} from './shaders'
const InversionLens: React.FC<InversionLensProps> = ({ src, className }) => {
  cons
  return (
    <div className={`inversion-lens ${className || ''}`}>
      <img src={src} style={{ display: "none" }} alt="" />
    </div>
  )
}

export default InversionLens