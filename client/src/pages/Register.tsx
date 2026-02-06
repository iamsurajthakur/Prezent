import Grainient from "@/components/Home/Grainient";

const Register = () => {
  return (
    <main className="relative overflow-hidden flex h-screen items-center justify-center w-full px-4">
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
      
    </main>
  )
};

export default Register;
