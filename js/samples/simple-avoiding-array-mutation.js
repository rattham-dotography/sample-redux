'user restrict';

import expect from 'expect';
import deepFreeze from 'deep-freeze';

const addCounter = (list) => {

  //Mutation
  //This will not work after we make deepFreeze
  //return list.push(0);

  //Use concat array to create new list
  //list.concat([0]) = [...list, 0];
  return [...list, 0];;
};

const removeCounter = (list, index) => {

  //Mutation
  //This will not work after we make deepFreeze
  //return list.splice(index, 1);

  //list
  //.slice(0, index)
  //.concat(list.slice(index + 1));
return [
    ...list.slice(0, index),
    ...list.slice(index + 1)
  ];
};

const incrementCounter = (list, index) => {
  //This is a mutation
  //list[index]++;
  return [
    ...list.slice(0, index),
    list[index] + 1,
    ...list.slice(index + 1)
  ];
};

const decrementCounter = (list, index) => {
  //This is a mutation
  //list[index]--;
  return [
    ...list.slice(0, index),
    list[index] - 1,
    ...list.slice(index + 1)
  ];
};

const testAddCounter = () => {
  const listBefore = [];
  const listAfter = [0];

  //Frozen this list so we cannot add the value to it;
  deepFreeze(listBefore);

  expect(
    addCounter(listBefore)
  ).toEqual(listAfter);
};

const testRemoveCounter = () => {
  const listBefore = [0, 10, 20];
  const listAfter = [0, 20];

  //Frozen this list so we cannot remove the value from the list;
  deepFreeze(listBefore);

  expect(
    removeCounter(listBefore, 1)
  ).toEqual(listAfter);
};

const testIncrementCounter = () => {
  const listBefore = [0, 10, 20];
  const listAfter = [0, 11, 20];

  deepFreeze(listBefore);

  expect(
    incrementCounter(listBefore, 1)
  ).toEqual(listAfter);
};

const testDecrementCounter = () => {
  const listBefore = [0, 10, 20];
  const listAfter = [0, 9, 20];

  deepFreeze(listBefore);

  expect(
    decrementCounter(listBefore, 1)
  ).toEqual(listAfter);
};

testAddCounter();
testRemoveCounter();
testIncrementCounter();
testDecrementCounter();
console.log('All tests passed.');

