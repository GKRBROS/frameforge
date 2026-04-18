import { useState, useEffect } from "react";
import { AppMockup } from "./components/AppMockup";
import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import { SecondSection } from "./components/SecondSection";
import { LoadingScreen } from "./components/LoadingScreen";

export const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoadComplete = () => {
      setIsLoading(false);
    };

    // Trigger the loading completion through the LoadingScreen component
    if (isLoading) {
      // Keep loading until LoadingScreen completes
    }
  }, [isLoading]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <LoadingScreen onLoadComplete={handleLoadingComplete} />}
      <div className="min-h-screen bg-[#111111] text-white">
        <Navbar />
        <Hero />
        <section className="bg-[#111111]">
          <AppMockup />
        </section>
        <SecondSection />
      </div>
    </>
  );
};

export default App;
