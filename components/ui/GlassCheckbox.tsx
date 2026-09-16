'use client';

import { motion } from 'framer-motion';

interface GlassCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  count?: number;
}

export default function GlassCheckbox({
  label,
  checked,
  onChange,
  count,
}: GlassCheckboxProps) {
  return (
    <label className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors group">
      <span className="flex items-center gap-2.5">
        <span
          className={`relative w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
            checked
              ? 'bg-primary border-primary shadow-md shadow-primary/30'
              : 'bg-white border-surface-container-high group-hover:border-primary/40'
          }`}
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          {checked && (
            <motion.span
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.15 }}
              className="material-symbols-outlined text-white text-sm font-bold"
              style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}
            >
              check
            </motion.span>
          )}
        </span>
        <span className="text-sm text-on-surface">{label}</span>
      </span>
      {count !== undefined && (
        <span className="text-[10px] font-semibold text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded">
          {count}
        </span>
      )}
    </label>
  );
}