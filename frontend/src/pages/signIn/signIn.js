import React from 'react'
import { Grid, InputAdornment, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { AccountCircle, LockRounded } from '@material-ui/icons'
import MuiAlert from '@material-ui/lab/Alert'
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import UserPool from '../../Login/UserPool'

function Copyright () {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://www.siobra.de/">
        Siobra
      </Link>
      {' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

function Alert (props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

function emailValidation (value) {
  let msg = ''
  let error = false
  const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (value === '') {
    msg = 'E-Mail can not be empty!'
    error = true
  } else if (!regexp.test(value)) {
    msg = 'No valid E-Mail Format!'
    error = true
  }
  return [error, msg]
}

function passwordValidation (value) {
  let msg = ''
  let error = false
  if (value === '') {
    msg = 'Password can not be empty!'
    error = true
  } else if (value.length < 8) {
    msg = 'Password Error!'
    error = true
  }
  return [error, msg]
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  paper: {
    padding: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

const SignIn = ({ t }) => {
  const classes = useStyles()
  const [error, setError] = React.useState(false)
  const [errorMSG, setErrorMSG] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const swUrl = `${process.env.PUBLIC_URL}/push-message-worker.js`

  const handleServiceWorker = () => {
    navigator.serviceWorker.getRegistration(swUrl)
      .then((reg) => {
        reg.active.postMessage({
          action: 'jwtHeader',
          url: `${process.env.REACT_APP_API_WS_URL}`,
          jwt: localStorage.getItem('accessToken'),
          chargingPoint: localStorage.getItem('chargingPoint')
        });
      })
  };

  const handleChange = (event) => {
    event.preventDefault()
    const { name, value } = event.target

    switch (name) {
      case 'email':
        setEmail(value)
        break
      case 'password':
        setPassword(value)
        break
      default:
        break
    }
  }
  const handleSubmit = () => {
    const errorMSGEmail = emailValidation(email)
    const errorMSGPassword = passwordValidation(password)

    if (errorMSGEmail[0]) {
      setError(true)
      setErrorMSG(errorMSGEmail[1])
    } else if (errorMSGPassword[0]) {
      setError(true)
      setErrorMSG(errorMSGPassword[1])
    } else {
      setError(false)
    }

    const user = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (data) => {
        localStorage.setItem('accessToken', data.getIdToken().getJwtToken());
        localStorage.setItem('chargingPoint', data.getIdToken().payload['custom:ChargingPointID'].split('#')[0])
        localStorage.setItem('userID', data.getIdToken().payload['custom:ChargingPointID'].split('#')[1])
        handleServiceWorker()
        document.location.href = '/';
      },
      onFailure: (err) => {
        console.log('Error');
        console.log(err);
        setError(true)
        setErrorMSG(err.message)
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        console.log('newPasswordRequired');
        console.log(userAttributes);
        user.completeNewPasswordChallenge('Start123!', requiredAttributes, {
          onSuccess: (result) => {
            console.log(result)
          },
          onFailure: (err) => {
            console.log(err)
          }
        });
      },
    })

    console.log('Send login request to backend!');
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }
  return (
    <Grid container component="main" className={classes.root}>
      <Grid style={{ margin: 'auto' }} item xs={12} sm={8} md={5} component={Paper} elevation={24}>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            {t('signin.signin')}
          </Typography>
          <form className={classes.form}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="email"
              label={t('signin.email')}
              name="email"
              autoComplete="email"
              autoFocus
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle/>
                  </InputAdornment>
                ),
              }}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('signin.password')}
              type="password"
              id="password"
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRounded/>
                  </InputAdornment>
                ),
              }}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSubmit}

            >
              {t('signin.signin')}
            </Button>
            {error
            && (
              <Alert variant="filled" severity="error">
                {errorMSG}
              </Alert>
            )}
            <Box mt={5}>
              <Copyright/>
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  )
}

SignIn.propTypes = {
  t: PropTypes.any,
}

export default withTranslation()(SignIn)
