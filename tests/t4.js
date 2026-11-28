const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');const nc=require('@napi-rs/canvas');
const vc=new VirtualConsole();vc.on('jsdomError',e=>console.log('ERR',e.message,(e.detail&&e.detail.stack||'').split('\n').slice(0,4).join('|')));
const fakeVid=nc.createCanvas(640,480);
const d=new JSDOM(fs.readFileSync(process.argv[2],'utf8'),{runScripts:'dangerously',virtualConsole:vc,pretendToBeVisual:true,url:'https://x.test/',beforeParse(w){
  w.ImageData=nc.ImageData;
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
 T('topbar order',()=>ev(`(()=>{const t=document.querySelector('.topbar');const order=['printerModel','btnConnect','bleAll','heatChip','batChip','btnPanic'].map(i=>i[0]==='.'?document.querySelector(i):$(i));let ok=true;for(let i=1;i<order.length;i++) ok=ok&&!!(order[i-1].compareDocumentPosition(order[i])&4);return ok})()`));
 T('capture order',()=>ev(`(()=>{const ids=['btnLive','btnSelfie','btnScan','btnBooth','btnCam','btnLib'].map(i=>$(i));let ok=true;for(let i=1;i<ids.length;i++) ok=ok&&!!(ids[i-1].compareDocumentPosition(ids[i])&4);return ok+' banner='+!!$('btnBanner')+' scanModes='+[...$('scanDir').options].map(o=>o.value).join('')+' secs='+$('scanSecs').options.length})()`));
 T('tabs dots',()=>ev(`['dotStereo','dotDexp','dotPoster','dotZine','dotWeird','dotPara','dotPano'].map(i=>!!$(i)).join()+' badges left: '+document.querySelectorAll('.tab-toggle .poster-badge').length`));
 T('look custom',()=>{ev(`applyLook('portrait')`);const a=ev(`$('lookBadge').textContent`);ev(`$('br').value=30;$('br').dispatchEvent(new Event('input'))`);const b=ev(`$('lookBadge').textContent`);ev(`applyLook('gameboy')`);return a+' -> '+b+' -> '+ev(`$('lookBadge').textContent`)});
 T('empty art hidden after image',()=>{ev(`src={el:mk(400,300),w:400,h:300};draw()`);return 'x'});
 await wait(400); T('  hidden?',()=>ev(`$('emptyArt').hidden`));
 ev(`src=null;last=null;lastSrcRef=null`);await wait(400); T('  back when cleared',()=>ev(`$('emptyArt').hidden`));
 // random scan
 ev(`src=null;stream={getTracks:()=>[]};$('scanSecs').value=1;$('scanDir').value='r';`);
 ev(`startScanOnce()`); await wait(1700);
 T('random scan result',()=>ev(`(()=>{if(!src) return 'no src'; const c=src.el;const x=c.getContext('2d');const d=x.getImageData(0,0,c.width,c.height).data;let blank=0,n=0;for(let i=0;i<d.length;i+=4*97){n++;if(d[i]+d[i+1]+d[i+2]===0)blank++;}return 'mod='+src.mod+' '+c.width+'x'+c.height+' black samples '+blank+'/'+n+' active='+slitActive})()`));
 // vertical scan
 ev(`src=null;stream={getTracks:()=>[]};$('scanSecs').value=1;$('scanDir').value='v';startScanOnce()`); await wait(1700);
 T('vertical scan',()=>ev(`'mod='+(src&&src.mod)+' active='+slitActive`));
 // weird scanner live print with fake printer
 ev(`window.__w=[];m02xChar={properties:{writeWithoutResponse:true},writeValueWithoutResponse:async c=>{window.__w.push(c.length)}};dev={gatt:{connected:true}};$('printerModel').value='m02x';$('weirdLineMs').value='12';$('weirdScanSpeed').value='320';$('heatBudget').value=800;heat.pct=0;src=null;stream={getTracks:()=>[]};startWeirdScan()`);
 await wait(2500);
 T('weird running',()=>ev(`'active='+slitActive+' btn='+$('btnStartWeirdScan').textContent+' writes='+__w.length+' queue='+(weirdStream?weirdStream.queue.length:'none')+' printing='+isPrintingSessionActive+' info='+$('info').textContent`));
 ev(`$('btnStartWeirdScan').click()`); await wait(1500);
 T('weird stopped',()=>ev(`'active='+slitActive+' src.mod='+(src&&src.mod)+' '+(src&&src.w+'x'+src.h)+' session='+isPrintingSessionActive+' writes='+__w.length+' btn='+$('btnStartWeirdScan').textContent+' dotWeird='+$('dotWeird').classList.contains('on')`));
 // weird scanner, print OFF
 ev(`window.__w.length=0;$('weirdPrint').value='off';src=null;stream={getTracks:()=>[]};startWeirdScan()`); await wait(800);
 T('weird print off',()=>ev(`'writes='+__w.length+' session='+isPrintingSessionActive+' active='+slitActive`));
 ev(`$('btnStartWeirdScan').click()`); await wait(300);
 T('  stored',()=>ev(`'src.mod='+(src&&src.mod)+' last='+(last&&last.w+'x'+last.h)+' printBtnEnabled='+!$('btnPrint').disabled`));
 // fresco
 ev(`src=null;panoFrames=[];$('panoDir').value='horizontal'`);
 T('fresco add 6 frames (no max)',()=>{for(let i=0;i<6;i++) ev(`addPanoCanvas(mk(1200,900,'${i}','#'+(${i}*30+60).toString(16).padStart(2,'0').repeat(3)))`);return ev(`panoFrames.length+' frames, '+$('panoBadge').textContent+' | dotPano='+$('dotPano').classList.contains('on')+' maxFramesEl='+!!$('panoMaxFrames')+' stitchBtn='+!!$('btnPanoStitch')`)});
 T('fresco reorder',()=>{ev(`const a=panoFrames[2];moveFrame(2,-1);window.__ok=panoFrames[1]===a`);return ev(`__ok+' btns='+document.querySelectorAll('#panoFrameList button').length`)});
 T('no paper limit setting',()=>ev(`'panoMaxCm='+!!$('panoMaxCm')+' lineMs='+!!$('panoLineMs')+' rest='+$('panoRest').value+' status='+$('panoBadge').textContent`));
 ev(`stitchPanorama(false,true)`);
 T('view-only zoom',()=>{const h1=ev(`(()=>{let s=0;const m=last.mono;for(let i=0;i<m.length;i+=7)s=(s*31+m[i])%1000003;return s+':'+last.w+'x'+last.h+':'+view.width+'x'+view.height})()`);
   ev(`currentZoom=400;cropCx=.3;cropCy=.5;$('zoomSlider').value=400;$('zoomSlider').dispatchEvent(new Event('input'))`);return h1});
 await wait(100);
 T('  after zoom 400',()=>ev(`(()=>{let s=0;const m=last.mono;for(let i=0;i<m.length;i+=7)s=(s*31+m[i])%1000003;return s+':'+last.w+'x'+last.h+':'+view.width+'x'+view.height+' panY.disabled='+$('panY').disabled+' info='+$('info').textContent})()`));
 ev(`currentZoom=100;zoomChanged()`);await wait(80);
 T('  zoom back',()=>ev(`(()=>{let s=0;const m=last.mono;for(let i=0;i<m.length;i+=7)s=(s*31+m[i])%1000003;return s+':'+last.w+'x'+last.h+':'+view.width+'x'+view.height})()`));
 // roll
 T('roll save fresco',()=>{ev(`$('caption').value='hello';applyLook('cutest');$('stampOpt').value='sign';draw();saveToHistory(last)`);return ev(`historyQueue.length+' '+historyQueue[0].kind+' '+historyQueue[0].label+' frames='+historyQueue[0].frames.length`)});
 ev(`src=null;panoFrames=[];renderPanoFrames();$('caption').value='';applyLook('natural');src={el:mk(800,600),w:800,h:600};rot=0;draw();$('btnRot').click();`);await wait(50);
 T('roll save photo',()=>{ev(`saveToHistory(last)`);return ev(`historyQueue.length+' '+historyQueue[0].kind+' rot='+historyQueue[0].st.rot+' label='+historyQueue[0].label+' look='+historyQueue[0].st.look`)});
 ev(`applyLook('portrait');rot=0;src=null;panoFrames=[];$('caption').value='';draw()`);
 await ev(`loadRollItem(historyQueue[1])`).catch(e=>console.log('loaderr',e.message));await wait(80);
 T('roll load fresco',()=>ev(`'src.pano='+(src&&src.pano)+' frames='+panoFrames.length+' caption='+$('caption').value+' look='+$('lookBadge').textContent+' stamp='+$('stampOpt').value+' dotPano='+$('dotPano').classList.contains('on')`));
 await ev(`loadRollItem(historyQueue[0])`);await wait(80);
 T('roll load photo',()=>ev(`'rot='+rot+' look='+$('lookBadge').textContent+' mode='+$('mode').value+' src='+src.w+'x'+src.h+' print='+last.w+'x'+last.h`));
 // export / import
 ev(`window.__blob=null;URL.createObjectURL=b=>{window.__blob=b;return 'blob:x'};URL.revokeObjectURL=()=>{};HTMLAnchorElement.prototype.click=function(){};`);
 await ev(`exportRoll()`);
 const txt=await new Promise(r=>{const fr=new w.FileReader();fr.onload=()=>r(fr.result);fr.readAsText(w.__blob)});
 T('export file',()=>{const j=JSON.parse(txt);return j.magic+' v'+j.version+' items='+j.items.length+' kinds='+j.items.map(i=>i.kind).join()+' KB='+Math.round(txt.length/1024)});
 w.__decode=async url=>{const buf=Buffer.from(url.split(',')[1],'base64');const img=await nc.loadImage(buf);const c=w.document.createElement('canvas');c.width=img.width;c.height=img.height;w.__store.set(c,(()=>{const n=nc.createCanvas(img.width,img.height);n.getContext('2d').drawImage(img,0,0);return n})());Object.defineProperty(c,'naturalWidth',{value:img.width});Object.defineProperty(c,'naturalHeight',{value:img.height});return c};
 ev(`loadImgEl = window.__decode; historyQueue.length=0; renderHistory()`);
 await ev(`importRollFile({name:'t.fotitas',text:async()=>${JSON.stringify(txt)}})`);
 T('import',()=>ev(`historyQueue.length+' kinds='+historyQueue.map(i=>i.kind).join()+' frames='+(historyQueue.find(i=>i.kind==='fresco')||{frames:[]}).frames.length`));
 ev(`src=null;panoFrames=[];$('caption').value=''`);
 await ev(`loadRollItem(historyQueue.find(i=>i.kind==='fresco'))`);await wait(100);
 T('  imported fresco restores',()=>ev(`'src.pano='+(src&&src.pano)+' frames='+panoFrames.length+' caption='+$('caption').value+' look='+$('lookBadge').textContent+' print='+last.w+'x'+last.h`));
 await ev(`loadRollItem(historyQueue.find(i=>i.kind==='image'))`);await wait(100);
 T('  imported photo restores',()=>ev(`'rot='+rot+' src='+src.w+'x'+src.h+' print='+last.w+'x'+last.h+' look='+$('lookBadge').textContent`));
 T('theme',()=>{ev(`setTheme('gameboy')`);const a=ev(`document.documentElement.getAttribute('data-theme')`);ev(`setTheme('zine')`);return a+' -> '+ev(`document.documentElement.getAttribute('data-theme')`)+' buttons='+ev(`document.querySelectorAll('#stylePanel button').length`)});
 T('contain still',()=>{ev(`src={el:mk(300,1200),w:300,h:1200};rot=0;currentZoom=100;draw()`);return ev(`view.style.width+' x '+view.style.height`)});
 T('heat dry run',()=>{ev(`window.__w=[];src={el:mk(800,600),w:800,h:600};draw();heat.pct=0`);return 'ready'});
 await ev(`(async()=>{const jid=sessionOpen();await phomemoDriver.printBitmap(last.mono,last.w,last.h,jid);sessionClose();})()`).catch(e=>console.log('printerr',e.message));
 T('  after',()=>ev(`'writes='+__w.length+' heat='+Math.round(heat.pct)+'%'`));

 T('polaroid, no stamp frame',()=>{ev(`$('frame').value='polaroid';draw()`);return ev(`'stampOption='+!![...$('frame').options].find(o=>o.value==='stamp')+' size='+last.w+'x'+last.h`)});
 T('  polaroid outline black',()=>ev(`(()=>{const m=last.mono,w=last.w;let edge=0;for(let x=0;x<w;x++){edge+=m[2*w+x]}return 'top rows black px='+edge+'/'+w})()`));
 ev(`$('frame').value='none';draw()`);
 T('tab dot style',()=>ev(`getComputedStyle?'w='+getComputedStyle($('dotPano')).width:'n/a'`));
 // endless weird: sizes and reverse
 ev(`src=null;panoFrames=[];$('weirdPrint').value='off';$('weirdStep').value='1';$('weirdScanSpeed').value='640';stream={getTracks:()=>[]};startWeirdScan()`);
 await wait(1500); ev(`$('btnStartWeirdScan').click()`); await wait(200);
 T('endless weird 1 line/step, 1.5s',()=>ev(`'src '+src.w+'x'+src.h+' mod='+src.mod+' rows>=300:'+(src.h>=300)`));
 ev(`src=null;$('weirdStep').value='1';$('weirdScanSpeed').value='640';stream={getTracks:()=>[]};startWeirdScan()`);
 await wait(3000); ev(`$('btnStartWeirdScan').click()`); await wait(200);
 const h2=ev(`src.h`);
 T('  longer scan = longer image',()=>'3s -> '+h2+' rows');
 ev(`window.__w.length=0;window.__rowsPrinted=0;$('weirdPrint').value='on';$('weirdStep').value='10';$('weirdLineMs').value='12';$('weirdScanSpeed').value='320';src=null;stream={getTracks:()=>[]};startWeirdScan()`);
 await wait(2000); ev(`$('btnStartWeirdScan').click()`); await wait(1200);
 T('endless weird live print',()=>ev(`'writes='+__w.length+' src.h='+src.h+' session='+isPrintingSessionActive`));
 // fresco rest + delay on M02X: instrumented
 ev(`src=null;panoFrames=[];$('panoDir').value='horizontal';$('panoRest').value='4';$('panoLineMs').value='10';for(let i=0;i<8;i++) addPanoCanvas(mk(1200,900,''+i))`);
 await ev(`(async()=>{const jid=sessionOpen();await phomemoDriver.printBitmap(last.mono,last.w,last.h,jid);sessionClose();})()`).catch(e=>console.log('printerr',e.message));
 T('fresco rest breaks',()=>ev(`(()=>{const t=document.getElementById('log').textContent;return 'rests='+(t.match(/Overheat guard: resting/g)||[]).length+' rows='+last.h+' pano='+!!src.pano})()`));
 process.exit()},1500);
