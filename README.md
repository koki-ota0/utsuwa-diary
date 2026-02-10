# Utsuwa Diary

お気に入りの器（うつわ）を記録・管理するためのWebアプリケーションです。

## 機能

- **器の登録**: 写真（最大3枚）、名前、カテゴリ、ブランド/ショップ、メモを登録
- **マイシェルフ**: 登録した器の一覧表示
- **使用記録**: 「今日使った」ボタンで使用履歴を記録

## カテゴリ

- Plate（皿）
- Cup（カップ）
- Vase（花瓶）
- Bowl（ボウル）
- Misc（その他）

## 技術スタック

- React 18
- TypeScript
- Vite
- Vitest + React Testing Library（テスト）
- ESLint + Prettier（コード品質）

## セットアップ

```bash
npm install
npm run dev
```

## コマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm run test` | テスト実行 |
| `npm run lint` | ESLint実行 |
| `npm run format` | Prettierでフォーマット |

## データ保存

データはブラウザのlocalStorageに保存されます。
