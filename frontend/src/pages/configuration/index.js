import React from 'react'
import PropTypes from 'prop-types'
import { Container, makeStyles } from '@material-ui/core'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import moment from 'moment'
import { MuiPickersUtilsProvider, KeyboardTimePicker } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import { withTranslation } from 'react-i18next'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import Page from '../../components/page'
import ConfigResetDialog from './dialogs/configResetDialog'
import ConfigSaveDialog from './dialogs/configSaveDialog'
import ConfigInfoDialog from './dialogs/configInfoDialog'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}))

const Config = ({ t }) => {
  moment.locale(localStorage.getItem('i18nextLng'))
  const classes = useStyles()
  const [selectedFromTime, setSelectedFromTime] = React.useState(null)
  const [selectedToTime, setSelectedToTime] = React.useState(null)
  const [openInfo, setOpenInfo] = React.useState(false)
  const [openReset, setOpenReset] = React.useState(false)
  const [openSave, setOpenSave] = React.useState(false)
  const [formats, setFormats] = React.useState(() => [])
  const [daySelected, setDaySelected] = React.useState(true)
  const weekArray = moment.weekdays(true)

  const handleFromTimeChange = (time) => {
    const value = selectedToTime && time > selectedToTime ? '' : time
    setSelectedFromTime(value)
  }

  const handleToTimeChange = (time) => {
    const validatedTime = selectedFromTime && time < selectedFromTime ? '' : time
    setSelectedToTime(validatedTime)
  }

  const onCancel = () => {
    setOpenInfo(false)
    setOpenReset(false)
    setOpenSave(false)
  }

  const onResetAgree = () => {
    setOpenReset(false)
    setSelectedFromTime(null)
    setSelectedToTime(null)
    setFormats([])
  }

  const onSaveAgree = () => {
    setOpenSave(false)
    const l1 = formats.map((x) => weekArray[x])
    console.log(l1, selectedFromTime, selectedToTime, localStorage.getItem('i18nextLng'))
  }

  const handleInfoOpen = () => {
    setOpenInfo(true)
  }

  const handleResetOpen = () => {
    setOpenReset(true)
  }

  const handleSaveOpen = () => {
    if (!selectedFromTime) setSelectedFromTime('')
    if (!selectedToTime) setSelectedToTime('')
    if (formats.length === 0) setDaySelected(false)
    if (
      selectedFromTime
      && selectedToTime
      && selectedToTime > selectedFromTime
      && formats.length > 0
    ) setOpenSave(true)
  }

  const handleFormat = (event, newVal) => {
    setDaySelected(true)
    setFormats(newVal)
  }

  const enableAMPM = localStorage.getItem('i18nextLng') !== 'de'

  return (
    <Page
      className={classes.root}
      title={t('navbar.config')}>
      <Container maxWidth="sm">
        <Card style={{
          maxWidth: '350',
          flexGrow: '4',
        }}>
          <CardContent>
            <div style={{
              display: 'flex',
              alignItems: 'center',
            }}>
              <Typography variant="h4">{t('page.config.info')}</Typography>
              <HelpOutlineIcon onClick={handleInfoOpen}/>
            </div>
            <br/>
            <div>
              <ToggleButtonGroup size="small" value={formats} aria-label="text formatting" onChange={handleFormat}>
                {
                  weekArray.map((val, index) => {
                    return (
                      <ToggleButton key={val} value={index} aria-label="italic" style={{ color: daySelected ? 'rgba(0, 0, 0, 0.38)' : 'red' }}>
                        {val.substring(0, 3)}
                      </ToggleButton>
                    )
                  })
                }
              </ToggleButtonGroup>
            </div>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardTimePicker
                margin="normal"
                label={t('page.config.releaseFrom')}
                value={selectedFromTime}
                onChange={handleFromTimeChange}
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }}
                keyboardIcon={<AccessTimeIcon/>}
                emptyLabel="HH:mm"
                ampm={enableAMPM}
                invalidDateMessage={t('page.config.releaseFromError')}
                cancelLabel={t('page.config.abort')}
              />
            </MuiPickersUtilsProvider>
            &nbsp;
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardTimePicker
                margin="normal"
                label={t('page.config.releaseTo')}
                value={selectedToTime}
                onChange={handleToTimeChange}
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }}
                keyboardIcon={<AccessTimeIcon/>}
                emptyLabel="HH:mm"
                ampm={enableAMPM}
                invalidDateMessage={t('page.config.releaseToError')}
              />
            </MuiPickersUtilsProvider>
            <br/>
            <span>
              <Button variant="outlined" color="primary" onClick={handleResetOpen}>
                {t('page.config.reset')}
              </Button>
              &nbsp;
              <Button variant="outlined" color="primary" onClick={handleSaveOpen}>
                {t('page.config.save')}
              </Button>
            </span>
          </CardContent>
        </Card>
        <ConfigInfoDialog open={openInfo} onCancel={onCancel}/>
        <ConfigResetDialog open={openReset} onCancel={onCancel} onAgree={onResetAgree}/>
        <ConfigSaveDialog open={openSave} onCancel={onCancel} onAgree={onSaveAgree}/>
      </Container>
    </Page>
  )
}

Config.propTypes = {
  t: PropTypes.any,
}

export default withTranslation()(Config)
