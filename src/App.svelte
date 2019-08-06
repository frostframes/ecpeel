<script>
	export let name;
	import SvelteTable from "./SvelteTable.svelte";
  	import faker from "faker";
  	faker.seed(5);
	  const columns = [
    {
      key: "id",
      title: "ID",
      value: v => v.id,
      sortable: true,
      filterOptions: rows => {
        // generate groupings of 0-10, 10-20 etc...
        let nums = {};
        rows.forEach(row => {
          let num = Math.floor(row.id / 10);
          if (nums[num] === undefined)
            nums[num] = { name: `${num * 10} to ${(num + 1) * 10}`, value: num };
        });
        // fix order
        nums = Object.entries(nums)
          .sort()
          .reduce((o, [k, v]) => ((o[k] = v), o), {});
        return Object.values(nums);
      },
      filterValue: v => Math.floor(v.id / 10),
      headerClass: 'text-left'
    },
    {
      key: "coordinator",
      title: "COORDINATOR",
      value: v => v.coordinator,
      sortable: true,
      filterOptions: rows => {
        // use first letter of coordinator to generate filter
        let letrs = {};
        rows.forEach(row => {
          let letr = row.coordinator.charAt(0);
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
      filterValue: v => v.coordinator.charAt(0).toLowerCase()
    },
    {
      key: "title",
      title: "CODE/TITLE",
      value: v => v.title,
      sortable: true,
      filterOptions: rows => {
        // use first letter of title to generate filter
        let letrs = {};
        rows.forEach(row => {
          let letr = row.title.charAt(0);
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
      filterValue: v => v.title.charAt(0).toLowerCase()
    },
    {
      key: "offering",
      title: "OFFERING",
      value: v => v.offering,
      sortable: true,
      filterOptions: rows => {
        // use first letter of offering to generate filter
        let letrs = {};
        rows.forEach(row => {
          let letr = row.offering;
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
      filterValue: v => v.offering.toLowerCase()
    }
  ];
  const rows = [
    {"id":101522,"code":"COMU7008","title":"COMU7008 - Thesis Part A","coordinator":"","offering":"Semester: Sem 2 2019  To Sem 1 2020","location":"Location: St Lucia","mode":"Mode: Internal"},{"id":101553,"code":"EDUC7072","title":"EDUC7072 - Psychology Curriculum: Professional Practice","coordinator":"Course Coordinator: Associate Professor Jason LodgeEmail: jason.lodge@uq.edu.au","offering":"Semester: Sem 2 2019","location":"Location: St Lucia","mode":"Mode: External"},{"id":101583,"code":"PSYC7901","title":"PSYC7901 - Psychology: Brain and Cognition","coordinator":"Course Coordinator: Professor Ross CunningtonEmail: r.cunnington@uq.edu.au","offering":"Semester: Sem 2 2019","location":"Location: St Lucia","mode":"Mode: External"},{"id":101589,"code":"NURS7903","title":"NURS7903 - Paediatric and Neonatal Cardiovascular and Specialty Care","coordinator":"Course Coordinator: Ms Marie McLaughlinEmail: m.mclaughlin@uq.edu.au","offering":"Semester: Sem 2 2019","location":"Location: St Lucia","mode":"Mode: External"},{"id":101585,"code":"STAT3006","title":"STAT3006 - Statistical Learning","coordinator":"Course Coordinator: Dr Ian WoodEmail: i.wood1@uq.edu.au","offering":"Semester: Sem 2 2019","location":"Location: St Lucia","mode":"Mode: Internal"},{"id":101586,"code":"NURS7303","title":"NURS7303 - Working in Partnership with Families","coordinator":"Course Coordinator: Ms Marie McLaughlinEmail: m.mclaughlin@uq.edu.au","offering":"Semester: Sem 2 2019","location":"Location: St Lucia","mode":"Mode: External"},{"id":101587,"code":"NURS7503","title":"NURS7503 - Rural and Remote Nursing: Clinical Practice","coordinator":"Course Coordinator: Ms Marie McLaughlinEmail: m.mclaughlin@uq.edu.au","offering":"Semester: Sem 2 2019","location":"Location: St Lucia","mode":"Mode: External"},{"id":101588,"code":"NURS7603","title":"NURS7603 - Chronic Disease Management in the Primary Health Care Context","coordinator":"Course Coordinator: Ms Marie McLaughlinEmail: m.mclaughlin@uq.edu.au","offering":"Semester: Sem 2 2019","location":"Location: St Lucia","mode":"Mode: External"},{"id":101590,"code":"MEDI4012","title":"MEDI4012 - Paediatrics & Child Health","coordinator":"Course Coordinator: Associate Professor Mark CoulthardEmail: m.coulthard@uq.edu.au","offering":"Semester: Sem 2 2019","location":"Location: Herston","mode":"Mode: Internal"},{"id":101593,"code":"MEDI7402","title":"MEDI7402 - Paediatrics & Child Health","coordinator":"Course Coordinator: Associate Professor Mark CoulthardEmail: m.coulthard@uq.edu.au","offering":"Semester: Sem 2 2019","location":"Location: Herston","mode":"Mode: Internal"},{"id":101576,"code":"ARCH7042","title":"ARCH7042 - Architectural Research 4","coordinator":"Course Coordinator: Dr Paola LeardiniEmail: p.leardini@uq.edu.auCourse Coordinator: Dr Andrew WilsonEmail: a.wilson@uq.edu.au","offering":"Semester: Sem 2 2019","location":"Location: St Lucia","mode":"Mode: Internal"},{"id":101592,"code":"MEDI7404","title":"MEDI7404 - Medical Specialties","coordinator":"Course Coordinator: Dr Michael PereraEmail: michael.perera@uq.edu.au","offering":"Semester: Sem 2 2019","location":"Location: Herston","mode":"Mode: Internal"},{"id":101595,"code":"NURS3001","title":"NURS3001 - Clinical Practice 5","coordinator":"Course Coordinator: Ms Bernadette WatsonEmail: b.watson@uq.edu.au","offering":"Semester: Sem 2 2019","location":"Location: St Lucia","mode":"Mode: Internal"},{"id":101579,"code":"RBUS3999","title":"RBUS3999 - Business Industry Placement","coordinator":"Course Coordinator: Professor Polly ParkerEmail: p.parker@uq.edu.au","offering":"Semester: Sem 1 2019","location":"Location: St Lucia","mode":"Mode: Intensive"},{"id":101591,"code":"MEDI7405","title":"MEDI7405 - Surgical Specialties","coordinator":"Course Coordinator: Professor Mark SmithersEmail: m.smithers@uq.edu.au","offering":"Semester: Sem 2 2019","location":"Location: Herston","mode":"Mode: Internal"},{"id":101580,"code":"PLAN3001","title":"PLAN3001 - Applied Research Methods","coordinator":"Course Coordinator: Dr Karen McNamaraEmail: karen.mcnamara@uq.edu.au","offering":"Semester: Sem 2 2019","location":"Location: St Lucia","mode":"Mode: Internal"},{"id":101613,"code":"NURS6004","title":"NURS6004 - Thesis (part-time study)","coordinator":"","offering":"Semester: Sem 2 2019  To Sem 1 2020","location":"Location: St Lucia","mode":"Mode: Internal"},{"id":101601,"code":"POLS7707","title":"POLS7707 - Final Project","coordinator":"","offering":"Semester: Sem 2 2019","location":"Location: St Lucia","mode":"Mode: Internal"},{"id":101603,"code":"WRIT1999","title":"WRIT1999 - Effective Thinking and Writing","coordinator":"Course Coordinator: Mr David KinkeadEmail: d.kinkead@uq.edu.au","offering":"Semester: Sem 2 2019","location":"Location: St Lucia","mode":"Mode: Internal"},{"id":101606,"code":"RBUS6997","title":"RBUS6997 - Honours Thesis B","coordinator":"Course Coordinator: Dr Kelvin TanEmail: j.tan2@uq.edu.au","offering":"Semester: Sem 2 2019  To Sem 1 2020","location":"Location: St Lucia","mode":"Mode: Internal"},{"id":101610,"code":"MIDW3102","title":"MIDW3102 - Clinical Midwifery Practice 5","coordinator":"Course Coordinator: Ms Peta Winters-ChangEmail: p.winterschang@uq.edu.au","offering":"Semester: Sem 2 2019","location":"Location: St Lucia","mode":"Mode: Internal"},{"id":101602,"code":"OCTY3208","title":"OCTY3208 - Occupational Therapy Clinical Practice and Clinical Reasoning","coordinator":"Course Coordinator: Associate Professor Jodie CopleyEmail: j.copley@uq.edu.au","offering":"Semester: Sem 2 2019","location":"Location: St Lucia","mode":"Mode: Internal"},{"id":101608,"code":"BIOC6513","title":"BIOC6513 - Honours Project","coordinator":"Course Coordinator: Dr Michael LandsbergEmail: m.landsberg1@uq.edu.auCourse Coordinator: Dr Benjamin SchulzEmail: b.schulz@uq.edu.au","offering":"Semester: Sem 2 2019  To Sem 1 2021","location":"Location: St Lucia","mode":"Mode: Internal"},{"id":101607,"code":"LAWS7180","title":"LAWS7180 - Clinical Legal Education","coordinator":"Course Coordinator: Ms Monica TaylorEmail: m.taylor9@uq.edu.au","offering":"Semester: Sem 2 2019","location":"Location: St Lucia","mode":"Mode: Internal"},{"id":101635,"code":"RBUS7981","title":"RBUS7981 - Research Project","coordinator":"Course Coordinator: Dr Erin GallagherEmail: e.gallagher1@uq.edu.au","offering":"Semester: Sem 2 2019","location":"Location: St Lucia","mode":"Mode: Internal"}
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
