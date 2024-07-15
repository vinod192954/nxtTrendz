import {Component} from 'react'

import {BsPlusSquare} from 'react-icons/bs'

import {BsDashSquare} from 'react-icons/bs'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import {Link} from 'react-router-dom'

import SimilarProductItem from '../SimilarProductItem'

import Header from '../Header'

import './index.css'

const productItemApiStatusConsonants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    productItem: '',
    similarProductsList: [],
    quantity: 1,
    apiStatus: productItemApiStatusConsonants.initial,
  }

  componentDidMount() {
    this.getDetiledProduct()
  }

  getDetiledProduct = async () => {
    this.setState({apiStatus: productItemApiStatusConsonants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = ` https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.setState({apiStatus: productItemApiStatusConsonants.success})
    } else if (response.ok === false) {
      this.setState({apiStatus: productItemApiStatusConsonants.failure})
    }
    const updatedData = {
      availability: data.availability,
      brand: data.brand,
      description: data.description,
      id: data.id,
      imageUrl: data.image_url,
      price: data.price,
      rating: data.rating,
      similarProducts: data.similar_products,
      style: data.style,
      title: data.title,
      totalReviews: data.total_reviews,
    }
    console.log(updatedData)
    const {similarProducts} = updatedData

    const updatedSimilarProducts = similarProducts.map(eachProduct => ({
      availability: eachProduct.availability,
      brand: eachProduct.brand,
      description: eachProduct.description,
      id: eachProduct.id,
      imageUrl: eachProduct.image_url,
      price: eachProduct.price,
      rating: eachProduct.rating,
      style: eachProduct.style,
      title: eachProduct.title,
      totalReviews: eachProduct.total_reviews,
    }))
    this.setState({
      productItem: updatedData,
      similarProductsList: updatedSimilarProducts,
    })
  }

  onDecrementQuantity = () => {
    const {quantity} = this.state
    if (quantity > 0) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onIncrementQuantity = () => {
    const {quantity} = this.state
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  getProductItemDetails = () => {
    const {productItem, quantity, similarProductsList} = this.state

    const {
      availability,
      brand,
      title,
      price,
      rating,
      totalReviews,
      description,
      imageUrl,
    } = productItem
    return (
      <div>
        <div className="detailed-section">
          <div>
            <img src={imageUrl} alt="product" className="product-image" />
          </div>
          <div>
            <h1>{title}</h1>
            <p>{`Rs ${price}/-`}</p>
            <div>
              <div className="review-container">
                <button type="button" className="rating-button">
                  <p className="rating">{rating}</p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="star-custom"
                  />
                </button>
                <p>{`${totalReviews} Reviews`}</p>
              </div>
              <p>{description}</p>
              <p>{`Available: ${availability}`}</p>
              <p>{`Brand: ${brand}`}</p>
              <hr />
              <div className="count-buttons">
                <button
                  type="button"
                  className="minus-btn"
                  data-testid="minus"
                  onClick={this.onDecrementQuantity}
                >
                  <BsDashSquare />
                </button>
                <p>{quantity}</p>
                <button
                  type="button"
                  className="plus-button"
                  onClick={this.onIncrementQuantity}
                  data-testid="plus"
                >
                  <BsPlusSquare />
                </button>
              </div>
              <button type="button" className="cart-button">
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
        <h1 className="heading">Similar Products</h1>
        <ul className="similar-product-list">
          {similarProductsList.map(eachProduct => (
            <SimilarProductItem
              similarProduct={eachProduct}
              key={eachProduct.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderLoaderView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="continue-button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderSuccessView = () => {
    return <div>{this.getProductItemDetails()}</div>
  }

  renderProductsDetailsView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case productItemApiStatusConsonants.success:
        return this.renderSuccessView()
      case productItemApiStatusConsonants.failure:
        return this.renderFailureView()
      case productItemApiStatusConsonants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderProductsDetailsView()}
      </div>
    )
  }
}

export default ProductItemDetails
