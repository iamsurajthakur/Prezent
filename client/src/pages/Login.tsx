// Login.tsx
import AnimatedPageWrapper from '@/components/GSAP/authAnimation';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <AnimatedPageWrapper direction="left">
      <h2 className="stagger text-3xl font-bold text-center">Login</h2>
      <form className="stagger mt-6 flex flex-col gap-4 max-w-md mx-auto">
        <input type="email" placeholder="Email" className="p-3 border rounded" />
        <input type="password" placeholder="Password" className="p-3 border rounded" />
        <button className="stagger bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Login
        </button>
      </form>
      <p className="stagger mt-4 text-center text-sm text-gray-400">
        Don’t have an account?{' '}
        <Link to="/register" className="text-blue-500 hover:underline">
          Register
        </Link>
      </p>
    </AnimatedPageWrapper>
  );
};

export default Login;