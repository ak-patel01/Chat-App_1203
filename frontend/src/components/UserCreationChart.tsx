import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TrendDataPoint {
  date: string;
  count: number;
}

interface UserCreationChartProps {
  data: TrendDataPoint[];
}

// Format "2026-02-25" → "Feb 25"
function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Custom tooltip matching the app's card style
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card px-3 py-2 shadow-lg">
      <p className="text-xs text-muted-foreground mb-0.5">
        {formatDateLabel(label ?? "")}
      </p>
      <p className="text-sm font-semibold text-foreground">
        {payload[0].value} {payload[0].value === 1 ? "user" : "users"}
      </p>
    </div>
  );
}

export default function UserCreationChart({ data }: UserCreationChartProps) {
  // Show ~7 ticks max on X axis
  const tickInterval = Math.max(1, Math.floor(data.length / 7));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="userTrendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="hsl(var(--primary))"
              stopOpacity={0.3}
            />
            <stop
              offset="95%"
              stopColor="hsl(var(--primary))"
              stopOpacity={0.02}
            />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
          vertical={false}
        />

        <XAxis
          dataKey="date"
          tickFormatter={formatDateLabel}
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={{ stroke: "hsl(var(--border))" }}
          interval={tickInterval}
        />

        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
        />

        <Tooltip
          content={<ChartTooltip />}
          cursor={{
            stroke: "hsl(var(--primary))",
            strokeWidth: 1,
            strokeDasharray: "4 4",
          }}
        />

        <Area
          type="monotone"
          dataKey="count"
          stroke="hsl(var(--primary))"
          strokeWidth={2.5}
          fill="url(#userTrendGradient)"
          dot={false}
          activeDot={{
            r: 5,
            fill: "hsl(var(--primary))",
            stroke: "hsl(var(--card))",
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
