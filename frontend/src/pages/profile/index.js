import React from 'react'
import { Container, Grid, makeStyles } from '@material-ui/core'
import Page from 'src/components/Page'
import { useTranslation } from 'react-i18next'
import UserProfileCar from './UserProfileCar'

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

const Profile = () => {
  const classes = useStyles()
  const { t } = useTranslation()
  return (
    <Page
      className={classes.root}
      title={t('navbar.profil')}>
      <Container maxWidth="sm">
        <Grid className={classes.grid} item container>
          <UserProfileCar/>
        </Grid>
      </Container>
    </Page>
  )
}

export default Profile
