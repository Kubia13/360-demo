const fs = require("fs");
const git = require("git-rev-sync");

const buildTime = new Date()
  .toISOString()
  .replace("T", " ")
  .substring(0, 16);

const gitHash = git.short();

const content = `
REACT_APP_BUILD_TIME=${buildTime}
REACT_APP_GIT_HASH=${gitHash}
`;

fs.writeFileSync(".env.production.local", content.trim());

console.log("Build version generated:");
console.log(content);