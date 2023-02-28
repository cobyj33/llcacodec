// Life 1.05 File Format Spec: https://conwaylife.com/wiki/Life_1.05

const LIFE_105_HEADER = "#Life 1.05" as const
const MAX_DESCRIPTION_LINE_COUNT = 22 as const
const LIFE_105_MAX_LINE_LENGTH = 80 as const

const Life105FileExtensions = [".lif", ".life"] as const;

type LifeRuleData = { birth: number[], survival: number[] }

interface Life105Config {
  descriptions: string | string[],
  rule: string | LifeRuleData | [number[], number[]] | "N#"
}

export function writeLife105File(pattern: (0 | 1)[][], config: Life105Config): string {
  return ""
}

export function readLife105File(): (0 | 1)[][] {
  return []
}

export function hello(): number {
  return 5;
}