import React from 'react';

const COLOR_CLASSES = {
  blue: {
    bg:     'bg-blue-50',
    border: 'border-blue-200',
    text:   'text-blue-600',
    icon:   'text-blue-600',
  },
  green: {
    bg:     'bg-green-50',
    border: 'border-green-200',
    text:   'text-green-600',
    icon:   'text-green-600',
  },
  amber: {
    bg:     'bg-orange-50',
    border: 'border-orange-200',
    text:   'text-orange-600',
    icon:   'text-orange-600',
  },
  purple: {
    bg:     'bg-purple-50',
    border: 'border-purple-200',
    text:   'text-purple-600',
    icon:   'text-purple-600',
  },
};

/**
 * Reusable summary metric card used across all report tabs.
 *
 * @param {{ title: string, value: string|number, icon: React.ElementType, color?: string, subtitle?: string }} props
 */
export const MetricCard = ({ title, value, icon: Icon, color = 'blue', subtitle }) => {
  const colors = COLOR_CLASSES[color] ?? COLOR_CLASSES.blue;

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-lg p-4 shadow-sm`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-slate-800 text-sm mb-1 font-semibold">{title}</p>
          <p className="text-xl font-bold text-slate-900">{value}</p>
        </div>
        <Icon className={`h-6 w-6 ${colors.icon} opacity-80`} />
      </div>
      {subtitle && <p className={`text-xs ${colors.text} mt-2`}>{subtitle}</p>}
    </div>
  );
};
