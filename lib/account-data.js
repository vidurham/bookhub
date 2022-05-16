const fs = require('fs');
const path = require('path')

function validateAccount(accountData) {
  if (!accountData.first_name) {
    return false;
  }
  if (!accountData.last_name) {
    return false;
  }
  if ( !accountData.email) {
    return false;
  }
  if ( !accountData.password) {
    return false;
  }
  return true;
}

function writeToJSON(accountData){
  console.log("writing: ", accountData)
  fs.writeFileSync(
    path.join(__dirname, "../data/account-data.json"),
    JSON.stringify({ accountData }, null, 2)
  );
}

function writeToJSONsearch(search){
  console.log("writing: ", search)
  fs.writeFileSync(
    path.join(__dirname, "../data/search.json"),
    JSON.stringify({ search }, null, 2)
  );
}

module.exports = { writeToJSON, validateAccount, writeToJSONsearch };