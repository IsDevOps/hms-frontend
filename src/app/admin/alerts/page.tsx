'use client';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
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
import { useGetGraphQuery } from '@/store/services/admin-dashboard';

const AdminAlertsPage = () => {
  const roomId = '002dd28c-63b3-4609-8194-2b8626f9e37c';
  const { data, isLoading } = useGetGraphQuery(roomId);
  if (isLoading) return <p className="p-6">Loading sensor data...</p>;
  if (!data) return <p className="p-6">No data available.</p>;
  const { graphData, metricLabel, aiAnalysis } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-foreground text-2xl font-semibold">
          {metricLabel}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Real-time anomaly detection for sensor type:{' '}
          {data.roomDetails.sensorType}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* === Chart Section === */}
        <div className="hotel-card lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-foreground font-semibold">{metricLabel}</h2>
            <p className="text-muted-foreground text-sm">Last 12 hours</p>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={graphData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />

                <XAxis dataKey="time" />
                <YAxis />

                <Tooltip />

                {/* Threshold line based on AI anomaly */}
                {aiAnalysis.anomalyDetected && (
                  <ReferenceLine
                    y={
                      graphData.find((i: any) => i.time === aiAnalysis.time)
                        ?.value
                    }
                    stroke="hsl(var(--destructive))"
                    strokeDasharray="5 5"
                    label="Spike"
                  />
                )}

                {/* Shaded area */}
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="transparent"
                  fill="url(#colorValue)"
                />

                {/* Baseline */}
                <Line
                  type="monotone"
                  dataKey="baseline"
                  stroke="gray"
                  strokeDasharray="5 5"
                  dot={false}
                />

                {/* Value line */}
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {aiAnalysis.anomalyDetected && (
            <div className="bg-destructive/5 border-destructive/20 mt-4 flex items-center gap-3 rounded-lg border p-3">
              <AlertTriangle className="text-destructive h-5 w-5" />
              <div>
                <p className="text-sm font-medium">
                  Spike at {aiAnalysis.time}
                </p>
                <p className="text-muted-foreground text-xs">
                  Severity: {aiAnalysis.severity}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* === AI Analysis Panel === */}
        <div className="hotel-card">
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            {aiAnalysis.description}
          </p>

          <div className="mt-4 space-y-3 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" /> Detected
              </span>
              <span className="text-foreground font-medium">
                {aiAnalysis.time}
              </span>
            </div>
          </div>

          <button className="hotel-btn-primary mt-4 w-full">
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark as Resolved
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAlertsPage;
