# Instagramアカウント連携アプリ

InstagramビジネスアカウントをMetaログイン（OAuth）で連携し、紐づくFacebookページとInstagramアカウント情報を取得するNode.jsアプリです。依存パッケージなしで動作するため、Metaアプリの検証やプロトタイプとしてすぐ使えます。

## 機能

- Instagram連携開始画面
- OAuth stateによるCSRF対策
- Meta OAuth認可コードからアクセストークンを取得
- `/me/accounts` からFacebookページとInstagramビジネスアカウント情報を取得
- 設定状況を確認できる `/config` エンドポイント

## 必要条件

- Node.js 18以上
- Meta for Developersで作成したアプリ
- Facebookページに接続済みのInstagramビジネスアカウントまたはクリエイターアカウント

## セットアップ

1. Meta for Developersでアプリを作成します。
2. Facebookログイン設定に、次のOAuthリダイレクトURIを登録します。

   ```text
   http://localhost:3000/auth/instagram/callback
   ```

3. 環境変数を設定します。

   ```bash
   export INSTAGRAM_APP_ID="your-meta-app-id"
   export INSTAGRAM_APP_SECRET="your-meta-app-secret"
   export INSTAGRAM_REDIRECT_URI="http://localhost:3000/auth/instagram/callback"
   ```

4. アプリを起動します。

   ```bash
   npm start
   ```

5. ブラウザで `http://localhost:3000` を開き、「Instagramと連携する」を押します。

## 環境変数

| 変数名 | 必須 | 初期値 | 説明 |
| --- | --- | --- | --- |
| `PORT` | 任意 | `3000` | ローカルサーバーのポート番号 |
| `INSTAGRAM_APP_ID` | 必須 | なし | MetaアプリID |
| `INSTAGRAM_APP_SECRET` | 必須 | なし | Metaアプリシークレット |
| `INSTAGRAM_REDIRECT_URI` | 任意 | `http://localhost:${PORT}/auth/instagram/callback` | Metaに登録したOAuthリダイレクトURI |
| `INSTAGRAM_SCOPES` | 任意 | `instagram_business_basic,instagram_business_manage_messages` | 認可で要求する権限。アプリ審査状況に合わせて変更してください |
| `META_GRAPH_VERSION` | 任意 | `v23.0` | 使用するGraph APIバージョン |

## 主なエンドポイント

| パス | 説明 |
| --- | --- |
| `/` | 連携開始画面 |
| `/config` | アプリ設定状況をJSONで表示 |
| `/auth/instagram` | Meta OAuth認可画面へリダイレクト |
| `/auth/instagram/callback` | 認可コードを受け取り、アクセストークンとInstagram情報を取得 |

## 本番運用時の注意

- アクセストークンは画面に表示せず、暗号化したDBやシークレット管理サービスへ保存してください。
- `APP_SECRET` は絶対にクライアント側へ埋め込まないでください。
- HTTPSのリダイレクトURIを使い、Cookieには `Secure` 属性を付与してください。
- 必要なInstagram API権限はMetaのアプリレビューを通過してから本番利用してください。
- 取得したDMやプロフィール情報を扱う場合は、利用目的・保存期間・削除方法をプライバシーポリシーに明記してください。
