import React, { useState } from 'react';
import { showcaseApps, stats } from '../mockData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Showcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % showcaseApps.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + showcaseApps.length) % showcaseApps.length);
  };

  return (
    <section className="py-32 bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">
              Y
            </div>
            <span className="text-white font-semibold">Combinator W24</span>
          </div>
        </div>

        {/* Stats */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="text-white text-xl mr-3">🏆</div>
            <h2 className="text-6xl font-bold text-white">{stats.users} users</h2>
            <div className="text-white text-xl ml-3">🏆</div>
          </div>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {stats.description}
          </p>
        </div>

        {/* Showcase Carousel */}
        <div className="relative">
          <div className="flex items-center justify-center gap-8">
            {/* Navigation Button - Left */}
            <button
              onClick={prevSlide}
              className="bg-white hover:bg-gray-100 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 z-20"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>

            {/* Showcase Cards Container */}
            <div className="flex-1 max-w-5xl overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {showcaseApps.map((app) => (
                  <div key={app.id} className="w-full flex-shrink-0 px-4">
                    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                      <div className="aspect-video bg-gray-900 relative overflow-hidden group">
                        <img
                          src={app.image}
                          alt={app.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                          <div>
                            <div className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1 text-white text-sm mb-3">
                              {app.category}
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-2">
                              {app.title}
                            </h3>
                            <p className="text-white/90">{app.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Button - Right */}
            <button
              onClick={nextSlide}
              className="bg-white hover:bg-gray-100 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 z-20"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-3">
            {showcaseApps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === index
                    ? 'w-8 h-3 bg-white'
                    : 'w-3 h-3 bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Showcase;