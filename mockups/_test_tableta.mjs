import fs from 'node:fs';
let html = fs.readFileSync('mockups_fast_creative_builder.html','utf8');
html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g,(m,f)=>'<style>\n'+fs.readFileSync(f,'utf8')+'\n</style>');
html = html.replace(/<script src="([^"]+)"><\/script>/g,(m,f)=>'<script>\n'+fs.readFileSync(f,'utf8')+'\n<\/script>');
fs.writeFileSync('_test_tableta.html', html);
console.log('ok', (fs.statSync('_test_tableta.html').size/1024).toFixed(0)+'KB');
