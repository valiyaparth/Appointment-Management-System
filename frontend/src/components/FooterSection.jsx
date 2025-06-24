import React from 'react';
import img from '@/assets/footer.png'; // Make sure alias "@" is properly configured

const FooterSection = () => {
  return (
    <div className="relative w-full h-auto lg:h-[35vh] rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400  p-10 md:px-12 mb-20 flex items-center justify-between">
      {/* Text Section */}
      <div className="z-10 text-white max-w-lg space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          Book Appointment
        </h1>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          With 100+ Trusted Doctors
        </h1>
        <button className="mt-4 px-6 py-2 bg-white text-blue-600 rounded-full font-semibold shadow hover:bg-blue-100 transition">
          Create account
        </button>
      </div>

      {/* Image Section */}
      <img
        src={img}
        alt="footer"
        className="absolute bottom-0 origin-bottom hidden right-0 h-full object-contain  scale-125 lg:block"
      />
    </div>
  );
};
export default FooterSection;
