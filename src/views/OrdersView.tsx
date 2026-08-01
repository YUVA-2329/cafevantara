import React, { useState } from 'react';
import { MenuItem } from '../types';
import { menuItems } from '../data/mockData';

interface OrdersViewProps {
  onAddToCart: (item: MenuItem, customization?: { temp: 'Hot' | 'Cold'; milk?: string; notes?: string }) => void;
  onOpenCart: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ onAddToCart, onOpenCart }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'rainy' | 'coffee' | 'tea' | 'bakes'>('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Customization state
  const [temp, setTemp] = useState<'Hot' | 'Cold'>('Hot');
  const [milk, setMilk] = useState('Oat Milk');
  const [notes, setNotes] = useState('');

  const filteredItems = activeCategory === 'all'
    ? menuItems
    : menuItems.filter((item) => item.category === activeCategory);

  const categories = [
    { id: 'all', label: 'All Rituals' },
    { id: 'rainy', label: 'Rainy Day Specials' },
    { id: 'coffee', label: 'Single Origin & Espresso' },
    { id: 'tea', label: 'Botanical Infusions' },
    { id: 'bakes', label: 'Artisanal Bakes' },
  ];

  const handleOpenDetail = (item: MenuItem) => {
    setSelectedItem(item);
    setTemp(item.temperature === 'Cold' ? 'Cold' : 'Hot');
    setMilk('Oat Milk');
    setNotes('');
  };

  const handleConfirmAdd = () => {
    if (!selectedItem) return;
    onAddToCart(selectedItem, {
      temp,
      milk: selectedItem.category === 'bakes' ? undefined : milk,
      notes,
    });
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen pt-28 pb-28 px-4 sm:px-8 md:px-16 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="font-hanken text-xs text-[#506443] uppercase tracking-[0.2em] font-semibold">
          Artisanal Sanctuary Menu
        </span>
        <h1 className="font-garamond text-4xl sm:text-5xl text-[#1c1c17] mt-1 mb-3">
          Monsoon & Botanical Brews
        </h1>
        <p className="font-hanken text-sm text-[#434844] leading-relaxed">
          Single-origin micro-lots roasted locally in Chikmagalur and Wayanad, paired with wild botanicals and slow-fermented bakes.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-4 mb-10 border-b border-[#d5c3bb]/60 hide-scrollbar justify-start sm:justify-center">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`py-2 px-4 font-hanken text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-[#131e18] text-white font-semibold shadow-sm'
                : 'bg-[#f1eee5] text-[#434844] hover:bg-[#ebe8df]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-[#fcf9f0] border border-[#d5c3bb]/50 p-6 flex flex-col sm:flex-row gap-6 items-start hover:border-[#506443] transition-all duration-300 group cursor-pointer"
            onClick={() => handleOpenDetail(item)}
          >
            <div className="w-full sm:w-36 h-36 overflow-hidden border border-[#ebe8df] shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="flex-1 flex flex-col justify-between h-full w-full">
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-hanken text-[10px] text-[#506443] font-bold tracking-widest uppercase">
                    {item.tag || item.category}
                  </span>
                  <span className="font-garamond text-xl font-bold text-[#1c1c17]">
                    ₹{item.price}
                  </span>
                </div>

                <h3 className="font-garamond text-2xl text-[#1c1c17] font-medium leading-snug">
                  {item.name}
                </h3>

                <p className="font-hanken text-xs text-[#434844] leading-relaxed my-2 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1.5 my-2">
                  {item.flavorNotes.map((note, idx) => (
                    <span
                      key={idx}
                      className="font-hanken text-[10px] bg-[#ebe8df] text-[#434844] px-2 py-0.5 uppercase tracking-wider"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-[#ebe8df] pt-3 mt-2">
                <span className="font-hanken text-[11px] text-[#737874] uppercase tracking-wider">
                  {item.temperature || 'Customizable'}
                </span>
                <span className="font-hanken text-xs uppercase tracking-widest text-[#131e18] font-bold group-hover:text-[#506443] transition-colors">
                  Customize & Add ➔
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Item Customization Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#fcf9f0] border border-[#d5c3bb] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-[#737874] hover:text-[#1c1c17] font-mono text-xl"
            >
              ✕
            </button>

            <div className="flex gap-4 items-center mb-4">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-20 h-20 object-cover border"
              />
              <div>
                <span className="font-hanken text-[10px] text-[#506443] uppercase tracking-widest font-bold">
                  {selectedItem.tag}
                </span>
                <h2 className="font-garamond text-2xl text-[#1c1c17]">
                  {selectedItem.name}
                </h2>
                <span className="font-garamond text-xl font-bold text-[#131e18]">
                  ₹{selectedItem.price}
                </span>
              </div>
            </div>

            <p className="font-hanken text-xs text-[#434844] leading-relaxed mb-6 bg-[#f1eee5] p-3 border border-[#d5c3bb]/40">
              {selectedItem.description}
            </p>

            {/* Customization Options */}
            <div className="flex flex-col gap-5">
              {selectedItem.temperature && (
                <div>
                  <label className="block font-hanken text-[11px] uppercase tracking-widest text-[#737874] mb-2 font-bold">
                    Temperature Preference
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Hot', 'Cold'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTemp(t as any)}
                        className={`p-2.5 font-hanken text-xs uppercase tracking-wider border text-center transition-colors ${
                          temp === t
                            ? 'bg-[#131e18] text-white border-[#131e18] font-bold'
                            : 'bg-[#f1eee5] text-[#1c1c17] border-[#c3c8c3]/60'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedItem.category !== 'bakes' && (
                <div>
                  <label className="block font-hanken text-[11px] uppercase tracking-widest text-[#737874] mb-2 font-bold">
                    Milk Option
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Oat Milk', 'Almond Milk', 'Whole Milk'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMilk(m)}
                        className={`p-2 font-hanken text-[11px] uppercase tracking-wider border text-center transition-colors ${
                          milk === m
                            ? 'bg-[#131e18] text-white border-[#131e18] font-bold'
                            : 'bg-[#f1eee5] text-[#1c1c17] border-[#c3c8c3]/60'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block font-hanken text-[11px] uppercase tracking-widest text-[#737874] mb-1 font-bold">
                  Barista Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Extra hot, light jaggery, serve in ceramic mug..."
                  className="w-full bg-[#f1eee5] p-3 border border-[#c3c8c3]/60 font-hanken text-xs text-[#1c1c17] focus:outline-none focus:border-[#131e18]"
                />
              </div>

              <button
                onClick={handleConfirmAdd}
                className="w-full mt-2 bg-[#131e18] text-[#fcf9f0] py-4 font-hanken text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#506443] transition-colors shadow-md"
              >
                Add Item to Order (₹{selectedItem.price})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
