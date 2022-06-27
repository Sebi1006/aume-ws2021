import moment from 'moment'
import ChartView from '../../../components/ChartView'

class MonthView extends ChartView {

  constructor (props) {
    super(props);
    this.data.labels = [...Array(30).keys()].map((x) => {
      return moment().set('days', x)
    })
    this.data.datasets[0].data = Array.from({ length: 31 }, () => Math.floor(Math.random() * 30))
    this.options.scales.xAxes[0].time.unit = 'day'
    this.options.scales.xAxes[0].time.displayFormats.day = 'MMM DD'
  }

}

export default MonthView
