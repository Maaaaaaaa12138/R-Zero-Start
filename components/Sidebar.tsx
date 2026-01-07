
import React from 'react';
import { Lesson } from '../types';
import { CheckCircle, Circle, PlayCircle } from 'lucide-react';

interface SidebarProps {
  curriculum: Lesson[];
  currentId: number;
  completedIds: number[];
  onSelect: (id: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ curriculum, currentId, completedIds, onSelect }) => {
  return (
    <div className="w-80 h-full bg-slate-900 text-slate-300 flex flex-col border-r border-slate-700">
      <div className="p-6 border-b border-slate-700 bg-slate-800/50">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="p-1 bg-blue-600 rounded text-xs uppercase tracking-tighter">R-Zero</span>
          Start
        </h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">Learning Dashboard</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {curriculum.map((lesson) => {
          const isCurrent = lesson.id === currentId;
          const isCompleted = completedIds.includes(lesson.id);
          
          return (
            <button
              key={lesson.id}
              onClick={() => onSelect(lesson.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                isCurrent 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' 
                  : 'hover:bg-slate-800 text-slate-400 hover:text-slate-100'
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              ) : isCurrent ? (
                <PlayCircle className="w-5 h-5 text-blue-400" />
              ) : (
                <Circle className="w-5 h-5 opacity-40" />
              )}
              <div className="flex-1 overflow-hidden">
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-60 mb-0.5">
                  {lesson.module}
                </div>
                <div className="text-sm font-medium truncate">{lesson.title}</div>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-slate-700 bg-slate-800/30">
        <div className="text-xs text-slate-500 mb-2 flex justify-between">
          <span>Overall Progress</span>
          <span>{Math.round((completedIds.length / curriculum.length) * 100)}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500" 
            style={{ width: `${(completedIds.length / curriculum.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
