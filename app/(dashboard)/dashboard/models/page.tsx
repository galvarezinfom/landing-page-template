'use client';

import { useState } from 'react';
import { Brain, Plus, Search, Cpu, CheckCircle2, Clock, AlertTriangle, MoreHorizontal, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogActions } from '@/components/ui/Dialog';
import { Tabs } from '@/components/ui/Tabs';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

type ModelStatus = 'deployed' | 'training' | 'staged' | 'deprecated';

interface AIModel {
  id: string;
  name: string;
  type: string;
  version: string;
  accuracy: number;
  latency: string;
  inferenceCount: string;
  status: ModelStatus;
  lastTrained: string;
  description: string;
  tags: string[];
}

const models: AIModel[] = [
  { id: 'MDL-001', name: 'NeuralClassifier Pro', type: 'Classification', version: 'v4.2.1', accuracy: 98.7, latency: '12ms', inferenceCount: '892M', status: 'deployed', lastTrained: 'Feb 20, 2025', description: 'Transformer-based multi-label classifier for real-time event categorization across 512 classes.', tags: ['production', 'transformer', 'nlp'] },
  { id: 'MDL-002', name: 'AnomalyDetect Elite', type: 'Anomaly Detection', version: 'v2.0.8', accuracy: 96.4, latency: '8ms', inferenceCount: '2.1B', status: 'deployed', lastTrained: 'Feb 18, 2025', description: 'LSTM-based streaming anomaly detector for infrastructure telemetry and security threat signals.', tags: ['production', 'lstm', 'security'] },
  { id: 'MDL-003', name: 'PredictFlow v3', type: 'Forecasting', version: 'v3.0.0-beta', accuracy: 94.1, latency: '34ms', inferenceCount: '45M', status: 'staged', lastTrained: 'Feb 22, 2025', description: 'Time-series foundation model for multi-horizon demand and capacity forecasting.', tags: ['beta', 'forecasting', 'tsfm'] },
  { id: 'MDL-004', name: 'SentimentCore', type: 'NLP', version: 'v1.8.3', accuracy: 91.2, latency: '22ms', inferenceCount: '320M', status: 'deployed', lastTrained: 'Feb 01, 2025', description: 'Fine-tuned BERT model for high-throughput product review and support ticket sentiment analysis.', tags: ['production', 'bert', 'nlp'] },
  { id: 'MDL-005', name: 'VisionEdge Ultra', type: 'Computer Vision', version: 'v5.1.0', accuracy: 99.1, latency: '41ms', inferenceCount: '180M', status: 'training', lastTrained: 'Running now…', description: 'Next-generation YOLOv9-based object detection pipeline for industrial quality control at the edge.', tags: ['training', 'vision', 'edge'] },
  { id: 'MDL-006', name: 'TabNet Regressor', type: 'Tabular', version: 'v1.0.2', accuracy: 87.5, latency: '5ms', inferenceCount: '11M', status: 'deprecated', lastTrained: 'Oct 10, 2024', description: 'Legacy tabular regression model — superseded by PredictFlow v3.', tags: ['deprecated'] },
];

const accuracyHistory = [
  { date: 'Jan 1', v1: 96.1, v2: 94.2 }, { date: 'Jan 8', v1: 97.3, v2: 94.8 },
  { date: 'Jan 15', v1: 97.8, v2: 95.1 }, { date: 'Jan 22', v1: 98.0, v2: 95.6 },
  { date: 'Feb 1', v1: 98.3, v2: 95.9 }, { date: 'Feb 8', v1: 98.5, v2: 96.1 },
  { date: 'Feb 15', v1: 98.7, v2: 96.4 },
];

const radarData = [
  { subject: 'Accuracy', A: 98 }, { subject: 'Speed', A: 88 },
  { subject: 'Stability', A: 94 }, { subject: 'Coverage', A: 75 },
  { subject: 'Efficiency', A: 91 }, { subject: 'Fairness', A: 85 },
];

const statusConfig: Record<ModelStatus, { variant: 'success' | 'info' | 'warning' | 'outline'; icon: React.ReactNode }> = {
  deployed: { variant: 'success', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  training: { variant: 'info', icon: <Cpu className="h-3.5 w-3.5 animate-spin" /> },
  staged: { variant: 'warning', icon: <Clock className="h-3.5 w-3.5" /> },
  deprecated: { variant: 'outline', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
};

function ModelCard({ model, onInspect }: { model: AIModel; onInspect: (m: AIModel) => void }) {
  const cfg = statusConfig[model.status];
  return (
    <Card className="flex flex-col h-full transition-all hover:shadow-lg hover:-translate-y-0.5 duration-200">
      <CardContent className="pt-5 flex-1 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-bold text-foreground truncate">{model.name}</h3>
            <p className="text-xs text-muted-foreground">{model.type} · {model.version}</p>
          </div>
          <Badge variant={cfg.variant} className="flex-shrink-0 flex items-center gap-1">
            {cfg.icon}{model.status}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{model.description}</p>
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[
            { label: 'Accuracy', value: `${model.accuracy}%` },
            { label: 'Latency', value: model.latency },
            { label: 'Inferences', value: model.inferenceCount },
          ].map((m) => (
            <div key={m.label} className="bg-muted/40 rounded-lg px-2.5 py-2 text-center">
              <p className="text-[10px] text-muted-foreground">{m.label}</p>
              <p className="text-sm font-bold text-foreground">{m.value}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {model.tags.map((tag) => <Badge key={tag} variant="outline" size="sm">{tag}</Badge>)}
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <span className="text-xs text-muted-foreground">Trained: {model.lastTrained}</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" icon={<Eye className="h-3.5 w-3.5" />} onClick={() => onInspect(model)}>
            Inspect
          </Button>
          <Button variant="ghost" size="sm" icon={<MoreHorizontal className="h-4 w-4" />}>{null}</Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function ModelsPage() {
  const [search, setSearch] = useState('');
  const [inspectModel, setInspectModel] = useState<AIModel | null>(null);
  const [deployDialog, setDeployDialog] = useState(false);

  const filtered = models.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.type.toLowerCase().includes(search.toLowerCase()) ||
    m.tags.some(t => t.includes(search.toLowerCase()))
  );

  const deployed = models.filter(m => m.status === 'deployed').length;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Brain className="h-5 w-5 text-muted-foreground" />
            AI Models
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">{deployed} models deployed · {models.filter(m => m.status === 'training').length} currently training</p>
        </div>
        <Button onClick={() => setDeployDialog(true)} icon={<Plus className="h-4 w-4" />}>Deploy Model</Button>
      </div>

      {/* Tabs: Grid + Analytics */}
      <Tabs tabs={[{ id: 'registry', label: 'Model Registry' }, { id: 'analytics', label: 'Performance Analytics' }]}>
        {(tab) => (
          <>
            {tab === 'registry' && (
              <div className="space-y-4">
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, type, tag..."
                    className="w-full pl-9 pr-4 h-9 text-sm rounded-xl bg-background border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map((model) => (
                    <ModelCard key={model.id} model={model} onInspect={setInspectModel} />
                  ))}
                  {filtered.length === 0 && (
                    <div className="col-span-full text-center py-16 text-muted-foreground">No models match your search.</div>
                  )}
                </div>
              </div>
            )}

            {tab === 'analytics' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader><CardTitle subtitle="NeuralClassifier Pro vs AnomalyDetect Elite">Accuracy Over Time</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={accuracyHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                        <YAxis domain={[93, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} unit="%" />
                        <Tooltip formatter={(v) => [`${v}%`]} />
                        <Line type="monotone" dataKey="v1" stroke="hsl(220,100%,65%)" strokeWidth={2.5} dot={false} name="NeuralClassifier Pro" />
                        <Line type="monotone" dataKey="v2" stroke="hsl(160,80%,55%)" strokeWidth={2.5} dot={false} name="AnomalyDetect Elite" />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="flex gap-4 mt-2 justify-center">
                      <div className="flex items-center gap-1.5 text-xs"><span className="w-3 h-0.5 bg-[hsl(220,100%,65%)] inline-block rounded" />NeuralClassifier Pro</div>
                      <div className="flex items-center gap-1.5 text-xs"><span className="w-3 h-0.5 bg-[hsl(160,80%,55%)] inline-block rounded" />AnomalyDetect Elite</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle subtitle="Model capability coverage across key dimensions">Quality Radar</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                        <Radar name="Model" dataKey="A" stroke="hsl(var(--foreground))" fill="hsl(var(--foreground))" fillOpacity={0.1} strokeWidth={2} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                {/* Model comparison cards */}
                <Card className="lg:col-span-2">
                  <CardHeader><CardTitle subtitle="Side-by-side performance of all deployed models">Deployed Model Benchmarks</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {models.filter(m => m.status === 'deployed').map((m) => (
                        <div key={m.id} className="flex items-center gap-4">
                          <span className="text-sm font-semibold text-foreground w-48 truncate">{m.name}</span>
                          <div className="flex-1 h-2 bg-border/40 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-foreground transition-all" style={{ width: `${m.accuracy}%` }} />
                          </div>
                          <span className="text-sm font-mono font-bold text-foreground w-16 text-right">{m.accuracy}%</span>
                          <Badge variant="success" size="sm">{m.latency}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </Tabs>

      {/* Inspect Dialog */}
      <Dialog open={!!inspectModel} onClose={() => setInspectModel(null)} title={inspectModel?.name} description={`${inspectModel?.type} · ${inspectModel?.version}`} maxWidth="lg">
        {inspectModel && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{inspectModel.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { l: 'Accuracy', v: `${inspectModel.accuracy}%` },
                { l: 'Latency', v: inspectModel.latency },
                { l: 'Inferences', v: inspectModel.inferenceCount },
                { l: 'Last Trained', v: inspectModel.lastTrained },
              ].map((f) => (
                <div key={f.l} className="bg-muted/40 rounded-xl px-4 py-3">
                  <p className="text-xs text-muted-foreground">{f.l}</p>
                  <p className="text-sm font-bold text-foreground">{f.v}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {inspectModel.tags.map(t => <Badge key={t} variant="outline">{t}</Badge>)}
              </div>
            </div>
          </div>
        )}
        <DialogActions>
          <Button variant="outline" onClick={() => setInspectModel(null)}>Close</Button>
          {inspectModel?.status === 'staged' && <Button>Promote to Production</Button>}
          {inspectModel?.status === 'deployed' && <Button variant="danger">Rollback</Button>}
        </DialogActions>
      </Dialog>

      {/* Deploy Dialog */}
      <Dialog open={deployDialog} onClose={() => setDeployDialog(false)} title="Deploy New Model" description="Register and deploy a model to the inference engine." maxWidth="md">
        <div className="space-y-4">
          {[
            { label: 'Model Name', placeholder: 'e.g. FraudDetect Pro' },
            { label: 'Model Type', placeholder: 'Classification / Regression / NLP…' },
            { label: 'Artifact URI', placeholder: 's3://nexus-models/artifacts/v1.0.0' },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-sm font-semibold text-foreground mb-1.5">{f.label}</label>
              <input placeholder={f.placeholder} className="w-full px-4 py-2.5 text-sm rounded-xl bg-muted/40 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Initial deployment target</label>
            <select className="w-full px-4 py-2.5 text-sm rounded-xl bg-muted/40 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20">
              <option>Staging</option><option>Canary (5%)</option><option>Production</option>
            </select>
          </div>
        </div>
        <DialogActions>
          <Button variant="outline" onClick={() => setDeployDialog(false)}>Cancel</Button>
          <Button onClick={() => setDeployDialog(false)}>Deploy Model</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
