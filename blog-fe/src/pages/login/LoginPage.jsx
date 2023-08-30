import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { images } from '../../constants'
import MainLayout from '../../components/MainLayout'
import { googleAuth, login } from '../../services/index/users'
import { userActions } from '../../store/reducers/userReducers'
import Login from '../../services/GoogleAuth/login'
import { gapi } from 'gapi-script'
import axios from '../../services/axios'
const clientID = '127223066260-nk5n209ufs4kl6ahtpdjf0r8lg7fsadf.apps.googleusercontent.com'

const LoginPage = () => {
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const userState = useSelector((state) => state.user)

   useEffect(() => {
      function start() {
         gapi.client.init({
            clientId: clientID,
            scope: ''
         })
      }

      gapi.load('client:auth2', start)
   })

   const { mutate, isLoading } = useMutation({
      mutationFn: ({ email, password }) => {
         return login({ email, password })
      },
      onSuccess: (data) => {
         dispatch(userActions.setUserInfo(data))
         localStorage.setItem('account', JSON.stringify(data))
      },
      onError: (error) => {
         toast.error(error.message)
         console.log(error)
      }
   })

   useEffect(() => {
      if (userState.userInfo) {
         navigate('/')
      }
   }, [navigate, userState.userInfo])

   const {
      register,
      handleSubmit,
      formState: { errors, isValid }
   } = useForm({
      defaultValues: {
         email: '',
         password: ''
      },
      mode: 'onChange'
   })

   const submitHandler = (data) => {
      const { email, password } = data
      mutate({ email, password })
   }

   // const googleAuthSuccess = (response) => {
   //    // Xử lý khi đăng nhập thành công
   //    console.log(response)
   // }

   // const googleAuthFailure = (error) => {
   //    // Xử lý khi đăng nhập thất bại
   //    console.error(error)
   // }

   return (
      <MainLayout>
         <section className="container mx-auto px-5 py-10">
            <div className="mx-auto w-full max-w-sm">
               <h1 className="mb-8 text-center font-roboto text-2xl font-bold text-dark-hard">Login</h1>
               <form onSubmit={handleSubmit(submitHandler)}>
                  <div className="mb-6 flex w-full flex-col">
                     <label htmlFor="email" className="block font-semibold text-[#5a7184]">
                        Email
                     </label>
                     <input
                        type="email"
                        id="email"
                        {...register('email', {
                           pattern: {
                              value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                              message: 'Enter a valid email'
                           },
                           required: {
                              value: true,
                              message: 'Email is required'
                           }
                        })}
                        placeholder="Enter email"
                        className={`mt-3 block rounded-lg border px-5 py-4 font-semibold text-dark-hard outline-none placeholder:text-[#959ead] ${
                           errors.email ? 'border-red-500' : 'border-[#c3cad9]'
                        }`}
                     />
                     {errors.email?.message && <p className="mt-1 text-xs text-red-500">{errors.email?.message}</p>}
                  </div>
                  <div className="mb-6 flex w-full flex-col">
                     <label htmlFor="password" className="block font-semibold text-[#5a7184]">
                        Password
                     </label>
                     <input
                        type="password"
                        id="password"
                        {...register('password', {
                           required: {
                              value: true,
                              message: 'Password is required'
                           },
                           minLength: {
                              value: 6,
                              message: 'Password length must be at least 6 characters'
                           }
                        })}
                        placeholder="Enter password"
                        className={`mt-3 block rounded-lg border px-5 py-4 font-semibold text-dark-hard outline-none placeholder:text-[#959ead] ${
                           errors.password ? 'border-red-500' : 'border-[#c3cad9]'
                        }`}
                     />
                     {errors.password?.message && (
                        <p className="mt-1 text-xs text-red-500">{errors.password?.message}</p>
                     )}
                  </div>
                  <Link to="/forget-password" className="text-sm font-semibold text-primary">
                     Forgot password?
                  </Link>
                  <button
                     type="submit"
                     disabled={!isValid || isLoading}
                     className="my-6 w-full rounded-lg bg-primary py-4 px-8 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
                  >
                     Sign In
                  </button>
                  <p className="text-sm font-semibold text-[#5a7184]">
                     Do not have an account?{' '}
                     <Link to="/register" className="text-primary">
                        Register now
                     </Link>
                  </p>
               </form>
               {/* <a href="http://localhost:5000/auth/google">Log in with Google</a> */}
               <button
                  onClick={async () => {
                     window.location.href = 'http://localhost:5000/auth/google'
                  }}
                  className="my-6 flex w-full items-center justify-center rounded-lg bg-green-500 py-4 px-8 text-lg font-bold text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70"
               >
                  <img
                     src={images.GoogleIcon}
                     alt="title"
                     className="mr-4 h-auto w-8 rounded-full bg-white object-cover object-center"
                  />
                  Log in with Google
               </button>
               {/* <button
                  onClick={googleAuth}
                  className="my-6 flex w-full items-center justify-center rounded-lg bg-green-500 py-4 px-8 text-lg font-bold text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70"
               >
                  <img
                     src={images.GoogleIcon}
                     alt="title"
                     className="mr-4 h-auto w-8 rounded-full bg-white object-cover object-center"
                  />
                  Log in with Google
               </button> */}
               {/* <Login /> */}
            </div>
         </section>
      </MainLayout>
   )
}

export default LoginPage
