import React from 'react';

export const SecondSection = () => {
  return (
    <section className="bg-white py-48 px-6 overflow-hidden">
      <div className="max-w-[1300px] mx-auto">
        <h2 className="text-black text-[42px] md:text-[90px] font-bold tracking-tight text-center leading-[1.05] max-w-6xl mx-auto font-stack uppercase">
          Forge your unique
          <span className="inline-flex items-center align-middle mx-3 md:mx-6 w-14 h-14 md:w-[100px] md:h-[100px] bg-[#FF4500]/10 rounded-[20px] md:rounded-[32px] overflow-hidden transform hover:scale-110 transition-transform cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1614728263952-84ea206f99b6?auto=format&fit=crop&q=80&w=200" 
              alt="Digital Identity" 
              className="w-full h-full object-cover"
            />
          </span>
          digital identity with cinematic 
          <span className="inline-flex items-center align-middle mx-3 md:mx-6 w-14 h-14 md:w-[100px] md:h-[100px] bg-black/10 rounded-[20px] md:rounded-[32px] overflow-hidden transform hover:scale-110 transition-transform cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=200" 
              alt="AI Visuals" 
              className="w-full h-full object-cover"
            />
          </span>
          AI precision and artistic flair.
        </h2>
      </div>
    </section>
  );
};
