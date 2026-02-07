import Grainient from '@/components/Home/Grainient';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <main style={{ fontFamily: "Poppins, sans-serif" }} className="relative overflow-hidden flex h-screen items-center justify-center w-full px-4">
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
      <form className="flex w-full p-5 bg-[#0d0f0e] rounded-sm flex-col max-w-100">
        <a
          href=""
          className="mb-8"
          title="Go to PrebuiltUI"
        >
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

        <h2 className="text-4xl font-medium text-white">Login</h2>

        <p className="mt-4 text-base text-gray-500/90">
          Please enter email and password to access.
        </p>

        <div className="mt-10">
          <label className="font-medium text-white">Email</label>
          <input
            placeholder="Please enter your email"
            className="mt-2 rounded-md ring placeholder:text-sm text-white ring-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none px-3 py-3 w-full"
            required
            type="email"
            name="email"
          />
        </div>

        <div className="mt-6">
          <label className="font-medium text-white">Password</label>
          <input
            placeholder="Please enter your password"
            className="mt-2 rounded-md ring placeholder:text-sm text-white ring-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none px-3 py-3 w-full"
            required
            type="password"
            name="password"
          />
        </div>

        <button
          type="submit"
          className="mt-8 py-3 w-full cursor-pointer rounded-md bg-indigo-600 text-white transition hover:bg-indigo-700"
        >
          Login
        </button>
        <p className="text-center text-white py-8">
          Don't have an account?{' '}
          <Link to="/register">
          <a href="/signup" className="text-indigo-600 hover:underline">
            Register
          </a>
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Login;
