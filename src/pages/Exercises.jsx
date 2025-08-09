import React from 'react';

const EXERCISES = [
  {
    key: 'truck_stop_walk',
    name: 'Truck Stop Walk',
    where: 'Rest area / lot perimeter',
    time: '10–20 min',
    tips: ['Easy pace → brisk', 'Posture tall, arms swing', 'Nasal breathing if possible'],
    media: '/images/truck_stop_walk.gif' // optional; leave null if none
  },
  {
    key: 'incline_pushup',
    name: 'Incline Push-Ups (bumper/bench)',
    where: 'Truck bumper / bench',
    time: '6–12 reps × 3',
    tips: ['Body straight', 'Lower 3s, press smooth', 'Hands higher = easier'],
    media: '/images/incline_pushup.gif'
  },
  {
    key: 'squat',
    name: 'Bodyweight Squats',
    where: 'Any flat spot',
    time: '8–15 reps × 3',
    tips: ['Hips back, knees forward ok', 'Heels down', 'Stand tall at top'],
    media: '/images/squat.gif'
  },
  {
    key: 'calf_raises',
    name: 'Calf Raises (step)',
    where: 'Trailer/curb step',
    time: '12–20 reps × 2',
    tips: ['Full range', 'Pause at top', 'Slow down'],
    media: '/images/calf_raise.gif'
  },
  {
    key: 'torso_twists',
    name: 'Torso Twists',
    where: 'Beside truck',
    time: '30–45s',
    tips: ['Relax shoulders', 'Gentle range', 'Breathe out as you twist'],
    media: '/images/torso_twist.gif'
  }
];

export default function Exercises() {
  return (
    <div style={{padding:16, maxWidth:960, margin:'0 auto', fontFamily:'system-ui, sans-serif'}}>
      <h1 style={{fontSize:24, fontWeight:700, marginBottom:8}}>Truckers Exercises</h1>
      <div style={{color:'#555', marginBottom:12}}>
        Short, no‑equipment moves you can do at rest stops, beside the truck, or at home.
      </div>
      <div style={{display:'grid', gap:12}}>
        {EXERCISES.map(ex => (
          <div key={ex.key} style={{border:'1px solid #e5e5e5', borderRadius:12, padding:12, background:'#fff'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:8}}>
              <div style={{fontWeight:700}}>{ex.name}</div>
              <div style={{fontSize:12, color:'#666'}}>{ex.time}</div>
            </div>
            {ex.media ? (
              <img src={ex.media} alt={ex.name} style={{width:'100%', maxWidth:320, display:'block', marginTop:8}} />
            ) : null}
            <div style={{fontSize:13, color:'#444', marginTop:8}}>
              <b>Where:</b> {ex.where}
            </div>
            <ul style={{fontSize:13, color:'#444', marginTop:6, paddingLeft:18}}>
              {ex.tips.map((t,i)=>(<li key={i}>{t}</li>))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
