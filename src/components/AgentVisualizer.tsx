import { motion, AnimatePresence } from 'framer-motion';
import { Scroll, FlaskConical, BarChart3, CheckCircle2, Loader2, Cpu, Zap } from 'lucide-react';

export interface AgentTask {
  id: string;
  name: string;
  icon: 'scroll' | 'flask' | 'chart';
  status: 'pending' | 'running' | 'success';
  data?: string;
}

interface AgentVisualizerProps {
  isActive: boolean;
  masterStatus: string;
  agents: AgentTask[];
}

const iconMap = {
  scroll: Scroll,
  flask: FlaskConical,
  chart: BarChart3,
};

const AgentVisualizer = ({ isActive, masterStatus, agents }: AgentVisualizerProps) => {
  return (
    <motion.aside
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-[360px] h-screen bg-slate-50 border-l border-border flex flex-col"
    >
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">Live Orchestration</h2>
            <p className="text-xs text-muted-foreground">Agent Workflow Monitor</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 overflow-y-auto scrollbar-thin">
        <AnimatePresence mode="wait">
          {!isActive ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground max-w-[200px]">
                Agent workflow will appear here when you start a research query
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Master Agent Status */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="agent-card border-primary/20 bg-primary/5"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                      <Cpu className="w-5 h-5 text-primary-foreground" />
                    </div>
                    {masterStatus !== 'Complete' && (
                      <div className="absolute inset-0 rounded-xl bg-primary/30 animate-pulse-ring" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">Master Agent</p>
                    <p className="text-xs text-primary font-medium">{masterStatus}</p>
                  </div>
                  {masterStatus !== 'Complete' ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spinner" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  )}
                </div>
              </motion.div>

              {/* Worker Agents */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
                  Worker Agents
                </p>
                
                <AnimatePresence>
                  {agents.map((agent, index) => {
                    const IconComponent = iconMap[agent.icon];
                    return (
                      <motion.div
                        key={agent.id}
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ 
                          duration: 0.4, 
                          ease: "easeOut",
                          delay: index * 0.1 
                        }}
                        className="agent-card"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            agent.status === 'success' 
                              ? 'bg-success/10' 
                              : agent.status === 'running' 
                                ? 'bg-primary/10' 
                                : 'bg-secondary'
                          }`}>
                            <IconComponent className={`w-5 h-5 ${
                              agent.status === 'success' 
                                ? 'text-success' 
                                : agent.status === 'running' 
                                  ? 'text-primary' 
                                  : 'text-muted-foreground'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-semibold text-slate-800">{agent.name}</p>
                              {agent.status === 'success' ? (
                                <span className="text-xs font-medium text-success flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Success
                                </span>
                              ) : agent.status === 'running' ? (
                                <span className="text-xs font-medium text-primary flex items-center gap-1">
                                  <Loader2 className="w-3.5 h-3.5 animate-spinner" />
                                  Running
                                </span>
                              ) : null}
                            </div>
                            {agent.data && (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-xs text-muted-foreground leading-relaxed"
                              >
                                {agent.data}
                              </motion.p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};

export default AgentVisualizer;
