export const currency = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const percent = (v: number) => `${(v * 100).toFixed(1)}%`
