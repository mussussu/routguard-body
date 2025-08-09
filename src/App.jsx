import React from 'react'
import ExerciseIllustration from './ExerciseIllustration.jsx'

const PLAN = [
  {
    name: "Upper + Core",
    warmup: ["Neck circles x5 each way","Arm swings x20","Scap wall slides x10","Tall march x20"],
    exercises: [
      { key: "incline_pushup", name: "Incline Push-Ups (truck step/bench)", tips: "Hands on step/bench. Body straight. Lower slow (3s).", target: "6–12 × 3" },
      { key: "towel_row", name: "Towel Rows (pole/rail)", tips: "Loop towel, lean back, pull to chest.", target: "8–12 × 3" },
      { key: "plank", name: "Plank", tips: "Glutes tight, ribs down. Don’t sag.", target: "20–40s × 3" },
      { key: "dead_bug", name: "Dead Bug", tips: "Lower back pressed down. Slow control.", target: "6–10/side × 2" },
    ],
    cooldown: ["Doorway chest stretch 30s/side","Cat-cow x8","Box breathing 4–5 min"],
  },
  {
    name: "Lower + Balance",
    warmup: ["Ankle rocks x20","Hip openers x10/side","Hamstring sweeps x10/side"],
    exercises: [
      { key: "sit_to_stand", name: "Sit-to-Stand (bench)", tips: "Tall chest, drive through heels.", target: "8–15 × 3" },
      { key: "step_up", name: "Step-Ups (curb/bench)", tips: "Knee over toes, full stand at top.", target: "8–12/side × 3" },
      { key: "hip_hinge", name: "Hip Hinge (Good Mornings)", tips: "Hips back, flat back.", target: "10–15 × 3" },
      { key: "calf_raise", name: "Calf Raises", tips: "Full range, slow tempo.", target: "12–20 × 2" },
      { key: "single_leg_balance", name: "Single-Leg Balance", tips: "Stand tall, eyes forward.", target: "20–40s/side × 2" },
    ],
    cooldown: ["Hip flexor stretch 30s/side","Hamstring stretch 30s/side","Nasal breathing 2–3 min"],
  },
  {
    name: "Full-Body Flow (Light)",
    warmup: ["Brisk walk 3–5 min","Arm circles x15","Leg swings x10/side"],
    exercises: [
      { key: "incline_pushup", name: "Incline Push-Ups", tips: "Smooth tempo.", target: "6–10" },
      { key: "sit_to_stand", name: "Bench Sit-to-Stand", tips: "Control the descent.", target: "10–15" },
      { key: "step_up", name: "Walking Lunges / Split Squats", tips: "Short steps, steady.", target: "8/side" },
      { key: "plank", name: "Plank", tips: "Steady breathing.", target: "20–30s" },
      { key: "single_leg_balance", name: "March in Place", tips: "Tall posture.", target: "30–45s" },
    ],
    cooldown: ["Long exhale breathing 3–4 min","Global stretch (reach, fold, twist) 1–2 min"],
  },
];

const STORAGE_KEY = "routeguard_body_logs_v1";

function useLocalStorage(key, initial){
  const [state, setState] = React.useState(()=>{
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : initial;
  });
  React.useEffect(()=>{ localStorage.setItem(key, JSON.stringify(state)); },[key,state]);
  return [state, setState];
}

const todayISO = () => new Date().toISOString().slice(0,10);
function nextIndex(i,len){ return (i+1)%len; }

export default function App(){
  const [dayIndex, setDayIndex] = useLocalStorage("rg_day_index", 0);
  const [logs, setLogs] = useLocalStorage(STORAGE_KEY, {});
  const [secondsLeft, setSecondsLeft] = useLocalStorage("rg_timer", 30*60);
  const [running, setRunning] = useLocalStorage("rg_running", false);

  const day = PLAN[dayIndex];
  const today = todayISO();

  React.useEffect(()=>{
    if(!running) return;
    const id = setInterval(()=> setSecondsLeft(s=> Math.max(0, s-1)), 1000);
    return ()=> clearInterval(id);
  },[running]);

  React.useEffect(()=>{ if(secondsLeft===0) setRunning(false); },[secondsLeft, setRunning]);

  function startSession(){
    if(!logs[today]) setLogs({ ...logs, [today]: { dayIndex, entries: [], started: Date.now(), durationSec: 0 } });
    setRunning(true);
  }
  function pauseResume(){ setRunning(!running); }
  function resetTimer(){ setRunning(false); setSecondsLeft(30*60); }

  function addEntry(exKey){
    const exercise = day.exercises.find(e=>e.key===exKey);
    const reps = prompt(`Log ${exercise?.name}: reps/seconds (e.g., 10 or 30s)`);
    if(!reps) return;
    const sets = Number(prompt("Sets (e.g., 3)")) || 1;
    const rpe  = Number(prompt("Effort 1–10 (RPE)")) || 7;
    const pain = window.confirm("Any pain? OK = Yes, Cancel = No");
    const notes = prompt("Notes (optional)") || "";
    const base = logs[today] || { dayIndex, entries: [], started: Date.now(), durationSec: 0 };
    const entries = [...base.entries, { key: exKey, reps, sets, rpe, pain, notes }];
    setLogs({ ...logs, [today]: { ...base, entries } });
  }

  function completeDay(){
    const base = logs[today] || { dayIndex, entries: [], started: Date.now(), durationSec: 0 };
    const durationSec = base.started ? Math.max(base.durationSec||0, Math.floor((Date.now()-base.started)/1000)) : (30*60 - secondsLeft);
    setLogs({ ...logs, [today]: { ...base, durationSec, finished: true } });
    setDayIndex(nextIndex(dayIndex, PLAN.length));
    setRunning(false); setSecondsLeft(30*60);
  }

  function exportCSV(){
    const rows = [["date","focus","exercise","reps","sets","rpe","pain","notes","duration_sec"]];
    Object.entries(logs).forEach(([date, log])=>{
      (log.entries||[]).forEach((e)=>{
        rows.push([date, PLAN[log.dayIndex]?.name || "", e.key, e.reps, e.sets, e.rpe, e.pain? "yes":"no", (e.notes||"").replace(/\n/g,' '), log.durationSec||0]);
      });
    });
    const csv = rows.map(r=>r.join(",")).join("\n");
    const blob = new Blob([csv], {type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'routeguard_body_logs.csv'; a.click(); URL.revokeObjectURL(url);
  }

  const todayLog = logs[today];
  const mm = String(Math.floor(secondsLeft/60)).padStart(2,'0');
  const ss = String(secondsLeft%60).padStart(2,'0');

  return (
    <div style={{fontFamily:'system-ui, sans-serif', padding:16, maxWidth:960, margin:'0 auto'}}>
      <h1 style={{fontSize:28, fontWeight:700, marginBottom:4}}>RouteGuard Body — 30-Minute Plan</h1>
      <div style={{color:'#555', marginBottom:12}}>English • Visual guides • Timer + logging • Local storage</div>

      <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:10}}>
        <button onClick={()=>setDayIndex((i)=> (i+PLAN.length-1)%PLAN.length)}>◀ Prev</button>
        <div style={{fontWeight:700}}>Focus: {day.name}</div>
        <button onClick={()=>setDayIndex((i)=> (i+1)%PLAN.length)}>Next ▶</button>
        <div style={{marginLeft:'auto', color:'#666'}}>Day {dayIndex+1} of {PLAN.length}</div>
      </div>

      <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:16}}>
        <button onClick={startSession} style={{padding:'8px 12px'}}>Start</button>
        <button onClick={pauseResume} style={{padding:'8px 12px'}}>{running? 'Pause' : 'Resume'}</button>
        <button onClick={resetTimer} style={{padding:'8px 12px'}}>Reset</button>
        <div style={{marginLeft:'auto', fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize:22}}>{mm}:{ss}</div>
      </div>

      <section style={{marginBottom:12}}>
        <h2 style={{fontSize:18, fontWeight:700}}>Warm-Up (≈5 min)</h2>
        <ul style={{marginTop:6, color:'#333'}}>
          {day.warmup.map((w,i)=>(<li key={i}>{w}</li>))}
        </ul>
      </section>

      <section style={{marginBottom:12}}>
        <h2 style={{fontSize:18, fontWeight:700}}>Strength (≈20 min)</h2>
        <div style={{display:'grid', gap:12}}>
          {day.exercises.map((ex)=> (
            <div key={ex.key} style={{border:'1px solid #e5e5e5', borderRadius:12, padding:12, background:'#fff'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:8}}>
                <div style={{fontWeight:600}}>{ex.name}</div>
                <details>
                  <summary style={{cursor:'pointer'}}>Form Guide</summary>
                  <div style={{paddingTop:8}}>
                    <ExerciseIllustration type={ex.key} size={200} />
                  </div>
                </details>
              </div>
              <div style={{paddingTop:8}}>
                <ExerciseIllustration type={ex.key} />
              </div>
              <div style={{fontSize:14, color:'#555', marginTop:6}}>Target: {ex.target} • {ex.tips}</div>
              <div style={{marginTop:8}}>
                <button onClick={()=>addEntry(ex.key)} style={{padding:'6px 10px'}}>Log Set</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{marginBottom:12}}>
        <h2 style={{fontSize:18, fontWeight:700}}>Cooldown (≈5 min)</h2>
        <ul style={{marginTop:6, color:'#333'}}>
          {day.cooldown.map((c,i)=>(<li key={i}>{c}</li>))}
        </ul>
      </section>

      <section style={{borderTop:'1px solid #eee', paddingTop:12}}>
        <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:8}}>
          <h3 style={{fontSize:16, fontWeight:700, margin:0}}>Today’s Log</h3>
          <div style={{marginLeft:'auto'}}>
            <button onClick={exportCSV} style={{padding:'6px 10px'}}>Export CSV</button>
          </div>
        </div>
        {!todayLog && <div style={{color:'#666'}}>No entries yet. Hit <b>Start</b> and log sets as you go.</div>}
        {todayLog?.entries?.length>0 && (
          <div style={{display:'grid', gap:8}}>
            {todayLog.entries.map((e, i) => (
              <div key={i} style={{border:'1px solid #eee', borderRadius:8, padding:8, fontSize:14}}>
                <div style={{fontWeight:600}}>{e.key}</div>
                <div>Reps: {e.reps} • Sets: {e.sets} • RPE: {e.rpe} • Pain: {e.pain? 'yes':'no'}</div>
                {e.notes && <div style={{color:'#555'}}>Notes: {e.notes}</div>}
              </div>
            ))}
          </div>
        )}
        <div style={{marginTop:10}}>
          <button onClick={completeDay} disabled={!todayLog} style={{padding:'8px 12px'}}>Complete Day</button>
        </div>
      </section>
    </div>
  )
}
