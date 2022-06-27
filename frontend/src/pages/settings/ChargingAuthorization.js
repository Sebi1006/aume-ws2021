import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import NativeSelect from '@material-ui/core/Select'
import { withTranslation } from 'react-i18next'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import WebsocketController from '../../websocket/WebsocketController'

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
  snackbar: {
    flexWrap: 'initial',
  },
}))

const ChargingAuthorization = ({ t }) => {
  const classes = useStyles()
  const [authorization, setAuthorization] = useState(localStorage.getItem('automaticAuthorization'))
  const [snackbar, setSnackbar] = useState(false)

  const saveMode = (event) => {
    setAuthorization(event)
    localStorage.setItem('automaticAuthorization', event)
  }

  useEffect(() => {
    if (localStorage.getItem('automaticAuthorization') === null) {
      saveMode(true)
    }
  }, [])

  const handleChange = (event) => {
    const { ws } = WebsocketController.instance
    setSnackbar(true)

    if (localStorage.getItem('chargingPoint') !== null) {
      if (event.target.value === 'true') {
        ws.configureAuthorizationMode(localStorage.getItem('chargingPoint'), localStorage.getItem('userID'), true)
        saveMode(true)
      } else {
        ws.configureAuthorizationMode(localStorage.getItem('chargingPoint'), localStorage.getItem('userID'), false)
        saveMode(false)
      }
    }
  }

  const closeSnackbar = () => {
    setSnackbar(false)
  }

  return (
    <div style={{ width: '100%' }}>
      <Paper className={classes.paper}>
        <Grid container className={classes.root}>
          <Grid item xs={6} className={classes.gridDesc}>
            <Typography variant="h3" className={classes.title}>
              {t('page.settings.chargingAuthorization.title')}
            </Typography>
          </Grid>
          <Grid item xs={6} className={classes.gridControl}>
            <FormControl>
              <NativeSelect
                native
                name="language"
                onChange={handleChange}
                defaultValue={authorization}
              >
                <option value="true">{t('page.settings.chargingAuthorization.automatic')}</option>
                <option value="false">{t('page.settings.chargingAuthorization.manual')}</option>
              </NativeSelect>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      <Snackbar
        ContentProps={{ classes: { root: classes.snackbar } }}
        open={snackbar}
        onClose={closeSnackbar}
        autoHideDuration={5000}
        message={authorization ? t('page.settings.chargingAuthorization.automaticmsg') : t('page.settings.chargingAuthorization.manualmsg')}
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

ChargingAuthorization.propTypes = {
  t: PropTypes.any,
}

export default withTranslation()(ChargingAuthorization)
