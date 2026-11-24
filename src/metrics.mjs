import {validateTrace} from './contracts.mjs';
function percentiles(values){const sorted=[...values].sort((a,b)=>a-b);const q=p=>sorted.length?sorted[Math.ceil(sorted.length*p)-1]:null;return {p50:q(.5),p95:q(.95),p99:q(.99)};}
export function summarize(traces,{pricing}={}){
 if(!Array.isArray(traces)||traces.length>1000)throw new TypeError('invalid trace batch');
 if(pricing!==undefined&&(!pricing||!['inputPerMillion','outputPerMillion'].every(k=>typeof pricing[k]==='number'&&Number.isFinite(pricing[k])&&pricing[k]>=0&&pricing[k]<=1e9)))throw new TypeError('invalid pricing');
 let spans=0,errors=0,traceErrors=0,toolCalls=0,inputTokens=0,outputTokens=0,usageSpans=0;const durations=[],roots=[],seen=new Set();
 for(const trace of traces){validateTrace(trace);if(seen.has(trace.traceId))throw new TypeError('duplicate trace');seen.add(trace.traceId);
 for(const s of trace.spans){if(++spans>100000)throw new RangeError('span batch limit');const duration=s.endMs-s.startMs;durations.push(duration);if(s.parentSpanId===null){roots.push(duration);if(s.status==='error')traceErrors++;}if(s.status==='error')errors++;if(s.kind==='tool')toolCalls++;if(s.usage){usageSpans++;inputTokens+=s.usage.inputTokens;outputTokens+=s.usage.outputTokens;}}}
 const costEstimate=pricing!==undefined&&usageSpans>0?{amount:inputTokens/1e6*pricing.inputPerMillion+outputTokens/1e6*pricing.outputPerMillion,basis:'explicit uniform pricing; supplied usage only'}:null;
 return {traces:traces.length,spans,errors,errorRate:spans?errors/spans:null,traceErrors,traceErrorRate:traces.length?traceErrors/traces.length:null,toolCalls,spanLatencyMs:percentiles(durations),traceLatencyMs:percentiles(roots),usage:{inputTokens,outputTokens,reportedSpans:usageSpans,missingSpans:spans-usageSpans},costEstimate};
}
