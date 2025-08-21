import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PlanData {
  name: string;
  value: number;
  color: string;
}

interface PlanDistributionChartProps {
  data: PlanData[];
  loading?: boolean;
}

const COLORS = {
  'Free': '#94a3b8',
  'Pro': '#3b82f6',
  'Enterprise': '#10b981'
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function PlanDistributionChart({ data, loading = false }: PlanDistributionChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Plano</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="w-32 h-32 bg-muted animate-pulse rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição por Plano</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#8884d8'} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [value, 'Equipes']}
              labelFormatter={(label) => `Plano ${label}`}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => `Plano ${value}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}