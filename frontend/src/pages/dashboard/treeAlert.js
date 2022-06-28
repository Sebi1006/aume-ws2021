import React from 'react'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { Alert } from '@material-ui/lab'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Collapse from '@material-ui/core/Collapse'

// eslint-disable-next-line no-unused-vars
const TreeAlert = (props) => {
  const [open, setOpen] = React.useState(true)
  const { difference, t } = props

  if (difference > 0) {
    return (
      <Collapse in={open}>
        <Alert
          action={(
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false)
              }}
            >
              <CloseIcon fontSize="inherit"/>
            </IconButton>
          )}
          icon={(
            <img
              alt="Tree"
              src="/static/tree.png"
              width="22"
              height="22"/>
          )}
          variant="outlined"
        >
          {t('dashboard.treealert.msg1')}
          {difference}
          {t('dashboard.treealert.msg2')}
        </Alert>
        <br/>
      </Collapse>
    )
  }
  return (<div/>)
}

TreeAlert.propTypes = {
  difference: PropTypes.number,
  t: PropTypes.any,
}

export default withTranslation()(TreeAlert)
