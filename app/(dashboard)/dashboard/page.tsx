'use client';

import { useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Dialog, DialogActions } from '@/components/ui/Dialog';
import { Tabs } from '@/components/ui/Tabs';
import {
  TrendingUp, TrendingDown, Activity, Database, Brain, Zap,
  MoreHorizontal, Download, RefreshCw, Eye
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const inferenceSeries = [
  { time: '00:00', inferences: 820, latency: 38 }, { time: '02:00', inferences: 540, latency: 41 },
  { time: '04:00', inferences: 320, latency: 44 }, { time: '06:00', inferences: 810, latency: 36 },
  { time: '08:00', inferences: 1240, latency: 32 }, { time: '10:00', inferences: 1890, latency: 29 },
  { time: '12:00', inferences: 2100, latency: 28 }, { time: '14:00', inferences: 1750, latency: 31 },
  { time: '16:00', inferences: 2300, latency: 27 }, { time: '18:00', inferences: 1980, latency: 30 },
  { time: '20:00', inferences: 1420, latency: 33 }, { time: '22:00', inferences: 950, latency: 37 },
];

const weeklyData = [
  { day: 'Mon', queries: 18400, errors: 120 }, { day: 'Tue', queries: 22100, errors: 98 },
  { day: 'Wed', queries: 19800, errors: 143 }, { day: 'Thu', queries: 25600, errors: 76 },
  { day: 'Fri', queries: 29000, errors: 88 }, { day: 'Sat', queries: 12400, errors: 55 },
  { day: 'Sun', queries: 9800, errors: 42 },
];

const modelAccuracy = [
  { name: 'Mon', accuracy: 96.1 }, { name: 'Tue', accuracy: 97.3 }, { name: 'Wed', accuracy: 95.8 },
  { name: 'Thu', accuracy: 98.2 }, { name: 'Fri', accuracy: 98.9 }, { name: 'Sat', accuracy: 97.6 },
  { name: 'Sun', accuracy: 99.1 },
];

const dataSourcesDistribution = [
  { name: 'REST API', value: 45 }, { name: 'gRPC', value: 28 },
  { name: 'Kafka', value: 17 }, { name: 'Webhooks', value: 10 },
];

const PIE_COLORS = ['hsl(220,100%,65%)', 'hsl(280,100%,70%)', 'hsl(160,80%,55%)', 'hsl(40,100%,65%)'];

const streamTableData = [
  { id: 'STRM-001', name: 'prod-telemetry', source: 'REST API', eventsPerSec: '1,245', status: 'active', latency: '28ms' },
  { id: 'STRM-002', name: 'user-behavior', source: 'Kafka', eventsPerSec: '892', status: 'active', latency: '31ms' },
  { id: 'STRM-003', name: 'payments-audit', source: 'gRPC', eventsPerSec: '341', status: 'active', latency: '19ms' },
  { id: 'STRM-004', name: 'ml-feedback', source: 'Webhook', eventsPerSec: '128', status: 'degraded', latency: '87ms' },
  { id: 'STRM-005', name: 'iot-sensors', source: 'Kafka', eventsPerSec: '4,012', status: 'active', latency: '22ms' },
];

// ─── Metric Card ─────────────────────────────────────────────────────────────

function MetricCard({
  title, value, change, changeLabel, icon, trend, prefix, suffix
}: {
  title: string; value: string; change?: number; changeLabel?: string;
  icon: React.ReactNode; trend?: 'up' | 'down'; prefix?: string; suffix?: string;
}) {
  return (
    <Card>
      <CardContent className="py-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-extrabold text-foreground tracking-tight">
              {prefix}<span>{value}</span>{suffix}
            </p>
            {change !== undefined && (
              <div className="flex items-center gap-1 text-xs font-medium">
                {trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
                {changeLabel && <span className="text-muted-foreground">{changeLabel}</span>}
              </div>
            )}
          </div>
          <div className="flex-shrink-0 p-2.5 rounded-xl bg-foreground/5 text-foreground/60">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: Record<string, unknown>) {
  if (!active || !(payload as unknown[])?.length) return null;
  return (
    <div className="bg-card border border-border/50 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-foreground mb-1.5">{label as string}</p>
      {(payload as { color: string; name: string; value: number }[]).map((p, i) => (
        <p key={i} style={{ color: p.color }} className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full" style={{ background: p.color }} />
          {p.name}: <span className="font-bold">{p.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
}

// ─── Main Dashboard Page ──────────────────────────────────────────────────────

export default function DashboardPage() {
  const [detailDialog, setDetailDialog] = useState(false);
  const [selectedStream, setSelectedStream] = useState<(typeof streamTableData)[0] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-foreground">Analytics Overview</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Platform metrics for the last 24 hours</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} loading={refreshing}
            icon={<RefreshCw className="h-3.5 w-3.5" />}>
            Refresh
          </Button>
          <Button variant="secondary" size="sm" icon={<Download className="h-3.5 w-3.5" />}>
            Export
          </Button>
        </div>
      </div>

      {/* ── KPI Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard title="Total Inferences" value="1.24M" change={12.5} changeLabel="vs yesterday" trend="up" icon={<Brain className="h-5 w-5" />} />
        <MetricCard title="Avg Latency" value="28" suffix="ms" change={-8.3} changeLabel="vs yesterday" trend="up" icon={<Zap className="h-5 w-5" />} />
        <MetricCard title="Active Streams" value="14" change={2} changeLabel="new today" trend="up" icon={<Activity className="h-5 w-5" />} />
        <MetricCard title="Data Processed" value="3.8" suffix="TB" change={5.1} changeLabel="vs yesterday" trend="up" icon={<Database className="h-5 w-5" />} />
      </div>

      {/* ── Tabs section ── */}
      <Tabs
        tabs={[
          { id: 'performance', label: 'Performance', icon: <Activity /> },
          { id: 'accuracy', label: 'Model Accuracy', icon: <Brain /> },
          { id: 'sources', label: 'Data Sources', icon: <Database /> },
        ]}
      >
        {(activeTab) => (
          <div className="space-y-4">
            {/* Performance Tab */}
            {activeTab === 'performance' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Inferences area chart */}
                <Card className="lg:col-span-2">
                  <CardHeader
                    action={
                      <Badge variant="success" dot>Live</Badge>
                    }
                  >
                    <CardTitle subtitle="Requests processed by the Neural Engine">Inference Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={inferenceSeries}>
                        <defs>
                          <linearGradient id="inferencesGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                        <Tooltip content={<ChartTooltip />} />
                        <Area type="monotone" dataKey="inferences" stroke="hsl(var(--foreground))" strokeWidth={2} fill="url(#inferencesGrad)" name="Inferences" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Latency bar chart */}
                <Card>
                  <CardHeader>
                    <CardTitle subtitle="P99 latency in milliseconds">Latency Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={inferenceSeries} barSize={10}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar dataKey="latency" fill="hsl(var(--foreground))" radius={[4, 4, 0, 0]} name="Latency (ms)" opacity={0.8} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Weekly queries bar chart */}
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle subtitle="Total query volume vs error rate this week">Weekly Query Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar dataKey="queries" fill="hsl(var(--foreground))" radius={[4, 4, 0, 0]} name="Queries" opacity={0.85} barSize={24} />
                        <Bar dataKey="errors" fill="hsl(0,80%,60%)" radius={[4, 4, 0, 0]} name="Errors" opacity={0.7} barSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Model Accuracy Tab */}
            {activeTab === 'accuracy' && (
              <Card>
                <CardHeader action={<Badge variant="info">7-day rolling avg</Badge>}>
                  <CardTitle subtitle="Model inference accuracy score across all deployed models">Model Accuracy Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={modelAccuracy}>
                      <defs>
                        <linearGradient id="accuracyGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(160,80%,55%)" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="hsl(160,80%,55%)" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[94, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} unit="%" />
                      <Tooltip content={<ChartTooltip />} />
                      <Line type="monotone" dataKey="accuracy" stroke="hsl(160,80%,55%)" strokeWidth={2.5} dot={{ r: 4, fill: 'hsl(160,80%,55%)' }} activeDot={{ r: 6 }} name="Accuracy" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Data Sources Tab */}
            {activeTab === 'sources' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle subtitle="Percentage share by ingestion method">Sources Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={dataSourcesDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                          {dataSourcesDistribution.map((_, index) => (
                            <Cell key={index} fill={PIE_COLORS[index]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => `${v}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2">
                      {dataSourcesDistribution.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                          {s.name}: <span className="font-bold text-foreground">{s.value}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle subtitle="Per-source ingest rates">Ingest Rates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dataSourcesDistribution.map((s, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-medium text-foreground">{s.name}</span>
                            <span className="text-muted-foreground">{s.value}%</span>
                          </div>
                          <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${s.value}%`, background: PIE_COLORS[i] }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </Tabs>

      {/* ── Data Streams Table ── */}
      <Card>
        <CardHeader
          action={
            <Button variant="secondary" size="sm" icon={<MoreHorizontal className="h-4 w-4" />}>
              View all
            </Button>
          }
        >
          <CardTitle subtitle="Live status of your active data ingestion pipelines">Active Data Streams</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table
            columns={[
              { key: 'id', header: 'Stream ID', width: '110px', render: (v) => <span className="font-mono text-xs text-muted-foreground">{v as string}</span> },
              { key: 'name', header: 'Name', render: (v) => <span className="font-semibold text-foreground">{v as string}</span> },
              { key: 'source', header: 'Source' },
              {
                key: 'eventsPerSec',
                header: 'Events/sec',
                align: 'right',
                render: (v) => <span className="font-mono font-bold text-foreground">{v as string}</span>
              },
              { key: 'latency', header: 'P99 Latency', align: 'right' },
              {
                key: 'status',
                header: 'Status',
                align: 'center',
                render: (v) => (
                  <Badge variant={v === 'active' ? 'success' : 'warning'} dot>
                    {v as string}
                  </Badge>
                )
              },
              {
                key: 'actions',
                header: 'Actions',
                align: 'center' as const,
                render: (_: unknown, row: Record<string, unknown>) => (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Eye className="h-3.5 w-3.5" />}
                    onClick={() => { setSelectedStream(row as typeof streamTableData[0]); setDetailDialog(true); }}
                  >
                    Details
                  </Button>
                ),
              },
            ]}
            data={streamTableData as unknown as Record<string, unknown>[]}
          />
        </CardContent>
      </Card>

      {/* ── Stream Detail Dialog ── */}
      <Dialog
        open={detailDialog}
        onClose={() => setDetailDialog(false)}
        title={`Stream: ${selectedStream?.name}`}
        description={`Live diagnostic view for stream ${selectedStream?.id}`}
        maxWidth="lg"
      >
        {selectedStream && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Stream ID', value: selectedStream.id },
                { label: 'Source Protocol', value: selectedStream.source },
                { label: 'Events/sec', value: selectedStream.eventsPerSec },
                { label: 'P99 Latency', value: selectedStream.latency },
              ].map((f) => (
                <div key={f.label} className="bg-muted/40 rounded-xl px-4 py-3">
                  <p className="text-xs text-muted-foreground mb-0.5">{f.label}</p>
                  <p className="text-sm font-bold text-foreground font-mono">{f.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-muted/40 rounded-xl p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Last 5 min throughput</p>
              <ResponsiveContainer width="100%" height={100}>
                <AreaChart data={inferenceSeries.slice(-6)}>
                  <defs>
                    <linearGradient id="miniGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="inferences" stroke="hsl(var(--foreground))" strokeWidth={1.5} fill="url(#miniGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <Badge variant={selectedStream.status === 'active' ? 'success' : 'warning'} dot size="md">
              Status: {selectedStream.status}
            </Badge>
          </div>
        )}
        <DialogActions>
          <Button variant="outline" onClick={() => setDetailDialog(false)}>Close</Button>
          <Button variant="danger" onClick={() => setDetailDialog(false)}>Pause Stream</Button>
          <Button onClick={() => setDetailDialog(false)}>View Full Logs</Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}
