// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'
import './index.css'

const apisStatus = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
  isProcess: 'IS_PROCESS',
}

class ProductItemDetails extends Component {
  state = {
    productsList: [],
    productsObject: {},
    count: 1,
    isStatus: apisStatus.initial,
  }

  componentDidMount() {
    this.getAPIFetch()
  }

  convertDataItems = data => ({
    id: data.id,
    imageUrl: data.image_url,
    title: data.title,
    brand: data.brand,
    totalReviews: data.total_reviews,
    description: data.description,
    rating: data.rating,
    availability: data.availability,
    price: data.price,
  })

  getAPIFetch = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const Token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    }

    this.setState({isStatus: apisStatus.isProcess})
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updateOne = this.convertDataItems(data)
      const updateSimilarData = data.similar_products.map(eachOne =>
        this.convertDataItems(eachOne),
      )
      this.setState({
        productsObject: updateOne,
        productsList: updateSimilarData,
        isStatus: apisStatus.success,
      })
    } else {
      this.setState({isStatus: apisStatus.failure})
    }
  }

  renderFailureView = () => (
    <div className="failureView">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error"
      />
      <h1 className="paraErr">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="btn-ship">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  onIncrement = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  onDecrement = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  getOneProductInCart = () => {
    const {productsObject, count} = this.state
    const {
      availability,
      brand,
      title,
      imageUrl,
      totalReviews,
      rating,
      price,
      description,
    } = productsObject
    return (
      <div className="section1">
        <img src={imageUrl} alt="product" className="product-image" />

        <div className="pro-container">
          <h1 className="proHead"> {title}</h1>
          <p className="proPara">Rs {price}/-</p>
          <div className="ratings-container">
            <div className="ratings">
              <p className="proRate">{rating}</p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="star"
              />
            </div>
            <p className="proDescription">{totalReviews} Reviews</p>
          </div>
          <p className="proDescription">{description}</p>
          <div className="ratings-container">
            <p className="proPara">Available:</p>
            <p className="pro">{availability}</p>
          </div>
          <div className="ratings-container">
            <p className="proPara">Brand:</p>
            <p className="pro">{brand}</p>
          </div>
          <hr className="line" />
          <div className="inc-dec-btn">
            <button
              type="button"
              className="btn-sub"
              onClick={this.onDecrement}
              testid="minus"
            >
              <BsDashSquare />
            </button>
            <p>{count}</p>
            <button
              type="button"
              className="btn-sub"
              onClick={this.onIncrement}
              testid="plus"
            >
              <BsPlusSquare />
            </button>
          </div>
          <button type="button" className="addToCart">
            ADD TO CART
          </button>
        </div>
      </div>
    )
  }

  renderLoader = () => (
    <div testid="loader" className="failureView">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderResults = () => {
    const {isStatus} = this.state
    switch (isStatus) {
      case apisStatus.success:
        return this.getOneProductInCart()
      case apisStatus.failure:
        return this.renderFailureView()
      case apisStatus.isProcess:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {productsList} = this.state
    return (
      <>
        <Header />
        <div>
          {this.renderResults()}
          <ul className="similar">
            {productsList.map(each => (
              <SimilarProductItem key={each.id} details={each} />
            ))}
          </ul>
        </div>
      </>
    )
  }
}
export default ProductItemDetails
