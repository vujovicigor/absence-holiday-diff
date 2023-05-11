<script>
	import { selectedCountry } from '$lib/store/selectedCountry.js'
	import { fetch2 } from '$lib/fetch2.js'
	import { tick } from 'svelte';
	let holidays = {}
	//let countries = []
	function ymd(date) {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2) 
			month = '0' + month;
		if (day.length < 2) 
			day = '0' + day;

		return [year, month, day].join('-');
	}	
	async function get(country){
		let [resp, err] = await fetch2('GET', `public_holidays_range/${String(country).toLowerCase()}/2000/2111`)
		if (!err){
			holidays = resp
		}
	
		//let [countriesResp, err2] = await fetch2('GET','public_countries')
		//countries = countriesResp
		//console.log('countries',countries);
	}
	//get()
	$: if ($selectedCountry){
		get($selectedCountry)
	}

	// public_countries
	/*
	fetch('https://daysapi.com/api/v2/public_holidays_range/de/2000/2111')
  	.then(response => response.json())
  	.then(data => holidays = data);
	  */
	//$: console.log(holidays)
	
	const months = Array.from({length: 12}, (e, i) => {
		 return new Date(null, i + 1, null).toLocaleDateString("default", {month: "long"});
	})	
	
	let dayOfWeekString = ['Sunday', 'Monday', 'Tday', 'Wendsday', 'Thurstday', 'Friday', 'Saturday']
				
	function isLeapYear(year) {
			return new Date(year, 1, 29).getDate() === 29;
	}	
	
	/**
     * @param {number} start
     * @param {number} end
     * @param {number} month
     * @param {number} year
     */
	function range(start, end, month, year) {
		return Array(end - start + 1).fill().map((_, idx) => {
			let d = new Date(year, month, start + idx);
			if ((start + idx == 29) && (d.getDate() !== 29)){
					d = null				
			}
			//console.log(d)
			//let dayOfWeekStringz = d?d.toLocaleString("default", {weekday: "long"}):null;
			
			return { 
				ix:d?start + idx:'', 
				date: d, 
				dayOfWeek: d?.getDay(), 
				d: d?.getDate(),
				m: d?.getMonth(),
				y: d?.getFullYear(),
				ymd:ymd(d),
				dayOfWeekString:dayOfWeekString[d?.getDay()]// d?d.toLocaleString("default", {weekday: "long"}):''
			}
		})
	}
	//var result = range(9, 18); // [9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
	
	let daysInYear = 366;
	const startYear = 2000
	let daysArray = []
	for (let i=0;i<99;i++) {
		daysArray.push([
			range(1, 31, 0, startYear+i), 
			range(1, 29, 1, startYear+i), 
			range(1, 31, 2, startYear+i), 
			range(1, 30, 3, startYear+i), 
			range(1, 31, 4, startYear+i), 
			range(1, 30, 5, startYear+i), 
			range(1, 31, 6, startYear+i), 
			range(1, 31, 7, startYear+i), 
			range(1, 30, 8, startYear+i), 
			range(1, 31, 9, startYear+i), 
			range(1, 30, 10, startYear+i), 
			range(1, 31, 11, startYear+i)  
		])
	}

	//console.log(daysArray);	
	let waiting = true
//	setInterval(()=>{waiting=false}, 100)
	setInterval(()=>{tick().then(()=>{waiting=false})}, 100)
</script>

<style>
/*
:global(body) {
	max-width: none !important;
	height: 100vh !important;
	margin: 0;
	padding: 0;
}
*/
.wrapper {
	display: grid;
	grid-template-columns: 4rem repeat(366, 2rem);
	grid-template-rows: repeat(20, 1.2rem);
	grid-gap: 0;
	background-color: #fff;
	color: #444;
	width: calc(366rem * 2 + 4rem);
}

.box {
	background-color: #fff;
	color: #111;
	cursor:pointer;
	padding: 0px;
	font-size: 100%;
	text-align:center;
	border: solid 0px grey
}

.box:focus {
    background-color: Aqua;
}
	
.m{
	position:sticky;
	#top:10px;
	left:4rem;
	#display:inline-block;
	width:66rem;
	background-color: #fff;
}
.hed{
	width:732rem;
	display:flex;
	position: sticky;
	top: 0;	
	background-color: #fff;
	z-index: 2;
}
.main{
	overflow:auto;
	width:100vw;
	height:100%;
}
.day6{
    /*background-color:#eee*/
	font-weight: 500;
}
.day0{
    /*background-color:#e0e0e0*/
    font-weight: 800;
}
.vline {
    border-left:solid 1px grey;
}
.red {
    background-color:#f08080		
}
.box:not(.red, .day0, .day6 ){
    opacity: 0.4;
}
.year {
	position:sticky; 
	left:0; 
	background-color: #fff;
	z-index: 1;
}

</style>

<div class="main">
	{#if waiting}
		<center>
			<div class="spinner-border" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
		</center>
	{/if}
	{#if !waiting}
		<div class="hed">
			<div style="width:4rem; background-color: #fff;"></div>
			{#each daysArray[0] as monthArray, ix}
				<div class="m" style="width:{(ix==11)?10:monthArray.length*2}rem" >{months[ix]}</div>
			{/each}
		</div>


	
		<div class="wrapper">
			{#each daysArray as yearArray, yearIx}
				<div class="year">{startYear+yearIx}
				</div>
				{#each yearArray as monthArray, monthIx}
					{#each monthArray as d, dayIx}
						<div class="box a day{d.dayOfWeek}" 
							class:vline={d?.ix===1} 
							class:red={holidays[yearIx]?.officialDates[d?.ymd]} 
							title="{holidays[yearIx]?.officialDates[d?.ymd] || d.dayOfWeekString }" 
							tabindex="{1 + yearIx + dayIx*100 + monthIx*100*100}" 
							>{d.ix}
						</div>
					{/each}
				{/each}
			{/each}
		</div>
	{/if}
</div>