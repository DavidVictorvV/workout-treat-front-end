
interface FilterTab {
  key: string;
  label: string;
}

interface FilterTabsProps<T extends string> {
  tabs: FilterTab[];
  activeFilter: T;
  onFilterChange: (filter: T) => void;
}

const FilterTabs = <T extends string>({ tabs, activeFilter, onFilterChange }: FilterTabsProps<T>) => {
  return (
    <div className="flex gap-3">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onFilterChange(tab.key as T)}
          className={`flex-1 h-12 rounded-xl transition-all duration-200 px-4 py-2 ${
            activeFilter === tab.key
              ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg"
              : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;