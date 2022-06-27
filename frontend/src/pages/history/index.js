import React, { useState } from 'react'
import PropTypes from 'prop-types'
import SwipeableViews from 'react-swipeable-views'
import { Container, makeStyles, useTheme } from '@material-ui/core'
import Page from 'src/components/Page'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import { withTranslation } from 'react-i18next';
import WeekPicker from '../../components/WeekPicker'
import DayView from './chartviews/DayView'
import WeekView from './chartviews/WeekView'
import MonthView from './chartviews/MonthView'
import YearView from './chartviews/YearView'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}))

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="span">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const History = ({ t }) => {
  const classes = useStyles()
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [selectedDate, handleDateChange] = useState(new Date())

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <Page
      className={classes.root}
      title="History">
      <Container maxWidth={false}>
        <div className={classes.root}>
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="full width tabs example"
              style={{ backgroundColor: 'white' }}>
              <Tab label={t('page.history.tabs.0')} {...a11yProps(0)} />
              <Tab label={t('page.history.tabs.1')} {...a11yProps(1)} />
              <Tab label={t('page.history.tabs.2')} {...a11yProps(2)} />
              <Tab label={t('page.history.tabs.3')} {...a11yProps(3)} />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <MuiPickersUtilsProvider utils={MomentUtils} >
                <KeyboardDatePicker
                  variant="inline"
                  inputVariant="outlined"
                  label="Pick a date"
                  value={selectedDate}
                  onChange={handleDateChange} />
              </MuiPickersUtilsProvider>
              <DayView />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <WeekPicker />
              </MuiPickersUtilsProvider>
              <WeekView />
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardDatePicker
                  views={['year', 'month']}
                  openTo="month"
                  variant="inline"
                  inputVariant="outlined"
                  label="Pick a date"
                  value={selectedDate}
                  onChange={handleDateChange} />
              </MuiPickersUtilsProvider>
              <MonthView />
            </TabPanel>
            <TabPanel value={value} index={3} dir={theme.direction}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardDatePicker
                  views={['year']}
                  variant="inline"
                  inputVariant="outlined"
                  label="Pick a date"
                  value={selectedDate}
                  onChange={handleDateChange} />
              </MuiPickersUtilsProvider>
              <YearView />
            </TabPanel>
          </SwipeableViews>
        </div>
      </Container>
    </Page>
  )
}

History.propTypes = {
  t: PropTypes.any
}

export default withTranslation()(History)
