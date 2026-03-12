import { useAuthStore } from '@/States/auth.states';
import React from 'react';
import { Link } from 'react-router-dom';

type StarBorderProps<T extends React.ElementType> =
  React.ComponentPropsWithoutRef<T> & {
    as?: T;
    className?: string;
    children?: React.ReactNode;
    color?: string;
    speed?: React.CSSProperties['animationDuration'];
    thickness?: number;
  };

const StarBorder = <T extends React.ElementType = 'button'>({
  as,
  className = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  children,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || 'button';
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <>
      {/* Component-scoped animations */}
      <style>{`
        @keyframes star-movement-bottom {
          0% {
            transform: translate(0%, 0%);
            opacity: 1;
          }
          100% {
            transform: translate(-100%, 0%);
            opacity: 0;
          }
        }

        @keyframes star-movement-top {
          0% {
            transform: translate(0%, 0%);
            opacity: 1;
          }
          100% {
            transform: translate(100%, 0%);
            opacity: 0;
          }
        }
      `}</style>

      <Component
        className={`relative inline-block overflow-hidden rounded-2xl ${className}`}
        {...(rest as any)}
        style={{
          padding: `${thickness}px 0`,
          ...(rest as any).style,
        }}
      >
        <div
          className="absolute w-[300%] h-[50%] opacity-70 -bottom-2.75 right-[-250%] z-0"
          style={{
            background: `radial-gradient(circle, ${color}, transparent 10%)`,
            animation: `star-movement-bottom linear infinite alternate`,
            animationDuration: speed,
          }}
        />

        <div
          className="absolute w-[300%] h-[50%] opacity-70 -top-2.5 left-[-250%] z-0"
          style={{
            background: `radial-gradient(circle, ${color}, transparent 10%)`,
            animation: `star-movement-top linear infinite alternate`,
            animationDuration: speed,
          }}
        />

        <Link to={isAuthenticated ? '/dashboard' : '/register'}>
          <div className="relative z-1 bg-linear-to-b from-black to-gray-900 border border-gray-800 text-white text-center py-4 px-6 text-[16px] leading-none">
            {children}
          </div>
        </Link>
      </Component>
    </>
  );
};

export default StarBorder;
