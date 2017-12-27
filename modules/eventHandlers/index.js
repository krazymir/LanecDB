const fs = require('fs');

// Processing all modules in the folder
try {
    fs.readdir(__dirname, (err, files) => {
        files.forEach(file => {
            if (!__filename.endsWith(file) && file.toLowerCase().endsWith('.js')) {
                require(`./${file}`)
            }
        });
    })
}
catch (err) {
    common.log.error(err.message)
}