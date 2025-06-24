import React from "react";
import Heroimg from "@/assets/hero.png";
import a1 from '@/assets/a1.png';
import a2 from '@/assets/a2.png';
import a3 from '@/assets/a3.png';
import AvatarList from "./AvatarList";
import { ArrowRight } from "lucide-react";

const Hero = () => {
    const avatars = [a1, a2, a3];
    return (
      <div className='flex flex-col lg:flex-row items-center justify-between w-full h-[90vh] lg:h-[70vh] rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 overflow-hidden text-white px-6 md:px-12 pt-12'>
        {/* Text Content */}
        <div className="flex flex-col justify-center h-full w-full lg:w-1/2 space-y-6 z-10">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Book Appointment <br />
                With Trusted Doctors
            </h1>
            
            <div className="flex items-center space-x-4">
                <AvatarList images={avatars} />
                <span className="text-sm md:text-base font-medium opacity-90">
                    100+ Trusted Doctors
                </span>
            </div>
            
            <p className="text-lg md:text-xl font-normal max-w-lg">
                Simply browse through our extensive list of trusted doctors and 
                schedule your appointment hassle-free.
            </p>
            
            <button className="flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 w-fit px-6 py-3 rounded-full font-semibold text-lg shadow-lg">
                Book appointment <ArrowRight className="h-5 w-5" />
            </button>
        </div>

        
        <div className="relative h-full w-full lg:w-1/2 flex justify-center lg:justify-end ">
            <img 
                src={Heroimg} 
                className=" object-contain absolute scale-120 lg:scale-125 bottom-0" 
                alt="doctor with patient" 
            />
        </div>
      </div>
    )
}

export default Hero;