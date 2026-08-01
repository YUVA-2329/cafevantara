import React, { useState } from 'react';
import { CartItem } from '../types';

interface ShoppingBagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, delta: number) => void;
  onClearCart: () => void;
}

export const ShoppingBagDrawer: React.FC<ShoppingBagDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onClearCart,
}) => {
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [diningOption, setDiningOption] = useState<'sanctuary' | 'takeaway'>('sanctuary');

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.item.price * item.quantity, 0);
  const taxes = Math.round(subtotal * 0.05); // 5% GST
  const total = subtotal + taxes;

  const handlePlaceOrder = () => {
    setOrderSubmitted(true);
  };

  const handleReset = () => {
    setOrderSubmitted(false);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="bg-[#fcf9f0] w-full max-w-md h-full flex flex-col justify-between p-6 sm:p-8 border-l border-[#d5c3bb] shadow-2xl relative overflow-y-auto">
        {/* Drawer Header */}
        <div>
          <div className="flex justify-between items-center border-b border-[#d5c3bb]/60 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="icon text-[#131e18]">shopping_bag</span>
              <h2 className="font-garamond text-2xl text-[#1c1c17] font-medium">
                Sanctuary Order Bag
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-[#737874] hover:text-[#1c1c17] font-mono text-xl"
            >
              ✕
            </button>
          </div>

          {orderSubmitted ? (
            <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
              <div className="w-16 h-16 rounded-full bg-[#d2eac0] text-[#0e2006] flex items-center justify-center">
                <span className="icon text-3xl">check</span>
              </div>
              <span className="font-hanken text-[10px] text-[#506443] uppercase tracking-[0.2em] font-bold">
                ORDER RECEIVED
              </span>
              <h3 className="font-garamond text-3xl text-[#1c1c17]">
                Brewing in Indiranagar
              </h3>
              <p className="font-hanken text-xs text-[#434844] max-w-xs leading-relaxed">
                Your artisanal order has been dispatched to our sanctuary baristas.
              </p>

              <div className="w-full bg-[#f1eee5] p-4 border border-[#d5c3bb]/60 mt-4 text-left font-hanken text-xs">
                <p className="font-bold text-[#1c1c17] uppercase text-[10px] tracking-wider mb-2">
                  Order Status
                </p>
                <div className="flex items-center gap-2 text-[#506443] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#506443] animate-ping" />
                  Preparing beans & fresh jaggery... (~6 mins)
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full mt-6 bg-[#131e18] text-white py-3 font-hanken text-xs uppercase tracking-widest hover:bg-[#506443] transition-colors"
              >
                Done
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-16">
              <span className="icon text-4xl text-[#c3c8c3] mb-2">local_cafe</span>
              <p className="font-garamond text-2xl text-[#1c1c17] mb-2">
                Your bag is empty
              </p>
              <p className="font-hanken text-xs text-[#737874] leading-relaxed">
                Explore our rainy day specials or single-origin pour overs to add items.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Dining option selection */}
              <div className="flex border border-[#c3c8c3]/60 p-1 bg-[#f1eee5] mb-2">
                <button
                  type="button"
                  onClick={() => setDiningOption('sanctuary')}
                  className={`flex-1 py-2 font-hanken text-[11px] uppercase tracking-wider transition-colors ${
                    diningOption === 'sanctuary'
                      ? 'bg-[#131e18] text-white font-bold'
                      : 'text-[#434844] hover:text-[#1c1c17]'
                  }`}
                >
                  Dine at Sanctuary
                </button>
                <button
                  type="button"
                  onClick={() => setDiningOption('takeaway')}
                  className={`flex-1 py-2 font-hanken text-[11px] uppercase tracking-wider transition-colors ${
                    diningOption === 'takeaway'
                      ? 'bg-[#131e18] text-white font-bold'
                      : 'text-[#434844] hover:text-[#1c1c17]'
                  }`}
                >
                  Eco Takeaway
                </button>
              </div>

              {/* Cart items list */}
              <div className="flex flex-col gap-4 max-h-[50vh] overflow-y-auto pr-1">
                {cart.map((cartItem, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-[#f1eee5] p-3 border border-[#d5c3bb]/40"
                  >
                    <div className="flex gap-3 items-center">
                      <img
                        src={cartItem.item.image}
                        alt={cartItem.item.name}
                        className="w-14 h-14 object-cover border border-[#c3c8c3]/40"
                      />
                      <div>
                        <h4 className="font-garamond text-lg text-[#1c1c17] font-medium leading-tight">
                          {cartItem.item.name}
                        </h4>
                        <p className="font-hanken text-[11px] text-[#737874]">
                          {cartItem.temperature} • {cartItem.milkChoice || 'Standard'}
                        </p>
                        <p className="font-garamond font-bold text-xs text-[#131e18]">
                          ₹{cartItem.item.price * cartItem.quantity}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 border border-[#c3c8c3] bg-[#fcf9f0] px-2 py-1">
                      <button
                        onClick={() => onUpdateQuantity(idx, -1)}
                        className="font-mono text-xs text-[#737874] hover:text-[#1c1c17] px-1"
                      >
                        -
                      </button>
                      <span className="font-hanken text-xs font-bold w-4 text-center">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(idx, 1)}
                        className="font-mono text-xs text-[#737874] hover:text-[#1c1c17] px-1"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer with Price Breakdown */}
        {!orderSubmitted && cart.length > 0 && (
          <div className="border-t border-[#d5c3bb] pt-4 mt-6">
            <div className="flex justify-between text-xs font-hanken text-[#737874] mb-1">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-xs font-hanken text-[#737874] mb-3">
              <span>GST (5%)</span>
              <span>₹{taxes}</span>
            </div>
            <div className="flex justify-between text-base font-garamond font-bold text-[#1c1c17] border-t border-[#ebe8df] pt-2 mb-6">
              <span>Total Amount</span>
              <span>₹{total}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full bg-[#131e18] text-[#fcf9f0] py-4 font-hanken text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#506443] transition-colors shadow-md"
            >
              Place Order • ₹{total}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
