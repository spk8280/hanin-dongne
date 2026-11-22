// 한인동네: 아이디·비밀번호로 내 계정 지키기

const LOGIN_DOMAIN='id.hanindongne.app';
const loginEmail=id=>`${id.trim().toLowerCase()}@${LOGIN_DOMAIN}`;
const loginIdOf=email=>email&&email.endsWith('@'+LOGIN_DOMAIN)?email.split('@')[0]:'';

(function(){const s=document.createElement('style');s.textContent=`
.keepcard{display:flex;gap:12px;align-items:center;width:calc(100% - 32px);margin:12px 16px 0;padding:14px 16px;border-radius:16px;background:var(--coral-soft);text-align:left}
.keepcard b{display:block;font-size:15px}
.keepcard small{display:block;font-size:13px;color:var(--sub);margin-top:2px;line-height:1.45}
.keepcard span.go{flex:none;font-size:13.5px;font-weight:700;color:var(--coral)}
.loginlink{display:block;margin:14px auto 0;font-size:14.5px;color:var(--jade);font-weight:600;text-align:center}
.pwnote{font-size:12.5px;color:var(--faint);margin:6px 4px 0;line-height:1.5}
.onb.dark #onbJoin{background:#fff;color:#0E6E5B}
.tempbox{font-size:26px;font-weight:800;letter-spacing:2px;text-align:center;padding:16px;border-radius:12px;background:var(--surface);margin:8px 0 12px;user-select:all}
`;document.head.appendChild(s)})();

async function myLoginId(){const {data:{session}}=await sb.auth.getSession();return loginIdOf(session?.user?.email||'')}

// ---------- 첫 화면: 회원가입·로그인 버튼 ----------
const _onbA=onboarding;
onboarding=function(){
  _onbA();
  const next=$('#onbNext'),have=$('#onbHave'),skip=$('#onbSkip'),sl=$('#slides');if(!next)return;
  const join=document.createElement('button');join.className=next.className;join.id='onbJoin';join.textContent='회원가입';join.onclick=()=>joinScreen();
  next.style.display='none';next.insertAdjacentElement('afterend',join);
  if(have){have.textContent='이미 가입했어요 · 로그인';have.onclick=loginScreen}
  if(skip)skip.style.display='none';
  // 소개 슬라이드는 저절로 넘어가고, 손으로 넘기면 멈춰요
  if(sl&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    let stop=false;const halt=()=>{stop=true};sl.addEventListener('pointerdown',halt);sl.addEventListener('touchstart',halt,{passive:true});
    const t=setInterval(()=>{if(stop||!document.body.contains(sl))return clearInterval(t);
      const n=sl.children.length,i=Math.round(sl.scrollLeft/sl.clientWidth);sl.scrollTo({left:((i+1)%n)*sl.clientWidth,behavior:'smooth'})},4500);
  }
};

// ---------- 가입 화면: 아이디·비밀번호까지 한 번에 ----------
const _joinA=joinScreen;
joinScreen=function(){
  _joinA();
  const btn=$('#joinBtn');if(!btn)return;
  const h=$('.joinform h2');if(h)h.innerHTML='반가워요!<br>회원가입을 해 주세요';
  const lead=$('.joinform .lead');if(lead)lead.textContent='초대코드, 닉네임, 아이디만 있으면 돼요. 이메일이나 전화번호는 받지 않아요.';
  const nick=$('#nick')&&$('#nick').closest('.field');
  if(nick)nick.insertAdjacentHTML('afterend',`
    <div class="field"><label for="jId">아이디</label><input class="in" id="jId" autocapitalize="none" autocomplete="username" spellcheck="false" maxlength="20" placeholder="로그인할 때 쓸 영문 소문자·숫자 4~20자"></div>
    <div class="field"><label for="jPw">비밀번호</label><input class="in" id="jPw" type="password" autocomplete="new-password" placeholder="6자 이상"></div>
    <div class="field"><input class="in" id="jPw2" type="password" autocomplete="new-password" placeholder="비밀번호 한 번 더"></div>`);
  btn.textContent='가입하기';
  btn.onclick=signUp;
  const a=document.createElement('button');a.className='loginlink';a.textContent='이미 가입했어요 · 아이디로 로그인';a.onclick=loginScreen;
  (btn.nextElementSibling&&btn.nextElementSibling.classList.contains('jointerms')?btn.nextElementSibling:btn).insertAdjacentElement('afterend',a);
  const n=$('.joinform .note');if(n)n.innerHTML='다른 폰이나 브라우저에서는 새로 가입하지 말고<br>아이디로 로그인해 주세요.';
};

async function signUp(){
  const code=$('#code').value.trim(),nick=$('#nick').value.trim(),area=$('#area').value.trim();
  const login=$('#jId').value.trim().toLowerCase(),pw=$('#jPw').value;
  if(!code)return toast('초대코드를 입력해 주세요');
  if(nick.length<2)return toast('닉네임은 2자 이상으로 정해 주세요');
  if(!/^[a-z0-9_]{4,20}$/.test(login))return toast('아이디는 영문 소문자·숫자·_ 4~20자로 만들어 주세요');
  if(pw.length<6)return toast('비밀번호는 6자 이상으로 만들어 주세요');
  if(pw!==$('#jPw2').value)return toast('비밀번호가 서로 달라요');
  const b=$('#joinBtn');b.disabled=true;b.textContent='가입하는 중…';
  const reset=()=>{b.disabled=false;b.textContent='가입하기'};
  let {data:{session}}=await sb.auth.getSession();
  if(!session){const r=await sb.auth.signInAnonymously();if(r.error){reset();return toast('접속하지 못했어요. 잠시 후 다시 시도해 주세요')}session=r.data.session}
  // 아이디 만들다 실패해서 다시 누른 경우엔 가입은 건너뛰어요
  const {data:prof}=await sb.from('profiles').select('id').eq('id',session.user.id).maybeSingle();
  if(!prof){
    const {error}=await sb.rpc('join_with_invite',{p_code:code,p_nickname:nick,p_area:area||null});
    if(error){reset();return toast(error.message.includes('invalid')?'초대코드가 맞지 않거나 사용 횟수가 끝났어요':'가입하지 못했어요: '+error.message)}
  }
  const {error:e1}=await sb.functions.invoke('account',{body:{action:'set_login',login,password:pw}});
  if(e1){reset();let m='아이디를 만들지 못했어요';try{m=(await e1.context.json()).error||m}catch(e){}return toast(m+(/이미/.test(m)?'. 다른 아이디로 해 주세요':''))}
  const {error:e2}=await sb.auth.signInWithPassword({email:loginEmail(login),password:pw});
  if(e2){toast('가입했어요. 아이디로 로그인해 주세요');return setTimeout(loginScreen,1200)}
  boot();
}

function loginScreen(){
  $('#root').innerHTML=`<div class="app joinform">
    <div class="topbar"><button class="icon-btn" id="lgBack" aria-label="처음 화면으로">${I.back}</button></div>
    <div class="brand" style="margin-top:8px"><div class="mk">${I.mark}</div></div>
    <h2 style="margin-top:20px">다시 만나서 반가워요</h2>
    <p class="lead">가입할 때 만든 아이디와 비밀번호를 입력해 주세요.</p>
    <div class="form">
      <div class="field"><label for="lgId">아이디</label><input class="in" id="lgId" autocapitalize="none" autocomplete="username" spellcheck="false" placeholder="영문·숫자 아이디"></div>
      <div class="field"><label for="lgPw">비밀번호</label><input class="in" id="lgPw" type="password" autocomplete="current-password" placeholder="비밀번호"></div>
    </div>
    <div class="spacer"></div>
    <button class="btn block" id="lgBtn" style="margin-top:24px">로그인</button>
    <p class="note">비밀번호를 잊었다면 운영자에게 아이디를 알려 주세요.<br>임시 비밀번호를 만들어 드려요.</p>
  </div>`;
  $('#lgBack').onclick=()=>onboarding();
  const go=async()=>{
    const id=$('#lgId').value.trim().toLowerCase(),pw=$('#lgPw').value;
    if(!id||!pw)return toast('아이디와 비밀번호를 입력해 주세요');
    const b=$('#lgBtn');b.disabled=true;b.textContent='확인하는 중…';
    const {error}=await sb.auth.signInWithPassword({email:loginEmail(id),password:pw});
    b.disabled=false;b.textContent='로그인';
    if(error)return toast(/invalid/i.test(error.message)?'아이디나 비밀번호가 맞지 않아요':'로그인하지 못했어요. 잠시 후 다시 해 주세요');
    const {data:{session}}=await sb.auth.getSession();
    const {data}=await sb.from('profiles').select('id').eq('id',session.user.id).maybeSingle();
    if(!data){await sb.auth.signOut();return toast('탈퇴했거나 없는 계정이에요')}
    location.replace(SITE);
  };
  $('#lgBtn').onclick=go;
  $('#lgPw').onkeydown=e=>{if(e.key==='Enter')go()};
}

// ---------- 내 정보: 계정 지키기 ----------
const _renderMeA=renderMe;
renderMe=async function(){
  await _renderMeA();
  const v=$('#view');if(!v)return;
  const id=await myLoginId();
  if(!id){
    const lc=v.querySelector('.lvcard');
    const card=document.createElement('button');card.className='keepcard';
    card.innerHTML='<div style="flex:1"><b>내 계정 지키기</b><small>폰을 바꾸거나 카톡·사파리를 오가도 내 글과 채팅이 그대로 있게 아이디를 만들어 두세요.</small></div><span class="go">만들기</span>';
    card.onclick=()=>loginSheet('');
    if(lc)lc.insertAdjacentElement('afterend',card);else v.prepend(card);
  }
  const foot=v.querySelector('.mefoot');
  if(foot&&id&&!foot.querySelector('#pwBtn')){
    foot.insertAdjacentHTML('afterbegin',`<button id="pwBtn">로그인 아이디 ${esc(id)} · 비밀번호 바꾸기</button>`);
    foot.querySelector('#pwBtn').onclick=()=>loginSheet(id);
    const q=foot.querySelector('#quitBtn');
    if(q){const o=document.createElement('button');o.className='quit';o.textContent='로그아웃';o.style.marginTop='0';
      o.onclick=async()=>{if(!confirm('로그아웃할까요? 다시 들어올 때 아이디와 비밀번호가 필요해요.'))return;await sb.auth.signOut();location.replace(SITE)};
      q.insertAdjacentElement('beforebegin',o)}
  }
};

function loginSheet(existing){
  openSheet(`<h3>${existing?'비밀번호 바꾸기':'내 계정 지키기'}</h3>
    <p class="m" style="margin:0 4px 12px;line-height:1.55">${existing?'새 비밀번호를 정해 주세요.':'아이디와 비밀번호를 만들면 다른 폰이나 브라우저에서도 로그인해서 지금 계정을 그대로 쓸 수 있어요. 이메일이나 전화번호는 받지 않아요.'}</p>
    <div class="field"><div class="lb">아이디</div><input class="in" id="kId" autocapitalize="none" autocomplete="username" spellcheck="false" maxlength="20" placeholder="영문 소문자·숫자 4~20자" value="${esc(existing)}" ${existing?'disabled':''}></div>
    <div class="field"><div class="lb">비밀번호</div><input class="in" id="kPw" type="password" autocomplete="new-password" placeholder="6자 이상"></div>
    <div class="field"><input class="in" id="kPw2" type="password" autocomplete="new-password" placeholder="비밀번호 한 번 더"></div>
    <p class="pwnote">${existing?'':'아이디는 한 번 정하면 바꿀 수 없어요. '}비밀번호를 잊으면 운영자가 임시 비밀번호를 만들어 드려요.</p>
    <button class="btn block" id="kSave" style="margin-top:14px">${existing?'바꾸기':'만들기'}</button>`);
  $('#kSave').onclick=async()=>{
    const login=$('#kId').value.trim().toLowerCase(),pw=$('#kPw').value;
    if(!/^[a-z0-9_]{4,20}$/.test(login))return toast('아이디는 영문 소문자·숫자·_ 4~20자로 만들어 주세요');
    if(pw.length<6)return toast('비밀번호는 6자 이상으로 만들어 주세요');
    if(pw!==$('#kPw2').value)return toast('비밀번호가 서로 달라요');
    const b=$('#kSave');b.disabled=true;
    const {data,error}=await sb.functions.invoke('account',{body:{action:'set_login',login,password:pw}});
    b.disabled=false;
    if(error){let m='저장하지 못했어요';try{m=(await error.context.json()).error||m}catch(e){}return toast(m)}
    const {error:e2}=await sb.auth.signInWithPassword({email:loginEmail(login),password:pw});
    if(e2){closeSheet();toast('아이디를 만들었어요. 다시 로그인해 주세요');return setTimeout(()=>location.replace(SITE),1200)}
    closeSheet();toast(existing?'비밀번호를 바꿨어요':`아이디 ${data.login}을(를) 만들었어요`);
    if(tab==='me')render();
  };
}

// ---------- 관리자: 비밀번호 초기화 ----------
const _openAdminA=openAdmin;
openAdmin=function(){
  _openAdminA();
  const wk=A&&(A.querySelector('#wk')||A.querySelector('#aTabs'));if(!wk)return;
  const b=document.createElement('button');b.className='btn ghost sm';b.style.cssText='margin:8px 16px 4px;width:calc(100% - 32px)';b.textContent='회원 비밀번호 초기화';
  b.onclick=async()=>{
    const login=(prompt('비밀번호를 잊은 회원의 아이디를 입력해 주세요')||'').trim().toLowerCase();if(!login)return;
    const {data,error}=await sb.functions.invoke('account',{body:{action:'reset_password',login}});
    if(error){let m='초기화하지 못했어요';try{m=(await error.context.json()).error||m}catch(e){}return toast(m)}
    openSheet(`<h3>${esc(login)} 임시 비밀번호</h3><div class="tempbox">${esc(data.temp)}</div><p class="m" style="margin:0 4px">회원에게 직접 알려 주고, 로그인한 뒤 내 정보에서 비밀번호를 바꾸라고 안내해 주세요. 이 화면을 닫으면 다시 볼 수 없어요.</p>`);
  };
  wk.insertAdjacentElement(wk.id==='wk'?'afterend':'beforebegin',b);
};
