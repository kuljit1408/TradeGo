import React, { Component } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
class sendEmailNotification extends Component {
  state = {
    email: "",
    successMsg: "",
    errorMessage: "",
  };

  ChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  submitHandler = (e) => {
    //console.log(this.state);
    e.preventDefault();
    axios({
      method: "POST",
      url:
        "https://api-tradego.herokuapp.com/api/companyuser/forgetPasswordCompany",
      data: {
        email: this.state.email,
      },
    })
      .then((response) => {
        if (response.data.success === 0) {
          this.setState({ errorMessage: response.data.message });
        } else {
          this.setState({ successMsg: response.data.message });
        }
      })
      .catch((error) => {
        this.setState({ errorMessage: error.response.data.message });
      });
  };

  render() {
    return (
      <div class="container-fluid  pt-5 mt-3">
        <div class="row forgotbody">
          <div class="col-md-3"></div>
          <div class="col-md-6">
            <div
              class="tab-pane fade show active"
              id="home"
              role="tabpanel"
              aria-labelledby="home-tab"
            >
              <h3 class="text-primary">Forgot Password</h3>
              {this.state.errorMessage && (
                <p className="alert alert-danger">
                  {" "}
                  {this.state.errorMessage}{" "}
                </p>
              )}
              {this.state.successMsg && (
                <p className="alert alert alert-success">
                  {" "}
                  {this.state.successMsg}{" "}
                </p>
              )}
              <form onSubmit={this.submitHandler}>
                <div class="form-group">
                  <div class="form-group">
                    <input
                      class="form-control"
                      name="email"
                      value={this.state.email}
                      onChange={(e) => this.ChangeHandler(e)}
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                      required
                      placeholder="User Email*"
                      type="text"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <button type="submit" class="btnRegister">
                    Email new password
                  </button>
                </div>
                <div class="form-group">
                  <p className="forgot-password text-left">
                    <NavLink to="/login"> Back to Login?</NavLink>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default sendEmailNotification;
