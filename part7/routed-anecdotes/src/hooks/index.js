import { useState } from 'react'

export const useField = (type) => {
    const [value, setValue] = useState('')
  
    const onChange = (event) => {
      setValue(event.target.value)
    }

  
    return { 
      type,
      value,
      onChange,
    }
  }


  export const resetFields = () => {

      const onChange = (event) => {
        console.log('eventti', event)
        event.preventDefault()
        event.setValue('')
      }

      return {
          onChange
      }
  }