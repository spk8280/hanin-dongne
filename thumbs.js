// 한인동네: 목록용 작은 사진(썸네일)
// 사진을 올릴 때 400px 썸네일을 같이 올리고(파일명_t.jpg), 목록에서는 썸네일을 보여줘요.
// 썸네일이 없는 예전 사진은 자동으로 원본을 보여줘요.

const THUMB_PX=400;
function thumbUrl(u){
  if(!u||u.indexOf('/post-images/')<0)return u;
  return u.replace(/(\.jpe?g)(\?.*)?$/i,'_t$1$2');
}

// 썸네일을 못 불러오면 원본으로 바꿔요
document.addEventListener('error',e=>{
  const t=e.target;
  if(t&&t.tagName==='IMG'&&t.dataset.full&&t.getAttribute('src')!==t.dataset.full){t.src=t.dataset.full}
},true);

// post-images에 사진을 올릴 때마다 썸네일도 같이 올려요
(function(){
  const _from=sb.storage.from.bind(sb.storage);
  sb.storage.from=function(bucket){
    const b=_from(bucket);if(bucket!=='post-images'||!b||typeof b.upload!=='function')return b;
    const _up=b.upload.bind(b);
    b.upload=async function(path,blob,opt){
      const r=await _up(path,blob,opt);
      if(!r.error&&/\.jpe?g$/i.test(path)&&!/_t\.jpe?g$/i.test(path)){
        try{const t=await shrink(blob,THUMB_PX,0.72);await _up(path.replace(/(\.jpe?g)$/i,'_t$1'),t,{contentType:'image/jpeg'})}catch(e){}
      }
      return r;
    };
    return b;
  };
})();
