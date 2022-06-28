import React, { useState } from 'react'
import { Card, CardContent, makeStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import EuroIcon from '@material-ui/icons/Euro'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

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

const PowerPrice = ({ t }) => {
  const classes = useStyles()
  const price = useState({ current: '30,91' })

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} component="h2">
          {t('dashboard.powerprice.title')}
        </Typography>
        <Typography className={classes.value} component="p">
          <EuroIcon className={classes.icon}/>
          {' '}
          {price[0].current}
          {' '}
          Cent/kWh
        </Typography>
      </CardContent>
    </Card>
  )
}

PowerPrice.propTypes = {
  t: PropTypes.any,
}

export default withTranslation()(PowerPrice)
