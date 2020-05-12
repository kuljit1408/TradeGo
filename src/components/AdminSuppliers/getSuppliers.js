import React, { Component } from "react";
import DashboardSidebar from "../../components/Dashboard/dashboardSidebar";
import { getUser } from "../Utils/common";
import { getToken } from "../Utils/common";
import { NavLink } from "react-router-dom";
import axios from "axios";

/* Get User and Token From Session */
const user = getUser();
const token = getToken();

class getSuppliers extends Component {
  //Set state values
  state = {
    suppliersList: [],
    countries: [],
    supplierName: "",
    supplierId: "",
    country: "",
    supplierCity: "",
  };

  //Get all Supplier API
  componentDidMount() {
    let initialCountries = [];
    let initialSuppliers = [];
    let url = "";
    if (
      this.state.supplierName ||
      this.state.supplierId ||
      this.state.country ||
      this.state.supplierCity
    ) {
      url =
        `https://api-tradego.herokuapp.com/api/supplier/getsuppliers?SupplierName=` +
        this.state.supplierName +
        "&&SupplierId=" +
        this.state.supplierId +
        "&&City=" +
        this.state.supplierCity +
        "&&CountryName=" +
        this.state.country;
    } else {
      url = `https://api-tradego.herokuapp.com/api/supplier/getsuppliers`;
    }
    fetch(`https://api-tradego.herokuapp.com/api/countries/country`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        initialCountries = data.data.map((country) => {
          return { value: country.CountryId, display: country.name };
        });
        this.setState({
          countries: [
            { value: "", display: "Please select your country" },
          ].concat(initialCountries),
        });
      })
      .catch((error) => {
        this.setState({ errorMessage: error.response.data.message });
      });

    axios({
      method: "POST",
      responseType: "json",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: {
        CompanyId: user.CompanyId,
      },
    })
      .then((response) => {
        //console.log(response.data.success);
        if (response.data.success == 1) {
          initialSuppliers = response.data.data.map((supplier) => {
            return {
              id: supplier.SupplierId,
              suppliername: supplier.SupplierName,
              supplieremail: supplier.SupplierEmail,
              suppliercity: supplier.City,
            };
          });
          this.setState({
            suppliersList: initialSuppliers,
          });
        } else {
          this.setState({
            suppliersList: [],
          });
        }
      })
      .catch((error) => {
        console.log("Error:" + error);
        this.setState({ errorMessage: error.response.data.message });
      });
  }
  ChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  submitHandler = (e) => {
    e.preventDefault();
    this.componentDidMount();
  };
  reset = () => {
    this.setState({
      supplierName: "",
      supplierId: "",
      country: "",
      supplierCity: "",
    });
  };
  //Start render Function
  render() {
    function myFunction() {
      var x = document.getElementById("supplierFilter");
      if (x.style.display === "none") {
        x.style.display = "flex";
      } else {
        x.style.display = "none";
      }
    }
    return (
      <div class="container-fluid  pt-5 mt-3">
        <div class="row">
          <DashboardSidebar />
          <div class="col-md-9 ml-sm-auto col-lg-10 px-4">
            <div class="headings">
              <div class="float-left">
                <h3 class="text-primary">Suppliers</h3>
              </div>
              <div class="float-right">
                <NavLink to="/createSupplier" className="btn btn-primary">
                  Create Supplier
                </NavLink>
              </div>
            </div>
            <form
              method="post"
              name="register"
              class="formClass"
              onSubmit={this.submitHandler}
            >
              <div class="float-right">
                <button class="btn btn-primary" onClick={myFunction}>
                  Display/Hide Filter
                </button>
                &nbsp;&nbsp;
                <button class="btn btn-primary" onClick={this.reset}>
                  Reset
                </button>
              </div>
              <br />
              <br />
              <br />
              <br />
              <div id="supplierFilter" class="row register-form">
                <div class="col-md-3">
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control input-lg"
                      name="supplierName"
                      value={this.state.supplierName}
                      onChange={(e) => this.ChangeHandler(e)}
                      placeholder="Supplier Name"
                    />
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control input-lg"
                      name="supplierId"
                      value={this.state.supplierId}
                      onChange={(e) => this.ChangeHandler(e)}
                      placeholder="Supplier Id"
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <select
                      name="productCountry"
                      class="form-control"
                      required
                      value={this.state.country}
                      onChange={(e) =>
                        this.setState({
                          country: e.target.value,
                          errorMessage:
                            e.target.value === ""
                              ? "You must select country"
                              : "",
                        })
                      }
                    >
                      {this.state.countries.map((country) => (
                        <option key={country.value} value={country.display}>
                          {country.display}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control input-lg"
                      name="supplierCity"
                      value={this.state.supplierCity}
                      onChange={(e) => this.ChangeHandler(e)}
                      placeholder="City"
                    />
                  </div>
                </div>
                <div class="col-md-3">
                  <input
                    type="submit"
                    class="btn btn-primary mb-2"
                    value="Execute"
                  />
                </div>
              </div>
            </form>
            <div class="table-wrapper-scroll-y my-custom-scrollbar">
              <table class="table table-bordered table-striped mb-0">
                <thead>
                  <tr>
                    <th scope="col">Supplier Id</th>
                    <th scope="col">Supplier Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">City</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.suppliersList.map((supplier) => (
                    <tr>
                      <td>{supplier.id}</td>
                      <td>{supplier.suppliername}</td>
                      <td>{supplier.supplieremail}</td>
                      <td>{supplier.suppliercity}</td>
                      <td>
                        <NavLink
                          to={`/updateSupplier?supplierId=${supplier.id}`}
                        >
                          <img
                            src="https://img.icons8.com/bubbles/50/000000/edit.png"
                            title="Update Supplier"
                          />
                        </NavLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
  //End render Function
}

export default getSuppliers;
