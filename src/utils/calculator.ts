const replacements: Array<[RegExp, string]> = [
  [/π/g, 'Math.PI'],
  [/(?<![\w.])e(?![\w(])/g, 'Math.E'],
  [/sin\(/g, 'Math.sin('],
  [/cos\(/g, 'Math.cos('],
  [/tan\(/g, 'Math.tan('],
  [/log\(/g, 'Math.log10('],
  [/ln\(/g, 'Math.log('],
  [/sqrt\(/g, 'Math.sqrt('],
]

const sanitize = (expression: string) => {
  if (!/^[0-9+\-*/%.()\s,^πesincotaqrlgMthPIE]*$/.test(expression)) {
    throw new Error('Unsupported input')
  }
  return replacements.reduce((current, [pattern, value]) => current.replace(pattern, value), expression).replace(/\^/g, '**')
}

export const evaluateExpression = (expression: string) => {
  const prepared = sanitize(expression)
  const result = Function(`"use strict"; return (${prepared})`)() as number
  if (typeof result !== 'number' || Number.isNaN(result) || !Number.isFinite(result)) {
    throw new Error('Invalid expression')
  }
  return Number(result.toFixed(10)).toString()
}
