import React from 'react';

/**
 * Renders the top-level report tab buttons.
 *
 * @param {{ tabs: { id: string; label: string }[], activeTab: string, onTabChange: (id: string) => void }} props
 */
export const TabNavigation = ({ tabs, activeTab, onTabChange }) => (
  <div className="mb-8 flex flex-wrap gap-3 border-b border-slate-200 pb-4">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
          activeTab === tab.id
            ? 'bg-slate-900 text-white'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
