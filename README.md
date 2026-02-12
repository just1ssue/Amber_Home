# Amber_Home

Amber_Home は「他のアプリへの導線になるフロントWebページ」です。

- ログイン不要 / 1ページ構成（ヘッダはアンカー移動：Home / Apps / About）
- リンク定義は JSON（`public/apps.json`）
- 最近使った（最大5件表示、アクセス日時降順、重複は先頭へ移動、90日で自動削除）
- お気に入り（LocalStorage、移動なし）
- GitHub Pages にデプロイ（Vite + React）
- OGP / タイトル / ファビコン対応

---

## 1. 動かし方（ローカル）

### 前提
- Node.js 18+ 推奨（20でもOK）

### セットアップ
```bash
npm install
npm run dev
```

### ビルド
```bash
npm run build
npm run preview
```

---

## 2. リンク定義（apps.json）

`public/apps.json` を編集してリンクを管理します。

- `url` は **絶対URL / 相対URL どちらも可**
  - 同一ドメイン中心なら `"/app/"` のような相対URLがおすすめ
- `order` が小さいほど上に表示されます

例：
```json
{
  "version": 1,
  "apps": [
    {
      "id": "amber_draw",
      "name": "Amber_Draw",
      "description": "みんなでレイヤードお絵描き",
      "url": "/amber_draw/",
      "icon": "🎨",
      "tags": ["game", "collab"],
      "order": 10
    }
  ]
}
```

---

## 3. 最近使った / お気に入り

LocalStorage に保存します。

- favorites key: `amber_home:favorites:v1`
  - value: `["amber_draw","xxx", ...]`（追加順、移動なし）
- recent key: `amber_home:recent:v1`
  - value: `[{"id":"amber_draw","ts":1730000000000}, ...]`

仕様：
- 最近使ったは「最大20件保持・表示は5件」
- クリックで ts 更新 + 先頭へ移動（重複なし）
- 90日より古い履歴は自動削除（起動時にクリーン）
- apps.json に存在しない id は無視（壊れても表示が崩れない）

---

## 4. OGP / タイトル / ファビコン（詳細）

### タイトル
`index.html` の以下を編集します。
- `<title>`
- `<meta name="description">`
- OGP/Twitter の `og:title`, `og:description`, `twitter:title`, `twitter:description`

### OGP（SNSカード）
`index.html` に OGP meta を定義しています。画像は `public/ogp.png` を差し替えます。

推奨：
- `ogp.png`：**1200×630**（最優先）

> 注意：SNSクローラーは相対パス解釈が不安定な場合があります。  
> 安定させたい場合は、`og:image` を **絶対URL** にします（デプロイ後に URL が確定したら差し替えが最短）。

例：
- `https://<user>.github.io/<repo>/ogp.png`

### favicon / Apple Touch Icon
- `public/favicon.svg`（最低限）
- `public/favicon-32x32.png`：**32×32**
- `public/apple-touch-icon.png`：**180×180**

---

## 5. GitHub Pages デプロイ（GitHub Actions）

### A. `vite.config.js` の base
GitHub Pages は `https://<user>.github.io/<repo>/` 配下で動くため、Vite の `base` が必要です。

`vite.config.js` の `BASE_REPO_NAME` を **実際のリポジトリ名**に合わせて変更してください。

### B. Actions
`.github/workflows/deploy.yml` を同梱しています。
- main ブランチに push すると自動で Pages にデプロイされます。

### C. GitHub 側の設定
- Settings → Pages
- Source: **GitHub Actions**

---

## 6. よくあるハマり
- 画像パスが 404：`vite.config.js` の `base` がリポジトリ名と不一致
- OGP 反映されない：SNS側キャッシュ。デバッガー等で再クロール（X/FB など）
