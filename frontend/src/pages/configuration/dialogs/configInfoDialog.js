import { withTranslation } from 'react-i18next'
import CustomizedDialog from '../../../components/dialog'

class ConfigInfoDialog extends CustomizedDialog {
  constructor (props) {
    super(props)
    const { t } = props
    this.title = 'Info'
    this.info = t('page.config.infoDialog')
  }
}

export default withTranslation()(ConfigInfoDialog)
