import Silk from '@/components/Silk';
import CardNav from '@/components/CardNav';
import logo from '@/Assets/logo.png';
import TargetCursor from '@/components/TargetCursor';
import CardSwap, { Card } from '@/components/CardSwap';
import ScrollReveal from '@/components/ScrollReveal';
import ScrambledText from '@/components/ScrambledText';
import CurvedLoop from '@/components/CurvedLoop';

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
        {
          label: 'Github',
          ariaLabel: 'Github',
          href: 'https://github.com/iamsurajthakur',
        },
        {
          label: 'LinkedIn',
          ariaLabel: 'LinkedIn',
          href: 'https://www.linkedin.com/in/suraj-thakur7/',
        },
      ],
    },
  ];

  return (
    <>
      {/* Cursor effect */}
      <TargetCursor
        spinDuration={2}
        hideDefaultCursor
        parallaxOn
        hoverDuration={0.2}
      />

      {/* Background Silk - Fixed positioning */}
      <div className="fixed inset-0 w-full h-full -z-10">
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
          className="cursor-target"
        />
      </div>

      {/* Scrollable content wrapper */}
      <div className="relative min-h-screen -mt-1 w-full">
        {/* Hero section */}
        <div className="h-screen w-full flex flex-col items-center justify-center text-white px-4">
          <div className="flex flex-col items-center justify-between mt-32">
            <div className="flex flex-col items-center justify-between mt-32">
              <h1 className="text-4xl md:text-6xl font-semibold max-w-lg md:max-w-2xl text-center mt-4 leading-tight md:leading-tight">
                Build stunning{' '}
                <span className="relative bg-linear-to-r from-purple-700 to-[#764de1] bg-clip-text text-transparent">
                  slides
                  <div className="z-10 absolute bottom-0 left-0 w-full scale-120">
                    <img
                      src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gradient_arc.svg"
                      alt="gradient"
                    />
                  </div>
                </span>{' '}
                <span className="relative bg-linear-to-r from-[#764de1] to-indigo-600 bg-clip-text text-transparent">
                  with
                </span>{' '}
                Prezent.
              </h1>
              <p className="text-sm text-white-600 text-center max-w-157.5 mt-4">
                We design high-impact websites that convert and scale. From
                sleek interfaces to full stack experiences, we bring your brand
                to life online.
              </p>

              <div className="flex gap-3 mt-10">
                <button className="bg-violet-600 hover:bg-violet-700 text-white text-xs md:text-sm px-6 py-3 rounded-lg transition cursor-pointer">
                  Get Started Now
                </button>
                <button className="bg-white hover:bg-white/5 border border-violet-400 text-gray-600 text-xs md:text-sm px-5 py-3 rounded-lg transition cursor-pointer">
                  Book a demo
                </button>
              </div>

              <div className="w-full max-w-200 h-0.75 mt-15 bg-linear-to-r from-white/10 via-violet-600 to-white/10"></div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-18 max-w-232.5 w-full">
                <div className="text-center">
                  <h2 className="font-medium text-2xl md:text-3xl text-white-800">
                    20+
                  </h2>
                  <p className="text-xs md:text-sm text-white-500">
                    Years Experience
                  </p>
                </div>
                <div className="text-center">
                  <h2 className="font-medium text-2xl md:text-3xl text-white-800">
                    12k+
                  </h2>
                  <p className="text-xs md:text-sm text-white-500">
                    Projects Completed
                  </p>
                </div>
                <div className="text-center">
                  <h2 className="font-medium text-2xl md:text-3xl text-white-800">
                    5k+
                  </h2>
                  <p className="text-xs md:text-sm text-white-500">
                    Happy Customers
                  </p>
                </div>
                <div className="text-center">
                  <h2 className="font-medium text-2xl md:text-3xl text-white-800">
                    5+
                  </h2>
                  <p className="text-xs md:text-sm text-white-500">Countries</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CurvedLoop
          marqueeText="Be ✦ Creative ✦ With ✦ React ✦ Bits ✦"
          speed={2}
          curveAmount={300}
          direction="right"
          interactive
          className="custom-text-style"
        />

        {/* Additional sections below */}
        <div className="w-full text-white px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <section className="mb-16"></section>
          </div>
        </div>
      </div>

      {/* use Cases section  */}
      <div className="w-full min-h-screen flex items-center justify-center px-6 sm:px-6 md:px-8 py-12 md:py-20 overflow-hidden">
        <div className="max-w-7xl w-full flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Side Content */}
          <div className="text-white mt-50 space-y-4 md:space-y-6 w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <ScrollReveal
                baseOpacity={0.1}
                enableBlur
                baseRotation={3}
                blurStrength={4}
              >
                Transform Documents into Presentations
              </ScrollReveal>
            </h2>
            <ScrambledText
              className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto lg:mx-0"
              radius={100}
              duration={1.2}
              speed={0.5}
              scrambleChars=".:"
            >
              Our AI-powered platform analyzes your documents and automatically
              creates stunning, professional presentations in seconds.
            </ScrambledText>
          </div>

          {/* Right Side - CardSwap (Hidden on mobile, visible on lg and above) */}
          <div className="hidden lg:flex relative w-full lg:w-1/2 justify-center lg:justify-end">
            <div
              className="relative w-full max-w-150"
              style={{
                height: '500px',
              }}
            >
              <CardSwap
                width={500}
                height={400}
                cardDistance={40}
                verticalDistance={30}
                delay={5000}
                pauseOnHover={true}
              >
                <Card>
                  <div className="p-8 flex flex-col justify-center h-full">
                    <h3 className="text-3xl font-bold text-white mb-4">
                      Upload
                    </h3>
                    <p className="text-white/80 text-lg">
                      Drop your documents and let AI do the work
                    </p>
                  </div>
                </Card>
                <Card>
                  <div className="p-8 flex flex-col justify-center h-full">
                    <h3 className="text-3xl font-bold text-white mb-4">
                      Transform
                    </h3>
                    <p className="text-white/80 text-lg">
                      AI creates beautiful, structured slides
                    </p>
                  </div>
                </Card>
                <Card>
                  <div className="p-8 flex flex-col justify-center h-full">
                    <h3 className="text-3xl font-bold text-white mb-4">
                      Present
                    </h3>
                    <p className="text-white/80 text-lg">
                      Download and share your presentation
                    </p>
                  </div>
                </Card>
              </CardSwap>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
