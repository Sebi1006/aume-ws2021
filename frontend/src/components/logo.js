import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  logo: {
    maxHeight: '40px',
  },
}))

const Logo = ({ className, ...rest }) => {
  const classes = useStyles()

  return (
    <img
      className={clsx(classes.logo, className)}
      alt="Logo"
      src="/static/logo.jpg"
      {...rest}
    />
  )
}

Logo.propTypes = {
  className: PropTypes.string,
}

export default Logo
