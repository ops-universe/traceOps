#!/usr/bin/env node
import {loadTraces} from './storage.mjs';
import {inspectTrace,compareTraces} from './diagnostics.mjs';
import {summarize} from './metrics.mjs';
const [command,file,id,other,...rest]=process.argv.slice(2);
try{
 if(command==='--help'||command==='help'){console.log('traceOps: inspect FILE TRACE_ID | compare FILE BEFORE_ID AFTER_ID | metrics FILE');}
 else {
 if(!file||rest.length||!['inspect','compare','metrics'].includes(command)||(command==='metrics'&&id!==undefined)||(command==='inspect'&&(!id||other!==undefined))||(command==='compare'&&(!id||!other)))throw Error('invalid arguments');
 const traces=await loadTraces(file);const find=x=>{const t=traces.find(t=>t.traceId===x);if(!t)throw Error('trace not found');return t;};
 console.log(JSON.stringify(command==='metrics'?summarize(traces):command==='inspect'?inspectTrace(find(id)):compareTraces(find(id),find(other)),null,2));
 }
}catch{console.error('traceOps: invalid arguments, unreadable file or invalid trace; use --help');process.exitCode=1;}
