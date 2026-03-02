const fs = require("fs");
const git = require("git-rev-sync");

const now = new Date();

// ISO ist stabiler als locale (keine Server-Zeitzonen Überraschungen)
const buildTime = now.toISOString();
const gitHash = git.short();

const content = `
REACT_APP_BUILD_TIME=${buildTime}
REACT_APP_GIT_HASH=${gitHash}
`;

// Wichtig: CRA liest diese sicher ein
fs.writeFileSync(".env.production", content.trim());
fs.writeFileSync(".env.development", content.trim());

console.log("Build version generated:");
console.log(content.trim());