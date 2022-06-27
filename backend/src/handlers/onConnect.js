const axios = require('axios')

const AWS = require('aws-sdk');
const jwt_decode = require('jwt-decode')
const jsonwebtoken = require('jsonwebtoken')
const jwkToPem = require('jwk-to-pem')

const ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10', region: process.env.AWS_REGION});

const getPublicKeys = async (cognitoIssuer) => {
    const url = `${cognitoIssuer}/.well-known/jwks.json`
    const publicKeys = await axios.default.get(url)
    return publicKeys.data.keys
}

const validateToken = async (jwt) => {
    let decodedHeader = null
    let decodedPayload = null
    let response = {
        statusCode: 401,
        body: "Unauthorized"
    }
    try {
        decodedHeader = jwt_decode(jwt, {header: true})
        decodedPayload = jwt_decode(jwt)
    } catch (e) {
        return response
    }
    const kid = decodedHeader.kid
    const publicKeys = await getPublicKeys(decodedPayload.iss)
    const jwk = publicKeys.filter(x => x.kid === kid)[0]
    const pem = jwkToPem(jwk)
    jsonwebtoken.verify(jwt, pem, {algorithms: [decodedHeader.alg]}, (err, decodedToken) => {
        if (decodedToken) response = {
            statusCode: 200,
            body: "Connected."
        }
    })
    return response
}
/**
 * WS onConnect. code initially taken from https://github.com/aws-samples/simple-websockets-chat-app/tree/master/onconnect
 */
exports.handler = async event => {
    const putParams = {
        TableName: process.env.WS_CONNECTION_TABLE,
        Item: {
            connectionId: event.requestContext.connectionId,
            uid: null
        }
    };
    const {access_token} = event.queryStringParameters;
    const response = validateToken(access_token);
    if (response.statusCode === 200) {
        try {
            await ddb.put(putParams).promise();
        } catch (err) {
            return {statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err)};
        }
    }
    return response;
};
