import React, { useEffect, useState } from 'react'
import { Card, CardContent, makeStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import BatteryFullIcon from '@material-ui/icons/BatteryFull'
import BatteryUnknownIcon from '@material-ui/icons/BatteryUnknown'
import green from '@material-ui/core/colors/green'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import CardActionArea from '@material-ui/core/CardActionArea'
import BatteryCharging50Icon from '@material-ui/icons/BatteryCharging50'
import Snackbar from '@material-ui/core/Snackbar'
import grey from '@material-ui/core/colors/grey'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Button from '@material-ui/core/Button'
import WebsocketController from '../../websocket/WebsocketController'

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
  },
  title: {
    color: 'textSecondary',
    fontSize: 20,
  },
  charging: {
    color: green[500],
    fontSize: 100,
    transform: 'rotate(90deg)',
  },
  connected: {
    color: grey[500],
    fontSize: 100,
    transform: 'rotate(90deg)',
  },
  chargingAvailable: {
    color: green[200],
    fontSize: 100,
    transform: 'rotate(90deg)',
  },
  notCharging: {
    color: grey[500],
    fontSize: 100,
    transform: 'rotate(90deg)',
  },
  button: {
    marginLeft: 15,
    marginBottom: 10,
  },
  snackbar: {
    flexWrap: 'initial',
  },
}))

const ChargingStatus = ({ t }) => {
  const classes = useStyles()
  const [status, setStatus] = useState(localStorage.getItem('chargingStatus') ?? '')
  const [snackbar, setSnackbar] = useState(false)
  const charging = status === 'CHARGING'
  const connected = status === 'CONNECTED'
  const controller = WebsocketController.instance

  if (localStorage.getItem('chargingPoint') !== null) {
    controller.ws.wsSubscribe(localStorage.getItem('chargingPoint'))

    if (localStorage.getItem('chargingStatus') === null) {
      controller.ws.chargingStatus(localStorage.getItem('chargingPoint'))
    }
  }

  const updateStatus = () => {
    setSnackbar(true)
    if (charging) {
      if (localStorage.getItem('chargingPoint') !== null) {
        const userId = localStorage.getItem('userID')
        // .split('#')[1]
        controller.ws.authorizeCharging(localStorage.getItem('chargingPoint'), 'STOP', userId)
      }
      setStatus('CONNECTED')
      localStorage.setItem('chargingStatus', 'CONNECTED')
    } else {
      if (localStorage.getItem('chargingPoint') !== null) {
        const userId = localStorage.getItem('userID')
        // .split('#')[1]
        controller.ws.authorizeCharging(localStorage.getItem('chargingPoint'), 'CHARGING', userId)
      }
      setStatus('CHARGING')
      localStorage.setItem('chargingStatus', 'CHARGING')
    }
  }

  const closeSnackbar = () => {
    setSnackbar(false)
  }

  useEffect(() => {
    const subscription = controller.getMessage()
      .subscribe((response) => {
        console.log(response)
        if (response.chargingStatus) {
          const currentStatus = response.chargingStatus.status
          setStatus(currentStatus)
          localStorage.setItem('chargingStatus', currentStatus)
          console.log(`Received: "${currentStatus}" from WebSocket`)
        }
      })

    return () => subscription.unsubscribe()
  }, [controller])

  function renderSwitch (param) {
    switch (param) {
      case 'CHARGING':
        return (
          <div>
            <Typography component="h3">{t('dashboard.chargingstatus.charging')}</Typography>
            <BatteryCharging50Icon className={classes.charging}/>
          </div>
        )
      case 'CHARGING_COMPLETED':
        return (
          <div>
            <Typography component="h3">{t('dashboard.chargingstatus.chargingcompleted')}</Typography>
            <BatteryFullIcon className={classes.charging}/>
          </div>
        )
      case 'AVAILABLE':
        return (
          <div>
            <Typography component="h3">{t('dashboard.chargingstatus.available')}</Typography>
            <BatteryFullIcon className={classes.chargingAvailable}/>
          </div>
        )
      case 'CONNECTED':
        return (
          <div>
            <Typography component="h3">{t('dashboard.chargingstatus.connected')}</Typography>
            <BatteryFullIcon className={classes.connected}/>
          </div>
        )
      default:
        return (
          <div>
            <Typography component="h3">{t('dashboard.chargingstatus.notcharging')}</Typography>
            <BatteryUnknownIcon className={classes.notCharging}/>
          </div>
        )
    }
  }

  return (
    <div>
      <Card className={classes.root}>
        <CardContent style={{ paddingBottom: 0 }}>
          <Typography className={classes.title} component="h2">
            {t('dashboard.chargingstatus.title')}
          </Typography>
          {renderSwitch(status)}
        </CardContent>
        <CardActionArea className={classes.button}>
          {
            charging ? (
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={updateStatus}
                disabled={!charging && !connected}
                >
                {t('dashboard.chargingstatus.cancelcharging')}
              </Button>
            )
              : (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={updateStatus}
                  disabled={!charging && !connected}
                >
                  {t('dashboard.chargingstatus.startcharging')}
                </Button>
              )
          }
        </CardActionArea>
      </Card>
      <Snackbar
        ContentProps={{ classes: { root: classes.snackbar } }}
        open={snackbar}
        onClose={closeSnackbar}
        autoHideDuration={2000}
        message={charging ? t('dashboard.chargingstatus.startedmsg') : t('dashboard.chargingstatus.canceledmsg')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        action={(
          <IconButton size="small" aria-label="close" color="inherit" onClick={closeSnackbar}>
            <CloseIcon fontSize="small"/>
          </IconButton>
        )}
      />
    </div>
  )
}

ChargingStatus.propTypes = {
  t: PropTypes.any,
}

export default withTranslation()(ChargingStatus)
