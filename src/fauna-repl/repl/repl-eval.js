/* eslint-disable */
import { query as q } from 'faunadb'
import { queryFunctionsAsGlobalVariables } from './query-functions'

export default function replEval(client, __query) {
  const query = eval(`(function() {${queryFunctionsAsGlobalVariables}; return ${__query};})()`)
  return client.query(query)
}
