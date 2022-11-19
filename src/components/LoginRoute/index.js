import {Component} from 'react'
import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

class LoginRoute extends Component {
  state = {username: '', password: '', errMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitForm = async event => {
    event.preventDefault()

    const {username, password} = this.state
    const userDetails = {username, password}

    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.setState({errMsg: data.error_msg})
    }
  }

  renderPassword = () => {
    const {password, showPassword} = this.state
    const passwordType = showPassword ? 'text ' : 'password'

    return (
      <>
        <label htmlFor="password" className="label">
          Password*
        </label>
        <input
          type={passwordType}
          id="password"
          value={password}
          className="input"
          placeholder="Password"
          onChange={this.onChangePassword}
        />
      </>
    )
  }

  onClickShowPassword = event => {
    this.setState({showPassword: event.target.checked})
  }

  render() {
    const {username, errMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="app-container">
        <div className="image-container">
          <img
            src="https://res.cloudinary.com/dq1ktqbtb/image/upload/v1668503294/Rectangle_1467_xopszv.jpg"
            className="LoginImageDesktop"
            alt="website login"
          />
        </div>
        <div className="login-container">
          <img
            src="https://res.cloudinary.com/dq1ktqbtb/image/upload/v1668522135/Ellipse_99_ukjnyz.png"
            className="LoginImageMobile"
            alt="website login"
          />
          <img
            src="https://res.cloudinary.com/dq1ktqbtb/image/upload/v1668503427/Group_7731_vgjmxi.png"
            alt="login website logo"
            className="logo-image"
          />
          <form className="form-container" onSubmit={this.onSubmitForm}>
            <div className="input-container">
              <label className="label" htmlFor="username">
                Username*
              </label>
              <input
                type="text"
                className="input"
                id="username"
                placeholder="Username"
                value={username}
                onChange={this.onChangeUsername}
              />
            </div>
            <div className="input-container">{this.renderPassword()}</div>
            <div className="input-container">
              <div className="checkbox-container">
                <input
                  type="checkBox"
                  className="checkbox"
                  id="checkBox"
                  onClick={this.onClickShowPassword}
                />
                <label htmlFor="checkBox" className="label checkboxLabel">
                  Show password
                </label>
              </div>
            </div>
            <button className="login-button" type="submit">
              Login
            </button>
            <p className="err-msg">{errMsg}</p>
          </form>
        </div>
      </div>
    )
  }
}

export default LoginRoute
