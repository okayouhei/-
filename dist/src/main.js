"use strict";
const useEffect = React.useEffect;
const useMemo = React.useMemo;
const useState = React.useState;
const initialApplications = [
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
function scoreReason(reason, hasFile) {
    const urgentWords = ['家賃', '医療', '食費', '失業', '子ども', 'ひとり親', '避難', '病気', '生活費'];
    const hits = urgentWords.filter((word) => reason.includes(word)).length;
    return Math.min(98, 50 + hits * 8 + Math.min(20, Math.floor(reason.length / 10)) + (hasFile ? 12 : 0));
}
function App() {
    const [reason, setReason] = useState('');
    const [file, setFile] = useState(null);
    const [applications, setApplications] = useState(initialApplications);
    const [earned, setEarned] = useState(128450);
    const [logs, setLogs] = useState([
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
            setApplications((prev) => prev.map((app) => {
                if (app.status === 'AI審査中' && app.score >= 72)
                    return { ...app, status: '承認' };
                if (app.status === '承認' && earned > app.transferAmount)
                    return { ...app, status: '送金完了' };
                if (app.status === 'AI審査中')
                    return { ...app, status: '追加確認' };
                return app;
            }));
        }, 4200);
        return () => window.clearInterval(timer);
    }, [earned]);
    const distributed = useMemo(() => applications.filter((app) => app.status === '送金完了').reduce((sum, app) => sum + app.transferAmount, 0), [applications]);
    const submit = (event) => {
        event.preventDefault();
        if (!reason.trim())
            return;
        const score = scoreReason(reason, Boolean(file));
        const newApplication = {
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
    return (React.createElement("main", null,
        React.createElement("section", { className: "hero" },
            React.createElement("p", { className: "eyebrow" }, "Social Impact AI Prototype"),
            React.createElement("h1", null, "AI\u304C\u7A3C\u304E\u3001\u56F0\u3063\u3066\u3044\u308B\u4EBA\u3078\u5C4A\u3051\u308B\u652F\u63F4\u30E2\u30C3\u30AF"),
            React.createElement("p", null, "\u53CE\u76CA\u751F\u6210\u3001\u7533\u8ACB\u53D7\u4ED8\u3001AI\u5BE9\u67FB\u3001\u81EA\u52D5\u9001\u91D1\u307E\u3067\u306E\u6D41\u308C\u3092\u30D6\u30E9\u30A6\u30B6\u4E0A\u3067\u78BA\u8A8D\u3067\u304D\u308B\u8A66\u4F5C\u30B7\u30B9\u30C6\u30E0\u3067\u3059\u3002")),
        React.createElement("div", { className: "grid" },
            React.createElement("section", { className: "card applicant" },
                React.createElement("span", { className: "badge" }, "\u30E6\u30FC\u30B6\u30FC\u5411\u3051\u753B\u9762"),
                React.createElement("h2", null, "\u304A\u91D1\u306E\u7533\u8ACB"),
                React.createElement("form", { onSubmit: submit },
                    React.createElement("label", { htmlFor: "reason" }, "\u672C\u5F53\u306B\u56F0\u3063\u3066\u3044\u308B\u7406\u7531"),
                    React.createElement("textarea", { id: "reason", value: reason, onChange: (event) => setReason(event.target.value), placeholder: "\u4F8B\uFF1A\u5931\u696D\u306B\u3088\u308A\u5BB6\u8CC3\u3068\u98DF\u8CBB\u306E\u652F\u6255\u3044\u304C\u96E3\u3057\u304F\u3001\u4ECA\u6708\u4E2D\u306B\u652F\u63F4\u304C\u5FC5\u8981\u3067\u3059\u3002", rows: 8, required: true }),
                    React.createElement("label", { htmlFor: "proof" }, "\u672C\u4EBA\u78BA\u8A8D\u30FB\u56F0\u7AAE\u8A3C\u660E\u30D5\u30A1\u30A4\u30EB"),
                    React.createElement("input", { id: "proof", type: "file", onChange: (event) => setFile(event.target.files?.[0] ?? null) }),
                    React.createElement("p", { className: "hint" },
                        "\u9078\u629E\u4E2D: ",
                        file ? file.name : 'ファイル未選択'),
                    React.createElement("button", { type: "submit" }, "\u7533\u8ACB\u3059\u308B"))),
            React.createElement("section", { className: "card dashboard" },
                React.createElement("span", { className: "badge dark" }, "\u7BA1\u7406\u30FB\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9\u753B\u9762"),
                React.createElement("h2", null, "AI\u306E\u7A3C\u304E\u72B6\u6CC1"),
                React.createElement("div", { className: "metrics" },
                    React.createElement("div", null,
                        React.createElement("small", null, "\u81EA\u52D5\u3067\u7A3C\u3044\u3060\u5408\u8A08"),
                        React.createElement("strong", null, currency.format(earned))),
                    React.createElement("div", null,
                        React.createElement("small", null, "\u81EA\u52D5\u9001\u91D1\u6E08\u307F"),
                        React.createElement("strong", null, currency.format(distributed)))),
                React.createElement("h3", null, "\u30EA\u30A2\u30EB\u30BF\u30A4\u30E0\u30ED\u30B0"),
                React.createElement("ul", { className: "logs" }, logs.map((log, index) => React.createElement("li", { key: `${log.time}-${index}` },
                    React.createElement("time", null, log.time),
                    log.message))),
                React.createElement("h3", null, "AI\u81EA\u52D5\u5BE9\u67FB\u30FB\u9001\u91D1\u30AD\u30E5\u30FC"),
                React.createElement("div", { className: "table" }, applications.map((app) => (React.createElement("article", { key: app.id },
                    React.createElement("div", null,
                        React.createElement("b", null,
                            "#",
                            app.id),
                        React.createElement("span", { className: `status ${app.status}` }, app.status)),
                    React.createElement("p", null, app.reason),
                    React.createElement("small", null,
                        "\u8A3C\u660E: ",
                        app.fileName,
                        " / AI\u7DCA\u6025\u5EA6: ",
                        app.score,
                        " / \u4E88\u5B9A\u9001\u91D1: ",
                        currency.format(app.transferAmount))))))))));
}
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
