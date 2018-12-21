
var wpmReports = [];

class WPMReport {
  constructor(date, time, wpm) {
    this.date = date;
    this.time = time;
    this.wpm = wpm;
  }
}

function save() {
  const fs = window.bypass.fs;
  fs.writeFileSync('src/assets/wpm-reports.json', JSON.stringify(wpmReports));
}

function load() {
  const fs = window.bypass.fs;
  const obj = JSON.parse(fs.readFileSync('src/assets/wpm-reports.json'));
  wpmReports = obj.map(val => new WPMReport(val.date, val.time, val.wpm));
}

function addReport(report) {
  wpmReports.push(report);
  save();
}

function removeReport(index) {
  wpmReports.splice(index, 1);
  save();
}

export default {
  WPMReport: WPMReport,
  save: save,
  load: load,
  addReport: addReport,
  removeReport: removeReport
};