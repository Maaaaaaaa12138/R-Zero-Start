
import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Terminal } from './components/Terminal';
import { CURRICULUM } from './constants';
import { TerminalLog } from './types';
import { Play, RotateCcw, Lightbulb, CheckCircle2, PartyPopper, Terminal as TerminalIcon, BarChart, Eye, EyeOff } from 'lucide-react';
// @ts-ignore
import { WebR } from 'webr';

const STORAGE_KEY = 'r-zero-start-progress';

// Helper to safely get progress from localStorage
const getSavedProgress = (): number[] => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Failed to parse progress from local storage');
      return [];
    }
  }
  return [];
};

const App: React.FC = () => {
  // 1. Initialize completedIds first
  const [completedIds, setCompletedIds] = useState<number[]>(getSavedProgress);

  // 2. Initialize currentId based on completedIds (Resume Logic)
  const [currentId, setCurrentId] = useState(() => {
    const saved = getSavedProgress();
    if (saved.length > 0) {
      const maxCompleted = Math.max(...saved);
      // Resume at the next lesson after the last completed one, capping at curriculum length
      return Math.min(maxCompleted + 1, CURRICULUM.length);
    }
    return 1;
  });

  // Initialize with a placeholder instead of the solution
  const [code, setCode] = useState("# Write your R code here...\n");
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  const [webR, setWebR] = useState<any>(null);
  const [isWebRReady, setIsWebRReady] = useState(false);
  const [activeTab, setActiveTab] = useState<'console' | 'plot'>('console');
  const [isExecuting, setIsExecuting] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentLesson = CURRICULUM.find(l => l.id === currentId) || CURRICULUM[0];

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedIds));
  }, [completedIds]);

  useEffect(() => {
    const initWebR = async () => {
      try {
        const core = new WebR();
        await core.init();
        setWebR(core);
        setIsWebRReady(true);

        // Keep the read loop for canvas events and system messages (stderr)
        (async () => {
          while (true) {
            const msg = await core.read();
            switch (msg.type) {
              case 'stdout':
                // We handle main output via capture.output in handleRun now to be more robust,
                // but we still log stray stdout messages just in case.
                setLogs(prev => [...prev, { type: 'output', content: msg.data, timestamp: new Date() }]);
                break;
              case 'stderr':
                setLogs(prev => [...prev, { type: 'error', content: msg.data, timestamp: new Date() }]);
                break;
              case 'canvas':
                if (msg.data.event === 'canvasImage') {
                  const canvas = canvasRef.current;
                  if (canvas) {
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(msg.data.image, 0, 0);
                  }
                } else if (msg.data.event === 'canvasNewPage') {
                  const canvas = canvasRef.current;
                  if (canvas) {
                    const ctx = canvas.getContext('2d');
                    ctx?.clearRect(0, 0, canvas.width, canvas.height);
                  }
                }
                break;
            }
          }
        })();
      } catch (e) {
        console.error("WebR Initialization failed", e);
      }
    };
    initWebR();
  }, []);

  const handleLessonSelect = (id: number) => {
    const lesson = CURRICULUM.find(l => l.id === id);
    if (lesson) {
      setCurrentId(id);
      setCode("# Write your R code here...\n");
      setShowCelebration(false);
      setShowHint(false);
      if (id >= 17 && id <= 19) {
        setActiveTab('plot');
      } else {
        setActiveTab('console');
      }
    }
  };

  const handleClearProgress = () => {
    setCompletedIds([]);
    localStorage.removeItem(STORAGE_KEY);
    handleLessonSelect(1);
    setLogs(prev => [...prev, { type: 'system', content: 'Progress has been reset.', timestamp: new Date() }]);
  };

  const handleRun = async () => {
    if (!webR || !isWebRReady) return;
    setIsExecuting(true);
    
    const lowerCode = code.toLowerCase();
    if (lowerCode.includes('plot') || lowerCode.includes('hist') || lowerCode.includes('barplot')) {
      setActiveTab('plot');
    }

    setLogs(prev => [...prev, { type: 'input', content: code, timestamp: new Date() }]);

    try {
      // 1. Initialize Canvas Device
      await webR.evalR(`webr::canvas(width=500, height=500)`);
      
      try {
        const safeCode = JSON.stringify(code);
        
        // 2. Execute Code with robust output capture
        // We wrap the execution in an R tryCatch + capture.output block.
        // This guarantees we get the output string back synchronously, ensuring it shows in the UI.
        const rWrapper = `
          tryCatch({
            output_lines <- capture.output({
              exprs <- parse(text = ${safeCode})
              for (i in seq_along(exprs)) {
                res <- withVisible(eval(exprs[[i]], envir = globalenv()))
                if (res$visible) {
                  print(res$value)
                }
              }
            }, type = "output")
            
            # Combine lines into a single string
            paste(output_lines, collapse = "\\n")
            
          }, error = function(e) {
            # Prefix errors so we can style them
            paste("Error:", e$message)
          })
        `;

        const result = await webR.evalR(rWrapper);
        const resultJs = await result.toJs();
        
        // Extract the string value from the R character vector result
        let outputContent = "";
        if (resultJs && resultJs.values && resultJs.values.length > 0) {
          outputContent = resultJs.values[0];
        } else if (typeof resultJs === 'string') {
          outputContent = resultJs;
        }

        if (outputContent && outputContent.trim() !== "") {
          const isError = outputContent.startsWith("Error:");
          setLogs(prev => [...prev, { 
            type: isError ? 'error' : 'output', 
            content: outputContent, 
            timestamp: new Date() 
          }]);
        }
        
        // 3. Validate Result
        const isValid = currentLesson.expectedKeywords.every(keyword => 
          lowerCode.includes(keyword.toLowerCase())
        );

        if (isValid && !completedIds.includes(currentId) && !outputContent.startsWith("Error:")) {
          setCompletedIds(prev => [...prev, currentId]);
          setShowCelebration(true);
        }
      } finally {
        await webR.evalR(`dev.off()`);
      }

    } catch (err: any) {
      setLogs(prev => [...prev, { type: 'error', content: err.message || "Execution Error", timestamp: new Date() }]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleReset = () => {
    setCode("# Write your R code here...\n");
  };

  return (
    <div className="flex h-screen w-full bg-slate-50">
      <Sidebar 
        curriculum={CURRICULUM}
        currentId={currentId}
        completedIds={completedIds}
        onSelect={handleLessonSelect}
        onClearProgress={handleClearProgress}
      />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-medium">Learning Hub</span>
            <div className="flex gap-1">
              {CURRICULUM.map(l => (
                <div 
                  key={l.id} 
                  className={`w-2 h-2 rounded-full transition-all ${
                    completedIds.includes(l.id) ? 'bg-emerald-500' : 
                    l.id === currentId ? 'bg-blue-600 ring-2 ring-blue-100' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
             {isWebRReady ? (
               <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> WebR Active
               </span>
             ) : (
               <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full border border-amber-100">
                 <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" /> Loading R Engine...
               </span>
             )}
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white">
          <div className="w-full md:w-1/2 p-8 overflow-y-auto border-r border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">
                {currentLesson.module}
              </span>
              <h2 className="text-2xl font-bold text-slate-800">{currentLesson.title}</h2>
            </div>
            
            <div className="mt-6 space-y-6">
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Scenario 场景</h3>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                  {currentLesson.scenario}
                </p>
              </section>

              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Challenge 挑战任务</h3>
                <div className="bg-emerald-50 text-emerald-900 p-5 rounded-xl border border-emerald-100 font-medium">
                  {currentLesson.task}
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Hint 提示
                  </h3>
                  <button 
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    {showHint ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showHint ? "Hide Answer" : "Show Answer"}
                  </button>
                </div>
                
                {showHint ? (
                  <code className="block bg-slate-900 text-slate-300 p-4 rounded-xl code-font text-xs leading-5 whitespace-pre animate-in fade-in slide-in-from-top-2 duration-200">
                    {currentLesson.hint}
                  </code>
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-center text-slate-400 text-xs italic">
                    点击上方按钮查看参考答案代码
                  </div>
                )}
              </section>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col bg-slate-900 relative">
            <div className="flex items-center justify-between p-3 border-b border-slate-800">
              <span className="text-slate-500 text-[10px] code-font uppercase tracking-widest">script.R</span>
              <button 
                onClick={handleReset}
                className="p-1 hover:bg-slate-800 rounded text-slate-500 transition-colors"
                title="Clear Code"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="flex-1">
               <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={!isWebRReady}
                className="w-full h-full bg-transparent text-slate-100 p-6 code-font focus:outline-none resize-none text-sm leading-6 disabled:opacity-50"
                spellCheck={false}
              />
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
              <button 
                onClick={handleRun}
                disabled={!isWebRReady || isExecuting}
                className={`flex items-center gap-2 font-bold py-2.5 px-6 rounded-xl transition-all active:scale-95 ${
                  !isWebRReady ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20'
                }`}
              >
                {isExecuting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
                <span>运行 (Run)</span>
              </button>
            </div>

            {showCelebration && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                <div className="bg-white p-8 rounded-3xl shadow-2xl text-center flex flex-col items-center gap-4 animate-in zoom-in duration-200">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800">任务完成!</h3>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => setShowCelebration(false)} className="py-2 px-4 rounded-lg font-bold text-slate-400 hover:bg-slate-50">留在本页</button>
                    <button 
                      onClick={() => {
                        const nextId = Math.min(currentId + 1, CURRICULUM.length);
                        handleLessonSelect(nextId);
                        setShowCelebration(false);
                      }}
                      className="py-2 px-4 rounded-lg font-bold bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                    >
                      下一关 <PartyPopper className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-1/3 min-h-[220px] flex flex-col border-t border-slate-200 bg-white">
          <div className="flex px-4 border-b border-slate-200 bg-slate-50/50">
            <button 
              onClick={() => setActiveTab('console')}
              className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all ${activeTab === 'console' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              <TerminalIcon className="w-3.5 h-3.5" /> Console
            </button>
            <button 
              onClick={() => setActiveTab('plot')}
              className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all ${activeTab === 'plot' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              <BarChart className="w-3.5 h-3.5" /> Plot Graphics
            </button>
          </div>
          
          <div className="flex-1 relative overflow-hidden bg-[#0d1117]">
            {activeTab === 'console' ? (
              <Terminal logs={logs} />
            ) : (
              <div className="w-full h-full bg-white flex items-center justify-center p-4">
                <canvas 
                  id="webR-canvas" 
                  ref={canvasRef} 
                  width={500} 
                  height={500}
                  className="max-h-full max-w-full object-contain shadow-sm border border-slate-100"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
