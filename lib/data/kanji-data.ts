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

  // 2年生の漢字
  {
    id: 'kanji_101',
    character: '引',
    reading: 'ひく',
    wrongReadings: ['おす', 'はこぶ'],
    meaning: '引っ張る',
    grade: 2,
  },
  {
    id: 'kanji_102',
    character: '羽',
    reading: 'はね',
    wrongReadings: ['つばさ', 'とぶ'],
    meaning: '鳥の羽',
    grade: 2,
  },
  {
    id: 'kanji_103',
    character: '雲',
    reading: 'くも',
    wrongReadings: ['あめ', 'ゆき'],
    meaning: '雲',
    grade: 2,
  },
  {
    id: 'kanji_104',
    character: '園',
    reading: 'えん',
    wrongReadings: ['にわ', 'はたけ'],
    meaning: '庭園',
    grade: 2,
  },
  {
    id: 'kanji_105',
    character: '遠',
    reading: 'とおい',
    wrongReadings: ['ちかい', 'ひろい'],
    meaning: '遠い',
    grade: 2,
  },
  {
    id: 'kanji_106',
    character: '何',
    reading: 'なに',
    wrongReadings: ['だれ', 'どこ'],
    meaning: '何',
    grade: 2,
  },
  {
    id: 'kanji_107',
    character: '科',
    reading: 'か',
    wrongReadings: ['もく', 'るい'],
    meaning: '科目',
    grade: 2,
  },
  {
    id: 'kanji_108',
    character: '夏',
    reading: 'なつ',
    wrongReadings: ['はる', 'あき'],
    meaning: '夏',
    grade: 2,
  },
  {
    id: 'kanji_109',
    character: '家',
    reading: 'いえ',
    wrongReadings: ['うち', 'や'],
    meaning: '家',
    grade: 2,
  },
  {
    id: 'kanji_110',
    character: '歌',
    reading: 'うた',
    wrongReadings: ['おど', 'かな'],
    meaning: '歌',
    grade: 2,
  },
  {
    id: 'kanji_111',
    character: '画',
    reading: 'が',
    wrongReadings: ['え', 'ず'],
    meaning: '絵画',
    grade: 2,
  },
  {
    id: 'kanji_112',
    character: '回',
    reading: 'かい',
    wrongReadings: ['まわる', 'めぐる'],
    meaning: '回る',
    grade: 2,
  },
  {
    id: 'kanji_113',
    character: '会',
    reading: 'かい',
    wrongReadings: ['あう', 'あつまる'],
    meaning: '会う',
    grade: 2,
  },
  {
    id: 'kanji_114',
    character: '海',
    reading: 'うみ',
    wrongReadings: ['かわ', 'みずうみ'],
    meaning: '海',
    grade: 2,
  },
  {
    id: 'kanji_115',
    character: '絵',
    reading: 'え',
    wrongReadings: ['が', 'ず'],
    meaning: '絵',
    grade: 2,
  },
  {
    id: 'kanji_116',
    character: '外',
    reading: 'そと',
    wrongReadings: ['うち', 'なか'],
    meaning: '外',
    grade: 2,
  },
  {
    id: 'kanji_117',
    character: '角',
    reading: 'かど',
    wrongReadings: ['つの', 'すみ'],
    meaning: '角',
    grade: 2,
  },
  {
    id: 'kanji_118',
    character: '楽',
    reading: 'たのしい',
    wrongReadings: ['うれしい', 'おもしろい'],
    meaning: '楽しい',
    grade: 2,
  },
  {
    id: 'kanji_119',
    character: '活',
    reading: 'かつ',
    wrongReadings: ['いきる', 'うごく'],
    meaning: '活動',
    grade: 2,
  },
  {
    id: 'kanji_120',
    character: '間',
    reading: 'あいだ',
    wrongReadings: ['ま', 'とき'],
    meaning: '間',
    grade: 2,
  },

  // 3年生の漢字
  {
    id: 'kanji_201',
    character: '悪',
    reading: 'わるい',
    wrongReadings: ['よい', 'きたない'],
    meaning: '悪い',
    grade: 3,
  },
  {
    id: 'kanji_202',
    character: '安',
    reading: 'やすい',
    wrongReadings: ['たかい', 'ひくい'],
    meaning: '安い',
    grade: 3,
  },
  {
    id: 'kanji_203',
    character: '暗',
    reading: 'くらい',
    wrongReadings: ['あかるい', 'くろい'],
    meaning: '暗い',
    grade: 3,
  },
  {
    id: 'kanji_204',
    character: '医',
    reading: 'い',
    wrongReadings: ['びょう', 'やく'],
    meaning: '医者',
    grade: 3,
  },
  {
    id: 'kanji_205',
    character: '委',
    reading: 'い',
    wrongReadings: ['まかせる', 'たのむ'],
    meaning: '委員',
    grade: 3,
  },
  {
    id: 'kanji_206',
    character: '意',
    reading: 'い',
    wrongReadings: ['こころ', 'おもう'],
    meaning: '意味',
    grade: 3,
  },
  {
    id: 'kanji_207',
    character: '育',
    reading: 'そだてる',
    wrongReadings: ['うまれる', 'のびる'],
    meaning: '育てる',
    grade: 3,
  },
  {
    id: 'kanji_208',
    character: '員',
    reading: 'いん',
    wrongReadings: ['ひと', 'かず'],
    meaning: '委員',
    grade: 3,
  },
  {
    id: 'kanji_209',
    character: '院',
    reading: 'いん',
    wrongReadings: ['やかた', 'いえ'],
    meaning: '病院',
    grade: 3,
  },
  {
    id: 'kanji_210',
    character: '飲',
    reading: 'のむ',
    wrongReadings: ['たべる', 'くう'],
    meaning: '飲む',
    grade: 3,
  },
  {
    id: 'kanji_211',
    character: '運',
    reading: 'はこぶ',
    wrongReadings: ['もつ', 'とぶ'],
    meaning: '運ぶ',
    grade: 3,
  },
  {
    id: 'kanji_212',
    character: '泳',
    reading: 'およぐ',
    wrongReadings: ['あるく', 'はしる'],
    meaning: '泳ぐ',
    grade: 3,
  },
  {
    id: 'kanji_213',
    character: '駅',
    reading: 'えき',
    wrongReadings: ['でんしゃ', 'みち'],
    meaning: '駅',
    grade: 3,
  },
  {
    id: 'kanji_214',
    character: '央',
    reading: 'おう',
    wrongReadings: ['まんなか', 'ちゅう'],
    meaning: '中央',
    grade: 3,
  },
  {
    id: 'kanji_215',
    character: '横',
    reading: 'よこ',
    wrongReadings: ['たて', 'ななめ'],
    meaning: '横',
    grade: 3,
  },
  {
    id: 'kanji_216',
    character: '屋',
    reading: 'や',
    wrongReadings: ['いえ', 'うち'],
    meaning: '屋根',
    grade: 3,
  },
  {
    id: 'kanji_217',
    character: '温',
    reading: 'あたたかい',
    wrongReadings: ['あつい', 'つめたい'],
    meaning: '温かい',
    grade: 3,
  },
  {
    id: 'kanji_218',
    character: '化',
    reading: 'か',
    wrongReadings: ['ばける', 'かわる'],
    meaning: '変化',
    grade: 3,
  },
  {
    id: 'kanji_219',
    character: '荷',
    reading: 'に',
    wrongReadings: ['もつ', 'にもつ'],
    meaning: '荷物',
    grade: 3,
  },
  {
    id: 'kanji_220',
    character: '界',
    reading: 'かい',
    wrongReadings: ['せかい', 'さかい'],
    meaning: '世界',
    grade: 3,
  },

  // 4年生の漢字
  {
    id: 'kanji_301',
    character: '愛',
    reading: 'あい',
    wrongReadings: ['こい', 'すき'],
    meaning: '愛',
    grade: 4,
  },
  {
    id: 'kanji_302',
    character: '案',
    reading: 'あん',
    wrongReadings: ['かんがえ', 'あんない'],
    meaning: '案内',
    grade: 4,
  },
  {
    id: 'kanji_303',
    character: '以',
    reading: 'い',
    wrongReadings: ['も', 'より'],
    meaning: '以上',
    grade: 4,
  },
  {
    id: 'kanji_304',
    character: '衣',
    reading: 'ころも',
    wrongReadings: ['きもの', 'ふく'],
    meaning: '衣服',
    grade: 4,
  },
  {
    id: 'kanji_305',
    character: '位',
    reading: 'くらい',
    wrongReadings: ['ば', 'じゅん'],
    meaning: '位置',
    grade: 4,
  },
  {
    id: 'kanji_306',
    character: '囲',
    reading: 'かこむ',
    wrongReadings: ['まわる', 'めぐる'],
    meaning: '囲む',
    grade: 4,
  },
  {
    id: 'kanji_307',
    character: '胃',
    reading: 'い',
    wrongReadings: ['はら', 'おなか'],
    meaning: '胃',
    grade: 4,
  },
  {
    id: 'kanji_308',
    character: '印',
    reading: 'いん',
    wrongReadings: ['しるし', 'はん'],
    meaning: '印鑑',
    grade: 4,
  },
  {
    id: 'kanji_309',
    character: '英',
    reading: 'えい',
    wrongReadings: ['はな', 'すぐれる'],
    meaning: '英語',
    grade: 4,
  },
  {
    id: 'kanji_310',
    character: '栄',
    reading: 'さかえる',
    wrongReadings: ['はえる', 'のびる'],
    meaning: '栄える',
    grade: 4,
  },
  {
    id: 'kanji_311',
    character: '塩',
    reading: 'しお',
    wrongReadings: ['さとう', 'す'],
    meaning: '塩',
    grade: 4,
  },
  {
    id: 'kanji_312',
    character: '億',
    reading: 'おく',
    wrongReadings: ['まん', 'せん'],
    meaning: '億',
    grade: 4,
  },
  {
    id: 'kanji_313',
    character: '加',
    reading: 'くわえる',
    wrongReadings: ['たす', 'ふやす'],
    meaning: '加える',
    grade: 4,
  },
  {
    id: 'kanji_314',
    character: '果',
    reading: 'か',
    wrongReadings: ['くだもの', 'み'],
    meaning: '果物',
    grade: 4,
  },
  {
    id: 'kanji_315',
    character: '貨',
    reading: 'か',
    wrongReadings: ['かね', 'もの'],
    meaning: '貨物',
    grade: 4,
  },
  {
    id: 'kanji_316',
    character: '課',
    reading: 'か',
    wrongReadings: ['もく', 'ぶもん'],
    meaning: '課題',
    grade: 4,
  },
  {
    id: 'kanji_317',
    character: '芽',
    reading: 'め',
    wrongReadings: ['は', 'ね'],
    meaning: '芽',
    grade: 4,
  },
  {
    id: 'kanji_318',
    character: '賀',
    reading: 'が',
    wrongReadings: ['いわう', 'よろこぶ'],
    meaning: '祝賀',
    grade: 4,
  },
  {
    id: 'kanji_319',
    character: '改',
    reading: 'あらためる',
    wrongReadings: ['かえる', 'なおす'],
    meaning: '改める',
    grade: 4,
  },
  {
    id: 'kanji_320',
    character: '械',
    reading: 'かい',
    wrongReadings: ['きかい', 'どうぐ'],
    meaning: '機械',
    grade: 4,
  },

  // 5年生の漢字
  {
    id: 'kanji_401',
    character: '圧',
    reading: 'あつ',
    wrongReadings: ['おす', 'おさえる'],
    meaning: '圧力',
    grade: 5,
  },
  {
    id: 'kanji_402',
    character: '移',
    reading: 'うつる',
    wrongReadings: ['かわる', 'いく'],
    meaning: '移動',
    grade: 5,
  },
  {
    id: 'kanji_403',
    character: '因',
    reading: 'いん',
    wrongReadings: ['もと', 'げんいん'],
    meaning: '原因',
    grade: 5,
  },
  {
    id: 'kanji_404',
    character: '永',
    reading: 'えい',
    wrongReadings: ['ながい', 'とこしえ'],
    meaning: '永遠',
    grade: 5,
  },
  {
    id: 'kanji_405',
    character: '営',
    reading: 'えい',
    wrongReadings: ['いとなむ', 'いとなみ'],
    meaning: '営業',
    grade: 5,
  },
  {
    id: 'kanji_406',
    character: '衛',
    reading: 'えい',
    wrongReadings: ['まもる', 'まもり'],
    meaning: '衛生',
    grade: 5,
  },
  {
    id: 'kanji_407',
    character: '易',
    reading: 'やさしい',
    wrongReadings: ['むずかしい', 'かんたん'],
    meaning: '易しい',
    grade: 5,
  },
  {
    id: 'kanji_408',
    character: '益',
    reading: 'えき',
    wrongReadings: ['り', 'とく'],
    meaning: '利益',
    grade: 5,
  },
  {
    id: 'kanji_409',
    character: '液',
    reading: 'えき',
    wrongReadings: ['みず', 'ながれ'],
    meaning: '液体',
    grade: 5,
  },
  {
    id: 'kanji_410',
    character: '演',
    reading: 'えん',
    wrongReadings: ['あそぶ', 'まなぶ'],
    meaning: '演技',
    grade: 5,
  },
  {
    id: 'kanji_411',
    character: '応',
    reading: 'おう',
    wrongReadings: ['こたえる', 'むかえる'],
    meaning: '応援',
    grade: 5,
  },
  {
    id: 'kanji_412',
    character: '往',
    reading: 'おう',
    wrongReadings: ['いく', 'ゆく'],
    meaning: '往復',
    grade: 5,
  },
  {
    id: 'kanji_413',
    character: '桜',
    reading: 'さくら',
    wrongReadings: ['うめ', 'もも'],
    meaning: '桜',
    grade: 5,
  },
  {
    id: 'kanji_414',
    character: '恩',
    reading: 'おん',
    wrongReadings: ['めぐみ', 'いつくしみ'],
    meaning: '恩',
    grade: 5,
  },
  {
    id: 'kanji_415',
    character: '可',
    reading: 'か',
    wrongReadings: ['よい', 'ゆるす'],
    meaning: '可能',
    grade: 5,
  },
  {
    id: 'kanji_416',
    character: '仮',
    reading: 'かり',
    wrongReadings: ['かる', 'にせ'],
    meaning: '仮',
    grade: 5,
  },
  {
    id: 'kanji_417',
    character: '価',
    reading: 'か',
    wrongReadings: ['あたい', 'ね'],
    meaning: '価格',
    grade: 5,
  },
  {
    id: 'kanji_418',
    character: '河',
    reading: 'かわ',
    wrongReadings: ['みず', 'うみ'],
    meaning: '河川',
    grade: 5,
  },
  {
    id: 'kanji_419',
    character: '過',
    reading: 'すぎる',
    wrongReadings: ['すごす', 'とおる'],
    meaning: '過ぎる',
    grade: 5,
  },
  {
    id: 'kanji_420',
    character: '賀',
    reading: 'が',
    wrongReadings: ['いわう', 'よろこぶ'],
    meaning: '賀正',
    grade: 5,
  },

  // 6年生の漢字
  {
    id: 'kanji_501',
    character: '異',
    reading: 'こと',
    wrongReadings: ['ちがう', 'かわる'],
    meaning: '異なる',
    grade: 6,
  },
  {
    id: 'kanji_502',
    character: '遺',
    reading: 'い',
    wrongReadings: ['のこす', 'わすれる'],
    meaning: '遺産',
    grade: 6,
  },
  {
    id: 'kanji_503',
    character: '域',
    reading: 'いき',
    wrongReadings: ['ば', 'くに'],
    meaning: '地域',
    grade: 6,
  },
  {
    id: 'kanji_504',
    character: '宇',
    reading: 'う',
    wrongReadings: ['いえ', 'そら'],
    meaning: '宇宙',
    grade: 6,
  },
  {
    id: 'kanji_505',
    character: '映',
    reading: 'うつる',
    wrongReadings: ['はえる', 'かがやく'],
    meaning: '映画',
    grade: 6,
  },
  {
    id: 'kanji_506',
    character: '延',
    reading: 'のびる',
    wrongReadings: ['のばす', 'ひろがる'],
    meaning: '延長',
    grade: 6,
  },
  {
    id: 'kanji_507',
    character: '沿',
    reading: 'そう',
    wrongReadings: ['そって', 'ながれる'],
    meaning: '沿岸',
    grade: 6,
  },
  {
    id: 'kanji_508',
    character: '我',
    reading: 'われ',
    wrongReadings: ['わたし', 'ぼく'],
    meaning: '我々',
    grade: 6,
  },
  {
    id: 'kanji_509',
    character: '灰',
    reading: 'はい',
    wrongReadings: ['すみ', 'もえる'],
    meaning: '灰',
    grade: 6,
  },
  {
    id: 'kanji_510',
    character: '拡',
    reading: 'かく',
    wrongReadings: ['ひろがる', 'ひろげる'],
    meaning: '拡大',
    grade: 6,
  },
  {
    id: 'kanji_511',
    character: '革',
    reading: 'かく',
    wrongReadings: ['かわ', 'あらためる'],
    meaning: '革命',
    grade: 6,
  },
  {
    id: 'kanji_512',
    character: '閣',
    reading: 'かく',
    wrongReadings: ['たかどの', 'やかた'],
    meaning: '内閣',
    grade: 6,
  },
  {
    id: 'kanji_513',
    character: '割',
    reading: 'わる',
    wrongReadings: ['わける', 'さく'],
    meaning: '割合',
    grade: 6,
  },
  {
    id: 'kanji_514',
    character: '株',
    reading: 'かぶ',
    wrongReadings: ['ね', 'き'],
    meaning: '株',
    grade: 6,
  },
  {
    id: 'kanji_515',
    character: '干',
    reading: 'ほす',
    wrongReadings: ['かわく', 'かわかす'],
    meaning: '干す',
    grade: 6,
  },
  {
    id: 'kanji_516',
    character: '巻',
    reading: 'まく',
    wrongReadings: ['まき', 'かん'],
    meaning: '巻く',
    grade: 6,
  },
  {
    id: 'kanji_517',
    character: '看',
    reading: 'かん',
    wrongReadings: ['みる', 'まもる'],
    meaning: '看護',
    grade: 6,
  },
  {
    id: 'kanji_518',
    character: '簡',
    reading: 'かん',
    wrongReadings: ['かんたん', 'やさしい'],
    meaning: '簡単',
    grade: 6,
  },
  {
    id: 'kanji_519',
    character: '危',
    reading: 'あぶない',
    wrongReadings: ['あやうい', 'きけん'],
    meaning: '危険',
    grade: 6,
  },
  {
    id: 'kanji_520',
    character: '机',
    reading: 'つくえ',
    wrongReadings: ['いす', 'たな'],
    meaning: '机',
    grade: 6,
  },
]

// ステージ定義
export interface Stage {
  id: string
  name: string
  description: string
  kanjiIds: string[]
  grade: 1 | 2 | 3 | 4 | 5 | 6
  speed: 'slow' | 'normal' | 'fast'
  fallDuration: number // 漢字の落下時間（秒）
  requiredScore: number // クリアに必要なスコア
}

// 速度別の落下時間設定
const FALL_DURATIONS = {
  slow: 8,
  normal: 5,
  fast: 3,
}

// ステージ生成ヘルパー関数
function createStage(
  grade: 1 | 2 | 3 | 4 | 5 | 6,
  speed: 'slow' | 'normal' | 'fast',
  kanjiIds: string[]
): Stage {
  return {
    id: `grade_${grade}_${speed}`,
    name: `${grade}ねんせい`,
    description: speed === 'slow' ? 'ゆっくり' : speed === 'normal' ? 'ふつう' : 'はやい',
    kanjiIds,
    grade,
    speed,
    fallDuration: FALL_DURATIONS[speed],
    requiredScore: 8, // 10問中8問正解でクリア
  }
}

// 学年別の漢字IDを取得する関数（ステージ生成用）
function getKanjiIdsByGrade(grade: 1 | 2 | 3 | 4 | 5 | 6): string[] {
  return kanjiDatabase
    .filter((kanji) => kanji.grade === grade)
    .map((kanji) => kanji.id)
}

// 学年別の漢字データを取得する関数（ゲーム用）
export function getKanjisByGrade(grade: 1 | 2 | 3 | 4 | 5 | 6): KanjiData[] {
  return kanjiDatabase.filter((kanji) => kanji.grade === grade)
}

// 18ステージ生成（6学年 × 3速度）
export const stages: Stage[] = [
  // 1年生
  createStage(1, 'slow', getKanjiIdsByGrade(1)),
  createStage(1, 'normal', getKanjiIdsByGrade(1)),
  createStage(1, 'fast', getKanjiIdsByGrade(1)),

  // 2年生
  createStage(2, 'slow', getKanjiIdsByGrade(2)),
  createStage(2, 'normal', getKanjiIdsByGrade(2)),
  createStage(2, 'fast', getKanjiIdsByGrade(2)),

  // 3年生
  createStage(3, 'slow', getKanjiIdsByGrade(3)),
  createStage(3, 'normal', getKanjiIdsByGrade(3)),
  createStage(3, 'fast', getKanjiIdsByGrade(3)),

  // 4年生
  createStage(4, 'slow', getKanjiIdsByGrade(4)),
  createStage(4, 'normal', getKanjiIdsByGrade(4)),
  createStage(4, 'fast', getKanjiIdsByGrade(4)),

  // 5年生
  createStage(5, 'slow', getKanjiIdsByGrade(5)),
  createStage(5, 'normal', getKanjiIdsByGrade(5)),
  createStage(5, 'fast', getKanjiIdsByGrade(5)),

  // 6年生
  createStage(6, 'slow', getKanjiIdsByGrade(6)),
  createStage(6, 'normal', getKanjiIdsByGrade(6)),
  createStage(6, 'fast', getKanjiIdsByGrade(6)),
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
