<script>
	export let name;
	import SvelteTable from './SvelteTable.svelte';
	  
	const columns = [
		makeFilter('coordinator', 'COORDINATOR', true),
		makeFilter('title', 'CODE/TITLE', true),
		makeFilter('offering', 'offering', false)
	];

	function makeFilter(strKey, strTitle, boolFirst) {
		return {
			key: strKey,
			title: strTitle,
			value: v => v[strKey],
			sortable: true,
			filterOptions: rows => {
				// use first letter to generate filter
				let letrs = {};
				rows.forEach(row => {
				let letr = boolFirst ? row[strKey].charAt(0) : row[strKey];
				if (letrs[letr] === undefined)
					letrs[letr] = {
					name: `${letr.toUpperCase()}`,
					value: letr.toLowerCase()
					};
				});
				// fix order
				letrs = Object.entries(letrs)
				.sort()
				.reduce((o, [k, v]) => ((o[k] = v), o), {});
				return Object.values(letrs);
			},
			filterValue: v => boolFirst ? v[strKey].charAt(0).toLowerCase() : v[strKey].toLowerCase()
		};
	}

	function makeRangeFilter(strKey, strTitle) {
		return {
			key: strKey,
			title: strTitle,
			value: v => v[strKey],
			sortable: true,
			filterOptions: rows => {
				// generate groupings of 0-10, 10-20 etc...
				let nums = {};
				rows.forEach(row => {
				let num = Math.floor(row[strKey] / 100);
				if (nums[num] === undefined)
					nums[num] = { name: `${num * 100} to ${(num + 1) * 100}`, value: num };
				});
				// fix order
				nums = Object.entries(nums)
				.sort()
				.reduce((o, [k, v]) => ((o[k] = v), o), {});
				return Object.values(nums);
			},
			filterValue: v => Math.floor(v[strKey] / 100),
			headerClass: 'text-left'
		};
	}

	const rows = [
		{"id":101522,"code":"COMU7008","title":"COMU7008 - Thesis Part A","coordinator":"","offering":"Sem 2 2019  To Sem 1 2020","location":"Location: St Lucia","mode":"Mode: Internal"},{"id":101553,"code":"EDUC7072","title":"EDUC7072 - Psychology Curriculum: Professional Practice","coordinator":"Associate Professor Jason Lodge","offering":"Sem 2 2019","location":"Location: St Lucia","mode":"Mode: External"},{"id":101583,"code":"PSYC7901","title":"PSYC7901 - Psychology: Brain and Cognition","coordinator":"Professor Ross Cunnington","offering":"Sem 2 2019","location":"Location: St Lucia","mode":"Mode: External"},{"id":101589,"code":"NURS7903","title":"NURS7903 - Paediatric and Neonatal Cardiovascular and Specialty Care","coordinator":"Ms Marie McLaughlin","offering":"Sem 2 2019","location":"Location: St Lucia","mode":"Mode: External"},{"id":101585,"code":"STAT3006","title":"STAT3006 - Statistical Learning","coordinator":"Dr Ian Wood","offering":"Sem 2 2019","location":"Location: St Lucia","mode":"Mode: Internal"},{"id":101586,"code":"NURS7303","title":"NURS7303 - Working in Partnership with Families","coordinator":"Ms Marie McLaughlin","offering":"Sem 2 2019","location":"Location: St Lucia","mode":"Mode: External"},{"id":101587,"code":"NURS7503","title":"NURS7503 - Rural and Remote Nursing: Clinical Practice","coordinator":"Ms Marie McLaughlin","offering":"Sem 2 2019","location":"Location: St Lucia","mode":"Mode: External"},{"id":101588,"code":"NURS7603","title":"NURS7603 - Chronic Disease Management in the Primary Health Care Context","coordinator":"Ms Marie McLaughlin","offering":"Sem 2 2019","location":"Location: St Lucia","mode":"Mode: External"},{"id":101590,"code":"MEDI4012","title":"MEDI4012 - Paediatrics & Child Health","coordinator":"Associate Professor Mark Coulthard","offering":"Sem 2 2019","location":"Location: Herston","mode":"Mode: Internal"},{"id":101593,"code":"MEDI7402","title":"MEDI7402 - Paediatrics & Child Health","coordinator":"Associate Professor Mark Coulthard","offering":"Sem 2 2019","location":"Location: Herston","mode":"Mode: Internal"},{"id":101576,"code":"ARCH7042","title":"ARCH7042 - Architectural Research 4","coordinator":"Dr Paola LeardiniDr Andrew Wilson","offering":"Sem 2 2019","location":"Location: St Lucia","mode":"Mode: Internal"},{"id":101592,"code":"MEDI7404","title":"MEDI7404 - Medical Specialties","coordinator":"Dr Michael Perera","offering":"Sem 2 2019","location":"Location: Herston","mode":"Mode: Internal"},{"id":101595,"code":"NURS3001","title":"NURS3001 - Clinical Practice 5","coordinator":"Ms Bernadette Watson","offering":"Sem 2 2019","location":"Location: St Lucia","mode":"Mode: Internal"},{"id":101579,"code":"RBUS3999","title":"RBUS3999 - Business Industry Placement","coordinator":"Professor Polly Parker","offering":"Sem 1 2019","location":"Location: St Lucia","mode":"Mode: Intensive"},{"id":101591,"code":"MEDI7405","title":"MEDI7405 - Surgical Specialties","coordinator":"Professor Mark Smithers","offering":"Sem 2 2019","location":"Location: Herston","mode":"Mode: Internal"},{"id":101580,"code":"PLAN3001","title":"PLAN3001 - Applied Research Methods","coordinator":"Dr Karen McNamara","offering":"Sem 2 2019","location":"Location: St Lucia","mode":"Mode: Internal"},{"id":101613,"code":"NURS6004","title":"NURS6004 - Thesis (part-time study)","coordinator":"","offering":"Sem 2 2019  To Sem 1 2020","location":"Location: St Lucia","mode":"Mode: Internal"},{"id":101601,"code":"POLS7707","title":"POLS7707 - Final Project","coordinator":"","offering":"Sem 2 2019","location":"Location: St Lucia","mode":"Mode: Internal"},{"id":101603,"code":"WRIT1999","title":"WRIT1999 - Effective Thinking and Writing","coordinator":"Mr David Kinkead","offering":"Sem 2 2019","location":"Location: St Lucia","mode":"Mode: Internal"},{"id":101606,"code":"RBUS6997","title":"RBUS6997 - Honours Thesis B","coordinator":"Dr Kelvin Tan","offering":"Sem 2 2019  To Sem 1 2020","location":"Location: St Lucia","mode":"Mode: Internal"},{"id":101610,"code":"MIDW3102","title":"MIDW3102 - Clinical Midwifery Practice 5","coordinator":"Ms Peta Winters-Chang","offering":"Sem 2 2019","location":"Location: St Lucia","mode":"Mode: Internal"},{"id":101602,"code":"OCTY3208","title":"OCTY3208 - Occupational Therapy Clinical Practice and Clinical Reasoning","coordinator":"Associate Professor Jodie Copley","offering":"Sem 2 2019","location":"Location: St Lucia","mode":"Mode: Internal"},{"id":101608,"code":"BIOC6513","title":"BIOC6513 - Honours Project","coordinator":"Dr Michael Landsberg","offering":"Sem 2 2019  To Sem 1 2021","location":"Location: St Lucia","mode":"Mode: Internal"},{"id":101607,"code":"LAWS7180","title":"LAWS7180 - Clinical Legal Education","coordinator":"Ms Monica Taylor","offering":"Sem 2 2019","location":"Location: St Lucia","mode":"Mode: Internal"},{"id":101635,"code":"RBUS7981","title":"RBUS7981 - Research Project","coordinator":"Dr Erin Gallagher","offering":"Sem 2 2019","location":"Location: St Lucia","mode":"Mode: Internal"}
	];

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
