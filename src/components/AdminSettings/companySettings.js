import React, { Component } from "react";
import DashboardSidebar from "../../components/Dashboard/dashboardSidebar";
import axios from "axios";
import { getUser } from "../Utils/common";
import { getToken } from "../Utils/common";

/* Get User and Token From Session */
const user = getUser();
const token = getToken();

class companySettings extends Component {
  //Set the update product state values
  state = {
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyCountry: "",
    companyProvince: "",
    companyCity: "",
    companyAddress1: "",
    companyAddress2: "",
    companyPostalCode: "",
    companyLogo: "",
    showcompanyLogo: "",
    errorMessage: "",
    successMsg: "",
    countries: [],
    provinces: [],
  };
  handleChange = this.handleChange.bind(this);
  selectImages = (event) => {
    this.setState({ companyLogo: event.target.files[0] });
  };
  //Fetch companydetail by id api
  componentDidMount() {
    //Declare variable for country url
    let initialCountries = [];

    //Country API
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

    //Get CPmpany profile by id API
    axios({
      method: "GET",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/companyuser/getCompanyById?CompanyId=${user.CompanyId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (response.data.success == 1) {
          this.setState({
            companyName: response.data.data.Company_name,
            companyEmail: response.data.data.website,
            companyPhone: response.data.data.website,
            companyCountry: response.data.data.CountryID,
            companyProvince: response.data.data.ProvinceId,
            companyCity: response.data.data.City,
            companyAddress1: response.data.data.Address1,
            companyAddress2: response.data.data.Address2,
            companyPostalCode: response.data.data.PostalCode,
            showcompanyLogo: response.data.data.Logo,
          });
          this.handleChange(this.state.companyCountry, "onloadType");
        }
      })
      .catch((error) => {
        this.setState({ errorMessage: error.response.data.message });
      });
  }

  //Get Provinces list on change of country
  handleChange(event, type) {
    let countryid = "";
    if (type == "onloadType") {
      countryid = this.state.companyCountry;
    } else {
      countryid = event.target.value;
    }
    let initialProvinces = [];
    this.setState({
      companyCountry: countryid,
      errorMessage: countryid === "" ? "You must select your country" : "",
    });

    axios({
      method: "POST",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/provinces/province`,
      data: {
        country_id: countryid,
      },
    })
      .then((response) => {
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
        this.setState({ errorMessage: error.response });
      });
  }

  //Get form values on change handler
  ChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  //Update company api
  submitHandler = (e) => {
    const data = new FormData();
    data.append("CompanyId", user.CompanyId);
    data.append("CompanyName", this.state.companyName);
    data.append("Website", this.state.companyEmail);
    data.append("Logo", this.state.companyLogo);
    data.append("Address1", this.state.companyAddress1);
    data.append("Address2", this.state.companyAddress2);
    data.append("City", this.state.companyCity);
    data.append("CountryId", this.state.companyCountry);
    data.append("ProvinceId", this.state.companyProvince);
    data.append("PostalCode", this.state.companyPostalCode);
    data.append("CurrencyId", 1);
    e.preventDefault();
    axios({
      method: "PUT",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/companyuser/editCompanyProfile`,
      data,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (response.data.success == 0) {
          this.setState({ errorMessage: response.data.message });
        } else {
          this.setState({ successMsg: response.data.message });
        }
      })
      .catch((error) => {
        //console.log("Error"+error);
        this.setState({ errorMessage: error.response.data.message });
      });
  };

  //Call render function
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
              <h3 class="text-primary">Company Settings</h3>
            </div>
            <form method="post" name="register" onSubmit={this.submitHandler}>
              <div class="float-right">
                &nbsp;&nbsp;{" "}
                <input
                  type="submit"
                  class="btn btn-primary mb-2"
                  value="Update"
                />
              </div>
              <br></br> <br></br> <br></br>
              <div class="row register-form formClass">
                <div class="col-md-6">
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control"
                      required
                      name="companyName"
                      value={this.state.companyName}
                      onChange={(e) => this.ChangeHandler(e)}
                      placeholder="Company Name*"
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control"
                      required
                      name="companyEmail"
                      value={this.state.companyEmail}
                      onChange={(e) => this.ChangeHandler(e)}
                      placeholder="Company Email*"
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <select
                      name="companyCountry"
                      class="form-control"
                      required
                      value={this.state.companyCountry}
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
                      name="companyProvince"
                      class="form-control"
                      required
                      value={this.state.companyProvince}
                      onChange={(e) =>
                        this.setState({
                          companyProvince: e.target.value,
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
                      class="form-control"
                      required
                      name="companyCity"
                      value={this.state.companyCity}
                      onChange={(e) => this.ChangeHandler(e)}
                      placeholder="Company City"
                    />
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span
                        class="input-group-text logoStyle"
                        id="inputGroupFileAddon01"
                      >
                        Company Logo
                      </span>
                    </div>
                    <div class="custom-file">
                      <input
                        type="file"
                        class="custom-file-input"
                        onChange={this.selectImages}
                      />
                      <label class="custom-file-label" for="inputGroupFile01">
                        {this.state.companyLogo.name}
                      </label>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <img
                      class="productImage"
                      src={this.state.showcompanyLogo}
                      alt="Company Logo"
                    />
                  </div>
                  <br />
                </div>
                <div class="col-md-12">
                  <div class="form-group">
                    <textarea
                      class="form-control"
                      name="companyAddress1"
                      rows="3"
                      value={this.state.companyAddress1}
                      onChange={(e) => this.ChangeHandler(e)}
                      required
                    >
                      Company Address 1
                    </textarea>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="form-group">
                    <textarea
                      class="form-control"
                      name="companyAddress2"
                      rows="3"
                      value={this.state.companyAddress2}
                      onChange={(e) => this.ChangeHandler(e)}
                      required
                    >
                      Company Address 2
                    </textarea>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control"
                      required
                      name="companyPostalCode"
                      value={this.state.companyPostalCode}
                      onChange={(e) => this.ChangeHandler(e)}
                      placeholder="Company Postal Code"
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
}
export default companySettings;
