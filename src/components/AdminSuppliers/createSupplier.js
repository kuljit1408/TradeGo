import React, { Component } from "react";
import DashboardSidebar from "../../components/Dashboard/dashboardSidebar";
import axios from "axios";
import { getUser } from "../Utils/common";
import { getToken } from "../Utils/common";

/* Get User and Token From Session */
const user = getUser();
const token = getToken();

class createSupplier extends Component {
  //Set State values
  state = {
    supplierName: "",
    supplierPhone: "",
    supplierEmailAddress: "",
    supplierDiscount: "",
    country: "",
    province: "",
    supplierCity: "",
    supplierAddress1: "",
    supplierAddress2: "",
    supplierPostalCode: "",
    errorMessage: "",
    successMsg: "",
    countries: [],
    provinces: [],
  };
  handleChange = this.handleChange.bind(this);

  //Fetch Country List
  componentDidMount() {
    let initialCountries = [];
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
  }

  //Get Provinces list on chnage of country
  handleChange(event) {
    let initialProvinces = [];
    this.setState({
      country: event.target.value,
      errorMessage:
        event.target.value === "" ? "You must select your country" : "",
    });

    axios({
      method: "POST",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/provinces/province`,
      data: {
        country_id: event.target.value,
      },
    })
      .then((response) => {
        //console.log(response.data.success);
        if (response.data.success === 1) {
          initialProvinces = response.data.data.map((province) => {
            return { value: province.ProvinceId, display: province.name };
          });
          this.setState({
            provinces: [
              { value: "", display: "Please select your province" },
            ].concat(initialProvinces),
          });
        } else {
          this.setState({
            provinces: [],
          });
        }
      })
      .catch((error) => {
        console.log("Error:" + error.response);
        this.setState({
          provinces: [],
        });
        this.setState({ errorMessage: error.response.data.message });
      });
  }

  //Reset Button functionality
  cancelCourse = () => {
    this.setState({
      supplierName: "",
      supplierPhone: "",
      supplierEmailAddress: "",
      supplierDiscount: "",
      country: "",
      province: "",
      supplierCity: "",
      supplierAddress1: "",
      supplierAddress2: "",
      supplierPostalCode: "",
    });
  };

  //Get form values on change handler
  ChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  //Submit supplier form after clicking on save button
  submitHandler = (e) => {
    e.preventDefault();
    axios({
      method: "POST",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/supplier/createSupplier`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: {
        SupplierName: this.state.supplierName,
        SupplierEmail: this.state.supplierEmailAddress,
        SupplierPhone: this.state.supplierPhone,
        DiscountRate: this.state.supplierDiscount,
        CountryId: this.state.country,
        ProvinceId: this.state.province,
        Address1: this.state.supplierAddress1,
        Address2: this.state.supplierAddress2,
        City: this.state.supplierCity,
        PostalCode: this.state.supplierPostalCode,
        CompanyId: user.CompanyId,
      },
    })
      .then((response) => {
        console.log("Response" + response.data);
        if (response.data.success === 0) {
          this.setState({ errorMessage: response.data.message });
        } else {
          this.setState({ successMsg: response.data.message });
          window.location.href = "/getSuppliers";
        }
      })
      .catch((error) => {
        console.log("Error" + error);
        this.setState({ errorMessage: error.response.data.message });
      });
  };

  // Start Render Function
  render() {
    return (
      <div class="container-fluid  pt-5 mt-3">
        <div class="row">
          <DashboardSidebar />
          <div class="col-md-9 ml-sm-auto col-lg-10 px-4">
            {this.state.errorMessage && (
              <p className="alert alert-danger"> {this.state.errorMessage} </p>
            )}
            {this.state.successMsg && (
              <p className="alert alert alert-success">
                {" "}
                {this.state.successMsg}{" "}
              </p>
            )}
            <div class="float-left">
              <h3 class="text-primary">Supplier/Create Supplier</h3>
            </div>
            <form
              method="post"
              name="register"
              onSubmit={this.submitHandler}
              id="SupplierForm"
            >
              <div class="float-right">
                <input
                  type="reset"
                  class="btn btn-primary mb-2"
                  onClick={this.cancelCourse}
                  value="Reset Form"
                />
                &nbsp;&nbsp;{" "}
                <input
                  type="submit"
                  class="btn btn-primary mb-2"
                  value="Save"
                />
              </div>
              <br></br> <br></br> <br></br>
              <div class="row register-form createForm">
                <div class="col-md-6">
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control"
                      required
                      name="supplierName"
                      value={this.state.supplierName}
                      onChange={(e) => this.ChangeHandler(e)}
                      pattern="[a-zA-Z][a-zA-Z ]{2,}"
                      placeholder="Supplier Name*"
                    />
                  </div>

                  <div class="form-group">
                    <input
                      type="text"
                      minlength="10"
                      maxlength="10"
                      required
                      name="supplierPhone"
                      value={this.state.supplierPhone}
                      onChange={(e) => this.ChangeHandler(e)}
                      class="form-control"
                      placeholder=" Phone Number*"
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <input
                      type="email"
                      class="form-control"
                      required
                      name="supplierEmailAddress"
                      value={this.state.supplierEmailAddress}
                      onChange={(e) => this.ChangeHandler(e)}
                      placeholder="Email Address*"
                    />
                  </div>
                  <div class="input-group mb-2">
                    <input
                      type="text"
                      class="form-control"
                      name="supplierDiscount"
                      value={this.state.supplierDiscount}
                      onChange={(e) => this.ChangeHandler(e)}
                      placeholder="Discount Rate"
                    />
                    <div class="input-group-prepend">
                      <div class="input-group-text">%</div>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <select
                      name="country"
                      class="form-control"
                      required
                      value={this.state.country}
                      onChange={this.handleChange}
                    >
                      {this.state.countries.map((country) => (
                        <option key={country.value} value={country.value}>
                          {country.display}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <select
                      name="province"
                      class="form-control"
                      required
                      value={this.state.province}
                      onChange={(e) =>
                        this.setState({
                          province: e.target.value,
                          errorMessage:
                            e.target.value === ""
                              ? "You must select your province"
                              : "",
                        })
                      }
                    >
                      {this.state.provinces.map((province) => (
                        <option key={province.value} value={province.value}>
                          {province.display}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <input
                      type="text"
                      name="supplierCity"
                      class="form-control"
                      required
                      value={this.state.supplierCity}
                      onChange={(e) => this.ChangeHandler(e)}
                      placeholder="City*"
                    />
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="form-group">
                    <textarea
                      class="form-control"
                      name="supplierAddress1"
                      rows="3"
                      placeholder="Address 1*"
                      required
                      value={this.state.supplierAddress1}
                      onChange={(e) => this.ChangeHandler(e)}
                    >
                      Address 1*
                    </textarea>
                  </div>
                  <div class="form-group">
                    <textarea
                      class="form-control"
                      name="supplierAddress2"
                      rows="3"
                      placeholder="Address 2"
                      value={this.state.supplierAddress2}
                      onChange={(e) => this.ChangeHandler(e)}
                    >
                      Address 2
                    </textarea>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <input
                      type="text"
                      name="supplierPostalCode"
                      class="form-control"
                      value={this.state.supplierPostalCode}
                      onChange={(e) => this.ChangeHandler(e)}
                      pattern="[A-Za-z][0-9][A-Za-z][0-9][A-Za-z][0-9]"
                      required
                      placeholder="Postal Code*"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
  // End Render Function
}

export default createSupplier;
