import React, { Component } from 'react'
import { CardElement, injectStripe } from 'react-stripe-elements'
import DonationFrequency from './donationFrequency'
import Router from 'next/router'
import * as Api from '../api/api'
import '../static/styles/main.scss'

class DonateForm extends Component {
  constructor (props) {
    super(props)
    this.donate = this.donate.bind(this)
    this.state = {
      loading: false,
      redirectSuccess: false,
      firstName: '',
      lastName: '',
      amount: '',
      email: '',
      frequency: 'once',
      error: ''
    }
  }

  setLocalState = (state) => {
    if (!state.error) state.error = ''
    this.setState(state)
  }

  updateFirstName = (e) => {
    this.setLocalState({ firstName: e.target.value })
  }

  updateFrequency = (ev) => {
    this.setLocalState({ frequency: ev.target.value })
  }

  updateLastName = (e) => {
    this.setLocalState({ lastName: e.target.value })
  }

  updateEmail = (e) => {
    this.setLocalState({ email: e.target.value })
  }

  updateAmount = (e) => {
    this.setLocalState({ amount: `${e.target.value.includes('$') ? '' : '$'}${e.target.value}` })
  }

  donate = async (ev) => {
    ev.preventDefault()
    this.setLocalState({ loading: true })
    let token
    try {
      const res = await this.props.stripe.createToken()
      token = res.token
    } catch (e) {
      this.setState({ error: e.message, loading: false })
      return
    }

    if (!token) {
      this.setState({ error: 'Invalid CC info!', loading: false })
      return
    }
    try {
      const stripDollarSignAmount = parseInt(this.state.amount.replace('$', ''))
      const responseStream = await Api.donate({
        source: token,
        firstName: this.state.firstName,
        frequency: this.state.frequency,
        lastName: this.state.lastName,
        amount: stripDollarSignAmount,
        email: this.state.email
      })
      const response = await responseStream.json()
      if (response.ok) {
        this.setState({ redirectSuccess: true, loading: false })
      } else {
        this.setState({ error: `Donation failed: ${response.message}`, loading: false })
      }
    } catch (e) {
      this.setState({ error: e.message, loading: false })
    }
  }

  render () {
    const { redirectSuccess, loading } = this.state

    if (redirectSuccess) {
      Router.push('/success')
    }

    if (redirectSuccess) return (<div />)

    return (
      <form className='flex flex-column f4-m' onSubmit={this.donate}>
        <div className='error tf-lato tc'>
          <p className='red'>{this.state.error}</p>
        </div>

        <DonationFrequency updateFrequency={this.updateFrequency} frequency={this.state.frequency} />
        <input className='bn ba pa2 pa3-m ma1 ma2-m' placeholder='First name' value={this.state.firstName} onChange={this.updateFirstName} aria-label='First Name' />
        <input className='bn ba pa2 pa3-m ma1 ma2-m' placeholder='Last name' value={this.state.lastName} onChange={this.updateLastName} aria-label='Last Name' />
        <input className='bn ba pa2 pa3-m ma1 ma2-m' placeholder='Email' value={this.state.email} onChange={this.updateEmail} aria-label='Email' />
        <input className='bn ba pa2 pa3-m ma1 ma2-m' placeholder='$ Amount' value={this.state.amount} onChange={this.updateAmount} aria-label='Amount' />
        <div className='bg-white bn ba pa2 ma1 mb3-m'>
          <CardElement />
        </div>
        { loading && <h2 className='tc tf-lato'>Loading...</h2>}
        <button type='submit' className='white bg-tf-teal tf-lato b tc pa2 ma3 mt4-m br-pill ttu w-75-m m-auto'>Donate</button>
      </form>
    )
  }
}

export default injectStripe(DonateForm)
