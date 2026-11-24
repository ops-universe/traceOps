export const VERSION=1;
const id=(v,n)=>typeof v==='string'&&v.length===n&&/^[a-f0-9]+$/.test(v)&&!/^[0]+$/.test(v);
export function validateTrace(t){
 if(!t||t.version!==VERSION||!id(t.traceId,32)||!Array.isArray(t.spans)||t.spans.length<1||t.spans.length>10000)throw new TypeError('invalid trace');
 const map=new Map();
 for(const s of t.spans){
 if(!s||!id(s.spanId,16)||map.has(s.spanId)||s.traceId!==t.traceId||typeof s.name!=='string'||!s.name.length||s.name.length>256||!Number.isSafeInteger(s.startMs)||s.startMs<0||!Number.isSafeInteger(s.endMs)||s.endMs<s.startMs||!['ok','error','unset'].includes(s.status))throw new TypeError('invalid span');
 if(s.parentSpanId!==null&&!id(s.parentSpanId,16))throw new TypeError('invalid parent');
 if(s.durationMs!==undefined&&s.durationMs!==s.endMs-s.startMs)throw new TypeError('invalid duration');
 if(s.kind!==undefined&&!['operation','model','tool','retrieval'].includes(s.kind))throw new TypeError('invalid kind');
 if(s.errorCode!==undefined&&(!['error','timeout','cancelled'].includes(s.errorCode)||s.status!=='error'))throw new TypeError('invalid error classification');
 if(s.metadata!==undefined){if(!s.metadata||Object.getPrototypeOf(s.metadata)!==Object.prototype)throw new TypeError('invalid metadata');for(const [k,v] of Object.entries(s.metadata)){if(!['model','provider','tool','correlationId'].includes(k)||typeof v!=='string'||!/^[a-zA-Z0-9_.:/-]{1,128}$/.test(v))throw new TypeError('invalid metadata field');}}
 if(s.usage!==undefined){if(!s.usage||Object.getPrototypeOf(s.usage)!==Object.prototype||Object.keys(s.usage).some(k=>!['inputTokens','outputTokens'].includes(k))||Object.keys(s.usage).length!==2||!Object.values(s.usage).every(v=>Number.isSafeInteger(v)&&v>=0&&v<=1e9))throw new TypeError('invalid usage');}
 map.set(s.spanId,s);
 }
 if(t.spans.filter(s=>s.parentSpanId===null).length!==1)throw new TypeError('expected one root');
 const done=new Set();
 for(const s of map.values()){const seen=new Set();let p=s;while(p&&!done.has(p.spanId)){if(seen.has(p.spanId))throw new TypeError('cycle');seen.add(p.spanId);if(p.parentSpanId===null)break;const parent=map.get(p.parentSpanId);if(!parent)throw new TypeError('missing parent');p=parent;}for(const key of seen)done.add(key);}
 return true;
}
