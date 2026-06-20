import React, { useState, useRef, useEffect } from 'react';

interface LoginScreenProps {
  onLogin: (studentCode: string) => Promise<void>;
  isLoading: boolean;
  errorMsg: string | null;
}

export default function LoginScreen({ onLogin, isLoading, errorMsg }: LoginScreenProps) {
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
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 select-none font-source text-brand-text">
      <div className="w-full max-w-sm bg-brand-card border border-brand-border p-8 rounded-lg space-y-8">
        
        {/* Branding header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-normal text-brand-title font-lora tracking-tight">
            English Mock Tests
          </h2>
          <p className="text-xs text-brand-text font-light">
            Enter your 4-digit student code to access practice tests.
          </p>
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
                  className="w-12 h-14 text-center text-xl font-bold bg-brand-bg border border-brand-border rounded-md text-brand-title outline-none transition-colors focus:border-brand-primary focus:ring-0"
                />
              ))}
            </div>
          </div>

          {/* Error Message */}
          {displayError && (
            <div className="bg-rose-950/20 border border-rose-900/40 text-rose-300 text-xs font-medium p-3 rounded-md text-center flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0 text-rose-450" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {displayError}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || digits.some(d => d === '')}
            className="w-full py-3 border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-brand-primary font-semibold rounded-md transition-colors duration-150 flex items-center justify-center gap-1.5 text-sm cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-brand-primary border-t-transparent animate-spin"></div>
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
        <div className="text-center text-[10px] text-brand-text/70 font-light leading-normal">
          If you don't have a code, enter any 4 digits to register a new profile.
        </div>
      </div>
    </div>
  );
}
