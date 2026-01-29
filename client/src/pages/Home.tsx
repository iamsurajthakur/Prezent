import Silk from '@/components/Silk';
import CardNav from '@/components/CardNav';
import logo from '@/Assets/logo.png';
import TargetCursor from '@/components/TargetCursor';
import CardSwap, { Card } from '@/components/CardSwap';
import ScrollReveal from '@/components/ScrollReveal';
import ScrambledText from '@/components/ScrambledText';

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
      <div className="relative min-h-screen w-full">
        {/* Hero section */}
        <div className="h-screen w-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-5xl font-bold">Your Hero Content</h1>
          <p className="text-xl mt-4">Welcome to AI Presentation Maker</p>
        </div>

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
