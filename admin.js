// 한인동네 운영자(관리자·마스터) 기능

const BAN_REASONS=['광고·홍보 도배','사기 의심','욕설·비방','부적절한 사진·내용','기타 운영 원칙 위반'];

async function adminCount(){
  const [a,b]=await Promise.all([
    sb.from('posts').select('id',{count:'exact',head:true}).in('status',['held','hidden']),
    sb.from('reports').select('id',{count:'exact',head:true}).eq('status','open')]);
  return (a.count||0)+(b.count||0);
}

async function staffAction(kind,p,after){
  if(kind==='show'){
    const to=(p.status==='hidden'||p.status==='held')?'active':'hidden';
    const {error}=await sb.rpc('admin_set_post_status',{p_post:p.id,p_status:to});
    if(error)return toast('처리하지 못했어요: '+error.message);
    p.status=to;toast(to==='active'?'게시를 승인했어요':'글을 숨겼어요');
  }
  if(kind==='del'){
    if(!confirm('이 글을 완전히 삭제할까요? 되돌릴 수 없어요.'))return;
    const files=(p.images||[]).map(u=>u.split('/post-images/')[1]).filter(Boolean);
    if(files.length)await sb.storage.from('post-images').remove(files);
    const {error}=await sb.from('posts').delete().eq('id',p.id);
    if(error)return toast('삭제하지 못했어요: '+error.message);
    posts=posts.filter(x=>x.id!==p.id);toast('글을 삭제했어요');
  }
  if(kind==='ban'){
    const ok=await banDialog(p.profiles?.nickname||'이 회원');if(!ok)return;
    const {error}=await sb.rpc('admin_ban',{p_user:p.user_id,p_ban:true,p_reason:ok});
    if(error)return toast(banErr(error));
    toast('강퇴했어요. 이 회원의 글은 모두 숨겨졌어요');
  }
  after&&after();
}
function banErr(e){const m=e.message||'';return m.includes('master')?'마스터는 강퇴할 수 없어요':m.includes('only_master')?'관리자는 마스터만 강퇴할 수 있어요':m.includes('self')?'자기 자신은 강퇴할 수 없어요':'처리하지 못했어요: '+m}

function banDialog(name){
  return new Promise(res=>{
    openSheet(`<h3>${esc(name)}님을 강퇴할까요?</h3>
      <p class="m" style="margin:0 4px 6px">강퇴하면 이 회원은 앱을 쓸 수 없고, 올린 글은 모두 숨겨져요. 나중에 회원 관리에서 해제할 수 있어요.</p>
      <div class="field"><div class="lb">사유</div><div class="pick" id="banWhy">${BAN_REASONS.map((r,i)=>`<button data-v="${esc(r)}" class="${i?'':'on'}">${esc(r)}</button>`).join('')}</div></div>
      <div style="display:flex;gap:8px;margin-top:18px"><button class="btn ghost" id="banNo" style="flex:1">취소</button><button class="btn" id="banYes" style="flex:1;background:var(--coral)">강퇴하기</button></div>`);
    const w=$('#banWhy');w.onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;w.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b))};
    $('#banNo').onclick=()=>{closeSheet();res(null)};
    $('#banYes').onclick=()=>{const r=w.querySelector('.on')?.dataset.v||'운영 원칙 위반';closeSheet();res(r)};
  });
}

function bindStaffDetail(el,p){
  const go=k=>staffAction(k,p,()=>{back();load()});
  el.querySelector('#stShow').onclick=()=>go('show');
  el.querySelector('#stDel').onclick=()=>go('del');
  el.querySelector('#stBan').onclick=()=>go('ban');
}

// ---------- 관리자 메뉴 ----------
let A=null,aTab='queue';
function openAdmin(){
  A=openPage(`<div class="topbar"><button class="icon-btn" data-back aria-label="뒤로">${I.back}</button><h2>${me.role==='master'?'마스터 관리자':'관리자'}</h2><div style="width:40px"></div></div>
    <div class="utabs" id="aTabs" style="top:calc(56px + env(safe-area-inset-top,0px))">
      <button data-a="queue">검토할 글</button><button data-a="members">회원</button><button data-a="invites">초대코드</button></div>
    <div class="list" id="aBody" style="padding-bottom:40px"></div>`,()=>{A=null;if(tab==='me')render()});
  A.querySelector('[data-back]').onclick=back;
  A.querySelector('#aTabs').onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;aTab=b.dataset.a;renderAdmin()};
  renderAdmin();
}
function renderAdmin(){
  if(!A)return;
  A.querySelectorAll('#aTabs button').forEach(b=>b.classList.toggle('on',b.dataset.a===aTab));
  A.querySelector('#aBody').innerHTML='<p class="m" style="padding:20px 0">불러오는 중…</p>';
  ({queue:adminQueue,members:adminMembers,invites:adminInvites})[aTab]();
}

async function adminQueue(){
  const box=A.querySelector('#aBody');
  const [{data:flag},{data:reps}]=await Promise.all([
    sb.from('posts').select('*, profiles!posts_user_id_fkey(nickname,role)').or('status.in.(held,hidden),spam_score.gt.1').order('created_at',{ascending:false}).limit(100),
    sb.from('reports').select('id,post_id,reason,created_at').eq('status','open').order('created_at',{ascending:false})]);
  const byPost={};(reps||[]).forEach(r=>{(byPost[r.post_id]=byPost[r.post_id]||[]).push(r)});
  const list=[...(flag||[])];const have=new Set(list.map(p=>p.id));
  const missing=Object.keys(byPost).filter(id=>!have.has(id));
  if(missing.length){const {data}=await sb.from('posts').select('*, profiles!posts_user_id_fkey(nickname,role)').in('id',missing);(data||[]).forEach(p=>list.push(p))}
  const rank=p=>(p.status==='held'?0:byPost[p.id]?1:p.status==='hidden'?2:3);
  list.sort((a,b)=>rank(a)-rank(b));
  const shown=list.filter(p=>p.status!=='active'||byPost[p.id]||p.spam_score>1);
  if(!shown.length){box.innerHTML='<div class="empty"><b>검토할 글이 없어요</b>광고로 의심되거나 신고된 글이 생기면 여기에 모여요.</div>';return}
  box.innerHTML=`<p class="m" style="padding:12px 0 4px">자동 감지되거나 신고된 글 ${shown.length}개</p>`+shown.map(p=>{
    const rs=byPost[p.id]||[];
    return `<div class="acard" data-id="${p.id}">
      <div>${statusTag(p)||'<span class="tag jade">게시 중</span>'} <span class="tag gray">${CATS[p.category].n}</span></div>
      <div class="t" style="margin-top:6px">${esc(p.title)}</div>
      <div class="m">${esc(p.profiles?.nickname||'')} · ${ago(p.created_at)}</div>
      <div class="why">${(p.flag_reasons||[]).map(r=>`<span class="tag amber">${esc(r)}</span>`).join('')}${rs.length?`<span class="tag coral">신고 ${rs.length}건</span>`:''}</div>
      ${rs.length?`<div class="m">신고 사유: ${rs.slice(0,3).map(r=>esc(r.reason)).join(' / ')}</div>`:''}
      <div class="acts"><button class="btn ghost" data-k="view">보기</button>
        <button class="btn ghost" data-k="show">${p.status==='active'?'숨기기':'게시 승인'}</button>
        ${rs.length&&p.status==='active'?'<button class="btn ghost" data-k="ok">신고 무시</button>':''}
        <button class="btn ghost" data-k="del">삭제</button>
        <button class="btn ghost" data-k="ban" style="color:var(--coral)">작성자 강퇴</button></div></div>`}).join('');
  box.querySelectorAll('.acard').forEach(c=>{
    const p=shown.find(x=>x.id===c.dataset.id);
    c.querySelector('.acts').onclick=async e=>{const b=e.target.closest('[data-k]');if(!b)return;const k=b.dataset.k;
      if(k==='view'){if(!posts.find(x=>x.id===p.id))posts.push(p);return detail(p.id)}
      if(k==='ok'){const {error}=await sb.rpc('admin_resolve_reports',{p_post:p.id});if(error)return toast(error.message);toast('신고를 처리했어요');return renderAdmin()}
      await staffAction(k,p,()=>{renderAdmin();load()});
    };
  });
}

async function adminMembers(){
  const box=A.querySelector('#aBody');
  const {data,error}=await sb.from('profiles').select('*').order('created_at',{ascending:false});
  if(error){box.innerHTML=`<p class="m">${esc(error.message)}</p>`;return}
  const cnt={};posts.forEach(p=>cnt[p.user_id]=(cnt[p.user_id]||0)+1);
  const roleTag=r=>r==='master'?'<span class="tag jade">마스터</span>':r==='admin'?'<span class="tag indigo">관리자</span>':'';
  box.innerHTML=`<p class="m" style="padding:12px 0 4px">전체 회원 ${data.length}명 · 강퇴 ${data.filter(m=>m.banned).length}명</p>`+data.map(m=>`<div class="mrow" data-id="${m.id}">
      ${avatar(m.nickname,m.id)}
      <div class="info"><b>${esc(m.nickname)}</b> ${roleTag(m.role)}${m.banned?'<span class="tag coral">강퇴됨</span>':''}
        <div class="m">${esc(m.area||'동네 미설정')} · 글 ${cnt[m.id]||0} · ${ago(m.created_at)} 가입${m.banned&&m.banned_reason?' · '+esc(m.banned_reason):''}</div></div>
      <div class="acts">${m.id===me.id||m.role==='master'?'':`
        ${me.role==='master'?`<button class="btn ghost" data-k="role">${m.role==='admin'?'관리자 해제':'관리자로'}</button>`:''}
        ${m.role==='admin'&&me.role!=='master'?'':`<button class="btn ghost" data-k="ban" style="${m.banned?'':'color:var(--coral)'}">${m.banned?'강퇴 해제':'강퇴'}</button>`}`}</div></div>`).join('');
  box.querySelectorAll('.mrow').forEach(r=>{
    const m=data.find(x=>x.id===r.dataset.id);
    r.querySelector('.acts').onclick=async e=>{const b=e.target.closest('[data-k]');if(!b)return;
      if(b.dataset.k==='role'){const to=m.role==='admin'?'member':'admin';
        if(!confirm(to==='admin'?`${m.nickname}님을 관리자로 지정할까요? 글 숨기기·삭제와 회원 강퇴를 할 수 있게 돼요.`:`${m.nickname}님의 관리자 권한을 해제할까요?`))return;
        const {error}=await sb.rpc('master_set_role',{p_user:m.id,p_role:to});if(error)return toast(banErr(error));
        toast(to==='admin'?'관리자로 지정했어요':'관리자 권한을 해제했어요');return renderAdmin()}
      if(m.banned){if(!confirm(`${m.nickname}님의 강퇴를 해제할까요? 숨겨진 글은 다시 보이지 않으니 필요하면 검토할 글에서 승인해 주세요.`))return;
        const {error}=await sb.rpc('admin_ban',{p_user:m.id,p_ban:false});if(error)return toast(banErr(error));toast('강퇴를 해제했어요');return renderAdmin()}
      const why=await banDialog(m.nickname);if(!why)return;
      const {error}=await sb.rpc('admin_ban',{p_user:m.id,p_ban:true,p_reason:why});if(error)return toast(banErr(error));
      toast('강퇴했어요');load();renderAdmin();
    };
  });
}

async function adminInvites(){
  const box=A.querySelector('#aBody');
  const {data,error}=await sb.from('invite_codes').select('*').order('created_at',{ascending:false});
  if(error){box.innerHTML=`<p class="m">${esc(error.message)}</p>`;return}
  box.innerHTML=`<div class="box" style="margin:14px 0;border:1px solid var(--line);border-radius:14px;padding:14px">
      <b>새 초대코드 만들기</b><p class="m" style="margin:2px 0 10px">모임마다 코드를 따로 만들면 어디서 들어왔는지 알 수 있어요.</p>
      <div style="display:flex;gap:8px"><input class="in" id="icCode" placeholder="예: GT2026" style="text-transform:uppercase;flex:1.3"><input class="in" id="icMax" type="number" min="1" value="50" style="flex:.7"></div>
      <input class="in" id="icNote" placeholder="메모 (예: 조지아텍 한인 학생)" style="margin-top:8px">
      <button class="btn block" id="icAdd" style="margin-top:10px">만들기</button></div>
    ${data.map(c=>`<div class="invrow" data-code="${esc(c.code)}"><div><code>${esc(c.code)}</code><div class="m">${esc(c.note||'')} · ${c.used_count}/${c.max_uses}명 사용</div></div>
      <div style="display:flex;gap:6px"><button class="btn ghost sm" data-k="more">+50명</button><button class="btn ghost sm" data-k="link">링크 복사</button></div></div>`).join('')}`;
  A.querySelector('#icAdd').onclick=async()=>{
    const code=A.querySelector('#icCode').value.trim().toUpperCase().replace(/[^A-Z0-9가-힣_-]/g,'');
    const max=parseInt(A.querySelector('#icMax').value)||50;
    if(code.length<3)return toast('코드는 3자 이상으로 정해주세요');
    const {error}=await sb.from('invite_codes').insert({code,max_uses:max,note:A.querySelector('#icNote').value.trim()||null});
    if(error)return toast(error.message.includes('duplicate')?'이미 있는 코드예요':'만들지 못했어요: '+error.message);
    toast('초대코드를 만들었어요');renderAdmin();
  };
  box.querySelectorAll('.invrow').forEach(r=>r.onclick=async e=>{const b=e.target.closest('[data-k]');if(!b)return;const code=r.dataset.code;
    if(b.dataset.k==='link'){const url=SITE+'?code='+encodeURIComponent(code);try{await navigator.clipboard.writeText(url);toast('초대 링크를 복사했어요')}catch(err){prompt('이 링크를 복사하세요',url)}return}
    const c=data.find(x=>x.code===code);const {error}=await sb.from('invite_codes').update({max_uses:c.max_uses+50}).eq('code',code);
    if(error)return toast('바꾸지 못했어요');toast('50명 늘렸어요');renderAdmin()});
}
