
declare const React: any;
declare const ReactDOM: any;
declare namespace JSX { interface IntrinsicElements { [elemName: string]: any } }
type FormEvent = Event;
const useEffect: (effect: () => void | (() => void), deps?: unknown[]) => void = React.useEffect;
const useMemo: <T>(factory: () => T, deps?: unknown[]) => T = React.useMemo;
const useState: <T>(initial: T) => [T, (value: T | ((previous: T) => T)) => void] = React.useState;

type ApplicationStatus = 'AI審査中' | '承認' | '追加確認' | '送金完了';

type Application = {
  id: number;
  reason: string;
  fileName: string;
  submittedAt: string;
  score: number;
  status: ApplicationStatus;
  transferAmount: number;
};

type Log = { time: string; message: string };

const initialApplications: Application[] = [
  {
    id: 1001,
    reason: '失業後に家賃と医療費の支払いが重なり、生活費が不足しています。',
    fileName: 'rent-notice.pdf',
    submittedAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    score: 92,
    status: '送金完了',
    transferAmount: 45000,
  },
  {
    id: 1002,
    reason: 'ひとり親世帯で、子どもの給食費と通学用品の支払いに困っています。',
    fileName: 'school-support.jpg',
    submittedAt: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
    score: 87,
    status: '承認',
    transferAmount: 30000,
  },
];

const tasks = [
  'ブログ記事を自動生成して広告収入を獲得中',
  'データ入力のマイクロタスクを実行中',
  '寄付提携先向けのレポート草案を作成中',
  '申請理由と証明書類名を照合して緊急度を推定中',
  '承認済み申請の送金キューを確認中',
];

const currency = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 });

function scoreReason(reason: string, hasFile: boolean) {
  const urgentWords = ['家賃', '医療', '食費', '失業', '子ども', 'ひとり親', '避難', '病気', '生活費'];
  const hits = urgentWords.filter((word) => reason.includes(word)).length;
  return Math.min(98, 50 + hits * 8 + Math.min(20, Math.floor(reason.length / 10)) + (hasFile ? 12 : 0));
}

function App() {
  const [reason, setReason] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [earned, setEarned] = useState(128450);
  const [logs, setLogs] = useState<Log[]>([
    { time: new Date().toLocaleTimeString('ja-JP'), message: 'AI収益エンジンを起動しました' },
    { time: new Date().toLocaleTimeString('ja-JP'), message: tasks[0] },
  ]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const gain = 420 + Math.floor(Math.random() * 1800);
      const message = tasks[Math.floor(Math.random() * tasks.length)];
      setEarned((value) => value + gain);
      setLogs((prev) => [
        { time: new Date().toLocaleTimeString('ja-JP'), message: `${message}（+${currency.format(gain)}）` },
        ...prev,
      ].slice(0, 9));
    }, 2600);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setApplications((prev) =>
        prev.map((app) => {
          if (app.status === 'AI審査中' && app.score >= 72) return { ...app, status: '承認' };
          if (app.status === '承認' && earned > app.transferAmount) return { ...app, status: '送金完了' };
          if (app.status === 'AI審査中') return { ...app, status: '追加確認' };
          return app;
        }),
      );
    }, 4200);
    return () => window.clearInterval(timer);
  }, [earned]);

  const distributed = useMemo(
    () => applications.filter((app) => app.status === '送金完了').reduce((sum, app) => sum + app.transferAmount, 0),
    [applications],
  );

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!reason.trim()) return;
    const score = scoreReason(reason, Boolean(file));
    const newApplication: Application = {
      id: Date.now(),
      reason,
      fileName: file?.name ?? '未アップロード',
      submittedAt: new Date().toISOString(),
      score,
      status: 'AI審査中',
      transferAmount: score >= 85 ? 50000 : score >= 72 ? 30000 : 0,
    };
    setApplications((prev) => [newApplication, ...prev]);
    setLogs((prev) => [
      { time: new Date().toLocaleTimeString('ja-JP'), message: `新規申請 #${newApplication.id} をAI審査キューへ追加しました` },
      ...prev,
    ].slice(0, 9));
    setReason('');
    setFile(null);
  };

  return (
    <main>
      <section className="hero">
        <p className="eyebrow">Social Impact AI Prototype</p>
        <h1>AIが稼ぎ、困っている人へ届ける支援モック</h1>
        <p>収益生成、申請受付、AI審査、自動送金までの流れをブラウザ上で確認できる試作システムです。</p>
      </section>

      <div className="grid">
        <section className="card applicant">
          <span className="badge">ユーザー向け画面</span>
          <h2>お金の申請</h2>
          <form onSubmit={submit}>
            <label htmlFor="reason">本当に困っている理由</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="例：失業により家賃と食費の支払いが難しく、今月中に支援が必要です。"
              rows={8}
              required
            />
            <label htmlFor="proof">本人確認・困窮証明ファイル</label>
            <input id="proof" type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            <p className="hint">選択中: {file ? file.name : 'ファイル未選択'}</p>
            <button type="submit">申請する</button>
          </form>
        </section>

        <section className="card dashboard">
          <span className="badge dark">管理・ダッシュボード画面</span>
          <h2>AIの稼ぎ状況</h2>
          <div className="metrics">
            <div><small>自動で稼いだ合計</small><strong>{currency.format(earned)}</strong></div>
            <div><small>自動送金済み</small><strong>{currency.format(distributed)}</strong></div>
          </div>
          <h3>リアルタイムログ</h3>
          <ul className="logs">{logs.map((log, index) => <li key={`${log.time}-${index}`}><time>{log.time}</time>{log.message}</li>)}</ul>
          <h3>AI自動審査・送金キュー</h3>
          <div className="table">
            {applications.map((app) => (
              <article key={app.id}>
                <div><b>#{app.id}</b><span className={`status ${app.status}`}>{app.status}</span></div>
                <p>{app.reason}</p>
                <small>証明: {app.fileName} / AI緊急度: {app.score} / 予定送金: {currency.format(app.transferAmount)}</small>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
