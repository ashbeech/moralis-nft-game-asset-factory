const { default: axios } = require("axios");

function genRand(min, max, decimalPlaces) {
  var rand = Math.random() * (max - min) + min;
  var power = Math.pow(10, decimalPlaces);
  return Math.floor(rand * power) / power;
}

async function fetchData(_url) {
  try {
    const response = await axios.get(_url);
    return response;
  } catch (error) {
    console.error("Unable to fetch data:", error);
  }
}

function pickRandom(_list, _type) {
  // process json result: can be object or array
  if (_type == "asteroid") {
    return _list[0].data.data[
      Object.keys(_list[0].data.data)[
        Math.floor(Math.random() * Object.keys(_list[0].data.data).length)
      ]
    ];
  } else {
    return _list[Math.floor(Math.random() * _list.length)];
  }
}

const nameGenerator = async (_type) => {
  try {
    if (_type == "asteroid") {
      const response = await Promise.all([
        fetchData(
          "https://story-shack-cdn-v2.glitch.me/generators/meteor-name-generator?count=12"
        ),
      ]);
      const name = pickRandom(response, _type);

      return `${name.name}`;
    } else {
      const response = await Promise.all([
        fetchData("https://www.randomlists.com/data/names-female.json"),
        fetchData("https://www.randomlists.com/data/names-surnames.json"),
      ]);

      const [firstNames, lastNames] = response;

      const firstName = pickRandom(firstNames.data.data, _type);
      const lastName = pickRandom(lastNames.data.data, _type);

      return `${firstName} ${lastName}`;
    }
  } catch (error) {
    console.error("Unable to generate name:", error);
  }
};

const attributeGenerator = async (_id, _date, _type, _aux) => {
  try {
    let type = "";
    let attributes = [];

    if (_type == "asteroid") {
      if (_aux != "") {
        // description generator
        if (_aux == "desc") {
          attributes = "X-type Asteroid";
        } else {
          // spatial data
          attributes = [
            {
              unit: "Aphelion (AU)",
              display_type: "number",
              value: genRand(0, 5, 15),
            },
            {
              unit: "Perihelion (AU)",
              display_type: "number",
              value: genRand(0, 2, 15),
            },
            {
              unit: "Semi-major Axis (AU)",
              display_type: "number",
              value: genRand(0, 3, 15),
            },
            {
              unit: "Period (days)",
              display_type: "number",
              value: genRand(0, 3, 15),
            },
            {
              unit: "EMOID (AU)",
              display_type: "number",
              value: genRand(0, 3, 6),
            },
            {
              unit: "e",
              display_type: "number",
              value: genRand(0, 1, 16),
            },
            {
              unit: "epoch",
              display_type: "number",
              value: genRand(0, 2460000, 1),
            },
            {
              unit: "dv (km/s)",
              display: "number",
              value: genRand(0, 8, 6),
            },
            {
              unit: "dv (km/s)",
              display: "number",
              value: genRand(0, 8, 6),
            },
            {
              unit: "ma (deg @ epoch)",
              display: "number",
              value: genRand(0, 156, 13),
            },
            {
              unit: "om (deg @ J2000)",
              display: "number",
              value: genRand(0, 178, 13),
            },
            {
              unit: "w (deg @ J2000)",
              display: "number",
              value: genRand(0, 279, 13),
            },
          ];
        }
      } else {
        let dist = genRand(0, 10, 6);
        const sizes = ["Large", "Medium", "Small"];
        const size = pickRandom(sizes, "");
        const classes = ["X", "C", "S", "M"];
        const comps = ["nickel-iron", "chondrite", "cobalt"];
        const comp = pickRandom(comps, "");
        const classification = pickRandom(classes, "");

        type = "Asteroid";
        attributes = [
          {
            trait_type: "Distance from Earth",
            value: dist,
          },
          {
            trait_type: "Size",
            value: size,
          },
          {
            trait_type: "Type",
            value: classification,
          },
          {
            trait_type: "Composition",
            value: comp,
          },
        ];
      }
    } else {
      const divisions = ["LABS", "HIVE", "FORGE", "SCOUT", "OATH"];
      const division = pickRandom(divisions);
      type = "Human";
      if (_aux != "") {
        const bodies = ["Feminine", "Masculine"];
        const body = pickRandom(bodies);
        // description generator
        if (_aux == "desc") {
          attributes = body;
        }
      } else {
        attributes = [
          {
            trait_type: "Race",
            value: type,
          },
          {
            trait_type: "Division",
            value: division,
          },
          {
            display_type: "date",
            trait_type: "Evac Date",
            value: _date,
          },
          {
            trait_type: "Evac Number",
            value: _id,
          },
        ];
      }
    }

    return attributes;
  } catch (error) {
    console.error("Unable to generate name:", error);
  }
};

module.exports = {
  nameGenerator,
  attributeGenerator,
};
