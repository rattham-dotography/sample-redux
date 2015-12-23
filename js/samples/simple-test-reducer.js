'user strict';

//Pure functions
// - do not have side effect
// - predictable
// - not modify the value that passed to them

// Reducer handle the action

import expect from 'expect'
//import * as my from "./utils/my";

const counter = (state = 0, action) => {
  switch(action.type){
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

expect(
  counter(0, { type: 'INCREMENT'})
).toEqual(1);

expect(
  counter(1, { type: 'INCREMENT'})
).toEqual(2);

expect(
  counter(1, { type: 'ETC'})
).toEqual(1);

expect(
  counter(undefined, { type: 'ETC'})
).toEqual(0);

console.log('Tests passed!');
