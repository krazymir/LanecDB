const fs = require('fs');

fs.readdir(__dirname, (err, files) => {
    files.forEach(file => {
        if (!__filename.endsWith(file) && file.toLowerCase().endsWith('.js')) {
            require(`./${file}`)
        }
    });
})