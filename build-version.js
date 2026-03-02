const fs = require("fs");
const git = require("git-rev-sync");

const now = new Date();

const buildTime =
  now.toLocaleDateString("de-DE") +
  " " +
  now.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit"
  });

const gitHash = git.short();

const content = `
REACT_APP_BUILD_TIME=${buildTime}
REACT_APP_GIT_HASH=${gitHash}
`;

// Production
fs.writeFileSync(".env.production.local", content.trim());

// Development
fs.writeFileSync(".env.development.local", content.trim());

console.log("Build version generated:");
console.log(content);