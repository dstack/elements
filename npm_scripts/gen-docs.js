var MetalSmith = require('metalsmith'),
  exec = require('child_process').exec,
  swig = require('swig');

MetalSmith(__dirname)
.source('../docs')
.destination('../_gh_pages')
.clean(true)
.ignore(['_includes','_data', '_layouts', '_plugins'])
.use(require('metalsmith-drafts')())
.use(require('metalsmith-markdown')())
.use(require('metalsmith-sass')())
.use(require('metalsmith-permalinks')({
  pattern: ':title'
}))
/*
.use(function(files, metalsmith, done){

})
*/
.build(function(err){
  if(err){
    console.log(err);
  }
  console.log('pushing to gh-pages')
  exec('git subtree push --prefix _gh_pages origin gh-pages', {stdio: 'inherit'});
  //
});
// use metalsmith to generate to _gh_pages
