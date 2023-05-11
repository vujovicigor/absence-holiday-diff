<script>
    import Datesgrid from '$lib/Datesgrid.svelte'
    import Select from '$lib/Select.svelte'
    import { selectedCountry } from '$lib/store/selectedCountry.js'
    //selectedCountry
	import { fetch2 } from '$lib/fetch2.js'
    import { isEqual, cloneJSON } from '$lib/isEqual.js'
    let holiday_names = []
    let waiting = false
	async function get(country){
        waiting = true
		let [resp, err] = await fetch2('GET', `date_difference_per_country/${country}`)
        waiting = false
		if (!err){
			holiday_names = resp
		}	
	}
    //get('DE')
	$: if ($selectedCountry){
		get($selectedCountry)
	}    
</script>

<Select style="width:20rem;display: inline; margin:0" 
    storeName='countries' 
    labelField='name'
    idField = 'code'
    bind:selected={$selectedCountry} 
>
    <option value="" disabled selected >Select country</option>
</Select>

<div style="flex:1; overflow:auto">
    <table class="table table-hover table-striped table-bordered ">
        <thead style="position: sticky; top: 0; background: var(--bs-body-bg); z-index:1"> 
            <tr>
                <th colspan="5" scope="colgroup">Holiday name </th>
                <th colspan="5" scope="colgroup" >Actions</th>
                <th colspan="6" scope="colgroup" >Check</th>
            </tr>        
            <tr> 
                <th class="nowrap" scope="col">Local language <span class="badge rounded-pill text-bg-light" title="HolidayApi">HA</span> </th> 
                <th class="nowrap" scope="col">English <span class="badge rounded-pill text-bg-light" title="HolidayApi">HA</span> </th> 
                <th class="nowrap" scope="col">Our name(key)</th> 
                <th class="nowrap" scope="col">Our date</th> 
                <th class="nowrap" scope="col"><span class="badge rounded-pill text-bg-light" title="HolidayApi">HA</span> date</th> 
   
 
                <th scope="col">Insert</th> 
                <th scope="col">Delete</th> 
                <th scope="col">Update</th> 
                <th class="nowrap" scope="col">Add to regions</th> 
                <th class="nowrap" scope="col">Remove from regions</th> 

                <th class="nowrap" scope="col">Our existing regions</th> 
                <th class="nowrap" scope="col">HolidayApi regions</th>                 
                <th class="nowrap" scope="col">Our Dates</th> 
                <th class="nowrap" scope="col">HolidayApi Dates</th> 
                <th class="nowrap" scope="col">Our id</th> 
                <th class="nowrap" scope="col">HolidayApi uuid</th> 

            </tr> 
        </thead>
        <tbody>
            {#if waiting}
                <center  style="width:100vw">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </center>
            {/if}

            {#if !waiting}
                {#each holiday_names as holiday_name}

                <tr on:click|stopPropagation={()=>enableRow(holiday_name)}> 

                    <td>{holiday_name.name}</td> 
                    <td>{holiday_name.name_en}</td> 
                    <td>{holiday_name.our_name}</td> 
                    <td class="nowrap">{holiday_name.our_date}</td> 
                    <td class="nowrap">{holiday_name.observed}</td> 

                    <td>
                        <input class="form-check-input" type="checkbox" disabled checked={holiday_name.act_insert}>
                    </td> 
                    <td>
                        <input class="form-check-input" type="checkbox" disabled checked={holiday_name.act_delete}>
                    </td> 
                    <td>
                        <input class="form-check-input" type="checkbox" disabled checked={holiday_name.act_update}>
                    </td> 
                    
                    
                    <td style="min-width: 16rem;">
                        {#each (holiday_name.act_add_to_regions || []) as region}
                            <span class="badge rounded-pill text-bg-primary" title="{region}">
                                {region}
                            </span> 
                        {/each}
                    </td> 
                    

                    <td style="min-width: 16rem;">
                        {#each (holiday_name.act_remove_from_regions || []) as region}
                            <span class="badge rounded-pill text-bg-primary" title="{region}">
                                {region}
                            </span> 
                        {/each}
                    </td> 

                    <td style="min-width: 16rem;">
                        {#each (holiday_name.our_region_wo_country || []) as region}
                            <span class="badge rounded-pill text-bg-light" title="{region}">
                                {region}
                            </span> 
                        {/each}
                    </td> 

                    <td style="min-width: 16rem;">
                        {#each (holiday_name.hapi_region_arr || []) as region}
                            <span class="badge rounded-pill text-bg-light" title="{region}">
                                {region}
                            </span> 
                        {/each}
                    </td> 

                    <td style="min-width: 24rem; font-size: 0.75rem;">
                        {#each (holiday_name.our_dates || []).slice(0,30) as ddate}
                            <span class="badge text-bg-light" title="{ddate}">
                                {ddate}
                            </span> 
                        {/each}
                    </td> 

                    <td style="min-width: 24rem; font-size: 0.75rem;">
                        {#each (holiday_name.ha_all || []).slice(0,30) as ddate}
                            <span class="badge text-bg-light" title="{ddate}">
                                {ddate}
                            </span> 
                        {/each}
                    </td> 

                    

                    <td class="nowrap">{holiday_name._id}</td> 
                    <td class="nowrap">{holiday_name.uuid}</td> 


                </tr>
                {/each}
            {/if}
        </tbody>

    </table>
</div>

<style>
.nowrap { white-space: nowrap; }

</style>