import moment from "moment/moment";

import store168Data from './df_168.json';


export function fetchEvents() {
  return (dispatch) => {
    // TODO: Create a server
    fetch('https://us-central1-brown-datathon.cloudfunctions.net/function-1')
        .then((response) => {
          return response.json()
        })
        .then((jsonData) => {
          console.log('Events:', jsonData.events);
          dispatch({
            type: 'FETCH_EVENTS',
            events: jsonData.events.event,
          });
        })
        .catch((error) => {
          console.error(error);
        });
  }
}

export function fetchStoreData(storeId) {
  console.log('Fetching ' + storeId);
  return (dispatch) => {
    fetch(`df_${storeId}.json`)
        .then(response => {
          return response.json()
        })
        .then((jsonData) => {
          console.log(jsonData);
          // TODO: Sort dates
          jsonData.sort((e1, e2) => moment(e1.date).valueOf() - moment(e2.date).valueOf());
          const outliers = jsonData.filter(e => e.is_outlier);
          console.log(jsonData);
          dispatch({
            type: 'FETCH_STORE_DATA',
            storeId,
            data: jsonData,
            outliers: outliers,
          })
        })
        .catch(error => console.log(error));
  }
}

const labels = [];
const points = [];
store168Data.sort((e1, e2) => moment(e1.date).valueOf() - moment(e2.date).valueOf());
for (let day of store168Data) {
  // TODO: Data is too large, put into a server
  // TODO: Option to filter by range
  const date = moment(day.date);
  labels.push(date.valueOf());
  points.push({
    t: date.valueOf(),
    y: day.total_sales,
  })
}


const initialState = {
  data: {
    labels: labels,
    datasets: [{
      label: 'Store 168',
      data: points,
      type: 'line',
      backgroundColor: '#303f9f',
      pointRadius: 0,
      lineTension: 0,
      borderWidth: 2
    },
    ]
  },
  options: {
    scales: {
      xAxes: [{
        type: 'time',
        distribution: 'series',
        time: {
          unit: 'week',
          displayFormats: {
           'week': 'MMM DD'
         }
        },
        ticks: {
          source: 'labels',
          autoSkip: true,
          maxTicksLimit: 12,
        },
        display: true,
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Total Sales ($)'
        }
      }]
    },
    responsive: true,
  },
  events: [],
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_EVENTS':
      console.log('In action:', action.events);
      return Object.assign({}, state, {
        events: action.events,
      });
    case 'FETCH_STORE_DATA':
      return Object.assign({}, state, {
        data: Object.assign({}, state.data, {
          labels: action.data.map(e => moment(e.date).valueOf()),
          datasets: state.data.datasets.map(line => {
            return Object.assign({}, line, {
              label: 'Store ' + action.storeId,
              data: action.data.map(e => e.total_sales),
            })
          })
        })
      });
    case 'DEMO_1':
      return Object.assign({}, state, {
        data: Object.assign({}, state.data, {
          labels: action.data.map(e => moment(e.date).valueOf()),
          datasets: state.data.datasets.map(line => {
            return Object.assign({}, line, {
              label: 'Store ' + action.storeId,
              data: action.data.map(e => e.total_sales),
            })
          })
        })
      });
    case 'DEMO_2':
      return Object.assign({}, state, {
        data: Object.assign({}, state.data, {
          labels: action.data.map(e => moment(e.date).valueOf()),
          datasets: state.data.datasets.map(line => {
            return Object.assign({}, line, {
              label: 'Store ' + action.storeId,
              data: action.data.map(e => e.total_sales),
            })
          })
        })
      });
    default:
      return state;
  }
}

export default reducer;
