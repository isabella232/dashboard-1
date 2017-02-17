import React, { Component } from "react"
import { connect } from "react-redux"
import { browserHistory } from "react-router"
import { TextField } from "office-ui-fabric-react"

import SchemaForm from "./schema-form"
import DeleteForm from "./delete-form"
import { createDatabase, deleteDatabase, selectedDatabase } from "../"
import { notify } from "../../notifications"
import { faunaClient } from "../../authentication"

class DatabaseForm extends Component {
  constructor(props) {
    super(props)
    this.state = this.initialState()
  }

  initialState() {
    return {
      name: ""
    }
  }

  componentDidMount() {
    this.reset()
  }

  reset() {
    this.setState(this.initialState())
  }

  onChange(field) {
    return value => this.setState({
      [field]: value
    })
  }

  onSubmit() {
    return notify("Database created successfully", createDatabase(
      this.props.client,
      this.props.path,
      this.state
    ))
  }

  onDelete() {
    const { client, database } = this.props

    return notify("Database deleted successfully", dispatch =>
      dispatch(deleteDatabase(
        client,
        database.getIn(["parent", "path"]),
        database.get("name"))
      ).then(() =>
        browserHistory.push(database.getIn(["parent", "url"]))
      )
    )
  }

  render() {
    const { database } = this.props

    return <div>
      <SchemaForm
        title="Create a new database"
        buttonText="Create Database"
        onSubmit={this.onSubmit.bind(this)}
        onFinish={this.reset.bind(this)}>
          <TextField label="Name"
            required={true}
            value={this.state.name}
            onBeforeChange={this.onChange("name")}
            description="This name is used in queries and API calls." />
      </SchemaForm>

      {!database.get("isRoot") ?
        <DeleteForm
          buttonText="Delete Database"
          title={`Delete ${database.get("name")}`}
          validateName={database.get("name")}
          onDelete={this.onDelete.bind(this)}
        /> : null}
    </div>
  }
}

export default connect(
  state => ({
    database: selectedDatabase(state),
    path: selectedDatabase(state).get("path"),
    client: faunaClient(state)
  })
)(DatabaseForm)
