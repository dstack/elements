var cc = require('conventional-changelog'),
  fs = require('fs');

cc({
  preset: 'angular',
  releaseCount: 0
}).pipe(fs.createWriteStream('CHANGELOG.md'));
