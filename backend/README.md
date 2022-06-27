# Backend Documentation

## Setup

- Install dependencies with: `npm install`

- Start the backend with: `npm start`

## Endpoints

The websocket endpoint is `ws://localhost:3001`. It requires JSON which should look like this:

`{
 "action": "subscribe",    "chargingPoint": 1
 }`  

The supported actions are:

 - subscribe
 - unsubscribe
 - authorizeCharging
 - unauthorizeCharging
 - configure    
 - chargingStatus

More information can be found in the FLApp API specification.

The REST endpoint is `http://localhost:3001/api`.

It supports the following routes and returns JSON

 - profile
 - current-charge-cycle
 - charge-cycles
