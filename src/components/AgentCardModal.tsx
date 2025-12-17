import { motion, AnimatePresence } from 'framer-motion';
import { X, Code, FileText } from 'lucide-react';

interface AgentCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  rawData: string;
  abstract?: string;
}

const AgentCardModal = ({ isOpen, onClose, title, rawData, abstract }: AgentCardModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card rounded-2xl shadow-elevated z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Code className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
                  <p className="text-xs text-muted-foreground">Raw Data View</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 max-h-[60vh] overflow-y-auto">
              {/* Abstract Section */}
              {abstract && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Abstract / Details
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-border">
                    {abstract}
                  </p>
                </div>
              )}

              {/* JSON Data */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    JSON Response
                  </span>
                </div>
                <pre className="text-xs bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono">
                  {rawData}
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-border bg-slate-50">
              <button
                onClick={onClose}
                className="w-full py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AgentCardModal;
