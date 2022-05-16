const fs = require('fs');
const path = require('path')

function validateAccount(accountData) {
  if (!accountData.first_name || typeof accountData.first_name !== "string") {
    return false;
  }
  if (!accountData.last_name || typeof accountData.last_name !== "number") {
    return false;
  }
  if ( !accountData.email || typeof accountData.email !== "string") {
    return false;
  }
  if ( !accountData.password || typeof accountData.password !== "string") {
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

module.exports = { writeToJSON, validateAccount };