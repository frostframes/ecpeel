const $ = require('cheerio');
const fs = require('fs');
const request = require('request-promise');
const url = 'https://my.uq.edu.au/programs-courses/search.html?keywords=&searchType=course&archived=true&CourseParameters%5Bsemester%5D=';

request(url)
  .then(function(html){
    //success!
    const courses = $('td:not([colspan]) > a', html);
    let courseUrls = [];
    for (var courseId in courses) {
        if (courses.hasOwnProperty(courseId)) {
            let course = courses[courseId];
            if (course.attribs !== undefined && course.attribs.href !== undefined && course.attribs.href.indexOf('&offer=') !== undefined) {
                courseUrls.push(course.attribs.href);
            }
        }
    }
    fs.writeFileSync('./data/urls.json', JSON.stringify(courseUrls));
  })
  .catch(function(err){
    //handle error
    console.error('Something went wrong')
  });