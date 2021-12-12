// You need a PAT to use this script, it uses GitHub GraphQL
// Limitations:
// - this only grabs PR data, not rogue commits to master
import { Octokit } from "@octokit/rest";
import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'process';
import * as fs from 'fs';

const rl = readline.createInterface({ input, output });

let token = "";
let startTime = "";
let endTime = "";

async function grabPullRequestInfo(client, start_time, end_time, cursor) {
  const response = await client.graphql(
    `
    query ($queryInput: String!, $after: String) {
      search(query: $queryInput, type: ISSUE, first: 100, after:$after) {
        pageInfo {
          startCursor
          hasNextPage
          endCursor
        }
        edges {
          node {
            ... on PullRequest {
              url
              title
              createdAt
              mergedAt
              labels(first: 100) {
                edges {
                  node {
                    name
                  }
                }
              }
              author {
                login
                url
              }
            }
          }
        }
      }
    }
  `,
    {
      "queryInput": `repo:PCSX2/pcsx2 is:pr is:merged merged:${start_time}..${end_time}`,
      "after": cursor
    }
  );
  console.log(response);
  return response;
}

rl.question("GitHub PAT?", (answer) => {
  token = answer;
  const octokit = new Octokit({
    auth: token,
    userAgent: "PCSX2/PCSX2.github.io",
    log: {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      debug: () => { },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      info: () => { },
      warn: console.warn,
      error: console.error,
    },
  });
  rl.question("Start Date?", (answer) => {
    startTime = answer;
    rl.question("End Date?", async (answer) => {
      endTime = answer;
      let paginate = true;
      let cursor = null;
      let prInfo = []
      while (paginate) {
        const resp = await grabPullRequestInfo(octokit, startTime, endTime, cursor);
        if (resp.search.pageInfo.hasNextPage) {
          cursor = resp.search.pageInfo.endCursor;
        } else {
          paginate = false;
        }
        for (let i = 0; i < resp.search.edges.length; i++) {
          const pr = resp.search.edges[i].node;
          let metadata = {
            url: pr.url,
            title: pr.title,
            createdAt: pr.createdAt,
            mergedAt: pr.mergedAt,
            labels: [],
            authorName: pr.author == null ? null : pr.author.login,
            authorUrl: pr.author == null ? null : pr.author.url
          }
          if (pr.labels != undefined) {
            for (let j = 0; j < pr.labels.edges.length; j++) {
              const label = pr.labels.edges[j].node;
              metadata.labels.push(label.name);
            }
          }
          prInfo.push(metadata);
        }
      }
      fs.writeFileSync(`./out/pr-data-${startTime}-${endTime}.json`, JSON.stringify(prInfo));
      process.exit(0);
    });
  });
});

