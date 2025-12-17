import { useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";
import AgentVisualizer, { AgentTask } from "@/components/AgentVisualizer";
import { LogEntry, generateLogs } from "@/components/TerminalLog";
import { DrugData } from "@/data/drugDatabase";

interface Message {
  id: string;
  type: "user" | "agent" | "system";
  content: string;
  isTyping?: boolean;
  showDownload?: boolean;
  drugData?: DrugData;
}

const createAgentData = (
  drug: DrugData
): Array<{
  id: string;
  name: string;
  icon: "scroll" | "flask" | "chart";
  data: string;
  rawJson: string;
  abstract: string;
}> => [
  {
    id: "patents",
    name: "Patent Agent",
    icon: "scroll",
    data: `${drug.patent.id}. Expiry: ${drug.patent.expiry}. Freedom to Operate: ${drug.patent.fto}.`,
    rawJson: JSON.stringify(
      {
        patent_id: drug.patent.id,
        expiry_date: drug.patent.expiry,
        freedom_to_operate: drug.patent.fto,
        jurisdiction: "US",
        status: "granted",
        claims_count: 24,
        api_source: "USPTO PatentsView API v2.1",
      },
      null,
      2
    ),
    abstract: drug.patent.abstract,
  },
  {
    id: "trials",
    name: "Clinical Trials Agent",
    icon: "flask",
    data: `Found ${drug.trials.count} Active ${drug.trials.phase} Trials. Indication: ${drug.trials.indication}.`,
    rawJson: JSON.stringify(
      {
        nct_id: drug.trials.nctId,
        phase: drug.trials.phase,
        status: "recruiting",
        indication: drug.trials.indication,
        enrollment:
          drug.trials.count === 2 ? 420 : drug.trials.count === 5 ? 3000 : 1200,
        primary_endpoint: "Overall Survival",
        api_source: "ClinicalTrials.gov API v2",
      },
      null,
      2
    ),
    abstract: drug.trials.details,
  },
  {
    id: "market",
    name: "Market Data Agent",
    icon: "chart",
    data: `Market Size: ${drug.market.size}. Competition Level: ${drug.market.competition}.`,
    rawJson: JSON.stringify(
      {
        market_size_usd: drug.market.size,
        competition_level: drug.market.competition,
        cagr: drug.market.cagr,
        key_players: drug.market.keyPlayers,
        forecast_period: "2024-2030",
        data_source: "GlobalData Pharma Intelligence",
      },
      null,
      2
    ),
    abstract: `Market analysis indicates a ${
      drug.market.size
    } opportunity with ${drug.market.competition.toLowerCase()} competition. Key market players include ${drug.market.keyPlayers.join(
      ", "
    )}. The compound annual growth rate (CAGR) is projected at ${
      drug.market.cagr
    } through 2030.`,
  },
];

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orchestrationActive, setOrchestrationActive] = useState(false);
  const [masterStatus, setMasterStatus] = useState("");
  const [agents, setAgents] = useState<AgentTask[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setIsProcessing(false);
    setOrchestrationActive(false);
    setMasterStatus("");
    setAgents([]);
    setLogs([]);
  }, []);

  const addLog = useCallback((log: LogEntry) => {
    setLogs((prev) => [...prev, log]);
  }, []);

  const runRealBackendResearch = useCallback(
    async (userMessage: string) => {
      setIsProcessing(true);
      setLogs([]);

      // Step 1: Add user message
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        type: "user",
        content: userMessage,
      };
      setMessages((prev) => [...prev, userMsg]);

      // Step 2: System response - Starting workflow
      await new Promise((resolve) => setTimeout(resolve, 400));
      const systemMsg: Message = {
        id: `system-${Date.now()}`,
        type: "system",
        content: `Master Agent: Analyzing query and initiating real-time research workflow...`,
      };
      setMessages((prev) => [...prev, systemMsg]);

      // Start orchestration
      setOrchestrationActive(true);
      setMasterStatus("Connecting to backend...");

      const timestamp = () =>
        new Date().toLocaleTimeString("en-US", { hour12: false });
      addLog({
        id: "1",
        timestamp: timestamp(),
        message: "Initializing PharmAgent workflow...",
        type: "info",
      });

      try {
        // **REAL BACKEND API CALL**
        addLog({
          id: "2",
          timestamp: timestamp(),
          message: "Connecting to Flask backend...",
          type: "request",
        });

        const response = await fetch("http://127.0.0.1:5000/api/research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: userMessage }),
        });

        if (!response.ok) {
          throw new Error(
            `Backend returned ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Research workflow failed");
        }

        addLog({
          id: "3",
          timestamp: timestamp(),
          message: `Backend connected. Drug detected: ${data.drug}`,
          type: "success",
        });

        // Display backend logs in real-time
        if (data.logs && Array.isArray(data.logs)) {
          data.logs.forEach((log: string, index: number) => {
            addLog({
              id: `backend-${index}`,
              timestamp: timestamp(),
              message: log,
              type: "info",
            });
          });
        }

        // Simulate agent cards appearing (visual only)
        setMasterStatus("Processing worker agents...");

        const agentData = [
          {
            id: "patents",
            name: "Patent Agent",
            icon: "scroll" as const,
            data: data.patent.summary.substring(0, 200) + "...",
            rawJson: JSON.stringify(data.patent, null, 2),
            abstract: data.patent.summary,
          },
          {
            id: "trials",
            name: "Clinical Trials Agent",
            icon: "flask" as const,
            data: data.trials.summary.substring(0, 200) + "...",
            rawJson: JSON.stringify(data.trials, null, 2),
            abstract: data.trials.summary,
          },
          {
            id: "market",
            name: "Market Data Agent",
            icon: "chart" as const,
            data: data.market.summary.substring(0, 200) + "...",
            rawJson: JSON.stringify(data.market, null, 2),
            abstract: data.market.summary,
          },
        ];

        // Add agents with animation
        for (let i = 0; i < agentData.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 600));

          setAgents((prev) => [
            ...prev,
            {
              ...agentData[i],
              status: "running",
            },
          ]);

          await new Promise((resolve) => setTimeout(resolve, 400));

          setAgents((prev) =>
            prev.map((agent) =>
              agent.id === agentData[i].id
                ? { ...agent, status: "success" }
                : agent
            )
          );
        }

        // Synthesis phase
        await new Promise((resolve) => setTimeout(resolve, 400));
        setMasterStatus("Complete");
        addLog({
          id: "final",
          timestamp: timestamp(),
          message: "Analysis complete. Report ready.",
          type: "success",
        });

        // Create DrugData object for PDF download
        const drugData: DrugData = {
          name: data.drug,
          indication: data.indication,
          patent: {
            id: data.patent.id,
            expiry: data.patent.expiry,
            fto: data.patent.fto,
            abstract: data.patent.summary,
          },
          trials: {
            count:
              typeof data.trials.count === "string" ? 0 : data.trials.count,
            phase: data.trials.phase,
            indication: data.trials.indication,
            nctId: data.trials.nctId || "N/A",
            details: data.trials.summary,
          },
          market: {
            size: data.market.size,
            competition: data.market.competition,
            cagr: data.market.cagr,
            keyPlayers: [],
          },
          synthesis: data.synthesis,
        };

        // Final message with real data
        const finalMsg: Message = {
          id: `agent-${Date.now()}`,
          type: "agent",
          content: data.synthesis,
          isTyping: true,
          showDownload: true,
          drugData: drugData,
        };
        setMessages((prev) => [...prev, finalMsg]);
      } catch (error) {
        // Error handling
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";

        addLog({
          id: "error",
          timestamp: timestamp(),
          message: `ERROR: ${errorMessage}`,
          type: "error",
        });

        setMasterStatus("Error");

        const errorMsg: Message = {
          id: `agent-${Date.now()}`,
          type: "agent",
          content: `⚠️ **Backend Connection Failed**\n\n${errorMessage}\n\n**Possible causes:**\n- Flask backend is not running\n- Backend is on different port\n- CORS issues\n\n**To fix:**\n1. Open a terminal\n2. Navigate to backend folder\n3. Run: \`pip install -r requirements.txt\`\n4. Run: \`python app.py\`\n5. Try your query again`,
          isTyping: true,
          showDownload: false,
        };
        setMessages((prev) => [...prev, errorMsg]);
      }

      setIsProcessing(false);
    },
    [addLog]
  );

  const handleSendMessage = useCallback(
    (message: string) => {
      if (!isProcessing) {
        runRealBackendResearch(message);
      }
    },
    [isProcessing, runRealBackendResearch]
  );

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
