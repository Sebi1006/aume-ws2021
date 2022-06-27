const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10', region: process.env.AWS_REGION});

const {
    WS_CONNECTION_TABLE,
    CUSTOMER_TABLE,
    CHARGING_POINT_STATUS_TABLE,
    CHARGING_POINT_POLICY_TABLE,
    USER_CHARGING_POINT_TABLE,
    USER_ACTION_TABLE
} = process.env;

exports.handler = async event => {
    let connectionData;
    console.info('sendMessage invoked:' + event.body)
    console.info('sendMessage invoked:' + event.requestContext.domainName + '/' + event.requestContext.stage)
    try {
        connectionData = await ddb.scan({
            TableName: WS_CONNECTION_TABLE,
            ProjectionExpression: 'connectionId, uid'
        }).promise();
    } catch (e) {
        return {statusCode: 500, body: e.stack};
    }

    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
    });

    const postData = JSON.parse(event.body);
    let response = {}
    let dbItems = {}
    let authorizeMode = {}
    let userId = {}
    let chargingPoint = {}
    const {action} = postData
    switch (action) {
        case `chargingpoint`:
            chargingPoint = postData.chargingPoint
            userId = postData.userId
            dbItems = await ddb.get({
                TableName: USER_CHARGING_POINT_TABLE,
                Key: {
                    userId: userId
                }
            }).promise()
            response = JSON.stringify(dbItems.Item.chargingPoint[0])
            break;
        case 'subscribe':
            chargingPoint = postData.chargingPoint
            dbItems = await ddb.update({
                TableName: WS_CONNECTION_TABLE,
                Key: {
                    connectionId: event.requestContext.connectionId
                },
                UpdateExpression: `set uid = :chargingPoint`,
                ExpressionAttributeValues: {
                    ":chargingPoint": chargingPoint
                }
            }).promise()
            response = JSON.stringify(dbItems.Attributes)
            break;
        case 'unsubscribe':
            chargingPoint = postData.chargingPoint
            dbItems = await ddb.update({
                TableName: WS_CONNECTION_TABLE,
                Key: {
                    connectionId: event.requestContext.connectionId
                },
                UpdateExpression: `set uid = :chargingPoint`,
                ExpressionAttributeValues: {
                    ":chargingPoint": null
                }
            }).promise()
            response = JSON.stringify(dbItems.Attributes)
            break;
        case 'authorizeCharging':
            chargingPoint = postData.chargingPoint
            control = postData.control
            userId = postData.userId
            dbItems = await ddb.put({
                Item: {
                    id: chargingPoint + "#" + new Date().getTime(),
                    userId: userId,
                    action: control,
                    uid: chargingPoint + "#" + userId
                },
                TableName: USER_ACTION_TABLE
            }).promise()
            response = JSON.stringify(dbItems)
            break;
        case 'unauthorizeCharging':
            chargingPoint = postData.chargingPoint
            control = postData.control
            dbItems = await ddb.put({
                Item: {
                    id: chargingPoint + "#" + new Date().getTime(),
                    action: control,
                    uid: chargingPoint + "#" + 0
                },
                TableName: USER_ACTION_TABLE
            }).promise()
            response = JSON.stringify(dbItems)
            break;
        case 'configureAuthorizationMode':
            chargingPoint = postData.chargingPoint
            userID = postData.userID
            authorizeMode = (postData.authorizeMode && postData.authorizeMode === true) ? "DEFAULT_AUTHORIZED" : "DEFAULT_UNAUTHORIZED";
            dbItems = await ddb.update({
                TableName: CHARGING_POINT_POLICY_TABLE,
                Key: {
                    uid: chargingPoint + "#" + userID,
                },
                UpdateExpression: `set authorizeMode = :authStatus`,
                ExpressionAttributeValues: {
                    ":authStatus": authorizeMode
                }
            }).promise()
            dbItems = await ddb.get({
                Key: {
                    uid: chargingPoint + "#" + userID
                },
                TableName: CHARGING_POINT_POLICY_TABLE
            }).promise()
            response = JSON.stringify(dbItems.Item)
            break;
        case 'chargingStatus':
            if (postData['chargingPoint']) {
                chargingPoint = postData.chargingPoint;
            } else {
                chargingPoint = connectionData.Items.filter(function (i) {
                    return i.connectionId === event.requestContext.connectionId;
                })[0].uid;
            }
            //const clientId = chargingPoint.split("#")[0];
            dbItems = await ddb.query({
                TableName: CHARGING_POINT_STATUS_TABLE,
                KeyConditionExpression: 'clientId = :clientId',
                ExpressionAttributeValues: {
                    ':clientId': chargingPoint
                },
                ScanIndexForward: false
            }).promise()
            // .then(function(items) {
            //     return items.Items.filter(function(i) {
            //         return i.uid === chargingPoint;
            //     });
            // })
            response = JSON.stringify({"chargingStatus": dbItems.Items[0]})
            break;
        default:
            response = "not found"
            console.log('No valid action detected!')
    }

    const postCalls = connectionData.Items.filter(function (i) {
        if (JSON.stringify(chargingPoint) === JSON.stringify({})) {
            return i.connectionId === event.requestContext.connectionId;
        } else {
            return i.uid === chargingPoint;
        }
    }).map(async ({connectionId, uid}) => {
        try {
            await apigwManagementApi.postToConnection({ConnectionId: connectionId, Data: response}).promise();
        } catch (e) {
            if (e.statusCode === 410) {
                console.log(`Found stale connection, deleting ${connectionId}`);
                await ddb.delete({TableName: WS_CONNECTION_TABLE, Key: {connectionId}}).promise();
            } else {
                throw e;
            }
        }
    });

    try {
        await Promise.all(postCalls);
    } catch (e) {
        return {statusCode: 500, body: e.stack};
    }

    return {statusCode: 200, body: 'Data sent.'};
};
