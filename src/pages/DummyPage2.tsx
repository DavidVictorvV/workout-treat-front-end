import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import FilterTabs from "@/components/FilterTabs";
import Button from "@/components/Button";
import Toast from "@/components/Toast";
import BackendErrorDisplay from "@/components/BackendErrorDisplay";
import { useBackendData } from "@/hooks/useBackendData";
import { useAuth } from "@/hooks/useAuth";

type FilterCategory = "all" | "canAfford" | "drinks";

const StorePage: React.FC = () => {
  const { signOut } = useAuth();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [toastState, setToastState] = useState<{show: boolean, message: string}>({
    show: false, 
    message: ''
  });
  
  const { 
    totalPoints: availablePoints, 
    storeItems, 
    purchases,
    purchaseItem,
    loading,
    storeLoading,
    error,
    refreshStore
  } = useBackendData();

  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(new Set());

  // Update purchased items when purchases data changes
  useEffect(() => {
    const purchasedSet = new Set(purchases.map(p => p.id));
    setPurchasedItems(purchasedSet);
  }, [purchases]);

  const canAfford = (price: number) => availablePoints >= price;

  const filteredItems = storeItems.filter(item => {
    if (activeFilter === "all") return true;
    if (activeFilter === "canAfford") return item.price <= availablePoints && item.isAvailable && !purchasedItems.has(item.id);
    return item.category === activeFilter;
  });

  const handlePurchase = async (itemId: string) => {
    const success = await purchaseItem(itemId);
    if (success) {
      const item = storeItems.find(i => i.id === itemId);
      setPurchasedItems(prev => new Set([...prev, itemId]));
      setToastState({
        show: true,
        message: `Purchased ${item?.name || 'item'} successfully!`
      });
    }
  };

  if (loading) {
    return (
      <PageLayout points={availablePoints} title="Rewards Store">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading store...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout points={availablePoints} title="Rewards Store">
        <BackendErrorDisplay 
          error={error} 
          onRetry={() => window.location.reload()}
          onSignOut={signOut}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout points={availablePoints} title="Rewards Store">
      {/* Header with reload button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-200">Store Items</h2>
        <button
          onClick={refreshStore}
          disabled={storeLoading}
          className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg border border-slate-600/50 transition-colors disabled:opacity-50"
          title="Reload store data"
        >
          <RefreshCw className={`w-4 h-4 text-slate-300 ${storeLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

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
        {storeLoading ? (
          <div className="col-span-2 text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-2"></div>
            <p className="text-slate-400 text-sm">Loading items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-slate-400">
            <p>No items available in this category</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isPurchased = purchasedItems.has(item.id);
            const isAffordable = canAfford(item.price);
            const isAvailable = item.isAvailable;
            
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
                      onClick={() => handlePurchase(item.id)}
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
          })
        )}
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