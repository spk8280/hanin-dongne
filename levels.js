// 한인동네 회원 등급

const LV={
  1:{n:'새싹이웃',e:'🌱',c:'gray'},
  2:{n:'이웃',e:'🏡',c:'jade'},
  3:{n:'단골이웃',e:'🤝',c:'indigo'},
  4:{n:'믿음이웃',e:'⭐',c:'amber'},
  5:{n:'동네지기',e:'👑',c:'coral'}
};
const LV_NEED={
  2:{done:1,rev:0,avg:0,days:0,txt:'거래·나눔·품앗이 완료 1회 또는 후기 1개'},
  3:{done:5,rev:3,avg:4.0,days:0,txt:'완료 5회 · 후기 3개 · 평점 4.0 이상'},
  4:{done:15,rev:10,avg:4.5,days:30,txt:'완료 15회 · 후기 10개 · 평점 4.5 이상 · 가입 30일'},
  5:{done:30,rev:20,avg:4.7,days:90,txt:'완료 30회 · 후기 20개 · 평점 4.7 이상 · 가입 90일'}
};
let levels={};

(function(){const s=document.createElement('style');s.textContent=`
.tag.lv{margin-left:5px;height:19px;font-size:11px;padding:0 6px}
.lvcard{display:block;width:calc(100% - 32px);margin:12px 16px 0;padding:16px 18px;border-radius:16px;border:1px solid var(--line);background:var(--bg);text-align:left}
.lvcard .top{display:flex;align-items:center;justify-content:space-between}
.lvcard .nm{font-size:17px;font-weight:800}
.lvcard .nm span{font-size:22px;margin-right:6px}
.lvcard .more{font-size:13px;color:var(--sub)}
.lvcard .bar{height:8px;border-radius:4px;background:var(--surface);margin:12px 0 8px;overflow:hidden}
.lvcard .bar i{display:block;height:100%;background:var(--jade);border-radius:4px}
.lvcard .need{font-size:13px;color:var(--sub);line-height:1.5}
.lvrow{display:flex;gap:12px;align-items:center;padding:12px 4px;border-bottom:1px solid var(--line)}
.lvrow .em{font-size:26px;width:36px;text-align:center}
.lvrow b{display:block;font-size:15px}
.lvrow small{font-size:13px;color:var(--sub)}
.lvrow.on{background:var(--jade-soft);border-radius:12px;border-bottom:0}
`;document.head.appendChild(s)})();

async function loadLevels(){
  const {data}=await sb.from('member_levels').select('*');
  levels={};(data||[]).forEach(r=>levels[r.user_id]=r);
}

function lvBadge(uid){
  const l=levels[uid];if(!l)return '';
  const v=LV[l.level]||LV[1];
  return `<span class="tag ${v.c} lv">${v.e} ${v.n}</span>`;
}

function lvCard(){
  const l=levels[me.id]||{level:1,done_n:0,review_n:0,avg_rating:0,days:0};
  const v=LV[l.level];const next=LV_NEED[l.level+1];
  let pct=100,need='가장 높은 등급이에요. 동네를 지켜주셔서 고마워요!';
  if(next){
    const parts=[];
    const prog=[];
    if(next.done){prog.push(Math.min(1,l.done_n/next.done));if(l.done_n<next.done)parts.push(`완료 ${next.done-l.done_n}회`)}
    if(next.rev){prog.push(Math.min(1,l.review_n/next.rev));if(l.review_n<next.rev)parts.push(`후기 ${next.rev-l.review_n}개`)}
    if(next.avg&&Number(l.avg_rating)<next.avg)parts.push(`평점 ${next.avg} 이상`);
    if(next.days){prog.push(Math.min(1,l.days/next.days));if(l.days<next.days)parts.push(`가입 ${next.days-l.days}일`)}
    if(l.level===1){pct=0;need='거래·나눔·품앗이를 1번 완료하거나 후기를 1개 받으면 이웃이 돼요.'}
    else{pct=Math.round(prog.reduce((a,b)=>a+b,0)/prog.length*100);need=`${LV[l.level+1].e} ${LV[l.level+1].n}까지 ${parts.join(', ')||'조금만 더'} 남았어요.`}
  }
  return `<button class="lvcard" onclick="levelSheet()">
    <div class="top"><div class="nm"><span>${v.e}</span>${v.n}</div><div class="more">등급 안내 ›</div></div>
    <div class="m" style="margin-top:4px">완료 ${l.done_n}회 · 후기 ${l.review_n}개${l.review_n?` · 평점 ${Number(l.avg_rating).toFixed(1)}`:''}</div>
    <div class="bar"><i style="width:${pct}%"></i></div>
    <div class="need">${need}</div></button>`;
}

function levelSheet(){
  const mine=(levels[me.id]||{level:1}).level;
  openSheet(`<h3>동네 등급 안내</h3>
    <p class="m" style="margin:0 4px 10px">거래를 완료하고 좋은 후기를 받을수록 등급이 올라가요. 등급은 닉네임 옆에 표시돼서 이웃들이 믿고 거래할 수 있어요.</p>
    ${[1,2,3,4,5].map(k=>`<div class="lvrow ${k===mine?'on':''}"><div class="em">${LV[k].e}</div><div><b>${LV[k].n}${k===mine?' · 지금 내 등급':''}</b><small>${k===1?'처음 가입하면 시작하는 등급':LV_NEED[k].txt}</small></div></div>`).join('')}
    <p class="m" style="margin:12px 4px 0;line-height:1.6">· 완료는 내 글을 '거래완료', '나눔완료', '완료'로 바꾸면 쌓여요.<br>· 후기는 예약중이거나 완료된 글에만, 한 글에 한 번 남길 수 있어요.<br>· 단골이웃 이상은 광고 자동 검토 기준이 완화돼요.</p>`);
}
