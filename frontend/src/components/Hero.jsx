import React from 'react';
import { Button } from './ui/button';
import { Mail } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-gray-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-100 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <div className="flex-1 max-w-2xl space-y-8">
          {/* Animated Logo/Icon */}
          <div className="inline-block">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-xl transform hover:scale-110 transition-transform duration-300">
              E
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Build Full-Stack
            </h1>
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
              Web & Mobile Apps in minutes
            </h1>
          </div>

          {/* Sign-in Options */}
          <div className="space-y-4 pt-8">
            {/* Google Sign-in */}
            <Button
              className="w-full max-w-md bg-black hover:bg-gray-800 text-white py-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            {/* GitHub & Apple in a row */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 py-6 rounded-xl border-2 hover:bg-gray-50 transition-all duration-300 hover:scale-105"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </Button>
              <Button
                variant="outline"
                className="flex-1 py-6 rounded-xl border-2 hover:bg-gray-50 transition-all duration-300 hover:scale-105"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              </Button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 py-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-400 text-sm">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Email Sign-in */}
            <Button
              variant="outline"
              className="w-full max-w-md py-6 rounded-xl border-2 hover:bg-gray-50 transition-all duration-300 hover:scale-105"
            >
              <Mail className="w-5 h-5 mr-3" />
              Continue with Email
            </Button>

            {/* Terms */}
            <p className="text-sm text-gray-500 pt-4">
              By continuing, you agree to our{' '}
              <a href="#" className="text-gray-700 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-gray-700 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>

        {/* Right Content - Showcase */}
        <div className="flex-1 relative hidden lg:block">
          <div className="relative">
            {/* Main showcase image/mockup */}
            <div className="relative bg-gradient-to-br from-blue-400 to-cyan-500 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <div className="bg-white rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-600 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-24 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl"></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-20 bg-gray-100 rounded-lg"></div>
                    <div className="h-20 bg-gray-100 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating stat badge */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 transform hover:scale-110 transition-transform duration-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">3M+</div>
                <div className="text-xs text-gray-500">Active Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;