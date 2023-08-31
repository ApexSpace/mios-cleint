import React, { Component } from 'react'
import { Link } from "react-router-dom";
const image = window.location.origin + "/Assets/no-data.svg";
export class Shippingcost extends Component {
  constructor() {
    super();
    this.state = {
      shipping: [],
      loading: false,
      weight: "",
      incity: "",
      outcity: "",
      shippingId: ""

    };
    this.modalRef = React.createRef();
    this.closeRef = React.createRef();
  }

  host = process.env.REACT_APP_API_URL;

  async componentDidMount() {
    let url = `${this.host}/api/shipping/shippingcalc`;
    this.setState({ loading: true });
    let data = await fetch(url);
    data = await data.json();
    this.setState({ loading: false, shipping: data });
  }

  handleEdit = (id) => {
    this.modalRef.current.click();
    let shippingcost = this.state.shipping.find((cost) => cost._id === id);
    this.setState({
      weight: shippingcost.weight,
      incity: shippingcost.incity,
      outcity: shippingcost.outcity,
      shippingId: shippingcost._id
    });
  };

  handleSubmit = async () => {
    const {
      weight,
      incity,
      outcity,
      shippingId
    } = this.state;

    const shippingcalc = {
      "weight": weight,
      "incity": incity,
      "outcity": outcity,
    }

    this.setState({ loading: true });
    await fetch(`http://localhost:5000/api/shipping/editshippingcalc/${shippingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shippingcalc),
    });
    let url = `http://localhost:5000/api/shipping/shippingcalc`;
    let uProducts = await fetch(url);
    let pro = await uProducts.json();
    this.setState({ shipping: pro, loading: false });
    this.closeRef.current.click();
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }


  handleDelete = async (id) => {
    this.setState({ loading: true });
    await fetch(`http://localhost:5000/api/shipping/deleteshippingcalc/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let url = `http://localhost:5000/api/shipping/shippingcalc`;
    let uProducts = await fetch(url);
    let pro = await uProducts.json();
    this.setState({ shipping: pro, loading: false });
  }


  render() {
    return (
      <>
        <div className="main">
          <div className="container-fluid">

            <div className="my-3 d-flex justify-content-between">
              <div></div>
              <Link to="/add-shipping-cost" className="btn btn-sm btn-success ">Add Shipping Cost</Link>
            </div>
            <table className="table table-hover table-bordered">
              <thead>
                <tr className="table-dark">
                  <th colSpan="1" >Sr.</th>
                  <th colSpan="1" className="text-center">Weight Category</th>
                  <th colSpan="1" className="text-center">Intercity</th>
                  <th colSpan="1" className="text-center">Out of city</th>
                  <th colSpan="1" className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>


                {this.state.shipping.map((cost) => {
                  return (
                    <tr key={cost._id}>
                      <td>{this.state.shipping.indexOf(cost) + 1}</td>
                      <td className="text-center">{cost.weight}</td>
                      <td className="text-center">{cost.incity}</td>
                      <td className="text-center">{cost.outcity}</td>
                      <td className="text-center align-middle">
                        <span title="Edit" className="cursor-pointer" onClick={() => this.handleEdit(cost._id)}>Edit</span> |
                        <span title="Delete" className="cursor-pointer" onClick={() => this.handleDelete(cost._id)}>
                          Delete
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {this.state.shipping.length === 0 && <div className='no_data'>
              <img className='no_data-img' src={image} alt='No Data' ></img>
            </div>}
          </div>
        </div>

        <button
          ref={this.modalRef}
          type="button"
          className="btn btn-primary d-none"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Launch demo modal
        </button>

        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Edit Shipping Cost
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form noValidate method="post" className="card py-4 px-4 rounded needs-validation g-3" >
                  <div className="row mb-2">
                    <div className="form-group col-sm-3">
                      <label htmlFor="weight">Weight Category</label>
                      <input required type="text" className="form-control" id="weight" name="weight" onChange={this.onChange} value={this.state.weight} />
                    </div>
                    <div className="col-sm-3">
                      <div className="form-group">
                        <label htmlFor="incity">Intercity</label>
                        <div className="input-group">
                          <input required type="number" className="form-control" id="incity" name="incity" onChange={this.onChange} value={this.state.incity} />
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-3">
                      <div className="form-group">
                        <label htmlFor="outofcity">Out of City</label>
                        <div className="input-group">
                          <input required type="number" min={1} className="form-control" id="outcity" name="outcity" onChange={this.onChange} value={this.state.outcity} />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  ref={this.closeRef}
                >
                  Close
                </button>
                <button onClick={() => this.handleSubmit()} type="button" className="btn btn-primary">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Shippingcost