import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { AppBar, makeStyles, Toolbar } from '@material-ui/core'
import Logo from 'src/components/logo'

const useStyles = makeStyles(({
  root: {},
  toolbar: {
    height: 64,
  },
}))

const TopBar = ({ className, ...rest }) => {
  const classes = useStyles()

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
      elevation={3}
      color="inherit">
      <Toolbar className={classes.toolbar}>
        <RouterLink to="/">
          <Logo/>
        </RouterLink>
      </Toolbar>
    </AppBar>
  )
}

TopBar.propTypes = {
  className: PropTypes.string,
}

export default TopBar
