import React, { Component } from "react";
import DashboardSidebar from "../../components/Dashboard/dashboardSidebar";

import axios from "axios";
import { getUser } from "../Utils/common";
import { getToken } from "../Utils/common";

/* Get User and Token From Session */
const user = getUser();
const token = getToken();

class createPurchaseOrder extends Component {
  /*********************** */
  //Set State values
  state = {
    suppliersList: [],
    productSupplier: "",
    discountrate: "",
    supplierId: "",
    productName: "",
    id: "",
    productsList: [],
    proprice: "",
    total: "",
    PurchaseOrderPrice: "",
    currency: "",
    productId: "",
    price: "",
    qty: "",
    Totalp: "",
    product: [],
    name: "",
    shareholders: [{ name: "" }],
    //do ethe khali//this .state.
  };

  handleAddShareholder = () => {
    this.setState({
      shareholders: this.state.shareholders.concat([{ name: "" }]),
    });
  };

  handleRemoveShareholder = (idx) => () => {
    this.setState({
      shareholders: this.state.shareholders.filter((s, sidx) => idx !== sidx),
    });
  };

  /********************************* */
  handleChange = this.handleChange.bind(this);
  handleChangeproduct = this.handleChangeproduct.bind(this);
  showqty = this.showqty.bind(this);

  componentDidMount() {
    let initialProducts = [];
    console.log(token);
    let initialSuppliers = [];

    //Get all Supplier API
    axios({
      method: "POST",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/supplier/getsuppliers`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: {
        CompanyId: user.CompanyId,
      },
    })
      .then((response) => {
        console.log(response.data.success);
        if (response.data.success == 1) {
          initialSuppliers = response.data.data.map((supplier) => {
            return {
              id: supplier.SupplierId,
              suppliername: supplier.SupplierName,
            }; //do hor//get supplier di api oda oh get
          });
          this.setState({
            suppliersList: [
              { id: "", suppliername: "Please select supplier" },
            ].concat(initialSuppliers),
          });
        } else {
          this.setState({
            suppliersList: [],
          });
        }
      })
      .catch((error) => {
        console.log("Error:" + error);
        this.setState({ errorMessage: error.response });
      });

    //Get all Products API
    axios({
      method: "POST",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/product/getproducts`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: {
        CompanyId: user.CompanyId,
      },
    })
      .then((response) => {
        //console.log(response.data.data);
        //console.log(response.data.success);
        if (response.data.success == 1) {
          initialProducts = response.data.data.map((product) => {
            return { id: product.ProductId, productName: product.ProductName };
          });
          this.setState({
            productsList: initialProducts,
          });
        } else {
          this.setState({
            productsList: [],
          });
        }
      })
      .catch((error) => {
        console.log("Error:" + error);
        this.setState({ errorMessage: error.response.data.message });
      });
  }

  //Product onChange function
  handleChangeproduct(event) {
    console.log("Helloproductid");
    console.log(event.target.value);
    this.setState({
      productId: event.target.value,
      errorMessage:
        event.target.value === "" ? "You must select your product" : "",
    });

    axios({
      method: "GET",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/product/getproductbyId?ProductId=${event.target.value}&CompanyId=${user.CompanyId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (response.data.success == 1) {
          this.setState({
            id: response.data.data[0].ProductId,
            productName: response.data.data[0].ProductName,
            proprice: response.data.data[0].PurchasePrice,
          });
        } else {
          this.setState({
            product: [],
          });
        }
      })
      .catch((error) => {
        console.log("Error:" + error.response);
        this.setState({ errorMessage: error.response });
      });
  }

  //Supplier onChange function
  handleChange(event) {
    console.log(event.target.value);
    this.setState({
      supplierId: event.target.value,
      errorMessage:
        event.target.value === "" ? "You must select your Supplier" : "",
    });

    axios({
      method: "GET",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/supplier/getsupplierbyId?SupplierId=${event.target.value}&CompanyId=${user.CompanyId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (response.data.success == 1) {
          this.setState({
            discountrate: response.data.data[0].DiscountRate,
            currency: response.data.data[0].Currency_Code,
          });
        } else {
          this.setState({
            supplier: [],
          });
        }
      })
      .catch((error) => {
        console.log("Error:" + error.response);
        this.setState({ errorMessage: error.response });
      });

    //GetAll Products By Supplier id
    let initialProducts = [];
    axios({
      method: "POST",
      responseType: "json",
      url:
        `https://api-tradego.herokuapp.com/api/product/getproducts?SupplierId=` +
        event.target.value,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: {
        CompanyId: user.CompanyId,
      },
    })
      .then((response) => {
        if (response.data.success == 1) {
          initialProducts = response.data.data.map((product) => {
            return { id: product.ProductId, productName: product.ProductName };
          });
          this.setState({
            productsList: initialProducts,
          });
        } else {
          this.setState({
            productsList: [],
          });
        }
      })
      .catch((error) => {
        console.log("Error:" + error);
        //this.setState({errorMessage: error.response.data.message});
      });
  }

  //Get total price
  showqty(event, target) {
    const qty = this.state.qty;
    console.log("qty.." + event.target.value);
    const price = this.state.proprice;
    console.log("price.." + this.state.proprice);
    // const total =  this.state.qty * this.state.proprice ;
    const total1 = event.target.value * this.state.proprice;
    console.log("total is .." + total1);
    //console.log("total is.."+ this.setState({total}))
    this.setState({
      total: total1,
      qty: event.target.value,
    });
  }
  /************************************ */

  //Create purchase order api
  submitHandler = (e) => {
    console.log("submithandler_hello");
    console.log(this.state);
    e.preventDefault();
    axios({
      method: "POST",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/purchaseorder/create`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: {
        SupplierId: this.state.supplierId,
        CurrencyId: 1,
        DiscountRate: this.state.discountrate,
        PurchaseOrderTotal: this.state.total,
        products: [
          {
            ProductId: this.state.productId,
            Price: this.state.proprice,
            Quantity: this.state.qty,
            Total: this.state.total,
          },
        ],
      },
    })
      .then((response) => {
        console.log("Response" + response.data.data);
        if (response.data.success === 0) {
          this.setState({ errorMessage: response.data.message });
        } else {
          this.setState({ successMsg: response.data.message });
          window.location.href = "/getPurchaseOrders";
        }
      })
      .catch((error) => {
        console.log("Error" + error);
        this.setState({ errorMessage: error.response.data.message });
      });
    //<button class="btn btn-primary float-right" type="button"onClick={this.handleAddShareholder}>Add Product</button>
  };
  /********************************/

  // Start Render Function
  render() {
    return (
      <div class="container-fluid pt-5 mt-3">
        <div class="row">
          <DashboardSidebar />
          <div class="col-md-9 ml-sm-auto col-lg-10 px-4">
            <div class="float-left">
              <h3 class="text-primary topheading">Create Purchase Order</h3>
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
                  value="Cancel"
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
                    <select
                      name="supplierId"
                      class="form-control"
                      required
                      value={this.state.supplierId}
                      onChange={this.handleChange}
                    >
                      {this.state.suppliersList.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.suppliername}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control"
                      name="currency"
                      value={this.state.currency}
                      placeholder="Currency"
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <div class="input-group-prepend">
                      <input
                        type="text"
                        class="form-control"
                        name="discountrate"
                        value={this.state.discountrate}
                        placeholder="Discount Rate"
                      />
                      <div class="input-group-text">%</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="table-wrapper-scroll-y my-custom-scrollbar">
                <table class="table table-bordered table-striped mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Product</th>
                      <th scope="col">Price</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Total</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.shareholders.map((shareholder, idx) => (
                      <tr>
                        <td>
                          <select
                            name="supplierId"
                            class="form-control"
                            required
                            value={this.state.productId}
                            onChange={this.handleChangeproduct}
                          >
                            {this.state.productsList.map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.productName}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            name="proprice"
                            value={this.state.proprice}
                            placeholder="Price"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="qty"
                            onChange={this.showqty}
                            placeholder="Quantity"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={this.state.total}
                            placeholder="Total"
                          />
                        </td>
                        <td>
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={this.handleRemoveShareholder(idx)}
                            >
                              -
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <br />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
  // End Render Function
}

export default createPurchaseOrder;
