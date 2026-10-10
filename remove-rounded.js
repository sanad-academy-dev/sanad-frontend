const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('website/src');
const roundedRegex = /rounded-(3xl|2xl|xl|lg|md|sm|\[\d+(px|rem)\])/g;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Remove the explicit large rounded classes
    content = content.replace(roundedRegex, '');
    
    // Fix double spaces inside className
    content = content.replace(/className=(['"`])(.*?)\1/g, (match, quote, p1) => {
        return 'className=' + quote + p1.replace(/\s+/g, ' ').trim() + quote;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated', file);
    }
}
