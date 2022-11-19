import './index.css'

const Filters = props => {
  const {filterBookDetails, getFilterBookDetails, isActive} = props
  const {id, label, value} = filterBookDetails
  const selectStatus = isActive && 'selected-status'

  const onClickReadStatus = () => {
    getFilterBookDetails(value, label, id)
  }

  return (
    <li className="left-navbar-items">
      <button
        className={`list-item-btn ${selectStatus}`}
        type="button"
        onClick={onClickReadStatus}
      >
        {label}
      </button>
    </li>
  )
}
export default Filters
