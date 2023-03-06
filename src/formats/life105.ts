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

interface Life105CellBlock {
    x: number,
    y: number,
    pattern: (0 | 1)[]
}

interface Life105FileData {
    cellBlocks: Life105CellBlock[]
}

// export function writeLife105File(pattern: Life105InputPattern[], config: Life105Config): string {
//     const fileData: number[] = []
//     pushUTFBytes(fileData, LIFE_105_HEADER + "\n");
//     return byteArrayAsString(fileData);
// }

export function readLife105File(): Life105CellBlock[] {
  return []
}

export function hello(): number {
  return 5;
}