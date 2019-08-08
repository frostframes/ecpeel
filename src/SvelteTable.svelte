<script>

	import { beforeUpdate } from 'svelte';
	
	export let columns;
	export let rows;

	let sortOrder = 1;
	let sortKey = "";
	let sortBy = r => "";
	let showFilterHeader = columns.some(c => c.filterOptions !== undefined);
	let filterValues = {};
	let filterSettings = {};
	let columnByKey = {};

	columns.forEach(col => {
		columnByKey[col.key] = col;
	});

	beforeUpdate(function() {
		calculateFilterValues();
		showFilterHeader = columns.some(c => c.filterOptions !== undefined);
	});
	// $: console.log(filterSettings, filterValues);
	$: c_rows = rows
	  .filter(r =>
	    Object.keys(filterSettings).every(f => {
	      // console.log(f, filterSettings[f], columnByKey[f])
	      let ret =  (
	        filterSettings[f] === undefined ||
	        filterSettings[f] === columnByKey[f].filterValue(r)
				);
				return ret;
	    })
	  )
	  .map(r => ({ ...r, $sortOn: sortBy(r) }))
	  .sort((a, b) => {
	    if (a.$sortOn > b.$sortOn) return sortOrder;
	    else if (a.$sortOn < b.$sortOn) return -sortOrder;
	    return 0;
	  });
	const calculateFilterValues = () => {
	  filterValues = {};
	  columns.forEach(c => {
	    if (typeof c.filterOptions === "function") {
	      filterValues[c.key] = c.filterOptions(rows);
	    } else if (Array.isArray(c.filterOptions)) {
	      filterValues[c.key] = [...c.filterOptions];
	    }
	  });
	};
	const handleSort = col => {
	  if (col.sortable === true && typeof col.value === "function") {
	    if (sortKey === col.key) {
	      sortOrder = sortOrder === 1 ? -1 : 1;
	    } else {
	      sortOrder = 1;
	      sortKey = col.key;
	      sortBy = r => col.value(r);
	    }
	  }
	};
	if (showFilterHeader) {
	  calculateFilterValues();
	}
</script>

<style>
	table {
	  width: 100%;
	  margin-top: 10em;
	}
	.isSortable {
	  cursor: pointer;
	}
	tr, th select {
		width: 100%;
	}
	td {
		border-bottom: 1px solid #ccc;
		padding: 5px;
		width: 20%;
	}
	th {
		position: fixed;
	}
	th span {
		display: block;
		width: 100%;
	}
	thead {
		position: fixed;
		background-color: aliceblue;
		width: 100%;
		top: 5em;
		height: 5em;;
		border-bottom: 1px solid #999;
		box-shadow: 0 5px 2px 1px rgba(0, 0, 0, .2);
	}
	thead tr {
		position: fixed;
		width: 100%;
	}
	.coordCol {
		left: 0;
		width: 20%;
	}
	.titleCol {
		left: 20%;
		width: 40%;
	}
	.yearCol {
		left: 60%;
		width: 10%;
	}
	.offeringCol {
		left: 70%;
		width: 20%;
	}
	.viewCol {
		Left: 90%;
		width: 10%;
	}
	.text-center {
		text-align: center;
	}

</style>

<table>
	<thead>
	{#if showFilterHeader}
		<tr class="filters">
		  {#each columns as col}
			{#if !col.hide}
		  	<th class="{col.class !== undefined && col.class}" >
				{#if filterValues[col.key] !== undefined}
					<select bind:value={filterSettings[col.key]}>
						<option value={undefined}>--- Any ---</option>
						{#each filterValues[col.key] as option}
							<option value={option.value}>{option.name}</option>
						{/each}
					</select>
				{/if}
				<span on:click={() => handleSort(col)} class="{col.class !== undefined && col.class} {[(col.sortable ? 'isSortable' : '' ),(col.headerClass !== undefined && col.headerClass)].join(' ')}">
					{col.title}
					{#if sortKey === col.key}
						{ sortOrder === 1 ? '▲' : '▼'}
					{/if}
				</span>
			</th>
			{/if}
		  {/each}
		</tr>
	{/if}

	</thead>
	<tbody>
	{#each c_rows as row}
		<tr>
		  {#each columns as col}
			{#if !col.hide && col.basepath}
				<td class="{col.class !== undefined && col.class}">
					<a href="{col.basepath}{col.value(row)}" target="pcw">{@html col.renderValue ? col.renderValue(row) : col.value(row)}</a>
				</td>
			{:else if !col.hide}
				<td class="{col.class !== undefined && col.class}">
					{@html col.renderValue ? col.renderValue(row) : col.value(row)}
				</td>
			{/if}
		  {/each}
		</tr>
	{/each}
	</tbody>
</table>