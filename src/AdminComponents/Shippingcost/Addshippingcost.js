import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { ReactNotifications } from 'react-notifications-component';
import Notification from '../../Notifications/Notifications';



export class Addshippingcost extends Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      weightcategory: "",
      intercity: "",
      outofcity: "",
      added: '',
    };
    this.onChange = this.onChange.bind(this);
  }
  host = process.env.REACT_APP_API_URL;
  onChecked = (e) => {
    this.setState({
      checked: !this.state.checked,
    });
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };


  handleSubmit = async (e) => {
    e.preventDefault();
    const {
      weightcategory,
      intercity,
      outofcity
    } = this.state;
    const shippingcost = {

      "weight": weightcategory,
      "incity": intercity,
      "outcity": outofcity
    }; try {

      this.setState({ loading: true });
      const response = await fetch(`${this.host}/api/shipping/addshippingcalc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shippingcost),
      });

      const body = await response.json();
      this.setState({ added: body.msg, loading: false });
    } catch (e) {
      if (e?.message?.includes("E11000 dup")) {
        Notification("Error", "Shipping Cost Already added for this category.", "danger");
      }
    }
  };


  render() {
    return (
      <><ReactNotifications />
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {this.state.added && (
                <Navigate to="/admin/shippingcost" replace={true} />
              )}
              <h2 className="text-center my-4">Add New Shipping Cost</h2>
              <form noValidate
                method="post"
                onSubmit={this.handleSubmit}
                className="card py-4 px-4 rounded needs-validation g-3"
              >
                <div className="row mb-2">
                  <div className="form-group col-sm-3">
                    <label htmlFor="pTitle">Weight Category</label>
                    <select className="form-select form-select-lg" id="weightcategory" name="weightcategory" onChange={this.onChange}>
                      <option selected value="">Select one</option>
                      <option value="half">0.5 kg</option>
                      <option value="one">1 kg</option>
                      <option value="greater">More than 1 kg</option>
                    </select>
                  </div>
                  <div className="col-sm-3">
                    <div className="form-group">
                      <label htmlFor="intercity">Intercity</label>
                      <div className="input-group">
                        <input required type="number" className="form-control" id="intercity" name="intercity" onChange={this.onChange} />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-3">
                    <div className="form-group">
                      <label htmlFor="outofcity">Out of City</label>
                      <div className="input-group">
                        <input required type="number" min={1} className="form-control" id="outofcity" name="outofcity" onChange={this.onChange} />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-3 ">
                    <div className="d-flex flex-end">
                      <button type="submit" className="btn btn-success add-shipping-cost">
                        Add Shipping Cost
                      </button>
                    </div>
                  </div>

                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Addshippingcost;
