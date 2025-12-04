'use client';
import { useState } from 'react';
import { AlertTriangle, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { MOCK_ANOMALIES, MOCK_CHART_DATA } from '@/data/mockData';
import { cn } from '@/lib/utils';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from 'recharts';

const severityConfig = {
  low: { label: 'Low', className: 'status-clean' },
  medium: {
    label: 'Medium',
    className: 'bg-blue-50 text-blue-700 border border-blue-200',
  },
  high: {
    label: 'High',
    className: 'bg-orange-50 text-orange-700 border border-orange-200',
  },
  critical: { label: 'Critical', className: 'status-alert' },
};

const AdminAlertsPage = () => {
  const [selectedAnomaly, setSelectedAnomaly] = useState(MOCK_ANOMALIES[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-foreground text-2xl font-semibold">
          AI Anomaly Detection
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Real-time monitoring and intelligent pattern analysis
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart Section */}
        <div className="hotel-card lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-foreground font-semibold">
                {selectedAnomaly.metric}
              </h2>
              <p className="text-muted-foreground text-sm">Last 12 hours</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="bg-primary h-3 w-3 rounded-full" />
                <span className="text-muted-foreground">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-muted-foreground/30 h-3 w-3 rounded-full" />
                <span className="text-muted-foreground">Baseline</span>
              </div>
            </div>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={MOCK_CHART_DATA}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.1}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="time"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  labelStyle={{
                    color: 'hsl(var(--foreground))',
                    fontWeight: 600,
                  }}
                />
                <ReferenceLine
                  y={selectedAnomaly.threshold}
                  stroke="hsl(var(--destructive))"
                  strokeDasharray="5 5"
                  label={{
                    value: 'Threshold',
                    position: 'right',
                    fill: 'hsl(var(--destructive))',
                    fontSize: 11,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="transparent"
                  fill="url(#colorValue)"
                />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    if (payload.isAnomaly) {
                      return (
                        <circle
                          key={`dot-visible-${payload.time}`}
                          cx={cx}
                          cy={cy}
                          r={6}
                          fill="hsl(var(--destructive))"
                          stroke="hsl(var(--card))"
                          strokeWidth={2}
                        />
                      );
                    }
                    return (
                      <circle
                        key={`dot-hidden-${payload.time}`}
                        cx={cx}
                        cy={cy}
                        r={0}
                      />
                    );
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Anomaly Point Indicator */}
          <div className="bg-destructive/5 border-destructive/20 mt-4 flex items-center gap-3 rounded-lg border p-3">
            <AlertTriangle className="text-destructive h-5 w-5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-foreground text-sm font-medium">
                Spike detected at 09:30 AM
              </p>
              <p className="text-muted-foreground text-xs">
                Value: {selectedAnomaly.value} (Threshold:{' '}
                {selectedAnomaly.threshold})
              </p>
            </div>
          </div>
        </div>

        {/* Analysis Panel */}
        <div className="space-y-4">
          {/* AI Analysis Card */}
          <div className="hotel-card">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                <TrendingUp className="text-primary h-5 w-5" />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">AI Analysis</h3>
                <span
                  className={cn(
                    'status-badge text-xs',
                    severityConfig[selectedAnomaly.severity].className
                  )}
                >
                  {severityConfig[selectedAnomaly.severity].label} Severity
                </span>
              </div>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed">
              {selectedAnomaly.analysis}
            </p>

            <div className="border-border mt-4 space-y-3 border-t pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Detected
                </span>
                <span className="text-foreground font-medium">
                  {new Date(selectedAnomaly.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Metric</span>
                <span className="text-foreground font-medium">
                  {selectedAnomaly.metric}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Peak Value</span>
                <span className="text-destructive font-medium">
                  {selectedAnomaly.value}
                </span>
              </div>
            </div>

            <button className="hotel-btn-primary mt-4 w-full">
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Resolved
            </button>
          </div>

          {/* Anomaly List */}
          <div className="hotel-card">
            <h3 className="text-foreground mb-4 font-semibold">
              Recent Anomalies
            </h3>
            <div className="space-y-2">
              {MOCK_ANOMALIES.map((anomaly) => (
                <button
                  key={anomaly.id}
                  onClick={() => setSelectedAnomaly(anomaly)}
                  className={cn(
                    'w-full rounded-lg border p-3 text-left transition-colors',
                    selectedAnomaly.id === anomaly.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-secondary'
                  )}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-foreground text-sm font-medium">
                      {anomaly.metric}
                    </span>
                    <span
                      className={cn(
                        'status-badge text-[10px]',
                        severityConfig[anomaly.severity].className
                      )}
                    >
                      {severityConfig[anomaly.severity].label}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {new Date(anomaly.timestamp).toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAlertsPage;
