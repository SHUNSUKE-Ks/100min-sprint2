import type { SchemaEntry } from '../types'

const novelSheetV1: SchemaEntry = {
  id: 'novel-sheet-v1-0',
  name: 'NovelSheet',
  version: '1.0',
  isLatest: true,
  createdAt: '2026-04-13T00:00:00Z',
  code: JSON.stringify(
    {
      meta: {
        schema_version: '1.0',
        label: '表示名（日本語OK）',
        id: 'file-id-alphanum',
        memo: '',
        thumbnail: null,
        created_at: '2026-01-01T00:00:00Z',
      },
      world: {
        name: '世界名',
        civilization: '文明レベル',
        power: '支配構造',
        taboo: '禁忌',
        problem: '世界の問題',
      },
      characters: [
        {
          characterID: 'CHAR_001',
          role: 'protagonist',
          name: '名前',
          purpose: '目的',
          fear: '恐怖',
          flaw: '欠点',
          fight_reason: '戦う理由',
        },
        {
          characterID: 'CHAR_002',
          role: 'heroine',
          name: '名前',
          relationship: '主人公との関係',
          secret: '隠し事',
        },
      ],
      systems: ['branch', 'affection'],
      scenario: {
        first_incident: '最初の事件',
        player_objective: 'プレイヤー目的',
        chapter1_event: '第一章開始イベント',
      },
      custom_code: null,
    },
    null,
    2
  ),
}

export const DEFAULT_SCHEMAS: SchemaEntry[] = [novelSheetV1]
