import { GoogleLogin } from 'react-google-login'
import { images } from '../../constants'
import { userActions } from '../../store/reducers/userReducers'
import { useDispatch } from 'react-redux'
import axios from '../axios'

const clientID = '127223066260-nk5n209ufs4kl6ahtpdjf0r8lg7fsadf.apps.googleusercontent.com'

function Login() {
   const dispatch = useDispatch()
   const onSuccess = async (res) => {
      const response = await axios.get('/auth/google/callback', {
         withCredentials: true
      })

      console.log('onSuccess', response.data)

      // Redirect the user to the URL received from the server
      window.location.href = 'http://localhost:3000'
   }
   const onFailure = (err) => {
      console.log('Login failed ', err)
   }

   return (
      <div>
         <GoogleLogin
            clientId={clientID}
            render={(renderProps) => (
               <button
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  className="my-6 flex w-full items-center justify-center rounded-lg bg-green-500 py-4 px-8 text-lg font-bold text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70"
               >
                  <img
                     src={images.GoogleIcon}
                     alt="title"
                     className="mr-4 h-auto w-8 rounded-full bg-white object-cover object-center"
                  />
                  Log in with Google
               </button>
            )}
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
            isSignedIn={true}
         />
      </div>
   )
}
export default Login
