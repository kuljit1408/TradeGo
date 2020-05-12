import React, { Component } from "react";
import DashboardSidebar from "../../components/Dashboard/dashboardSidebar";
import axios from "axios";
import { getUser } from "../Utils/common";
import { getToken } from "../Utils/common";

/* Get User and Token From Session */
const user = getUser();
const token = getToken();

class createProduct extends Component {
  //Set State values
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
    countries: [],
    categoriesList: [],
    suppliersList: [],
  };

  selectImages = (event) => {
    this.setState({ productImg: event.target.files[0] });
  };
  //Fetch Country, Supplier and Category List
  componentDidMount() {
    let initialCountries = [];
    let initialSuppliers = [];
    let initialCategories = [];

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
        //console.log(response.data.success);
        if (response.data.success == 1) {
          initialCategories = response.data.data.map((category) => {
            return {
              id: category.CategoryId,
              categoryname: category.categoryname,
            };
          });
          this.setState({
            categoriesList: [
              { id: "", categoryname: "Please select catgeory" },
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
  }

  //Reset Button functionality
  cancelCourse = () => {
    this.setState({
      productName: "",
      productSKU: "",
      productDesc: "",
      productPurchasePrice: "",
      productRetailPrice: "",
      productCat: "",
      productCountry: "",
      productImg: "",
      productSupplier: "",
      productBarcode: "",
      errorMessage: "",
      successMsg: "",
      countries: [],
      categories: [],
      suppliers: [],
    });
  };

  //Get form values on change handler
  ChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  //Create product api
  submitHandler = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("Product_name", this.state.productName);
    data.append("Description", this.state.productDesc);
    data.append("SKU", this.state.productSKU);
    data.append("PurchasePrice", this.state.productPurchasePrice);
    data.append("RetailPrice", this.state.productRetailPrice);
    data.append("CategoryId", this.state.productCat);
    data.append("Country_Origin_id", this.state.productCountry);
    data.append("Image", this.state.productImg);
    data.append("SupplierId", this.state.productSupplier);
    data.append("Barcode", this.state.productBarcode);
    data.append("Qty_minimum_required", this.state.productQuantity);
    data.append("CompanyId", user.CompanyId);
    axios({
      method: "POST",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/product/createproduct`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: data,
    })
      .then((response) => {
        console.log("Response" + response.data);
        if (response.data.success === 0) {
          this.setState({ errorMessage: response.data.message });
        } else {
          this.setState({ successMsg: response.data.message });
          window.location.href = "/getProducts";
        }
      })
      .catch((error) => {
        console.log("Error" + error);
        this.setState({ errorMessage: error.response.data.message });
      });
  };
  cancel = () => {
    this.setState({
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
    });
  };
  //Start Render Function
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
              <h3 class="text-primary">Product/Create Product</h3>
            </div>
            <form method="post" name="register" onSubmit={this.submitHandler}>
              <div class="float-right">
                <input
                  type="reset"
                  class="btn btn-primary mb-2"
                  onClick={this.cancel}
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
                      placeholder="Product Description*"
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
                        Product Image*
                      </span>
                    </div>
                    <div class="custom-file">
                      <input
                        type="file"
                        class="custom-file-input"
                        required
                        onChange={this.selectImages}
                      />
                      <label class="custom-file-label" for="inputGroupFile01">
                        {this.state.productImg.name}
                      </label>
                    </div>
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
  //End Render Function
}

export default createProduct;
