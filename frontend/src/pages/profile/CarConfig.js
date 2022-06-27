import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import CarList from './CarList'

const CarConfig = (props) => {
  const [open, setOpen] = useState(false)
  const { t } = props

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const getCarData = () => {
    props.carDataParent()
  }

  return (
    <div>
      <Button color="primary" onClick={handleClickOpen}>
        {t('page.profile.carConfiguration.button')}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          {t('page.profile.carConfiguration.title')}
        </DialogTitle>
        <DialogContent>
          <CarList dialogClose={handleClose} carData={getCarData}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t('page.profile.carConfiguration.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

CarConfig.propTypes = {
  t: PropTypes.any,
  carDataParent: PropTypes.any,
}

export default withTranslation()(CarConfig)
