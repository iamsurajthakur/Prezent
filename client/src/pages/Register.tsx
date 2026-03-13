import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Grainient from '@/components/Home/Grainient';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '@/Api/auth';
import { Spinner } from '@/components/ui/spinner';
import Logo from '@/Assets/logo.png'

const Register = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const inputRowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRef = useRef(null);
  const footerRef = useRef(null);
  const overlayRef = useRef(null);

  // States for registration
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([logoRef.current, titleRef.current, subtitleRef.current], {
        opacity: 0,
        y: -20,
      });
      gsap.set(inputRowsRef.current, { opacity: 0, x: -30 });
      gsap.set([buttonRef.current, footerRef.current], { opacity: 0, y: 20 });
      gsap.set(overlayRef.current, { scaleY: 1 });

      // Create timeline
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      // Overlay exit
      tl.to(overlayRef.current, {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 0.8,
        ease: 'power3.inOut',
      })
        // Logo entrance
        .to(
          logoRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          '-=0.3'
        )
        // Title and subtitle
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          '-=0.3'
        )
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          '-=0.4'
        )
        // Input rows stagger
        .to(
          inputRowsRef.current,
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.15,
          },
          '-=0.3'
        )
        // Button and footer
        .to(
          buttonRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          '-=0.3'
        )
        .to(
          footerRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          '-=0.4'
        );
    }, formRef);

    return () => ctx.revert();
  }, []);

  const handleNavigate = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault();

    const tl = gsap.timeline({
      onComplete: () => {
        navigate(path);
      },
    });

    tl.to(overlayRef.current, {
      scaleY: 1,
      transformOrigin: 'bottom',
      duration: 0.6,
      ease: 'power3.inOut',
    }).to(
      formRef.current,
      {
        opacity: 0,
        y: -30,
        duration: 0.4,
        ease: 'power3.in',
      },
      '-=0.4'
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password != confirmPassword) {
      setError('Password does not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({
        fullName,
        email,
        password,
        confirmPassword,
      });
      console.log(response);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{ fontFamily: 'Poppins, sans-serif' }}
      className="relative overflow-hidden flex h-screen items-center justify-center w-full px-4"
    >
      {/* Transition Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 bg-[#1b0760] pointer-events-none"
      />

      <div className="absolute inset-0 -z-10">
        <Grainient
          color1="#2f203c"
          color2="#5530e8"
          color3="#342a55"
          timeSpeed={0.25}
          colorBalance={0.06}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      <form
        ref={formRef}
        className="flex w-full p-5 bg-[#0d0f0e] rounded-sm flex-col max-w-120"
        onSubmit={handleSubmit}
      >
        <a ref={logoRef} href="/" className="mb-4 p-2" title="Go to PrebuiltUI">
         <img src={Logo} className='h-14 w-auto' alt="Logo" />
        </a>

        <h2 ref={titleRef} className="text-4xl font-medium text-[#F5F3F5]">
          Create Account
        </h2>

        <p ref={subtitleRef} className="mt-4 text-base text-gray-500/90">
          Please fill the details below to register.
        </p>

        {/* Full Name + Email */}
        <div
          ref={(el) => {
            inputRowsRef.current[0] = el;
          }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="font-medium text-[#F5F3F5]">Full Name</label>
            <input
              placeholder="Enter your full name"
              className="mt-2 placeholder:text-sm rounded-md ring text-[#F5F3F5] bg-transparent ring-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none px-3 py-3 w-full transition-all duration-300"
              required
              type="text"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="font-medium text-[#F5F3F5]">Email</label>
            <input
              placeholder="Enter your email"
              className="mt-2 rounded-md ring placeholder:text-sm text-[#F5F3F5] bg-transparent ring-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none px-3 py-3 w-full transition-all duration-300"
              required
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password + Confirm Password */}
        <div
          ref={(el) => {
            inputRowsRef.current[1] = el;
          }}
          className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="font-medium text-[#F5F3F5]">Password</label>
            <input
              placeholder="Create password"
              className="mt-2 rounded-md ring text-[#F5F3F5] placeholder:text-sm bg-transparent ring-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none px-3 py-3 w-full transition-all duration-300"
              required
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="font-medium text-[#F5F3F5]">
              Confirm Password
            </label>
            <input
              placeholder="Confirm your password"
              className="mt-2 rounded-md placeholder:text-sm ring text-[#F5F3F5] bg-transparent ring-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none px-3 py-3 w-full transition-all duration-300"
              required
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        {error && <p className="text-red-400 mt-2">{error}</p>}
        <button
          ref={buttonRef}
          type="submit"
          disabled={loading}
          className="mt-8 py-3 w-full flex items-center justify-center cursor-pointer rounded-md bg-indigo-600 text-[#F5F3F5] transition hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <React.Fragment>
              <Spinner />
              <span className='gap-2 w-1'></span>
              Registering...
            </React.Fragment>
          ) : (
            <React.Fragment>
              Register
            </React.Fragment>
          )}
        </button>

        <p ref={footerRef} className="text-center text-[#F5F3F5] py-8">
          Already have an account?{' '}
          <Link
            to="/login"
            onClick={(e) => handleNavigate(e, '/login')}
            className="text-indigo-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Register;
