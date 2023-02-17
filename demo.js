const fs = require("fs");
const cheerio = require("cheerio");
const axios = require("axios");
const xlsx = require("xlsx");
const url = "https://www.codechef.com/users/";
const users = [];
const problems =
  "body > main > div > div > div > div > div > section:nth-child(7) > div";
const global_rank =
  "body > main > div > div > div > aside > div:nth-child(1) > div > div.rating-ranks > ul > li:nth-child(1) > a > strong";
const country_rank =
  "body > main > div > div > div > aside > div:nth-child(1) > div > div.rating-ranks > ul > li:nth-child(2) > a > strong";
const rating =
  "body > main > div > div > div > aside > div:nth-child(1) > div > div.rating-header.text-center > div.rating-number";
const division =
  "body > main > div > div > div > aside > div:nth-child(1) > div > div.rating-header.text-center > div:nth-child(2)";
const stars =
  "body > main > div > div > div > div > div > section.user-details > ul > li:nth-child(1) > span > span.rating";
let users_completed = 0;
function read_from_excel() {
  const file = xlsx.readFile("./Codechef Usernames.xlsx");
  const sheets = file.SheetNames;
  const temp = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
  temp.forEach((res) => {
    res.stars = "0★";
    res.global_rank = 0;
    res.country_rank = 0;
    res.rating = 0;
    res.division = "Div 4";
    res.problems_solved = 0;
    res.events_participated = [];
    res.events_participated_count = 0;
    users.push(res);
  });
  updatedata();
}

function write_to_excel() {
  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(users);
  xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  xlsx.writeFile(workbook, "data.xlsx");
}
async function getdata(user) {
  users_completed++;
  const { data } = await axios.get(url + user["New CC Username"]);
  const $ = cheerio.load(data);
  user.stars = $(stars).text();
  user.rating = keepnumber($(rating).text());
  user.division = removeparantesis($(division).text());
  user.global_rank = $(global_rank).text();
  user.country_rank = $(country_rank).text();
  let problems_solved = {};
  const problems_count = [];
  let article = $(problems).find("article");
  for (let i = 0; i < article.length; i++) {
    let p = $(article[i]).find("p");
    for (let j = 0; j < p.length; j++) {
      let title = $(p[j]).find("strong");
      let content = $(p[j]).find("span");
      problems_solved[title.text()] = content.text();
    }
    problems_count.push(JSON.stringify(problems_solved));
    problems_solved = {};
  }
  let problems_solved_count = 0;
  const events_participated = new Set();
  for (let i = 0; i < problems_count.length; i++) {
    JSON.parse(problems_count[i], function (key, value) {
      if (key != "") {
        events_participated.add(key);
        problems_solved_count += value.split(",").length;
      }
    });
  }

  user.problems_solved = problems_solved_count;
  user.events_participated_count = events_participated.size;
  user.events_participated = Array.from(events_participated).toString();
}

function updatedata() {
  let count = 0;
  for (let i = 0; i < users.length; i++) {
    getdata(users[i])
      .then(() => {
        count += 1;
        console.clear();
        console.log(count);
      })
      .catch((err) => {
        count += 1;
        console.clear();
        console.log(count);
      })
      .finally(() => {
        write_to_excel();
      });
  }
}

read_from_excel();

// getdata().then(() => {
//   // console.log("done");
// });

function keepnumber(str) {
  let return_value = "";
  for (let i = 0; i < str.length; i++) {
    if (parseInt(str[i]) >= 0 && parseInt(str[i]) <= 9) {
      return_value += str[i];
    }
  }
  return return_value != "" ? return_value : "0";
}

function removeparantesis(str) {
  let return_value = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i] != "(" && str[i] != ")") return_value += str[i];
  }
  return return_value;
}
