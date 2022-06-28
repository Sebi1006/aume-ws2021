import { withTranslation } from 'react-i18next'
import CustomizedDialog from '../../../components/dialog'

class ConfigSaveDialog extends CustomizedDialog {
  constructor (props) {
    super(props)
    const { t } = props
    this.info = t('page.config.saveDialog')
    this.cancelButtonText = t('page.config.abort')
    this.agreeButtonText = t('page.config.saveDialogAgree')
  }
}

export default withTranslation()(ConfigSaveDialog)
