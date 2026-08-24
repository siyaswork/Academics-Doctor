const isDigit = (value: string) => /[0-9]/.test(value)

const tokenize = (expression: string): string[] => {
  const tokens: string[] = []
  let current = ''

  for (const char of expression.replace(/\s+/g, '')) {
    if (isDigit(char) || char === '.') {
      current += char
      continue
    }

    if (current) {
      tokens.push(current)
      current = ''
    }

    if ('+-*/()%'.includes(char)) {
      tokens.push(char)
      continue
    }

    throw new Error(`Unsupported character: ${char}`)
  }

  if (current) {
    tokens.push(current)
  }

  return tokens
}

class Parser {
  private index = 0

  constructor(private readonly tokens: string[]) {}

  parse(): number {
    const value = this.parseExpression()

    if (this.peek()) {
      throw new Error('Unexpected token')
    }

    return value
  }

  private parseExpression(): number {
    let value = this.parseTerm()

    while (this.peek() === '+' || this.peek() === '-') {
      const operator = this.consume()
      const nextValue = this.parseTerm()
      value = operator === '+' ? value + nextValue : value - nextValue
    }

    return value
  }

  private parseTerm(): number {
    let value = this.parseFactor()

    while (this.peek() === '*' || this.peek() === '/') {
      const operator = this.consume()
      const nextValue = this.parseFactor()

      if (operator === '*') {
        value *= nextValue
      } else {
        if (nextValue === 0) {
          throw new Error('Division by zero')
        }
        value /= nextValue
      }
    }

    return value
  }

  private parseFactor(): number {
    let value: number
    const next = this.peek()

    if (next === '+' || next === '-') {
      const operator = this.consume()
      value = this.parseFactor()
      value = operator === '-' ? -value : value
    } else if (next === '(') {
      this.consume('(')
      value = this.parseExpression()
      this.consume(')')
    } else {
      const token = this.consume()
      const parsed = Number(token)
      if (!Number.isFinite(parsed)) {
        throw new Error('Invalid number')
      }
      value = parsed
    }

    while (this.peek() === '%') {
      this.consume('%')
      value /= 100
    }

    return value
  }

  private peek(): string | undefined {
    return this.tokens[this.index]
  }

  private consume(expected?: string): string {
    const token = this.tokens[this.index]
    if (!token) {
      throw new Error('Unexpected end of expression')
    }

    if (expected && token !== expected) {
      throw new Error(`Expected ${expected}`)
    }

    this.index += 1
    return token
  }
}

export const evaluateExpression = (expression: string): number => {
  const tokens = tokenize(expression)
  if (!tokens.length) {
    throw new Error('Enter an expression')
  }

  return new Parser(tokens).parse()
}
