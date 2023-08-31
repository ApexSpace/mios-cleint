import React, { Component } from 'react'
import { Navigate } from "react-router-dom";
export class AddCategory extends Component {
    constructor() {
        super();
    
        this.state = {
        checked: false,        
        loading: false,
        pTitle: "",
        added : "",
        };
        this.onChange = this.onChange.bind(this);
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
      };

      handleSubmit = async (e) => {
        e.preventDefault();
        const {
          pTitle,
        } = this.state;
        const category = {
          "name":pTitle,
        };
        this.setState({ loading: true });
        const response = await fetch("http://localhost:5000/api/category/addcategory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjI3NjY1OTllNmYxZGIwNWQ4NzVjZDM3In0sImlhdCI6MTY1MTkyNjQyNn0.4sT98Nu8Q5ad87buKzYarR8KzpPyeL_9RWf8q7JdjQk"
          },
          body: JSON.stringify(category),
        });
        const body = await response.json();
        this.setState({ loading: false });
        if (response.status !== 200) throw Error(body.message);
        this.setState({
          pTitle: "",
          added: body.message,
        });
      };

  render() {
    return (
        <>
         {this.state.added && (
              <Navigate to="/categories" replace={true} />
            )}
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2 className="text-center my-4">Add New Category</h2>
              <form
                method="post"
                onSubmit={this.handleSubmit}
                className="card py-4 px-4 rounded"
              >
                <div className="row mb-2  d-flex justify-content-center">
                  <div className="form-group col-sm-4">
                    <label htmlFor="pTitle">Category Title</label>
                    <input type="text" className="form-control" id="pTitle" name="pTitle" onChange={this.onChange} required />
                  </div>

                <div className='col-sm-4 align-self-end'>
                  <button type="submit"  className="btn btn-success ">
                    Add Category
                  </button>
                </div>
                </div>

              </form>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default AddCategory