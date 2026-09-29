'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { packageAPI } from '@/lib/api';
import { FadeUp } from '@/components/ui/MotionDiv';

const INCLUSION_OPTIONS = [
  'Direct Return Flights',
  'Umrah Visa & Insurance',
  'Hajj Visa & Nusuk',
  '5-Star Hotel Accommodation',
  'Full Board Meals',
  'Historical Ziyarat',
  'Haramain High-Speed Train',
  'Airport Transfers',
  '24/7 Support',
  'Qurbani (Dham)',
  '5L Zamzam Water',
  'Pre-Departure Seminar',
];

export default function EditPackagePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    type: 'UMRAH' as 'UMRAH' | 'HAJJ',
    departureCity: 'Colombo',
    travelDate: '',
    returnDate: '',
    duration: 11,
    totalPrice: 0,
    advancePercent: 20,
    availableSeats: 50,
    description: '',
    posterUrl: '',
  });

  const [hotels, setHotels] = useState([
    { city: 'MAKKAH', name: '', stars: 5, distance: '', roomType: 'Double', nights: 6 },
    { city: 'MADINAH', name: '', stars: 5, distance: '', roomType: 'Double', nights: 5 },
  ]);

  const [inclusions, setInclusions] = useState<string[]>([]);

  const [itinerary, setItinerary] = useState([
    { day: 1, title: '', description: '', location: 'Makkah' },
  ]);

  // Fetch existing package
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await packageAPI.get(params.id as string);
        const pkg = res.data.data.package;

        // Format date strings for input[type=date]
        const formatDate = (date: string) => {
          if (!date) return '';
          return new Date(date).toISOString().split('T')[0];
        };

        setForm({
          name: pkg.name || '',
          type: pkg.type || 'UMRAH',
          departureCity: pkg.departureCity || 'Colombo',
          travelDate: formatDate(pkg.travelDate),
          returnDate: formatDate(pkg.returnDate),
          duration: pkg.duration || 11,
          totalPrice: pkg.totalPrice || 0,
          advancePercent: pkg.advancePercent || 20,
          availableSeats: pkg.availableSeats || 50,
          description: pkg.description || '',
          posterUrl: pkg.posterUrl || '',
        });

        // Hotels
        if (pkg.hotels && pkg.hotels.length > 0) {
          const makkahHotel = pkg.hotels.find(
            (h: any) => h.city === 'MAKKAH'
          );
          const madinahHotel = pkg.hotels.find(
            (h: any) => h.city === 'MADINAH'
          );

          setHotels([
            {
              city: 'MAKKAH',
              name: makkahHotel?.name || '',
              stars: makkahHotel?.stars || 5,
              distance: makkahHotel?.distance || '',
              roomType: makkahHotel?.roomType || 'Double',
              nights: makkahHotel?.nights || 6,
            },
            {
              city: 'MADINAH',
              name: madinahHotel?.name || '',
              stars: madinahHotel?.stars || 5,
              distance: madinahHotel?.distance || '',
              roomType: madinahHotel?.roomType || 'Double',
              nights: madinahHotel?.nights || 5,
            },
          ]);
        }

        // Inclusions
        if (pkg.inclusions && pkg.inclusions.length > 0) {
          setInclusions(pkg.inclusions.map((i: any) => i.name));
        }

        // Itinerary
        if (pkg.itinerary && pkg.itinerary.length > 0) {
          setItinerary(
            pkg.itinerary
              .sort((a: any, b: any) => a.day - b.day)
              .map((it: any) => ({
                day: it.day,
                title: it.title || '',
                description: it.description || '',
                location: it.location || 'Makkah',
              }))
          );
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load package');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchPackage();
  }, [params.id]);

  // Handlers
  const updateHotel = (index: number, field: string, value: any) => {
    const updated = [...hotels];
    updated[index] = { ...updated[index], [field]: value };
    setHotels(updated);
  };

  const toggleInclusion = (value: string) => {
    setInclusions((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  };

  const addDay = () => {
    setItinerary([
      ...itinerary,
      { day: itinerary.length + 1, title: '', description: '', location: 'Makkah' },
    ]);
  };

  const removeDay = (index: number) => {
    if (itinerary.length <= 1) return;
    const updated = itinerary.filter((_, i) => i !== index);
    updated.forEach((item, i) => (item.day = i + 1));
    setItinerary(updated);
  };

  const updateDay = (index: number, field: string, value: string) => {
    const updated = [...itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setItinerary(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.travelDate || !form.returnDate) {
      setError('Please fill in all required fields');
      return;
    }
    if (form.totalPrice <= 0) {
      setError('Total price must be greater than 0');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: form.name,
        type: form.type,
        departureCity: form.departureCity,
        travelDate: new Date(form.travelDate).toISOString(),
        returnDate: new Date(form.returnDate).toISOString(),
        duration: form.duration,
        totalPrice: form.totalPrice,
        advancePercent: form.advancePercent,
        availableSeats: form.availableSeats,
        description: form.description,
        posterUrl: form.posterUrl,
      };

      await packageAPI.update(params.id as string, payload);
      router.push('/admin/packages?updated=true');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update package');
    } finally {
      setSubmitting(false);
    }
  };

  const advanceAmount = Math.round((form.totalPrice * form.advancePercent) / 100);
  const balanceAmount = form.totalPrice - advanceAmount;

  // Loading
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-surface-container rounded-3xl" />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div className="h-64 bg-surface-container rounded-2xl" />
            <div className="h-48 bg-surface-container rounded-2xl" />
          </div>
          <div className="h-96 bg-surface-container rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error && !form.name) {
    return (
      <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-12 shadow-lg text-center">
        <span className="material-symbols-outlined text-6xl text-error">
          error
        </span>
        <h2 className="text-xl font-bold text-on-surface mt-4">
          {error || 'Package not found'}
        </h2>
        <Link
          href="/admin/packages"
          className="btn-primary inline-flex mt-6"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Packages
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <FadeUp>
        <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-3">
          <Link
            href="/admin/packages"
            className="hover:text-tertiary transition"
          >
            Packages
          </Link>
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
          <span className="text-tertiary font-semibold">Edit Package</span>
        </nav>

        <div className="relative overflow-hidden bg-gradient-to-br from-tertiary via-tertiary-container to-primary rounded-3xl p-6 lg:p-8 text-white shadow-xl">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/20 blur-3xl pointer-events-none"
          />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider border border-white/20 mb-3">
              <span className="material-symbols-outlined text-xs">edit</span>
              Editing Package
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold">Edit Package</h1>
            <p className="text-sm opacity-90 mt-1 truncate">
              {form.name || 'Package'}
            </p>
          </div>
        </div>
      </FadeUp>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-error-container text-on-error-container text-sm flex items-start gap-2"
        >
          <span className="material-symbols-outlined text-lg">error</span>
          <span>{error}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT — Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <FadeUp delay={0.1}>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
              <h2 className="font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">
                  info
                </span>
                Basic Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                    Package Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary focus:ring-2 focus:ring-tertiary/20 outline-none text-sm transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                      Package Type *
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) =>
                        setForm({ ...form, type: e.target.value as any })
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary outline-none text-sm"
                    >
                      <option value="UMRAH">Umrah</option>
                      <option value="HAJJ">Hajj</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                      Departure City *
                    </label>
                    <input
                      type="text"
                      value={form.departureCity}
                      onChange={(e) =>
                        setForm({ ...form, departureCity: e.target.value })
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                    Description *
                  </label>
                  <textarea
                    required
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary outline-none text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                    Poster Image URL
                  </label>
                  <input
                    type="url"
                    value={form.posterUrl}
                    onChange={(e) =>
                      setForm({ ...form, posterUrl: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary outline-none text-sm"
                  />
                  {form.posterUrl && (
                    <div className="mt-2 h-32 rounded-xl overflow-hidden">
                      <img
                        src={form.posterUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Travel Details */}
          <FadeUp delay={0.15}>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
              <h2 className="font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">
                  calendar_month
                </span>
                Travel Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                    Travel Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.travelDate}
                    onChange={(e) =>
                      setForm({ ...form, travelDate: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                    Return Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.returnDate}
                    onChange={(e) =>
                      setForm({ ...form, returnDate: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                    Duration (Days) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    required
                    value={form.duration}
                    onChange={(e) =>
                      setForm({ ...form, duration: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Pricing */}
          <FadeUp delay={0.2}>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
              <h2 className="font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">
                  payments
                </span>
                Pricing & Availability
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                    Total Price (LKR) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    required
                    value={form.totalPrice || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        totalPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                    Advance %
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={form.advancePercent}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        advancePercent: parseInt(e.target.value) || 20,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                    Available Seats *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.availableSeats}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        availableSeats: parseInt(e.target.value) || 50,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Hotels */}
          <FadeUp delay={0.25}>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
              <h2 className="font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">
                  hotel
                </span>
                Hotels
              </h2>

              <div className="space-y-4">
                {hotels.map((hotel, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-surface-container-low border border-surface-container"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          hotel.city === 'MAKKAH'
                            ? 'bg-primary text-white'
                            : 'bg-secondary text-white'
                        }`}
                      >
                        {hotel.city === 'MAKKAH' ? 'Makkah' : 'Madinah'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={hotel.name}
                        onChange={(e) => updateHotel(idx, 'name', e.target.value)}
                        placeholder="Hotel name"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-surface-container-high focus:border-tertiary outline-none text-xs"
                      />
                      <input
                        type="text"
                        value={hotel.distance}
                        onChange={(e) =>
                          updateHotel(idx, 'distance', e.target.value)
                        }
                        placeholder="Distance"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-surface-container-high focus:border-tertiary outline-none text-xs"
                      />
                      <input
                        type="number"
                        value={hotel.nights}
                        onChange={(e) =>
                          updateHotel(idx, 'nights', parseInt(e.target.value))
                        }
                        placeholder="Nights"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-surface-container-high focus:border-tertiary outline-none text-xs"
                      />
                      <select
                        value={hotel.stars}
                        onChange={(e) =>
                          updateHotel(idx, 'stars', parseInt(e.target.value))
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white border border-surface-container-high focus:border-tertiary outline-none text-xs"
                      >
                        {[3, 4, 5].map((s) => (
                          <option key={s} value={s}>
                            {s} Stars
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Inclusions */}
          <FadeUp delay={0.3}>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
              <h2 className="font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">
                  check_circle
                </span>
                What's Included
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {INCLUSION_OPTIONS.map((option) => {
                  const checked = inclusions.includes(option);
                  return (
                    <label
                      key={option}
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleInclusion(option)}
                        className="absolute opacity-0 pointer-events-none"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                          checked
                            ? 'bg-tertiary border-tertiary'
                            : 'bg-white border-surface-container-high'
                        }`}
                      >
                        {checked && (
                          <span className="material-symbols-outlined text-white text-sm">
                            check
                          </span>
                        )}
                      </div>
                      <span className="text-xs">{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </FadeUp>

          {/* Itinerary */}
          <FadeUp delay={0.35}>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary">
                    route
                  </span>
                  Itinerary
                </h2>
                <button
                  type="button"
                  onClick={addDay}
                  className="text-xs font-bold text-tertiary hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add Day
                </button>
              </div>

              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {itinerary.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 rounded-xl bg-surface-container-low border border-surface-container"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-7 h-7 rounded-lg bg-tertiary text-white text-xs font-bold flex items-center justify-center">
                          {item.day}
                        </span>
                        {itinerary.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDay(idx)}
                            className="text-error hover:bg-error-container p-1 rounded"
                          >
                            <span className="material-symbols-outlined text-base">
                              delete
                            </span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) =>
                            updateDay(idx, 'title', e.target.value)
                          }
                          placeholder="Day title"
                          className="sm:col-span-2 w-full px-3 py-2 rounded-lg bg-white border border-surface-container-high focus:border-tertiary outline-none text-xs"
                        />
                        <select
                          value={item.location}
                          onChange={(e) =>
                            updateDay(idx, 'location', e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white border border-surface-container-high focus:border-tertiary outline-none text-xs"
                        >
                          <option value="Colombo">Colombo</option>
                          <option value="Jeddah">Jeddah</option>
                          <option value="Makkah">Makkah</option>
                          <option value="Madinah">Madinah</option>
                          <option value="Mina">Mina</option>
                          <option value="Arafat">Arafat</option>
                        </select>
                      </div>

                      <textarea
                        value={item.description}
                        onChange={(e) =>
                          updateDay(idx, 'description', e.target.value)
                        }
                        placeholder="Describe the day's activities..."
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-surface-container-high focus:border-tertiary outline-none text-xs resize-none"
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* RIGHT — Preview */}
        <div className="space-y-4">
          <FadeUp delay={0.15}>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl shadow-lg overflow-hidden lg:sticky lg:top-24">
              <div className="p-4 border-b border-surface-container">
                <h3 className="font-bold text-on-surface text-sm">
                  Live Preview
                </h3>
              </div>

              <div className="relative h-32 overflow-hidden bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                {form.posterUrl ? (
                  <img
                    src={form.posterUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-5xl text-white/30">
                    mosque
                  </span>
                )}
                <span
                  className={`absolute top-2 left-2 badge ${
                    form.type === 'HAJJ'
                      ? 'bg-tertiary text-white'
                      : 'bg-primary text-white'
                  }`}
                >
                  {form.type}
                </span>
              </div>

              <div className="p-4 space-y-3">
                <h4 className="font-bold text-on-surface text-sm line-clamp-2">
                  {form.name || 'Package Name'}
                </h4>
                <div className="text-xs text-on-surface-variant">
                  {form.duration} Days • {form.departureCity}
                </div>

                <div className="pt-3 border-t border-surface-container space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Price</span>
                    <span className="font-semibold">
                      LKR {form.totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-tertiary">
                    <span className="font-semibold">
                      {form.advancePercent}% Advance
                    </span>
                    <span className="font-bold">
                      LKR {advanceAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-surface-container space-y-2">
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: submitting ? 1 : 1.02 }}
                  whileTap={{ scale: submitting ? 1 : 0.98 }}
                  className="w-full py-3 rounded-xl bg-tertiary hover:bg-tertiary-container text-white font-bold text-sm shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        className="material-symbols-outlined text-lg"
                      >
                        refresh
                      </motion.span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">
                        save
                      </span>
                      Save Changes
                    </>
                  )}
                </motion.button>
                <Link
                  href="/admin/packages"
                  className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-base">
                    arrow_back
                  </span>
                  Cancel
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </form>
  );
}