import React, { useEffect, useState, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import iconSvg from "../assets/frameforge/icon.svg";

export const Layout = () => {
  const [time, setTime] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Update Time Clock
    function updateTime() {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    }
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    // Reveal Elements on Scroll using Intersection Observer
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    // Initialize observation for elements currently in DOM
    const scanAndObserve = () => {
      document
        .querySelectorAll(".reveal")
        .forEach((el) => revealObserver.observe(el));
    };

    scanAndObserve();

    // MutationObserver to catch elements added after page transitions
    const mutationObserver = new MutationObserver(() => {
      scanAndObserve();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Scroll Effects
    const handleScroll = () => {
      const scrolled = window.scrollY;

      // Navbar Scroll Effect
      const nav = document.getElementById("main-nav");
      if (nav) {
        if (scrolled > 50) {
          nav.classList.add(
            "py-4",
            "bg-[#050505]/80",
            "backdrop-blur-md",
            "border-b",
            "border-white/5",
          );
          nav.classList.remove("py-8", "bg-transparent");
        } else {
          nav.classList.remove(
            "py-4",
            "bg-[#050505]/80",
            "backdrop-blur-md",
            "border-b",
            "border-white/5",
          );
          nav.classList.add("py-8", "bg-transparent");
        }
      }

      // Parallax Logic
      document
        .querySelectorAll<HTMLElement>(".parallax-card-up")
        .forEach((el) => {
          el.style.setProperty("--scroll-offset-up", `${scrolled * -0.05}px`);
        });
      document
        .querySelectorAll<HTMLElement>(".parallax-card-down")
        .forEach((el) => {
          el.style.setProperty("--scroll-offset-down", `${scrolled * 0.05}px`);
        });

      // Hero Content Parallax
      const heroWrapper = document.getElementById("hero-content-wrapper");
      if (heroWrapper) {
        if (scrolled < 1000) {
          heroWrapper.style.transform = `translateY(${scrolled * 0.4}px)`;
          heroWrapper.style.opacity = String(Math.max(0, 1 - scrolled / 600));
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Initial call in case starting scrolled down
    handleScroll();

    // Scroll to top on route change (after transition)
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      revealObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-[#FF4500] selection:text-white overflow-x-hidden">
      <div className="noise-overlay"></div>

      <nav
        id="main-nav"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-8"
      >
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <Link
            to="/"
            id="nav-logo-link"
            className="flex items-center gap-3 group shrink-0"
          >
            <img
              src={iconSvg}
              alt="Frame Forge Logo"
              className="h-7 sm:h-8 w-auto max-w-[180px] sm:max-w-none transition-transform duration-500 group-hover:scale-110"
            />
          </Link>

          <div className="hidden xl:flex items-center space-x-6 2xl:space-x-8">
            <Link
              to="/"
              id="nav-home-link"
              className="text-xs 2xl:text-sm text-gray-400 hover:text-white transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              to="/services"
              id="nav-expertise-link"
              className="text-xs 2xl:text-sm text-gray-400 hover:text-white transition-colors duration-300"
            >
              Services
            </Link>
            <Link
              to="/how-it-works"
              id="nav-works-link"
              className="text-xs 2xl:text-sm text-gray-400 hover:text-white transition-colors duration-300"
            >
              How It Works
            </Link>
            <Link
              to="/demo"
              id="nav-demo-link"
              className="text-xs 2xl:text-sm text-gray-400 hover:text-white transition-colors duration-300"
            >
              Demo
            </Link>
            <Link
              to="/integration"
              id="nav-perspectives-link"
              className="text-xs 2xl:text-sm text-gray-400 hover:text-white transition-colors duration-300"
            >
              Integration
            </Link>
          </div>

          <Link
            to="/contact"
            id="nav-cta-link"
            className="hidden xl:inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-medium bg-white text-black hover:scale-105 hover:bg-gray-100 transition-all duration-300 shrink-0"
          >
            Get Started
          </Link>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            className="xl:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white hover:border-white/40 transition-colors"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="xl:hidden px-4 sm:px-6 mt-3">
            <div className="rounded-2xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md p-4 shadow-2xl">
              <div className="flex flex-col gap-1">
                <Link
                  to="/"
                  className="px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/services"
                  className="px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Services
                </Link>
                <Link
                  to="/how-it-works"
                  className="px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  How It Works
                </Link>
                <Link
                  to="/demo"
                  className="px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Demo
                </Link>
                <Link
                  to="/integration"
                  className="px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Integration
                </Link>
                <Link
                  to="/contact"
                  className="mt-2 inline-flex items-center justify-center px-4 py-3 rounded-full text-sm font-medium bg-white text-black hover:bg-gray-100 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet context={{ time }} />
        </motion.main>
      </AnimatePresence>

      <footer className="py-20 border-t border-white/5 bg-[#050505] relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
            <div className="w-full md:w-auto">
              <h2 className="text-[10vw] leading-[0.8] tracking-tighter text-white/10 font-bold select-none pointer-events-none uppercase">
                FRAME FORGE.
              </h2>
            </div>

            <div className="flex flex-col gap-8 text-right">
              <div className="flex flex-col gap-4 text-gray-400">
                <a
                  href="https://www.instagram.com/frameforgeone/"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="footer-ig-link"
                  className="flex items-center justify-end gap-2 hover:text-white transition-colors group"
                >
                  <span className="group-hover:translate-x-[-2px] transition-transform">
                    Instagram
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4.5" />
                    <circle
                      cx="17.5"
                      cy="6.5"
                      r="1"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61587792958879"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="footer-fb-link"
                  className="flex items-center justify-end gap-2 hover:text-white transition-colors group"
                >
                  <span className="group-hover:translate-x-[-2px] transition-transform">
                    Facebook
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
              </div>
              <p className="text-sm text-gray-600">
                © 2026 Frame Forge. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
