import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import "isomorphic-fetch";

// fetch('https://dotography.teamwork.com/projects.json', {
//   headers: {
//     'Authorization': 'Basic Ymxpbms3NjdzaGlydDp4eHg='
//   }
// }).then( response => response.json() )
//   .then( json => console.log(json) );


const REQUEST_PROJECTS = 'REQUEST_PROJECTS';
const RECEIVE_PROJECTS = 'RECEIVE_PROJECTS';
const INVALIDATE_DATA = 'INVALIDATE_DATA';
const SELECT_PROJECT = 'SELECT_PROJECT';

const requestProjects = () => {
  return {
    type: REQUEST_PROJECTS
  };
};

const reduceSingleProject = (id) => (selected, project) => {
  if( id == project.id ) selected = project;
  return selected;
};

const receiveProjects = (json) => {
  return {
    type: RECEIVE_PROJECTS,
    projects: json.projects,
    receivedAt: Date.now()
  };
};

const getSingleProject = (id) => {
  return {
    type: SELECT_PROJECT,
    id
  };
};

const projects = (
  state = {
    isFetching: false,
    didInvalidate: false,
    items: []
  },
  action
)  => {
  switch (action.type) {
    case INVALIDATE_DATA:
      return Object.assign({}, state, {
        didInvalidate: true
      });
    case REQUEST_PROJECTS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      });
    case RECEIVE_PROJECTS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.projects,
        lastUpdated: action.receivedAt
      });
    case SELECT_PROJECT:
      return Object.assign({}, state, {
        selected: state.items.reduce(reduceSingleProject(action.id), {})
      });
    default:
      return state;
  }
};

const fetchProjects = () => {
  return dispatch => {
    dispatch(requestProjects());
    return fetch(`https://dotography.teamwork.com/projects.json`, {
        headers: {
          'Authorization': 'Basic Ymxpbms3NjdzaGlydDp4eHg='
        }
      })
      .then(response => response.json())
      .then(json => dispatch(receiveProjects(json)));
  };
};

const projectsData = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_PROJECTS:
    case RECEIVE_PROJECTS:
    case SELECT_PROJECT:
      return Object.assign({}, state, projects(state, action));
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  projectsData
});

const loggerMiddleware = createLogger()
const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  loggerMiddleware
)(createStore);

const store = createStoreWithMiddleware(rootReducer);

store.dispatch(fetchProjects()).then(() => {
  store.dispatch(getSingleProject(144879));
  store.dispatch(getSingleProject(153582));
});
