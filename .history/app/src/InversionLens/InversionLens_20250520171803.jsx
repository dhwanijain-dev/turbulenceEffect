"use client"

const InversionLens = ({src,className}) => {
  return (
    <div className="{'inversion-lens ${className || **'}">
      <img src={src} style={{disp}}/>    
    </div>
  )
}

export default InversionLens
