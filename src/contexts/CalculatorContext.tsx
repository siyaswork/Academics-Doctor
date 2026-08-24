import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { CalculatorHistoryEntry } from '../types/calculator'
import type { RichTextContent } from '../types/notes'
import { STORAGE_KEYS, readJSON, writeJSON } from '../utils/storage'
import { createId } from '../utils/id'

const MAX_HISTORY = 50

type InsertHandler = (text: string) => void
type BlockInsertHandler = (block: RichTextContent) => void

interface CalculatorContextType {
  isOpen: boolean
  openCalculator: (expression?: string) => void
  closeCalculator: () => void
  history: CalculatorHistoryEntry[]
  addHistoryEntry: (expression: string, result: string) => void
  clearHistory: () => void
  pendingExpression: string
  setPendingExpression: (value: string) => void
  /** Registers the "insert text into current note" handler for whichever editor is active. */
  registerInsertHandler: (handler: InsertHandler | null) => void
  insertIntoNote: (text: string) => boolean
  /** Registers the "insert block (e.g. a formula) into current note" handler. */
  registerBlockInsertHandler: (handler: BlockInsertHandler | null) => void
  insertBlockIntoNote: (block: RichTextContent) => boolean
  hasInsertTarget: boolean
  reuseResult: (entry: CalculatorHistoryEntry) => void
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined)

export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [pendingExpression, setPendingExpression] = useState('')
  const [history, setHistory] = useState<CalculatorHistoryEntry[]>(() =>
    readJSON<CalculatorHistoryEntry[]>(STORAGE_KEYS.calcHistory, []),
  )
  const [hasInsertTarget, setHasInsertTarget] = useState(false)
  const insertHandlerRef = useRef<InsertHandler | null>(null)
  const blockInsertHandlerRef = useRef<BlockInsertHandler | null>(null)

  useEffect(() => {
    writeJSON(STORAGE_KEYS.calcHistory, history)
  }, [history])

  const openCalculator = useCallback((expression?: string) => {
    if (expression !== undefined) setPendingExpression(expression)
    setIsOpen(true)
  }, [])

  const closeCalculator = useCallback(() => setIsOpen(false), [])

  const addHistoryEntry = useCallback((expression: string, result: string) => {
    if (!expression.trim()) return
    setHistory((prev) => {
      const entry: CalculatorHistoryEntry = { id: createId('calc'), expression, result, timestamp: Date.now() }
      return [entry, ...prev].slice(0, MAX_HISTORY)
    })
  }, [])

  const clearHistory = useCallback(() => setHistory([]), [])

  const registerInsertHandler = useCallback((handler: InsertHandler | null) => {
    insertHandlerRef.current = handler
    setHasInsertTarget(Boolean(handler))
  }, [])

  const insertIntoNote = useCallback((text: string) => {
    if (!insertHandlerRef.current) return false
    insertHandlerRef.current(text)
    return true
  }, [])

  const registerBlockInsertHandler = useCallback((handler: BlockInsertHandler | null) => {
    blockInsertHandlerRef.current = handler
  }, [])

  const insertBlockIntoNote = useCallback((block: RichTextContent) => {
    if (!blockInsertHandlerRef.current) return false
    blockInsertHandlerRef.current(block)
    return true
  }, [])

  const reuseResult = useCallback((entry: CalculatorHistoryEntry) => {
    openCalculator(entry.result)
  }, [openCalculator])

  const value = useMemo<CalculatorContextType>(
    () => ({
      isOpen,
      openCalculator,
      closeCalculator,
      history,
      addHistoryEntry,
      clearHistory,
      pendingExpression,
      setPendingExpression,
      registerInsertHandler,
      insertIntoNote,
      registerBlockInsertHandler,
      insertBlockIntoNote,
      hasInsertTarget,
      reuseResult,
    }),
    [
      isOpen,
      openCalculator,
      closeCalculator,
      history,
      addHistoryEntry,
      clearHistory,
      pendingExpression,
      registerInsertHandler,
      insertIntoNote,
      registerBlockInsertHandler,
      insertBlockIntoNote,
      hasInsertTarget,
      reuseResult,
    ],
  )

  return <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>
}

export const useCalculator = () => {
  const context = useContext(CalculatorContext)
  if (!context) throw new Error('useCalculator must be used within CalculatorProvider')
  return context
}

