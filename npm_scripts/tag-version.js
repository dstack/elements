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
  var ver = 'v'+newTag;
  // update package.json
}

function promptForVersion(cb){
  cb = cb || noop;
  rl.question("No valid version found.  Please enter a valid semver version. ", function(ans){
    if(!semver.valid(ans)){
      promptForVersion();
    }
    else{
      newTag = ans;
      pkg.version = ans;
      fs.writeFileSync('./package.json', JSON.stringify(pkg, null, '\t') );
      //execSync()
      execSync('git add -A & git commit -m "version bumped to ' + ans);
      rl.close();
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
