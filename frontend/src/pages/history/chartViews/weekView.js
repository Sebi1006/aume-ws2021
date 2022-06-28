import moment from 'moment'
import ChartView from '../../../components/chartView'

class WeekView extends ChartView {
  constructor (props) {
    super(props)
    this.data.labels = [
      ...Array(7)
        .keys()].map((x) => {
      return moment()
        .set('days', x)
    })
    this.data.datasets[0].data = Array.from({ length: 7 }, () => Math.floor(Math.random() * 30))
    this.options.scales.xAxes[0].time.unit = 'day'
    this.options.scales.xAxes[0].time.displayFormats.day = 'MMM DD'
  }
}

export default WeekView
