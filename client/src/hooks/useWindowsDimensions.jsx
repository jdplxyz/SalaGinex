import { useEffect, useState } from "react"

const useWindowsDimension = () =>{
  const [dimensions,setDimensions] = useState({
    width: window.innerWidth,
    heigth: window.innerHeight
  })


  useEffect(()=>{
        const handleResize = () =>{
            setDimensions({width:window.innerWidth,heigth:window.innerHeight})
        }
        window.addEventListener('resize',handleResize)
        return () => window.removeEventListener('resize',handleResize)
  },[])

return dimensions;
}

export default useWindowsDimension