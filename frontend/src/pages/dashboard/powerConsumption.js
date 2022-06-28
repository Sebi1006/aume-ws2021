import React, { useState, useEffect } from 'react'
import { Card, CardContent, makeStyles } from '@material-ui/core'
import PowerIcon from '@material-ui/icons/Power'
import Typography from '@material-ui/core/Typography'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import WebSocketController from '../../webSocket/webSocketController'

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
  },
  title: {
    color: 'textSecondary',
    fontSize: 20,
    marginBottom: 15,
  },
  value: {
    fontSize: 25,
  },
  icon: {
    width: '20px',
    height: '20px',
    position: 'relative',
    top: '2px',
    left: '2px',
  },
}))

const AlmostFullCharged = 20

const PowerConsumption = ({ t }) => {
  const classes = useStyles()
  const controller = WebSocketController.instance
  const [chargedWork, setChargedWork] = useState({ value: localStorage.getItem('chargedWork') ?? '', color: localStorage.getItem('color') ?? 'disabled' })

  if (localStorage.getItem('chargingPoint') !== null) {
    controller.ws.wsSubscribe(localStorage.getItem('chargingPoint'))

    if (localStorage.getItem('chargedWork') === null) {
      controller.ws.chargingStatus(localStorage.getItem('chargingPoint'))
    }
  }

  useEffect(() => {
    const subscription = controller.getMessage()
      .subscribe((response) => {
        console.log(response)
        if (response.chargingStatus) {
          const currentChargedWork = response.chargingStatus.chargedWork.v
          localStorage.setItem('chargedWork', currentChargedWork)
          console.log(`Received: "${currentChargedWork}" from WebSocket`)

          let currentColor = (currentChargedWork < AlmostFullCharged) ? 'secondary' : 'primary'
          currentColor = (currentChargedWork === 0) ? 'disabled' : currentColor
          localStorage.setItem('color', currentColor)
          setChargedWork({ value: currentChargedWork, color: currentColor })
        }
      })

    return () => subscription.unsubscribe()
  }, [controller])

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} component="h2">
          {t('dashboard.powerconsumption.title')}
        </Typography>
        <Typography className={classes.value} component="p">
          <PowerIcon className={classes.icon} color={chargedWork.color}/>
          {' '}
          {chargedWork.value}
          {' '}
          KWh
        </Typography>
      </CardContent>
    </Card>
  )
}

PowerConsumption.propTypes = {
  t: PropTypes.any,
}

export default withTranslation()(PowerConsumption)
