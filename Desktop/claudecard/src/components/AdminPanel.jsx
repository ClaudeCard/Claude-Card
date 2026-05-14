import { useState, useEffect } from 'react';

const KNOWN_SITES = [
  { key: 'claudecard',      name: 'ClaudeCard'       },
  { key: 'granny_frannies', name: "Granny Frannie's" },
  { key: 'savvy_scuba',     name: 'Savvy Scuba'      },
  { key: 'sweetstone',      name: 'SweetStone'       },
];

const tierOf = pts => pts >= 1500 ? 'Founding Flame' : pts >= 750 ? 'Inner Circle' : pts >= 300 ? 'Regular' : 'Taster';
const money  = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const S = {
  wrap:   { marginTop: '3rem', borderTop: '2px solid rgba(80,100,160,0.15)', paddingTop: '2.5rem' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 },
  tabs:   { display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: '1.5rem', borderBottom: '2px solid rgba(80,100,160,0.12)', paddingBottom: 0 },
  tab:    a => ({ padding: '7px 14px', border: 'none', borderBottom: `2px solid ${a ? '#0C1023' : 'transparent'}`, marginBottom: -2, background: 'none', color: a ? '#0C1023' : '#68748E', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.04em' }),
  card:   { background: '#fff', border: '1px solid rgba(80,100,160,0.12)', borderRadius: 8, overflow: 'hidden', marginBottom: 12 },
  cHdr:   { padding: '12px 16px', background: '#F5F7FC', borderBottom: '1px solid rgba(80,100,160,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  cBody:  { padding: 16 },
  row:    { padding: '10px 0', borderBottom: '1px solid rgba(80,100,160,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' },
  inp:    { padding: '6px 9px', border: '1px solid rgba(80,100,160,0.2)', borderRadius: 5, fontSize: '0.82rem', color: '#0C1023', outline: 'none', background: '#fff', fontFamily: 'DM Sans, sans-serif' },
  btn:    { padding: '5px 12px', background: '#0C1023', color: '#fff', border: 'none', borderRadius: 5, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' },
  badge:  { display: 'inline-block', padding: '2px 7px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 700, background: 'rgba(12,16,35,0.06)', color: '#0C1023' },
  msg:    ok => ({ fontSize: '0.78rem', color: ok ? '#166534' : '#C04040', background: ok ? '#F0FDF4' : '#FEF2F2', padding: '6px 10px', borderRadius: 5, marginBottom: 10 }),
};

function MemberRow({ m, onAward, onVaultApprove, onVaultRevoke }) {
  const [apts, setApts]       = useState('');
  const [site, setSite]       = useState(KNOWN_SITES[0].key);
  const [reason, setReason]   = useState('');
  const tier       = tierOf(m.profile?.global_points || 0);
  const email      = m.profile?.email || m.user_id?.slice(0, 8) + '…';
  const isApproved = m.vault?.status === 'approved_member';
  const isPending  = m.vault?.status === 'pending_approval';

  return (
    <div style={{ ...S.row, flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, width: '100%' }}>
        <div>
          <strong style={{ fontSize: '0.88rem', color: '#0C1023' }}>{email}</strong>
          <p style={{ margin: '2px 0', fontSize: '0.75rem', color: '#68748E' }}>
            <span style={S.badge}>{tier}</span> · {m.profile?.global_points || 0} global pts
          </p>
          <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {m.memberships.map(mb => (
              <span key={mb.site_key} style={{ ...S.badge, background: 'rgba(198,160,90,0.1)', color: '#A07830' }}>
                {mb.site_key}: {mb.site_points}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
          <span style={{ ...S.badge, background: isApproved ? '#F0FDF4' : isPending ? '#FEF9F0' : '#F5F7FC', color: isApproved ? '#166534' : isPending ? '#A07830' : '#9CA3AF' }}>
            🔐 {isApproved ? 'Vault: Approved' : isPending ? 'Vault: Pending' : 'No vault request'}
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            {!isApproved && <button onClick={() => onVaultApprove(m.user_id)} style={{ ...S.btn, background: '#166534', fontSize: '0.72rem', padding: '3px 9px' }}>Grant Vault</button>}
            {isApproved  && <button onClick={() => onVaultRevoke(m.user_id)} style={{ ...S.btn, background: '#C04040', fontSize: '0.72rem', padding: '3px 9px' }}>Revoke Vault</button>}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={site} onChange={e => setSite(e.target.value)} style={{ ...S.inp, fontSize: '0.78rem' }}>
          {KNOWN_SITES.map(s => <option key={s.key} value={s.key}>{s.name}</option>)}
        </select>
        <input type="number" min="1" placeholder="Pts" value={apts} onChange={e => setApts(e.target.value)} style={{ ...S.inp, width: 65 }} />
        <input type="text" placeholder="Reason" value={reason} onChange={e => setReason(e.target.value)} style={{ ...S.inp, width: 120 }} />
        <button style={{ ...S.btn, background: '#C6A05A' }}
          onClick={() => { onAward(m.user_id, site, KNOWN_SITES.find(s => s.key === site)?.name, parseInt(apts), reason); setApts(''); setReason(''); }}>
          Award
        </button>
      </div>
    </div>
  );
}

export default function AdminPanel({ supabase, adminUser }) {
  const [tab, setTab]   = useState('members');
  const [msg, setMsg]   = useState('');
  const [isOk, setIsOk] = useState(true);

  const [members, setMembers]   = useState([]);
  const [mLoad, setMLoad]       = useState(false);
  const [reviews, setReviews]   = useState([]);
  const [rLoad, setRLoad]       = useState(false);
  const [vault, setVault]       = useState([]);
  const [vLoad, setVLoad]       = useState(false);

  useEffect(() => {
    if (tab === 'members') loadMembers();
    if (tab === 'reviews') loadReviews();
    if (tab === 'vault')   loadVault();
  }, [tab]);

  function flash(m, ok = true) { setMsg(m); setIsOk(ok); setTimeout(() => setMsg(''), 3500); }

  async function loadMembers() {
    setMLoad(true);
    const [{ data: memberships }, { data: profiles }, { data: vaultData }] = await Promise.all([
      supabase.from('site_memberships').select('*').order('joined_at', { ascending: false }),
      supabase.from('profiles').select('id, email, global_points'),
      supabase.from('sweetstone_access').select('user_id, status'),
    ]);
    const map = {};
    (memberships || []).forEach(m => { if (!map[m.user_id]) map[m.user_id] = { user_id: m.user_id, memberships: [], profile: null, vault: null }; map[m.user_id].memberships.push(m); });
    (profiles || []).forEach(p => { if (map[p.id]) map[p.id].profile = p; });
    (vaultData || []).forEach(v => { if (map[v.user_id]) map[v.user_id].vault = v; });
    setMembers(Object.values(map));
    setMLoad(false);
  }

  async function loadReviews() {
    setRLoad(true);
    const { data } = await supabase.from('gf_reviews').select('*').order('created_at', { ascending: false });
    setReviews(data || []);
    setRLoad(false);
  }

  async function loadVault() {
    setVLoad(true);
    const [{ data: requests }, { data: profiles }] = await Promise.all([
      supabase.from('sweetstone_access').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, email, global_points'),
    ]);
    const enriched = (requests || []).map(r => ({ ...r, email: profiles?.find(p => p.id === r.user_id)?.email || r.user_id?.slice(0, 8) + '…' }));
    setVault(enriched);
    setVLoad(false);
  }

  async function awardPoints(userId, siteKey, siteName, pts, reason) {
    if (!pts || pts < 1) return;
    const { error } = await supabase.rpc('admin_award_points', { p_target_user_id: userId, p_site_key: siteKey, p_site_name: siteName, p_points: pts, p_description: reason || 'Admin award' });
    if (error) flash('Error: ' + error.message, false);
    else { flash(`✓ ${pts} pts awarded.`); loadMembers(); }
  }

  async function vaultApprove(userId) {
    await supabase.from('sweetstone_access').upsert({ user_id: userId, status: 'approved_member', age_verified: true, reviewed_by: adminUser.id, reviewed_at: new Date().toISOString() }, { onConflict: 'user_id' });
    flash('✓ Vault access granted.'); loadMembers(); if (tab === 'vault') loadVault();
  }

  async function vaultRevoke(userId) {
    await supabase.from('sweetstone_access').upsert({ user_id: userId, status: 'rejected', reviewed_by: adminUser.id, reviewed_at: new Date().toISOString() }, { onConflict: 'user_id' });
    flash('Vault access revoked.'); loadMembers(); if (tab === 'vault') loadVault();
  }

  const TABS = [['members', '👥 Members'], ['vault', '🔐 Vault'], ['reviews', '⭐ GF Reviews']];
  const pending   = reviews.filter(r => r.status === 'pending');
  const published = reviews.filter(r => r.status === 'published');
  const pendingV  = vault.filter(v => v.status === 'pending_approval');

  return (
    <div style={S.wrap}>
      <div style={S.header}>
        <div>
          <p style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C6A05A', marginBottom: '0.25rem' }}>Admin Controls</p>
          <strong style={{ color: '#0C1023', fontSize: '0.95rem' }}>Ridiculous Ecosystem Dashboard</strong>
        </div>
        <a href="/admin" style={{ fontSize: '0.75rem', color: '#0C1023', border: '1px solid rgba(12,16,35,0.2)', padding: '6px 14px', borderRadius: 5, textDecoration: 'none', fontWeight: 700 }}>
          Full Admin →
        </a>
      </div>

      {msg && <div style={S.msg(isOk)}>{msg}</div>}

      <div style={S.tabs}>
        {TABS.map(([id, label]) => (
          <button key={id} style={S.tab(tab === id)} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {/* Members */}
      {tab === 'members' && (
        <div style={S.card}>
          <div style={S.cHdr}><strong style={{ fontSize: '0.88rem' }}>All Passport Members</strong><span style={S.badge}>{members.length}</span></div>
          <div style={S.cBody}>
            {mLoad ? <p style={{ color: '#68748E', fontSize: '0.85rem' }}>Loading…</p>
              : members.length === 0 ? <p style={{ color: '#68748E', fontSize: '0.85rem' }}>No members yet.</p>
              : members.map(m => <MemberRow key={m.user_id} m={m} onAward={awardPoints} onVaultApprove={vaultApprove} onVaultRevoke={vaultRevoke} />)
            }
          </div>
        </div>
      )}

      {/* Vault requests */}
      {tab === 'vault' && (
        <div style={S.card}>
          <div style={S.cHdr}><strong style={{ fontSize: '0.88rem' }}>SweetStone Vault Requests</strong><span style={S.badge}>{vault.length} total · {pendingV.length} pending</span></div>
          <div style={S.cBody}>
            {vLoad ? <p style={{ color: '#68748E', fontSize: '0.85rem' }}>Loading…</p>
              : vault.length === 0 ? <p style={{ color: '#68748E', fontSize: '0.85rem' }}>No requests yet.</p>
              : vault.map(r => (
                <div key={r.user_id} style={{ ...S.row, flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <strong style={{ fontSize: '0.88rem' }}>{r.email}</strong>
                      <p style={{ margin: '2px 0', fontSize: '0.75rem', color: '#68748E' }}>
                        Age verified: {r.age_verified ? '✓' : '✗'} · {new Date(r.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span style={{ ...S.badge, background: r.status === 'approved_member' ? '#F0FDF4' : r.status === 'rejected' ? '#FEF2F2' : '#FEF9F0', color: r.status === 'approved_member' ? '#166534' : r.status === 'rejected' ? '#C04040' : '#A07830' }}>
                      {r.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  {r.access_request_message && (
                    <p style={{ fontSize: '0.8rem', color: '#68748E', fontStyle: 'italic', background: '#F5F7FC', padding: '8px 12px', borderRadius: 5, margin: 0 }}>"{r.access_request_message}"</p>
                  )}
                  {r.status === 'pending_approval' && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => vaultApprove(r.user_id)} style={{ ...S.btn, background: '#166534' }}>✓ Approve</button>
                      <button onClick={() => vaultRevoke(r.user_id)} style={{ ...S.btn, background: '#C04040' }}>✗ Reject</button>
                    </div>
                  )}
                  {r.status === 'approved_member' && (
                    <button onClick={() => vaultRevoke(r.user_id)} style={{ ...S.btn, background: '#6B7280', width: 'fit-content' }}>Revoke Access</button>
                  )}
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* GF Reviews */}
      {tab === 'reviews' && (
        <div style={S.card}>
          <div style={S.cHdr}><strong style={{ fontSize: '0.88rem' }}>Granny Frannie's Reviews</strong><span style={S.badge}>{reviews.length} · {pending.length} pending</span></div>
          <div style={S.cBody}>
            {rLoad ? <p style={{ color: '#68748E', fontSize: '0.85rem' }}>Loading…</p> : <>
              {pending.map(r => (
                <div key={r.id} style={{ ...S.row, background: '#FEF2F2', padding: '10px 12px', borderRadius: 6, marginBottom: 6 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontStyle: 'italic', color: '#0C1023', margin: '0 0 3px', fontSize: '0.85rem' }}>"{r.review_text}"</p>
                    <p style={{ color: '#68748E', margin: 0, fontSize: '0.75rem' }}>— {r.name}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button onClick={async () => { await supabase.from('gf_reviews').update({ status: 'published', visible: true }).eq('id', r.id); flash('✓ Published'); loadReviews(); }} style={{ ...S.btn, background: '#166534' }}>Approve</button>
                    <button onClick={async () => { await supabase.from('gf_reviews').update({ status: 'dismissed' }).eq('id', r.id); loadReviews(); }} style={{ ...S.btn, background: '#6B7280' }}>Dismiss</button>
                  </div>
                </div>
              ))}
              {published.map(r => (
                <div key={r.id} style={S.row}>
                  <p style={{ fontStyle: 'italic', color: r.visible ? '#0C1023' : '#9CA3AF', margin: 0, fontSize: '0.85rem', flex: 1 }}>"{r.review_text}" — {r.name}</p>
                  <button onClick={async () => { await supabase.from('gf_reviews').update({ visible: !r.visible }).eq('id', r.id); loadReviews(); }}
                    style={{ ...S.btn, background: r.visible ? '#F0FDF4' : '#F9FAFB', color: r.visible ? '#166534' : '#6B7280', border: `1px solid ${r.visible ? '#BBF7D0' : '#E5E7EB'}` }}>
                    {r.visible ? '👁' : '🙈'}
                  </button>
                </div>
              ))}
            </>}
          </div>
        </div>
      )}
    </div>
  );
}
