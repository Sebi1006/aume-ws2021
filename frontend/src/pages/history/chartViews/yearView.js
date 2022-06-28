import moment from 'moment'
import ChartView from '../../../components/chartView'

class YearView extends ChartView {
  constructor (props) {
    super(props)
    this.data.labels = [
      ...Array(12)
        .keys()].map((x) => {
      return moment()
        .set('month', x)
    })
    this.data.datasets[0].data = Array.from({ length: 12 }, () => Math.floor(Math.random() * 30))
    this.options.scales.xAxes[0].time.unit = 'month'
    this.options.scales.xAxes[0].time.displayFormats.month = 'MMM YYYY'
  }
}

export default YearView
