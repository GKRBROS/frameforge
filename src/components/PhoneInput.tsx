import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { countries, Country } from "@/lib/countries";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Enter mobile number",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countries.find((c) => c.code === "IN") || countries[0]
  );
  const [localNumber, setLocalNumber] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse initial value
  useEffect(() => {
    if (value && !localNumber) {
      const sortedCountries = [...countries].sort((a, b) => b.dial_code.length - a.dial_code.length);
      for (const country of sortedCountries) {
        if (value.startsWith(country.dial_code)) {
          setSelectedCountry(country);
          setLocalNumber(value.slice(country.dial_code.length));
          break;
        }
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchQuery("");
    onChange(country.dial_code + localNumber);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setLocalNumber(val);
    onChange(selectedCountry.dial_code + val);
  };

  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.dial_code.includes(searchQuery) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFlagUrl = (code: string) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

  return (
    <div className={`relative flex items-stretch gap-2 ${className}`}>
      {/* Country Code Selector */}
      <div className="relative flex" ref={dropdownRef}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 text-white hover:bg-white/[0.08] hover:border-white/20 transition-all focus:outline-none focus:ring-1 focus:ring-[#FF4500]/30 disabled:opacity-50"
          style={{ minWidth: "115px" }}
        >
          <img 
            src={getFlagUrl(selectedCountry.code)} 
            alt={selectedCountry.name}
            className="w-5 h-3.5 object-cover rounded-sm shadow-sm"
          />
          <span className="text-sm font-semibold tracking-tight">{selectedCountry.dial_code}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 5, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute z-[100] left-0 top-full w-72 bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-xl"
            >
              <div className="p-3 bg-white/[0.02] border-b border-white/5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search country..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4500]/30 transition-all"
                  />
                </div>
              </div>
              <div className="max-h-[500px] overflow-y-auto phone-input-scrollbar p-1">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left group ${
                        selectedCountry.code === country.code ? "bg-[#FF4500]/10" : "hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={getFlagUrl(country.code)} 
                          alt={country.name}
                          className="w-5 h-3.5 object-cover rounded-sm shadow-sm opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <span className={`text-sm tracking-wide ${selectedCountry.code === country.code ? "text-white font-medium" : "text-gray-400 group-hover:text-gray-200"}`}>
                          {country.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 font-mono font-medium">{country.dial_code}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-sm text-gray-600 italic">No countries found</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Phone Number Input */}
      <div className="relative flex-1 group">
        <input
          type="tel"
          disabled={disabled}
          value={localNumber}
          onChange={handleNumberChange}
          placeholder={placeholder}
          className="w-full h-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-3.5 text-white placeholder-white/10 focus:outline-none focus:border-[#FF4500]/40 transition-all pl-12 disabled:opacity-50"
        />
        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700 group-focus-within:text-[#FF4500]/50 transition-colors" />
      </div>

      <style>{`
        .phone-input-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .phone-input-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .phone-input-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .phone-input-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 69, 0, 0.3);
        }
      `}</style>
    </div>
  );
};
