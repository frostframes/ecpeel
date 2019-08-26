const $ = require('cheerio');
const fs = require('fs');
const request = require('request-promise');

const chunkSize = 25;
const fileLimit = 50;
const gradAttrStrings = fs.readFileSync('./config/gradAttrStrings.json');
const gradAttrJSON = JSON.parse(gradAttrStrings);
const personTitles = fs.readFileSync('./config/personTitles.json');
const personTitlesJSON = JSON.parse(personTitles);
const pathFragment = 'https://course-profiles.uq.edu.au/student_section_loader/print/';

let data = [];
let learningData = [];

function writeFiles(recordNum, recordLimit) {
    let ratio = (recordNum-fileLimit)/fileLimit;
    if (ratio === Math.round(ratio)) {
        fs.writeFileSync(`./public/data/courses/courses-${recordNum}.json`, JSON.stringify(data));
        fs.writeFileSync(`./public/data/learning/learning-${recordNum}.json`, JSON.stringify(learningData));
        console.log(`Saved ./public/data/courses/courses-${recordNum}.json`);
        data = [];
        learningData = [];
    }
    if (recordNum + 1 <= recordLimit) {
        getChunk(recordNum + 1, recordLimit);
    }
};

function cleanHTML(str, options) {
    let output = str
        .replace(/\s+/g,' ')
        .replace(/(<[^>]+) style=".*?"/g, '')
        .replace(/<strong>/g, '')
        .replace(/<\/strong>/g, '')
        .replace(/ class=\"text-center\"/g, '');
    if (options !== undefined && options.ga) {
        for (let ga of gradAttrJSON) {
            output = output.replace(ga, '');
        }
    }
    return output;
};

function getChunk(startNum, recordLimit) {
    let chunkEndNum = startNum + chunkSize - 1;
    let processed = 0;
    console.log(`Getting records from ${startNum} to ${chunkEndNum}`);
    for (let recordNum = startNum; recordNum <= chunkEndNum; recordNum++) {
        request({
            method: 'GET',
            resolveWithFullResponse: true,
            uri: `${pathFragment}${recordNum}?print_section_1=1&print_section_7=1`, 
        })
        .then(function(response){
            //success!
            const html = response.body;
            // "404" pages do not send 404 header ¯\_(ツ)_/¯ , so only proceed if html long enough for course info
            if (html.length > 10000) {
                const header = $('h1', html);
                const headerText = header.text();
                const breadcrumb = header.next().text().split('|');
                let coordinator = $('.staff p:first-child', html).text();
                coordinator = coordinator.replace('Course Coordinator:', '');
                for (let title of personTitlesJSON) {
                    coordinator = coordinator.replace(title, '').trim();
                }
                let details = {
                    id: recordNum,
                    code: headerText.substring(0, headerText.indexOf(' - ')),
                    title: headerText.substring(headerText.substring(' - ') + 3),
                    coordinator: coordinator,
                    offering: breadcrumb[0].trim().replace('Semester: ', ''),
                    location: breadcrumb[1].trim(),
                    mode: breadcrumb[2].trim(),
                }
                data.push(details);

                let learningDetails = {
                    id: recordNum,
                    ga: cleanHTML($('.graduate-attribute-table tbody', html).html(), {ga: true}),
                    la: cleanHTML($('.objectives-list tbody', html).html()),
                    lo: cleanHTML($('.learning-objectives-table tbody', html).html()),
                }
                learningData.push(learningDetails);
                processed++;
                if (processed === chunkSize) {
                    writeFiles(chunkEndNum, recordLimit);
                }
            } else {
                processed++;
                if (processed === chunkSize) {
                    writeFiles(chunkEndNum, recordLimit);
                }
            }
        })
        .catch(function(err){
            //handle error
            processed++;
            console.log(`Something went wrong with ${recordNum}`);
            if (processed === chunkSize) {
                writeFiles(chunkEndNum, recordLimit);
            }
        });
    }
}

getChunk(78001, 102000);

