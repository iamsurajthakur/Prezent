import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Grainient from '@/components/Home/Grainient';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '@/Api/auth';
import { useAuthStore } from '@/States/auth.states';
import { Spinner } from '@/components/ui/spinner';

const Login = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const inputsRef = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRef = useRef(null);
  const footerRef = useRef(null);
  const overlayRef = useRef(null);

  //state for login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //state for authentication using zustand
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([logoRef.current, titleRef.current, subtitleRef.current], {
        opacity: 0,
        y: -20,
      });
      gsap.set(inputsRef.current, { opacity: 0, x: -30 });
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
        // Inputs stagger
        .to(
          inputsRef.current,
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.1,
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

    setLoading(true);

    try {
      await loginUser({ email, password });

      setIsAuthenticated(true);
      navigate('/dashboard');
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
        className="flex w-full p-5 bg-[#0d0f0e] rounded-sm flex-col max-w-100"
        onSubmit={handleSubmit}
      >
        <a ref={logoRef} href="" className="mb-8" title="Go to PrebuiltUI">
          <svg
            className="size-10"
            width="30"
            height="33"
            viewBox="0 0 30 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m8 4.55 6.75 3.884 6.75-3.885M8 27.83v-7.755L1.25 16.19m27 0-6.75 3.885v7.754M1.655 8.658l13.095 7.546 13.095-7.546M14.75 31.25V16.189m13.5 5.976V10.212a2.98 2.98 0 0 0-1.5-2.585L16.25 1.65a3.01 3.01 0 0 0-3 0L2.75 7.627a3 3 0 0 0-1.5 2.585v11.953a2.98 2.98 0 0 0 1.5 2.585l10.5 5.977a3.01 3.01 0 0 0 3 0l10.5-5.977a3 3 0 0 0 1.5-2.585"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>

        <h2 ref={titleRef} className="text-4xl font-medium text-white">
          Login
        </h2>

        <p ref={subtitleRef} className="mt-4 text-base text-gray-500/90">
          Please enter email and password to access.
        </p>

        <div
          ref={(el) => {
            inputsRef.current[0] = el;
          }}
          className="mt-10"
        >
          <label className="font-medium text-white">Email</label>
          <input
            placeholder="Please enter your email"
            className="mt-2 rounded-md ring placeholder:text-sm text-white bg-transparent ring-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none px-3 py-3 w-full transition-all duration-300"
            required
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div
          ref={(el) => {
            inputsRef.current[1] = el;
          }}
          className="mt-6"
        >
          <label className="font-medium text-white">Password</label>
          <input
            placeholder="Please enter your password"
            className="mt-2 rounded-md ring placeholder:text-sm text-white bg-transparent ring-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none px-3 py-3 w-full transition-all duration-300"
            required
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-400">{error}</p>}
        <button
          ref={buttonRef}
          type="submit"
          disabled={loading}
          className="mt-8 py-3 w-full flex items-center justify-center cursor-pointer rounded-md bg-indigo-600 text-white transition hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <React.Fragment>
              <Spinner />
              Logging in...
            </React.Fragment>
          ) : (
            <React.Fragment>
              Login
            </React.Fragment>
          )}
        </button>

        <p ref={footerRef} className="text-center text-white py-8">
          Don't have an account?{' '}
          <Link
            to="/register"
            onClick={(e) => handleNavigate(e, '/register')}
            className="text-indigo-600 hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Login;
