import React, { useState, useCallback, useEffect } from 'react'
import { FaArrowRight } from 'react-icons/fa'

import ArticleCard from '../../../components/ArticleCard'
import { useQuery } from '@tanstack/react-query'
import { getAllPosts } from '../../../services/index/posts'
import { toast } from 'react-hot-toast'
import ArticleCardSkeleton from '../../../components/ArticleCardSkeleton'
import ErrorMessage from '../../../components/ErrorMessage'

const Articles = () => {
   const [numArticles, setNumArticles] = useState(9)

   const { data, isLoading, isError, refetch } = useQuery({
      queryFn: () => getAllPosts('', 1, numArticles), // Modify the queryFn to include the numArticles parameter
      queryKey: ['posts'],
      onError: (error) => {
         toast.error(error.message)
         console.log(error)
      }
   })

   const handleLoadMoreArticles = useCallback(() => {
      setNumArticles((prevNumArticles) => prevNumArticles + 9)
   }, [])

   // Add an effect to refetch data whenever numArticles changes
   useEffect(() => {
      refetch()
   }, [refetch, numArticles])

   return (
      <section className="container mx-auto flex flex-col px-5 py-10">
         <div className="flex flex-wrap gap-y-5 pb-10 md:gap-x-5">
            {isLoading ? (
               [...Array(3)].map((item, index) => (
                  <ArticleCardSkeleton key={index} className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]" />
               ))
            ) : isError ? (
               <ErrorMessage message="Couldn't fetch the posts data" />
            ) : (
               data?.data.map((post) => (
                  <ArticleCard
                     key={post._id}
                     post={post}
                     className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
                  />
               ))
            )}
         </div>
         {data?.data.length === numArticles && (
            <button
               className="mx-auto flex items-center gap-x-2 rounded-lg border-2 border-primary px-6 py-3 font-bold text-primary"
               onClick={handleLoadMoreArticles}
            >
               <span>More articles</span>
               <FaArrowRight className="h-3 w-3" />
            </button>
         )}
      </section>
   )
}

export default Articles
