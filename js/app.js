
const cx=cv.getContext('2d'),W=960,H=540,ks=o=>Object.keys(o).map(Number).sort((a,b)=>a-b),cl=(v,a,b)=>Math.max(a,Math.min(b,v)),clone=o=>JSON.parse(JSON.stringify(o)),esc=s=>s.replace(/[&<>"]/g,c=>'&#'+c.charCodeAt(0)+';');
let S,hist=[],fut=[],tool='draw',mode='object',selectedObject=null,playing=false,rc=0,view={x:0,y:0,z:1},md=null,mo=null,ms=[W/2,H/2],last=0,saveT,mt;
let frameSel=new Set(),frameAnchor=null,frameClip=[],timelineDrag=null,pendingShape=null;
const mk=n=>({n,v:1,bm:'source-over',e:'ease',px:W/2,py:H/2,d:{},k:{}}),fresh=()=>({fps:24,a:1,b:48,f:1,i:0,on:1,bg:'#fbfaf7',l:[mk('Layer 1')]});
const ez={linear:t=>t,ease:t=>t*t*(3-2*t),in:t=>t*t,out:t=>1-(1-t)*(1-t),hold:()=>0,bounce:t=>{const n=7.5625,d=2.75;if(t<1/d)return n*t*t;if(t<2/d)return n*(t-=1.5/d)*t+.75;if(t<2.5/d)return n*(t-=2.25/d)*t+.9375;return n*(t-=2.625/d)*t+.984375}};
const kf=(L,f)=>ks(L.d).filter(k=>k<=f).pop(),dr=(L,f)=>L.d[kf(L,f)]||[];
function ev(L,f){const K=ks(L.k);if(!K.length)return{x:0,y:0,r:0,s:1,o:1};const a=K.filter(k=>k<=f).pop(),b=K.find(k=>k>f);
 if(a==null)return{...L.k[b]};if(b==null||a==f)return{...L.k[a]};
 const t=ez[L.e]((f-a)/(b-a)),A=L.k[a],B=L.k[b],r={};for(const p in A)r[p]=A[p]+(B[p]-A[p])*t;return r}
function loc(L,f,x,y){const t=ev(L,f),a=-t.r*Math.PI/180,dx=x-L.px-t.x,dy=y-L.py-t.y;return[L.px+(dx*Math.cos(a)-dy*Math.sin(a))/t.s,L.py+(dx*Math.sin(a)+dy*Math.cos(a))/t.s]}
function strokes(c,A,tint){for(const s of A){const p=s.p;if(!p.length)continue;c.beginPath();c.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)c.lineTo(p[i][0],p[i][1]);
 if(p.length==1)c.lineTo(p[0][0]+.01,p[0][1]);c.lineWidth=s.w;c.lineCap=c.lineJoin='round';c.strokeStyle=tint||s.c;if(s.f){c.fillStyle=tint||s.c;c.fill()}c.stroke()}}
function draw(c,f,o){c.globalAlpha=1;c.globalCompositeOperation='source-over';c.fillStyle=S.bg;c.fillRect(0,0,W,H);
 for(const L of S.l){if(!L.v)continue;const t=ev(L,f);c.save();c.globalCompositeOperation=L.bm;c.globalAlpha=t.o;
  c.translate(L.px+t.x,L.py+t.y);c.rotate(t.r*Math.PI/180);c.scale(t.s,t.s);c.translate(-L.px,-L.py);
  if(o&&S.on){const K=ks(L.d),ci=K.indexOf(kf(L,f));for(let j=S.on;j>0;j--)for(const d of[-1,1]){const k=K[ci+d*j];if(k!=null){c.globalAlpha=t.o*.35/j;strokes(c,L.d[k],d<0?'#e5484d':'#30a46c')}}c.globalAlpha=t.o}
  strokes(c,dr(L,f));c.restore()}}
function R(){draw(cx,S.f,!rc);const L=S.l[S.i];if(rc||!L)return;if(pendingShape){const b=pendingBox();if(b){const t=ev(L,pendingShape.f);cx.save();cx.translate(L.px+t.x,L.py+t.y);cx.rotate(t.r*Math.PI/180);cx.scale(t.s,t.s);cx.translate(-L.px,-L.py);cx.strokeStyle='#f08a24';cx.fillStyle='#f08a24';cx.lineWidth=1/t.s;cx.setLineDash([5/t.s,4/t.s]);cx.strokeRect(b.x0-6,b.y0-6,b.x1-b.x0+12,b.y1-b.y0+12);cx.setLineDash([]);cx.beginPath();cx.moveTo(b.cx,b.y0-6);cx.lineTo(b.cx,b.y0-28);cx.stroke();for(const[name,p]of Object.entries(b.handles)){const r=name=='rotate'?4:4.5;cx.fillStyle=name=='rotate'?'#f08a24':'#f4f4f4';cx.fillRect(p[0]-r,p[1]-r,r*2,r*2);cx.strokeStyle='#f08a24';cx.strokeRect(p[0]-r,p[1]-r,r*2,r*2)}cx.restore()}}
 const sel=selectedObject;if(sel&&mode&&sel.L===L&&sel.f===S.f&&dr(L,S.f).includes(sel.s)){const t=ev(L,S.f),p=sel.s.p;cx.save();cx.translate(L.px+t.x,L.py+t.y);cx.rotate(t.r*Math.PI/180);cx.scale(t.s,t.s);cx.translate(-L.px,-L.py);cx.beginPath();if(p.length){cx.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)cx.lineTo(p[i][0],p[i][1])}cx.strokeStyle='#f08a24';cx.lineWidth=Math.max(1,sel.s.w+3)/t.s;cx.setLineDash([5/t.s,3/t.s]);cx.stroke();cx.setLineDash([]);if(mode==='edit'){for(const q of p){cx.fillStyle='#f4f4f4';cx.strokeStyle='#f08a24';cx.lineWidth=1/t.s;cx.fillRect(q[0]-3/t.s,q[1]-3/t.s,6/t.s,6/t.s);cx.strokeRect(q[0]-3/t.s,q[1]-3/t.s,6/t.s,6/t.s)}}cx.restore()}
 const t=ev(L,S.f),x=L.px+t.x,y=L.py+t.y;cx.save();cx.strokeStyle='#e87d0d';cx.lineWidth=1.5;cx.beginPath();cx.arc(x,y,6,0,7);cx.moveTo(x-11,y);cx.lineTo(x+11,y);cx.moveTo(x,y-11);cx.lineTo(x,y+11);cx.stroke();cx.restore()}
const V=()=>cv.style.transform=`translate(calc(-50% + ${view.x}px),calc(-50% + ${view.y}px)) scale(${view.z})`,
 fit=()=>{view={x:0,y:0,z:cl(Math.min((vp.clientWidth-32)/W,(vp.clientHeight-32)/H),.1,4)};V()},
 pt=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*W/r.width,(e.clientY-r.top)*H/r.height]},
 msg=t=>{sx.textContent=t;clearTimeout(mt);mt=setTimeout(()=>sx.textContent='',3000)};
const sg=(a,b,n=24)=>Array.from({length:n+1},(_,i)=>[a[0]+(b[0]-a[0])*i/n,a[1]+(b[1]-a[1])*i/n]);
function shape(t,a,b){if(t=='line')return sg(a,b,30);
 if(t=='box'){const c=[a,[b[0],a[1]],b,[a[0],b[1]],a];return c.slice(1).flatMap((q,i)=>sg(c[i],q,14))}
 const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,rx=Math.abs(b[0]-a[0])/2,ry=Math.abs(b[1]-a[1])/2;return Array.from({length:61},(_,i)=>[mx+rx*Math.cos(i/60*6.2832),my+ry*Math.sin(i/60*6.2832)])}
function pendingBox(){const p=pendingShape?.s.p||[];if(!p.length)return null;const xs=p.map(q=>q[0]),ys=p.map(q=>q[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),cx=(x0+x1)/2,cy=(y0+y1)/2;return{x0,x1,y0,y1,cx,cy,handles:{nw:[x0,y0],n:[cx,y0],ne:[x1,y0],e:[x1,cy],se:[x1,y1],s:[cx,y1],sw:[x0,y1],w:[x0,cy],rotate:[cx,y0-28]}}}
function pendingHandle(b,x,y){return Object.entries(b.handles).find(([,p])=>Math.hypot(x-p[0],y-p[1])<12)?.[0]}
function scalePending(factor){if(!pendingShape)return;const b=pendingBox();if(!b)return;for(const q of pendingShape.s.p){q[0]=b.cx+(q[0]-b.cx)*factor;q[1]=b.cy+(q[1]-b.cy)*factor}R()}
function er(e){const L=md.L,k=kf(L,S.f);if(k==null)return;const[x,y]=loc(L,S.f,...pt(e)),r=Math.max(12,+sz.value*1.5);L.d[k]=L.d[k].filter(s=>!s.p.some(q=>Math.hypot(q[0]-x,q[1]-y)<r));R()}
function hitStroke(A,x,y){for(let i=A.length-1;i>=0;i--){const p=A[i].p;for(let j=0;j<p.length;j++){const a=p[j],b=p[Math.min(j+1,p.length-1)],dx=b[0]-a[0],dy=b[1]-a[1],t=cl(((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy||1),0,1);if(Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy)<Math.max(10,A[i].w+7))return A[i]}}return null}
function nearestPoint(s,x,y){let best=-1,dist=15;for(let i=0;i<s.p.length;i++){const d=Math.hypot(x-s.p[i][0],y-s.p[i][1]);if(d<dist){dist=d;best=i}}return best}
function setMode(m){mode=m;tool='select';vp.classList.remove('cursor-object','cursor-point');ui();msg(m==='object'?'Object Mode — select and move strokes':'Edit Mode — drag control points')}
function deleteSelected(){const q=selectedObject;if(!q||q.L!==S.l[S.i]||q.f!==S.f)return;const a=dr(q.L,q.f),i=a.indexOf(q.s);if(i<0)return;snap();a.splice(i,1);selectedObject=null;ui()}
function snap(){hist.push(JSON.stringify(S));if(hist.length>80)hist.shift();fut=[]}
function undo(){if(!hist.length)return;fut.push(JSON.stringify(S));const f=S.f;S=JSON.parse(hist.pop());S.f=cl(f,S.a,S.b);ui(1)}
function redo(){if(!fut.length)return;hist.push(JSON.stringify(S));const f=S.f;S=JSON.parse(fut.pop());S.f=cl(f,S.a,S.b);ui(1)}
vp.onpointerdown=e=>{vp.setPointerCapture(e.pointerId);
 if(pendingShape){if(e.button||e.altKey)return;const L=pendingShape.L,[x,y]=loc(L,pendingShape.f,...pt(e)),b=pendingBox(),h=b&&pendingHandle(b,x,y);if(h=='rotate'){md={t:'pendingRotate',L,s:pendingShape.s.p.map(q=>[...q]),cx:b.cx,cy:b.cy,start:Math.atan2(y-b.cy,x-b.cx)};vp.classList.remove('cursor-grab');vp.classList.add('cursor-rotate');msg('Drag rotation handle · Enter confirm · Esc cancel')}else if(h){const ax=h.includes('w')?b.x1:h.includes('e')?b.x0:b.cx,ay=h.includes('n')?b.y1:h.includes('s')?b.y0:b.cy,hp=b.handles[h];md={t:'pendingScale',L,s:pendingShape.s.p.map(q=>[...q]),anchor:[ax,ay],start:[hp[0]-ax,hp[1]-ay],axes:[h.includes('e')||h.includes('w'),h.includes('n')||h.includes('s')]};vp.classList.remove('cursor-grab');vp.classList.add(h=='e'||h=='w'?'cursor-ew':h=='n'||h=='s'?'cursor-ns':'cursor-scale');msg('Drag handles to resize · Enter confirm · Esc cancel')}else{md={t:'pendingMove',L,s:pendingShape.s,last:[x,y]};vp.classList.remove('cursor-grab');vp.classList.add('cursor-grabbing')}return}
 if(e.button==1||e.altKey){md={t:'pan',x:e.clientX,y:e.clientY,vx:view.x,vy:view.y};return}
 if(mo){endMo();return}
 const L=S.l[S.i];if(!L||e.button||!L.v)return;const p=pt(e),f=S.f;
 if(mode==='edit'||tool==='select'){const q=loc(L,f,p[0],p[1]),A=dr(L,f),hit=hitStroke(A,q[0],q[1]);if(!hit){selectedObject=null;R();return}selectedObject={L,f,s:hit};if(mode==='edit'){const index=nearestPoint(hit,q[0],q[1]);if(index>=0)md={t:'editPoint',L,f,s:hit,index,last:q};else md={t:'selectOnly'}}else md={t:'objectMove',L,f,s:hit,last:q};R();return}
 if(tool=='pivot'){snap();L.px=p[0];L.py=p[1];ui();return}
 const shapeTool=['line','box','oval'].includes(tool),before=shapeTool?JSON.stringify(S):null;
 if(!shapeTool)snap();if(tool=='erase'){md={t:'erase',L};er(e);return}
 if(!(f in L.d))L.d[f]=ad.checked?clone(dr(L,f)):[];
 const a=loc(L,f,p[0],p[1]),s={c:col.value,w:+sz.value/ev(L,f).s,f:fl.checked,p:[a]};L.d[f].push(s);md={t:tool,s,L,f,a,before};R()};
vp.onpointermove=e=>{const p=pt(e);ms=p;if(mo){mv(p);return}if(!md&&(mode==='edit'||tool==='select')){vp.classList.remove('cursor-object','cursor-point');const L=S.l[S.i];if(L){const q=loc(L,S.f,p[0],p[1]),hit=hitStroke(dr(L,S.f),q[0],q[1]);if(mode==='edit'&&selectedObject&&selectedObject.L===L&&selectedObject.f===S.f&&nearestPoint(selectedObject.s,q[0],q[1])>=0)vp.classList.add('cursor-point');else if(hit)vp.classList.add('cursor-object')}return}if(!md){if(pendingShape){const b=pendingBox(),q=loc(pendingShape.L,pendingShape.f,p[0],p[1]),h=b&&pendingHandle(b,q[0],q[1]);vp.classList.remove('cursor-grab','cursor-scale','cursor-nesw','cursor-ew','cursor-ns','cursor-rotate');const cls=h=='rotate'?'cursor-rotate':h=='e'||h=='w'?'cursor-ew':h=='n'||h=='s'?'cursor-ns':h=='nw'||h=='se'?'cursor-scale':h?'cursor-nesw':'cursor-grab';vp.classList.add(cls)}return}
 if(md.t=='pan'){view.x=md.vx+e.clientX-md.x;view.y=md.vy+e.clientY-md.y;V();return}
 if(md.t=='erase'){er(e);return}
 if(md.t=='objectMove'||md.t=='editPoint'){const q=loc(md.L,md.f,p[0],p[1]),dx=q[0]-md.last[0],dy=q[1]-md.last[1];if((dx||dy)&&!md.changed){snap();md.changed=true}if(md.t==='objectMove'){for(const v of md.s.p){v[0]+=dx;v[1]+=dy}}else{md.s.p[md.index][0]+=dx;md.s.p[md.index][1]+=dy}md.last=q;R();return}
 if(md.t=='pendingMove'){const q=loc(md.L,pendingShape.f,p[0],p[1]),dx=q[0]-md.last[0],dy=q[1]-md.last[1];for(const v of md.s.p){v[0]+=dx;v[1]+=dy}md.last=q;R();return}
 if(md.t=='pendingScale'){const q=loc(md.L,pendingShape.f,p[0],p[1]),fx=md.axes[0]&&Math.abs(md.start[0])>.001?Math.max(.02,(q[0]-md.anchor[0])/md.start[0]):1,fy=md.axes[1]&&Math.abs(md.start[1])>.001?Math.max(.02,(q[1]-md.anchor[1])/md.start[1]):1;pendingShape.s.p=md.s.map(v=>[md.anchor[0]+(v[0]-md.anchor[0])*fx,md.anchor[1]+(v[1]-md.anchor[1])*fy]);R();return}
 if(md.t=='pendingRotate'){const q=loc(md.L,pendingShape.f,p[0],p[1]),a=Math.atan2(q[1]-md.cy,q[0]-md.cx)-md.start,c=Math.cos(a),s=Math.sin(a);pendingShape.s.p=md.s.map(v=>[md.cx+(v[0]-md.cx)*c-(v[1]-md.cy)*s,md.cy+(v[0]-md.cx)*s+(v[1]-md.cy)*c]);R();return}
 const{s,L,f,a}=md,b=loc(L,f,p[0],p[1]);
 if(md.t=='draw'){const q=s.p[s.p.length-1];if(Math.hypot(b[0]-q[0],b[1]-q[1])>1.5)s.p.push(b)}else s.p=shape(md.t,a,b);R()};
vp.onpointerup=()=>{if(md&&md.t=='draw'){const p=md.s.p;for(let k=0;k<+sm.value;k++)for(let i=1;i<p.length-1;i++)p[i]=[(p[i-1][0]+p[i][0]*2+p[i+1][0])/4,(p[i-1][1]+p[i][1]*2+p[i+1][1])/4]}
 if(md&&['line','box','oval'].includes(md.t)){pendingShape={before:md.before,L:md.L,s:md.s,f:md.f};md=null;vp.classList.remove('cursor-grabbing');vp.classList.add('cursor-grab');R();msg('Drag to reposition · Enter to confirm · Esc to cancel');return}
 const was=md&&md.t!='pan',wasPendingMove=md&&md.t=='pendingMove',wasPendingTransform=md&&['pendingScale','pendingRotate'].includes(md.t);md=null;if(wasPendingMove||wasPendingTransform){vp.classList.remove('cursor-grabbing','cursor-scale','cursor-nesw','cursor-ew','cursor-ns','cursor-rotate');vp.classList.add('cursor-grab')}if(was)ui()};
vp.onwheel=e=>{e.preventDefault();if(pendingShape){scalePending(e.deltaY<0?1.08:1/1.08);msg('Scale preview · Enter confirm · Esc cancel');return}view.z=cl(view.z*(e.deltaY<0?1.1:.9),.1,8);V()};
vp.oncontextmenu=e=>{e.preventDefault();if(mo)cancelMo()};
function startMo(m){const L=S.l[S.i];if(!L||mo)return;snap();mo={m,L,t:ev(L,S.f),k0:clone(L.k),s:[...ms],ax:null};vp.classList.remove('cursor-grab','cursor-grabbing');vp.classList.add('cursor-move');msg({g:'Move',r:'Rotate',s:'Scale'}[m]+' — click to confirm, Esc to cancel')}
function mv(p){const{m,L,t,s,ax}=mo,px=L.px+t.x,py=L.py+t.y,u={};
 if(m=='g'){u.x=t.x+(ax=='y'?0:p[0]-s[0]);u.y=t.y+(ax=='x'?0:p[1]-s[1])}
 if(m=='r')u.r=t.r+(Math.atan2(p[1]-py,p[0]-px)-Math.atan2(s[1]-py,s[0]-px))*180/Math.PI;
 if(m=='s')u.s=Math.max(.01,t.s*Math.hypot(p[0]-px,p[1]-py)/Math.max(1,Math.hypot(s[0]-px,s[1]-py)));
 L.k[S.f]={...t,...u};ui()}
const endMo=()=>{mo=null;vp.classList.remove('cursor-move');ui(1)},cancelMo=()=>{mo.L.k=mo.k0;hist.pop();mo=null;vp.classList.remove('cursor-move');ui(1)};
function setP(p,v){const L=S.l[S.i];if(!L)return;snap();L.k[S.f]={...ev(L,S.f),[p]:v};ui(1)}
function jump(d){const L=S.l[S.i];if(!L)return;const K=[...new Set([...ks(L.d),...ks(L.k)])].sort((a,b)=>a-b),n=d>0?K.find(k=>k>S.f):K.filter(k=>k<S.f).pop();if(n!=null)go(n)}
function dup(){const L=S.l[S.i];if(!L)return;snap();L.d[S.f]=clone(dr(L,S.f));ui(1)}
const frameId=(i,f)=>`${i}:${f}`,readFrameId=id=>id.split(':').map(Number);
function copyFrames(){
 const items=[...frameSel].map(readFrameId).filter(([i,f])=>S.l[i]&&S.l[i].d[f]!=null);
 if(!items.length)return msg('Select drawing frames first');
 const mi=Math.min(...items.map(x=>x[0])),mf=Math.min(...items.map(x=>x[1]));
 frameClip=items.map(([i,f])=>({di:i-mi,df:f-mf,data:clone(S.l[i].d[f])}));msg(`Copied ${items.length} frame${items.length==1?'':'s'}`)
}
function pasteAt(baseI,baseF,offset=0){
 if(!frameClip.length)return msg('Copy frames first');snap();frameSel.clear();
 for(const item of frameClip){const i=cl(baseI+item.di,0,S.l.length-1),f=cl(baseF+item.df+offset,S.a,S.b);S.l[i].d[f]=clone(item.data);frameSel.add(frameId(i,f))}
 frameAnchor={i:baseI,f:baseF+offset};ui(1);msg(`Pasted ${frameClip.length} frame${frameClip.length==1?'':'s'}`)
}
function pasteFrames(){if(!frameClip.length)return msg('Copy frames first');pasteAt(S.i,S.f)}
function duplicateFrames(){
 const items=[...frameSel].map(readFrameId).filter(([i,f])=>S.l[i]&&S.l[i].d[f]!=null);
 if(!items.length)return msg('Select drawing frames first');
 const mi=Math.min(...items.map(x=>x[0])),mf=Math.min(...items.map(x=>x[1]));
 frameClip=items.map(([i,f])=>({di:i-mi,df:f-mf,data:clone(S.l[i].d[f])}));pasteAt(mi,mf,1)
}
function mirrorFrames(){
 const items=[...frameSel].map(readFrameId).filter(([i,f])=>S.l[i]&&S.l[i].d[f]!=null);
 if(!items.length)return msg('Select drawing frames first');snap();
 for(const [i,f] of items)for(const stroke of S.l[i].d[f])for(const p of stroke.p)p[0]=W-p[0];
 ui(1);msg(`Mirrored ${items.length} frame${items.length==1?'':'s'}`)
}
function moveFrames(delta){
 const items=[...frameSel].map(readFrameId).filter(([i,f])=>S.l[i]&&S.l[i].d[f]!=null);if(!items.length||!delta)return;
 const shift=cl(delta,S.a-Math.min(...items.map(x=>x[1])),S.b-Math.max(...items.map(x=>x[1])));if(!shift)return;
 const data=items.map(([i,f])=>({i,f,data:clone(S.l[i].d[f])}));snap();
 for(const {i,f} of data)delete S.l[i].d[f];frameSel.clear();
 for(const {i,f,data:d} of data){S.l[i].d[f+shift]=d;frameSel.add(frameId(i,f+shift))}
 ui(1);msg(`Moved ${items.length} frame${items.length==1?'':'s'}`)
}
function selectTimelineFrame(i,f,e){
 const key=frameId(i,f),toggle=e.ctrlKey||e.metaKey;
 if(e.shiftKey&&frameAnchor&&frameAnchor.i==i){const a=Math.min(frameAnchor.f,f),b=Math.max(frameAnchor.f,f);if(!toggle)frameSel.clear();for(const k of ks(S.l[i].d))if(k>=a&&k<=b)frameSel.add(frameId(i,k))}
 else if(toggle){if(frameSel.has(key))frameSel.delete(key);else frameSel.add(key);frameAnchor={i,f}}
 else{frameSel.clear();frameSel.add(key);frameAnchor={i,f}}
}
const go=f=>{S.f=cl(Math.round(f)||S.a,S.a,S.b);ui()};
function play(on){playing=on;pl.textContent=on?'❚❚':'▶';if(on){last=performance.now();requestAnimationFrame(tick)}}
function tick(t){if(!playing)return;if(t-last>=1000/S.fps){last=t;if(S.f>=S.b){if(rc){const m=rc;play(false);m.stop();return}S.f=S.a}else S.f++;ui()}requestAnimationFrame(tick)}
function addL(){snap();S.l.splice(S.i+1,0,mk('Layer '+(S.l.length+1)));S.i++;ui(1)}
function delL(){if(S.l.length<2)return msg('Keep at least one layer');snap();S.l.splice(S.i,1);S.i=Math.max(0,S.i-1);ui(1)}
function mvL(d){const j=S.i+d;if(j<0||j>=S.l.length)return;snap();[S.l[S.i],S.l[j]]=[S.l[j],S.l[S.i]];S.i=j;ui(1)}
const dl=(n,b)=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=n;a.click()};
async function save(n,b){try{const d=window.claude&&await claude.use('downloads');if(d){await d.save({filename:n,data:b});msg('Saved '+n)}else dl(n,b)}catch(e){if(!e||e.code!='declined')msg('Save failed: '+((e&&e.message)||e))}}
function png(){const c=document.createElement('canvas');c.width=W;c.height=H;draw(c.getContext('2d'),S.f,0);c.toBlob(b=>save('frame-'+S.f+'.png',b))}
function rec(){if(rc)return;let m;try{m=new MediaRecorder(cv.captureStream(S.fps),{mimeType:'video/webm'})}catch(e){return msg('WebM export is not supported in this browser')}
 const ch=[];m.ondataavailable=e=>ch.push(e.data);m.onstop=()=>{rc=0;ui();save('animation.webm',new Blob(ch,{type:'video/webm'}))};rc=m;go(S.a);m.start();play(true);msg('Recording one pass…')}
function LL(){ll.innerHTML=S.l.map((L,i)=>`<div class="ly${i==S.i?' on':''}" data-i=${i}><input type=checkbox data-v=${i} ${L.v?'checked':''} title=Visible><span>${esc(L.n)}</span></div>`).reverse().join('')}
function DS(){const c=ds.getContext('2d'),w=ds.width=ds.clientWidth,h=ds.height=ds.clientHeight,n=S.b-S.a+1,u=(w-104)/n,X=f=>96+(f-S.a+.5)*u;
 c.fillStyle='#1f1f1f';c.fillRect(0,0,w,h);c.fillStyle='#303030';c.fillRect(0,0,w,24);c.font='10px system-ui';c.textBaseline='middle';
 const step=Math.max(1,Math.ceil(30/u));for(let f=S.a;f<=S.b;f++)if((f-S.a)%step==0){c.fillStyle='#2c2c2c';c.fillRect(X(f)-.5,24,1,h);c.fillStyle='#9a9a9a';c.fillText(f,X(f)-4,12)}
 S.l.forEach((L,i)=>{const y=24+(S.l.length-1-i)*22;c.fillStyle=i==S.i?'#34404f':'#262626';c.fillRect(0,y,w,21);c.fillStyle=L.v?'#d6d6d6':'#777';c.fillText(L.n.slice(0,14),6,y+11);
  const D=ks(L.d);D.forEach((k,j)=>{const e=D[j+1]??S.b+1;c.fillStyle='#3b5f8a88';c.fillRect(X(k),y+8,Math.max(0,X(e)-X(k)),5);c.fillStyle='#8fb4e3';c.fillRect(X(k)-4,y+5,8,11);if(frameSel.has(frameId(i,k))){c.strokeStyle='#fff';c.lineWidth=1.5;c.strokeRect(X(k)-6,y+3,12,15)}});
  ks(L.k).forEach(k=>{const x=X(k);c.fillStyle='#e87d0d';c.beginPath();c.moveTo(x,y+4);c.lineTo(x+6,y+10.5);c.lineTo(x,y+17);c.lineTo(x-6,y+10.5);c.fill()})});
 const x=X(S.f);c.fillStyle='#4772b3';c.fillRect(x-1,0,2,h);c.fillRect(x-13,2,26,15);c.fillStyle='#fff';c.fillText(S.f,x-6,10)}
ds.onpointerdown=e=>{ds.setPointerCapture(e.pointerId);const r=ds.getBoundingClientRect(),u=(r.width-104)/(S.b-S.a+1),x=e.clientX-r.left,y=e.clientY-r.top;
 const setFrame=e=>go(S.a+(e.clientX-r.left-96)/u-.5);
 if(y>24){const i=S.l.length-1-Math.floor((y-24)/22);if(S.l[i]){S.i=i;LL();const f=cl(Math.round(S.a+(x-96)/u-.5),S.a,S.b),hit=ks(S.l[i].d).find(k=>Math.abs((96+(k-S.a+.5)*u)-x)<=Math.max(6,u*.45));
  if(hit!=null){selectTimelineFrame(i,hit,e);S.f=hit;timelineDrag={origin:hit};ui()}else{if(!e.shiftKey&&!e.ctrlKey&&!e.metaKey){frameSel.clear();frameAnchor=null}timelineDrag=null;setFrame(e);DS()}
 }}else{timelineDrag=null;setFrame(e)}};
ds.onpointermove=e=>{if(e.buttons&&timelineDrag)setTimelineFrame(e);else if(e.buttons){const r=ds.getBoundingClientRect(),u=(r.width-104)/(S.b-S.a+1);go(S.a+(e.clientX-r.left-96)/u-.5)}};
ds.onpointerup=()=>{if(timelineDrag){const delta=S.f-timelineDrag.origin;timelineDrag=null;if(delta)moveFrames(delta);else DS()}};
function setTimelineFrame(e){const r=ds.getBoundingClientRect(),u=(r.width-104)/(S.b-S.a+1);go(S.a+(e.clientX-r.left-96)/u-.5)}
const PR=[['x','X',1],['y','Y',1],['r','Rotation°',1],['s','Scale',.05],['o','Opacity',.05]],TL=[['select','↖','Select object (V)'],['draw','✎','Draw (D)'],['erase','⌫','Erase strokes (E)'],['line','╱','Line (L)'],['box','▭','Box (B)'],['oval','◯','Ellipse (O)'],['pivot','⌖','Set pivot (P)']];
tf.innerHTML=PR.map(([p,n,s])=>`<label>${n}<input type=number step=${s} data-p=${p}></label>`).join('');
tb.innerHTML=TL.map(([t,g,n])=>`<button data-t="${t}" title="${n}">${g}</button>`).join('');
tf.onchange=e=>{const p=e.target.dataset.p;let v=parseFloat(e.target.value);if(!p||isNaN(v))return;if(p=='o')v=cl(v,0,1);if(p=='s')v=Math.max(.01,v);setP(p,v)};
tb.onclick=e=>{const t=e.target.dataset.t;if(t){tool=t;if(t==='select')mode='object';ui()}};
modeSelect.onchange=e=>setMode(e.target.value);
ll.onclick=e=>{const d=e.target.closest('[data-i]');if(!d)return;if(e.target.dataset.v!=null){snap();S.l[e.target.dataset.v].v=e.target.checked?1:0;ui(1);return}S.i=+d.dataset.i;ui(1)};
ln.oninput=e=>{S.l[S.i].n=e.target.value;LL();DS()};
bm.onchange=e=>{snap();S.l[S.i].bm=e.target.value;ui()};ie.onchange=e=>{snap();S.l[S.i].e=e.target.value;ui()};
oi.oninput=e=>{S.on=+e.target.value;ui()};bgc.oninput=e=>{S.bg=e.target.value;ui()};
fi.onchange=e=>go(+e.target.value);fps.onchange=e=>{S.fps=cl(+e.target.value||24,1,120);ui()};
fa.onchange=e=>{S.a=cl(Math.round(+e.target.value)||1,1,S.b);S.f=cl(S.f,S.a,S.b);ui()};fb.onchange=e=>{S.b=cl(Math.round(+e.target.value)||48,S.a,999);S.f=cl(S.f,S.a,S.b);ui()};
bn.onclick=()=>{snap();S=fresh();fit();ui(1);msg('New project — Undo brings the old one back')};
bs.onclick=()=>save('animation.json',new Blob([JSON.stringify(S)],{type:'application/json'}));bo.onclick=()=>ld.click();bu.onclick=undo;br.onclick=redo;bp.onclick=png;bw.onclick=rec;bh.onclick=()=>hp.hidden=!hp.hidden;
ld.onchange=async e=>{try{const j=JSON.parse(await e.target.files[0].text());if(!j.l||!j.l.length)throw 0;snap();S=j;S.i=cl(S.i|0,0,S.l.length-1);S.f=cl(S.f||1,S.a,S.b);ui(1)}catch(x){msg('That is not a Keyframe project file')}e.target.value=''};
addEventListener('change',e=>e.target.blur());addEventListener('click',e=>{if(e.target.tagName=='BUTTON')e.target.blur()});
addEventListener('resize',()=>{fit();DS()});
addEventListener('keydown',e=>{const T=e.target;if(/^(SELECT|TEXTAREA)$/.test(T.tagName)||T.type=='number'||T.type=='text')return;
 const k=e.key.toLowerCase(),c=e.ctrlKey||e.metaKey,L=S.l[S.i];
 if(pendingShape){if(k=='enter'){hist.push(pendingShape.before);if(hist.length>80)hist.shift();fut=[];pendingShape=null;vp.classList.remove('cursor-grab','cursor-grabbing','cursor-scale','cursor-nesw','cursor-ew','cursor-ns','cursor-rotate');ui();msg('Shape confirmed')}else if(k=='escape'){S=JSON.parse(pendingShape.before);pendingShape=null;vp.classList.remove('cursor-grab','cursor-grabbing','cursor-scale','cursor-nesw','cursor-ew','cursor-ns','cursor-rotate');ui(1);msg('Shape cancelled')}else if(['arrowleft','arrowright','arrowup','arrowdown'].includes(k)){const dx=k=='arrowleft'?-1:k=='arrowright'?1:0,dy=k=='arrowup'?-1:k=='arrowdown'?1:0,step=e.shiftKey?10:1;for(const p of pendingShape.s.p){p[0]+=dx*step;p[1]+=dy*step}R();e.preventDefault()}else if(k==']'||k=='+'||k=='='){scalePending(1.1);e.preventDefault()}else if(k=='['||k=='-'){scalePending(1/1.1);e.preventDefault()}else e.preventDefault();return}
 if(mo){if(k=='escape')cancelMo();else if(k=='enter')endMo();else if((k=='x'||k=='y')&&mo.m=='g'){mo.ax=mo.ax==k?null:k;mv(ms)}return}
 if(k==='tab'){e.preventDefault();setMode(mode==='object'?'edit':'object');return}
 if(c&&k=='z'){e.preventDefault();e.shiftKey?redo():undo();return}if(c&&k=='y'){e.preventDefault();redo();return}
 if(c&&k=='c'){e.preventDefault();copyFrames();return}if(c&&k=='v'){e.preventDefault();pasteFrames();return}if(c&&k=='d'){e.preventDefault();duplicateFrames();return}if(c)return;
 const TK={v:'select',d:'draw',e:'erase',l:'line',b:'box',o:'oval',p:'pivot'};if(TK[k]&&!e.shiftKey){tool=TK[k];if(tool==='select')mode='object';ui();return}
 const act={' ':()=>play(!playing),arrowright:()=>go(e.shiftKey?S.b:S.f+1),arrowleft:()=>go(e.shiftKey?S.a:S.f-1),arrowup:()=>jump(1),arrowdown:()=>jump(-1),
  g:()=>startMo('g'),r:()=>startMo('r'),s:()=>startMo('s'),
  i:()=>{if(!L)return;snap();if(e.altKey)delete L.k[S.f];else L.k[S.f]=ev(L,S.f);ui(1)},
  x:()=>{if(L&&S.f in L.d){snap();delete L.d[S.f];selectedObject=null;ui(1)}},delete:()=>selectedObject?deleteSelected():act.x(),
  a:()=>e.shiftKey&&addL(),d:()=>e.shiftKey&&dup(),m:()=>e.shiftKey&&mirrorFrames(),home:fit,'?':()=>hp.hidden=!hp.hidden};
 if(act[k]){e.preventDefault();act[k]()}});
function ui(full){if(full)LL();R();DS();const L=S.l[S.i],A=document.activeElement;
 if(L){const t=ev(L,S.f);tf.querySelectorAll('input').forEach(i=>{if(A!=i)i.value=+(+t[i.dataset.p]).toFixed(2)});if(A!=ln)ln.value=L.n;bm.value=L.bm;ie.value=L.e}
 [[fi,S.f],[fps,S.fps],[fa,S.a],[fb,S.b]].forEach(([i,v])=>{if(A!=i)i.value=v});oi.value=S.on;bgc.value=S.bg;
 tb.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.t==tool));modeSelect.value=mode;
 clearTimeout(saveT);saveT=setTimeout(()=>{try{localStorage.kf=JSON.stringify(S)}catch(e){}},600)}
try{S=JSON.parse(localStorage.kf);if(!S.l.length)throw 0}catch(e){S=fresh()}
S.i=cl(S.i|0,0,S.l.length-1);fit();ui(1);

/* Studio v2 runtime */
(function(){const Vp=vp,C=document.getElementById('crosshair'),Z=document.getElementById('zoomRead'),CO=document.getElementById('coordRead'),FR=document.getElementById('frameRead');function notice(s){if(typeof msg==='function')msg(s)}function grid(){Vp.classList.toggle('gridOn');notice('Grid '+(Vp.classList.contains('gridOn')?'on':'off'))}function guides(){C.style.opacity=C.style.opacity==='1'?'0':'1'}document.querySelectorAll('[data-menu]').forEach(b=>b.onclick=e=>{const w=b.parentElement;document.querySelectorAll('.menuWrap').forEach(x=>x!==w&&x.classList.remove('open'));w.classList.toggle('open');e.stopPropagation()});document.addEventListener('click',()=>document.querySelectorAll('.menuWrap').forEach(x=>x.classList.remove('open')));document.querySelectorAll('.menuItem').forEach(x=>x.onclick=()=>{const a=x.dataset.action;if(a==='new')bn.click();if(a==='save')bs.click();if(a==='open')bo.click();if(a==='undo')bu.click();if(a==='redo')br.click();if(a==='duplicate')duplicateFrames();if(a==='grid')grid();if(a==='center')fit();if(a==='cross')guides()});document.getElementById('gridBtn').onclick=grid;document.getElementById('crossBtn').onclick=guides;document.getElementById('fitBtn').onclick=fit;document.getElementById('resetBtn').onclick=()=>{view.z=1;view.x=0;view.y=0;V()};document.querySelectorAll('[data-qt]').forEach(b=>b.onclick=()=>{tool=b.dataset.qt;if(tool==='select')mode='object';ui()});document.querySelectorAll('[data-size]').forEach(b=>b.onclick=()=>{sz.value=b.dataset.size;notice(b.textContent+' brush · '+b.dataset.size+' px')});Vp.addEventListener('pointermove',e=>{const p=pt(e);CO.textContent='X '+Math.round(p[0])+' · Y '+Math.round(p[1]);Z.textContent=Math.round(view.z*100)+'%';FR.textContent='F '+S.f+' / '+S.b});const oldUI=ui;ui=function(full){oldUI(full);Z.textContent=Math.round(view.z*100)+'%';FR.textContent='F '+S.f+' / '+S.b};addEventListener('keydown',e=>{const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='SELECT'||t.tagName==='TEXTAREA'))return;const k=e.key.toLowerCase(),c=e.ctrlKey||e.metaKey;if(c&&k==='s'){e.preventDefault();bs.click()}else if(c&&k==='o'){e.preventDefault();bo.click()}else if(c&&k==='n'){e.preventDefault();bn.click()}})})();
/* Phase 2 runtime */
(function(){
 const exposureRead=document.getElementById('exposureRead'),keyList=document.getElementById('keyList'),timelineInfo=document.getElementById('timelineInfo');
 function currentL(){return S.l[S.i]}
 function insertBlank(){const L=currentL();if(!L)return;snap();L.d[S.f]=[];selectedObject=null;ui(1);msg('Blank drawing inserted at frame '+S.f)}
 function duplicateDrawing(){const L=currentL(),src=kf(L,S.f);if(!L||src==null)return msg('No drawing to duplicate');snap();L.d[S.f]=clone(L.d[src]);ui(1);msg('Drawing duplicated to frame '+S.f)}
 function holdTwice(){const L=currentL(),src=kf(L,S.f);if(!L||src==null)return msg('No drawing to hold');const end=cl(S.f+1,S.a,S.b);snap();L.d[end]=clone(L.d[src]);ui(1);msg('Drawing held through frame '+end)}
 function clearDrawing(){const L=currentL();if(!L||L.d[S.f]==null)return msg('No drawing on this frame');snap();delete L.d[S.f];selectedObject=null;ui(1);msg('Drawing exposure cleared')}
 document.getElementById('blankBtn').onclick=insertBlank;document.getElementById('dupDrawBtn').onclick=duplicateDrawing;document.getElementById('holdBtn').onclick=holdTwice;document.getElementById('clearFrameBtn').onclick=clearDrawing;
 document.querySelectorAll('[data-fps]').forEach(b=>b.onclick=()=>{S.fps=+b.dataset.fps;ui();msg('Playback '+S.fps+' FPS')});
 function updatePhase2(){const L=currentL();if(!L){exposureRead.textContent='Exposure: —';keyList.innerHTML='';return}
  const k=kf(L,S.f),D=ks(L.d);let next=D.find(x=>x>S.f),len=next==null?S.b+1-k:next-k;
  exposureRead.textContent=k==null?'Exposure: empty':'Exposure: F'+k+' → F'+(k+len-1)+' · '+len+' frame'+(len==1?'':'s');
  const K=ks(L.k);keyList.innerHTML=K.length?K.map(f=>'<div class="keyRow"><span>◆ <b>F'+f+'</b> · X '+(+L.k[f].x).toFixed(1)+' Y '+(+L.k[f].y).toFixed(1)+'</span><button class="keyGo" data-key="'+f+'">Go</button></div>').join(''):'<div class="keyRow">No transform keys</div>';
  keyList.querySelectorAll('[data-key]').forEach(b=>b.onclick=()=>go(+b.dataset.key));
  timelineInfo.textContent='L'+(S.i+1)+' · '+D.length+' drawings · '+K.length+' transform keys';
 }
 const oldUI=ui;ui=function(full){oldUI(full);updatePhase2()};
 const oldPlay=play; /* keep existing playback engine; controls remain model-compatible */
 addEventListener('keydown',e=>{const T=e.target;if(T&&(T.tagName==='INPUT'||T.tagName==='SELECT'||T.tagName==='TEXTAREA'))return;const k=e.key.toLowerCase();if(k==='i'&&e.shiftKey){e.preventDefault();insertBlank()}else if(k==='d'&&e.shiftKey){e.preventDefault();duplicateDrawing()}});
 updatePhase2();
})();
/* Object Mode dedicated workspace */
(function(){
 const page=document.getElementById('objectModePage'), out=document.getElementById('objectTransform');
 if(!page)return;
 function renderObjectPage(){
   const active=window.getBlenderMode?window.getBlenderMode():'object';
   document.body.classList.toggle('object-mode',active==='object');
   const L=S.l&&S.l[S.i], t=L?ev(L,S.f):{x:0,y:0,r:0,s:1,o:1};
   if(out)out.innerHTML=L?'<label>X<input data-op="x" type="number" step="1" value="'+t.x.toFixed(1)+'"></label><label>Y<input data-op="y" type="number" step="1" value="'+t.y.toFixed(1)+'"></label><label>Rotation<input data-op="r" type="number" step="1" value="'+t.r.toFixed(1)+'"></label><label>Scale<input data-op="s" type="number" step=".01" value="'+t.s.toFixed(2)+'"></label>':'';
   if(out&&L)out.querySelectorAll('[data-op]').forEach(inp=>inp.onchange=()=>{const key=inp.dataset.op,val=+inp.value;if(!Number.isFinite(val))return;snap();L.k[S.f]={...ev(L,S.f),[key]:key==='s'?Math.max(.01,val):val};ui(1);msg('Object transform updated')});
 }
 page.querySelectorAll('[data-object-tool]').forEach(b=>b.onclick=()=>{
   const a=b.dataset.objectTool;
   if(a==='select'){tool='select';mode='object';selectedObject=null;ui();msg('Object Select')}
   else if(a==='move'){startMo('g')}
   else if(a==='rotate'){startMo('r')}
   else if(a==='scale'){startMo('s')}
   else if(a==='duplicate'&&typeof duplicateDrawing==='function'){duplicateDrawing()}
   else if(a==='delete'&&typeof deleteSelected==='function'){deleteSelected()}
 });
 const oldUI=ui;ui=function(full){oldUI(full);renderObjectPage()};
 renderObjectPage();
})();
/* Blender-style mode system */
(function(){
 const dock=document.getElementById('modeDock'),ws=document.getElementById('modeWorkspace'),badge=document.getElementById('modeBadge'),sel=document.getElementById('modeSelect');
 const names={object:'Object',edit:'Edit',draw:'Draw',sculpt:'Sculpt',vertex:'Vertex Paint',weight:'Weight Paint'};
 const modes=Object.keys(names);
 let activeMode=(typeof mode!=='undefined'&&mode==='edit')?'edit':'object';
 let sculptAction='grab',paintColor='#f08018',paintStrength=1,weightStrength=1,sculptRadius=45,lastP=null;

 function refreshModeUI(){
   if(sel)sel.value=activeMode;
   if(badge)badge.textContent=names[activeMode];
   if(dock)dock.querySelectorAll('[data-blmode]').forEach(b=>b.classList.toggle('on',b.dataset.blmode===activeMode));
   modes.forEach(x=>{const el=document.getElementById(x+'WS');if(el)el.style.display=x===activeMode?'block':'none'});
   const pie=document.getElementById('modePie'); if(pie)pie.querySelectorAll('[data-pie-mode]').forEach(b=>b.classList.toggle('active',b.dataset.pieMode===activeMode));
 }
 function setModeX(m){
   if(!names[m])m='object';
   activeMode=m;
   // The original editor only needs object/edit in its core state.
   mode=(m==='edit')?'edit':'object';
   if(m==='draw')tool='draw'; else tool='select';
   refreshModeUI();
   if(typeof ui==='function')ui();
   if(typeof msg==='function')msg(names[m]+' Mode');
 }
 window.setBlenderMode=setModeX;
 window.getBlenderMode=()=>activeMode;
 if(dock)dock.querySelectorAll('[data-blmode]').forEach(b=>b.onclick=()=>setModeX(b.dataset.blmode));
 if(sel)sel.addEventListener('change',()=>setModeX(sel.value));
 document.querySelectorAll('[data-mwtool]').forEach(b=>b.onclick=()=>{
   const t=b.dataset.mwtool;
   if(t==='select')tool='select'; else if(t==='draw')tool='draw'; else if(t==='line')tool='line'; else if(t==='box')tool='box'; else if(t==='oval')tool='oval'; else if(t==='pivot')tool='pivot';
   else if(t==='duplicate'&&typeof duplicateDrawing==='function')duplicateDrawing();
   else if(t==='delete'&&typeof deleteSelected==='function')deleteSelected();
   else if(t==='mirror'&&typeof mirrorFrames==='function')mirrorFrames();
   if(typeof ui==='function')ui();
 });
 document.querySelectorAll('[data-sculpt]').forEach(b=>b.onclick=()=>{
   sculptAction=b.dataset.sculpt;
   document.querySelectorAll('[data-sculpt]').forEach(x=>x.classList.toggle('on',x===b));
   if(typeof msg==='function')msg('Sculpt: '+sculptAction);
 });
 const sr=document.getElementById('sculptRadius'); if(sr)sr.oninput=e=>sculptRadius=+e.target.value;
 const vc=document.getElementById('vertexColor'); if(vc)vc.oninput=e=>paintColor=e.target.value;
 const vs=document.getElementById('vertexStrength'); if(vs)vs.oninput=e=>paintStrength=+e.target.value;
 const wr=document.getElementById('weightStrength'),wv=document.getElementById('weightRead');
 if(wr)wr.oninput=e=>{weightStrength=+e.target.value;if(wv)wv.textContent=weightStrength.toFixed(2)};

 function activeStrokeAt(L,f,x,y){
   const d=L&&L.d[f];if(!d)return null;
   let best=null,bd=Infinity;
   for(const st of d)for(let j=0;j<st.p.length;j++){const p=st.p[j],dd=(p[0]-x)**2+(p[1]-y)**2;if(dd<bd){bd=dd;best={st,j}}}
   return bd<=sculptRadius*sculptRadius?best:null;
 }
 function paintStroke(L,f,x,y){
   const hit=activeStrokeAt(L,f,x,y);if(!hit)return;
   hit.st.c=paintColor;hit.st.a=paintStrength;
   if(typeof R==='function')R();
 }
 function weightStroke(L,f,x,y){
   const hit=activeStrokeAt(L,f,x,y);if(!hit)return;
   hit.st.weights=hit.st.weights||hit.st.p.map(()=>0);
   const rr=sculptRadius;
   hit.st.p.forEach((p,i)=>{const d=Math.hypot(p[0]-x,p[1]-y);if(d<rr){const q=1-d/rr;hit.st.weights[i]=Math.max(0,Math.min(1,weightStrength*q+(1-q)*(hit.st.weights[i]||0)));}});
   if(typeof R==='function')R();
 }
 function sculptStroke(L,f,x,y,dx,dy){
   const hit=activeStrokeAt(L,f,x,y);if(!hit)return;
   const st=hit.st,rr=sculptRadius;
   for(let i=0;i<st.p.length;i++){
     const p=st.p[i],d=Math.hypot(p[0]-x,p[1]-y);if(d>rr)continue;
     const q=1-d/rr;
     if(sculptAction==='smooth'&&i>0&&i<st.p.length-1){
       p[0]+=(st.p[i-1][0]+st.p[i+1][0]-2*p[0])*.18*q;
       p[1]+=(st.p[i-1][1]+st.p[i+1][1]-2*p[1])*.18*q;
     }else if(sculptAction==='grab'||sculptAction==='push'){
       p[0]+=dx*q;p[1]+=dy*q;
     }else if(sculptAction==='erase'){
       p[0]+=(p[0]-x)*.08*q;p[1]+=(p[1]-y)*.08*q;
     }
   }
   if(typeof R==='function')R();
 }
 vp.addEventListener('pointerdown',e=>{
   if(activeMode!=='vertex'&&activeMode!=='weight'&&activeMode!=='sculpt')return;
   const p=pt(e);lastP=p;snap();e.stopImmediatePropagation();
 },true);
 vp.addEventListener('pointermove',e=>{
   if(!lastP||!(e.buttons&1))return;
   if(activeMode!=='vertex'&&activeMode!=='weight'&&activeMode!=='sculpt'){lastP=null;return}
   const p=pt(e),L=S.l[S.i];
   if(activeMode==='vertex')paintStroke(L,S.f,p[0],p[1]);
   else if(activeMode==='weight')weightStroke(L,S.f,p[0],p[1]);
   else sculptStroke(L,S.f,p[0],p[1],p[0]-lastP[0],p[1]-lastP[1]);
   lastP=p;e.stopImmediatePropagation();
 },true);
 vp.addEventListener('pointerup',e=>{
   if(lastP){lastP=null;if(typeof ui==='function')ui(1);e.stopImmediatePropagation()}
 },true);
 setModeX(activeMode);
})();

/* Blender-style Ctrl+Tab mode pie */
(function(){
 const pie=document.getElementById('modePie'),sel=document.getElementById('modeSelect');
 if(!pie)return;
 let open=false;
 function sync(){
   const m=typeof window.getBlenderMode==='function'?window.getBlenderMode():'object';
   if(sel)sel.value=m;
   pie.querySelectorAll('[data-pie-mode]').forEach(b=>b.classList.toggle('active',b.dataset.pieMode===m));
 }
 function close(){open=false;pie.classList.remove('open');pie.setAttribute('aria-hidden','true');sync()}
 function show(){open=true;pie.classList.add('open');pie.setAttribute('aria-hidden','false');sync()}
 window.openModePie=show;window.closeModePie=close;
 pie.querySelectorAll('[data-pie-mode]').forEach(b=>b.addEventListener('click',e=>{
   e.stopPropagation();
   if(typeof window.setBlenderMode==='function')window.setBlenderMode(b.dataset.pieMode);
   close();
 }));
 document.addEventListener('keydown',e=>{
   if(e.ctrlKey&&e.key==='Tab'){e.preventDefault();e.stopImmediatePropagation();open?close():show();return}
   if(open&&e.key==='Escape'){e.preventDefault();close()}
 },true);
 document.addEventListener('pointerdown',e=>{if(open&&!pie.contains(e.target))close()});
 sync();
})();
