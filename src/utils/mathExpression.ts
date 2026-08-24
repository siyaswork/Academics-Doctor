/**
 * A small, safe recursive-descent parser/evaluator for calculator expressions.
 * Deliberately avoids eval()/Function() — every expression is tokenized and
 * walked as an AST before producing a number.
 *
 * Grammar (highest precedence last):
 *   expression := term (('+' | '-') term)*
 *   term       := factor (('*' | '/' | '%') factor)*
 *   factor     := unary ('^' unary)*        // right-assoc power
 *   unary      := ('-' | '+') unary | postfix
 *   postfix    := primary ('!')*            // factorial
 *   primary    := number | constant | IDENT '(' expression ')' | '(' expression ')'
 */

export type AngleUnit = 'deg' | 'rad'

interface Token {
  type: 'number' | 'ident' | 'op' | 'lparen' | 'rparen' | 'comma'
  value: string
}

const IDENT_RE = /[a-zA-Z_]/
const IDENT_CONT_RE = /[a-zA-Z0-9_]/

export function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  while (i < input.length) {
    const ch = input[i]
    if (ch === ' ' || ch === '\t' || ch === '\n') {
      i += 1
      continue
    }
    if (/[0-9.]/.test(ch)) {
      let start = i
      while (i < input.length && /[0-9.]/.test(input[i])) i += 1
      tokens.push({ type: 'number', value: input.slice(start, i) })
      continue
    }
    if (IDENT_RE.test(ch)) {
      let start = i
      while (i < input.length && IDENT_CONT_RE.test(input[i])) i += 1
      tokens.push({ type: 'ident', value: input.slice(start, i) })
      continue
    }
    if (ch === '(') { tokens.push({ type: 'lparen', value: ch }); i += 1; continue }
    if (ch === ')') { tokens.push({ type: 'rparen', value: ch }); i += 1; continue }
    if (ch === ',') { tokens.push({ type: 'comma', value: ch }); i += 1; continue }
    if ('+-*/%^!'.includes(ch)) { tokens.push({ type: 'op', value: ch }); i += 1; continue }
    if (ch === '\u00d7') { tokens.push({ type: 'op', value: '*' }); i += 1; continue }
    if (ch === '\u00f7') { tokens.push({ type: 'op', value: '/' }); i += 1; continue }
    if (ch === '\u03c0') { tokens.push({ type: 'ident', value: 'pi' }); i += 1; continue }
    throw new Error(`Unexpected character "${ch}"`)
  }
  return tokens
}

const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
}

const UNARY_FUNCTIONS = new Set([
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'sqrt', 'abs',
])

class Parser {
  private tokens: Token[]
  private pos = 0
  private angleUnit: AngleUnit

  constructor(tokens: Token[], angleUnit: AngleUnit) {
    this.tokens = tokens
    this.angleUnit = angleUnit
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos]
  }

  private next(): Token | undefined {
    return this.tokens[this.pos++]
  }

  private expect(type: Token['type'], value?: string) {
    const token = this.next()
    if (!token || token.type !== type || (value !== undefined && token.value !== value)) {
      throw new Error('Malformed expression')
    }
  }

  parse(): number {
    if (!this.tokens.length) return 0
    const value = this.parseExpression()
    if (this.pos !== this.tokens.length) throw new Error('Unexpected trailing input')
    return value
  }

  private parseExpression(): number {
    let value = this.parseTerm()
    while (this.peek() && this.peek()!.type === 'op' && (this.peek()!.value === '+' || this.peek()!.value === '-')) {
      const op = this.next()!.value
      const rhs = this.parseTerm()
      value = op === '+' ? value + rhs : value - rhs
    }
    return value
  }

  private parseTerm(): number {
    let value = this.parseFactor()
    while (
      this.peek() &&
      this.peek()!.type === 'op' &&
      (this.peek()!.value === '*' || this.peek()!.value === '/' || this.peek()!.value === '%')
    ) {
      const op = this.next()!.value
      const rhs = this.parseFactor()
      if (op === '*') value = value * rhs
      else if (op === '/') {
        if (rhs === 0) throw new Error('Division by zero')
        value = value / rhs
      } else value = value % rhs
    }
    return value
  }

  private parseFactor(): number {
    const base = this.parseUnary()
    if (this.peek() && this.peek()!.type === 'op' && this.peek()!.value === '^') {
      this.next()
      const exponent = this.parseFactor() // right-associative
      return Math.pow(base, exponent)
    }
    return base
  }

  private parseUnary(): number {
    const token = this.peek()
    if (token && token.type === 'op' && (token.value === '-' || token.value === '+')) {
      this.next()
      const value = this.parseUnary()
      return token.value === '-' ? -value : value
    }
    return this.parsePostfix()
  }

  private parsePostfix(): number {
    let value = this.parsePrimary()
    while (this.peek() && this.peek()!.type === 'op' && this.peek()!.value === '!') {
      this.next()
      value = factorial(value)
    }
    return value
  }

  private parsePrimary(): number {
    const token = this.next()
    if (!token) throw new Error('Unexpected end of expression')

    if (token.type === 'number') {
      const value = parseFloat(token.value)
      if (Number.isNaN(value)) throw new Error('Invalid number')
      return value
    }

    if (token.type === 'lparen') {
      const value = this.parseExpression()
      this.expect('rparen')
      return value
    }

    if (token.type === 'ident') {
      const name = token.value.toLowerCase()
      if (this.peek() && this.peek()!.type === 'lparen') {
        this.next()
        const arg = this.parseExpression()
        this.expect('rparen')
        return applyFunction(name, arg, this.angleUnit)
      }
      if (name in CONSTANTS) return CONSTANTS[name]
      throw new Error(`Unknown identifier "${name}"`)
    }

    throw new Error('Malformed expression')
  }
}

function factorial(n: number): number {
  if (n < 0 || !Number.isFinite(n)) throw new Error('Factorial requires a non-negative number')
  const rounded = Math.round(n)
  if (Math.abs(rounded - n) > 1e-9) throw new Error('Factorial requires an integer')
  let result = 1
  for (let i = 2; i <= rounded; i += 1) result *= i
  return result
}

function applyFunction(name: string, arg: number, angleUnit: AngleUnit): number {
  const toRad = (value: number) => (angleUnit === 'deg' ? (value * Math.PI) / 180 : value)
  const fromRad = (value: number) => (angleUnit === 'deg' ? (value * 180) / Math.PI : value)

  switch (name) {
    case 'sin': return Math.sin(toRad(arg))
    case 'cos': return Math.cos(toRad(arg))
    case 'tan': return Math.tan(toRad(arg))
    case 'asin': return fromRad(Math.asin(arg))
    case 'acos': return fromRad(Math.acos(arg))
    case 'atan': return fromRad(Math.atan(arg))
    case 'log': return Math.log10(arg)
    case 'ln': return Math.log(arg)
    case 'sqrt':
      if (arg < 0) throw new Error('Cannot take sqrt of a negative number')
      return Math.sqrt(arg)
    case 'abs': return Math.abs(arg)
    default:
      throw new Error(`Unknown function "${name}"`)
  }
}

export { UNARY_FUNCTIONS }

/** Evaluate a plain-text expression safely (no eval/Function). Throws on invalid input. */
export function evaluateExpression(expression: string, angleUnit: AngleUnit = 'deg'): number {
  const trimmed = expression.trim()
  if (!trimmed) return 0
  const tokens = tokenize(trimmed)
  const parser = new Parser(tokens, angleUnit)
  const result = parser.parse()
  if (!Number.isFinite(result)) throw new Error('Result is not a finite number')
  return result
}

/** Format a numeric result for display, trimming floating point noise. */
export function formatResult(value: number): string {
  if (!Number.isFinite(value)) return 'Error'
  if (Number.isInteger(value)) return value.toString()
  const rounded = Math.round(value * 1e10) / 1e10
  return rounded.toString()
}

/**
 * Attempt to express a decimal result as a simple fraction (a/b), useful for
 * scientific-mode results. Returns null when no clean fraction is found within
 * a reasonable denominator range.
 */
export function toFraction(value: number, maxDenominator = 1000): string | null {
  if (!Number.isFinite(value) || Number.isInteger(value)) return null
  const sign = value < 0 ? '-' : ''
  const abs = Math.abs(value)
  for (let denominator = 2; denominator <= maxDenominator; denominator += 1) {
    const numerator = abs * denominator
    if (Math.abs(numerator - Math.round(numerator)) < 1e-6) {
      return `${sign}${Math.round(numerator)}/${denominator}`
    }
  }
  return null
}
