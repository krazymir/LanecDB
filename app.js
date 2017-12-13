// Initializing and setting up recurring jobs
require('./modules/jobs');

const express = require('express')
const app = express()

app.get('/', (req, res) => {
    let a = global.localIP
    res.send('Hello World!')
}
)

app.listen(3000, () => console.log('Example app listening on port 3000!'))