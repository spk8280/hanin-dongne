// 한인동네 추가 기능: 이사·귀국 정리, 같이 사요(공동구매), 안전 만남 체크인, 알림·키워드 알림

I.box='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 7l9-4 9 4-9 4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/></svg>';
I.people='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="8" r="3.2"/><circle cx="17" cy="9" r="2.6"/><path d="M3 20c.8-3.4 3.2-5.2 6-5.2s5.2 1.8 6 5.2"/><path d="M15.5 14.6c2.6.1 4.6 1.8 5.3 4.9"/></svg>';
I.bell='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0" stroke-linecap="round"/></svg>';
CATS.moving={n:'이사·귀국 정리',c:'coral',i:'box'};
CATS.group={n:'같이 사요',c:'indigo',i:'people'};

(function(){const s=document.createElement('style');s.textContent=`
.utabs{overflow-x:auto;scrollbar-width:none}.utabs::-webkit-scrollbar{display:none}.utabs button{flex:none}
.prog{height:8px;border-radius:4px;background:var(--surface);overflow:hidden;margin:8px 0 6px}
.prog i{display:block;height:100%;background:var(--indigo);border-radius:4px}
.mgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
.mitem{border:1px solid var(--line);border-radius:14px;overflow:hidden;background:var(--bg);display:flex;flex-direction:column}
.mitem .im{aspect-ratio:1/1;background:var(--surface);display:grid;place-items:center;color:var(--faint);position:relative}
.mitem .im img{width:100%;height:100%;object-fit:cover}
.mitem .im .tag{position:absolute;left:6px;top:6px}
.mitem.done .im img{filter:grayscale(1) opacity(.5)}
.mitem .tx{padding:8px 10px 10px;display:flex;flex-direction:column;gap:2px;flex:1}
.mitem .tx b{font-size:14px;font-weight:600;line-height:1.35}
.mitem .tx span{font-size:14px;font-weight:800}
.mitem select,.mitem .ask{margin-top:6px;height:32px;font-size:13px;border-radius:8px;border:1px solid var(--line);background:var(--surface);color:var(--ink);width:100%}
.itemrow{display:flex;gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid var(--line)}
.itemrow .ip{flex:none;width:62px;height:62px;border-radius:10px;border:1px dashed var(--line);display:grid;place-items:center;color:var(--sub);overflow:hidden;position:relative;font-size:11px}
.itemrow .ip img{width:100%;height:100%;object-fit:cover}
.itemrow .ip.busy::after{content:'AI…';position:absolute;inset:0;background:rgba(79,95,224,.8);color:#fff;display:grid;place-items:center;font-weight:700}
.itemrow .flds{flex:1;display:flex;flex-direction:column;gap:6px;min-width:0}
.itemrow .flds .in{height:40px;font-size:15px}
.itemrow .rm{flex:none;width:30px;height:30px;border-radius:50%;background:var(--surface);color:var(--sub);display:grid;place-items:center}
.addrow{width:100%;height:46px;border:1.5px dashed var(--line);border-radius:12px;color:var(--sub);font-weight:600;margin-top:10px}
.gbox{border:1px solid var(--line);border-radius:16px;padding:16px;margin:14px 0}
.gbox .big{font-size:22px;font-weight:800;letter-spacing:-.02em}
.gbox .row{display:flex;justify-content:space-between;align-items:center;gap:10px}
.stepper{display:flex;align-items:center;border:1px solid var(--line);border-radius:10px;overflow:hidden}
.stepper button{width:38px;height:38px;font-size:18px;font-weight:700}
.stepper b{min-width:30px;text-align:center}
.plist{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.safebtn{display:flex;gap:12px;align-items:center;width:calc(100% - 32px);margin:0 16px 14px;padding:14px;border-radius:14px;background:var(--jade-soft);color:var(--ink);text-align:left}
.safebtn .ic{flex:none;width:36px;height:36px;border-radius:10px;background:var(--jade);color:#fff;display:grid;place-items:center}
.safebtn b{display:block;font-size:15px}.safebtn small{font-size:12.5px;color:var(--sub)}
.meetbar{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(66px + var(--safe-b));width:calc(100% - 24px);max-width:496px;z-index:13;background:var(--ink);color:var(--bg);border-radius:16px;padding:12px 14px;display:flex;align-items:center;gap:10px;box-shadow:var(--shadow)}
.meetbar .t{flex:1;font-size:13.5px;line-height:1.4;-webkit-line-clamp:2}
.meetbar button{flex:none;height:36px;padding:0 12px;border-radius:10px;background:var(--jade);color:#fff;font-weight:700;font-size:13px}
.bellwrap{position:relative}
.bellwrap .dot{position:absolute;top:4px;right:2px;min-width:18px;height:18px;border-radius:9px;background:var(--coral);color:#fff;font-size:11px;font-weight:800;display:grid;place-items:center;padding:0 5px}
.bellwrap .dot:empty{display:none}
.noti{display:flex;gap:12px;padding:14px 0;border-bottom:1px solid var(--line);width:100%;text-align:left}
.noti .ic{flex:none;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;color:#fff}
.noti .b{font-size:14.5px;line-height:1.45}
.noti.unread .b{font-weight:700}
.noti.read{opacity:.6}
.kwchips{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.kwchips span{display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 6px 0 14px;border-radius:18px;background:var(--jade-soft);color:var(--jade);font-weight:700;font-size:14px}
.kwchips button{width:24px;height:24px;border-radius:50%;background:rgba(0,0,0,.08);display:grid;place-items:center}
.famview{max-width:520px;margin:0 auto;min-height:100vh;padding:calc(40px + env(safe-area-inset-top,0px)) 24px 40px}
.famcard{border-radius:20px;padding:22px;margin-top:22px}
.famcard .st{font-size:22px;font-weight:800;letter-spacing:-.03em;margin-bottom:12px}
.famcard .r{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-top:1px solid rgba(0,0,0,.08);font-size:15px}
.famcard .r span:first-child{color:var(--sub)}
`;document.head.appendChild(s)})();

const fmtTime=d=>new Date(d).toLocaleString('ko-KR',{month:'numeric',day:'numeric',weekday:'short',hour:'numeric',minute:'2-digit'});
let movingMap={},groupMap={},notiTimer=null,activeMeet=null;

// ---------- 글 종류 선택 ----------
function pickCategory(){
  const d={sale:'사진만 찍으면 AI가 제목·설명·가격을 채워요',free:'안 쓰는 물건을 이웃에게 무료로',moving:'이사·귀국 살림을 한 번에 정리해요',group:'코스트코·김장 재료 같이 나눠 사요',help:'부탁하거나, 도와줄 수 있는 일',info:'맛집, 병원, 학교, 구인, 렌트, 질문'};
  const order=['sale','free','moving','group','help','info'];
  openSheet(`<h3>어떤 글을 쓸까요?</h3><div class="catgrid">${order.map(k=>{const c=CATS[k];return `<button data-c="${k}"><span class="ci" style="background:var(--${c.c})">${I[c.i]}</span><b>${c.n}</b><small>${d[k]}</small></button>`}).join('')}</div>`);
  $$('#sheetPanel [data-c]').forEach(b=>b.onclick=()=>{closeSheet();writePage(b.dataset.c)});
}

// ---------- 목록 ----------
function render(){
  $$('#tabbar button').forEach(b=>b.classList.toggle('on',b.dataset.t===tab));
  $('#fab').style.display=tab==='me'?'none':'flex';
  const v=$('#view');
  if(tab==='home'){
    v.innerHTML=`<div class="utabs" id="utabs">${[['all','전체'],['sale','중고거래'],['free','나눔'],['moving','이사정리'],['group','같이 사요']].map(([k,n])=>`<button data-k="${k}" class="${homeCat===k?'on':''}">${n}</button>`).join('')}</div>
      <div class="chips" id="chips"></div><div class="list" id="list"></div>`;
    $('#utabs').onclick=e=>{const b=e.target.closest('[data-k]');if(!b)return;homeCat=b.dataset.k;chip='';$$('#utabs button').forEach(x=>x.classList.toggle('on',x===b));renderList()};
  }else if(tab==='help'||tab==='info'){
    v.innerHTML=`<div class="chips" id="chips"></div><div class="list" id="list"></div>`;
  }else{renderMe();return}
  $('#chips').onclick=e=>{const c=e.target.closest('[data-c]');if(!c)return;chip=chip===c.dataset.c?'':c.dataset.c;renderList()};
  renderList();
}
const HOME_CATS=['sale','free','moving','group'];
function chipSet(){
  if(tab==='home')return homeCat==='all'?[]:[['active',{sale:'거래 가능만',free:'나눔 중만',moving:'남은 물건 있는 글만',group:'모집 중만'}[homeCat]]];
  if(tab==='help')return [['need','도와주세요'],['offer','도와드려요'],...HELP_FIELDS.slice(0,6).map(f=>[f,f])];
  if(tab==='info')return INFO_TOPICS.map(t=>[t,t]);
  return [];
}
function visible(){
  return posts.filter(p=>{
    if(tab==='home'){if(!HOME_CATS.includes(p.category))return false;if(homeCat!=='all'&&p.category!==homeCat)return false;if(chip==='active'&&p.status==='done')return false}
    if(tab==='help'){if(p.category!=='help')return false;if(chip==='need'||chip==='offer'){if(p.help_type!==chip)return false}else if(chip&&p.help_field!==chip)return false}
    if(tab==='info'){if(p.category!=='info')return false;if(chip&&p.info_topic!==chip)return false}
    if(q){const extra=(movingMap[p.id]||{}).names||'';if(!((p.title||'')+' '+(p.description||'')+' '+(p.place||'')+' '+extra).toLowerCase().includes(q))return false}
    return true;
  });
}

const _rowSale=rowSale;
rowSale=function(p){
  if(p.category==='moving'){const m=movingMap[p.id]||{n:0,left:0,min:null};const im=imgs(p);
    return `<button class="item" data-id="${p.id}"><div class="th">${im.length?`<img src="${esc(im[0])}" loading="lazy" alt="">`:I.box}</div>
      <div class="body"><div class="t">${esc(p.title)}</div><div class="m">${esc(where(p))}</div>
      <div class="p">${statusTag(p)}<span class="tag coral">이사정리</span>물건 ${m.n}개${m.n?` <span style="font-weight:500;color:var(--sub);font-size:14px">· ${m.left}개 남음</span>`:''}</div>
      ${p.move_date?`<div class="m">${dateKo(p.move_date)}까지 가져가요</div>`:''}</div></button>`}
  if(p.category==='group'){const g=groupMap[p.id]||{total:0};const goal=p.goal_count||0;const im=imgs(p);
    return `<button class="item" data-id="${p.id}"><div class="th">${im.length?`<img src="${esc(im[0])}" loading="lazy" alt="">`:I.people}</div>
      <div class="body"><div class="t">${esc(p.title)}</div><div class="m">${esc(where(p))}</div>
      <div class="p">${statusTag(p)}<span class="tag indigo">같이 사요</span>${p.unit_price!=null?'1인 '+money(p.unit_price):''}</div>
      <div class="prog"><i style="width:${goal?Math.min(100,g.total/goal*100):0}%"></i></div>
      <div class="m" style="margin-top:0">${g.total}/${goal}명 참여${p.deadline?` · ${dateKo(p.deadline)} 마감`:''}</div></div></button>`}
  return _rowSale(p);
};

const _load=load;
load=async function(){await _load();await loadExtras();renderList()};
async function loadExtras(){
  const mv=posts.filter(p=>p.category==='moving').map(p=>p.id),gp=posts.filter(p=>p.category==='group').map(p=>p.id);
  const [a,b]=await Promise.all([
    mv.length?sb.from('moving_items').select('post_id,name,status,price').in('post_id',mv):{data:[]},
    gp.length?sb.from('group_joins').select('post_id,qty').in('post_id',gp):{data:[]}]);
  movingMap={};(a.data||[]).forEach(r=>{const m=movingMap[r.post_id]=movingMap[r.post_id]||{n:0,left:0,names:''};m.n++;if(r.status!=='done')m.left++;m.names+=' '+r.name});
  groupMap={};(b.data||[]).forEach(r=>{const g=groupMap[r.post_id]=groupMap[r.post_id]||{total:0};g.total+=r.qty});
}

// ---------- 상세 화면 확장 ----------
const _detail=detail;
detail=function(id){
  const pr=_detail(id);
  const p=posts.find(x=>x.id===id);const el=stack.length?stack[stack.length-1].el:null;
  if(p&&el)enhanceDetail(el,p);
  return pr;
};
function enhanceDetail(el,p){
  const mine=p.user_id===me.id;const sec=el.querySelector('.sec');const minor=el.querySelector('.minor');
  const anchor=minor||sec;
  if(p.category!=='info'){
    const sb2=document.createElement('button');sb2.className='safebtn';
    sb2.innerHTML=`<span class="ic">${I.shield}</span><span><b>안전 만남 체크인</b><small>만나기 전에 가족에게 장소·시간을 보내고, 끝나면 알려요</small></span>`;
    sb2.onclick=()=>meetSheet(p);anchor.parentNode.insertBefore(sb2,anchor);
  }
  if(p.category==='moving'){
    const box=document.createElement('div');box.className='content';box.style.paddingTop='0';box.innerHTML='<p class="m">물건 불러오는 중…</p>';
    el.querySelector('.content').after(box);loadMovingDetail(box,p,mine,el);
    const pb=el.querySelector('.bottombar .price');if(pb){const m=movingMap[p.id]||{n:0,left:0};pb.innerHTML=`<b>물건 ${m.n}개</b><small>${m.left}개 남음${p.move_date?' · '+dateKo(p.move_date)+'까지':''}</small>`}
  }
  if(p.category==='group'){
    const box=document.createElement('div');box.className='content';box.style.paddingTop='0';
    el.querySelector('.content').after(box);loadGroupDetail(box,p,mine,el);
  }
}

async function loadMovingDetail(box,p,mine,el){
  const {data}=await sb.from('moving_items').select('*').eq('post_id',p.id).order('sort');
  const items=data||[];const left=items.filter(i=>i.status!=='done').length;
  const lab={active:'판매중',reserved:'예약중',done:'판매완료'};
  box.innerHTML=`<h4 style="font-size:17px;margin:4px 0 2px">물건 목록 <span style="color:var(--coral)">${left}</span><span class="m"> / ${items.length}개</span></h4>
    <div class="mgrid">${items.map(it=>`<div class="mitem ${it.status==='done'?'done':''}" data-id="${it.id}">
      <div class="im">${it.image_url?`<img src="${esc(it.image_url)}" loading="lazy" alt="">`:I.box}${it.status!=='active'?`<span class="tag ${it.status==='done'?'gray':'jade'}">${lab[it.status]}</span>`:''}</div>
      <div class="tx"><b>${esc(it.name)}</b><span>${it.price!=null?(it.price===0?'무료':money(it.price)):'가격 문의'}</span>
      ${mine?`<select data-st>${Object.entries(lab).map(([k,v])=>`<option value="${k}" ${it.status===k?'selected':''}>${v}</option>`).join('')}</select>`:(it.status==='done'?'':'<button class="ask" data-ask>이 물건 문의</button>')}</div></div>`).join('')}</div>`;
  box.querySelectorAll('.mitem').forEach(c=>{const it=items.find(x=>x.id===c.dataset.id);
    const s=c.querySelector('[data-st]');if(s)s.onchange=async()=>{const {error}=await sb.from('moving_items').update({status:s.value}).eq('id',it.id);if(error)return toast('바꾸지 못했어요');toast('상태를 바꿨어요');await loadExtras();loadMovingDetail(box,p,mine,el);renderList()};
    const a=c.querySelector('[data-ask]');if(a)a.onclick=()=>{const i=el.querySelector('#cin');if(!i)return;i.value=`[${it.name}] 아직 있나요? `;i.scrollIntoView({behavior:'smooth',block:'center'});i.focus()};
    const im=c.querySelector('img');if(im)im.onclick=()=>openViewer([it.image_url],0);
  });
}

async function loadGroupDetail(box,p,mine,el){
  const {data}=await sb.from('group_joins').select('user_id,qty,created_at,profiles(nickname)').eq('post_id',p.id).order('created_at');
  const joins=data||[];const total=joins.reduce((a,j)=>a+j.qty,0);const goal=p.goal_count||0;const myJ=joins.find(j=>j.user_id===me.id);
  const open=p.status==='active';let qty=myJ?myJ.qty:1;
  box.innerHTML=`<div class="gbox">
    <div class="row"><div><div class="m" style="margin:0">1인 부담</div><div class="big">${p.unit_price!=null?money(p.unit_price):'협의'}</div></div>
      <div style="text-align:right"><div class="m" style="margin:0">${p.deadline?dateKo(p.deadline)+' 마감':'마감일 없음'}</div><div class="big" style="color:var(--indigo)">${total}<span style="font-size:15px;color:var(--sub)"> / ${goal}명</span></div></div></div>
    <div class="prog"><i style="width:${goal?Math.min(100,total/goal*100):0}%"></i></div>
    ${p.place?`<div class="m">${I.pin.replace('width="15"','width="13"')} 받는 곳: ${esc(p.place)}</div>`:''}
    ${joins.length?`<div class="plist">${joins.map(j=>`<span class="tag gray">${esc(j.profiles?.nickname||'')}${j.qty>1?' ×'+j.qty:''}</span>`).join('')}</div>`:'<p class="m">아직 참여한 사람이 없어요. 첫 번째로 참여해 보세요.</p>'}
    ${mine?(open?`<button class="btn ghost block" id="gClose" style="margin-top:14px">모집 마감하기</button>`:'<p class="m" style="margin-top:10px">모집이 마감됐어요.</p>')
      :open?`<div class="row" style="margin-top:14px"><div class="stepper"><button id="gMinus">−</button><b id="gQty">${qty}</b><button id="gPlus">+</button></div>
        ${myJ?`<button class="btn ghost" id="gLeave" style="flex:1">참여 취소</button><button class="btn" id="gJoin" style="flex:1">수량 변경</button>`:`<button class="btn" id="gJoin" style="flex:1;background:var(--indigo)">참여하기</button>`}</div>`
      :'<p class="m" style="margin-top:10px">모집이 마감됐어요.</p>'}
  </div>`;
  const pb=el.querySelector('.bottombar .price');if(pb)pb.innerHTML=`<b>${p.unit_price!=null?'1인 '+money(p.unit_price):'같이 사요'}</b><small>${total}/${goal}명 참여</small>`;
  const q=box.querySelector('#gQty');
  const mi=box.querySelector('#gMinus');if(mi)mi.onclick=()=>{qty=Math.max(1,qty-1);q.textContent=qty};
  const pl=box.querySelector('#gPlus');if(pl)pl.onclick=()=>{qty=Math.min(20,qty+1);q.textContent=qty};
  const jn=box.querySelector('#gJoin');if(jn)jn.onclick=async()=>{
    const r=myJ?await sb.from('group_joins').update({qty}).eq('post_id',p.id).eq('user_id',me.id):await sb.from('group_joins').insert({post_id:p.id,qty});
    if(r.error)return toast('참여하지 못했어요. 모집이 마감됐을 수 있어요');toast(myJ?'수량을 바꿨어요':'공동구매에 참여했어요');await loadExtras();loadGroupDetail(box,p,mine,el);renderList()};
  const lv=box.querySelector('#gLeave');if(lv)lv.onclick=async()=>{if(!confirm('참여를 취소할까요?'))return;await sb.from('group_joins').delete().eq('post_id',p.id).eq('user_id',me.id);toast('참여를 취소했어요');await loadExtras();loadGroupDetail(box,p,mine,el);renderList()};
  const cl=box.querySelector('#gClose');if(cl)cl.onclick=async()=>{if(!confirm('모집을 마감할까요? 더 이상 참여할 수 없어요.'))return;const {error}=await sb.from('posts').update({status:'done'}).eq('id',p.id);if(error)return toast('마감하지 못했어요');p.status='done';toast('모집을 마감했어요');loadGroupDetail(box,p,mine,el);renderList()};
}

// ---------- 글쓰기 확장 ----------
const _formFor=formFor;
formFor=function(cat){
  if(cat==='moving')return `${photoField(cat,true)}
    <div class="field"><label for="t">제목</label><input class="in" id="t" maxlength="80" placeholder="예: 귀국 정리합니다 (가구·주방·아이 용품)"></div>
    <div class="field"><label for="dl">가져갈 수 있는 마지막 날</label><input class="in" id="dl" type="date"></div>
    <div class="field"><div class="lb">물건 목록<span class="opt">물건 사진을 찍으면 AI가 이름·가격을 채워요</span></div><div id="mItems"></div><button type="button" class="addrow" id="mAdd">＋ 물건 추가</button></div>
    <div class="field"><label for="d">설명</label><textarea class="in" id="d" placeholder="이사 날짜, 가져갈 수 있는 시간, 일괄 구매 시 할인 여부 등"></textarea></div>
    ${zoneField()}${areaField()}${contactField()}`;
  if(cat==='group')return `${photoField(cat,true)}
    <div class="field"><label for="t">무엇을 같이 살까요?</label><input class="in" id="t" maxlength="80" placeholder="예: 코스트코 계란 60구 반씩 나눠요"></div>
    <div class="field"><label for="up">1인당 금액</label><div class="prefix"><span>$</span><input class="in" id="up" type="number" min="0" inputmode="numeric" placeholder="예: 12"></div></div>
    <div class="field"><label for="gc">모집 인원 (나 포함)</label><input class="in" id="gc" type="number" min="2" max="200" inputmode="numeric" value="4"></div>
    <div class="field"><label for="dl">모집 마감일<span class="opt">선택</span></label><input class="in" id="dl" type="date"></div>
    <div class="field"><label for="pl">받는 곳<span class="opt">선택</span></label><input class="in" id="pl" placeholder="예: 둘루스 코스트코 주차장, 저희 집 앞"></div>
    <div class="field"><label for="d">설명</label><textarea class="in" id="d" placeholder="나누는 방법, 결제 방법(만나서 현금 등), 일정"></textarea></div>
    ${areaField()}${contactField()}`;
  return _formFor(cat);
};

let mItems=[];
const _writePage=writePage;
writePage=function(cat){
  _writePage(cat);
  if(cat==='moving'){mItems=[];addMItem();addMItem();W.querySelector('#mAdd').onclick=()=>{if(mItems.length>=40)return toast('물건은 40개까지 올릴 수 있어요');addMItem()}}
};
function addMItem(){mItems.push({name:'',price:'',blob:null,url:null});renderMItems()}
function renderMItems(){
  const box=W.querySelector('#mItems');if(!box)return;
  box.innerHTML=mItems.map((m,i)=>`<div class="itemrow" data-i="${i}"><button type="button" class="ip" data-ph>${m.url?`<img src="${m.url}" alt="">`:I.cam.replace('width="24"','width="20"')}</button>
    <div class="flds"><input class="in" data-k="name" placeholder="물건 이름" value="${esc(m.name)}" maxlength="60"><div class="prefix"><span>$</span><input class="in" data-k="price" type="number" min="0" inputmode="numeric" placeholder="가격 (0이면 무료)" value="${esc(m.price)}"></div></div>
    <button type="button" class="rm" data-rm aria-label="빼기">${I.x}</button></div>`).join('');
  box.querySelectorAll('.itemrow').forEach(r=>{const i=+r.dataset.i;
    r.querySelectorAll('input').forEach(inp=>inp.oninput=()=>{mItems[i][inp.dataset.k]=inp.value});
    r.querySelector('[data-rm]').onclick=()=>{mItems.splice(i,1);renderMItems()};
    r.querySelector('[data-ph]').onclick=()=>pickItemPhoto(i,r);
  });
}
function pickItemPhoto(i,row){
  const inp=document.createElement('input');inp.type='file';inp.accept='image/*';
  inp.onchange=async()=>{const f=inp.files[0];if(!f)return;const blob=await shrink(f,1280,0.82);mItems[i].blob=blob;mItems[i].url=URL.createObjectURL(blob);renderMItems();
    const ip=W.querySelector(`.itemrow[data-i="${i}"] .ip`);ip&&ip.classList.add('busy');
    try{const {data,error}=await sb.functions.invoke('analyze-item',{body:{images:[await b64(await shrink(blob,768,0.75))],category:'sale'}});
      if(!error&&data){if(!mItems[i].name&&data.title)mItems[i].name=data.title.replace(/\s*\(.*?\)\s*$/,'').slice(0,60);if(mItems[i].price===''&&data.price!=null)mItems[i].price=String(data.price)}}catch(e){}
    renderMItems()};
  inp.click();
}

async function uploadBlobs(blobs,btn){
  const urls=[];
  for(let i=0;i<blobs.length;i++){btn.textContent=`사진 올리는 중 ${i+1}/${blobs.length}`;
    const path=`${me.id}/${Date.now()}_${i}_${Math.random().toString(36).slice(2,6)}.jpg`;
    const up=await sb.storage.from('post-images').upload(path,blobs[i],{contentType:'image/jpeg'});
    if(up.error)throw new Error('upload');urls.push(sb.storage.from('post-images').getPublicUrl(path).data.publicUrl)}
  return urls;
}
const _savePost=savePost;
savePost=async function(cat){
  if(cat!=='moving'&&cat!=='group')return _savePost(cat);
  const title=fv('t');if(!title)return toast('제목을 입력해 주세요');
  let items=[];
  if(cat==='moving'){items=mItems.filter(m=>m.name.trim());if(!items.length)return toast('물건을 1개 이상 적어주세요')}
  if(cat==='group'){const gc=parseInt(fv('gc'));if(!(gc>=2&&gc<=200))return toast('모집 인원은 2~200명으로 정해주세요')}
  const ct=fv('ct'),cv=fv('cv');
  if(ct==='kakao'&&cv&&!/^https:\/\/open\.kakao\.com\//.test(cv))return toast('오픈채팅 링크는 https://open.kakao.com/ 으로 시작해요');
  const b=W.querySelector('#save');b.disabled=true;const reset=()=>{b.disabled=false;b.textContent='작성 완료'};
  try{
    const urls=await uploadBlobs(photos.map(p=>p.blob),b);
    const itemUrls=cat==='moving'?await uploadBlobs(items.filter(m=>m.blob).map(m=>m.blob),b):[];
    b.textContent='글 올리는 중';
    let k=0;const cover=urls.length?urls:itemUrls.slice(0,1);
    const row={category:cat,title,description:fv('d')||null,area:fv('ar')||null,images:cover,image_url:cover[0]||null,
      contact_type:cv?ct:null,contact_value:cv||null,safe_zone_id:fv('z')?+fv('z'):null,deadline:fv('dl')||null};
    if(cat==='moving')row.move_date=fv('dl')||null;
    if(cat==='group')Object.assign(row,{unit_price:fv('up')!==''?parseInt(fv('up')):null,goal_count:parseInt(fv('gc')),place:fv('pl')||null});
    const {data:ins,error}=await sb.from('posts').insert(row).select('id,status').single();
    if(error){reset();return toast(error.message.includes('rate_limit')?'짧은 시간에 글을 너무 많이 올렸어요. 잠시 후 다시 올려주세요':'글을 올리지 못했어요: '+error.message)}
    if(cat==='moving'){
      const rows=items.map((m,i)=>({post_id:ins.id,name:m.name.trim(),price:m.price!==''?parseInt(m.price):null,image_url:m.blob?itemUrls[k++]:null,sort:i}));
      const r=await sb.from('moving_items').insert(rows);if(r.error)toast('물건 목록 일부를 올리지 못했어요')}
    back();tab='home';homeCat=cat;chip='';render();await load();
    toast(ins.status==='held'?'광고로 의심되어 운영자 확인 후 게시돼요':'글을 올렸어요');
  }catch(e){reset();toast('사진을 올리지 못했어요. 다시 시도해 주세요')}
};

// ---------- 안전 만남 체크인 ----------
function meetSheet(p){
  const zone=zones.find(z=>z.id===p.safe_zone_id);
  const t=new Date(Date.now()+30*60000);t.setMinutes(Math.ceil(t.getMinutes()/15)*15,0,0);
  const local=new Date(t.getTime()-t.getTimezoneOffset()*60000).toISOString().slice(0,16);
  openSheet(`<h3>안전 만남 체크인</h3>
    <p class="m" style="margin:0 4px 6px">가족이나 친구에게 링크를 보내면, 언제 어디서 누구를 만나는지 볼 수 있어요. 거래가 끝나면 "안전하게 끝났어요"를 눌러주세요.</p>
    <div class="field"><label for="mpl">만나는 곳</label><input class="in" id="mpl" maxlength="80" value="${esc(zone?zone.name:(p.place||''))}" placeholder="예: H마트 둘루스 주차장"></div>
    <div class="field"><label for="mat">만나는 시간</label><input class="in" id="mat" type="datetime-local" value="${local}"></div>
    <div class="field"><label for="mpt">만나는 사람</label><input class="in" id="mpt" maxlength="40" value="${esc(p.user_id===me.id?'':(p.profiles?.nickname||''))}" placeholder="상대방 닉네임"></div>
    <button class="btn block" id="mGo" style="margin-top:18px">체크인 시작하고 링크 보내기</button>`);
  $('#mGo').onclick=async()=>{
    const place=$('#mpl').value.trim(),at=$('#mat').value;if(!place||!at)return toast('장소와 시간을 적어주세요');
    const {data,error}=await sb.from('meetups').insert({post_id:p.id,place,meet_at:new Date(at).toISOString(),partner:$('#mpt').value.trim()||null}).select('*').single();
    if(error)return toast('체크인을 시작하지 못했어요');
    closeSheet();activeMeet=data;showMeetBar();shareMeet(data);
  };
}
async function shareMeet(m){
  const url=SITE+'?meet='+m.token;
  const text=`[한인동네 안전 체크인] ${me.nickname}: ${fmtTime(m.meet_at)} ${m.place}에서 ${m.partner?m.partner+'님과 ':''}거래해요. 끝나면 이 링크에 표시돼요.`;
  try{if(navigator.share){await navigator.share({title:'안전 체크인',text,url});return}}catch(e){return}
  try{await navigator.clipboard.writeText(text+'\n'+url);toast('링크를 복사했어요. 가족에게 보내주세요')}catch(e){prompt('이 링크를 가족에게 보내주세요',url)}
}
async function checkMeet(){
  const {data}=await sb.from('meetups').select('*').eq('status','active').gt('created_at',new Date(Date.now()-86400000).toISOString()).order('created_at',{ascending:false}).limit(1);
  activeMeet=data&&data[0]||null;showMeetBar();
}
function showMeetBar(){
  let bar=$('#meetbar');
  if(!activeMeet){if(bar)bar.remove();return}
  if(!bar){bar=document.createElement('div');bar.id='meetbar';bar.className='meetbar';document.body.appendChild(bar)}
  bar.innerHTML=`<div class="t">🛡️ <b>체크인 중</b> · ${esc(activeMeet.place)}<br><span style="opacity:.75">${fmtTime(activeMeet.meet_at)}${activeMeet.partner?' · '+esc(activeMeet.partner):''}</span></div>
    <button id="mbShare" style="background:rgba(255,255,255,.15)">다시 보내기</button><button id="mbDone">안전하게 끝났어요</button>`;
  $('#mbShare').onclick=()=>shareMeet(activeMeet);
  $('#mbDone').onclick=async()=>{const {error}=await sb.from('meetups').update({status:'done',ended_at:new Date().toISOString()}).eq('id',activeMeet.id);
    if(error)return toast('처리하지 못했어요');activeMeet=null;showMeetBar();toast('안전하게 끝났다고 표시했어요')};
}

async function meetView(){
  const token=new URLSearchParams(location.search).get('meet');
  const draw=async()=>{
    const {data,error}=await sb.rpc('get_meetup',{p_token:token});
    if(error||!data){$('#root').innerHTML=`<div class="famview"><div class="brand"><div class="mk">${I.mark}</div><span>한인동네</span></div><div class="empty"><b>체크인 정보를 찾을 수 없어요</b>링크가 잘못됐거나 3일이 지나 만료됐어요.</div></div>`;return}
    const m=data;const late=m.status==='active'&&Date.now()>new Date(m.meet_at).getTime()+3600000;
    const st=m.status==='done'?{t:'✅ 안전하게 끝났어요',bg:'var(--jade-soft)'}:late?{t:'🟠 아직 종료 확인이 없어요',bg:'var(--amber-soft)'}:{t:'🟢 거래 진행 중',bg:'var(--indigo-soft)'};
    $('#root').innerHTML=`<div class="famview"><div class="brand"><div class="mk">${I.mark}</div><span>한인동네 안전 체크인</span></div>
      <div class="famcard" style="background:${st.bg}"><div class="st">${st.t}</div>
        <div class="r"><span>보낸 사람</span><b>${esc(m.nickname)}</b></div>
        <div class="r"><span>장소</span><b>${esc(m.place)}</b></div>
        <div class="r"><span>약속 시간</span><b>${fmtTime(m.meet_at)}</b></div>
        ${m.partner?`<div class="r"><span>만나는 사람</span><b>${esc(m.partner)}</b></div>`:''}
        ${m.title?`<div class="r"><span>거래 물건</span><b>${esc(m.title)}</b></div>`:''}
        ${m.ended_at?`<div class="r"><span>끝난 시간</span><b>${fmtTime(m.ended_at)}</b></div>`:''}</div>
      ${late?'<p class="m" style="margin-top:14px;line-height:1.6">약속 시간에서 1시간이 지났는데 종료 확인이 없어요. 전화나 문자로 연락해 보세요.</p>':''}
      <p class="m" style="margin-top:18px">이 화면은 1분마다 자동으로 새로고침돼요.</p></div>`;
  };
  await draw();setInterval(draw,60000);
}

// ---------- 알림 ----------
const _shell=shell;
shell=function(){
  _shell();
  const sbtn=$('#searchBtn');const w=document.createElement('span');w.className='bellwrap';
  w.innerHTML=`<button class="icon-btn" id="bellBtn" aria-label="알림">${I.bell}</button><span class="dot" id="bellDot"></span>`;
  sbtn.parentNode.insertBefore(w,sbtn);
  $('#bellBtn').onclick=()=>openNoti();
  refreshBell();clearInterval(notiTimer);notiTimer=setInterval(refreshBell,60000);
  checkMeet();
};
async function refreshBell(){
  const {count}=await sb.from('notifications').select('id',{count:'exact',head:true}).eq('read',false);
  const d=$('#bellDot');if(d)d.textContent=count?(count>9?'9+':count):'';
}
let N=null,nTab='list';
function openNoti(){
  N=openPage(`<div class="topbar"><button class="icon-btn" data-back aria-label="뒤로">${I.back}</button><h2>알림</h2><div style="width:40px"></div></div>
    <div class="utabs" id="nTabs" style="top:calc(56px + env(safe-area-inset-top,0px))"><button data-n="list">알림</button><button data-n="kw">키워드 알림</button></div>
    <div class="list" id="nBody" style="padding-bottom:40px"></div>`,()=>{N=null;refreshBell()});
  N.querySelector('[data-back]').onclick=back;
  N.querySelector('#nTabs').onclick=e=>{const b=e.target.closest('[data-n]');if(!b)return;nTab=b.dataset.n;renderNoti()};
  renderNoti();
}
async function renderNoti(){
  if(!N)return;N.querySelectorAll('#nTabs button').forEach(b=>b.classList.toggle('on',b.dataset.n===nTab));
  const box=N.querySelector('#nBody');
  if(nTab==='list'){
    const {data}=await sb.from('notifications').select('*').order('created_at',{ascending:false}).limit(60);
    const kinds={keyword:['var(--jade)',I.search.replace('width="24"','width="18"')],comment:['var(--amber)',I.chat.replace('width="15"','width="18"')],group:['var(--indigo)',I.people]};
    box.innerHTML=(data&&data.length)?`<div style="display:flex;justify-content:flex-end;padding-top:10px"><button class="m" id="nAll" style="text-decoration:underline">모두 읽음</button></div>`+data.map(n=>{const k=kinds[n.kind]||['var(--sub)',I.bell];
      return `<button class="noti ${n.read?'read':'unread'}" data-id="${n.id}" data-p="${n.post_id||''}"><span class="ic" style="background:${k[0]}">${k[1]}</span><span><div class="b">${esc(n.body)}</div><div class="m">${ago(n.created_at)}</div></span></button>`}).join('')
      :'<div class="empty"><b>새 알림이 없어요</b>키워드를 등록하면 원하는 물건이 올라올 때 알려드려요.</div>';
    const all=box.querySelector('#nAll');if(all)all.onclick=async()=>{await sb.from('notifications').update({read:true}).eq('read',false);renderNoti()};
    box.querySelectorAll('.noti').forEach(b=>b.onclick=async()=>{await sb.from('notifications').update({read:true}).eq('id',b.dataset.id);
      const pid=b.dataset.p;if(!pid)return renderNoti();
      if(!posts.find(x=>x.id===pid)){const {data:p}=await sb.from('posts').select('*, profiles(nickname,role)').eq('id',pid).maybeSingle();if(!p){toast('삭제됐거나 볼 수 없는 글이에요');return renderNoti()}posts.push(p)}
      detail(pid);renderNoti()});
  }else{
    const {data}=await sb.from('keyword_alerts').select('*').order('created_at');
    const list=data||[];
    box.innerHTML=`<div style="padding:16px 0"><b style="font-size:16px">찾고 있는 물건이 있나요?</b><p class="m" style="margin-top:4px">등록한 단어가 들어간 새 글이 올라오면 알림으로 알려드려요. 최대 10개까지 등록할 수 있어요.</p>
      <div style="display:flex;gap:8px;margin-top:12px"><input class="in" id="kwIn" maxlength="20" placeholder="예: 카시트, 자전거, 에어프라이어"><button class="btn" id="kwAdd" style="flex:none">등록</button></div>
      <div class="kwchips">${list.map(k=>`<span>${esc(k.keyword)}<button data-del="${k.id}" aria-label="삭제">${I.x}</button></span>`).join('')}</div>
      ${list.length?'':'<p class="m" style="margin-top:14px">아직 등록한 키워드가 없어요.</p>'}</div>`;
    const add=async()=>{const v=box.querySelector('#kwIn').value.trim();if(!v)return;if(list.length>=10)return toast('키워드는 10개까지 등록할 수 있어요');
      const {error}=await sb.from('keyword_alerts').insert({keyword:v});if(error)return toast(error.message.includes('duplicate')?'이미 등록한 키워드예요':'등록하지 못했어요');toast(`'${v}' 알림을 등록했어요`);renderNoti()};
    box.querySelector('#kwAdd').onclick=add;box.querySelector('#kwIn').onkeydown=e=>{if(e.key==='Enter')add()};
    box.querySelectorAll('[data-del]').forEach(b=>b.onclick=async()=>{await sb.from('keyword_alerts').delete().eq('id',b.dataset.del);renderNoti()});
  }
}
