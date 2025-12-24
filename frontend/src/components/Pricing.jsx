import React, { useState } from 'react';
import { pricingPlans } from '../mockData';
import { Button } from './ui/button';
import { Check } from 'lucide-react';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [planType, setPlanType] = useState('individual'); // 'individual' or 'enterprise'

  return (
    <section id="pricing" className="py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Transparent pricing for every builder
          </h2>
          <p className="text-xl text-gray-600 mb-4">
            Choose the plan that fits your building ambitions.
          </p>
          <p className="text-lg text-gray-500">
            From weekend projects to enterprise applications, we've got you covered.
          </p>
        </div>

        {/* Plan Type Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-full p-1 shadow-md border border-gray-200">
            <button
              onClick={() => setPlanType('individual')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                planType === 'individual'
                  ? 'bg-black text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Individual
            </button>
            <button
              onClick={() => setPlanType('enterprise')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                planType === 'enterprise'
                  ? 'bg-black text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Teams & Enterprise
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.highlighted
                  ? 'border-black shadow-xl scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Best Value Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-black text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <span className="text-3xl">{plan.icon}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-gray-900">
                    ${isAnnual && plan.annualPrice ? Math.floor(plan.annualPrice / 12) : plan.price}
                  </span>
                  <span className="text-gray-500 ml-2">/ {plan.period}</span>
                </div>
                {isAnnual && plan.annualSavings && (
                  <div className="mt-2">
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                      Save ${plan.annualSavings}
                    </span>
                  </div>
                )}
              </div>

              {/* Annual Toggle (only for paid plans) */}
              {plan.price > 0 && (
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Annual billing</span>
                  <button
                    onClick={() => setIsAnnual(!isAnnual)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                      isAnnual ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        isAnnual ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              )}

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                className={`w-full py-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                  plan.highlighted
                    ? 'bg-black hover:bg-gray-800 text-white shadow-lg'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Enterprise Contact */}
        {planType === 'enterprise' && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-12 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Need something more?
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Contact our enterprise team for custom solutions, dedicated support, and volume pricing.
              </p>
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105">
                Contact Sales
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Pricing;