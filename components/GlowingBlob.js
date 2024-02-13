import React from 'react'

const GlowingBlob = ({ style }) => {
    return (
        <>
            <div id={style}> </div>
            <div className="h-full w-full absolute z-[-1] backdrop-blur-[200px]"> </div>
        </> 
  )
}

export default GlowingBlob