import React from "react";

export interface ChartTabProps {
  tabs: { label: string; value: string }[];
  selected: string;
  onSelect: (value: string) => void;
}

const ChartTab: React.FC<ChartTabProps> = ({ tabs, selected, onSelect }) => (
  <div className="inline-flex rounded-full bg-gray-100 p-1">
    {tabs.map((tab) => {
      const active = tab.value === selected;
      return (
        <button
          key={tab.value}
          onClick={() => onSelect(tab.value)}
          className={`px-4 py-1 text-sm font-medium rounded-full transition ` + (active ? "bg-white text-gray-900 shadow" : "text-gray-500 hover:text-gray-700")}
        >
          {tab.label}
        </button>
      );
    })}
  </div>
);

export default ChartTab;
