import { useEffect, useState } from 'react';
import './App.css';

const DEFAULT_PREFS = {
  hideComments: true,
  hideLikes: true,
  hideWhoViewed: true,
};

const LABELS = {
  hideComments: 'Hide comments',
  hideLikes: 'Hide likes',
  hideWhoViewed: 'Hide "who viewed your profile"',
};

export default function App() {
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/prefs')
      .then((r) => r.json())
      .then((data) => setPrefs((p) => ({ ...p, ...data })))
      .catch(() => {});
  }, []);

  function toggle(key) {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);

    fetch('/api/prefs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    })
      .then(() => setStatus('Saved'))
      .catch(() => setStatus('Error saving'))
      .finally(() => setTimeout(() => setStatus(''), 2000));
  }

  return (
    <main className="dashboard">
      <h1>LinkedIntrovert</h1>
      <p className="subtitle">Choose what to hide on LinkedIn.</p>

      <ul className="pref-list">
        {Object.keys(DEFAULT_PREFS).map((key) => (
          <li key={key} className="pref-item">
            <label>
              <input
                type="checkbox"
                checked={prefs[key]}
                onChange={() => toggle(key)}
              />
              {LABELS[key]}
            </label>
          </li>
        ))}
      </ul>

      {status && <p className="status">{status}</p>}
    </main>
  );
}