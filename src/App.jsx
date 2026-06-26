import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const firebaseConfig = {
  apiKey: "AIzaSyDArbULmEmjJrA0iYWbPmPn8WXqVZ71RDE",
  authDomain: "binda-comite.firebaseapp.com",
  projectId: "binda-comite",
  storageBucket: "binda-comite.firebasestorage.app",
  messagingSenderId: "1097165244983",
  appId: "1:1097165244983:web:07b571ca4b6c2f06f94db2"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

async function guardar(docId, data) {
  try { await setDoc(doc(db, "binda", docId), data); } catch(e) { console.error(e); }
}
async function cargar(docId) {
  try { const s = await getDoc(doc(db, "binda", docId)); if(s.exists()) return s.data(); } catch(e) {}
  return null;
}

// ─── COLORES ──────────────────────────────────────────────────
const COLORES = ["#B8860B","#C0392B","#2980B9","#D4A017","#27AE60","#8E44AD","#16A085","#E74C3C","#D35400","#1ABC9C","#2C3E50","#7F8C8D"];

const ESTADO_STYLE = {
  "Completado":{bg:"#e6f4ec",text:"#1a7a3c",border:"#a3d9b5"},
  "En Proceso": {bg:"#fff8e1",text:"#8a6000",border:"#f5cc5a"},
  "En espera":  {bg:"#f5f5f5",text:"#777",   border:"#ccc"   },
  "Bloqueado":  {bg:"#fde8e8",text:"#b91c1c",border:"#f5a5a5"},
};
const ESTADOS      = ["En Proceso","En espera","Completado","Bloqueado"];
const RESPONSABLES = ["Roy","Kate","Klaus","Bryan","Mirtha","Jesus","Italo","Miguel C."];

// ─── DATOS INICIALES COMITÉ LUNES ────────────────────────────
const LUNES_INICIAL = {
  orden: ["MILANO","BRICK","BUENAVISTA","PARK 55","JARDINES DE COLONIAL","BOHEME","VIEW PARK","ESENZA"],
  items: {
    MILANO: {
      color:"#B8860B", fase:"Fin de Obra", finObra:"15/05/2026", finVentas:"21/07/2026",
      secciones:["OBRA","GESTIÓN","MARKETING","COMERCIAL","FINANCIEROS","LEGALES"],
      tareas:{
        OBRA:[
          {id:101,tarea:"HITO 1: CASCO Y ESTRUCTURA",   responsable:"Bryan",estado:"Completado",progreso:100,vencimiento:"2025-06-01",nota:""},
          {id:102,tarea:"HITO 2: INSTALACIONES",        responsable:"Bryan",estado:"Completado",progreso:100,vencimiento:"2025-09-01",nota:""},
          {id:103,tarea:"HITO 3: ACABADOS HÚMEDOS",     responsable:"Bryan",estado:"Completado",progreso:100,vencimiento:"2025-12-01",nota:""},
          {id:104,tarea:"HITO 4: ACABADOS INTERIORES",  responsable:"Bryan",estado:"Completado",progreso:100,vencimiento:"2026-02-01",nota:""},
          {id:105,tarea:"HITO 5: ACABADOS EXTERIORES",  responsable:"Bryan",estado:"Completado",progreso:100,vencimiento:"2026-03-15",nota:""},
          {id:106,tarea:"HITO 6: ÁREAS COMUNES",        responsable:"Bryan",estado:"Completado",progreso:100,vencimiento:"2026-04-15",nota:""},
          {id:107,tarea:"HITO 7: LEVANT. OBSERVACIONES",responsable:"Bryan",estado:"En Proceso", progreso:85, vencimiento:"2026-05-01",nota:""},
        ],
        GESTIÓN:[
          {id:1,tarea:"CONEXION ELECTRICA",        responsable:"Roy",estado:"En Proceso",progreso:75,vencimiento:"2026-05-31",nota:"Medidores pagados"},
          {id:2,tarea:"CONEXION AGUA Y DESAGUE",   responsable:"Roy",estado:"En Proceso",progreso:95,vencimiento:"2026-05-31",nota:"En espera SEDAPAL"},
          {id:3,tarea:"CONEXIÓN DE GAS NATURAL",   responsable:"Roy",estado:"En Proceso",progreso:90,vencimiento:"2026-04-15",nota:""},
          {id:4,tarea:"DOSIER DE CALIDAD",         responsable:"Roy",estado:"En Proceso",progreso:95,vencimiento:"2026-05-15",nota:"Falta documentos Nelly"},
          {id:5,tarea:"EXPEDIENTE DE CONFORMIDAD", responsable:"Roy",estado:"En Proceso",progreso:95,vencimiento:"2026-05-15",nota:"Planos AS BUILT al 100%"},
        ],
        MARKETING:  [{id:6,tarea:"EVENTO JUNTA DE PROPIETARIOS",responsable:"Kate", estado:"En Proceso",progreso:50,vencimiento:"2026-05-22",nota:""}],
        COMERCIAL:  [{id:7,tarea:"SEGUIMIENTO A VENTAS",         responsable:"Klaus",estado:"En Proceso",progreso:95,vencimiento:"2026-09-15",nota:""}],
        FINANCIEROS:[],LEGALES:[],
      }
    },
    BRICK:{color:"#C0392B",fase:"Construcción",finObra:"15/11/2026",finVentas:"01/07/2027",secciones:["OBRA","GESTIÓN","MARKETING","COMERCIAL","FINANCIEROS","LEGALES"],tareas:{OBRA:[{id:101,tarea:"HITO 1: CASCO Y ESTRUCTURA",responsable:"Bryan",estado:"Completado",progreso:100,vencimiento:"2025-10-01",nota:""},{id:102,tarea:"HITO 2: INSTALACIONES",responsable:"Bryan",estado:"Completado",progreso:100,vencimiento:"2026-01-01",nota:""},{id:103,tarea:"HITO 3: ACABADOS HÚMEDOS (SSCC)",responsable:"Bryan",estado:"Completado",progreso:100,vencimiento:"2026-03-15",nota:""},{id:104,tarea:"HITO 4: ACABADOS HÚMEDOS",responsable:"Bryan",estado:"En Proceso",progreso:77,vencimiento:"2026-05-27",nota:""},{id:105,tarea:"HITO 5: ACABADOS INTERIORES",responsable:"Bryan",estado:"En Proceso",progreso:32,vencimiento:"2026-08-26",nota:""}],GESTIÓN:[{id:1,tarea:"LICITACION DE PARTIDAS",responsable:"Jesus",estado:"Completado",progreso:100,vencimiento:"2025-03-31",nota:""},{id:2,tarea:"PILOTO EN OBRA",responsable:"Jesus",estado:"Completado",progreso:100,vencimiento:"2026-04-06",nota:""}],MARKETING:[{id:3,tarea:"IMPLEMENTACION PILOTO EN OBRA",responsable:"Kate",estado:"En Proceso",progreso:100,vencimiento:"2026-05-10",nota:""}],COMERCIAL:[{id:4,tarea:"VENTA AL 75%",responsable:"Klaus",estado:"En Proceso",progreso:85,vencimiento:"2026-09-11",nota:""}],FINANCIEROS:[],LEGALES:[]}},
    BUENAVISTA:{color:"#2980B9",fase:"Construcción",finObra:"15/07/2028",finVentas:"13/05/2029",secciones:["OBRA","GESTIÓN","MARKETING","COMERCIAL","FINANCIEROS","LEGALES"],tareas:{OBRA:[{id:101,tarea:"HITO 1: FIN DE CIMENTACIONES",responsable:"Bryan",estado:"En Proceso",progreso:5,vencimiento:"2026-09-04",nota:""}],GESTIÓN:[{id:1,tarea:"CONTRATO CON CONSTRUCTORA",responsable:"Roy",estado:"Completado",progreso:100,vencimiento:"2025-11-01",nota:""},{id:2,tarea:"PRE CERT. BONO VERDE Y EDGE",responsable:"Jesus",estado:"En Proceso",progreso:90,vencimiento:"2026-03-15",nota:"Falta CERT. Bono Verde"}],MARKETING:[{id:3,tarea:"IMPLEMENTACION SV Y DPTO PILOTO",responsable:"Kate",estado:"Completado",progreso:100,vencimiento:"2025-06-01",nota:""},{id:4,tarea:"RELANZAMIENTO DE CAMPAÑA",responsable:"Kate",estado:"En espera",progreso:0,vencimiento:"2026-06-29",nota:"Postergado"}],COMERCIAL:[{id:5,tarea:"VENTA AL 25%",responsable:"Klaus",estado:"En Proceso",progreso:80,vencimiento:"2026-05-30",nota:""}],FINANCIEROS:[{id:6,tarea:"INFORME DE VIABILIDAD",responsable:"Mirtha",estado:"En Proceso",progreso:90,vencimiento:"2026-04-15",nota:"Falta info Jesús"}],LEGALES:[]}},
    "PARK 55":{color:"#D4A017",fase:"Pre-venta",finObra:"—",finVentas:"24/01/2028",secciones:["OBRA","GESTIÓN","MARKETING","COMERCIAL","FINANCIEROS","LEGALES"],tareas:{OBRA:[],GESTIÓN:[{id:1,tarea:"APROBACIÓN PROY. VÍA COMISIÓN",responsable:"Roy",estado:"En Proceso",progreso:85,vencimiento:"2026-05-15",nota:"Falta especialidades"},{id:2,tarea:"LICENCIA DE CONSTRUCCION",responsable:"Roy",estado:"En espera",progreso:0,vencimiento:"2026-05-31",nota:""}],MARKETING:[],COMERCIAL:[{id:3,tarea:"VENTA AL 25%",responsable:"Klaus",estado:"En espera",progreso:10,vencimiento:"2026-10-02",nota:""}],FINANCIEROS:[],LEGALES:[]}},
    "JARDINES DE COLONIAL":{color:"#27AE60",fase:"Pre-construcción",finObra:"30/12/2027",finVentas:"10/06/2028",secciones:["OBRA","GESTIÓN","MARKETING","COMERCIAL","FINANCIEROS","LEGALES"],tareas:{OBRA:[{id:101,tarea:"DEMOLICION DE EDIFICIO",responsable:"Roy",estado:"En Proceso",progreso:85,vencimiento:"2026-05-31",nota:"TDR Aprobado"}],GESTIÓN:[{id:1,tarea:"FACTIBILIDADES APROBADAS",responsable:"Roy",estado:"Completado",progreso:100,vencimiento:"2025-12-15",nota:""},{id:2,tarea:"APROBACIÓN PROY. VÍA COMISIÓN",responsable:"Roy",estado:"En Proceso",progreso:100,vencimiento:"2026-05-15",nota:"ITF Aprobado"},{id:3,tarea:"LICENCIA DE CONSTRUCCION",responsable:"Roy",estado:"En espera",progreso:0,vencimiento:"2026-05-29",nota:"Entrega 22 Mayo"}],MARKETING:[{id:4,tarea:"IMPLEMENTACION SV Y DPTO PILOTO",responsable:"Kate",estado:"Completado",progreso:100,vencimiento:"2025-03-15",nota:""}],COMERCIAL:[],FINANCIEROS:[{id:5,tarea:"VALIDACION DE PRE VENTA",responsable:"Mirtha",estado:"En Proceso",progreso:15,vencimiento:"2026-05-29",nota:""}],LEGALES:[]}},
    BOHEME:{color:"#8E44AD",fase:"Pre-venta",finObra:"—",finVentas:"15/12/2027",secciones:["OBRA","GESTIÓN","MARKETING","COMERCIAL","FINANCIEROS","LEGALES"],tareas:{OBRA:[],GESTIÓN:[{id:1,tarea:"GESTION DE FACTIBILIDADES",responsable:"Roy",estado:"En Proceso",progreso:90,vencimiento:"2026-02-28",nota:"Falta SEDAPAL"},{id:2,tarea:"APROBACIÓN PROY. VÍA COMISIÓN",responsable:"Roy",estado:"En espera",progreso:0,vencimiento:"2026-06-06",nota:""}],MARKETING:[{id:3,tarea:"ENTREGA DE GESTIÓN A LA MURALLA",responsable:"Kate",estado:"En Proceso",progreso:15,vencimiento:"2026-05-30",nota:""}],COMERCIAL:[{id:4,tarea:"VENTA AL 25%",responsable:"Klaus",estado:"En Proceso",progreso:10,vencimiento:"2026-09-24",nota:""}],FINANCIEROS:[],LEGALES:[]}},
    "VIEW PARK":{color:"#16A085",fase:"Desarrollo",finObra:"—",finVentas:"—",secciones:["OBRA","GESTIÓN","MARKETING","COMERCIAL","FINANCIEROS","LEGALES"],tareas:{OBRA:[{id:101,tarea:"DEMOLICION (Casa de Ramón)",responsable:"Jesus",estado:"En Proceso",progreso:95,vencimiento:"2026-05-13",nota:""}],GESTIÓN:[{id:1,tarea:"APROBACION DE ANTEPROYECTO",responsable:"Jesus",estado:"En Proceso",progreso:85,vencimiento:"2026-05-22",nota:""},{id:2,tarea:"ESTUDIOS PRELIMINARES",responsable:"Jesus",estado:"En Proceso",progreso:35,vencimiento:"2026-04-29",nota:""}],MARKETING:[{id:3,tarea:"DESARROLLO MATERIAL COMERCIAL",responsable:"Kate",estado:"En Proceso",progreso:1,vencimiento:"2026-05-20",nota:""}],COMERCIAL:[],FINANCIEROS:[],LEGALES:[{id:4,tarea:"PRESCRIPCION ADQUISITIVA DOMINIO",responsable:"Miguel C.",estado:"En Proceso",progreso:65,vencimiento:"2026-06-15",nota:"Anotación preventiva observada"}]}},
    ESENZA:{color:"#E74C3C",fase:"Desarrollo",finObra:"—",finVentas:"—",secciones:["OBRA","GESTIÓN","MARKETING","COMERCIAL","FINANCIEROS","LEGALES"],tareas:{OBRA:[],GESTIÓN:[{id:1,tarea:"DESARROLLO DE ANTEPROYECTO",responsable:"Roy",estado:"Completado",progreso:100,vencimiento:"2026-05-15",nota:""},{id:2,tarea:"APROBACION DE ANTEPROYECTO",responsable:"Roy",estado:"En espera",progreso:50,vencimiento:"2026-05-31",nota:""},{id:3,tarea:"DESARROLLO DE PRODUCTO",responsable:"Roy",estado:"En Proceso",progreso:10,vencimiento:"2026-05-30",nota:""}],MARKETING:[{id:4,tarea:"LAYOUT DE SALA DE VENTAS",responsable:"Kate",estado:"En Proceso",progreso:35,vencimiento:"2026-05-05",nota:""}],COMERCIAL:[],FINANCIEROS:[],LEGALES:[]}},
  },
  ventas:{
    MILANO:               {avanceVentas:94,deptos:81,porVender:5,  total:86, estac:80,porVenderEstac:11,totalEstac:91, velocidad:2.5,meses:2   },
    BRICK:                {avanceVentas:71,deptos:50,porVender:20, total:70, estac:49,porVenderEstac:26,totalEstac:75, velocidad:1.5,meses:13.3},
    BUENAVISTA:           {avanceVentas:21,deptos:36,porVender:128,total:164,estac:11,porVenderEstac:49,totalEstac:60, velocidad:4,  meses:32  },
    "PARK 55":            {avanceVentas:27,deptos:21,porVender:123,total:144,estac:8, porVenderEstac:47,totalEstac:55, velocidad:3.5,meses:38.6},
    "JARDINES DE COLONIAL":{avanceVentas:34,deptos:78,porVender:148,total:226,estac:21,porVenderEstac:59,totalEstac:80,velocidad:6,  meses:24.7},
    BOHEME:               {avanceVentas:12,deptos:29,porVender:143,total:172,estac:19,porVenderEstac:49,totalEstac:68, velocidad:4,  meses:35.75},
    "VIEW PARK":          {avanceVentas:0, deptos:0, porVender:135,total:135,estac:0, porVenderEstac:52,totalEstac:52, velocidad:2,  meses:39.5},
    ESENZA:               {avanceVentas:0, deptos:0, porVender:79, total:79, estac:0, porVenderEstac:36,totalEstac:36, velocidad:2,  meses:39.5},
  }
};

// ─── DATOS INICIALES OTROS COMITÉS ───────────────────────────
function comiteVacio(nombre) {
  return {
    orden: [],
    items: {},
  };
}

// ─── HELPERS ─────────────────────────────────────────────────
function diasHasta(f) {
  if(!f) return null;
  // Fix timezone: parse as local date
  const [y,m,d] = f.split("-").map(Number);
  const fecha = new Date(y, m-1, d);
  const hoy = new Date(); hoy.setHours(0,0,0,0);
  return Math.ceil((fecha - hoy) / 86400000);
}
function formatFecha(s) {
  if(!s) return "—";
  const [y,m,d] = s.split("-");
  if(!y||!m||!d) return s;
  return `${d}/${m}/${y}`;
}
function hexToRgb(h) { return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]; }

// ─── UI HELPERS ──────────────────────────────────────────────
function Alerta({dias,completado}) {
  if(completado||dias===null) return null;
  if(dias<0)   return <span style={{background:"#fde8e8",color:"#b91c1c",border:"1px solid #f5a5a5",borderRadius:4,padding:"1px 7px",fontSize:10,fontWeight:700}}>VENCIDO</span>;
  if(dias===0)  return <span style={{background:"#fde8e8",color:"#b91c1c",border:"1px solid #f5a5a5",borderRadius:4,padding:"1px 7px",fontSize:10,fontWeight:700}}>HOY</span>;
  if(dias<=7)   return <span style={{background:"#fff3cd",color:"#856404",border:"1px solid #ffc107",borderRadius:4,padding:"1px 7px",fontSize:10,fontWeight:700}}>+{dias}d</span>;
  return null;
}
function Barra({valor,color}) {
  return <div style={{width:"100%",height:6,background:"#e5e7eb",borderRadius:3,overflow:"hidden"}}><div style={{width:`${Math.min(100,Math.max(0,valor||0))}%`,height:"100%",background:color,borderRadius:3}}/></div>;
}
function GuardadoIndicador({estado}) {
  const e={guardando:{bg:"#fff3cd",text:"#856404",msg:"Guardando..."},guardado:{bg:"#e6f4ec",text:"#1a7a3c",msg:"✓ Guardado"},error:{bg:"#fde8e8",text:"#b91c1c",msg:"Error"}};
  const s=e[estado]; if(!s) return null;
  return <div style={{background:s.bg,color:s.text,border:`1px solid ${s.text}44`,borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:600}}>{s.msg}</div>;
}

// ─── MODAL TAREA ─────────────────────────────────────────────
function ModalTarea({tarea,color,seccion,secciones,proyectoNombre,onSave,onDelete,onClose}) {
  const [form,setForm]=useState(tarea?{...tarea,seccion}:{id:Date.now(),tarea:"",responsable:"Roy",estado:"En Proceso",progreso:0,vencimiento:"",nota:"",seccion:seccion||secciones[0]||""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:500,boxShadow:"0 20px 60px rgba(0,0,0,0.15)"}}>
        <div style={{padding:"18px 24px 14px",borderBottom:"1px solid #f0f0f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontWeight:700,fontSize:16,color:"#111"}}>{tarea?"Editar tarea":"Nueva tarea"} — {proyectoNombre}</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#999",fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{padding:24,display:"flex",flexDirection:"column",gap:14}}>
          <div>
            <label style={{fontSize:11,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:5}}>Tarea</label>
            <input value={form.tarea} onChange={e=>set("tarea",e.target.value.toUpperCase())}
              style={{width:"100%",border:"1px solid #e5e7eb",borderRadius:8,padding:"9px 12px",fontSize:13,boxSizing:"border-box",color:"#111"}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <label style={{fontSize:11,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:5}}>Sección</label>
              <select value={form.seccion} onChange={e=>set("seccion",e.target.value)} style={{width:"100%",border:"1px solid #e5e7eb",borderRadius:8,padding:"9px 12px",fontSize:13,color:"#111"}}>
                {secciones.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:11,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:5}}>Responsable</label>
              <select value={form.responsable} onChange={e=>set("responsable",e.target.value)} style={{width:"100%",border:"1px solid #e5e7eb",borderRadius:8,padding:"9px 12px",fontSize:13,color:"#111"}}>
                {RESPONSABLES.map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <label style={{fontSize:11,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:5}}>Estado</label>
              <select value={form.estado} onChange={e=>set("estado",e.target.value)} style={{width:"100%",border:"1px solid #e5e7eb",borderRadius:8,padding:"9px 12px",fontSize:13,color:"#111"}}>
                {ESTADOS.map(e=><option key={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:11,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:5}}>Vencimiento</label>
              <input type="date" value={form.vencimiento} onChange={e=>set("vencimiento",e.target.value)}
                style={{width:"100%",border:"1px solid #e5e7eb",borderRadius:8,padding:"9px 12px",fontSize:13,boxSizing:"border-box",color:"#111"}}/>
            </div>
          </div>
          <div>
            <label style={{fontSize:11,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:5}}>Progreso: {form.progreso}%</label>
            <input type="range" min="0" max="100" step="5" value={form.progreso} onChange={e=>set("progreso",Number(e.target.value))} style={{width:"100%",accentColor:color}}/>
          </div>
          <div>
            <label style={{fontSize:11,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:5}}>Nota</label>
            <input value={form.nota} onChange={e=>set("nota",e.target.value)}
              style={{width:"100%",border:"1px solid #e5e7eb",borderRadius:8,padding:"9px 12px",fontSize:13,boxSizing:"border-box",color:"#555"}}/>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>onSave(form)} style={{flex:1,background:color,color:"#fff",border:"none",borderRadius:8,padding:"12px",cursor:"pointer",fontWeight:700,fontSize:14}}>Guardar</button>
            {tarea&&<button onClick={()=>onDelete(tarea.id,seccion)} style={{background:"#fde8e8",color:"#b91c1c",border:"1px solid #f5a5a5",borderRadius:8,padding:"12px 20px",cursor:"pointer",fontSize:13,fontWeight:600}}>Eliminar</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL NUEVO/EDITAR ITEM ──────────────────────────────────
function ModalItem({item,esNuevo,onSave,onClose}) {
  const [form,setForm]=useState(item||{nombre:"",fase:"",finObra:"—",finVentas:"—",color:"#2980B9"});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:440,boxShadow:"0 20px 60px rgba(0,0,0,0.15)"}}>
        <div style={{padding:"18px 24px 14px",borderBottom:"1px solid #f0f0f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontWeight:700,fontSize:16,color:"#111"}}>{esNuevo?"Nuevo item":"Editar item"}</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#999",fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{padding:24,display:"flex",flexDirection:"column",gap:14}}>
          <div>
            <label style={{fontSize:11,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:5}}>Nombre</label>
            <input value={form.nombre||form.name||""} onChange={e=>set("nombre",e.target.value.toUpperCase())}
              style={{width:"100%",border:"1px solid #e5e7eb",borderRadius:8,padding:"9px 12px",fontSize:13,boxSizing:"border-box",color:"#111"}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <label style={{fontSize:11,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:5}}>Fase / Etiqueta</label>
              <input value={form.fase||""} onChange={e=>set("fase",e.target.value)}
                style={{width:"100%",border:"1px solid #e5e7eb",borderRadius:8,padding:"9px 12px",fontSize:13,boxSizing:"border-box",color:"#111"}}/>
            </div>
            <div>
              <label style={{fontSize:11,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:5}}>Color</label>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",paddingTop:4}}>
                {COLORES.map(c=><div key={c} onClick={()=>set("color",c)} style={{width:22,height:22,borderRadius:"50%",background:c,cursor:"pointer",border:form.color===c?"3px solid #111":"2px solid transparent"}}/>)}
              </div>
            </div>
          </div>
          <button onClick={()=>(form.nombre||"").trim()&&onSave(form)} style={{background:form.color||"#2980B9",color:"#fff",border:"none",borderRadius:8,padding:"12px",cursor:"pointer",fontWeight:700,fontSize:14}}>
            {esNuevo?"Crear":"Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL EDITAR SECCIONES ───────────────────────────────────
function ModalSecciones({secciones,color,onSave,onClose}) {
  const [lista,setLista]=useState([...secciones]);
  const [nueva,setNueva]=useState("");
  function mover(i,dir){const l=[...lista];const j=i+dir;if(j<0||j>=l.length)return;[l[i],l[j]]=[l[j],l[i]];setLista(l);}
  function eliminar(i){setLista(l=>l.filter((_,idx)=>idx!==i));}
  function agregar(){if(!nueva.trim())return;setLista(l=>[...l,nueva.trim().toUpperCase()]);setNueva("");}
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:420,boxShadow:"0 20px 60px rgba(0,0,0,0.15)"}}>
        <div style={{padding:"18px 24px 14px",borderBottom:"1px solid #f0f0f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontWeight:700,fontSize:16,color:"#111"}}>Editar secciones</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#999",fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{padding:24}}>
          {lista.map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:8,padding:"8px 12px"}}>
              <div style={{flex:1,fontSize:13,fontWeight:600,color:"#111"}}>{s}</div>
              <button onClick={()=>mover(i,-1)} disabled={i===0} style={{background:"none",border:"none",cursor:i===0?"default":"pointer",color:i===0?"#e5e7eb":"#9ca3af",fontSize:12}}>▲</button>
              <button onClick={()=>mover(i,1)} disabled={i===lista.length-1} style={{background:"none",border:"none",cursor:i===lista.length-1?"default":"pointer",color:i===lista.length-1?"#e5e7eb":"#9ca3af",fontSize:12}}>▼</button>
              <button onClick={()=>eliminar(i)} style={{background:"none",border:"none",cursor:"pointer",color:"#f5a5a5",fontSize:14,fontWeight:700}}>✕</button>
            </div>
          ))}
          <div style={{display:"flex",gap:8,marginTop:12}}>
            <input value={nueva} onChange={e=>setNueva(e.target.value)} placeholder="Nueva sección..."
              onKeyDown={e=>e.key==="Enter"&&agregar()}
              style={{flex:1,border:"1px solid #e5e7eb",borderRadius:8,padding:"8px 12px",fontSize:13,color:"#111"}}/>
            <button onClick={agregar} style={{background:color,color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontWeight:700}}>+</button>
          </div>
          <button onClick={()=>onSave(lista)} style={{width:"100%",marginTop:16,background:color,color:"#fff",border:"none",borderRadius:8,padding:"12px",cursor:"pointer",fontWeight:700,fontSize:14}}>Guardar secciones</button>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL VENTAS ─────────────────────────────────────────────
function ModalVentas({nombre,ventas,color,onSave,onClose}) {
  const [form,setForm]=useState({...ventas});
  const set=(k,v)=>setForm(f=>({...f,[k]:Number(v)}));
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:460,boxShadow:"0 20px 60px rgba(0,0,0,0.15)"}}>
        <div style={{padding:"18px 24px 14px",borderBottom:"1px solid #f0f0f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontWeight:700,fontSize:16,color:"#111"}}>Editar ventas — {nombre}</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#999",fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{padding:24,display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {[{k:"avanceVentas",l:"% Avance ventas"},{k:"deptos",l:"Dptos vendidos"},{k:"porVender",l:"Dptos por vender"},{k:"total",l:"Total dptos"},{k:"estac",l:"Estac. vendidos"},{k:"porVenderEstac",l:"Estac. por vender"},{k:"totalEstac",l:"Total estacionamientos"},{k:"velocidad",l:"Velocidad (u/mes)"},{k:"meses",l:"Meses restantes"}].map(({k,l})=>(
            <div key={k}>
              <label style={{fontSize:11,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:5}}>{l}</label>
              <input type="number" value={form[k]||0} onChange={e=>set(k,e.target.value)}
                style={{width:"100%",border:"1px solid #e5e7eb",borderRadius:8,padding:"8px 12px",fontSize:14,boxSizing:"border-box",color:"#111",fontWeight:600}}/>
            </div>
          ))}
        </div>
        <div style={{padding:"0 24px 24px"}}>
          <button onClick={()=>onSave(form)} style={{width:"100%",background:color,color:"#fff",border:"none",borderRadius:8,padding:"12px",cursor:"pointer",fontWeight:700,fontSize:14}}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

// ─── PDF ──────────────────────────────────────────────────────
function generarPDF(nombreComite, orden, items, ventas, tieneVentas) {
  const pdf=new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
  const W=210,H=297;
  const fechaHoy=new Date().toLocaleDateString("es-PE",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).toUpperCase();
  pdf.setFillColor(15,23,42);pdf.rect(0,0,W,H,"F");
  pdf.setFillColor(30,41,59);pdf.rect(0,H*0.35,W,H*0.3,"F");
  pdf.setDrawColor(184,134,11);pdf.setLineWidth(1.2);
  pdf.line(30,H*0.32,W-30,H*0.32);pdf.line(30,H*0.65,W-30,H*0.65);
  pdf.setTextColor(184,134,11);pdf.setFontSize(11);pdf.setFont("helvetica","bold");
  pdf.text("BINDA",W/2,H*0.25,{align:"center"});
  pdf.setTextColor(255,255,255);pdf.setFontSize(22);
  pdf.text("ACTA DE COMITÉ",W/2,H*0.42,{align:"center"});
  pdf.setFontSize(16);pdf.text(nombreComite.toUpperCase(),W/2,H*0.50,{align:"center"});
  pdf.setTextColor(180,180,180);pdf.setFontSize(10);pdf.setFont("helvetica","normal");
  pdf.text(fechaHoy,W/2,H*0.58,{align:"center"});

  orden.forEach(nombre=>{
    const d=items[nombre]; if(!d) return;
    const [r,g,b]=hexToRgb(d.color);
    // Carátula
    pdf.addPage();
    pdf.setFillColor(15,23,42);pdf.rect(0,0,W,H,"F");
    pdf.setFillColor(r,g,b);pdf.rect(0,H*0.38,W,H*0.24,"F");
    pdf.setTextColor(255,255,255);pdf.setFontSize(26);pdf.setFont("helvetica","bold");
    pdf.text(nombre,W/2,H*0.48,{align:"center"});
    pdf.setFontSize(11);pdf.text((d.fase||"").toUpperCase(),W/2,H*0.55,{align:"center"});
    pdf.setTextColor(200,200,200);pdf.setFontSize(9);pdf.setFont("helvetica","normal");
    pdf.text(fechaHoy,W/2,H*0.70,{align:"center"});

    if(tieneVentas&&ventas&&ventas[nombre]){
      const v=ventas[nombre];
      const kpis=[{label:"AVANCE VENTAS",valor:`${v.avanceVentas}%`},{label:"DPTOS VENDIDOS",valor:`${v.deptos}/${v.total}`},{label:"FIN DE OBRA",valor:d.finObra||"—"},{label:"FIN DE VENTAS",valor:d.finVentas||"—"}];
      const kpiY=H*0.78;const kpiW=(W-40)/4;
      kpis.forEach((k,i)=>{
        const x=20+i*kpiW;
        pdf.setFillColor(30,41,59);pdf.roundedRect(x,kpiY,kpiW-4,22,2,2,"F");
        pdf.setTextColor(r,g,b);pdf.setFontSize(13);pdf.setFont("helvetica","bold");
        pdf.text(k.valor,x+(kpiW-4)/2,kpiY+10,{align:"center"});
        pdf.setTextColor(150,150,150);pdf.setFontSize(6.5);pdf.setFont("helvetica","normal");
        pdf.text(k.label,x+(kpiW-4)/2,kpiY+17,{align:"center"});
      });
    }

    // Detalle
    pdf.addPage();
    pdf.setFillColor(15,23,42);pdf.rect(0,0,W,22,"F");
    pdf.setFillColor(r,g,b);pdf.rect(0,0,4,22,"F");
    pdf.setTextColor(255,255,255);pdf.setFontSize(13);pdf.setFont("helvetica","bold");
    pdf.text(nombre,10,10);
    pdf.setFontSize(8);pdf.setFont("helvetica","normal");pdf.setTextColor(180,180,180);
    pdf.text((d.fase||"").toUpperCase(),10,17);
    pdf.setTextColor(150,150,150);pdf.text(fechaHoy,W-10,10,{align:"right"});
    let y=30;

    const secciones=d.secciones||[];
    secciones.forEach(seccion=>{
      const tareas=(d.tareas[seccion]||[]);
      if(tareas.length===0) return;
      if(y>H-40){pdf.addPage();y=15;}
      pdf.setFillColor(r,g,b);pdf.roundedRect(10,y,W-20,8,1,1,"F");
      pdf.setTextColor(255,255,255);pdf.setFontSize(8);pdf.setFont("helvetica","bold");
      pdf.text(seccion,15,y+5.5);
      pdf.text(`${tareas.length} tarea${tareas.length!==1?"s":""}`,W-15,y+5.5,{align:"right"});
      y+=11;
      autoTable(pdf,{
        startY:y,margin:{left:10,right:10},
        head:[["TAREA","RESP.","ESTADO","%","VENCIMIENTO","NOTA"]],
        body:tareas.map(t=>[t.tarea,t.responsable,t.estado,`${t.progreso}%`,formatFecha(t.vencimiento),t.nota||""]),
        headStyles:{fillColor:[15,23,42],textColor:[r,g,b],fontSize:7,fontStyle:"bold",cellPadding:2.5},
        bodyStyles:{fontSize:7.5,cellPadding:2.5,textColor:[50,50,50]},
        columnStyles:{0:{cellWidth:55},1:{cellWidth:18},2:{cellWidth:22},3:{cellWidth:10,halign:"center"},4:{cellWidth:22},5:{cellWidth:"auto"}},
        alternateRowStyles:{fillColor:[248,249,252]},
        didParseCell:(data)=>{
          if(data.section==="body"&&data.column.index===2){
            const e=data.cell.raw;
            if(e==="Completado"){data.cell.styles.textColor=[26,122,60];data.cell.styles.fontStyle="bold";}
            else if(e==="En Proceso"){data.cell.styles.textColor=[138,96,0];data.cell.styles.fontStyle="bold";}
            else if(e==="Bloqueado"){data.cell.styles.textColor=[185,28,28];data.cell.styles.fontStyle="bold";}
          }
        },
      });
      y=pdf.lastAutoTable.finalY+6;
    });
  });
  pdf.save(`Acta_${nombreComite.replace(/ /g,"_")}_${new Date().toLocaleDateString("es-PE").replace(/\//g,"-")}.pdf`);
}

// ─── PANTALLA INICIO ─────────────────────────────────────────
const COMITES_CONFIG = [
  {id:"lunes",    nombre:"Comité de Lunes",             subtitulo:"Proyectos inmobiliarios",       color:"#B8860B", icon:"🏗️",  tieneVentas:true  },
  {id:"legal",    nombre:"Comité Legal",                subtitulo:"Casos, contratos y procesos",   color:"#2980B9", icon:"⚖️",  tieneVentas:false },
  {id:"admin",    nombre:"Comité de Administración",    subtitulo:"Contabilidad y Logística",      color:"#27AE60", icon:"📊",  tieneVentas:false },
  {id:"proyectos",nombre:"Comité de Proyectos",         subtitulo:"Seguimiento de proyectos",      color:"#8E44AD", icon:"📐",  tieneVentas:false },
];

function PantallaInicio({onSeleccionar}) {
  const iconos = {
    lunes:     { svg: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
    legal:     { svg: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M5 7l7-4 7 4M5 17l7 4 7-4"/><path d="M5 7v10M19 7v10"/><path d="M3 17h4M17 17h4"/></svg> },
    admin:     { svg: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M6 7h4M6 11h8M14 7h4"/></svg> },
    proyectos: { svg: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-6 9 6v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  };

  return(
    <div style={{minHeight:"100vh",background:"#0f0f0f",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',system-ui,sans-serif",padding:32,position:"relative",overflow:"hidden"}}>
      {/* Fondo decorativo */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#FCC000,#B8860B)"}} />
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 20% 50%, #FCC00008 0%, transparent 60%), radial-gradient(circle at 80% 20%, #FCC00005 0%, transparent 50%)",pointerEvents:"none"}} />

      {/* Logo Binda */}
      <div style={{marginBottom:48,textAlign:"center",position:"relative"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14,marginBottom:10}}>
          {/* Isotipo casa */}
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
            <path d="M19 4L35 16V34H23V24H15V34H3V16L19 4Z" fill="#FCC000"/>
            <path d="M19 4L35 16V34H23V24H15V34H3V16L19 4Z" fill="none" stroke="#B8860B" strokeWidth="1"/>
          </svg>
          <div style={{fontSize:36,fontWeight:900,color:"#ffffff",letterSpacing:6,fontFamily:"'Segoe UI',system-ui,sans-serif"}}>BINDA</div>
        </div>
        <div style={{width:48,height:2,background:"#FCC000",margin:"0 auto 12px"}} />
        <div style={{fontSize:11,color:"#666",letterSpacing:4,textTransform:"uppercase"}}>Sistema de Comités</div>
      </div>

      {/* Grid 2x2 */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,width:"100%",maxWidth:720}}>
        {COMITES_CONFIG.map(c=>(
          <div key={c.id} onClick={()=>onSeleccionar(c)}
            style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:16,padding:"28px 24px",cursor:"pointer",transition:"all 0.2s",position:"relative",overflow:"hidden"}}
            onMouseOver={e=>{e.currentTarget.style.border=`1px solid ${c.color}66`;e.currentTarget.style.background="#222";e.currentTarget.style.transform="translateY(-2px)";}}
            onMouseOut={e=>{e.currentTarget.style.border="1px solid #2a2a2a";e.currentTarget.style.background="#1a1a1a";e.currentTarget.style.transform="translateY(0)";}}>
            {/* Línea color izquierda */}
            <div style={{position:"absolute",top:0,left:0,width:3,height:"100%",background:c.color,borderRadius:"16px 0 0 16px"}} />
            <div style={{paddingLeft:8}}>
              {/* Icono */}
              <div style={{color:c.color,marginBottom:16,opacity:0.9}}>{iconos[c.id].svg}</div>
              {/* Nombre */}
              <div style={{fontSize:17,fontWeight:700,color:"#f0ede8",marginBottom:5,letterSpacing:0.3}}>{c.nombre}</div>
              {/* Subtítulo */}
              <div style={{fontSize:12,color:"#555",marginBottom:20}}>{c.subtitulo}</div>
              {/* Botón */}
              <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`${c.color}18`,border:`1px solid ${c.color}44`,borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:700,color:c.color,letterSpacing:0.5}}>
                Abrir
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{marginTop:40,fontSize:11,color:"#333",letterSpacing:1}}>
        BINDA GRUPO INMOBILIARIO · {new Date().getFullYear()}
      </div>
    </div>
  );
}

// ─── VISTA COMITÉ ─────────────────────────────────────────────
function VistaComite({comite, onVolver}) {
  const [estado,    setEstado]    = useState(null);
  const [cargando,  setCargando]  = useState(true);
  const [guardado,  setGuardado]  = useState(null);
  const [activo,    setActivo]    = useState(null);
  const [tabActiva, setTabActiva] = useState("tareas");
  const [modalTarea,setModalTarea]= useState(null);
  const [seccionMod,setSeccionMod]= useState("");
  const [modalVentas,setModalVentas]=useState(false);
  const [modalItem,  setModalItem] =useState(null); // null | "nuevo" | nombre
  const [modalSecciones,setModalSecciones]=useState(false);

  const docId = `comite_${comite.id}`;

  useEffect(()=>{
    cargar(docId).then(async data=>{
      if(data && data.orden && data.orden.length > 0){
        setEstado(data); setActivo(data.orden[0]||null);
      } else if(comite.id==="lunes"){
        const viejo = await cargar("estado");
        if(viejo && viejo.proyData){
          const orden = viejo.orden || Object.keys(viejo.proyData||{});
          const items = {};
          orden.forEach(nombre=>{
            const p = viejo.proyData[nombre];
            if(!p) return;
            items[nombre]={
              color:p.color, fase:p.fase, finObra:p.finObra, finVentas:p.finVentas,
              secciones:["OBRA","GESTIÓN","MARKETING","COMERCIAL","FINANCIEROS","LEGALES"],
              tareas: p.tareas||{OBRA:[],GESTIÓN:[],MARKETING:[],COMERCIAL:[],FINANCIEROS:[],LEGALES:[]}
            };
          });
          const migrado = { orden, items, ventas: viejo.ventas||{} };
          setEstado(migrado); setActivo(orden[0]||null);
          guardar(docId, migrado);
        } else {
          setEstado(LUNES_INICIAL); setActivo(LUNES_INICIAL.orden[0]);
        }
      } else {
        setEstado(comiteVacio(comite.nombre)); setActivo(null);
      }
      setCargando(false);
    });
  },[]);

  useEffect(()=>{
    if(cargando||!estado) return;
    setGuardado("guardando");
    const t=setTimeout(()=>{
      guardar(docId,estado)
        .then(()=>{setGuardado("guardado");setTimeout(()=>setGuardado(null),3000);})
        .catch(()=>setGuardado("error"));
    },800);
    return()=>clearTimeout(t);
  },[estado]);

  function upd(fn){setEstado(prev=>({...prev,...fn(prev)}));}

  const item = activo && estado?.items?.[activo];
  const secciones = item?.secciones || [];
  const venta = activo && estado?.ventas?.[activo];

  const totalUrgentes=(estado?.orden||[]).reduce((acc,p)=>{
    const it=estado?.items?.[p]; if(!it) return acc;
    return acc+Object.values(it.tareas||{}).flat().filter(t=>{const d=diasHasta(t.vencimiento);return d!==null&&d<=7&&t.estado!=="Completado";}).length;
  },0);

  function guardarTarea(form) {
    const dest=form.seccion||seccionMod;
    upd(prev=>{
      const it={...prev.items[activo]};
      const tareas={};
      (it.secciones||[]).forEach(s=>{tareas[s]=(it.tareas[s]||[]).filter(t=>t.id!==form.id);});
      const nueva={id:form.id,tarea:form.tarea,responsable:form.responsable,estado:form.estado,progreso:form.progreso,vencimiento:form.vencimiento,nota:form.nota};
      tareas[dest]=[...tareas[dest],nueva];
      // Mantener el orden original: reemplazar si existe, agregar al final si es nuevo
      (it.secciones||[]).forEach(s=>{
        const idx=(it.tareas[s]||[]).findIndex(t=>t.id===form.id);
        if(idx>=0&&s===dest){
          // edición en la misma sección: mantener posición
          tareas[dest]=[...(it.tareas[s]||[])];
          tareas[dest][idx]=nueva;
        }
      });
      return{items:{...prev.items,[activo]:{...it,tareas}}};
    });
    setModalTarea(null);
  }

  function eliminarTarea(id,seccion) {
    upd(prev=>({items:{...prev.items,[activo]:{...prev.items[activo],tareas:{...prev.items[activo].tareas,[seccion]:(prev.items[activo].tareas[seccion]||[]).filter(t=>t.id!==id)}}}}));
    setModalTarea(null);
  }

  function moverTarea(seccion,idx,dir) {
    upd(prev=>{
      const tareas=[...(prev.items[activo].tareas[seccion]||[])];
      const j=idx+dir; if(j<0||j>=tareas.length) return {};
      [tareas[idx],tareas[j]]=[tareas[j],tareas[idx]];
      return{items:{...prev.items,[activo]:{...prev.items[activo],tareas:{...prev.items[activo].tareas,[seccion]:tareas}}}};
    });
  }

  function moverItem(idx,dir) {
    upd(prev=>{
      const orden=[...prev.orden]; const j=idx+dir;
      if(j<0||j>=orden.length) return {};
      [orden[idx],orden[j]]=[orden[j],orden[idx]];
      return{orden};
    });
  }

  function eliminarItem(nombre) {
    upd(prev=>{
      const orden=prev.orden.filter(p=>p!==nombre);
      const items={...prev.items}; delete items[nombre];
      const ventas=prev.ventas?{...prev.ventas}:undefined; if(ventas) delete ventas[nombre];
      return{orden,items,ventas};
    });
    if(activo===nombre) setActivo(estado.orden.find(p=>p!==nombre)||null);
  }

  function crearItem(form) {
    const nombre=(form.nombre||"").trim(); if(!nombre) return;
    const nuevoItem={color:form.color,fase:form.fase||"",finObra:"—",finVentas:"—",secciones:["GESTIÓN","PENDIENTES","EN PROCESO"],tareas:{GESTIÓN:[],PENDIENTES:[],["EN PROCESO"]:[]}};
    upd(prev=>{
      const ventas=comite.tieneVentas?{...prev.ventas,[nombre]:{avanceVentas:0,deptos:0,porVender:0,total:0,estac:0,porVenderEstac:0,totalEstac:0,velocidad:0,meses:0}}:prev.ventas;
      return{orden:[...(prev.orden||[]),nombre],items:{...(prev.items||{}),[nombre]:nuevoItem},ventas};
    });
    setActivo(nombre); setModalItem(null);
  }

  function guardarSecciones(nuevasSecciones) {
    upd(prev=>{
      const it={...prev.items[activo]};
      const tareas={};
      nuevasSecciones.forEach(s=>{tareas[s]=it.tareas[s]||[];});
      return{items:{...prev.items,[activo]:{...it,secciones:nuevasSecciones,tareas}}};
    });
    setModalSecciones(false);
  }

  if(cargando) return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f3f4f6",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:28,fontWeight:800,color:"#374151",marginBottom:12}}>BINDA</div>
        <div style={{fontSize:14,color:"#9ca3af"}}>Cargando {comite.nombre}...</div>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"#f3f4f6",fontFamily:"'Segoe UI',system-ui,sans-serif",color:"#111"}}>
      {/* HEADER */}
      <div style={{background:"#fff",borderBottom:"1px solid #e5e7eb",padding:"12px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <button onClick={onVolver} style={{background:"#f3f4f6",border:"1px solid #e5e7eb",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:13,color:"#374151",fontWeight:600}}>← Inicio</button>
          <div style={{fontSize:20,fontWeight:800,color:"#111"}}>BINDA</div>
          <div style={{width:1,height:18,background:"#e5e7eb"}}/>
          <div style={{fontSize:12,color:comite.color,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>{comite.nombre}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          <GuardadoIndicador estado={guardado}/>
          {totalUrgentes>0&&<div style={{background:"#fde8e8",border:"1px solid #f5a5a5",borderRadius:8,padding:"5px 12px",fontSize:12,color:"#b91c1c",fontWeight:600}}>⚑ {totalUrgentes} urgentes</div>}
          <div style={{fontSize:11,color:"#9ca3af"}}>{new Date().toLocaleDateString("es-PE",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
          <button onClick={()=>generarPDF(comite.nombre,estado?.orden||[],estado?.items||{},estado?.ventas,comite.tieneVentas)}
            style={{background:comite.color,color:"#fff",border:"none",borderRadius:8,padding:"9px 18px",cursor:"pointer",fontWeight:700,fontSize:13}}>
            ⬇ Descargar Acta
          </button>
        </div>
      </div>

      <div style={{display:"flex",height:"calc(100vh - 57px)"}}>
        {/* SIDEBAR */}
        <div style={{width:230,minWidth:230,background:"#fff",borderRight:"1px solid #e5e7eb",overflowY:"auto",padding:"14px 10px",display:"flex",flexDirection:"column"}}>
          <div style={{fontSize:10,color:"#9ca3af",letterSpacing:2,textTransform:"uppercase",padding:"0 6px 10px"}}>{(estado?.orden||[]).length} items</div>
          {(estado?.orden||[]).map((p,idx)=>{
            const d=estado?.items?.[p]; if(!d) return null;
            const v=estado?.ventas?.[p];
            const urg=Object.values(d.tareas||{}).flat().filter(t=>{const dias=diasHasta(t.vencimiento);return dias!==null&&dias<=7&&t.estado!=="Completado";}).length;
            const esActivo=activo===p;
            return(
              <div key={p} style={{marginBottom:4,position:"relative"}}>
                <div onClick={()=>{setActivo(p);setTabActiva("tareas");}} style={{
                  background:esActivo?`${d.color}12`:"transparent",
                  border:`1px solid ${esActivo?d.color:"transparent"}`,
                  borderRadius:10,padding:"10px 10px 10px 12px",cursor:"pointer",transition:"all 0.15s"
                }}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:comite.tieneVentas?6:0}}>
                    <div style={{fontSize:12,fontWeight:esActivo?700:500,color:esActivo?d.color:"#374151",flex:1,marginRight:4}}>{p}</div>
                    <div style={{display:"flex",alignItems:"center",gap:4}}>
                      {comite.tieneVentas&&v&&<div style={{fontSize:14,fontWeight:800,color:d.color}}>{v.avanceVentas}%</div>}
                      {/* controles */}
                      <div style={{display:"flex",flexDirection:"column",gap:1}}>
                        <button onClick={e=>{e.stopPropagation();moverItem(idx,-1);}} disabled={idx===0}
                          style={{background:"none",border:"none",cursor:idx===0?"default":"pointer",color:idx===0?"#e5e7eb":"#9ca3af",fontSize:9,padding:"1px 2px",lineHeight:1}}>▲</button>
                        <button onClick={e=>{e.stopPropagation();moverItem(idx,1);}} disabled={idx===(estado?.orden||[]).length-1}
                          style={{background:"none",border:"none",cursor:idx===(estado?.orden||[]).length-1?"default":"pointer",color:idx===(estado?.orden||[]).length-1?"#e5e7eb":"#9ca3af",fontSize:9,padding:"1px 2px",lineHeight:1}}>▼</button>
                      </div>
                      <button onClick={e=>{e.stopPropagation();if(window.confirm(`¿Eliminar "${p}"?`))eliminarItem(p);}}
                        style={{background:"none",border:"none",cursor:"pointer",color:"#f5a5a5",fontSize:13,padding:"1px 3px",lineHeight:1}}>✕</button>
                    </div>
                  </div>
                  {comite.tieneVentas&&v&&<Barra valor={v.avanceVentas} color={d.color}/>}
                  <div style={{marginTop:comite.tieneVentas?6:0,fontSize:10,color:urg>0?"#b91c1c":"#9ca3af"}}>{urg>0?`⚑ ${urg} urgente${urg>1?"s":""}`:d.fase}</div>
                </div>
              </div>
            );
          })}
          <button onClick={()=>setModalItem("nuevo")} style={{marginTop:8,background:"#f9fafb",border:"1px dashed #d1d5db",borderRadius:10,padding:"10px 12px",cursor:"pointer",fontSize:12,color:"#6b7280",fontWeight:600,textAlign:"center"}}
            onMouseOver={e=>{e.currentTarget.style.background="#f3f4f6";e.currentTarget.style.borderColor="#9ca3af";}}
            onMouseOut={e=>{e.currentTarget.style.background="#f9fafb";e.currentTarget.style.borderColor="#d1d5db";}}>
            + Agregar item
          </button>
        </div>

        {/* CONTENIDO */}
        <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
          {!activo?(
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"#9ca3af",fontSize:14}}>
              Agrega un item desde el panel izquierdo
            </div>
          ):(
            <>
              {/* KPIs */}
              {comite.tieneVentas&&venta&&(
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:20}}>
                  {[
                    {label:"Avance ventas",  valor:`${venta.avanceVentas||0}%`,color:item?.color},
                    {label:"Dptos vendidos", valor:`${venta.deptos||0}/${venta.total||0}`,color:"#374151"},
                    {label:"Tareas urgentes",valor:Object.values(item?.tareas||{}).flat().filter(t=>{const d=diasHasta(t.vencimiento);return d!==null&&d<=7&&t.estado!=="Completado";}).length,color:"#b91c1c"},
                    {label:"Fin de obra",    valor:item?.finObra||"—",color:"#374151"},
                  ].map(k=>(
                    <div key={k.label} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,padding:"12px 16px"}}>
                      <div style={{fontSize:10,color:"#9ca3af",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>{k.label}</div>
                      <div style={{fontSize:20,fontWeight:800,color:k.color}}>{k.valor}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* TABS */}
              <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:14,overflow:"hidden"}}>
                <div style={{display:"flex",borderBottom:"1px solid #e5e7eb",alignItems:"center"}}>
                  <button onClick={()=>setTabActiva("tareas")} style={{padding:"13px 22px",border:"none",cursor:"pointer",fontSize:14,fontWeight:tabActiva==="tareas"?700:400,color:tabActiva==="tareas"?item?.color:"#6b7280",background:"transparent",borderBottom:tabActiva==="tareas"?`2px solid ${item?.color}`:"2px solid transparent",marginBottom:-1}}>📋 Tareas</button>
                  {comite.tieneVentas&&<button onClick={()=>setTabActiva("ventas")} style={{padding:"13px 22px",border:"none",cursor:"pointer",fontSize:14,fontWeight:tabActiva==="ventas"?700:400,color:tabActiva==="ventas"?item?.color:"#6b7280",background:"transparent",borderBottom:tabActiva==="ventas"?`2px solid ${item?.color}`:"2px solid transparent",marginBottom:-1}}>💰 Ventas</button>}
                  <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:16,gap:10}}>
                    <span style={{fontSize:14,fontWeight:800,color:item?.color}}>{activo}</span>
                    <span style={{fontSize:11,color:"#9ca3af",textTransform:"uppercase"}}>{item?.fase}</span>
                    <button onClick={()=>setModalSecciones(true)} style={{background:"#f3f4f6",border:"1px solid #e5e7eb",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:11,color:"#374151",fontWeight:600}}>⚙ Secciones</button>
                  </div>
                </div>

                <div style={{padding:"20px 22px"}}>
                  {tabActiva==="tareas"&&item&&(
                    <TabTareasGeneral
                      item={item} color={item.color}
                      onEdit={(t,sec)=>{setSeccionMod(sec);setModalTarea(t);}}
                      onNueva={(sec)=>{setSeccionMod(sec||secciones[0]||"");setModalTarea("nueva");}}
                      onMover={moverTarea}
                    />
                  )}
                  {tabActiva==="ventas"&&comite.tieneVentas&&venta&&(
                    <TabVentasGeneral
                      nombre={activo} ventas={venta} item={item} color={item?.color}
                      onEditarVentas={()=>setModalVentas(true)}
                      onEditarItem={()=>setModalItem(activo)}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MODALES */}
      {modalTarea&&item&&(
        <ModalTarea
          tarea={modalTarea==="nueva"?null:modalTarea}
          color={item.color} seccion={seccionMod} secciones={secciones}
          proyectoNombre={activo}
          onSave={guardarTarea} onDelete={eliminarTarea} onClose={()=>setModalTarea(null)}
        />
      )}
      {modalVentas&&venta&&item&&(
        <ModalVentas nombre={activo} ventas={venta} color={item.color}
          onSave={v=>upd(prev=>({ventas:{...prev.ventas,[activo]:v}}))||setModalVentas(false)}
          onClose={()=>setModalVentas(false)}/>
      )}
      {modalItem==="nuevo"&&<ModalItem esNuevo={true} onSave={crearItem} onClose={()=>setModalItem(null)}/>}
      {modalItem&&modalItem!=="nuevo"&&item&&(
        <ModalItem item={{nombre:activo,fase:item.fase,color:item.color}} esNuevo={false}
          onSave={form=>{
            upd(prev=>({items:{...prev.items,[activo]:{...prev.items[activo],fase:form.fase,color:form.color}}}));
            setModalItem(null);
          }}
          onClose={()=>setModalItem(null)}/>
      )}
      {modalSecciones&&item&&(
        <ModalSecciones secciones={secciones} color={item.color} onSave={guardarSecciones} onClose={()=>setModalSecciones(false)}/>
      )}
    </div>
  );
}

function TabTareasGeneral({item,color,onEdit,onNueva,onMover}) {
  const secciones=item.secciones||[];
  const todasTareas=Object.values(item.tareas||{}).flat();
  const urgentes=todasTareas.filter(t=>{const d=diasHasta(t.vencimiento);return d!==null&&d<=7&&t.estado!=="Completado";}).length;
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {[{label:"Total",val:todasTareas.length,c:"#374151"},{label:"En proceso",val:todasTareas.filter(t=>t.estado==="En Proceso").length,c:"#8a6000"},{label:"Urgentes",val:urgentes,c:urgentes>0?"#b91c1c":"#9ca3af"},{label:"Completadas",val:todasTareas.filter(t=>t.estado==="Completado").length,c:"#1a7a3c"}].map(k=>(
            <div key={k.label} style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:8,padding:"7px 12px",textAlign:"center"}}>
              <div style={{fontSize:18,fontWeight:800,color:k.c}}>{k.val}</div>
              <div style={{fontSize:10,color:"#9ca3af",textTransform:"uppercase",letterSpacing:0.5}}>{k.label}</div>
            </div>
          ))}
        </div>
        <button onClick={()=>onNueva()} style={{background:color,color:"#fff",border:"none",borderRadius:8,padding:"9px 18px",cursor:"pointer",fontWeight:700,fontSize:13}}>+ Agregar tarea</button>
      </div>
      {secciones.map(seccion=>{
        const tareas=item.tareas[seccion]||[];
        return(
          <div key={seccion} style={{marginBottom:22}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,paddingBottom:7,borderBottom:`2px solid ${color}33`}}>
              <div style={{background:color,borderRadius:4,padding:"2px 12px"}}>
                <span style={{fontSize:11,fontWeight:800,color:"#fff",letterSpacing:1.5}}>{seccion}</span>
              </div>
              <span style={{fontSize:11,color:"#9ca3af"}}>{tareas.length} tarea{tareas.length!==1?"s":""}</span>
              <button onClick={()=>onNueva(seccion)} style={{marginLeft:"auto",background:"none",border:`1px dashed ${color}88`,borderRadius:6,padding:"3px 10px",color,fontSize:11,cursor:"pointer",fontWeight:600}}>+ agregar</button>
            </div>
            {tareas.length===0&&<div style={{padding:"8px 12px",fontSize:12,color:"#d1d5db",fontStyle:"italic"}}>Sin tareas.</div>}
            {tareas.map((t,i)=>{
              const dias=diasHasta(t.vencimiento);
              const urgente=dias!==null&&dias<=7&&t.estado!=="Completado";
              const st=ESTADO_STYLE[t.estado]||ESTADO_STYLE["En espera"];
              return(
                <div key={t.id} style={{
                  display:"grid",gridTemplateColumns:"28px minmax(0,2fr) 75px 90px minmax(80px,1fr) 120px 32px",
                  alignItems:"center",gap:0,
                  background:t.estado==="Completado"?"#f0faf4":urgente?"#fff5f5":i%2===0?"#fff":"#fafafa",
                  borderLeft:urgente?"3px solid #b91c1c":t.estado==="Completado"?"3px solid #1a7a3c":"3px solid transparent",
                  borderBottom:"1px solid #f0f0f0",opacity:t.estado==="Completado"?0.8:1,
                }}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"4px 0",gap:1}}>
                    <button onClick={()=>onMover(seccion,i,-1)} disabled={i===0}
                      style={{background:"none",border:"none",cursor:i===0?"default":"pointer",color:i===0?"#e5e7eb":"#9ca3af",fontSize:11,padding:"1px 4px",lineHeight:1}}
                      onMouseOver={e=>{if(i>0)e.currentTarget.style.color=color}}
                      onMouseOut={e=>e.currentTarget.style.color=i===0?"#e5e7eb":"#9ca3af"}>▲</button>
                    <button onClick={()=>onMover(seccion,i,1)} disabled={i===tareas.length-1}
                      style={{background:"none",border:"none",cursor:i===tareas.length-1?"default":"pointer",color:i===tareas.length-1?"#e5e7eb":"#9ca3af",fontSize:11,padding:"1px 4px",lineHeight:1}}
                      onMouseOver={e=>{if(i<tareas.length-1)e.currentTarget.style.color=color}}
                      onMouseOut={e=>e.currentTarget.style.color=i===tareas.length-1?"#e5e7eb":"#9ca3af"}>▼</button>
                  </div>
                  <div style={{padding:"11px 10px",fontSize:13,color:t.estado==="Completado"?"#6b7280":"#111",fontWeight:500,textDecoration:t.estado==="Completado"?"line-through":"none"}}>{t.tarea}</div>
                  <div style={{padding:"11px 6px",fontSize:12,color:"#6b7280"}}>{t.responsable}</div>
                  <div style={{padding:"11px 6px"}}>
                    <span style={{background:st.bg,color:st.text,border:`1px solid ${st.border}`,borderRadius:4,padding:"2px 7px",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{t.estado}</span>
                  </div>
                  <div style={{padding:"11px 6px",display:"flex",alignItems:"center",gap:6}}>
                    <div style={{flex:1}}><Barra valor={t.progreso} color={t.estado==="Completado"?"#1a7a3c":color}/></div>
                    <span style={{fontSize:11,color:"#9ca3af",minWidth:26}}>{t.progreso}%</span>
                  </div>
                  <div style={{padding:"11px 6px",fontSize:11,color:"#9ca3af",display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                    <span>{formatFecha(t.vencimiento)}</span>
                    <Alerta dias={dias} completado={t.estado==="Completado"}/>
                    {t.nota&&<span style={{color:"#c0c0c0",fontStyle:"italic",fontSize:10,display:"block",width:"100%"}}>{t.nota}</span>}
                  </div>
                  <div style={{padding:"11px 4px",display:"flex",justifyContent:"center"}}>
                    <button onClick={()=>onEdit(t,seccion)} style={{background:"none",border:"none",color:"#d1d5db",cursor:"pointer",fontSize:15,padding:4,borderRadius:4}}
                      onMouseOver={e=>e.currentTarget.style.color=color}
                      onMouseOut={e=>e.currentTarget.style.color="#d1d5db"}>✎</button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function TabVentasGeneral({nombre,ventas,item,color,onEditarVentas,onEditarItem}) {
  const v=ventas||{};
  const pctD=v.total>0?Math.round((v.deptos/v.total)*100):0;
  const pctE=v.totalEstac>0?Math.round((v.estac/v.totalEstac)*100):0;
  return(
    <div>
      <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginBottom:16}}>
        <button onClick={onEditarItem} style={{background:"#f3f4f6",border:"1px solid #e5e7eb",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:13,color:"#374151",fontWeight:600}}>✎ Editar proyecto</button>
        <button onClick={onEditarVentas} style={{background:"#f3f4f6",border:"1px solid #e5e7eb",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:13,color:"#374151",fontWeight:600}}>✎ Editar ventas</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:20}}>
        {[{label:"Avance ventas",valor:`${v.avanceVentas||0}%`,c:color},{label:"Dptos vendidos",valor:v.deptos||0,c:color},{label:"Por vender",valor:v.porVender||0,c:"#6b7280"},{label:"Velocidad",valor:`${v.velocidad||0} u/m`,c:"#6b7280"}].map(k=>(
          <div key={k.label} style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:12,padding:"14px 16px"}}>
            <div style={{fontSize:10,color:"#9ca3af",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{k.label}</div>
            <div style={{fontSize:24,fontWeight:800,color:k.c}}>{k.valor}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        {[{titulo:"Departamentos",vendidos:v.deptos||0,porVender:v.porVender||0,total:v.total||0,pct:pctD},{titulo:"Estacionamientos",vendidos:v.estac||0,porVender:v.porVenderEstac||0,total:v.totalEstac||0,pct:pctE}].map(b=>(
          <div key={b.titulo} style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:12,padding:"16px 18px"}}>
            <div style={{fontSize:13,fontWeight:700,color:"#374151",marginBottom:10}}>{b.titulo}</div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
              <span style={{fontSize:13,color:"#6b7280"}}>Vendidos</span>
              <span style={{fontSize:13,fontWeight:700,color}}>{b.vendidos} ({b.pct}%)</span>
            </div>
            <Barra valor={b.pct} color={color}/>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
              <span style={{fontSize:12,color:"#9ca3af"}}>Por vender: {b.porVender}</span>
              <span style={{fontSize:12,color:"#9ca3af"}}>Total: {b.total}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:12,padding:"14px 18px"}}>
        <div style={{fontSize:13,fontWeight:700,color:"#374151",marginBottom:8}}>Cronograma</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          <div style={{fontSize:13,color:"#6b7280"}}>Fin de obra: <strong style={{color:"#111"}}>{item?.finObra||"—"}</strong></div>
          <div style={{fontSize:13,color:"#6b7280"}}>Fin de ventas: <strong style={{color:"#111"}}>{item?.finVentas||"—"}</strong></div>
          <div style={{fontSize:13,color:"#6b7280"}}>Fase: <strong style={{color}}>{item?.fase}</strong></div>
          <div style={{fontSize:13,color:"#6b7280"}}>Meses restantes: <strong style={{color:"#111"}}>{v.meses||0}</strong></div>
        </div>
      </div>
    </div>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────────
export default function App() {
  const [comiteActivo,setComiteActivo]=useState(null);
  return comiteActivo
    ? <VistaComite comite={comiteActivo} onVolver={()=>setComiteActivo(null)}/>
    : <PantallaInicio onSeleccionar={setComiteActivo}/>;
}
