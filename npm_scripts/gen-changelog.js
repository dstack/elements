var cc = require('conventional-changelog'),
  fs = require('fs'),
  exec = require('child_process').exec;

var outStream = fs.createWriteStream('CHANGELOG.md');

var ccStream = cc({
  preset: 'angular',
  releaseCount: 0
}).pipe(outStream);

ccStream.on('close', function(){
  console.log('CHANGELOG.md generated');
  exec('git add -A & git commit -m "chore: generated changelog"');
});
