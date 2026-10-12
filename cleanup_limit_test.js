const db = require('./config/db');

db.query("DELETE FROM tasks WHERE user_id = 6 AND title LIKE 'LIMIT TEST %'")
  .then(([result]) => {
    console.log('Deleted temporary tasks:', result.affectedRows);
  })
  .catch(error => {
    console.error(error.message);
  })
  .finally(() => process.exit());
