// 한인동네: 위치로 동네 인증 (선택)
// 위치는 폰 안에서만 쓰고, 서버에는 동네 이름만 보내요.

const TOWNS=[
  ['둘루스',34.0029,-84.1446],['스와니',34.0515,-84.0713],['존스크릭',34.0289,-84.1986],['로렌스빌',33.9562,-83.9880],
  ['뷰포드',34.1207,-84.0044],['슈가힐',34.1065,-84.0335],['알파레타',34.0754,-84.2941],['노크로스',33.9412,-84.2135],
  ['피치트리코너스',33.9701,-84.2216],['도라빌',33.8981,-84.2833],['챔블리',33.8921,-84.2988],['커밍',34.2073,-84.1402],
  ['스넬빌',33.8573,-84.0199],['다큘라',33.9887,-83.8980],['애틀랜타',33.7756,-84.3963],['디케이터',33.7748,-84.2963],
  ['마리에타',33.9526,-84.5499],['로즈웰',34.0232,-84.3616]
];
const TOWN_DAYS=30;
let verified={};

(function(){const s=document.createElement('style');s.textContent=`
.tag.town{margin-left:5px;height:19px;font-size:11px;padding:0 6px;background:var(--jade-soft);color:var(--jade)}
.towncard{display:flex;gap:12px;align-items:center;width:calc(100% - 32px);margin:12px 16px 0;padding:14px 16px;border-radius:16px;border:1px solid var(--line);background:var(--bg);text-align:left}
.towncard .pin{flex:none;width:40px;height:40px;border-radius:12px;background:var(--jade-soft);color:var(--jade);display:grid;place-items:center;font-size:20px}
.towncard b{display:block;font-size:15px}
.towncard small{display:block;font-size:13px;color:var(--sub);margin-top:2px;line-height:1.45}
.towncard .go{flex:none;font-size:13.5px;font-weight:700;color:var(--jade)}
`;document.head.appendChild(s)})();

function townValid(v){return v&&v.verified_area&&v.verified_at&&(Date.now()-new Date(v.verified_at))<TOWN_DAYS*864e5}
async function loadVerified(){
  const {data}=await sb.from('profiles').select('id,verified_area,verified_at').not('verified_area','is',null);
  verified={};(data||[]).forEach(r=>verified[r.id]=r);
}
function townBadge(uid){const v=verified[uid];return townValid(v)?` <span class="tag town">📍 ${esc(v.verified_area)}</span>`:''}

// 등급 표시 옆에 동네 인증 표시를 붙여요 (목록·글·댓글·채팅 모두)
const _lvBadgeT=lvBadge;
lvBadge=function(uid){return _lvBadgeT(uid)+townBadge(uid)};

const _loadT=load;
load=async function(){await loadVerified();return _loadT()};

function km(a1,o1,a2,o2){const r=x=>x*Math.PI/180,dA=r(a2-a1),dO=r(o2-o1);
  const h=Math.sin(dA/2)**2+Math.cos(r(a1))*Math.cos(r(a2))*Math.sin(dO/2)**2;return 12742*Math.asin(Math.sqrt(h))}
function nearestTown(lat,lng){let best=null;for(const t of TOWNS){const d=km(lat,lng,t[1],t[2]);if(!best||d<best.d)best={name:t[0],d}}return best}

async function verifyTown(){
  if(/KAKAOTALK/i.test(navigator.userAgent))return toast('카톡 안에서는 위치 확인이 안 될 수 있어요. 오른쪽 아래 메뉴에서 "다른 브라우저로 열기"를 눌러 주세요');
  if(!navigator.geolocation)return toast('이 브라우저는 위치 확인을 지원하지 않아요');
  toast('위치를 확인하는 중이에요…');
  navigator.geolocation.getCurrentPosition(async pos=>{
    const n=nearestTown(pos.coords.latitude,pos.coords.longitude);
    if(!n||n.d>30)return toast('애틀랜타 한인 동네 밖이라 인증할 수 없어요');
    if(!confirm(`지금 위치는 ${n.name} 근처예요. ${n.name}(으)로 인증할까요?`))return;
    const {error}=await sb.rpc('verify_area',{p_area:n.name});
    if(error)return toast('인증하지 못했어요. 잠시 후 다시 해 주세요');
    me.area=n.name;await loadVerified();toast(`📍 ${n.name} 인증을 마쳤어요`);if(tab==='me')render();
  },err=>{
    toast(err.code===1?'위치 권한이 꺼져 있어요. 설정에서 이 브라우저의 위치 접근을 허용해 주세요':'위치를 찾지 못했어요. 밖이나 창가에서 다시 해 주세요');
  },{enableHighAccuracy:false,timeout:15000,maximumAge:600000});
}

// ---------- 내 정보: 동네 인증 카드 ----------
const _renderMeT=renderMe;
renderMe=async function(){
  await _renderMeT();
  const v=$('#view');if(!v||v.querySelector('.towncard'))return;
  const mine=verified[me.id];const ok=townValid(mine);
  const until=ok?new Date(new Date(mine.verified_at).getTime()+TOWN_DAYS*864e5):null;
  const card=document.createElement('button');card.className='towncard';
  card.innerHTML=ok
    ?`<span class="pin">📍</span><div style="flex:1"><b>${esc(mine.verified_area)} 인증 완료</b><small>${until.toLocaleDateString('ko-KR',{month:'long',day:'numeric'})}까지 닉네임 옆에 동네가 표시돼요.</small></div><span class="go">다시 인증</span>`
    :`<span class="pin">📍</span><div style="flex:1"><b>동네 인증하기</b><small>지금 위치로 사는 동네를 확인하면 닉네임 옆에 표시돼서 이웃들이 더 믿고 거래해요. 정확한 위치는 저장하지 않아요.</small></div><span class="go">인증</span>`;
  card.onclick=verifyTown;
  const after=v.querySelector('.keepcard')||v.querySelector('.lvcard');
  if(after)after.insertAdjacentElement('afterend',card);else v.prepend(card);
};
