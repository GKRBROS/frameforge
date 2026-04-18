import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Demo } from './pages/Demo';
import { Services } from './pages/Services';
import { HowItWorks } from './pages/HowItWorks';
import { Integration } from './pages/Integration';
import { Contact } from './pages/Contact';
import { Loader } from './components/Loader';

export const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingFinished = () => {
    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <Loader key="loader" onFinished={handleLoadingFinished} />}
      </AnimatePresence>
      
      {!isLoading && (
        <Router>
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
        </Router>
      )}
    </>
  );
};

export default App;
