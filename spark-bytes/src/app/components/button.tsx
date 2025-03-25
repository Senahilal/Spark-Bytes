import React from 'react';
import Image from 'next/image';

const Hero: React.FC = () => {
  return (
    <div>
      {/* Background image */}
      <div className="relative w-full h-64 overflow-hidden">
        <div className="w-full h-full relative">
          <Image 
            src="/bostonu.jpeg"
            alt="Boston University Campus" 
            width={800} 
            height={300}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 right-4 bg-red-600 text-white px-4 py-2">
            <h2 className="text-xl font-bold m-0">BOSTON</h2>
            <p className="text-lg m-0">UNIVERSITY</p>
          </div>
        </div>
      </div>
      
      {/* Hero content */}
      <div style={{ backgroundColor: "#DEEFB7" }} className="py-8 px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between max-w-6xl mx-auto">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h1 className="text-3xl font-bold mb-2">Free Food, Zero Waste</h1>
            <p className="text-lg mb-6">Find, Share, and Enjoy Extra Food on Campus!</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button style={{ backgroundColor: "#036D19" }} className="text-white rounded-full py-3 px-6 font-medium hover:opacity-90">
                Find Free Food Now
              </button>
              <button style={{ backgroundColor: "#036D19" }} className="text-white rounded-full py-3 px-6 font-medium hover:opacity-90">
                Post an Event
              </button>
            </div>
          </div>
          
          <div className="md:w-2/5">
            <Image 
              src="burrito.png" 
              alt="Burrito" 
              width={400} 
              height={400}
              className="w-full max-w-xs mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;