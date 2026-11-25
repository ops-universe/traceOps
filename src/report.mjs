import {validateTrace} from './contracts.mjs';
export const MAX_REPORT_BYTES=8*1024*1024;
export function parseReport(text){
 if(typeof text!=='string'||new TextEncoder().encode(text).length>MAX_REPORT_BYTES)throw new RangeError('report too large');
 const lines=text.split('\n').filter(s=>s.trim());if(!lines.length||lines.length>1000)throw new RangeError('invalid trace count');
 const ids=new Set();let spans=0;
 return lines.map(line=>{if(new TextEncoder().encode(line).length>1024*1024)throw new RangeError('line too large');const t=JSON.parse(line);validateTrace(t);if(ids.has(t.traceId))throw new TypeError('duplicate trace');ids.add(t.traceId);spans+=t.spans.length;if(spans>100000)throw new RangeError('span limit');return {version:1,traceId:t.traceId,spans:t.spans.map(s=>({traceId:s.traceId,spanId:s.spanId,parentSpanId:s.parentSpanId,name:'redacted',startMs:s.startMs,endMs:s.endMs,status:s.status,...(s.kind?{kind:s.kind}:{}),...(s.errorCode?{errorCode:s.errorCode}:{}),...(s.usage?{usage:{inputTokens:s.usage.inputTokens,outputTokens:s.usage.outputTokens}}:{})}))};});
}
export function spanDepths(trace){validateTrace(trace);const byId=new Map(trace.spans.map(s=>[s.spanId,s])),depths=new Map();for(const s of trace.spans){const path=[];let current=s;while(current&&!depths.has(current.spanId)){path.push(current);current=current.parentSpanId===null?null:byId.get(current.parentSpanId);}let d=current?depths.get(current.spanId)+1:0;while(path.length)depths.set(path.pop().spanId,d++);}return depths;}
