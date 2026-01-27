import Silk from "@/components/Silk";

const Home = () => {
  return (
    <div className="w-screen h-screen overflow-hidden">
      {/* Background Silk - Fixed positioning */}
      <div className="fixed inset-0 w-full h-full">
        <Silk
          speed={5}
          scale={1}
          color="#5227ff"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>

      {/* Content wrapper - removed the outer overlay */}
      <div className="fixed inset-0 w-full h-full pointer-events-none">
        <div className="relative w-full h-full flex flex-col items-center justify-center text-white px-4 pointer-events-auto">
          
          {/* Main heading with text shadow instead of drop-shadow */}
          <h1 
            className="text-6xl font-bold mb-4 text-center"
            style={{
              textShadow: '0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6), 2px 2px 4px rgba(0,0,0,0.9)'
            }}
          >
            Welcome to AI Presentation Maker
          </h1>
          
          {/* Subheading */}
          <p 
            className="text-2xl mb-8 text-center max-w-2xl"
            style={{
              textShadow: '0 0 15px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.6), 1px 1px 3px rgba(0,0,0,0.9)'
            }}
          >
            Create stunning presentations in minutes with the power of AI
          </p>

          {/* Buttons with stronger shadows */}
          <div className="flex gap-4 mb-12">
            <button 
              className="px-8 py-4 bg-white text-[#5227ff] rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
              style={{
                boxShadow: '0 0 30px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.6)'
              }}
            >
              Get Started
            </button>
            <button 
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-[#5227ff] transition-all"
              style={{
                boxShadow: '0 0 30px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.6)'
              }}
            >
              Learn More
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;