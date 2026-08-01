import React, { useState } from 'react';
import { TabType, WeatherInfo, CartItem, Reservation, MoodSpot, MenuItem } from './types';
import { weatherPresets } from './components/WeatherBanner';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { ShoppingBagDrawer } from './components/ShoppingBagDrawer';
import { DiscoverView } from './views/DiscoverView';
import { ReserveView } from './views/ReserveView';
import { OrdersView } from './views/OrdersView';
import { ClubView } from './views/ClubView';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('discover');
  const [weather, setWeather] = useState<WeatherInfo>(weatherPresets.rain);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [spotToReserve, setSpotToReserve] = useState<MoodSpot | null>(null);

  const handleAddToCart = (
    item: MenuItem,
    customization?: { temp: 'Hot' | 'Cold'; milk?: string; notes?: string }
  ) => {
    const tempChoice = customization?.temp || item.temperature || 'Hot';
    const milkChoice = customization?.milk || 'Oat Milk';

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (ci) => ci.item.id === item.id && ci.temperature === tempChoice && ci.milkChoice === milkChoice
      );
      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += 1;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            item,
            quantity: 1,
            temperature: tempChoice as 'Hot' | 'Cold',
            milkChoice,
            notes: customization?.notes,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (index: number, delta: number) => {
    setCart((prevCart) => {
      const updated = [...prevCart];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleSelectSpotToReserve = (spot: MoodSpot) => {
    setSpotToReserve(spot);
    setActiveTab('reserve');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmReservation = (res: Reservation) => {
    setReservations((prev) => [res, ...prev]);
  };

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fcf9f0] text-[#1c1c17] relative flex flex-col font-hanken selection:bg-[#506443] selection:text-white">
      {/* 1. Top App Bar */}
      <TopAppBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        weather={weather}
      />

      {/* 4. Active Main View */}
      <main className="flex-1 w-full">
        {activeTab === 'discover' && (
          <DiscoverView
            weather={weather}
            onSelectTab={setActiveTab}
            onSelectSpotToReserve={handleSelectSpotToReserve}
            onAddToCart={(item) => handleAddToCart(item)}
          />
        )}

        {activeTab === 'reserve' && (
          <ReserveView
            initialSpot={spotToReserve}
            onConfirmReservation={handleConfirmReservation}
            userReservations={reservations}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersView
            onAddToCart={handleAddToCart}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {activeTab === 'club' && <ClubView />}
      </main>

      {/* 5. Persistent Bottom Navigation */}
      <BottomNavBar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* 6. Shopping Bag Slide Drawer */}
      <ShoppingBagDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onClearCart={() => setCart([])}
      />
    </div>
  );
}
