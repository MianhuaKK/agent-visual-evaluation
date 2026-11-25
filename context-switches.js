
/* Context category controls retain the full timeline as the default view. */
function addContextSwitches(){
 const root=document.querySelector('#detail');
 if(root.querySelector('.context-switches'))return;
 const events=[...root.querySelectorAll('.event')];if(!events.length)return;
 const classify=event=>{const h=event.querySelector('h3')?.textContent||'';
 if(/用户原始需求|本次用户要求/.test(h))return 'request';
 if(/记忆/.test(h))return 'memory';
 if(/生效指令/.test(h))return 'instructions';
 if(/环境与边界/.test(h))return 'environment';
 if(/工具调用/.test(h))return 'tools';
 if(/返回|影响|判分/.test(h))return 'result';
 return 'other';};
 events.forEach(e=>e.dataset.contextCategory=classify(e));
 const labels=[['all','全部上下文'],['request','原始需求'],['instructions','生效指令'],['memory','记忆'],['environment','环境与边界'],['tools','工具调用'],['result','执行结果'],['other','其他记录']];
 const available=labels.filter(([key])=>key==='all'||events.some(e=>e.dataset.contextCategory===key));
 const nav=document.createElement('div');nav.className='context-switches';nav.setAttribute('role','group');nav.setAttribute('aria-label','上下文分类');
 nav.innerHTML=available.map(([key,label])=>'<button type="button" class="context-chip'+(key==='all'?' selected':'')+'" aria-pressed="'+(key==='all')+'" data-context-filter="'+key+'">'+label+'</button>').join('');
 const hint=document.createElement('p');hint.className='context-view-hint';hint.setAttribute('aria-live','polite');hint.textContent='完整时间线 · '+events.length+' 条记录';
 events[0].before(nav,hint);
 let snapshot=null;
 nav.addEventListener('click',event=>{
 const button=event.target.closest('[data-context-filter]');if(!button)return;
 const key=button.dataset.contextFilter;
 if(key!=='all'&&!snapshot)snapshot=events.map(e=>[...e.querySelectorAll('details')].map(d=>d.open));
 events.forEach((e,i)=>{const show=key==='all'||e.dataset.contextCategory===key;e.classList.toggle('hidden',!show);
 e.querySelectorAll('details').forEach((d,j)=>{if(key!=='all'&&show)d.open=true;else if(key==='all'&&snapshot)d.open=snapshot[i][j]});});
 if(key==='all')snapshot=null;
 nav.querySelectorAll('button').forEach(b=>{const active=b===button;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active))});
 const count=events.filter(e=>key==='all'||e.dataset.contextCategory===key).length;
 hint.textContent=(key==='all'?'完整时间线':button.textContent+' · 聚焦视图')+' · '+count+' 条记录';
 });
}
const detailBeforeContextSwitch=detail;
detail=function(tab){detailBeforeContextSwitch(tab);if(tab==='context')addContextSwitches()};
const memoryBeforeContextSwitch=memoryDetail;
memoryDetail=function(id){memoryBeforeContextSwitch(id);addContextSwitches()};

