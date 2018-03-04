import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';
import TextField from 'material-ui/TextField';
import {applyMiddleware, createStore} from 'redux';
import {connect, Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import moment from 'moment/moment';


import './App.css';
import reducer, {getEvents} from './redux';

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

class App extends Component {
  componentDidMount() {
    this.props.fetchEvents();
  }

  render() {
    console.log(this.props.events);
    const eventRows = this.props.events.map((e) => {
      const end_date = e.end_date !== undefined ? moment(e.end_date).format('MM/DD') : '';
      return (
          <li>
            <a href={e.url}>{e.title}</a> {moment(e.start_time).format('MM/DD')}-{end_date}
            {e.image !== null ? <img src={e.image.small.url}/> : '' }
          </li>
      );
    });
    return (
        <div className="App">
          <Line data={this.props.data}
                options={this.props.options}
                width={600}
                height={250}/>
          <TextField
              id="search"
              label="Enter a store id"
          />
          <h3>Events Close By</h3>
          <ul>
            {eventRows}
          </ul>
          <ul>
            <li>http://www.meetup.com/meetup_api/</li>
            <li>http://api.eventful.com/</li>
            <li>http://developers.facebook.com/docs/reference/api/event/</li>
            <li>https://www.eventbrite.com/developer/v3/</li>
          </ul>
        </div>
    );
  }
}

function mapStateToProps(state) {
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
      return dispatch(getEvents());
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
