import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'
import SaveIcon from '@material-ui/icons/Save'
import Fab from '@material-ui/core/Fab'
import Zoom from '@material-ui/core/Zoom'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    bottom: theme.spacing(5),
    right: theme.spacing(5),
  },
}))

const SubmitFab = ({ className, show, children, ...rest }) => {
  const classes = useStyles()

  return (
    <Zoom in={show}>
      <Fab
        color="primary"
        {...rest}
        className={clsx(classes.root, className)}
        type="submit">
        {children || <SaveIcon/>}
      </Fab>
    </Zoom>
  )
}

SubmitFab.propTypes = {
  className: PropTypes.string,
  show: PropTypes.bool.isRequired,
  children: PropTypes.any,
}

export default SubmitFab
