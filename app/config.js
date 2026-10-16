// ★お店の情報はここだけ書き換えればOKです★
window.SHOP = {
  name: "Girls Bar ○○",
  area: "○○駅 徒歩2分",
  hours: "20:00〜翌2:00（不定休）",
  address: "○○県○○市○○ 1-2-3 ○○ビル 4F",
  mapUrl: "https://maps.google.com/?q=",          // GoogleマップのURLに差し替え
  tel: "000-0000-0000",
  lineUrl: "https://lin.ee/xxxxxxx",               // LINE公式アカウントの友だち追加URL
  instagramUrl: "https://instagram.com/xxxxxxxx",
  siteUrl: "",                                      // 公開後のこのページのURL（空なら現在のURL）
  minAge: 20,
  // 料金（明朗会計を一番の安心材料として前面に出します）
  prices: [
    { label: "初回セット 60分", price: "2,000円", note: "ドリンク飲み放題" },
    { label: "通常セット 60分", price: "3,500円", note: "ドリンク飲み放題" },
    { label: "延長 30分", price: "1,500円", note: "" },
    { label: "指名料", price: "1,000円", note: "" }
  ],
  priceNote: "サービス料・チャージ込み。表示以外の追加請求は一切ありません。",
  // 初回クーポン
  coupon: { title: "初回限定 60分 2,000円", detail: "ご新規様限定／スタッフにこの画面をご提示ください", staffPin: "1234" },
  // 今日のイベント・出勤（毎日ここを更新、またはオーナー画面で編集）
  today: { event: "本日ご新規様、乾杯ドリンク1杯サービス", cast: ["あや", "みく", "りな", "ゆい"] },
  // 友だち追加特典など
  perks: ["初回2,000円（60分飲み放題）", "LINE友だち追加で1杯サービス", "女性・おひとり様も歓迎", "会計は明朗・ぼったくり一切なし"],
  costPerGuest: 1200,   // 損益計算の初期値
  avgSpend: 5000,
  fixedCostMonthly: 1500000
};
