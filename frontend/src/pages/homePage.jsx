import FooterSection from "@/components/FooterSection";
import Hero from "@/components/Hero";
import ListOfDoctors from "@/components/ListofDoctors";
import Speciality from "@/components/Speciality";
import React from "react";

const HomePage = () => {
  return (
    <div className="min-h-screen w-full flex  justify-center p-4">
      <div className="w-full max-w-7xl">
        <Hero />
        <Speciality />
        <ListOfDoctors/>
        <FooterSection />
      </div>
    </div>
  );
};

export default HomePage;
