import Silk from '@/components/Silk';
import CardNav from '@/components/CardNav';
import logo from '@/Assets/logo.png';
import TargetCursor from '@/components/TargetCursor';
import CardSwap, { Card } from '@/components/CardSwap';
import ScrollReveal from '@/components/ScrollReveal';
import ScrambledText from '@/components/ScrambledText';
import CurvedLoop from '@/components/CurvedLoop';
import StarBorder from '@/components/StarBorder';
import CountUp from '@/components/CountUp';
import { Link } from 'react-router-dom';

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
  const github = 'https://github.com/iamsurajthakur';

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
              <p className="text-md text-white-600 text-center max-w-157.5 mt-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                We design high-impact websites that convert and scale. From
                sleek interfaces to full stack experiences, we bring your brand
                to life online.
              </p>

              <div className="flex gap-3 mt-10">
                <StarBorder
                  as="button"
                  className="custom-class cursor-target bg-[#070036]"
                  color="magenta"
                  speed="5s"
                >
                  Get Started
                </StarBorder>
                <button className="bg-[#e6e6e6] items-center cursor-target text-black hover:bg-amber-50 px-6 rounded-lg transition cursor-pointer">
                  <Link to={github}>About Me</Link>
                </button>
              </div>

              <div className="w-full max-w-200 h-0.75 mt-15 bg-linear-to-r from-white/10 via-violet-600 to-white/10"></div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-18 max-w-232.5 w-full">
                <div className="text-center">
                  <h2 className="font-medium text-2xl md:text-3xl text-white-800">
                    <CountUp
                      from={0}
                      to={20}
                      separator=","
                      direction="up"
                      duration={2}
                      className="count-up-text"
                    />
                    +
                  </h2>
                  <p className="text-xs md:text-sm text-white-500">
                    Years Experience
                  </p>
                </div>
                <div className="text-center">
                  <h2 className="font-medium text-2xl md:text-3xl text-white-800">
                    <CountUp
                      from={0}
                      to={12}
                      separator=","
                      direction="up"
                      duration={2}
                      className="count-up-text"
                    />
                    k+
                  </h2>
                  <p className="text-xs md:text-sm text-white-500">
                    Projects Completed
                  </p>
                </div>
                <div className="text-center">
                  <h2 className="font-medium text-2xl md:text-3xl text-white-800">
                    <CountUp
                      from={0}
                      to={5}
                      separator=","
                      direction="up"
                      duration={2}
                      className="count-up-text"
                    />
                    k+
                  </h2>
                  <p className="text-xs md:text-sm text-white-500">
                    Happy Customers
                  </p>
                </div>
                <div className="text-center">
                  <h2 className="font-medium text-2xl md:text-3xl text-white-800">
                    <CountUp
                      from={0}
                      to={5}
                      separator=","
                      direction="up"
                      duration={2}
                      className="count-up-text"
                    />
                    +
                  </h2>
                  <p className="text-xs md:text-sm text-white-500">Countries</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CurvedLoop
          marqueeText="Prompt ✦ Generate ✦ Design ✦ Present ✦ Faster ✦"
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
<div className="w-full min-h-screen flex items-center justify-center -mt-120 px-6 sm:px-6 md:px-8 py-12 md:py-20 overflow-hidden">
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
                delay={3000}
                pauseOnHover={true}
              >
                {/* How It Works Card - Glassmorphism Style */}
                <Card>
                  <div className="relative p-10 flex flex-col h-full bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 via-transparent to-violet-500/10"></div>
                    
                    {/* Number Badge */}
                    <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-linear-to-br from-purple-400/30 to-violet-500/30 backdrop-blur-sm border border-purple-300/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    
                    {/* Icon Container */}
                    <div className="relative z-10 mb-8">
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-purple-500 rounded-2xl blur-xl opacity-60"></div>
                        <div className="relative cursor-target w-20 h-20 rounded-2xl bg-linear-to-br from-purple-500 to-violet-600 flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 space-y-4 grow">
                      <div className="space-y-2">
                        <h3 className="text-4xl font-bold bg-linear-to-r from-white to-purple-200 bg-clip-text text-transparent">
                          How It Works
                        </h3>
                        <div className="w-16 h-1 bg-linear-to-r from-purple-500 to-violet-500 rounded-full"></div>
                      </div>
                      <div className="space-y-4 pt-2">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500/30 to-violet-500/30 flex items-center justify-center shrink-0 border border-purple-400/30">
                            <span className="text-sm font-bold text-white">1</span>
                          </div>
                          <div>
                            <p className="text-white/90 font-medium text-sm">Upload Document</p>
                            <p className="text-white/60 text-xs mt-1">Drop your file in any format</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500/30 to-violet-500/30 flex items-center justify-center shrink-0 border border-purple-400/30">
                            <span className="text-sm font-bold text-white">2</span>
                          </div>
                          <div>
                            <p className="text-white/90 font-medium text-sm">AI Processing</p>
                            <p className="text-white/60 text-xs mt-1">Smart content analysis</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500/30 to-violet-500/30 flex items-center justify-center shrink-0 border border-purple-400/30">
                            <span className="text-sm font-bold text-white">3</span>
                          </div>
                          <div>
                            <p className="text-white/90 font-medium text-sm">Get Presentation</p>
                            <p className="text-white/60 text-xs mt-1">Download in seconds</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </Card>

                {/* Features Card - Glassmorphism Style */}
                <Card>
                  <div className="relative p-10 flex flex-col h-full bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-transparent to-cyan-500/10"></div>
                    
                    {/* Number Badge */}
                    <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-linear-to-br from-blue-400/30 to-cyan-500/30 backdrop-blur-sm border border-blue-300/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    
                    {/* Icon Container */}
                    <div className="relative z-10 mb-8">
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-60"></div>
                        <div className="relative cursor-target w-20 h-20 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-600 flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 space-y-4 grow">
                      <div className="space-y-2">
                        <h3 className="text-4xl font-bold bg-linear-to-r from-white to-blue-200 bg-clip-text text-transparent">
                          Features
                        </h3>
                        <div className="w-16 h-1 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                      </div>
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-500/10 border border-blue-400/20">
                          <svg className="w-5 h-5 text-blue-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <p className="text-white/90 text-sm font-medium">AI Content Analysis</p>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-500/10 border border-blue-400/20">
                          <svg className="w-5 h-5 text-blue-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <p className="text-white/90 text-sm font-medium">Professional Templates</p>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-500/10 border border-blue-400/20">
                          <svg className="w-5 h-5 text-blue-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <p className="text-white/90 text-sm font-medium">Instant Export Options</p>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </Card>

                {/* Supported Files Card - Glassmorphism Style */}
                <Card>
                  <div className="relative p-10 flex flex-col h-full bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-transparent to-violet-500/10"></div>
                    
                    {/* Number Badge */}
                    <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-linear-to-br from-indigo-400/30 to-violet-500/30 backdrop-blur-sm border border-indigo-300/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    
                    {/* Icon Container */}
                    <div className="relative z-10 mb-8">
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur-xl opacity-60"></div>
                        <div className="relative cursor-target w-20 h-20 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 space-y-4 grow">
                      <div className="space-y-2">
                        <h3 className="text-4xl font-bold bg-linear-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                          Supported Files
                        </h3>
                        <div className="w-16 h-1 bg-linear-to-r from-indigo-500 to-violet-500 rounded-full"></div>
                      </div>
                      <div className="space-y-2.5 pt-2">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="px-3 py-2 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-center">
                            <span className="text-sm font-bold text-indigo-200">PDF</span>
                          </div>
                          <div className="px-3 py-2 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-center">
                            <span className="text-sm font-bold text-indigo-200">DOCX</span>
                          </div>
                          <div className="px-3 py-2 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-center">
                            <span className="text-sm font-bold text-indigo-200">DOC</span>
                          </div>
                          <div className="px-3 py-2 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-center">
                            <span className="text-sm font-bold text-indigo-200">TXT</span>
                          </div>
                          <div className="px-3 py-2 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-center">
                            <span className="text-sm font-bold text-indigo-200">RTF</span>
                          </div>
                          <div className="px-3 py-2 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-center">
                            <span className="text-sm font-bold text-indigo-200">ODT</span>
                          </div>
                        </div>
                        <p className="text-center text-xs text-indigo-300/70 pt-1">+ MD, PPTX, HTML & more</p>
                      </div>
                    </div>
                    
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
