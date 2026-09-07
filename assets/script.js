
const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
$("#year").textContent=new Date().getFullYear();

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("on");io.unobserve(e.target)}}),{threshold:.1});
$$(".reveal").forEach(el=>io.observe(el));

const glow=$(".cursor-glow");
addEventListener("pointermove",e=>{if(glow){glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px"}});

// Showreel
const reelTitles=["DEVELON / HEAVY IMPACT","SOW / NIGHT EXPERIENCE","WELLA / PRODUCT DESIRE","NATURA / HUMAN CONNECTION"];
let reelIndex=0;
function setReel(n){
  const imgs=$$(".reel-img"); if(!imgs.length)return;
  reelIndex=(n+imgs.length)%imgs.length;
  imgs.forEach((im,i)=>im.classList.toggle("active",i===reelIndex));
  $("#reelCounter").textContent=String(reelIndex+1).padStart(2,"0")+" — "+String(imgs.length).padStart(2,"0");
  $("#reelTitle").textContent=reelTitles[reelIndex];
}
$("#reelNext")?.addEventListener("click",()=>setReel(reelIndex+1));
setInterval(()=>setReel(reelIndex+1),5000);

// Builder
const state={format:"Brand Launch",style:"Immersive",audience:"100–300",energy:82};
$$(".choice-group").forEach(group=>group.querySelectorAll(".choice").forEach(btn=>btn.addEventListener("click",()=>{
  group.querySelectorAll(".choice").forEach(b=>b.classList.remove("active"));btn.classList.add("active");
  state[group.dataset.key]=btn.textContent.trim();updateBuilder();
})));
$("#energy")?.addEventListener("input",e=>{state.energy=+e.target.value;updateBuilder()});
function builderBrief(){
  return `QUO EXPERIENCE BUILDER\nFormato: ${state.format}\nEstilo: ${state.style}\nAudiencia: ${state.audience}\nEnergía: ${state.energy}/100`;
}
function updateBuilder(){
  if(!$("#energyValue"))return;
  $("#energyValue").textContent=state.energy;
  $("#buildTitle").innerHTML=`${state.style.toUpperCase()}<br>${state.format.toUpperCase()}`;
  $("#buildMeta").textContent=`${state.audience} PEOPLE / ${state.energy>70?"MAXIMUM IMPACT":state.energy>35?"HIGH ENERGY":"CONTROLLED ENERGY"}`;
}
updateBuilder();

// Contact modal – visible, reliable, no dead buttons
const contact=$("#contactModal");
let modalExtra="";
function refreshBrief(){
  if(!contact)return;
  const name=$("#contactName").value.trim(), project=$("#contactProject").value.trim();
  const lines=[
    "Hola Marcelo,",
    "",
    "Quiero conversar sobre un próximo proyecto con QUO.",
    name?`Nombre / empresa: ${name}`:"",
    project?`Proyecto: ${project}`:"",
    modalExtra,
    "",
    "¿Cuándo podemos conversar?"
  ].filter((x,i,a)=>x!=="" || (i>0&&a[i-1]!==""));
  const brief=lines.join("\n");
  $("#briefPreview").textContent=brief;
  const su=encodeURIComponent("Nuevo proyecto — QUO");
  const body=encodeURIComponent(brief);
  $("#gmailBrief").href=`https://mail.google.com/mail/?view=cm&fs=1&to=marcelo@quo-io.com&su=${su}&body=${body}`;
}
function openContact(extra=""){
  modalExtra=extra;
  refreshBrief();
  if(contact?.showModal) contact.showModal();
}
$$(".js-open-contact").forEach(b=>b.addEventListener("click",()=>openContact()));
$("#sendBrief")?.addEventListener("click",()=>openContact("\n"+builderBrief()));
$("#contactName")?.addEventListener("input",refreshBrief);
$("#contactProject")?.addEventListener("input",refreshBrief);
$("[data-close]")?.addEventListener("click",()=>contact.close());
$("#copyBrief")?.addEventListener("click",async()=>{
  const text=$("#briefPreview").textContent;
  try{await navigator.clipboard.writeText(text);$("#copyBrief").textContent="COPIADO ✓";setTimeout(()=>$("#copyBrief").textContent="COPIAR BRIEF",1800)}
  catch{window.prompt("Copia este brief:",text)}
});
contact?.addEventListener("click",e=>{if(e.target===contact)contact.close()});

// Cases
const caseData={
  "DEVELON":"Gran escala, lenguaje industrial, iluminación y maquinaria convertidos en una puesta en escena con presencia real.",
  "WELLA":"Una activación donde producto, styling y visual merchandising trabajan juntos para construir deseo y contenido.",
  "NATURA":"Experiencia de marca orientada a interacción, demostración de producto y conexión directa con las personas.",
  "SOW":"Identidad transformada en espacio: luz, volumen, señalética y atmósfera para hacer que la marca domine el entorno."
};
const caseModal=$("#caseModal");
$$(".js-case").forEach(b=>b.addEventListener("click",()=>{$("#caseTitle").textContent=b.dataset.case;$("#caseText").textContent=caseData[b.dataset.case];caseModal.showModal()}));
$("[data-case-close]")?.addEventListener("click",()=>caseModal.close());
caseModal?.addEventListener("click",e=>{if(e.target===caseModal)caseModal.close()});
$(".from-case")?.addEventListener("click",()=>{caseModal.close();openContact("Referencia visual: "+$("#caseTitle").textContent)});

// Process progress
addEventListener("scroll",()=>{
  const t=$("#processTrack"),bar=$("#processProgress"); if(!t||!bar)return;
  const r=t.getBoundingClientRect(),pct=Math.max(0,Math.min(100,((innerHeight-r.top)/(innerHeight+r.height))*125));
  bar.style.width=pct+"%";
},{passive:true});

// Calendar
let calDate=new Date(),selected=null;
const months=["ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"];
function renderCal(){
  const box=$("#calendarDays");if(!box)return;box.innerHTML="";
  $("#monthLabel").textContent=`${months[calDate.getMonth()]} ${calDate.getFullYear()}`;
  const first=new Date(calDate.getFullYear(),calDate.getMonth(),1),last=new Date(calDate.getFullYear(),calDate.getMonth()+1,0);
  const offset=(first.getDay()+6)%7;
  for(let i=0;i<offset;i++){const b=document.createElement("button");b.className="blank";box.appendChild(b)}
  const today=new Date();today.setHours(0,0,0,0);
  for(let d=1;d<=last.getDate();d++){
    const date=new Date(calDate.getFullYear(),calDate.getMonth(),d),b=document.createElement("button");b.textContent=d;
    if(date<today)b.classList.add("past");
    if(selected&&date.toDateString()===selected.toDateString())b.classList.add("selected");
    b.addEventListener("click",()=>{selected=date;renderCal();const txt=date.toLocaleDateString("es-CL",{weekday:"long",day:"numeric",month:"long",year:"numeric"});$("#selectedDate").textContent=txt.toUpperCase()});
    box.appendChild(b);
  }
}
$("#prevMonth")?.addEventListener("click",()=>{calDate=new Date(calDate.getFullYear(),calDate.getMonth()-1,1);renderCal()});
$("#nextMonth")?.addEventListener("click",()=>{calDate=new Date(calDate.getFullYear(),calDate.getMonth()+1,1);renderCal()});
$("#bookProject")?.addEventListener("click",()=>{
  if(!selected){$("#selectedDate").textContent="PRIMERO SELECCIONA UNA FECHA";return}
  const txt=selected.toLocaleDateString("es-CL",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
  openContact(`\nBOOK THE LAB\nFecha tentativa: ${txt}`);
});
renderCal();

// ESC works naturally with dialog; fallback mail links remain in markup
