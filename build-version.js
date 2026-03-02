const fs = require("fs");
const git = require("git-rev-sync");

const now = new Date();

// ✅ erzwingt Europe/Berlin (auch auf Vercel/CI)
const buildTime = new Intl.DateTimeFormat("de-DE", {
  timeZone: "Europe/Berlin",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(now);

const gitHash = git.short();

const content = `
REACT_APP_BUILD_TIME=${buildTime}
REACT_APP_GIT_HASH=${gitHash}
`;

fs.writeFileSync(".env.production.local", content.trim());
fs.writeFileSync(".env.development.local", content.trim());

console.log("Build version generated:");
console.log(content);