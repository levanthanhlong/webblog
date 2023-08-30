import React, { useEffect, useState } from 'react'
import axios from '../../../../services/axios'
import { useDispatch } from 'react-redux'
import { userActions } from '../../../../store/reducers/userReducers'
import { useNavigate } from 'react-router-dom'

const NewPost = () => {
   const [data, setData] = useState(null)
   const [loading, setLoading] = useState(true)
   const dispatch = useDispatch()
   const navigate = useNavigate()

   useEffect(() => {
      axios
         .post('/api/users/profile/google', { email: 'hoangnvdk1@gmail.com' })
         .then((response) => {
            setData(response.data)
            dispatch(userActions.setUserInfo(response.data))
            setLoading(false)
            navigate('/')
         })
         .catch((error) => {
            console.error('Error fetching data:', error.message)
            setLoading(false)
         })
   }, [])

   if (loading) {
      return <div>Loading...</div>
   }

   return (
      <div>
         <p>Login successfully</p>
         {data && <p>Additional data from API: {data}</p>}
      </div>
   )
}

export default NewPost
