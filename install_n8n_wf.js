const sqlite3 = require('C:/Users/juano/AppData/Roaming/npm/node_modules/n8n/node_modules/sqlite3');
const fs = require('fs');
const path = require('path');

const wfPath = path.join(__dirname, 'workflow_dux_cierre_objetivos.json');
const wf = JSON.parse(fs.readFileSync(wfPath, 'utf8'));
const db = new sqlite3.Database('C:/Users/juano/.n8n/database.sqlite');

const newId = 'NazariaDuxCierre01';
const versionId = 'c0a1b2c3-d4e5-4f6a-8b9c-0d1e2f3a4b5c';
const sql = `
  INSERT OR REPLACE INTO workflow_entity (
    id, name, active, nodes, connections, settings, versionId, triggerCount, createdAt, updatedAt
  ) VALUES (?, ?, 1, ?, ?, ?, ?, 1, datetime("now"), datetime("now"))
`;

db.run(sql, [
  newId,
  wf.name,
  JSON.stringify(wf.nodes),
  JSON.stringify(wf.connections),
  JSON.stringify(wf.settings || {}),
  versionId
], function(err) {
  if (err) {
    console.error('Error insertando workflow:', err.message);
  } else {
    console.log('✅ Workflow instalado exitosamente en n8n con ID:', newId);
  }
  db.close();
});
