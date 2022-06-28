# FLApp API

Query always for a specific charge point.

- State of the current charging process:
    - Start time
    - End time
    - State (plugged in, charging, available, charged, unplugged)
    - Charged (KWh)
    - Current power (KW)

- Statistics:
  - All charges per month

## Technical

The FLApp API is defined as a REST API.

Currently, only the API to get the charge cycle data is defined.

Example:

	 {
	      "id": "f209490a-1838-11eb-adc1-0242ac110002",
	      "status": "CHARGING_COMPLETED",
	      "chargingPoint": 1,
	      "started": "2020-10-22T08:09:30.056Z",
	      "ended": "2020-10-22T12:09:30.056Z",
	      "chargedWork": { "v": 30.5, "uom": "kWh"},
	      "power": { "v": 0.0, "uom": "kW"}
	 },

`GET /current-charge-cycle`	returns the current charge cycle (no data if it is not connected).

`GET /charge-cycles` returns the history of charge cycles.

More operations can be proposed by AUME team and implemented in the MOCK API.

The API is provided with mock data. See the README.md in frontend project for more info.

### Storing local data

If you need to store data locally, please use the browser storage (localStorage). You might want to have a look at wrappers to store and query data as in https://github.com/typicode/lowdb
