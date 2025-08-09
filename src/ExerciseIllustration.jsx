import React from 'react';

export default function ExerciseIllustration({ type, size = 120 }) {
  // Put any GIFs or images you’ve uploaded in /public/images and list them here.
  const GIFS = {
    incline_pushup: '/images/incline_pushup.gif',
    plank: '/images/PLANK.gif',          // matches your current filename
    dead_bug: '/images/dead_bug.gif',
    towel_row: '/images/towel%20rows.jpg' // or rename the file to towel_rows.jpg and use '/images/towel_rows.jpg'
  };

  // If a GIF/image exists for this move, use it; otherwise fall back to SVG below
  if (GIFS[type]) {
    return (
      <img
        src={GIFS[type]}
        alt={type.replaceAll('_', ' ')}
        style={{ width: '100%', maxWidth: 240, display: 'block' }}
      />
    );
  }

  // ---- SVG fallback (your original drawing) ----
  const w = 200, h = 120;
  const Ground = () => (<line x1="0" y1="100" x2="200" y2="100" stroke="#bdbdbd" strokeWidth="2"/>);
  const Bench  = () => (<rect x="120" y="70" width="60" height="12" rx="2" fill="#e5e5e5"/>);
  const Post   = () => (<line x1="160" y1="18" x2="160" y2="100" stroke="#9e9e9e" strokeWidth="6"/>);
  const Body   = (x1,y1,x2,y2) => (<line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#222" strokeWidth="6" strokeLinecap="round"/>);
  const Head   = (cx,cy)=> (<circle cx={cx} cy={cy} r="6" fill="#222"/>);
  const Limb   = (x1,y1,x2,y2)=> (<line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#222" strokeWidth="5" strokeLinecap="round"/>);
  const props = { viewBox: `0 0 ${w} ${h}`, width: "100%", height: size };

  switch(type){
    case "incline_pushup":
      return (<svg {...props}><Ground/><Bench/>{Body(60,80,120,60)}{Limb(60,80,40,100)}{Limb(80,80,60,100)}{Body(120,60,165,75)}{Head(170,78)}</svg>);
    case "towel_row":
      return (<svg {...props}><Ground/><Post/>{Body(100,80,60,60)}{Limb(100,80,120,100)}{Limb(85,80,105,100)}{Body(60,60,40,50)}<line x1="40" y1="50" x2="160" y2="50" stroke="#d32f2f" strokeWidth="3"/>{Head(35,48)}</svg>);
    case "plank":
      return (<svg {...props}><Ground/>{Body(40,80,160,80)}{Limb(140,80,160,100)}{Limb(120,80,140,100)}{Body(40,80,20,70)}{Head(15,68)}</svg>);
    case "dead_bug":
      return (<svg {...props}><Ground/>{Body(60,95,120,95)}{Head(130,92)}{Limb(80,95,80,60)}{Limb(100,95,100,70)}{Body(60,95,45,80)}{Body(60,95,45,100)}</svg>);
    case "sit_to_stand":
      return (<svg {...props}><Ground/><rect x="120" y="80" width="30" height="20" fill="#e5e5e5"/>{Body(80,80,100,70)}{Limb(80,80,80,100)}{Limb(95,80,95,100)}{Head(110,65)}</svg>);
    case "step_up":
      return (<svg {...props}><Ground/><rect x="120" y="85" width="35" height="15" fill="#e5e5e5"/>{Limb(135,85,135,60)}{Limb(150,100,150,85)}{Body(135,60,115,50)}{Head(110,48)}</svg>);
    case "hip_hinge":
      return (<svg {...props}><Ground/>{Limb(80,100,80,80)}{Limb(100,100,100,80)}{Body(80,80,120,70)}{Body(120,70,140,80)}{Head(145,82)}</svg>);
    case "calf_raise":
      return (<svg {...props}><line x1="0" y1="105" x2="200" y2="105" stroke="#bdbdbd" strokeWidth="2"/><rect x="80" y="95" width="40" height="10" fill="#e5e5e5"/>{Limb(90,95,90,70)}{Limb(110,95,110,70)}{Body(90,70,110,60)}{Head(115,58)}</svg>);
    case "single_leg_balance":
      return (<svg {...props}><Ground/>{Limb(100,100,100,70)}{Limb(100,85,120,75)}{Body(100,70,120,60)}{Head(125,58)}</svg>);
    default:
      return (<svg {...props}><Ground/><text x="10" y="30" fontSize="12" fill="#444">Easy pace circuit. Breathe steadily.</text></svg>);
  }
}
