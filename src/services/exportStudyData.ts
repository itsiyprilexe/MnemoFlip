import { collection, getDocsFromServer } from 'firebase/firestore';
import { db } from './firebase';

type Entry = { title: string; description: string; kind: string; question: string; answer: string; choices: string[] };
const asText = (value: unknown) => typeof value === 'string' ? value : '';
export async function exportStudyData(uid: string): Promise<Entry[]> {
  const readGroup = async (name: 'decks' | 'quizzes', childName: 'cards' | 'questions') => {
    const snapshot = await getDocsFromServer(collection(db, 'users', uid, name));
    return Promise.all(snapshot.docs.map(async item => {
      const data = item.data();
      const children = await getDocsFromServer(collection(item.ref, childName));
      const base = { title: asText(data.title), description: asText(data.description) };
      if (children.empty) return [{ ...base, kind: name === 'decks' ? 'Empty deck' : 'Empty quiz', question: '', answer: '', choices: [] }];
      return children.docs.map(child => { const content = child.data(); return { ...base, kind: name === 'decks' ? 'Flashcard' : content.type === 'multipleChoice' ? 'Multiple choice' : 'Identification', question: asText(content.question), answer: asText(content.answer), choices: Array.isArray(content.choices) ? content.choices.map(asText) : [] }; });
    }));
  };
  const [decks, quizzes] = await Promise.all([readGroup('decks', 'cards'), readGroup('quizzes', 'questions')]);
  return [...decks.flat(), ...quizzes.flat()];
}

const safeCell = (value: string) => {
  // Spreadsheet apps may execute cells beginning with formula characters.
  const safe = /^[\s\u0000-\u001f]*[=+@\-]/.test(value) ? "'" + value : value;
  return `"${safe.replace(/"/g, '""')}"`;
};
export function makeSpreadsheet(rows: Entry[]) {
  const headers = ['Type', 'Deck or quiz', 'Description', 'Question', 'Answer', 'Choice A', 'Choice B', 'Choice C', 'Choice D'];
  return '\uFEFF' + [headers, ...rows.map(row => [row.kind, row.title, row.description, row.question, row.answer, ...Array.from({ length: 4 }, (_, i) => row.choices[i] ?? '')])].map(row => row.map(safeCell).join(',')).join('\r\n');
}
const escapeHtml = (text: string) => text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char);
export function makePrintableReport(rows: Entry[]) {
  const body = rows.length ? rows.map(row => `<section><div class="kind">${escapeHtml(row.kind)}</div><h2>${escapeHtml(row.title || 'Untitled')}</h2>${row.description ? `<p>${escapeHtml(row.description)}</p>` : ''}${row.question ? `<p><strong>Question:</strong> ${escapeHtml(row.question)}</p>` : ''}${row.choices.length ? `<ol type="A">${row.choices.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ol>` : ''}${row.answer ? `<p><strong>Answer:</strong> ${escapeHtml(row.answer)}</p>` : ''}</section>`).join('') : '<p>No study data yet.</p>';
  return `<!doctype html><html><head><meta charset="utf-8"><title>MnemoFlip study data</title><style>body{font:14px Arial,sans-serif;color:#294638;margin:36px}h1{font-size:26px}section{border:1px solid #dce6dc;border-radius:12px;padding:16px;margin:12px 0;break-inside:avoid}h2{font-size:17px;margin:8px 0}.kind{font-size:10px;text-transform:uppercase;color:#486b50}p,li{white-space:pre-wrap;line-height:1.5}</style></head><body><h1>MnemoFlip study data</h1>${body}</body></html>`;
}
