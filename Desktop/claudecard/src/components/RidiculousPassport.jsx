import { useCallback, useEffect, useMemo, useState } from 'react';
import { hasSupabaseConfig, supabase } from '../lib/supabaseClient';
import RewardsAuth from './RewardsAuth';

const siteKey = import.meta.env.VITE_SITE_KEY || 'claudecard';
const siteName = import.meta.env.VITE_SITE_NAME || 'Claude Card';

function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export default function RidiculousPassport() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(hasSupabaseConfig);
  const [error, setError] = useState('');

  const currentMembership = useMemo(
    () => memberships.find(membership => membership.site_key === siteKey),
    [memberships]
  );

  const loadPassport = useCallback(async (activeUser) => {
    if (!hasSupabaseConfig) {
      setLoading(false);
      return;
    }

    if (!activeUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    const { error: joinError } = await supabase.rpc('join_site_membership', {
      p_site_key: siteKey,
      p_site_name: siteName,
    });

    if (joinError) {
      setError(joinError.message);
      setLoading(false);
      return;
    }

    const [profileResult, membershipsResult, transactionsResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', activeUser.id).single(),
      supabase.from('site_memberships').select('*').order('joined_at', { ascending: true }),
      supabase.from('reward_transactions').select('*').order('created_at', { ascending: false }).limit(8),
    ]);

    if (profileResult.error) setError(profileResult.error.message);
    if (membershipsResult.error) setError(membershipsResult.error.message);
    if (transactionsResult.error) setError(transactionsResult.error.message);

    setProfile(profileResult.data ?? null);
    setMemberships(membershipsResult.data ?? []);
    setTransactions(transactionsResult.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!hasSupabaseConfig) {
      return undefined;
    }

    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUser(data.user ?? null);
      loadPassport(data.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const activeUser = session?.user ?? null;
      setUser(activeUser);
      if (activeUser) {
        loadPassport(activeUser);
      } else {
        setProfile(null);
        setMemberships([]);
        setTransactions([]);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [loadPassport]);

  if (!user) {
    return (
      <section id="passport" className="bg-[#F5F7FC] px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-700">Shared Rewards</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
              Ridiculous Passport
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              One email. One passport. Shared rewards across Claude Card, Granny Frannie's, and every world that joins next.
            </p>
          </div>
          <RewardsAuth />
        </div>
      </section>
    );
  }

  return (
    <section id="passport" className="bg-[#F5F7FC] px-5 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-700">Shared Rewards</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
              Ridiculous Passport
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Your ecosystem identity, points, memberships, badges, and perks will live here as each site connects.
            </p>
          </div>
          <RewardsAuth />
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-blue-100 bg-white p-8 text-sm font-semibold text-slate-600 shadow-sm">
            Loading your passport...
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-slate-950 p-6 text-white shadow-lg md:col-span-2">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-yellow-300">Passport Holder</p>
                <p className="mt-4 break-words text-xl font-bold">{profile?.email || user.email}</p>
                <p className="mt-2 text-sm text-blue-100">Level: {profile?.passport_level || 'Seed'}</p>
              </div>

              <div className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Global Points</p>
                <p className="mt-4 font-serif text-5xl font-semibold text-slate-950">{profile?.global_points ?? 0}</p>
              </div>

              <div className="rounded-lg border border-yellow-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-700">{siteName} Points</p>
                <p className="mt-4 font-serif text-5xl font-semibold text-slate-950">{currentMembership?.site_points ?? 0}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
              <div className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <h3 className="font-serif text-2xl font-semibold text-slate-950">Connected Sites</h3>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
                    {memberships.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {memberships.map(membership => (
                    <div key={membership.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-bold text-slate-950">{membership.site_name}</p>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                            {membership.site_level}
                          </p>
                        </div>
                        <p className="text-right font-serif text-2xl font-semibold text-blue-700">
                          {membership.site_points}
                        </p>
                      </div>
                      <p className="mt-3 text-xs text-slate-500">Joined {formatDate(membership.joined_at)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
                <h3 className="font-serif text-2xl font-semibold text-slate-950">Recent Transactions</h3>
                <div className="mt-5 space-y-3">
                  {transactions.length === 0 ? (
                    <p className="text-sm text-slate-500">No transactions yet.</p>
                  ) : (
                    transactions.map(transaction => (
                      <div key={transaction.id} className="grid gap-2 rounded-lg border border-slate-100 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                        <div>
                          <p className="font-bold text-slate-950">{transaction.description || transaction.action}</p>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                            {transaction.site_key} · {formatDate(transaction.created_at)}
                          </p>
                        </div>
                        <div className="flex gap-2 text-sm font-bold">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">+{transaction.global_points} global</span>
                          <span className="rounded-full bg-yellow-50 px-3 py-1 text-yellow-700">+{transaction.site_points} site</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
