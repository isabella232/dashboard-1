import faunadb from 'faunadb';
const q = faunadb.query, Ref = q.Ref;

import {
  getAllClasses,
  getClassInfo,
  queryForIndexes
} from '../../src/classes/actions'

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

it('should get all classes', () => {
  const store = mockStore({
    classes: {}
  })

  const client = {
    query: jest.fn()
  }

  client.query.mockReturnValue(Promise.resolve({
    data: ["class-0", "class-1"]
  }))

  const expectedActions = [{
    type: "UPDATE_CLASS_INFO",
    scopedClient: client,
    result: ["class-0", "class-1"]
  }]

  return store.dispatch(getAllClasses(client)).then(() => {
    expect(store.getActions()).toEqual(expectedActions)
    expect(client.query).toBeCalled()
  })
})

it('should get class info', () => {
  const store = mockStore({
    classes: {}
  })

  const client = {
    query: jest.fn()
  }

  client.query.mockReturnValue(Promise.resolve("result"))

  const expectedActions = [{
    type: "UPDATE_CLASS_INFO",
    scopedClient: client,
    result: ["result"]
  }, {
    type: "UPDATE_SELECTED_CLASS",
    name: "test-class"
  }]

  return store.dispatch(getClassInfo(client, "test-class")).then(() => {
    expect(store.getActions()).toEqual(expectedActions)
    expect(client.query).toBeCalled()
  })
})

it('should not get class info when it already have class info', () => {
  const store = mockStore({
    classes: {
      "test-class": {}
    }
  })

  const client = {
    query: jest.fn()
  }

  const expectedActions = [{
    type: "UPDATE_SELECTED_CLASS",
    name: "test-class"
  }]

  return store.dispatch(getClassInfo(client, "test-class")).then(() => {
    expect(store.getActions()).toEqual(expectedActions)
    expect(client.query).not.toBeCalled()
  })
})

it('should query indexes of class', () => {
  const store = mockStore({
    classes: {
      "test-class": {}
    }
  })

  const client = {
    query: jest.fn()
  }

  client.query.mockReturnValue(Promise.resolve({
    data: ["index-0", "index-1"]
  }))

  const expectedActions = [{
    type: "UPDATE_INDEX_OF_CLASS",
    clazz: "test-class",
    indexes: ["index-0", "index-1"]
  }]

  const classRef = Ref("classes/test-class")
  return store.dispatch(queryForIndexes(client, classRef)).then(() => {
    expect(store.getActions()).toEqual(expectedActions)
    expect(client.query).toBeCalled()
  })
})

it('should not query indexes when it already have index info', () => {
  const store = mockStore({
    classes: {
      "test-class": {
        indexes: ["index-0", "index-1"]
      }
    }
  })

  const client = {
    query: jest.fn()
  }

  const expectedActions = [ ]

  const classRef = Ref("classes/test-class")
  return store.dispatch(queryForIndexes(client, classRef)).then(() => {
    expect(store.getActions()).toEqual(expectedActions)
    expect(client.query).not.toBeCalled()
  })
})

