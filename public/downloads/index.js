const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cheerio = require("cheerio");
const { wb, ws } = require("./set-width");

const URL = "https://iato.in/members/lists";

let agencyData = [];
 
const headers={
  "Name of the Company":1,
  "Contact Person":2,
  "Designation":3,
  "Street Address":4,
  "City":5,
  "State":6,
  "Pincode":7,
  "Email":8,
  "Phone":9,
  "Mobile":10,
  "Fax":11,
  "Website":12,
}
const scrapData = async () => {
  const links = [];

  const response = await fetch(URL);
  let pageHTML = await response.text();

  const $ = cheerio.load(pageHTML);

  $("table#menuTable> tbody>tr>td>a").each((index, element) => {
    const link = $(element).attr("href");
    links.push(link);
  });
  console.log(links);


  for (let ind = 0; ind < links.length; ind++) {
    const subResponse = await fetch(links[ind]);
    let agencyObj = {};

    pageHTML = await subResponse.text();
    const $ = cheerio.load(pageHTML);

    $("div.post-content>p").each((index, element) => {
      let key = $(element).text();
      const arr = key.split(":");
      if (
        arr[0] === "Name of the Company" ||
        arr[0] === "Contact Person" ||
        arr[0] === "Designation" ||
        arr[0] === "Street Address" ||
        arr[0] === "City" ||
        arr[0] === "State" ||
        arr[0] === "Pincode" ||
        arr[0] === "Email" ||
        arr[0] === "Phone" ||
        arr[0] === "Mobile" ||
        arr[0] === "Fax" ||
        arr[0] === "Website"
      )
        agencyObj[arr[0]] = arr[1];
    });
    //  console.log(agencyObj);
    agencyData.push(agencyObj);
  }
  return;
};

scrapData().then(() => {
  for (let i = 0; i < agencyData.length; i++) {
    console.log(agencyData[i]);
  }
  let row = 1;
  let col = 1;
  Object.keys(headers).forEach((header) => {
    ws.cell(row, col).string(header);
    col++;
  });

  agencyData.forEach((agency) => {
    let col = 1;
    row++;
    Object.keys(agency).forEach((infoFieldKey) => {
     while(headers[infoFieldKey]>col)
     {
      col++;
     }
      ws.cell(row, col).string(agency[infoFieldKey]);
    });
  });
  wb.write("Travel-Agency.xlsx");
});
