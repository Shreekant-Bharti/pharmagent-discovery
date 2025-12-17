import { motion } from 'framer-motion';
import { Plus, MessageSquare, Clock, Brain, ChevronRight, Beaker } from 'lucide-react';

interface SidebarProps {
  onNewChat: () => void;
}

const historyItems = [
  { id: 1, title: 'Alzheimer Repurposing', date: 'Yesterday', icon: Brain },
  { id: 2, title: 'Diabetes Type 2 Analysis', date: '3 days ago', icon: Beaker },
];

const Sidebar = ({ onNewChat }: SidebarProps) => {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-[280px] h-screen bg-slate-50 border-r border-border flex flex-col"
    >
      {/* Logo Section */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Beaker className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">PharmAgent</h1>
            <p className="text-xs text-muted-foreground">AI R&D Co-pilot</p>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <motion.button
          onClick={onNewChat}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-shadow"
        >
          <Plus className="w-4 h-4" />
          New Research
        </motion.button>
      </div>

      {/* Research History */}
      <div className="flex-1 px-4 overflow-y-auto scrollbar-thin">
        <div className="flex items-center gap-2 mb-3 px-1">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Research History
          </span>
        </div>

        <div className="space-y-1">
          {historyItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="sidebar-item sidebar-item-hover cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <item.icon className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700">R&D Strategist</p>
            <p className="text-xs text-muted-foreground truncate">researcher@pharma.io</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
