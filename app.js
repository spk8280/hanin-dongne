const SUPABASE_URL='https://oroygikugqzuxcinamwp.supabase.co';
const SUPABASE_KEY='sb_publishable_WW_d2tooXsiuMsiVz4mqDg_5Yb0_btO';
const sb=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const SITE=location.origin+location.pathname;
const MAX_PHOTOS=8;

const I={
  home:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"/></svg>',
  hands:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  news:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5h14v10H9l-4 4z"/><path d="M9 9h6M9 12h4"/></svg>',
  user:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" stroke-linecap="round"/></svg>',
  search:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  back:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5 8 12l7 7"/></svg>',
  close:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  x:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  plus:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  cam:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  img:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.6"/><path d="m4 17 5-5 4 4 2-2 5 5"/></svg>',
  chat:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/></svg>',
  clock:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>',
  pin:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/></svg>',
  shield:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z"/><path d="m9 12 2 2 4-4" stroke-linecap="round"/></svg>',
  spark:'<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.2 6.3L20 10l-5.8 1.7L12 18l-2.2-6.3L4 10l5.8-1.7z"/><path d="M19 15l.9 2.4 2.1.6-2.1.7L19 21l-.9-2.3-2.1-.7 2.1-.6z"/></svg>',
  link:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
  bag:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  gift:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="4" y="9" width="16" height="11" rx="1"/><path d="M3 9h18M12 9v11M12 9c-2-4-6-4-6-1.5S9 9 12 9c3 0 6 0 6-1.5S14 5 12 9z"/></svg>',
  mark:'<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M4 11 12 4l8 7v9H4z"/><path d="M9.5 15.5c1.4 1.3 3.6 1.3 5 0" stroke-linecap="round"/></svg>'
};

const CATS={sale:{n:'중고거래',c:'jade',i:'bag'},free:{n:'나눔',c:'peach',i:'gift'},help:{n:'품앗이',c:'indigo',i:'hands'},info:{n:'동네소식',c:'amber',i:'news'}};
const CONDITIONS=['새것','거의 새것','사용감 있음','고장·부품용'];
const HELP_FIELDS=['이사·짐 옮기기','라이드·공항','아이 돌봄','집 수리·조립','청소·정리','통역·서류','반려동물','요리·음식','과외·레슨','기타'];
const REWARDS={free:'무료로 도와요',paid:'사례금',swap:'품앗이·식사 대접'};
const INFO_TOPICS=['맛집·카페','병원·약국','학교·육아','구인구직','렌트·부동산','자동차·정비','행사·모임','생활 팁','질문있어요','기타'];
const PICKUP={meet:'직접 만나서',porch:'문앞 픽업'};
const AVC=['#12806A','#4F5FE0','#E8546E','#C9800D','#7A5AD8','#2D8BC9','#D9583A'];

let me=null,zones=[],posts=[],counts={},tab='home',homeCat='all',chip='',q='';

const $=s=>document.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>(s??'').toString().replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(m){const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(t._h);t._h=setTimeout(()=>t.style.display='none',2600)}
function ago(d){const s=(Date.now()-new Date(d))/1000;if(s<60)return'방금 전';if(s<3600)return Math.floor(s/60)+'분 전';if(s<86400)return Math.floor(s/3600)+'시간 전';if(s<86400*7)return Math.floor(s/86400)+'일 전';const x=new Date(d);return (x.getMonth()+1)+'월 '+x.getDate()+'일'}
function money(p){return p==null?'':'$'+Number(p).toLocaleString()}
function imgs(p){return (p.images&&p.images.length)?p.images:(p.image_url?[p.image_url]:[])}
function dateKo(d){if(!d)return'';const x=new Date(d+'T12:00:00');return (x.getMonth()+1)+'월 '+x.getDate()+'일 ('+'일월화수목금토'[x.getDay()]+')'}
function avColor(id){let h=0;for(const c of (id||''))h=(h*31+c.charCodeAt(0))>>>0;return AVC[h%AVC.length]}
function avatar(name,id){return `<div class="av" style="background:${avColor(id)}">${esc((name||'?').slice(0,1))}</div>`}
const isStaff=()=>!!me&&(me.role==='admin'||me.role==='master');
function staffBadge(role){return role==='admin'||role==='master'?'<span class="tag jade" style="margin-left:5px;height:19px;font-size:11px">운영자</span>':''}
function where(p){return [p.area,ago(p.created_at)].filter(Boolean).join(' · ')}

// ---------- 화면 쌓기 (뒤로가기 지원) ----------
const stack=[];
function openPage(html,onClose){
  const el=document.createElement('div');el.className='page';el.innerHTML=html;$('#pages').appendChild(el);
  stack.push({el,onClose});history.pushState({p:stack.length},'');document.body.style.overflow='hidden';return el;
}
function closeTop(){const t=stack.pop();if(!t)return;t.el.remove();t.onClose&&t.onClose();if(!stack.length)document.body.style.overflow=''}
function back(){history.back()}
window.addEventListener('popstate',()=>{if($('#viewer').classList.contains('on')){$('#viewer').classList.remove('on');return}if($('#sheet').classList.contains('on')){closeSheet();return}closeTop()});
function openSheet(html){$('#sheetPanel').innerHTML='<div class="grab"></div>'+html;$('#sheet').classList.add('on')}
function closeSheet(){$('#sheet').classList.remove('on')}
$('#sheet').addEventListener('click',e=>{if(e.target.id==='sheet')closeSheet()});

// ---------- 시작 ----------
async function boot(){
  const {data:{session}}=await sb.auth.getSession();
  if(session){const {data}=await sb.from('profiles').select('*').eq('id',session.user.id).maybeSingle();if(data){me=data;if(data.banned)return bannedScreen();return shell()}}
  onboarding();
}

function bannedScreen(){
  $('#root').innerHTML=`<div class="app"><div class="empty" style="padding-top:30vh"><b>이용이 제한된 계정이에요</b>${esc(me.banned_reason||'운영 원칙 위반으로 이용이 제한됐어요.')}<br>문의는 초대해 준 분께 해주세요.</div></div>`;
}

function onboarding(){
  const ph=(bg,ic)=>`<div class="ph" style="background:${bg}">${ic}</div>`;
  const slides=[
    `<div class="slide s0"><div class="hero-brand"><div class="mk">${I.mark}</div><span>한인동네</span></div>
      <div class="art"><div class="stack">
        <div class="mock c1">${ph('linear-gradient(135deg,#5B2A86,#8E5CC4)',I.bag)}<div><div class="t">다이슨 V11 무선청소기</div><div class="m">둘루스 · 12분 전</div><div class="pr">$200</div></div></div>
        <div class="mock c2">${ph('var(--coral)',I.hands)}<div><div class="t">토요일 이사 도와주실 분</div><div class="m">스와니 · 사례 $80</div><div class="pr" style="color:var(--coral)">도와주세요</div></div></div>
        <div class="mock c3">${ph('var(--amber)',I.news)}<div><div class="t">한국어 되는 소아과 추천</div><div class="m">존스크릭 · 댓글 12</div><div class="pr" style="color:var(--amber)">동네소식</div></div></div>
      </div></div>
      <h2>애틀랜타 한인 이웃,<br>여기 다 모였어요</h2>
      <div class="towns"><span>둘루스</span><span>스와니</span><span>뷰포드</span><span>존스크릭</span><span>로렌스빌</span></div></div>`,
    `<div class="slide s1"><div class="art"><div class="phone">
        <div class="shot">${I.bag.replace('width="20" height="20"','width="54" height="54"')}<span class="cam">${I.cam}</span></div>
        <div class="line" style="width:80%"></div><div class="line" style="width:55%"></div>
        <div class="aib">✦ AI 추천 가격<b>$200</b><small>보통 $160~$240에 거래돼요</small></div></div></div>
      <h2>사진 한 장이면<br>판매 글이 끝나요</h2><p>AI가 사진을 보고 제목, 설명, 동네 시세에 맞는 가격까지 채워줘요.</p></div>`,
    `<div class="slide s2"><div class="art"><div class="duo">
        <div class="mock"><span class="tag coral">도와주세요</span><div class="t">토요일 오전 이사 짐 옮길 분</div><div class="row"><span>${I.clock}11/29 오전 10시</span><b style="color:var(--ink)">사례 $80</b></div></div>
        <div class="mock"><span class="tag indigo">도와드려요</span><div class="t">평일 저녁 공항 라이드 가능해요</div><div class="row"><span>${I.pin}스와니</span><b style="color:var(--ink)">식사 대접이면 충분해요</b></div></div>
      </div></div>
      <h2>이사, 라이드, 아이 돌봄<br>이웃끼리 품앗이해요</h2><p>도움이 필요할 때 부탁하고, 할 수 있는 일은 나눠요.</p></div>`,
    `<div class="slide s3"><div class="art" style="flex-direction:column"><div class="topics"><span>맛집·카페</span><span class="on">병원·약국</span><span>학교·육아</span><span>구인구직</span><span>렌트·부동산</span><span>자동차·정비</span></div>
        <div class="mock" style="flex-direction:column;align-items:flex-start;gap:4px;padding:14px 16px"><div class="t" style="font-weight:700">둘루스 한국어 되는 소아과 어디가 좋아요?</div><div class="m">하은맘 · 댓글 12</div>
          <div style="font-size:13px;color:var(--sub);margin-top:4px;line-height:1.5">“OO 소아과 추천해요. 오전엔 대기 짧고 선생님이 한국어로 설명해 주세요.”</div></div></div>
      <h2>맛집, 병원, 학교 정보<br>동네 사람에게 물어봐요</h2><p>검색으로 안 나오는 진짜 동네 이야기를 나눠요.</p></div>`,
    `<div class="slide s4"><div class="art"><div class="safe">
        <div><i style="background:var(--jade)">${I.user}</i><span><b>초대받은 사람만</b><small>아는 사람의 초대로만 들어와요</small></span></div>
        <div><i style="background:var(--amber)">★</i><span><b>거래 후기</b><small>상대방의 평점을 보고 거래해요</small></span></div>
        <div><i style="background:var(--indigo)">${I.shield}</i><span><b>안전 거래 장소</b><small>H마트 주차장처럼 밝은 곳에서 만나요</small></span></div>
      </div></div>
      <h2>아는 사람끼리라<br>더 믿을 수 있어요</h2><p>신고와 차단 기능으로 불편한 사람은 바로 걸러요.</p></div>`
  ];
  $('#root').innerHTML=`<div class="onb dark" id="onb"><button class="onb-skip" id="onbSkip">건너뛰기</button>
    <div class="slides" id="slides">${slides.join('')}</div>
    <div class="onb-ctrl"><div class="onb-dots" id="onbDots">${slides.map((_,i)=>`<i class="${i?'':'on'}"></i>`).join('')}</div>
      <button class="btn block" id="onbNext">다음</button><button class="have" id="onbHave">초대코드가 있어요</button></div></div>`;
  const sl=$('#slides'),n=slides.length;
  const idx=()=>Math.round(sl.scrollLeft/sl.clientWidth);
  const sync=()=>{const i=idx();$$('#onbDots i').forEach((d,k)=>d.classList.toggle('on',k===i));$('#onb').classList.toggle('dark',i===0);
    $('#onbNext').textContent=i===n-1?'초대코드로 시작하기':'다음';$('#onbSkip').style.visibility=i===n-1?'hidden':'visible'};
  sl.onscroll=sync;
  $('#onbNext').onclick=()=>{const i=idx();if(i===n-1)return joinScreen();sl.scrollTo({left:(i+1)*sl.clientWidth,behavior:'smooth'})};
  $('#onbSkip').onclick=$('#onbHave').onclick=()=>joinScreen();
}

function joinScreen(){
  const pre=new URLSearchParams(location.search).get('code')||'';
  $('#root').innerHTML=`<div class="app joinform">
    <div class="topbar"><button class="icon-btn" id="joinBack" aria-label="소개 다시 보기">${I.back}</button></div>
    <div class="brand" style="margin-top:8px"><div class="mk">${I.mark}</div></div>
    <h2 style="margin-top:20px">반가워요!<br>동네에서 쓸 이름을 정해주세요</h2>
    <p class="lead">회원가입 없이 이것만 입력하면 바로 시작해요.</p>
    <div class="form">
      <div class="field"><label for="code">초대코드</label><input class="in" id="code" value="${esc(pre)}" placeholder="받은 초대코드" autocapitalize="characters" autocomplete="off"></div>
      <div class="field"><label for="nick">닉네임</label><input class="in" id="nick" placeholder="동네에서 불릴 이름 (2~20자)" maxlength="20" autocomplete="nickname"></div>
      <div class="field"><label for="area">사는 동네<span class="opt">선택</span></label><input class="in" id="area" placeholder="둘루스, 스와니, 뷰포드…"></div>
    </div>
    <div class="spacer"></div>
    <button class="btn block" id="joinBtn" style="margin-top:24px">시작하기</button>
    <p class="note">이 기기에서 계속 로그인된 상태로 쓸 수 있어요.<br>다른 기기에서는 초대코드를 한 번 더 입력하면 돼요.</p>
  </div>`;
  $('#joinBack').onclick=()=>onboarding();
  $('#joinBtn').onclick=async()=>{
    const code=$('#code').value.trim(),nick=$('#nick').value.trim(),area=$('#area').value.trim();
    if(!code)return toast('초대코드를 입력해 주세요');
    if(nick.length<2)return toast('닉네임은 2자 이상으로 정해 주세요');
    const b=$('#joinBtn');b.disabled=true;b.textContent='확인하는 중';
    const reset=()=>{b.disabled=false;b.textContent='시작하기'};
    let {data:{session}}=await sb.auth.getSession();
    if(!session){const r=await sb.auth.signInAnonymously();if(r.error){reset();return toast('접속하지 못했어요. 잠시 후 다시 시도해 주세요')}}
    const {error}=await sb.rpc('join_with_invite',{p_code:code,p_nickname:nick,p_area:area||null});
    if(error){reset();return toast(error.message.includes('invalid')?'초대코드가 맞지 않거나 사용 횟수가 끝났어요':'가입하지 못했어요: '+error.message)}
    boot();
  };
}

// ---------- 메인 화면 ----------
function shell(){
  $('#root').innerHTML=`<div class="app">
    <div class="topbar"><button class="area-btn" id="areaBtn">${esc(me.area||'우리 동네')}</button><div class="grow"></div>
      <button class="icon-btn" id="searchBtn" aria-label="검색">${I.search}</button></div>
    <div class="searchbar" id="searchbar"><input id="q" type="search" placeholder="물건, 가게, 도움 찾기"></div>
    <div id="view"></div>
  </div>
  <button class="fab" id="fab">${I.plus}글쓰기</button>
  <nav class="tabbar" id="tabbar">
    <button data-t="home">${I.home}홈</button>
    <button data-t="help">${I.hands}품앗이</button>
    <button data-t="info">${I.news}동네소식</button>
    <button data-t="me">${I.user}내 정보</button>
  </nav>`;
  $('#tabbar').onclick=e=>{const b=e.target.closest('[data-t]');if(!b)return;if(tab===b.dataset.t){window.scrollTo({top:0,behavior:'smooth'});return}tab=b.dataset.t;chip='';window.scrollTo(0,0);render()};
  $('#fab').onclick=()=>pickCategory();
  $('#searchBtn').onclick=()=>{const s=$('#searchbar');s.classList.toggle('on');if(s.classList.contains('on'))$('#q').focus();else{q='';$('#q').value='';render()}};
  $('#q').oninput=e=>{q=e.target.value.trim().toLowerCase();renderList()};
  $('#areaBtn').onclick=()=>{tab='me';render()};
  render();load();
}

async function load(){
  if(!zones.length){const {data}=await sb.from('safe_zones').select('*').order('id');zones=data||[]}
  const [{data,error},cc]=await Promise.all([
    sb.from('posts').select('*, profiles(nickname,role)').order('created_at',{ascending:false}).limit(300),
    sb.from('post_comment_counts').select('*')]);
  if(error)return toast('글을 불러오지 못했어요. 새로고침해 주세요');
  posts=data;await loadLevels();counts={};(cc.data||[]).forEach(r=>counts[r.post_id]=r.n);renderList();
}

function render(){
  $$('#tabbar button').forEach(b=>b.classList.toggle('on',b.dataset.t===tab));
  $('#fab').style.display=tab==='me'?'none':'flex';
  const v=$('#view');
  if(tab==='home'){
    v.innerHTML=`<div class="utabs" id="utabs">${[['all','전체'],['sale','중고거래'],['free','나눔']].map(([k,n])=>`<button data-k="${k}" class="${homeCat===k?'on':''}">${n}</button>`).join('')}</div>
      <div class="chips" id="chips"></div><div class="list" id="list"></div>`;
    $('#utabs').onclick=e=>{const b=e.target.closest('[data-k]');if(!b)return;homeCat=b.dataset.k;chip='';$$('#utabs button').forEach(x=>x.classList.toggle('on',x===b));renderList()};
  }else if(tab==='help'||tab==='info'){
    v.innerHTML=`<div class="chips" id="chips"></div><div class="list" id="list"></div>`;
  }else{renderMe();return}
  $('#chips').onclick=e=>{const c=e.target.closest('[data-c]');if(!c)return;chip=chip===c.dataset.c?'':c.dataset.c;renderList()};
  renderList();
}

function chipSet(){
  if(tab==='home')return homeCat==='all'?[]:[['active',homeCat==='sale'?'거래 가능만':'나눔 중만']];
  if(tab==='help')return [['need','도와주세요'],['offer','도와드려요'],...HELP_FIELDS.slice(0,6).map(f=>[f,f])];
  if(tab==='info')return INFO_TOPICS.map(t=>[t,t]);
  return [];
}
function visible(){
  return posts.filter(p=>{
    if(tab==='home'){if(!(p.category==='sale'||p.category==='free'))return false;if(homeCat!=='all'&&p.category!==homeCat)return false;if(chip==='active'&&p.status==='done')return false}
    if(tab==='help'){if(p.category!=='help')return false;if(chip==='need'||chip==='offer'){if(p.help_type!==chip)return false}else if(chip&&p.help_field!==chip)return false}
    if(tab==='info'){if(p.category!=='info')return false;if(chip&&p.info_topic!==chip)return false}
    if(q&&!((p.title||'')+' '+(p.description||'')+' '+(p.place||'')).toLowerCase().includes(q))return false;
    return true;
  });
}

function statusTag(p){
  if(p.status==='held')return '<span class="tag amber">검토 중</span>';
  if(p.status==='hidden')return '<span class="tag gray">숨김</span>';
  if(p.status==='reserved')return '<span class="tag jade">예약중</span>';
  if(p.status==='done')return `<span class="tag gray">${p.category==='free'?'나눔완료':p.category==='sale'?'거래완료':'완료'}</span>`;
  return '';
}
function countFoot(p){const c=counts[p.id];return c?`<div class="foot"><span>${I.chat}${c}</span></div>`:''}

function rowSale(p){const im=imgs(p);return `<button class="item" data-id="${p.id}">
  <div class="th">${im.length?`<img src="${esc(im[0])}" loading="lazy" alt="">${im.length>1?`<span class="n">${im.length}</span>`:''}`:I[CATS[p.category].i]}</div>
  <div class="body"><div class="t">${esc(p.title)}</div><div class="m">${esc(where(p))}</div>
  <div class="p">${statusTag(p)}${p.category==='free'?'<span class="tag peach">나눔</span>':(p.price!=null?money(p.price):'<span style="color:var(--sub);font-weight:500">가격 문의</span>')}</div>
  ${countFoot(p)}</div></button>`}

function rowHelp(p){const im=imgs(p);const need=p.help_type!=='offer';
  const rw=p.reward_type==='paid'?(p.reward_amount?'사례 '+money(p.reward_amount):'사례금 있음'):REWARDS[p.reward_type]||'';
  return `<button class="item help" data-id="${p.id}">
  <div class="body"><div class="row1"><span class="tag ${need?'coral':'indigo'}">${need?'도와주세요':'도와드려요'}</span>${statusTag(p)}<span class="f">${esc(p.help_field||'')}</span></div>
  <div class="t">${esc(p.title)}</div>${p.description?`<div class="pv">${esc(p.description)}</div>`:''}
  <div class="info">${p.when_text?`<span>${I.clock}${esc(p.when_text)}</span>`:''}${p.area?`<span>${I.pin}${esc(p.area)}</span>`:''}</div>
  <div class="m" style="display:flex;justify-content:space-between;margin-top:8px"><span style="color:var(--ink);font-weight:700">${esc(rw)}</span><span>${ago(p.created_at)}${counts[p.id]?` · 댓글 ${counts[p.id]}`:''}</span></div></div>
  ${im.length?`<div class="th sm"><img src="${esc(im[0])}" loading="lazy" alt=""></div>`:''}</button>`}

function rowInfo(p){const im=imgs(p);return `<button class="item" data-id="${p.id}">
  <div class="body"><div><span class="tag amber">${esc(p.info_topic||'동네소식')}</span></div>
  <div class="t" style="margin-top:8px;font-weight:700">${esc(p.title)}</div>${p.description?`<div class="pv">${esc(p.description)}</div>`:''}
  <div class="m" style="margin-top:8px">${esc(p.profiles?.nickname||'')} · ${esc(where(p))}${counts[p.id]?` · 댓글 ${counts[p.id]}`:''}</div></div>
  ${im.length?`<div class="th sm"><img src="${esc(im[0])}" loading="lazy" alt=""></div>`:''}</button>`}

function emptyHTML(){
  if(q)return `<div class="empty"><b>'${esc(q)}' 검색 결과가 없어요</b>다른 단어로 찾아보세요.</div>`;
  const msg={home:['아직 올라온 물건이 없어요','안 쓰는 물건 사진을 찍어 첫 글을 올려보세요.'],help:['아직 품앗이 글이 없어요','이사, 라이드, 아이 돌봄… 이웃에게 부탁하거나 도와줄 일을 올려보세요.'],info:['아직 동네 이야기가 없어요','맛집, 병원, 학교 정보나 궁금한 점을 나눠보세요.']}[tab];
  return `<div class="empty"><b>${msg[0]}</b>${msg[1]}</div>`;
}

function renderList(){
  const c=$('#chips');if(!c)return;
  const cs=chipSet();c.style.display=cs.length?'flex':'none';
  c.innerHTML=cs.map(([k,n])=>`<button class="chip ${chip===k?'on':''}" data-c="${esc(k)}">${esc(n)}</button>`).join('');
  const L=visible();const fn=tab==='help'?rowHelp:tab==='info'?rowInfo:rowSale;
  $('#list').innerHTML=L.length?L.map(fn).join(''):emptyHTML();
  $$('#list .item').forEach(el=>el.onclick=()=>detail(el.dataset.id));
}

// ---------- 내 정보 ----------
async function renderMe(){
  const mine=posts.filter(p=>p.user_id===me.id);
  $('#view').innerHTML=`<div class="me-head">${avatar(me.nickname,me.id).replace('class="av"','class="av"')}<div><div class="nm">${esc(me.nickname)}</div><div class="m">${esc(me.area||'동네 미설정')}</div></div></div>
    <div class="stats"><div><b>${mine.length}</b><small>내 글</small></div><div><b id="rvAvg">–</b><small>받은 평점</small></div><div><b id="rvN">0</b><small>받은 후기</small></div></div>
    ${lvCard()}${isStaff()?`<button class="adminentry" id="adminBtn"><span><b>${me.role==='master'?'마스터 관리자':'관리자'} 메뉴</b><small>검토할 글, 회원 관리, 초대코드</small></span><span class="cnt" id="adminCnt"></span></button>`:''}
    <div class="invite"><div><b>이웃 초대하기</b><small>링크를 보내면 바로 들어올 수 있어요</small></div><button id="invBtn">링크 보내기</button></div>
    <div class="utabs" style="top:56px"><button class="on">내가 쓴 글 ${mine.length}</button></div>
    <div class="list" id="myList">${mine.length?mine.map(p=>p.category==='help'?rowHelp(p):p.category==='info'?rowInfo(p):rowSale(p)).join(''):'<div class="empty"><b>아직 쓴 글이 없어요</b>아래 홈에서 글쓰기를 눌러 시작해 보세요.</div>'}</div>`;
  $$('#myList .item').forEach(el=>el.onclick=()=>detail(el.dataset.id));
  if(isStaff()&&window.openAdmin){$('#adminBtn').onclick=()=>openAdmin();adminCount().then(n=>{const c=$('#adminCnt');if(c&&n)c.textContent=n})}
  $('#invBtn').onclick=async()=>{const url=SITE+'?code='+encodeURIComponent(me.invite_code||'');
    const text='애틀랜타 한인 동네 앱에 초대해요. 아래 링크로 들어와서 닉네임만 정하면 돼요.';
    try{if(navigator.share){await navigator.share({title:'한인동네',text,url});return}}catch(e){return}
    try{await navigator.clipboard.writeText(text+'\n'+url);toast('초대 링크를 복사했어요')}catch(e){prompt('이 링크를 복사해서 보내세요',url)}};
  const {data}=await sb.from('reviews').select('rating').eq('target_id',me.id);
  if(data&&data.length){$('#rvAvg').textContent=(data.reduce((a,r)=>a+r.rating,0)/data.length).toFixed(1);$('#rvN').textContent=data.length}
}

// ---------- 상세 ----------
function carousel(list){
  if(!list.length)return '';
  return `<div class="hero"><div class="track" id="track">${list.map((u,i)=>`<img src="${esc(u)}" data-i="${i}" alt="">`).join('')}</div>
    ${list.length>1?`<div class="dots" id="dots">${list.map((_,i)=>`<i class="${i?'':'on'}"></i>`).join('')}</div>`:''}</div>`;
}
function bindCarousel(root,list){
  const tr=root.querySelector('#track');if(!tr)return;
  tr.onscroll=()=>{const i=Math.round(tr.scrollLeft/tr.clientWidth);root.querySelectorAll('#dots i').forEach((d,k)=>d.classList.toggle('on',k===i))};
  tr.onclick=e=>{const im=e.target.closest('img');if(im)openViewer(list,+im.dataset.i)};
}
function openViewer(list,start){
  const v=$('#viewer');
  v.innerHTML=`<button class="icon-btn" id="vx" aria-label="닫기">${I.close}</button><div class="track" id="vtrack">${list.map(u=>`<img src="${esc(u)}" alt="">`).join('')}</div><div class="cnt" id="vcnt">${start+1} / ${list.length}</div>`;
  v.classList.add('on');history.pushState({v:1},'');
  const tr=$('#vtrack');requestAnimationFrame(()=>tr.scrollLeft=start*tr.clientWidth);
  tr.onscroll=()=>{$('#vcnt').textContent=(Math.round(tr.scrollLeft/tr.clientWidth)+1)+' / '+list.length};
  $('#vx').onclick=()=>back();
}

function factsGrid(p){
  const f=[];
  if(p.category==='sale'){if(p.condition)f.push(['상태',p.condition]);f.push(['가격 제안',p.negotiable?'받아요':'안 받아요'])}
  if(p.category==='free'){if(p.condition)f.push(['상태',p.condition]);if(p.pickup)f.push(['받는 방법',PICKUP[p.pickup]]);if(p.deadline)f.push(['나눔 마감',dateKo(p.deadline)])}
  if(p.category==='help'){if(p.when_text)f.push(['언제',p.when_text]);if(p.duration_text)f.push(['예상 시간',p.duration_text]);
    f.push([p.help_type==='offer'?'받고 싶은 사례':'드리는 사례',p.reward_type==='paid'?(p.reward_amount?money(p.reward_amount):'사례금 있음'):REWARDS[p.reward_type]||'-']);if(p.help_field)f.push(['분야',p.help_field])}
  if(p.category==='info'&&p.place)f.push(['장소·가게',p.place]);
  if(!f.length)return '';
  return `<div class="facts">${f.map(([a,b],i)=>`<div class="${f.length%2&&i===f.length-1?'wide':''}"><small>${esc(a)}</small><b>${esc(b)}</b></div>`).join('')}</div>`;
}

async function detail(id){
  const p=posts.find(x=>x.id===id);if(!p)return;
  const mine=p.user_id===me.id,im=imgs(p),cat=CATS[p.category];
  const zone=zones.find(z=>z.id===p.safe_zone_id);
  const contactHref=p.contact_value?(p.contact_type==='kakao'?p.contact_value:'sms:'+p.contact_value.replace(/[^0-9+]/g,'')):null;
  const contactBtn=contactHref?`<a class="btn" href="${esc(contactHref)}" ${p.contact_type==='kakao'?'target="_blank" rel="noopener"':''}>${p.contact_type==='kakao'?'오픈채팅으로 연락':'문자로 연락'}</a>`:`<button class="btn" id="askBtn">댓글로 문의</button>`;
  let priceBox='';
  if(p.category==='sale')priceBox=`<b>${p.price!=null?money(p.price):'가격 문의'}</b><small>${p.negotiable?'가격 제안 가능':'가격 제안 불가'}</small>`;
  if(p.category==='free')priceBox=`<b style="color:var(--peach)">무료 나눔</b><small>${p.deadline?dateKo(p.deadline)+'까지':'마감 전까지'}</small>`;
  if(p.category==='help')priceBox=`<b>${p.reward_type==='paid'?(p.reward_amount?money(p.reward_amount):'사례금'):esc(REWARDS[p.reward_type]||'')}</b><small>${p.help_type==='offer'?'도와드려요':'도와주세요'}</small>`;
  const ownerLabels=p.category==='sale'?{active:'판매중',reserved:'예약중',done:'거래완료'}:p.category==='free'?{active:'나눔중',reserved:'예약중',done:'나눔완료'}:p.category==='help'?{active:'구하는 중',reserved:'진행중',done:'완료'}:null;
  let bottom;
  if(mine)bottom=`<div class="bottombar">${ownerLabels?`<select class="in" id="stSel" style="flex:1;height:46px">${Object.entries(ownerLabels).map(([k,v])=>`<option value="${k}" ${p.status===k?'selected':''}>${v}</option>`).join('')}</select>`:'<div style="flex:1"></div>'}<button class="btn ghost" id="delBtn">삭제</button></div>`;
  else if(p.category==='info')bottom=`<div class="bottombar cbar"><input id="cin" maxlength="500" placeholder="댓글로 정보를 더해주세요"><button class="btn sm" id="csend">등록</button></div>`;
  else bottom=`<div class="bottombar"><div class="price">${priceBox}</div>${contactBtn}</div>`;

  const el=openPage(`
    ${im.length?`<div class="overlay-bar"><button class="icon-btn" data-back aria-label="뒤로">${I.back}</button></div>${carousel(im)}`
      :`<div class="topbar"><button class="icon-btn" data-back aria-label="뒤로">${I.back}</button><h2>${cat.n}</h2><div style="width:40px"></div></div>`}
    <div class="author">${avatar(p.profiles?.nickname,p.user_id)}<div><div class="nm">${esc(p.profiles?.nickname||'')}${staffBadge(p.profiles?.role)}${lvBadge(p.user_id)}</div><div class="ar">${esc(p.area||'')}</div></div>
      ${p.category!=='info'?`<div class="score" id="score"></div>`:''}</div>
    <div class="content">
      ${p.category==='help'?`<span class="tag ${p.help_type==='offer'?'indigo':'coral'}" style="margin-bottom:10px">${p.help_type==='offer'?'도와드려요':'도와주세요'}</span>`:''}
      ${p.category==='info'?`<span class="tag amber" style="margin-bottom:10px">${esc(p.info_topic||'동네소식')}</span>`:''}
      <h3>${statusTag(p)} ${esc(p.title)}</h3>
      <div class="m">${cat.n} · ${ago(p.created_at)}</div>
      ${factsGrid(p)}
      ${p.description?`<div class="desc">${esc(p.description)}</div>`:'<div style="height:14px"></div>'}
      ${p.link?`<a class="linkcard" href="${esc(p.link)}" target="_blank" rel="noopener">${I.link}<span>${esc(p.link)}</span></a>`:''}
      ${zone?`<div class="zone">${I.shield}<div><small>추천 거래 장소</small><b>${esc(zone.name)}</b></div></div>`:''}
      ${p.category==='sale'&&p.price_note?`<p class="m" style="margin-bottom:10px">AI 추천가 근거: ${esc(p.price_note)}</p>`:''}
    </div>
    ${p.status==='held'&&mine?'<div class="content" style="padding-top:0"><div class="note-box">광고로 의심되어 운영자 확인을 기다리고 있어요. 확인되면 다른 사람에게 보여요.</div></div>':''}
    ${isStaff()&&!mine?`<div class="staffbar"><b>운영자 메뉴</b>${p.spam_score||p.flag_reasons?.length?`<span class="small">감지: ${esc((p.flag_reasons||[]).join(', ')||'-')}</span>`:''}<div class="row"><button class="btn sm ghost" id="stShow">${p.status==='hidden'||p.status==='held'?'게시 승인':'숨기기'}</button><button class="btn sm ghost" id="stDel">글 삭제</button><button class="btn sm ghost" id="stBan" style="color:var(--coral)">작성자 강퇴</button></div></div>`:''}
    ${mine?'':`<div class="minor">${p.category!=='info'?'<button id="reviewBtn">후기 보기·남기기</button>':''}<button id="reportBtn">신고하기</button><button id="blockBtn">이 사용자 차단</button></div>`}
    <div class="sec"><h4>댓글 <span id="cN" style="color:var(--jade)">${counts[p.id]||''}</span></h4><div id="cmts"></div>
      ${p.category!=='info'||mine?`<div class="cbar" style="display:flex;gap:8px;margin-top:10px"><input id="cin" maxlength="500" placeholder="${p.category==='info'?'댓글 달기':'궁금한 점을 물어보세요'}"><button class="btn sm" id="csend">등록</button></div>`:''}
    </div>
    ${bottom}`);
  el.querySelectorAll('[data-back]').forEach(b=>b.onclick=back);
  bindCarousel(el,im);
  const ask=el.querySelector('#askBtn');if(ask)ask.onclick=()=>{const i=el.querySelector('#cin');i.scrollIntoView({behavior:'smooth',block:'center'});i.focus()};
  if(mine){
    const s=el.querySelector('#stSel');if(s)s.onchange=async()=>{const {error}=await sb.from('posts').update({status:s.value}).eq('id',p.id);if(error)return toast('바꾸지 못했어요');p.status=s.value;renderList();toast('상태를 바꿨어요')};
    el.querySelector('#delBtn').onclick=async()=>{if(!confirm('이 글을 삭제할까요? 되돌릴 수 없어요.'))return;
      const {error}=await sb.from('posts').delete().eq('id',p.id);if(error)return toast('삭제하지 못했어요');
      posts=posts.filter(x=>x.id!==p.id);back();render();toast('글을 삭제했어요')};
  }else{
    el.querySelector('#reportBtn').onclick=async()=>{const r=prompt('신고 사유를 적어주세요 (예: 사기 의심, 부적절한 내용)');if(!r)return;
      const {error}=await sb.from('reports').insert({post_id:p.id,reason:r});toast(error?'신고하지 못했어요':'신고를 접수했어요')};
    el.querySelector('#blockBtn').onclick=async()=>{if(!confirm('이 사용자의 글과 댓글이 더 이상 보이지 않아요. 차단할까요?'))return;
      const {error}=await sb.from('blocks').insert({blocked_id:p.user_id});if(error)return toast('차단하지 못했어요');
      back();await load();toast('차단했어요')};
    const rb=el.querySelector('#reviewBtn');if(rb)rb.onclick=()=>reviewSheet(p);
  }
  el.querySelector('#csend').onclick=async()=>{const i=el.querySelector('#cin');const body=i.value.trim();if(!body)return;
    const b=el.querySelector('#csend');b.disabled=true;const {error}=await sb.from('comments').insert({post_id:p.id,body});b.disabled=false;
    if(error)return toast('댓글을 올리지 못했어요');i.value='';counts[p.id]=(counts[p.id]||0)+1;loadComments(el,p.id);renderList()};
  if(isStaff()&&!mine&&window.bindStaffDetail)bindStaffDetail(el,p);
  loadComments(el,p.id);
  if(p.category!=='info'){const {data}=await sb.from('reviews').select('rating').eq('target_id',p.user_id);const sc=el.querySelector('#score');
    if(sc)sc.innerHTML=data&&data.length?`<b>★ ${(data.reduce((a,r)=>a+r.rating,0)/data.length).toFixed(1)}</b>후기 ${data.length}`:'<span>아직 후기 없음</span>'}
}

async function loadComments(el,postId){
  const {data,error}=await sb.from('comments').select('id,body,created_at,user_id,profiles(nickname,role)').eq('post_id',postId).order('created_at');
  const box=el.querySelector('#cmts');if(!box)return;
  if(error){box.innerHTML='<p class="m">댓글을 불러오지 못했어요</p>';return}
  el.querySelector('#cN').textContent=data.length||'';
  box.innerHTML=data.length?data.map(c=>`<div class="cmt">${avatar(c.profiles?.nickname,c.user_id)}<div style="flex:1;min-width:0"><div class="who">${esc(c.profiles?.nickname||'')}${staffBadge(c.profiles?.role)}${lvBadge(c.user_id)}<span>${ago(c.created_at)}</span></div><div class="tx">${esc(c.body)}</div></div>${c.user_id===me.id||isStaff()?`<button class="del" data-del="${c.id}">삭제</button>`:''}</div>`).join(''):'<p class="m" style="padding:8px 0">아직 댓글이 없어요. 첫 댓글을 남겨보세요.</p>';
  box.querySelectorAll('[data-del]').forEach(b=>b.onclick=async()=>{await sb.from('comments').delete().eq('id',b.dataset.del);counts[postId]=Math.max(0,(counts[postId]||1)-1);loadComments(el,postId);renderList()});
}

async function reviewSheet(p){
  const {data}=await sb.from('reviews').select('rating,comment,created_at').eq('target_id',p.user_id).order('created_at',{ascending:false});
  let n=5;
  openSheet(`<h3>${esc(p.profiles?.nickname||'')}님 거래 후기</h3>
    ${(data||[]).slice(0,4).map(r=>`<div class="cmt" style="padding:8px 4px"><div style="color:var(--amber);font-weight:700;flex:none">${'★'.repeat(r.rating)}</div><div class="tx" style="margin:0">${esc(r.comment||'')}<span class="m" style="display:block">${ago(r.created_at)}</span></div></div>`).join('')||'<p class="m" style="margin:0 4px 8px">아직 받은 후기가 없어요.</p>'}
    <div class="field"><div class="lb">별점 남기기</div><div class="pick" id="stars">${[1,2,3,4,5].map(k=>`<button data-v="${k}" class="${k===5?'on':''}">★ ${k}</button>`).join('')}</div></div>
    <div class="field"><input class="in" id="rc" placeholder="한 줄 후기 (예: 시간 약속을 잘 지키셨어요)"></div>
    <button class="btn block" id="rsave" style="margin-top:16px">후기 남기기</button>`);
  $('#stars').onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;n=+b.dataset.v;$$('#stars button').forEach(x=>x.classList.toggle('on',x===b))};
  $('#rsave').onclick=async()=>{const {error}=await sb.from('reviews').insert({post_id:p.id,target_id:p.user_id,rating:n,comment:$('#rc').value.trim()||null});
    if(error)return toast(error.message.includes('duplicate')?'이 글에는 이미 후기를 남겼어요':'예약중이거나 완료된 글에만 후기를 남길 수 있어요');closeSheet();loadLevels();toast('후기를 남겼어요')};
}

// ---------- 글쓰기 ----------
function pickCategory(){
  const d={sale:'사진만 찍으면 AI가 제목·설명·가격을 채워요',free:'안 쓰는 물건을 이웃에게 무료로',help:'부탁하거나, 도와줄 수 있는 일',info:'맛집, 병원, 학교, 구인, 렌트, 질문'};
  openSheet(`<h3>어떤 글을 쓸까요?</h3><div class="catgrid">${Object.entries(CATS).map(([k,c])=>`<button data-c="${k}"><span class="ci" style="background:var(--${c.c})">${I[c.i]}</span><b>${c.n}</b><small>${d[k]}</small></button>`).join('')}</div>`);
  $$('#sheetPanel [data-c]').forEach(b=>b.onclick=()=>{closeSheet();writePage(b.dataset.c)});
}

let photos=[],aiRan=false,W=null;
function pickHTML(id,opts,val){return `<div class="pick" id="${id}">${opts.map(([k,n])=>`<button type="button" data-v="${esc(k)}" class="${k===val?'on':''}">${esc(n)}</button>`).join('')}</div>`}
function bindPick(id,{toggle=false,cb}={}){const el=W.querySelector('#'+id);if(!el)return;el.onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;const was=b.classList.contains('on');el.querySelectorAll('button').forEach(x=>x.classList.remove('on'));if(!(toggle&&was))b.classList.add('on');cb&&cb(b.classList.contains('on')?b.dataset.v:null)}}
function pickVal(id){return W.querySelector('#'+id+' .on')?.dataset.v||null}
const fv=id=>(W.querySelector('#'+id)?.value||'').trim();

function photoField(cat,optional){
  const ai=cat==='sale'||cat==='free';
  return `<div class="field" style="padding-top:8px"><div class="photos" id="photos"></div>
    ${ai?`<div class="ai" id="aiBox"><div class="ic">${I.spark}</div><div class="tx" id="aiTx">사진을 올리면 AI가 <b>제목·설명${cat==='sale'?'·가격':''}</b>을 채워드려요.</div><button type="button" id="aiBtn" hidden>다시 분석</button></div>`
       :(optional?'<p class="m" style="margin-top:6px">사진은 선택이에요</p>':'')}</div>`;
}
function renderPhotos(){
  const box=W.querySelector('#photos');if(!box)return;
  box.innerHTML=`<button type="button" class="ptile" id="camBtn">${I.cam}<span>촬영</span></button><button type="button" class="ptile" id="albBtn">${I.img}<span>${photos.length}/${MAX_PHOTOS}</span></button>`
    +photos.map((p,i)=>`<div class="pthumb"><img src="${p.url}" alt=""><button type="button" class="x" data-x="${i}" aria-label="사진 빼기">${I.x}</button>${i===0?'<span class="rep">대표 사진</span>':''}</div>`).join('');
  box.querySelector('#camBtn').onclick=()=>{const i=$('#camIn');i.value='';i.click()};
  box.querySelector('#albBtn').onclick=()=>{const i=$('#albIn');i.value='';i.click()};
  box.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{photos.splice(+b.dataset.x,1);renderPhotos()});
  const ab=W.querySelector('#aiBtn');if(ab)ab.hidden=!photos.length||!aiRan;
}
async function addFiles(files,cat){
  const room=MAX_PHOTOS-photos.length;if(room<=0)return toast(`사진은 ${MAX_PHOTOS}장까지 올릴 수 있어요`);
  for(const f of [...files].slice(0,room)){const blob=await shrink(f,1280,0.82);photos.push({blob,url:URL.createObjectURL(blob)})}
  renderPhotos();
  if((cat==='sale'||cat==='free')&&!aiRan&&!fv('t'))runAI(cat);
}
function b64(blob){return new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result.split(',')[1]);fr.readAsDataURL(blob)})}
async function runAI(cat){
  if(!photos.length)return;aiRan=true;
  const box=W.querySelector('#aiBox'),tx=W.querySelector('#aiTx'),ab=W.querySelector('#aiBtn');
  box.classList.add('busy');ab.hidden=true;tx.innerHTML='<b>사진을 보고 있어요</b><br>10초 정도 걸려요';
  try{
    const images=[];for(const p of photos.slice(0,4))images.push(await b64(await shrink(p.blob,768,0.75)));
    const {data,error}=await sb.functions.invoke('analyze-item',{body:{images,category:cat}});
    if(error){let msg=error.message;try{const j=await error.context.json();msg=j.error||msg}catch(e){}
      tx.innerHTML=msg==='no_key'?'AI 자동 작성은 곧 열려요. 지금은 직접 입력해 주세요.':'AI가 분석하지 못했어요. 직접 입력하거나 다시 분석해 보세요.';return}
    const set=(id,v)=>{const e=W.querySelector('#'+id);if(e&&v!=null)e.value=v};
    set('t',data.title);set('d',data.description);
    if(data.condition&&CONDITIONS.includes(data.condition))W.querySelectorAll('#cond button').forEach(b=>b.classList.toggle('on',b.dataset.v===data.condition));
    if(cat==='sale'&&data.price!=null){set('pr',data.price);set('pnote',data.price_reason||'')}
    tx.innerHTML=cat==='sale'&&data.price!=null
      ?`AI 추천 가격<span class="big">${money(data.price)}</span>${data.price_low!=null?`보통 ${money(data.price_low)}~${money(data.price_high)}에 거래돼요. `:''}${esc(data.price_reason||'')}`
      :'<b>제목과 설명을 채웠어요.</b> 필요한 부분만 고쳐주세요.';
  }catch(e){tx.textContent='AI가 분석하지 못했어요. 직접 입력해 주세요.'}
  finally{box.classList.remove('busy');ab.hidden=false}
}

function contactField(){return `<div class="field"><div class="lb">연락 받을 방법<span class="opt">비워두면 댓글로 문의받아요</span></div>
  <div style="display:flex;gap:8px"><select class="in" id="ct" style="width:42%"><option value="sms">문자</option><option value="kakao">카톡 오픈채팅</option></select>
  <input class="in" id="cv" placeholder="전화번호" inputmode="tel"></div></div>`}
function areaField(){return `<div class="field"><label for="ar">동네</label><input class="in" id="ar" value="${esc(me.area||'')}" placeholder="둘루스, 스와니…"></div>`}
function zoneField(){return `<div class="field"><label for="z">거래 희망 장소<span class="opt">선택</span></label><select class="in" id="z"><option value="">정하지 않음</option>${zones.map(z=>`<option value="${z.id}">${esc(z.name)}</option>`).join('')}</select></div>`}

function formFor(cat){
  const cond=pickHTML('cond',CONDITIONS.map(c=>[c,c]),'사용감 있음');
  if(cat==='sale')return `${photoField(cat)}
    <div class="field"><label for="t">제목</label><input class="in" id="t" maxlength="80" placeholder="예: 그라코 아기 카시트"></div>
    <div class="field"><label for="pr">가격</label><div class="prefix"><span>$</span><input class="in" id="pr" type="number" min="0" inputmode="numeric" placeholder="사진을 올리면 AI가 추천해요"></div>
      <input type="hidden" id="pnote"><label class="toggle"><input type="checkbox" id="neg">가격 제안 받기</label></div>
    <div class="field"><div class="lb">상태</div>${cond}</div>
    <div class="field"><label for="d">자세한 설명</label><textarea class="in" id="d" placeholder="브랜드, 사용 기간, 구성품, 하자 여부를 적어주세요"></textarea></div>
    ${zoneField()}${areaField()}${contactField()}`;
  if(cat==='free')return `${photoField(cat)}
    <div class="field"><label for="t">제목</label><input class="in" id="t" maxlength="80" placeholder="예: 아이 겨울옷 한 박스 나눔해요"></div>
    <div class="field"><div class="lb">상태</div>${cond}</div>
    <div class="field"><div class="lb">받는 방법</div>${pickHTML('pickup',Object.entries(PICKUP),'meet')}</div>
    <div class="field"><label for="dl">나눔 마감일<span class="opt">선택</span></label><input class="in" id="dl" type="date"></div>
    <div class="field"><label for="d">설명</label><textarea class="in" id="d" placeholder="어떤 물건인지, 언제 가져갈 수 있는지 적어주세요"></textarea></div>
    ${zoneField()}${areaField()}${contactField()}`;
  if(cat==='help')return `<div class="field"><div class="lb">어떤 글인가요?</div><div class="seg2" id="ht">
      <button type="button" data-v="need" class="on"><b>도와주세요</b><small>이웃의 손이 필요해요</small></button>
      <button type="button" data-v="offer"><b>도와드려요</b><small>제가 할 수 있어요</small></button></div></div>
    <div class="field"><div class="lb">분야</div>${pickHTML('hf',HELP_FIELDS.map(f=>[f,f]),null)}</div>
    <div class="field"><label for="t">제목</label><input class="in" id="t" maxlength="80" placeholder="예: 토요일 오전 이사 짐 옮길 분 구해요"></div>
    <div class="field"><label for="d">자세한 내용</label><textarea class="in" id="d" placeholder="무엇을, 어디서, 몇 명이 필요한지 적어주세요"></textarea></div>
    <div class="field"><label for="wh">언제</label><input class="in" id="wh" placeholder="예: 11/30 (토) 오전 10시, 평일 저녁 아무 때나"></div>
    <div class="field"><label for="du">예상 시간<span class="opt">선택</span></label><input class="in" id="du" placeholder="예: 2~3시간"></div>
    <div class="field"><div class="lb" id="rwL">드리는 사례</div>${pickHTML('rw',Object.entries(REWARDS),'swap')}
      <div class="prefix" id="amtBox" style="margin-top:10px;display:none"><span>$</span><input class="in" id="amt" type="number" min="0" inputmode="numeric" placeholder="금액"></div></div>
    <div class="field"><div class="lb">사진<span class="opt">선택</span></div></div>${photoField(cat,false)}
    ${areaField()}${contactField()}`;
  return `<div class="field"><div class="lb">주제</div>${pickHTML('it',INFO_TOPICS.map(t=>[t,t]),null)}</div>
    <div class="field"><label for="t">제목</label><input class="in" id="t" maxlength="80" placeholder="예: 둘루스 한국어 되는 소아과 추천해요"></div>
    <div class="field"><label for="d">내용</label><textarea class="in" id="d" style="min-height:180px" placeholder="경험, 가격, 영업시간, 팁, 궁금한 점을 자유롭게 적어주세요"></textarea></div>
    <div class="field"><label for="pl">장소·가게 이름<span class="opt">선택</span></label><input class="in" id="pl" placeholder="예: OO 소아과 (Pleasant Hill Rd)"></div>
    <div class="field"><label for="lk">관련 링크<span class="opt">선택</span></label><input class="in" id="lk" type="url" placeholder="https://"></div>
    <div class="field"><div class="lb">사진<span class="opt">선택</span></div></div>${photoField(cat,false)}
    ${areaField()}`;
}

function writePage(cat){
  photos=[];aiRan=false;
  W=openPage(`<div class="topbar"><button class="icon-btn" data-back aria-label="닫기">${I.close}</button><h2>${CATS[cat].n} 글쓰기</h2><div style="width:40px"></div></div>
    <div class="form">${formFor(cat)}</div>
    <div class="submitbar"><button class="btn block" id="save">작성 완료</button></div>`,()=>{W=null});
  W.querySelector('[data-back]').onclick=back;
  renderPhotos();
  $('#camIn').onchange=e=>addFiles(e.target.files,cat);
  $('#albIn').onchange=e=>addFiles(e.target.files,cat);
  const ab=W.querySelector('#aiBtn');if(ab)ab.onclick=()=>runAI(cat);
  bindPick('cond');bindPick('pickup');bindPick('hf',{toggle:true});bindPick('it');
  bindPick('rw',{cb:v=>{W.querySelector('#amtBox').style.display=v==='paid'?'block':'none'}});
  const ht=W.querySelector('#ht');if(ht)ht.onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;ht.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
    W.querySelector('#rwL').textContent=b.dataset.v==='offer'?'받고 싶은 사례':'드리는 사례'};
  const ct=W.querySelector('#ct');if(ct)ct.onchange=()=>{const cv=W.querySelector('#cv');cv.placeholder=ct.value==='kakao'?'https://open.kakao.com/o/…':'전화번호';cv.inputMode=ct.value==='kakao'?'url':'tel'};
  W.querySelector('#save').onclick=()=>savePost(cat);
}

async function savePost(cat){
  const title=fv('t');
  if(cat==='info'&&!pickVal('it'))return toast('주제를 골라주세요');
  if(!title)return toast('제목을 입력해 주세요');
  if(cat==='help'&&!fv('d'))return toast('자세한 내용을 적어주세요');
  const ct=fv('ct'),cv=fv('cv');
  if(ct==='kakao'&&cv&&!/^https:\/\/open\.kakao\.com\//.test(cv))return toast('오픈채팅 링크는 https://open.kakao.com/ 으로 시작해요');
  const lk=fv('lk');if(lk&&!/^https?:\/\//.test(lk))return toast('링크는 https:// 로 시작해요');
  const b=W.querySelector('#save');b.disabled=true;const reset=()=>{b.disabled=false;b.textContent='작성 완료'};
  const urls=[];
  for(let i=0;i<photos.length;i++){
    b.textContent=`사진 올리는 중 ${i+1}/${photos.length}`;
    const path=`${me.id}/${Date.now()}_${i}.jpg`;
    const up=await sb.storage.from('post-images').upload(path,photos[i].blob,{contentType:'image/jpeg'});
    if(up.error){reset();return toast('사진을 올리지 못했어요. 다시 시도해 주세요')}
    urls.push(sb.storage.from('post-images').getPublicUrl(path).data.publicUrl);
  }
  b.textContent='글 올리는 중';
  const row={category:cat,title,description:fv('d')||null,area:fv('ar')||null,images:urls,image_url:urls[0]||null,
    contact_type:cv?ct:null,contact_value:cv||null,safe_zone_id:fv('z')?+fv('z'):null};
  if(cat==='sale')Object.assign(row,{price:fv('pr')!==''?parseInt(fv('pr')):null,negotiable:W.querySelector('#neg').checked,condition:pickVal('cond'),price_note:fv('pnote')||null});
  if(cat==='free')Object.assign(row,{condition:pickVal('cond'),pickup:pickVal('pickup'),deadline:fv('dl')||null});
  if(cat==='help'){const rw=pickVal('rw');Object.assign(row,{help_type:W.querySelector('#ht .on').dataset.v,help_field:pickVal('hf'),when_text:fv('wh')||null,duration_text:fv('du')||null,
    reward_type:rw,reward_amount:rw==='paid'&&fv('amt')!==''?parseInt(fv('amt')):null})}
  if(cat==='info')Object.assign(row,{info_topic:pickVal('it'),place:fv('pl')||null,link:lk||null});
  const {data:ins,error}=await sb.from('posts').insert(row).select('status').single();
  if(error){reset();return toast(error.message.includes('rate_limit')?'짧은 시간에 글을 너무 많이 올렸어요. 잠시 후 다시 올려주세요':'글을 올리지 못했어요: '+error.message)}
  back();
  tab=cat==='help'?'help':cat==='info'?'info':'home';if(tab==='home')homeCat=cat;chip='';
  render();await load();toast(ins&&ins.status==='held'?'광고로 의심되어 운영자 확인 후 게시돼요':'글을 올렸어요');
}

// 사진 크기를 줄여 업로드 시간과 저장 공간을 아껴요
function shrink(file,max,qual){return new Promise(res=>{const img=new Image();img.onload=()=>{
  const s=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement('canvas');
  c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);c.getContext('2d').drawImage(img,0,0,c.width,c.height);
  c.toBlob(b=>res(b||file),'image/jpeg',qual)};img.onerror=()=>res(file);img.src=URL.createObjectURL(file)})}

