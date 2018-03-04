import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';
import TextField from 'material-ui/TextField';
import {applyMiddleware, createStore} from 'redux';
import {connect, Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import moment from 'moment/moment';
import Card, {CardContent, CardMedia} from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Tabs, {Tab} from 'material-ui/Tabs';


import './App.css';
import reducer, {fetchEvents, fetchStoreData} from './redux';

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

const suggestions = [
  {label: 168},
  {label: 173},
  {label: 545},
  {label: 616},
  {label: 832},
  {label: 1066},
  {label: 1118},
  {label: 1157},
  {label: 1540},
  {label: 1566},
  {label: 1655},
  {label: 1682},
  {label: 1774},
  {label: 1795},
  {label: 1825},
  {label: 1918},
  {label: 2455},
  {label: 2521},
  {label: 2619},
  {label: 3161},
]


class App extends Component {
  componentDidMount() {
    this.props.fetchEvents();
  }

  render() {
    console.log(this.props.events);
    const eventRows = this.props.events.map((e) => {
      const end_date = e.end_date !== undefined ? moment(e.end_date).format('MM/DD') : '';
      return (
          <Grid item xs={12} sm={6}>
            <Card style={{margin: 10, padding: 10}}>
              {
                e.image !== null ?
                    <CardMedia title={e.title}>
                      <img src={e.image.medium.url}/>
                    </CardMedia>
                    : ''
              }
              <CardContent/>
              <Typography variant="headline" component="h3">
                {e.title}
              </Typography>
              <Typography component="p">
                {moment(e.start_time).format('MM/DD')}-{end_date}
              </Typography>
            </Card>
          </Grid>
      );
    });

    let paper = <div></div>
    if (this.props.events.length > 0) {
      paper = (
          <Paper style={{margin: 10, padding: 20, backgroundColor: '#FAFAFA'}}>
            <Typography variant="headline" component="h2">Popular Events Nearby</Typography>
            <Grid container spacing={24}>
              {eventRows}
            </Grid>
          </Paper>
      );
    }

    let label = '';
    switch (this.props.data.datasets[0].label) {
      case 'Store 100':
        label = <Typography variant="headline" component="h3" style={{color: 'red'}}>Anomaly</Typography>;
        break;
      case 'Store 20000':
        label = <Typography variant="headline" component="h3" style={{color: 'red'}}>Anomaly</Typography>;
        break;
      case 'Store 1183':
        label = <Typography variant="headline" component="h3" style={{color: 'green'}}>Not an Anomaly</Typography>;
        break;
      default:
        console.log(this.props.data);
    }

    return (
        <div className="App" style={{backgroundColor: '#303f9f'}}>
          <Paper style={{margin: 10, padding: 20, backgroundColor: '#FAFAFA'}}>
            <Line data={this.props.data}
                  options={this.props.options}
                  width={600}
                  height={250}
            />
            <Grid container spacing={24}>
              <Grid item xs={6} sm={3}>
                <TextField
                    id="search"
                    label="Demo only feat"
                    onKeyPress={this.props.handleKeyPress}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="headline" component="h3">
                  <p>{label}</p>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Tabs initialSelectedIndex={1}>
                  <Tab label={"Week"} disabled/>
                  <Tab label={"Month"}/>
                  <Tab label={"Year"} disabled/>
                </Tabs>
              </Grid>
            </Grid>
          </Paper>
          {paper}
        </div>
    );
  }
}

function mapStateToProps(state) {
  console.log(state);
  return {
    data: state.data,
    options: state.options,
    events: state.events,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchEvents() {
      console.log('Dispatching');
      return dispatch(fetchEvents());
    },
    handleKeyPress(e) {
      const show_id = e.target.value;
      console.log(show_id);
      if (e.key === 'Enter') {
        console.log('Dispatching');
        return dispatch(fetchStoreData(show_id));
      }
    }
  }
}

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

class ReduxWrapper extends React.Component {
  render() {
    return (
        <Provider store={store}>
          <ConnectedApp/>
        </Provider>
    )
  }
}

export default ReduxWrapper;
