import {pathToFileURL} from 'node:url';
import {saveTraces} from '../src/storage.mjs';
import {inspectTrace} from '../src/diagnostics.mjs';
import {summarize} from '../src/metrics.mjs';
export function buildSyntheticScenarios(){
 const scenarios=[
 ['agent.coordinator', [['agent.plan','operation',0,30,'ok'],['agent.worker.a','operation',30,110,'ok'],['agent.worker.b','operation',30,180,'ok']]],
 ['rag.request',[['retrieve.index','retrieval',10,70,'ok'],['retrieve.rerank','retrieval',70,100,'ok'],['model.answer','model',110,240,'ok']]],
 ['tool.workflow',[['tool.lookup','tool',10,90,'error','timeout'],['tool.lookup','tool',100,140,'ok']]],
 ['performance.request',[['cache.lookup','tool',5,10,'ok'],['model.slow','model',20,800,'ok']]]
 ];
 return scenarios.map(([name,operations])=>{
 const traceId=String(scenarios.findIndex(s=>s[0]===name)+1).repeat(32),rootId='1'.repeat(16),end=Math.max(...operations.map(o=>o[3]))+10;
 const spans=[{traceId,spanId:rootId,parentSpanId:null,name,kind:'operation',startMs:0,endMs:end,status:'ok'},...operations.map(([name,kind,startMs,endMs,status,errorCode],i)=>({traceId,spanId:String(i+2).repeat(16),parentSpanId:rootId,name,kind,startMs,endMs,status,...(errorCode?{errorCode}:{})}))];
 return {version:1,traceId,spans};
 });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const traces=buildSyntheticScenarios();if(process.argv[2])await saveTraces(process.argv[2],traces);console.log(JSON.stringify({synthetic:true,metrics:summarize(traces),reports:traces.map(t=>inspectTrace(t))},null,2));}
