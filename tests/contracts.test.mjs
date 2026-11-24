import test from 'node:test';import assert from 'node:assert/strict';import {validateTrace} from '../src/contracts.mjs';
const traceId='1'.repeat(32), root={traceId,spanId:'2'.repeat(16),parentSpanId:null,name:'root',startMs:0,endMs:5,status:'ok'};
const child={...root,spanId:'3'.repeat(16),parentSpanId:root.spanId};
const make=(spans=[root,child])=>({version:1,traceId,spans});
test('valid nested trace',()=>assert.equal(validateTrace(make()),true));
test('reject malformed and orphan spans',()=>{for(const s of [{...child,endMs:-1},{...child,parentSpanId:'4'.repeat(16)},{...child,spanId:root.spanId},{...child,traceId:'0'.repeat(32)}])assert.throws(()=>validateTrace(make([root,s])));});
test('reject detached cycles',()=>assert.throws(()=>validateTrace(make([root,{...child,parentSpanId:child.spanId}]))));
test('reject unknown version and empty trace',()=>{assert.throws(()=>validateTrace({...make(),version:2}));assert.throws(()=>validateTrace(make([])));});