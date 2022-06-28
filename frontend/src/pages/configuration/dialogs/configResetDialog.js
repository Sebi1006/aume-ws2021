import { withTranslation } from 'react-i18next'
import CustomizedDialog from '../../../components/dialog'

class ConfigResetDialog extends CustomizedDialog {
  constructor (props) {
    super(props)
    const { t } = props
    this.info = t('page.config.resetDialog')
    this.cancelButtonText = t('page.config.abort')
    this.agreeButtonText = t('page.config.resetDialogAgree')
  }
}

export default withTranslation()(ConfigResetDialog)
