import {Component} from 'react'
import Slider from 'react-slick'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

import Header from '../Header'
import Footer from '../Footer'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'INPROGRESS',
  failure: 'FAILURE',
}

class HomeRoute extends Component {
  state = {booksList: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getBooksDetails()
  }

  getBooksDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const getBooksUrl = 'https://apis.ccbp.in/book-hub/top-rated-books'

    const response = await fetch(getBooksUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedData = data.books.map(book => ({
        id: book.id,
        title: book.title,
        authorName: book.author_name,
        coverPic: book.cover_pic,
      }))
      this.setState({
        booksList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSlider = () => {
    const {booksList} = this.state
    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
      ],
    }
    return (
      <div className="slick-container">
        <Slider {...settings}>
          {booksList.map(eachBook => {
            const {id, authorName, coverPic, title} = eachBook
            return (
              <Link to={`/books/${id}`} className="slick-item">
                <li className="slick-item" key={id}>
                  <img className="cover-pic" src={coverPic} alt="title" />
                  <h1 className="title">{title}</h1>
                  <p className="authorName">{authorName}</p>
                </li>
              </Link>
            )
          })}
        </Slider>
      </div>
    )
  }

  onClickTryAgain = () => {
    this.getBooksDetails()
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="Puff" color="#0284C7" height={50} width={50} />
    </div>
  )

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
        onClick={this.onClickTryAgain}
      >
        Try Again
      </button>
    </div>
  )

  renderBooksSectionViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSlider()
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
      <div>
        <Header />
        <div className="home-container">
          <div className="responsive-home">
            <h1 className="home-heading">Find Your Next Favorite Books?</h1>
            <p className="home-description">
              You are in the right place. Tell us what titles or genres you have
              enjoyed in the past, and we will give you surprisingly insightful
              recommendations.
            </p>
            <Link to="/shelf">
              <button className="findBooksMobile-button" type="button">
                Find Books
              </button>
            </Link>
          </div>
          <div className="books-container">
            <div className="heading-and-button-container">
              <h1 className="container-heading">Top Rated Books</h1>
              <Link to="/shelf">
                <button className="findBooks-button" type="button">
                  Find Books
                </button>
              </Link>
            </div>
            {this.renderBooksSectionViews()}
          </div>
          <Footer />
        </div>
      </div>
    )
  }
}

export default HomeRoute
