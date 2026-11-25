export const syntheticTrace={version:1,traceId:'1'.repeat(32),spans:[
{traceId:'1'.repeat(32),spanId:'1'.repeat(16),parentSpanId:null,name:'agent.request',kind:'operation',startMs:0,endMs:480,status:'ok'},
{traceId:'1'.repeat(32),spanId:'2'.repeat(16),parentSpanId:'1'.repeat(16),name:'retrieve.documents',kind:'retrieval',startMs:20,endMs:140,status:'ok'},
{traceId:'1'.repeat(32),spanId:'3'.repeat(16),parentSpanId:'1'.repeat(16),name:'tool.lookup',kind:'tool',startMs:145,endMs:225,status:'error',errorCode:'timeout'},
{traceId:'1'.repeat(32),spanId:'4'.repeat(16),parentSpanId:'1'.repeat(16),name:'tool.lookup',kind:'tool',startMs:230,endMs:300,status:'ok'},
{traceId:'1'.repeat(32),spanId:'5'.repeat(16),parentSpanId:'1'.repeat(16),name:'model.generate',kind:'model',startMs:310,endMs:470,status:'ok',usage:{inputTokens:400,outputTokens:80}}
]};
