<script>
    import { storeTemplate } from '$lib/store/storeTemplate.js'
    import { isEqual } from '$lib/isEqual.js'
    //import { tick } from 'svelte';
    //window.isEqual
    
    export let storeName
    export let storeParams = null
    let oldStoreParams = {...storeParams}
    export let selected 
    export let disabled = false
    export let style = ''
    export let idField = 'id'
    export let labelField = 'label'
    
    let store = storeTemplate(storeName, storeParams||{})
    
    $: if (storeName && storeParams && isEqual(storeParams, oldStoreParams)) {
      console.log('Select refresh storeName:', storeName, 'storeParams:', storeParams, 'oldStoreParams', oldStoreParams)
      oldStoreParams = {...storeParams}
      store.refresh(storeParams)
    }
    
    
    </script>
    <select bind:value={selected} style="{style}" disabled={disabled} class="form-select" >
      <slot>
        <option value="-1" selected >pick</option>
      </slot>
      {#each $store.data as row}
        <option value={row[idField]} selected={selected == row[idField]} >{row[labelField]}</option>
      {/each}
    </select>