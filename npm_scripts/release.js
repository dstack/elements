var execSync = require('child_process').execSync;

execSync('node npm_scripts/gen-docs.js', {stdio: 'inherit'});
execSync('node npm_scripts/tag-version.js', {stdio: 'inherit'});
execSync('node npm_scripts/gen-changelog.js', {stdio: 'inherit'});
execSync('git push origin HEAD --tags', {stdio: 'inherit'});
