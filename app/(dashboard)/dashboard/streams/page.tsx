'use client';

import { useState } from 'react';
import { Activity, Plus, Search, Filter, RefreshCw, Pause, Play, Trash2, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Dialog, DialogActions } from '@/components/ui/Dialog';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

type StreamStatus = 'active' | 'paused' | 'degraded' | 'error';

interface Stream {
  id: string;
  name: string;
  source: string;
  destination: string;
  eventsPerSec: number;
  totalEvents: string;
  latency: string;
  status: StreamStatus;
  created: string;
}

const allStreams: Stream[] = [
  { id: 'STRM-001', name: 'prod-telemetry', source: 'REST API', destination: 'Data Lake Alpha', eventsPerSec: 1245, totalEvents: '4.2B', latency: '28ms', status: 'active', created: 'Jan 12, 2025' },
  { id: 'STRM-002', name: 'user-behavior', source: 'Kafka', destination: 'Analytics Engine', eventsPerSec: 892, totalEvents: '1.8B', latency: '31ms', status: 'active', created: 'Jan 18, 2025' },
  { id: 'STRM-003', name: 'payments-audit', source: 'gRPC', destination: 'Compliance Store', eventsPerSec: 341, totalEvents: '980M', latency: '19ms', status: 'active', created: 'Feb 02, 2025' },
  { id: 'STRM-004', name: 'ml-feedback', source: 'Webhook', destination: 'Model Trainer', eventsPerSec: 128, totalEvents: '320M', latency: '87ms', status: 'degraded', created: 'Feb 10, 2025' },
  { id: 'STRM-005', name: 'iot-sensors', source: 'Kafka', destination: 'Real-time Engine', eventsPerSec: 4012, totalEvents: '12.1B', latency: '22ms', status: 'active', created: 'Jan 03, 2025' },
  { id: 'STRM-006', name: 'clickstream-web', source: 'REST API', destination: 'Analytics Engine', eventsPerSec: 0, totalEvents: '890M', latency: '—', status: 'paused', created: 'Jan 25, 2025' },
  { id: 'STRM-007', name: 'error-tracking', source: 'gRPC', destination: 'Alerting Bus', eventsPerSec: 0, totalEvents: '110M', latency: '—', status: 'error', created: 'Feb 14, 2025' },
];

const sparklineData = Array.from({ length: 20 }, () => ({ v: Math.floor(Math.random() * 100) + 20 }));

const statusBadge: Record<StreamStatus, { variant: 'success' | 'warning' | 'danger' | 'outline'; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  paused: { variant: 'outline', label: 'Paused' },
  degraded: { variant: 'warning', label: 'Degraded' },
  error: { variant: 'danger', label: 'Error' },
};

export default function StreamsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | StreamStatus>('all');
  const [createDialog, setCreateDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Stream | null>(null);
  const [streams, setStreams] = useState(allStreams);

  const filtered = streams.filter((s) => {
    const matchSearch = s.name.includes(search) || s.id.includes(search) || s.source.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || s.status === filter;
    return matchSearch && matchFilter;
  });

  const togglePause = (id: string) => {
    setStreams((prev) =>
      prev.map((s) => s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s)
    );
  };

  const deleteStream = (id: string) => {
    setStreams((prev) => prev.filter((s) => s.id !== id));
    setDeleteTarget(null);
  };

  const stats = {
    active: streams.filter(s => s.status === 'active').length,
    degraded: streams.filter(s => s.status === 'degraded').length,
    error: streams.filter(s => s.status === 'error').length,
    totalEps: streams.filter(s => s.status === 'active').reduce((a, s) => a + s.eventsPerSec, 0).toLocaleString(),
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5 text-muted-foreground" />
            Data Streams
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">Manage and monitor all active ingestion pipelines</p>
        </div>
        <Button onClick={() => setCreateDialog(true)} icon={<Plus className="h-4 w-4" />}>
          New Stream
        </Button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active', value: stats.active, variant: 'success' as const },
          { label: 'Degraded', value: stats.degraded, variant: 'warning' as const },
          { label: 'Error', value: stats.error, variant: 'danger' as const },
          { label: 'Total EPS', value: stats.totalEps, variant: 'default' as const },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="py-4">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl font-extrabold text-foreground mt-1">{s.value}</p>
              <Badge variant={s.variant} size="sm" className="mt-2">{s.label}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sparkline overview */}
      <Card>
        <CardHeader action={<Badge variant="success" dot>Live</Badge>}>
          <CardTitle subtitle="Combined events per second across all active streams">Aggregate Throughput</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id="streamGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip formatter={(v) => [`${v} eps`, 'Throughput']} />
              <Area type="monotone" dataKey="v" stroke="hsl(var(--foreground))" strokeWidth={2} fill="url(#streamGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search streams..."
            className="w-full pl-9 pr-4 h-9 text-sm rounded-xl bg-background border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {(['all', 'active', 'degraded', 'paused', 'error'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`h-8 px-3 text-xs font-medium rounded-lg transition-colors capitalize ${filter === f ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Streams Table */}
      <Card>
        <CardContent className="px-0 pb-0">
          <Table
            columns={[
              { key: 'id', header: 'ID', render: (v) => <span className="font-mono text-xs text-muted-foreground">{v as string}</span> },
              { key: 'name', header: 'Stream Name', render: (v) => <span className="font-semibold text-foreground">{v as string}</span> },
              { key: 'source', header: 'Source' },
              { key: 'destination', header: 'Destination' },
              {
                key: 'eventsPerSec', header: 'EPS', align: 'right' as const,
                render: (v, row) => (
                  <span className={`font-mono font-bold ${(row as unknown as Stream).status === 'active' ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {(v as number) > 0 ? (v as number).toLocaleString() : '—'}
                  </span>
                )
              },
              { key: 'latency', header: 'Latency', align: 'right' as const },
              {
                key: 'status', header: 'Status', align: 'center' as const,
                render: (v) => {
                  const s = statusBadge[v as StreamStatus];
                  return <Badge variant={s.variant} dot={v === 'active'}>{s.label}</Badge>;
                }
              },
              {
                key: 'actions', header: 'Actions', align: 'center' as const,
                render: (_, row) => {
                  const stream = row as unknown as Stream;
                  return (
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => togglePause(stream.id)}
                        icon={stream.status === 'active' ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                      >
                        {stream.status === 'active' ? 'Pause' : 'Resume'}
                      </Button>
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => setDeleteTarget(stream)}
                        icon={<Trash2 className="h-3.5 w-3.5 text-red-500" />}
                      >
                        <span className="text-red-500">Delete</span>
                      </Button>
                    </div>
                  );
                }
              },
            ]}
            data={filtered as unknown as Record<string, unknown>[]}
            emptyText="No streams match your search criteria"
          />
        </CardContent>
      </Card>

      {/* Create Stream Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} title="Create New Data Stream" description="Configure a new ingestion pipeline to start processing events." maxWidth="md">
        <div className="space-y-4">
          {[
            { label: 'Stream Name', placeholder: 'e.g. prod-events-v2', type: 'text' },
            { label: 'Source Endpoint', placeholder: 'https://api.acme.com/events', type: 'text' },
            { label: 'Destination', placeholder: 'Data Lake / Analytics Engine', type: 'text' },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-sm font-semibold text-foreground mb-1.5">{f.label}</label>
              <input type={f.type} placeholder={f.placeholder}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-muted/40 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Protocol</label>
            <select className="w-full px-4 py-2.5 text-sm rounded-xl bg-muted/40 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20">
              <option>REST API</option><option>gRPC</option><option>Kafka</option><option>Webhook</option>
            </select>
          </div>
        </div>
        <DialogActions>
          <Button variant="outline" onClick={() => setCreateDialog(false)}>Cancel</Button>
          <Button onClick={() => setCreateDialog(false)}>Create Stream</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Stream?" description={`This will permanently destroy stream "${deleteTarget?.name}" and all its configuration. This action cannot be undone.`} maxWidth="sm">
        <p className="text-sm text-muted-foreground">Type the stream ID to confirm: <span className="font-mono font-bold text-foreground">{deleteTarget?.id}</span></p>
        <input placeholder="Enter stream ID..." className="mt-3 w-full px-4 py-2.5 text-sm rounded-xl bg-muted/40 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-red-500/30" />
        <DialogActions>
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => deleteTarget && deleteStream(deleteTarget.id)}>Delete Stream</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
