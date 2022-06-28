const lambda = require('../src/handlers/getChargeCycles.js');
const dynamodb = require('aws-sdk/clients/dynamodb');

describe('Test getChargeCyclesLambdaHandler', () => {
    let scanSpy;

    beforeAll(() => {
        scanSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'scan');
    });

    afterAll(() => {
        scanSpy.mockRestore();
    });

    it('should return charge cycles', async () => {
        const chargeCycles = [
            {
                "chargedWork": {
                    "uom": "kWh",
                    "v": 30.5
                },
                "power": {
                    "uom": "kW",
                    "v": 0
                },
                "status": "CHARGING_COMPLETED",
                "started": "2020-10-22T08:09:30.056Z",
                "id": "f209490a-1838-11eb-adc1-0242ac110002",
                "ended": "2020-10-22T12:09:30.056Z",
                "chargingPoint": 1
            }
        ];

        scanSpy.mockReturnValue({
            promise: () => Promise.resolve({Items: chargeCycles})
        });

        const result = await lambda.getChargeCyclesLambdaHandler();

        const expectedResult = {
            statusCode: 200,
            headers: {"Access-Control-Allow-Origin": "*"},
            body: "[{\"chargedWork\":{\"uom\":\"kWh\",\"v\":30.5},\"power\":{\"uom\":\"kW\",\"v\":0},\"status\":\"CHARGING_COMPLETED\",\"started\":\"2020-10-22T08:09:30.056Z\",\"id\":\"f209490a-1838-11eb-adc1-0242ac110002\",\"ended\":\"2020-10-22T12:09:30.056Z\",\"chargingPoint\":1}]"
        };

        expect(result).toEqual(expectedResult);
    });
});
