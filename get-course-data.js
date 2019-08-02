const $ = require('cheerio');
const fs = require('fs');
const request = require('request-promise');

const chunkSize = 25;
const fileLimit = 500;
const gradAttrStrings = fs.readFileSync('./config/gradAttrStrings.json');
const pathFragment = 'https://course-profiles.uq.edu.au/student_section_loader/print/';

let data = [];
let learningData = [];

function writeFiles(recordNum, recordLimit) {
    let ratio = (recordNum-fileLimit)/fileLimit;
    if (ratio === Math.round(ratio)) {
        fs.writeFileSync(`./data/courses/courses-${recordNum}.json`, JSON.stringify(data));
        fs.writeFileSync(`./data/learning/learning-${recordNum}.json`, JSON.stringify(learningData));
        console.log(`Saved ./data/courses/courses-${recordNum}.json`);
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
        for (let ga of gradAttrStrings) {
            output = output.replace(ga, '');
        }
    }
    return output;
};

function getChunk(startNum, recordLimit) {
    let chunkEndNum = startNum + chunkSize - 1;
    let processed = 0;
    console.log(`Getting chunk from ${startNum} to ${chunkEndNum}`);
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
                let details = {
                    id: recordNum,
                    code: headerText.substring(0, headerText.indexOf(' - ')),
                    title: headerText.substring(headerText.substring(' - ') + 3),
                    coordinator: $('.staff-person p', html).text(),
                    offering: breadcrumb[0].trim(),
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

getChunk(78001, 100000);

