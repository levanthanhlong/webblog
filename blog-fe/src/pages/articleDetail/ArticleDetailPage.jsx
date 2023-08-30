import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import BreadCrumbs from '../../components/BreadCrumbs'
import CommentsContainer from '../../components/comments/CommentsContainer'
import MainLayout from '../../components/MainLayout'
import SocialShareButtons from '../../components/SocialShareButtons'
import { images, stables } from '../../constants'
import SuggestedPosts from './container/SuggestedPosts'
import { useQuery } from '@tanstack/react-query'
import { getAllPosts, getSinglePost } from '../../services/index/posts'
import ArticleDetailSkeleton from './components/ArticleDetailSkeleton'
import ErrorMessage from '../../components/ErrorMessage'
import { useSelector } from 'react-redux'
import ReactAudioPlayer from 'react-audio-player'
// import parseJsonToHtml from '../../utils/parseJsonToHtml'
import { isEmpty } from 'lodash'

const ArticleDetailPage = () => {
   const { slug } = useParams()
   const navigate = useNavigate()
   const userState = useSelector((state) => state.user)
   const [breadCrumbsData, setbreadCrumbsData] = useState([])
   const [openSeting, setOpenSeting] = useState(false)
   const [fontSize, setFontSize] = useState(14)
   const [body, setBody] = useState(null)

   const { data, isLoading, isError } = useQuery({
      queryFn: () => getSinglePost({ slug }),
      queryKey: ['blog', slug],
      onSuccess: (data) => {
         setbreadCrumbsData([
            { name: 'Home', link: '/' },
            { name: 'Blog', link: '/blog' },
            { name: `${data.title}`, link: `/blog/${data.slug}` }
         ])
         setBody(data?.body.content)
      }
   })

   const { data: postsData } = useQuery({
      queryFn: () => getAllPosts(),
      queryKey: ['posts']
   })

   return (
      <MainLayout>
         {isLoading ? (
            <ArticleDetailSkeleton />
         ) : isError ? (
            <ErrorMessage message="Couldn't fetch the post detail" />
         ) : (
            <section className="container mx-auto flex max-w-5xl flex-col px-5 py-5 lg:flex-row lg:items-start lg:gap-x-5">
               <article className="flex-1">
                  <div className="row mb-1 flex items-center justify-between">
                     <BreadCrumbs data={breadCrumbsData} />
                     <div
                        className="dropdown relative inline-block"
                        onMouseEnter={() => setOpenSeting(true)}
                        onMouseLeave={() => setOpenSeting(false)}
                     >
                        <button className="inline-flex items-center rounded border-2 border-blue-500 px-4 py-2 text-xs text-blue-500 duration-300 hover:bg-blue-500 hover:text-blue-100">
                           <span className="mr-1">Setting</span>
                           <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />{' '}
                           </svg>
                        </button>
                        {openSeting && (
                           <div className="dropdown-menu z-100 absolute w-full rounded-md bg-white pt-1 text-gray-700 shadow-xl">
                              <div className="p-2 text-center">
                                 <div className="text-[12px] font-semibold">Font size</div>
                                 <div className="mt-1 flex flex-row items-center">
                                    <button
                                       onClick={() => setFontSize(fontSize - 1)}
                                       className="border-1 border-gray text-gray flex h-6 w-1/3 items-center justify-center border"
                                    >
                                       -
                                    </button>
                                    <div className="border-1 border-gray text-gray flex h-6 w-1/3 items-center justify-center border text-[12px]">
                                       {fontSize}
                                    </div>
                                    <button
                                       onClick={() => setFontSize(fontSize + 1)}
                                       className="border-1 border-gray text-gray flex h-6 w-1/3 items-center justify-center border"
                                    >
                                       +
                                    </button>
                                 </div>
                                 <div className="mt-2 text-[12px] font-semibold">Font style</div>
                                 <div className="mt-1 flex flex-row">
                                    <button
                                       onClick={() => {}}
                                       className="border-1 border-gray text-gray flex h-6 w-1/3 items-center justify-center border font-bold"
                                    >
                                       B
                                    </button>
                                    <div className="border-1 border-gray text-gray flex h-6 w-1/3 items-center justify-center border  italic">
                                       I
                                    </div>
                                    <button
                                       onClick={() => {}}
                                       className="border-1 border-gray text-gray flex h-6 w-1/3 items-center justify-center border underline"
                                    >
                                       U
                                    </button>
                                 </div>
                                 {userState?.userInfo?._id === data?.user._id && (
                                    <button
                                       onClick={() => {
                                          navigate(`/admin/posts/manage/edit/${data?.slug}`)
                                       }}
                                       className="border-1 mt-3 inline-flex items-center rounded border-blue-500 px-4 py-1 text-xs text-blue-500 duration-300 hover:bg-blue-500 hover:text-white"
                                    >
                                       <span>Edit</span>
                                    </button>
                                 )}
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
                  <img
                     className="w-full rounded-xl"
                     src={data?.photo ? stables.UPLOAD_FOLDER_BASE_URL + data?.photo : images.samplePostImage}
                     alt={data?.title}
                  />
                  <div className="mt-4 flex gap-2">
                     {data?.categories.map((category) => (
                        <Link
                           to={`/blog?category=${category.name}`}
                           className="inline-block font-roboto text-sm text-primary md:text-base"
                        >
                           {category.name}
                        </Link>
                     ))}
                  </div>
                  <div className="mt-4 flex flex-row items-center justify-between">
                     <h1 className=" max-w-[50%] font-roboto text-xl font-medium text-dark-hard md:text-[26px]">
                        {data?.title}
                     </h1>
                     {data?.audio && <ReactAudioPlayer src={stables.UPLOAD_FOLDER_BASE_URL + data?.audio} controls />}
                     {/* {data?.audio && <ReactAudioPlayer
                           src={
                              'http://ec2-54-169-230-197.ap-southeast-1.compute.amazonaws.com:5000/uploads/1689786191540-clip1.mp3'
                           }
                           controls
                        />} */}
                  </div>
                  <div className="mt-4">{data?.caption}</div>
                  {!isEmpty(data?.body?.content) && (
                     <div
                        className="mt-4"
                        style={{ fontSize: fontSize }}
                        dangerouslySetInnerHTML={{ __html: data?.body?.content }}
                     ></div>
                  )}
                  <CommentsContainer
                     comments={data?.comments}
                     className="mt-10"
                     logginedUserId={userState?.userInfo?._id}
                     postSlug={slug}
                  />
               </article>
               <div>
                  <SuggestedPosts
                     header="Latest Article"
                     posts={postsData?.data}
                     tags={data?.tags}
                     className="mt-8 lg:mt-0 lg:max-w-xs"
                  />
                  <div className="mt-7">
                     <h2 className="mb-4 font-roboto font-medium text-dark-hard md:text-xl">Share on:</h2>
                     <SocialShareButtons
                        url={encodeURI(window.location.href)}
                        title={encodeURIComponent(data?.title)}
                     />
                  </div>
               </div>
            </section>
         )}
      </MainLayout>
   )
}

export default ArticleDetailPage
