import { useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/ChatInterface';
import AgentVisualizer, { AgentTask } from '@/components/AgentVisualizer';
import { LogEntry, generateLogs } from '@/components/TerminalLog';
import { DrugData, detectDrug, fallbackResponse } from '@/data/drugDatabase';

interface Message {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  isTyping?: boolean;
  showDownload?: boolean;
  drugData?: DrugData;
}

const createAgentData = (drug: DrugData): Array<{
  id: string;
  name: string;
  icon: 'scroll' | 'flask' | 'chart';
  data: string;
  rawJson: string;
  abstract: string;
}> => [
  {
    id: 'patents',
    name: 'Patent Agent',
    icon: 'scroll',
    data: `${drug.patent.id}. Expiry: ${drug.patent.expiry}. Freedom to Operate: ${drug.patent.fto}.`,
    rawJson: JSON.stringify({
      patent_id: drug.patent.id,
      expiry_date: drug.patent.expiry,
      freedom_to_operate: drug.patent.fto,
      jurisdiction: 'US',
      status: 'granted',
      claims_count: 24,
      api_source: 'USPTO PatentsView API v2.1',
    }, null, 2),
    abstract: drug.patent.abstract,
  },
  {
    id: 'trials',
    name: 'Clinical Trials Agent',
    icon: 'flask',
    data: `Found ${drug.trials.count} Active ${drug.trials.phase} Trials. Indication: ${drug.trials.indication}.`,
    rawJson: JSON.stringify({
      nct_id: drug.trials.nctId,
      phase: drug.trials.phase,
      status: 'recruiting',
      indication: drug.trials.indication,
      enrollment: drug.trials.count === 2 ? 420 : drug.trials.count === 5 ? 3000 : 1200,
      primary_endpoint: 'Overall Survival',
      api_source: 'ClinicalTrials.gov API v2',
    }, null, 2),
    abstract: drug.trials.details,
  },
  {
    id: 'market',
    name: 'Market Data Agent',
    icon: 'chart',
    data: `Market Size: ${drug.market.size}. Competition Level: ${drug.market.competition}.`,
    rawJson: JSON.stringify({
      market_size_usd: drug.market.size,
      competition_level: drug.market.competition,
      cagr: drug.market.cagr,
      key_players: drug.market.keyPlayers,
      forecast_period: '2024-2030',
      data_source: 'GlobalData Pharma Intelligence',
    }, null, 2),
    abstract: `Market analysis indicates a ${drug.market.size} opportunity with ${drug.market.competition.toLowerCase()} competition. Key market players include ${drug.market.keyPlayers.join(', ')}. The compound annual growth rate (CAGR) is projected at ${drug.market.cagr} through 2030.`,
  },
];

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orchestrationActive, setOrchestrationActive] = useState(false);
  const [masterStatus, setMasterStatus] = useState('');
  const [agents, setAgents] = useState<AgentTask[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setIsProcessing(false);
    setOrchestrationActive(false);
    setMasterStatus('');
    setAgents([]);
    setLogs([]);
  }, []);

  const addLog = useCallback((log: LogEntry) => {
    setLogs(prev => [...prev, log]);
  }, []);

  const runDemoSequence = useCallback(async (userMessage: string) => {
    setIsProcessing(true);
    setLogs([]);
    
    // Step 1: Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: userMessage,
    };
    setMessages(prev => [...prev, userMsg]);

    // Detect drug from query
    const detectedDrug = detectDrug(userMessage);

    // Step 2: System response
    await new Promise(resolve => setTimeout(resolve, 400));
    const systemMsg: Message = {
      id: `system-${Date.now()}`,
      type: 'system',
      content: detectedDrug 
        ? `Master Agent: Intent recognized. Initiating multi-agent workflow for '${detectedDrug.name}'...`
        : "Master Agent: Analyzing query. Unable to identify specific compound...",
    };
    setMessages(prev => [...prev, systemMsg]);

    // Start orchestration
    setOrchestrationActive(true);
    setMasterStatus('Delegating tasks...');

    // Add initial logs
    const timestamp = () => new Date().toLocaleTimeString('en-US', { hour12: false });
    addLog({ id: '1', timestamp: timestamp(), message: 'Initializing PharmAgent workflow...', type: 'info' });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (detectedDrug) {
      addLog({ id: '2', timestamp: timestamp(), message: `Query parsed: "${detectedDrug.name}" compound detected`, type: 'process' });
      
      const agentData = createAgentData(detectedDrug);
      
      // Add agents one by one with faster delays (1.0s instead of 1.5s)
      for (let i = 0; i < agentData.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Add connecting log
        const apiNames = ['USPTO API v2.1', 'ClinicalTrials.gov API', 'market intelligence database'];
        addLog({ 
          id: `connect-${i}`, 
          timestamp: timestamp(), 
          message: `Connecting to ${apiNames[i]}...`, 
          type: 'request' 
        });

        // Show as running
        setAgents(prev => [...prev, {
          ...agentData[i],
          status: 'running',
        }]);

        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Add success log
        const endpoints = [
          `GET /patents/search?q=${detectedDrug.name.toLowerCase()}`,
          `GET /trials/search?intervention=${detectedDrug.name}`,
          'POST /market/analysis'
        ];
        addLog({ 
          id: `success-${i}`, 
          timestamp: timestamp(), 
          message: `${endpoints[i]}... 200 OK`, 
          type: 'success' 
        });

        // Update to success
        setAgents(prev => prev.map(agent => 
          agent.id === agentData[i].id 
            ? { ...agent, status: 'success' }
            : agent
        ));
      }

      // Synthesis phase
      await new Promise(resolve => setTimeout(resolve, 400));
      setMasterStatus('Synthesizing results...');
      addLog({ id: 'nlp', timestamp: timestamp(), message: 'NLP Synthesis Module loaded (GPT-4-turbo)', type: 'process' });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      addLog({ id: 'gen', timestamp: timestamp(), message: 'Generating strategic recommendations...', type: 'process' });
      
      await new Promise(resolve => setTimeout(resolve, 600));
      setMasterStatus('Complete');
      addLog({ id: 'done', timestamp: timestamp(), message: 'Analysis complete. Report ready.', type: 'success' });
      
      // Final message with drug data
      const finalMsg: Message = {
        id: `agent-${Date.now()}`,
        type: 'agent',
        content: detectedDrug.synthesis,
        isTyping: true,
        showDownload: true,
        drugData: detectedDrug,
      };
      setMessages(prev => [...prev, finalMsg]);
    } else {
      // Fallback flow for unrecognized queries
      addLog({ id: '2', timestamp: timestamp(), message: 'Query parsed: No specific compound identified', type: 'process' });
      
      await new Promise(resolve => setTimeout(resolve, 800));
      addLog({ id: '3', timestamp: timestamp(), message: 'Searching compound database...', type: 'request' });
      
      await new Promise(resolve => setTimeout(resolve, 600));
      addLog({ id: '4', timestamp: timestamp(), message: 'No exact match found. Requesting clarification.', type: 'info' });
      
      setMasterStatus('Awaiting clarification');
      
      const fallbackMsg: Message = {
        id: `agent-${Date.now()}`,
        type: 'agent',
        content: fallbackResponse.synthesis,
        isTyping: true,
        showDownload: false,
      };
      setMessages(prev => [...prev, fallbackMsg]);
    }
    
    setIsProcessing(false);
  }, [addLog]);

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
        logs={logs}
      />
    </div>
  );
};

export default Index;
