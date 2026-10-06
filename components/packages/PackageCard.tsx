'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package } from '@/types';
import { motion } from 'framer-motion';

interface PackageCardProps {
  pkg: Package;
  index?: number;
}

export default function PackageCard({ pkg, index = 0 }: PackageCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const advanceAmount =
    pkg.advanceAmount ||
    Math.round((pkg.totalPrice * pkg.advancePercent) / 100);

  const formattedDate = new Date(pkg.travelDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const seatsLeft = pkg.seatsLeft;
  const showLowSeats = seatsLeft !== undefined && seatsLeft > 0 && seatsLeft < 10;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ y: -6 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <Link href={`/package/${pkg.id}`}>
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          {pkg.posterUrl && !imgFailed ? (
            <motion.img
              src={pkg.posterUrl}
              alt={pkg.name}
              onError={() => setImgFailed(true)}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-white/40">
                mosque
              </span>
            </div>
          )}

          {/* Type Badge */}
          <span
            className={`absolute top-3 left-3 badge ${
              pkg.type === 'HAJJ'
                ? 'bg-tertiary text-white'
                : 'bg-primary text-white'
            }`}
          >
            {pkg.type}
          </span>

          {/* Low Seats Badge */}
          {showLowSeats && (
            <motion.span
              initial={{ scale: 0.9 }}
              animate={{ scale: [0.9, 1, 0.9] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-3 right-3 badge bg-error text-white"
            >
              {seatsLeft} Seats Left
            </motion.span>
          )}

          {/* Bottom Gradient */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <span className="text-xs text-white font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">flight</span>
              {pkg.departureCity} • {formattedDate}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-on-surface line-clamp-2 min-h-[56px] group-hover:text-primary transition-colors">
            {pkg.name}
          </h3>
          <p className="text-sm text-on-surface-variant mt-1">
            {pkg.duration} Days • {pkg.duration - 1} Nights
          </p>

          {/* Hotels */}
          {pkg.hotels && pkg.hotels.length > 0 && (
            <div className="mt-3 space-y-1">
              {pkg.hotels.slice(0, 2).map((hotel, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs text-on-surface-variant"
                >
                  <span className="material-symbols-outlined text-tertiary text-sm">
                    hotel
                  </span>
                  <span className="truncate">
                    {hotel.city === 'MAKKAH' ? 'Makkah' : 'Madinah'}:{' '}
                    {hotel.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="mt-4 pt-4 border-t border-surface-container flex justify-between items-end">
            <div>
              <span className="text-xs text-on-surface-variant">From</span>
              <div className="text-2xl font-bold text-primary">
                LKR {pkg.totalPrice.toLocaleString()}
              </div>
              <span className="text-xs text-gold font-bold">
                20% Advance: LKR {advanceAmount.toLocaleString()}
              </span>
            </div>
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-xs px-4 py-2"
            >
              View
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}