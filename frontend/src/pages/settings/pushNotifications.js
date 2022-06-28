import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import NativeSelect from '@material-ui/core/Select'
import { withTranslation } from 'react-i18next'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 4,
  },
  paper: {
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
    width: '100%',
  },
  gridDesc: {
    alignSelf: 'center',
    verticalAlign: 'middle',
  },
  gridControl: {
    textAlign: 'right',
  },
  title: {
    textAlign: 'left',
  },
}))

function saveBS (input) {
  localStorage.setItem('backgroundSync', input)
}

const PushNotifications = ({ t }) => {
  const classes = useStyles()

  let readNotificationDesicion = localStorage.getItem('backgroundSync') ?? 'false'

  const swUrl = `${process.env.PUBLIC_URL}/push-message-worker.js`

  const handleChange = (event) => {
    let control = event.target.value
    Notification.requestPermission()
      .then((per) => {
        if (per !== 'granted') {
          control = 'false'
        }
        readNotificationDesicion = control
        navigator.serviceWorker.getRegistration(swUrl)
          .then((reg) => {
            reg.active.postMessage({
              action: 'backgroundSync',
              url: `${process.env.REACT_APP_API_WS_URL}`,
              control,
            })
          })
        saveBS(control)
      })
  }

  return (
    <Paper className={classes.paper}>
      <Grid container className={classes.root}>
        <Grid item xs={6} className={classes.gridDesc}>
          <Typography variant="h3" className={classes.title}>
            {t('page.settings.backgroundSync.title')}
          </Typography>
        </Grid>
        <Grid item xs={6} className={classes.gridControl}>
          <FormControl>
            <NativeSelect
              native
              name="language"
              onChange={handleChange}
              defaultValue={readNotificationDesicion}
            >
              <option value="true">{t('page.settings.backgroundSync.active')}</option>
              <option value="false">{t('page.settings.backgroundSync.inactive')}</option>
            </NativeSelect>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  )
}

PushNotifications.propTypes = {
  t: PropTypes.any,
}

export default withTranslation()(PushNotifications)
