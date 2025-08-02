import React, { useState } from "react";
import PageLayout from "@/components/PageLayout";
import FilterTabs from "@/components/FilterTabs";
import Button from "@/components/Button";
import Toast from "@/components/Toast";
import { usePoints } from "@/hooks/usePoints";

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
  const [toastState, setToastState] = useState<{show: boolean, message: string}>(
    {show: false, message: ''}
  );
  const { totalPoints: availablePoints, purchaseItem, isItemPurchased } = usePoints();

  const filteredItems = storeItems.filter(item => {
    if (activeFilter === "all") return true;
    if (activeFilter === "canAfford") return item.price <= availablePoints && item.available && !isItemPurchased(item.id);
    return item.category === activeFilter;
  });

  const handlePurchase = (itemId: string, itemPrice: number) => {
    if (purchaseItem(itemId, itemPrice)) {
      const item = storeItems.find(i => i.id === itemId);
      setToastState({
        show: true,
        message: `Purchased ${item?.name || 'item'} successfully!`
      });
    }
  };

  const canAfford = (price: number) => availablePoints >= price;

  return (
    <PageLayout points={availablePoints} title="Rewards Store">
            {/* Points Available Card */}
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 text-center">
              <div className="text-4xl font-bold text-amber-400 mb-2">{availablePoints}</div>
              <div className="text-slate-300 font-medium mb-1">Points Available</div>
              <div className="text-sm text-slate-400">Spend wisely on rewards!</div>
            </div>

            <FilterTabs
              tabs={[
                { key: "all", label: "All Items" },
                { key: "canAfford", label: "Can Afford" },
                { key: "drinks", label: "Drinks" }
              ]}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            {/* Store Items Grid */}
            <div className="grid grid-cols-2 gap-4">
              {filteredItems.map((item) => {
                const isPurchased = isItemPurchased(item.id);
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
                        <Button
                          onClick={() => handlePurchase(item.id, item.price)}
                          disabled={!isAffordable}
                          variant={isAffordable ? "primary" : "disabled"}
                          fullWidth
                          size="md"
                          className="px-4 py-3"
                        >
                          {item.price} points
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
      
      <Toast
        show={toastState.show}
        message={toastState.message}
        onClose={() => setToastState({show: false, message: ''})}
      />
    </PageLayout>
  );
};

export default StorePage;
