import { useState, useEffect } from 'react';
import { supabase, hasSupabaseConfig } from '../lib/supabaseClient';

const ADMIN_EMAIL = 'claudecard710@gmail.com';
const KNOWN_SITES = [
  { key: 'claudecard',      name: 'ClaudeCard'       },
  { key: 'granny_frannies', name: "Granny Frannie's" },
  { key: 'savvy_scuba',     name: 'Savvy Scuba'      },
];

function tierOf(pts) {
  if (pts >= 1500) return 'Founding Flame';
  if (pts >= 750)  return 'Inner Circle';
  if (pts >= 300)  return 'Regular';
  return 'Taster';
}

const money = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

// ── Shared styles ──────────────────────────────────────────
const mkS = () => ({
  page:   { minHeight: '100vh', background: '#F5F7FC', fontFamily: 'DM Sans, system-ui, sans-serif' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 28px', background: '#0C1023', color: '#F5F0E8', gap: 16, flexWrap: 'wrap' },
  body:   { maxWidth: 1100, margin: '0 auto', padding: '28px 20px' },
  tabs:   { display: 'flex', gap: 4, marginBottom: 24, borderBottom: '2px solid rgba(80,100,160,0.15)', flexWrap: 'wrap' },
  tab:    (a) => ({ padding: '8px 16px', border: 'none', borderBottom: `2px solid ${a ? '#0C1023' : 'transparent'}`, background: 'none', color: a ? '#0C1023' : '#68748E', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', marginBottom: -2, fontFamily: 'inherit' }),
  card:   { background: '#fff', borderRadius: 10, border: '1px solid rgba(80,100,160,0.12)', overflow: 'hidden', marginBottom: 16 },
  hdr:    { padding: '14px 20px', background: '#F5F7FC', borderBottom: '1px solid rgba(80,100,160,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  body2:  { padding: 20 },
  row:    { padding: '12px 0', borderBottom: '1px solid rgba(80,100,160,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' },
  inp:    { padding: '7px 10px', border: '1px solid rgba(80,100,160,0.2)', borderRadius: 6, fontSize: '0.85rem', color: '#0C1023', outline: 'none', background: '#fff', fontFamily: 'inherit' },
  btn:    { padding: '7px 14px', background: '#0C1023', color: '#fff', border: 'none', borderRadius: 6, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  badge:  { display: 'inline-block', padding: '2px 8px', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700, background: 'rgba(12,16,35,0.06)', color: '#0C1023' },
  center: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  loginCard: { width: '100%', maxWidth: '380px', background: '#fff', borderRadius: 12, padding: '2.5rem', boxShadow: '0 4px 32px rgba(12,16,35,0.08)' },
  form:   { display: 'grid', gap: '0.5rem', marginBottom: 12 },
  label:  { fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#68748E', display: 'block', marginBottom: 3 },
  textarea: { width: '100%', padding: '7px 10px', border: '1px solid rgba(80,100,160,0.2)', borderRadius: 6, fontSize: '0.85rem', color: '#0C1023', outline: 'none', background: '#fff', fontFamily: 'inherit', resize: 'vertical', minHeight: 70, boxSizing: 'border-box' },
});

// ── Member row ─────────────────────────────────────────────
function MemberRow({ m, S, onAward }) {
  const [apts,    setApts]    = useState('');
  const [site,    setSite]    = useState(KNOWN_SITES[0].key);
  const [areason, setAreason] = useState('');
  const tier  = tierOf(m.profile?.global_points || 0);
  const email = m.profile?.email || m.user_id?.slice(0, 8) + '…';
  return (
    <div style={S.row}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <strong style={{ color: '#0C1023' }}>{email}</strong>
        <p style={{ margin: '2px 0', fontSize: '0.78rem', color: '#68748E' }}>
          <span style={S.badge}>{tier}</span> · {m.profile?.global_points || 0} global pts
        </p>
        <div style={{ marginTop: 5, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {m.memberships.map(mb => (
            <span key={mb.site_key} style={{ ...S.badge, background: 'rgba(198,160,90,0.1)', color: '#A07830' }}>
              {mb.site_key}: {mb.site_points} pts
            </span>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', flexShrink: 0 }}>
        <select value={site} onChange={e => setSite(e.target.value)} style={S.inp}>
          {KNOWN_SITES.map(s => <option key={s.key} value={s.key}>{s.name}</option>)}
        </select>
        <input type="number" min="1" placeholder="Pts" value={apts} onChange={e => setApts(e.target.value)} style={{ ...S.inp, width: 70 }} />
        <input type="text" placeholder="Reason" value={areason} onChange={e => setAreason(e.target.value)} style={{ ...S.inp, width: 120 }} />
        <button style={{ ...S.btn, background: '#C6A05A' }}
          onClick={() => { onAward(m.user_id, site, KNOWN_SITES.find(s => s.key === site)?.name, parseInt(apts), areason); setApts(''); setAreason(''); }}>
          Award
        </button>
      </div>
    </div>
  );
}

// ── Trip row ───────────────────────────────────────────────
function TripRow({ trip, S, onDelete, onEdit }) {
  return (
    <div style={S.row}>
      <div style={{ flex: 1 }}>
        <strong>{trip.title}</strong>
        <p style={{ margin: '2px 0', fontSize: '0.78rem', color: '#68748E' }}>
          {trip.destination} · {trip.dates} · {money(trip.price_total)} · {trip.spots_remaining}/{trip.spots_total} spots
          {!trip.active && <span style={{ ...S.badge, marginLeft: 6 }}>Hidden</span>}
        </p>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={() => onEdit(trip)} style={{ ...S.btn, background: '#0C1023' }}>Edit</button>
        <button onClick={() => onDelete(trip.id)} style={{ ...S.btn, background: '#C04040' }}>Delete</button>
      </div>
    </div>
  );
}

// ── Gear row ───────────────────────────────────────────────
function GearRow({ item, S, onApprove, onDelete }) {
  return (
    <div style={{ ...S.row, background: !item.approved ? '#FEF9F0' : 'transparent', padding: '12px 8px', borderRadius: !item.approved ? 6 : 0 }}>
      <div style={{ flex: 1 }}>
        <strong>{item.title}</strong>
        <p style={{ margin: '2px 0', fontSize: '0.78rem', color: '#68748E' }}>
          {item.category} · {item.condition} · {money(item.price)} · {item.status}
        </p>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {!item.approved && <button onClick={() => onApprove(item.id)} style={{ ...S.btn, background: '#166534' }}>Approve</button>}
        <button onClick={() => onDelete(item.id)} style={{ ...S.btn, background: '#C04040' }}>Delete</button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const S = mkS();
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState('members');
  const [msg, setMsg]           = useState('');

  // Members
  const [members, setMembers]   = useState([]);
  const [mLoading, setMLoading] = useState(false);

  // GF Reviews
  const [reviews, setReviews]   = useState([]);
  const [rLoading, setRLoading] = useState(false);

  // SS Trips
  const [trips, setTrips]       = useState([]);
  const [tLoading, setTLoading] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [tripForm, setTripForm] = useState({});

  // SS Gear
  const [gear, setGear]         = useState([]);
  const [gLoading, setGLoading] = useState(false);

  // Vault approvals
  const [vaultRequests, setVaultRequests] = useState([]);
  const [vLoading, setVLoading]           = useState(false);

  // Auth form
  const [email, setEmail]       = useState('');
  const [pw, setPw]             = useState('');
  const [err, setErr]           = useState('');
  const [signing, setSigning]   = useState(false);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data: { session } }) => { setUser(session?.user ?? null); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setUser(s?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || user.email.toLowerCase() !== ADMIN_EMAIL) return;
    if (tab === 'members') loadMembers();
    if (tab === 'reviews') loadReviews();
    if (tab === 'trips')   loadTrips();
    if (tab === 'gear')    loadGear();
    if (tab === 'vault')   loadVaultRequests();
  }, [tab, user]);

  async function loadMembers() {
    setMLoading(true);
    const [{ data: memberships }, { data: profiles }] = await Promise.all([
      supabase.from('site_memberships').select('*').order('joined_at', { ascending: false }),
      supabase.from('profiles').select('id, email, global_points'),
    ]);
    const map = {};
    (memberships || []).forEach(m => { if (!map[m.user_id]) map[m.user_id] = { user_id: m.user_id, memberships: [], profile: null }; map[m.user_id].memberships.push(m); });
    (profiles || []).forEach(p => { if (map[p.id]) map[p.id].profile = p; });
    setMembers(Object.values(map));
    setMLoading(false);
  }

  async function loadReviews() {
    setRLoading(true);
    const { data } = await supabase.from('gf_reviews').select('*').order('created_at', { ascending: false });
    setReviews(data || []);
    setRLoading(false);
  }

  async function loadTrips() {
    setTLoading(true);
    const { data } = await supabase.from('savvy_trips').select('*').order('display_order', { ascending: true });
    setTrips(data || []);
    setTLoading(false);
  }

  async function loadGear() {
    setGLoading(true);
    const { data } = await supabase.from('savvy_gear').select('*').order('created_at', { ascending: false });
    setGear(data || []);
    setGLoading(false);
  }

  async function loadVaultRequests() {
    setVLoading(true);
    const { data } = await supabase.from('sweetstone_access').select('*, auth_user:user_id(email)').order('created_at', { ascending: false });
    // Also fetch emails from profiles table
    const { data: profiles } = await supabase.from('profiles').select('id, email, global_points');
    const enriched = (data || []).map(r => ({
      ...r,
      email: profiles?.find(p => p.id === r.user_id)?.email || r.user_id?.slice(0, 8) + '…',
      global_points: profiles?.find(p => p.id === r.user_id)?.global_points || 0,
    }));
    setVaultRequests(enriched);
    setVLoading(false);
  }

  async function approveVault(userId) {
    await supabase.from('sweetstone_access').update({ status: 'approved_member', reviewed_by: user.id, reviewed_at: new Date().toISOString() }).eq('user_id', userId);
    flash('✓ Vault access approved.'); loadVaultRequests();
  }

  async function rejectVault(userId) {
    await supabase.from('sweetstone_access').update({ status: 'rejected', reviewed_by: user.id, reviewed_at: new Date().toISOString() }).eq('user_id', userId);
    flash('Access rejected.'); loadVaultRequests();
  }

  function flash(m) { setMsg(m); setTimeout(() => setMsg(''), 3500); }

  async function awardPoints(userId, siteKey, siteName, pts, reason) {
    if (!pts || pts < 1) return;
    const { error } = await supabase.rpc('admin_award_points', { p_target_user_id: userId, p_site_key: siteKey, p_site_name: siteName, p_points: pts, p_description: reason || 'Admin award' });
    if (error) flash('Error: ' + error.message); else { flash(`✓ ${pts} points awarded.`); loadMembers(); }
  }

  async function saveTrip() {
    const record = { ...tripForm, price_total: Number(tripForm.price_total), deposit_amount: Number(tripForm.deposit_amount), spots_total: Number(tripForm.spots_total || 10), spots_remaining: Number(tripForm.spots_remaining ?? tripForm.spots_total ?? 10), display_order: Number(tripForm.display_order || 0), active: tripForm.active !== false, updated_at: new Date().toISOString() };
    if (!record.slug) record.slug = tripForm.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    const { error } = editingTrip?.id ? await supabase.from('savvy_trips').update(record).eq('id', editingTrip.id) : await supabase.from('savvy_trips').insert(record);
    if (error) flash('Error: ' + error.message); else { flash(editingTrip?.id ? 'Trip updated.' : 'Trip added.'); setEditingTrip(null); setTripForm({}); loadTrips(); }
  }

  async function deleteTrip(id) { if (!confirm('Delete trip?')) return; await supabase.from('savvy_trips').delete().eq('id', id); loadTrips(); flash('Trip deleted.'); }
  async function approveGear(id) { await supabase.from('savvy_gear').update({ approved: true, status: 'Available' }).eq('id', id); loadGear(); flash('Listing approved.'); }
  async function deleteGear(id) { if (!confirm('Delete listing?')) return; await supabase.from('savvy_gear').delete().eq('id', id); loadGear(); flash('Listing deleted.'); }

  async function signIn(e) {
    e.preventDefault(); setSigning(true); setErr('');
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    setSigning(false);
    if (error) setErr(error.message === 'Invalid login credentials' ? 'Incorrect email or password.' : error.message);
  }

  if (loading) return <div style={S.center}><p style={{ color: '#68748E' }}>Loading…</p></div>;
  if (!hasSupabaseConfig) return <div style={S.center}><div style={S.loginCard}><p style={{ color: '#C04040' }}>Supabase not configured.</p></div></div>;

  if (!user) return (
    <div style={S.center}>
      <div style={S.loginCard}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 700, color: '#0C1023', marginBottom: '0.25rem' }}>Claude<span style={{ color: '#C6A05A' }}>Card</span> Admin</div>
        <p style={{ color: '#68748E', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Sign in with your Passport.</p>
        {err && <p style={{ color: '#C04040', background: '#FEF2F2', padding: '0.5rem 0.75rem', borderRadius: 6, fontSize: '0.82rem', marginBottom: '0.75rem' }}>{err}</p>}
        <form onSubmit={signIn} style={{ display: 'grid', gap: '0.6rem' }}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus style={{ ...S.inp, width: '100%', padding: '0.85rem 1rem', boxSizing: 'border-box' }} />
          <input type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} required style={{ ...S.inp, width: '100%', padding: '0.85rem 1rem', boxSizing: 'border-box' }} />
          <button type="submit" disabled={signing} style={{ ...S.btn, padding: '0.9rem', opacity: signing ? 0.7 : 1 }}>{signing ? '…' : 'Sign In'}</button>
        </form>
        <a href="/" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', fontSize: '0.82rem', color: '#68748E', textDecoration: 'none' }}>← Back to site</a>
      </div>
    </div>
  );

  if (user.email.toLowerCase() !== ADMIN_EMAIL) return (
    <div style={S.center}><div style={S.loginCard}>
      <p style={{ color: '#C04040', marginBottom: '1rem' }}>Access denied — signed in as {user.email}.</p>
      <button onClick={() => supabase.auth.signOut()} style={S.btn}>Sign out</button>
    </div></div>
  );

  const TABS = [['members','👥 Members'],['reviews','⭐ GF Reviews'],['trips','🗺 SS Trips'],['gear','🤿 SS Gear'],['vault','🔐 Vault Access']];
  const pending   = reviews.filter(r => r.status === 'pending');
  const published = reviews.filter(r => r.status === 'published');
  const pendingGear = gear.filter(g => !g.approved);

  return (
    <div style={S.page}>
      <header style={S.header}>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontWeight: 600 }}>Claude<span style={{ color: '#C6A05A' }}>Card</span> Admin</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{user.email}</span>
          <button onClick={() => supabase.auth.signOut().then(() => window.location.reload())} style={{ ...S.btn, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>Sign out</button>
          <a href="/" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>← Site</a>
        </div>
      </header>

      <div style={S.body}>
        {msg && <p style={{ color: msg.startsWith('Error') ? '#C04040' : '#166534', fontSize: '0.85rem', marginBottom: 16 }}>{msg}</p>}

        <div style={S.tabs}>
          {TABS.map(([id, label]) => <button key={id} style={S.tab(tab === id)} onClick={() => setTab(id)}>{label}</button>)}
        </div>

        {/* ── Members ── */}
        {tab === 'members' && (
          <div style={S.card}>
            <div style={S.hdr}><strong>All Passport Members</strong><span style={S.badge}>{members.length} users</span></div>
            <div style={S.body2}>
              {mLoading ? <p style={{ color: '#68748E' }}>Loading…</p>
                : members.length === 0 ? <p style={{ color: '#68748E' }}>No members yet.</p>
                : members.map(m => <MemberRow key={m.user_id} m={m} S={S} onAward={awardPoints} />)}
            </div>
          </div>
        )}

        {/* ── GF Reviews ── */}
        {tab === 'reviews' && (
          <div style={S.card}>
            <div style={S.hdr}><strong>Granny Frannie's Reviews</strong><span style={S.badge}>{reviews.length} total · {pending.length} pending</span></div>
            <div style={S.body2}>
              {rLoading ? <p style={{ color: '#68748E' }}>Loading…</p> : <>
                {pending.map(r => (
                  <div key={r.id} style={{ ...S.row, background: '#FEF2F2', borderRadius: 8, padding: 12, border: '1px solid #FECACA', marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontStyle: 'italic', color: '#0C1023', margin: '0 0 4px' }}>"{r.review_text}"</p>
                      <p style={{ color: '#68748E', margin: 0, fontSize: '0.8rem' }}>— {r.name}{r.email && ` (${r.email})`}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={async () => { await supabase.from('gf_reviews').update({ status: 'published', visible: true }).eq('id', r.id); flash('✓ Published'); loadReviews(); }} style={{ ...S.btn, background: '#166534' }}>Approve</button>
                      <button onClick={async () => { await supabase.from('gf_reviews').update({ status: 'dismissed' }).eq('id', r.id); loadReviews(); }} style={{ ...S.btn, background: '#6B7280' }}>Dismiss</button>
                    </div>
                  </div>
                ))}
                {published.map(r => (
                  <div key={r.id} style={S.row}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontStyle: 'italic', color: r.visible ? '#0C1023' : '#9CA3AF', margin: '0 0 2px', fontSize: '0.88rem' }}>"{r.review_text}"</p>
                      <p style={{ color: '#68748E', margin: 0, fontSize: '0.78rem' }}>— {r.name}</p>
                    </div>
                    <button onClick={async () => { await supabase.from('gf_reviews').update({ visible: !r.visible }).eq('id', r.id); loadReviews(); }}
                      style={{ ...S.btn, background: r.visible ? '#F0FDF4' : '#F9FAFB', color: r.visible ? '#166534' : '#6B7280', border: `1px solid ${r.visible ? '#BBF7D0' : '#E5E7EB'}` }}>
                      {r.visible ? '👁 Visible' : '🙈 Hidden'}
                    </button>
                  </div>
                ))}
              </>}
            </div>
          </div>
        )}

        {/* ── SS Trips ── */}
        {tab === 'trips' && (
          <>
            <div style={S.card}>
              <div style={S.hdr}>
                <strong>Savvy Scuba Trips</strong>
                <button onClick={() => { setEditingTrip({}); setTripForm({ active: true }); }} style={S.btn}>+ Add Trip</button>
              </div>
              <div style={S.body2}>
                {tLoading ? <p style={{ color: '#68748E' }}>Loading…</p>
                  : trips.length === 0 ? <p style={{ color: '#68748E' }}>No trips yet.</p>
                  : trips.map(t => <TripRow key={t.id} trip={t} S={S} onDelete={deleteTrip} onEdit={t => { setEditingTrip(t); setTripForm(t); }} />)}
              </div>
            </div>

            {editingTrip !== null && (
              <div style={S.card}>
                <div style={S.hdr}><strong>{editingTrip.id ? 'Edit Trip' : 'Add Trip'}</strong><button onClick={() => { setEditingTrip(null); setTripForm({}); }} style={{ ...S.btn, background: '#6B7280' }}>Cancel</button></div>
                <div style={S.body2}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
                    {[['title','Title *'],['destination','Destination *'],['dates','Dates *'],['price_total','Total Price ($) *'],['deposit_amount','Deposit ($) *'],['spots_total','Total Spots'],['spots_remaining','Spots Remaining'],['skill_level','Skill Level'],['display_order','Display Order']].map(([k, label]) => (
                      <div key={k}>
                        <label style={S.label}>{label}</label>
                        <input value={tripForm[k] || ''} onChange={e => setTripForm(f => ({ ...f, [k]: e.target.value }))} style={{ ...S.inp, width: '100%', boxSizing: 'border-box' }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={S.label}>Description</label>
                    <textarea value={tripForm.description || ''} onChange={e => setTripForm(f => ({ ...f, description: e.target.value }))} style={{ ...S.textarea, width: '100%' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <input type="checkbox" checked={tripForm.active !== false} onChange={e => setTripForm(f => ({ ...f, active: e.target.checked }))} />
                    <label style={{ fontSize: '0.85rem', color: '#0C1023' }}>Visible on site</label>
                  </div>
                  <button onClick={saveTrip} style={{ ...S.btn, padding: '0.75rem 2rem' }}>{editingTrip.id ? 'Save Changes' : 'Add Trip'}</button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── SS Gear ── */}
        {tab === 'gear' && (
          <div style={S.card}>
            <div style={S.hdr}><strong>Savvy Scuba Gear Listings</strong><span style={S.badge}>{gear.length} total · {pendingGear.length} pending</span></div>
            <div style={S.body2}>
              {gLoading ? <p style={{ color: '#68748E' }}>Loading…</p> : gear.length === 0 ? <p style={{ color: '#68748E' }}>No listings.</p>
                : gear.map(g => <GearRow key={g.id} item={g} S={S} onApprove={approveGear} onDelete={deleteGear} />)}
            </div>
          </div>
        )}

        {/* ── Vault Approvals ── */}
        {tab === 'vault' && (
          <div style={S.card}>
            <div style={S.hdr}>
              <strong>SweetStone Vault Access Requests</strong>
              <span style={S.badge}>{vaultRequests.length} total · {vaultRequests.filter(r => r.status === 'pending_approval').length} pending</span>
            </div>
            <div style={S.body2}>
              {vLoading ? <p style={{ color: '#68748E' }}>Loading…</p>
                : vaultRequests.length === 0
                ? <p style={{ color: '#68748E' }}>No access requests yet.</p>
                : vaultRequests.map(r => (
                  <div key={r.user_id} style={{ ...S.row, flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <strong style={{ color: '#0C1023' }}>{r.email}</strong>
                        <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#68748E' }}>
                          {r.global_points} global pts · Age verified: {r.age_verified ? '✓' : '✗'} · Requested {new Date(r.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span style={{
                        ...S.badge,
                        background: r.status === 'approved_member' ? '#F0FDF4' : r.status === 'rejected' ? '#FEF2F2' : 'rgba(198,160,90,0.1)',
                        color: r.status === 'approved_member' ? '#166534' : r.status === 'rejected' ? '#C04040' : '#A07830',
                      }}>
                        {r.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    {r.access_request_message && (
                      <p style={{ fontSize: '0.83rem', color: '#68748E', fontStyle: 'italic', background: '#F5F7FC', padding: '10px 14px', borderRadius: 6, margin: 0 }}>
                        "{r.access_request_message}"
                      </p>
                    )}
                    {r.status === 'pending_approval' && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => approveVault(r.user_id)} style={{ ...S.btn, background: '#166534' }}>✓ Approve Vault Access</button>
                        <button onClick={() => rejectVault(r.user_id)} style={{ ...S.btn, background: '#C04040' }}>✗ Reject</button>
                      </div>
                    )}
                    {r.status === 'approved_member' && (
                      <button onClick={() => rejectVault(r.user_id)} style={{ ...S.btn, background: '#6B7280', width: 'fit-content' }}>Revoke Access</button>
                    )}
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
