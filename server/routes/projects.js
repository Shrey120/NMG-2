import express from 'express';
import { pool } from '../db.js';
import { requireAdmin, route } from '../auth.js';
import { uploadImage } from '../upload.js';

export const router = express.Router();

router.get(
  '/',
  route(async (req, res) => {
    const [projects] = await pool.query('SELECT * FROM projects ORDER BY `year` DESC, id');
    res.json(projects);
  })
);

router.get(
  '/:slug',
  route(async (req, res) => {
    const [projects] = await pool.query('SELECT * FROM projects WHERE slug = ?', [req.params.slug]);
    if (projects.length === 0) return res.status(404).json({ error: 'Project not found' });

    const [work] = await pool.query(
      'SELECT description FROM projectWork WHERE projectId = ? ORDER BY id',
      [projects[0].id]
    );

    res.json({ ...projects[0], work: work.map((row) => row.description) });
  })
);

// Turns "BMW E30 Track Build" into "bmw-e30-track-build" for the page address.
function toSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Work items arrive as one string per line. They are stored as separate rows,
// so the old ones are deleted and the new ones inserted together.
async function saveWork(projectId, workText) {
  await pool.query('DELETE FROM projectWork WHERE projectId = ?', [projectId]);

  const lines = (workText || '').split('\n').map((line) => line.trim()).filter(Boolean);
  for (const line of lines) {
    await pool.query('INSERT INTO projectWork (projectId, description) VALUES (?, ?)', [projectId, line]);
  }
}

router.post(
  '/',
  requireAdmin,
  route(async (req, res) => {
    const p = req.body;
    const [result] = await pool.query(
      `INSERT INTO projects (slug, title, make, category, \`year\`, duration, summary, story, result, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [toSlug(p.title), p.title, p.make, p.category, p.year, p.duration, p.summary, p.story, p.result, p.featured ? 1 : 0]
    );
    await saveWork(result.insertId, p.workText);
    res.status(201).json({ id: result.insertId });
  })
);

router.put(
  '/:id',
  requireAdmin,
  route(async (req, res) => {
    const p = req.body;
    await pool.query(
      `UPDATE projects SET slug = ?, title = ?, make = ?, category = ?, \`year\` = ?,
       duration = ?, summary = ?, story = ?, result = ?, featured = ? WHERE id = ?`,
      [toSlug(p.title), p.title, p.make, p.category, p.year, p.duration, p.summary, p.story, p.result, p.featured ? 1 : 0, req.params.id]
    );
    await saveWork(req.params.id, p.workText);
    res.json({ ok: true });
  })
);

router.delete(
  '/:id',
  requireAdmin,
  route(async (req, res) => {
    // projectWork rows go too, because of ON DELETE CASCADE in the schema.
    await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  })
);

// Picture for one project. The client will supply real photographs later,
// so this is how they get in without a developer.
router.post(
  '/:id/image',
  requireAdmin,
  uploadImage,
  route(async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Choose a JPEG, PNG or WebP image' });
    await pool.query('UPDATE projects SET image = ? WHERE id = ?', [req.file.filename, req.params.id]);
    res.json({ image: req.file.filename });
  })
);

router.delete(
  '/:id/image',
  requireAdmin,
  route(async (req, res) => {
    await pool.query('UPDATE projects SET image = NULL WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  })
);
