import React, { Component } from "react";
import DashboardSidebar from "../../components/Dashboard/dashboardSidebar";
import axios from "axios";

import { getUser, removeUserSession } from "../Utils/common";
import { getToken } from "../Utils/common";

const user = getUser();
const token = getToken();
const handleLogout = (props) => {
  removeUserSession();
  window.location.href = "/login";
};
console.log(user);
class userSettings extends Component {
  state = {
    fname: "",
    lname: "",
    emailAddress: "",
    phone: "",
    currentpassword: "",
    currentpasswordDb: "",
    newpassword: "",
    confirmpassword: "",
    errorMessage: "",
    successMsg: "",
  };

  componentDidMount() {
    //Get user profile by id API
    //const uderid = new URLSearchParams(this.props.location.search).get('userid');
    axios({
      method: "GET",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/companyuser/getuserdetailsbyid?userid=${user.UserId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (response.data.success == 1) {
          //console.log(response.data.data);
          this.setState({
            fname: response.data.data[0].Fname,
            lname: response.data.data[0].Lname,
            emailAddress: response.data.data[0].Email,
            phone: response.data.data[0].PhoneNumber,
            currentpasswordDb: response.data.data[0].Password,
          });
        }
      })
      .catch((error) => {
        console.log("Error:" + error);
        this.setState({ errorMessage: error.response });
      });
  }

  //Reset Button functionality
  cancelCourse = () => {
    this.setState({
      fname: "",
      lname: "",
      emailAddress: "",
      phone: "",
      currentpassword: "",
      newpassword: "",
      confirmpassword: "",
    });
  };
  // Get form values on change handler
  ChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  //Update user api
  submitHandler = (e) => {
    e.preventDefault();
    if (
      this.state.currentpassword &&
      this.state.currentpassword != this.state.currentpasswordDb
    ) {
      this.setState({ errorMessage: "Entered Currenct password is wrong" });
    } else if (!this.state.newpassword && this.state.currentpassword) {
      this.setState({ errorMessage: "Please enter new password" });
    } else if (!this.state.confirmpassword && this.state.newpassword) {
      this.setState({ errorMessage: "Please enter confirm password" });
    } else if (
      this.state.newpassword &&
      this.state.confirmpassword &&
      this.state.newpassword != this.state.confirmpassword
    ) {
      this.setState({
        errorMessage: "New Password does not match with confirm password",
      });
    } else {
      const data = new FormData();
      data.append("userid", user.UserId);
      data.append("fname", this.state.fname);
      data.append("lname", this.state.lname);
      data.append("email", this.state.emailAddress);
      data.append("phonenumber", this.state.phone);
      data.append(
        "password",
        this.state.currentpassword
          ? this.state.currentpassword
          : this.state.currentpasswordDb
      );
      axios({
        method: "POST",
        responseType: "json",
        url: `https://api-tradego.herokuapp.com/api/companyuser/edituser`,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        data: {
          userid: user.UserId,
          fname: this.state.fname,
          lname: this.state.lname,
          email: this.state.emailAddress,
          phonenumber: this.state.phone,
          password: this.state.newpassword
            ? this.state.newpassword
            : this.state.currentpasswordDb,
        },
      })
        .then((response) => {
          if (response.data.success == 0) {
            this.setState({ errorMessage: response.data.message });
          } else {
            this.setState({ successMsg: response.data.message });
            if (this.state.emailAddress != user.Email) {
              handleLogout();
            }
          }
        })
        .catch((error) => {
          //console.log("Error"+error);
          this.setState({ errorMessage: error.response.data.message });
        });
    }
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
              <h3 class="text-primary">User Settings</h3>
            </div>
            <form method="post" name="register" onSubmit={this.submitHandler}>
              <div class="float-right">
                <input
                  type="reset"
                  class="btn btn-primary mb-2"
                  value="Reset"
                  onClick={this.cancelCourse}
                />
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
                      pattern="[A-Za-z]{1,20}"
                      title="Firstname should only contain lowercase and uppercase letters. e.g. John"
                      name="fname"
                      value={this.state.fname}
                      onChange={(e) => this.ChangeHandler(e)}
                      placeholder="First Name"
                    />
                  </div>
                  <div class="form-group">
                    <input
                      type="email"
                      class="form-control"
                      required
                      name="emailAddress"
                      placeholder="Email Address*"
                      value={this.state.emailAddress}
                      onChange={(e) => this.ChangeHandler(e)}
                    />
                  </div>
                  <div class="form-group">
                    <input
                      type="password"
                      class="form-control"
                      minlength="8"
                      pattern="^(?=.*\d).{8,15}$"
                      title="Password must be between 8 and 15 digits long and include at least one numeric digit."
                      name="currentpassword"
                      placeholder="Current Password"
                      value={this.state.currentpassword}
                      onChange={(e) => this.ChangeHandler(e)}
                    />
                  </div>

                  <div class="form-group">
                    <input
                      type="password"
                      class="form-control"
                      minlength="8"
                      pattern="^(?=.*\d).{8,15}$"
                      title="Password must be between 8 and 15 digits long and include at least one numeric digit."
                      name="confirmpassword"
                      placeholder="Confirm Password"
                      value={this.state.confirmpassword}
                      onChange={(e) => this.ChangeHandler(e)}
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control"
                      name="lname"
                      pattern="[A-Za-z]{1,20}"
                      title="Lastname should only contain lowercase and uppercase letters. e.g. Wuf"
                      value={this.state.lname}
                      onChange={(e) => this.ChangeHandler(e)}
                      placeholder="Last Name"
                    />
                  </div>
                  <div class="form-group">
                    <input
                      type="text"
                      minlength="10"
                      maxlength="10"
                      required
                      name="phone"
                      class="form-control"
                      placeholder=" Phone Number"
                      value={this.state.phone}
                      onChange={(e) => this.ChangeHandler(e)}
                    />
                  </div>
                  <div class="form-group">
                    <input
                      type="password"
                      class="form-control"
                      minlength="8"
                      pattern="^(?=.*\d).{8,15}$"
                      title="Password must be between 8 and 15 digits long and include at least one numeric digit."
                      name="newpassword"
                      placeholder="New Password"
                      value={this.state.newpassword}
                      onChange={(e) => this.ChangeHandler(e)}
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

export default userSettings;
