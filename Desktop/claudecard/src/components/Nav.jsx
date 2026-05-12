import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase, hasSupabaseConfig } from '../lib/supabaseClient';

const LINKS = [
  { label: 'About',   to: '/#about'   },
  { label: 'Worlds',  to: '/#worlds'  },
  { label: 'Rewards', to: '/rewards'  },
];

function DrawerAuth({ onSignIn }) {
  const [user,setUser]=useState(null),[profile,setProfile]=useState(null);
  const [email,setEmail]=useState(''),[pw,setPw]=useState('');
  const [mode,setMode]=useState('signin'),[loading,setLoading]=useState(false);
  const [err,setErr]=useState(''),[msg,setMsg]=useState('');

  useEffect(()=>{
    if(!supabase)return;
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{
      const u=session?.user??null;setUser(u);
      if(u){loadProfile(u);onSignIn?.(u);}else setProfile(null);
    });
    supabase.auth.getSession().then(({data:{session}})=>{
      const u=session?.user??null;if(u){setUser(u);loadProfile(u);}
    });
    return()=>subscription.unsubscribe();
  },[]);

  async function loadProfile(u){try{const{data}=await supabase.from('profiles').select('global_points,passport_level,full_name').eq('id',u.id).single();if(data)setProfile(data);}catch{}}
  async function signIn(){if(!email||!pw){setErr('Enter email and password.');return;}setLoading(true);setErr('');const{error}=await supabase.auth.signInWithPassword({email,password:pw});setLoading(false);if(error)setErr(error.message==='Invalid login credentials'?'Incorrect email or password.':error.message);}
  async function signUp(){if(!email||!pw){setErr('Enter email and password.');return;}if(pw.length<6){setErr('Password must be 6+ characters.');return;}setLoading(true);setErr('');const{data,error}=await supabase.auth.signUp({email,password:pw});setLoading(false);if(error){setErr(error.message);return;}if(!data.session)setMsg('Check your email to confirm, then sign in.');}
  async function signOut(){await supabase?.auth.signOut();setUser(null);setProfile(null);}

  const INP={width:'100%',padding:'0.7rem 1rem',border:'1px solid rgba(198,160,90,0.2)',background:'rgba(255,255,255,0.05)',color:'#F5F0E8',outline:'none',fontFamily:'DM Sans,sans-serif',fontSize:'0.85rem',boxSizing:'border-box',marginBottom:'0.5rem'};
  const BTN={width:'100%',padding:'0.75rem',background:'#C6A05A',color:'#0C1023',border:'none',cursor:'pointer',fontFamily:'DM Sans,sans-serif',fontSize:'0.78rem',letterSpacing:'0.1em',textTransform:'uppercase',opacity:loading?0.7:1};

  if(!hasSupabaseConfig)return null;

  if(user)return(
    <div style={{padding:'1.5rem',borderTop:'1px solid rgba(198,160,90,0.15)'}}>
      <p style={{fontSize:'0.6rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'#C6A05A',marginBottom:'0.4rem'}}>Ridiculous Passport</p>
      <p style={{fontSize:'0.9rem',color:'#F5F0E8',marginBottom:'0.15rem',wordBreak:'break-all'}}>{profile?.full_name||user.email}</p>
      <p style={{fontSize:'0.75rem',color:'rgba(198,160,90,0.7)',marginBottom:'1rem'}}>{profile?.passport_level||'Seed'} · {(profile?.global_points||0).toLocaleString()} pts</p>
      <Link to="/rewards" style={{display:'block',textAlign:'center',padding:'0.65rem',border:'1px solid rgba(198,160,90,0.4)',color:'#C6A05A',textDecoration:'none',fontSize:'0.75rem',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'0.5rem'}}>View My Passport →</Link>
      <button onClick={signOut} style={{width:'100%',padding:'0.55rem',background:'none',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(198,160,90,0.5)',cursor:'pointer',fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',fontFamily:'DM Sans,sans-serif'}}>Sign Out</button>
    </div>
  );

  return(
    <div style={{padding:'1.5rem',borderTop:'1px solid rgba(198,160,90,0.15)'}}>
      <p style={{fontSize:'0.6rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'#C6A05A',marginBottom:'1rem'}}>{mode==='signin'?'Sign In':'Create Account'}</p>
      {err&&<p style={{fontSize:'0.75rem',color:'#e07070',marginBottom:'0.5rem'}}>{err}</p>}
      {msg&&<p style={{fontSize:'0.75rem',color:'#70c070',marginBottom:'0.5rem'}}>{msg}</p>}
      <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={INP}/>
      <input type="password" placeholder="Password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&(mode==='signin'?signIn():signUp())} style={INP}/>
      <button onClick={mode==='signin'?signIn:signUp} disabled={loading} style={BTN}>{loading?'…':mode==='signin'?'Sign In':'Create Account'}</button>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:'0.6rem'}}>
        <button onClick={()=>{setMode(mode==='signin'?'signup':'signin');setErr('');setMsg('');}} style={{background:'none',border:'none',color:'rgba(198,160,90,0.6)',cursor:'pointer',fontSize:'0.72rem',fontFamily:'DM Sans,sans-serif'}}>{mode==='signin'?'Create account →':'← Sign in'}</button>
        {mode==='signin'&&<button onClick={async()=>{if(!email){setErr('Enter your email first.');return;}await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin});setMsg('Reset email sent.');}} style={{background:'none',border:'none',color:'rgba(198,160,90,0.35)',cursor:'pointer',fontSize:'0.72rem',fontFamily:'DM Sans,sans-serif'}}>Forgot password?</button>}
      </div>
    </div>
  );
}

export default function Nav() {
  const [drawerOpen,setDrawerOpen]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  const [loggedIn,setLoggedIn]=useState(false);
  const [showToast,setShowToast]=useState(false);

  useEffect(()=>{const f=()=>setScrolled(window.scrollY>40);window.addEventListener('scroll',f);return()=>window.removeEventListener('scroll',f);},[]);

  useEffect(()=>{
    if(!hasSupabaseConfig)return;
    const{data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
      setLoggedIn(!!session?.user);
      if(event==='SIGNED_IN'){setShowToast(true);setTimeout(()=>setShowToast(false),4000);}
    });
    supabase.auth.getSession().then(({data:{session}})=>setLoggedIn(!!session?.user));
    return()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{document.body.style.overflow=drawerOpen?'hidden':'';return()=>{document.body.style.overflow='';};},[drawerOpen]);

  return(
    <>
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,padding:'1.25rem 2.5rem',display:'flex',alignItems:'center',justifyContent:'space-between',background:scrolled||drawerOpen?'rgba(12,16,35,0.97)':'transparent',backdropFilter:scrolled&&!drawerOpen?'blur(12px)':'none',borderBottom:scrolled&&!drawerOpen?'1px solid rgba(198,160,90,0.1)':'none',transition:'all 0.3s'}}>
        <Link to="/" style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.35rem',fontWeight:600,color:'#F5F0E8',textDecoration:'none'}}>Claude<span style={{color:'#C6A05A'}}>Card</span></Link>
        <div style={{display:'flex',alignItems:'center',gap:'1.5rem'}}>
          <div className="nav-desktop-links" style={{display:'flex',gap:'2rem',alignItems:'center'}}>
            {LINKS.map(l=><Link key={l.to} to={l.to} style={{fontSize:'0.75rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'#68748E',textDecoration:'none'}}>{l.label}</Link>)}
          </div>
          <button onClick={()=>setDrawerOpen(d=>!d)} style={{display:'flex',alignItems:'center',gap:'0.5rem',background:drawerOpen?'rgba(198,160,90,0.15)':'#0C1023',color:'#F5F0E8',border:'1px solid rgba(198,160,90,0.3)',padding:'0.5rem 1.1rem',cursor:'pointer',fontFamily:'DM Sans,sans-serif',fontSize:'0.75rem',letterSpacing:'0.1em',textTransform:'uppercase'}}>
            {loggedIn&&<span style={{width:6,height:6,borderRadius:'50%',background:'#C6A05A',flexShrink:0}}/>}
            {loggedIn?'My Passport':'Sign In'}
            <span style={{fontSize:'0.6rem',opacity:0.6}}>{drawerOpen?'✕':'☰'}</span>
          </button>
        </div>
      </nav>

      {drawerOpen&&(
        <div onClick={()=>setDrawerOpen(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:98}}>
          <div onClick={e=>e.stopPropagation()} style={{position:'fixed',top:0,right:0,bottom:0,width:'min(360px,90vw)',background:'#0C1023',zIndex:99,display:'flex',flexDirection:'column',borderLeft:'1px solid rgba(198,160,90,0.15)',overflowY:'auto',paddingTop:'5rem'}}>
            <nav style={{padding:'0 1.5rem 1rem'}}>
              {LINKS.map(l=><Link key={l.to} to={l.to} onClick={()=>setDrawerOpen(false)} style={{display:'block',padding:'0.85rem 0',borderBottom:'1px solid rgba(198,160,90,0.08)',fontFamily:'Cormorant Garamond,serif',fontSize:'1.4rem',color:'#F5F0E8',textDecoration:'none'}}>{l.label}</Link>)}
            </nav>
            <DrawerAuth onSignIn={()=>setLoggedIn(true)}/>
          </div>
        </div>
      )}

      {showToast&&(
        <div style={{position:'fixed',top:'5rem',left:'50%',transform:'translateX(-50%)',background:'#0C1023',color:'#C6A05A',padding:'0.75rem 1.5rem',fontSize:'0.82rem',letterSpacing:'0.06em',zIndex:200,boxShadow:'0 4px 20px rgba(0,0,0,0.3)',whiteSpace:'nowrap',border:'1px solid rgba(198,160,90,0.3)'}}>
          ✦ Signed in — view your Passport
        </div>
      )}
    </>
  );
}
