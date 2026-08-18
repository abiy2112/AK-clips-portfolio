import React, { useState, useEffect, useRef } from "react";
import { Lock, Unlock, X, ShieldAlert, KeyRound, ArrowRight, Zap } from "lucide-react";
import AKLogo from "./AKLogo";

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminAuthModal({
  isOpen,
  onClose,
  onSuccess,
}: AdminAuthModalProps) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPasscode("");
      setError(false);
      setIsUnlocked(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passcode === "5252") {
      setError(false);
      setIsUnlocked(true);
      setTimeout(() => {
        onSuccess();
      }, 400);
    } else {
      setError(true);
      setPasscode("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative select-none animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* macOS Style Title Bar */}
        <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer block"
                title="Close"
              ></span>
              <span className="w-3 h-3 rounded-full bg-amber-500 block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500 block"></span>
            </div>
            <span className="text-[11px] font-semibold text-slate-300 ml-1">
              Admin Gatekeeper
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="relative inline-block mb-3">
            <AKLogo size={54} rounded="2xl" />
            <div
              className={`absolute -bottom-1 -right-1 p-1 rounded-full border border-slate-900 transition-colors ${
                isUnlocked
                  ? "bg-emerald-500 text-white"
                  : error
                  ? "bg-red-500 text-white animate-bounce"
                  : "bg-[#C8102E] text-white"
              }`}
            >
              {isUnlocked ? (
                <Unlock className="w-3 h-3" />
              ) : (
                <Lock className="w-3 h-3" />
              )}
            </div>
          </div>

          <h3 className="text-base font-bold text-white mb-1">
            AK clipps Admin Authorization
          </h3>
          <p className="text-xs text-slate-400 mb-5 leading-relaxed">
            Please enter your admin passcode to unlock the Video Upload Studio.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                ref={inputRef}
                type="password"
                maxLength={8}
                value={passcode}
                onChange={(e) => {
                  setError(false);
                  setPasscode(e.target.value);
                  if (e.target.value === "5252") {
                    setIsUnlocked(true);
                    setTimeout(() => onSuccess(), 350);
                  }
                }}
                placeholder="Enter Admin Passcode"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-950 border rounded-xl text-center text-sm font-mono tracking-widest text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                  error
                    ? "border-red-500 ring-2 ring-red-500/30 bg-red-950/20"
                    : isUnlocked
                    ? "border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-950/20"
                    : "border-slate-800 focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/30"
                }`}
              />
            </div>

            {error && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-red-400 animate-fade-in font-medium">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>Incorrect passcode. Admin access only.</span>
              </div>
            )}

            {isUnlocked && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-medium animate-fade-in">
                <Zap className="w-3.5 h-3.5 fill-current text-amber-400" />
                <span>Access Granted! Opening Studio...</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-3 rounded-xl bg-[#C8102E] hover:bg-[#b00e27] text-xs font-medium text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Authorize</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Quick Info */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <span>Admin Access Only • AK clipps Studio</span>
          </div>
        </div>
      </div>
    </div>
  );
}
