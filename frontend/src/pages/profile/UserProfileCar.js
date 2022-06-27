import React, { useEffect, useState } from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { TableBody } from '@material-ui/core'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Table from '@material-ui/core/Table'
import TableContainer from '@material-ui/core/TableContainer'
import Paper from '@material-ui/core/Paper'
import Alert from '@material-ui/lab/Alert'
import CarConfig from './CarConfig'
import UserPool from '../../Login/UserPool'

const UserProfileCar = ({ t }) => {
  const carDataLocalStorage = JSON.parse(localStorage.getItem('carConfigData'))
  const [carImage, setCarImage] = useState(carDataLocalStorage !== null ? carDataLocalStorage : {
    carData:
      {
        id: 3535,
        make: 'no make',
        carModel: 'no model',
        seats: null,
        power: null,
        topSpeed: null,
        range: {
          best: {
            highway: 155, city: 260, combined: null,
          },
          wltp: null,
          worst: {
            highway: 120, city: 175, combined: null,
          },
        },
        imagesData: {
          image: {
            id: '5f1aafcb657beb795163896e',
            url: null,
            width: 1536,
            height: 864,
            type: 'image',
          },
        },
      },
  })
  const [userInfo, setUserInfo] = useState({ name: '', chargingPoint: '' })
  const [error, setError] = useState()

  useEffect(() => {
    const cognitoUserPool = UserPool
    const cognitoUser = cognitoUserPool.getCurrentUser()
    if (cognitoUser !== null) {
      cognitoUser.getSession((errorSession) => {
        if (errorSession) {
          setError(errorSession.message)
        } else {
          cognitoUser.getUserAttributes((err, result) => {
            if (err) {
              setError(err.message)
            } else {
              let displayChargingPointID = '';
              let displayGivenName = '';
              let displayName = '';
              result.forEach((attribut) => {
                if (attribut.getName() === 'name') {
                  displayName = attribut.getValue();
                }
                if (attribut.getName() === 'given_name') {
                  displayGivenName = attribut.getValue();
                }
                if (attribut.getName() === 'custom:ChargingPointID') {
                  displayChargingPointID = attribut.getValue();
                }
              })
              setUserInfo({ name: `${displayGivenName} ${displayName}`, chargingPoint: displayChargingPointID })
            }
          })
        }
      })
    }
  }, [])

  const getCarDataParent = () => {
    setCarImage(JSON.parse(localStorage.getItem('carConfigData')))
  }

  let cardMedia
  let carInfoTypo

  if (carImage.carData.make !== null
    && carImage.carData.carModel !== null
    && carImage.carData.imagesData.image.url !== null
    && carImage.carData.power !== null
    && carImage.carData.range.best.combined !== null
    && carImage.carData.range.worst.combined !== null) {
    cardMedia = (
      <CardMedia
        component="img"
        alt={`${carImage.carData.make} ${carImage.carData.carModel}`}
        height="auto"
        image={carImage.carData.imagesData.image.url}
        title={`${carImage.carData.make} ${carImage.carData.carModel}`}
      />
    )
    carInfoTypo = (
      <div>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell>
                  {`${t('page.profile.carConfiguration.model')}:`}
                </TableCell>
                <TableCell>
                  {`${carImage.carData.make} ${carImage.carData.carModel}`}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {`${t('page.profile.carConfiguration.power')}:`}
                </TableCell>
                <TableCell>
                  {`${carImage.carData.power} kW`}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {`${t('page.profile.carConfiguration.topSpeed')}:`}
                </TableCell>
                <TableCell>
                  {`${carImage.carData.topSpeed} km/h`}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {`${t('page.profile.carConfiguration.rangebest')}:`}
                </TableCell>
                <TableCell>
                  {`${carImage.carData.range.best.combined} km`}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {`${t('page.profile.carConfiguration.rangeworst')}:`}
                </TableCell>
                <TableCell>
                  {`${carImage.carData.range.worst.combined} km`}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  }

  let userName;
  if (error) {
    userName = (
      <Alert variant="filled" severity="error">
        {error}
      </Alert>
    )
  } else {
    userName = (
      <Typography gutterBottom variant="h5" component="h2">
        {userInfo.name}
      </Typography>
    )
  }

  return (
    <Card style={{
      maxWidth: '350',
      flexGrow: '4',
    }}>
      {cardMedia}

      <CardContent>
        {userName}
        {carInfoTypo}
      </CardContent>
      <CardActions>
        <CarConfig carDataParent={getCarDataParent}/>
      </CardActions>
    </Card>

  )

}

UserProfileCar.propTypes = {
  t: PropTypes.any,
}

export default withTranslation()(UserProfileCar)
