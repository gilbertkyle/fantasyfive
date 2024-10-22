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

  const browser = await puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(
      `https://github.com/Sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar`,
    ),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();

  // this allows console logs in puppeteer to be rendered by Node
  page.on("console", (consoleObj) => {
    if (consoleObj.type() === "log") {
      console.log(consoleObj.text());
    }
  });

  await page.goto(`https://www.fantasypros.com/nfl/stats/dst.php?year=${season}&week=${week}&range=week`, {
    waitUntil: "load",
    timeout: 0,
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
