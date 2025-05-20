"use client"

const InversionLens = ({src,className}) => {
  return (
    <div className="{'inversion-lens ${className || **'}">
      <img src={src} style={{display}}/>    
    </div>
  )
}

export default InversionLens
