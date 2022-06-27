import 'react-perfect-scrollbar/dist/css/styles.css'
import React, { useEffect, useState } from 'react'
import { useRoutes } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core'
import GlobalStyles from 'src/components/GlobalStyles'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import axios from 'axios'
import 'src/mixins/chartjs'
import theme from 'src/theme'
import routes from 'src/routes'
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode'
import 'moment/locale/de'
import 'moment/locale/en-gb'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import WebsocketController from './websocket/WebsocketController'
import { calcRange } from './utils/utils'

const App = ({ t }) => {
  const routing = useRoutes(routes)
  const [range, setRange] = useState({ best: 0, worst: 0 })
  const [kw, setKw] = useState({ v: 0, uom: '' })
  const [snackbar, setSnackbar] = useState(false)
  const controller = WebsocketController.instance
  axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
  axios.interceptors.response.use((fulfilled) => { return fulfilled },
    () => {
      const token = jwt_decode(localStorage.getItem('accessToken'))
      if (token.exp * 1000 < Date.now()) {
        localStorage.removeItem('accessToken')
        document.location.href = '/'
      }
    })

  const closeSnackbar = () => {
    setSnackbar(false)
  }

  useEffect(() => {
    const subscription = controller.getMessage()
      .subscribe((response) => {
        if (response.chargingStatus?.status === 'CHARGING_COMPLETED') {
          const { v, uom } = response.chargingStatus.chargedWork
          const calc = calcRange([response.chargingStatus])
          if (calc.best > 0) {
            setRange(calc)
            setKw({ v, uom })
            setSnackbar(true)
          }
        }
      })
    return () => subscription.unsubscribe()
  }, [controller])

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles/>
      {routing}
      <Snackbar
        open={snackbar}
        onClose={closeSnackbar}
        autoHideDuration={10000}
        message={`${t('dashboard.chargingInfo.rangestartemsg')} ${kw.v} ${kw.uom} ${t('dashboard.chargingInfo.rangemidmsg')} ${range.best} ${t('dashboard.chargingInfo.rangeendmsg')}`}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        action={(
          <IconButton size="small" aria-label="close" color="inherit" onClick={closeSnackbar}>
            <CloseIcon fontSize="small"/>
          </IconButton>
        )}
      />
    </ThemeProvider>
  )
}

App.propTypes = {
  t: PropTypes.any,
}

export default withTranslation()(App)
