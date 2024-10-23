import React, { useState,useRef } from 'react'

function Login() {
    const [username,setusername]=useState('')
    const [passwd,setpasswd]=useState('')


    function handelshowhide(e){
        e.preventDefault();
        const ref=document.querySelector('.passwordhu')
        const showhidebutton=document.querySelector('.showhide')

        if(ref.getAttribute('type')==='password'){
            ref.setAttribute('type','text');
            showhidebutton.innerHTML='Hide'
        }else{
            ref.setAttribute('type','password')
            showhidebutton.innerHTML='Show'
        }
    }
    const data=['Meta','About','BlogJobs','Help','API,Privacy','Terms,Locations','Instagram Lite','Threads','Contact Uploading & Non-Users','Meta Verified']

  return (
   <>
   <div className='flex flex-row justify-center'>
      <img src="/final2.png" alt="" className='h-[640px] w-[640px] hidden lg:flex' />
   <div>
    <div className='lg:relative lg:right-40'>
   <div className='flex flex-cols justify-center mx-5'>
        <div className='border-2 border-gray-200 w-96 bg-white mt-10'>
            <h1 className='font-semibold text-center italic text-4xl font-[cursive] mt-5 my-10'>Instagram</h1>
            <div className='flex flex-col items-center mt-5 gap-3'>
                <input type="text" className='w-72 focus:outline-none border border-gray-500 px-2 py-2 placeholder:text-sm rounded-sm' placeholder='Phoneno,username or email' value={username} onChange={(e)=>{e.preventDefault(); setusername(e.target.value)}} />
                
                <div className="relative w-72 flex">
        <input type="password" className="rounded-sm w-full focus:outline-none border border-gray-500 px-2 py-2 pr-16 placeholder:text-sm passwordhu"placeholder="Password" value={passwd} onChange={(e)=>setpasswd(e.target.value)}/>
  {(passwd.length > 0) &&
  <button 
    className="absolute inset-y-0 right-0 px-4 py-2 text-sm hover:text-gray-700 bg-transparent rounded-md focus:outline-none showhide hover:opacity-70 font-semibold" onClick={(e)=>handelshowhide(e)}>Show
  </button>}
</div>
<div className='w-full flex justify-center my-3'>
  <button className=' bg-blue-400 w-72 rounded-md text-white font-semibold font-sans py-1'>Log in</button>
</div>

<div className='flex justify-center items-center'>
    <div className='border-t-2 border-t-gray-300 w-32'></div>
    <span className='font-semibold px-2 text-gray-500 opacity-70 cursor-pointer'>OR</span>
    <div className='border-t-2 border-t-gray-300 w-32'></div>
</div>

<div className='flex justify-center items-center gap-x-2 mt-2'>
  <img src="https://icons.iconarchive.com/icons/paomedia/small-n-flat/512/social-facebook-icon.png" className='h-6'/>
  <h1 className='text-lg text-blue-800 opacity-90 cursor-pointer'>Log in with facebook?</h1>
</div>

<div className='mb-7'>
  <h1 className='text-sm hover:underline hover:text-blue-500 cursor-pointer'>Forgot password?</h1>
</div>
 </div>
    </div>
   </div>
   <div className='flex justify-center mt-5'>
    <div className='border-2 w-96 flex justify-center py-4'>
      <h1>Don't have an account?</h1>
      <button className='text-blue-500 cursor-pointer ml-2'>Sign up</button>
    </div>
   </div>
    <div className='flex flex-col items-center py-3 gap-3'>
    <span>Get the app.</span>
    <div className='flex w-80 h-12 justify-center gap-3'>
      <img src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym-Klz.png" alt="" className='h-full w-full' />
      <img src="https://static.cdninstagram.com/rsrc.php/v3/yu/r/EHY6QnZYdNX.png" alt="" className='h-full w-full'/>
      </div>
    </div>
    </div>
    </div>
    </div>
    <div className='flex justify-center mt-5'>
    <div className='grid grid-cols-5 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-10 xl:grid-cols-10 gap-4 px-20 lg:mx-auto lg:place-content-center'>
  {
    data.map((item, index) => (
      <a href="#" className={`text-[13px] text-gray-500 ${index === 5 || index==8 ? 'truncate' :''}`}>{item}</a>  
    ))
  }
</div>
</div>

   </>
  )
}

export default Login