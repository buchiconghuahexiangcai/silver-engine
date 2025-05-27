export interface ArgumentHistory {
  opponentWords: string;
  intensity: number;
  responses: string[];
  timestamp: string;
}

const HISTORY_KEY = 'argument-history';

export function saveArgumentToHistory(argument: ArgumentHistory): void {
  if (typeof window === 'undefined') return;
  
  try {
    const historyString = localStorage.getItem(HISTORY_KEY);
    const history: ArgumentHistory[] = historyString 
      ? JSON.parse(historyString) 
      : [];
    
    history.unshift(argument); // Add new argument at the beginning
    
    // Keep only the 10 most recent arguments
    const trimmedHistory = history.slice(0, 10);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

export function getArgumentHistory(): ArgumentHistory[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const historyString = localStorage.getItem(HISTORY_KEY);
    return historyString ? JSON.parse(historyString) : [];
  } catch (error) {
    console.error("Error retrieving from localStorage:", error);
    return [];
  }
}

export function clearArgumentHistory(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}