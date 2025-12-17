import { useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/ChatInterface';
import AgentVisualizer, { AgentTask } from '@/components/AgentVisualizer';

interface Message {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  isTyping?: boolean;
  showDownload?: boolean;
}

const AGENT_DATA = [
  {
    id: 'patents',
    name: 'Patent Agent',
    icon: 'scroll' as const,
    data: 'US Patent 6,123,456. Expiry: 2026. Freedom to Operate: High.',
  },
  {
    id: 'trials',
    name: 'Clinical Trials Agent',
    icon: 'flask' as const,
    data: 'Found 2 Active Phase III Trials. Indication: Glioblastoma Multiforme.',
  },
  {
    id: 'market',
    name: 'Market Data Agent',
    icon: 'chart' as const,
    data: 'Market Size: $450M. Competition Level: Moderate.',
  },
];

const FINAL_SYNTHESIS = "Based on the analysis, Gefitinib shows strong repurposing potential for Glioblastoma. The patent window allows for 3 years of exclusivity, and clinical trials suggest efficacy. Key findings include favorable freedom-to-operate status, active Phase III trials demonstrating clinical interest, and a substantial market opportunity with moderate competition.";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orchestrationActive, setOrchestrationActive] = useState(false);
  const [masterStatus, setMasterStatus] = useState('');
  const [agents, setAgents] = useState<AgentTask[]>([]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setIsProcessing(false);
    setOrchestrationActive(false);
    setMasterStatus('');
    setAgents([]);
  }, []);

  const runDemoSequence = useCallback(async (userMessage: string) => {
    setIsProcessing(true);
    
    // Step 1: Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: userMessage,
    };
    setMessages(prev => [...prev, userMsg]);

    // Step 2: System response (after 500ms)
    await new Promise(resolve => setTimeout(resolve, 500));
    const systemMsg: Message = {
      id: `system-${Date.now()}`,
      type: 'system',
      content: "Master Agent: Intent recognized. Initiating multi-agent workflow for 'Gefitinib'...",
    };
    setMessages(prev => [...prev, systemMsg]);

    // Step 3: Start orchestration animation
    setOrchestrationActive(true);
    setMasterStatus('Delegating tasks...');

    // Step 4: Add agents one by one with delays
    for (let i = 0; i < AGENT_DATA.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // First show as running
      setAgents(prev => [...prev, {
        ...AGENT_DATA[i],
        status: 'running',
      }]);

      // Then update to success after 800ms
      await new Promise(resolve => setTimeout(resolve, 800));
      setAgents(prev => prev.map(agent => 
        agent.id === AGENT_DATA[i].id 
          ? { ...agent, status: 'success' }
          : agent
      ));
    }

    // Step 5: Update master status
    await new Promise(resolve => setTimeout(resolve, 500));
    setMasterStatus('Synthesizing results...');

    // Step 6: Add final synthesis message
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMasterStatus('Complete');
    
    const finalMsg: Message = {
      id: `agent-${Date.now()}`,
      type: 'agent',
      content: FINAL_SYNTHESIS,
      isTyping: true,
      showDownload: true,
    };
    setMessages(prev => [...prev, finalMsg]);
    
    setIsProcessing(false);
  }, []);

  const handleSendMessage = useCallback((message: string) => {
    if (!isProcessing) {
      runDemoSequence(message);
    }
  }, [isProcessing, runDemoSequence]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar onNewChat={resetChat} />
      <ChatInterface 
        messages={messages}
        onSendMessage={handleSendMessage}
        isProcessing={isProcessing}
      />
      <AgentVisualizer 
        isActive={orchestrationActive}
        masterStatus={masterStatus}
        agents={agents}
      />
    </div>
  );
};

export default Index;
