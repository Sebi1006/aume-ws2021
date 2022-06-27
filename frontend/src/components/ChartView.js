import React from 'react';
import { Line } from 'react-chartjs-2'
import moment from 'moment'

class ChartView extends React.Component {
  timer = null;

  data = {
    labels: [],
    datasets: [
      {
        label: 'Demo data set',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: []
      }
    ]
  };

  options = {
    tooltips: {
      callbacks: {
        title: (tooltipItem, data) => {
          return moment(data.labels[tooltipItem[0].index].format()).format('LLLL')
        }
      }
    },
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Kw'
        }
      }],
      xAxes: [{
        type: 'time',
        time: {
          unit: '',
          stepSize: 1,
          displayFormats: {
          }
        },
      }],
    }
  };

  constructor (props) {
    super(props);
    this.chartReference = React.createRef()
  }

  componentDidMount () {
    this.timer = setInterval(() => {
      this.data.datasets[0].data = Array.from({ length: 31 }, () => Math.floor(Math.random() * 30))
      const lineChart = this.chartReference.current.chartInstance
      lineChart.update()
    }, 15 * 1000)
  }

  componentWillUnmount () {
    clearInterval(this.timer)
  }

  render() {
    return (
      <div>
        <Line ref={this.chartReference} data={this.data} options={this.options} />
      </div>
    )
  }

}

export default ChartView
