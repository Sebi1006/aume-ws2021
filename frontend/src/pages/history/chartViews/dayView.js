import moment from 'moment'
import ChartView from '../../../components/chartView'

class DayView extends ChartView {
  constructor (props) {
    super(props)
    this.data.labels = [
      ...Array(24)
        .keys()].map((x) => {
      return moment()
        .set('hour', x)
    })
    this.data.datasets[0].data = Array.from({ length: 24 }, () => Math.floor(Math.random() * 30))
    this.options.scales.xAxes[0].time.unit = 'hour'
    this.options.scales.xAxes[0].time.displayFormats.hour = 'HH:mm:ss'
  }
}

export default DayView
