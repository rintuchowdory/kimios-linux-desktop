const { useState, useEffect, useRef } = React;

const FS = {
  '/': ['home','etc','usr','var','tmp'],
  '/home': ['rintu'],
  '/home/rintu': ['Documents','Downloads','Projects','Desktop','.bashrc'],
  '/home/rintu/Documents': ['notes.md','resume.pdf','todo.txt'],
  '/home/rintu/Downloads': ['setup.deb','wallpaper.png'],
  '/home/rintu/Projects': ['freelancer-toolkit-germany','quakeguard-bd','neonforge'],
  '/home/rintu/Projects/freelancer-toolkit-germany': ['src','package.json','README.md'],
  '/home/rintu/Desktop': [],
  '/etc': ['hosts','passwd','os-release'],
  '/usr': ['bin','lib','share'],
  '/var': ['log','cache'],
  '/tmp': [],
};

const FILES = {
  '.bashrc': '# ~/.bashrc\nexport PATH="$HOME/.local/bin:$PATH"\nalias ll=\'ls -la\'\nalias gs=\'git status\'\nalias py=\'python3\'',
  'notes.md': '# Dev Notes\n\n## Stack\n- React, Vite, TypeScript\n- FastAPI, Express\n- Docker, k3s, GitHub Actions\n\n## Projects\n- freelancer-toolkit-germany\n- quakeguard-bd\n- neonforge',
  'os-release': 'NAME="KimiOS"\nVERSION="1.0"\nPRETTY_NAME="KimiOS Linux 1.0"',
  'README.md': '# freelancer-toolkit-germany\n\nReact + Vite + Tailwind CSS v4\nfor the German freelancer market.\n\n## Features\n- Tax calculator\n- Invoice generator',
};

const APPS = {
  home:       { name: 'Files',        w: 720, h: 480 },
  settings:   { name: 'Settings',     w: 640, h: 480 },
  trash:      { name: 'Trash',        w: 440, h: 340 },
  browser:    { name: 'Web Browser',  w: 800, h: 560 },
  texteditor: { name: 'Text Editor',  w: 680, h: 500 },
  calendar:   { name: 'Calendar',     w: 440, h: 420 },
  terminal:   { name: 'Terminal',     w: 660, h: 420 },
};

const ICON_LIST = [
  { id: 'home',        label: 'Home'        },
  { id: 'settings',   label: 'Settings'    },
  { id: 'trash',      label: 'Trash'       },
  { id: 'browser',    label: 'Web Browser' },
  { id: 'texteditor', label: 'Text Editor' },
  { id: 'calendar',   label: 'Calendar'    },
  { id: 'terminal',   label: 'Terminal'    },
];

function Ico({ id, sz = 24, col = 'white' }) {
  const s = { fill: 'none', stroke: col, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    home:       [React.createElement('path', { d: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' }), React.createElement('polyline', { points: '9,22 9,12 15,12 15,22' })],
    settings:   [React.createElement('circle', { cx: '12', cy: '12', r: '3' }), React.createElement('path', { d: 'M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z' })],
    trash:      [React.createElement('polyline', { points: '3,6 5,6 21,6' }), React.createElement('path', { d: 'M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6' }), React.createElement('path', { d: 'M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2' })],
    browser:    [React.createElement('circle', { cx: '12', cy: '12', r: '10' }), React.createElement('line', { x1: '2', y1: '12', x2: '22', y2: '12' }), React.createElement('path', { d: 'M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z' })],
    texteditor: [React.createElement('path', { d: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z' }), React.createElement('polyline', { points: '14,2 14,8 20,8' }), React.createElement('line', { x1: '16', y1: '13', x2: '8', y2: '13' }), React.createElement('line', { x1: '16', y1: '17', x2: '8', y2: '17' })],
    calendar:   [React.createElement('rect', { x: '3', y: '4', width: '18', height: '18', rx: '2' }), React.createElement('line', { x1: '16', y1: '2', x2: '16', y2: '6' }), React.createElement('line', { x1: '8', y1: '2', x2: '8', y2: '6' }), React.createElement('line', { x1: '3', y1: '10', x2: '21', y2: '10' })],
    terminal:   [React.createElement('polyline', { points: '4,17 10,11 4,5' }), React.createElement('line', { x1: '12', y1: '19', x2: '20', y2: '19' })],
  };
  return React.createElement('svg', { width: sz, height: sz, viewBox: '0 0 24 24', ...s }, ...(paths[id] || []));
}

function KimiOS() {
  const [wins, setWins] = useState([]);
  const [active, setActive] = useState(null);
  const [zTop, setZTop] = useState(10);
  const [time, setTime] = useState(new Date());
  const [showActs, setShowActs] = useState(false);
  const [notif, setNotif] = useState(null);
  const [tLines, setTLines] = useState([{ k: 'sys', v: 'KimiOS Shell 1.0 — type "help" for available commands' }]);
  const [tInput, setTInput] = useState('');
  const [cwd, setCwd] = useState('/home/rintu');
  const [tHist, setTHist] = useState([]);
  const [tHIdx, setTHIdx] = useState(-1);
  const [eText, setEText] = useState('# Notes\n\nStart writing here...\n');
  const [eSaved, setESaved] = useState(true);
  const [fCwd, setFCwd] = useState('/home/rintu');
  const [accent, setAccent] = useState('#3b82f6');
  const tEndRef = useRef(null);
  const tInputRef = useRef(null);
  const dragRef = useRef(null);

  useEffect(() => { const id = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(id); }, []);
  useEffect(() => { tEndRef.current && tEndRef.current.scrollIntoView({ behavior: 'smooth' }); }, [tLines]);

  const notify = msg => { setNotif(msg); setTimeout(() => setNotif(null), 2500); };

  const openApp = id => {
    setShowActs(false);
    if (wins.find(w => w.id === id)) { bringFront(id); return; }
    const app = APPS[id];
    setZTop(prev => {
      const nz = prev + 1;
      setWins(p => [...p, { id, x: 70 + Math.random() * 100, y: 44 + Math.random() * 60, w: app.w, h: app.h, z: nz, min: false, max: false }]);
      return nz;
    });
    setActive(id);
  };

  const closeApp = id => { setWins(p => p.filter(w => w.id !== id)); setActive(a => a === id ? null : a); };
  const bringFront = id => { setZTop(prev => { const nz = prev + 1; setWins(p => p.map(w => w.id === id ? { ...w, z: nz, min: false } : w)); return nz; }); setActive(id); };
  const minimize = id => { setWins(p => p.map(w => w.id === id ? { ...w, min: true } : w)); setActive(a => a === id ? null : a); };
  const toggleMax = id => setWins(p => p.map(w => w.id === id ? { ...w, max: !w.max } : w));

  const startDrag = (e, id) => {
    if (e.button !== 0 || e.target.closest('[data-ctrl]')) return;
    e.preventDefault();
    const win = wins.find(w => w.id === id);
    if (!win || win.max) return;
    bringFront(id);
    dragRef.current = { id, ox: e.clientX - win.x, oy: e.clientY - win.y };
    const onMove = ev => { if (!dragRef.current) return; const { id: wid, ox, oy } = dragRef.current; setWins(p => p.map(w => w.id === wid ? { ...w, x: ev.clientX - ox, y: Math.max(32, ev.clientY - oy) } : w)); };
    const onUp = () => { dragRef.current = null; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const execCmd = raw => {
    const cmd = raw.trim();
    if (!cmd) return;
    setTHist(h => [cmd, ...h]);
    setTHIdx(-1);
    const [c, ...argv] = cmd.split(/\s+/);
    const push = (...lines) => setTLines(prev => [...prev, { k: 'in', v: cmd }, ...lines.map(v => ({ k: 'out', v: String(v) }))]);
    const resolve = arg => !arg ? cwd : arg.startsWith('/') ? arg : (cwd + '/' + arg).replace('//', '/');
    switch (c) {
      case 'help': push('ls  cd  pwd  echo  cat  clear  date  whoami  uname  neofetch  history  mkdir  touch  rm  git  python3  exit'); break;
      case 'ls': { const p = resolve(argv[0]); const e = FS[p] || FS[p.replace(/\/$/, '')]; e ? push(e.length ? e.join('    ') : '(empty)') : push(`ls: cannot access '${argv[0] || cwd}': No such file or directory`); break; }
      case 'pwd': push(cwd); break;
      case 'cd': { let t; if (!argv[0] || argv[0] === '~') t = '/home/rintu'; else if (argv[0] === '..') { const ps = cwd.split('/').filter(Boolean); ps.pop(); t = '/' + ps.join('/') || '/'; } else t = resolve(argv[0]); if (FS[t] !== undefined) { setCwd(t); push(); } else push(`bash: cd: ${argv[0]}: No such file or directory`); break; }
      case 'echo': push(argv.join(' ')); break;
      case 'whoami': push('rintu'); break;
      case 'date': push(new Date().toString()); break;
      case 'uname': push(argv.includes('-a') ? 'Linux kimios 6.8.0-kimi #1 SMP x86_64 GNU/Linux' : 'Linux'); break;
      case 'clear': setTLines([]); return;
      case 'cat': { if (!argv[0]) { push('cat: missing operand'); break; } const fn = argv[0].split('/').pop(); const ct = FILES[fn]; ct ? push(...ct.split('\n')) : push(`cat: ${argv[0]}: No such file or directory`); break; }
      case 'neofetch': push('', '  ██╗  ██╗██╗███╗   ███╗██╗ ██████╗ ███████╗', '  ██║ ██╔╝██║████╗ ████║██║██╔═══██╗██╔════╝', '  █████╔╝ ██║██╔████╔██║██║██║   ██║███████╗', '  ██╔═██╗ ██║██║╚██╔╝██║██║██║   ██║╚════██║', '  ██║  ██╗██║██║ ╚═╝ ██║██║╚██████╔╝███████║', '', '  rintu@kimios', '  OS: KimiOS Linux 1.0 x86_64', '  Kernel: 6.8.0-kimi  Shell: bash 5.2', '  CPU: Intel i7-12700H  GPU: RTX 3060', '  Memory: 6.2GiB / 16GiB', ''); break;
      case 'history': push(...tHist.map((h, i) => `  ${tHist.length - i}  ${h}`)); break;
      case 'mkdir': push(argv[0] ? `mkdir: created directory '${argv[0]}'` : 'mkdir: missing operand'); break;
      case 'touch': push(...(argv[0] ? [] : ['touch: missing file operand'])); break;
      case 'rm': push(...(argv[0] ? [] : ['rm: missing operand'])); break;
      case 'python3': push('Python 3.12.3 [GCC 13.2.0]', 'Type "exit()" to quit.'); break;
      case 'git': if (argv[0] === 'status') push("On branch main", "nothing to commit, working tree clean"); else if (argv[0] === 'log') push('commit a3f2c1d (HEAD -> main)', 'Author: Rintu Chowdory', `Date: ${new Date().toDateString()}`); else push(`git: '${argv[0]}' is not a git command`); break;
      case 'exit': closeApp('terminal'); return;
      default: push(`bash: ${c}: command not found`);
    }
  };

  const handleTermKey = e => {
    if (e.key === 'Enter') { execCmd(tInput); setTInput(''); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); const i = tHIdx + 1; if (i < tHist.length) { setTHIdx(i); setTInput(tHist[i]); } }
    else if (e.key === 'ArrowDown') { e.preventDefault(); const i = tHIdx - 1; if (i >= 0) { setTHIdx(i); setTInput(tHist[i]); } else { setTHIdx(-1); setTInput(''); } }
  };

  const renderApp = id => {
    const E = React.createElement;
    switch (id) {
      case 'terminal': return E('div', { style: { height: '100%', display: 'flex', flexDirection: 'column', background: '#0d1117', fontFamily: '"Cascadia Code","Fira Code","Courier New",monospace', fontSize: 13 }, onClick: () => tInputRef.current && tInputRef.current.focus() },
        E('div', { style: { flex: 1, overflowY: 'auto', padding: '10px 14px', lineHeight: 1.65 } },
          ...tLines.map((l, i) => E('div', { key: i, style: { color: l.k === 'sys' ? '#7ee787' : l.k === 'in' ? '#e6edf3' : '#8b949e', whiteSpace: 'pre-wrap', wordBreak: 'break-all' } }, l.k === 'in' && E('span', { style: { color: '#7ee787' } }, `rintu@kimios:${cwd}$ `), l.v)),
          E('div', { ref: tEndRef })),
        E('div', { style: { display: 'flex', alignItems: 'center', padding: '6px 14px', borderTop: '1px solid #21262d', background: '#0d1117' } },
          E('span', { style: { color: '#7ee787', marginRight: 8, whiteSpace: 'nowrap' } }, `rintu@kimios:${cwd}$`),
          E('input', { ref: tInputRef, value: tInput, onChange: e => setTInput(e.target.value), onKeyDown: handleTermKey, autoFocus: true, style: { flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#e6edf3', fontFamily: 'inherit', fontSize: 'inherit', caretColor: '#7ee787' } })));
      case 'home': {
        const entries = FS[fCwd] || [];
        const isDir = n => FS[(fCwd + '/' + n).replace('//', '/')] !== undefined;
        return E('div', { style: { height: '100%', display: 'flex', flexDirection: 'column', background: '#1c1c1e', color: '#e5e7eb' } },
          E('div', { style: { display: 'flex', gap: 8, padding: '8px 12px', borderBottom: '1px solid #374151', background: '#111827', alignItems: 'center' } },
            E('button', { onClick: () => { const p = fCwd.split('/').filter(Boolean); p.pop(); setFCwd('/' + p.join('/') || '/'); }, style: { background: '#374151', border: 'none', color: '#e5e7eb', borderRadius: 4, padding: '3px 10px', cursor: 'pointer', fontSize: 12 } }, '← Back'),
            E('div', { style: { flex: 1, background: '#374151', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontFamily: 'monospace', color: '#9ca3af' } }, fCwd)),
          E('div', { style: { flex: 1, overflowY: 'auto', padding: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(88px,1fr))', gap: 8, alignContent: 'start' } },
            ...entries.map(n => E('div', { key: n, onDoubleClick: () => isDir(n) && setFCwd((fCwd + '/' + n).replace('//', '/')), style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 6px', borderRadius: 8, cursor: 'pointer', background: 'rgba(255,255,255,0.04)' }, onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)', onMouseLeave: e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)' },
              E('span', { style: { fontSize: 28 } }, isDir(n) ? '📁' : n.endsWith('.md') ? '📝' : n.endsWith('.pdf') ? '📄' : n.startsWith('.') ? '⚙️' : n.endsWith('.deb') ? '📦' : '📄'),
              E('span', { style: { fontSize: 11, textAlign: 'center', color: '#d1d5db', wordBreak: 'break-word', maxWidth: 80 } }, n))),
            !entries.length && E('div', { style: { color: '#6b7280', gridColumn: '1/-1', textAlign: 'center', marginTop: 40 } }, 'Empty folder')));
      }
      case 'texteditor': return E('div', { style: { height: '100%', display: 'flex', flexDirection: 'column', background: '#1e1e2e', color: '#cdd6f4' } },
        E('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 12px', borderBottom: '1px solid #313244', background: '#181825', fontSize: 12 } },
          E('span', { style: { color: eSaved ? '#a6e3a1' : '#f38ba8' } }, eSaved ? '● Saved' : '● Unsaved'),
          E('button', { onClick: () => { setESaved(true); notify('💾 Saved'); }, style: { background: '#313244', border: 'none', color: '#cdd6f4', borderRadius: 4, padding: '3px 12px', cursor: 'pointer', fontSize: 11 } }, 'Save')),
        E('textarea', { value: eText, onChange: e => { setEText(e.target.value); setESaved(false); }, style: { flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#cdd6f4', fontFamily: '"Fira Code",monospace', fontSize: 13, padding: 14, resize: 'none', lineHeight: 1.7 } }),
        E('div', { style: { padding: '3px 12px', borderTop: '1px solid #313244', background: '#181825', fontSize: 11, color: '#585b70', display: 'flex', gap: 16 } },
          E('span', null, `Lines: ${eText.split('\n').length}`), E('span', null, `Chars: ${eText.length}`), E('span', null, 'UTF-8')));
      case 'browser': return E('div', { style: { height: '100%', display: 'flex', flexDirection: 'column', background: '#13111c', color: '#fbfbfe' } },
        E('div', { style: { display: 'flex', gap: 8, padding: '8px 10px', background: '#2b2a33', borderBottom: '1px solid #52525b', alignItems: 'center' } },
          ...['←', '→', '↺'].map(b => E('button', { key: b, style: { background: '#3d3c47', border: 'none', color: '#fbfbfe', borderRadius: 4, padding: '3px 9px', cursor: 'pointer', fontSize: 13 } }, b)),
          E('div', { style: { flex: 1, background: '#3d3c47', borderRadius: 6, padding: '4px 10px', fontSize: 12, display: 'flex', gap: 6, alignItems: 'center' } }, E('span', { style: { color: '#6b7280' } }, '🔒'), E('span', { style: { color: '#9ca3af' } }, 'kimios.io — New Tab'))),
        E('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 } },
          E('div', { style: { fontSize: 52 } }, '🌐'),
          E('div', { style: { fontSize: 18, fontWeight: 600 } }, 'KimiBrowser'),
          E('div', { style: { fontSize: 12, color: '#6b7280' } }, 'Sandboxed browser environment'),
          E('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', maxWidth: 400, marginTop: 8 } },
            ...['GitHub', 'Vercel', 'Cloudflare', 'Groq API', 'MDN Docs'].map(s => E('div', { key: s, style: { background: '#2b2a33', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 12, color: '#a78bfa', border: '1px solid #3d3c47' }, onMouseEnter: e => e.currentTarget.style.background = '#3d3c47', onMouseLeave: e => e.currentTarget.style.background = '#2b2a33' }, s)))));
      case 'settings': return E('div', { style: { height: '100%', display: 'flex', background: '#1c1c1e', color: '#e5e7eb' } },
        E('div', { style: { width: 170, borderRight: '1px solid #374151', background: '#111827', padding: 8 } },
          ...['Appearance', 'Display', 'Network', 'Bluetooth', 'Users', 'Privacy', 'Sound', 'Power', 'About'].map((s, i) => E('div', { key: s, style: { padding: '7px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13, background: i === 0 ? accent : 'transparent', marginBottom: 2 } }, s))),
        E('div', { style: { flex: 1, padding: 20, overflowY: 'auto' } },
          E('h3', { style: { margin: '0 0 18px', fontSize: 15, color: '#f3f4f6' } }, 'Appearance'),
          E('div', { style: { marginBottom: 18 } },
            E('div', { style: { fontSize: 12, color: '#9ca3af', marginBottom: 10 } }, 'Accent Color'),
            E('div', { style: { display: 'flex', gap: 10 } },
              ...['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#ef4444'].map(c => E('div', { key: c, onClick: () => setAccent(c), style: { width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer', border: `3px solid ${accent === c ? 'white' : 'transparent'}` } })))),
          E('div', { style: { padding: 14, background: '#111827', borderRadius: 10, marginTop: 10 } },
            E('div', { style: { fontSize: 12, color: '#9ca3af', marginBottom: 10 } }, 'System Info'),
            ...[['OS', 'KimiOS Linux 1.0'], ['Kernel', '6.8.0-kimi'], ['Memory', '16 GB DDR5'], ['CPU', 'Intel i7-12700H']].map(([k, v]) => E('div', { key: k, style: { fontSize: 12, lineHeight: 2.1, color: '#d1d5db' } }, E('span', { style: { color: '#6b7280' } }, k + ': '), v)))));
      case 'calendar': {
        const now = new Date(); const y = now.getFullYear(), m = now.getMonth();
        const dim = new Date(y, m + 1, 0).getDate(); const fd = new Date(y, m, 1).getDay();
        const cells = [...Array(fd).fill(null), ...Array.from({ length: dim }, (_, i) => i + 1)];
        return E('div', { style: { height: '100%', display: 'flex', flexDirection: 'column', background: '#1c1c1e', color: '#e5e7eb', padding: 20 } },
          E('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } },
            E('button', { style: { background: '#374151', border: 'none', color: '#e5e7eb', borderRadius: 6, padding: '5px 12px', cursor: 'pointer' } }, '◀'),
            E('h3', { style: { margin: 0, fontSize: 15 } }, now.toLocaleDateString('en', { month: 'long', year: 'numeric' })),
            E('button', { style: { background: '#374151', border: 'none', color: '#e5e7eb', borderRadius: 6, padding: '5px 12px', cursor: 'pointer' } }, '▶')),
          E('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, textAlign: 'center' } },
            ...['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => E('div', { key: d, style: { padding: '5px 0', fontSize: 11, color: '#6b7280', fontWeight: 700 } }, d)),
            ...cells.map((d, i) => E('div', { key: i, style: { padding: '8px 0', fontSize: 14, borderRadius: 8, cursor: d ? 'pointer' : 'default', background: d === now.getDate() ? accent : 'transparent', color: d === now.getDate() ? '#fff' : d ? '#e5e7eb' : 'transparent' }, onMouseEnter: e => { if (d && d !== now.getDate()) e.currentTarget.style.background = '#374151'; }, onMouseLeave: e => { if (d && d !== now.getDate()) e.currentTarget.style.background = 'transparent'; } }, d || ''))));
      }
      case 'trash': return E('div', { style: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, background: '#1c1c1e', color: '#6b7280' } },
        E('span', { style: { fontSize: 64 } }, '🗑️'), E('div', { style: { fontSize: 15, color: '#9ca3af' } }, 'Trash is Empty'));
      default: return null;
    }
  };

  const E = React.createElement;
  return E('div', { style: { width: '100%', height: '100vh', position: 'relative', overflow: 'hidden', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', userSelect: 'none' }, onClick: () => setShowActs(false) },
    E('div', { style: { position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#0f0623 0%,#2d1b69 25%,#7c3aed 45%,#db2777 65%,#f97316 85%,#eab308 100%)' } },
      E('svg', { style: { position: 'absolute', inset: 0, width: '100%', height: '100%' }, viewBox: '0 0 1440 810', preserveAspectRatio: 'xMidYMid slice' },
        E('defs', null,
          E('linearGradient', { id: 'wg1', x1: '0%', y1: '0%', x2: '100%', y2: '100%' }, E('stop', { offset: '0%', stopColor: '#f97316' }), E('stop', { offset: '100%', stopColor: '#db2777' })),
          E('linearGradient', { id: 'wg2', x1: '0%', y1: '100%', x2: '100%', y2: '0%' }, E('stop', { offset: '0%', stopColor: '#7c3aed' }), E('stop', { offset: '100%', stopColor: '#1e40af' })),
          E('linearGradient', { id: 'wg3', x1: '100%', y1: '0%', x2: '0%', y2: '100%' }, E('stop', { offset: '0%', stopColor: '#0ea5e9' }), E('stop', { offset: '100%', stopColor: '#7c3aed' }))),
        E('path', { d: 'M-100,450 C300,100 600,750 1000,380 C1200,200 1350,620 1540,320', stroke: 'url(#wg1)', strokeWidth: '140', strokeLinecap: 'round', fill: 'none', opacity: '0.65' }),
        E('path', { d: 'M-100,620 C250,320 500,850 900,520 C1150,350 1300,680 1540,480', stroke: 'url(#wg2)', strokeWidth: '100', strokeLinecap: 'round', fill: 'none', opacity: '0.5' }),
        E('path', { d: 'M-100,220 C400,520 700,100 1050,320 C1280,480 1400,200 1540,380', stroke: 'url(#wg3)', strokeWidth: '80', strokeLinecap: 'round', fill: 'none', opacity: '0.4' }),
        E('polygon', { points: '580,180 760,420 400,400', fill: '#f97316', opacity: '0.12' }),
        E('polygon', { points: '820,280 990,500 650,490', fill: '#db2777', opacity: '0.10' }),
        E('polygon', { points: '350,480 530,700 170,680', fill: '#7c3aed', opacity: '0.13' }),
        E('polygon', { points: '1020,180 1200,400 840,380', fill: '#f97316', opacity: '0.09' }),
        E('polygon', { points: '680,380 860,600 500,580', fill: '#fbbf24', opacity: '0.08' }))),
    E('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: 32, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', zIndex: 1000 } },
      E('button', { onClick: ev => { ev.stopPropagation(); setShowActs(v => !v); }, style: { background: showActs ? 'rgba(255,255,255,0.18)' : 'transparent', border: 'none', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '3px 8px', borderRadius: 4 } }, 'Activities'),
      E('div', { style: { color: 'white', fontSize: 13, fontWeight: 500 } }, time.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' }) + '  ' + time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
      E('div', { style: { display: 'flex', gap: 10, color: 'rgba(255,255,255,0.9)', fontSize: 13 } }, E('span', null, '📶'), E('span', null, '🔊'), E('span', null, '🔋 100%'))),
    showActs && E('div', { onClick: ev => ev.stopPropagation(), style: { position: 'absolute', top: 32, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(24px)', zIndex: 900, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 40 } },
      E('div', { style: { width: 440, background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, border: '1px solid rgba(255,255,255,0.2)' } },
        E('span', { style: { color: 'rgba(255,255,255,0.5)', fontSize: 16 } }, '🔍'),
        E('input', { placeholder: 'Type to search…', autoFocus: true, style: { flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: 14 } })),
      E('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', maxWidth: 540 } },
        ...ICON_LIST.map(({ id, label }) => E('div', { key: id, onClick: () => openApp(id), style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '13px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', width: 88 }, onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)', onMouseLeave: e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)' },
          E('div', { style: { width: 42, height: 42, background: 'rgba(255,255,255,0.12)', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' } }, E(Ico, { id, sz: 22 })),
          E('span', { style: { color: 'white', fontSize: 11, textAlign: 'center' } }, label))))),
    E('div', { style: { position: 'absolute', top: 44, left: 12, display: 'flex', flexDirection: 'column', gap: 6, zIndex: 1 } },
      ...ICON_LIST.map(({ id, label }) => E('div', { key: id, onDoubleClick: () => openApp(id), style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', padding: '8px 6px', borderRadius: 8, width: 72 }, onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)', onMouseLeave: e => e.currentTarget.style.background = 'transparent' },
        E(Ico, { id, sz: 28 }),
        E('span', { style: { color: 'white', fontSize: 11, textAlign: 'center', textShadow: '0 1px 4px rgba(0,0,0,0.9)' } }, label)))),
    ...wins.filter(w => !w.min).map(win => {
      const app = APPS[win.id]; const isMax = win.max;
      const box = isMax ? { position: 'absolute', top: 32, left: 0, width: '100%', height: 'calc(100% - 32px)', borderRadius: 0 } : { position: 'absolute', top: win.y, left: win.x, width: win.w, height: win.h, borderRadius: 10 };
      return E('div', { key: win.id, onClick: () => bringFront(win.id), style: { ...box, zIndex: win.z, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: active === win.id ? '0 24px 64px rgba(0,0,0,0.85)' : '0 10px 32px rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.09)' } },
        E('div', { onMouseDown: ev => startDrag(ev, win.id), style: { height: 36, display: 'flex', alignItems: 'center', padding: '0 12px', background: active === win.id ? '#2d2d2d' : '#1e1e1e', cursor: isMax ? 'default' : 'move', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.08)' } },
          E('div', { 'data-ctrl': '', style: { display: 'flex', gap: 7 } },
            ...[['#ff5f57', '×', () => closeApp(win.id)], ['#febc2e', '−', () => minimize(win.id)], ['#28c840', '+', () => toggleMax(win.id)]].map(([bg, sym, fn]) => E('div', { key: bg, onClick: fn, style: { width: 12, height: 12, borderRadius: '50%', background: bg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: 'rgba(0,0,0,0.7)' }, onMouseEnter: ev => ev.currentTarget.textContent = sym, onMouseLeave: ev => ev.currentTarget.textContent = '' }))),
          E('span', { style: { flex: 1, textAlign: 'center', color: '#e5e7eb', fontSize: 13, fontWeight: 500, pointerEvents: 'none' } }, app.name)),
        E('div', { style: { flex: 1, overflow: 'hidden' } }, renderApp(win.id)));
    }),
    E('div', { style: { position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.68)', backdropFilter: 'blur(22px)', borderRadius: 18, padding: '7px 12px', display: 'flex', alignItems: 'center', gap: 5, zIndex: 1000, border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', whiteSpace: 'nowrap' } },
      ...ICON_LIST.map(({ id }) => {
        const isOpen = wins.some(w => w.id === id);
        const isAct = active === id && !wins.find(w => w.id === id)?.min;
        return E('div', { key: id, onClick: () => openApp(id), title: APPS[id].name, style: { width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: isAct ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.08)', position: 'relative' }, onMouseEnter: e => { if (!isAct) e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }, onMouseLeave: e => { if (!isAct) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; } },
          E(Ico, { id, sz: 19, col: isAct ? '#fff' : 'rgba(255,255,255,0.8)' }),
          isOpen && E('div', { style: { position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: isAct ? '#60a5fa' : 'rgba(255,255,255,0.45)' } }));
      }),
      E('div', { style: { width: 1, height: 28, background: 'rgba(255,255,255,0.18)', margin: '0 4px' } }),
      ...wins.filter(w => w.min).map(w => E('div', { key: w.id, onClick: () => bringFront(w.id), style: { background: 'rgba(255,255,255,0.14)', borderRadius: 8, padding: '4px 9px', fontSize: 11, color: 'rgba(255,255,255,0.85)', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.08)' } }, APPS[w.id].name)),
      E('div', { style: { width: 1, height: 28, background: 'rgba(255,255,255,0.18)', margin: '0 4px' } }),
      E('div', { style: { display: 'flex', alignItems: 'center', gap: 7, padding: '5px 10px', background: 'rgba(255,255,255,0.1)', borderRadius: 10, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.18)' }, onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)', onMouseLeave: e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)' },
        E('div', { style: { width: 19, height: 19, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'white', fontWeight: 800 } }, 'K'),
        E('span', { style: { color: 'white', fontSize: 12, fontWeight: 500 } }, 'Kimi Agent')),
      E('button', { style: { background: '#374151', border: 'none', color: 'white', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontSize: 12 } }, 'Replay'),
      E('button', { style: { background: '#1d4ed8', border: 'none', color: 'white', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 600 } }, 'Remix')),
    notif && E('div', { style: { position: 'fixed', top: 40, right: 14, background: 'rgba(20,20,20,0.96)', borderRadius: 10, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, zIndex: 9999, color: 'white', fontSize: 13, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)' } }, notif));
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(KimiOS));
