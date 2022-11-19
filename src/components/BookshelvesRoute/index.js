import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsSearch, BsFillStarFill} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import Footer from '../Footer'
import Filters from '../Filters'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'INPROGRESS',
  failure: 'FAILURE',
}

const bookshelvesList = [
  {
    id: '22526c8e-680e-4419-a041-b05cc239ece4',
    value: 'ALL',
    label: 'All',
  },
  {
    id: '37e09397-fab2-46f4-9b9a-66b2324b2e22',
    value: 'READ',
    label: 'Read',
  },
  {
    id: '2ab42512-3d05-4fba-8191-5122175b154e',
    value: 'CURRENTLY_READING',
    label: 'Currently Reading',
  },
  {
    id: '361d5fd4-9ea1-4e0c-bd47-da2682a5b7c8',
    value: 'WANT_TO_READ',
    label: 'Want to Read',
  },
]

class BookshelvesRoute extends Component {
  state = {
    booksList: [],
    searchInput: '',
    bookshelfName: bookshelvesList[0].value,
    label: bookshelvesList[0].label,
    activeStatusId: bookshelvesList[0].id,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getBooksDetails()
  }

  getBooksDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {searchInput, bookshelfName} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/book-hub/books?shelf=${bookshelfName}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedData = data.books.map(book => ({
        id: book.id,
        title: book.title,
        readStatus: book.read_status,
        rating: book.rating,
        authorName: book.author_name,
        coverPic: book.cover_pic,
      }))
      console.log(updatedData)
      this.setState({
        booksList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderBooksList = () => {
    const {booksList} = this.state
    const emptyBooksList = booksList.length === 0
    return (
      <>
        <ul className="books-list-container">
          {emptyBooksList && this.renderNoBooksView()}
          {booksList.map(eachBook => {
            const {
              authorName,
              coverPic,
              title,
              rating,
              readStatus,
              id,
            } = eachBook
            return (
              <Link to={`/books/${id}`} className="bookList-item">
                <li className="bookList-item" key={id}>
                  <img src={coverPic} className="coverPic" alt={title} />
                  <div className="bookDetails-container">
                    <h1 className="book-title">{title}</h1>
                    <p className="book-authorName">{authorName}</p>
                    <div className="rating-container">
                      <p className="ratingHeading">Avg Rating</p>
                      <BsFillStarFill className="star-icon" />
                      <p className="rating">{rating}</p>
                    </div>
                    <div className="status-container">
                      <p className="statusHeading">Status :</p>
                      <p className="readStatus">{readStatus}</p>
                    </div>
                  </div>
                </li>
              </Link>
            )
          })}
        </ul>
      </>
    )
  }

  renderNoBooksView = () => {
    const {searchInput} = this.state
    return (
      <div className="noBooksView-container">
        <img
          src="https://res.cloudinary.com/dq1ktqbtb/image/upload/v1668777219/Asset_1_1_rkyftd.png"
          alt="no books"
          className="no-books-img"
        />
        <p className="noBooksView-description">
          Your search for {searchInput} did not find any matches.
        </p>
      </div>
    )
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchBtn = () => {
    this.getBooksDetails()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getBooksDetails()
    }
  }

  renderSearchSection = () => {
    const {searchInput} = this.state
    return (
      <div className="search-container">
        <input
          value={searchInput}
          type="search"
          className="search-input"
          placeholder="Search"
          onChange={this.onChangeSearchInput}
          onKeyDown={this.onEnterSearchInput}
        />
        <button
          className="search-button"
          type="button"
          testid="searchButton"
          onClick={this.onClickSearchBtn}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderBookShelvesList = () => {
    const {activeStatusId} = this.state
    return (
      <div className="bookshelves-left-navbar">
        <h1 className="left-navbar-heading">BookShelves</h1>
        <ul className="bookshelves-options">
          {bookshelvesList.map(eachItem => (
            <Filters
              filterBookDetails={eachItem}
              isActive={eachItem.id === activeStatusId}
              key={eachItem.id}
              getFilterBookDetails={this.getFilterBookDetails}
            />
          ))}
        </ul>
      </div>
    )
  }

  getFilterBookDetails = (value, label, id) => {
    this.setState(
      {
        bookshelfName: value,
        label,
        activeStatusId: id,
      },
      this.getBooksDetails,
    )
  }

  renderBookShelvesDisplaySection = () => {
    const {label} = this.state
    return (
      <div className="bookShelvesDisplay-container">
        <div className="heading-search-container">
          <h1 className="allBooks-heading">{label} Books</h1>
          {this.renderSearchSection()}
        </div>
        {this.renderBooksList()}
      </div>
    )
  }

  renderBooksShelvesSection = () => (
    <div className="bookShelves-responsive-container">
      {this.renderBookShelvesList()}
      {this.renderBookShelvesDisplaySection()}
    </div>
  )

  renderLoadingView = () => (
    <div className="loading-container" testid="loader">
      <Loader type="Puff" color="#0284C7" height={50} width={50} />
    </div>
  )

  renderTryAgain = () => {
    this.getBooksDetails()
  }

  renderFailureView = () => (
    <div className="failureView-container">
      <img
        src="https://res.cloudinary.com/dq1ktqbtb/image/upload/v1668774835/Group_7522_mcny6j.png"
        alt="failure view"
      />
      <p className="failure-description">
        Something went wrong, Please try again.
      </p>
      <button
        className="tryAgain-button"
        type="button"
        onClick={this.renderTryAgain}
      >
        Try Again
      </button>
    </div>
  )

  renderBookShelvesSectionViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderBooksShelvesSection()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="bookshelves-container">
          {this.renderBookShelvesSectionViews()}
        </div>
        <Footer />
      </>
    )
  }
}

export default BookshelvesRoute
