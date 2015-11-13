var MetalSmith = require('metalsmith'),
  exec = require('child_process').exec,
  fs = require('fs'),
  path = require('path'),
  swig = require('swig'),
  hljs = require('highlight.js'),
  basePath = __dirname + '/../docs2',
  noop = function(){};


//add demo tag
swig.setExtension('hljs', hljs);
function demoParse(str, line, parser, types, options){return true;}
function demoCompile(compiler, args, content, parents, options, blockName){
  var chosen = {
    compile: "  var __tpl = _ext.hljs.highlight('html', _output.replace(/^\\n/, ''));\n",
    include: "  __o += '<div class=\"d-demo pe-card\"><div class=\"pe-card__heading\">' +_output + '</div><div class=\"pe-card__content\"><pre><code class=\"hljs html\">' + __tpl.value + '</code></pre></div></div>';\n"
  };

  return '(function () {\n' +
    '  var __o = _output;\n' +
    '  _output = "";\n' +
    compiler(content, parents, options, blockName).replace(/"\\n/, '"').replace(/\\n"/, '"') + '\n' +
    chosen.compile +
    chosen.include +
    '  _output = __o;\n' +
    '})();\n';
}
swig.setTag('demo',demoParse, demoCompile, true, true);

function loadData(cb){
  cb = cb || noop;
  var data = {};
  fs.access(basePath+'/_data', fs.R_OK, function(accessError){
    if(accessError){
      console.log('no data to load, continuing', accessError);
    }
    else{
      fs.readdir(basePath+'/_data', function(readdirError, files){
        files.forEach(function(f){
          var ext = path.extname(f),
            fName = path.basename(f, ext);
          if(ext == '.json'){
            data[fName] = require(basePath+'/_data/'+fName);
          }
        });
        cb(readdirError, data);
      });
    }
  });
}

function genDocs(d, cb){
  cb = cb || noop;
  MetalSmith(__dirname)
    .source(basePath)
    .destination('../_gh_pages')
    .clean(true)
    .metadata(d)
    .ignore(['_includes','_data', '_layouts', '_plugins'])
    .use(require('metalsmith-drafts')())
    .use(require('metalsmith-in-place')({engine: 'swig'}))
    .use(require('metalsmith-markdown')())
    .use(require('metalsmith-sass')({
      outputDir: 'css/',
      includePaths: [basePath+'/assets/scss']
    }))


    .use(require('metalsmith-permalinks')({
      pattern: ':seciton/:title'
    }))
    .use(require('metalsmith-layouts')({
      engine: 'swig',
      directory: basePath+'/_layouts'
    }))
    .build(function(err){
      if(err){
        console.log(err);
      }
      exec('gulp sass', {cwd: __dirname+'/../'}, function(){
        cb();
      });
      //
    });
}

function commitDocs(cb){
  cb = cb || noop;
  console.log('pushing to gh-pages')
  exec('git add _gh_pages/* -A & git commit -m "chore: doc generation"', function(e){
    if(e){
      // this is expected to happen on windows for CRLF errors
      //console.log('commit docs error', e);
    }
    cb();
  });
}

function pushDocs(cb){
  cb = cb || noop;
  exec('git subtree push --prefix _gh_pages origin gh-pages', {stdio: 'inherit'}, cb);
}

loadData(function(dError, data){
  if(dError){
    console.log('Errors generating data');
  }
  else {
    var d = {site: {data: data}};
    if(data.site){
      d.site = data.site;
      delete data.site;
      d.site.data = data;
    }
    genDocs(d, function(){
      commitDocs(function(){
        pushDocs();
      });
    });
  }
});
