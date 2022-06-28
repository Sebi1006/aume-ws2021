import React, { useEffect, useState } from 'react'
import { Container, Grid, makeStyles } from '@material-ui/core'
import axios from 'axios'
import Page from 'src/components/page'
import PowerConsumption from './powerConsumption'
import ChargingStatus from './chargingStatus'
import ChargingMode from './chargingMode'
import PowerPrice from './powerPrice'
import { calcRange, distanceCalculation } from '../../utils/utils'
import TreeAlert from './treeAlert'
import chargingStation from '../../mocks/chargingStationCoordinates.json'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}))

const Dashboard = () => {
  const classes = useStyles()
  const [, setEmissionsElectric] = useState(0)
  const [, setEmissionsDiesel] = useState(0)
  const [difference, setDifference] = useState(0)

  function sumOfChargeCycles (list) {
    return list.reduce((sum, record) => {
      return (record.status !== 'CHARGING_COMPLETED') ? sum : sum + record.chargedWork.v
    }, 0)
  }

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/charge-cycles`)
      .then((response) => response.data)
      .then((json) => {
        const finalRange = calcRange(json)
        const kwh = sumOfChargeCycles(json)
        const emissionsElectric = (kwh * 250) / 1000000
        const emissionsDiesel = (finalRange.best / 10 / 1000000) * 3310
        const diff = Number((emissionsDiesel - emissionsElectric).toFixed(2))

        setEmissionsElectric(emissionsElectric)
        setEmissionsDiesel(emissionsDiesel)
        setDifference(diff)
      })
      .catch((error) => console.log(error))
  }, [])

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude: lat1, longitude: long1 } = position.coords
    const { latitude: lat2, longitude: long2 } = chargingStation
    const distance = distanceCalculation(lat1, long1, lat2, long2)
    console.log(`${distance} meters`)
  }, null, { enableHighAccuracy: true })

  return (
    <Page
      className={classes.root}
      title="Dashboard">

      <Container maxWidth={false}>
        <TreeAlert difference={difference}/>
        <Grid
          container
          spacing={1}>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}>
            <ChargingStatus/>
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}>
            <PowerConsumption/>
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}>
            <PowerPrice/>
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}>
            <ChargingMode/>
          </Grid>
        </Grid>
      </Container>
    </Page>
  )
}

export default Dashboard
