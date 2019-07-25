const $ = require('cheerio');
const fs = require('fs');
const request = require('request-promise');
const url = 'https://my.uq.edu.au/programs-courses/search.html?keywords=&searchType=course&archived=true&CourseParameters%5Bsemester%5D=';

request(url)
  .then(function(html){
    //success!
    const courses = $('td[colspan=4] > a', html);
    let courseUrls = [];
    for (var courseId in courses) {
        if (courses.hasOwnProperty(courseId)) {
            let course = courses[courseId];
            if (course.attribs !== undefined && course.attribs.href !== undefined) {
                let courseUrl = course.attribs.href;
                courseUrls.push(courseUrl.substring(courseUrl.indexOf('=') + 1));
            }
        }
    }
    fs.writeFileSync('./data/codes.json', JSON.stringify(courseUrls));
  })
  .catch(function(err){
    //handle error
    console.error('Something went wrong')
  });