import type { Formula } from '../types/formulas'

/** Small, curated seed list — this is a study aid, not a formula database. */
export const demoFormulas: Formula[] = [
  {
    id: 'formula-quadratic',
    name: 'Quadratic Formula',
    formula: 'x = (-b ± √(b² - 4ac)) / 2a',
    subject: 'math',
    description: 'Solves for x in ax² + bx + c = 0.',
    createdAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'formula-newton-second-law',
    name: "Newton's Second Law",
    formula: 'F = ma',
    subject: 'science',
    description: 'Force equals mass times acceleration.',
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'formula-area-circle',
    name: 'Area of a Circle',
    formula: 'A = πr²',
    subject: 'math',
    description: 'Area from radius r.',
    createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'formula-photosynthesis',
    name: 'Photosynthesis',
    formula: '6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂',
    subject: 'science',
    description: 'Converts carbon dioxide and water into glucose and oxygen.',
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
]
