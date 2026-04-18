import React from 'react';

export const SecondSection = () => {
  return (
    <section className="bg-white py-48 px-6 overflow-hidden">
      <div className="max-w-[1300px] mx-auto">
        <h2 className="text-black text-[42px] md:text-[90px] font-bold tracking-tight text-center leading-[1.05] max-w-6xl mx-auto font-stack">
          Build steady daily 
          <span className="inline-flex items-center align-middle mx-3 md:mx-6 w-14 h-14 md:w-[100px] md:h-[100px] bg-orange-100 rounded-[20px] md:rounded-[32px] overflow-hidden transform hover:scale-110 transition-transform cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&q=80&w=200" 
              alt="Cycling" 
              className="w-full h-full object-cover"
            />
          </span>
          habits with a layout that keeps your mornings, evenings, 
          <span className="inline-flex items-center align-middle mx-3 md:mx-6 w-14 h-14 md:w-[100px] md:h-[100px] bg-blue-50 rounded-[20px] md:rounded-[32px] overflow-hidden transform hover:scale-110 transition-transform cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=200" 
              alt="Sun" 
              className="w-full h-full object-cover"
            />
          </span>
          and focus simple to follow.
        </h2>
      </div>
    </section>
  );
};
