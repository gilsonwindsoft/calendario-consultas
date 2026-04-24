require('dotenv').config();
const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Dados persistidos no volume Docker em /data (ou DATA_DIR para dev local)
const DATA_DIR = process.env.DATA_DIR || '/data';
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = path.join(DATA_DIR, 'consultas.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS consultas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT NOT NULL UNIQUE,
    valor REAL NOT NULL DEFAULT 220.00,
    observacao TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS pagamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT NOT NULL,
    valor REAL NOT NULL,
    observacao TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );
`);

// ── CONSULTAS ─────────────────────────────────────────────────────

app.get('/api/consultas', (req, res) => {
  res.json(db.prepare('SELECT * FROM consultas ORDER BY data DESC').all());
});

app.post('/api/consultas', (req, res) => {
  const { data, valor = 220.00, observacao = '' } = req.body;
  if (!data) return res.status(400).json({ error: 'Data obrigatória' });
  try {
    const result = db.prepare(
      'INSERT INTO consultas (data, valor, observacao) VALUES (?, ?, ?)'
    ).run(data, valor, observacao);
    res.json({ id: result.lastInsertRowid, data, valor, observacao });
  } catch (e) {
    if (e.message.includes('UNIQUE')) {
      res.status(409).json({ error: 'Consulta já registrada nesta data' });
    } else {
      res.status(500).json({ error: e.message });
    }
  }
});

app.delete('/api/consultas/:id', (req, res) => {
  db.prepare('DELETE FROM consultas WHERE id = ?').run(Number(req.params.id));
  res.json({ ok: true });
});

// ── PAGAMENTOS ────────────────────────────────────────────────────

app.get('/api/pagamentos', (req, res) => {
  res.json(db.prepare('SELECT * FROM pagamentos ORDER BY data DESC').all());
});

app.post('/api/pagamentos', (req, res) => {
  const { data, valor, observacao = '' } = req.body;
  if (!data || valor == null) return res.status(400).json({ error: 'Data e valor obrigatórios' });
  const result = db.prepare(
    'INSERT INTO pagamentos (data, valor, observacao) VALUES (?, ?, ?)'
  ).run(data, parseFloat(valor), observacao);
  res.json({ id: result.lastInsertRowid, data, valor: parseFloat(valor), observacao });
});

app.delete('/api/pagamentos/:id', (req, res) => {
  db.prepare('DELETE FROM pagamentos WHERE id = ?').run(Number(req.params.id));
  res.json({ ok: true });
});

// ── RESUMO ────────────────────────────────────────────────────────

app.get('/api/resumo', (req, res) => {
  const totalConsultas = db.prepare('SELECT COALESCE(SUM(valor),0) as t FROM consultas').get().t;
  const totalPago      = db.prepare('SELECT COALESCE(SUM(valor),0) as t FROM pagamentos').get().t;
  res.json({ totalConsultas, totalPago, saldo: totalConsultas - totalPago });
});

// ── HEALTH ────────────────────────────────────────────────────────

app.get('/health', (req, res) => res.json({ ok: true }));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => console.log(`✅ Servidor rodando na porta ${PORT}`));
