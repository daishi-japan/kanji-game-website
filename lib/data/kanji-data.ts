// 小学1年生で習う漢字のモックデータ

export interface KanjiData {
  id: string
  character: string // 漢字
  reading: string // 正しい読み方（ひらがな）
  wrongReadings: string[] // 不正解の選択肢（2つ）
  meaning: string // 意味
  grade: number // 学年
}

// 小学1年生の漢字（80字）から抜粋
export const kanjiDatabase: KanjiData[] = [
  // ステージ1: 基本の漢字（数字・方向）
  {
    id: 'kanji_001',
    character: '一',
    reading: 'いち',
    wrongReadings: ['に', 'さん'],
    meaning: '数の1',
    grade: 1,
  },
  {
    id: 'kanji_002',
    character: '二',
    reading: 'に',
    wrongReadings: ['いち', 'さん'],
    meaning: '数の2',
    grade: 1,
  },
  {
    id: 'kanji_003',
    character: '三',
    reading: 'さん',
    wrongReadings: ['に', 'し'],
    meaning: '数の3',
    grade: 1,
  },
  {
    id: 'kanji_004',
    character: '四',
    reading: 'し',
    wrongReadings: ['さん', 'ご'],
    meaning: '数の4',
    grade: 1,
  },
  {
    id: 'kanji_005',
    character: '五',
    reading: 'ご',
    wrongReadings: ['し', 'ろく'],
    meaning: '数の5',
    grade: 1,
  },
  {
    id: 'kanji_006',
    character: '六',
    reading: 'ろく',
    wrongReadings: ['ご', 'なな'],
    meaning: '数の6',
    grade: 1,
  },
  {
    id: 'kanji_007',
    character: '七',
    reading: 'なな',
    wrongReadings: ['ろく', 'はち'],
    meaning: '数の7',
    grade: 1,
  },
  {
    id: 'kanji_008',
    character: '八',
    reading: 'はち',
    wrongReadings: ['なな', 'きゅう'],
    meaning: '数の8',
    grade: 1,
  },
  {
    id: 'kanji_009',
    character: '九',
    reading: 'きゅう',
    wrongReadings: ['はち', 'じゅう'],
    meaning: '数の9',
    grade: 1,
  },
  {
    id: 'kanji_010',
    character: '十',
    reading: 'じゅう',
    wrongReadings: ['きゅう', 'ひゃく'],
    meaning: '数の10',
    grade: 1,
  },

  // ステージ2: 自然・身の回り
  {
    id: 'kanji_011',
    character: '日',
    reading: 'ひ',
    wrongReadings: ['つき', 'ほし'],
    meaning: '太陽',
    grade: 1,
  },
  {
    id: 'kanji_012',
    character: '月',
    reading: 'つき',
    wrongReadings: ['ひ', 'ほし'],
    meaning: '月',
    grade: 1,
  },
  {
    id: 'kanji_013',
    character: '火',
    reading: 'ひ',
    wrongReadings: ['みず', 'つち'],
    meaning: '火',
    grade: 1,
  },
  {
    id: 'kanji_014',
    character: '水',
    reading: 'みず',
    wrongReadings: ['ひ', 'つち'],
    meaning: '水',
    grade: 1,
  },
  {
    id: 'kanji_015',
    character: '木',
    reading: 'き',
    wrongReadings: ['はな', 'くさ'],
    meaning: '木',
    grade: 1,
  },
  {
    id: 'kanji_016',
    character: '金',
    reading: 'きん',
    wrongReadings: ['ぎん', 'どう'],
    meaning: '金（きん）',
    grade: 1,
  },
  {
    id: 'kanji_017',
    character: '土',
    reading: 'つち',
    wrongReadings: ['いし', 'すな'],
    meaning: '土',
    grade: 1,
  },
  {
    id: 'kanji_018',
    character: '山',
    reading: 'やま',
    wrongReadings: ['かわ', 'うみ'],
    meaning: '山',
    grade: 1,
  },
  {
    id: 'kanji_019',
    character: '川',
    reading: 'かわ',
    wrongReadings: ['やま', 'うみ'],
    meaning: '川',
    grade: 1,
  },
  {
    id: 'kanji_020',
    character: '空',
    reading: 'そら',
    wrongReadings: ['くも', 'あめ'],
    meaning: '空',
    grade: 1,
  },

  // ステージ3: 生き物・人
  {
    id: 'kanji_021',
    character: '人',
    reading: 'ひと',
    wrongReadings: ['いぬ', 'ねこ'],
    meaning: '人',
    grade: 1,
  },
  {
    id: 'kanji_022',
    character: '男',
    reading: 'おとこ',
    wrongReadings: ['おんな', 'こども'],
    meaning: '男の人',
    grade: 1,
  },
  {
    id: 'kanji_023',
    character: '女',
    reading: 'おんな',
    wrongReadings: ['おとこ', 'こども'],
    meaning: '女の人',
    grade: 1,
  },
  {
    id: 'kanji_024',
    character: '子',
    reading: 'こ',
    wrongReadings: ['おや', 'あかちゃん'],
    meaning: '子ども',
    grade: 1,
  },
  {
    id: 'kanji_025',
    character: '目',
    reading: 'め',
    wrongReadings: ['みみ', 'はな'],
    meaning: '目',
    grade: 1,
  },
  {
    id: 'kanji_026',
    character: '耳',
    reading: 'みみ',
    wrongReadings: ['め', 'くち'],
    meaning: '耳',
    grade: 1,
  },
  {
    id: 'kanji_027',
    character: '口',
    reading: 'くち',
    wrongReadings: ['め', 'はな'],
    meaning: '口',
    grade: 1,
  },
  {
    id: 'kanji_028',
    character: '手',
    reading: 'て',
    wrongReadings: ['あし', 'ゆび'],
    meaning: '手',
    grade: 1,
  },
  {
    id: 'kanji_029',
    character: '足',
    reading: 'あし',
    wrongReadings: ['て', 'ゆび'],
    meaning: '足',
    grade: 1,
  },
  {
    id: 'kanji_030',
    character: '犬',
    reading: 'いぬ',
    wrongReadings: ['ねこ', 'とり'],
    meaning: '犬',
    grade: 1,
  },
]

// ステージ定義
export interface Stage {
  id: string
  name: string
  description: string
  kanjiIds: string[]
  difficulty: 'easy' | 'normal' | 'hard'
  requiredScore: number // クリアに必要なスコア
}

export const stages: Stage[] = [
  {
    id: 'stage_001',
    name: 'ステージ1',
    description: 'かずの かんじ',
    kanjiIds: ['kanji_001', 'kanji_002', 'kanji_003', 'kanji_004', 'kanji_005'],
    difficulty: 'easy',
    requiredScore: 400, // 5問 x 100点 = 500点満点、80%でクリア
  },
  {
    id: 'stage_002',
    name: 'ステージ2',
    description: 'しぜんの かんじ',
    kanjiIds: ['kanji_011', 'kanji_012', 'kanji_013', 'kanji_014', 'kanji_015'],
    difficulty: 'easy',
    requiredScore: 400,
  },
  {
    id: 'stage_003',
    name: 'ステージ3',
    description: 'いきものの かんじ',
    kanjiIds: ['kanji_021', 'kanji_022', 'kanji_023', 'kanji_024', 'kanji_025'],
    difficulty: 'normal',
    requiredScore: 400,
  },
]

// ヘルパー関数
export function getKanjiById(id: string): KanjiData | undefined {
  return kanjiDatabase.find((kanji) => kanji.id === id)
}

export function getStageById(id: string): Stage | undefined {
  return stages.find((stage) => stage.id === id)
}

export function getKanjisByStage(stageId: string): KanjiData[] {
  const stage = getStageById(stageId)
  if (!stage) return []

  return stage.kanjiIds
    .map((id) => getKanjiById(id))
    .filter((kanji): kanji is KanjiData => kanji !== undefined)
}

// 3択問題を生成する関数
export function generateChoices(kanji: KanjiData): string[] {
  const choices = [kanji.reading, ...kanji.wrongReadings]
  // シャッフル（Fisher-Yates algorithm）
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[choices[i], choices[j]] = [choices[j], choices[i]]
  }
  return choices
}
