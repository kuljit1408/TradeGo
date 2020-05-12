import React, { Component } from "react";
import DashboardSidebar from "../../components/Dashboard/dashboardSidebar";
import { getUser } from "../Utils/common";
import { getToken } from "../Utils/common";
import { NavLink } from "react-router-dom";
import axios from "axios";

/* Get User and Token From Session */
const user = getUser();
const token = getToken();

class getCategory extends Component {
  //Set state values
  state = {
    CategoryList: [],
    cateName: "",
  };

  //Get all Supplier API
  componentDidMount() {
    let url = "";
    if (this.state.cateName) {
      url =
        `https://api-tradego.herokuapp.com/api/category/getcategories?CategoryName=` +
        this.state.cateName;
    } else {
      url = `https://api-tradego.herokuapp.com/api/category/getcategories`;
    }
    let initialCategory = [];
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
          initialCategory = response.data.data.map((category) => {
            return {
              id: category.CategoryId,
              categoryname: category.categoryname,
              tags: category.tags,
              Sku: category.SKU,
            };
          });
          this.setState({
            CategoryList: initialCategory,
          });
        } else {
          this.setState({
            CategoryList: [],
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
    console.log(user.CompanyId);
    e.preventDefault();
    this.componentDidMount();
  };
  reset = () => {
    this.setState({
      cateName: "",
    });
  };
  //Start render Function
  render() {
    function myFunction() {
      var x = document.getElementById("categoryFilter");
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
                <h3 class="text-primary">Categories</h3>
              </div>
              <div class="float-right">
                <NavLink to="/createCategory" className="btn btn-primary">
                  Create Category
                </NavLink>
              </div>
            </div>
            <br />
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
              <div id="categoryFilter" class="row register-form">
                <div class="col-md-6">
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control input-lg"
                      name="cateName"
                      value={this.state.cateName}
                      onChange={(e) => this.ChangeHandler(e)}
                      placeholder="Category Name"
                    />
                  </div>
                </div>
                <div class="col-md-6">
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
                    <th scope="col">Categogy Id</th>
                    <th scope="col">Category Name</th>
                    <th scope="col">SKU</th>
                    <th scope="col">Tags</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.CategoryList.map((category) => (
                    <tr>
                      <td>{category.id}</td>
                      <td>{category.categoryname}</td>
                      <td>{category.Sku}</td>
                      <td>{category.tags}</td>
                      <td>
                        <NavLink to={`/editCategory?categoryId=${category.id}`}>
                          <img
                            src="https://img.icons8.com/bubbles/50/000000/edit.png"
                            title="Update Category"
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

export default getCategory;
