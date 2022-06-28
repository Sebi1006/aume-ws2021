const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10', region: process.env.AWS_REGION});
const {WS_CONNECTION_TABLE, CHARGING_POINT_STATUS_TABLE, WS_CONNECTION} = process.env;

exports.chargingPointStatusHandler = async (event) => {
    console.log("WS URI: " + WS_CONNECTION);

    const apiWs = new AWS.ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        endpoint: WS_CONNECTION
    });

    for (const record of event.Records) {
        console.log('Processing record: ' + JSON.stringify(record))

        if (record.eventName == 'INSERT') {
            const newImage = record.dynamodb.NewImage
            let dbItems = await ddb.query({
                TableName: CHARGING_POINT_STATUS_TABLE,
                KeyConditionExpression: 'clientId = :clientId',
                ExpressionAttributeValues: {
                    ':clientId': newImage.clientId.S
                },
                ScanIndexForward: true
            }).promise()

            response = JSON.stringify({"chargingStatus": dbItems.Items.pop()})
            console.log("response ", response)
            let stcp = []

            try {
                connectionData = await ddb
                    .scan({TableName: WS_CONNECTION_TABLE, ProjectionExpression: 'connectionId, uid'})
                    .promise();
                stcp = connectionData.Items.filter((row) => {
                    console.log(row.uid + " : " + newImage.uid.S)
                    return row.uid && row.uid.split('#')[0] === newImage.uid.S.split('#')[0]
                })
            } catch (e) {
                return {statusCode: 500, body: e.stack};
            }

            console.log('Subscribed to charging point are: ' + JSON.stringify(stcp))

            const postCalls = stcp.map(async ({connectionId, uid}) => {
                console.log('connectionId: ' + JSON.stringify(connectionId))
                console.log('uid: ' + JSON.stringify(uid))
                await apiWs
                    .postToConnection({ConnectionId: connectionId, Data: response})
                    .promise().then((res) => {
                        console.log(res);
                        return res;
                    });
            })

            console.log('postCalls: ' + JSON.stringify(postCalls))

            try {
                console.log("before psotcalls")
                await Promise.all(postCalls).then((res) => {
                    console.log(res);
                    return res;
                })
                    .catch((err) => {
                        console.log(err)
                    })
                console.log("after psotcalls")
            } catch (e) {
                return {statusCode: 500, body: e.stack};
            }
        }
    }

    return {statusCode: 200, body: 'Event sent.'};
}
