import React from 'react'
import { Card, CardContent, makeStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import ChargingmodeSelector from './ChargingmodeSelector'

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
  },
  title: {
    color: 'textSecondary',
    fontSize: 20,
  }
}))

const ChargingMode = ({ t }) => {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} component="h2">
          {t('dashboard.chargingmode.title')}
        </Typography>
        <ChargingmodeSelector/>
      </CardContent>
    </Card>
  )
}

ChargingMode.propTypes = {
  t: PropTypes.any,
}

export default withTranslation()(ChargingMode)
