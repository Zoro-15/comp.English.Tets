import React, { useState, useRef, useEffect } from 'react';

interface LoginScreenProps {
  onLogin: (studentCode: string) => Promise<void>;
  isLoading: boolean;
  errorMsg: string | null;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function LoginScreen({
  onLogin,
  isLoading,
  errorMsg,
  theme,
  toggleTheme
}: LoginScreenProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [localError, setLocalError] = useState<string | null>(null);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, []);

  const handleChange = (value: string, index: number) => {
    if (value !== '' && !/^[0-9]$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    setLocalError(null);

    if (value !== '' && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (digits[index] === '' && index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        inputRefs[index - 1].current?.focus();
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
      }
      setLocalError(null);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    if (/^\d{4}$/.test(pastedData)) {
      const charArray = pastedData.split('');
      setDigits(charArray);
      setLocalError(null);
      inputRefs[3].current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length !== 4) {
      setLocalError('Please enter a 4-digit student code.');
      return;
    }

    onLogin(code);
  };

  const displayError = localError || errorMsg;

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 select-none font-inter text-brand-text relative">
      {/* Theme Toggle Button absolute at top-right */}
      <div className="absolute top-4 right-4 z-50">
        <button
          type="button"
          onClick={toggleTheme}
          className="text-[11px] uppercase font-bold tracking-widest text-brand-text hover:text-brand-primary cursor-pointer transition-none bg-transparent border-none outline-none"
          title="Toggle Theme"
        >
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      <div className="w-full max-w-sm bg-brand-card border border-brand-border p-8 rounded-2xl space-y-8">

        {/* Branding header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img src="/logo.svg" className="h-16 w-16 object-contain" alt="Logo" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-brand-title uppercase tracking-tight">
              English Mock Tests
            </h2>
            <p className="text-xs text-brand-text font-normal">
              Enter your 4-digit student code to access practice tests.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-brand-text uppercase tracking-wider text-center block">
              Student Code
            </label>

            {/* Digit Input Boxes */}
            <div className="flex justify-center gap-3.5">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  disabled={isLoading}
                  autoComplete="off"
                  className="w-12 h-14 text-center text-xl font-bold bg-brand-bg border border-brand-border rounded-xl text-brand-title outline-none transition-none focus:border-brand-primary focus:ring-0"
                />
              ))}
            </div>
          </div>

          {/* Error Message */}
          {displayError && (
            <div className="border border-brand-primary text-brand-primary text-xs font-semibold p-3 text-center flex items-center justify-center gap-1.5 rounded-xl">
              <svg className="w-3.5 h-3.5 shrink-0 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {displayError}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || digits.some(d => d === '')}
            className="w-full py-3 bg-white text-black border border-brand-primary hover:opacity-90 disabled:opacity-20 font-bold uppercase tracking-wider text-xs transition-none flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed rounded-xl"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-brand-bg border-t-transparent animate-spin"></div>
                <span>Entering...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span>Enter Dashboard</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center text-[10px] text-brand-text/70 font-normal leading-normal">
          If you don't have a code, enter any 4 digits to register a new profile.
        </div>
      </div>
    </div>
  );
}
