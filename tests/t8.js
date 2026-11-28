const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const nc=require('@napi-rs/canvas');
const vc=new VirtualConsole();vc.on('jsdomError',e=>console.log('ERR',e.message,(e.detail&&e.detail.stack||'').split('\n').slice(0,4).join('|')));
const fakeVid=nc.createCanvas(640,480);
const d=new JSDOM(fs.readFileSync(process.argv[2],'utf8'),{runScripts:'dangerously',virtualConsole:vc,pretendToBeVisual:true,url:'https://x.test/',beforeParse(w){
  w.ImageData=nc.ImageData; w.TextEncoder=TextEncoder;
  const proto=w.HTMLCanvasElement.prototype;const store=new WeakMap();w.__store=store;
  const gc0=function(){ if(!store.has(this)){ store.set(this,nc.createCanvas(this.width||300,this.height||150)); } let c=store.get(this); if(c.width!==this.width||c.height!==this.height){ const n=nc.createCanvas(this.width,this.height); store.set(this,n); c=n;} const x=c.getContext('2d'); x.canvas=this; return x; };
  proto.toDataURL=function(t,q){ const c=store.get(this); return c?c.toDataURL(t==='image/jpeg'?'image/jpeg':'image/png',q?Math.round(q*100):undefined):'data:,'; };
  proto.getContext=function(...a){ const x=gc0.apply(this,a); if(!x.__p){ x.__p=1; const di=x.drawImage.bind(x); x.drawImage=(img,...r)=>{ if(img&&img.tagName==='VIDEO'){ const g=fakeVid.getContext('2d'); g.fillStyle='#'+Math.floor(Math.random()*0xffffff).toString(16).padStart(6,'0'); g.fillRect(0,0,640,480); g.fillStyle='#fff'; g.fillRect(100,100,200,200); img=fakeVid; } else if(img&&img.tagName==='CANVAS'){ let c=store.get(img); if(!c){c=nc.createCanvas(img.width||1,img.height||1);store.set(img,c);} img=c; } return di(img,...r); }; } return x; };
  Object.defineProperty(w.HTMLElement.prototype,'clientWidth',{get(){return 340}});
  Object.defineProperty(w.HTMLVideoElement.prototype,'videoWidth',{get(){return 640}});
  Object.defineProperty(w.HTMLVideoElement.prototype,'videoHeight',{get(){return 480}});
  w.innerHeight=800; w.Element.prototype.scrollIntoView=function(){};
}});
const w=d.window;
setTimeout(async ()=>{
 const ev=c=>w.eval(c);
 const T=(n,f)=>{try{const r=f();console.log('OK  ',n,r===undefined?'':r)}catch(e){console.log('FAIL',n,e.stack.split('\n').slice(0,4).join(' | '))}};
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 ev(`window.mk=(W,H,seed,col)=>{const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#000');g.addColorStop(1,'#fff');x.fillStyle=col||g;x.fillRect(0,0,W,H);x.fillStyle='#000';x.font=(H/5)+'px sans-serif';x.fillText('ABC'+(seed||''),W*0.4,H*0.6);return c}`);
 await wait(400); T('empty art shown at start',()=>ev(`'hidden='+$('emptyArt').hidden+' gif='+$('emptyImg').src.startsWith('data:image/gif')`));
 T('top bar',()=>ev(`[!document.querySelector('.verbar'),!document.querySelector('.logo-fotitas'),!$('btnDisc'),!!$('btnPanic'),!!$('bleAll'),$('printerModel').options[0].textContent,$('printerModel').options[1].textContent,document.querySelectorAll('.topbar button').length+' buttons',$('fuseSvg').innerHTML.slice(0,30)].join(' | ')`));

 const fs2=require('fs'); fs2.mkdirSync('/tmp/bo',{recursive:true});
 const save=(name)=>{ const du=ev(`(()=>{const c=src&&src.el; return c&&c.toDataURL? c.toDataURL('image/png'):null})()`); if(du) fs2.writeFileSync('/tmp/bo/'+name+'.png',Buffer.from(du.split(',')[1],'base64')); return du?'saved':'nosrc'; };
 const B=()=>w.__beta;
 ev(`window.mk=(W,H,seed,col)=>{const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#fff');g.addColorStop(1,'#335');x.fillStyle=col||g;x.fillRect(0,0,W,H);x.fillStyle='#d33';x.beginPath();x.arc(W*.5,H*.45,H*.28,0,7);x.fill();x.fillStyle='#fe8';x.fillRect(W*.1,H*.7,W*.8,H*.1);x.fillStyle='#000';x.font=(H/6)+'px sans-serif';x.fillText('P'+(seed||''),W*.1,H*.2);return c}`);
 T('beta card present',()=>ev(`'mod options='+$('betaMod').options.length+' panels='+document.querySelectorAll('.bpanel').length+' dot='+!!$('dotBeta')`));
 // photo on stage
 ev(`src={el:mk(800,600,'x'),w:800,h:600};rot=0;draw()`); await wait(200);
 const mods=['sticker','receipt','strip','smear','qr','collage','doodle','ascii','timelapse','sketch','haiku','morph'];
 T('every panel shows',()=>{const r=[];for(const m of mods){ev(`$('betaMod').value='${m}';$('betaMod').dispatchEvent(new Event('change'))`);r.push(m+':'+ev(`[...document.querySelectorAll('.bpanel')].filter(p=>!p.hidden).length`))}return r.join(' ')});
 // QR via canvas for decoding with opencv
 const qrCases=[['https://fotitas.app','L'],['https://github.com/baobab-CABOY/FOTITAS-APP','M'],['Hello, peace and love! 🌈 ☮','Q'],['A'.repeat(120),'L'],['x'.repeat(200)+'END','M'],['short','Q']];
 qrCases.forEach(([t,e],i)=>{ const du=ev(`__beta.qrCanvas(${JSON.stringify(t)},'${e}','').toDataURL('image/png')`); fs2.writeFileSync('/tmp/bo/qr'+i+'.png',Buffer.from(du.split(',')[1],'base64')); });
 fs2.writeFileSync('/tmp/bo/qr_cases.json',JSON.stringify(qrCases));
 T('qr files',()=>qrCases.length+' written');
 // modules via UI buttons
 const click=id=>ev(`$('${id}').click()`);
 ev(`src={el:mk(800,600,'x'),w:800,h:600};rot=0;draw()`);await wait(100);
 for(let i=0;i<3;i++) ev(`__beta.B.stk.push(mk(500,400,'${i}'))`);
 ev(`$('stkSize').value='96'`); click('btnStkClear'); for(let i=0;i<5;i++) ev(`__beta.B.stk.push(mk(500,400,'${i}'))`);
 ev(`$('betaMod').value='sticker'`); ev(`$('stkShape').value='heart';$('stkShape').dispatchEvent(new Event('change'))`); await wait(50); T('sticker',()=>save('sticker'));
 ev(`$('rcPhoto').checked=true`); click('btnRcMake'); await wait(300); T('receipt',()=>save('receipt')+' '+ev('src.w+"x"+src.h'));
 ev(`src={el:mk(800,600,'x'),w:800,h:600};rot=0;draw()`);
 ev(`$('qrText').value='https://example.com/fotitas';$('qrLabel').value='scan me'`); click('btnQrMake'); await wait(100); T('qr ui',()=>save('qrui')+' '+ev('src.w+"x"+src.h'));
 ev(`$('qrMode').value='tag';$('qrMode').dispatchEvent(new Event('change'));$('tgIcon').value='★'`); click('btnQrMake'); await wait(100); T('tag',()=>save('tag')+' '+ev('src.w+"x"+src.h'));
 // strip from frames directly
 ev(`__beta.send(__beta.photoStrip([mk(640,480,'1'),mk(640,480,'2'),mk(640,480,'3')],'hearts','best friends',true,'43'),'strip')`); T('strip hearts',()=>save('strip_hearts'));
 ev(`__beta.send(__beta.photoStrip([mk(640,480,'1'),mk(640,480,'2'),mk(640,480,'3'),mk(640,480,'4')],'film','',false,'sq'),'strip')`); T('strip film',()=>save('strip_film'));
 ev(`__beta.send(__beta.smear(Array.from({length:30},(_,i)=>{const c=mk(384,288,''+i);const x=c.getContext('2d');x.fillStyle='#000';x.fillRect(i*12,0,20,288);return c}),'wave'),'smear')`); T('smear',()=>save('smear'));
 for(const L of ['g22','l12','pile','big']){ ev(`$('clgLayout').value='${L}'`); ev(`__beta.B.clg=[mk(600,450,'a'),mk(500,500,'b'),mk(450,600,'c'),mk(600,450,'d')]`); click('btnClgClear'); ev(`__beta.B.clg=[mk(600,450,'a'),mk(500,500,'b'),mk(450,600,'c'),mk(600,450,'d')]`); ev(`$('clgLayout').dispatchEvent(new Event('change'))`); await wait(50); T('collage '+L,()=>save('collage_'+L)); }
 ev(`src={el:mk(800,600,'x'),w:800,h:600};rot=0;draw()`);await wait(100);
 for(const s2 of ['classic','blocks','words']){ ev(`$('aaSet').value='${s2}'`); click('btnAaMake'); await wait(80); T('ascii '+s2,()=>save('ascii_'+s2)+' '+ev('src.w+"x"+src.h')); ev(`src={el:mk(800,600,'x'),w:800,h:600};rot=0;draw()`);await wait(60); }
 for(const m of ['pencil','line']){ ev(`$('skMode').value='${m}'`); click('btnSkMake'); await wait(80); T('sketch '+m,()=>save('sketch_'+m)); ev(`src={el:mk(800,600,'x'),w:800,h:600};rot=0;draw()`);await wait(60); }
 for(const sh of ['circle','rect','none']){ ev(`$('hkShape').value='${sh}'`); click('btnHkMake'); await wait(80); T('haiku '+sh,()=>save('haiku_'+sh)+' | '+ev(`$('betaMsg').textContent`)); ev(`src={el:mk(800,600,'x'),w:800,h:600};rot=0;draw()`);await wait(60); }
 click('btnHkNew'); await wait(80); T('haiku new',()=>ev(`$('betaMsg').textContent`));
 for(const m of ['dissolve','pixel','twirl']){ ev(`$('mpMode').value='${m}'`); ev(`__beta.B.mpB=${m==='dissolve'?"mk(700,500,'B','#5a5')":'null'}`); click('btnMpMake'); await wait(300); T('morph '+m,()=>save('morph_'+m)+' '+ev('src.w+"x"+src.h')); ev(`src={el:mk(800,600,'x'),w:800,h:600};rot=0;draw()`);await wait(60); }
 // doodle
 T('doodle',()=>{ev(`(()=>{const c=$('dpCv');const x=c.getContext('2d');x.fillStyle='#000';x.fillRect(50,50,100,100)})()`);ev(`$('dpSend').click()`);return 'sent'});
 await wait(100); T('  doodle src',()=>save('doodle')+' '+ev('src.mod+" "+src.w+"x"+src.h'));
 // pipeline on beta output
 T('beta output prints/looks',()=>ev(`'mod='+src.mod+' last='+last.w+'x'+last.h+' dotBeta='+$('dotBeta').classList.contains('on')`));
 const errs=ev(`[...document.querySelectorAll('#log div, #log p')].map(e=>e.textContent).filter(t=>/failed|β .*failed/i.test(t)).join(' | ')`);
 T('no beta errors in log',()=>errs||'none');
 process.exit()},1500);
