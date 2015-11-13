var pkg = require('../package'),
  cp = require('child_process'),
  readline = require('readline'),
  fs = require('fs'),
  semver = require('semver'),
  exec = cp.exec,
  execSync = cp.execSync,
  noop = function(){};

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var pkgVer = pkg.version || '',
  lastTag = '',
  pkgNewer = false,
  pkgValid = false,
  newTag = '',
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

function createTag(){
  console.log('Creating Git Tag. Pushing up Git Tag.');
  execSync('git tag -a -m "release: ' + newTag + '" '+ newTag);
  console.log('~~FIN~~');
  process.exit(0);
}

function promptForVersion(cb){
  cb = cb || noop;
  rl.question("No valid version found.  Please enter a valid semver version. ", function(ans){
    if(!semver.valid(ans)){
      promptForVersion();
    }
    else{
      rl.close();
      newTag = ans;
      console.log('Updating package.json');
      pkg.version = ans;
      fs.writeFileSync('./package.json', JSON.stringify(pkg, null, '\t') );
      console.log('Committing new package.json');
      execSync('git add package.json & git commit -m "chore: version bumped to ' + ans);
      cb();
    }
  });
}


try{
  lastTag = execSync('git describe --abbrev=0').replace(/[a-z]/, '');
}
catch(e) {
  lastTag = '';
}

if(semver.valid(lastTag) && semver.valid(pkgVer)){
  pkgNewer = semver.gt(pkgVer, lastTag);
  pkgValid = true;
  if(pkgNewer){
    newTag = pkgVer;
  }
}
else if (semver.valid(pkgVer)){
  pkgNewer = true;
  pkgValid = true;
  newTag = pkgVer;
}

if(!pkgNewer || !pkgValid){
  promptForVersion(createTag);
}
else{
  createTag();
}

// get tag git describe --abbrev=0


// compare package.json version to last tag, see if we need to prompt for version

// update package.json and add it if neccessary

// write out git tag

// commit rev with git tag

// exit
