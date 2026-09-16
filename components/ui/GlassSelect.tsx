'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
  value: string;
  label: string;
}

interface GlassSelectProps {
  label?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: string;
}

export default function GlassSelect({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select...',
  icon,
}: GlassSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      {label && (
        <label className="block text-[10px] font-bold uppercase tracking-wider text-primary mb-1.5">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
          open
            ? 'bg-white border-primary shadow-lg ring-2 ring-primary/20'
            : 'bg-white/70 backdrop-blur-sm border-white/80 hover:bg-white hover:border-primary/40 shadow-sm'
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          {icon && (
            <span className="material-symbols-outlined text-base text-primary">
              {icon}
            </span>
          )}
          <span className={selected ? 'text-on-surface' : 'text-outline'}>
            {selected ? selected.label : placeholder}
          </span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="material-symbols-outlined text-base text-on-surface-variant"
        >
          expand_more
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl overflow-hidden bg-white/95 backdrop-blur-xl border border-white/80 shadow-2xl"
          >
            <div className="max-h-64 overflow-y-auto p-1">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    value === opt.value
                      ? 'bg-primary text-white font-semibold'
                      : 'text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    {opt.label}
                    {value === opt.value && (
                      <span className="material-symbols-outlined text-base">
                        check
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}