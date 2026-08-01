import React, { useState } from 'react';

export const ClubView: React.FC = () => {
  const [memberCode] = useState('VANA-CLUB-8842');
  const [silenceCredits, setSilenceCredits] = useState(450);
  const [freeTokens, setFreeTokens] = useState(2);
  const [claimedReward, setClaimedReward] = useState<string | null>(null);

  const handleClaimReward = (title: string, cost: number, tokenCost = 0) => {
    if (tokenCost > 0 && freeTokens >= tokenCost) {
      setFreeTokens(freeTokens - tokenCost);
      setClaimedReward(`Claimed: ${title}! Voucher sent to your digital pass.`);
    } else if (silenceCredits >= cost) {
      setSilenceCredits(silenceCredits - cost);
      setClaimedReward(`Claimed: ${title}! Voucher sent to your digital pass.`);
    } else {
      alert('Insufficient Silence Credits or Tokens.');
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-28 px-4 sm:px-8 md:px-16 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="font-hanken text-xs text-[#506443] uppercase tracking-[0.2em] font-semibold">
          Exclusive Membership
        </span>
        <h1 className="font-garamond text-4xl sm:text-5xl text-[#1c1c17] mt-1 mb-3">
          VANA Sanctuary Club
        </h1>
        <p className="font-hanken text-sm text-[#434844] leading-relaxed">
          A community dedicated to quietude, artisanal coffee, and slow living in Bengaluru.
        </p>
      </div>

      {/* Digital Membership Pass Card */}
      <div className="max-w-xl mx-auto bg-gradient-to-br from-[#131e18] via-[#07110c] to-[#1c2c22] text-[#fcf9f0] p-8 border border-[#b7cea5]/40 shadow-2xl relative overflow-hidden mb-12">
        <div className="absolute right-[-40px] top-[-40px] w-48 h-48 bg-[#506443]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-between items-start mb-8 relative z-10">
          <div>
            <span className="font-hanken text-[10px] text-[#b7cea5] uppercase tracking-[0.3em] font-semibold">
              SANCTUARY MEMBER PASS
            </span>
            <h2 className="font-garamond text-3xl font-light text-[#fcf9f0] tracking-widest mt-1">
              VANA
            </h2>
          </div>
          <span className="font-hanken text-[11px] font-mono text-[#b7cea5] border border-[#b7cea5]/40 px-3 py-1">
            {memberCode}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6 my-6 relative z-10 font-hanken">
          <div>
            <p className="text-[#7b877f] uppercase text-[10px] tracking-widest">MEMBER NAME</p>
            <p className="font-garamond text-xl text-white font-medium">Yuva Kishore</p>
          </div>
          <div>
            <p className="text-[#7b877f] uppercase text-[10px] tracking-widest">HOME SANCTUARY</p>
            <p className="font-garamond text-xl text-white font-medium">Indiranagar, BLR</p>
          </div>
          <div>
            <p className="text-[#7b877f] uppercase text-[10px] tracking-widest">SILENCE CREDITS</p>
            <p className="font-garamond text-2xl text-[#b7cea5] font-semibold">{silenceCredits} pts</p>
          </div>
          <div>
            <p className="text-[#7b877f] uppercase text-[10px] tracking-widest">RAIN BREW TOKENS</p>
            <p className="font-garamond text-2xl text-[#b7cea5] font-semibold">{freeTokens} Tokens</p>
          </div>
        </div>

        <div className="border-t border-[#7b877f]/40 pt-4 flex justify-between items-center text-[10px] font-hanken text-[#bdc9c1] uppercase tracking-widest relative z-10">
          <span>Priority Seating Enabled</span>
          <span className="text-[#b7cea5] font-bold">Active Tier: Canopy Founder</span>
        </div>
      </div>

      {claimedReward && (
        <div className="max-w-xl mx-auto mb-8 bg-[#d2eac0] text-[#0e2006] p-4 border border-[#506443] text-center font-hanken text-xs uppercase tracking-wider font-bold">
          {claimedReward}
        </div>
      )}

      {/* Member Privileges & Rewards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-[#fcf9f0] border border-[#d5c3bb]/60 p-6 flex flex-col justify-between">
          <div>
            <span className="font-hanken text-[10px] text-[#506443] uppercase tracking-widest font-bold">
              TOKEN REDEMPTION
            </span>
            <h3 className="font-garamond text-2xl text-[#1c1c17] mt-1 mb-2">
              Complimentary Rain Brew
            </h3>
            <p className="font-hanken text-xs text-[#434844] leading-relaxed mb-4">
              Redeem 1 Rain Brew Token for any signature coffee or botanical tea on rainy days in Bengaluru.
            </p>
          </div>
          <button
            onClick={() => handleClaimReward('Free Signature Rain Brew', 0, 1)}
            disabled={freeTokens < 1}
            className={`w-full py-3 font-hanken text-xs uppercase tracking-widest transition-colors ${
              freeTokens >= 1
                ? 'bg-[#131e18] text-white hover:bg-[#506443]'
                : 'bg-[#ebe8df] text-[#737874] cursor-not-allowed'
            }`}
          >
            {freeTokens >= 1 ? 'Redeem Token (1 Left)' : 'No Tokens Remaining'}
          </button>
        </div>

        <div className="bg-[#fcf9f0] border border-[#d5c3bb]/60 p-6 flex flex-col justify-between">
          <div>
            <span className="font-hanken text-[10px] text-[#506443] uppercase tracking-widest font-bold">
              300 CREDITS
            </span>
            <h3 className="font-garamond text-2xl text-[#1c1c17] mt-1 mb-2">
              Private Sound Bath Invitation
            </h3>
            <p className="font-hanken text-xs text-[#434844] leading-relaxed mb-4">
              Access to our Sunday morning acoustic Tibetan singing bowl & forest ambient sound bath session in Indiranagar.
            </p>
          </div>
          <button
            onClick={() => handleClaimReward('Private Sound Bath Pass', 300)}
            disabled={silenceCredits < 300}
            className={`w-full py-3 font-hanken text-xs uppercase tracking-widest transition-colors ${
              silenceCredits >= 300
                ? 'bg-[#131e18] text-white hover:bg-[#506443]'
                : 'bg-[#ebe8df] text-[#737874] cursor-not-allowed'
            }`}
          >
            {silenceCredits >= 300 ? 'Claim Sound Bath Pass (300 Pts)' : 'Need 300 Credits'}
          </button>
        </div>
      </div>

      {/* Member Rules of Silence */}
      <div className="bg-[#f1eee5] p-8 border border-[#d5c3bb]/60">
        <h3 className="font-garamond text-2xl text-[#1c1c17] mb-4">The Sanctuary Code</h3>
        <ul className="space-y-3 font-hanken text-xs text-[#434844] leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-[#506443] font-bold">01.</span>
            <span><strong>Digital Quiet:</strong> Phone calls must be taken outside the courtyard gates to preserve quietude.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#506443] font-bold">02.</span>
            <span><strong>Whisper Tone:</strong> Conversations inside the tree atrium should remain at whisper volume.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#506443] font-bold">03.</span>
            <span><strong>Zero Flash:</strong> Photography is permitted without artificial lights or flash to keep the natural ambient glow uninterrupted.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
