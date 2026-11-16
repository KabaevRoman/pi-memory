import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { acquire } from '@kabaevroman/pi-code-core';
export default function (pi: ExtensionAPI): void {
  const state = acquire(pi,'memory'); if (!state) return;
  const {runtime:r,features} = state;

    pi.on('before_agent_start',(_e,_ctx)=> features.has('prompts') ? undefined : {message:{customType:'claude-compat:memory',content:r.memory.format(),display:false}});
    pi.on('tool_result',async (e,ctx)=> {
      if (!['read','Read'].includes(e.toolName)) return;
      const path = (e.input as any).path ?? (e.input as any).file_path;
      if (typeof path !== 'string') return;
      const {resolve} = await import('node:path');
      const added = await r.memory.descendant(resolve(ctx.cwd,path));
      if (added.length) return {content:[...e.content,{type:'text' as const,text:r.memory.format(added)}]};
    });

}
