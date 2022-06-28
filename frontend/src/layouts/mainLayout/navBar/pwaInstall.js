import React from 'react'
import PropTypes from 'prop-types'
import { Button, ListItem, makeStyles } from '@material-ui/core'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
  },
  button: {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
    justifyContent: 'flex-start',
    letterSpacing: 0,
    padding: '10px 8px',
    textTransform: 'none',
    width: '100%',
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  title: {
    marginRight: 'auto',
  },
}))

const PwaInstall = ({ icon: Icon, title, className, installPWA, ...rest }) => {
  const classes = useStyles()

  const onClick = (evt) => {
    evt.preventDefault()
    installPWA()
  }

  return (
    <ListItem
      className={clsx(classes.item, className)}
      disableGutters
      {...rest}
    >
      <Button className={classes.button} onClick={onClick}>
        {Icon && (
          <Icon
            className={classes.icon}
            size="20"
          />
        )}
        <span className={classes.title}>
          {title}
        </span>
      </Button>
    </ListItem>
  )
}

PwaInstall.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string,
  installPWA: PropTypes.func,
}

export default PwaInstall
