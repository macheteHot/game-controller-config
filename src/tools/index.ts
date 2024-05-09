export function rgbToHex(r: number, g: number, b: number) {
  const toHex = (c: number) => {
    const hex = Math.round(c).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function mapValue(
  value: number,
  minInput: number,
  maxInput: number,
  minOutput: number,
  maxOutput: number
) {
  const normalizedValue = (value - minInput) / (maxInput - minInput)
  const mappedValue = minOutput + normalizedValue * (maxOutput - minOutput)
  return mappedValue
}

export function parseHexColor(color: string) {
  let hex = color.replace('#', '')
  if (hex.length === 3) {
    hex = hex.replace(/./g, '$&$&')
  }
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16)
  }
}

export function linearInterpolationColor(
  color1: string,
  color2: string,
  num: number,
  minNum: number,
  maxNum: number
) {
  num = Math.max(0, Math.min(num, Math.sqrt(2)))
  // 解析颜色值
  const c1 = parseHexColor(color1)
  const c2 = parseHexColor(color2)
  const r = c1.r + (c2.r - c1.r) * ((num - minNum) / (maxNum - minNum))
  const g = c1.g + (c2.g - c1.g) * ((num - minNum) / (maxNum - minNum))
  const b = c1.b + (c2.b - c1.b) * ((num - minNum) / (maxNum - minNum))
  return rgbToHex(r, g, b)
}

export function hexToRgba(str: string, a = 1) {
  const { r, g, b } = parseHexColor(str)
  return `rgba(${r},${g},${b},${a})`
}
