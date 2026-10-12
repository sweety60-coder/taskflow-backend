const db = require('./config/db');

db.query("DELETE FROM tasks WHERE user_id = 6 AND title IN ('21st Task Test','Limit Verification')")
  .then(([result]) => {
    console.log('Deleted extra test tasks:', result.affectedRows);
  })
  .catch(error => {
    console.error(error.message);
  })
  .finally(() => process.exit());
