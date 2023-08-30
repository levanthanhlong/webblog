import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { getSinglePost, updatePost } from '../../../../services/index/posts'
import { Link, useParams } from 'react-router-dom'
import ArticleDetailSkeleton from '../../../articleDetail/components/ArticleDetailSkeleton'
import ErrorMessage from '../../../../components/ErrorMessage'
import parseJsonToHtml from '../../../../utils/parseJsonToHtml'
import { stables } from '../../../../constants'
import { HiOutlineCamera ,HiClipboard} from 'react-icons/hi'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CreatableSelect from 'react-select/creatable'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

const EditPost = () => {
   const { slug } = useParams()
   const queryClient = useQueryClient()
   const userState = useSelector((state) => state.user)
   const [initialPhoto, setInitialPhoto] = useState(null)
   const [initialAudio, setInitialAudio] = useState(null)
   const [photo, setPhoto] = useState(null)
   const [audio, setAudio] = useState(null)
   const [body, setBody] = useState(null)
   const [caption, setCaption] = useState(null)
   const [title, setTitle] = useState(null)
   const [tags, setTags] = useState(null)
   const [editorLoaded, setEditorLoaded] = useState(false)
   //  const [categories, setCategories] = useState(null)
   const navigate = useNavigate()

   const tagOptions = [
      { value: 'Technology', label: 'Technology' },
      { value: 'Science', label: 'Science' },
      { value: 'Medical', label: 'Medical' }
   ]

   const { data, isLoading, isError } = useQuery({
      queryFn: () => getSinglePost({ slug }),
      queryKey: ['blog', slug]
   })
   //
   const { mutate: mutateUpdatePostDetail, isLoading: isLoadingUpdatePostDetail } = useMutation({
      mutationFn: ({ updatedData, slug, token }) => {
         return updatePost({
            updatedData,
            slug,
            token
         })
      },
      onSuccess: (data) => {
         queryClient.invalidateQueries(['blog', slug])
         toast.success('Post is updated')
         navigate(`/blog/${slug}`)
      },
      onError: (error) => {
         toast.error(error.message)
         console.log(error)
      }
   })

   useEffect(() => {
      if (!isLoading && !isError) {
         setInitialPhoto(data?.photo)
         setInitialAudio(data?.audio)
         setBody(data?.body?.content)
         setCaption(data?.caption)
         //  setTags(data?.tags)
      }
   }, [data, isError, isLoading])

   const handleFileImageChange = (e) => {
      const fileImage = e.target.files[0]
      setPhoto(fileImage)
   }

   const handleFileAudioChange = (e) => {
      const fileAudio = e.target.files[0]
      console.log(fileAudio.type)
      if(fileAudio.type === 'audio/mpeg') {
         toast.success("Add audio file success")
         setAudio(fileAudio)
      }else toast.error("Please choose suitable file")
      
   }

   const handleUpdatePost = async (e) => {
      e.preventDefault()

      let updatedData = new FormData()

      if (!initialPhoto && photo) {
         updatedData.append('postPicture', photo)
      } else if (initialPhoto && !photo) {
         const urlToObject = async (url) => {
            let reponse = await fetch(url)
            let blob = await reponse.blob()
            const file = new File([blob], initialPhoto, { type: blob.type })
            return file
         }
         const picture = await urlToObject(stables.UPLOAD_FOLDER_BASE_URL + data?.photo)

         updatedData.append('postPicture', picture)
      }

      if (!initialAudio && audio) {
         updatedData.append('audioFile', audio)
      } else if (initialAudio && !audio) {
         const urlToObject = async (url) => {
            let reponse = await fetch(url)
            let blob = await reponse.blob()
            const file = new File([blob], initialAudio, { type: blob.type })
            console.log(typeof file)
            return file
         }
         const audio = await urlToObject(stables.UPLOAD_FOLDER_BASE_URL + data?.audio)

         updatedData.append('audioFile', audio)
      }

      updatedData.append(
         'document',
         JSON.stringify({
            title: title,
            caption: caption,
            tags: tags?.map((object) => object.value) ?? [],
            body: {
               type: 'doc',
               content: body
            }
            // categories: categories.map(object => object.value)
         })
      )

      mutateUpdatePostDetail({
         updatedData,
         slug,
         token: userState.userInfo.token
      })
   }

   const handleDeleteImage = () => {
      if (window.confirm('Do you want to delete your Post picture?')) {
         setInitialPhoto(null)
         setPhoto(null)
      }
   }

   const handleDeleteAudio = () => {
      if (window.confirm('Do you want to delete your Post Audio?')) {
         setInitialAudio(null)
         setAudio(null)
      }
   }

   return (
      <div className="">
         {isLoading ? (
            <ArticleDetailSkeleton />
         ) : isError ? (
            <ErrorMessage message="Couldn't fetch the post detail" />
         ) : (
            <section className=" container mx-auto flex max-w-5xl flex-col px-5 py-5 lg:flex-row lg:items-start lg:gap-x-5">
               <article className="flex-1">
                  <label htmlFor="postPicture" className="w-full cursor-pointer">
                     {photo ? (
                        <img src={URL.createObjectURL(photo)} alt={data?.title} className="w-full rounded-xl" />
                     ) : initialPhoto ? (
                        <img
                           alt={data?.title}
                           className="w-full rounded-xl"
                           src={
                              data?.photo.includes('http://') || data?.photo.includes('https://')
                                 ? data?.photo
                                 : stables.UPLOAD_FOLDER_BASE_URL + data?.photo
                           }
                        />
                     ) : (
                        <div className="flex min-h-[200px] w-full items-center justify-center bg-blue-50/50">
                           <HiOutlineCamera className="h-auto w-7 text-primary" />
                        </div>
                     )}
                  </label>
                  <input type="file" className="sr-only" id="postPicture" onChange={handleFileImageChange} />
                  <button
                     type="button"
                     onClick={handleDeleteImage}
                     className="mt-5 w-fit rounded-lg bg-red-500 px-2 py-1 text-sm font-semibold text-white"
                  >
                     Delete Image
                  </button>

                  <label htmlFor="postAudio" className="w-full cursor-pointer">
                     {audio ? (
                        <audio controls  alt={data?.title} className="w-full rounded-xl" >
                           <source src={URL.createObjectURL(audio)}/>
                        </audio>
                     ) : initialAudio ? (
                        <audio
                           alt={data?.title}
                           className="w-full rounded-xl"
                           src={
                              data?.audio.includes('http://') || data?.audio.includes('https://')
                                 ? data?.audio
                                 : stables.UPLOAD_FOLDER_BASE_URL + data?.audio
                           }
                        >
                           <source src={
                              data?.audio.includes('http://') || data?.audio.includes('https://')
                                 ? data?.audio
                                 : stables.UPLOAD_FOLDER_BASE_URL + data?.audio
                           }/>
                           </audio>
                     ) : (
                        
                        <div className="flex min-h-[200px] w-full items-center justify-center bg-blue-50/50">
                           <HiClipboard className="h-auto w-7 text-primary" />
                           {/* <input accept='.mp3' type="file" id="upload" title="Upload File" /> */}
                        </div>
                     )}
                  </label>
                  <input type="file" className="sr-only" id="postAudio" onChange={handleFileAudioChange} />
                  <button
                     type="button"
                     onClick={handleDeleteAudio}
                     className="mt-5 w-fit rounded-lg bg-red-500 px-2 py-1 text-sm font-semibold text-white"
                  >
                     Delete Audio
                  </button>
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
                  <form className="flex flex-col items-center" onSubmit={handleUpdatePost}>
                     <input
                        className="mt-4 w-full bg-white p-6 font-roboto text-xl font-medium text-dark-hard md:text-[26px]"
                        placeholder={`${data.title}`}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                     ></input>
                     <textarea
                        type="text"
                        className="mt-4 h-96 w-full bg-white font-roboto text-xl font-medium text-dark-hard md:text-[20p]"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                     >{`${caption}`}</textarea>
                     <CreatableSelect
                        placeholder="Select tags"
                        defaultValuevalue={tags}
                        onChange={setTags}
                        isMulti
                        className="mt-4 w-full"
                        isClearable
                        options={tagOptions}
                     />
                     <div className="mt-4 w-full">
                        <CKEditor
                           editor={ClassicEditor}
                           data={body}
                           onReady={(editor) => {
                              // You can store the "editor" and use when it is needed.
                              console.log('Editor is ready to use!', editor)
                           }}
                           onChange={(event, editor) => {
                              const data = editor.getData()
                              console.log({ event, editor, data })
                              setBody(data)
                           }}
                           onBlur={(event, editor) => {
                              console.log('Blur.', editor)
                           }}
                           onFocus={(event, editor) => {
                              console.log('Focus.', editor)
                           }}
                        />
                     </div>
                     {/* <CreatableSelect placeholder="Select categories" defaultValuevalue={categories} onChange={setCategories} isMulti className='w-full mt-4' isClearable options={colourOptions} /> */}
                     <button
                        // disabled={isLoadingUpdatePostDetail}
                        type="submit"
                        className="m-6 flex w-48 items-center justify-center rounded-lg bg-green-500 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                     >
                        Update Post
                     </button>
                     <Link
                        to="/admin/posts/manage"
                        className="m-6 flex w-48 items-center justify-center rounded-lg  bg-blue-400 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                     >
                        Back
                     </Link>
                  </form>
               </article>
            </section>
         )}
      </div>
   )
}

export default EditPost
