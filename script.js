const aiCard = document.getElementById("aiCard");
const terminal = document.getElementById("terminal");
const glowToggle = document.getElementById("glowToggle");
const autoReplyToggle = document.getElementById("autoReplyToggle");
const estimateForm = document.getElementById("estimateForm");
const estimateResult = document.getElementById("estimateResult");

function typeLine(text, delay = 18) {
  const line = document.createElement("div");
  terminal.appendChild(line);

  let index = 0;
  function tick() {
    line.textContent = text.slice(0, index);
    index += 1;
    if (index <= text.length) {
      setTimeout(tick, delay);
    }
  }
  tick();
}

function resetTerminal() {
  terminal.innerHTML = "";
  typeLine("> VST-AI.sys 起動中...");
  setTimeout(() => typeLine("> Touch ID 認証... OK"), 600);
  setTimeout(() => typeLine("> Hologram Shader: enabled"), 1100);
  setTimeout(() => typeLine("> Concierge Persona: Nao Takahashi"), 1600);
}

resetTerminal();

aiCard.addEventListener("click", (event) => {
  const action = event.target.dataset.action;
  if (!action) return;

  if (action === "flip") {
    aiCard.classList.toggle("is-flipped");
  }

  if (action === "chat") {
    typeLine("> AIチャットを開始します...", 12);
  }

  if (action === "share") {
    typeLine("> 共有リンクを生成しました: https://vst-ai.card/demo", 12);
  }
});

glowToggle.addEventListener("change", (event) => {
  aiCard.classList.toggle("no-glow", !event.target.checked);
  typeLine(`> Hologram Shader: ${event.target.checked ? "enabled" : "disabled"}`);
});

autoReplyToggle.addEventListener("change", (event) => {
  typeLine(`> Auto Reply: ${event.target.checked ? "on" : "off"}`);
});

estimateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(estimateForm);
  const name = formData.get("name");
  const industry = formData.get("industry");
  const features = (formData.get("features") || "").split(/[、,\n]/).filter(Boolean);

  const baseBudget = 380000;
  const featureBoost = Math.min(features.length * 52000, 220000);
  const total = baseBudget + featureBoost;

  const summary = `【${industry}向け】${name}様専用プラン\n- 初期PoC費用: 約${total.toLocaleString()}円\n- 想定AI機能: ${features.length ? features.join(" / ") : "基本チャットボット"}\n- 導入目安: 3〜4週間`;

  estimateResult.textContent = summary;
  typeLine("> 見積りプランを生成しました。詳細は下部フォームをご確認ください。", 10);
  estimateForm.reset();
});

document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.scroll);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
