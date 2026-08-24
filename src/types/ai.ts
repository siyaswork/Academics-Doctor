/**
 * AI integration interfaces (Step 5, Feature 11).
 *
 * These types describe the shape a future AI assistant integration would use
 * (handwriting recognition, formula solving, explanations, summaries). No
 * implementation exists yet and no network calls are made anywhere in this
 * codebase — `isAvailable` is always `false` and `request` always throws.
 */
export interface AIContext {
  selectedText?: string
  formulaContent?: string
  canvasDataUrl?: string
  mathContent?: string
}

export type AIAction = 'recognize' | 'solve' | 'explain' | 'summarize'

export interface AIServiceInterface {
  isAvailable: false // always false — not implemented
  request: (action: AIAction, context: AIContext) => never
}

/** Placeholder implementation. Calling `request` always throws — see above. */
export const unavailableAIService: AIServiceInterface = {
  isAvailable: false,
  request: () => {
    throw new Error('AI features are not available yet — coming soon.')
  },
}
