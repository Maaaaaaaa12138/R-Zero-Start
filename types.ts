
export interface Lesson {
  id: number;
  title: string;
  module: string;
  scenario: string;
  task: string;
  hint: string;
  defaultCode: string;
  expectedKeywords: string[];
  mockOutput?: string;
}

export interface AppState {
  currentLessonId: number;
  completedLessons: number[];
  terminalLogs: TerminalLog[];
}

export interface TerminalLog {
  type: 'input' | 'output' | 'system' | 'error';
  content: string;
  timestamp: Date;
}
