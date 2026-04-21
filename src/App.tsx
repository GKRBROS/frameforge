import { Suspense, lazy, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Loader } from "./components/Loader";

const Layout = lazy(() =>
  import("./components/Layout").then((m) => ({ default: m.Layout })),
);
const Home = lazy(() =>
  import("./pages/Home").then((m) => ({ default: m.Home })),
);
const Demo = lazy(() =>
  import("./pages/Demo").then((m) => ({ default: m.Demo })),
);
const Services = lazy(() =>
  import("./pages/Services").then((m) => ({ default: m.Services })),
);
const HowItWorks = lazy(() =>
  import("./pages/HowItWorks").then((m) => ({ default: m.HowItWorks })),
);
const Integration = lazy(() =>
  import("./pages/Integration").then((m) => ({ default: m.Integration })),
);
const Contact = lazy(() =>
  import("./pages/Contact").then((m) => ({ default: m.Contact })),
);

export const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingFinished = () => {
    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <Loader key="loader" onFinished={handleLoadingFinished} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <Router>
          <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="demo" element={<Demo />} />
                <Route path="services" element={<Services />} />
                <Route path="how-it-works" element={<HowItWorks />} />
                <Route path="integration" element={<Integration />} />
                <Route path="contact" element={<Contact />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      )}
    </>
  );
};

export default App;
