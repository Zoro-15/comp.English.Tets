import React, { useState, useRef, useEffect } from 'react';

interface LoginScreenProps {
  onLogin: (studentCode: string) => Promise<void>;
  isLoading: boolean;
  errorMsg: string | null;
}

export default function LoginScreen({ onLogin, isLoading, errorMsg }: LoginScreenProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Refs for each input to manage focus transitions
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Auto-focus first digit on load
  useEffect(() => {
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, []);

  const handleChange = (value: string, index: number) => {
    // Only accept numbers
    if (value !== '' && !/^[0-9]$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    setLocalError(null);

    // If typing a digit, auto-focus next input
    if (value !== '' && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // If Backspace is pressed and current field is empty, focus previous input
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
    
    // Check if pasted value is exactly a 4-digit number
    if (/^\d{4}$/.test(pastedData)) {
      const charArray = pastedData.split('');
      setDigits(charArray);
      setLocalError(null);
      // Focus the last field
      inputRefs[3].current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length !== 4) {
      setLocalError('Please enter a valid 4-digit student code.');
      return;
    }
    
    onLogin(code);
  };

  const displayError = localError || errorMsg;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Premium ambient background blur elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-violet-500/10 blur-3xl animate-pulse-slow"></div>

      <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-md border border-slate-700 p-8 rounded-3xl shadow-2xl relative z-10 space-y-8">
        
        {/* Branding header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-extrabold text-2xl mx-auto shadow-lg shadow-indigo-500/20">
            E
          </div>
          <h2 className="text-2xl font-black text-white tracking-wider uppercase sm:text-3xl">
            ENGLISH MOCK TESTS
          </h2>
          <p className="text-sm text-slate-400">
            Enter your 4-digit student code to access your practice tests.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-450 uppercase tracking-widest text-center block">
              Enter student code
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
                  className="w-14 h-16 text-center text-2xl font-extrabold bg-slate-900 border border-slate-700 rounded-xl text-white outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-150"
                  autoComplete="off"
                />
              ))}
            </div>
          </div>

          {/* Error Message */}
          {displayError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-450 text-xs font-bold p-3.5 rounded-xl text-center flex items-center justify-center gap-2 animate-shake">
              <svg className="w-4 h-4 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {displayError}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || digits.some(d => d === '')}
            className={`w-full py-4 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:from-indigo-800 active:to-violet-800 text-white font-extrabold rounded-xl transition duration-150 shadow-md shadow-indigo-500/10 flex items-center justify-center gap-2 text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                Authenticating...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Enter Dashboard
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500 font-medium">
          If you don't have a code, just enter any 4 digits to register a new practice profile.
        </div>
      </div>
    </div>
  );
}
