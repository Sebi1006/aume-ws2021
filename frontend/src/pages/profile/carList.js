import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import apiClient from '../../apiClient'

class CarList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      carList: [],
      error: null,
    }
    this.btnClick = this.btnClick.bind(this)
  }

  componentDidMount () {
    Promise.all([this.getCarsFromApi()])
      .then((result) => {
        const tempData = result[0].data.data.carList
        this.calcData(tempData)
      })
      .catch((error) => {
        this.setState({ error: error.message })
      })
  }

  // https://docs.chargetrip.com/#cars
  getCarsFromApi () {
    const headers = {
      'x-client-id': '5e8c22366f9c5f23ab0eff39',
      'Content-Type': 'application/json',
    }

    const data = JSON.stringify({
      query: `# In this example we fetch up to 10 the cars from the server
      # with all the properties we can get
      query carListAll {
  carList {
    id
    externalId
    make
    carModel
    edition
    chargetripEdition
    version
    mode
    batteryUsableKwh
    batteryFullKwh
    fastChargingSupport
    chargetripRange {
      best
      worst
    }
    connectors {
      standard
      power
      time
      speed
    }
    adapters {
      standard
      power
      time
      speed
    }
    seats
    imagesData {
      image {
        id
        url
        width
        height
        type
      }
      image_thumbnail {
        id
        url
        width
        height
        type
      }
      brand {
        id
        url
        width
        height
        type
      }
      brand_thumbnail {
        id
        url
        width
        height
        type
      }
    }
  }
}`,
      variables: {},
    })
    return apiClient.post('https://api.chargetrip.io/graphql', data, {
      headers,
    })
  }

  // https://docs.chargetrip.com/#cars
  getCarDataFromCarList (carID) {
    const headers = {
      'x-client-id': '5e8c22366f9c5f23ab0eff39',
      'Content-Type': 'application/json',
    }

    const data = JSON.stringify({
      query: `# In this example we fetch one car by it's ID
query car($carId: ID!) {
  car(id: $carId) {
    id
    externalId
    make
    carModel
    edition
    chargetripEdition
    version
    mode
    power
    acceleration
    topSpeed
    torque
    batteryUsableKwh
    batteryFullKwh
    petrolConsumption
    fastChargingSupport
    chargetripRange {
     best
     worst
    }
    range {
      wltp
      best {
        highway
        city
        combined
      }
      worst {
        highway
        city
        combined
      }
    }
    batteryEfficiency {
      average
      best {
        highway
        city
        combined
      }
      worst {
        highway
        city
        combined
      }
    }
    connectors {
      standard
      power
      time
      speed
    }
    adapters {
      standard
      power
      time
      speed
    }
    seats
    weight
    width
    height
    images {
      id
      url
      width
      height
      type
    }
    imagesData {
      image {
        id
        url
        width
        height
        type
      }
      image_thumbnail {
        id
        url
        width
        height
        type
      }
      brand {
        id
        url
        width
        height
        type
      }
      brand_thumbnail {
        id
        url
        width
        height
        type
      }
    }
  }
}`,
      variables: { carId: carID },
    })
    return apiClient.post('https://api.chargetrip.io/graphql', data, {
      headers,
    })
  }

  passCarDataToParent = (data) => {
    const { carData } = this.props
    carData(data)
  }

  closeButtonClickHandler = () => {
    const { dialogClose } = this.props
    dialogClose()
  }

  calcData (carDataList) {
    carDataList.map((cars) => {
      return Promise.all([this.getCarDataFromCarList(cars.id)])
        .then((result) => {
          const tempData = result[0].data.data.car
          this.setState({
            carList: this.state.carList.concat([tempData]),
          })
        })
        .catch((error) => {
          console.log(error.message)
        })
    })
  }

  btnClick (carId) {
    const { carList } = this.state
    carList.forEach((entry) => {
      if (entry.id === carId) {
        this.saveImageToUser(entry)
        this.passCarDataToParent(JSON.stringify({ carData: entry }))
        this.closeButtonClickHandler()
      }
    })
  }

  saveImageToUser (imageData) {
    localStorage.setItem('carConfigData', JSON.stringify({
      carData: imageData,
    }))
  }

  render () {
    const { t } = this.props
    const { carList, error } = this.state
    const classes = makeStyles((theme) => ({
      root: {
        width: '100%',
        maxWidth: '36ch',
        backgroundColor: theme.palette.background.paper,
      },
      inline: {
        display: 'inline',
      },
      error: {
        color: 'red',
      },
    }))

    return (
      <List className={classes.root}>
        {error
        && (
          <h3 className="error">
            {' '}
            {error}
            {' '}
          </h3>
        )}
        {
          carList.map((cars) => {
            return (
              <div id={cars.id} key={cars.id}>
                <ListItem id={cars.id} alignItems="flex-start">
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon/>}
                      aria-label="Expand"
                      aria-controls="additional-actions1-content"
                      id="additional-actions1-header"
                    >

                      <ListItemAvatar onClick={() => this.btnClick(cars.id)}>
                        <Avatar alt={cars.carModel} src={cars.imagesData.image_thumbnail.url}/>
                      </ListItemAvatar>
                      <ListItemText
                        onClick={() => this.btnClick(cars.id)}
                        id={cars.id}
                        primary={`${cars.make} - ${cars.carModel}`}
                        secondary={(
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              className={classes.inline}
                              color="textPrimary"
                            />
                            {`${t('page.profile.carConfiguration.edition')}:  - ${cars.edition}`}
                          </>
                        )}
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        <ListItem>
                          <ListItemText>
                            {`${t('page.profile.carConfiguration.power')}: ${cars.power} kW`}
                          </ListItemText>
                        </ListItem>
                        <ListItem>
                          <ListItemText>
                            {`${t('page.profile.carConfiguration.acceleration')} (0 - 100 km/h): ${cars.acceleration} s `}
                          </ListItemText>
                        </ListItem>
                        <ListItem>
                          <ListItemText>
                            {`${t('page.profile.carConfiguration.topSpeed')}: ${cars.topSpeed} km/h`}
                          </ListItemText>
                        </ListItem>
                        <ListItem>
                          <ListItemText>
                            {`${t('page.profile.carConfiguration.weight')}: ${cars.weight} kg`}
                          </ListItemText>
                        </ListItem>
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </ListItem>
              </div>
            )
          })
        }
      </List>
    )
  }
}

CarList.propTypes = {
  t: PropTypes.any,
  dialogClose: PropTypes.func,
  carData: PropTypes.func,
}

export default withTranslation()(CarList)
