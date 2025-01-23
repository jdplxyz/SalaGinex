import { Hero } from "../components/Hero/Hero"
import { Slider } from "../components/Slider/Slider"


export const Home = () =>{

   


    return(
        <div className="w-full flex flex-col">
        <Hero/>
        <Slider/>
        </div>
    )
}