'use client';

import { useEffect, useState } from 'react';
import { Languages } from 'lucide-react';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

const languages = [
  { label: 'English', value: 'en' },
  { label: 'Hindi (हिंदी)', value: 'hi' },
  { label: 'Bengali (বাংলা)', value: 'bn' },
  { label: 'Telugu (తెలుగు)', value: 'te' },
  { label: 'Marathi (मराठी)', value: 'mr' },
  { label: 'Tamil (தமிழ்)', value: 'ta' },
  { label: 'Urdu (اردو)', value: 'ur' },
  { label: 'Gujarati (ગુજરાતી)', value: 'gu' },
  { label: 'Kannada (ಕನ್ನಡ)', value: 'kn' },
  { label: 'Malayalam (മലയാളം)', value: 'ml' },
  { label: 'Punjabi (ਪੰਜਾਬੀ)', value: 'pa' },
  { label: 'Odia (ଓଡ଼ିଆ)', value: 'or' },
  { label: 'Santhali', value: 'sat' },
];

export default function GoogleTranslate() {
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,bn,te,mr,ta,ur,gu,kn,ml,pa,or,sat',
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit();
    } else if (!document.getElementById('google-translate-script')) {
      const addScript = document.createElement('script');
      addScript.id = 'google-translate-script';
      addScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      addScript.async = true;
      document.body.appendChild(addScript);
    }

    const match = document.cookie.match(/(?:^|;)\s*googtrans=([^;]*)/);
    if (match) {
      const lang = match[1].split('/').pop();
      if (lang && languages.some(l => l.value === lang)) {
        setCurrentLang(lang);
      }
    }
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setCurrentLang(lang);

    const hostname = window.location.hostname;
    document.cookie = `googtrans=/en/${lang}; path=/`;
    document.cookie = `googtrans=/en/${lang}; domain=${hostname}; path=/`;

    const selectElem = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElem) {
      selectElem.value = lang;
      selectElem.dispatchEvent(new Event('change'));
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="relative flex items-center">
      <div id="google_translate_element" className="hidden" />

      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200/80 transition-colors">
        <Languages className="w-4 h-4 text-green-700 flex-shrink-0" />
        <select
          value={currentLang}
          onChange={handleLanguageChange}
          aria-label="Select Language"
          className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer appearance-none pr-4"
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2315803d' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right center',
            backgroundSize: '12px',
          }}
        >
          {languages.map((l) => (
            <option key={l.value} value={l.value} className="bg-white text-slate-900 font-sans">
              {l.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

