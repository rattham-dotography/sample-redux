'user restrict';

import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import fetch from 'isomorphic-fetch'

const SELECT_REDDIT = 'SELECT_REDDIT';
const INVALIDATE_REDDIT = 'INVALIDATE_REDDIT';
const REQUEST_POSTS = 'REQUEST_POSTS';
const RECEIVE_POSTS = 'RECEIVE_POSTS';

//Action

const selectReddit = (reddit) => {
  return {
    type: SELECT_REDDIT,
    reddit
  };
};

const invalidateReddit = (reddit) => {
  return {
    type: INVALIDATE_REDDIT,
    reddit
  }
};

const requestPosts = (reddit) => {
  return {
    type: REQUEST_POSTS,
    reddit
  };
};

const receivePosts = (reddit, json) => {
  return {
    type: RECEIVE_POSTS,
    reddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  };
};

// Reducer

const selectedReddit = (state = 'reactjs', action) => {
  switch (action.type) {
    case SELECT_REDDIT:
      return action.reddit;
    default:
      return state;
  }
};

// Thunk Action creator

const fetchPosts = (reddit) => {
  return dispatch => {
    dispatch(requestPosts(reddit));
    return fetch(`http://www.reddit.com/r/${reddit}.json`)
      .then(response => response.json())
      .then(json => dispatch(receivePosts(reddit, json)));
  };
};

const shouldFetchPosts = (state, reddit) => {
  const posts = state.postsByReddit[reddit];
  if(!posts) {
    return true;
  } else if (posts.isFetching) {
    return false;
  } else {
    return posts.didInvalidate;
  }
};

const fetchPostsIfNeeded = (reddit) => {
  return (dispatch, getState) => {
    if(shouldFetchPosts(getState(),reddit)) {
      return dispatch(fetchPosts(reddit));
    } else {
      return Promise.resolve()
    }
  };
};


const posts = (
  state = {
    isFetching: false,
    didInvalidate: false,
    items: []
  },
  action
)  => {
  switch (action.type) {
    case INVALIDATE_REDDIT:
      return Object.assign({}, state, {
        didInvalidate: true
      });
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      });
    case RECEIVE_POSTS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.posts,
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
};

const postsByReddit = (state = {}, action) => {
  switch (action.type) {
    case INVALIDATE_REDDIT:
    case REQUEST_POSTS:
    case RECEIVE_POSTS:
      return Object.assign({}, state, {
        [action.reddit]: posts(state[action.reddit], action)
      });
    default:
      return state;
  }
};

const logger = ({ getState }) => next => action => {
  console.log('my logger', action);
  let result = next(action);
  console.log(result);
  return result;
};

const rootReducer = combineReducers({
  postsByReddit,
  selectedReddit
});

const loggerMiddleware = createLogger()
const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  loggerMiddleware
)(createStore);

const store = createStoreWithMiddleware(rootReducer);
store.dispatch(selectReddit('reactjs'));
store.dispatch(fetchPostsIfNeeded('reactjs')).then(() =>
  console.log(store.getState())
);
