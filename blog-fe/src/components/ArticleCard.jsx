import React from 'react'

import { images, stables } from '../constants'
import { Link } from 'react-router-dom'

const ArticleCard = ({ post, className }) => {
   return (
      <div className={`overflow-hidden rounded-xl shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] ${className}`}>
         <Link to={`/blog/${post.slug}`}>
            <img
               src={
                  post.photo
                     ? post.photo.includes('http://') || post.photo.includes('https://')
                        ? post.photo
                        : stables.UPLOAD_FOLDER_BASE_URL + post.photo
                     : images.samplePostImage
               }
               alt="title"
               className="h-auto w-full object-cover object-center md:h-52 lg:h-48 xl:h-60"
            />
         </Link>
         <div className="p-5">
            <Link to={`/blog/${post.slug}`}>
               <h2 className="font-roboto text-xl font-bold text-dark-soft md:text-2xl lg:text-[28px]">{post.title}</h2>
               <p className="mt-3 text-sm text-dark-light md:text-lg">{post.caption}</p>
            </Link>
            <div className="mt-6 flex flex-nowrap items-end justify-between">
               <div className="flex items-end gap-x-2 md:gap-x-2.5">
                  <img
                     src={
                        post?.user?.avatar
                           ? post?.user?.avatar.includes('http://') || post?.user?.avatar.includes('https://')
                              ? post?.user?.avatar
                              : stables.UPLOAD_FOLDER_BASE_URL + post?.user?.avatar
                           : images.userImage
                     }
                     alt="post profile"
                     className="h-9 w-9 rounded-full md:h-11 md:w-11"
                  />
                  <div className="flex flex-col">
                     <h4 className="text-sm font-bold text-dark-soft md:text-base">{post.user.name}</h4>
                     <div className="flex items-center gap-x-2">
                        <span className="text-xs text-dark-light md:text-sm">Blogger</span>
                     </div>
                  </div>
               </div>
               <span className="text-sm font-bold italic text-dark-light md:text-base">
                  {new Date(post.createdAt).getDate()}{' '}
                  {new Date(post.createdAt).toLocaleString('default', {
                     month: 'long'
                  })}
               </span>
            </div>
         </div>
      </div>
   )
}

export default ArticleCard
