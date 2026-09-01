import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { Formula } from '../types/formulas'
import { STORAGE_KEYS, readJSON, writeJSON } from '../utils/storage'
import { createId } from '../utils/id'
import { demoFormulas } from '../data/demoFormulas'

export interface FormulaInput {
  name: string
  formula: string
  subject: string
  description?: string
}

interface FormulaContextType {
  formulas: Formula[]
  createFormula: (input: FormulaInput) => Formula
  updateFormula: (id: string, input: FormulaInput) => void
  deleteFormula: (id: string) => void
}

const FormulaContext = createContext<FormulaContextType | undefined>(undefined)

export const FormulaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formulas, setFormulas] = useState<Formula[]>(() => {
    const stored = readJSON<Formula[] | null>(STORAGE_KEYS.formulas, null)
    return stored && stored.length ? stored : demoFormulas
  })

  useEffect(() => {
    writeJSON(STORAGE_KEYS.formulas, formulas)
  }, [formulas])

  const createFormula = useCallback((input: FormulaInput): Formula => {
    const formula: Formula = { id: createId('formula'), createdAt: Date.now(), ...input }
    setFormulas((prev) => [formula, ...prev])
    return formula
  }, [])

  const updateFormula = useCallback((id: string, input: FormulaInput) => {
    setFormulas((prev) => prev.map((item) => (item.id === id ? { ...item, ...input } : item)))
  }, [])

  const deleteFormula = useCallback((id: string) => {
    setFormulas((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const value = useMemo<FormulaContextType>(
    () => ({ formulas, createFormula, updateFormula, deleteFormula }),
    [formulas, createFormula, updateFormula, deleteFormula],
  )

  return <FormulaContext.Provider value={value}>{children}</FormulaContext.Provider>
}

export const useFormulas = () => {
  const context = useContext(FormulaContext)
  if (!context) throw new Error('useFormulas must be used within FormulaProvider')
  return context
}
