// Mock data for Emergent.sh clone

export const navigationLinks = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'FAQs', href: '#faqs' },
  { name: 'Enterprise', href: '#enterprise' }
];

export const features = [
  {
    id: 1,
    icon: 'Monitor',
    title: 'Build websites and mobile apps',
    description: 'Transform your ideas into fully functional web apps and mobile apps with instant deployment, seamless data connections, and powerful scalability.'
  },
  {
    id: 2,
    icon: 'Bot',
    title: 'Build custom agents',
    description: 'Create intelligent AI agents that automate tasks, handle customer queries, and streamline your workflows with advanced machine learning.'
  },
  {
    id: 3,
    icon: 'Plug',
    title: 'Build powerful integrations',
    description: 'Connect seamlessly with your favorite tools and services. Integrate payment gateways, CRMs, databases, and third-party APIs effortlessly.'
  },
  {
    id: 4,
    icon: 'Users',
    title: 'Build with your favourite people',
    description: 'Collaborate in real-time with your team. Share projects, manage permissions, and build together with version control and live updates.'
  }
];

export const pricingPlans = [
  {
    id: 1,
    name: 'Free',
    icon: '🎁',
    description: 'Get started with essential features at no cost',
    price: 0,
    period: 'month',
    features: [
      '3 projects',
      'Basic templates',
      'Community support',
      '1GB storage',
      'Basic analytics'
    ],
    cta: 'Get Started',
    highlighted: false
  },
  {
    id: 2,
    name: 'Standard',
    icon: '⚡',
    description: 'Perfect for first-time builders',
    price: 17,
    annualPrice: 204,
    period: 'month',
    annualSavings: 36,
    features: [
      '10 projects',
      'Premium templates',
      'Priority support',
      '10GB storage',
      'Advanced analytics',
      'Custom domains',
      'API access'
    ],
    cta: 'Start Building',
    highlighted: false
  },
  {
    id: 3,
    name: 'Pro',
    icon: '✨',
    description: 'Built for serious creators and brands',
    price: 167,
    annualPrice: 2004,
    period: 'month',
    annualSavings: 396,
    features: [
      'Unlimited projects',
      'All templates',
      'Dedicated support',
      'Unlimited storage',
      'White-label options',
      'Advanced integrations',
      'Team collaboration',
      'Priority builds'
    ],
    cta: 'Go Pro',
    highlighted: true
  }
];

export const showcaseApps = [
  {
    id: 1,
    title: 'Streaming Platform',
    description: 'Full-featured video streaming app',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    category: 'Entertainment'
  },
  {
    id: 2,
    title: 'Health Tracker',
    description: 'Personalized wellness dashboard',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    category: 'Healthcare'
  },
  {
    id: 3,
    title: 'Creative Portfolio',
    description: 'Bold artist showcase website',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    category: 'Design'
  }
];

export const faqs = [
  {
    id: 1,
    question: 'What is Emergent?',
    answer: 'Emergent is an AI-powered platform that helps you build full-stack web and mobile applications in minutes, not months. No coding required.'
  },
  {
    id: 2,
    question: 'Do I need coding experience?',
    answer: 'Not at all! Emergent is designed for everyone. Simply describe what you want to build, and our AI handles the rest.'
  },
  {
    id: 3,
    question: 'Can I export my code?',
    answer: 'Yes! You own your code completely. Export it anytime and host it anywhere you like.'
  },
  {
    id: 4,
    question: 'What kind of apps can I build?',
    answer: 'You can build virtually anything - from simple landing pages to complex SaaS applications, e-commerce stores, mobile apps, and more.'
  },
  {
    id: 5,
    question: 'Is there a free trial?',
    answer: 'Yes! Our Free plan lets you explore Emergent with 3 projects and essential features. No credit card required.'
  }
];

export const stats = {
  users: '3M+',
  description: 'worldwide building & launching real applications in minutes.',
  badge: 'Combinator W24'
};