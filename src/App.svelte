<script>
	export let name;
	import SvelteTable from './SvelteTable.svelte';
	  
	const columns = [
		{key: 'id', title: 'ID', value: v => v['id'], basepath: 'https://course-profiles.uq.edu.au/student_section_loader/section_1/' },
		makeFilter('coordinator', 'COORDINATOR', {}),
		makeFilter('title', 'CODE/TITLE', {filterByLetter: true}),
		makeFilter('offering', 'offering', {})
	];

	let rows = [];
	
	function makeFilter(strKey, strTitle, options) {
		return {
			key: strKey,
			title: strTitle,
			value: v => v[strKey],
			sortable: true,
			filterOptions: rows => {
				// use first letter to generate filter
				let letrs = {};
				rows.forEach(row => {
					let letr = options.filterByLetter ? row[strKey].charAt(0) : row[strKey];
				if (letrs[letr] === undefined)
					letrs[letr] = {
						name: `${letr}`,
					value: letr.toLowerCase()
					};
				});
				// fix order
				letrs = Object.entries(letrs)
				.sort()
				.reduce((o, [k, v]) => ((o[k] = v), o), {});
				return Object.values(letrs);
			},
			filterValue: v => options.filterByLetter ? v[strKey].charAt(0).toLowerCase() : v[strKey].toLowerCase()
		};
	}

  const url = './data/courses-summary.json'; 
  fetch(url)
    .then(res => res.json())
    .then(data => {
		rows = data;
    }).catch(err => {
		// Provide dummy data as a fallback
		rows = [{"id":99523,"title":"Courses file not found","coordinator":"Elske van de Fliert","offering":"Sem 2 2019","year":2019},{"id":99506,"title":"MOLI7106 - Research Project","coordinator":"Karine Mardon","offering":"Sem 2 2019","year":2019},{"id":99508,"title":"PHRM3032 - Social & Professional Aspects of Pharmacy B2","coordinator":"Sam Hollingworth","offering":"Sem 2 2019","year":2019},{"id":99522,"title":"MUSC1100 - Large Ensembles A","coordinator":"Warwick Potter","offering":"Sem 2 2019","year":2019},{"id":99505,"title":"ANTH2270 - Migration, Culture and Identity","coordinator":"Gerhard Hoffstaedter","offering":"Sem 2 2019","year":2019},{"id":99519,"title":"ENVM3211 - Environmental Toxicology and Monitoring","coordinator":"Sharon Grant","offering":"Sem 2 2019","year":2019},{"id":99518,"title":"POLS6305 - Honours Research Thesis Part A","coordinator":"Alissa Macoun","offering":"Sem 1 2019  To Sem 2 2019","year":2019},{"id":99509,"title":"PHRM3052 - Biological Fate of Drugs B","coordinator":"Christine Staatz","offering":"Sem 2 2019","year":2019},{"id":99504,"title":"COMU3005 - Media Cultures","coordinator":"Adrian Athique Mabbott Athique","offering":"Sem 2 2019","year":2019},{"id":99513,"title":"COMU7016 - Participatory Media Production","coordinator":"Elske van de Fliert","offering":"Sem 2 2019","year":2019}];
	});
	
</script>
<style>
	h1 {
		color: darkslateblue;
	}
</style>
<header>
	<h1>{name}</h1>
</header>
<section>
	<SvelteTable columns={columns} rows={rows}></SvelteTable>
</section>
