import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronDown, ChevronUp } from 'lucide-react';

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'request' | 'process';
}

interface TerminalLogProps {
  logs: LogEntry[];
  isExpanded: boolean;
  onToggle: () => void;
}

const TerminalLog = ({ logs, isExpanded, onToggle }: TerminalLogProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'request': return 'text-yellow-400';
      case 'process': return 'text-blue-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="border-t border-border bg-slate-900 rounded-b-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-2 bg-slate-800 hover:bg-slate-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-green-400" />
          <span className="text-xs font-mono text-slate-300">Process Logs</span>
          {logs.length > 0 && (
            <span className="text-xs font-mono text-slate-500">({logs.length})</span>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {/* Log Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 160 }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              ref={scrollRef}
              className="h-40 overflow-y-auto p-3 font-mono text-xs scrollbar-thin"
            >
              <AnimatePresence>
                {logs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="flex gap-2 mb-1"
                  >
                    <span className="text-slate-600 flex-shrink-0">{log.timestamp}</span>
                    <span className={getLogColor(log.type)}>&gt;</span>
                    <span className={getLogColor(log.type)}>{log.message}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {logs.length === 0 && (
                <div className="text-slate-600 italic">Waiting for process logs...</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TerminalLog;

export function generateLogs(drugName: string): LogEntry[] {
  const timestamp = () => new Date().toLocaleTimeString('en-US', { hour12: false });
  
  return [
    { id: '1', timestamp: timestamp(), message: 'Initializing PharmAgent workflow...', type: 'info' },
    { id: '2', timestamp: timestamp(), message: `Query parsed: "${drugName}" compound detected`, type: 'process' },
    { id: '3', timestamp: timestamp(), message: 'Connecting to USPTO API v2.1...', type: 'request' },
    { id: '4', timestamp: timestamp(), message: 'GET /patents/search?q=' + drugName.toLowerCase() + '... 200 OK', type: 'success' },
    { id: '5', timestamp: timestamp(), message: 'Connecting to ClinicalTrials.gov API...', type: 'request' },
    { id: '6', timestamp: timestamp(), message: 'GET /trials/search?intervention=' + drugName + '... 200 OK', type: 'success' },
    { id: '7', timestamp: timestamp(), message: 'Querying market intelligence database...', type: 'request' },
    { id: '8', timestamp: timestamp(), message: 'POST /market/analysis... 200 OK', type: 'success' },
    { id: '9', timestamp: timestamp(), message: 'NLP Synthesis Module loaded (GPT-4-turbo)', type: 'process' },
    { id: '10', timestamp: timestamp(), message: 'Generating strategic recommendations...', type: 'process' },
    { id: '11', timestamp: timestamp(), message: 'Analysis complete. Report ready.', type: 'success' },
  ];
}
