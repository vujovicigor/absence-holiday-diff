import {writable} from 'svelte/store';
import {fetch2} from '$lib/fetch2.js'

//let SERVICE_NAME = 'dayz'
async function refresh(sn, params) {
  let service_name = sn 
  console.log('refreshing ', service_name)
  //loading = true
  var [resp,err] = await fetch2('GET', ''+service_name, params)                
  //loading = false
  if (err) { console.error('Network error '+service_name, err); return null}
  if (resp) return resp 
  return null
}

async function save(sn, obj ) {
  let service_name = sn
  var [resp,err] = await fetch2('POST', ''+service_name, obj) 
  //todo: error handling
  return resp 
}

async function del(sn, obj ) {
  let service_name = sn;
  var [resp, err] = await fetch2('DELETE', ''+service_name, obj)
}

async function insert(obj) {
  // insert ajax
  // refresh
  // mutation-> save
}

function storeTemplate(SERVICE_NAME, PARAMS, preventExecution=false) {
  let refreshingInProgress = false
	const { subscribe, set, update, get } = writable(
    {
      state:null
      , data:[]
    }
    ,(set)=>{ 
      update(s =>  { s.state='loading'; return s})
//      set({state:'loading', data:cached_rez})
      console.log(`First ${SERVICE_NAME} subscriber`, preventExecution)
      if (!preventExecution)
        refresh(SERVICE_NAME, PARAMS).then(rez=>{
          if (rez===null) update(s => { s.state='error'; return s})
          if (rez) set({state:'ready', data:rez}) 
        })
      
      return () => { 
        console.log(`0 subscribers on ${SERVICE_NAME} store`)
      }
    }
  );

	return {
    subscribe,
    params:PARAMS,
    del: async (obj)=> {
      update(s =>  { s.state='loading'; return s})
      await del(SERVICE_NAME, {...obj, ...PARAMS});
      let rez = await refresh(SERVICE_NAME, PARAMS)
      if (rez===null) update(s => { s.state='error'; return s})
      if (rez) {
        izitoast.success({ message: 'Removed'}); 
        update(s =>  { return {state:'ready', data:rez} }) 
      }
      return true
    },    
    save: async (obj, silent = false)=> {
      update(s =>  { s.state='loading'; return s})
      let saveResponse = await save(SERVICE_NAME, {...PARAMS, ...obj});
      let rez = await refresh(SERVICE_NAME, PARAMS)
      if (rez===null) update(s => { s.state='error'; return s})
      if (rez) {
        if (!silent) izitoast.success({ message: 'Saved'}); 
        update(s =>  { return {state:'ready', data:rez} }) 
      }
      return saveResponse
    },    
    insert: async (name)=> {
      update(s =>  { s.state='loading'; return s})
      await insert(name);
      let rez = await refresh()
      if (rez===null) update(s => { s.state='error'; return s})
      if (rez) update(s =>  { return {state:'ready', data:rez} }) 
    },
    refresh: async (params)=> {
      if (refreshingInProgress) return
      refreshingInProgress=true
      update(s =>  { s.state='loading'; return s})
      if (params) PARAMS = {...params} //!!!
      let rez = await refresh(SERVICE_NAME, PARAMS)
      if (rez) update(s =>  { return {state:'ready', data:rez} }) 
      refreshingInProgress=false
    },
		reset: () => set({state:null, data:[] })
	};
}

//export const talent = custom_store();
export {storeTemplate}

