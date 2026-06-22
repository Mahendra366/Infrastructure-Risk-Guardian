import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { RiskItem } from '../types';

interface RiskComparisonChartProps {
  data: RiskItem[];
}

export const RiskComparisonChart: React.FC<RiskComparisonChartProps> = ({ data }) => {
  const chartData = data.map(risk => ({
    name: risk.title,
    'Initial Risk (RPN)': risk.beforeScore,
    'Residual Risk (RPN)': risk.afterScore
  }));

  return (
    <div className="h-[350px] w-full py-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barGap={10}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            label={{ value: 'RPN Score', angle: -90, position: 'insideLeft', offset: 0, fill: '#94a3b8', fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: '20px', fontSize: '12px', fontWeight: 500 }}
          />
          <Bar
            dataKey="Initial Risk (RPN)"
            name="Initial Risk (Before)"
            fill="#f43f5e"
            radius={[4, 4, 0, 0]}
            barSize={40}
          />
          <Bar
            dataKey="Residual Risk (RPN)"
            name="Residual Risk (After)"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
