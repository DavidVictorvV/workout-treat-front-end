import React, { useState } from "react";
import { Dumbbell } from "lucide-react";

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: "all" | "canAfford" | "drinks";
  available: boolean;
}

const storeItems: StoreItem[] = [
  {
    id: "1",
    name: "Coca-Cola",
    description: "Classic 330ml",
    price: 100,
    icon: "🥤",
    category: "drinks",
    available: true
  },
  {
    id: "2",
    name: "Water Bottle",
    description: "Pure 500ml",
    price: 50,
    icon: "💧",
    category: "drinks",
    available: true
  },
  {
    id: "3",
    name: "Energy Drink",
    description: "Boost 250ml",
    price: 80,
    icon: "⚡",
    category: "drinks",
    available: false
  },
  {
    id: "4",
    name: "Orange Juice",
    description: "Fresh 300ml",
    price: 80,
    icon: "🍊",
    category: "drinks",
    available: true
  },
  {
    id: "5",
    name: "Cold Coffee",
    description: "Iced 350ml",
    price: 120,
    icon: "☕",
    category: "drinks",
    available: true
  },
  {
    id: "6",
    name: "Protein Bar",
    description: "Chocolate",
    price: 150,
    icon: "🍫",
    category: "all",
    available: false
  },
  {
    id: "7",
    name: "Nuts Mix",
    description: "Healthy 100g",
    price: 180,
    icon: "🥜",
    category: "all",
    available: true
  },
  {
    id: "8",
    name: "Apple",
    description: "Fresh & crispy",
    price: 60,
    icon: "🍎",
    category: "all",
    available: true
  },
  {
    id: "9",
    name: "Greek Yogurt",
    description: "Protein 150g",
    price: 90,
    icon: "🥛",
    category: "all",
    available: false
  }
];

type FilterCategory = "all" | "canAfford" | "drinks";

const StorePage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [availablePoints] = useState(300);
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(new Set());

  const filteredItems = storeItems.filter(item => {
    if (activeFilter === "all") return true;
    if (activeFilter === "canAfford") return item.price <= availablePoints && item.available;
    return item.category === activeFilter;
  });

  const handlePurchase = (itemId: string, itemPrice: number) => {
    if (availablePoints >= itemPrice) {
      setPurchasedItems(prev => new Set([...prev, itemId]));
    }
  };

  const canAfford = (price: number) => availablePoints >= price;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg text-white">FitPoints</h1>
            </div>
            <div className="flex items-center bg-slate-800/80 rounded-full px-4 py-2 space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">★</span>
              </div>
              <span className="text-amber-400 text-lg">{availablePoints}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="pb-24 px-4">
        <div className="py-6">
          <h2 className="text-2xl text-white mb-6">Rewards Store</h2>
          <div className="space-y-6">
            {/* Points Available Card */}
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 text-center">
              <div className="text-4xl font-bold text-amber-400 mb-2">{availablePoints}</div>
              <div className="text-slate-300 font-medium mb-1">Points Available</div>
              <div className="text-sm text-slate-400">Spend wisely on rewards!</div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-3">
              <button
                onClick={() => setActiveFilter("all")}
                className={`flex-1 h-12 rounded-xl transition-all duration-200 px-4 py-2 ${
                  activeFilter === "all"
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg"
                    : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                All Items
              </button>
              <button
                onClick={() => setActiveFilter("canAfford")}
                className={`flex-1 h-12 rounded-xl transition-all duration-200 px-4 py-2 ${
                  activeFilter === "canAfford"
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg"
                    : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                Can Afford
              </button>
              <button
                onClick={() => setActiveFilter("drinks")}
                className={`flex-1 h-12 rounded-xl transition-all duration-200 px-4 py-2 ${
                  activeFilter === "drinks"
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg"
                    : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                Drinks
              </button>
            </div>

            {/* Store Items Grid */}
            <div className="grid grid-cols-2 gap-4">
              {filteredItems.map((item) => {
                const isPurchased = purchasedItems.has(item.id);
                const isAffordable = canAfford(item.price);
                const isAvailable = item.available;
                
                return (
                  <div
                    key={item.id}
                    className={`bg-slate-800/40 backdrop-blur-sm rounded-2xl p-4 border transition-all duration-200 ${
                      !isAvailable 
                        ? "border-red-500/30 opacity-60"
                        : "border-slate-700/50 hover:border-slate-600/50"
                    }`}
                  >
                    <div className="text-center">
                      <div className="mb-4 flex justify-center">
                        <div className="text-4xl">
                          {item.icon}
                        </div>
                      </div>
                      <h3 className="font-semibold text-white mb-1 text-base truncate">{item.name}</h3>
                      <p className="text-sm text-slate-400 mb-4">{item.description}</p>
                      
                      {!isAvailable ? (
                        <div className="bg-red-600/20 text-red-400 px-4 py-2 rounded-xl border border-red-500/30 text-sm">
                          Out of Stock
                        </div>
                      ) : isPurchased ? (
                        <div className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm">
                          Purchased
                        </div>
                      ) : (
                        <button
                          onClick={() => handlePurchase(item.id, item.price)}
                          disabled={!isAffordable}
                          className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                            isAffordable
                              ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:shadow-lg hover:scale-105"
                              : "bg-slate-600 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          {item.price} points
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePage;
