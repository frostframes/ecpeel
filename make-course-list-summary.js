const fs = require('fs');
const filteredKeys = ['id', 'coordinator', 'title', 'offering'];

let courses = [];
let path = './public/data/courses';

fs.readdir(path, (err, files) => {
    files.forEach((file, i) => {
        let loaded = fs.readFileSync(`${path}/${file}`);
        let loadedJSON = JSON.parse(loaded);

        // Strip unneccessary properties
        for (course of loadedJSON) {
                    let filtered = Object.keys(course)
              .filter(key => filteredKeys.includes(key))
              .reduce((obj, key) => {
                obj[key] = course[key];
                return obj;
              }, {});

            // Store year as a number
            filtered.year = Number(filtered.offering.substr(6, 4));

            // Remove email from coordinator name, if present
            let emailIndex = filtered.coordinator.indexOf('Email:');
            filtered.coordinator = emailIndex === -1 ? filtered.coordinator : filtered.coordinator.substr(0, emailIndex);

            // Remove other coordinator names, if present
            let coordIndex = filtered.coordinator.indexOf('Course Coordinator');
            filtered.coordinator = coordIndex === -1 ? filtered.coordinator : filtered.coordinator.substr(0, coordIndex);
            
	    // Remove leading Lecturer: text
	    filtered.coordinator = filtered.coordinator.indexOf('Lecturer: ') === -1 ? filtered.coordinator : filtered.coordinator.substr(10) + ' (lecturer)';
	    
            // Add to courses array
            courses = [...courses, filtered];
        }

        // All files have been combined
        if (i + 1 === files.length) {
            console.log(courses[0]);
            fs.writeFileSync(`./public/data/courses-summary.json`, JSON.stringify(courses));
        }
    });
});
