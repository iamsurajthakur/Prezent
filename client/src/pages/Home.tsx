import Silk from '@/components/Silk';
import CardNav from '@/components/CardNav';
import logo from '../../public/logo.png';

const Home = () => {
  const items = [
    {
      label: 'About',
      bgColor: '#0D0716',
      textColor: '#fff',
      links: [
        {
          label: 'Company',
          ariaLabel: 'About Company',
          href: '/about/company',
        },
        { label: 'Careers', ariaLabel: 'About Careers', href: '/about/career' },
      ],
    },
    {
      label: 'Projects',
      bgColor: '#170D27',
      textColor: '#fff',
      links: [
        {
          label: 'Featured',
          ariaLabel: 'Featured Projects',
          href: '/projects/featured',
        },
        {
          label: 'Case Studies',
          ariaLabel: 'Project Case Studies',
          href: '/projects/case_studies',
        },
      ],
    },
    {
      label: 'Contact',
      bgColor: '#271E37',
      textColor: '#fff',
      links: [
        {
          label: 'Email',
          ariaLabel: 'Email us',
          href: 'mailto:contact@example.com',
        },
        { label: 'Twitter', ariaLabel: 'Twitter', href: 'https://twitter.com' },
        {
          label: 'LinkedIn',
          ariaLabel: 'LinkedIn',
          href: 'https://linkedin.com',
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
          baseColor="#fff"
          menuColor="#000"
          buttonBgColor="#111"
          buttonTextColor="#fff"
          ease="back.out(1.7)"
        />
      </div>

      {/* Content wrapper */}
      <div className="fixed inset-0 w-full h-full pointer-events-none">
        <div className="relative w-full h-full flex flex-col items-center justify-center text-white px-4 pointer-events-auto">
          {/* Main heading with text shadow */}
          <h1
            className="text-6xl font-bold mb-4 text-center"
            style={{
              textShadow:
                '0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6), 2px 2px 4px rgba(0,0,0,0.9)',
            }}
          >
            Welcome to AI Presentation Maker
          </h1>

          {/* Subheading */}
          <p
            className="text-2xl mb-8 text-center max-w-2xl"
            style={{
              textShadow:
                '0 0 15px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.6), 1px 1px 3px rgba(0,0,0,0.9)',
            }}
          >
            Create stunning presentations in minutes with the power of AI
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mb-12">
            <button
              className="px-8 py-4 bg-white text-[#5227ff] rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
              style={{
                boxShadow:
                  '0 0 30px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.6)',
              }}
            >
              Get Started
            </button>
            <button
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-[#5227ff] transition-all"
              style={{
                boxShadow:
                  '0 0 30px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.6)',
              }}
            >
              Learn More
            </button>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
            <div
              className="bg-black/40 backdrop-blur-md p-8 rounded-xl border-2 border-white/40"
              style={{
                boxShadow: '0 0 40px rgba(0,0,0,0.8)',
              }}
            >
              <h3 className="text-3xl font-bold mb-3">🎨 Beautiful Designs</h3>
              <p className="text-lg">
                Professional templates and stunning visuals
              </p>
            </div>
            <div
              className="bg-black/40 backdrop-blur-md p-8 rounded-xl border-2 border-white/40"
              style={{
                boxShadow: '0 0 40px rgba(0,0,0,0.8)',
              }}
            >
              <h3 className="text-3xl font-bold mb-3">⚡ Lightning Fast</h3>
              <p className="text-lg">Generate presentations in seconds</p>
            </div>
            <div
              className="bg-black/40 backdrop-blur-md p-8 rounded-xl border-2 border-white/40"
              style={{
                boxShadow: '0 0 40px rgba(0,0,0,0.8)',
              }}
            >
              <h3 className="text-3xl font-bold mb-3">🤖 AI Powered</h3>
              <p className="text-lg">Smart suggestions and auto-formatting</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
