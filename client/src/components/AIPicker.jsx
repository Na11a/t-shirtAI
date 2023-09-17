import React from 'react'
import CustomButton from './CustomButton'


function AIPicker({prompt, setPrompt, generationImg, handleSubmit}) {

  return (
    <div className='aipicker-container'>
        <textarea 
          placeholder='Ask Ai...'
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className='aipicker-textarea'
        />
        <div className='flex flex-wrap gap-3'>
          {generationImg ? (
            <CustomButton type={'outline'} title={'Asking Ai...'} customStyles={'text-xs'}/>
          ) : (
            <>
              <CustomButton type="outline" title="AI Logo" handleClick={()=> handleSubmit('logo')}/>
              <CustomButton type="outline" title="AI Full" handleClick={()=> handleSubmit('full')}/>
            </>
          )}

        </div>
    </div>
  )
}

export default AIPicker