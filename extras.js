// 한인동네: 공유, 약관 링크, 회원 탈퇴, 관리자 주간 숫자, QR 전단

I.share='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>';

(function(){const s=document.createElement('style');s.textContent=`
.mefoot{padding:28px 16px 40px;display:flex;flex-direction:column;gap:2px}
.mefoot a,.mefoot button{display:block;text-align:left;padding:12px 0;font-size:14.5px;color:var(--sub);border-bottom:1px solid var(--line);text-decoration:none}
.mefoot .quit{color:var(--faint);border-bottom:0;font-size:13.5px;margin-top:10px}
.wkstats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:12px 16px 4px}
.wkstats div{background:var(--surface);border-radius:12px;padding:10px 8px;text-align:center}
.wkstats b{display:block;font-size:19px;font-weight:800}
.wkstats small{font-size:11.5px;color:var(--sub)}
.jointerms{font-size:12.5px;color:var(--faint);text-align:center;margin-top:10px;line-height:1.5}
.jointerms a{color:var(--sub)}
`;document.head.appendChild(s)})();

const POST_LINK=new URLSearchParams(location.search).get('post');
let postLinkDone=false;

// ---------- 글 공유 ----------
async function sharePost(p){
  const url=SITE+'?post='+p.id;
  const price=p.category==='sale'&&p.price!=null?` ${money(p.price)}`:p.category==='free'?' 무료 나눔':'';
  const text=`[한인동네] ${p.title}${price}`;
  try{if(navigator.share){await navigator.share({title:p.title,text,url});return}}catch(e){return}
  try{await navigator.clipboard.writeText(text+'\n'+url);toast('글 링크를 복사했어요. 카톡방에 붙여넣으세요')}catch(e){prompt('이 링크를 복사해서 보내세요',url)}
}
const _detailX=detail;
detail=function(id){
  const r=_detailX(id);const p=posts.find(x=>x.id===id);const el=stack.length?stack[stack.length-1].el:null;
  if(p&&el){
    const bar=el.querySelector('.overlay-bar')||el.querySelector('.topbar');
    if(bar&&!bar.querySelector('.sharebtn')){
      const b=document.createElement('button');b.className='icon-btn sharebtn';b.setAttribute('aria-label','공유하기');b.innerHTML=I.share;b.onclick=()=>sharePost(p);
      const filler=bar.querySelector(':scope > div[style*="width:40px"]');
      if(filler)filler.replaceWith(b);else bar.appendChild(b);
    }
  }
  return r;
};

// 공유 링크(?post=)로 들어오면 그 글을 바로 열어요
const _loadX=load;
load=async function(){
  await _loadX();
  if(POST_LINK&&!postLinkDone){postLinkDone=true;
    if(!posts.find(x=>x.id===POST_LINK)){const {data}=await sb.from('posts').select('*, profiles!posts_user_id_fkey(nickname,role)').eq('id',POST_LINK).maybeSingle();if(data)posts.push(data)}
    history.replaceState(null,'',SITE);
    if(posts.find(x=>x.id===POST_LINK))detail(POST_LINK);else toast('삭제됐거나 볼 수 없는 글이에요');
  }
};

// ---------- 가입 화면: 약관 안내 ----------
const _joinX=joinScreen;
joinScreen=function(){
  _joinX();
  const btn=$('#joinBtn');if(!btn)return;
  btn.insertAdjacentHTML('afterend','<p class="jointerms">시작하기를 누르면 <a href="terms.html" target="_blank" rel="noopener">이용약관·개인정보 처리방침·커뮤니티 규칙</a>에 동의하는 것으로 봐요.</p>');
};

// ---------- 내 정보: 약관, 전단, 탈퇴 ----------
const _renderMeX=renderMe;
renderMe=async function(){
  await _renderMeX();
  const v=$('#view');if(!v||v.querySelector('.mefoot'))return;
  v.insertAdjacentHTML('beforeend',`<div class="mefoot">
    <a href="terms.html#rules" target="_blank" rel="noopener">커뮤니티 규칙</a>
    <a href="terms.html#terms" target="_blank" rel="noopener">이용약관</a>
    <a href="terms.html#privacy" target="_blank" rel="noopener">개인정보 처리방침</a>
    ${isStaff()?`<a href="flyer.html?code=${encodeURIComponent(me.invite_code||'')}" target="_blank" rel="noopener">QR 홍보 전단 인쇄하기</a>`:''}
    <button class="quit" id="quitBtn">회원 탈퇴</button></div>`);
  $('#quitBtn').onclick=quitAccount;
};
async function quitAccount(){
  if(!confirm('탈퇴하면 내가 쓴 글, 댓글, 채팅, 받은 후기가 모두 지워지고 되돌릴 수 없어요. 탈퇴할까요?'))return;
  if(prompt('정말 탈퇴하려면 "탈퇴"라고 입력해 주세요')!=='탈퇴')return toast('탈퇴를 취소했어요');
  const {error}=await sb.rpc('delete_my_account');
  if(error)return toast(error.message.includes('banned')?'이용이 제한된 계정은 탈퇴할 수 없어요':'탈퇴하지 못했어요. 다시 시도해 주세요');
  try{await sb.auth.signOut()}catch(e){}
  try{localStorage.clear()}catch(e){}
  location.replace(SITE);
}

// ---------- 관리자: 지난 7일 숫자 ----------
const _openAdminX=openAdmin;
openAdmin=function(){
  _openAdminX();
  const tabs=A&&A.querySelector('#aTabs');if(!tabs)return;
  tabs.insertAdjacentHTML('beforebegin','<div class="wkstats" id="wk"><div><b>–</b><small>전체 회원</small></div><div><b>–</b><small>7일 새 회원</small></div><div><b>–</b><small>7일 새 글</small></div><div><b>–</b><small>7일 거래완료</small></div></div>');
  sb.rpc('admin_week_stats').then(({data})=>{const w=A&&A.querySelector('#wk');if(!w||!data)return;
    const b=w.querySelectorAll('b');b[0].textContent=data.total;b[1].textContent=data.members;b[2].textContent=data.posts;b[3].textContent=data.done});
};
