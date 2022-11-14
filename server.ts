
import express from 'express';
import cors from 'cors';
import { createFetch, base, accept, parse } from 'http-client';

 
const fetch = createFetch(
  base('http://localhost:8080/reservations'),  
  accept('application/json'),         // Set "Accept: application/json" in the request headers
  parse('json')                       // Read the response as JSON and put it in response.body
)


const fetch1 = createFetch(
  base('http://localhost:8080/timetables'),  
  accept('application/json'),         
  parse('json')                       
)
 


const app = express() 


function checkIfAvailable(date) {

  date = toString(date);

  reservation:any;
  openClose:any;
  fetch('?date='+date.slice(0,10)+'&resourceId=1337').then(response => {
    reservation = response.jsonData;
  })

  fetch1('?date=+'+date.slice(0,10)+'&resourceId=1337').then(response => {
    openClose = response.jsonData ;
  })

  AskedDate = Date.parse(date) //we need two dates
  reservationStart = Date.parse(reservation.reservationStart)
  reservationEnd = Date.parse(reservation.reservationEnd)

  if(openClose.open == true){

    if(AskedDate < reservationStart ){
      return json({"available":true})
    }
    else{
      return json({"available":false})
    }

  }

  else{
    return json({"available": false});
  }
}



app.use(cors())     
app.use(express.json())



app.get('/',(req,res) =>{

  date = req.body.date;
  availability = checkIfAvailable(date)

  return availability 
  
})



app.listen(process.env.PORT||1337,()=>{

    console.log('Server started on 1337')
})






