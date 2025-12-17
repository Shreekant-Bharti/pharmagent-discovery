import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Beaker, FileText, Download, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import TypingEffect from './TypingEffect';
import { DrugData } from '@/data/drugDatabase';
import { generatePDF } from '@/utils/pdfGenerator';

interface Message {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  isTyping?: boolean;
  showDownload?: boolean;
  drugData?: DrugData;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
}

const WelcomeScreen = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="flex flex-col items-center justify-center h-full text-center px-8"
  >
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6"
    >
      <Beaker className="w-10 h-10 text-primary" />
    </motion.div>
    
    <motion.h2
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="text-2xl font-bold text-slate-800 mb-2"
    >
      PharmAgent
    </motion.h2>
    
    <motion.p
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="text-lg text-primary font-medium mb-4"
    >
      Accelerating Discovery
    </motion.p>
    
    <motion.p
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="text-muted-foreground max-w-md leading-relaxed"
    >
      How can I assist your R&D strategy today? Ask me to analyze drug repurposing opportunities, 
      review clinical trial data, or explore patent landscapes.
    </motion.p>

    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="mt-8 flex flex-wrap justify-center gap-2"
    >
      {['Gefitinib', 'Metformin', 'Aspirin'].map((drug, i) => (
        <span
          key={drug}
          className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full"
        >
          Try: "{drug}"
        </span>
      ))}
    </motion.div>

    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="flex items-center gap-2 mt-6 text-xs text-muted-foreground"
    >
      <Sparkles className="w-4 h-4 text-primary" />
      <span>Powered by Multi-Agent AI</span>
    </motion.div>
  </motion.div>
);

const ChatInterface = ({ messages, onSendMessage, isProcessing }: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleDownload = (drugData?: DrugData) => {
    if (drugData) {
      generatePDF(drugData);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-background">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
            <WelcomeScreen />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-3xl mx-auto py-8 px-6 space-y-6"
            >
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'user' ? (
                    <div className="chat-bubble-user max-w-[80%]">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  ) : message.type === 'system' ? (
                    <div className="flex items-start gap-3 max-w-[90%]">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Beaker className="w-4 h-4 text-primary" />
                      </div>
                      <div className="chat-bubble-agent">
                        <p className="text-sm text-primary font-medium">{message.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 max-w-[90%]">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Beaker className="w-4 h-4 text-primary" />
                      </div>
                      <div className="space-y-3">
                        <div className="chat-bubble-agent prose prose-sm prose-slate max-w-none">
                          {message.isTyping ? (
                            <TypingEffect text={message.content} speed={10} />
                          ) : (
                            <ReactMarkdown
                              components={{
                                strong: ({ children }) => (
                                  <strong className="font-semibold text-slate-800">{children}</strong>
                                ),
                                ul: ({ children }) => (
                                  <ul className="list-disc list-inside space-y-1 mt-2">{children}</ul>
                                ),
                                li: ({ children }) => (
                                  <li className="text-sm">{children}</li>
                                ),
                                p: ({ children }) => (
                                  <p className="text-sm leading-relaxed mb-2 last:mb-0">{children}</p>
                                ),
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          )}
                        </div>
                        
                        {message.showDownload && message.drugData && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            onClick={() => handleDownload(message.drugData)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-3 px-5 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
                          >
                            <FileText className="w-5 h-5" />
                            Download Strategy Report (PDF)
                            <Download className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about drug repurposing opportunities..."
              disabled={isProcessing}
              className="w-full px-5 py-4 pr-14 bg-secondary rounded-2xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all disabled:opacity-50"
            />
            <motion.button
              type="submit"
              disabled={!input.trim() || isProcessing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Try: "Analyze Gefitinib" • "What about Metformin?" • "Research Aspirin for cancer"
          </p>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
