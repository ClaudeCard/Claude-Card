import { useState, useEffect } from 'react'
import { supabase, hasSupabaseConfig, SITE_KEY, SITE_NAME } from '../lib/supabaseClient'
import PassportProfile from './PassportProfile'

const C = { bd:'#0D1F5C', br:'#1A3BAA', bm:'#2E54CC', g:'#E8B84B', gl:'#F5D98A', ts:'#5A72B5', bp:'#D6E0FF', bg:'#EEF2FF' }
const inp = { width:'100%', padding:'0.6rem 0.85rem', border:'1.5px solid #D6E0FF', borderRadius:8, fontFamily:"'Lora',serif", fontSize:'0.88rem', color:'#0D1F5C', outline:'none', marginBottom:'0.5rem', boxSizing:'border-box', background:'#fff' }

export default function UniversalLogin({ onAuthChange, compact=false }) {
  const [user,setUser]=useState(null), [profile,setProfile]=useState(null), [showProfile,setShowProfile]=useState(false)
  const [mode,setMode]=useState('signin'), [email,setEmail]=useState(''), [password,setPassword]=useState('')
  const [newPassword,setNewPassword]=useState('')
  const [loading,setLoading]=useState(false), [err,setErr]=useState(''), [msg,setMsg]=useState('')
  const [recovering,setRecovering]=useState(false)

  useEffect(()=>{
    if(!supabase)return
    const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
      if(event==='PASSWORD_RECOVERY'){setRecovering(true);return}
      const u=session?.user??null; setUser(u)
      if(u){joinMembership();loadProfile(u)} else setProfile(null)
      onAuthChange?.(u)
    })
    supabase.auth.getSession().then(({data:{session}})=>{
      const u=session?.user??null
      if(u){setUser(u);joinMembership();loadProfile(u);onAuthChange?.(u)}
    })
    return()=>subscription.unsubscribe()
  },[])

  async function loadProfile(u){if(!supabase)return;const{data}=await supabase.from('profiles').select('*').eq('id',u.id).single();if(data)setProfile(data)}
  async function joinMembership(){if(!supabase)return;try{await supabase.rpc('join_site_membership',{p_site_key:SITE_KEY,p_site_name:SITE_NAME})}catch{}}

  async function handleSignIn(){
    if(!email||!password){setErr('Please enter your email and password.');return}
    setLoading(true);setErr('')
    const{error}=await supabase.auth.signInWithPassword({email,password})
    setLoading(false)
    if(error)setErr(error.message==='Invalid login credentials'?'Incorrect email or password.':error.message)
  }

  async function handleSignUp(){
    if(!email||!password){setErr('Please enter your email and password.');return}
    if(password.length<6){setErr('Password must be at least 6 characters.');return}
    setLoading(true);setErr('')
    const{error}=await supabase.auth.signUp({email,password})
    setLoading(false)
    if(error){setErr(error.message);return}
    setMsg('Account created! You are now signed in.');
  }

  async function handleForgot(){
    if(!email){setErr('Enter your email above first.');return}
    setLoading(true);setErr('')
    const{error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin})
    setLoading(false)
    if(error){setErr(error.message);return}
    setMsg('Password reset email sent.');setMode('signin')
  }

  async function handleUpdatePassword(){
    if(!newPassword||newPassword.length<6){setErr('Password must be at least 6 characters.');return}
    setLoading(true);setErr('')
    const{error}=await supabase.auth.updateUser({password:newPassword})
    setLoading(false)
    if(error){setErr(error.message);return}
    setRecovering(false);setNewPassword('');setMsg('Password updated! You are now signed in.')
  }

  async function signOut(){await supabase?.auth.signOut();setUser(null);setProfile(null);onAuthChange?.(null)}

  if(!hasSupabaseConfig)return null

  if(recovering)return(
    <div style={{background:C.bg,border:`1.5px solid ${C.bp}`,borderRadius:16,padding:'1.2rem 1.4rem'}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:'0.95rem',fontWeight:700,color:C.bd,marginBottom:'0.75rem'}}>Set New Password</div>
      {err&&<div style={{fontFamily:"'Lora',serif",fontSize:'0.78rem',color:'#dc2626',marginBottom:'0.5rem',padding:'0.4rem 0.6rem',background:'#fef2f2',borderRadius:6}}>{err}</div>}
      <input type="password" placeholder="New password (min 6 characters)" value={newPassword} onChange={e=>setNewPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleUpdatePassword()} style={{...inp,marginBottom:'0.75rem'}}/>
      <button onClick={handleUpdatePassword} disabled={loading} style={{background:C.bd,color:'#fff',fontFamily:"'Caveat',cursive",fontSize:'1rem',fontWeight:700,padding:'0.6rem',borderRadius:8,border:'none',cursor:loading?'wait':'pointer',width:'100%',opacity:loading?0.7:1}}>{loading?'…':'Update Password'}</button>
    </div>
  )

  const pts=profile?.total_points??profile?.global_points??0
  const level=profile?.passport_level||'Seed'

  if(user)return(
    <>
      {showProfile&&(
        <div onClick={()=>setShowProfile(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.55)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}>
          <div onClick={e=>e.stopPropagation()}><PassportProfile user={user} onClose={()=>setShowProfile(false)}/></div>
        </div>
      )}
      <div style={{background:C.bg,border:`1.5px solid ${C.bp}`,borderRadius:16,padding:compact?'0.9rem 1.1rem':'1.2rem 1.4rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.6rem'}}>
          <div style={{width:38,height:38,borderRadius:'50%',background:`linear-gradient(135deg,${C.br},${C.bd})`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <span style={{color:C.g,fontFamily:"'Caveat',cursive",fontSize:'1.1rem',fontWeight:700}}>{(profile?.full_name||user.email)?.[0]?.toUpperCase()}</span>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:'0.9rem',fontWeight:700,color:C.bd,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{profile?.full_name||'Cookie Club Member'}</div>
            <div style={{fontFamily:"'Lora',serif",fontSize:'0.72rem',color:C.ts,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user.email}</div>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'0.5rem'}}>
          <div style={{fontFamily:"'Caveat',cursive",fontSize:'0.95rem',color:C.bm}}>🌍 {level} · {pts.toLocaleString()} pts</div>
          <div style={{display:'flex',gap:'0.5rem'}}>
            <button onClick={()=>setShowProfile(true)} style={{fontFamily:"'Caveat',cursive",fontSize:'0.85rem',fontWeight:700,color:'#fff',background:C.bd,border:'none',borderRadius:12,padding:'0.3rem 0.75rem',cursor:'pointer'}}>My Passport</button>
            <button onClick={signOut} style={{fontFamily:"'Lora',serif",fontSize:'0.72rem',color:C.ts,background:'none',border:`1px solid ${C.bp}`,borderRadius:12,padding:'0.3rem 0.65rem',cursor:'pointer'}}>Sign Out</button>
          </div>
        </div>
      </div>
    </>
  )

  return(
    <div style={{background:C.bg,border:`1.5px solid ${C.bp}`,borderRadius:16,padding:'1.2rem 1.4rem'}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:'0.95rem',fontWeight:700,color:C.bd,marginBottom:'0.15rem'}}>🍪 {mode==='signup'?'Create your Passport':'Cookie Club Login'}</div>
      <div style={{fontFamily:"'Lora',serif",fontSize:'0.75rem',color:C.ts,lineHeight:1.5,marginBottom:'0.8rem'}}>{mode==='signup'?"One account connects Granny Frannie's with the full Ridiculous Passport.":'One login connects your rewards across all Passport sites.'}</div>
      {err&&<div style={{fontFamily:"'Lora',serif",fontSize:'0.78rem',color:'#dc2626',marginBottom:'0.5rem',padding:'0.4rem 0.6rem',background:'#fef2f2',borderRadius:6}}>{err}</div>}
      {msg&&<div style={{fontFamily:"'Lora',serif",fontSize:'0.78rem',color:'#16a34a',marginBottom:'0.5rem',padding:'0.4rem 0.6rem',background:'#f0fdf4',borderRadius:6}}>{msg}</div>}
      <input type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} style={inp}/>
      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&(mode==='signin'?handleSignIn():handleSignUp())} style={{...inp,marginBottom:'0.75rem'}}/>
      <button onClick={mode==='signin'?handleSignIn:handleSignUp} disabled={loading} style={{background:C.bd,color:'#fff',fontFamily:"'Caveat',cursive",fontSize:'1rem',fontWeight:700,padding:'0.6rem',borderRadius:8,border:'none',cursor:loading?'wait':'pointer',width:'100%',opacity:loading?0.7:1,marginBottom:'0.5rem'}}>{loading?'…':mode==='signin'?'Sign In':'Create Account'}</button>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <button onClick={()=>{setMode(mode==='signin'?'signup':'signin');setErr('');setMsg('')}} style={{fontFamily:"'Lora',serif",fontSize:'0.73rem',color:C.bm,background:'none',border:'none',cursor:'pointer',padding:0}}>{mode==='signin'?'Create an account →':'← Back to sign in'}</button>
        {mode==='signin'&&<button onClick={handleForgot} style={{fontFamily:"'Lora',serif",fontSize:'0.73rem',color:C.ts,background:'none',border:'none',cursor:'pointer',padding:0}}>Forgot password?</button>}
      </div>
    </div>
  )
}
