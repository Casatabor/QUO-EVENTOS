
const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

$("#year").textContent = new Date().getFullYear();

const io = new IntersectionObserver((entries)=>{
  entries.forEach((e)=>{
    if(e.isIntersecting){ e.target.classList.add("on"); io.unobserve(e.target); }
  });
},{threshold:.12});
$$(".reveal").forEach(el=>io.observe(el));

const glow = $(".cursor-glow");
window.addEventListener("pointermove",(e)=>{
  if(!glow) return;
  glow.style.left = e.clientX+"px";
  glow.style.top = e.clientY+"px";
});

const card = $(".tilt");
if(card){
  card.addEventListener("pointermove",(e)=>{
    const r = card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(900px) rotateX(${(-y*6).toFixed(2)}deg) rotateY(${(x*7).toFixed(2)}deg) rotateZ(2.5deg)`;
  });
  card.addEventListener("pointerleave",()=>card.style.transform="rotate(2.5deg)");
}

// QUO LIVE CLOCK
function updateQuoClock(){
  const el=document.getElementById("liveClock"); if(!el)return;
  const t=new Intl.DateTimeFormat("es-CL",{timeZone:"America/Santiago",hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date());
  el.textContent=`SANTIAGO — ${t}`;
}
updateQuoClock(); setInterval(updateQuoClock,30000);

// EXPERIENCE BUILDER
const state={format:"Brand Launch",style:"Immersive",audience:"100–300",energy:72};
document.querySelectorAll(".choice-group").forEach(group=>{
  group.querySelectorAll(".choice").forEach(btn=>btn.addEventListener("click",()=>{
    group.querySelectorAll(".choice").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active"); state[group.dataset.key]=btn.textContent.trim(); updateBuilder();
  }));
});
const energy=document.getElementById("energy");
if(energy) energy.addEventListener("input",()=>{state.energy=+energy.value;updateBuilder()});
function updateBuilder(){
  const ev=document.getElementById("energyValue"), title=document.getElementById("buildTitle"), meta=document.getElementById("buildMeta"), send=document.getElementById("sendBrief");
  if(!ev)return;
  ev.textContent=state.energy;
  title.innerHTML=`${state.style.toUpperCase()}<br>${state.format.toUpperCase()}`;
  meta.textContent=`${state.audience} PEOPLE / ${state.energy>70?"HIGH":state.energy>35?"MEDIUM":"LOW"} ENERGY`;
  const subject=encodeURIComponent(`QUO Project Brief — ${state.format}`);
  const body=encodeURIComponent(`Hola Marcelo,\n\nQuiero conversar sobre un proyecto.\n\nFormato: ${state.format}\nEstilo: ${state.style}\nAudiencia: ${state.audience}\nEnergía: ${state.energy}/100\n\nCuéntame cuándo podemos conversar.`);
  send.href=`mailto:marcelo@quo-io.com?subject=${subject}&body=${body}`;
}

// PROCESS SCROLL PROGRESS
window.addEventListener("scroll",()=>{
  const track=document.querySelector(".process-track"), bar=document.getElementById("processProgress"); if(!track||!bar)return;
  const r=track.getBoundingClientRect(), vh=innerHeight;
  const pct=Math.max(0,Math.min(100,((vh-r.top)/(vh+r.height))*125));
  bar.style.width=pct+"%";
},{passive:true});

// ARCHIVE FILTER
document.querySelectorAll(".archive-filters button").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".archive-filters button").forEach(b=>b.classList.remove("active")); btn.classList.add("active");
  const f=btn.dataset.filter;
  document.querySelectorAll(".archive-grid article").forEach(a=>a.classList.toggle("hide",f!=="all"&&a.dataset.cat!==f));
}));

// BOOK THE LAB CALENDAR
let calDate=new Date(), chosen=null;
const monthNames=["ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"];
function renderCalendar(){
  const box=document.getElementById("calendarDays"), label=document.getElementById("monthLabel"); if(!box)return;
  box.innerHTML=""; label.textContent=`${monthNames[calDate.getMonth()]} ${calDate.getFullYear()}`;
  const first=new Date(calDate.getFullYear(),calDate.getMonth(),1), last=new Date(calDate.getFullYear(),calDate.getMonth()+1,0);
  let offset=(first.getDay()+6)%7;
  for(let i=0;i<offset;i++){let b=document.createElement("button");b.className="blank";box.appendChild(b)}
  const today=new Date(); today.setHours(0,0,0,0);
  for(let d=1;d<=last.getDate();d++){
    const date=new Date(calDate.getFullYear(),calDate.getMonth(),d), b=document.createElement("button"); b.textContent=d;
    if(date<today)b.classList.add("past");
    if(chosen&&date.toDateString()===chosen.toDateString())b.classList.add("selected");
    b.onclick=()=>{chosen=date;renderCalendar();updateBooking()}; box.appendChild(b);
  }
}
function updateBooking(){
  if(!chosen)return;
  const text=chosen.toLocaleDateString("es-CL",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
  document.getElementById("selectedDate").textContent=text.toUpperCase();
  const subject=encodeURIComponent("Book the Lab — QUO");
  const body=encodeURIComponent(`Hola Marcelo,\n\nMe gustaría agendar una conversación de 30 minutos para hablar de un próximo proyecto QUO.\n\nFecha tentativa: ${text}.\n\nQuedo atento/a a confirmar horario.`);
  document.getElementById("bookMail").href=`mailto:marcelo@quo-io.com?subject=${subject}&body=${body}`;
}
document.getElementById("prevMonth")?.addEventListener("click",()=>{calDate=new Date(calDate.getFullYear(),calDate.getMonth()-1,1);renderCalendar()});
document.getElementById("nextMonth")?.addEventListener("click",()=>{calDate=new Date(calDate.getFullYear(),calDate.getMonth()+1,1);renderCalendar()});
renderCalendar();
