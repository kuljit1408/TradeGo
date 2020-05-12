import React, { Component } from "react";
import DashboardSidebar from "../../components/Dashboard/dashboardSidebar";

import axios from "axios";
import { getUser } from "../Utils/common";
import { getToken } from "../Utils/common";

/* Get User and Token From Session */
const user = getUser();
//debugger;
const token = getToken();

class updatePurchaseOrder extends Component {
  /*********************** */
  //Set State values
  state = {
    purchaseId: "",
    purchaseTotalOrder: "",
    SupplierId: "",
    quantity: "",
    totalprice: "",
    productName: "",
    productPurchasePrice: "",
    currency: "",
    purchaseProduct: "",
    purchaseSupplier: "",
    suppliersList: [],
    productSupplier: " ",
    discountrate: "",
    productList: [],
    errorMessage: "",
    successMsg: "",
    //do ethe khali//this .state.
  };

  /********************************* */
  //Fetch Country, Supplier and Category List
  componentDidMount() {
    let initialSuppliers = [];
    let initialProducts = [];
    const purchase_ord_Id = new URLSearchParams(this.props.location.search).get(
      "purchase_ord_Id"
    );

    //Supplier API
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
            };
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

    //Get Purchase order by id API
    axios({
      method: "GET",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/purchaseorder/getpurchaseorderbyid?CompanyId=${user.CompanyId}&PurchaseOrderId=${purchase_ord_Id}`,

      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (response.data.success == 1) {
          this.setState({
            SupplierId: response.data.data.purchaseOrder_details.SupplierId,
            purchaseTotalOrder:
              response.data.data.purchaseOrder_details.Purchase_order_Total,
            currency: response.data.data.purchaseOrder_details.Currency_Code,
            discountrate: response.data.data.purchaseOrder_details.DiscountRate,
            purchaseId:
              "#" + response.data.data.purchaseOrder_details.Purchase_OrderId,
          });
          initialProducts = response.data.data.products.map((product) => {
            return {
              ProductId: product.ProductId,
              PurchaseOrder_ProductId: product.PurchaseOrder_ProductId,
              productSku: product.SKU,
              productName: product.Product_name,
              productDesc: product.Description,
              productPrice: product.PurchasePrice,
              productQty: product.Quantity,
              productTotal: product.Total,
            };
          });
          this.setState({
            productList: initialProducts,
          });
        }
      })
      .catch((error) => {
        debugger;
        console.log("Error:" + error);
        this.setState({ errorMessage: error.response.data.message });
      });
  }

  //Get form values on change handler
  ChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  updateHandler = (index, newValue) => {
    if (newValue < 0) {
      alert("Quantity cannot be less than zero!");
      return;
    }

    const updatedArray = [...this.state.productList];
    updatedArray[index].productQty = newValue;
    updatedArray[index].productTotal =
      updatedArray[index].productQty * updatedArray[index].productPrice;
    let grandTotal = 0;
    for (var i = 0; i < updatedArray.length; i++) {
      grandTotal += updatedArray[i].productTotal;
    }
    this.setState({ purchaseTotalOrder: grandTotal });

    this.setState({
      productList: updatedArray,
    });
  };

  //on click of cancel

  cancelupdate = () => {
    window.location.href = "/getPurchaseOrders";
  };

  //Update product api
  submitHandler = (e) => {
    const purchase_ord_Id = new URLSearchParams(this.props.location.search).get(
      "purchase_ord_Id"
    );
    for (var i = 0; i < this.state.productList.length; i++) {
      if (this.state.productList[i].productQty === "") {
        alert("Product Quantity cannot be null");
        window.location.reload();
      }
      if (this.state.productList[i].productQty === "0") {
        alert("Product Quantity cannot be zero");
        window.location.reload();
      }
    }
    let updatedProductlist = this.state.productList.map((product) => {
      return {
        ProductId: product.ProductId,
        PurchaseOrder_ProductId: product.PurchaseOrder_ProductId,
        Quantity: product.productQty,
        Total: product.productTotal,
      };
    });

    e.preventDefault();
    axios({
      method: "PUT",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/purchaseorder/edit`,
      data: {
        purchase_ord_id: purchase_ord_Id,
        SupplierId: this.state.SupplierId,
        PurchaseOrderTotal: this.state.purchaseTotalOrder,
        products: updatedProductlist,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (response.data.success === 0) {
          this.setState({ errorMessage: response.data.message });
        } else {
          this.setState({ successMsg: response.data.message });
          window.location.href = "/getPurchaseOrders";
        }
      })
      .catch((error) => {
        //console.log("Error"+error);
        this.setState({ errorMessage: error.response.data.message });
      });
  };

  // Start Render Function
  render() {
    return (
      <div class="container-fluid pt-5 mt-3">
        <div class="row">
          <DashboardSidebar />
          <div class="col-md-9 ml-sm-auto col-lg-10 px-4">
            {" "}
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
                Purchase Orders/Update PurchaseOrder/{this.state.purchaseId}
              </h3>
            </div>
            <form
              method="post"
              name="register"
              id="SupplierForm"
              onSubmit={this.submitHandler}
            >
              <div class="float-right">
                <input
                  type="submit"
                  class="btn btn-primary mb-2"
                  onClick={this.cancelupdate}
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
              <div class="row register-form">
                <div class="col-md-6">
                  <div class="form-group">
                    <select
                      name="selectSupplier"
                      class="form-control"
                      required
                      value={this.state.SupplierId}
                      disabled
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
              <div class="form-group row">
                <div class="col-md-6">
                  <div class="form-group">
                    <div class="input-group-prepend">
                      <input
                        type="text"
                        class="form-control"
                        name="currency"
                        value={this.state.currency}
                        placeholder="Currency"
                        disabled
                      />
                    </div>
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
                        disabled
                      />
                      <div class="input-group-text">%</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <br />
                <br></br>
              </div>
              <div
                class="table-wrapper-scroll-y my-custom-scrollbar"
                style={{ height: "165px" }}
              >
                <table class="table table-bordered table-striped mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Product</th>
                      <th scope="col">Price</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.productList.map((product, index) => (
                      <tr>
                        <td>
                          <input
                            type="text"
                            value={product.productName}
                            placeholder="Product Name"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={product.productPrice}
                            placeholder="Price"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={product.productQty}
                            placeholder="Quantity"
                            onChange={(e) =>
                              this.updateHandler(index, e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={product.productTotal}
                            placeholder="Total"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div class="float-right">
                <label>
                  <b>Purchase Order Total :</b>
                </label>
                <label>{this.state.purchaseTotalOrder}</label>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
  // End Render Function
}

export default updatePurchaseOrder;
