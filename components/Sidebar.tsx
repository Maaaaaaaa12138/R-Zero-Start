
import React, { useState } from 'react';
import { Lesson } from '../types';
import { CheckCircle, Circle, PlayCircle, RotateCcw, X, Check, AlertTriangle } from 'lucide-react';

interface SidebarProps {
  curriculum: Lesson[];
  currentId: number;
  completedIds: number[];
  onSelect: (id: number) => void;
  onClearProgress: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ curriculum, currentId, completedIds, onSelect, onClearProgress }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmClear = () => {
    onClearProgress();
    setShowConfirm(false);
  };

  return (
    <div className="w-80 h-full bg-slate-900 text-slate-300 flex flex-col border-r border-slate-700">
      <div className="p-6 border-b border-slate-700 bg-slate-800/50">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="p-1 bg-blue-600 rounded text-xs uppercase tracking-tighter">R-Zero</span>
              Start
            </h1>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">Learning Dashboard</p>
          </div>
          
          <div className="relative">
             {/* Replaced top right trash button with just the confirm UI container logic if needed, but per request moving main button to better spot or changing icon */}
             {/* Keeping the confirm dialog structure absolute but triggered from the new button below or here if we want to keep it in header */}
             {/* The user requested to change the "top left" (actually top right in previous code, but context implies header) button to Reset Progress. */}
             
             {showConfirm ? (
               <div className="absolute right-0 -top-2 bg-slate-800 border border-red-900/50 p-2 rounded-lg shadow-xl flex flex-col items-end gap-2 w-36 z-50 animate-in fade-in zoom-in-95 duration-200">
                 <span className="text-[10px] text-red-400 font-bold flex items-center gap-1 whitespace-nowrap">
                   <AlertTriangle className="w-3 h-3" /> 确认重置进度?
                 </span>
                 <div className="flex gap-1">
                   <button 
                     onClick={() => setShowConfirm(false)}
                     className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-300 transition-colors"
                   >
                     取消
                   </button>
                   <button 
                     onClick={handleConfirmClear}
                     className="px-2 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded text-xs font-bold transition-colors"
                   >
                     重置
                   </button>
                 </div>
               </div>
            ) : (
              <button 
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-1.5 px-2 py-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800/80 rounded-lg transition-all duration-200 group"
                title="Reset Progress"
              >
                <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">重置进度</span>
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
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
