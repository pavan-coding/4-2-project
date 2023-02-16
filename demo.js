const fs = require("fs");
const cheerio = require("cheerio");
const axios = require("axios");
const xlsx = require("node-xlsx");

const url = "https://www.codechef.com/users/waatstat";
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

async function getdata() {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  console.log($(stars).text());
  console.log(keepnumber($(rating).text()));
  console.log(removeparantesis($(division).text()));
  console.log($(global_rank).text());
  console.log($(country_rank).text());
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
  console.log(problems_solved_count);
  console.log(events_participated.size);
}

getdata().then(() => {
  // console.log("done");
});

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
