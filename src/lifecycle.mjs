import {randomBytes} from 'node:crypto';
import {validateTrace} from './contracts.mjs';
const id=n=>randomBytes(n).toString('hex');
const kinds=['operation','model','tool','retrieval'];
export function createTraceSession({clock=Date.now,maxSpans=1000,allowedNames=[]}={}){
 if(!Number.isInteger(maxSpans)||maxSpans<1||maxSpans>10000||!Array.isArray(allowedNames)||allowedNames.length>1000||typeof clock!=='function')throw new TypeError('invalid options');
 const names=new Set(allowedNames.filter(n=>typeof n==='string'&&/^[a-z][a-z0-9_.-]{0,79}$/i.test(n)));
 const traceId=id(16),spans=[],handles=new Map();let closed=false;
 function now(){const n=clock();if(!Number.isSafeInteger(n)||n<0)throw new TypeError('invalid clock');return n;}
 function startSpan(name,{parent=null,kind='operation'}={}){
 if(closed||spans.length>=maxSpans)throw new Error('session closed or span limit');
 if(!kinds.includes(kind))throw new TypeError('invalid kind');
 const ancestor=parent===null?null:handles.get(parent);
 if(parent!==null&&(!ancestor||ancestor.ended))throw new Error('invalid parent');
 if(parent===null&&spans.length)throw new Error('root exists');
 const startMs=Math.max(now(),ancestor?.s.startMs??0);
 const s={traceId,spanId:id(8),parentSpanId:ancestor?.s.spanId??null,name:names.has(name)?name:'redacted',kind,startMs,endMs:startMs,durationMs:0,status:'unset'};
 const state={s,ended:false,children:0,latestEnd:startMs};
 const handle=Object.freeze({spanId:s.spanId,end(status='ok',errorCode){
 if(closed||state.ended||state.children)throw new Error('span not endable');
 if(!['ok','error','unset'].includes(status)||(errorCode!==undefined&&(status!=='error'||!['error','timeout','cancelled'].includes(errorCode))))throw new TypeError('invalid status');
 s.endMs=Math.max(now(),state.latestEnd,startMs);s.durationMs=s.endMs-startMs;s.status=status;if(errorCode!==undefined)s.errorCode=errorCode;state.ended=true;
 if(ancestor){ancestor.children--;ancestor.latestEnd=Math.max(ancestor.latestEnd,s.endMs);}
 }});
 handles.set(handle,state);spans.push(s);if(ancestor)ancestor.children++;return handle;
 }
 function finish(){if(closed||!spans.length||[...handles.values()].some(x=>!x.ended))throw new Error('unfinished or closed session');const record={version:1,traceId,spans:structuredClone(spans)};validateTrace(record);closed=true;return record;}
 return Object.freeze({startSpan,finish});
}
