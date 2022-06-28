const createServer = require('./server')

const port = 3001
const ws = require('ws')
const app = createServer();
const server = app.listen(port, () => {
    console.log('Server listening at http://localhost:' + port)
})
const socketFunctions = require('./controller/socketFunctions')

// handles incoming messages
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
                console.log('Invalid data')
            }
        }
    )
})

// sends data to all connected clients
function sendTestData() {
    const rnd = Math.floor(Math.random() * 5)
    const response = socketFunctions.chargingStatus("111", rnd)
    wsServer.clients.forEach(n => n.send(JSON.stringify(response)))
}

setInterval(sendTestData, 5000)

server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request)
    })
})
