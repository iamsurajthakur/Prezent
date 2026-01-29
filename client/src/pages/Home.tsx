import Silk from '@/components/Silk';
import CardNav from '@/components/CardNav';
import logo from '@/Assets/logo.png';

const Home = () => {
const items = [
  {
    label: 'Product',
    bgColor: 'rgba(1, 0, 56, 0.8)',
    textColor: '#fff',
links: [
    {
      label: 'How It Works',
      ariaLabel: 'How the AI presentation generator works',
      href: '/product/how-it-works',
    },
    {
      label: 'Features',
      ariaLabel: 'AI presentation features',
      href: '/product/features',
    },
    {
      label: 'Supported Files',
      ariaLabel: 'Supported document formats',
      href: '/product/supported-files',
    },
  ],
  },
  {
    label: 'Use Cases',
    bgColor: 'rgba(41, 58, 128, 0.8)',
    textColor: '#fff',
links: [
    {
      label: 'Students',
      ariaLabel: 'AI presentations for students',
      href: '/use-cases/students',
    },
    {
      label: 'Professionals',
      ariaLabel: 'AI presentations for professionals',
      href: '/use-cases/professionals',
    },
    {
      label: 'Startups',
      ariaLabel: 'AI presentations for startups',
      href: '/use-cases/startups',
    },
  ],
  },
  {
    label: 'Contact',
    bgColor: 'rgba(83, 126, 197, 0.5)',
    textColor: '#fff',
    links: [
      {
        label: 'Email',
        ariaLabel: 'Email us',
        href: 'mailto:suraj.here@outlook.com',
      },
      { label: 'Github', ariaLabel: 'Github', href: 'https://github.com/iamsurajthakur' },
      {
        label: 'LinkedIn',
        ariaLabel: 'LinkedIn',
        href: 'https://www.linkedin.com/in/suraj-thakur7/',
      },
    ],
  },
];

  return (
    <div className="w-screen h-screen overflow-hidden">
      {/* Background Silk - Fixed positioning */}
      <div className="fixed inset-0 w-full h-full">
        <Silk
          speed={5}
          scale={1}
          color="#5227ff"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>

      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <CardNav
          logo={logo}
          logoAlt="AI Presentation Maker"
          items={items}
          menuColor="#FFFFFC"
          buttonBgColor="#1F1300"
          buttonTextColor="#fff"
          ease="back.out(1.7)"
        />
      </div>

      {/* Content wrapper */}
      <div className="fixed inset-0 w-full h-full pointer-events-none">
        <div className="relative w-full h-full flex flex-col items-center justify-center text-white px-4 pointer-events-auto">

          
        </div>
      </div>
    </div>
  );
};

export default Home;
