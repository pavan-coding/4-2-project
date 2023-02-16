const fs = require("fs");
const cheerio = require("cheerio");
const axios = require("axios");
const url = "https://www.codechef.com/users/waatstat";
(async () => {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  console.log($("title").text());
})();
