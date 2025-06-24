import React from "react";
import Dermatologist from "@/assets/Dermatologist.svg";
import Gastroenterologist from "@/assets/Gastroenterologist.svg";
import General_physician from "@/assets/General_physician.svg";
import Gynecologist from "@/assets/Gynecologist.svg";
import Neurologist from "@/assets/Neurologist.svg";
import Pediatricians from "@/assets/Pediatricians.svg";

const Speciality = () => {
  const specialities = [
    { img: General_physician, title: "General Physician" },
    { img: Gynecologist, title: "Gynecologist" },
    { img: Dermatologist, title: "Dermatologist" },
    { img: Pediatricians, title: "Pediatrician" },
    { img: Neurologist, title: "Neurologist" },
    { img: Gastroenterologist, title: "Gastroenterologist" },
  ];

  return (
    <section className="w-full  py-12 md:py-20 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3">
            Find by Speciality
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Simply browse through our extensive list of trusted doctors, schedule
            <br />
            your appointment hassle-free.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {specialities.map((speciality, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 flex flex-col items-center transition-all duration-300 hover:shadow-md hover:transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 mb-4 flex items-center justify-center">
                <img
                  src={speciality.img}
                  alt={speciality.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-gray-800 dark:text-gray-100 font-medium text-center text-sm md:text-base">
                {speciality.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Speciality;
