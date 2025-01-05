import puppeteer from "puppeteer";
import { z } from "zod";
import { db } from "~/server/db";
import { getCurrentWeek, CURRENT_SEASON } from "~/settings";
import { defenses } from "~/server/db/schema";
import { sql } from "drizzle-orm";
import chromium from "@sparticuz/chromium";

const defenseSchema = z.object({
  week: z.string().transform((el) => parseInt(el)),
  season: z.string().transform((el) => parseInt(el)),
  name: z.string(),
  fantasyPoints: z.string().transform((el) => parseFloat(el)),
  sacks: z.string().transform((el) => parseFloat(el)),
  interceptions: z.string().transform((el) => parseInt(el)),
  fumblesRecovered: z.string().transform((el) => parseInt(el)),
  fumblesForced: z.string().transform((el) => parseInt(el)),
  defenseTds: z.string().transform((el) => parseInt(el)),
  safeties: z.string().transform((el) => parseInt(el)),
  specialTeamsTds: z.string().transform((el) => parseInt(el)),
});

const defensesSchema = z.array(defenseSchema);

export const dynamic = "force-static";

export async function GET(request: Request) {
  const week = getCurrentWeek().toString();
  const season = CURRENT_SEASON.toString();

  const viewportOptions = {
    args: [
      // Flags for running in Docker on AWS Lambda
      // https://www.howtogeek.com/devops/how-to-run-puppeteer-and-headless-chrome-in-a-docker-container
      // https://github.com/alixaxel/chrome-aws-lambda/blob/f9d5a9ff0282ef8e172a29d6d077efc468ca3c76/source/index.ts#L95-L118
      // https://github.com/Sparticuz/chrome-aws-lambda/blob/master/source/index.ts#L95-L123
      "--allow-running-insecure-content",
      "--autoplay-policy=user-gesture-required",
      "--disable-background-timer-throttling",
      "--disable-component-update",
      "--disable-dev-shm-usage",
      "--disable-domain-reliability",
      "--disable-features=AudioServiceOutOfProcess,IsolateOrigins,site-per-process",
      "--disable-ipc-flooding-protection",
      "--disable-print-preview",
      "--disable-setuid-sandbox",
      "--disable-site-isolation-trials",
      "--disable-speech-api",
      "--disable-web-security",
      "--disk-cache-size=33554432",
      "--enable-features=SharedArrayBuffer",
      "--hide-scrollbars",
      "--ignore-gpu-blocklist",
      "--in-process-gpu",
      "--mute-audio",
      "--no-default-browser-check",
      "--no-first-run",
      "--no-pings",
      "--no-sandbox",
      "--no-zygote",
      "--single-process",
      "--use-angle=swiftshader",
      "--use-gl=swiftshader",
      "--window-size=1920,1080",
    ],
    defaultViewport: null,
    headless: true,
  };

  const browser = await puppeteer.launch(viewportOptions);
  const page = await browser.newPage();

  // this allows console logs in puppeteer to be rendered by Node
  page.on("console", (consoleObj) => {
    if (consoleObj.type() === "log") {
      console.log(consoleObj.text());
    }
  });

  await page.goto(`https://www.fantasypros.com/nfl/stats/dst.php?year=${season}&week=${week}&range=week`, {
    waitUntil: "networkidle0",
    timeout: 300000,
  });

  const defenseData = await page.evaluate(() => {
    console.log("hey");

    const rowData: object[] = [];
    const rows = document.querySelectorAll("#data > tbody > tr");
    //console.log("length: ", rows.length);
    rows.forEach((row) => {
      const cells = row.children;
      const cellsArray = Array.from(cells).map((elem) => (elem as HTMLElement).innerText);
      // parse name here, name format comes in form of 'New York Jets (NYJ)'
      const abbr = cellsArray[1]
        ?.trim()
        ?.split(" ")
        .pop()
        ?.replace(/[^a-zA-Z ]/g, "");
      const defenseData = {
        name: abbr ?? "",
        sacks: cellsArray[2],
        interceptions: cellsArray[3],
        fumblesRecovered: cellsArray[4],
        fumblesForced: cellsArray[5],
        defenseTds: cellsArray[6],
        safeties: cellsArray[7],
        specialTeamsTds: cellsArray[8],
        fantasyPoints: cellsArray[10],
      };
      rowData.push(defenseData);
    });
    return Promise.resolve(rowData);
  });

  const formattedData = defenseData.map((data) => ({
    ...data,
    week,
    season,
  }));

  // now to format data for db
  const parsedData = defensesSchema.safeParse(formattedData);

  if (!parsedData.success) {
    console.log(parsedData.error);
  } else {
    const teams = await db.query.teams.findMany();
    const { data } = parsedData;

    const dbData = data.map((defense) => {
      const { name, ...rest } = defense;
      return {
        ...rest,
        teamId: teams.find((team) => team.abbr === defense.name)?.id ?? 0,
      };
    });
    await db
      .insert(defenses)
      .values(dbData)
      .onConflictDoUpdate({
        target: [defenses.teamId, defenses.week, defenses.season],
        set: { fantasyPoints: sql`excluded.fantasy_points` },
      });
  }
  await browser.close();
}
