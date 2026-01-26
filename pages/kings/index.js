import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "../../styles/Content.module.css";
import CommonLayout from "../../components/CommonLayout";

const inter = Inter({ subsets: ["latin"] });

function wmoWeatherCodeToText(code) {
  if (code == null) return null;
  if (code === 0) return "Clear";
  if (code === 1 || code === 2) return "Mostly clear / partly cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Fog";
  if (code === 51 || code === 53 || code === 55) return "Drizzle";
  if (code === 56 || code === 57) return "Freezing drizzle";
  if (code === 61 || code === 63 || code === 65) return "Rain";
  if (code === 66 || code === 67) return "Freezing rain";
  if (code === 71 || code === 73 || code === 75) return "Snow";
  if (code === 77) return "Snow grains";
  if (code === 80 || code === 81 || code === 82) return "Rain showers";
  if (code === 85 || code === 86) return "Snow showers";
  if (code === 95) return "Thunderstorm";
  if (code === 96 || code === 99) return "Thunderstorm with hail";
  return `Weather code ${code}`;
}

/**
 * Abbrev -> arena coords. (Simple & reliable; no geocoding/station searching.)
 * Add missing teams as needed.
 */
const TEAM_ARENA_COORDS = {
  ANA: { lat: 33.8078, lon: -117.8765, label: "Anaheim, CA" },
  BOS: { lat: 42.3662, lon: -71.0621, label: "Boston, MA" },
  BUF: { lat: 42.875, lon: -78.8767, label: "Buffalo, NY" },
  CAR: { lat: 35.8033, lon: -78.7219, label: "Raleigh, NC" },
  CBJ: { lat: 39.969, lon: -83.0063, label: "Columbus, OH" },
  CGY: { lat: 51.0374, lon: -114.0519, label: "Calgary, AB" },
  CHI: { lat: 41.8807, lon: -87.6742, label: "Chicago, IL" },
  COL: { lat: 39.7487, lon: -105.0077, label: "Denver, CO" },
  DAL: { lat: 32.7905, lon: -96.8103, label: "Dallas, TX" },
  DET: { lat: 42.3411, lon: -83.0553, label: "Detroit, MI" },
  EDM: { lat: 53.5469, lon: -113.4977, label: "Edmonton, AB" },
  FLA: { lat: 26.1583, lon: -80.3256, label: "Sunrise, FL" },
  LAK: { lat: 34.043, lon: -118.2673, label: "Los Angeles, CA" },
  MIN: { lat: 44.9442, lon: -93.1014, label: "Saint Paul, MN" },
  MTL: { lat: 45.496, lon: -73.5693, label: "Montreal, QC" },
  NJD: { lat: 40.7336, lon: -74.171, label: "Newark, NJ" },
  NSH: { lat: 36.1592, lon: -86.7785, label: "Nashville, TN" },
  NYI: { lat: 40.6827, lon: -73.6084, label: "Elmont, NY" },
  NYR: { lat: 40.7505, lon: -73.9934, label: "New York, NY" },
  OTT: { lat: 45.2969, lon: -75.927, label: "Ottawa, ON" },
  PHI: { lat: 39.9012, lon: -75.172, label: "Philadelphia, PA" },
  PIT: { lat: 40.4396, lon: -79.9892, label: "Pittsburgh, PA" },
  SEA: { lat: 47.6221, lon: -122.3542, label: "Seattle, WA" },
  SJS: { lat: 37.3328, lon: -121.9012, label: "San Jose, CA" },
  STL: { lat: 38.6268, lon: -90.2026, label: "St. Louis, MO" },
  TBL: { lat: 27.9427, lon: -82.4518, label: "Tampa, FL" },
  TOR: { lat: 43.6435, lon: -79.3791, label: "Toronto, ON" },
  VAN: { lat: 49.2777, lon: -123.108, label: "Vancouver, BC" },
  VGK: { lat: 36.1029, lon: -115.1786, label: "Las Vegas, NV" },
  WPG: { lat: 49.8928, lon: -97.1436, label: "Winnipeg, MB" },
  WSH: { lat: 38.8981, lon: -77.0209, label: "Washington, DC" },

  // legacy / edge:
  ARI: { lat: 33.5313, lon: -112.2616, label: "Glendale, AZ" },
};

async function fetchOpenMeteoDaily(lat, lon, dateYYYYMMDD) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${encodeURIComponent(lat)}` +
    `&longitude=${encodeURIComponent(lon)}` +
    `&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max,windspeed_10m_max` +
    `&temperature_unit=fahrenheit` +
    `&windspeed_unit=mph` +
    `&timezone=auto` +
    `&start_date=${encodeURIComponent(dateYYYYMMDD)}` +
    `&end_date=${encodeURIComponent(dateYYYYMMDD)}`;

  const res = await fetch(url, {
    headers: { "User-Agent": "Next.js NHL schedule + weather page" },
  });
  if (!res.ok) throw new Error(`Open-Meteo error ${res.status}`);
  const data = await res.json();

  const daily = data && data.daily ? data.daily : {};
  const high = Array.isArray(daily.temperature_2m_max) ? daily.temperature_2m_max[0] : null;
  const low = Array.isArray(daily.temperature_2m_min) ? daily.temperature_2m_min[0] : null;
  const code = Array.isArray(daily.weathercode) ? daily.weathercode[0] : null;
  const precipProb = Array.isArray(daily.precipitation_probability_max)
    ? daily.precipitation_probability_max[0]
    : null;
  const wind = Array.isArray(daily.windspeed_10m_max) ? daily.windspeed_10m_max[0] : null;

  return {
    highF: typeof high === "number" ? high : null,
    lowF: typeof low === "number" ? low : null,
    conditions: wmoWeatherCodeToText(typeof code === "number" ? code : null),
    precipProbMax: typeof precipProb === "number" ? precipProb : null,
    windMaxMph: typeof wind === "number" ? wind : null,
  };
}

export async function getServerSideProps() {
  try {
    // NHL “week/now” endpoint
    const nhlUrl = "https://api-web.nhle.com/v1/club-schedule/LAK/week/now";
    const scheduleRes = await fetch(nhlUrl, {
      headers: { "User-Agent": "Next.js NHL schedule + weather page" },
    });
    if (!scheduleRes.ok) throw new Error(`NHL schedule error ${scheduleRes.status}`);
    const schedule = await scheduleRes.json();

    const games = Array.isArray(schedule.games) ? schedule.games : [];

    const enriched = await Promise.all(
      games.map(async (g) => {
        const homeAbbrev = g?.homeTeam?.abbrev;
        const coords = homeAbbrev ? TEAM_ARENA_COORDS[homeAbbrev] : null;

        const awayName = g?.awayTeam?.commonName?.default || g?.awayTeam?.abbrev || "Away";
        const homeName = g?.homeTeam?.commonName?.default || g?.homeTeam?.abbrev || "Home";

        const base = {
          id: g.id,
          gameDate: g.gameDate, // YYYY-MM-DD
          startTimeUTC: g.startTimeUTC,
          venueName: g?.venue?.default || null,
          matchup: `${awayName} @ ${homeName}`,
          locationLabel:
            (coords && coords.label) ||
            (g?.homeTeam?.placeName?.default ? g.homeTeam.placeName.default : homeAbbrev || "Unknown"),
          gameCenterPath: g.gameCenterLink || null,
          weather: null,
        };

        if (!coords || !g.gameDate) return base;

        try {
          const wx = await fetchOpenMeteoDaily(coords.lat, coords.lon, g.gameDate);
          return { ...base, weather: wx };
        } catch (e) {
          return base;
        }
      })
    );

    return {
      props: {
        games: enriched,
        error: null,
      },
    };
  } catch (e) {
    return {
      props: {
        games: [],
        error: e?.message || "Unknown error",
      },
    };
  }
}

export default function KingsWeatherPage({ games, error }) {
  return (
    <CommonLayout title="Kings Weather" pageDesc="LA Kings games + forecast">
      <main className={styles.main}>
        <div className={styles.center} style={{ justifyContent: "center" }}>
          {/* optional; remove if you don't have this asset */}
          <Image
            className={styles.logo}
            src="/kings-logo.svg"
            alt="LA Kings"
            width={180}
            height={180}
            priority
          />
        </div>

        <div className={styles.center}>
          <p className={inter.className + " name"}>LA Kings — Next 7 Days</p>
        </div>

        {error ? (
          <div className={styles.center} style={{ paddingTop: 0 }}>
            <p className={inter.className + " second-p"} style={{ color: "crimson" }}>
              Error: {error}
            </p>
          </div>
        ) : null}

        <div className={styles.center} style={{ paddingTop: 0 }}>
          {games.length === 0 ? (
            <p className={inter.className + " second-p"}>No games returned for this week.</p>
          ) : (
            <ul className={inter.className} style={{ width: "min(900px, 100%)" }}>
              {games.map((g) => (
                <li key={g.id} style={{ marginBottom: 14 }}>
                  <div style={{ fontWeight: 700 }}>
                    {g.gameDate} — {g.matchup}
                  </div>

                  <div style={{ opacity: 0.9 }}>
                    {g.locationLabel}
                    {g.venueName ? ` • ${g.venueName}` : ""}
                    {g.gameCenterPath ? (
                      <>
                        {" • "}
                        <a
                          href={`https://www.nhl.com${g.gameCenterPath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Gamecenter
                        </a>
                      </>
                    ) : null}
                  </div>

                  {g.weather ? (
                    <div style={{ marginTop: 6 }}>
                      <span>
                        Forecast:{" "}
                        <strong>
                          {g.weather.highF != null ? Math.round(g.weather.highF) : "?"}° /{" "}
                          {g.weather.lowF != null ? Math.round(g.weather.lowF) : "?"}°
                        </strong>
                      </span>
                      {" — "}
                      <span>{g.weather.conditions || "Unknown"}</span>
                      {typeof g.weather.precipProbMax === "number" ? (
                        <span>{` • Precip: ${Math.round(g.weather.precipProbMax)}%`}</span>
                      ) : null}
                      {typeof g.weather.windMaxMph === "number" ? (
                        <span>{` • Wind: ${Math.round(g.weather.windMaxMph)} mph`}</span>
                      ) : null}
                    </div>
                  ) : (
                    <div style={{ marginTop: 6, opacity: 0.8 }}>Forecast: (no weather data)</div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </CommonLayout>
  );
}
