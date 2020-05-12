import React, { Component } from "react";
import DashboardSidebar from "../../components/Dashboard/dashboardSidebar";
import axios from "axios";
import { getUser } from "../Utils/common";
import { getToken } from "../Utils/common";

/* Get User and Token From Session */
const user = getUser();
const token = getToken();

class updateProduct extends Component {
  //Set the update product state values
  state = {
    productName: "",
    productSKU: "",
    productDesc: "",
    productPurchasePrice: "",
    productRetailPrice: "",
    productCat: "",
    productCountry: "",
    productImg: "",
    productSupplier: "",
    productQuantity: "50",
    productBarcode: "",
    errorMessage: "",
    successMsg: "",
    showProductImage: "",
    countries: [],
    categoriesList: [],
    suppliersList: [],
  };
  selectImages = (event) => {
    this.setState({ productImg: event.target.files[0] });
  };
  //Fetch Country, supplier and category List and get product by id api
  componentDidMount() {
    //Declare variable for country,supplier and category array and get product id from url
    let initialCountries = [];
    let initialSuppliers = [];
    let initialCategories = [];
    const productId = new URLSearchParams(this.props.location.search).get(
      "productId"
    );

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
              { value: "", display: "Please select supplier" },
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
        this.setState({ errorMessage: error.response.data.message });
      });

    //Catgeory API
    axios({
      method: "POST",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/category/getcategories`,
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
          initialCategories = response.data.data.map((category) => {
            return {
              id: category.CategoryId,
              categoryname: category.categoryname,
            };
          });
          this.setState({
            categoriesList: [
              { value: "", display: "Please select catgeory" },
            ].concat(initialCategories),
          });
        } else {
          this.setState({
            categoriesList: [],
          });
        }
      })
      .catch((error) => {
        console.log("Error:" + error);
        this.setState({ errorMessage: error.response.data.message });
      });

    //Get Product by id API
    axios({
      method: "GET",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/product/getproductbyId?ProductId=${productId}&CompanyId=${user.CompanyId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (response.data.success == 1) {
          console.log(response.data.data[0]);
          this.setState({
            productName: response.data.data[0].ProductName,
            productSKU: response.data.data[0].SKU,
            productDesc: response.data.data[0].Description,
            productPurchasePrice: response.data.data[0].PurchasePrice,
            productRetailPrice: response.data.data[0].RetailPrice,
            productCat: response.data.data[0].CategoryId,
            productCountry: response.data.data[0].Country_Origin_id,
            showProductImage: response.data.data[0].Image,
            productSupplier: response.data.data[0].SupplierId,
            productQuantity: response.data.data[0].Qty_minimum_required,
            productBarcode: response.data.data[0].Barcode,
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
    window.location.href = "/getProducts";
  };

  //Get form values on change handler
  ChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  //Update product api
  submitHandler = (e) => {
    const productId = new URLSearchParams(this.props.location.search).get(
      "productId"
    );
    const data = new FormData();
    data.append("ProductId", productId);
    data.append("ProductName", this.state.productName);
    data.append("Description", this.state.productDesc);
    data.append("SKU", this.state.productSKU);
    data.append("PurchasePrice", this.state.productPurchasePrice);
    data.append("RetailPrice", this.state.productRetailPrice);
    data.append("CategoryId", this.state.productCat);
    data.append("Country_Origin_id", this.state.productCountry);
    data.append("Image", this.state.productImg ? this.state.productImg : "");
    data.append("SupplierId", this.state.productSupplier);
    data.append("Barcode", this.state.productBarcode);
    data.append("QtyMinRequired", this.state.productQuantity);
    data.append("CompanyId", user.CompanyId);
    e.preventDefault();
    axios({
      method: "PUT",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/product/editproduct`,
      data,
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
          window.location.href = "/getProducts";
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
                Product/Update Product/#{this.state.productName}
              </h3>
            </div>
            <form method="post" name="register" onSubmit={this.submitHandler}>
              <div class="float-right">
                <input
                  type="submit"
                  onClick={this.cancelCourse}
                  class="btn btn-primary mb-2"
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
                      class="form-control"
                      required
                      name="productName"
                      value={this.state.productName}
                      onChange={(e) => this.ChangeHandler(e)}
                      pattern="[a-zA-Z][a-zA-Z ]{2,}"
                      placeholder="Product Name*"
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control"
                      required
                      name="productSKU"
                      value={this.state.productSKU}
                      onChange={(e) => this.ChangeHandler(e)}
                      placeholder="SKU*"
                    />
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="form-group">
                    <textarea
                      class="form-control"
                      name="productDesc"
                      rows="3"
                      value={this.state.productDesc}
                      onChange={(e) => this.ChangeHandler(e)}
                      required
                    >
                      Product Description
                    </textarea>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group mb-2">
                    <input
                      type="text"
                      class="form-control"
                      required
                      name="productPurchasePrice"
                      value={this.state.productPurchasePrice}
                      onChange={(e) => this.ChangeHandler(e)}
                      placeholder="Purchase price*"
                    />
                    <div class="input-group-prepend">
                      <div class="input-group-text">CAD</div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group mb-2">
                    <input
                      type="text"
                      class="form-control"
                      name="productRetailPrice"
                      required
                      value={this.state.productRetailPrice}
                      onChange={(e) => this.ChangeHandler(e)}
                      placeholder="Retail price*"
                    />
                    <div class="input-group-prepend">
                      <div class="input-group-text">CAD</div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <select
                      name="productCat"
                      class="form-control"
                      required
                      value={this.state.productCat}
                      onChange={(e) =>
                        this.setState({
                          productCat: e.target.value,
                          errorMessage:
                            e.target.value === ""
                              ? "You must select category"
                              : "",
                        })
                      }
                    >
                      {this.state.categoriesList.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.categoryname}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <select
                      name="productCountry"
                      class="form-control"
                      required
                      value={this.state.productCountry}
                      onChange={(e) =>
                        this.setState({
                          productCountry: e.target.value,
                          errorMessage:
                            e.target.value === ""
                              ? "You must select country"
                              : "",
                        })
                      }
                    >
                      {this.state.countries.map((country) => (
                        <option key={country.value} value={country.value}>
                          {country.display}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span
                        class="input-group-text logoStyle"
                        id="inputGroupFileAddon01"
                      >
                        Product Image
                      </span>
                    </div>
                    <div class="custom-file">
                      <input
                        type="file"
                        class="custom-file-input"
                        onChange={this.selectImages}
                      />
                      <label class="custom-file-label" for="inputGroupFile01">
                        {this.state.productImg.name}
                      </label>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <img
                      class="productImage"
                      src={this.state.showProductImage}
                      alt="Product Image"
                    />
                  </div>
                  <br />
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <select
                      name="productSupplier"
                      class="form-control"
                      required
                      value={this.state.productSupplier}
                      onChange={(e) =>
                        this.setState({
                          productSupplier: e.target.value,
                          errorMessage:
                            e.target.value === ""
                              ? "You must select supplier"
                              : "",
                        })
                      }
                    >
                      {this.state.suppliersList.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.suppliername}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <input
                      type="text"
                      name="productBarcode"
                      value={this.state.productBarcode}
                      onChange={(e) => this.ChangeHandler(e)}
                      disabled
                      class="form-control"
                      required
                      placeholder="Bar Code"
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
export default updateProduct;
