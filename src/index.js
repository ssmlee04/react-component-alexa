import _ from "lodash";
import React from "react";
import { Bar } from 'react-chartjs-2';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import dayjs from 'dayjs';
import dayjsPluginUTC from 'dayjs-plugin-utc';
dayjs.extend(dayjsPluginUTC);

export class AlexaRanks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { profile, imgProp = 'alexa_img', theme = 'light' } = this.props;
    const { copied } = this.state;
    if (!profile) {
      return (
        <div style={{ fontSize: 12 }}>Not available at this time... </div>
      );
    }
    if (profile[imgProp] && profile[imgProp].url) {
      const btnClass = copied ? 'react-components-show-url btn btn-sm btn-danger disabled font-12' : 'react-components-show-url btn btn-sm btn-warning font-12';
      const btnText = copied ? 'Copied' : 'Copy Img';
      return (
        <div className='react-components-show-button'>
          <img alt={`${profile.ticker} - ${profile.name} Employees and Productivity`} src={profile[imgProp].url} style={{ width: '100%' }} />
          <CopyToClipboard text={profile[imgProp].url || ''}
            onCopy={() => this.setState({ copied: true })}
          >
            <button className={btnClass} value={btnText}>{btnText}</button>
          </CopyToClipboard>
        </div>
      );
    }

    if (!profile || !profile.alexa || !profile.alexa.arr || !profile.alexa.arr.length) return null;
    const dataColor = theme === 'light' ? 'rgba(175, 45, 30, 0.4)' : 'rgba(225, 85, 85, 0.6)';
    const arr = _.sortBy(profile.alexa.arr, d => d.ts);
    const ranks = arr.map(d => d.rank);
    const data = {
      labels: arr.map(d => dayjs.utc(d.ts).format('YYYYMM')),
      datasets: [{
        borderCapStyle: 'butt',
        pointBorderWidth: 1,
        yAxisID: '1',
        type: 'line',
        fill: 'start',
        backgroundColor: dataColor,
        borderColor: dataColor,
        lineTension: 0.3,
        borderWidth: 1,
        pointRadius: 3,
        pointHoverRadius: 2,
        data: ranks,
        label: 'Website Ranking'
      }]
    };
    const yAxisMax = Math.max(...ranks) * 1.1 + 5;
    const fontColor = theme === 'light' ? '#444444' : '#dddddd';
    const gridColor = theme === 'light' ? 'rgba(80, 80, 80, 0.1)' : 'rgba(255, 255, 255, 0.2)';
    const options = {
      legend: {
        display: false,
        labels: {
          fontSize: 12,
          fontColor,
          boxWidth: 10,
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            fontSize: 12,
            fontColor,
          },
          gridLines: {
            color: gridColor
          },
          barPercentage: 0.4
        }],
        yAxes: [{
          type: 'linear',
          display: true,
          position: 'left',
          id: '1',
          labels: {
            show: true
          },
          gridLines: {
            color: gridColor
          },
          ticks: {
            reverse: true,
            fontSize: 12,
            max: yAxisMax,
            fontColor,
              callback: function(label, index, labels) {
                return Math.floor(label);
              }
          },
        }]
      },
    };

    return (
      <div style={{ width: '100%', padding: 5, fontSize: 12 }}>
        <div className={`theme-darkred-${theme} mb-2`} style={{ fontWeight: 'bold' }}>{profile.ticker} - {profile.name}&nbsp;<span className={`theme-green-${theme}`}>World Website Ranking</span></div>
        <Bar data={data} height={150} options={options} />
        <div style={{ fontSize: 12, padding: 5, paddingTop: 2 }}>Crafted by <a href='https://twitter.com/tradeideashq' target='_blank' className={`theme-darkred-${theme}`}>@tradeideashq</a> with <span style={{ fontSize: 16, color: 'red' }}>💡</span></div>
      </div>
    );
  }
}

export default AlexaRanks;
