const { execSync } = require('child_process');
try {
  execSync('git checkout -- src/components/admin/TaskManagement.tsx');
  console.log('Successfully restored TaskManagement.tsx');
} catch (e) {
  console.error('Git restore failed:', e.message);
}
