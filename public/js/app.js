const form=document.querySelector('form');
const filename_holder=document.querySelector('input');
const message=document.querySelector('#output_message');
const aware_user=document.getElementById('aware_user');
const access_url=document.getElementById('Access_URL');
form.addEventListener('submit',async(event)=>{
event.preventDefault();
const filename=filename_holder.value;

  const response= await fetch(`http://localhost:8000/downloads?name=${filename}`);
  const data=await response.json();
         if(data.error){
            message.textContent=`${data.error}`;
         }
         else{
            message.textContent=`${data.success}`;
            aware_user.textContent=`You can download file from link give below. You can download file only 3 times`;
            access_url.setAttribute("href",`/downloads/${data.name}`);
            access_url.textContent="Download link!";
         }
         setTimeout(()=>{
          access_url.removeAttribute("href");
          aware_user.textContent='Link Expired!, You can no longer download'
         },10000);

   });
 var counter=1;

   access_url.addEventListener('click',async(event)=>{
      const filename=filename_holder.value;

  const response= await fetch(`http://localhost:8000/downloads?name=${filename}`);
  const data=await response.json();
      if(counter<3){
      console.log('link is clicked');
       event.preventDefault();
       access_url.setAttribute("href", `/downloads/${data.name}`);
      counter++;
      }
      else{
         access_url.removeAttribute("href");
         aware_user.textContent='Link Expired!, You can no longer download'
      }
   });


