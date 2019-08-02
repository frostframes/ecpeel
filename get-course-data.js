const $ = require('cheerio');
const fs = require('fs');
const request = require('request-promise');

const fileLimit = 500;
const chunkSize = 25;
const gaStrings = [
    ' . IN-DEPTH KNOWLEDGE OF THE FIELD OF STUDY  <br>',
    ' . A <b>comprehensive</b> and <b>well-founded knowledge</b> in the field of study. <br> ',
    ' . An <b>understanding</b> of <b>how other disciplines relate</b> to the field of study. <br>',
    ' . An <b>international perspective</b> on the field of study. <br>',
    ' . EFFECTIVE COMMUNICATION <br>',
    ' . The ability to <b>collect</b>, <b>analyse</b> and <b>organise information</b> and <b>ideas</b> and to <b>convey</b> those <b>ideas clearly</b> and <b>fluently</b>, in both <b>written</b> and <b>spoken forms</b>. <br>',
    ' . The ability to <b>interact effectively with others</b> in order to work towards a common outcome. <br>',
    ' . The ability to <b>select</b> and <b>use</b> the <b>appropriate level</b>, <b>style</b> and <b>means of communication</b>. <br>',
    ' . The ability to <b>engage effectively</b> and <b>appropriately with information and communication technologies</b>. <br>',
    ' . INDEPENDENCE AND CREATIVITY  <br>',
    ' . The ability to <b>work</b> and <b>learn independently</b>. <br>',
    ' . The ability to <b>generate ideas</b> and <b>adapt innovatively</b> to changing environments. <br>',
    ' . The ability to <b>identify problems</b>, <b>create solutions</b>, <b>innovate</b> and <b>improve</b> current <b>practices</b>. <br>',
    ' . CRITICAL JUDGEMENT <br>',
    ' . The ability to <b>define</b> and <b>analyse problems</b>. <br>',
    ' . The ability to <b>apply critical reasoning</b> to issues through <b>independent thought</b> and <b>informed judgement</b>. <br>',
    ' . The ability to <b>evaluate opinions</b>, <b>make decisions</b> and to <b>reflect critically</b> on the justifications for decisions. <br>',
    ' . ETHICAL AND SOCIAL UNDERSTANDING  <br>',
    ' . An <b>understanding</b> of <b>social</b> and <b>civic responsibility</b>. <br>',
    ' . An <b>appreciation</b> of the <b>philosophical</b> and <b>social contexts</b> of a discipline. <br>',
    ' . A <b>knowledge</b> and <b>respect</b> of <b>ethics</b> and <b>ethical standards</b> in relation to a major area of study. <br>',
    ' . A <b>knowledge</b> of other <b>cultures</b> and <b>times</b> and an <b>appreciation</b> of <b>cultural diversity</b>. <br>',
];
const recordLimit = 100001;
const pathFragment = 'https://course-profiles.uq.edu.au/student_section_loader/print/';

let data = [];
let learningData = [];

function writeFiles(recordNum) {
    let ratio = (recordNum-fileLimit)/fileLimit;
    if (ratio === Math.round(ratio)) {
        fs.writeFileSync(`./data/courses/courses-${recordNum}.json`, JSON.stringify(data));
        fs.writeFileSync(`./data/learning/learning-${recordNum}.json`, JSON.stringify(learningData));
        console.log(`Saved ./data/courses/courses-${recordNum}.json`);
        data = [];
        learningData = [];
    }
    if (recordNum + 1 <= recordLimit) {
        getChunk(recordNum + 1);
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
        for (let ga of gaStrings) {
            output = output.replace(ga, '');
        }
    }
    return output;
};

function getChunk(startNum) {
    let endNum = startNum + chunkSize - 1;
    let processed = 0;
    console.log(`Getting chunk from ${startNum}`);
    for (let recordNum = startNum; recordNum <= endNum; recordNum++) {
        request({
            method: 'GET',
            resolveWithFullResponse: true,
            uri: `${pathFragment}${recordNum}?print_section_1=1&print_section_7=1`, 
        })
        .then(function(response){
            //success!
            const html = response.body;
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
                    writeFiles(endNum);
                }
            } else {
                processed++;
                if (processed === chunkSize) {
                    writeFiles(endNum);
                }
            }
        })
        .catch(function(err){
            //handle error
            processed++;
            console.log(`Something went wrong with ${recordNum}`);
            if (processed === chunkSize) {
                writeFiles(endNum);
            }
        });
    }
}

getChunk(78001);

