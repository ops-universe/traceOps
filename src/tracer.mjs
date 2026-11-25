import {AsyncLocalStorage} from 'node:async_hooks';
import {randomBytes} from 'node:crypto';
import {validateTrace} from './contracts.mjs';
const context=new AsyncLocalStorage();
const kinds=['operation','model','tool','retrieval'];
const newId=n=>randomBytes(n).toString('hex');
const safeName=s=>typeof s==='string'&&/^[a-zA-Z][a-zA-Z0-9_.-]{0,79}$/.test(s)?s:'redacted';
export function createTracer({allowedNames=[],metadataKeys=[],redact=()=>false,clock=Date.now,maxSpans=1000}={}){
 if(!Number.isInteger(maxSpans)||maxSpans<1||maxSpans>10000||!Array.isArray(allowedNames)||allowedNames.length>1000||!Array.isArray(metadataKeys)||typeof redact!=='function'||typeof clock!=='function')throw new TypeError('invalid tracer options');
 const allowed=new Set(metadataKeys.filter(k=>['model','provider','tool','correlationId'].includes(k)));
 const names=new Set(allowedNames.filter(n=>safeName(n)===n));
 const owner={};
 function metadata(input){const out={};for(const k of allowed){const v=Object.getOwnPropertyDescriptor(input??{},k)?.value;if(typeof v==='string'&&/^[a-zA-Z0-9_.:/-]{1,128}$/.test(v)&&!redact(k,v))out[k]=v;}return out;}
 function time(){const t=clock();if(!Number.isSafeInteger(t)||t<0)throw new TypeError('invalid clock');return t;}
 async function span(name,fn,{kind='operation',metadata:attrs}={}){
 const active=context.getStore();if(!active||active.owner!==owner||!active.open||!active.trace.open)throw new Error('no active trace');
 if(typeof fn!=='function'||!kinds.includes(kind))throw new TypeError('invalid operation');
 if(active.trace.spans.length>=maxSpans)throw new RangeError('span limit');
 const startMs=time(),s={traceId:active.trace.traceId,spanId:newId(8),parentSpanId:active.span?.spanId??null,name:names.has(name)&&!redact('name',name)?safeName(name):'redacted',kind,startMs,endMs:startMs,durationMs:0,status:'unset',metadata:metadata(attrs)};
 active.trace.spans.push(s);const child={owner,trace:active.trace,span:s,open:true,pending:new Set()};
 const run=context.run(child,async()=>{try{const result=await fn();s.status='ok';return result;}catch(e){s.status='error';s.errorCode='error';throw e;}finally{child.open=false;await Promise.allSettled([...child.pending]);s.endMs=Math.max(startMs,time());s.durationMs=s.endMs-startMs;}});
 active.pending.add(run);try{return await run;}finally{active.pending.delete(run);}
 }
 async function trace(name,fn,options){const state={traceId:newId(16),spans:[],open:true};const root={owner,trace:state,span:null,open:true,pending:new Set()};let result,error,failed=false;try{result=await context.run(root,()=>span(name,fn,options));}catch(e){failed=true;error=e;}finally{root.open=false;state.open=false;}const record={version:1,traceId:state.traceId,spans:state.spans};validateTrace(record);return {result,failed,error,trace:record};}
 return {trace,span};
}
