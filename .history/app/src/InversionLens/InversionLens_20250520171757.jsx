"use client"

const InversionLens = ({src,className}) => {
  return (
    <div className="{'inversion-lens ${className || **'}">
      <img src={src}/>    
    </div>
  )
}

export default InversionLens
