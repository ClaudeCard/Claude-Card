import { useState, useEffect, useRef } from "react";
import { supabase, hasSupabaseConfig, SITE_KEY, SITE_NAME } from "./lib/supabaseClient";
import UniversalLogin from "./components/UniversalLogin";

const STRIPE_PK = import.meta.env.VITE_STRIPE_PK;
const LOGO = "/logo.png";

const INITIAL_PRODUCTS = [
  {id:1,sku:"GFC-001",name:"Granny Frannie's Classic",emoji:"🍪",price:14,unit:"half dozen",badge:"The OG",badgeColor:"#0D1F5C",desc:"The original oatmeal chocolate chip — thick, chewy, packed with rolled oats and dark chocolate chips. Made exactly the way she made them.",bg:"linear-gradient(135deg,#D6E0FF,#4F74E3)",soldOut:false,image:null,category:"cookie",recipeId:1,ingredients:"Rolled oats, all-purpose flour, unsalted butter, brown sugar, granulated sugar, eggs, pure vanilla extract, dark chocolate chips, baking soda, salt, cinnamon",allergens:"Contains: wheat, milk, eggs. May contain: soy, peanuts, tree nuts.",netWeight:"approx. 10 oz (6 cookies)"},
  {id:2,sku:"GFC-002",name:"Double Chocolate Oat",emoji:"🍫",price:14,unit:"half dozen",badge:"Fan Fave",badgeColor:"#1A3BAA",desc:"A chocolate cookie base folded with oats and double the chocolate chips. For those who can never have too much.",bg:"linear-gradient(135deg,#C0CCFF,#2E54CC)",soldOut:false,image:null,category:"cookie",recipeId:2,ingredients:"Rolled oats, all-purpose flour, unsweetened cocoa powder, unsalted butter, brown sugar, granulated sugar, eggs, pure vanilla extract, dark chocolate chips, baking soda, salt",allergens:"Contains: wheat, milk, eggs. May contain: soy, peanuts, tree nuts.",netWeight:"approx. 10 oz (6 cookies)"},
  {id:3,sku:"GFC-003",name:"PB Oat Chip",emoji:"🥜",price:14,unit:"half dozen",badge:null,desc:"Creamy peanut butter meets oats and chocolate chips. A cookie that earns its own fan club every single time.",bg:"linear-gradient(135deg,#E8F0FF,#B8CAFF)",soldOut:false,image:null,category:"cookie",recipeId:3,ingredients:"Rolled oats, all-purpose flour, creamy peanut butter, unsalted butter, brown sugar, granulated sugar, eggs, pure vanilla extract, dark chocolate chips, baking soda, salt",allergens:"Contains: wheat, milk, eggs, peanuts. May contain: soy, tree nuts.",netWeight:"approx. 10 oz (6 cookies)"},
  {id:4,sku:"GFC-004",name:"Brown Butter Maple Oat",emoji:"🍁",price:15,unit:"half dozen",badge:"New",badgeColor:"#E8B84B",desc:"Browned butter and real maple syrup give this oat cookie a depth that'll make you rethink what a cookie can be.",bg:"linear-gradient(135deg,#EEF2FF,#D6E0FF)",soldOut:false,image:null,category:"cookie",recipeId:4,ingredients:"Rolled oats, all-purpose flour, browned unsalted butter, pure maple syrup, brown sugar, eggs, pure vanilla extract, dark chocolate chips, baking soda, salt",allergens:"Contains: wheat, milk, eggs. May contain: soy, peanuts, tree nuts.",netWeight:"approx. 10 oz (6 cookies)"},
  {id:6,sku:"GFC-006",name:"Granny Frannie's Gluten-Free Oatmeal Chocolate Chip",emoji:"🌾",price:16,unit:"half dozen",badge:"Gluten-Free",badgeColor:"#16a34a",desc:"Same love. Same legacy. Made with gluten-free ingredients for friends who need a gentler cookie option. Not produced in a certified gluten-free kitchen.",bg:"linear-gradient(135deg,#D1FAE5,#6EE7B7)",soldOut:false,image:null,category:"cookie",recipeId:9,ingredients:"Certified GF rolled oats, GF flour blend (rice flour, tapioca starch, xanthan gum), unsalted butter, brown sugar, granulated sugar, eggs, pure vanilla extract, dark chocolate chips, baking soda, salt",allergens:"Made with GF ingredients — NOT in a certified GF kitchen. Contains: milk, eggs. May contain: soy, peanuts, tree nuts.",netWeight:"approx. 10 oz (6 cookies)"},
  {id:5,sku:"GFC-005",name:"Gift Box — Assorted",emoji:"🎁",price:26,unit:"dozen",badge:null,desc:"A dozen mixed cookies, beautifully packaged. Perfect for gifting, sharing, or keeping all to yourself. No judgment.",bg:"linear-gradient(135deg,#D6E0FF,#4F74E3)",soldOut:false,image:null,category:"gift",recipeId:null,ingredients:"Assorted — see individual cookie labels.",allergens:"Contains: wheat, milk, eggs. May contain: soy, peanuts, tree nuts.",netWeight:"approx. 20 oz (12 cookies)"},
  {id:10,sku:"GFC-010",name:"Vanilla Bean Ice Cream Sandwich",emoji:"🍦",price:7,unit:"each",badge:"Coming Soon",badgeColor:"#2E54CC",desc:"Two fresh-baked cookies hugging creamy vanilla bean ice cream. Coming soon — pending licensed commercial production.",bg:"linear-gradient(135deg,#EEF2FF,#D6E0FF)",soldOut:true,comingSoon:true,image:null,category:"sandwich",recipeId:null,ingredients:"TBD — pending licensed production.",allergens:"Contains: wheat, milk, eggs. May contain: soy, peanuts, tree nuts.",netWeight:"TBD"},
  {id:11,sku:"GFC-011",name:"Salted Caramel Ice Cream Sandwich",emoji:"🍨",price:7,unit:"each",badge:"Coming Soon",badgeColor:"#2E54CC",desc:"Rich salted caramel ice cream between signature cookies. Coming soon — pending licensed commercial production.",bg:"linear-gradient(135deg,#D6E0FF,#C0CCFF)",soldOut:true,comingSoon:true,image:null,category:"sandwich",recipeId:null,ingredients:"TBD — pending licensed production.",allergens:"Contains: wheat, milk, eggs. May contain: soy, peanuts, tree nuts.",netWeight:"TBD"},
  {id:12,sku:"GFC-012",name:"Mint Chip Ice Cream Sandwich",emoji:"🌿",price:7,unit:"each",badge:"Coming Soon",badgeColor:"#2E54CC",desc:"Cool mint chip ice cream between warm oatmeal chocolate chip cookies. Coming soon — pending licensed commercial production.",bg:"linear-gradient(135deg,#E8F0FF,#B8CAFF)",soldOut:true,comingSoon:true,image:null,category:"sandwich",recipeId:null,ingredients:"TBD — pending licensed production.",allergens:"Contains: wheat, milk, eggs. May contain: soy, peanuts, tree nuts.",netWeight:"TBD"},
  {id:13,sku:"GFC-013",name:"Strawberry Ice Cream Sandwich",emoji:"🍓",price:7,unit:"each",badge:"Coming Soon",badgeColor:"#2E54CC",desc:"Real strawberry ice cream between Granny Frannie's cookies. Coming soon — pending licensed commercial production.",bg:"linear-gradient(135deg,#FFE4E4,#FFBBBB)",soldOut:true,comingSoon:true,image:null,category:"sandwich",recipeId:null,ingredients:"TBD — pending licensed production.",allergens:"Contains: wheat, milk, eggs. May contain: soy, peanuts, tree nuts.",netWeight:"TBD"},
];

const NOTIFY_KEY   = "gf_notify_list";
const CLUB_KEY         = "gf_club_list";
const TESTIMONIALS_KEY = "gf_testimonials";
// Review shape: { text, author (legacy display), firstName, city, verified }
// TODO-CANDYMAN: replace placeholder names/cities with real first names + cities once provided.
const SEED_TESTIMONIALS = [
  {text:"These taste like childhood in the best possible way.", author:"Early Customer",   firstName:"",    city:"",        verified:false},
  {text:"You can tell these were made with love.",              author:"Cookie Club Member",firstName:"",    city:"",        verified:true},
  {text:"The oatmeal chocolate chip cookie I didn't know I needed.", author:"Local Supporter", firstName:"",city:"Michigan", verified:false},
];
const PRODUCTS_KEY = "gf_products";
const USERS_KEY    = "gf_users";
const SESSION_KEY  = "gf_session";

// ── ORDER SCHEDULE CONFIG ─────────────────────────────────────────────────────
// TODO-CANDYMAN: confirm cutoff day/time and pickup day/time, then update these.
const ORDER_SCHEDULE = {
  cutoffDay:    2,    // 0=Sun … 6=Sat; 2 = Tuesday
  cutoffHour:   18,   // 6pm
  fulfillDay:   6,    // 6 = Saturday
  fulfillLabel: "Saturday pickup / delivery",
  pickupFee:    0,
  deliveryFee:  5,    // "from" price — actual fee calculated by zip
  shippingFee:  12,   // "from" price — actual calculated at checkout
};

function getNextCutoff() {
  const now   = new Date();
  const day   = now.getDay();
  const hour  = now.getHours();
  const { cutoffDay, cutoffHour, fulfillDay, fulfillLabel } = ORDER_SCHEDULE;

  // Days until next cutoff
  let daysUntilCutoff = (cutoffDay - day + 7) % 7;
  if (daysUntilCutoff === 0 && hour >= cutoffHour) daysUntilCutoff = 7;

  const cutoff = new Date(now);
  cutoff.setDate(now.getDate() + daysUntilCutoff);
  cutoff.setHours(cutoffHour, 0, 0, 0);

  const cutoffDayName = cutoff.toLocaleDateString("en-US", { weekday: "long" });
  return { cutoffDayName, fulfillLabel };
}

// ─── STRIPE ──────────────────────────────────────────────────────────────────
async function launchStripeCheckout(cart, email, orderForm, shippingFee, shippingLabel) {
  const res = await fetch("/api/create-checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cart,
      email:         email || orderForm?.email || "",
      name:          orderForm?.name     || "",
      phone:         orderForm?.phone    || "",
      delivery:      orderForm?.delivery || "",
      notes:         orderForm?.notes    || "",
      shippingFee:   shippingFee || 0,
      shippingLabel: shippingLabel || "",
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create checkout session.");
  }

  const { url } = await res.json();
  window.location.href = url;
}

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Lora:ital,wght@0,400;0,600;1,400&family=Caveat:wght@400;600;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:'Lora',Georgia,serif;background:#F7F9FF;color:#0D1F5C;overflow-x:hidden;-webkit-font-smoothing:antialiased}
  html{overflow-x:hidden;max-width:100%}
  input,select,textarea{box-sizing:border-box;font-family:'Lora',serif}
  ::-webkit-scrollbar{width:5px}
  ::-webkit-scrollbar-thumb{background:#4F74E3;border-radius:3px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  @keyframes wobble{0%,100%{transform:rotate(-3deg) scale(1)}50%{transform:rotate(3deg) scale(1.04)}}
  @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
  @keyframes ticker{0%{transform:translateX(100vw)}100%{transform:translateX(-100%)}}
  .ticker-wrap{overflow:hidden!important;clip-path:inset(0);width:100%;max-width:100vw}
  @keyframes popIn{from{opacity:0;transform:scale(0.88) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
  @keyframes slideRight{from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:translateX(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes cartPop{0%,100%{transform:scale(1)}45%{transform:scale(1.35)}75%{transform:scale(0.9)}}

  /* ── MOBILE NAV ── */
  .mob-menu{display:none;flex-direction:column;gap:0;background:#0D1F5C;border-top:1px solid rgba(255,255,255,0.1)}
  .mob-menu.open{display:flex}
  .mob-link{color:rgba(255,255,255,0.8);font-family:'Lora',serif;font-size:1rem;padding:1rem 1.5rem;border:none;background:none;text-align:left;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.06);letter-spacing:1px}
  .mob-link:active{background:rgba(255,255,255,0.07)}

  /* ── DESKTOP NAV LINKS ── */
  .desk-links{display:flex;gap:1.2rem;align-items:center}
  .hamburger{display:none}
  @media(max-width:768px){
    .desk-links{display:none}
    .hamburger{display:flex;flex-direction:column;gap:5px;cursor:pointer;padding:6px;background:none;border:none}
    .hamburger span{display:block;width:22px;height:2px;background:#fff;border-radius:2px;transition:all 0.3s}
    .story-grid{grid-template-columns:1fr!important}
    .story-sticky{position:static!important;top:auto!important}
    .two-col{grid-template-columns:1fr!important}
    .prod-grid{grid-template-columns:1fr!important}
    .form-row-2{grid-template-columns:1fr!important}
    .catering-grid{grid-template-columns:1fr!important}
    .catering-art{display:none!important}
    .hero-h1{font-size:clamp(3rem,15vw,5rem)!important}
    .hero-cookie{font-size:clamp(5rem,25vw,8rem)!important}
    .sec-title{font-size:clamp(1.7rem,7vw,2.5rem)!important}
    .admin-panel{width:100vw!important}
    .cart-panel{width:100vw!important}
    .test-grid{grid-template-columns:1fr!important}
    .gal-grid{grid-template-columns:repeat(2,1fr)!important}
    .nav-right{gap:0.5rem!important}
    .nav-order-btn{display:none!important}
    .nav-signin{display:none!important}
    .nav-admin{display:none!important}
  }
  @media(max-width:480px){
    .gal-grid{grid-template-columns:1fr!important}
    .prod-grid{grid-template-columns:1fr!important}
    .sand-grid{grid-template-columns:repeat(2,1fr)!important}
    .cat-filters{gap:0.35rem!important}
    .cat-btn{font-size:0.85rem!important;padding:0.35rem 0.8rem!important}
  }
  @media(max-width:390px){
    section,footer,nav{padding-left:1rem!important;padding-right:1rem!important}
    .hero-btns{flex-direction:column!important;align-items:stretch!important}
  }
`;

// ─── NOTIFY ME MODAL ─────────────────────────────────────────────────────────
function NotifyModal({ product, onClose, onSubmit }) {
  const [email, setEmail] = useState("");
  const [done, setDone]   = useState(false);
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(13,31,92,0.78)",zIndex:800,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:22,padding:"2.2rem 1.8rem",maxWidth:380,width:"100%",textAlign:"center",animation:"popIn 0.35s ease",position:"relative",boxShadow:"0 20px 60px rgba(13,31,92,0.35)"}}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:16,background:"none",border:"none",fontSize:"1.4rem",cursor:"pointer",color:"#5A72B5"}}>✕</button>
        <div style={{fontSize:"3rem",marginBottom:"0.4rem"}}>{product.emoji}</div>
        {!done ? <>
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.35rem",fontWeight:700,color:"#0D1F5C",marginBottom:"0.4rem"}}>Notify Me When It's Back</h3>
          <p style={{fontFamily:"'Lora',serif",fontSize:"0.9rem",color:"#5A72B5",lineHeight:1.6,marginBottom:"1rem"}}><strong style={{color:"#0D1F5C"}}>{product.name}</strong> is sold out right now. Leave your email and we'll let you know the moment it's back.</p>
          <input type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&email&&(onSubmit(product.id,email),setDone(true))} style={{width:"100%",padding:"0.75rem 1rem",border:"2px solid #D6E0FF",borderRadius:50,fontSize:"1rem",color:"#0D1F5C",outline:"none",marginBottom:"0.8rem"}}/>
          <button onClick={()=>{if(email){onSubmit(product.id,email);setDone(true);}}} style={{background:"#0D1F5C",color:"#fff",fontFamily:"'Caveat',cursive",fontSize:"1.15rem",fontWeight:700,padding:"0.7rem 2rem",borderRadius:50,border:"none",cursor:"pointer",width:"100%"}}>🔔 Notify Me</button>
        </> : <>
          <div style={{fontSize:"2.5rem",marginBottom:"0.4rem"}}>✅</div>
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.35rem",fontWeight:700,color:"#16a34a",marginBottom:"0.4rem"}}>You're on the list!</h3>
          <p style={{fontFamily:"'Lora',serif",fontSize:"0.9rem",color:"#5A72B5",lineHeight:1.6}}>We'll email <strong>{email}</strong> the moment <strong>{product.name}</strong> is back.</p>
          <button onClick={onClose} style={{background:"#0D1F5C",color:"#fff",fontFamily:"'Caveat',cursive",fontSize:"1rem",fontWeight:700,padding:"0.6rem 1.5rem",borderRadius:50,border:"none",cursor:"pointer",marginTop:"1rem"}}>Got it 👍</button>
        </>}
      </div>
    </div>
  );
}

// ─── REVIEW FORM ─────────────────────────────────────────────────────────────
function ReviewForm({ currentUser, onPointsAwarded }) {
  const C = { bd:"#0D1F5C", br:"#1A3BAA", bm:"#2E54CC", g:"#E8B84B", ts:"#5A72B5", bp:"#D6E0FF", bg:"#EEF2FF", w:"#fff" };
  const [name, setName]     = useState("");
  const [text, setText]     = useState("");
  const [email, setEmail]   = useState("");
  const [done, setDone]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr]       = useState("");

  const submit = async () => {
    if (!name || !text) { setErr("Name and review are required."); return; }
    setLoading(true); setErr("");
    try {
      const r = await fetch("/api/submit-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, text, email: email || currentUser?.email || "" }),
      });
      if (r.ok) {
        if (currentUser && onPointsAwarded) onPointsAwarded(15);
        setDone(true);
      } else { setErr("Something went wrong. Please try again."); }
    } catch { setErr("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{maxWidth:560,margin:"2.5rem auto 0",background:C.w,borderRadius:20,padding:"2rem 2rem",boxShadow:"0 4px 20px rgba(13,31,92,0.08)",border:`1.5px solid ${C.bp}`}}>
      {done ? (
        <div style={{textAlign:"center",padding:"1rem 0"}}>
          <div style={{fontSize:"2.5rem",marginBottom:"0.5rem"}}>🙏</div>
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.2rem",fontWeight:700,color:C.bd,marginBottom:"0.4rem"}}>Thank you!</h3>
          <p style={{fontFamily:"'Lora',serif",fontSize:"0.9rem",color:C.ts,lineHeight:1.7}}>Your review has been submitted and is pending approval.</p>
          {currentUser&&<p style={{fontFamily:"'Caveat',cursive",fontSize:"1rem",color:"#E8B84B",fontWeight:700,marginTop:"0.5rem"}}>⭐ +50 points added to your account!</p>}
        </div>
      ) : (
        <>
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.15rem",fontWeight:700,color:C.bd,marginBottom:"0.3rem"}}>Share Your Experience</h3>
          <div style={{background:"rgba(232,184,75,0.1)",border:"1.5px solid rgba(232,184,75,0.3)",borderRadius:10,padding:"0.55rem 0.85rem",marginBottom:"1rem",display:"flex",alignItems:"center",gap:"0.5rem"}}>
            <span style={{fontSize:"1.2rem"}}>⭐</span>
            <p style={{fontFamily:"'Lora',serif",fontSize:"0.82rem",color:"#92680a",margin:0,lineHeight:1.5}}>{currentUser?<><strong>Earn 15 Cookie Club points</strong> when you submit a review!</>:<><strong>Earn 15 Cookie Club points</strong> — <button onClick={()=>document.querySelector('[data-auth]')?.click()} style={{background:"none",border:"none",color:"#1A3BAA",cursor:"pointer",fontFamily:"'Lora',serif",fontSize:"0.82rem",padding:0,textDecoration:"underline"}}>Sign in</button> to earn them.</>}</p>
          </div>
          <p style={{fontFamily:"'Lora',serif",fontSize:"0.85rem",color:C.ts,marginBottom:"1.2rem",lineHeight:1.6}}>Tried the cookies? We'd love to hear from you.</p>
          <input placeholder="Your name *" value={name} onChange={e=>setName(e.target.value)} style={{width:"100%",padding:"0.65rem 0.9rem",border:`1.5px solid ${C.bp}`,borderRadius:10,fontFamily:"'Lora',serif",fontSize:"0.9rem",color:C.bd,outline:"none",marginBottom:"0.6rem",boxSizing:"border-box"}}/>
          <textarea placeholder="What did you think? *" value={text} onChange={e=>setText(e.target.value)} rows={4} style={{width:"100%",padding:"0.65rem 0.9rem",border:`1.5px solid ${C.bp}`,borderRadius:10,fontFamily:"'Lora',serif",fontSize:"0.9rem",color:C.bd,outline:"none",resize:"vertical",marginBottom:"0.6rem",boxSizing:"border-box"}}/>
          <input placeholder="Email (optional, not published)" value={email} onChange={e=>setEmail(e.target.value)} style={{width:"100%",padding:"0.65rem 0.9rem",border:`1.5px solid ${C.bp}`,borderRadius:10,fontFamily:"'Lora',serif",fontSize:"0.9rem",color:C.bd,outline:"none",marginBottom:"0.8rem",boxSizing:"border-box"}}/>
          {err && <p style={{fontFamily:"'Lora',serif",fontSize:"0.82rem",color:"#dc2626",marginBottom:"0.6rem"}}>{err}</p>}
          <button onClick={submit} disabled={loading} style={{background:C.bd,color:"#fff",fontFamily:"'Caveat',cursive",fontSize:"1.05rem",fontWeight:700,padding:"0.7rem",borderRadius:50,border:"none",cursor:loading?"wait":"pointer",width:"100%",opacity:loading?0.7:1}}>
            {loading ? "Submitting…" : "Submit Review →"}
          </button>
        </>
      )}
    </div>
  );
}

// ─── ADMIN PANEL ─────────────────────────────────────────────────────────────
function AdminPanel({ products, setProducts, notifyList, clubList, testimonials, setTestimonials, onClose }) {
  const [tab, setTab]           = useState("products");
  const [recipeTarget, setRecipeTarget] = useState(null); // recipeId to pre-expand when jumping to Recipes tab
  const [editId, setEditId]   = useState(null);
  const [isNew, setIsNew]     = useState(false);
  const [form, setForm]       = useState({});
  const [msg, setMsg]         = useState("");
  const [confirmDel, setConfirmDel] = useState(null);
  const [notifySending, setNotifySending] = useState(null);
  const [notifyResults, setNotifyResults] = useState({});
  const [clubSubject, setClubSubject]     = useState("News from Granny Frannie's Cookies 🍪");
  const [clubBody, setClubBody]           = useState("");
  const [clubSending, setClubSending]     = useState(false);
  const [clubResult, setClubResult]       = useState(null);
  const [reviewForm, setReviewForm]       = useState({name:"",text:""});
  const [reviewMsg, setReviewMsg]         = useState("");
  const [pendingReviews, setPendingReviews] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [members, setMembers]             = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [giftAmounts, setGiftAmounts]     = useState({});
  const [giftResults, setGiftResults]     = useState({});
  const [brevoData, setBrevoData]         = useState(null);
  const [brevoLoading, setBrevoLoading]   = useState(true);
  const [orders, setOrders]               = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Fetch live contact lists from Brevo on mount
  useEffect(()=>{
    fetch("/api/get-contacts").then(r=>r.json()).then(setBrevoData).catch(()=>setBrevoData(null)).finally(()=>setBrevoLoading(false));
    fetch("/api/get-orders").then(r=>r.json()).then(d=>setOrders(d.orders||[])).catch(()=>setOrders([])).finally(()=>setOrdersLoading(false));
  },[]);
  const fileRef = useRef();

  const EMOJIS = ["🍪","🍫","🥜","🍁","🎁","🍦","🍨","🌿","🍓","⭐","🧁","🍰","☕","🎉","🥧","🫙"];
  const BG_OPTIONS = [
    {label:"Royal Blue",  val:"linear-gradient(135deg,#D6E0FF,#4F74E3)"},
    {label:"Deep Blue",   val:"linear-gradient(135deg,#C0CCFF,#2E54CC)"},
    {label:"Pale Blue",   val:"linear-gradient(135deg,#E8F0FF,#B8CAFF)"},
    {label:"Ghost Blue",  val:"linear-gradient(135deg,#EEF2FF,#D6E0FF)"},
    {label:"Blush Pink",  val:"linear-gradient(135deg,#FFE4E4,#FFBBBB)"},
    {label:"Warm Gold",   val:"linear-gradient(135deg,#FFF3CD,#F5D98A)"},
    {label:"Sage Green",  val:"linear-gradient(135deg,#D1FAE5,#6EE7B7)"},
    {label:"Lavender",    val:"linear-gradient(135deg,#EDE9FE,#C4B5FD)"},
  ];
  const CATEGORIES = ["cookie","sandwich","gift","seasonal","other"];

  const flashMsg = (m) => { setMsg(m); setTimeout(()=>setMsg(""),3000); };

  const startEdit = (p) => { setForm({...p}); setEditId(p.id); setIsNew(false); };
  const startNew  = () => {
    const id = Date.now();
    setForm({id,name:"",emoji:"🍪",price:"",unit:"half dozen",badge:"",badgeColor:"#0D1F5C",desc:"",bg:BG_OPTIONS[0].val,soldOut:false,comingSoon:false,image:null,category:"cookie"});
    setEditId(id); setIsNew(true);
  };
  const handleImg = (e) => {
    const f = e.target.files[0]; if(!f) return;
    const r = new FileReader();
    r.onload = ev => setForm(p=>({...p,image:ev.target.result}));
    r.readAsDataURL(f);
  };
  const save = () => {
    if(!form.name||!form.price){flashMsg("⚠️ Name and price required.");return;}
    const p = {...form, price:parseFloat(form.price)||0};
    if(isNew) setProducts(prev=>[...prev,p]);
    else setProducts(prev=>prev.map(x=>x.id===p.id?p:x));
    setEditId(null); flashMsg("✅ Saved!");
  };
  const toggleSoldOut   = (id) => setProducts(prev=>prev.map(p=>p.id===id?{...p,soldOut:!p.soldOut,comingSoon:false}:p));
  const toggleComingSoon = (id) => setProducts(prev=>prev.map(p=>p.id===id?{...p,comingSoon:!p.comingSoon,soldOut:!p.comingSoon}:p));
  const doDelete = (id) => { setProducts(prev=>prev.filter(p=>p.id!==id)); setConfirmDel(null); if(editId===id)setEditId(null); flashMsg("🗑️ Removed."); };

  const notifyByProd = notifyList.reduce((acc,e)=>{ (acc[e.productId]||(acc[e.productId]=[])).push(e); return acc; },{});

  const P={
    overlay:{position:"fixed",inset:0,background:"rgba(0,0,0,0.72)",zIndex:900,display:"flex",justifyContent:"flex-end"},
    panel:{background:"#111827",width:"min(660px,100vw)",height:"100vh",overflowY:"auto",display:"flex",flexDirection:"column",animation:"slideRight 0.3s ease"},
    hdr:{background:"#0D1F5C",padding:"1.1rem 1.4rem",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10,borderBottom:"1px solid rgba(255,255,255,0.1)"},
    hdrTitle:{fontFamily:"'Playfair Display',serif",fontSize:"1.3rem",fontWeight:700,color:"#E8B84B",fontStyle:"italic"},
    closeX:{background:"none",border:"none",color:"rgba(255,255,255,0.6)",fontSize:"1.5rem",cursor:"pointer"},
    tabs:{display:"flex",background:"rgba(0,0,0,0.25)",borderBottom:"1px solid rgba(255,255,255,0.07)"},
    tab:(a)=>({fontFamily:"'Lora',serif",fontSize:"0.82rem",letterSpacing:"1.5px",textTransform:"uppercase",padding:"0.85rem 1.4rem",border:"none",cursor:"pointer",background:a?"rgba(232,184,75,0.12)":"transparent",color:a?"#E8B84B":"rgba(255,255,255,0.45)",borderBottom:a?"2px solid #E8B84B":"2px solid transparent",transition:"all 0.2s"}),
    body:{padding:"1.3rem",flex:1,overflowY:"auto"},
    row:{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"0.9rem 1rem",marginBottom:"0.7rem",display:"flex",alignItems:"center",gap:"0.8rem",border:"1px solid rgba(255,255,255,0.07)"},
    addBtn:{background:"#E8B84B",color:"#0D1F5C",fontFamily:"'Caveat',cursive",fontSize:"1.1rem",fontWeight:700,padding:"0.65rem 1.4rem",borderRadius:50,border:"none",cursor:"pointer",width:"100%",marginBottom:"1rem"},
    formBox:{background:"rgba(255,255,255,0.04)",borderRadius:14,padding:"1.2rem",border:"1px solid rgba(232,184,75,0.2)",marginBottom:"1rem"},
    lbl:{fontFamily:"'Lora',serif",fontSize:"0.74rem",letterSpacing:"1.5px",textTransform:"uppercase",color:"rgba(255,255,255,0.45)",marginBottom:"0.3rem",display:"block"},
    inp:{width:"100%",background:"rgba(255,255,255,0.07)",border:"1.5px solid rgba(255,255,255,0.14)",color:"#fff",fontFamily:"'Lora',serif",fontSize:"0.95rem",padding:"0.6rem 0.9rem",borderRadius:8,outline:"none",marginBottom:"0.75rem"},
    sel:{width:"100%",background:"rgba(20,20,50,0.95)",border:"1.5px solid rgba(255,255,255,0.14)",color:"#fff",fontFamily:"'Lora',serif",fontSize:"0.95rem",padding:"0.6rem 0.9rem",borderRadius:8,outline:"none",marginBottom:"0.75rem"},
    ta:{width:"100%",background:"rgba(255,255,255,0.07)",border:"1.5px solid rgba(255,255,255,0.14)",color:"#fff",fontFamily:"'Lora',serif",fontSize:"0.95rem",padding:"0.6rem 0.9rem",borderRadius:8,outline:"none",marginBottom:"0.75rem",minHeight:80,resize:"vertical"},
    r2:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.7rem"},
    saveBtn:{background:"#E8B84B",color:"#0D1F5C",fontFamily:"'Caveat',cursive",fontSize:"1.05rem",fontWeight:700,padding:"0.6rem 1.4rem",borderRadius:50,border:"none",cursor:"pointer",marginRight:"0.5rem"},
    cancelBtn:{background:"rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.55)",fontFamily:"'Caveat',cursive",fontSize:"1rem",padding:"0.6rem 1.1rem",borderRadius:50,border:"1px solid rgba(255,255,255,0.12)",cursor:"pointer"},
    editBt:{fontFamily:"'Caveat',cursive",fontSize:"0.88rem",fontWeight:600,padding:"0.28rem 0.75rem",borderRadius:20,border:"none",cursor:"pointer",background:"rgba(79,116,227,0.22)",color:"#93b4ff"},
    soBt:(on)=>({fontFamily:"'Caveat',cursive",fontSize:"0.88rem",fontWeight:600,padding:"0.28rem 0.75rem",borderRadius:20,border:"none",cursor:"pointer",background:on?"rgba(22,163,74,0.22)":"rgba(234,88,12,0.22)",color:on?"#6ee7b7":"#fb923c"}),
    csBt:(on)=>({fontFamily:"'Caveat',cursive",fontSize:"0.88rem",fontWeight:600,padding:"0.28rem 0.75rem",borderRadius:20,border:"none",cursor:"pointer",background:on?"rgba(79,116,227,0.25)":"rgba(255,255,255,0.08)",color:on?"#93c5fd":"rgba(255,255,255,0.5)"}),
    soBadgeCS:{display:"inline-block",background:"rgba(79,116,227,0.22)",color:"#93c5fd",fontFamily:"'Caveat',cursive",fontSize:"0.72rem",fontWeight:700,padding:"0.1rem 0.5rem",borderRadius:6,marginLeft:"0.35rem"},
    delBt:{fontFamily:"'Caveat',cursive",fontSize:"0.88rem",fontWeight:600,padding:"0.28rem 0.75rem",borderRadius:20,border:"none",cursor:"pointer",background:"rgba(220,38,38,0.2)",color:"#fca5a5"},
    imgPrev:{width:"100%",height:130,objectFit:"cover",borderRadius:10,marginBottom:"0.7rem"},
    imgPh:{width:"100%",height:90,background:"rgba(255,255,255,0.04)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"0.7rem",border:"2px dashed rgba(255,255,255,0.11)",cursor:"pointer",color:"rgba(255,255,255,0.35)",fontFamily:"'Lora',serif",fontSize:"0.82rem",flexDirection:"column",gap:"0.25rem"},
    upBtn:{background:"rgba(79,116,227,0.2)",color:"#93b4ff",fontFamily:"'Caveat',cursive",fontSize:"0.9rem",fontWeight:600,padding:"0.35rem 0.9rem",borderRadius:20,border:"1px solid rgba(79,116,227,0.28)",cursor:"pointer",marginBottom:"0.7rem"},
    emojiGrid:{display:"flex",flexWrap:"wrap",gap:"0.35rem",marginBottom:"0.75rem"},
    emojiBtn:(a)=>({width:34,height:34,borderRadius:7,border:a?"2px solid #E8B84B":"1.5px solid rgba(255,255,255,0.1)",background:a?"rgba(232,184,75,0.15)":"rgba(255,255,255,0.04)",cursor:"pointer",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center"}),
    bgGrid:{display:"flex",flexWrap:"wrap",gap:"0.4rem",marginBottom:"0.75rem"},
    bgSw:(v,a)=>({width:40,height:28,borderRadius:6,background:v,cursor:"pointer",border:a?"2.5px solid #E8B84B":"2px solid transparent"}),
    soBadge:{display:"inline-block",background:"rgba(234,88,12,0.2)",color:"#fb923c",fontFamily:"'Caveat',cursive",fontSize:"0.78rem",padding:"0.1rem 0.55rem",borderRadius:20,marginLeft:"0.3rem"},
    msg:{fontFamily:"'Lora',serif",fontSize:"0.88rem",color:"#6ee7b7",marginTop:"0.5rem"},
    notifyCard:{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"1rem",marginBottom:"0.65rem",border:"1px solid rgba(255,255,255,0.07)"},
    notifyBtn:{background:"rgba(22,163,74,0.2)",color:"#6ee7b7",fontFamily:"'Caveat',cursive",fontSize:"0.88rem",fontWeight:600,padding:"0.25rem 0.8rem",borderRadius:20,border:"none",cursor:"pointer",marginTop:"0.5rem"},
    confOverlay:{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:1100,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"},
    confCard:{background:"#1a1a2e",borderRadius:18,padding:"2rem",maxWidth:320,textAlign:"center",border:"1px solid rgba(220,38,38,0.3)"},
  };

  return (
    <div style={P.overlay} onClick={onClose}>
      {confirmDel && (
        <div style={P.confOverlay} onClick={e=>e.stopPropagation()}>
          <div style={P.confCard}>
            <div style={{fontSize:"2.5rem",marginBottom:"0.5rem"}}>🗑️</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.15rem",fontWeight:700,color:"#fff",marginBottom:"0.4rem"}}>Remove this product?</div>
            <p style={{fontFamily:"'Lora',serif",fontSize:"0.88rem",color:"rgba(255,255,255,0.5)",marginBottom:"1.2rem"}}>This can't be undone.</p>
            <button style={{background:"rgba(220,38,38,0.8)",color:"#fff",fontFamily:"'Caveat',cursive",fontSize:"1rem",fontWeight:700,padding:"0.55rem 1.4rem",borderRadius:50,border:"none",cursor:"pointer",marginRight:"0.5rem"}} onClick={()=>doDelete(confirmDel)}>Yes, Remove</button>
            <button style={{background:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.6)",fontFamily:"'Caveat',cursive",fontSize:"1rem",padding:"0.55rem 1.1rem",borderRadius:50,border:"1px solid rgba(255,255,255,0.15)",cursor:"pointer"}} onClick={()=>setConfirmDel(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="admin-panel" style={P.panel} onClick={e=>e.stopPropagation()}>
        <div style={P.hdr}>
          <div style={P.hdrTitle}>🍪 Admin Dashboard</div>
          <button style={P.closeX} onClick={onClose}>✕</button>
        </div>
        <div style={P.tabs}>
          <button style={P.tab(tab==="products")} onClick={()=>setTab("products")}>Products ({products.length})</button>
          <button style={P.tab(tab==="orders")} onClick={()=>setTab("orders")}>
            Orders {ordersLoading?"…":`(${(orders||[]).length})`}
            {(orders||[]).length>0&&!ordersLoading&&<span style={{background:"#E8B84B",color:"#0D1F5C",borderRadius:"50%",width:16,height:16,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"0.65rem",fontWeight:700,marginLeft:"0.35rem"}}>{(orders||[]).length}</span>}
          </button>
          <button style={P.tab(tab==="notify")} onClick={()=>setTab("notify")}>
            Notify List ({notifyList.length})
            {notifyList.length>0&&<span style={{background:"#E8B84B",color:"#0D1F5C",borderRadius:"50%",width:16,height:16,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"0.65rem",fontWeight:700,marginLeft:"0.35rem"}}>{notifyList.length}</span>}
          </button>
          <button style={P.tab(tab==="emaillist")} onClick={()=>setTab("emaillist")}>
            Email List ({(clubList||[]).length})
            {(clubList||[]).length>0&&<span style={{background:"#E8B84B",color:"#0D1F5C",borderRadius:"50%",width:16,height:16,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"0.65rem",fontWeight:700,marginLeft:"0.35rem"}}>{(clubList||[]).length}</span>}
          </button>
          <button style={P.tab(tab==="reviews")} onClick={()=>{
            setTab("reviews");
            setPendingLoading(true);
            fetch("/api/reviews").then(r=>r.json()).then(d=>setPendingReviews(d.reviews||[])).catch(()=>{}).finally(()=>setPendingLoading(false));
          }}>
            Reviews ({(testimonials||[]).length}{pendingReviews.length>0&&<span style={{color:"#f87171",marginLeft:"0.2rem"}}>·{pendingReviews.length} pending</span>})
          </button>
          <button style={P.tab(tab==="members")} onClick={()=>{
            setTab("members");
            setMembersLoading(true);
            fetch("/api/user",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"list"})})
              .then(r=>r.json()).then(d=>setMembers(d.users||[])).catch(()=>setMembers(loadUsers())).finally(()=>setMembersLoading(false));
          }}>Members</button>
          <button style={P.tab(tab==="recipes")} onClick={()=>setTab("recipes")}>🔒 Recipes</button>
        </div>
        <div style={P.body}>
          {tab==="products" && <>
            <button style={P.addBtn} onClick={startNew}>＋ Add New Product</button>
            {msg && <div style={P.msg}>{msg}</div>}

            {editId && (
              <div style={P.formBox}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.05rem",fontWeight:700,color:"#E8B84B",marginBottom:"0.9rem"}}>{isNew?"✨ New Product":"✏️ Edit Product"}</div>
                {/* Image */}
                <label style={P.lbl}>Product Photo</label>
                {form.image
                  ? <><img src={form.image} style={P.imgPrev} alt=""/><button style={P.upBtn} onClick={()=>fileRef.current.click()}>Replace Photo</button></>
                  : <div style={P.imgPh} onClick={()=>fileRef.current.click()}><span style={{fontSize:"1.6rem"}}>📷</span><span>Click to upload</span><span style={{fontSize:"0.72rem"}}>JPG · PNG · WEBP</span></div>
                }
                <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleImg}/>
                {/* Emoji */}
                <label style={P.lbl}>Emoji</label>
                <div style={P.emojiGrid}>{EMOJIS.map(e=><button key={e} style={P.emojiBtn(form.emoji===e)} onClick={()=>setForm(f=>({...f,emoji:e}))}>{e}</button>)}</div>
                {/* Name + Price */}
                <div style={P.r2}>
                  <div><label style={P.lbl}>Name *</label><input style={P.inp} placeholder="Product name" value={form.name||""} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
                  <div><label style={P.lbl}>Price ($) *</label><input style={P.inp} type="number" min="0" step="0.01" placeholder="14.00" value={form.price||""} onChange={e=>setForm(f=>({...f,price:e.target.value}))}/></div>
                </div>
                {/* Unit + Category */}
                <div style={P.r2}>
                  <div><label style={P.lbl}>Unit</label><input style={P.inp} placeholder="half dozen, each…" value={form.unit||""} onChange={e=>setForm(f=>({...f,unit:e.target.value}))}/></div>
                  <div><label style={P.lbl}>Category</label>
                    <select style={P.sel} value={form.category||"cookie"} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                      {CATEGORIES.map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
                {/* Desc */}
                <label style={P.lbl}>Description</label>
                <textarea style={P.ta} placeholder="What makes this cookie special…" value={form.desc||""} onChange={e=>setForm(f=>({...f,desc:e.target.value}))}/>
                {/* Badge */}
                <div style={P.r2}>
                  <div><label style={P.lbl}>Badge Text</label><input style={P.inp} placeholder="New, Fan Fave…" value={form.badge||""} onChange={e=>setForm(f=>({...f,badge:e.target.value}))}/></div>
                  <div><label style={P.lbl}>Badge Color</label><input type="color" style={{...P.inp,height:42,padding:"0.3rem",cursor:"pointer"}} value={form.badgeColor||"#0D1F5C"} onChange={e=>setForm(f=>({...f,badgeColor:e.target.value}))}/></div>
                </div>
                {/* BG */}
                <label style={P.lbl}>Card Background</label>
                <div style={P.bgGrid}>{BG_OPTIONS.map(b=><div key={b.val} title={b.label} style={P.bgSw(b.val,form.bg===b.val)} onClick={()=>setForm(f=>({...f,bg:b.val}))}/>)}</div>
                {/* Sold out */}
                <label style={{...P.lbl,display:"flex",alignItems:"center",gap:"0.5rem",cursor:"pointer",marginBottom:"1rem"}}>
                  <input type="checkbox" checked={!!form.soldOut} onChange={e=>setForm(f=>({...f,soldOut:e.target.checked,comingSoon:e.target.checked?false:f.comingSoon}))} style={{width:15,height:15,accentColor:"#E8B84B"}}/>
                  Sold Out
                  <span style={{marginLeft:"1rem",display:"inline-flex",alignItems:"center",gap:"0.4rem"}}>
                    <input type="checkbox" checked={!!form.comingSoon} onChange={e=>setForm(f=>({...f,comingSoon:e.target.checked,soldOut:e.target.checked?true:f.soldOut}))} style={{width:15,height:15,accentColor:"#4F74E3"}}/>
                    Coming Soon
                  </span>
                </label>
                <button style={P.saveBtn} onClick={save}>💾 Save</button>
                <button style={P.cancelBtn} onClick={()=>setEditId(null)}>Cancel</button>
              </div>
            )}

            {products.map(p=>(
              <div key={p.id} style={P.row}>
                {p.image
                  ? <img src={p.image} style={{width:42,height:42,borderRadius:8,objectFit:"cover"}} alt=""/>
                  : <span style={{fontSize:"1.9rem",minWidth:42,textAlign:"center"}}>{p.emoji}</span>
                }
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:"0.95rem",fontWeight:700,color:"#fff"}}>
                    {p.name}{p.soldOut&&!p.comingSoon&&<span style={P.soBadge}>SOLD OUT</span>}{p.comingSoon&&<span style={P.soBadgeCS}>COMING SOON</span>}
                  </div>
                  <div style={{fontFamily:"'Lora',serif",fontSize:"0.78rem",color:"rgba(255,255,255,0.4)"}}>${p.price} / {p.unit} · {p.category}</div>
                </div>
                <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap"}}>
                  <button style={P.editBt} onClick={()=>startEdit(p)}>✏️ Edit</button>
                  {p.recipeId != null
                    ? <button style={{...P.editBt,background:"rgba(22,163,74,0.18)",borderColor:"rgba(22,163,74,0.4)",color:"#4ade80"}}
                        onClick={()=>{ setRecipeTarget(p.recipeId); setTab("recipes"); }}>
                        📋 Recipe
                      </button>
                    : <span style={{fontFamily:"'Lora',serif",fontSize:"0.7rem",color:"rgba(255,255,255,0.2)",alignSelf:"center",paddingInline:"0.3rem"}}>no recipe</span>
                  }
                  <button style={P.soBt(p.soldOut&&!p.comingSoon)} onClick={()=>{if(p.comingSoon)toggleComingSoon(p.id);else toggleSoldOut(p.id);}}>{p.soldOut&&!p.comingSoon?"✅ In Stock":"🚫 Sold Out"}</button>
                  <button style={P.csBt(p.comingSoon)} onClick={()=>toggleComingSoon(p.id)}>{p.comingSoon?"✅ Live":"🔜 Coming Soon"}</button>
                  <button style={P.delBt} onClick={()=>setConfirmDel(p.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </>}

          {tab==="orders" && <>
            <p style={{fontFamily:"'Lora',serif",fontSize:"0.88rem",color:"rgba(255,255,255,0.45)",marginBottom:"1.1rem",lineHeight:1.6}}>Recent completed orders pulled live from <strong style={{color:"#E8B84B"}}>Stripe</strong>.</p>
            {ordersLoading
              ? <div style={{textAlign:"center",padding:"3rem",color:"rgba(255,255,255,0.3)",fontFamily:"'Lora',serif",fontStyle:"italic"}}>Loading orders…</div>
              : (orders||[]).length===0
                ? <div style={{textAlign:"center",padding:"3rem",color:"rgba(255,255,255,0.3)",fontFamily:"'Lora',serif",fontStyle:"italic"}}>No orders yet.</div>
                : (orders||[]).map((o,i)=>(
                    <div key={o.id} style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"1rem 1.1rem",marginBottom:"0.75rem",border:"1px solid rgba(255,255,255,0.08)"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.4rem",flexWrap:"wrap",gap:"0.3rem"}}>
                        <div style={{fontFamily:"'Playfair Display',serif",fontSize:"0.95rem",fontWeight:700,color:"#fff"}}>{o.customer}</div>
                        <div style={{fontFamily:"'Lora',serif",fontSize:"0.78rem",color:"#E8B84B",fontWeight:700}}>${o.total}</div>
                      </div>
                      <div style={{fontFamily:"'Lora',serif",fontSize:"0.78rem",color:"rgba(255,255,255,0.45)",marginBottom:"0.4rem"}}>{o.email} {o.phone!=="—"&&`· ${o.phone}`}</div>
                      <div style={{fontFamily:"'Lora',serif",fontSize:"0.78rem",color:"rgba(255,255,255,0.45)",marginBottom:"0.5rem"}}>{o.date} · {o.delivery}</div>
                      <div style={{display:"flex",flexDirection:"column",gap:"0.15rem",marginBottom:"0.5rem"}}>
                        {o.items.map((item,j)=>(
                          <div key={j} style={{fontFamily:"'Lora',serif",fontSize:"0.78rem",color:"rgba(255,255,255,0.6)"}}>
                            {item.name} ×{item.qty} <span style={{color:"rgba(255,255,255,0.35)"}}>— ${item.price}</span>
                          </div>
                        ))}
                      </div>
                      {o.notes&&<div style={{fontFamily:"'Lora',serif",fontSize:"0.75rem",color:"rgba(255,255,255,0.35)",fontStyle:"italic",marginBottom:"0.5rem"}}>"{o.notes}"</div>}
                      <a href={`https://dashboard.stripe.com/payments/${o.paymentIntent}`} target="_blank" rel="noreferrer" style={{fontFamily:"'Lora',serif",fontSize:"0.72rem",color:"#4F74E3",textDecoration:"none"}}>View in Stripe →</a>
                    </div>
                  ))
            }
          </>}

          {tab==="notify" && <>
            <p style={{fontFamily:"'Lora',serif",fontSize:"0.88rem",color:"rgba(255,255,255,0.45)",marginBottom:"1.1rem",lineHeight:1.6}}>Send a <strong style={{color:"#E8B84B"}}>back-in-stock email</strong> directly to customers waiting on each product. {brevoLoading&&<em>(loading…)</em>}</p>
            {(()=>{
              const byProduct = brevoData?.notifyByProduct || {};
              const isEmpty = Object.keys(byProduct).length===0;
              return isEmpty
                ? <div style={{textAlign:"center",padding:"3rem 1rem",color:"rgba(255,255,255,0.3)",fontFamily:"'Lora',serif",fontStyle:"italic"}}>{brevoLoading?"Loading from Brevo…":"No signups yet. They'll appear here when customers request sold-out notifications."}</div>
                : Object.entries(byProduct).map(([productName,entries])=>(
                    <div key={productName} style={P.notifyCard}>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:"0.95rem",fontWeight:700,color:"#fff",marginBottom:"0.3rem"}}>{productName}</div>
                      {entries.map((e,i)=><div key={i} style={{fontFamily:"'Lora',serif",fontSize:"0.8rem",color:"rgba(255,255,255,0.5)"}}>📧 {e.email} · {e.date}</div>)}
                      <button style={{...P.notifyBtn,opacity:notifySending===productName?0.6:1,cursor:notifySending===productName?"wait":"pointer"}}
                        disabled={!!notifySending}
                        onClick={async()=>{
                          setNotifySending(productName);
                          setNotifyResults(prev=>({...prev,[productName]:null}));
                          try {
                            const r = await fetch("/api/send-email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
                              recipients:entries.map(e=>e.email),
                              subject:`${productName} is back at Granny Frannie's! 🍪`,
                              text:`Hi there!\n\nGreat news — ${productName} is back in stock. Head to grannyfrannies.com to order before it sells out again!`,
                              productName,
                            })});
                            const d = await r.json();
                            setNotifyResults(prev=>({...prev,[productName]:d}));
                          } catch(e){ setNotifyResults(prev=>({...prev,[productName]:{error:e.message}})); }
                          finally{ setNotifySending(null); }
                        }}>
                        {notifySending===productName?"Sending…":`📧 Send restock email to ${entries.length} customer${entries.length>1?"s":""}`}
                      </button>
                      {notifyResults[productName]&&<div style={{fontFamily:"'Lora',serif",fontSize:"0.75rem",marginTop:"0.4rem",padding:"0.4rem 0.6rem",borderRadius:6,background:notifyResults[productName].sent>0?"rgba(74,222,128,0.1)":"rgba(248,113,113,0.1)",color:notifyResults[productName].sent>0?"#4ade80":"#f87171"}}>
                        {notifyResults[productName].sent>0?`✅ Sent to ${notifyResults[productName].sent}/${notifyResults[productName].total}`:`❌ ${notifyResults[productName].error||"Send failed — add DNS records to verify sender domain"}`}
                      </div>}
                    </div>
                  ));
            })()}
          </>}

          {tab==="emaillist" && <>
            <p style={{fontFamily:"'Lora',serif",fontSize:"0.88rem",color:"rgba(255,255,255,0.45)",marginBottom:"1.1rem",lineHeight:1.6}}>Everyone who joined the <strong style={{color:"#E8B84B"}}>Cookie Club</strong> — synced live from Brevo. Write a message and send directly.</p>
            {(brevoData?.clubList||clubList||[]).length===0
              ? <div style={{textAlign:"center",padding:"3rem 1rem",color:"rgba(255,255,255,0.3)",fontFamily:"'Lora',serif",fontStyle:"italic"}}>{brevoLoading?"Loading from Brevo…":"No subscribers yet. They'll appear here when customers join the Cookie Club."}</div>
              : <>
                  <div style={{marginBottom:"0.8rem"}}>
                    <label style={{fontFamily:"'Lora',serif",fontSize:"0.72rem",color:"rgba(255,255,255,0.45)",letterSpacing:"1px",textTransform:"uppercase",display:"block",marginBottom:"0.3rem"}}>Subject</label>
                    <input value={clubSubject} onChange={e=>setClubSubject(e.target.value)} style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,padding:"0.5rem 0.7rem",color:"#fff",fontFamily:"'Lora',serif",fontSize:"0.85rem",outline:"none",marginBottom:"0.6rem"}}/>
                    <label style={{fontFamily:"'Lora',serif",fontSize:"0.72rem",color:"rgba(255,255,255,0.45)",letterSpacing:"1px",textTransform:"uppercase",display:"block",marginBottom:"0.3rem"}}>Message</label>
                    <textarea value={clubBody} onChange={e=>setClubBody(e.target.value)} rows={5} placeholder="Hi Cookie Club! Write your message here…" style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,padding:"0.5rem 0.7rem",color:"#fff",fontFamily:"'Lora',serif",fontSize:"0.85rem",outline:"none",resize:"vertical"}}/>
                  </div>
                  <button style={{...P.notifyBtn,opacity:clubSending||!clubBody.trim()?0.5:1,cursor:clubSending||!clubBody.trim()?"not-allowed":"pointer"}}
                    disabled={clubSending||!clubBody.trim()}
                    onClick={async()=>{
                      setClubSending(true); setClubResult(null);
                      try {
                        const r = await fetch("/api/send-email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
                          recipients:(brevoData?.clubList||clubList||[]).map(e=>e.email),
                          subject:clubSubject,
                          text:clubBody,
                        })});
                        setClubResult(await r.json());
                      } catch(e){ setClubResult({error:e.message}); }
                      finally{ setClubSending(false); }
                    }}>
                    {clubSending?`Sending to ${(brevoData?.clubList||clubList||[]).length}…`:`📧 Send to all ${(brevoData?.clubList||clubList||[]).length} subscriber${(brevoData?.clubList||clubList||[]).length!==1?"s":""}`}
                  </button>
                  {clubResult&&<div style={{fontFamily:"'Lora',serif",fontSize:"0.8rem",marginTop:"0.5rem",padding:"0.5rem 0.75rem",borderRadius:8,background:clubResult.sent>0?"rgba(74,222,128,0.1)":"rgba(248,113,113,0.1)",color:clubResult.sent>0?"#4ade80":"#f87171"}}>
                    {clubResult.sent>0?`✅ Sent to ${clubResult.sent}/${clubResult.total} subscribers`:`❌ ${clubResult.error||"Send failed — verify sender email in Brevo"}`}
                  </div>}
                  <div style={{marginTop:"0.8rem",display:"flex",flexDirection:"column",gap:"0.35rem"}}>
                    {(brevoData?.clubList||clubList||[]).map((e,i)=>(
                      <div key={i} style={{background:"rgba(255,255,255,0.05)",borderRadius:8,padding:"0.5rem 0.75rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontFamily:"'Lora',serif",fontSize:"0.82rem",color:"rgba(255,255,255,0.7)"}}>📧 {e.email}</span>
                        <span style={{fontFamily:"'Lora',serif",fontSize:"0.72rem",color:"rgba(255,255,255,0.35)"}}>{e.source==="cookie-club"?"Cookie Club":"Popup"} · {e.date}</span>
                      </div>
                    ))}
                  </div>
                </>
            }
          </>}

          {tab==="reviews" && <>
            {/* Pending submissions from customers */}
            {pendingLoading&&<div style={{fontFamily:"'Lora',serif",fontSize:"0.82rem",color:"rgba(255,255,255,0.4)",marginBottom:"0.8rem",fontStyle:"italic"}}>Loading submissions…</div>}
            {pendingReviews.length>0&&(
              <div style={{marginBottom:"1.2rem"}}>
                <div style={{fontFamily:"'Caveat',cursive",fontSize:"0.9rem",color:"#f87171",marginBottom:"0.6rem"}}>⏳ {pendingReviews.length} Pending Submission{pendingReviews.length!==1?"s":""}</div>
                {pendingReviews.map((r,i)=>(
                  <div key={r.id||i} style={{background:"rgba(248,113,113,0.07)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:10,padding:"0.75rem 0.9rem",marginBottom:"0.5rem"}}>
                    <p style={{fontFamily:"'Lora',serif",fontSize:"0.85rem",color:"rgba(255,255,255,0.8)",fontStyle:"italic",margin:"0 0 0.3rem"}}>"{r.text}"</p>
                    <div style={{fontFamily:"'Caveat',cursive",fontSize:"0.88rem",color:"#E8B84B",marginBottom:"0.5rem"}}>— {r.name}{r.email&&<span style={{fontFamily:"'Lora',serif",fontSize:"0.72rem",color:"rgba(255,255,255,0.35)",marginLeft:"0.4rem"}}>({r.email})</span>} · {r.date}</div>
                    <div style={{display:"flex",gap:"0.5rem"}}>
                      <button onClick={()=>{
                        setTestimonials(prev=>[...prev,{text:r.text,author:r.name,date:r.date}]);
                        fetch("/api/reviews",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"dismiss",id:r.id})}).catch(()=>{});
                        setPendingReviews(prev=>prev.filter((_,j)=>j!==i));
                        setReviewMsg("✅ Published!");setTimeout(()=>setReviewMsg(""),3000);
                      }} style={{...P.notifyBtn,padding:"0.3rem 0.8rem",fontSize:"0.78rem",background:"rgba(74,222,128,0.15)",color:"#4ade80",border:"1px solid rgba(74,222,128,0.3)"}}>✓ Approve & Publish</button>
                      <button onClick={()=>{
                        fetch("/api/reviews",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"dismiss",id:r.id})}).catch(()=>{});
                        setPendingReviews(prev=>prev.filter((_,j)=>j!==i));
                      }} style={{...P.notifyBtn,padding:"0.3rem 0.8rem",fontSize:"0.78rem",background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.35)",border:"1px solid rgba(255,255,255,0.1)"}}>Dismiss</button>
                    </div>
                  </div>
                ))}
                <div style={{borderBottom:"1px solid rgba(255,255,255,0.08)",marginBottom:"1rem",marginTop:"0.5rem"}}/>
              </div>
            )}
            <p style={{fontFamily:"'Lora',serif",fontSize:"0.88rem",color:"rgba(255,255,255,0.45)",marginBottom:"1.1rem",lineHeight:1.6}}>Published reviews appear live on the homepage. Add manually or approve submissions above.</p>
            <div style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"1rem",border:"1px solid rgba(255,255,255,0.1)",marginBottom:"1rem"}}>
              <div style={{fontFamily:"'Caveat',cursive",fontSize:"0.9rem",color:"#E8B84B",marginBottom:"0.6rem"}}>➕ Add Review</div>
              <input placeholder="Customer name" value={reviewForm.name} onChange={e=>setReviewForm(f=>({...f,name:e.target.value}))} style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,padding:"0.5rem 0.7rem",color:"#fff",fontFamily:"'Lora',serif",fontSize:"0.85rem",outline:"none",marginBottom:"0.5rem"}}/>
              <textarea placeholder="Review text…" value={reviewForm.text} onChange={e=>setReviewForm(f=>({...f,text:e.target.value}))} rows={3} style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,padding:"0.5rem 0.7rem",color:"#fff",fontFamily:"'Lora',serif",fontSize:"0.85rem",outline:"none",resize:"vertical",marginBottom:"0.5rem"}}/>
              <button disabled={!reviewForm.name||!reviewForm.text} onClick={()=>{
                if(!reviewForm.name||!reviewForm.text)return;
                setTestimonials(prev=>[...prev,{text:reviewForm.text,author:reviewForm.name,date:new Date().toLocaleDateString()}]);
                setReviewForm({name:"",text:""});
                setReviewMsg("✅ Review published!");
                setTimeout(()=>setReviewMsg(""),3000);
              }} style={{...P.notifyBtn,opacity:reviewForm.name&&reviewForm.text?1:0.5,cursor:reviewForm.name&&reviewForm.text?"pointer":"not-allowed"}}>Publish Review</button>
              {reviewMsg&&<div style={{fontFamily:"'Lora',serif",fontSize:"0.78rem",color:"#4ade80",marginTop:"0.4rem"}}>{reviewMsg}</div>}
            </div>
            {(testimonials||[]).length===0
              ? <div style={{textAlign:"center",padding:"2rem",color:"rgba(255,255,255,0.3)",fontFamily:"'Lora',serif",fontStyle:"italic"}}>No published reviews yet.</div>
              : (testimonials||[]).map((t,i)=>(
                  <div key={i} style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"0.75rem 1rem",marginBottom:"0.5rem",border:"1px solid rgba(255,255,255,0.08)",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"0.75rem"}}>
                    <div>
                      <p style={{fontFamily:"'Lora',serif",fontSize:"0.82rem",color:"rgba(255,255,255,0.7)",fontStyle:"italic",margin:"0 0 0.25rem"}}>"{t.text}"</p>
                      <p style={{fontFamily:"'Caveat',cursive",fontSize:"0.85rem",color:"#E8B84B",margin:0}}>— {t.author}</p>
                    </div>
                    <button onClick={()=>setTestimonials(prev=>prev.filter((_,j)=>j!==i))} style={{background:"rgba(220,38,38,0.15)",border:"1px solid rgba(220,38,38,0.25)",color:"#fca5a5",borderRadius:6,padding:"0.25rem 0.6rem",cursor:"pointer",fontFamily:"'Lora',serif",fontSize:"0.72rem",flexShrink:0}}>Remove</button>
                  </div>
                ))
            }
          </>}

          {tab==="members" && <>
            <p style={{fontFamily:"'Lora',serif",fontSize:"0.88rem",color:"rgba(255,255,255,0.45)",marginBottom:"1.1rem",lineHeight:1.6}}>All registered accounts. Gift points at your discretion — they can't be removed once given.</p>
            {membersLoading
              ? <div style={{textAlign:"center",padding:"3rem",color:"rgba(255,255,255,0.3)",fontFamily:"'Lora',serif",fontStyle:"italic"}}>Loading members…</div>
              : members.length===0
              ? <div style={{textAlign:"center",padding:"3rem",color:"rgba(255,255,255,0.3)",fontFamily:"'Lora',serif",fontStyle:"italic"}}>No accounts yet.</div>
              : members.map(m=>{
                  const tier = getTier(m.points);
                  const surveyAnswered = Object.values(m.survey||{}).filter(v=>v!=null&&(Array.isArray(v)?v.length>0:true)).length;
                  return (
                    <div key={m.id} style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"1rem 1.1rem",marginBottom:"0.75rem",border:"1px solid rgba(255,255,255,0.08)"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.4rem",flexWrap:"wrap",gap:"0.3rem"}}>
                        <div style={{fontFamily:"'Playfair Display',serif",fontSize:"0.95rem",fontWeight:700,color:"#fff"}}>{tier.emoji} {m.name}</div>
                        <div style={{fontFamily:"'Caveat',cursive",fontSize:"0.9rem",color:"#E8B84B",fontWeight:700}}>{m.points.toLocaleString()} pts · {tier.name}</div>
                      </div>
                      <div style={{fontFamily:"'Lora',serif",fontSize:"0.78rem",color:"rgba(255,255,255,0.45)",marginBottom:"0.25rem"}}>{m.email}</div>
                      <div style={{fontFamily:"'Lora',serif",fontSize:"0.75rem",color:"rgba(255,255,255,0.3)",marginBottom:"0.6rem"}}>Joined {m.joinDate} · {surveyAnswered}/7 survey Qs · {(m.orderHistory||[]).length} orders</div>
                      {/* Survey answers preview */}
                      {surveyAnswered>0&&<div style={{fontFamily:"'Lora',serif",fontSize:"0.73rem",color:"rgba(255,255,255,0.4)",marginBottom:"0.6rem",lineHeight:1.6}}>
                        {m.survey?.favorites?.length>0&&<div>🍪 Faves: {Array.isArray(m.survey.favorites)?m.survey.favorites.join(", "):m.survey.favorites}</div>}
                        {m.survey?.dietary?.length>0&&<div>🥗 Diet: {Array.isArray(m.survey.dietary)?m.survey.dietary.join(", "):m.survey.dietary}</div>}
                        {m.survey?.birthday&&<div>🎂 Birthday: {m.survey.birthday.includes("-")?m.survey.birthday.replace("-"," "):m.survey.birthday}</div>}
                        {m.survey?.how_heard&&<div>💌 Found us via: {m.survey.how_heard}</div>}
                      </div>}
                      {/* Gift points */}
                      <div style={{display:"flex",gap:"0.5rem",alignItems:"center",flexWrap:"wrap"}}>
                        <span style={{fontFamily:"'Lora',serif",fontSize:"0.75rem",color:"rgba(255,255,255,0.45)"}}>🧚 Gift points:</span>
                        <input type="number" min="1" max="9999" value={giftAmounts[m.id]||50} onChange={e=>setGiftAmounts(prev=>({...prev,[m.id]:parseInt(e.target.value)||50}))} style={{width:70,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:8,padding:"0.3rem 0.5rem",color:"#fff",fontFamily:"'Lora',serif",fontSize:"0.82rem",outline:"none"}}/>
                        <button onClick={()=>{
                          const pts = giftAmounts[m.id]||50;
                          const msg = `You've been gifted ${pts} cookie club point${pts!==1?"s":""} by the cookie fairy 🧚 — enjoy!`;
                          const gift = {points:pts,message:msg,date:new Date().toLocaleDateString(),seen:false};
                          const updated = {...m,points:m.points+pts,gifts:[...(m.gifts||[]),gift]};
                          const users = loadUsers();
                          const idx = users.findIndex(u=>u.id===m.id);
                          if(idx>-1){users[idx]=updated;saveUsers(users);}
                          fetch("/api/user",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"upsert",user:updated})}).catch(()=>{});
                          // Refresh members list from server
                          fetch("/api/user",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"list"})})
                            .then(r=>r.json()).then(d=>setMembers(d.users||[])).catch(()=>setMembers(loadUsers()));
                          setGiftResults(prev=>({...prev,[m.id]:`✅ Gifted ${pts} pts!`}));
                          setTimeout(()=>setGiftResults(prev=>({...prev,[m.id]:null})),3000);
                        }} style={{...P.notifyBtn,padding:"0.35rem 0.9rem",fontSize:"0.8rem"}}>Gift</button>
                        {giftResults[m.id]&&<span style={{fontFamily:"'Lora',serif",fontSize:"0.75rem",color:"#4ade80"}}>{giftResults[m.id]}</span>}
                      </div>
                    </div>
                  );
                })
            }
          </>}

          {tab==="recipes" && <RecipesTab defaultOpen={recipeTarget}/>}
        </div>
      </div>
    </div>
  );
}


// ─── POINTS CONFIG ────────────────────────────────────────────────────────────
const POINTS_PER_DOLLAR = 10; // 10 pts per $1 spent
const REWARDS = [
  {id:"r1", pts:100,  label:"$2 Off",           desc:"$2 discount on your next order",      emoji:"🎟️"},
  {id:"r2", pts:250,  label:"$5 Off",            desc:"$5 discount on your next order",      emoji:"💰"},
  {id:"r3", pts:500,  label:"Free Half Dozen",   desc:"One free half dozen of your choice",  emoji:"🍪"},
  {id:"r4", pts:750,  label:"Free Dozen",        desc:"One free dozen of any flavor",        emoji:"🎁"},
  {id:"r5", pts:1000, label:"VIP Cookie Box",    desc:"Exclusive VIP sampler box (all flavors)", emoji:"👑"},
  {id:"r6", pts:1500, label:"Granny Frannie Merch", desc:"Official GF tote bag + apron set",  emoji:"👜"},
  {id:"r7", pts:2500, label:"Cookie Founding Member", desc:"Lifetime 10% off every order + name on the wall", emoji:"⭐"},
];

// ─── USER HELPERS ─────────────────────────────────────────────────────────────
function loadUsers() { try{return JSON.parse(localStorage.getItem(USERS_KEY)||"[]");}catch{return[];} }
function saveUsers(u) { try{localStorage.setItem(USERS_KEY,JSON.stringify(u));}catch{} }
function loadSession() { try{return JSON.parse(localStorage.getItem(SESSION_KEY)||"null");}catch{return null;} }
function saveSession(u) { try{localStorage.setItem(SESSION_KEY,JSON.stringify(u));}catch{} }
function clearSession() { try{localStorage.removeItem(SESSION_KEY);}catch{} }
function hashPw(pw) { let h=0; for(let i=0;i<pw.length;i++){h=((h<<5)-h)+pw.charCodeAt(i);h|=0;} return h.toString(36); }

// ─── AUTH MODAL ───────────────────────────────────────────────────────────────
function AuthModal({ onClose, onLogin }) {
  const [mode, setMode]       = useState("login"); // login | signup | forgot
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [pw, setPw]           = useState("");
  const [pw2, setPw2]         = useState("");
  const [err, setErr]         = useState("");
  const [ok, setOk]           = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);

  const inp = {width:"100%",padding:"0.72rem 1rem",border:"2px solid #D6E0FF",borderRadius:10,fontSize:"0.97rem",color:"#0D1F5C",outline:"none",fontFamily:"'Lora',serif",marginBottom:"0.6rem",boxSizing:"border-box"};
  const btn = (bg,col)=>({background:bg,color:col,fontFamily:"'Caveat',cursive",fontSize:"1.15rem",fontWeight:700,padding:"0.72rem",borderRadius:50,border:"none",cursor:"pointer",width:"100%",marginBottom:"0.5rem",transition:"opacity 0.2s"});
  const social = {display:"flex",alignItems:"center",justifyContent:"center",gap:"0.6rem",padding:"0.65rem",borderRadius:10,border:"2px solid #E8EEFF",background:"#fff",cursor:"pointer",fontFamily:"'Lora',serif",fontSize:"0.9rem",color:"#0D1F5C",width:"100%",marginBottom:"0.5rem"};
  const divider = {display:"flex",alignItems:"center",gap:"0.7rem",margin:"0.7rem 0"};

  const doSignup = async () => {
    setErr("");
    if(!name.trim()){setErr("Please enter your name.");return;}
    if(!email.includes("@")){setErr("Please enter a valid email.");return;}
    if(pw.length<6){setErr("Password must be at least 6 characters.");return;}
    if(pw!==pw2){setErr("Passwords do not match.");return;}
    setLoading(true);
    const user = {id:Date.now().toString(),name:name.trim(),email:email.toLowerCase(),pwHash:hashPw(pw),points:50,tier:"Crumb",orderHistory:[],redeemedRewards:[],joinDate:new Date().toLocaleDateString(),socialProvider:null,survey:{},gifts:[]};
    try {
      const r = await fetch("/api/user",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"register",user})});
      const d = await r.json();
      if(!r.ok){setErr(d.error||"Sign up failed.");setLoading(false);return;}
      const {pwHash,...safeUser} = user;
      const users = loadUsers();
      users.push(user);
      saveUsers(users);
      saveSession(safeUser);
      onLogin(safeUser);
      onClose();
    } catch {
      // Fallback to local only
      const users = loadUsers();
      if(users.find(u=>u.email.toLowerCase()===email.toLowerCase())){setErr("An account with this email already exists.");setLoading(false);return;}
      users.push(user);
      saveUsers(users);
      const {pwHash,...safeUser} = user;
      saveSession(safeUser);
      onLogin(safeUser);
      onClose();
    }
    setLoading(false);
  };

  const doLogin = async () => {
    setErr("");
    setLoading(true);
    const localUsers = loadUsers();
    const localUser  = localUsers.find(u=>u.email.toLowerCase()===email.toLowerCase());

    try {
      const r = await fetch("/api/user",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"login",email:email.toLowerCase(),pwHash:hashPw(pw)})});
      const d = await r.json();

      if(r.status===401){setErr("Incorrect password.");setLoading(false);return;}

      if(r.status===404||!r.ok){
        // Not in Redis — fall back to localStorage
        if(!localUser){setErr("No account found with that email.");setLoading(false);return;}
        if(localUser.pwHash!==hashPw(pw)){setErr("Incorrect password.");setLoading(false);return;}
        // Save to Redis so it works cross-device from now on
        const {pwHash,...safeUser}=localUser;
        fetch("/api/user",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"register",user:localUser})}).catch(()=>{});
        saveSession(safeUser);
        onLogin(safeUser);
        onClose();
        setLoading(false);
        return;
      }

      // Success from Redis
      const serverUser = d.user;
      const merged = {...serverUser,pwHash:hashPw(pw)};
      const idx = localUsers.findIndex(u=>u.email.toLowerCase()===email.toLowerCase());
      if(idx>-1) localUsers[idx]=merged; else localUsers.push(merged);
      saveUsers(localUsers);
      saveSession(serverUser);
      onLogin(serverUser);
      onClose();
    } catch {
      // Network error — fall back to localStorage
      if(!localUser){setErr("No account found with that email.");setLoading(false);return;}
      if(localUser.pwHash!==hashPw(pw)){setErr("Incorrect password.");setLoading(false);return;}
      const {pwHash,...safeUser}=localUser;
      saveSession(safeUser);
      onLogin(safeUser);
      onClose();
    }
    setLoading(false);
  };

  const doSocial = (provider) => {
    setErr("");
    const mockEmail = `user_${Date.now()}@${provider.toLowerCase()}.com`;
    const mockName  = provider==="Google"?"Google User":"Apple User";
    const users = loadUsers();
    let user = users.find(u=>u.socialProvider===provider&&u.email===mockEmail);
    if(!user){
      user = {id:Date.now().toString(),name:mockName,email:mockEmail,pwHash:null,points:50,tier:"Crumb",orderHistory:[],redeemedRewards:[],joinDate:new Date().toLocaleDateString(),socialProvider:provider};
      users.push(user);
      saveUsers(users);
    }
    saveSession(user);
    onLogin(user);
    onClose();
  };

  const doForgot = () => {
    const users = loadUsers();
    if(users.find(u=>u.email.toLowerCase()===email.toLowerCase())){
      setOk("If that email is in our system, a reset link is on its way. (In production this sends a real email.)");
    } else {
      setOk("If that email is in our system, a reset link is on its way.");
    }
  };

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(13,31,92,0.78)",zIndex:900,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",overflowY:"auto"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:24,padding:"2.2rem 1.8rem",maxWidth:400,width:"100%",position:"relative",boxShadow:"0 20px 60px rgba(13,31,92,0.4)",animation:"popIn 0.35s ease",margin:"auto"}}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:16,background:"none",border:"none",fontSize:"1.4rem",cursor:"pointer",color:"#5A72B5"}}>✕</button>

        <div style={{textAlign:"center",marginBottom:"1.2rem"}}>
          <div style={{fontSize:"2.8rem",marginBottom:"0.3rem"}}>🍪</div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.55rem",fontWeight:700,color:"#0D1F5C",marginBottom:"0.15rem"}}>
            {mode==="login"?"Welcome Back":"Join the Cookie Club"}
            {mode==="forgot"?"Reset Password":""}
          </h2>
          {mode==="signup"&&<p style={{fontFamily:"'Lora',serif",fontSize:"0.82rem",color:"#5A72B5"}}>Earn 50 bonus points just for signing up 🎉</p>}
        </div>

        {err && <div style={{background:"#FFF0F0",border:"1.5px solid #FFC5C5",borderRadius:8,padding:"0.6rem 0.9rem",fontFamily:"'Lora',serif",fontSize:"0.85rem",color:"#c0392b",marginBottom:"0.7rem"}}>{err}</div>}
        {ok  && <div style={{background:"#F0FFF4",border:"1.5px solid #B2F5C8",borderRadius:8,padding:"0.6rem 0.9rem",fontFamily:"'Lora',serif",fontSize:"0.85rem",color:"#16a34a",marginBottom:"0.7rem"}}>{ok}</div>}



        {mode==="signup" && <input style={inp} placeholder="Your name" value={name} onChange={e=>setName(e.target.value)}/>}
        <input style={inp} type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)}/>

        {mode!=="forgot" && (
          <div style={{position:"relative",marginBottom:"0.6rem"}}>
            <input style={{...inp,marginBottom:0,paddingRight:"3rem"}} type={showPw?"text":"password"} placeholder="Password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(mode==="login"?doLogin():null)}/>
            <button onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#5A72B5",fontSize:"0.8rem"}}>{showPw?"Hide":"Show"}</button>
          </div>
        )}
        {mode==="signup" && <input style={inp} type="password" placeholder="Confirm password" value={pw2} onChange={e=>setPw2(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSignup()}/>}

        {mode==="login" && <button style={btn("#0D1F5C","#fff")} onClick={doLogin}>Sign In</button>}
        {mode==="signup" && <button style={btn("#0D1F5C","#fff")} onClick={doSignup}>Create Account & Earn 50 pts</button>}
        {mode==="forgot" && <button style={btn("#0D1F5C","#fff")} onClick={doForgot}>Send Reset Link</button>}

        <div style={{textAlign:"center",marginTop:"0.5rem"}}>
          {mode==="login" && <>
            <button onClick={()=>{setMode("signup");setErr("");setOk("");}} style={{background:"none",border:"none",cursor:"pointer",color:"#1A3BAA",fontFamily:"'Lora',serif",fontSize:"0.85rem",textDecoration:"underline"}}>Create an account</button>
            <span style={{color:"#D6E0FF",margin:"0 0.5rem"}}>·</span>
            <button onClick={()=>{setMode("forgot");setErr("");setOk("");}} style={{background:"none",border:"none",cursor:"pointer",color:"#5A72B5",fontFamily:"'Lora',serif",fontSize:"0.85rem",textDecoration:"underline"}}>Forgot password?</button>
          </>}
          {mode!=="login" && <button onClick={()=>{setMode("login");setErr("");setOk("");}} style={{background:"none",border:"none",cursor:"pointer",color:"#1A3BAA",fontFamily:"'Lora',serif",fontSize:"0.85rem",textDecoration:"underline"}}>Back to sign in</button>}
        </div>

        <p style={{fontFamily:"'Lora',serif",fontSize:"0.75rem",color:"#AAB8D0",textAlign:"center",marginTop:"1rem",lineHeight:1.5}}>By signing up you agree to receive occasional cookie updates. No spam, ever.</p>
      </div>
    </div>
  );
}

// ─── LOYALTY TIER HELPER ──────────────────────────────────────────────────────
function getTier(pts) {
  if(pts>=2500) return {name:"Cookie Legend",  emoji:"👑", color:"#9333ea", next:null,      nextPts:null};
  if(pts>=1000) return {name:"Cookie VIP",     emoji:"⭐", color:"#E8B84B", next:"Cookie Legend",  nextPts:2500};
  if(pts>=500)  return {name:"Cookie Regular", emoji:"🍪", color:"#1A3BAA", next:"Cookie VIP",     nextPts:1000};
  if(pts>=100)  return {name:"Cookie Fan",     emoji:"😍", color:"#2E54CC", next:"Cookie Regular", nextPts:500};
  return              {name:"Crumb",           emoji:"✨", color:"#5A72B5", next:"Cookie Fan",     nextPts:100};
}

// ─── ACCOUNT PANEL ────────────────────────────────────────────────────────────
function AccountPanel({ user, onClose, onLogout, onUpdateUser }) {
  const [tab, setTab]       = useState("dashboard"); // dashboard | history | rewards | profile
  const [redeemMsg, setRedeemMsg] = useState("");
  const [profileName, setProfileName] = useState(user.name);
  const [profileSaved, setProfileSaved] = useState(false);
  const [survey, setSurvey]   = useState(user.survey||{});
  const [surveyPts, setSurveyPts]       = useState(null);
  const [referralEmail, setReferralEmail] = useState(user.survey?.referred_by||"");
  const [referralStatus, setReferralStatus] = useState(user.survey?.referred_by?"sent":null);
  const [surveySaved, setSurveySaved] = useState(false);
  const awardedSurveyRef = useRef({...user.survey||{}});

  // Mark all unseen gifts as seen when dashboard opens
  useEffect(()=>{
    if((user.gifts||[]).some(g=>!g.seen)){
      const updated={...user,gifts:(user.gifts||[]).map(g=>({...g,seen:true}))};
      const users=loadUsers();const idx=users.findIndex(u=>u.id===user.id);
      if(idx>-1){users[idx]=updated;saveUsers(users);saveSession(updated);onUpdateUser(updated);}
    }
  },[]);

  const tier = getTier(user.points);
  const progress = tier.nextPts ? Math.min(100, Math.round((user.points/tier.nextPts)*100)) : 100;

  const redeemReward = (reward) => {
    if(user.points < reward.pts){setRedeemMsg("Not enough points yet! Keep ordering 🍪");return;}
    const updated = {...user, points: user.points - reward.pts, redeemedRewards:[...user.redeemedRewards,{...reward,redeemedOn:new Date().toLocaleDateString()}]};
    const users = loadUsers();
    const idx = users.findIndex(u=>u.id===user.id);
    if(idx>-1){users[idx]=updated;saveUsers(users);saveSession(updated);onUpdateUser(updated);}
    setRedeemMsg(`🎉 ${reward.label} redeemed! We'll apply it to your next order.`);
    setTimeout(()=>setRedeemMsg(""),4000);
  };

  const saveProfile = () => {
    const updated = {...user, name: profileName.trim()||user.name};
    const users = loadUsers();
    const idx = users.findIndex(u=>u.id===user.id);
    if(idx>-1){users[idx]=updated;saveUsers(users);saveSession(updated);onUpdateUser(updated);}
    setProfileSaved(true); setTimeout(()=>setProfileSaved(false),2500);
  };

  const AP = {
    overlay:{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:900,display:"flex",justifyContent:"flex-end"},
    panel:{background:"#111827",width:"min(480px,100vw)",height:"100vh",overflowY:"auto",display:"flex",flexDirection:"column",animation:"slideRight 0.3s ease"},
    hdr:{background:"#0D1F5C",padding:"1.2rem 1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10},
    closeX:{background:"none",border:"none",color:"rgba(255,255,255,0.6)",fontSize:"1.5rem",cursor:"pointer"},
    tabs:{display:"flex",background:"rgba(0,0,0,0.25)",borderBottom:"1px solid rgba(255,255,255,0.07)",overflowX:"auto"},
    tab:(a)=>({fontFamily:"'Lora',serif",fontSize:"0.75rem",letterSpacing:"0.5px",padding:"0.75rem 1rem",border:"none",cursor:"pointer",whiteSpace:"nowrap",background:a?"rgba(232,184,75,0.12)":"transparent",color:a?"#E8B84B":"rgba(255,255,255,0.45)",borderBottom:a?"2px solid #E8B84B":"2px solid transparent",transition:"all 0.2s",flexShrink:0}),
    body:{padding:"1.3rem",flex:1,overflowY:"auto"},
    card:{background:"rgba(255,255,255,0.05)",borderRadius:14,padding:"1.1rem",marginBottom:"0.8rem",border:"1px solid rgba(255,255,255,0.08)"},
    rewardCard:(canAfford)=>({background:canAfford?"rgba(232,184,75,0.08)":"rgba(255,255,255,0.03)",borderRadius:14,padding:"1rem",marginBottom:"0.7rem",border:`1px solid ${canAfford?"rgba(232,184,75,0.3)":"rgba(255,255,255,0.07)"}`,display:"flex",alignItems:"center",gap:"0.9rem"}),
    redeemBtn:(canAfford)=>({background:canAfford?"#E8B84B":"rgba(255,255,255,0.08)",color:canAfford?"#0D1F5C":"rgba(255,255,255,0.35)",fontFamily:"'Caveat',cursive",fontSize:"0.95rem",fontWeight:700,padding:"0.4rem 0.9rem",borderRadius:20,border:"none",cursor:canAfford?"pointer":"not-allowed",whiteSpace:"nowrap",flexShrink:0}),
    inp:{width:"100%",background:"rgba(255,255,255,0.07)",border:"1.5px solid rgba(255,255,255,0.14)",color:"#fff",fontFamily:"'Lora',serif",fontSize:"0.95rem",padding:"0.65rem 0.9rem",borderRadius:8,outline:"none",marginBottom:"0.8rem",boxSizing:"border-box"},
    saveBtn:{background:"#E8B84B",color:"#0D1F5C",fontFamily:"'Caveat',cursive",fontSize:"1.05rem",fontWeight:700,padding:"0.6rem 1.5rem",borderRadius:50,border:"none",cursor:"pointer"},
    logoutBtn:{background:"rgba(220,38,38,0.15)",color:"#fca5a5",fontFamily:"'Caveat',cursive",fontSize:"1rem",fontWeight:600,padding:"0.6rem 1.5rem",borderRadius:50,border:"1px solid rgba(220,38,38,0.25)",cursor:"pointer",marginTop:"1rem",width:"100%"},
  };

  return (
    <div style={AP.overlay} onClick={onClose}>
      <div className="admin-panel" style={AP.panel} onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={AP.hdr}>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.1rem",fontWeight:700,color:"#fff"}}>
              {tier.emoji} {user.name}
            </div>
            <div style={{fontFamily:"'Caveat',cursive",fontSize:"0.95rem",color:"#E8B84B"}}>{tier.name} · {user.points} pts</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"0.6rem"}}>
            <button onClick={()=>{clearSession();onLogout();onClose();}} style={{fontFamily:"'Lora',serif",fontSize:"0.75rem",color:"rgba(255,255,255,0.45)",background:"none",border:"1px solid rgba(255,255,255,0.15)",borderRadius:20,padding:"0.3rem 0.8rem",cursor:"pointer",letterSpacing:"0.5px"}}>Sign Out</button>
            <button style={AP.closeX} onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={AP.tabs}>
          {[["dashboard","🏠 Home"],["rewards","🎁 Rewards"],["history","📦 Orders"],["profile","⚙️ Profile"]].map(([id,label])=>(
            <button key={id} style={AP.tab(tab===id)} onClick={()=>setTab(id)}>{label}</button>
          ))}
        </div>

        <div style={AP.body}>

          {/* ── DASHBOARD ── */}
          {tab==="dashboard" && <>
            {/* Points summary */}
            <div style={{...AP.card,textAlign:"center",background:"linear-gradient(135deg,rgba(26,59,170,0.4),rgba(13,31,92,0.6))"}}>
              <div style={{fontSize:"3rem",marginBottom:"0.3rem"}}>{tier.emoji}</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:"2rem",fontWeight:900,color:"#E8B84B"}}>{user.points.toLocaleString()}</div>
              <div style={{fontFamily:"'Caveat',cursive",fontSize:"1.1rem",color:"rgba(255,255,255,0.7)",marginBottom:"0.7rem"}}>Cookie Points</div>
              <div style={{fontFamily:"'Lora',serif",fontSize:"0.85rem",color:"rgba(255,255,255,0.5)",marginBottom:"0.9rem"}}>{tier.name} Member since {user.joinDate}</div>
              {tier.nextPts && <>
                <div style={{background:"rgba(255,255,255,0.08)",borderRadius:50,height:8,marginBottom:"0.4rem",overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#E8B84B,#F5D98A)",borderRadius:50,transition:"width 1s ease"}}/>
                </div>
                <div style={{fontFamily:"'Lora',serif",fontSize:"0.78rem",color:"rgba(255,255,255,0.4)"}}>{user.points} / {tier.nextPts} pts to {tier.next}</div>
              </>}
              {!tier.nextPts && <div style={{fontFamily:"'Caveat',cursive",fontSize:"1rem",color:"#F5D98A"}}>👑 You've reached the highest tier!</div>}
            </div>

            {/* Gift notifications */}
            {(user.gifts||[]).filter(g=>!g.seen).length>0&&(
              <div style={{background:"linear-gradient(135deg,rgba(232,184,75,0.15),rgba(232,184,75,0.05))",border:"1.5px solid rgba(232,184,75,0.4)",borderRadius:14,padding:"1rem 1.1rem",marginBottom:"0.8rem"}}>
                {(user.gifts||[]).filter(g=>!g.seen).map((g,i)=>(
                  <div key={i} style={{display:"flex",gap:"0.7rem",alignItems:"flex-start",marginBottom:i<(user.gifts||[]).filter(x=>!x.seen).length-1?"0.7rem":0}}>
                    <span style={{fontSize:"1.6rem"}}>🧚</span>
                    <div>
                      <div style={{fontFamily:"'Caveat',cursive",fontSize:"1.05rem",fontWeight:700,color:"#E8B84B"}}>+{g.points} Cookie Club Points!</div>
                      <div style={{fontFamily:"'Lora',serif",fontSize:"0.85rem",color:"rgba(255,255,255,0.75)",lineHeight:1.5}}>{g.message}</div>
                      <div style={{fontFamily:"'Lora',serif",fontSize:"0.72rem",color:"rgba(255,255,255,0.35)",marginTop:"0.2rem"}}>{g.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* How points work */}
            <div style={AP.card}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontWeight:700,color:"#E8B84B",marginBottom:"0.7rem"}}>How Points Work</div>
              {[
                ["🍪","Earn points","10 pts for every $1 spent"],
                ["🎉","Bonus","50 pts just for signing up"],
                ["🎁","Redeem","Exchange pts for discounts, cookies & merch"],
                ["⭐","Level up","Unlock exclusive perks as you reach new tiers"],
              ].map(([emoji,title,desc],i)=>(
                <div key={i} style={{display:"flex",gap:"0.7rem",alignItems:"flex-start",marginBottom:"0.6rem"}}>
                  <span style={{fontSize:"1.2rem",minWidth:24}}>{emoji}</span>
                  <div>
                    <div style={{fontFamily:"'Caveat',cursive",fontSize:"1rem",fontWeight:600,color:"#fff"}}>{title}</div>
                    <div style={{fontFamily:"'Lora',serif",fontSize:"0.8rem",color:"rgba(255,255,255,0.5)"}}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tiers */}
            <div style={AP.card}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontWeight:700,color:"#E8B84B",marginBottom:"0.7rem"}}>Loyalty Tiers</div>
              {[
                {name:"Crumb",            emoji:"✨",pts:"0+",    color:"#5A72B5"},
                {name:"Cookie Fan",       emoji:"😍",pts:"100+",  color:"#2E54CC"},
                {name:"Cookie Regular",   emoji:"🍪",pts:"500+",  color:"#1A3BAA"},
                {name:"Cookie VIP",       emoji:"⭐",pts:"1,000+",color:"#E8B84B"},
                {name:"Cookie Legend",    emoji:"👑",pts:"2,500+",color:"#9333ea"},
              ].map((t,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:"0.7rem",padding:"0.45rem 0",borderBottom:"1px solid rgba(255,255,255,0.05)",opacity:user.points>=(i===0?0:i===1?100:i===2?500:i===3?1000:2500)?1:0.4}}>
                  <span style={{fontSize:"1.2rem"}}>{t.emoji}</span>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Caveat',cursive",fontSize:"1rem",fontWeight:600,color:t.color}}>{t.name}</div>
                    <div style={{fontFamily:"'Lora',serif",fontSize:"0.75rem",color:"rgba(255,255,255,0.4)"}}>{t.pts} points</div>
                  </div>
                  {user.points>=(i===0?0:i===1?100:i===2?500:i===3?1000:2500)&&<span style={{fontFamily:"'Caveat',cursive",fontSize:"0.8rem",color:"#6ee7b7"}}>✓ Unlocked</span>}
                </div>
              ))}
            </div>
          </>}



          {/* ── SURVEY CALLOUT on dashboard ── */}
          {tab==="dashboard" && (survey&&Object.values(survey).filter(v=>v!=null&&(Array.isArray(v)?v.length>0:true)).length<7) && (
            <div style={{...AP.card,background:"linear-gradient(135deg,rgba(232,184,75,0.12),rgba(26,59,170,0.2))",border:"1.5px solid rgba(232,184,75,0.3)",cursor:"pointer"}} onClick={()=>setTab("profile")}>
              <div style={{display:"flex",alignItems:"center",gap:"0.7rem"}}>
                <span style={{fontSize:"1.8rem"}}>✨</span>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:"0.95rem",fontWeight:700,color:"#E8B84B",marginBottom:"0.15rem"}}>Complete the Cookie Club Survey</div>
                  <div style={{fontFamily:"'Lora',serif",fontSize:"0.78rem",color:"rgba(255,255,255,0.55)",lineHeight:1.5}}>
                    {(7-Object.values(survey||{}).filter(v=>v!=null&&(Array.isArray(v)?v.length>0:true)).length)*5} pts available — found in the Profile tab
                  </div>
                </div>
                <span style={{color:"rgba(255,255,255,0.4)",fontSize:"1.1rem"}}>→</span>
              </div>
            </div>
          )}

          {/* ── REWARDS ── */}
          {tab==="rewards" && <>
            <div style={{fontFamily:"'Lora',serif",fontSize:"0.88rem",color:"rgba(255,255,255,0.5)",marginBottom:"1rem",lineHeight:1.6}}>
              You have <strong style={{color:"#E8B84B"}}>{user.points} points</strong>. Redeem them for discounts, free cookies, and exclusive merch.
            </div>
            {redeemMsg && <div style={{background:"rgba(22,163,74,0.15)",border:"1.5px solid rgba(22,163,74,0.4)",borderRadius:10,padding:"0.7rem 1rem",fontFamily:"'Lora',serif",fontSize:"0.88rem",color:"#6ee7b7",marginBottom:"0.9rem"}}>{redeemMsg}</div>}
            {REWARDS.map(r=>{
              const canAfford = user.points>=r.pts;
              const redeemed = user.redeemedRewards?.find(rr=>rr.id===r.id);
              return (
                <div key={r.id} style={AP.rewardCard(canAfford)}>
                  <span style={{fontSize:"2rem",minWidth:40,textAlign:"center"}}>{r.emoji}</span>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:"0.95rem",fontWeight:700,color:canAfford?"#fff":"rgba(255,255,255,0.45)",marginBottom:"0.15rem"}}>{r.label}</div>
                    <div style={{fontFamily:"'Lora',serif",fontSize:"0.78rem",color:"rgba(255,255,255,0.4)",marginBottom:"0.3rem"}}>{r.desc}</div>
                    <div style={{fontFamily:"'Caveat',cursive",fontSize:"0.95rem",color:"#E8B84B",fontWeight:700}}>{r.pts.toLocaleString()} pts</div>
                  </div>
                  <button style={AP.redeemBtn(canAfford&&!redeemed)} onClick={()=>!redeemed&&redeemReward(r)}>
                    {redeemed?"Redeemed ✓":"Redeem"}
                  </button>
                </div>
              );
            })}
          </>}

          {/* ── ORDER HISTORY ── */}
          {tab==="history" && <>
            {(!user.orderHistory||user.orderHistory.length===0)
              ? <div style={{textAlign:"center",padding:"3rem 1rem"}}>
                  <div style={{fontSize:"3rem",marginBottom:"0.7rem"}}>🍪</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.1rem",color:"#fff",marginBottom:"0.4rem"}}>No orders yet!</div>
                  <div style={{fontFamily:"'Lora',serif",fontSize:"0.88rem",color:"rgba(255,255,255,0.4)"}}>Your order history will appear here after your first purchase.</div>
                </div>
              : user.orderHistory.map((order,i)=>(
                <div key={i} style={AP.card}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.5rem"}}>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:"0.95rem",fontWeight:700,color:"#fff"}}>Order #{order.id}</div>
                    <div style={{fontFamily:"'Caveat',cursive",fontSize:"0.9rem",color:"#E8B84B"}}>+{order.pointsEarned} pts</div>
                  </div>
                  <div style={{fontFamily:"'Lora',serif",fontSize:"0.8rem",color:"rgba(255,255,255,0.4)",marginBottom:"0.5rem"}}>{order.date}</div>
                  {order.items.map((it,j)=>(
                    <div key={j} style={{fontFamily:"'Lora',serif",fontSize:"0.85rem",color:"rgba(255,255,255,0.6)",display:"flex",justifyContent:"space-between"}}>
                      <span>{it.name} ×{it.qty}</span><span>${it.price*it.qty}</span>
                    </div>
                  ))}
                  <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,color:"#E8B84B",fontSize:"1rem",marginTop:"0.5rem",borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:"0.5rem",display:"flex",justifyContent:"space-between"}}>
                    <span>Total</span><span>${order.total}</span>
                  </div>
                </div>
              ))
            }
          </>}

          {/* ── PROFILE ── */}
          {tab==="profile" && <>
            {/* ── Cookie Club Survey ── */}
            <div style={{background:"rgba(232,184,75,0.06)",border:"1.5px solid rgba(232,184,75,0.2)",borderRadius:14,padding:"1.1rem",marginBottom:"0.8rem"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontWeight:700,color:"#E8B84B",marginBottom:"0.3rem"}}>✨ Cookie Club Survey</div>
              <div style={{fontFamily:"'Lora',serif",fontSize:"0.8rem",color:"rgba(255,255,255,0.55)",lineHeight:1.5,marginBottom:"0.8rem"}}>Help us bake better — <strong style={{color:"#E8B84B"}}>+5 pts</strong> per question.{Object.values(survey||{}).filter(v=>v!=null&&(Array.isArray(v)?v.length>0:true)).length===7&&<span style={{color:"#6ee7b7"}}> All done! 🎉</span>}</div>
              {surveyPts&&<div style={{background:"rgba(74,222,128,0.15)",borderRadius:8,padding:"0.4rem 0.7rem",textAlign:"center",fontFamily:"'Caveat',cursive",fontSize:"1rem",color:"#4ade80",marginBottom:"0.6rem"}}>⭐ +{surveyPts} points!</div>}
              {[
                {id:"favorites",emoji:"🍪",q:"Favorite cookie(s)?",type:"multi",opts:["Classic Oatmeal Choc Chip","Double Chocolate Oat","PB Oat Chip","Brown Butter Maple","GF Option","Love them all!"]},
                {id:"dietary",emoji:"🥗",q:"Dietary needs?",type:"multi",opts:["None","Gluten-free","Nut-free","Dairy-free","Vegan"]},
                {id:"birthday",emoji:"🎂",q:"Your birthday?",type:"birthday",opts:[]},
                {id:"how_heard",emoji:"💌",q:"How did you find us?",type:"referral",opts:["Friend/family","Instagram","Google","Facebook","Just wandered in 🍪"]},
                {id:"frequency",emoji:"🛒",q:"How often do you order baked goods?",type:"single",opts:["Weekly!","Monthly","Occasionally","First time 🎉"]},
                {id:"gift_buyer",emoji:"🎁",q:"Buy cookies as gifts?",type:"single",opts:["Yes, always!","Sometimes","Rarely","I should start!"]},
                {id:"occasions",emoji:"🎉",q:"When do you order?",type:"multi",opts:["Everyday treat","Birthdays","Holidays","Gifting","Events"]},
              ].map(q=>{
                const val=(survey||{})[q.id];
                const isAnswered=val!=null&&(Array.isArray(val)?val.length>0:true);
                const toggleQ=(qid,opt,type)=>{
                  const cur=(survey||{})[qid];
                  const next=(type==="multi")?(()=>{const a=Array.isArray(cur)?[...cur]:[];return a.includes(opt)?a.filter(x=>x!==opt):[...a,opt];})():opt;
                  setSurvey(s=>({...s,[qid]:next}));
                };
                return <div key={q.id} style={{marginBottom:"0.6rem",padding:"0.6rem 0.7rem",background:"rgba(255,255,255,0.03)",borderRadius:10,border:`1px solid ${isAnswered?"rgba(232,184,75,0.3)":"rgba(255,255,255,0.07)"}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:"0.4rem",marginBottom:"0.45rem"}}>
                    <span>{q.emoji}</span>
                    <span style={{fontFamily:"'Lora',serif",fontSize:"0.8rem",color:isAnswered?"#E8B84B":"rgba(255,255,255,0.8)",flex:1}}>{q.q}</span>
                    {isAnswered&&<span style={{fontFamily:"'Caveat',cursive",fontSize:"0.75rem",color:"#6ee7b7"}}>✓ +5</span>}
                  </div>
                  {q.type==="birthday"
                    ? <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap"}}>
                        {[["month",["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]],["day",[...Array(31)].map((_,i)=>String(i+1))]].map(([part,opts])=>{
                          const parts=(val||"").split("-");
                          const cur=part==="month"?parts[0]:parts[1];
                          return <select key={part} value={cur||""} onChange={e=>{
                            const mp=part==="month"?e.target.value:(val||"").split("-")[0]||"";
                            const dp=part==="day"?e.target.value:(val||"").split("-")[1]||"";
                            const next=mp&&dp?`${mp}-${dp}`:mp||dp;
                            const wasAns=!!(val);
                            const isNow=!!(next);
                            const ns={...(survey||{}),birthday:next};
                            setSurvey(ns);
                          }} style={{fontFamily:"'Lora',serif",fontSize:"0.8rem",padding:"0.35rem 0.6rem",borderRadius:8,border:`1px solid ${cur?"#E8B84B":"rgba(255,255,255,0.2)"}`,background:"rgba(255,255,255,0.06)",color:cur?"#E8B84B":"rgba(255,255,255,0.6)",cursor:"pointer",flex:part==="month"?"1.5":"1"}}>
                              <option value="">{part==="month"?"Month":"Day"}</option>
                              {opts.map(o=><option key={o} value={o} style={{background:"#1a1a2e",color:"#fff"}}>{o}</option>)}
                            </select>;
                          })}
                        </div>
                    : <div style={{display:"flex",flexWrap:"wrap",gap:"0.3rem"}}>
                        {q.opts.map(opt=>{const sel=(q.type==="multi")?(Array.isArray(val)&&val.includes(opt)):val===opt;return <button key={opt} onClick={()=>toggleQ(q.id,opt,q.type)} style={{fontFamily:"'Lora',serif",fontSize:"0.72rem",padding:"0.25rem 0.55rem",borderRadius:16,border:`1px solid ${sel?"#E8B84B":"rgba(255,255,255,0.15)"}`,background:sel?"rgba(232,184,75,0.18)":"transparent",color:sel?"#E8B84B":"rgba(255,255,255,0.6)",cursor:"pointer"}}>{opt}</button>;})}
                      </div>
                  }
                  {/* Referral email input for Friend/family */}
                  {q.type==="referral"&&val==="Friend/family"&&(
                    <div style={{marginTop:"0.5rem",padding:"0.5rem 0.6rem",background:"rgba(232,184,75,0.06)",borderRadius:8,border:"1px solid rgba(232,184,75,0.2)"}}>
                      <div style={{fontFamily:"'Lora',serif",fontSize:"0.75rem",color:"rgba(255,255,255,0.6)",marginBottom:"0.4rem"}}>🎁 Enter their email to gift them <strong style={{color:"#E8B84B"}}>50 points</strong>:</div>
                      {referralStatus==="sent"
                        ? <div style={{fontFamily:"'Caveat',cursive",fontSize:"0.9rem",color:"#6ee7b7"}}>✅ 50 points gifted to {referralEmail}!</div>
                        : <div style={{display:"flex",gap:"0.4rem"}}>
                            <input
                              type="email"
                              placeholder="their@email.com"
                              value={referralEmail}
                              onChange={e=>setReferralEmail(e.target.value)}
                              style={{flex:1,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:8,padding:"0.35rem 0.6rem",color:"#fff",fontFamily:"'Lora',serif",fontSize:"0.78rem",outline:"none"}}
                            />
                            <button onClick={async()=>{
                              if(!referralEmail.includes("@"))return;
                              setReferralStatus("sending");
                              const r=await fetch("/api/referral",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({referrerEmail:referralEmail,newUserName:user.name})});
                              const d=await r.json();
                              if(r.ok){
                                setReferralStatus("sent");
                                const ns={...(survey||{}),referred_by:referralEmail};setSurvey(ns);
                                const upd={...user,survey:ns};
                                const us=loadUsers();const i=us.findIndex(u=>u.id===user.id);
                                if(i>-1){us[i]=upd;saveUsers(us);saveSession(upd);onUpdateUser(upd);}
                                fetch("/api/user",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"upsert",user:upd})}).catch(()=>{});
                              } else {
                                setReferralStatus(d.error||"Not found");
                                setTimeout(()=>setReferralStatus(null),3000);
                              }
                            }} style={{fontFamily:"'Caveat',cursive",fontSize:"0.82rem",fontWeight:700,padding:"0.35rem 0.7rem",borderRadius:8,border:"none",background:"#E8B84B",color:"#0D1F5C",cursor:"pointer",whiteSpace:"nowrap"}}>
                              {referralStatus==="sending"?"Sending…":"Gift 50 pts →"}
                            </button>
                          </div>
                      }
                      {referralStatus&&referralStatus!=="sent"&&referralStatus!=="sending"&&<div style={{fontFamily:"'Lora',serif",fontSize:"0.75rem",color:"#f87171",marginTop:"0.3rem"}}>{referralStatus}</div>}
                    </div>
                  )}
                </div>;
              })}
              {/* Save Survey button */}
              {(()=>{
                const current = survey||{};
                const awarded = awardedSurveyRef.current||{};
                const QUESTIONS_IDS = ["favorites","dietary","birthday","how_heard","frequency","gift_buyer","occasions"];
                const newlyAnswered = QUESTIONS_IDS.filter(qid=>{
                  const val=current[qid];
                  const wasAns=awarded[qid]!=null&&(Array.isArray(awarded[qid])?awarded[qid].length>0:true);
                  return val!=null&&(Array.isArray(val)?val.length>0:true)&&!wasAns;
                });
                const ptsEarned = newlyAnswered.length*5;
                return (
                  <div style={{marginTop:"0.75rem",display:"flex",alignItems:"center",gap:"0.7rem",flexWrap:"wrap"}}>
                    <button onClick={()=>{
                      if(ptsEarned>0) setSurveyPts(ptsEarned);
                      awardedSurveyRef.current = {...current};
                      const newPoints = user.points + ptsEarned;
                      const upd={...user,survey:current,points:newPoints};
                      const us=loadUsers();const i=us.findIndex(u=>u.id===user.id);
                      if(i>-1){us[i]=upd;saveUsers(us);saveSession(upd);onUpdateUser(upd);}
                      fetch("/api/user",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"upsert",user:upd})}).catch(()=>{});
                      setSurveySaved(true);setTimeout(()=>setSurveySaved(false),3000);
                      if(ptsEarned>0) setTimeout(()=>setSurveyPts(null),3000);
                    }} style={{background:"#E8B84B",color:"#0D1F5C",fontFamily:"'Caveat',cursive",fontSize:"1rem",fontWeight:700,padding:"0.55rem 1.4rem",borderRadius:50,border:"none",cursor:"pointer"}}>
                      Save Survey {ptsEarned>0?`+${ptsEarned} pts`:""}
                    </button>
                    {surveySaved&&<span style={{fontFamily:"'Lora',serif",fontSize:"0.82rem",color:"#6ee7b7"}}>✅ Saved!</span>}
                  </div>
                );
              })()}
            </div>

            <div style={{...AP.card,marginTop:"0.8rem"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontWeight:700,color:"#E8B84B",marginBottom:"0.8rem"}}>⚙️ Your Profile</div>
              <label style={{fontFamily:"'Lora',serif",fontSize:"0.75rem",letterSpacing:"1.5px",textTransform:"uppercase",color:"rgba(255,255,255,0.45)",display:"block",marginBottom:"0.3rem"}}>Display Name</label>
              <input style={{...AP.inp}} value={profileName} onChange={e=>setProfileName(e.target.value)}/>
              <label style={{fontFamily:"'Lora',serif",fontSize:"0.75rem",letterSpacing:"1.5px",textTransform:"uppercase",color:"rgba(255,255,255,0.45)",display:"block",marginBottom:"0.3rem"}}>Email</label>
              <input style={{...AP.inp,opacity:0.5,cursor:"not-allowed"}} value={user.email} readOnly/>
              <label style={{fontFamily:"'Lora',serif",fontSize:"0.75rem",letterSpacing:"1.5px",textTransform:"uppercase",color:"rgba(255,255,255,0.45)",display:"block",marginBottom:"0.3rem"}}>Member Since</label>
              <input style={{...AP.inp,opacity:0.5,cursor:"not-allowed"}} value={user.joinDate} readOnly/>
              {profileSaved&&<div style={{fontFamily:"'Lora',serif",fontSize:"0.85rem",color:"#6ee7b7",marginBottom:"0.5rem"}}>✅ Saved!</div>}
              <button style={{...AP.saveBtn}} onClick={saveProfile}>Save Changes</button>
            </div>
            {user.redeemedRewards?.length>0 && (
              <div style={AP.card}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontWeight:700,color:"#E8B84B",marginBottom:"0.7rem"}}>Redeemed Rewards</div>
                {user.redeemedRewards.map((r,i)=>(
                  <div key={i} style={{fontFamily:"'Lora',serif",fontSize:"0.85rem",color:"rgba(255,255,255,0.6)",display:"flex",justifyContent:"space-between",padding:"0.3rem 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                    <span>{r.emoji} {r.label}</span><span style={{color:"rgba(255,255,255,0.35)"}}>{r.redeemedOn}</span>
                  </div>
                ))}
              </div>
            )}

            <button style={AP.logoutBtn} onClick={()=>{clearSession();onLogout();onClose();}}>Sign Out</button>
          </>}

        </div>
      </div>
    </div>
  );
}

// ─── RECIPES TAB COMPONENT ───────────────────────────────────────────────────
function RecipesTab({ defaultOpen = null }) {
  const [open, setOpen]       = useState(defaultOpen);
  const [section, setSection] = useState("ingredients"); // ingredients | steps

  const P2 = {
    intro: {fontFamily:"'Lora',serif",fontSize:"0.88rem",color:"rgba(255,255,255,0.45)",marginBottom:"1.1rem",lineHeight:1.65,padding:"0.75rem 1rem",background:"rgba(255,255,255,0.04)",borderRadius:10,border:"1px solid rgba(255,255,255,0.07)"},
    card:  {background:"rgba(255,255,255,0.04)",borderRadius:14,marginBottom:"0.7rem",border:"1px solid rgba(255,255,255,0.07)",overflow:"hidden"},
    cardHdr: (color) => ({display:"flex",alignItems:"center",gap:"0.75rem",padding:"1rem 1.1rem",cursor:"pointer",userSelect:"none",borderLeft:`4px solid ${color}`}),
    cardEmoji: {fontSize:"1.8rem",minWidth:36,textAlign:"center"},
    cardName:  {fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontWeight:700,color:"#fff",flex:1},
    cardYield: {fontFamily:"'Lora',serif",fontSize:"0.78rem",color:"rgba(255,255,255,0.4)",whiteSpace:"nowrap"},
    chevron:   (open) => ({color:"rgba(255,255,255,0.4)",fontSize:"0.85rem",transform:open?"rotate(180deg)":"none",transition:"transform 0.2s"}),
    body:      {padding:"0 1.1rem 1.1rem"},
    note:      {fontFamily:"'Lora',serif",fontSize:"0.85rem",color:"#F5D98A",fontStyle:"italic",lineHeight:1.6,marginBottom:"0.9rem",padding:"0.6rem 0.85rem",background:"rgba(232,184,75,0.08)",borderRadius:8,border:"1px solid rgba(232,184,75,0.18)"},
    segRow:    {display:"flex",gap:"0.4rem",marginBottom:"0.9rem"},
    seg:       (a) => ({fontFamily:"'Caveat',cursive",fontSize:"0.95rem",fontWeight:600,padding:"0.3rem 0.9rem",borderRadius:20,border:"none",cursor:"pointer",background:a?"#E8B84B":"rgba(255,255,255,0.08)",color:a?"#0D1F5C":"rgba(255,255,255,0.55)",transition:"all 0.2s"}),
    ingRow:    {display:"flex",gap:"0.75rem",alignItems:"baseline",padding:"0.45rem 0",borderBottom:"1px solid rgba(255,255,255,0.05)"},
    ingQty:    {fontFamily:"'Caveat',cursive",fontSize:"1rem",fontWeight:700,color:"#E8B84B",minWidth:80,flexShrink:0},
    ingItem:   {fontFamily:"'Lora',serif",fontSize:"0.88rem",color:"rgba(255,255,255,0.72)"},
    step:      {display:"flex",gap:"0.75rem",alignItems:"flex-start",marginBottom:"0.65rem"},
    stepNum:   (c) => ({minWidth:24,height:24,borderRadius:"50%",background:c,color:"#fff",fontFamily:"'Caveat',cursive",fontSize:"0.85rem",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}),
    stepText:  {fontFamily:"'Lora',serif",fontSize:"0.88rem",color:"rgba(255,255,255,0.72)",lineHeight:1.6},
    badge:     {display:"inline-block",background:"rgba(255,255,255,0.07)",borderRadius:6,padding:"0.2rem 0.6rem",fontFamily:"'Lora',serif",fontSize:"0.76rem",color:"rgba(255,255,255,0.45)",marginBottom:"0.8rem"},
  };

  return (
    <>
      <div style={P2.intro}>
        🔒 <strong style={{color:"rgba(255,255,255,0.7)"}}>Private — Admin Only.</strong> These recipes are confidential. Do not share, screenshot, or distribute outside of authorized bakers.
      </div>
      {RECIPES.map(r => {
        const isOpen = open === r.id;
        return (
          <div key={r.id} style={P2.card}>
            <div style={P2.cardHdr(r.color)} onClick={()=>{ setOpen(isOpen?null:r.id); setSection("ingredients"); }}>
              <span style={P2.cardEmoji}>{r.emoji}</span>
              <span style={P2.cardName}>{r.name}</span>
              <span style={P2.cardYield}>~{r.yield}</span>
              <span style={P2.chevron(isOpen)}>▼</span>
            </div>
            {isOpen && (
              <div style={P2.body}>
                <div style={P2.badge}>Yields ~{r.yield} · Bake 350°F · 10–12 min</div>
                <div style={P2.note}>💡 {r.note}</div>
                <div style={P2.segRow}>
                  <button style={P2.seg(section==="ingredients")} onClick={()=>setSection("ingredients")}>Ingredients</button>
                  <button style={P2.seg(section==="steps")} onClick={()=>setSection("steps")}>Steps</button>
                </div>
                {section==="ingredients" && (
                  <div>
                    {r.ingredients.map((ing,i)=>(
                      <div key={i} style={P2.ingRow}>
                        <span style={P2.ingQty}>{ing.qty}</span>
                        <span style={P2.ingItem}>{ing.item}</span>
                      </div>
                    ))}
                  </div>
                )}
                {section==="steps" && (
                  <div>
                    {r.steps.map((step,i)=>(
                      <div key={i} style={P2.step}>
                        <span style={P2.stepNum(r.color)}>{i+1}</span>
                        <span style={P2.stepText}>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

// ─── RECIPES DATA ─────────────────────────────────────────────────────────────
const RECIPES = [
  {
    id:1, name:"Granny Frannie’s Classic Oatmeal Chocolate Chip", emoji:"🍪", color:"#4F74E3",
    yield:"8–10 dozen",
    note:"The original. Pull when centers still look underdone — they finish on the pan.",
    ingredients:[
      {qty:"1 lb",    item:"Butter (room temperature)"},
      {qty:"4 cups",  item:"All-purpose flour"},
      {qty:"5 cups",  item:"Rolled oats"},
      {qty:"2 cups",  item:"Brown sugar, packed"},
      {qty:"2 cups",  item:"White granulated sugar"},
      {qty:"4",       item:"Eggs"},
      {qty:"2 tsp",   item:"Baking powder"},
      {qty:"2 tsp",   item:"Baking soda"},
      {qty:"2 tsp",   item:"Pure vanilla extract"},
      {qty:"2 bags (24oz)", item:"Chocolate chips"},
    ],
    steps:[
      "Preheat oven to 350°F. Line baking sheets with parchment.",
      "Cream butter, brown sugar, and white sugar until light and fluffy (3–4 min). Don’t rush this.",
      "Add eggs one at a time, mixing well after each. Add vanilla.",
      "In a separate bowl, whisk flour, baking powder, and baking soda together.",
      "Gradually mix dry ingredients into butter mixture until just combined.",
      "Fold in oats until fully incorporated, then fold in chocolate chips.",
      "Chill dough 30 min for thicker cookies (optional but recommended).",
      "Scoop onto parchment-lined baking sheets, 2 inches apart.",
      "Bake 10–12 min. Pull when centers look underdone — they finish on the pan.",
      "Cool on pan 5 min, then transfer to wire rack.",
    ],
  },
  {
    id:2, name:"Double Chocolate Oat", emoji:"🍫", color:"#2E54CC",
    yield:"8–10 dozen",
    note:"Swap 1 cup flour for cocoa powder. Batter is darker and denser — don’t overbake.",
    ingredients:[
      {qty:"1 lb",    item:"Butter (room temperature)"},
      {qty:"3 cups",  item:"All-purpose flour"},
      {qty:"1 cup",   item:"Unsweetened cocoa powder"},
      {qty:"5 cups",  item:"Rolled oats"},
      {qty:"2 cups",  item:"Brown sugar, packed"},
      {qty:"2 cups",  item:"White granulated sugar"},
      {qty:"4",       item:"Eggs"},
      {qty:"2 tsp",   item:"Baking powder"},
      {qty:"2 tsp",   item:"Baking soda"},
      {qty:"2 tsp",   item:"Pure vanilla extract"},
      {qty:"2 bags",  item:"Dark chocolate chips"},
      {qty:"1 cup",   item:"Semi-sweet chocolate chips"},
    ],
    steps:[
      "Preheat oven to 350°F.",
      "Cream butter and both sugars until light and fluffy.",
      "Add eggs one at a time. Add vanilla.",
      "Whisk flour, cocoa powder, baking powder, and baking soda together.",
      "Mix dry into wet until just combined.",
      "Fold in oats then both types of chocolate chips.",
      "Chill 30 min. Scoop 2 inches apart.",
      "Bake 10–12 min. Centers should look set but not dry.",
    ],
  },
  {
    id:3, name:"PB Oat Chip", emoji:"🥜", color:"#C47C3E",
    yield:"8–10 dozen",
    note:"Reduce butter to ¼lb and add peanut butter. These spread less — press slightly before baking.",
    ingredients:[
      {qty:"¾ lb",   item:"Butter (room temperature)"},
      {qty:"2 cups",  item:"Creamy peanut butter"},
      {qty:"4 cups",  item:"All-purpose flour"},
      {qty:"5 cups",  item:"Rolled oats"},
      {qty:"2 cups",  item:"Brown sugar, packed"},
      {qty:"2 cups",  item:"White granulated sugar"},
      {qty:"4",       item:"Eggs"},
      {qty:"2 tsp",   item:"Baking powder"},
      {qty:"2 tsp",   item:"Baking soda"},
      {qty:"2 tsp",   item:"Pure vanilla extract"},
      {qty:"1 bag",   item:"Chocolate chips"},
      {qty:"1 cup",   item:"Peanut butter chips"},
    ],
    steps:[
      "Preheat oven to 350°F.",
      "Cream butter, peanut butter, and both sugars until smooth and fluffy.",
      "Add eggs one at a time. Add vanilla.",
      "Whisk flour, baking powder, and baking soda. Mix into wet ingredients.",
      "Fold in oats, chocolate chips, and peanut butter chips.",
      "Chill 30 min. Scoop and slightly flatten each ball — these don’t spread much.",
      "Bake 10–12 min until edges are set.",
    ],
  },
  {
    id:4, name:"Brown Butter Maple Oat", emoji:"🍁", color:"#E8B84B",
    yield:"8–10 dozen",
    note:"Brown the butter first and cool completely before using. Maple flavor deepens as cookies cool.",
    ingredients:[
      {qty:"1 lb",        item:"Butter (browned and cooled)"},
      {qty:"3½ cups",item:"All-purpose flour"},
      {qty:"5 cups",      item:"Rolled oats"},
      {qty:"2 cups",      item:"Brown sugar, packed"},
      {qty:"1 cup",       item:"Pure maple syrup (Grade A or B)"},
      {qty:"4",           item:"Eggs"},
      {qty:"2 tsp",       item:"Baking powder"},
      {qty:"2 tsp",       item:"Baking soda"},
      {qty:"2 tsp",       item:"Pure vanilla extract"},
      {qty:"1 bag",       item:"Butterscotch chips or white chocolate chips"},
    ],
    steps:[
      "Brown butter in a saucepan over medium heat until golden and nutty-smelling. Pour into bowl and cool completely (or refrigerate 30 min).",
      "Preheat oven to 350°F.",
      "Beat cooled brown butter with brown sugar until combined. Add maple syrup.",
      "Add eggs one at a time. Add vanilla.",
      "Whisk flour (reduced to 3½ cups), baking powder, baking soda.",
      "Mix dry into wet. Fold in oats and chips.",
      "Chill dough 45 min — this is important with maple syrup in the batter.",
      "Bake 11–13 min. Don’t judge them hot — maple flavor intensifies as they cool.",
    ],
  },
  {
    id:5, name:"Oatmeal Cranberry White Chocolate", emoji:"🍓", color:"#E05A7A",
    yield:"8–10 dozen",
    note:"Orange zest takes this to another level. Don’t skip it if you have it.",
    ingredients:[
      {qty:"1 lb",    item:"Butter (room temperature)"},
      {qty:"4 cups",  item:"All-purpose flour"},
      {qty:"5 cups",  item:"Rolled oats"},
      {qty:"2 cups",  item:"Brown sugar, packed"},
      {qty:"2 cups",  item:"White granulated sugar"},
      {qty:"4",       item:"Eggs"},
      {qty:"2 tsp",   item:"Baking powder"},
      {qty:"2 tsp",   item:"Baking soda"},
      {qty:"2 tsp",   item:"Pure vanilla extract"},
      {qty:"2 cups",  item:"Dried cranberries"},
      {qty:"1 bag",   item:"White chocolate chips"},
      {qty:"1 tsp",   item:"Orange zest (optional but recommended)"},
    ],
    steps:[
      "Preheat oven to 350°F.",
      "Cream butter and both sugars. Add eggs one at a time. Add vanilla and orange zest.",
      "Whisk flour, baking powder, and baking soda. Mix into wet.",
      "Fold in oats, cranberries, and white chocolate chips.",
      "Chill 30 min. Scoop 2 inches apart.",
      "Bake 10–12 min. These should stay slightly soft in the center.",
    ],
  },
  {
    id:6, name:"Coconut Oat Chocolate Chip", emoji:"🥥", color:"#16a34a",
    yield:"8–10 dozen",
    note:"Toast the coconut before folding in for extra depth of flavor.",
    ingredients:[
      {qty:"1 lb",    item:"Butter (room temperature)"},
      {qty:"4 cups",  item:"All-purpose flour"},
      {qty:"4 cups",  item:"Rolled oats"},
      {qty:"2 cups",  item:"Shredded sweetened coconut (toasted)"},
      {qty:"2 cups",  item:"Brown sugar, packed"},
      {qty:"2 cups",  item:"White granulated sugar"},
      {qty:"4",       item:"Eggs"},
      {qty:"2 tsp",   item:"Baking powder"},
      {qty:"2 tsp",   item:"Baking soda"},
      {qty:"2 tsp",   item:"Pure vanilla extract"},
      {qty:"1 bag",   item:"Chocolate chips"},
      {qty:"1 cup",   item:"Extra toasted coconut (for topping)"},
    ],
    steps:[
      "Toast coconut at 325°F for 5–7 min, stirring once, until golden. Cool completely.",
      "Preheat oven to 350°F.",
      "Cream butter and both sugars. Add eggs and vanilla.",
      "Mix in dry ingredients. Fold in oats, toasted coconut, and chocolate chips.",
      "Scoop onto baking sheets. Press a pinch of extra toasted coconut on top of each.",
      "Bake 10–12 min until edges are golden.",
    ],
  },
  {
    id:7, name:"Cinnamon Brown Sugar Oat", emoji:"✨", color:"#92400e",
    yield:"8–10 dozen",
    note:"All brown sugar gives a deeper molasses flavor. Roll in cinnamon sugar before baking — don’t skip this.",
    ingredients:[
      {qty:"1 lb",    item:"Butter (room temperature)"},
      {qty:"4 cups",  item:"All-purpose flour"},
      {qty:"5 cups",  item:"Rolled oats"},
      {qty:"4 cups",  item:"Brown sugar, packed (no white)"},
      {qty:"4",       item:"Eggs"},
      {qty:"2 tsp",   item:"Baking powder"},
      {qty:"2 tsp",   item:"Baking soda"},
      {qty:"2 tsp",   item:"Pure vanilla extract"},
      {qty:"3 tsp",   item:"Ground cinnamon"},
      {qty:"1 tsp",   item:"Ground nutmeg"},
      {qty:"1 cup",   item:"Raisins or golden raisins (optional)"},
      {qty:"",        item:"Cinnamon sugar for rolling (3 tbsp sugar + 1 tsp cinnamon)"},
    ],
    steps:[
      "Preheat oven to 350°F.",
      "Cream butter and all brown sugar (no white) until fluffy. Add eggs and vanilla.",
      "Whisk flour, baking powder, baking soda, cinnamon, nutmeg. Mix into wet.",
      "Fold in oats and raisins if using.",
      "Roll each ball in cinnamon sugar before placing on baking sheet.",
      "Bake 10–12 min. These are best slightly underdone — they firm up perfectly.",
    ],
  },
  {
    id:8, name:"Salted Caramel Oat", emoji:"🧂", color:"#D97706",
    yield:"8–10 dozen",
    note:"Flaky sea salt on top right before baking is non-negotiable. It makes the whole cookie.",
    ingredients:[
      {qty:"1 lb",    item:"Butter (room temperature)"},
      {qty:"4 cups",  item:"All-purpose flour"},
      {qty:"5 cups",  item:"Rolled oats"},
      {qty:"2 cups",  item:"Brown sugar, packed"},
      {qty:"2 cups",  item:"White granulated sugar"},
      {qty:"4",       item:"Eggs"},
      {qty:"2 tsp",   item:"Baking powder"},
      {qty:"2 tsp",   item:"Baking soda"},
      {qty:"2 tsp",   item:"Pure vanilla extract"},
      {qty:"2 cups",  item:"Caramel bits"},
      {qty:"1 bag",   item:"Chocolate chips"},
      {qty:"",        item:"Flaky sea salt for topping"},
    ],
    steps:[
      "Preheat oven to 350°F.",
      "Cream butter and both sugars. Add eggs and vanilla.",
      "Mix in dry ingredients. Fold in oats, caramel bits, and chocolate chips.",
      "Chill 30 min — caramel bits hold better in cold dough.",
      "Scoop onto baking sheets. Press a pinch of flaky sea salt on each ball before baking.",
      "Bake 10–12 min. Watch carefully — caramel can over-brown quickly.",
      "Cool on pan 5 min before moving — caramel needs time to set.",
    ],
  },
  {
    id:9, name:"GF Oatmeal Chocolate Chip", emoji:"🌾", color:"#16a34a",
    yield:"6–8 dozen",
    note:"GF flour absorbs differently — don't over-mix after adding the flour blend. Dough will be slightly stickier than the Classic. Chill is non-negotiable here.",
    ingredients:[
      {qty:"1 lb",        item:"Unsalted butter (room temperature)"},
      {qty:"4 cups",      item:"Certified GF rolled oats"},
      {qty:"3 cups",      item:"GF flour blend (rice flour, tapioca starch, xanthan gum)"},
      {qty:"2 cups",      item:"Brown sugar, packed"},
      {qty:"1 cup",       item:"White granulated sugar"},
      {qty:"4",           item:"Eggs"},
      {qty:"2 tsp",       item:"Baking soda"},
      {qty:"1 tsp",       item:"Baking powder"},
      {qty:"2 tsp",       item:"Pure vanilla extract"},
      {qty:"1 tsp",       item:"Salt"},
      {qty:"1 tsp",       item:"Cinnamon"},
      {qty:"2 bags (24oz)",item:"GF chocolate chips (verify brand)"},
    ],
    steps:[
      "Preheat oven to 350°F. Line baking sheets with parchment.",
      "Cream butter and both sugars until light and fluffy — 3-4 min.",
      "Add eggs one at a time, then vanilla.",
      "In a separate bowl, whisk GF flour blend, baking soda, baking powder, salt, and cinnamon.",
      "Add dry to wet gradually — mix until JUST combined. Do not over-mix; GF blends get dense fast.",
      "Fold in GF oats, then chocolate chips.",
      "Chill dough at least 45 min (longer than Classic — GF blends need the rest).",
      "Scoop onto lined baking sheets, 2 inches apart. Slightly flatten each ball.",
      "Bake 11–13 min. Centers should look barely set — they firm as they cool.",
      "Cool on pan 8 min before transferring. GF cookies are more fragile warm.",
    ],
  },
];

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [products, setProducts]   = useState(()=>{ try{const s=localStorage.getItem(PRODUCTS_KEY);return s?JSON.parse(s):INITIAL_PRODUCTS;}catch{return INITIAL_PRODUCTS;} });
  const [notifyList, setNotifyList] = useState(()=>{ try{const s=localStorage.getItem(NOTIFY_KEY);return s?JSON.parse(s):[];}catch{return[];} });
  const [clubList, setClubList]     = useState(()=>{ try{const s=localStorage.getItem(CLUB_KEY);return s?JSON.parse(s):[];}catch{return[];} });
  const [cart, setCart]           = useState([]);
  const [cartOpen, setCartOpen]   = useState(false);
  const [cartPop, setCartPop]     = useState(false);
  const [emailPopup, setEmailPopup] = useState(false);
  const [emailVal, setEmailVal]   = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [clubName, setClubName]   = useState("");
  const [galleryOpen, setGalleryOpen] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [labelOpen, setLabelOpen] = useState(null);
  const [faqOpen, setFaqOpen]     = useState(null);
  const [adminAuth, setAdminAuth]     = useState(()=>typeof sessionStorage!=="undefined"&&sessionStorage.getItem("gf_admin_auth")==="1");
  const [supabaseUser, setSupabaseUser] = useState(null);
  const [showUniversalLogin, setShowUniversalLogin] = useState(false);
  const [adminPw, setAdminPw]     = useState("");
  const [adminPwErr, setAdminPwErr] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [notifyModal, setNotifyModal] = useState(null);
  const [catFilter, setCatFilter] = useState("all");
  const [menuOpen, setMenuOpen]   = useState(false);
  const [orderForm, setOrderForm] = useState(()=>{
    const u = loadSession();
    return {name:u?.name||"",email:u?.email||"",phone:u?.phone||"",delivery:"",notes:""};
  });
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeError, setStripeError]     = useState("");
  const [deliveryZip, setDeliveryZip]     = useState("");
  const [shippingFee, setShippingFee]     = useState(0);
  const [shippingLabel, setShippingLabel] = useState("");
  const [shippingMsg, setShippingMsg]     = useState("");
  const [shippingLoading, setShippingLoading] = useState(false);
  const [payStatus, setPayStatus] = useState(null);
  const [currentUser, setCurrentUser] = useState(()=>loadSession());
  const [authOpen, setAuthOpen]       = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const popupShown = useRef(false);

  useEffect(()=>{ try{localStorage.setItem(PRODUCTS_KEY,JSON.stringify(products));}catch{} },[products]);
  useEffect(()=>{ try{localStorage.setItem(NOTIFY_KEY,JSON.stringify(notifyList));}catch{} },[notifyList]);
  useEffect(()=>{ try{localStorage.setItem(CLUB_KEY,JSON.stringify(clubList));}catch{} },[clubList]);

  useEffect(()=>{
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    document.title = "Granny Frannie's Cookies";
    // Refresh user data from server on load
    const session = loadSession();
    if(session?.email){
      fetch(`/api/user?email=${encodeURIComponent(session.email)}`)
        .then(r=>r.ok?r.json():null)
        .then(d=>{ if(d?.user) setCurrentUser(d.user); })
        .catch(()=>{});
    }

    // Sync order form with user profile when logged in
    if(session?.email){
      setOrderForm(f=>({...f,
        name:  f.name  || session.name  || "",
        email: f.email || session.email || "",
        phone: f.phone || session.phone || "",
      }));
    }

    const params = new URLSearchParams(window.location.search);
    if(params.get("payment")==="success"){
      setPayStatus("success");
      // Award points to logged-in user
      const pendingCart = JSON.parse(sessionStorage.getItem("gf_pending_cart")||"[]");
      const pendingTotal = pendingCart.reduce((s,c)=>s+c.price*c.qty,0);
      const session = loadSession();
      if(session && pendingTotal>0){
        const ptsEarned = Math.round(pendingTotal * POINTS_PER_DOLLAR);
        const order = {id:Date.now().toString().slice(-6),date:new Date().toLocaleDateString(),items:pendingCart,total:pendingTotal,pointsEarned:ptsEarned};
        const updated = {...session, points:session.points+ptsEarned, orderHistory:[order,...(session.orderHistory||[])]};
        const users = loadUsers();
        const idx = users.findIndex(u=>u.id===session.id);
        if(idx>-1){users[idx]=updated;saveUsers(users);saveSession(updated);setCurrentUser(updated);}
      }
      sessionStorage.removeItem("gf_pending_cart");
      setCart([]);
      window.history.replaceState({},"",window.location.pathname);
    }
    if(params.get("payment")==="cancelled"){setPayStatus("cancelled");window.history.replaceState({},"",window.location.pathname);}
    const t = setTimeout(()=>{ if(!popupShown.current&&!loadSession()&&!sessionStorage.getItem("gf_club_dismissed")){setEmailPopup(true);popupShown.current=true;} },18000);
    return ()=>{ clearTimeout(t); document.head.removeChild(style); };
  },[]);

  const addToCart = (item) => {
    if(item.soldOut||item.comingSoon) return;
    setCart(prev=>{ const ex=prev.find(c=>c.id===item.id); if(ex)return prev.map(c=>c.id===item.id?{...c,qty:c.qty+1}:c); return[...prev,{...item,qty:1}]; });
    setCartPop(true); setTimeout(()=>setCartPop(false),600);
  };
  const removeFromCart = (id) => setCart(prev=>prev.filter(c=>c.id!==id));
  const updateQty = (id,d) => setCart(prev=>prev.map(c=>c.id===id?{...c,qty:Math.max(1,c.qty+d)}:c));
  const cartTotal = cart.reduce((s,c)=>s+c.price*c.qty,0);
  const cartCount = cart.reduce((s,c)=>s+c.qty,0);
  const getQty    = (id) => cart.find(c=>c.id===id)?.qty||0;
  const scrollTo  = (id) => { document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); setMenuOpen(false); };
  const addNotify = (pid,email) => {
    setNotifyList(prev=>[...prev,{productId:pid,email,date:new Date().toLocaleDateString()}]);
    const prod = products.find(p=>p.id===pid);
    fetch('/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,source:'notify',product:prod?.name||''})}).catch(()=>{});
  };

  const handleCheckout = async () => {
    if(!cart.length) return;
    setStripeError(""); setStripeLoading(true);
    try{
      sessionStorage.setItem("gf_pending_cart", JSON.stringify(cart));
      // Save phone to profile if logged in and phone is new
      if(currentUser && orderForm.phone && orderForm.phone !== currentUser.phone){
        const updated = {...currentUser, phone: orderForm.phone};
        setCurrentUser(updated);
        const users = loadUsers();
        const idx = users.findIndex(u=>u.id===currentUser.id);
        if(idx>-1){users[idx]=updated;saveUsers(users);saveSession(updated);}
        fetch("/api/user",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"upsert",user:updated})}).catch(()=>{});
      }
      await launchStripeCheckout(cart, currentUser?.email||orderForm.email, orderForm, shippingFee, shippingLabel);
    }
    catch(e){ setStripeError(e.message||"Something went wrong. Please try again."); setStripeLoading(false); }
  };

  const categories = ["all",...new Set(products.filter(p=>p.category!=="sandwich").map(p=>p.category))];
  const visible    = (catFilter==="all"?products:products.filter(p=>p.category===catFilter)).filter(p=>p.category!=="sandwich");

  const gallery = [
    {emoji:"🍪",label:"Fresh from the oven",caption:"Still warm. Always perfect."},
    {emoji:"🍫",label:"Double chocolate batch",caption:"Dark chocolate, doubled."},
    {emoji:"🎁",label:"Gift box ready",caption:"Packed with love."},
    {emoji:"🍦",label:"Ice cream sandwich",caption:"The weekend must-have."},
    {emoji:"🥜",label:"PB Oat up close",caption:"Crispy edges, chewy center."},
    {emoji:"🍁",label:"Maple brown butter",caption:"Our newest obsession."},
  ];
  const [testimonials, setTestimonials] = useState(()=>{ try{const s=localStorage.getItem(TESTIMONIALS_KEY);const p=s?JSON.parse(s):null;return (p&&p.length>0)?p:SEED_TESTIMONIALS;}catch{return SEED_TESTIMONIALS;} });
  useEffect(()=>{ try{localStorage.setItem(TESTIMONIALS_KEY,JSON.stringify(testimonials));}catch{} },[testimonials]);

  const Spinner = () => <span style={{display:"inline-block",width:17,height:17,border:"2.5px solid rgba(255,255,255,0.35)",borderTopColor:"#0D1F5C",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>;

  // ── COLORS ──────────────────────────────────────────────────────────────────
  const C = {
    bd:"#0D1F5C", br:"#1A3BAA", bm:"#2E54CC", bl:"#4F74E3",
    bp:"#D6E0FF", bg:"#EEF2FF", w:"#FFFFFF",  ow:"#F7F9FF",
    g:"#E8B84B",  gl:"#F5D98A", ts:"#5A72B5",
    green:"#16a34a", red:"#dc2626",
  };

  return (
    <div style={{minHeight:"100vh",background:C.ow,overflowX:"hidden",maxWidth:"100vw"}}>

      {/* ── ADMIN PANEL ── */}
      {adminOpen && (
        adminAuth
          ? <AdminPanel products={products} setProducts={setProducts} notifyList={notifyList} clubList={clubList} testimonials={testimonials} setTestimonials={setTestimonials} onClose={()=>setAdminOpen(false)}/>
          : <div style={{position:"fixed",inset:0,background:"rgba(13,31,92,0.88)",zIndex:900,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
              <div style={{background:"#fff",borderRadius:22,padding:"2.2rem 1.8rem",maxWidth:340,width:"100%",textAlign:"center",boxShadow:"0 20px 60px rgba(13,31,92,0.4)"}}>
                <div style={{fontSize:"2.8rem",marginBottom:"0.4rem"}}>🔐</div>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",fontWeight:700,color:C.bd,marginBottom:"0.4rem"}}>Admin Login</h3>
                <p style={{fontFamily:"'Lora',serif",fontSize:"0.88rem",color:C.ts,marginBottom:"1rem"}}>Enter the admin password to access the dashboard.</p>
                <input type="password" placeholder="Admin password" value={adminPw} onChange={e=>setAdminPw(e.target.value)} autoComplete="new-password" onKeyDown={e=>{if(e.key==="Enter"){setAdminLoading(true);fetch("/api/check-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:adminPw})}).then(r=>r.json()).then(d=>{d.ok?(setAdminAuth(true),sessionStorage.setItem("gf_admin_auth","1"),setAdminPwErr("")):(setAdminPwErr("Incorrect password."));}).finally(()=>setAdminLoading(false));}}} style={{width:"100%",padding:"0.75rem 1rem",border:"2px solid #D6E0FF",borderRadius:10,fontSize:"1rem",color:C.bd,outline:"none",marginBottom:"0.5rem"}}/>
                {adminPwErr && <p style={{color:C.red,fontSize:"0.83rem",fontFamily:"'Lora',serif",marginBottom:"0.5rem"}}>{adminPwErr}</p>}
                <button style={{background:C.bd,color:"#fff",fontFamily:"'Caveat',cursive",fontSize:"1.1rem",fontWeight:700,padding:"0.7rem",borderRadius:50,border:"none",cursor:"pointer",width:"100%",marginBottom:"0.5rem"}} onClick={()=>{setAdminLoading(true);fetch("/api/check-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:adminPw})}).then(r=>r.json()).then(d=>{d.ok?(setAdminAuth(true),sessionStorage.setItem("gf_admin_auth","1"),setAdminPwErr("")):(setAdminPwErr("Incorrect password."));}).finally(()=>setAdminLoading(false));}}>Enter Dashboard</button>
                <button style={{background:"none",border:"none",color:C.ts,fontSize:"0.85rem",cursor:"pointer",fontFamily:"'Lora',serif"}} onClick={()=>{setAdminOpen(false);}}>Cancel</button>
              </div>
            </div>
      )}

      {/* ── AUTH MODAL ── */}
      {authOpen && <AuthModal onClose={()=>setAuthOpen(false)} onLogin={u=>{setCurrentUser(u);setAuthOpen(false);}} />}

      {/* ── ACCOUNT PANEL ── */}
      {accountOpen && currentUser && (
        <AccountPanel
          user={currentUser}
          onClose={()=>setAccountOpen(false)}
          onLogout={()=>setCurrentUser(null)}
          onUpdateUser={u=>{
            setCurrentUser(u);
            fetch("/api/user",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"upsert",user:u})}).catch(()=>{});
          }}
        />
      )}

      {/* ── NOTIFY MODAL ── */}
      {notifyModal && <NotifyModal product={notifyModal} onClose={()=>setNotifyModal(null)} onSubmit={addNotify}/>}

      {/* ── EMAIL POPUP ── */}
      {emailPopup && (
        <div onClick={()=>setEmailPopup(false)} style={{position:"fixed",inset:0,background:"rgba(13,31,92,0.72)",zIndex:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:22,padding:"2.2rem 1.8rem",maxWidth:400,width:"100%",textAlign:"center",animation:"popIn 0.4s ease",position:"relative",boxShadow:"0 20px 60px rgba(13,31,92,0.4)"}}>
            <button onClick={()=>{setEmailPopup(false);sessionStorage.setItem("gf_club_dismissed","1");}} style={{position:"absolute",top:14,right:16,background:"none",border:"none",fontSize:"1.3rem",cursor:"pointer",color:C.ts}}>✕</button>
            <div style={{fontSize:"3.2rem",marginBottom:"0.4rem",animation:"floatY 3s ease-in-out infinite"}}>🍪</div>
            {!emailSent?<>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.6rem",fontWeight:700,color:C.bd,marginBottom:"0.4rem"}}>Join the Cookie Club 🍪</h2>
              <p style={{fontFamily:"'Lora',serif",fontSize:"0.9rem",color:C.ts,lineHeight:1.6,marginBottom:"1rem"}}>Get first access to seasonal drops, gluten-free batches, and future ice cream sandwich launches. No spam — just cookies.</p>
              <input type="email" placeholder="your@email.com" value={emailVal} onChange={e=>setEmailVal(e.target.value)} style={{width:"100%",padding:"0.75rem 1rem",border:"2px solid #D6E0FF",borderRadius:50,fontSize:"1rem",color:C.bd,outline:"none",marginBottom:"0.75rem"}}/>
              <button onClick={()=>{if(emailVal){if(!clubList.some(e=>e.email===emailVal)){setClubList(prev=>[...prev,{email:emailVal,date:new Date().toLocaleDateString(),source:'popup'}]);}fetch('/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:emailVal,source:'popup'})}).catch(()=>{});setEmailSent(true);}}} style={{background:C.br,color:"#fff",fontFamily:"'Caveat',cursive",fontSize:"1.15rem",fontWeight:700,padding:"0.7rem",borderRadius:50,border:"none",cursor:"pointer",width:"100%"}}>Count Me In 🍫</button>
              <p style={{fontFamily:"'Caveat',cursive",fontSize:"0.88rem",color:C.ts,marginTop:"0.6rem"}}>No spam. Just cookies.</p>
            </>:<>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.6rem",fontWeight:700,color:C.br,marginBottom:"0.4rem"}}>You're on the list! 🎉</h2>
              <p style={{fontFamily:"'Lora',serif",fontSize:"0.9rem",color:C.ts,lineHeight:1.6}}>First batch notification coming your way.</p>
              <button onClick={()=>setEmailPopup(false)} style={{background:C.br,color:"#fff",fontFamily:"'Caveat',cursive",fontSize:"1.1rem",fontWeight:700,padding:"0.65rem",borderRadius:50,border:"none",cursor:"pointer",width:"100%",marginTop:"1rem"}}>Let's Go →</button>
            </>}
          </div>
        </div>
      )}

      {/* ── GALLERY LIGHTBOX ── */}
      {galleryOpen!==null && (
        <div onClick={()=>setGalleryOpen(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"1.5rem"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:22,padding:"2.5rem 2rem",maxWidth:360,width:"100%",textAlign:"center",animation:"popIn 0.3s ease"}}>
            <div style={{fontSize:"6rem",marginBottom:"0.8rem"}}>{gallery[galleryOpen].emoji}</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",fontWeight:700,color:C.bd,marginBottom:"0.3rem"}}>{gallery[galleryOpen].label}</div>
            <div style={{fontFamily:"'Lora',serif",fontSize:"0.95rem",color:C.ts,fontStyle:"italic"}}>{gallery[galleryOpen].caption}</div>
            <button onClick={()=>setGalleryOpen(null)} style={{marginTop:"1.4rem",background:C.bd,color:"#fff",fontFamily:"'Caveat',cursive",fontSize:"1.05rem",padding:"0.6rem 1.8rem",borderRadius:50,border:"none",cursor:"pointer"}}>Close</button>
          </div>
        </div>
      )}

      {/* ── CART SIDEBAR ── */}
      {cartOpen && (
        <div onClick={()=>setCartOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:600,display:"flex",justifyContent:"flex-end"}}>
          <div className="cart-panel" onClick={e=>e.stopPropagation()} style={{background:C.ow,width:"min(400px,100vw)",height:"100vh",overflowY:"auto",display:"flex",flexDirection:"column",animation:"slideRight 0.3s ease"}}>
            <div style={{background:C.bd,padding:"1.1rem 1.4rem",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.3rem",fontWeight:700,color:"#fff",fontStyle:"italic"}}>Your Order 🍪</div>
              <button onClick={()=>setCartOpen(false)} style={{background:"none",border:"none",color:"#fff",fontSize:"1.5rem",cursor:"pointer"}}>✕</button>
            </div>
            <div style={{flex:1,padding:"1.3rem",display:"flex",flexDirection:"column",gap:"0.85rem"}}>
              {cart.length===0
                ? <div style={{textAlign:"center",padding:"2.5rem 1rem",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.75rem"}}>
                    <span style={{fontSize:"3rem"}}>🍪</span>
                    <p style={{fontFamily:"'Playfair Display',serif",fontSize:"1.05rem",fontWeight:700,color:C.bd,margin:0}}>Your cart is empty.</p>
                    <p style={{fontFamily:"'Lora',serif",fontSize:"0.85rem",color:C.ts,margin:0,fontStyle:"italic"}}>The cookies are waiting for you.</p>
                    <button onClick={()=>{setCartOpen(false);scrollTo("menu");}} style={{background:C.bd,color:"#fff",fontFamily:"'Caveat',cursive",fontSize:"1rem",fontWeight:700,padding:"0.6rem 1.6rem",borderRadius:50,border:"none",cursor:"pointer",marginTop:"0.35rem"}}>Browse the Menu →</button>
                  </div>
                : cart.map(item=>(
                  <div key={item.id} style={{display:"flex",alignItems:"center",gap:"0.9rem",background:"#fff",borderRadius:14,padding:"0.85rem",boxShadow:"0 2px 10px rgba(13,31,92,0.07)",border:`1px solid ${C.bp}`}}>
                    {item.image?<img src={item.image} style={{width:42,height:42,borderRadius:8,objectFit:"cover"}} alt=""/>:<span style={{fontSize:"2rem"}}>{item.emoji}</span>}
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:"0.9rem",fontWeight:700,color:C.bd}}>{item.name}</div>
                      <div style={{fontFamily:"'Caveat',cursive",fontSize:"0.95rem",color:C.bm}}>${item.price} × {item.qty} = ${item.price*item.qty}</div>
                      <button onClick={()=>removeFromCart(item.id)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:"0.8rem",textDecoration:"underline",padding:0}}>Remove</button>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <button onClick={()=>updateQty(item.id,-1)} style={{width:27,height:27,borderRadius:"50%",border:`1.5px solid ${C.bl}`,background:"transparent",color:C.bm,fontWeight:700,cursor:"pointer",fontSize:"1rem"}}>−</button>
                      <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,color:C.bd,minWidth:18,textAlign:"center"}}>{item.qty}</span>
                      <button onClick={()=>addToCart(item)} style={{width:27,height:27,borderRadius:"50%",border:`1.5px solid ${C.bl}`,background:"transparent",color:C.bm,fontWeight:700,cursor:"pointer",fontSize:"1rem"}}>+</button>
                    </div>
                  </div>
                ))
              }
            </div>
            {cart.length>0&&(
              <div style={{padding:"1.3rem",borderTop:`1.5px solid ${C.bp}`}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",fontWeight:900,color:C.bd,textAlign:"right",marginBottom:"0.9rem"}}>Total: ${cartTotal}</div>
                <button onClick={()=>{setCartOpen(false);scrollTo("order");}} style={{background:C.g,color:C.bd,fontFamily:"'Caveat',cursive",fontSize:"1.2rem",fontWeight:700,padding:"0.85rem",borderRadius:50,border:"none",cursor:"pointer",width:"100%"}}>💳 Proceed to Checkout</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TOP STRIPE ── */}
      <div style={{height:10,background:`repeating-linear-gradient(90deg,${C.br} 0px,${C.br} 18px,#fff 18px,#fff 36px)`}}/>

      {/* ── NAV ── */}
      <header style={{background:C.bd,position:"sticky",top:0,zIndex:500,boxShadow:"0 3px 24px rgba(13,31,92,0.5)",overflow:"visible"}}>
        <div style={{padding:"0.85rem 1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",maxWidth:1200,margin:"0 auto",position:"relative"}}>
          <div onClick={()=>scrollTo("hero")} style={{cursor:"pointer",display:"flex",alignItems:"center"}}>
            <img src={LOGO} alt="Granny Frannie's Cookies" style={{height:44,width:"auto",objectFit:"contain"}}/>
          </div>

          {/* Desktop links */}
          <nav className="desk-links">
            {[["Story","story"],["Menu","menu"],["Gallery","gallery"],["Catering","catering"],["Reviews","love"]].map(([l,id])=>(
              <button key={id} onClick={()=>scrollTo(id)} style={{color:"rgba(255,255,255,0.72)",fontFamily:"'Lora',serif",fontSize:"0.8rem",letterSpacing:"1.5px",textTransform:"uppercase",cursor:"pointer",background:"none",border:"none",transition:"color 0.2s",padding:"0.2rem 0"}}>
                {l}
              </button>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="nav-right" style={{display:"flex",gap:"0.7rem",alignItems:"center"}}>
            {/* Account / Login button */}
            {currentUser
              ? <button className="nav-signin" onClick={()=>setAccountOpen(true)} style={{background:"rgba(232,184,75,0.15)",border:"1.5px solid rgba(232,184,75,0.4)",color:"#E8B84B",fontFamily:"'Caveat',cursive",fontSize:"0.95rem",fontWeight:700,padding:"0.38rem 0.9rem",borderRadius:20,cursor:"pointer",display:"flex",alignItems:"center",gap:"0.35rem"}}>
                  {getTier(currentUser.points).emoji} {currentUser.points} pts
                </button>
              : <button className="nav-signin" onClick={()=>setAuthOpen(true)} style={{background:"rgba(255,255,255,0.1)",border:"1.5px solid rgba(255,255,255,0.22)",color:"rgba(255,255,255,0.85)",fontFamily:"'Caveat',cursive",fontSize:"0.95rem",fontWeight:600,padding:"0.38rem 0.9rem",borderRadius:20,cursor:"pointer"}}>
                  Sign In
                </button>
            }
            <button className="nav-admin" onClick={()=>setAdminOpen(true)} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:"rgba(255,255,255,0.4)",fontFamily:"'Lora',serif",fontSize:"0.68rem",letterSpacing:"1px",textTransform:"uppercase",padding:"0.35rem 0.7rem",borderRadius:16,cursor:"pointer"}}>⚙️</button>
            {hasSupabaseConfig&&<button onClick={()=>setShowUniversalLogin(v=>!v)} style={{background:supabaseUser?"rgba(232,184,75,0.15)":"rgba(255,255,255,0.08)",border:`1.5px solid ${supabaseUser?"rgba(232,184,75,0.4)":"rgba(255,255,255,0.2)"}`,color:supabaseUser?"#E8B84B":"rgba(255,255,255,0.8)",fontFamily:"'Lora',serif",fontSize:"0.72rem",letterSpacing:"0.5px",padding:"0.38rem 0.9rem",borderRadius:20,cursor:"pointer",whiteSpace:"nowrap"}}>{supabaseUser?"🍪 My Account":"Cookie Club Login"}</button>}
            <button onClick={()=>setCartOpen(true)} style={{position:"relative",background:"rgba(255,255,255,0.1)",border:"1.5px solid rgba(255,255,255,0.22)",borderRadius:50,padding:"0.42rem 0.9rem",cursor:"pointer",color:"#fff",fontFamily:"'Caveat',cursive",fontSize:"0.95rem",display:"flex",alignItems:"center",gap:5,animation:cartPop?"cartPop 0.55s ease":"none"}}>
              🛒 {cartCount>0&&<span style={{background:C.g,color:C.bd,borderRadius:"50%",width:19,height:19,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.65rem",fontWeight:700}}>{cartCount}</span>}
            </button>
            <button className="nav-order-btn" onClick={()=>scrollTo("order")} style={{background:C.g,color:C.bd,fontFamily:"'Caveat',cursive",fontSize:"1.05rem",fontWeight:700,padding:"0.42rem 1.15rem",borderRadius:50,border:"none",cursor:"pointer",whiteSpace:"nowrap"}}>Order Now →</button>
            {/* Hamburger */}
            <button className="hamburger" onClick={()=>setMenuOpen(m=>!m)} aria-label="Menu">
              <span style={{transform:menuOpen?"rotate(45deg) translate(5px,5px)":"none"}}/>
              <span style={{opacity:menuOpen?0:1}}/>
              <span style={{transform:menuOpen?"rotate(-45deg) translate(5px,-5px)":"none"}}/>
            </button>
          </div>
        </div>

        {/* Universal Login dropdown */}
        {showUniversalLogin&&hasSupabaseConfig&&(
          <div style={{position:"absolute",top:"100%",right:"1rem",zIndex:600,width:"min(340px,calc(100vw-2rem))"}}>
            <UniversalLogin onAuthChange={u=>setSupabaseUser(u)}/>
          </div>
        )}

        {/* Mobile dropdown — conditional render keeps it out of SSR output when closed */}
        {menuOpen && (
          <div className="mob-menu open" role="navigation" aria-label="Mobile navigation">
            {currentUser ? <button className="mob-link" onClick={()=>{setAccountOpen(true);setMenuOpen(false);}}>{getTier(currentUser.points).emoji} {currentUser.name} · {currentUser.points} pts</button> : <button className="mob-link" onClick={()=>{setAuthOpen(true);setMenuOpen(false);}}>🔑 Sign In / Create Account</button>}
            {[["Our Story","story"],["Menu","menu"],["Gallery","gallery"],["Catering","catering"],["Reviews","love"],["Order Now 🍪","order"]].map(([l,id])=>(
              <button key={id} className="mob-link" onClick={()=>{scrollTo(id);setMenuOpen(false);}}>{l}</button>
            ))}
            <button className="mob-link" onClick={()=>{setAdminOpen(true);setMenuOpen(false);}}>⚙️ Admin</button>
            {hasSupabaseConfig&&<button className="mob-link" onClick={()=>{setShowUniversalLogin(true);setMenuOpen(false);}}>{supabaseUser?"🍪 My Passport Account":"🍪 Cookie Club Login"}</button>}
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section id="hero" style={{position:"relative",minHeight:"92vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"4rem 1.5rem 5rem",overflow:"hidden",background:`radial-gradient(ellipse 90% 70% at 50% 50%,${C.br} 0%,${C.bd} 100%)`}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(circle at 18% 80%,rgba(79,116,227,0.25) 0%,transparent 50%),radial-gradient(circle at 82% 18%,rgba(232,184,75,0.12) 0%,transparent 50%)`,pointerEvents:"none"}}/>
        <p style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(0.85rem,2vw,1rem)",color:C.gl,letterSpacing:3,marginBottom:"0.8rem",position:"relative",zIndex:2,animation:"fadeUp 0.8s ease both",fontStyle:"italic",opacity:0.85}}>"Let all that you do be done in love." — 1 Corinthians 16:14</p>
        <div style={{position:"relative",zIndex:2,animation:"fadeUp 0.9s 0.1s ease both",marginBottom:"0.5rem"}}>
          <img src={LOGO} alt="Granny Frannie's Cookies" style={{width:"min(520px,88vw)",height:"auto",filter:"drop-shadow(0 4px 24px rgba(0,0,0,0.35))",objectFit:"contain"}}/>
        </div>
        <div style={{width:120,height:3,background:`linear-gradient(90deg,transparent,${C.g},transparent)`,margin:"1.5rem auto",position:"relative",zIndex:2}}/>
        <h1 className="hero-h1" style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,5vw,3.2rem)",fontWeight:900,color:"#fff",maxWidth:640,lineHeight:1.15,position:"relative",zIndex:2,animation:"fadeUp 1s 0.2s ease both",padding:"0 1rem",marginBottom:"1rem"}}>
          The cookies everyone begged <em style={{color:C.g,fontStyle:"italic"}}>Grandma to bring.</em>
        </h1>
        <p style={{fontFamily:"'Lora',serif",fontSize:"clamp(0.95rem,2.2vw,1.15rem)",color:"rgba(255,255,255,0.78)",maxWidth:520,lineHeight:1.75,position:"relative",zIndex:2,animation:"fadeUp 1s 0.32s ease both",padding:"0 1rem"}}>Handmade in Michigan from Granny Frannie's treasured oatmeal chocolate chip recipe — passed down with love, baked fresh, and made to feel like home.</p>
        <div className="hero-btns" style={{display:"flex",gap:"0.8rem",flexWrap:"wrap",justifyContent:"center",marginTop:"2rem",position:"relative",zIndex:2,animation:"fadeUp 1s 0.45s ease both"}}>
          <button onClick={()=>scrollTo("order")} style={{background:"#fff",color:C.bd,fontFamily:"'Caveat',cursive",fontSize:"1.2rem",fontWeight:700,padding:"0.85rem 2.2rem",borderRadius:50,border:"none",cursor:"pointer",boxShadow:"0 4px 24px rgba(0,0,0,0.25)",letterSpacing:"0.5px"}}>🍪 Order Cookies</button>
          <button onClick={()=>setEmailPopup(true)} style={{background:C.g,color:C.bd,fontFamily:"'Caveat',cursive",fontSize:"1.2rem",fontWeight:700,padding:"0.85rem 2.2rem",borderRadius:50,border:"none",cursor:"pointer",letterSpacing:"0.5px"}}>Join the Cookie Club</button>
        </div>
        {/* ── ORDER URGENCY CHIP ── */}
        {(()=>{const {cutoffDayName,fulfillLabel}=getNextCutoff();return(
          <button onClick={()=>scrollTo("how-ordering-works")} style={{display:"inline-flex",alignItems:"center",gap:"0.45rem",background:"rgba(232,184,75,0.18)",border:"1.5px solid rgba(232,184,75,0.5)",borderRadius:50,padding:"0.5rem 1.2rem",marginTop:"1.2rem",cursor:"pointer",color:C.gl,fontFamily:"'Caveat',cursive",fontSize:"0.98rem",fontWeight:600,letterSpacing:"0.2px",position:"relative",zIndex:2,animation:"fadeUp 1s 0.55s ease both"}}>
            <span style={{fontSize:"0.82rem"}}>🕐</span> Order by <strong style={{color:"#fff",marginLeft:2}}>{cutoffDayName}</strong>&nbsp;for {fulfillLabel}
          </button>
        );})()}
        <div className="hero-cookie" style={{fontSize:"clamp(5rem,18vw,11rem)",marginTop:"3rem",position:"relative",zIndex:2,animation:"fadeUp 1s 0.5s ease both,wobble 6s 1.5s ease-in-out infinite",filter:`drop-shadow(0 10px 40px rgba(232,184,75,0.3))`}}>🍪</div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker-wrap" style={{background:C.br,padding:"0.8rem 0",overflow:"hidden"}}>
        <span style={{display:"inline-block",fontFamily:"'Caveat',cursive",fontSize:"1.1rem",fontWeight:600,color:C.gl,whiteSpace:"nowrap",animation:"ticker 30s linear infinite"}}>
          🍪 Baked Fresh to Order &nbsp;·&nbsp; 🎁 Gift Boxes Available &nbsp;·&nbsp; 🚚 Michigan Pickup, Delivery &amp; Shipping &nbsp;·&nbsp; 💳 Secure Stripe Checkout &nbsp;·&nbsp; 🎉 Catering &amp; Custom Orders &nbsp;·&nbsp; 🌾 Gluten-Free Option Available &nbsp;·&nbsp; ✝️ Faith · Family · Cookies &nbsp;·&nbsp;
        </span>
      </div>

      {/* ── STORY ── */}
      <section id="story" style={{background:C.bd,padding:"5rem 1.5rem"}}>
        <div className="story-grid" style={{maxWidth:860,margin:"0 auto",display:"grid",gridTemplateColumns:"200px 1fr",gap:"3rem",alignItems:"start"}}>

          {/* Left: chef + sticky quote */}
          <div className="story-sticky" style={{textAlign:"center",position:"sticky",top:"5.5rem"}}>
            <div style={{position:"relative",display:"inline-block",animation:"floatY 4s ease-in-out infinite",filter:"drop-shadow(0 8px 30px rgba(0,0,0,0.5))"}}><span style={{fontSize:"7rem"}}>👨🏾‍🍳</span><span style={{position:"absolute",bottom:"0.15em",right:"-0.15em",fontSize:"3rem",filter:"none",lineHeight:1}}>🍪</span></div>
          </div>

          {/* Right: story text */}
          <div>
            <p style={{fontFamily:"'Caveat',cursive",fontSize:"1rem",color:C.g,letterSpacing:3,textTransform:"uppercase",marginBottom:"0.4rem"}}>A Family Legacy</p>
            <h2 className="sec-title" style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.8rem,5vw,2.8rem)",fontWeight:700,color:"#fff",lineHeight:1.15,marginBottom:"1.5rem",textAlign:"left"}}>
              A Recipe Worth <em style={{fontStyle:"italic",color:C.g}}>Keeping</em>
            </h2>

            <p style={{fontFamily:"'Lora',serif",fontSize:"1rem",lineHeight:1.9,color:"rgba(255,255,255,0.75)",marginBottom:"1.1rem"}}>
              My mom Fran — now lovingly known as Granny Frannie — was the person everyone could count on. For advice. For guidance. And for a fresh batch of oatmeal chocolate chip cookies waiting in the kitchen, no matter the occasion.
            </p>

            <p style={{fontFamily:"'Lora',serif",fontSize:"1rem",lineHeight:1.9,color:"rgba(255,255,255,0.75)",marginBottom:"1.1rem"}}>
              Those cookies showed up at birthdays and heartbreaks, late-night talks and quiet holidays. She baked for people her entire life — and even at 81, her greatest joy was making sure no one left her home without a cookie. Or three.
            </p>

            <p style={{fontFamily:"'Lora',serif",fontSize:"1rem",lineHeight:1.9,color:"rgba(255,255,255,0.75)",marginBottom:"1.1rem"}}>
              As she's gotten older, she has slowly passed the torch to me. Every batch I bake carries pieces of her — her faith, her generosity, her patience, and her belief that food is one of the purest ways we can serve one another.
            </p>

            {/* Highlighted quote block */}
            <blockquote style={{margin:"1.8rem 0",borderLeft:`4px solid ${C.g}`,paddingLeft:"1.4rem",background:"rgba(232,184,75,0.07)",borderRadius:"0 12px 12px 0",padding:"1.2rem 1.4rem"}}>
              <p style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.05rem,3vw,1.25rem)",lineHeight:1.6,color:C.gl,fontStyle:"italic",margin:"0 0 0.5rem"}}>
                "Let all that you do be done in love."
              </p>
              <cite style={{fontFamily:"'Lora',serif",fontSize:"0.78rem",color:"rgba(255,255,255,0.4)",letterSpacing:"1.5px",textTransform:"uppercase",fontStyle:"normal"}}>— 1 Corinthians 16:14</cite>
            </blockquote>

            <p style={{fontFamily:"'Lora',serif",fontSize:"1rem",lineHeight:1.9,color:"rgba(255,255,255,0.75)",marginBottom:"1.1rem"}}>
              Granny Frannie's Cookies is my way of honoring her legacy. These cookies are more than a recipe — they are memory, family, and faith, wrapped in something warm and shared with intention.
            </p>

            <p style={{fontFamily:"'Lora',serif",fontSize:"1rem",lineHeight:1.9,color:"rgba(255,255,255,0.75)"}}>
              When you order, you're carrying forward a lifetime of love and service that began in my mother's kitchen. <strong style={{color:"rgba(255,255,255,0.92)"}}>We're so glad you're here.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ── MENU ── */}
      <section id="menu" style={{background:C.w,padding:"5rem 1.5rem"}}>
        <p style={{fontFamily:"'Caveat',cursive",fontSize:"1.05rem",color:C.bm,letterSpacing:3,textTransform:"uppercase",textAlign:"center",marginBottom:"0.3rem"}}>What We Bake</p>
        <h2 className="sec-title" style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.9rem,5vw,3rem)",fontWeight:700,textAlign:"center",color:C.bd,lineHeight:1.2,marginBottom:"0.8rem"}}>The <em style={{fontStyle:"italic",color:C.bm}}>Menu</em></h2>
        <p style={{fontFamily:"'Lora',serif",fontSize:"1rem",color:C.ts,textAlign:"center",maxWidth:500,margin:"0 auto 1.2rem",lineHeight:1.7}}>Cookies the way they were meant to be — big, chewy, loaded, made with real ingredients you can taste.</p>
        <div style={{maxWidth:700,margin:"0 auto 0.5rem",background:"rgba(232,184,75,0.1)",border:"1.5px solid rgba(232,184,75,0.3)",borderRadius:12,padding:"0.7rem 1.2rem",textAlign:"center"}}>
          <p style={{fontFamily:"'Lora',serif",fontSize:"0.8rem",color:"#92680a",lineHeight:1.6,margin:0}}>📦 <strong>Michigan only</strong> — available for pickup, local delivery, and Michigan-only shipping.</p>
        </div>
        {/* Shipping cost transparency — TODO-CANDYMAN: confirm actual pickup/delivery/shipping fees */}
        <p style={{fontFamily:"'Lora',serif",fontSize:"0.78rem",color:C.ts,textAlign:"center",margin:"0 auto 1rem",maxWidth:700}}>
          Pickup free &nbsp;·&nbsp; Local delivery from ${ORDER_SCHEDULE.deliveryFee} &nbsp;·&nbsp; Michigan shipping from ${ORDER_SCHEDULE.shippingFee} &nbsp;·&nbsp;{" "}
          <button onClick={()=>scrollTo("how-ordering-works")} style={{background:"none",border:"none",color:C.bm,cursor:"pointer",fontFamily:"'Lora',serif",fontSize:"0.78rem",textDecoration:"underline",padding:0}}>How ordering works →</button>
        </p>
        <div style={{maxWidth:700,margin:"0 auto 2rem",background:"rgba(220,38,38,0.06)",border:"1.5px solid rgba(220,38,38,0.18)",borderRadius:12,padding:"0.7rem 1.2rem",textAlign:"center"}}>
          <p style={{fontFamily:"'Lora',serif",fontSize:"0.8rem",color:"#b91c1c",lineHeight:1.6,margin:0}}><strong>Allergens:</strong> All cookies contain wheat, milk, and eggs. May contain soy, peanuts, tree nuts. GF option not made in a certified GF kitchen.</p>
        </div>

        {/* Category filter */}
        <div className="cat-filters" style={{display:"flex",gap:"0.5rem",flexWrap:"wrap",justifyContent:"center",marginBottom:"2.5rem"}}>
          {categories.map(cat=>(
            <button key={cat} className="cat-btn" onClick={()=>setCatFilter(cat)} style={{fontFamily:"'Caveat',cursive",fontSize:"1rem",fontWeight:600,padding:"0.4rem 1.2rem",borderRadius:50,border:"none",cursor:"pointer",background:catFilter===cat?C.bd:C.bp,color:catFilter===cat?"#fff":C.bd,transition:"all 0.2s"}}>
              {cat==="all"?"All":cat.charAt(0).toUpperCase()+cat.slice(1)+"s"}
            </button>
          ))}
        </div>

        <div className="prod-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(280px,100%),1fr))",gap:"1.6rem",maxWidth:1080,margin:"0 auto"}}>
          {visible.map(p=>{
            const qty = getQty(p.id);
            return (
              <div key={p.id} style={{background:C.w,borderRadius:20,overflow:"hidden",boxShadow:"0 4px 20px rgba(13,31,92,0.09)",border:`1.5px solid ${C.bp}`,position:"relative",transition:"transform 0.25s,box-shadow 0.25s"}}>
                {/* Image / gradient top */}
                <div style={{background:p.bg,position:"relative",padding:0}}>
                  {p.image
                    ? <img src={p.image} style={{width:"100%",height:170,objectFit:"cover",display:"block"}} alt={p.name}/>
                    : <div style={{padding:"2rem 1.5rem 1.2rem",textAlign:"center"}}><span style={{fontSize:"3.5rem"}}>{p.emoji}</span></div>
                  }
                  {p.badge&&<span style={{position:"absolute",top:12,right:12,color:"#fff",fontFamily:"'Caveat',cursive",fontSize:"0.82rem",fontWeight:700,padding:"0.2rem 0.65rem",borderRadius:50,background:p.badgeColor||C.bd}}>{p.badge}</span>}
                  {p.comingSoon&&(
                    <div style={{position:"absolute",inset:0,background:"rgba(26,59,170,0.65)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"0.35rem"}}>
                      <span style={{fontFamily:"'Playfair Display',serif",fontSize:"1.3rem",fontWeight:700,color:"#fff",letterSpacing:"2px"}}>COMING SOON</span>
                      <span style={{fontFamily:"'Lora',serif",fontSize:"0.78rem",color:"rgba(255,255,255,0.75)"}}>Something exciting is on the way ✨</span>
                    </div>
                  )}
                  {p.soldOut&&!p.comingSoon&&(
                    <div style={{position:"absolute",inset:0,background:"rgba(13,31,92,0.58)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"0.35rem"}}>
                      <span style={{fontFamily:"'Playfair Display',serif",fontSize:"1.3rem",fontWeight:700,color:"#fff",letterSpacing:"2px"}}>SOLD OUT</span>
                      <span style={{fontFamily:"'Lora',serif",fontSize:"0.78rem",color:"rgba(255,255,255,0.7)"}}>Tap below to be notified</span>
                    </div>
                  )}
                </div>
                <div style={{padding:"1.3rem"}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.15rem",fontWeight:700,color:C.bd,marginBottom:"0.35rem"}}>{p.emoji} {p.name}</div>
                  <p style={{fontSize:"0.87rem",lineHeight:1.6,color:C.ts,marginBottom:"1rem"}}>{p.desc}</p>
                  {/* Product label toggle */}
                  {(p.ingredients||p.allergens)&&<div style={{marginBottom:"0.7rem"}}>
                    <button onClick={()=>setLabelOpen(labelOpen===p.id?null:p.id)} style={{background:"none",border:"none",color:C.ts,fontFamily:"'Lora',serif",fontSize:"0.75rem",cursor:"pointer",padding:0,letterSpacing:"0.3px",textDecoration:"underline"}}>
                      {labelOpen===p.id?"▲ Hide label":"▼ Ingredients & allergens"}
                    </button>
                    {labelOpen===p.id&&<div style={{marginTop:"0.5rem",fontSize:"0.73rem",fontFamily:"'Lora',serif",color:C.ts,lineHeight:1.65,background:"rgba(238,242,255,0.8)",borderRadius:8,padding:"0.6rem 0.8rem"}}>
                      {p.ingredients&&<p style={{marginBottom:"0.3rem"}}><strong style={{color:C.bd}}>Ingredients:</strong> {p.ingredients}</p>}
                      {p.allergens&&<p style={{marginBottom:"0.3rem",color:"#b91c1c",fontWeight:600}}>{p.allergens}</p>}
                      {p.netWeight&&<p style={{marginBottom:"0.2rem"}}><strong style={{color:C.bd}}>Net Wt:</strong> {p.netWeight}</p>}
                      {p.sku&&<p style={{marginBottom:"0.2rem"}}><strong style={{color:C.bd}}>SKU:</strong> {p.sku}</p>}
                      <p style={{fontSize:"0.65rem",color:"rgba(90,114,181,0.65)",marginTop:"0.35rem",lineHeight:1.5}}>Made in a home kitchen not inspected by Michigan MDARD. Granny Frannie's Cookies.</p>
                    </div>}
                  </div>}
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.35rem",fontWeight:900,color:C.br}}>${p.price} <span style={{fontSize:"0.74rem",fontWeight:400,fontFamily:"'Lora',serif",color:C.ts}}>/ {p.unit}</span></div>
                    {p.comingSoon
                      ? <span style={{fontFamily:"'Caveat',cursive",fontSize:"0.85rem",color:C.bm,fontWeight:600}}>✨ Coming Soon</span>
                      : p.soldOut
                      ? <button onClick={()=>setNotifyModal(p)} style={{background:C.g,color:C.bd,fontFamily:"'Caveat',cursive",fontSize:"0.9rem",fontWeight:700,padding:"0.42rem 1rem",borderRadius:50,border:"none",cursor:"pointer"}}>🔔 Notify Me</button>
                      : qty===0
                        ? <button onClick={()=>addToCart(p)} style={{background:C.bd,color:"#fff",fontFamily:"'Caveat',cursive",fontSize:"0.95rem",fontWeight:700,padding:"0.42rem 1.05rem",borderRadius:50,border:"none",cursor:"pointer"}}>Add →</button>
                        : <div style={{display:"flex",alignItems:"center",gap:7}}>
                            <button onClick={()=>updateQty(p.id,-1)} style={{width:28,height:28,borderRadius:"50%",border:`1.5px solid ${C.bl}`,background:"transparent",color:C.bm,fontWeight:700,cursor:"pointer",fontSize:"1rem"}}>−</button>
                            <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,color:C.bd,minWidth:20,textAlign:"center"}}>{qty}</span>
                            <button onClick={()=>addToCart(p)} style={{width:28,height:28,borderRadius:"50%",border:`1.5px solid ${C.bl}`,background:"transparent",color:C.bm,fontWeight:700,cursor:"pointer",fontSize:"1rem"}}>+</button>
                          </div>
                    }
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── ICE CREAM COMING SOON ── */}
      <section style={{background:`linear-gradient(135deg,${C.br} 0%,${C.bd} 100%)`,padding:"5rem 1.5rem"}}>
        <div style={{maxWidth:860,margin:"0 auto",textAlign:"center"}}>
          <p style={{fontFamily:"'Caveat',cursive",fontSize:"1.05rem",color:C.gl,letterSpacing:3,textTransform:"uppercase",marginBottom:"0.5rem"}}>Coming Soon</p>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.6rem,4vw,2.6rem)",fontWeight:700,color:"#fff",lineHeight:1.2,marginBottom:"1rem"}}>
            Granny Frannie's <em style={{fontStyle:"italic",color:C.g}}>Ice Cream Sandwiches</em>
          </h2>
          <p style={{fontFamily:"'Lora',serif",fontSize:"1rem",color:"rgba(255,255,255,0.7)",lineHeight:1.8,maxWidth:560,margin:"0 auto 2rem"}}>
            We're working toward licensed commercial production so we can safely offer ice cream sandwiches made with Granny Frannie's cookies and premium ice cream.
          </p>

          {/* Flavor preview cards */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(190px,100%),1fr))",gap:"1rem",maxWidth:820,margin:"0 auto 2.5rem"}}>
            {[
              {emoji:"🍦",name:"Classic Vanilla",desc:"Creamy vanilla bean"},
              {emoji:"🍫",name:"Chocolate Fudge",desc:"Rich dark chocolate"},
              {emoji:"🍮",name:"Salted Caramel",desc:"Sweet & salty bliss"},
              {emoji:"🌟",name:"Seasonal Flavor",desc:"Surprise drop"},
            ].map((f,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.07)",border:"1.5px solid rgba(255,255,255,0.15)",borderRadius:16,padding:"1.4rem 1rem",textAlign:"center",backdropFilter:"blur(4px)"}}>
                <div style={{fontSize:"2.4rem",marginBottom:"0.5rem",filter:"grayscale(0.2)"}}>{f.emoji}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"0.95rem",fontWeight:700,color:"#fff",marginBottom:"0.2rem"}}>{f.name}</div>
                <div style={{fontFamily:"'Lora',serif",fontSize:"0.78rem",color:"rgba(255,255,255,0.5)",marginBottom:"0.75rem"}}>{f.desc}</div>
                <div style={{fontFamily:"'Caveat',cursive",fontSize:"0.78rem",fontWeight:600,color:C.g,letterSpacing:"1px",textTransform:"uppercase",background:"rgba(232,184,75,0.12)",border:"1px solid rgba(232,184,75,0.3)",borderRadius:20,padding:"0.2rem 0.7rem",display:"inline-block"}}>Coming Soon</div>
              </div>
            ))}
          </div>

          <div style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,padding:"0.75rem 1.2rem",display:"inline-block",marginBottom:"2rem"}}>
            <p style={{fontFamily:"'Lora',serif",fontSize:"0.8rem",color:"rgba(255,255,255,0.55)",margin:0}}>🔒 Not currently available — pending licensed commercial kitchen production.</p>
          </div>

          <div>
            <button onClick={()=>setEmailPopup(true)} style={{background:C.g,color:C.bd,fontFamily:"'Caveat',cursive",fontSize:"1.1rem",fontWeight:700,padding:"0.85rem 2.2rem",borderRadius:50,border:"none",cursor:"pointer",boxShadow:"0 4px 20px rgba(232,184,75,0.3)"}}>
              🍪 Join the Cookie Club for First Access
            </button>
          </div>
        </div>
      </section>

      {/* ── HOW ORDERING WORKS ── */}
      {/* TODO-CANDYMAN: fill in real lead time, pickup address, delivery radius, and shipping zones */}
      <section id="how-ordering-works" style={{background:C.bg,padding:"4rem 1.5rem"}}>
        <div style={{maxWidth:860,margin:"0 auto"}}>
          <p style={{fontFamily:"'Caveat',cursive",fontSize:"1.05rem",color:C.bm,letterSpacing:3,textTransform:"uppercase",textAlign:"center",marginBottom:"0.3rem"}}>Before You Order</p>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.7rem,4vw,2.5rem)",fontWeight:700,textAlign:"center",color:C.bd,lineHeight:1.2,marginBottom:"0.5rem"}}>
            How Ordering <em style={{fontStyle:"italic",color:C.bm}}>Works</em>
          </h2>
          <p style={{fontFamily:"'Lora',serif",fontSize:"0.95rem",color:C.ts,textAlign:"center",maxWidth:520,margin:"0 auto 2.5rem",lineHeight:1.7}}>
            Every batch is baked fresh after you order — here's what to expect from click to cookie.
          </p>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(200px,100%),1fr))",gap:"1.4rem"}}>
            {[
              {
                emoji:"⏰",
                title:"Lead Time",
                body:"Order by Tuesday evening for Saturday fulfillment. Orders placed after the cutoff are held for the following week.",
                note:"TODO: confirm exact cutoff day & time",
              },
              {
                emoji:"📍",
                title:"Pickup",
                body:"Free pickup at our Michigan location. Pick up on Saturdays during scheduled windows.",
                note:"TODO: confirm address & pickup hours",
              },
              {
                emoji:"🚗",
                title:"Local Delivery",
                body:`Delivered to your door within our service area. Delivery fee starts at $${ORDER_SCHEDULE.deliveryFee}. Enter your zip code at checkout to confirm availability.`,
                note:"TODO: confirm delivery radius",
              },
              {
                emoji:"📦",
                title:"Michigan Shipping",
                body:`Michigan-only shipping available. Shipping starts at $${ORDER_SCHEDULE.shippingFee} and is calculated at checkout. Michigan law requires direct contact before shipping.`,
                note:"TODO: confirm shipping zones & pricing",
              },
            ].map((block,i)=>(
              <div key={i} style={{background:C.w,borderRadius:18,padding:"1.6rem 1.4rem",boxShadow:"0 2px 16px rgba(13,31,92,0.07)",border:`1.5px solid ${C.bp}`,display:"flex",flexDirection:"column",gap:"0.5rem"}}>
                <span style={{fontSize:"2rem"}}>{block.emoji}</span>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontWeight:700,color:C.bd}}>{block.title}</div>
                <p style={{fontFamily:"'Lora',serif",fontSize:"0.84rem",color:C.ts,lineHeight:1.7,margin:0}}>{block.body}</p>
              </div>
            ))}
          </div>

          <p style={{fontFamily:"'Lora',serif",fontSize:"0.8rem",color:"rgba(13,31,92,0.38)",textAlign:"center",marginTop:"2rem",fontStyle:"italic"}}>
            Questions? Email us at <a href="mailto:claude@grannyfrannies.com" style={{color:C.bm,textDecoration:"none"}}>claude@grannyfrannies.com</a> — we usually reply same day.
          </p>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="gallery" style={{background:C.bd,padding:"5rem 1.5rem"}}>
        <p style={{fontFamily:"'Caveat',cursive",fontSize:"1.05rem",color:C.g,letterSpacing:3,textTransform:"uppercase",textAlign:"center",marginBottom:"0.3rem"}}>Straight from the Kitchen</p>
        <h2 className="sec-title" style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.9rem,5vw,3rem)",fontWeight:700,textAlign:"center",color:"#fff",lineHeight:1.2,marginBottom:"0.7rem"}}>Cookie <em style={{fontStyle:"italic",color:C.g}}>Gallery</em></h2>
        <p style={{fontFamily:"'Lora',serif",fontSize:"1rem",color:"rgba(255,255,255,0.45)",textAlign:"center",maxWidth:480,margin:"0 auto 2.5rem",lineHeight:1.7}}>Tap any photo for a closer look.</p>
        <div className="gal-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1rem",maxWidth:960,margin:"0 auto"}}>
          {gallery.map((g,i)=>(
            <div key={i} onClick={()=>setGalleryOpen(i)} style={{background:"rgba(255,255,255,0.06)",borderRadius:16,padding:"1.8rem 1rem",textAlign:"center",cursor:"pointer",border:"1.5px solid rgba(255,255,255,0.1)",transition:"background 0.2s,transform 0.2s"}}>
              <span style={{fontSize:"3rem",display:"block",marginBottom:"0.5rem"}}>{g.emoji}</span>
              <div style={{fontFamily:"'Caveat',cursive",fontSize:"1rem",color:C.gl,fontWeight:600}}>{g.label}</div>
              <div style={{fontFamily:"'Lora',serif",fontSize:"0.78rem",color:"rgba(255,255,255,0.4)",marginTop:"0.2rem",fontStyle:"italic"}}>{g.caption}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATERING ── */}
      <section id="catering" style={{background:C.w,padding:"5rem 1.5rem"}}>
        <div className="catering-grid" style={{maxWidth:820,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3rem",alignItems:"center"}}>
          <div className="catering-art" style={{fontSize:"5rem",textAlign:"center",animation:"floatY 5s ease-in-out infinite"}}>🎪</div>
          <div>
            <p style={{fontFamily:"'Caveat',cursive",fontSize:"1.05rem",color:C.bm,letterSpacing:3,textTransform:"uppercase",marginBottom:"0.3rem"}}>Go Big</p>
            <h2 className="sec-title" style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.8rem,4vw,2.5rem)",fontWeight:700,color:C.bd,textAlign:"left",marginBottom:"0.8rem"}}>Catering &amp; <em style={{fontStyle:"italic",color:C.bm}}>Bulk Orders</em></h2>
            <p style={{fontSize:"1rem",lineHeight:1.7,color:C.ts,marginBottom:"0.8rem"}}>Weddings, office parties, birthdays, pop-ups — Granny Frannie's shows up fresh, beautiful, and ready to be remembered.</p>
            <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:"0.5rem",marginBottom:"1.4rem"}}>
              {["Minimum 5 dozen for bulk pricing","Custom flavor assortments available","Gift packaging & branding options","Ice cream sandwich stations for events","48-hour advance notice required"].map((item,i)=>(
                <li key={i} style={{display:"flex",alignItems:"center",gap:"0.6rem",fontFamily:"'Lora',serif",fontSize:"0.92rem",color:C.ts}}><span style={{color:C.br}}>🍪</span>{item}</li>
              ))}
            </ul>
            <button onClick={()=>scrollTo("order")} style={{background:C.g,color:C.bd,fontFamily:"'Caveat',cursive",fontSize:"1.15rem",fontWeight:700,padding:"0.75rem 2rem",borderRadius:50,border:"none",cursor:"pointer"}}>Get a Catering Quote</button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="love" style={{background:C.w,padding:"5rem 1.5rem"}}>
        <p style={{fontFamily:"'Caveat',cursive",fontSize:"1.05rem",color:C.bm,letterSpacing:3,textTransform:"uppercase",textAlign:"center",marginBottom:"0.5rem"}}>What People Are Saying</p>
        <h2 className="sec-title" style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.7rem,5vw,2.8rem)",fontWeight:700,textAlign:"center",color:C.bd,lineHeight:1.2,marginBottom:"0.6rem"}}>
          Loved by Family, Friends &amp; <em style={{fontStyle:"italic",color:C.bm}}>Cookie People Everywhere</em>
        </h2>
        <p style={{fontFamily:"'Lora',serif",fontSize:"1rem",color:C.ts,textAlign:"center",maxWidth:480,margin:"0 auto 3rem",lineHeight:1.7}}>Don't take our word for it.</p>

        <div className="test-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(260px,100%),1fr))",gap:"1.5rem",maxWidth:960,margin:"0 auto 3rem"}}>
          {testimonials.map((t,i)=>(
            <div key={i} style={{background:C.bg,borderRadius:18,padding:"1.8rem 1.6rem",boxShadow:"0 2px 20px rgba(13,31,92,0.07)",border:`1.5px solid ${C.bp}`,borderTop:`4px solid ${C.bd}`,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
              <div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"2.8rem",lineHeight:0.8,color:C.bd,marginBottom:"0.8rem",opacity:0.35}}>"</div>
                <p style={{fontFamily:"'Lora',serif",fontSize:"0.97rem",lineHeight:1.75,color:C.bd,fontStyle:"italic",marginBottom:"1.2rem"}}>"{t.text}"</p>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:C.bd,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{color:C.g,fontSize:"1rem",fontFamily:"'Caveat',cursive",fontWeight:700}}>{(t.firstName||t.author||"?")[0]}</span>
                </div>
                <div>
                  <div style={{fontFamily:"'Caveat',cursive",fontSize:"0.95rem",fontWeight:700,color:C.bd}}>
                    — {t.firstName ? `${t.firstName}${t.city ? `, ${t.city}` : ""}` : t.author}
                    {t.verified && <span style={{marginLeft:"0.4rem",fontSize:"0.68rem",color:C.g,letterSpacing:"0.5px"}}>✓ verified</span>}
                  </div>
                  <div style={{color:C.g,fontSize:"0.72rem",letterSpacing:"1px"}}>★★★★★</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Submit a review ── */}
        <ReviewForm currentUser={currentUser} onPointsAwarded={(pts)=>{
          if(!currentUser)return;
          const updated={...currentUser,points:(currentUser.points||0)+pts};
          setCurrentUser(updated);
          const users=loadUsers();
          const idx=users.findIndex(u=>u.id===currentUser.id);
          if(idx>=0){users[idx]=updated;saveUsers(users);}
          saveSession(updated);
        }}/>
      </section>

      {/* ── ORDER + STRIPE ── */}
      {/* ── TRUST SECTION ── */}
      <section style={{background:C.bg,padding:"3rem 1.5rem"}}>
        <div style={{maxWidth:860,margin:"0 auto"}}>
          {/* Trust points */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(190px,100%),1fr))",gap:"1rem",marginBottom:"2rem"}}>
            {[
              {emoji:"🍪",title:"Baked fresh to order",desc:"Every batch made when you order — never sitting on a shelf."},
              {emoji:"👨‍👩‍👧‍👦",title:"Small batch family recipe",desc:"Granny Frannie's original recipe, made in small batches with care."},
              {emoji:"📍",title:"Michigan-based",desc:"Proudly handmade in Michigan and delivered to our community."},
              {emoji:"❤️",title:"Made with love and real ingredients",desc:"No shortcuts. Real butter, real oats, real chocolate chips."},
            ].map((pt,i)=>(
              <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",padding:"1.4rem 1rem",background:C.w,borderRadius:16,boxShadow:"0 2px 12px rgba(13,31,92,0.06)",border:`1.5px solid ${C.bp}`}}>
                <span style={{fontSize:"1.8rem",marginBottom:"0.6rem"}}>{pt.emoji}</span>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"0.9rem",fontWeight:700,color:C.bd,marginBottom:"0.35rem",lineHeight:1.3}}>{pt.title}</div>
                <div style={{fontFamily:"'Lora',serif",fontSize:"0.78rem",color:C.ts,lineHeight:1.6}}>{pt.desc}</div>
              </div>
            ))}
          </div>
          {/* Fulfillment notice */}
          <p style={{fontFamily:"'Lora',serif",fontSize:"0.85rem",color:C.ts,textAlign:"center",lineHeight:1.75,maxWidth:640,margin:"0 auto",fontStyle:"italic"}}>
            Orders are baked in small batches. Pickup, local delivery, and shipping options may vary by availability and product type.
          </p>
        </div>
      </section>

      <section id="order" style={{background:C.bd,padding:"5rem 1.5rem",textAlign:"center"}}>
        <p style={{fontFamily:"'Caveat',cursive",fontSize:"1.05rem",color:C.g,letterSpacing:3,textTransform:"uppercase",marginBottom:"0.3rem"}}>Ready?</p>
        <h2 className="sec-title" style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.9rem,5vw,3rem)",fontWeight:700,textAlign:"center",color:"#fff",lineHeight:1.2,marginBottom:"0.7rem"}}>Checkout &amp; <em style={{fontStyle:"italic",color:C.g}}>Pay Securely</em></h2>
        <p style={{fontFamily:"'Lora',serif",fontSize:"1rem",color:"rgba(255,255,255,0.48)",textAlign:"center",maxWidth:500,margin:"0 auto 2rem",lineHeight:1.7}}>Add items to your cart above, fill in your details, then pay securely via Stripe.</p>

        {payStatus==="success"&&<div style={{background:"rgba(22,163,74,0.15)",border:"1.5px solid rgba(22,163,74,0.4)",borderRadius:16,padding:"1.8rem",textAlign:"center",maxWidth:460,margin:"0 auto 2rem"}}>
          <div style={{fontSize:"2.8rem",marginBottom:"0.4rem"}}>✅</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",fontWeight:700,color:C.green,marginBottom:"0.3rem"}}>Payment Successful!</div>
          <div style={{fontFamily:"'Lora',serif",fontSize:"0.9rem",color:"rgba(255,255,255,0.55)",marginBottom:"0.7rem"}}>Thank you! We'll confirm your order within 24 hours.</div>
          {currentUser&&<div style={{fontFamily:"'Caveat',cursive",fontSize:"1.1rem",color:"#E8B84B"}}>⭐ Points added to your account!</div>}
          {!currentUser&&<button onClick={()=>setAuthOpen(true)} style={{background:"#E8B84B",color:"#0D1F5C",fontFamily:"'Caveat',cursive",fontSize:"1rem",fontWeight:700,padding:"0.55rem 1.4rem",borderRadius:50,border:"none",cursor:"pointer",marginTop:"0.5rem"}}>Create account to track your order & earn points →</button>}
        </div>}
        {payStatus==="cancelled"&&<div style={{background:"rgba(232,184,75,0.12)",border:"1.5px solid rgba(232,184,75,0.35)",borderRadius:16,padding:"1.5rem",textAlign:"center",maxWidth:460,margin:"0 auto 2rem"}}><div style={{fontSize:"1.8rem",marginBottom:"0.3rem"}}>↩️</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.15rem",fontWeight:700,color:C.g,marginBottom:"0.3rem"}}>Payment Cancelled</div><div style={{fontFamily:"'Lora',serif",fontSize:"0.88rem",color:"rgba(255,255,255,0.5)"}}>No worries — your cart is still here whenever you're ready.</div></div>}

        <div style={{maxWidth:500,margin:"0 auto",display:"flex",flexDirection:"column",gap:"0.85rem"}}>
          {currentUser&&<div style={{background:"rgba(74,222,128,0.08)",border:"1px solid rgba(74,222,128,0.25)",borderRadius:10,padding:"0.5rem 0.85rem",textAlign:"left",marginBottom:"0.1rem"}}>
            <p style={{fontFamily:"'Lora',serif",fontSize:"0.78rem",color:"#6ee7b7",margin:0}}>✓ Contact info loaded from your profile</p>
          </div>}
          <div style={{background:"rgba(232,184,75,0.1)",border:"1.5px solid rgba(232,184,75,0.3)",borderRadius:12,padding:"0.7rem 1rem",textAlign:"left"}}>
            <p style={{fontFamily:"'Lora',serif",fontSize:"0.82rem",color:C.gl,lineHeight:1.6,margin:0}}>📦 <strong>Michigan only</strong> — pickup, local delivery, and Michigan-only shipping. Michigan law requires direct interaction before sale for shipped orders.</p>
          </div>
          <div className="form-row-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.85rem"}}>
            <div style={{display:"flex",flexDirection:"column",gap:"0.3rem",textAlign:"left"}}>
              <label style={{fontFamily:"'Lora',serif",fontSize:"0.76rem",letterSpacing:"1.5px",textTransform:"uppercase",color:"rgba(255,255,255,0.5)"}}>Your Name</label>
              <input style={{background:"rgba(255,255,255,0.08)",border:"1.5px solid rgba(255,255,255,0.2)",color:"#fff",fontFamily:"'Lora',serif",fontSize:"0.95rem",padding:"0.65rem 0.95rem",borderRadius:10,outline:"none"}} placeholder="Frannie" value={orderForm.name} onChange={e=>setOrderForm({...orderForm,name:e.target.value})}/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"0.3rem",textAlign:"left"}}>
              <label style={{fontFamily:"'Lora',serif",fontSize:"0.76rem",letterSpacing:"1.5px",textTransform:"uppercase",color:"rgba(255,255,255,0.5)"}}>Phone</label>
              <input style={{background:"rgba(255,255,255,0.08)",border:"1.5px solid rgba(255,255,255,0.2)",color:"#fff",fontFamily:"'Lora',serif",fontSize:"0.95rem",padding:"0.65rem 0.95rem",borderRadius:10,outline:"none"}} placeholder="(555) 000-0000" value={orderForm.phone} onChange={e=>setOrderForm({...orderForm,phone:e.target.value})}/>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"0.3rem",textAlign:"left"}}>
            <label style={{fontFamily:"'Lora',serif",fontSize:"0.76rem",letterSpacing:"1.5px",textTransform:"uppercase",color:"rgba(255,255,255,0.5)"}}>Email (for receipt)</label>
            <input type="email" style={{background:"rgba(255,255,255,0.08)",border:"1.5px solid rgba(255,255,255,0.2)",color:"#fff",fontFamily:"'Lora',serif",fontSize:"0.95rem",padding:"0.65rem 0.95rem",borderRadius:10,outline:"none"}} placeholder="you@email.com" value={orderForm.email} onChange={e=>setOrderForm({...orderForm,email:e.target.value})}/>
          </div>
          <div className="form-row-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.85rem"}}>
            <div style={{display:"flex",flexDirection:"column",gap:"0.3rem",textAlign:"left"}}>
              <label style={{fontFamily:"'Lora',serif",fontSize:"0.76rem",letterSpacing:"1.5px",textTransform:"uppercase",color:"rgba(255,255,255,0.5)"}}>Pickup or Delivery?</label>
              <select style={{background:"rgba(20,20,60,0.95)",border:"1.5px solid rgba(255,255,255,0.2)",color:"#fff",fontFamily:"'Lora',serif",fontSize:"0.95rem",padding:"0.65rem 0.95rem",borderRadius:10,outline:"none"}} value={orderForm.delivery} onChange={e=>{
                const v=e.target.value;
                setOrderForm({...orderForm,delivery:v});
                setShippingFee(0);setShippingLabel("");setShippingMsg("");setDeliveryZip("");
                if(v==="Michigan Shipping"){
                  setShippingLoading(true);
                  fetch("/api/shipping",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"shipping",cart})})
                    .then(r=>r.json()).then(d=>{if(d.fee){setShippingFee(d.fee);setShippingLabel(d.label);setShippingMsg(`📦 ${d.label} — $${d.fee.toFixed(2)}`);}}).finally(()=>setShippingLoading(false));
                }
              }}>
                <option value="">Select…</option><option>Pickup</option><option>Local Delivery</option><option>Michigan Shipping</option>
              </select>
              {/* Zip code for delivery fee */}
              {orderForm.delivery==="Local Delivery"&&(
                <div style={{marginTop:"0.5rem"}}>
                  <input placeholder="Your zip code" maxLength={5} value={deliveryZip} onChange={e=>{
                    const z=e.target.value.replace(/\D/g,"");
                    setDeliveryZip(z);
                    setShippingFee(0);setShippingLabel("");setShippingMsg("");
                    if(z.length===5){
                      setShippingLoading(true);
                      fetch("/api/shipping",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"delivery",zip:z,cart})})
                        .then(r=>r.json()).then(d=>{
                          if(d.fee){setShippingFee(d.fee);setShippingLabel(d.label);setShippingMsg(`🚚 ${d.label} — $${d.fee.toFixed(2)}`);}
                          else if(d.error){setShippingMsg(`⚠️ ${d.error}`);}
                        }).finally(()=>setShippingLoading(false));
                    }
                  }} style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"1.5px solid rgba(255,255,255,0.2)",color:"#fff",fontFamily:"'Lora',serif",fontSize:"0.95rem",padding:"0.55rem 0.95rem",borderRadius:10,outline:"none"}}/>
                </div>
              )}
              {shippingLoading&&<div style={{fontFamily:"'Lora',serif",fontSize:"0.78rem",color:"rgba(255,255,255,0.5)",marginTop:"0.35rem"}}>Calculating…</div>}
              {shippingMsg&&!shippingLoading&&<div style={{fontFamily:"'Lora',serif",fontSize:"0.78rem",color:shippingFee>0?"#6ee7b7":"#fca5a5",marginTop:"0.35rem"}}>{shippingMsg}</div>}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"0.3rem",textAlign:"left"}}>
              <label style={{fontFamily:"'Lora',serif",fontSize:"0.76rem",letterSpacing:"1.5px",textTransform:"uppercase",color:"rgba(255,255,255,0.5)"}}>Special Requests</label>
              <input style={{background:"rgba(255,255,255,0.08)",border:"1.5px solid rgba(255,255,255,0.2)",color:"#fff",fontFamily:"'Lora',serif",fontSize:"0.95rem",padding:"0.65rem 0.95rem",borderRadius:10,outline:"none"}} placeholder="Allergies, notes…" value={orderForm.notes} onChange={e=>setOrderForm({...orderForm,notes:e.target.value})}/>
            </div>
          </div>

          {/* Cart summary */}
          {cart.length>0?(
            <div style={{background:"rgba(255,255,255,0.07)",borderRadius:14,padding:"1rem 1.15rem",textAlign:"left",border:"1px solid rgba(255,255,255,0.12)"}}>
              <div style={{fontFamily:"'Caveat',cursive",fontSize:"1rem",color:C.gl,marginBottom:"0.55rem"}}>🛒 Your order:</div>
              {cart.map(c=><div key={c.id} style={{fontFamily:"'Lora',serif",fontSize:"0.87rem",color:"rgba(255,255,255,0.62)",marginBottom:"0.2rem",display:"flex",justifyContent:"space-between"}}><span>{c.emoji} {c.name} ×{c.qty}</span><span>${c.price*c.qty}</span></div>)}
              <div style={{fontFamily:"'Playfair Display',serif",fontWeight:900,color:C.g,marginTop:"0.65rem",fontSize:"1.1rem",display:"flex",justifyContent:"space-between",borderTop:"1px solid rgba(255,255,255,0.12)",paddingTop:"0.55rem"}}><span>Total</span><span>${cartTotal}</span></div>
            </div>
          ):(
            <div style={{background:"rgba(255,255,255,0.06)",borderRadius:14,padding:"1.6rem",textAlign:"center",border:"1px solid rgba(255,255,255,0.1)",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.6rem"}}>
              <span style={{fontSize:"2.2rem"}}>🍪</span>
              <p style={{fontFamily:"'Playfair Display',serif",fontSize:"0.95rem",color:"rgba(255,255,255,0.65)",margin:0}}>No cookies yet.</p>
              <p style={{fontFamily:"'Lora',serif",fontSize:"0.82rem",color:"rgba(255,255,255,0.35)",fontStyle:"italic",margin:0}}>Add something from the menu above.</p>
              <button onClick={()=>scrollTo("menu")} style={{background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.2)",color:"rgba(255,255,255,0.7)",fontFamily:"'Caveat',cursive",fontSize:"0.9rem",fontWeight:600,padding:"0.45rem 1.2rem",borderRadius:50,cursor:"pointer",marginTop:"0.2rem"}}>Browse the Menu 🍪</button>
            </div>
          )}

          {/* Points preview for logged in users */}
          {currentUser && cart.length>0 && (
            <div style={{background:"rgba(232,184,75,0.1)",border:"1.5px solid rgba(232,184,75,0.25)",borderRadius:12,padding:"0.8rem 1rem",display:"flex",alignItems:"center",gap:"0.7rem"}}>
              <span style={{fontSize:"1.4rem"}}>⭐</span>
              <div>
                <div style={{fontFamily:"'Caveat',cursive",fontSize:"1rem",fontWeight:700,color:"#E8B84B"}}>You'll earn {Math.round(cartTotal*POINTS_PER_DOLLAR)} points on this order!</div>
                <div style={{fontFamily:"'Lora',serif",fontSize:"0.78rem",color:"rgba(255,255,255,0.45)"}}>Your balance after: {currentUser.points + Math.round(cartTotal*POINTS_PER_DOLLAR)} pts · {getTier(currentUser.points+Math.round(cartTotal*POINTS_PER_DOLLAR)).name}</div>
              </div>
            </div>
          )}
          {!currentUser && cart.length>0 && (
            <div style={{background:"rgba(79,116,227,0.1)",border:"1.5px solid rgba(79,116,227,0.25)",borderRadius:12,padding:"0.8rem 1rem",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.7rem"}}>
              <div style={{fontFamily:"'Lora',serif",fontSize:"0.85rem",color:"rgba(255,255,255,0.6)"}}>🍪 <strong style={{color:"#fff"}}>Sign in to earn {Math.round(cartTotal*POINTS_PER_DOLLAR)} points</strong> on this order!</div>
              <button onClick={()=>setAuthOpen(true)} style={{background:"#E8B84B",color:"#0D1F5C",fontFamily:"'Caveat',cursive",fontSize:"0.9rem",fontWeight:700,padding:"0.35rem 0.9rem",borderRadius:20,border:"none",cursor:"pointer",whiteSpace:"nowrap"}}>Sign In</button>
            </div>
          )}
          {stripeError&&<div style={{background:"rgba(220,38,38,0.17)",border:"1.5px solid rgba(220,38,38,0.38)",borderRadius:10,padding:"0.7rem 0.95rem",fontFamily:"'Lora',serif",fontSize:"0.88rem",color:"#ff8a80",textAlign:"left"}}>⚠️ {stripeError}</div>}

          <button disabled={stripeLoading||cart.length===0} onClick={handleCheckout} style={{background:C.g,color:C.bd,fontFamily:"'Caveat',cursive",fontSize:"1.35rem",fontWeight:700,padding:"1rem 2rem",borderRadius:50,border:"none",cursor:stripeLoading||cart.length===0?"not-allowed":"pointer",opacity:stripeLoading||cart.length===0?0.6:1,boxShadow:"0 6px 24px rgba(232,184,75,0.35)",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.6rem",width:"100%",marginTop:"0.3rem"}}>
            {stripeLoading?<><Spinner/> Connecting to Stripe…</>:<>💳 Pay ${cartTotal+shippingFee} Securely with Stripe{shippingFee>0&&<span style={{fontSize:"0.85rem",fontWeight:400,opacity:0.8}}> (incl. ${shippingFee.toFixed(2)} {orderForm.delivery==="Michigan Shipping"?"shipping":"delivery"})</span>}</>}
          </button>
          <div style={{fontFamily:"'Lora',serif",fontSize:"0.8rem",color:"rgba(255,255,255,0.38)",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.4rem"}}>🔒 Payments processed securely by <strong style={{color:"rgba(255,255,255,0.55)"}}>Stripe</strong>. We never see your card details.</div>
          {cart.length===0&&<button onClick={()=>scrollTo("menu")} style={{background:"transparent",color:C.g,fontFamily:"'Caveat',cursive",fontSize:"1.1rem",fontWeight:700,padding:"0.7rem",borderRadius:50,border:`2px solid ${C.g}`,cursor:"pointer",marginTop:"0.2rem"}}>Browse the Menu →</button>}
        </div>
      </section>

      {/* ── PASSPORT ACCOUNT CARD ── */}
      {hasSupabaseConfig&&(
        <section style={{background:C.bg,padding:"2.5rem 1.5rem"}}>
          <div style={{maxWidth:560,margin:"0 auto"}}>
            <UniversalLogin onAuthChange={u=>setSupabaseUser(u)}/>
            {!supabaseUser&&(
              <p style={{fontFamily:"'Lora',serif",fontSize:"0.8rem",color:C.ts,textAlign:"center",marginTop:"0.7rem",lineHeight:1.6,fontStyle:"italic"}}>
                One login connects your Granny Frannie's rewards with the full Ridiculous Passport.
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      <section style={{background:C.w,padding:"5rem 1.5rem"}}>
        <div style={{maxWidth:720,margin:"0 auto"}}>
          <p style={{fontFamily:"'Caveat',cursive",fontSize:"1.05rem",color:C.bm,letterSpacing:3,textTransform:"uppercase",textAlign:"center",marginBottom:"0.4rem"}}>Got Questions?</p>
          <h2 className="sec-title" style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.7rem,5vw,2.6rem)",fontWeight:700,textAlign:"center",color:C.bd,lineHeight:1.2,marginBottom:"2.5rem"}}>
            Frequently Asked <em style={{fontStyle:"italic",color:C.bm}}>Questions</em>
          </h2>
          {[
            {q:"Are these made in a home kitchen?",a:"Yes. Our cottage food cookies are made in a home kitchen not inspected by the Michigan Department of Agriculture & Rural Development."},
            {q:"Do you offer gluten-free cookies?",a:"Gluten-free options are planned, but they are not produced in a certified gluten-free kitchen."},
            {q:"When will ice cream sandwiches be available?",a:"They are coming soon pending licensed commercial production."},
            {q:"Can I order for events or gifts?",a:"Yes. Use the contact form or Cookie Club signup to ask about custom orders, gifts, and events."},
            {q:"Where are you located?",a:"Granny Frannie's is based in Michigan."},
          ].map((item,i)=>{
            const open = faqOpen===i;
            return (
              <div key={i} style={{borderBottom:`1px solid ${C.bp}`}}>
                <button onClick={()=>setFaqOpen(open?null:i)} style={{width:"100%",background:"none",border:"none",cursor:"pointer",padding:"1.3rem 0",display:"flex",gap:"1rem",alignItems:"center",textAlign:"left"}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:open?C.g:C.bd,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background 0.2s"}}>
                    <span style={{fontFamily:"'Caveat',cursive",fontSize:"0.85rem",fontWeight:700,color:open?C.bd:"#fff"}}>{i+1}</span>
                  </div>
                  <span style={{fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontWeight:700,color:C.bd,flex:1,lineHeight:1.4}}>{item.q}</span>
                  <span style={{color:C.bm,fontSize:"1.1rem",flexShrink:0,transition:"transform 0.2s",transform:open?"rotate(180deg)":"none"}}>▼</span>
                </button>
                {open&&<div style={{paddingBottom:"1.2rem",paddingLeft:"2.5rem"}}>
                  <p style={{fontFamily:"'Lora',serif",fontSize:"0.92rem",color:C.ts,lineHeight:1.75,margin:0}}>{item.a}</p>
                </div>}
              </div>
            );
          })}
          <div style={{textAlign:"center",marginTop:"2rem"}}>
            <a href="/faq" style={{fontFamily:"'Caveat',cursive",fontSize:"1rem",color:C.bm,textDecoration:"none",borderBottom:`1.5px solid ${C.bp}`}}>See all FAQs →</a>
          </div>
        </div>
      </section>

      {/* ── COOKIE CLUB ── */}
      <section style={{background:`linear-gradient(135deg,${C.br},${C.bd})`,padding:"5rem 1.5rem"}}>
        <div style={{maxWidth:560,margin:"0 auto"}}>
          {currentUser ? (
            <div style={{textAlign:"center",padding:"1rem 0"}}>
              <div style={{fontSize:"2.5rem",marginBottom:"0.6rem"}}>🍪</div>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.4rem,4vw,2rem)",fontWeight:700,color:"#fff",marginBottom:"0.4rem"}}>You're already in the Cookie Club!</h2>
              <p style={{fontFamily:"'Lora',serif",fontSize:"0.95rem",color:"rgba(255,255,255,0.65)",lineHeight:1.75}}>We'll send you first access to drops, seasonal flavors, and ice cream sandwich launches.</p>
            </div>
          ) : emailSent ? (
            <div style={{textAlign:"center",padding:"2rem 0"}}>
              <div style={{fontSize:"3rem",marginBottom:"0.75rem"}}>🎉</div>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.6rem,4vw,2.2rem)",fontWeight:700,color:"#fff",marginBottom:"0.5rem"}}>You're in, {clubName||"friend"}!</h2>
              <p style={{fontFamily:"'Lora',serif",fontSize:"1rem",color:"rgba(255,255,255,0.7)",lineHeight:1.75}}>We'll reach out with first access before anything goes public. Welcome to the club.</p>
            </div>
          ) : <>
            {/* Left-aligned on desktop, centered on mobile */}
            <p style={{fontFamily:"'Caveat',cursive",fontSize:"1rem",color:C.gl,letterSpacing:3,textTransform:"uppercase",marginBottom:"0.5rem",textAlign:"center"}}>Members only</p>
            <h2 className="sec-title" style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.8rem,5vw,2.8rem)",fontWeight:700,color:"#fff",marginBottom:"0.8rem",lineHeight:1.2,textAlign:"center"}}>
              Join the <em style={{fontStyle:"italic",color:C.g}}>Cookie Club</em>
            </h2>
            <p style={{fontFamily:"'Lora',serif",fontSize:"1.05rem",color:"rgba(255,255,255,0.75)",lineHeight:1.8,marginBottom:"0.75rem",textAlign:"center"}}>
              Get first access to fresh cookie drops, ice cream sandwich launches, seasonal flavors, and special offers.
            </p>
            {/* Incentive badge */}
            <div style={{display:"flex",justifyContent:"center",marginBottom:"2rem"}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",background:"rgba(232,184,75,0.12)",border:"1.5px solid rgba(232,184,75,0.3)",borderRadius:50,padding:"0.45rem 1.1rem"}}>
                <span style={{fontSize:"1rem"}}>⭐</span>
                <span style={{fontFamily:"'Lora',serif",fontSize:"0.85rem",color:C.gl,fontStyle:"italic"}}>Members get early access before products sell out.</span>
              </div>
            </div>
            {/* Form */}
            <div style={{display:"flex",flexDirection:"column",gap:"0.75rem",maxWidth:420,margin:"0 auto"}}>
              <input
                type="text"
                placeholder="Your first name"
                value={clubName}
                onChange={e=>setClubName(e.target.value)}
                style={{width:"100%",padding:"0.85rem 1.2rem",borderRadius:50,border:"2px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.08)",color:"#fff",fontFamily:"'Lora',serif",fontSize:"0.95rem",outline:"none",boxSizing:"border-box"}}
              />
              <input
                type="email"
                placeholder="Your email address"
                value={emailVal}
                onChange={e=>setEmailVal(e.target.value)}
                style={{width:"100%",padding:"0.85rem 1.2rem",borderRadius:50,border:"2px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.08)",color:"#fff",fontFamily:"'Lora',serif",fontSize:"0.95rem",outline:"none",boxSizing:"border-box"}}
              />
              <button
                onClick={()=>{
                  if(!emailVal)return;
                  if(!clubList.some(e=>e.email===emailVal)){
                    setClubList(prev=>[...prev,{email:emailVal,name:clubName,date:new Date().toLocaleDateString(),source:"cookie-club"}]);
                  }
                  fetch("/api/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:emailVal,source:"cookie-club",name:clubName})}).catch(()=>{});
                  setEmailSent(true);
                  setEmailVal("");
                }}
                style={{background:C.g,color:C.bd,fontFamily:"'Caveat',cursive",fontSize:"1.2rem",fontWeight:700,padding:"0.9rem",borderRadius:50,border:"none",cursor:"pointer",width:"100%",boxShadow:"0 4px 20px rgba(232,184,75,0.3)",letterSpacing:"0.5px"}}
              >
                Save My Spot →
              </button>
            </div>
            <p style={{fontFamily:"'Lora',serif",fontSize:"0.8rem",color:"rgba(255,255,255,0.35)",marginTop:"0.85rem",textAlign:"center",fontStyle:"italic"}}>No spam. Unsubscribe anytime.</p>
          </>}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{background:C.bd,color:"#fff",padding:"4rem 1.5rem 2rem"}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>

          {/* Top: logo + brand description */}
          <div style={{display:"grid",gridTemplateColumns:"1fr",gap:"2.5rem",marginBottom:"3rem",textAlign:"center"}}>
            <div>
              <div style={{display:"flex",justifyContent:"center",marginBottom:"1rem"}}>
                <img src={LOGO} alt="Granny Frannie's Cookies" style={{height:72,width:"auto",opacity:0.95,objectFit:"contain"}}/>
              </div>
              <p style={{fontFamily:"'Playfair Display',serif",fontSize:"1.05rem",fontWeight:700,color:"#fff",marginBottom:"0.25rem"}}>Granny Frannie's Cookies</p>
              <p style={{fontFamily:"'Lora',serif",fontSize:"0.85rem",color:"rgba(255,255,255,0.5)",marginBottom:"0.9rem",fontStyle:"italic"}}>Michigan-based small batch bakery</p>
              {/* Email contact — social URLs pending; add Instagram/Facebook/TikTok when ready */}
              <div style={{display:"flex",gap:"0.7rem",justifyContent:"center",marginBottom:"1rem"}}>
                <a href="mailto:claude@grannyfrannies.com"
                  aria-label="Email Granny Frannie's"
                  style={{width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"1.5px solid rgba(255,255,255,0.14)",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",textDecoration:"none"}}>
                  ✉️
                </a>
              </div>
              <a href="mailto:claude@grannyfrannies.com" style={{fontFamily:"'Lora',serif",fontSize:"0.85rem",color:"rgba(255,255,255,0.5)",textDecoration:"none",letterSpacing:"0.3px"}}>claude@grannyfrannies.com</a>
            </div>
          </div>

          {/* Mid: nav links in two rows */}
          <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:"2rem",marginBottom:"2rem"}}>
            <div style={{display:"flex",gap:"1.2rem",justifyContent:"center",flexWrap:"wrap",marginBottom:"0.8rem"}}>
              {[["Menu","menu"],["Gallery","gallery"],["Catering","catering"],["Order","order"],["Reviews","love"]].map(([l,id])=>(
                <button key={id} onClick={()=>scrollTo(id)} style={{color:"rgba(255,255,255,0.5)",fontSize:"0.78rem",letterSpacing:"1.5px",textTransform:"uppercase",background:"none",border:"none",cursor:"pointer",fontFamily:"'Lora',serif"}}>
                  {l}
                </button>
              ))}
            </div>
            <div style={{display:"flex",gap:"1.2rem",justifyContent:"center",flexWrap:"wrap"}}>
              {[["/about","About"],["/faq","FAQ"],["/legal","Legal"],["/contact","Contact"],["/wholesale-coming-soon","Wholesale"]].map(([href,label])=>(
                <a key={href} href={href} style={{color:"rgba(255,255,255,0.35)",fontSize:"0.72rem",letterSpacing:"1.5px",textTransform:"uppercase",textDecoration:"none",fontFamily:"'Lora',serif"}}>{label}</a>
              ))}
              <button onClick={()=>setEmailPopup(true)} style={{color:C.g,fontSize:"0.72rem",letterSpacing:"1.5px",textTransform:"uppercase",background:"none",border:"none",cursor:"pointer",fontFamily:"'Lora',serif"}}>Cookie Club ✦</button>
            </div>
          </div>

          {/* TODO-CANDYMAN (Part 1.3): Add cross-ecosystem footer section here once canonical
               rewards program name is confirmed. Should link to claudecard.pro and the other
               three sites with identical language across all four footers. */}

          {/* Bottom: tagline + stripe + cottage food disclaimer + copyright */}
          <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:"1.5rem",textAlign:"center"}}>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontStyle:"italic",color:"rgba(255,255,255,0.45)",marginBottom:"1rem",letterSpacing:"0.5px"}}>
              "Baked in love. Shared in legacy."
            </p>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"0.4rem",fontFamily:"'Lora',serif",fontSize:"0.75rem",color:"rgba(255,255,255,0.25)",marginBottom:"1rem"}}>🔒 Secure payments by Stripe</div>
            <p style={{fontFamily:"'Lora',serif",fontSize:"0.7rem",color:"rgba(255,255,255,0.22)",lineHeight:1.8,fontStyle:"italic",maxWidth:620,margin:"0 auto 1rem"}}>
              Made in a home kitchen not inspected by the Michigan Department of Agriculture and Rural Development. Michigan requires cottage foods to be labeled and sold directly to consumers; internet/mail orders are allowed only within Michigan and with direct interaction before sale.
            </p>
            <p style={{fontFamily:"'Lora',serif",fontSize:"0.72rem",color:"rgba(255,255,255,0.18)"}}>
              © 2026 Granny Frannie's Cookies · All rights reserved · Michigan
            </p>
          </div>

        </div>
      </footer>

      {/* ── FLOATING CART BUTTON ── */}
      {cartCount>0&&(
        <div style={{position:"fixed",bottom:"1.5rem",left:"50%",transform:"translateX(-50%)",zIndex:490,animation:"fadeUp 0.3s ease"}}>
          <button onClick={()=>setCartOpen(true)} style={{display:"flex",alignItems:"center",gap:"0.65rem",background:C.bd,color:"#fff",fontFamily:"'Caveat',cursive",fontSize:"1.1rem",fontWeight:700,padding:"0.75rem 1.6rem",borderRadius:50,border:`2px solid ${C.g}`,cursor:"pointer",boxShadow:"0 8px 32px rgba(13,31,92,0.45)",whiteSpace:"nowrap"}}>
            <span style={{background:C.g,color:C.bd,borderRadius:"50%",width:24,height:24,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"0.78rem",fontWeight:900,flexShrink:0}}>{cartCount}</span>
            🛒 View Cart · <span style={{color:C.g}}>${cartTotal}</span>
          </button>
        </div>
      )}
    </div>
  );
}
