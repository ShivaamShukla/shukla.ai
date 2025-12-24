import React from 'react';
import { features } from '../mockData';
import { Monitor, Bot, Plug, Users } from 'lucide-react';

const iconMap = {
  Monitor: Monitor,
  Bot: Bot,
  Plug: Plug,
  Users: Users
};

const Features = () => {
  return (
    <section id="features" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            What can Emergent do for you?
          </h2>
          <p className="text-xl text-gray-600">
            From concept to deployment, Emergent handles every aspect of software development so you can focus on what matters most - your vision!
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon];
            return (
              <div
                key={feature.id}
                className="group relative bg-white border-2 border-gray-100 rounded-3xl p-8 hover:border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-gray-100 transition-colors duration-300">
                    <IconComponent className="w-7 h-7 text-gray-800" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            Ready to transform your ideas into reality?
          </p>
          <button className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
            Start Building for Free
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;