"use client"

interface InversionLensProps {
  src: string;
  className?: string;
}
import {verte}
const InversionLens: React.FC<InversionLensProps> = ({ src, className }) => {
  
  return (
    <div className={`inversion-lens ${className || ''}`}>
      <img src={src} style={{ display: "none" }} alt="" />
    </div>
  )
}

export default InversionLens