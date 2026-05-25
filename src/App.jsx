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

async function guardarEnNube(orden, proyData, ventas) {
  try { await setDoc(doc(db, "binda", "estado"), { orden, proyData, ventas }); }
  catch (e) { console.error("Error guardando:", e); }
}
async function cargarDeNube() {
  try {
    const snap = await getDoc(doc(db, "binda", "estado"));
    if (snap.exists()) return snap.data();
  } catch (e) { console.error("Error cargando:", e); }
  return null;
}

// ============================================================
//  DATOS INICIALES
// ============================================================
const ORDEN_INICIAL = [
  "MILANO","BRICK","BUENAVISTA","PARK 55",
  "JARDINES DE COLONIAL","BOHEME","VIEW PARK","ESENZA"
];

const VENTAS_INICIAL = {
  MILANO:                { avanceVentas:94, deptos:81, porVender:5,   total:86,  estac:80, porVenderEstac:11, totalEstac:91, velocidad:2.5, meses:2    },
  BRICK:                 { avanceVentas:71, deptos:50, porVender:20,  total:70,  estac:49, porVenderEstac:26, totalEstac:75, velocidad:1.5, meses:13.3 },
  BUENAVISTA:            { avanceVentas:21, deptos:36, porVender:128, total:164, estac:11, porVenderEstac:49, totalEstac:60, velocidad:4,   meses:32   },
  "PARK 55":             { avanceVentas:27, deptos:21, porVender:123, total:144, estac:8,  porVenderEstac:47, totalEstac:55, velocidad:3.5, meses:38.6 },
  "JARDINES DE COLONIAL":{ avanceVentas:34, deptos:78, porVender:148, total:226, estac:21, porVenderEstac:59, totalEstac:80, velocidad:6,   meses:24.7 },
  BOHEME:                { avanceVentas:12, deptos:29, porVender:143, total:172, estac:19, porVenderEstac:49, totalEstac:68, velocidad:4,   meses:35.75},
  "VIEW PARK":           { avanceVentas:0,  deptos:0,  porVender:135, total:135, estac:0,  porVenderEstac:52, totalEstac:52, velocidad:2,   meses:39.5 },
  ESENZA:                { avanceVentas:0,  deptos:0,  porVender:79,  total:79,  estac:0,  porVenderEstac:36, totalEstac:36, velocidad:2,   meses:39.5 },
};

const PROYECTOS_INICIAL = {
  MILANO: {
    color:"#B8860B", fase:"Fin de Obra", finObra:"15/05/2026", finVentas:"21/07/2026",
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
        {id:1,tarea:"CONEXION ELECTRICA",        responsable:"Roy",estado:"En Proceso",progreso:75,vencimiento:"2026-05-31",nota:"Medidores pagados. Pendiente instalación"},
        {id:2,tarea:"CONEXION AGUA Y DESAGUE",   responsable:"Roy",estado:"En Proceso",progreso:95,vencimiento:"2026-05-31",nota:"En espera de conexiones SEDAPAL"},
        {id:3,tarea:"CONEXIÓN DE GAS NATURAL",   responsable:"Roy",estado:"En Proceso",progreso:90,vencimiento:"2026-04-15",nota:"En proceso"},
        {id:4,tarea:"DOSIER DE CALIDAD",         responsable:"Roy",estado:"En Proceso",progreso:95,vencimiento:"2026-05-15",nota:"Falta documentos Nelly. Acabados 90%"},
        {id:5,tarea:"EXPEDIENTE DE CONFORMIDAD", responsable:"Roy",estado:"En Proceso",progreso:95,vencimiento:"2026-05-15",nota:"Planos AS BUILT al 100% (con obs)"},
      ],
      MARKETING:  [{id:6,tarea:"EVENTO JUNTA DE PROPIETARIOS",responsable:"Kate", estado:"En Proceso",progreso:50,vencimiento:"2026-05-22",nota:"Miércoles 20-May guion detallado"}],
      COMERCIAL:  [{id:7,tarea:"SEGUIMIENTO A VENTAS",         responsable:"Klaus",estado:"En Proceso",progreso:95,vencimiento:"2026-09-15",nota:""}],
      FINANCIEROS:[],LEGALES:[],
    }
  },
  BRICK:{
    color:"#C0392B",fase:"Construcción",finObra:"15/11/2026",finVentas:"01/07/2027",
    tareas:{
      OBRA:[
        {id:101,tarea:"HITO 1: CASCO Y ESTRUCTURA",     responsable:"Bryan",estado:"Completado",progreso:100,vencimiento:"2025-10-01",nota:""},
        {id:102,tarea:"HITO 2: INSTALACIONES",          responsable:"Bryan",estado:"Completado",progreso:100,vencimiento:"2026-01-01",nota:""},
        {id:103,tarea:"HITO 3: ACABADOS HÚMEDOS (SSCC)",responsable:"Bryan",estado:"Completado",progreso:100,vencimiento:"2026-03-15",nota:""},
        {id:104,tarea:"HITO 4: ACABADOS HÚMEDOS",       responsable:"Bryan",estado:"En Proceso", progreso:77, vencimiento:"2026-05-27",nota:""},
        {id:105,tarea:"HITO 5: ACABADOS INTERIORES",    responsable:"Bryan",estado:"En Proceso", progreso:32, vencimiento:"2026-08-26",nota:""},
      ],
      GESTIÓN:[
        {id:1,tarea:"LICITACION DE PARTIDAS",responsable:"Jesus",estado:"Completado",progreso:100,vencimiento:"2025-03-31",nota:""},
        {id:2,tarea:"PILOTO EN OBRA",         responsable:"Jesus",estado:"Completado",progreso:100,vencimiento:"2026-04-06",nota:""},
      ],
      MARKETING:  [{id:3,tarea:"IMPLEMENTACION PILOTO EN OBRA",responsable:"Kate", estado:"En Proceso",progreso:100,vencimiento:"2026-05-10",nota:""}],
      COMERCIAL:  [{id:4,tarea:"VENTA AL 75%",                  responsable:"Klaus",estado:"En Proceso",progreso:85, vencimiento:"2026-09-11",nota:""}],
      FINANCIEROS:[],LEGALES:[],
    }
  },
  BUENAVISTA:{
    color:"#2980B9",fase:"Construcción",finObra:"15/07/2028",finVentas:"13/05/2029",
    tareas:{
      OBRA:[{id:101,tarea:"HITO 1: FIN DE CIMENTACIONES",responsable:"Bryan",estado:"En Proceso",progreso:5,vencimiento:"2026-09-04",nota:""}],
      GESTIÓN:[
        {id:1,tarea:"CONTRATO CON CONSTRUCTORA",  responsable:"Roy",  estado:"Completado",progreso:100,vencimiento:"2025-11-01",nota:""},
        {id:2,tarea:"PRE CERT. BONO VERDE Y EDGE",responsable:"Jesus",estado:"En Proceso", progreso:90, vencimiento:"2026-03-15",nota:"Falta CERT. Bono Verde. EDGE OK"},
      ],
      MARKETING:[
        {id:3,tarea:"IMPLEMENTACION SV Y DPTO PILOTO",responsable:"Kate",estado:"Completado",progreso:100,vencimiento:"2025-06-01",nota:""},
        {id:4,tarea:"RELANZAMIENTO DE CAMPAÑA",       responsable:"Kate",estado:"En espera", progreso:0,  vencimiento:"2026-06-29",nota:"Postergado hasta reinicio obra"},
      ],
      COMERCIAL:  [{id:5,tarea:"VENTA AL 25%",        responsable:"Klaus", estado:"En Proceso",progreso:80,vencimiento:"2026-05-30",nota:""}],
      FINANCIEROS:[{id:6,tarea:"INFORME DE VIABILIDAD",responsable:"Mirtha",estado:"En Proceso",progreso:90,vencimiento:"2026-04-15",nota:"Falta info Jesús"}],
      LEGALES:[],
    }
  },
  "PARK 55":{
    color:"#D4A017",fase:"Pre-venta",finObra:"—",finVentas:"24/01/2028",
    tareas:{
      OBRA:[],
      GESTIÓN:[
        {id:1,tarea:"APROBACIÓN PROY. VÍA COMISIÓN",responsable:"Roy",estado:"En Proceso",progreso:85,vencimiento:"2026-05-15",nota:"Ingresó levant. estructuras. Falta especialidades"},
        {id:2,tarea:"LICENCIA DE CONSTRUCCION",      responsable:"Roy",estado:"En espera", progreso:0, vencimiento:"2026-05-31",nota:""},
      ],
      MARKETING:[],
      COMERCIAL:[{id:3,tarea:"VENTA AL 25%",responsable:"Klaus",estado:"En espera",progreso:10,vencimiento:"2026-10-02",nota:""}],
      FINANCIEROS:[],LEGALES:[],
    }
  },
  "JARDINES DE COLONIAL":{
    color:"#27AE60",fase:"Pre-construcción",finObra:"30/12/2027",finVentas:"10/06/2028",
    tareas:{
      OBRA:[{id:101,tarea:"DEMOLICION DE EDIFICIO",responsable:"Roy",estado:"En Proceso",progreso:85,vencimiento:"2026-05-31",nota:"TDR Aprobado"}],
      GESTIÓN:[
        {id:1,tarea:"FACTIBILIDADES APROBADAS",      responsable:"Roy",estado:"Completado",progreso:100,vencimiento:"2025-12-15",nota:""},
        {id:2,tarea:"APROBACIÓN PROY. VÍA COMISIÓN", responsable:"Roy",estado:"En Proceso", progreso:100,vencimiento:"2026-05-15",nota:"ITF Aprobado"},
        {id:3,tarea:"LICENCIA DE CONSTRUCCION",      responsable:"Roy",estado:"En espera",  progreso:0,  vencimiento:"2026-05-29",nota:"Entrega 22 Mayo a Muni Callao"},
      ],
      MARKETING:  [{id:4,tarea:"IMPLEMENTACION SV Y DPTO PILOTO",responsable:"Kate",  estado:"Completado",progreso:100,vencimiento:"2025-03-15",nota:""}],
      COMERCIAL:[],
      FINANCIEROS:[{id:5,tarea:"VALIDACION DE PRE VENTA",        responsable:"Mirtha",estado:"En Proceso",progreso:15,vencimiento:"2026-05-29",nota:""}],
      LEGALES:[],
    }
  },
  BOHEME:{
    color:"#8E44AD",fase:"Pre-venta",finObra:"—",finVentas:"15/12/2027",
    tareas:{
      OBRA:[],
      GESTIÓN:[
        {id:1,tarea:"GESTION DE FACTIBILIDADES",    responsable:"Roy",estado:"En Proceso",progreso:90,vencimiento:"2026-02-28",nota:"Falta SEDAPAL"},
        {id:2,tarea:"APROBACIÓN PROY. VÍA COMISIÓN",responsable:"Roy",estado:"En espera", progreso:0, vencimiento:"2026-06-06",nota:"Via revisores urbanos"},
      ],
      MARKETING:  [{id:3,tarea:"ENTREGA DE GESTIÓN A LA MURALLA",responsable:"Kate", estado:"En Proceso",progreso:15,vencimiento:"2026-05-30",nota:""}],
      COMERCIAL:  [{id:4,tarea:"VENTA AL 25%",                    responsable:"Klaus",estado:"En Proceso",progreso:10,vencimiento:"2026-09-24",nota:""}],
      FINANCIEROS:[],LEGALES:[],
    }
  },
  "VIEW PARK":{
    color:"#16A085",fase:"Desarrollo",finObra:"—",finVentas:"—",
    tareas:{
      OBRA:[{id:101,tarea:"DEMOLICION (Casa de Ramón)",    responsable:"Jesus",    estado:"En Proceso",progreso:95,vencimiento:"2026-05-13",nota:""}],
      GESTIÓN:[
        {id:1,tarea:"APROBACION DE ANTEPROYECTO",responsable:"Jesus",estado:"En Proceso",progreso:85,vencimiento:"2026-05-22",nota:""},
        {id:2,tarea:"ESTUDIOS PRELIMINARES",      responsable:"Jesus",estado:"En Proceso",progreso:35,vencimiento:"2026-04-29",nota:""},
      ],
      MARKETING:  [{id:3,tarea:"DESARROLLO MATERIAL COMERCIAL",  responsable:"Kate",     estado:"En Proceso",progreso:1, vencimiento:"2026-05-20",nota:"Decorcenter Lunes 25 Mayo"}],
      COMERCIAL:[],FINANCIEROS:[],
      LEGALES:[{id:4,tarea:"PRESCRIPCION ADQUISITIVA DOMINIO",responsable:"Miguel C.",estado:"En Proceso",progreso:65,vencimiento:"2026-06-15",nota:"Anotación preventiva observada"}],
    }
  },
  ESENZA:{
    color:"#E74C3C",fase:"Desarrollo",finObra:"—",finVentas:"—",
    tareas:{
      OBRA:[],
      GESTIÓN:[
        {id:1,tarea:"DESARROLLO DE ANTEPROYECTO",responsable:"Roy",estado:"Completado",progreso:100,vencimiento:"2026-05-15",nota:""},
        {id:2,tarea:"APROBACION DE ANTEPROYECTO",responsable:"Roy",estado:"En espera", progreso:50, vencimiento:"2026-05-31",nota:""},
        {id:3,tarea:"DESARROLLO DE PRODUCTO",    responsable:"Roy",estado:"En Proceso",progreso:10, vencimiento:"2026-05-30",nota:"Martes 26 muestra de acabados"},
      ],
      MARKETING:  [{id:4,tarea:"LAYOUT DE SALA DE VENTAS",responsable:"Kate",estado:"En Proceso",progreso:35,vencimiento:"2026-05-05",nota:""}],
      COMERCIAL:[],FINANCIEROS:[],LEGALES:[],
    }
  },
};

const ESTADOS      = ["En Proceso","En espera","Completado","Bloqueado"];
const SECCIONES    = ["OBRA","GESTIÓN","MARKETING","COMERCIAL","FINANCIEROS","LEGALES"];
const RESPONSABLES = ["Roy","Kate","Klaus","Bryan","Mirtha","Jesus","Italo","Miguel C."];
const COLORES      = ["#B8860B","#C0392B","#2980B9","#D4A017","#27AE60","#8E44AD","#16A085","#E74C3C","#D35400","#1ABC9C","#2C3E50","#7F8C8D"];

const ESTADO_STYLE = {
  "Completado":{bg:"#e6f4ec",text:"#1a7a3c",border:"#a3d9b5"},
  "En Proceso": {bg:"#fff8e1",text:"#8a6000",border:"#f5cc5a"},
  "En espera":  {bg:"#f5f5f5",text:"#777",   border:"#ccc"   },
  "Bloqueado":  {bg:"#fde8e8",text:"#b91c1c",border:"#f5a5a5"},
};

const HOY = new Date();
function diasHasta(f){if(!f)return null;const d=new Date(f);if(isNaN(d))return null;return Math.ceil((d-HOY)/86400000);}
function formatFecha(s){if(!s)return"—";const d=new Date(s);if(isNaN(d))return s;return d.toLocaleDateString("es-PE",{day:"2-digit",month:"2-digit",year:"numeric"});}
function hexToRgb(h){return[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];}

function generarPDF(orden, proyData, ventas) {
  const pdf = new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
  const W=210,H=297;
  const fechaHoy = new Date().toLocaleDateString("es-PE",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).toUpperCase();

  // PORTADA
  pdf.setFillColor(15,23,42); pdf.rect(0,0,W,H,"F");
  pdf.setFillColor(30,41,59); pdf.rect(0,H*0.35,W,H*0.3,"F");
  pdf.setDrawColor(184,134,11); pdf.setLineWidth(1.2);
  pdf.line(30,H*0.32,W-30,H*0.32); pdf.line(30,H*0.65,W-30,H*0.65);
  pdf.setTextColor(184,134,11); pdf.setFontSize(11); pdf.setFont("helvetica","bold");
  pdf.text("BINDA",W/2,H*0.25,{align:"center"});
  pdf.setTextColor(255,255,255); pdf.setFontSize(24);
  pdf.text("ACTA DE COMITÉ",W/2,H*0.42,{align:"center"});
  pdf.setFontSize(18); pdf.text("COMERCIAL Y PROYECTOS",W/2,H*0.50,{align:"center"});
  pdf.setDrawColor(184,134,11); pdf.setLineWidth(0.5);
  pdf.line(W/2-30,H*0.535,W/2+30,H*0.535);
  pdf.setTextColor(180,180,180); pdf.setFontSize(10); pdf.setFont("helvetica","normal");
  pdf.text(fechaHoy,W/2,H*0.58,{align:"center"});
  pdf.setTextColor(100,100,100); pdf.setFontSize(8);
  pdf.text(`${orden.length} PROYECTOS`,W/2,H*0.72,{align:"center"});

  orden.forEach(nombre=>{
    const d=proyData[nombre]; const v=ventas[nombre];
    if(!d||!v) return;
    const [r,g,b]=hexToRgb(d.color);

    // CARÁTULA proyecto
    pdf.addPage();
    pdf.setFillColor(15,23,42); pdf.rect(0,0,W,H,"F");
    pdf.setFillColor(r,g,b); pdf.rect(0,H*0.38,W,H*0.24,"F");
    pdf.setDrawColor(r,g,b); pdf.setLineWidth(0.8);
    pdf.line(20,H*0.36,W-20,H*0.36); pdf.line(20,H*0.64,W-20,H*0.64);
    pdf.setTextColor(r,g,b); pdf.setFontSize(9); pdf.setFont("helvetica","bold");
    pdf.text("COMITÉ DE LUNES — BINDA",W/2,H*0.28,{align:"center"});
    pdf.setTextColor(255,255,255); pdf.setFontSize(28);
    pdf.text(nombre,W/2,H*0.48,{align:"center"});
    pdf.setFontSize(11); pdf.text(d.fase.toUpperCase(),W/2,H*0.55,{align:"center"});
    pdf.setTextColor(200,200,200); pdf.setFontSize(9); pdf.setFont("helvetica","normal");
    pdf.text(fechaHoy,W/2,H*0.70,{align:"center"});
    const kpis=[{label:"AVANCE VENTAS",valor:`${v.avanceVentas}%`},{label:"DPTOS VENDIDOS",valor:`${v.deptos}/${v.total}`},{label:"FIN DE OBRA",valor:d.finObra},{label:"FIN DE VENTAS",valor:d.finVentas}];
    const kpiY=H*0.78; const kpiW=(W-40)/4;
    kpis.forEach((k,i)=>{
      const x=20+i*kpiW;
      pdf.setFillColor(30,41,59); pdf.roundedRect(x,kpiY,kpiW-4,22,2,2,"F");
      pdf.setTextColor(r,g,b); pdf.setFontSize(13); pdf.setFont("helvetica","bold");
      pdf.text(k.valor,x+(kpiW-4)/2,kpiY+10,{align:"center"});
      pdf.setTextColor(150,150,150); pdf.setFontSize(6.5); pdf.setFont("helvetica","normal");
      pdf.text(k.label,x+(kpiW-4)/2,kpiY+17,{align:"center"});
    });

    // DETALLE proyecto
    pdf.addPage();
    pdf.setFillColor(15,23,42); pdf.rect(0,0,W,22,"F");
    pdf.setFillColor(r,g,b); pdf.rect(0,0,4,22,"F");
    pdf.setTextColor(255,255,255); pdf.setFontSize(13); pdf.setFont("helvetica","bold");
    pdf.text(nombre,10,10);
    pdf.setFontSize(8); pdf.setFont("helvetica","normal"); pdf.setTextColor(180,180,180);
    pdf.text(d.fase.toUpperCase(),10,17);
    pdf.setTextColor(150,150,150); pdf.text(fechaHoy,W-10,10,{align:"right"});

    let y=30;
    const kpiData=[
      {label:"AVANCE VENTAS",   valor:`${v.avanceVentas}%`},
      {label:"DPTOS VENDIDOS",  valor:`${v.deptos}/${v.total}`},
      {label:"ESTAC. VENDIDOS", valor:`${v.estac}/${v.totalEstac}`},
      {label:"VELOCIDAD",       valor:`${v.velocidad} u/mes`},
      {label:"MESES RESTANTES", valor:`${v.meses}`},
      {label:"FIN DE OBRA",     valor:d.finObra},
    ];
    const kW=(W-20)/3;
    kpiData.forEach((k,i)=>{
      const col=i%3; const row=Math.floor(i/3);
      const kx=10+col*kW; const ky=y+row*18;
      pdf.setFillColor(245,247,250); pdf.roundedRect(kx,ky,kW-3,15,1.5,1.5,"F");
      pdf.setDrawColor(r,g,b); pdf.setLineWidth(0.4); pdf.line(kx,ky,kx,ky+15);
      pdf.setTextColor(r,g,b); pdf.setFontSize(11); pdf.setFont("helvetica","bold");
      pdf.text(k.valor,kx+6,ky+8);
      pdf.setTextColor(130,130,130); pdf.setFontSize(6.5); pdf.setFont("helvetica","normal");
      pdf.text(k.label,kx+6,ky+13);
    });
    y+=40;
    pdf.setFillColor(230,230,230); pdf.roundedRect(10,y,W-20,5,2,2,"F");
    pdf.setFillColor(r,g,b); pdf.roundedRect(10,y,(W-20)*(v.avanceVentas/100),5,2,2,"F");
    pdf.setTextColor(80,80,80); pdf.setFontSize(7);
    pdf.text(`Avance de ventas: ${v.avanceVentas}%`,10,y+10);
    y+=16;

    SECCIONES.forEach(seccion=>{
      const tareas=(d.tareas[seccion]||[]);
      if(tareas.length===0) return;
      if(y>H-40){pdf.addPage();y=15;}
      pdf.setFillColor(r,g,b); pdf.roundedRect(10,y,W-20,8,1,1,"F");
      pdf.setTextColor(255,255,255); pdf.setFontSize(8); pdf.setFont("helvetica","bold");
      pdf.text(seccion,15,y+5.5);
      pdf.text(`${tareas.length} tarea${tareas.length!==1?"s":""}`,W-15,y+5.5,{align:"right"});
      y+=11;
      autoTable(pdf,{
        startY:y, margin:{left:10,right:10},
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
        didDrawPage:()=>{}
      });
      y=pdf.lastAutoTable.finalY+6;
    });
  });
  pdf.save(`Acta_Comite_Binda_${new Date().toLocaleDateString("es-PE").replace(/\//g,"-")}.pdf`);
}

// ── Componentes UI ────────────────────────────────────────────
function Alerta({dias,completado}){
  if(completado||dias===null) return null;
  if(dias<0)  return <span style={{background:"#fde8e8",color:"#b91c1c",border:"1px solid #f5a5a5",borderRadius:4,padding:"1px 7px",fontSize:10,fontWeight:700}}>VENCIDO</span>;
  if(dias===0) return <span style={{background:"#fde8e8",color:"#b91c1c",border:"1px solid #f5a5a5",borderRadius:4,padding:"1px 7px",fontSize:10,fontWeight:700}}>HOY</span>;
  if(dias<=7)  return <span style={{background:"#fff3cd",color:"#856404",border:"1px solid #ffc107",borderRadius:4,padding:"1px 7px",fontSize:10,fontWeight:700}}>+{dias}d</span>;
  return null;
}
function Barra({valor,color}){
  return <div style={{width:"100%",height:6,background:"#e5e7eb",borderRadius:3,overflow:"hidden"}}><div style={{width:`${Math.min(100,Math.max(0,valor))}%`,height:"100%",background:color,borderRadius:3}}/></div>;
}
function GuardadoIndicador({estado}){
  const e={guardando:{bg:"#fff3cd",text:"#856404",msg:"Guardando..."},guardado:{bg:"#e6f4ec",text:"#1a7a3c",msg:"✓ Guardado"},error:{bg:"#fde8e8",text:"#b91c1c",msg:"Error al guardar"}};
  const s=e[estado]; if(!s) return null;
  return <div style={{background:s.bg,color:s.text,border:`1px solid ${s.text}44`,borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:600}}>{s.msg}</div>;
}

function ModalNuevoProyecto({onSave,onClose}){
  const [form,setForm]=useState({nombre:"",fase:"Pre-venta",finObra:"—",finVentas:"—",color:"#2980B9"});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:16,width:"100%",maxWidth:440,boxShadow:"0 20px 60px rgba(0,0,0,0.15)"}}>
        <div style={{padding:"18px 24px 14px",borderBottom:"1px solid #f0f0f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontWeight:700,fontSize:16,color:"#111"}}>Nuevo proyecto</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#999",fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{padding:24,display:"flex",flexDirection:"column",gap:14}}>
          <div>
            <label style={{fontSize:11,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:5}}>Nombre del proyecto</label>
            <input value={form.nombre} onChange={e=>set("nombre",e.target.value.toUpperCase())}
              style={{width:"100%",border:"1px solid #e5e7eb",borderRadius:8,padding:"9px 12px",fontSize:13,boxSizing:"border-box",color:"#111"}} />
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <label style={{fontSize:11,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:5}}>Fase</label>
              <input value={form.fase} onChange={e=>set("fase",e.target.value)}
                style={{width:"100%",border:"1px solid #e5e7eb",borderRadius:8,padding:"9px 12px",fontSize:13,boxSizing:"border-box",color:"#111"}} />
            </div>
            <div>
              <label style={{fontSize:11,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:5}}>Color</label>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {COLORES.map(c=>(
                  <div key={c} onClick={()=>set("color",c)} style={{width:22,height:22,borderRadius:"50%",background:c,cursor:"pointer",border:form.color===c?"3px solid #111":"2px solid transparent"}} />
                ))}
              </div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <label style={{fontSize:11,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:5}}>Fin de obra</label>
              <input value={form.finObra} onChange={e=>set("finObra",e.target.value)} placeholder="ej: 15/05/2026"
                style={{width:"100%",border:"1px solid #e5e7eb",borderRadius:8,padding:"9px 12px",fontSize:13,boxSizing:"border-box",color:"#111"}} />
            </div>
            <div>
              <label style={{fontSize:11,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:5}}>Fin de ventas</label>
              <input value={form.finVentas} onChange={e=>set("finVentas",e.target.value)} placeholder="ej: 21/07/2026"
                style={{width:"100%",border:"1px solid #e5e7eb",borderRadius:8,padding:"9px 12px",fontSize:13,boxSizing:"border-box",color:"#111"}} />
            </div>
          </div>
          <button onClick={()=>form.nombre.trim()&&onSave(form)} style={{background:form.color,color:"#fff",border:"none",borderRadius:8,padding:"12px",cursor:"pointer",fontWeight:700,fontSize:14}}>
            Crear proyecto
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalEditarProyecto({nombre,data,color,onSave,onClose}){
  const [form,setForm]=useState({fase:data.fase,finObra:data.finObra,finVentas:data.finVentas});
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:16,width:"100%",maxWidth:400,boxShadow:"0 20px 60px rgba(0,0,0,0.15)"}}>
        <div style={{padding:"18px 24px 14px",borderBottom:"1px solid #f0f0f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontWeight:700,fontSize:16,color:"#111"}}>Editar proyecto — {nombre}</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#999",fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{padding:24,display:"flex",flexDirection:"column",gap:14}}>
          {[{k:"fase",label:"Fase actual"},{k:"finObra",label:"Fecha fin de obra"},{k:"finVentas",label:"Fecha fin de ventas"}].map(({k,label})=>(
            <div key={k}>
              <label style={{fontSize:11,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:5}}>{label}</label>
              <input value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}
                style={{width:"100%",border:"1px solid #e5e7eb",borderRadius:8,padding:"9px 12px",fontSize:13,boxSizing:"border-box",color:"#111"}} />
            </div>
          ))}
          <button onClick={()=>onSave(form)} style={{background:color,color:"#fff",border:"none",borderRadius:8,padding:"12px",cursor:"pointer",fontWeight:700,fontSize:14}}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

function ModalVentas({nombre,ventas,color,onSave,onClose}){
  const [form,setForm]=useState({...ventas});
  const set=(k,v)=>setForm(f=>({...f,[k]:Number(v)}));
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:16,width:"100%",maxWidth:460,boxShadow:"0 20px 60px rgba(0,0,0,0.15)"}}>
        <div style={{padding:"18px 24px 14px",borderBottom:"1px solid #f0f0f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontWeight:700,fontSize:16,color:"#111"}}>Editar ventas — {nombre}</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#999",fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{padding:24,display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {[{k:"avanceVentas",label:"% Avance ventas"},{k:"deptos",label:"Dptos vendidos"},{k:"porVender",label:"Dptos por vender"},{k:"total",label:"Total dptos"},{k:"estac",label:"Estac. vendidos"},{k:"porVenderEstac",label:"Estac. por vender"},{k:"totalEstac",label:"Total estacionamientos"},{k:"velocidad",label:"Velocidad (u/mes)"},{k:"meses",label:"Meses restantes"}].map(({k,label})=>(
            <div key={k}>
              <label style={{fontSize:11,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:5}}>{label}</label>
              <input type="number" value={form[k]} onChange={e=>set(k,e.target.value)}
                style={{width:"100%",border:"1px solid #e5e7eb",borderRadius:8,padding:"8px 12px",fontSize:14,boxSizing:"border-box",color:"#111",fontWeight:600}} />
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

function ModalTarea({tarea,color,seccion,proyectoNombre,onSave,onDelete,onClose}){
  const [form,setForm]=useState(tarea?{...tarea,seccion}:{id:Date.now(),tarea:"",responsable:"Roy",estado:"En Proceso",progreso:0,vencimiento:"",nota:"",seccion:seccion||"GESTIÓN"});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:16,width:"100%",maxWidth:500,boxShadow:"0 20px 60px rgba(0,0,0,0.15)"}}>
        <div style={{padding:"18px 24px 14px",borderBottom:"1px solid #f0f0f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontWeight:700,fontSize:16,color:"#111"}}>{tarea?"Editar tarea":"Nueva tarea"} — {proyectoNombre}</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#999",fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{padding:24,display:"flex",flexDirection:"column",gap:14}}>
          <div>
            <label style={{fontSize:11,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:5}}>Tarea</label>
            <input value={form.tarea} onChange={e=>set("tarea",e.target.value.toUpperCase())}
              style={{width:"100%",border:"1px solid #e5e7eb",borderRadius:8,padding:"9px 12px",fontSize:13,boxSizing:"border-box",color:"#111"}} />
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <label style={{fontSize:11,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:5}}>Sección</label>
              <select value={form.seccion} onChange={e=>set("seccion",e.target.value)} style={{width:"100%",border:"1px solid #e5e7eb",borderRadius:8,padding:"9px 12px",fontSize:13,color:"#111"}}>
                {SECCIONES.map(s=><option key={s}>{s}</option>)}
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
                style={{width:"100%",border:"1px solid #e5e7eb",borderRadius:8,padding:"9px 12px",fontSize:13,boxSizing:"border-box",color:"#111"}} />
            </div>
          </div>
          <div>
            <label style={{fontSize:11,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:5}}>Progreso: {form.progreso}%</label>
            <input type="range" min="0" max="100" step="5" value={form.progreso} onChange={e=>set("progreso",Number(e.target.value))} style={{width:"100%",accentColor:color}} />
          </div>
          <div>
            <label style={{fontSize:11,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:5}}>Nota</label>
            <input value={form.nota} onChange={e=>set("nota",e.target.value)}
              style={{width:"100%",border:"1px solid #e5e7eb",borderRadius:8,padding:"9px 12px",fontSize:13,boxSizing:"border-box",color:"#555"}} />
          </div>
          <div style={{display:"flex",gap:10,marginTop:4}}>
            <button onClick={()=>onSave(form)} style={{flex:1,background:color,color:"#fff",border:"none",borderRadius:8,padding:"12px",cursor:"pointer",fontWeight:700,fontSize:14}}>Guardar</button>
            {tarea&&<button onClick={()=>onDelete(tarea.id,seccion)} style={{background:"#fde8e8",color:"#b91c1c",border:"1px solid #f5a5a5",borderRadius:8,padding:"12px 20px",cursor:"pointer",fontSize:13,fontWeight:600}}>Eliminar</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabVentas({nombre,ventas,data,color,onEditar,onEditarProyecto}){
  const v=ventas;
  const pctD=v.total>0?Math.round((v.deptos/v.total)*100):0;
  const pctE=v.totalEstac>0?Math.round((v.estac/v.totalEstac)*100):0;
  return(
    <div>
      <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginBottom:16}}>
        <button onClick={onEditarProyecto} style={{background:"#f3f4f6",border:"1px solid #e5e7eb",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontSize:13,color:"#374151",fontWeight:600}}>✎ Editar proyecto</button>
        <button onClick={onEditar} style={{background:"#f3f4f6",border:"1px solid #e5e7eb",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontSize:13,color:"#374151",fontWeight:600}}>✎ Editar ventas</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(150px,1fr))",gap:12,marginBottom:24}}>
        {[{label:"Avance ventas",valor:`${v.avanceVentas}%`,color},{label:"Dptos vendidos",valor:v.deptos,color},{label:"Por vender",valor:v.porVender,color:"#6b7280"},{label:"Velocidad",valor:`${v.velocidad} u/m`,color:"#6b7280"}].map(k=>(
          <div key={k.label} style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:12,padding:"14px 18px"}}>
            <div style={{fontSize:10,color:"#9ca3af",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{k.label}</div>
            <div style={{fontSize:26,fontWeight:800,color:k.color}}>{k.valor}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        {[{titulo:"Departamentos",vendidos:v.deptos,porVender:v.porVender,total:v.total,pct:pctD},{titulo:"Estacionamientos",vendidos:v.estac,porVender:v.porVenderEstac,total:v.totalEstac,pct:pctE}].map(b=>(
          <div key={b.titulo} style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:12,padding:"18px 20px"}}>
            <div style={{fontSize:13,fontWeight:700,color:"#374151",marginBottom:12}}>{b.titulo}</div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:13,color:"#6b7280"}}>Vendidos</span>
              <span style={{fontSize:13,fontWeight:700,color}}>{b.vendidos} ({b.pct}%)</span>
            </div>
            <Barra valor={b.pct} color={color} />
            <div style={{display:"flex",justifyContent:"space-between",marginTop:10}}>
              <span style={{fontSize:12,color:"#9ca3af"}}>Por vender: {b.porVender}</span>
              <span style={{fontSize:12,color:"#9ca3af"}}>Total: {b.total}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:12,padding:"16px 20px"}}>
        <div style={{fontSize:13,fontWeight:700,color:"#374151",marginBottom:10}}>Cronograma</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <div style={{fontSize:13,color:"#6b7280"}}>Fin de obra: <strong style={{color:"#111"}}>{data.finObra}</strong></div>
          <div style={{fontSize:13,color:"#6b7280"}}>Fin de ventas: <strong style={{color:"#111"}}>{data.finVentas}</strong></div>
          <div style={{fontSize:13,color:"#6b7280"}}>Fase: <strong style={{color}}>{data.fase}</strong></div>
          <div style={{fontSize:13,color:"#6b7280"}}>Meses restantes: <strong style={{color:"#111"}}>{v.meses}</strong></div>
        </div>
      </div>
    </div>
  );
}

function TabTareas({data,color,activo,onEdit,onNueva,onMoverTarea}){
  const todasTareas=Object.values(data.tareas).flat();
  const urgentes=todasTareas.filter(t=>{const d=diasHasta(t.vencimiento);return d!==null&&d<=7&&t.estado!=="Completado";}).length;
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {[{label:"Total",val:todasTareas.length,c:"#374151"},{label:"En proceso",val:todasTareas.filter(t=>t.estado==="En Proceso").length,c:"#8a6000"},{label:"Tareas urgentes",val:urgentes,c:urgentes>0?"#b91c1c":"#9ca3af"},{label:"Completadas",val:todasTareas.filter(t=>t.estado==="Completado").length,c:"#1a7a3c"}].map(k=>(
            <div key={k.label} style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:8,padding:"8px 14px",textAlign:"center"}}>
              <div style={{fontSize:18,fontWeight:800,color:k.c}}>{k.val}</div>
              <div style={{fontSize:10,color:"#9ca3af",textTransform:"uppercase",letterSpacing:0.5}}>{k.label}</div>
            </div>
          ))}
        </div>
        <button onClick={()=>onNueva()} style={{background:color,color:"#fff",border:"none",borderRadius:8,padding:"10px 20px",cursor:"pointer",fontWeight:700,fontSize:13}}>+ Agregar tarea</button>
      </div>
      {SECCIONES.map(seccion=>{
        const tareas=data.tareas[seccion]||[];
        return(
          <div key={seccion} style={{marginBottom:24}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,paddingBottom:8,borderBottom:`2px solid ${color}33`}}>
              <div style={{background:color,borderRadius:4,padding:"2px 12px"}}>
                <span style={{fontSize:11,fontWeight:800,color:"#fff",letterSpacing:1.5}}>{seccion}</span>
              </div>
              <span style={{fontSize:11,color:"#9ca3af"}}>{tareas.length} tarea{tareas.length!==1?"s":""}</span>
              <button onClick={()=>onNueva(seccion)} style={{marginLeft:"auto",background:"none",border:`1px dashed ${color}88`,borderRadius:6,padding:"3px 10px",color,fontSize:11,cursor:"pointer",fontWeight:600}}>+ agregar</button>
            </div>
            {tareas.length===0&&<div style={{padding:"10px 14px",fontSize:12,color:"#d1d5db",fontStyle:"italic"}}>Sin tareas.</div>}
            {tareas.map((t,i)=>{
              const dias=diasHasta(t.vencimiento);
              const urgente=dias!==null&&dias<=7&&t.estado!=="Completado";
              const st=ESTADO_STYLE[t.estado]||ESTADO_STYLE["En espera"];
              return(
                <div key={t.id} style={{
                  display:"grid",gridTemplateColumns:"28px minmax(0,2fr) 75px 90px minmax(90px,1fr) 130px 32px",
                  alignItems:"center",gap:0,
                  background:t.estado==="Completado"?"#f0faf4":urgente?"#fff5f5":i%2===0?"#fff":"#fafafa",
                  borderLeft:urgente?"3px solid #b91c1c":t.estado==="Completado"?"3px solid #1a7a3c":"3px solid transparent",
                  borderBottom:"1px solid #f0f0f0",opacity:t.estado==="Completado"?0.75:1,
                }}>
                  {/* Botones mover */}
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"4px 0",gap:1}}>
                    <button onClick={()=>onMoverTarea(seccion,i,-1)} disabled={i===0}
                      style={{background:"none",border:"none",cursor:i===0?"default":"pointer",color:i===0?"#e5e7eb":"#9ca3af",fontSize:11,padding:"1px 4px",lineHeight:1}}
                      onMouseOver={e=>{if(i>0)e.currentTarget.style.color=color}}
                      onMouseOut={e=>e.currentTarget.style.color=i===0?"#e5e7eb":"#9ca3af"}>▲</button>
                    <button onClick={()=>onMoverTarea(seccion,i,1)} disabled={i===tareas.length-1}
                      style={{background:"none",border:"none",cursor:i===tareas.length-1?"default":"pointer",color:i===tareas.length-1?"#e5e7eb":"#9ca3af",fontSize:11,padding:"1px 4px",lineHeight:1}}
                      onMouseOver={e=>{if(i<tareas.length-1)e.currentTarget.style.color=color}}
                      onMouseOut={e=>e.currentTarget.style.color=i===tareas.length-1?"#e5e7eb":"#9ca3af"}>▼</button>
                  </div>
                  <div style={{padding:"12px 10px",fontSize:13,color:t.estado==="Completado"?"#6b7280":"#111",fontWeight:500,textDecoration:t.estado==="Completado"?"line-through":"none"}}>{t.tarea}</div>
                  <div style={{padding:"12px 6px",fontSize:12,color:"#6b7280"}}>{t.responsable}</div>
                  <div style={{padding:"12px 6px"}}>
                    <span style={{background:st.bg,color:st.text,border:`1px solid ${st.border}`,borderRadius:4,padding:"2px 7px",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{t.estado}</span>
                  </div>
                  <div style={{padding:"12px 6px",display:"flex",alignItems:"center",gap:6}}>
                    <div style={{flex:1}}><Barra valor={t.progreso} color={t.estado==="Completado"?"#1a7a3c":color}/></div>
                    <span style={{fontSize:11,color:"#9ca3af",minWidth:26}}>{t.progreso}%</span>
                  </div>
                  <div style={{padding:"12px 6px",fontSize:11,color:"#9ca3af",display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                    <span>{formatFecha(t.vencimiento)}</span>
                    <Alerta dias={dias} completado={t.estado==="Completado"}/>
                    {t.nota&&<span style={{color:"#c0c0c0",fontStyle:"italic",fontSize:10,display:"block",width:"100%"}}>{t.nota}</span>}
                  </div>
                  <div style={{padding:"12px 4px",display:"flex",justifyContent:"center"}}>
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

export default function App(){
  const [orden,       setOrden]       = useState(ORDEN_INICIAL);
  const [proyData,    setProyData]    = useState(PROYECTOS_INICIAL);
  const [ventas,      setVentas]      = useState(VENTAS_INICIAL);
  const [cargando,    setCargando]    = useState(true);
  const [guardado,    setGuardado]    = useState(null);
  const [activo,      setActivo]      = useState("MILANO");
  const [tabActiva,   setTabActiva]   = useState("tareas");
  const [modalTarea,  setModalTarea]  = useState(null);
  const [seccionModal,setSeccionModal]= useState("GESTIÓN");
  const [modalVentas, setModalVentas] = useState(false);
  const [modalProy,   setModalProy]   = useState(false);
  const [modalNuevoProy,setModalNuevoProy]=useState(false);

  useEffect(()=>{
    cargarDeNube().then(data=>{
      if(data){
        if(data.orden)   setOrden(data.orden);
        if(data.proyData)setProyData(data.proyData);
        if(data.ventas)  setVentas(data.ventas);
      }
      setCargando(false);
    });
  },[]);

  useEffect(()=>{
    if(cargando) return;
    setGuardado("guardando");
    const t=setTimeout(()=>{
      guardarEnNube(orden,proyData,ventas)
        .then(()=>{setGuardado("guardado");setTimeout(()=>setGuardado(null),3000);})
        .catch(()=>setGuardado("error"));
    },800);
    return()=>clearTimeout(t);
  },[orden,proyData,ventas]);

  const data  = proyData[activo]||{};
  const venta = ventas[activo]||{};

  const totalUrgentes=orden.reduce((acc,p)=>{
    if(!proyData[p]) return acc;
    return acc+Object.values(proyData[p].tareas).flat().filter(t=>{const d=diasHasta(t.vencimiento);return d!==null&&d<=7&&t.estado!=="Completado";}).length;
  },0);

  function guardarTarea(form){
    const dest=form.seccion||seccionModal;
    setProyData(prev=>{
      const tareas={};
      SECCIONES.forEach(s=>{tareas[s]=(prev[activo].tareas[s]||[]).filter(t=>t.id!==form.id);});
      tareas[dest]=[...tareas[dest],{id:form.id,tarea:form.tarea,responsable:form.responsable,estado:form.estado,progreso:form.progreso,vencimiento:form.vencimiento,nota:form.nota}];
      return{...prev,[activo]:{...prev[activo],tareas}};
    });
    setModalTarea(null);
  }
  function eliminarTarea(id,seccion){
    setProyData(prev=>({...prev,[activo]:{...prev[activo],tareas:{...prev[activo].tareas,[seccion]:prev[activo].tareas[seccion].filter(t=>t.id!==id)}}}));
    setModalTarea(null);
  }
  function moverTarea(seccion,idx,dir){
    setProyData(prev=>{
      const tareas=[...(prev[activo].tareas[seccion]||[])];
      const nuevoIdx=idx+dir;
      if(nuevoIdx<0||nuevoIdx>=tareas.length) return prev;
      [tareas[idx],tareas[nuevoIdx]]=[tareas[nuevoIdx],tareas[idx]];
      return{...prev,[activo]:{...prev[activo],tareas:{...prev[activo].tareas,[seccion]:tareas}}};
    });
  }
  function guardarVentas(form){setVentas(prev=>({...prev,[activo]:form}));setModalVentas(false);}
  function guardarProy(form){setProyData(prev=>({...prev,[activo]:{...prev[activo],...form}}));setModalProy(false);}
  function crearProyecto(form){
    const nombre=form.nombre.trim();
    if(!nombre) return;
    setOrden(prev=>[...prev,nombre]);
    setProyData(prev=>({...prev,[nombre]:{color:form.color,fase:form.fase,finObra:form.finObra,finVentas:form.finVentas,tareas:{OBRA:[],GESTIÓN:[],MARKETING:[],COMERCIAL:[],FINANCIEROS:[],LEGALES:[]}}}));
    setVentas(prev=>({...prev,[nombre]:{avanceVentas:0,deptos:0,porVender:0,total:0,estac:0,porVenderEstac:0,totalEstac:0,velocidad:0,meses:0}}));
    setActivo(nombre);
    setModalNuevoProy(false);
  }
  function abrirNueva(seccion){setSeccionModal(seccion||"GESTIÓN");setModalTarea("nueva");}

  if(cargando) return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f3f4f6",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:28,fontWeight:800,color:"#374151",marginBottom:12}}>BINDA</div>
        <div style={{fontSize:14,color:"#9ca3af"}}>Cargando datos desde la nube...</div>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"#f3f4f6",fontFamily:"'Segoe UI',system-ui,sans-serif",color:"#111"}}>
      {/* HEADER */}
      <div style={{background:"#fff",borderBottom:"1px solid #e5e7eb",padding:"14px 28px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{fontSize:22,fontWeight:800,color:"#111",letterSpacing:1}}>BINDA</div>
          <div style={{width:1,height:20,background:"#e5e7eb"}}/>
          <div style={{fontSize:12,color:"#9ca3af",letterSpacing:2,textTransform:"uppercase"}}>Comité de Lunes</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <GuardadoIndicador estado={guardado}/>
          {totalUrgentes>0&&<div style={{background:"#fde8e8",border:"1px solid #f5a5a5",borderRadius:8,padding:"6px 14px",fontSize:12,color:"#b91c1c",fontWeight:600}}>⚑ {totalUrgentes} tareas urgentes</div>}
          <div style={{fontSize:12,color:"#9ca3af"}}>{new Date().toLocaleDateString("es-PE",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
          <button onClick={()=>generarPDF(orden,proyData,ventas)} style={{background:data.color,color:"#fff",border:"none",borderRadius:8,padding:"10px 20px",cursor:"pointer",fontWeight:700,fontSize:13}}>
            ⬇ Descargar Acta
          </button>
        </div>
      </div>

      <div style={{display:"flex",height:"calc(100vh - 61px)"}}>
        {/* SIDEBAR */}
        <div style={{width:225,minWidth:225,background:"#fff",borderRight:"1px solid #e5e7eb",overflowY:"auto",padding:"16px 10px",display:"flex",flexDirection:"column",gap:0}}>
          <div style={{fontSize:10,color:"#9ca3af",letterSpacing:2,textTransform:"uppercase",padding:"0 6px 10px"}}>{orden.length} proyectos</div>
          {orden.map(p=>{
            if(!proyData[p]) return null;
            const d=proyData[p]; const v=ventas[p]||{avanceVentas:0};
            const urg=Object.values(d.tareas).flat().filter(t=>{const dias=diasHasta(t.vencimiento);return dias!==null&&dias<=7&&t.estado!=="Completado";}).length;
            const esActivo=activo===p;
            return(
              <div key={p} onClick={()=>{setActivo(p);setTabActiva("tareas");}} style={{
                background:esActivo?`${d.color}12`:"transparent",
                border:`1px solid ${esActivo?d.color:"transparent"}`,
                borderRadius:10,padding:"11px 12px",cursor:"pointer",marginBottom:4,transition:"all 0.15s"
              }}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div style={{fontSize:13,fontWeight:esActivo?700:500,color:esActivo?d.color:"#374151"}}>{p}</div>
                  <div style={{fontSize:15,fontWeight:800,color:d.color}}>{v.avanceVentas}%</div>
                </div>
                <Barra valor={v.avanceVentas} color={d.color}/>
                <div style={{marginTop:6,fontSize:10,color:urg>0?"#b91c1c":"#9ca3af"}}>{urg>0?`⚑ ${urg} urgente${urg>1?"s":""}`:d.fase}</div>
              </div>
            );
          })}
          {/* Botón agregar proyecto */}
          <button onClick={()=>setModalNuevoProy(true)} style={{marginTop:8,background:"#f9fafb",border:"1px dashed #d1d5db",borderRadius:10,padding:"10px 12px",cursor:"pointer",fontSize:12,color:"#6b7280",fontWeight:600,textAlign:"center",transition:"all 0.15s"}}
            onMouseOver={e=>{e.currentTarget.style.background="#f3f4f6";e.currentTarget.style.borderColor="#9ca3af";}}
            onMouseOut={e=>{e.currentTarget.style.background="#f9fafb";e.currentTarget.style.borderColor="#d1d5db";}}>
            + Agregar proyecto
          </button>
        </div>

        {/* CONTENIDO */}
        <div style={{flex:1,overflowY:"auto",padding:"24px 28px"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(140px,1fr))",gap:12,marginBottom:24}}>
            {[
              {label:"Avance ventas",  valor:`${venta.avanceVentas||0}%`,                                                                                                                                color:data.color},
              {label:"Dptos vendidos", valor:`${venta.deptos||0}/${venta.total||0}`,                                                                                                                     color:"#374151"},
              {label:"Tareas urgentes",valor:Object.values(data.tareas||{}).flat().filter(t=>{const d=diasHasta(t.vencimiento);return d!==null&&d<=7&&t.estado!=="Completado";}).length,                 color:"#b91c1c"},
              {label:"Fin de obra",    valor:data.finObra||"—",                                                                                                                                          color:"#374151"},
            ].map(k=>(
              <div key={k.label} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"14px 18px"}}>
                <div style={{fontSize:10,color:"#9ca3af",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{k.label}</div>
                <div style={{fontSize:22,fontWeight:800,color:k.color}}>{k.valor}</div>
              </div>
            ))}
          </div>

          <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:14,overflow:"hidden"}}>
            <div style={{display:"flex",borderBottom:"1px solid #e5e7eb"}}>
              {[{id:"tareas",label:"📋 Tareas"},{id:"ventas",label:"💰 Ventas"}].map(tab=>(
                <button key={tab.id} onClick={()=>setTabActiva(tab.id)} style={{
                  padding:"14px 24px",border:"none",cursor:"pointer",fontSize:14,
                  fontWeight:tabActiva===tab.id?700:400,color:tabActiva===tab.id?data.color:"#6b7280",
                  background:"transparent",borderBottom:tabActiva===tab.id?`2px solid ${data.color}`:"2px solid transparent",
                  marginBottom:-1,transition:"all 0.15s"
                }}>{tab.label}</button>
              ))}
              <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:20,gap:10}}>
                <div style={{fontSize:16,fontWeight:800,color:data.color}}>{activo}</div>
                <span style={{fontSize:11,color:"#9ca3af",textTransform:"uppercase",letterSpacing:1}}>{data.fase}</span>
              </div>
            </div>
            <div style={{padding:"20px 24px"}}>
              {tabActiva==="tareas"&&<TabTareas data={data} color={data.color} activo={activo} onEdit={(t,sec)=>{setSeccionModal(sec);setModalTarea(t);}} onNueva={abrirNueva} onMoverTarea={moverTarea}/>}
              {tabActiva==="ventas"&&<TabVentas nombre={activo} ventas={venta} data={data} color={data.color} onEditar={()=>setModalVentas(true)} onEditarProyecto={()=>setModalProy(true)}/>}
            </div>
          </div>
        </div>
      </div>

      {modalTarea&&<ModalTarea tarea={modalTarea==="nueva"?null:modalTarea} color={data.color} seccion={seccionModal} proyectoNombre={activo} onSave={guardarTarea} onDelete={eliminarTarea} onClose={()=>setModalTarea(null)}/>}
      {modalVentas&&<ModalVentas nombre={activo} ventas={venta} color={data.color} onSave={guardarVentas} onClose={()=>setModalVentas(false)}/>}
      {modalProy&&<ModalEditarProyecto nombre={activo} data={data} color={data.color} onSave={guardarProy} onClose={()=>setModalProy(false)}/>}
      {modalNuevoProy&&<ModalNuevoProyecto onSave={crearProyecto} onClose={()=>setModalNuevoProy(false)}/>}
    </div>
  );
}
