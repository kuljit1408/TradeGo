import React, { Component } from "react";
import DashboardSidebar from "../../components/Dashboard/dashboardSidebar";
import { getUser } from "../Utils/common";
import { getToken } from "../Utils/common";
import DatePicker from "react-datepicker";
import moment from "moment";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

/* Get User and Token From Session */
const user = getUser();
const token = getToken();

class salesOrder extends Component {
  //Set state values
  state = {
    salesOrderList: [],
    filterOrderId: "",
    filterDate: "",
    errorMessage: "",
    successMsg: "",
  };

  //Get all salesOrder API
  componentDidMount() {
    let initialSalesOrders = [];
    let url = "";
    if (this.state.filterOrderId && !this.state.filterDate) {
      url =
        `https://api-tradego.herokuapp.com/api/sales/getsales?CustomerOrderId=` +
        this.state.filterOrderId;
    } else if (this.state.filterDate && !this.state.filterOrderId) {
      url =
        `https://api-tradego.herokuapp.com/api/sales/getsales?Date=` +
        moment(this.state.filterDate).format("YYYY-MM-DD");
    } else if (this.state.filterOrderId && this.state.filterDate) {
      url =
        `https://api-tradego.herokuapp.com/api/sales/getsales?CustomerOrderId=` +
        this.state.filterOrderId +
        "&&Date=" +
        moment(this.state.filterDate).format("YYYY-MM-DD");
    } else {
      url = `https://api-tradego.herokuapp.com/api/sales/getsales`;
    }
    axios({
      method: "POST",
      responseType: "json",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: {
        companyid: user.CompanyId,
      },
    })
      .then((response) => {
        //console.log(response.data.success);
        if (response.data.success == 1) {
          initialSalesOrders = response.data.data.map((order) => {
            return {
              id: order.CustomerOrderId,
              customerName: order.Fname,
              purchasedDate: order.Date,
              totalUnits: order.SumofQuantity,
              totalPrice: order.Total,
            };
          });
          this.setState({
            salesOrderList: initialSalesOrders,
          });
        } else {
          this.setState({
            salesOrderList: [],
          });
        }
      })
      .catch((error) => {
        //console.log("Error:"+ error)
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
      filterOrderId: "",
      filterDate: "",
    });
  };

  handleChange = (date) => {
    this.setState({
      filterDate: date,
    });
  };

  //Start render Function
  render() {
    function myFunction() {
      var x = document.getElementById("salesFilter");
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
                <h3 class="text-primary">Sales Orders</h3>
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
              <div id="salesFilter" class="row register-form">
                <div class="col-md-3">
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control input-lg"
                      name="filterOrderId"
                      value={this.state.filterOrderId}
                      onChange={(e) => this.ChangeHandler(e)}
                      placeholder="Sales Order #"
                    />
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group">
                    <DatePicker
                      selected={this.state.filterDate}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select purchase Date"
                      onChange={this.handleChange}
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
            {this.state.successMsg && (
              <p className="alert alert alert-success">
                {" "}
                {this.state.successMsg}
              </p>
            )}
            <div class="table-wrapper-scroll-y my-custom-scrollbar">
              <table class="table table-bordered table-striped mb-0">
                <thead>
                  <tr>
                    <th scope="col">Sales Order Id</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Purchased Date</th>
                    <th scope="col">Total Units</th>
                    <th scope="col">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.salesOrderList.map((order) => (
                    <tr>
                      <td>{order.id}</td>
                      <td>{order.customerName}</td>
                      <td>{order.purchasedDate}</td>
                      <td>{order.totalUnits}</td>
                      <td>${order.totalPrice}</td>
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
}
//End render Function

export default salesOrder;
