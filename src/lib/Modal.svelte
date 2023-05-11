<!--
USAGE:
{#if showModal}
	<Modal on:close={()=>showModal=false}>
		<h2 slot='header'>
			modal
			<small><em>adjective</em>  mod·al \ˈmō-dəl\</small>
		</h2>

		<ol class="definition-list">
			<li>of or relating to modality in logic</li>
			<li>containing provisions as to the mode of procedure or the manner of taking effect —used of a contract or legacy</li>
			<li>of or relating to a musical mode</li>
			<li>of or relating to structure as opposed to substance</li>
			<li>of, relating to, or constituting a grammatical form or category characteristically indicating predication</li>
			<li>of or relating to a statistical mode</li>
		</ol>

		<a href='https://www.merriam-webster.com/dictionary/modal'>merriam-webster.com</a>
	</Modal>
{:else}
	<button on:click={()=>showModal=true}>
		show modal
	</button>
{/if}


-->
{#if opaque}
  <div class='modal-background' on:click={()=>(fire('close'))}></div>
{/if}

<div  bind:this={modal_div} class="modal modal-content" style="{max_width?'max-width:'+max_width+';':''}  {height?'height:'+height+';':''}">
    <div class="modal-header">
        <h2 class="modal-title fs-5" id="exampleModalLiveLabel" style="width: 100%;">
            <slot name='header'></slot>
        </h2>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" on:click={()=>(fire('close'))}></button>
    </div>

<!--    
    <div style="background-color:var(--bs-modal-bg); color:var(--bs-modal-color); margin:-1em; margin-bottom:1em; padding-left: 1em; padding-top: 1em;">
        <slot name='header'></slot>
        
        <button class="btn-close" style="display: inline; position: absolute; right:0; top:0;  padding: 1rem;" on:click={()=>(fire('close'))}>
        </button>
    </div>
    -->
<!--
	<button xx style="display: inline; position: absolute; right:4px; top:4px; margin: 0; padding: 1rem;" on:click={()=>(fire('close'))}>
  <i class="glyphicon glyphicon-remove"></i>
  </button>
	<slot name='header'></slot>
	<hr>
-->
    <div class="modal-body" style="overflow: auto;" >
        <slot></slot>
    </div>    
    <div class="modal-footer">
        <slot name='footer'></slot>
    </div>    

</div>

<style>
  hr {
    margin: 2rem 0;
  }
	.modal-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(90,90,90,0.3);
    z-index: 11;
	}
	.modal {
        display: flex;
        flex-flow: column;        
		position: fixed;
		left: 50%;
		top: 50%;
		width: calc(100vw - 4em);
		max-height: calc(100vh - 4em);
		/* overflow: auto; */
		transform: translate(-50%,-50%);
		background: white;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        z-index: 12;
	}
	button {
		display: block;
	}
</style>

<script context="module">
let modalsStack = []
	function handleKeydown(event) {
    // close topmost modal 
    if (event.keyCode == 27 && modalsStack && modalsStack.length>0){
      modalsStack[modalsStack.length-1]()
    }
    //if (event.keyCode == 13) onSave() // enter
	}
  let keyDownFnRef = window.addEventListener("keydown", handleKeydown);
</script>

<script>
  import { createEventDispatcher } from 'svelte';
  const fire = createEventDispatcher();
  import { onDestroy, onMount } from 'svelte';
  export let opaque = true
  export let max_width = '32em'
  export let height// = '30em'

  let modal_div 

// blur fix
/*
  function roundCssTransformMatrix(el){
    //var el = document.getElementById(element);
    var mx = window.getComputedStyle(el, null); //gets the current computed style
    el.style.transform=""; //resets the redifined matrix to allow recalculation, the original style should be defined in the class not inline.
    mx = mx.getPropertyValue("-webkit-transform") ||
    mx.getPropertyValue("-moz-transform") ||
    mx.getPropertyValue("-ms-transform") ||
    mx.getPropertyValue("-o-transform") ||
    mx.getPropertyValue("transform") || false;
    var values = mx.replace(/ |\(|\)|matrix/g,"").split(",");
    for(var v in values) {  values[v]=Math.ceil(values[v]);  }
    el.style.transform = "matrix("+values.join()+")"
  }
*/
  onMount(() => {
//    roundCssTransformMatrix(modal_div)
    //if (!modalsStack) modalsStack = []
    modalsStack.push(close)
  });

  onDestroy(() => {
    //console.log('onDestroy modal')
    if (modalsStack) modalsStack.pop()
  });

  //console.log("Modl ");
  //window.addEventListener('keydown', function(e){
  //  console.log("Modl keydown");
  //});

  function close(event) {
    //event.stopPropagation();
    //console.log('closing modal event')
    fire('close')
    return false
  }
</script>