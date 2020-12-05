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

  shouldComponentUpdate(nextProps, nextState) {
    const { profile } = this.props;
    if (!profile) return true;
    if (nextState.copied) return true;
    if (profile.ticker !== nextProps.profile.ticker) return true;
    return false;
  }

  render() {
    const { profile, imgProp = 'alexa_img' } = this.props;
    const { copied } = this.state;
    if (!profile) {
      return (
        <div style={{ fontSize: 12 }}>Not available at this time... </div>
      );
    }
    if (profile[imgProp] && profile[imgProp].url) {
      const btnClass = copied ? 'react-components-show-url btn btn-sm btn-danger disabled font-10' : 'react-components-show-url btn btn-sm btn-warning font-10';
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
    const data = {
      labels: profile.alexa.arr.map(d => dayjs.utc(d.ts).format('YYYYMM')),
      datasets: [{
        yAxisID: '1',
        type: 'line',
        fill: false,
        backgroundColor: 'darkred',
        borderColor: 'darkred',
        lineTension: 0,
        borderWidth: 1,
        pointRadius: 2,
        pointHoverRadius: 2,
        data: profile.alexa.arr.map(d => d.rank),
        label: 'Website Ranking'
      }]
    };
    const options = {
      legend: {
        labels: {
          fontSize: 14,
          boxWidth: 10,
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            fontSize: 12
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
                ticks: {
                  fontSize: 10,
                    callback: function(label, index, labels) {
                      return Math.floor(label);
                    }
                },
              }]
      },
    };

    return (
      <div style={{ width: '100%', padding: 5, fontSize: 14 }}>
        <div style={{ color: 'darkred', fontWeight: 'bold' }}>{profile.ticker} - {profile.name} <span className='green'>World Website Ranking</span></div>
        <Bar data={data} height={170} options={options} />
        <div style={{ fontSize: 12, color: 'gray' }}>Generated by <span style={{ color: 'darkred' }}>@earningsfly</span> with <span style={{ fontSize: 16, color: 'red' }}>❤️</span>, datasource: alexa.com</div>
      </div>
    );
  }
}

export default AlexaRanks;
