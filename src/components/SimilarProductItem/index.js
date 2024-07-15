// Write your code here
import './index.css'
const SimilarProductItem = props => {
  const {similarProduct} = props
  const {imageUrl, title, brand, price, rating} = similarProduct
  return (
    <li className="similar-product-card">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-image"
      />
      <div>
        <div>
          <h1 className="product-name">{title}</h1>
          <p>{`by ${brand}`}</p>
        </div>
        <div className="price-rating">
          <p>{`Rs ${price}/-`}</p>

          <div className="rating-container">
            <p>{rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="star-rating-image"
            />
          </div>
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
