import React from 'react'

const DonationFrequency = ({ updateFrequency, frequency }) => (
  <div className='flex flex-row tf-lato justify-between ma1' role='radiogroup' aria-labelledby='donate-freq'>
    <span id='donate-freq' className='sr-only--text'>Donation Frequency</span>
    <label className={`w-100 h2 tc mt1 bn ba b--black ttu pointer flex flex-column justify-center ${frequency === 'once' ? 'bg-tf-yellow tf-dark-gray' : 'tf-dark-gray bg-white pointer'}`}>
      <input className='sr-only--input' type='radio' name='frequency' value='once' onInput={updateFrequency} />
      Give Once
    </label>
    <label className={`w-100 h2 tc mt1 bn ba b--black ttu pointer flex flex-column justify-center ${frequency === 'monthly' ? 'bg-tf-yellow tf-dark-gray' : 'tf-dark-gray bg-white pointer'}`}>
      <input className='sr-only--input' type='radio' name='frequency' value='monthly' onInput={updateFrequency} />
      Monthly
    </label>
  </div>
)

export default DonationFrequency
