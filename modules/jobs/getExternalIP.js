function initIP(a) {
    console.log('Acquiring own external IP...');
    const http = require('http');
    let ip;
    a.forEach(address => {
        try {
            http.get(address, (resp) => {
                let data = '';

                resp.on('data', (chunk) => {
                    data += chunk;
                });

                resp.on('end', () => {
                    let regex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
                    let result = data.match(regex);
                    if (result && result.length > 0) {
                        let ipStr = result[0];
                        if (ipStr) {
                            ip = ipStr;
                            console.log(`Discovered external IP: ${ip}`);
                        }
                    }
                });

            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });
        }
        catch (err) {

        }
    });
};

function onResponce(err, data) {
    console.log(data);
}

module.exports.run = (a) => {
    initIP(a);
};