// 한인동네 앱 안 1:1 채팅

I.msg='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 5h16v11h-9l-5 4v-4H4z"/></svg>';
I.send='<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5 21 12 3 3.5l2.5 7L15 12l-9.5 1.5z"/></svg>';

(function(){const s=document.createElement('style');s.textContent=`
.tabbar .tbadge{position:absolute;top:6px;left:calc(50% + 6px);min-width:17px;height:17px;border-radius:9px;background:var(--coral);color:#fff;font-size:10.5px;font-weight:800;display:grid;place-items:center;padding:0 4px}
.tabbar button{position:relative}
.crow{display:flex;gap:12px;align-items:center;padding:14px 0;border-bottom:1px solid var(--line);width:100%;text-align:left}
.crow .av{width:46px;height:46px}
.crow .mid{flex:1;min-width:0}
.crow .nm{font-weight:700;font-size:15px;display:flex;align-items:center;gap:4px}
.crow .nm small{font-weight:400;color:var(--faint);font-size:12.5px;margin-left:2px}
.crow .lm{font-size:14px;color:var(--sub);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}
.crow.unread .lm{color:var(--ink);font-weight:600}
.crow .pt{flex:none;width:46px;height:46px;border-radius:8px;overflow:hidden;background:var(--surface);display:grid;place-items:center;color:var(--faint)}
.crow .pt img{width:100%;height:100%;object-fit:cover}
.crow .ud{width:8px;height:8px;border-radius:4px;background:var(--coral);flex:none}
.room{display:flex;flex-direction:column;height:100%;position:relative}
.room .topbar h2{display:flex;flex-direction:column;align-items:center;line-height:1.2}
.room .topbar h2 small{font-size:12px;font-weight:500;color:var(--faint)}
.rpost{display:flex;gap:10px;align-items:center;padding:10px 16px;border-bottom:1px solid var(--line);background:var(--bg);width:100%;text-align:left}
.rpost .pt{flex:none;width:44px;height:44px;border-radius:8px;overflow:hidden;background:var(--surface);display:grid;place-items:center;color:var(--faint)}
.rpost .pt img{width:100%;height:100%;object-fit:cover}
.rpost .tt{font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rpost .pp{font-size:14px;font-weight:800}
.msgs{flex:1;overflow-y:auto;padding:14px 14px 8px;background:var(--surface);display:flex;flex-direction:column;gap:6px}
.day{align-self:center;font-size:12px;color:var(--faint);margin:10px 0 4px}
.bub{max-width:76%;display:flex;gap:6px;align-items:flex-end}
.bub .tx{padding:10px 13px;border-radius:18px;font-size:15px;line-height:1.45;white-space:pre-wrap;word-break:keep-all;overflow-wrap:anywhere}
.bub .tm{font-size:11px;color:var(--faint);flex:none;margin-bottom:2px}
.bub.them{align-self:flex-start}.bub.them .tx{background:var(--bg);border-top-left-radius:6px}
.bub.mine{align-self:flex-end;flex-direction:row-reverse}.bub.mine .tx{background:var(--jade);color:#fff;border-top-right-radius:6px}
.sysmsg{align-self:center;font-size:12.5px;color:var(--sub);background:var(--bg);border-radius:12px;padding:8px 12px;text-align:center;max-width:90%;line-height:1.5}
.quick{display:flex;gap:6px;overflow-x:auto;padding:8px 12px 0;background:var(--bg);scrollbar-width:none}
.quick::-webkit-scrollbar{display:none}
.quick button{flex:none;height:32px;padding:0 12px;border-radius:16px;border:1px solid var(--line);font-size:13px;color:var(--sub)}
.composer{display:flex;gap:8px;align-items:flex-end;padding:8px 12px calc(8px + var(--safe-b));background:var(--bg);border-top:1px solid var(--line)}
.composer textarea{flex:1;resize:none;max-height:110px;min-height:42px;border:0;border-radius:21px;background:var(--surface);padding:10px 16px;line-height:1.45;font-size:16px}
.composer textarea:focus{outline:0}
.composer .go{flex:none;width:42px;height:42px;border-radius:50%;background:var(--jade);color:#fff;display:grid;place-items:center}
.composer .go:disabled{opacity:.4}
.rmenu{position:absolute;right:8px;top:calc(52px + env(safe-area-inset-top,0px));background:var(--bg);border:1px solid var(--line);border-radius:14px;box-shadow:var(--shadow);overflow:hidden;z-index:6;min-width:170px}
.rmenu button{display:block;width:100%;text-align:left;padding:13px 16px;font-size:15px;border-bottom:1px solid var(--line)}
.rmenu button:last-child{border-bottom:0}
`;document.head.appendChild(s)})();

let chats=[],chatUnread=0,room=null,rtChan=null;

// ---------- 탭바에 채팅 추가 ----------
const _shellC=shell;
shell=function(){
  _shellC();
  const tb=$('#tabbar');const meBtn=tb.querySelector('[data-t="me"]');
  const b=document.createElement('button');b.dataset.t='chat';b.innerHTML=`${I.msg}채팅<span class="tbadge" id="chatBadge" hidden></span>`;
  tb.insertBefore(b,meBtn);
  refreshChatBadge();setInterval(refreshChatBadge,60000);startRealtime();
};
const _renderC=render;
render=function(){
  if(tab!=='chat')return _renderC();
  $$('#tabbar button').forEach(b=>b.classList.toggle('on',b.dataset.t===tab));
  $('#fab').style.display='none';
  $('#view').innerHTML='<div class="list" id="chatList"><p class="m" style="padding:20px 0">불러오는 중…</p></div>';
  loadChats();
};
async function refreshChatBadge(){
  const {data}=await sb.rpc('my_unread_chats');chatUnread=data||0;
  const b=$('#chatBadge');if(b){b.hidden=!chatUnread;b.textContent=chatUnread>9?'9+':chatUnread}
}

// ---------- 실시간 ----------
function startRealtime(){
  if(rtChan)return;
  rtChan=sb.channel('my-messages').on('postgres_changes',{event:'INSERT',schema:'public',table:'messages'},payload=>{
    const m=payload.new;
    if(room&&room.id===m.conversation_id){appendMsg(m,true);if(m.sender_id!==me.id)sb.rpc('mark_chat_read',{p_conv:room.id})}
    else if(m.sender_id!==me.id){refreshChatBadge();if(tab==='chat'&&!stack.length)loadChats();toast('새 메시지가 왔어요')}
  }).subscribe();
}

// ---------- 채팅 목록 ----------
async function loadChats(){
  const {data,error}=await sb.from('conversations').select('*, post:posts(id,title,images,image_url,price,category,status), buyer:profiles!conversations_buyer_id_fkey(id,nickname), seller:profiles!conversations_seller_id_fkey(id,nickname)')
    .not('last_message_at','is',null).order('last_message_at',{ascending:false}).limit(100);
  const box=$('#chatList');if(!box)return;
  if(error){box.innerHTML=`<p class="m">채팅을 불러오지 못했어요</p>`;return}
  chats=data||[];
  if(!chats.length){box.innerHTML='<div class="empty"><b>아직 대화가 없어요</b>마음에 드는 글에서 "채팅하기"를 눌러 이웃과 이야기해 보세요.</div>';return}
  box.innerHTML=chats.map(c=>{const other=c.buyer_id===me.id?c.seller:c.buyer;const im=c.post?imgs(c.post):[];
    const unread=c.last_sender!==me.id&&new Date(c.last_message_at)>new Date(c.buyer_id===me.id?c.buyer_read_at:c.seller_read_at);
    return `<button class="crow ${unread?'unread':''}" data-id="${c.id}">${avatar(other?.nickname,other?.id)}
      <div class="mid"><div class="nm">${esc(other?.nickname||'알 수 없음')}${lvBadge(other?.id)}<small>${ago(c.last_message_at)}</small></div><div class="lm">${esc(c.last_message||'')}</div></div>
      ${unread?'<span class="ud"></span>':''}<div class="pt">${im.length?`<img src="${esc(im[0])}" alt="">`:I[CATS[c.post?.category]?.i||'bag']}</div></button>`}).join('');
  box.querySelectorAll('.crow').forEach(r=>r.onclick=()=>openRoom(chats.find(c=>c.id===r.dataset.id)));
}

// ---------- 채팅 시작 ----------
async function startChat(p){
  const {data:id,error}=await sb.rpc('start_chat',{p_post:p.id});
  if(error)return toast(error.message.includes('blocked')?'차단 관계라 채팅할 수 없어요':error.message.includes('own_post')?'내 글에는 채팅할 수 없어요':'채팅을 시작하지 못했어요');
  const {data}=await sb.from('conversations').select('*, post:posts(id,title,images,image_url,price,category,status), buyer:profiles!conversations_buyer_id_fkey(id,nickname), seller:profiles!conversations_seller_id_fkey(id,nickname)').eq('id',id).single();
  openRoom(data);
}

// ---------- 채팅방 ----------
const QUICK={buyer:['아직 거래 가능한가요?','가격 조금 조정 가능할까요?','오늘 저녁에 가능해요','어디서 만날까요?'],seller:['네, 아직 있어요!','예약 걸어둘게요','H마트 주차장에서 만나요','몇 시가 편하세요?']};
async function openRoom(c){
  if(!c)return;
  const iAmBuyer=c.buyer_id===me.id;const other=iAmBuyer?c.seller:c.buyer;const p=c.post||{};const im=imgs(p);
  const priceTxt=p.category==='sale'?(p.price!=null?money(p.price):'가격 문의'):p.category==='free'?'무료 나눔':CATS[p.category]?.n||'';
  const el=openPage(`<div class="room">
    <div class="topbar"><button class="icon-btn" data-back aria-label="뒤로">${I.back}</button><h2>${esc(other?.nickname||'')}<small>${lvBadge(other?.id).replace(/<[^>]+>/g,'').trim()||'이웃'}</small></h2><button class="icon-btn" id="rMore" aria-label="더보기">⋯</button></div>
    <button class="rpost" id="rPost"><div class="pt">${im.length?`<img src="${esc(im[0])}" alt="">`:I[CATS[p.category]?.i||'bag']}</div><div style="min-width:0;flex:1"><div class="tt">${statusTag(p)} ${esc(p.title||'삭제된 글')}</div><div class="pp">${priceTxt}</div></div></button>
    <div class="msgs" id="msgs"><div class="sysmsg">거래는 밝은 공개 장소에서 만나서 하세요. 먼저 돈을 보내달라는 요청은 사기일 수 있어요.</div></div>
    <div class="quick" id="quick">${QUICK[iAmBuyer?'buyer':'seller'].map(q=>`<button>${q}</button>`).join('')}</div>
    <div class="composer"><textarea id="mIn" rows="1" maxlength="1000" placeholder="메시지 보내기"></textarea><button class="go" id="mGo" aria-label="보내기">${I.send}</button></div>
  </div>`,()=>{room=null;refreshChatBadge();if(tab==='chat')loadChats()});
  el.style.overflow='hidden';
  room={id:c.id,el,last:null,seen:new Set()};
  el.querySelector('[data-back]').onclick=back;
  el.querySelector('#rPost').onclick=async()=>{if(!p.id)return;if(!posts.find(x=>x.id===p.id)){const {data}=await sb.from('posts').select('*, profiles!posts_user_id_fkey(nickname,role)').eq('id',p.id).maybeSingle();if(!data)return toast('삭제됐거나 볼 수 없는 글이에요');posts.push(data)}detail(p.id)};
  const inp=el.querySelector('#mIn'),go=el.querySelector('#mGo');
  inp.oninput=()=>{inp.style.height='auto';inp.style.height=Math.min(110,inp.scrollHeight)+'px'};
  inp.onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing&&window.matchMedia('(pointer:fine)').matches){e.preventDefault();send()}};
  const send=async(text)=>{const body=(text||inp.value).trim();if(!body)return;go.disabled=true;
    const {data,error}=await sb.from('messages').insert({conversation_id:c.id,body}).select('*').single();go.disabled=false;
    if(error)return toast(error.message.includes('rate_limit')?'메시지를 너무 빨리 보내고 있어요. 잠시 후 보내주세요':error.message.includes('row-level')?'차단 관계라 메시지를 보낼 수 없어요':'메시지를 보내지 못했어요');
    if(!text){inp.value='';inp.oninput()}appendMsg(data,true)};
  go.onclick=()=>send();
  el.querySelector('#quick').onclick=e=>{const b=e.target.closest('button');if(b)send(b.textContent)};
  el.querySelector('#rMore').onclick=()=>roomMenu(c,other,p,el);
  const {data}=await sb.from('messages').select('*').eq('conversation_id',c.id).order('created_at').limit(300);
  (data||[]).forEach(m=>appendMsg(m,false));scrollBottom();
  sb.rpc('mark_chat_read',{p_conv:c.id}).then(refreshChatBadge);
}
function scrollBottom(){if(!room)return;const b=room.el.querySelector('#msgs');b.scrollTop=b.scrollHeight}
function appendMsg(m,scroll){
  if(!room||room.seen.has(m.id))return;room.seen.add(m.id);
  const box=room.el.querySelector('#msgs');const d=new Date(m.created_at);const dk=d.toDateString();
  if(room.last!==dk){room.last=dk;box.insertAdjacentHTML('beforeend',`<div class="day">${d.toLocaleDateString('ko-KR',{month:'long',day:'numeric',weekday:'short'})}</div>`)}
  const mine=m.sender_id===me.id;
  box.insertAdjacentHTML('beforeend',`<div class="bub ${mine?'mine':'them'}"><div class="tx">${esc(m.body)}</div><div class="tm">${d.toLocaleTimeString('ko-KR',{hour:'numeric',minute:'2-digit'})}</div></div>`);
  if(scroll)scrollBottom();
}
function roomMenu(c,other,p,el){
  const old=el.querySelector('.rmenu');if(old){old.remove();return}
  const m=document.createElement('div');m.className='rmenu';
  m.innerHTML=`<button data-k="review">거래 후기 남기기</button><button data-k="meet">안전 만남 체크인</button><button data-k="report">신고하기</button><button data-k="block" style="color:var(--coral)">${esc(other?.nickname||'')}님 차단</button>`;
  el.querySelector('.room').appendChild(m);
  m.onclick=async e=>{const b=e.target.closest('[data-k]');if(!b)return;m.remove();const k=b.dataset.k;
    if(k==='review')return reviewSheet({...p,user_id:other.id,profiles:{nickname:other.nickname}});
    if(k==='meet')return meetSheet({...p,user_id:other.id,profiles:{nickname:other.nickname},safe_zone_id:(posts.find(x=>x.id===p.id)||{}).safe_zone_id});
    if(k==='report'){const r=prompt('신고 사유를 적어주세요 (예: 선입금 요구, 욕설)');if(!r)return;const {error}=await sb.from('reports').insert({post_id:p.id,reason:'[채팅] '+r});return toast(error?'신고하지 못했어요':'신고를 접수했어요')}
    if(k==='block'){if(!confirm(`${other.nickname}님을 차단할까요? 서로 메시지를 보낼 수 없고 글도 보이지 않아요.`))return;
      const {error}=await sb.from('blocks').insert({blocked_id:other.id});if(error)return toast('차단하지 못했어요');toast('차단했어요');back();load()}
  };
}

// ---------- 글 화면: 채팅하기 버튼 ----------
const _detailC=detail;
detail=function(id){
  const r=_detailC(id);const p=posts.find(x=>x.id===id);const el=stack.length?stack[stack.length-1].el:null;
  if(p&&el&&p.user_id!==me.id&&p.category!=='info'){
    const bar=el.querySelector('.bottombar');
    if(bar){const old=bar.querySelector('a.btn,#askBtn');
      const btn=document.createElement('button');btn.className='btn';btn.innerHTML=`${I.msg.replace('width="24" height="24"','width="18" height="18"')}채팅하기`;
      btn.onclick=()=>startChat(p);
      if(old){if(old.tagName==='A'){old.className='btn ghost sm';old.textContent=p.contact_type==='kakao'?'오픈채팅':'문자';bar.insertBefore(btn,old.nextSibling)}else old.replaceWith(btn)}else bar.appendChild(btn)}
  }
  return r;
};

// ---------- 후기: 실제로 채팅한 상대에게 ----------
function reviewSheet(p){
  (async()=>{
    const {data}=await sb.from('reviews').select('rating,comment,created_at').eq('target_id',p.user_id).order('created_at',{ascending:false});
    let n=5;
    openSheet(`<h3>${esc(p.profiles?.nickname||'')}님 거래 후기</h3>
      ${(data||[]).slice(0,4).map(r=>`<div class="cmt" style="padding:8px 4px"><div style="color:var(--amber);font-weight:700;flex:none">${'★'.repeat(r.rating)}</div><div class="tx" style="margin:0">${esc(r.comment||'')}<span class="m" style="display:block">${ago(r.created_at)}</span></div></div>`).join('')||'<p class="m" style="margin:0 4px 8px">아직 받은 후기가 없어요.</p>'}
      <div class="field"><div class="lb">별점 남기기</div><div class="pick" id="stars">${[1,2,3,4,5].map(k=>`<button data-v="${k}" class="${k===5?'on':''}">★ ${k}</button>`).join('')}</div></div>
      <div class="field"><input class="in" id="rc" placeholder="한 줄 후기 (예: 시간 약속을 잘 지키셨어요)"></div>
      <p class="m" style="margin:8px 4px 0">이 글로 채팅한 상대에게만, 예약중이거나 완료된 거래에 남길 수 있어요.</p>
      <button class="btn block" id="rsave" style="margin-top:14px">후기 남기기</button>`);
    $('#stars').onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;n=+b.dataset.v;$$('#stars button').forEach(x=>x.classList.toggle('on',x===b))};
    $('#rsave').onclick=async()=>{const {error}=await sb.from('reviews').insert({post_id:p.id,target_id:p.user_id,rating:n,comment:$('#rc').value.trim()||null});
      if(error)return toast(error.message.includes('duplicate')?'이 거래에는 이미 후기를 남겼어요':'이 글로 채팅한 상대에게, 예약중·완료된 거래에만 남길 수 있어요');
      closeSheet();loadLevels();toast('후기를 남겼어요')};
  })();
}
