import React, { Component } from "react";
import DashboardSidebar from "../../components/Dashboard/dashboardSidebar";
import axios from "axios";
import { getUser } from "../Utils/common";
import { getToken } from "../Utils/common";

/* Get User and Token From Session */
const user = getUser();
const token = getToken();

class editCategory extends Component {
  //Set the update category state values
  state = {
    catename: "",
    Tags: "",
    cateSKU: "",
  };

  componentDidMount() {
    const categoryid = new URLSearchParams(this.props.location.search).get(
      "categoryId"
    );
    //Get category by id API
    axios({
      method: "GET",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/category/getcategorybyId?CategoryId=${categoryid}&CompanyId=${user.CompanyId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (response.data.success == 1) {
          this.setState({
            catename: response.data.data[0].categoryname,
            Tags: response.data.data[0].tags,
            cateSKU: response.data.data[0].SKU,
          });
        }
      })
      .catch((error) => {
        console.log("Error:" + error);
        this.setState({ errorMessage: error.response.data.message });
      });
  }

  //Cancel Button functionality
  cancelCourse = () => {
    window.location.href = "/getCategories";
  };

  //Get form values on change handler
  ChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  //Submit category form after clicking on save button || Call Update category api
  submitHandler = (e) => {
    const categoryid = new URLSearchParams(this.props.location.search).get(
      "categoryId"
    );
    e.preventDefault();
    axios({
      method: "PUT",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/category/editcategory`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: {
        categoryId: categoryid,
        categoryname: this.state.catename,
        tags: this.state.Tags,
        SKU: this.state.cateSKU,
      },
    })
      .then((response) => {
        if (response.data.success === 0) {
          this.setState({ errorMessage: response.data.message });
        } else {
          this.setState({ successMsg: response.data.message });
          window.location.href = "/getCategories";
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
              <h3 class="text-primary">
                Category/Update Category/#{this.state.catename}
              </h3>
            </div>
            <form method="post" name="register" onSubmit={this.submitHandler}>
              <div class="float-right">
                <input
                  type="submit"
                  class="btn btn-primary mb-2"
                  onClick={this.cancelCourse}
                  value="Cancel"
                />
                &nbsp;&nbsp;{" "}
                <input
                  type="submit"
                  class="btn btn-primary mb-2"
                  value="Update"
                />
              </div>
              <br></br> <br></br> <br></br>
              <div class="row register-form createForm">
                <div class="col-md-6">
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control input-lg"
                      required
                      name="catename"
                      value={this.state.catename}
                      onChange={(e) => this.ChangeHandler(e)}
                      placeholder="Category Name*"
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control input-lg"
                      name="cateSKU"
                      value={this.state.cateSKU}
                      onChange={(e) => this.ChangeHandler(e)}
                      required
                      placeholder="SKU*"
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <input
                      type="text"
                      required
                      name="Tags"
                      value={this.state.Tags}
                      onChange={(e) => this.ChangeHandler(e)}
                      class="form-control input-lg"
                      placeholder="Tags"
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
export default editCategory;
