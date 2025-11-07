const form = document.getElementById('cardForm');
const preview = {
  name: document.getElementById('previewName'),
  title: document.getElementById('previewTitle'),
  summary: document.getElementById('previewSummary'),
  chips: document.getElementById('previewChips'),
  phone: document.getElementById('previewPhone'),
  email: document.getElementById('previewEmail'),
  website: document.getElementById('previewWebsite'),
  avatar: document.getElementById('avatarInitials'),
  card: document.getElementById('cardPreview'),
};

const controls = {
  primaryColor: document.getElementById('primaryColor'),
  backgroundColor: document.getElementById('backgroundColor'),
  fontFamily: document.getElementById('fontFamily'),
};

const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const templateButtons = document.querySelectorAll('.template-card');

const persistKey = 'ai-card-lab-settings-v1';

function updatePreview() {
  const formData = new FormData(form);
  const name = formData.get('name') || document.getElementById('name').value;
  const title = formData.get('title') || document.getElementById('title').value;
  const summary = formData.get('summary') || document.getElementById('summary').value;
  const expertise = formData.get('expertise') || document.getElementById('expertise').value;
  const phone = formData.get('phone') || document.getElementById('phone').value;
  const email = formData.get('email') || document.getElementById('email').value;
  const website = formData.get('website') || document.getElementById('website').value;
  const avatar = formData.get('avatar') || document.getElementById('avatar').value;

  preview.name.textContent = name || '未設定';
  preview.title.textContent = title || '';
  preview.summary.textContent = summary || 'ここにプロフィール文が入ります。';
  preview.phone.textContent = phone || '';
  preview.email.textContent = email || '';
  preview.website.textContent = website || '';
  preview.avatar.textContent = (avatar || name || 'AI').slice(0, 2).toUpperCase();

  const tags = expertise
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
  preview.chips.innerHTML = '';
  if (tags.length) {
    tags.forEach((tag) => {
      const span = document.createElement('span');
      span.textContent = tag;
      preview.chips.appendChild(span);
    });
  }

  applyTheme();
  persistSettings();
}

function applyTheme() {
  const primary = controls.primaryColor.value;
  const background = controls.backgroundColor.value;
  const font = controls.fontFamily.value;

  document.documentElement.style.setProperty('--primary-color', primary);
  document.documentElement.style.setProperty('--background-color', background);
  document.body.style.fontFamily = font;

  preview.card.style.background = background;
  preview.avatar.style.background = primary;

  preview.chips.querySelectorAll('span').forEach((chip) => {
    chip.style.background = hexToRgba(primary, 0.14);
    chip.style.color = primary;
  });
}

function hexToRgba(hex, alpha = 1) {
  const sanitized = hex.replace('#', '');
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function persistSettings() {
  const data = {
    inputs: {
      name: document.getElementById('name').value,
      title: document.getElementById('title').value,
      summary: document.getElementById('summary').value,
      expertise: document.getElementById('expertise').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
      website: document.getElementById('website').value,
      avatar: document.getElementById('avatar').value,
    },
    controls: {
      primaryColor: controls.primaryColor.value,
      backgroundColor: controls.backgroundColor.value,
      fontFamily: controls.fontFamily.value,
    },
  };
  localStorage.setItem(persistKey, JSON.stringify(data));
}

function loadSettings() {
  const stored = localStorage.getItem(persistKey);
  if (!stored) return;
  try {
    const data = JSON.parse(stored);
    Object.entries(data.inputs || {}).forEach(([key, value]) => {
      const el = document.getElementById(key);
      if (el) el.value = value;
    });
    Object.entries(data.controls || {}).forEach(([key, value]) => {
      if (controls[key]) controls[key].value = value;
    });
  } catch (error) {
    console.warn('Failed to load settings', error);
  }
}

async function generateCopy() {
  const summaryField = document.getElementById('summary');
  const expertise = document.getElementById('expertise').value;
  const name = document.getElementById('name').value || 'あなた';
  const title = document.getElementById('title').value;

  const prompt = `以下の情報をもとに、AI名刺カードに載せる140文字程度の自己紹介文を日本語で作成してください。\n` +
    `名前: ${name}\n肩書: ${title}\nタグ: ${expertise}`;

  generateBtn.disabled = true;
  generateBtn.textContent = 'AIがコピーを考えています…';

  try {
    if (!window.ai || !window.ai.writer) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      summaryField.value = `${name}の強みは${expertise}。${title || 'AIスペシャリスト'}として課題を整理し、成果につながる体験を共同で設計します。`;
    } else {
      const session = await window.ai.writer.create();
      const { output } = await session.write(prompt, {
        format: 'plain_text',
        length: 140,
      });
      summaryField.value = output.trim();
    }
  } catch (error) {
    console.error(error);
    summaryField.value = `${name}の強みは${expertise}。${title || 'AIスペシャリスト'}として課題を整理し、成果につながる体験を共同で設計します。`;
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = 'AIでコピー提案';
    updatePreview();
  }
}

async function downloadCard() {
  const cardElement = preview.card;
  downloadBtn.disabled = true;
  downloadBtn.textContent = 'レンダリング中…';

  try {
    const canvas = await html2canvas(cardElement, {
      scale: 2,
      backgroundColor: null,
    });
    const link = document.createElement('a');
    link.download = `${document.getElementById('name').value || 'ai-card'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Failed to download card', error);
    alert('カードのダウンロードに失敗しました。ブラウザを最新に更新してください。');
  } finally {
    downloadBtn.disabled = false;
    downloadBtn.textContent = 'カードをダウンロード';
  }
}

function attachListeners() {
  form.addEventListener('input', updatePreview);
  controls.primaryColor.addEventListener('input', updatePreview);
  controls.backgroundColor.addEventListener('input', updatePreview);
  controls.fontFamily.addEventListener('change', updatePreview);
  templateButtons.forEach((button) =>
    button.addEventListener('click', () => {
      controls.primaryColor.value = button.dataset.primary;
      controls.backgroundColor.value = button.dataset.background;
      updatePreview();
    }),
  );
  generateBtn.addEventListener('click', (event) => {
    event.preventDefault();
    generateCopy();
  });
  downloadBtn.addEventListener('click', (event) => {
    event.preventDefault();
    downloadCard();
  });
}

loadSettings();
attachListeners();
updatePreview();
