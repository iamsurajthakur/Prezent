import { Suspense, lazy } from 'react';

const Silk = lazy(() => import('./Silk'));

export default function GrainientLazy() {
  return (
    <Suspense fallback={null}>
      <Silk
        speed={5}
        scale={1}
        color="#5227ff"
        noiseIntensity={1.5}
        rotation={0}
      />
    </Suspense>
  );
}
