import React from 'react'


class ProjectForm extends React.Component {
    constructor(props) {
      super(props)
      this.state = {name: '', repository: ''}
    }

    handleChange(event)
    {
        this.setState(
                {
                    [event.target.name]: event.target.value
                }
            );
    }
    handleSubmit(event) {
      this.props.save(this.state.name, this.state.repository)
      event.preventDefault()
    }

    render() {
      return (
        <form onSubmit={(event)=> this.handleSubmit(event)}>
            <div className="form-group">
            <label for="login">name</label>
                <input type="text" className="form-control" name="name" value={this.state.name} onChange={(event)=>this.handleChange(event)} />
            </div>

        <div className="form-group">
            <label for="password">repository</label>

            <input type="text" className="form-control" name="repository" value={this.state.repository} onChange={(event)=>this.handleChange(event)} />


          </div>
          <input type="submit" className="btn btn-primary" value="Save" />
        </form>


      );
    }
  }

  export default ProjectForm