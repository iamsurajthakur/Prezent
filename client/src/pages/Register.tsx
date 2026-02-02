// Register.tsx
import AnimatedPageWrapper from '@/components/GSAP/authAnimation';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <AnimatedPageWrapper direction="right">
      <h2 className="stagger text-3xl font-bold text-center">Register</h2>
      <form className="stagger mt-6 flex flex-col gap-4 max-w-md mx-auto">
        <input type="text" placeholder="Name" className="p-3 border rounded" />
        <input type="email" placeholder="Email" className="p-3 border rounded" />
        <input type="password" placeholder="Password" className="p-3 border rounded" />
        <button className="stagger bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
          Register
        </button>
      </form>
      <p className="stagger mt-4 text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-green-500 hover:underline">
          Login
        </Link>
      </p>
    </AnimatedPageWrapper>
  );
};

export default Register;