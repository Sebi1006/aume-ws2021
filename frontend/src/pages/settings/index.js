import React from 'react'
import { Container, makeStyles } from '@material-ui/core'
import Page from 'src/components/page'
import Grid from '@material-ui/core/Grid'
import LanguageSelector from './languageSelector'
import PushNotifications from './pushNotifications'
import ChargingAuthorization from './chargingAuthorization'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  grid: {
    display: 'inline-flex',
  },
}))

const Settings = () => {
  const classes = useStyles()
  return (
    <Page
      className={classes.root}
      title="Settings">
      <Container maxWidth="sm">
        <Grid className={classes.grid} item container>
          <LanguageSelector/>
        </Grid>
        <Grid className={classes.grid} item container/>
        <Grid className={classes.grid} item container>
          <PushNotifications/>
        </Grid>
        <Grid className={classes.grid} item container/>
        <Grid className={classes.grid} item container>
          <ChargingAuthorization/>
        </Grid>
      </Container>
    </Page>
  )
}

export default Settings
