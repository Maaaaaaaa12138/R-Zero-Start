
import React, { useEffect, useRef } from 'react';
import { TerminalLog } from '../types';
import { Terminal as TerminalIcon, ChevronRight } from 'lucide-react';

interface TerminalProps {
  logs: TerminalLog[];
}

export const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-slate-300 code-font text-sm border-t border-slate-800 shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border-b border-slate-700/50">
        <TerminalIcon className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">R Interactive Console</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 font-mono space-y-1">
        <div className="text-slate-500 mb-4 opacity-75">
          R version 4.2.0 (2022-04-22) -- "Vigorous Calisthenics"<br/>
          Copyright (C) 2022 The R Foundation for Statistical Computing<br/>
          Platform: x86_64-apple-darwin17.0 (64-bit)<br/>
          -- R is free software and comes with ABSOLUTELY NO WARRANTY.
        </div>
        
        {logs.map((log, i) => (
          <div key={i} className="flex gap-2">
            {log.type === 'input' && <ChevronRight className="w-4 h-4 mt-1 text-slate-600 shrink-0" />}
            <span className={`whitespace-pre-wrap ${
              log.type === 'output' ? 'text-blue-400' :
              log.type === 'system' ? 'text-emerald-400 font-bold italic' :
              log.type === 'error' ? 'text-rose-400' :
              'text-slate-400'
            }`}>
              {log.content}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
