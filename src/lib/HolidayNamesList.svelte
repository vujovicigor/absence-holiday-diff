<script>
// @ts-nocheck
	import { selectedCountry } from '$lib/store/selectedCountry.js'
	import { fetch2 } from '$lib/fetch2.js'
    import { isEqual, cloneJSON } from '$lib/isEqual.js'
    import { compare } from 'fast-json-patch';
    import Modal from '$lib/Modal.svelte';
    import Datesgrid from '$lib/Datesgrid.svelte';
    
	let holiday_names = []
    let holiday_names_original = []
    let show_only_public_holidays = false
    let showModal = false
    let currentRow
    let showDatesGridModal = false
    function save(){
        var diff = compare(holiday_names_original, holiday_names);
        console.log('diff', diff)
    }
    
	async function get(country){
		let [resp, err] = await fetch2('GET', `public_holiday_names/${country}`)
		if (!err){
			holiday_names = resp
            holiday_names_original = cloneJSON(resp)
		}
	
		//let [countriesResp, err2] = await fetch2('GET','public_countries')
		//countries = countriesResp
		//console.log('countries',countries);
	}
    //get('RS')
	$: if ($selectedCountry){
		get($selectedCountry)
	}
    $: isDirty = (!isEqual(holiday_names, holiday_names_original))
    $: cnt = holiday_names.filter(item => !show_only_public_holidays || item.public ).length

    function enableRow(row){
        currentRow = cloneJSON(row)
        showModal = true
    }

    async function saveHoliday(){
        let [resp, err] = await fetch2('PATCH', `public_holiday_regions`, currentRow)
        get($selectedCountry)
    }

</script>
<div class="form-check">
    <input class="form-check-input" type="checkbox" bind:checked={show_only_public_holidays} id="show_only_public_holidays">
    <label class="form-check-label" for="show_only_public_holidays">
      Show only public holidays
    </label>
</div>

<div style="flex:1; overflow:auto">
    <table class="table table-hover table-striped">
        <thead style="position: sticky; top: 0; background: var(--bs-body-bg);"> 
            <tr> 
                <th>Public</th> 
                <th>Holiday name (English)</th> 
                {#each (holiday_names[0]?.holiday_local_names || []) as holiday_local}
                    <th>
                        Holiday name ({holiday_local.lang})
                    </th>
                {/each}
                <th>All <br>Regions</th> 
                <th>Regions where holiday is observed</th> 
                <th>Sample official dates</th> 
                <th>Sample observed dates</th> 
                <th>Notes</th> 
                <th>Link</th> 

            </tr> 
        </thead>
        <tbody>
            {#each holiday_names as holiday_name}
            {#if !show_only_public_holidays || holiday_name.public}
            <tr on:click|stopPropagation={()=>enableRow(holiday_name)}> 
                <td>
                    <input class="form-check-input" type="checkbox" bind:checked={holiday_name.public}>
                </td> 
                <td>{holiday_name.name}</td> 
                {#each (holiday_name.holiday_local_names || []) as holiday_local}
                    <td>
                        {holiday_local.name}
                    </td>
                {/each}
                <td>
                    <input class="form-check-input" type="checkbox" bind:checked={holiday_name.all_regions}>
                </td> 
                <td>
                    {#if !holiday_name.all_regions}
                        {#each holiday_name.regions_full as region}
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <span class="badge rounded-pill" style="cursor: pointer" on:click={()=>region.checked = !region.checked}
                            class:text-bg-primary={region.checked} 
                            class:text-bg-light={!region.checked} 
                            title="{region.name}">{region.name}({region.code})</span> 
                        {/each}
                    {:else}
                    <span class="badge rounded-pill text-bg-primary">All regions</span>
                        
                    {/if}
                </td> 
                <td>
                    <span class="badge rounded-pill text-bg-light" style="white-space: nowrap;">{holiday_name.official_date}</span>
                </td> 
                <td>
                    <span class="badge rounded-pill" style="white-space: nowrap;" 
                    class:text-bg-warning={holiday_name.observed_date != holiday_name.official_date}
                    class:text-bg-light={holiday_name.observed_date == holiday_name.official_date}
                    >{holiday_name.observed_date}</span>
                </td> 
                <td>
                </td> 
                <td>
                </td> 
            </tr>
            {/if}
            {/each}

        </tbody>
        {#if holiday_names?.length}
        <tfoot style="position: sticky; bottom: 0; background: var(--bs-body-bg);"> 
            <tr> 
                <th colspan="2">Total: {cnt}</th> 
                {#each (holiday_names[0]?.holiday_local_names || []) as holiday_local}
                    <th>
                    </th>
                {/each}
                <th></th> 
                <th></th> 
                <th></th> 
                <th></th> 
                <th></th> 
                <th></th> 
            </tr> 
        </tfoot>  
        {/if}      
    </table>
</div>
<button disabled={!isDirty} type="button" class="btn btn-primary" on:click={save}>Save changes</button>
<button class="btn btn-primary"  on:click={ ()=>{ currentRow={

    "holiday_uuid": null,
    "name": null,
    "public": null,
    "country_code": "AG",
    "regions": [],
    "holiday_local_names": [
        {
            "lang": "it",
            "name": "felicia nuova"
        }
    ],
    "regions_full": [
        {
            "code": "AG-03",
            "name": "Saint George",
            "checked": true
        },
        {
            "code": "AG-04",
            "name": "Saint John",
            "checked": true
        },
        {
            "code": "AG-05",
            "name": "Saint Mary",
            "checked": true
        },
        {
            "code": "AG-06",
            "name": "Saint Paul",
            "checked": true
        },
        {
            "code": "AG-07",
            "name": "Saint Peter",
            "checked": true
        },
        {
            "code": "AG-08",
            "name": "Saint Philip",
            "checked": true
        },
        {
            "code": "AG-10",
            "name": "Barbuda",
            "checked": true
        },
        {
            "code": "AG-11",
            "name": "Redonda",
            "checked": true
        }
    ],
    "all_regions": true
}; showModal=true } }>
    Add new mail template <i class="glyphicon glyphicon-plus"></i>
  </button>



{#if showModal}
<Modal on:close={()=>showModal=false} max_width="100%" height="100%" width="100%" >
    <svelte:fragment slot='header'>
         Holiday details
    </svelte:fragment>
    <div on:close={()=>showModal=false} >
        <div class="form-floating mb-3">
            <input type="text" class="form-control" id="floatingInput1" placeholder="Holiday name on english" bind:value={currentRow.name}>
            <label for="floatingInput1">Holiday name (English)</label>
        </div>
        {#each (currentRow.holiday_local_names || []) as holiday_local, ix}
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="floatingInputtransl{ix}" bind:value={holiday_local.name} placeholder="Holidan name on local dominant language({holiday_local.lang})">
                <label for="floatingInputtransl{ix}">Holiday name ({holiday_local.lang} translation)</label>
            </div>
        {/each}        
        <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox" value="checked" id="flexCheckDefault1" bind:checked={currentRow.public}>
            <label class="form-check-label" for="flexCheckDefault1">
                Is Public holiday (non working day)
            </label>
        </div>
        <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox" value="checked" id="flexCheckDefault2" bind:checked={currentRow.all_regions}>
            <label class="form-check-label" for="flexCheckDefault2">
                Holiday is valid for all subregions
            </label>            
        </div>
        {#if currentRow.regions_full?.length}
        <div class="mb-3">
            <label >Subregions where holiday is observed</label><br>
            {#each currentRow.regions_full as region}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <span class="badge rounded-pill" style="cursor: pointer" on:click={()=>region.checked = !region.checked}
                class:text-bg-primary={region.checked} 
                class:text-bg-light={!region.checked} 
                title="{region.name}">{region.name}({region.code})</span> 
            {/each}
        </div>
        {/if}

        <!--
                   

        Public	Holiday name (English)	Holiday name (it)	All
        Regions	Regions where holiday is observed	Sample official dates	Sample observed dates	Notes	Link
-->
        <div class="form-floating mb-3">
            <input type="text" class="form-control" id="floatingInput1" placeholder="Link to official source" bind:value={currentRow.link}>
            <label for="floatingInput1">Link (source of information)</label>
        </div>
        
        <div class="form-floating">
            <textarea style="height:8rem" class="form-control" bind:value={currentRow.notes}  placeholder="Leave a comment here" id="floatingTextarea"></textarea>
            <label for="floatingTextarea">Notes</label>
        </div>     
        {JSON.stringify(currentRow, null, 4)}   
    </div>
    <svelte:fragment slot='footer'>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" on:click={saveHoliday}>Save changes</button>
    </svelte:fragment>
</Modal>
{/if}

<button type="button" class="btn btn-primary" on:click={()=>showDatesGridModal=!showDatesGridModal}>showDatesGridModal</button>
{#if showDatesGridModal}
    <Modal on:close={()=>showDatesGridModal=false} max_width="100%" height="100%" width="100%">
        <svelte:fragment slot='header'>
            <ul class="nav nav-tabs">
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="#">Info</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Dates</a>
                </li>
            </ul>
        </svelte:fragment>
        <Datesgrid on:close={()=>showDatesGridModal=false} ></Datesgrid>

        <svelte:fragment slot='footer'>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" on:click={saveHoliday}>Save changes</button>
        </svelte:fragment>
    </Modal>
{/if}