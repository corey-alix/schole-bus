import { readFileSync } from "fs";

const buffer = readFileSync(
  "./data/trip.txt"
);
const file = buffer.toString();
console.log(
  JSON.stringify(
    scrape(file),
    null,
    " "
  )
);

function scrape(data) {
  const lines = data
    .split("\n")
    .filter(asDate)
    .map((v) => {
      const [head, ...tail] =
        v.split(":");

      const date = asDate(head);
      const distance = isExpression(
        tail[0]
      )
        ? tail.shift().trim()
        : 0;

      const locations =
        scrapeCoordinates(
          tail.join(":")
        )
          .filter((v) => !!v)
          .map(
            (v) =>
              `https://www.google.com/maps/@${v},16z`
          );

      const highlights =
        scrapeHighlights(
          tail.join(":")
        );

      const result = {
        date,
        distance,
        highlights,
        locations,
        value: tail.map((v) =>
          v.trim()
        ),
      };
      return result;
    });
  return lines;
}

function asDate(dateStr) {
  // Tuesday, June 21st
  const dayName = getDayName(dateStr);
  const dayNum = getDayNumber(dateStr);
  if (!dayName && !dayNum) return false;

  const month = getMonthName(dateStr);
  if (!month) return false;

  const year = getYear(dateStr) || 2022;
  if (!year) return false;

  const date = new Date(
    `${month} ${Number.parseInt(
      dayNum
    )} ${year}`
  ).toDateString();

  return date;
}

function getDayName(text) {
  const days =
    "MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY".split(
      ","
    );
  return days
    .filter(
      (d) =>
        -1 <
        text.toUpperCase().indexOf(d)
    )
    .join("+");
}

function getMonthName(text) {
  const days =
    "JANUARY,FEBRUARY,MARCH,APRIL,MAY,JUNE,JULY,AUGUST,SEPTEMBER,OCTOBER,NOVEMBER,DECEMBER".split(
      ","
    );
  return days
    .filter(
      (d) =>
        -1 <
        text.toUpperCase().indexOf(d)
    )
    .join("+");
}

function getDayNumber(text) {
  const regex =
    /(\d{1,2})(st|nd|rd|th)/g;
  if (!regex.test(text)) return false;
  return text.match(regex)[0];
}

function getYear(text) {
  return 2022;
}

function scrapeCoordinates(text) {
  const regex =
    /(\d{2,}\.\d{2,})(,\D?)(-\d{2,}\.\d{2,})/g;
  if (!regex.test(text)) return [];
  const coords = text.match(regex);
  const data = coords.map((v) =>
    v
      .split(",")
      .map((v) => parseFloat(v))
      .join(",")
  );

  return data;
}

function isExpression(text) {
  return (
    text &&
    text.indexOf("+") &&
    0 < parseInt(text)
  );
}

function scrapeHighlights(text) {
  text = text.toUpperCase();
  const _ =
    "hike,hotel,laundry,swim,camp,playground,trail"
      .split(",")
      .map((v) => v.toUpperCase());
  return _.filter(
    (v) => -1 < text.indexOf(v)
  );
}
