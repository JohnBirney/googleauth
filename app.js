const express = require('express')
const speakeasy = require('speakeasy')
const qrcode = require('qrcode')

const app = express()
const port = process.env.PORT || 5000

let secret = speakeasy.generateSecret()
let temp2Fsecret = secret.base32

app.get('/', (req, res) => {    
    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
        res.statusCode = 200
        res.writeHead(200, {'Content-Type':'text/html'})
        res.write('<html>')
        res.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>')
        res.write('<script>function verify(){let userToken = document.querySelector("#userToken").value; $.ajax("/verify?userToken=" + userToken).done(function(data){alert( data );});}</script>')
        res.write('<img src="' + data_url + '">')
        res.write('<br><input type="text" id="userToken">')
        res.write('<button onclick="verify()">verify</button>')
        res.write('</html>')
        res.end()
    })
})

app.get('/verify', (req, res) => {
    let verified = speakeasy.totp.verify({ secret: temp2Fsecret,
        encoding: 'base32',
        token: req.query.userToken });    
    res.send(verified)
})

app.listen(port, () => {
    console.log(`Listening to port: ${port}...`)
})
