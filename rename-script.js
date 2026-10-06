const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walkDir(file));
        } else { 
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walkDir(path.join(__dirname, 'src'));
let changedFiles = 0;

files.forEach(file => {
    const originalContent = fs.readFileSync(file, 'utf8');
    let newContent = originalContent;
    
    // update API routes
    newContent = newContent.replace(/\/auth\/admin\/login/g, '/auth/moderator/login');
    newContent = newContent.replace(/\/quizzes\/admin/g, '/quizzes/moderator');
    newContent = newContent.replace(/\/exams\/admin/g, '/exams/moderator');
    
    // update other leftover strings if needed
    newContent = newContent.replace(/Admin/g, 'Moderator');
    newContent = newContent.replace(/admin/g, 'moderator');
    
    if (newContent !== originalContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        changedFiles++;
    }
});
console.log(`Updated ${changedFiles} files.`);
