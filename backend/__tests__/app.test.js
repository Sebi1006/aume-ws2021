const createServer = require("./../server")
const supertest = require("supertest");
const app = createServer()

describe('GET /profile', function () {
    it('returns a user', function (done) {
        return supertest(app)
            .get('/api/profile')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200, {
                name: 'Hans Meier',
                chargingPoint: 42
            }, done)
    })
})

describe('GET /current-charge-cycle', function () {
    it('returns the current charge-cycle', function (done) {
        return supertest(app)
            .get('/api/current-charge-cycle')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200, {
                id: 'f209490a-1838-11eb-adc1-0242ac120002',
                status: 'CHARGING',
                chargingPoint: 1,
                started: '2020-10-23T08:09:30.056Z',
                ended: null,
                chargedWork: {
                    v: 23.5,
                    uom: 'kWh'
                },
                power: {
                    v: 7.2,
                    uom: 'kW'
                }
            }, done)
    })
})

describe('GET /charge-cycles', function () {
    it('returns all charging cycles', function () {
        return supertest(app)
            .get('/api/charge-cycles')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
    })
})
