'use client';

import { useState } from 'react';
import {
  Database, Upload, Search, Plus, Folder, FileText, File,
  FolderOpen, MoreHorizontal, Download, Trash2, Eye,
  HardDrive, Layers, Shield, Clock
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis,
  Tooltip, BarChart, Bar
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Dialog, DialogActions } from '@/components/ui/Dialog';
import { Tabs } from '@/components/ui/Tabs';

// ─── Types ────────────────────────────────────────────────────────────────────

type BucketTier = 'hot' | 'warm' | 'cold' | 'archive';

interface Bucket {
  id: string;
  name: string;
  region: string;
  tier: BucketTier;
  objects: number;
  sizeGB: number;
  lastModified: string;
  versioning: boolean;
  encryption: boolean;
}

interface DataObject {
  key: string;
  name: string;
  type: 'folder' | 'parquet' | 'json' | 'csv' | 'avro' | 'other';
  sizeGB: number;
  lastModified: string;
  storageClass: BucketTier;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const buckets: Bucket[] = [
  { id: 'bkt-001', name: 'nexus-prod-telemetry', region: 'us-east-1', tier: 'hot', objects: 4821000, sizeGB: 842, lastModified: '1 min ago', versioning: true, encryption: true },
  { id: 'bkt-002', name: 'nexus-ml-training-data', region: 'us-east-1', tier: 'warm', objects: 1230000, sizeGB: 2100, lastModified: '3 hours ago', versioning: true, encryption: true },
  { id: 'bkt-003', name: 'nexus-compliance-audit', region: 'eu-west-1', tier: 'cold', objects: 8900000, sizeGB: 5400, lastModified: '2 days ago', versioning: false, encryption: true },
  { id: 'bkt-004', name: 'nexus-model-artifacts', region: 'us-west-2', tier: 'hot', objects: 14200, sizeGB: 320, lastModified: '10 min ago', versioning: true, encryption: true },
  { id: 'bkt-005', name: 'nexus-backup-2024', region: 'eu-central-1', tier: 'archive', objects: 22000000, sizeGB: 18400, lastModified: '90 days ago', versioning: false, encryption: true },
];

const dataObjects: DataObject[] = [
  { key: 'obj-01', name: 'raw/', type: 'folder', sizeGB: 0, lastModified: '1 min ago', storageClass: 'hot' },
  { key: 'obj-02', name: 'processed/', type: 'folder', sizeGB: 0, lastModified: '3 hours ago', storageClass: 'warm' },
  { key: 'obj-03', name: 'events_2025_02_25.parquet', type: 'parquet', sizeGB: 12.4, lastModified: '2 hours ago', storageClass: 'hot' },
  { key: 'obj-04', name: 'user_sessions_feb.parquet', type: 'parquet', sizeGB: 8.2, lastModified: '5 hours ago', storageClass: 'hot' },
  { key: 'obj-05', name: 'model_metrics.json', type: 'json', sizeGB: 0.08, lastModified: '1 day ago', storageClass: 'warm' },
  { key: 'obj-06', name: 'training_labels.csv', type: 'csv', sizeGB: 2.1, lastModified: '2 days ago', storageClass: 'warm' },
  { key: 'obj-07', name: 'inference_log_2025.avro', type: 'avro', sizeGB: 31.6, lastModified: '6 hours ago', storageClass: 'hot' },
  { key: 'obj-08', name: 'backup_checkpoint.tar.gz', type: 'other', sizeGB: 140.0, lastModified: '7 days ago', storageClass: 'cold' },
];

const storageGrowth = [
  { date: 'Sep', tb: 18 }, { date: 'Oct', tb: 21 }, { date: 'Nov', tb: 27 },
  { date: 'Dec', tb: 24 }, { date: 'Jan', tb: 30 }, { date: 'Feb', tb: 37 },
];

const storageByBucket = buckets.map((b) => ({
  name: b.name.replace('nexus-', '').substring(0, 16),
  gb: b.sizeGB,
}));

const accessPatternData = [
  { hour: '00', reads: 1200, writes: 340 }, { hour: '03', reads: 800, writes: 220 },
  { hour: '06', reads: 2100, writes: 560 }, { hour: '09', reads: 4800, writes: 1200 },
  { hour: '12', reads: 6200, writes: 1800 }, { hour: '15', reads: 5900, writes: 1600 },
  { hour: '18', reads: 4200, writes: 940 }, { hour: '21', reads: 2800, writes: 620 },
];

// ─── Helper components ────────────────────────────────────────────────────────

const tierStyles: Record<BucketTier, { variant: 'success' | 'warning' | 'info' | 'outline'; label: string }> = {
  hot: { variant: 'success', label: 'Hot' },
  warm: { variant: 'warning', label: 'Warm' },
  cold: { variant: 'info', label: 'Cold' },
  archive: { variant: 'outline', label: 'Archive' },
};

const fileIcons: Record<DataObject['type'], React.ReactNode> = {
  folder: <FolderOpen className="h-4 w-4 text-amber-500" />,
  parquet: <Layers className="h-4 w-4 text-blue-500" />,
  json: <FileText className="h-4 w-4 text-green-500" />,
  csv: <FileText className="h-4 w-4 text-emerald-500" />,
  avro: <FileText className="h-4 w-4 text-purple-500" />,
  other: <File className="h-4 w-4 text-muted-foreground" />,
};

function CustomTooltip({ active, payload, label }: Record<string, unknown>) {
  if (!active || !(payload as unknown[])?.length) return null;
  return (
    <div className="bg-card border border-border/50 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-foreground mb-1">{label as string}</p>
      {(payload as { color: string; name: string; value: number }[]).map((p, i) => (
        <p key={i} className="flex items-center gap-2" style={{ color: p.color }}>
          <span className="inline-block w-2 h-2 rounded-full" style={{ background: p.color }} />
          {p.name}: <span className="font-bold">{p.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StoragePage() {
  const [createBucketDialog, setCreateBucketDialog] = useState(false);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [detailTarget, setDetailTarget] = useState<Bucket | null>(null);
  const [searchObjects, setSearchObjects] = useState('');

  const totalTB = (buckets.reduce((a, b) => a + b.sizeGB, 0) / 1024).toFixed(1);
  const totalObjects = buckets.reduce((a, b) => a + b.objects, 0);

  const filteredObjects = dataObjects.filter((o) =>
    o.name.toLowerCase().includes(searchObjects.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Database className="h-5 w-5 text-muted-foreground" />
            Data Lake
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {totalTB} TB stored across {buckets.length} buckets · {(totalObjects / 1e6).toFixed(1)}M objects
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setUploadDialog(true)} icon={<Upload className="h-4 w-4" />}>
            Upload
          </Button>
          <Button onClick={() => setCreateBucketDialog(true)} icon={<Plus className="h-4 w-4" />}>
            New Bucket
          </Button>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { icon: <HardDrive className="h-5 w-5" />, label: 'Total Storage', value: `${totalTB} TB` },
          { icon: <Folder className="h-5 w-5" />, label: 'Buckets', value: buckets.length },
          { icon: <Layers className="h-5 w-5" />, label: 'Total Objects', value: `${(totalObjects / 1e6).toFixed(1)}M` },
          { icon: <Shield className="h-5 w-5" />, label: 'Encrypted', value: '100%' },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="py-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
                  <p className="text-2xl font-extrabold text-foreground tracking-tight mt-1">{kpi.value}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-foreground/5 text-foreground/60">
                  {kpi.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Tabs: Buckets / Browser / Analytics ── */}
      <Tabs
        tabs={[
          { id: 'buckets', label: 'Buckets' },
          { id: 'browser', label: 'Object Browser' },
          { id: 'analytics', label: 'Storage Analytics' },
        ]}
      >
        {(tab) => (
          <div className="space-y-4">

            {/* ── BUCKETS TAB ── */}
            {tab === 'buckets' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {buckets.map((bucket) => {
                  const tier = tierStyles[bucket.tier];
                  const usagePct = Math.min((bucket.sizeGB / 20000) * 100, 100);
                  return (
                    <Card key={bucket.id} className="hover:-translate-y-0.5 hover:shadow-lg transition-all duration-150">
                      <CardContent className="pt-5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="p-2 rounded-lg bg-muted/50 flex-shrink-0">
                              <Database className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-foreground truncate">{bucket.name}</p>
                              <p className="text-xs text-muted-foreground">{bucket.region}</p>
                            </div>
                          </div>
                          <Badge variant={tier.variant} size="sm">{tier.label}</Badge>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Storage used</span>
                            <span className="font-mono font-medium text-foreground">
                              {bucket.sizeGB >= 1024 ? `${(bucket.sizeGB / 1024).toFixed(1)} TB` : `${bucket.sizeGB} GB`}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-border/40 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-foreground transition-all"
                              style={{ width: `${usagePct}%` }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-muted-foreground">Objects</p>
                            <p className="font-semibold text-foreground">{(bucket.objects / 1000).toFixed(0)}K</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Last modified</p>
                            <p className="font-semibold text-foreground">{bucket.lastModified}</p>
                          </div>
                        </div>

                        <div className="flex gap-1.5">
                          {bucket.versioning && <Badge variant="outline" size="sm">Versioning</Badge>}
                          {bucket.encryption && <Badge variant="success" size="sm">AES-256</Badge>}
                        </div>
                      </CardContent>
                      <CardFooter className="justify-between">
                        <span className="text-xs text-muted-foreground font-mono">{bucket.id}</span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" icon={<Eye className="h-3.5 w-3.5" />} onClick={() => setDetailTarget(bucket)}>
                            Details
                          </Button>
                          <Button variant="ghost" size="sm" icon={<MoreHorizontal className="h-4 w-4" />}>{null}</Button>
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* ── OBJECT BROWSER TAB ── */}
            {tab === 'browser' && (
              <div className="space-y-4">
                {/* Breadcrumb path */}
                <div className="flex items-center gap-2 text-sm px-1">
                  <button className="font-semibold text-foreground hover:underline">nexus-prod-telemetry</button>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-muted-foreground">Browse files and folders</span>
                </div>

                {/* Search */}
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    value={searchObjects}
                    onChange={(e) => setSearchObjects(e.target.value)}
                    placeholder="Filter objects..."
                    className="w-full pl-9 pr-4 h-9 text-sm rounded-xl bg-background border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  />
                </div>

                <Card>
                  <CardContent className="px-0 pb-0">
                    <Table
                      columns={[
                        {
                          key: 'name', header: 'Name',
                          render: (v, row) => {
                            const obj = row as unknown as DataObject;
                            return (
                              <div className="flex items-center gap-2.5">
                                {fileIcons[obj.type]}
                                <span className={`text-sm font-medium ${obj.type === 'folder' ? 'text-foreground cursor-pointer hover:underline' : 'text-foreground'}`}>
                                  {v as string}
                                </span>
                              </div>
                            );
                          }
                        },
                        {
                          key: 'sizeGB', header: 'Size', align: 'right' as const,
                          render: (v) => (
                            <span className="font-mono text-sm text-muted-foreground">
                              {(v as number) === 0 ? '—' : (v as number) >= 1 ? `${(v as number).toFixed(1)} GB` : `${((v as number) * 1024).toFixed(0)} MB`}
                            </span>
                          )
                        },
                        {
                          key: 'storageClass', header: 'Tier', align: 'center' as const,
                          render: (v) => {
                            const t = tierStyles[v as BucketTier];
                            return <Badge variant={t.variant} size="sm">{t.label}</Badge>;
                          }
                        },
                        { key: 'lastModified', header: 'Last Modified', align: 'right' as const,
                          render: (v) => <span className="text-xs text-muted-foreground flex items-center gap-1 justify-end"><Clock className="h-3 w-3" />{v as string}</span>
                        },
                        {
                          key: 'key', header: 'Actions', align: 'center' as const,
                          render: (_, row) => {
                            const obj = row as unknown as DataObject;
                            if (obj.type === 'folder') return null;
                            return (
                              <div className="flex items-center justify-center gap-1">
                                <Button variant="ghost" size="sm" icon={<Download className="h-3.5 w-3.5" />}>Download</Button>
                                <Button variant="ghost" size="sm" icon={<Trash2 className="h-3.5 w-3.5 text-red-500" />}>
                                  <span className="text-red-500">Delete</span>
                                </Button>
                              </div>
                            );
                          }
                        },
                      ]}
                      data={filteredObjects as unknown as Record<string, unknown>[]}
                      emptyText="No objects found"
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ── ANALYTICS TAB ── */}
            {tab === 'analytics' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Storage growth */}
                <Card>
                  <CardHeader>
                    <CardTitle subtitle="Total data stored over the last 6 months">Storage Growth (TB)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={storageGrowth}>
                        <defs>
                          <linearGradient id="lakeGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} unit=" TB" />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="tb" stroke="hsl(var(--foreground))" strokeWidth={2} fill="url(#lakeGrad)" name="Storage (TB)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Per-bucket bars */}
                <Card>
                  <CardHeader>
                    <CardTitle subtitle="Storage consumption per bucket in GB">Bucket Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={storageByBucket} layout="vertical" barSize={10}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} unit=" GB" />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={90} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="gb" fill="hsl(var(--foreground))" radius={[0, 4, 4, 0]} name="GB" opacity={0.85} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Access patterns */}
                <Card className="lg:col-span-2">
                  <CardHeader action={<Badge variant="success" dot>Live</Badge>}>
                    <CardTitle subtitle="Object read/write access frequency by hour of day">Access Patterns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={accessPatternData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                        <XAxis dataKey="hour" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}:00`} />
                        <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="reads" fill="hsl(220,100%,65%)" radius={[4, 4, 0, 0]} name="Reads" opacity={0.85} barSize={16} />
                        <Bar dataKey="writes" fill="hsl(160,80%,55%)" radius={[4, 4, 0, 0]} name="Writes" opacity={0.85} barSize={16} />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="flex gap-6 mt-3 justify-center">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="w-3 h-0.5 bg-[hsl(220,100%,65%)] inline-block rounded" />Reads
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="w-3 h-0.5 bg-[hsl(160,80%,55%)] inline-block rounded" />Writes
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Storage tier distribution */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle subtitle="Cost and performance tradeoffs by storage tier">Tier Distribution Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {(Object.entries(tierStyles) as [BucketTier, typeof tierStyles[BucketTier]][]).map(([tier, cfg]) => {
                        const matching = buckets.filter(b => b.tier === tier);
                        const totalGB = matching.reduce((a, b) => a + b.sizeGB, 0);
                        return (
                          <div key={tier} className="rounded-xl border border-border/50 bg-muted/20 px-4 py-3 space-y-2">
                            <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>
                            <p className="text-xl font-extrabold text-foreground">
                              {totalGB >= 1024 ? `${(totalGB / 1024).toFixed(1)} TB` : `${totalGB} GB`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {matching.length} bucket{matching.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </Tabs>

      {/* ── Bucket Detail Dialog ── */}
      <Dialog
        open={!!detailTarget}
        onClose={() => setDetailTarget(null)}
        title={detailTarget?.name}
        description={`Bucket in ${detailTarget?.region} · ${tierStyles[detailTarget?.tier ?? 'hot']?.label} tier`}
        maxWidth="lg"
      >
        {detailTarget && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { l: 'Bucket ID', v: detailTarget.id },
                { l: 'Region', v: detailTarget.region },
                { l: 'Storage Tier', v: tierStyles[detailTarget.tier].label },
                { l: 'Total Size', v: detailTarget.sizeGB >= 1024 ? `${(detailTarget.sizeGB / 1024).toFixed(1)} TB` : `${detailTarget.sizeGB} GB` },
                { l: 'Objects', v: (detailTarget.objects / 1000).toFixed(0) + 'K' },
                { l: 'Last Modified', v: detailTarget.lastModified },
              ].map((f) => (
                <div key={f.l} className="bg-muted/40 rounded-xl px-4 py-3">
                  <p className="text-xs text-muted-foreground">{f.l}</p>
                  <p className="text-sm font-bold text-foreground font-mono">{f.v}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${detailTarget.versioning ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted/40 text-muted-foreground'} text-xs font-semibold`}>
                <Shield className="h-3.5 w-3.5" />
                Versioning: {detailTarget.versioning ? 'Enabled' : 'Disabled'}
              </div>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-semibold`}>
                <Shield className="h-3.5 w-3.5" />
                Encryption: AES-256
              </div>
            </div>
          </div>
        )}
        <DialogActions>
          <Button variant="outline" onClick={() => setDetailTarget(null)}>Close</Button>
          <Button variant="danger" onClick={() => setDetailTarget(null)}>Delete Bucket</Button>
          <Button onClick={() => setDetailTarget(null)}>Open Browser</Button>
        </DialogActions>
      </Dialog>

      {/* ── Create Bucket Dialog ── */}
      <Dialog open={createBucketDialog} onClose={() => setCreateBucketDialog(false)} title="Create New Bucket" description="Configure your storage bucket settings." maxWidth="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Bucket Name</label>
            <input placeholder="nexus-my-bucket-name" className="w-full px-4 py-2.5 text-sm rounded-xl bg-muted/40 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            <p className="text-xs text-muted-foreground mt-1">Must be globally unique, 3-63 characters, lowercase only</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Region</label>
              <select className="w-full px-4 py-2.5 text-sm rounded-xl bg-muted/40 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20">
                <option>us-east-1</option><option>us-west-2</option>
                <option>eu-west-1</option><option>eu-central-1</option><option>ap-southeast-1</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Storage Tier</label>
              <select className="w-full px-4 py-2.5 text-sm rounded-xl bg-muted/40 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20">
                <option>Hot — Frequent access</option>
                <option>Warm — Infrequent access</option>
                <option>Cold — Rarely accessed</option>
                <option>Archive — Long-term backup</option>
              </select>
            </div>
          </div>
          <div className="space-y-3 border-t border-border/40 pt-4">
            {[
              { label: 'Enable Versioning', desc: 'Keep all versions of every object' },
              { label: 'Enable AES-256 Encryption', desc: 'Server-side encryption at rest' },
              { label: 'Enable Access Logging', desc: 'Record all object-level access events' },
            ].map((opt) => (
              <label key={opt.label} className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded border-border" />
                <div>
                  <p className="text-sm font-medium text-foreground">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
        <DialogActions>
          <Button variant="outline" onClick={() => setCreateBucketDialog(false)}>Cancel</Button>
          <Button onClick={() => setCreateBucketDialog(false)}>Create Bucket</Button>
        </DialogActions>
      </Dialog>

      {/* ── Upload Dialog ── */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} title="Upload Objects" description="Upload files directly to the selected bucket." maxWidth="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Destination Bucket</label>
            <select className="w-full px-4 py-2.5 text-sm rounded-xl bg-muted/40 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20">
              {buckets.map(b => <option key={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Prefix (Folder Path)</label>
            <input placeholder="raw/2025/02/" className="w-full px-4 py-2.5 text-sm rounded-xl bg-muted/40 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          {/* Drag-and-drop area */}
          <div className="border-2 border-dashed border-border/60 rounded-xl flex flex-col items-center justify-center py-10 gap-2 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground">Drag & drop files here</p>
            <p className="text-xs text-muted-foreground">or click to browse · Max 5GB per file</p>
          </div>
        </div>
        <DialogActions>
          <Button variant="outline" onClick={() => setUploadDialog(false)}>Cancel</Button>
          <Button icon={<Upload className="h-4 w-4" />} onClick={() => setUploadDialog(false)}>Upload Files</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
