import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import NativeSelect from '@material-ui/core/Select'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  selector: {
    paddingTop: theme.spacing(1),
    fontSize: 25,
  },
}))

const ChargingModeSelector = ({ t }) => {
  const classes = useStyles()
  const [mode, setMode] = React.useState('')

  const handleChange = (event) => {
    setMode(event.target.value)
  }

  return (
    <FormControl>
      <NativeSelect
        native
        className={classes.selector}
        name="mode"
        value={mode}
        onChange={handleChange}
      >
        <option value="slow">{t('dashboard.chargingmode.mode.0')}</option>
        <option value="fast">{t('dashboard.chargingmode.mode.1')}</option>
      </NativeSelect>
    </FormControl>
  )
}

ChargingModeSelector.propTypes = {
  t: PropTypes.any,
}

export default withTranslation()(ChargingModeSelector)
