'use client';

import { useState } from 'react';
import { Settings, User, Key, CreditCard, Bell, Shield, Save, Copy, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogActions } from '@/components/ui/Dialog';

type SettingsTab = 'profile' | 'api-keys' | 'billing' | 'notifications' | 'security';

const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
  { id: 'api-keys', label: 'API Keys', icon: <Key className="h-4 w-4" /> },
  { id: 'billing', label: 'Billing', icon: <CreditCard className="h-4 w-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
  { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
];

const apiKeys = [
  { id: 'key-1', name: 'Production API', key: 'nxs_prod_•••••••••••••••4f2e', created: 'Jan 12, 2025', lastUsed: '2 min ago', scopes: ['read', 'write', 'admin'] },
  { id: 'key-2', name: 'CI/CD Pipeline', key: 'nxs_ci_•••••••••••••••9a1b', created: 'Feb 01, 2025', lastUsed: '1 hour ago', scopes: ['read', 'write'] },
  { id: 'key-3', name: 'Read-only SDK', key: 'nxs_sdk_•••••••••••••••3c8d', created: 'Feb 14, 2025', lastUsed: 'Never', scopes: ['read'] },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-foreground/20 ${enabled ? 'bg-foreground' : 'bg-muted'}`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-background shadow transition duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

function FormField({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-3 py-4 border-b border-border/40 last:border-0">
      <div className="sm:w-56 flex-shrink-0">
        <label className="text-sm font-semibold text-foreground">{label}</label>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [newKeyDialog, setNewKeyDialog] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);
  const [notifs, setNotifs] = useState({ email: true, slack: false, webhooks: true, errorAlerts: true, usageWarnings: true, modelEvents: false });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="h-5 w-5 text-muted-foreground" />
          Settings
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account, workspace, and integrations</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar nav */}
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible lg:w-48 flex-shrink-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${activeTab === t.id ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Profile */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader action={
                <Button onClick={handleSave} loading={false} size="sm" icon={saved ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Save className="h-3.5 w-3.5" />}>
                  {saved ? 'Saved!' : 'Save changes'}
                </Button>
              }>
                <CardTitle subtitle="Your personal details and workspace preferences">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                <FormField label="Avatar">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center text-xl font-bold flex-shrink-0">JD</div>
                    <Button variant="outline" size="sm">Change Avatar</Button>
                  </div>
                </FormField>
                <FormField label="Full Name">
                  <input defaultValue="Jane Doe" className="w-full px-4 py-2.5 text-sm rounded-xl bg-muted/40 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                </FormField>
                <FormField label="Work Email" description="Used for login and notifications">
                  <input defaultValue="jane@acme.com" type="email" className="w-full px-4 py-2.5 text-sm rounded-xl bg-muted/40 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                </FormField>
                <FormField label="Workspace Name">
                  <input defaultValue="Acme Corp" className="w-full px-4 py-2.5 text-sm rounded-xl bg-muted/40 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                </FormField>
                <FormField label="Timezone">
                  <select className="w-full px-4 py-2.5 text-sm rounded-xl bg-muted/40 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20">
                    <option>UTC-05:00 — Eastern Time</option>
                    <option>UTC+00:00 — GMT</option>
                    <option>UTC+01:00 — Central European</option>
                  </select>
                </FormField>
                <FormField label="Plan" description="Current subscription tier">
                  <div className="flex items-center gap-3">
                    <Badge variant="success" size="md">Startup Plan</Badge>
                    <Button variant="outline" size="sm">Upgrade to Enterprise</Button>
                  </div>
                </FormField>
              </CardContent>
            </Card>
          )}

          {/* API Keys */}
          {activeTab === 'api-keys' && (
            <Card>
              <CardHeader action={<Button size="sm" icon={<Key className="h-3.5 w-3.5" />} onClick={() => setNewKeyDialog(true)}>Generate Key</Button>}>
                <CardTitle subtitle="Manage API keys for programmatic access to Nexus">API Keys</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {apiKeys.map((k) => (
                  <div key={k.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-border/50 bg-muted/20">
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">{k.name}</span>
                        <div className="flex gap-1">
                          {k.scopes.map((s) => <Badge key={s} variant="outline" size="sm">{s}</Badge>)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground bg-background px-3 py-1.5 rounded-lg border border-border/40 w-fit">
                        {showKey[k.id] ? 'nxs_live_5f3a•••••••••••4f2e' : k.key}
                        <button onClick={() => setShowKey(p => ({ ...p, [k.id]: !p[k.id] }))} className="ml-1 text-muted-foreground hover:text-foreground">
                          {showKey[k.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </button>
                        <button className="text-muted-foreground hover:text-foreground"><Copy className="h-3 w-3" /></button>
                      </div>
                      <p className="text-xs text-muted-foreground">Created {k.created} · Last used {k.lastUsed}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setRevokeTarget(k.id)}>
                      <span className="text-red-500">Revoke</span>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Billing */}
          {activeTab === 'billing' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle subtitle="Your current Nexus subscription">Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/50 bg-muted/20">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-extrabold text-foreground">Startup Plan</span>
                        <Badge variant="success">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">$499 / month · Renews March 25, 2025</p>
                      <p className="text-xs text-muted-foreground mt-1">5M API requests · 10 Streams · 3 AI Models</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Change Plan</Button>
                      <Button size="sm">Upgrade</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle subtitle="Summary of the current billing period">Usage This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: 'API Requests', used: 3.8, total: 5, unit: 'M' },
                      { label: 'Data Processed', used: 2.1, total: 5, unit: 'TB' },
                      { label: 'Active Streams', used: 14, total: 10, unit: '' },
                    ].map((u) => (
                      <div key={u.label} className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-foreground">{u.label}</span>
                          <span className="text-muted-foreground">{u.used}{u.unit} / {u.total}{u.unit}</span>
                        </div>
                        <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${(u.used / u.total) >= 1 ? 'bg-red-500' : (u.used / u.total) > 0.8 ? 'bg-amber-500' : 'bg-foreground'} transition-all`}
                            style={{ width: `${Math.min((u.used / u.total) * 100, 100)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle subtitle="Recent invoice history">Invoices</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { month: 'Feb 2025', amount: '$499.00', status: 'paid' },
                      { month: 'Jan 2025', amount: '$499.00', status: 'paid' },
                      { month: 'Dec 2024', amount: '$349.00', status: 'paid' },
                    ].map((inv) => (
                      <div key={inv.month} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                        <span className="text-sm font-medium text-foreground">{inv.month}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground font-mono">{inv.amount}</span>
                          <Badge variant="success">{inv.status}</Badge>
                          <Button variant="ghost" size="sm">Download</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader action={<Button size="sm" onClick={handleSave} icon={saved ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Save className="h-3.5 w-3.5" />}>{saved ? 'Saved!' : 'Save'}</Button>}>
                <CardTitle subtitle="Choose how you receive platform alerts and updates">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                {[
                  { key: 'email' as keyof typeof notifs, label: 'Email Notifications', desc: 'Receive alerts and digests via email' },
                  { key: 'slack' as keyof typeof notifs, label: 'Slack Integration', desc: 'Post alerts to a Slack channel' },
                  { key: 'webhooks' as keyof typeof notifs, label: 'Webhook Alerts', desc: 'Send events to a custom endpoint' },
                  { key: 'errorAlerts' as keyof typeof notifs, label: 'Error Alerts', desc: 'Immediate notification on stream errors' },
                  { key: 'usageWarnings' as keyof typeof notifs, label: 'Usage Warnings', desc: 'Alert when quota reaches 80% and 95%' },
                  { key: 'modelEvents' as keyof typeof notifs, label: 'Model Events', desc: 'Notify when training completes or fails' },
                ].map((n) => (
                  <div key={n.key} className="flex items-center justify-between py-4 border-b border-border/40 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{n.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                    </div>
                    <Toggle enabled={notifs[n.key]} onChange={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key] }))} />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle subtitle="Manage your password and authentication methods">Authentication</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <FormField label="Current Password">
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 text-sm rounded-xl bg-muted/40 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                  </FormField>
                  <FormField label="New Password">
                    <input type="password" placeholder="Min. 12 characters" className="w-full px-4 py-2.5 text-sm rounded-xl bg-muted/40 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                  </FormField>
                  <div className="pt-2"><Button size="sm">Update Password</Button></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle subtitle="Add an extra layer of security to your account">Two-Factor Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Authenticator App (TOTP)</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Use Google Authenticator or 1Password</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="success" dot>Enabled</Badge>
                      <Button variant="outline" size="sm">Reconfigure</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle subtitle="Recent sign-in activity">Active Sessions</CardTitle></CardHeader>
                <CardContent>
                  {[
                    { device: 'Chrome · macOS', location: 'New York, US', time: 'Now', current: true },
                    { device: 'Safari · iPhone 15', location: 'New York, US', time: '2h ago', current: false },
                    { device: 'Firefox · Windows', location: 'Miami, US', time: '3 days ago', current: false },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-foreground flex items-center gap-2">
                          {s.device}
                          {s.current && <Badge variant="success" size="sm" dot>Current</Badge>}
                        </p>
                        <p className="text-xs text-muted-foreground">{s.location} · {s.time}</p>
                      </div>
                      {!s.current && <Button variant="ghost" size="sm"><span className="text-red-500">Revoke</span></Button>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* New API Key Dialog */}
      <Dialog open={newKeyDialog} onClose={() => setNewKeyDialog(false)} title="Generate API Key" description="New keys inherit your current workspace permissions." maxWidth="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Key Name</label>
            <input placeholder="e.g. Mobile App SDK" className="w-full px-4 py-2.5 text-sm rounded-xl bg-muted/40 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Permissions</label>
            <div className="space-y-2">
              {['Read', 'Write', 'Admin'].map((perm) => (
                <label key={perm} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked={perm === 'Read'} className="rounded border-border" />
                  <span className="text-sm text-foreground">{perm}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <DialogActions>
          <Button variant="outline" onClick={() => setNewKeyDialog(false)}>Cancel</Button>
          <Button onClick={() => setNewKeyDialog(false)}>Generate Key</Button>
        </DialogActions>
      </Dialog>

      {/* Revoke Key Dialog */}
      <Dialog open={!!revokeTarget} onClose={() => setRevokeTarget(null)} title="Revoke API Key?" description="This key will immediately stop working. Any integrations using it will fail." maxWidth="sm">
        <DialogActions>
          <Button variant="outline" onClick={() => setRevokeTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => setRevokeTarget(null)}>Revoke Key</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
