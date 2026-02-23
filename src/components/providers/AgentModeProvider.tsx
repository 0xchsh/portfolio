'use client';

import { createContext, useContext, useState } from 'react';

interface AgentModeContextType {
  agentMode: boolean;
  toggleAgentMode: () => void;
}

const AgentModeContext = createContext<AgentModeContextType>({
  agentMode: false,
  toggleAgentMode: () => {},
});

export function AgentModeProvider({ children }: { children: React.ReactNode }) {
  const [agentMode, setAgentMode] = useState(false);

  const toggleAgentMode = () => setAgentMode((prev) => !prev);

  return (
    <AgentModeContext.Provider value={{ agentMode, toggleAgentMode }}>
      {children}
    </AgentModeContext.Provider>
  );
}

export function useAgentMode() {
  return useContext(AgentModeContext);
}
