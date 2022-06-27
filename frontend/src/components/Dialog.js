import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types'

class CustomizedDialog extends React.Component {

  title = null;

  info = null;

  cancelButtonText = null;

  agreeButtonText = null;

  handleCancel = () => {
    const { onCancel } = this.props
    onCancel()
  }

  handleAgree = () => {
    const { onAgree } = this.props
    onAgree()
  }

  render() {
    const { open } = this.props
    return (
      <div>
        <Dialog
          open={open}
          onClose={this.handleCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{this.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.info}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            { this.cancelButtonText
              ? (
                <Button onClick={this.handleCancel} color="secondary">
                  {this.cancelButtonText}
                </Button>
              )
              : null}
            { this.agreeButtonText
              ? (
                <Button onClick={this.handleAgree} color="primary" autoFocus>
                  {this.agreeButtonText}
                </Button>
              )
              : null}
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}
CustomizedDialog.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.any,
  onAgree: PropTypes.any
}

export default CustomizedDialog
