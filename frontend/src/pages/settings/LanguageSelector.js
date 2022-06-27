import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/Select';
import { useTranslation } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import moment from 'moment'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 4
  },
  paper: {
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
    width: '100%'
  },
  gridDesc: {
    alignSelf: 'center',
    verticalAlign: 'middle'
  },
  gridControl: {
    textAlign: 'right'
  },
  title: {
    textAlign: 'left'
  }
}));

// 'i18nextLng' is used from i18next-browser-languageDetector in i18n.js
function saveLang(lngSelected) {
  localStorage.setItem('i18nextLng', lngSelected);
}

const LanguageSelector = () => {
  const classes = useStyles();

  const { t, i18n } = useTranslation();

  const handleChange = (event) => {
    i18n.changeLanguage(event.target.value)
    saveLang(event.target.value)
    moment.locale([event.target.value])
  };

  return (
    <Paper className={classes.paper}>
      <Grid container className={classes.root}>
        <Grid item xs={6} className={classes.gridDesc}>
          <Typography variant="h3" className={classes.title}>
            {t('page.settings.langselect.title')}
          </Typography>
        </Grid>
        <Grid item xs={6} className={classes.gridControl}>
          {i18n.language
                        && (
                        <FormControl>
                          <NativeSelect
                            native
                            name="language"
                            onChange={handleChange}
                            defaultValue={i18n.language}
                            >
                            <option value="de">Deutsch</option>
                            <option value="en">English</option>
                          </NativeSelect>
                        </FormControl>
                        )}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default LanguageSelector
