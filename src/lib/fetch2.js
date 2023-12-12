
const HOSTNAME = 'https://3135-164-92-139-64.ngrok-free.app/api/v2/';//'https://6e3a-164-92-139-64.eu.ngrok.io/api/v2/';

export const fetch2 = function(method, url, obj){
    let m = method || 'GET';

    //  var authorization=localStorage.getItem('token')  , TODO 
    var authorization = null
     
    var body = m!=='GET'?JSON.stringify(obj):null;
    const getParams = ((m==='GET') && obj )? '?'+ new URLSearchParams(obj):'';

    return new Promise(function(resolve, reject) {
        var response = fetch(HOSTNAME+url+getParams, {
            method: method || 'get',
            headers: {
                'ngrok-skip-browser-warning': 'yes',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...(authorization? {"authorization":'Bearer '+ authorization}:{})
                //"authorization":'Bearer '+ authorization
            },
            body: body
        }).then(function(response){ 
            return response.json()}
        )
        .then(function(j){ 
            // console.log('j',j); 
            resolve([j,null]) 
        })
        .catch(function(err){
            console.log('nework error!', err);
            //izitoast.error({ message: 'Network error!!!'});
            resolve([null,err])
        })
    })
}
