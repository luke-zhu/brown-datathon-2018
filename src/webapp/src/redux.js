import moment from "moment/moment";

import store19Data from './store19.json';


export function getEvents() {
  const location = 'Providence'; // TODO: Enable different locations
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

const labels = [];
const points = [];
for (let day of store19Data) {
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
      label: 'Store 19',
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
        ticks: {
          source: 'labels'
        },
        display: false,
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Total Sales ($)'
        }
      }]
    },
    responsive: false
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
    default:
      return state;
  }
}

export default reducer;
