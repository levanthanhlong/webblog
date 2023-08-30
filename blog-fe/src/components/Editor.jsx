import ClassicEditorUI from '@ckeditor/ckeditor5-editor-classic/src/classiceditorui'
import { CKEditorContext } from '@ckeditor/ckeditor5-react'
import React, { useEffect, useRef } from 'react'

function Editor({ onChange, editorLoaded, name, value }) {
   //    const editorRef = useRef()
   //    const { CKEditor, ClassicEditor } = editorRef.current || {}

   //    useEffect(() => {
   //       editorRef.current = {
   //          CKEditor: require('@ckeditor/ckeditor5-react').CKEditor, // v3+
   //          ClassicEditor: require('@ckeditor/ckeditor5-build-classic')
   //       }
   //    }, [])

   return (
      <div>
         {editorLoaded ? (
            <CKEditorContext
               type=""
               name={name}
               editor={ClassicEditorUI}
               config={{
                  ckfinder: {
                     uploadUrl: '' //Enter your upload url
                  }
               }}
               data={value}
               onChange={(event, editor) => {
                  const data = editor.getData()
                  onChange(data)
               }}
            />
         ) : (
            <div>Editor loading</div>
         )}
      </div>
   )
}

export default Editor
