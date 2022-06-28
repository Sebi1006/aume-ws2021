const dynamodb = require('aws-sdk/clients/dynamodb');
const ddb = new dynamodb.DocumentClient();

exports.getChargeCyclesLambdaHandler = async () => {
    const data = await ddb.scan({
        TableName: process.env.CHARGE_CYCLES_TABLE
    }).promise()

    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(data.Items)
    }

    console.info(`${response}`)
    return response
}
