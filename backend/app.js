const createServer = require('./server')

const port = 3001
const ws = require('ws')
const app = createServer();
const server = app.listen(port, () => {
    console.log('Server listening at http://localhost:' + port)
})
const socketFunctions = require('./controller/socketFunctions')

/*
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*")
    next()
})


app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/api/charge-cycles', (req, res) => {
    res.send(restFunctions.chargeCycles())
})

app.get('/api/current-charge-cycle', (req, res) => {
    res.send(restFunctions.currentChargeCycle())
})

app.get('/api/profile', (req, res) => {
    res.send(restFunctions.profile())
})
*/

//handles incoming messages
const wsServer = new ws.Server({noServer: true});
wsServer.on('connection', socket => {
    console.log('Connection detected')
    socket.on('message', message => {
            try {
                const msg = JSON.parse(message)
                console.log(msg.action + "  --  " + msg.chargingPoint)
                let response = {}
                switch (msg.action) {
                    case 'subscribe':
                        response.status = socketFunctions.subscribe(msg.chargingPoint)
                        socket.send(JSON.stringify(response))
                        break;

                    case 'unsubscribe':
                        response.status = socketFunctions.unsubscribe(msg.chargingPoint)
                        socket.send(JSON.stringify(response))
                        break;

                    case 'authorizeCharging':
                        response.status = socketFunctions.authorizeCharging(msg.chargingPoint)
                        socket.send(JSON.stringify(response))
                        break;

                    case 'unauthorizeCharging':
                        response.status = socketFunctions.unauthorizeCharging(msg.chargingPoint)
                        socket.send(JSON.stringify(response))
                        break;

                    case 'configureAuthorizationMode':
                        response.status = socketFunctions.configure(msg.chargingPoint, msg.authorizeMode)
                        socket.send(JSON.stringify(response))
                        break;

                    case 'chargingStatus':
                        response = socketFunctions.chargingStatus(msg.chargingPoint, 0)
                        socket.send(JSON.stringify(response))
                        break;

                    default:
                        console.log('No valid action detected!')
                }
            } catch {
                console.log('invalid Data')
            }
        }
    )
})

/** sends data to all connected clients**/
function sendTestData() {
    const rnd = Math.floor(Math.random() * 5)
    //modify response to your needs
    const response = socketFunctions.chargingStatus("111", rnd)
    wsServer.clients.forEach(n => n.send(JSON.stringify(response)))
}

/** uncomment setInterval if you want to send a message in a fixed interval to all clients**/
setInterval(sendTestData, 5000)


server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request)
    })
})
