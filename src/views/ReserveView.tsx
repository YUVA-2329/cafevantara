import React, { useState } from 'react';
import { MoodSpot, Reservation } from '../types';
import { moodSpots } from '../data/mockData';

interface ReserveViewProps {
  initialSpot?: MoodSpot | null;
  onConfirmReservation: (res: Reservation) => void;
  userReservations: Reservation[];
}

export const ReserveView: React.FC<ReserveViewProps> = ({
  initialSpot,
  onConfirmReservation,
  userReservations,
}) => {
  const [selectedSpot, setSelectedSpot] = useState<MoodSpot>(initialSpot || moodSpots[0]);
  const [date, setDate] = useState('2026-08-01');
  const [time, setTime] = useState('10:00 AM');
  const [guests, setGuests] = useState(2);
  const [specialNotes, setSpecialNotes] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [lastRes, setLastRes] = useState<Reservation | null>(null);

  const timeSlots = [
    '07:30 AM', '09:00 AM', '10:30 AM', '12:00 PM',
    '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRes: Reservation = {
      id: `VANA-${Math.floor(100000 + Math.random() * 900000)}`,
      spot: selectedSpot,
      date,
      time,
      guests,
      status: 'Confirmed',
      specialNotes,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VANA-RES-${selectedSpot.id}-${date}-${time}`,
    };

    onConfirmReservation(newRes);
    setLastRes(newRes);
    setIsConfirmed(true);
  };

  return (
    <div className="min-h-screen pt-28 pb-28 px-4 sm:px-8 md:px-16 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="font-hanken text-xs text-[#506443] uppercase tracking-[0.2em] font-semibold">
          Quiet Seating Reservations
        </span>
        <h1 className="font-garamond text-4xl sm:text-5xl text-[#1c1c17] mt-1 mb-3">
          Reserve a Sanctuary Spot
        </h1>
        <p className="font-hanken text-sm text-[#434844] leading-relaxed">
          We reserve only 40% of our capacity to preserve atmospheric silence. Choose your spot and arrival window below.
        </p>
      </div>

      {isConfirmed && lastRes ? (
        <div className="max-w-xl mx-auto bg-[#fcf9f0] border-2 border-[#131e18] p-8 shadow-2xl relative">
          <div className="flex justify-between items-start border-b border-[#d5c3bb] pb-4 mb-6">
            <div>
              <span className="font-hanken text-[10px] text-[#506443] uppercase tracking-widest font-bold">
                CONFIRMED DIGITAL PASS
              </span>
              <h2 className="font-garamond text-3xl text-[#1c1c17] font-medium">
                VANA Indiranagar
              </h2>
            </div>
            <span className="font-hanken text-xs font-mono bg-[#131e18] text-[#fcf9f0] px-3 py-1 font-bold">
              {lastRes.id}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 font-hanken text-xs">
            <div>
              <p className="text-[#737874] uppercase text-[10px] tracking-wider">SPOT</p>
              <p className="font-bold text-[#1c1c17] text-base font-garamond">{lastRes.spot.name} ({lastRes.spot.spotNumber})</p>
            </div>
            <div>
              <p className="text-[#737874] uppercase text-[10px] tracking-wider">GUESTS</p>
              <p className="font-bold text-[#1c1c17]">{lastRes.guests} Person(s)</p>
            </div>
            <div>
              <p className="text-[#737874] uppercase text-[10px] tracking-wider">DATE & TIME</p>
              <p className="font-bold text-[#1c1c17]">{lastRes.date} at {lastRes.time}</p>
            </div>
            <div>
              <p className="text-[#737874] uppercase text-[10px] tracking-wider">ATMOSPHERE</p>
              <p className="font-bold text-[#506443]">{lastRes.spot.vibe}</p>
            </div>
          </div>

          {lastRes.specialNotes && (
            <div className="mb-6 bg-[#ebe8df] p-3 text-xs font-hanken text-[#434844] border border-[#c3c8c3]/40">
              <span className="font-bold text-[#1c1c17] uppercase text-[10px] tracking-wider block mb-1">Preferences:</span>
              {lastRes.specialNotes}
            </div>
          )}

          <div className="flex flex-col items-center justify-center border-t border-dashed border-[#c3c8c3] pt-6">
            <img
              src={lastRes.qrCode}
              alt="Reservation QR Code"
              className="w-32 h-32 border border-[#131e18] p-1 bg-white mb-2"
            />
            <p className="font-hanken text-[10px] text-[#737874] uppercase tracking-widest text-center">
              Show this pass at sanctuary entrance upon arrival
            </p>
          </div>

          <button
            onClick={() => setIsConfirmed(false)}
            className="w-full mt-6 bg-[#131e18] text-white py-3 font-hanken text-xs uppercase tracking-widest hover:bg-[#506443] transition-colors"
          >
            Book Another Reservation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Select Spot */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h2 className="font-garamond text-2xl text-[#1c1c17] border-b border-[#d5c3bb]/60 pb-2">
              1. Choose Seating Atmosphere
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {moodSpots.map((spot) => {
                const isSelected = selectedSpot.id === spot.id;
                return (
                  <div
                    key={spot.id}
                    onClick={() => setSelectedSpot(spot)}
                    className={`p-4 border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#131e18] text-white border-[#131e18] shadow-md'
                        : 'bg-[#fcf9f0] text-[#1c1c17] border-[#c3c8c3]/50 hover:border-[#506443]'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`font-hanken text-[10px] uppercase tracking-widest ${
                          isSelected ? 'text-[#b7cea5]' : 'text-[#737874]'
                        }`}
                      >
                        {spot.spotNumber}
                      </span>
                      <span
                        className={`font-hanken text-[10px] px-2 py-0.5 uppercase tracking-wider font-bold ${
                          isSelected
                            ? 'bg-[#506443] text-white'
                            : 'bg-[#ebe8df] text-[#434844]'
                        }`}
                      >
                        {spot.capacity}
                      </span>
                    </div>

                    <div className="h-28 w-full mb-3 overflow-hidden">
                      <img
                        src={spot.image}
                        alt={spot.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h3 className="font-garamond text-xl font-medium mb-1">
                      {spot.name}
                    </h3>
                    <p
                      className={`font-hanken text-xs leading-relaxed ${
                        isSelected ? 'text-[#bdc9c1]' : 'text-[#434844]'
                      }`}
                    >
                      {spot.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Date & Time Form */}
          <div className="lg:col-span-5 bg-[#f1eee5] p-6 sm:p-8 border border-[#d5c3bb]/60">
            <h2 className="font-garamond text-2xl text-[#1c1c17] border-b border-[#d5c3bb] pb-2 mb-6">
              2. Arrival Details
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block font-hanken text-[11px] uppercase tracking-widest text-[#737874] mb-1 font-bold">
                  Selected Spot
                </label>
                <div className="bg-[#fcf9f0] p-3 border border-[#c3c8c3]/60 font-garamond text-lg font-bold text-[#1c1c17]">
                  {selectedSpot.name} • {selectedSpot.subtitle}
                </div>
              </div>

              <div>
                <label className="block font-hanken text-[11px] uppercase tracking-widest text-[#737874] mb-1 font-bold">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#fcf9f0] p-3 border border-[#c3c8c3]/60 font-hanken text-sm text-[#1c1c17] focus:outline-none focus:border-[#131e18]"
                  required
                />
              </div>

              <div>
                <label className="block font-hanken text-[11px] uppercase tracking-widest text-[#737874] mb-1 font-bold">
                  Time Window
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`p-2 font-hanken text-xs border text-center transition-colors ${
                        time === slot
                          ? 'bg-[#131e18] text-white border-[#131e18] font-bold'
                          : 'bg-[#fcf9f0] text-[#1c1c17] border-[#c3c8c3]/60 hover:bg-[#ebe8df]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-hanken text-[11px] uppercase tracking-widest text-[#737874] mb-1 font-bold">
                  Number of Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="w-full bg-[#fcf9f0] p-3 border border-[#c3c8c3]/60 font-hanken text-sm text-[#1c1c17] focus:outline-none focus:border-[#131e18]"
                >
                  <option value={1}>1 Guest (Solo Sanctuary)</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                  <option value={6}>6 Guests (Communal Table)</option>
                </select>
              </div>

              <div>
                <label className="block font-hanken text-[11px] uppercase tracking-widest text-[#737874] mb-1 font-bold">
                  Quiet / Dietary Preferences (Optional)
                </label>
                <textarea
                  rows={2}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g. Prefer corner seating near garden, oat milk preference, quiet reading mode..."
                  className="w-full bg-[#fcf9f0] p-3 border border-[#c3c8c3]/60 font-hanken text-xs text-[#1c1c17] focus:outline-none focus:border-[#131e18]"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-[#131e18] text-[#fcf9f0] py-4 font-hanken text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#506443] transition-colors shadow-md"
              >
                Confirm Spot Reservation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* User Existing Reservations list if any */}
      {userReservations.length > 0 && !isConfirmed && (
        <div className="mt-16 border-t border-[#d5c3bb] pt-10">
          <h2 className="font-garamond text-2xl text-[#1c1c17] mb-6">Your Sanctuary Reservations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userReservations.map((res) => (
              <div key={res.id} className="bg-[#fcf9f0] border border-[#d5c3bb]/60 p-5 flex justify-between items-center">
                <div>
                  <span className="font-hanken text-[10px] text-[#506443] uppercase tracking-widest font-bold">
                    {res.id} • {res.status}
                  </span>
                  <h3 className="font-garamond text-xl font-medium text-[#1c1c17] mt-0.5">
                    {res.spot.name}
                  </h3>
                  <p className="font-hanken text-xs text-[#737874]">
                    {res.date} at {res.time} ({res.guests} Guests)
                  </p>
                </div>
                <img src={res.qrCode} alt="QR" className="w-16 h-16 border p-0.5 bg-white" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
