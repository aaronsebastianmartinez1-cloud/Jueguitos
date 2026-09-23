// ── planets/marte.js — los 3 mundos de Marte ──
// Mundo 1: esquiva meteoritos (protégete bajo plataformas con techo)
// Mundo 2: parkour + alienígenas saltarinas + espinas + la Tierra a lo lejos
// Mundo 3: el mismo parkour marciano, pero hay que recuperar 4 llaves para
//          habilitar la bandera de meta
const MARTE_WWS=[3100,1800,1800];

const MARTE_WORLDS=[
// ══════════ MUNDO 1 – Lluvia de Meteoritos ══════════
{
  sky:['#5a1c08','#c9743a'],ground:'#8a3010',gline:'#3a1206',
  platCol:'#6a2810',pitCol:'#1a0805',lavaGlow:false,bgStars:false,
  intro:{
    title:'🔴 RUMBO A MARTE',
    body:'Tras su aventura en la Tierra, Clau decide que no puede quedarse quieta: otros mundos también la necesitan. Su nave aterriza en Marte justo cuando el cielo empieza a llover meteoritos. ¡Busca refugio bajo las rocas y cruza el cráter, Clau!',
  },
  plats:[
    {x:0,   y:GY,w:260,h:60,g:true},
    {x:340, y:GY,w:300,h:60,g:true},
    {x:720, y:GY,w:260,h:60,g:true},
    {x:1060,y:GY,w:300,h:60,g:true},
    {x:1440,y:GY,w:460,h:60,g:true},
    {x:1980,y:GY,w:280,h:60,g:true},
    {x:2340,y:GY,w:260,h:60,g:true},
    {x:2680,y:GY,w:420,h:60,g:true},
    // refugios bajos: techos para esconderse de los meteoritos
    {x:90,  y:GY-85, w:110,h:14,roof:true},
    {x:420, y:GY-85, w:120,h:14,roof:true},
    {x:800, y:GY-85, w:110,h:14,roof:true},
    {x:1140,y:GY-85, w:120,h:14,roof:true},
    {x:1560,y:GY-85, w:140,h:14,roof:true},
    {x:2040,y:GY-85, w:120,h:14,roof:true},
    {x:2400,y:GY-85, w:120,h:14,roof:true},
    {x:2740,y:GY-85, w:140,h:14,roof:true},
    // plataformas altas de parkour
    {x:200, y:GY-175,w:90, h:14},
    {x:860, y:GY-180,w:90, h:14},
    {x:1250,y:GY-175,w:90, h:14},
    {x:2180,y:GY-175,w:90, h:14},
    {x:2560,y:GY-180,w:90, h:14},
  ],
  mp:{x:990,y:GY-45,w:50,h:14,ox:985,range:55,spd:1.2,dir:1},
  spikes:[
    {x:230,y:GY,w:20},{x:600,y:GY,w:20},{x:950,y:GY,w:20},
    {x:1320,y:GY,w:20},{x:1470,y:GY,w:20},{x:1750,y:GY,w:20},
    {x:2200,y:GY,w:20},{x:2560,y:GY,w:20},{x:2900,y:GY,w:20},
  ],
  meteorCols:[
    {x:150,cd:75},{x:480,cd:90},{x:700,cd:70},
    {x:1000,cd:85},{x:1300,cd:80},{x:1650,cd:70},
    {x:2100,cd:80},{x:2460,cd:75},{x:2810,cd:70},
  ],
  goal:{x:3060,y:GY-80,w:26,h:80},
  clouds:[],
  enemyDefs:[],
  elDefs:[
    {x:900,y:GY-180-26},
    {x:1300,y:GY-26}, // MUY arriesgada: justo bajo la columna de meteoritos expuesta (sin techo cerca)
  ],
},
// ══════════ MUNDO 2 – Parkour Marciano ══════════
{
  sky:['#160408','#4a1030'],ground:'#7a2a10',gline:'#2a0d05',
  platCol:'#5a2010',pitCol:'#0a0304',lavaGlow:false,bgStars:true,
  earthInSky:true,
  plats:[
    {x:0,   y:GY,w:300,h:60,g:true},
    {x:390, y:GY,w:500,h:60,g:true},
    {x:970, y:GY,w:830,h:60,g:true},
    {x:110, y:GY-90, w:120,h:14},
    {x:270, y:GY-165,w:110,h:14},
    {x:420, y:GY-95, w:120,h:14},
    {x:590, y:GY-175,w:110,h:14},
    {x:740, y:GY-100,w:130,h:14},
    {x:900, y:GY-185,w:110,h:14},
    {x:1050,y:GY-95, w:120,h:14},
    {x:1200,y:GY-170,w:110,h:14},
    {x:1360,y:GY-100,w:120,h:14},
    {x:1520,y:GY-190,w:110,h:14},
  ],
  mp:{x:340,y:GY-35,w:55,h:14,ox:340,range:55,spd:0.9,dir:1},
  spikes:[
    {x:185,y:GY,w:20},{x:505,y:GY,w:20},{x:760,y:GY,w:20},
    {x:1020,y:GY,w:20},{x:1300,y:GY,w:20},{x:1430,y:GY-100,w:20},
  ],
  meteorCols:[
    {x:950,cd:130},{x:1150,cd:135},{x:1400,cd:125},{x:1600,cd:130},
  ],
  goal:{x:1680,y:GY-190-80,w:26,h:80},
  clouds:[],
  enemyDefs:[
    {kind:'alien',jumpAlien:true,x:150,y:GS,spd:0.9,dir:1,hp:1,shoots:true,shootCd:140,col:'#33cc66',pb:{x:0,w:300,top:GY}},
    {kind:'alien',jumpAlien:true,x:230,y:GS,spd:1.0,dir:-1,hp:1,shoots:false,col:'#33cc66',pb:{x:0,w:300,top:GY}},
    {kind:'alien',jumpAlien:true,x:500,y:GS,spd:1.0,dir:-1,hp:1,shoots:true,shootCd:150,col:'#33cc66',pb:{x:390,w:500,top:GY}},
    {kind:'alien',jumpAlien:true,x:650,y:GS,spd:1.0,dir:1,hp:1,shoots:false,col:'#33cc66',pb:{x:390,w:500,top:GY}},
    {kind:'alien',jumpAlien:true,x:1100,y:GS,spd:1.0,dir:1,hp:1,shoots:true,shootCd:130,col:'#44dd77',pb:{x:970,w:830,top:GY}},
    {kind:'alien',jumpAlien:true,x:1350,y:GS,spd:1.05,dir:-1,hp:1,shoots:false,col:'#44dd77',pb:{x:970,w:830,top:GY}},
    {kind:'alien',jumpAlien:true,x:1600,y:GS,spd:1.1,dir:-1,hp:1,shoots:true,shootCd:140,col:'#44dd77',pb:{x:970,w:830,top:GY}},
    {kind:'alien',jumpAlien:true,x:300,y:GY-165-22,spd:0.7,dir:1,hp:1,shoots:false,col:'#55ee88',pb:{x:270,w:110,top:GY-165}},
    {kind:'alien',jumpAlien:true,x:930,y:GY-185-22,spd:0.7,dir:-1,hp:1,shoots:true,shootCd:150,col:'#55ee88',pb:{x:900,w:110,top:GY-185}},
    {kind:'alien',jumpAlien:true,x:1200,y:GY-170-22,spd:0.7,dir:1,hp:1,shoots:false,col:'#55ee88',pb:{x:1200,w:110,top:GY-170}},
  ],
  elDefs:[
    {x:625,y:GY-175-26},
    {x:1350,y:GY-26}, // MUY arriesgada: en pleno fuego cruzado de dos marcianos que disparan
  ],
},
// ══════════ MUNDO 3 – Las Llaves Perdidas ══════════
{
  sky:['#1a0518','#3a0a38'],ground:'#6a2020',gline:'#260a0a',
  platCol:'#5a1830',pitCol:'#0a0210',lavaGlow:false,bgStars:true,
  keyGate:true,
  intro:{
    title:'⚠️ CUMPLE CON LO REQUERIDO',
    body:'Antes de que la bandera se habilite: Consigue todas las llaves extraviadas. Los marcianos las escondieron en lo alto de torres de roca, y uno de ellos —el más fuerte— se niega a soltar la última. ¡Recupera las 4 llaves para completar tu misión en Marte!',
  },
  plats:[
    {x:0,   y:GY,w:260,h:60,g:true},
    {x:360, y:GY,w:220,h:60,g:true},
    {x:690, y:GY,w:200,h:60,g:true},
    {x:1010,y:GY,w:790,h:60,g:true},
    // torre 1 (llave 1) — escalada larga y mucho más alta, la cámara sube con Clau
    {x:100, y:GY-90, w:80,h:14},
    {x:190, y:GY-160,w:75,h:14},
    {x:270, y:GY-230,w:70,h:14},
    {x:340, y:GY-300,w:70,h:14},
    {x:400, y:GY-370,w:65,h:14},
    // torre 2 (llave 2) — escalada larga y mucho más alta
    {x:570, y:GY-95, w:80,h:14},
    {x:660, y:GY-165,w:75,h:14},
    {x:740, y:GY-235,w:70,h:14},
    {x:810, y:GY-305,w:70,h:14},
    {x:870, y:GY-375,w:65,h:14},
    // torre 3 (llave 3) — escalada larga y mucho más alta
    {x:930, y:GY-105,w:80,h:14},
    {x:1020,y:GY-170,w:75,h:14},
    {x:1100,y:GY-240,w:70,h:14},
    {x:1170,y:GY-310,w:70,h:14},
    {x:1230,y:GY-380,w:65,h:14},
    // torre 4 (llave 4 — custodiada por el marciano fuerte)
    {x:1340,y:GY-110,w:90, h:14},
    {x:1460,y:GY-170,w:80, h:14},
    {x:1580,y:GY-230,w:85, h:14},
  ],
  mp:{x:310,y:GY-50,w:50,h:14,ox:300,range:60,spd:1.3,dir:1},
  spikes:[
    {x:170,y:GY,w:20},{x:500,y:GY,w:20},{x:730,y:GY,w:20},
    {x:1300,y:GY,w:20},{x:1650,y:GY,w:20},
    {x:245,y:GY-160,w:20},{x:715,y:GY-165,w:20},
    {x:1075,y:GY-170,w:20},{x:1520,y:GY-170,w:20},
  ],
  keyDefs:[
    {x:430, y:GY-370-22},
    {x:900, y:GY-375-22},
    {x:1260,y:GY-380-22},
    {x:1615,y:GY-230-22,locked:true},
  ],
  goal:{x:1720,y:GY-80,w:26,h:80},
  clouds:[],
  enemyDefs:[
    {kind:'alien',jumpAlien:true,x:130,y:GS,spd:0.9,dir:1,hp:1,shoots:false,col:'#33cc66',pb:{x:0,w:260,top:GY}},
    {kind:'alien',jumpAlien:true,x:220,y:GS,spd:1.0,dir:-1,hp:1,shoots:true,shootCd:140,col:'#33cc66',pb:{x:0,w:260,top:GY}},
    {kind:'alien',jumpAlien:true,x:450,y:GS,spd:1.0,dir:-1,hp:1,shoots:false,col:'#33cc66',pb:{x:360,w:220,top:GY}},
    {kind:'alien',jumpAlien:true,x:760,y:GS,spd:1.0,dir:1,hp:1,shoots:true,shootCd:150,col:'#33cc66',pb:{x:690,w:200,top:GY}},
    {kind:'alien',jumpAlien:true,x:1200,y:GS,spd:1.1,dir:1,hp:1,shoots:false,col:'#44dd77',pb:{x:1010,w:790,top:GY}},
    {kind:'alien',jumpAlien:true,x:1450,y:GS,spd:1.1,dir:-1,hp:1,shoots:true,shootCd:130,col:'#44dd77',pb:{x:1010,w:790,top:GY}},
    {kind:'alien',jumpAlien:true,x:1650,y:GS,spd:1.1,dir:-1,hp:1,shoots:false,col:'#44dd77',pb:{x:1010,w:790,top:GY}},
    {kind:'alien',jumpAlien:true,x:225,y:GY-160-22,spd:0.7,dir:1,hp:1,shoots:false,col:'#55ee88',pb:{x:190,w:75,top:GY-160}},
    {kind:'alien',jumpAlien:true,x:695,y:GY-165-22,spd:0.7,dir:-1,hp:1,shoots:true,shootCd:150,col:'#55ee88',pb:{x:660,w:75,top:GY-165}},
    {kind:'alien',jumpAlien:true,x:1055,y:GY-170-22,spd:0.7,dir:1,hp:1,shoots:false,col:'#55ee88',pb:{x:1020,w:75,top:GY-170}},
    // guardián de la última llave: el doble de vida (5 golpes para matarlo)
    {kind:'alien',jumpAlien:true,x:1615,y:GY-230-22,spd:0.8,dir:1,hp:5,shoots:true,shootCd:110,col:'#ff2244',pb:{x:1580,w:85,top:GY-230},guardsKeyIdx:3},
  ],
  elDefs:[
    {x:965,y:GY-105-26},
    {x:920,y:GY-375-26}, // MUY arriesgada: en el borde de la torre 2, a un paso del vacío
  ],
},
];

// ── Metadata para la pantalla de selección de planetas ──
const PLANET_MARTE={key:'marte',name:'MARTE',emoji:'🔴',available:true,colors:['#8a3010','#5a1a05']};
