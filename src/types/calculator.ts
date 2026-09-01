export interface CalculatorHistoryEntry {
  id: string
  expression: string
  result: string
  timestamp: number
}

export type CalculatorMode = 'basic' | 'scientific'
