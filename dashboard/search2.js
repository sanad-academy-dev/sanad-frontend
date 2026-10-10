const cp = require('child_process');
try {
    const res = cp.execSync('findstr /s /i "HTTPError" "C:\\Users\\hp\\Downloads\\Sanad-main - Elite(1)\\Sanad-main\\dashboard\\node_modules\\@tanstack\\*.*"').toString();
    console.log(res.substring(0, 1000));
} catch(e) {
    console.log("No results or error");
}
