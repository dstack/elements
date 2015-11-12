var changelog = require('changelog'),
  fs = require('fs'),
  pkg = require('../package');


var pkgName = pkg.name.replace('@', '');
changelog.generate(pkgName).then(function(data){ var output = changelog.markdown(data); console.log(output); })

// use conventional-changelog
/*

var conventionalChangelog = require('conventional-changelog');

conventionalChangelog({
  preset: 'angular'
})
  .pipe(process.stdout);

*/
