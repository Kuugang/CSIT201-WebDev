let routes = [
  {
    Jeep: "01A",
    Routes: {
      Alpha: 1,
      Bravo: 2,
      Charlie: 3,
      Echo: 4,
      Golf: 5,
    },
  },
  {
    Jeep: "02B",
    Routes: {
      Alpha: 1,
      Delta: 2,
      Echo: 3,
      Foxtrot: 4,
      Golf: 5,
    },
  },
  {
    Jeep: "03C",
    Routes: {
      Charlie: 1,
      Delta: 2,
      Foxtrot: 3,
      Hotel: 4,
      India: 5,
    },
  },
  {
    Jeep: "04A",
    Routes: {
      Charlie: 1,
      Delta: 2,
      Echo: 3,
      Foxtrot: 4,
      Golf: 5,
    },
  },
  {
    Jeep: "04D",
    Routes: {
      Charlie: 1,
      Echo: 2,
      Foxtrot: 3,
      Golf: 4,
      India: 5,
    },
  },
  {
    Jeep: "06B",
    Routes: {
      Delta: 1,
      Hotel: 2,
      Juliet: 3,
      Kilo: 4,
      Lima: 5,
    },
  },
  {
    Jeep: "06D",
    Routes: {
      Delta: 1,
      Foxtrot: 2,
      Golf: 3,
      India: 4,
      Kilo: 5,
    },
  },
  {
    Jeep: "10C",
    Routes: {
      Foxtrot: 1,
      Golf: 2,
      Hotel: 3,
      India: 4,
      Juliet: 5,
    },
  },
  {
    Jeep: "10H",
    Routes: {
      Foxtrot: 1,
      Hotel: 2,
      Juliet: 3,
      Lima: 4,
      November: 5,
    },
  },
  {
    Jeep: "11A",
    Routes: {
      Foxtrot: 1,
      Golf: 2,
      Kilo: 3,
      Mike: 4,
      November: 5,
    },
  },
  {
    Jeep: "11B",
    Routes: {
      Foxtrot: 1,
      Golf: 2,
      Lima: 3,
      Oscar: 4,
      Papa: 5,
    },
  },
  {
    Jeep: "20A",
    Routes: {
      India: 1,
      Juliet: 2,
      November: 3,
      Papa: 4,
      Romeo: 5,
    },
  },
  {
    Jeep: "20C",
    Routes: {
      India: 1,
      Kilo: 2,
      Lima: 3,
      Mike: 4,
      Romeo: 5,
    },
  },
  {
    Jeep: "42C",
    Routes: {
      Juliet: 1,
      Kilo: 2,
      Lima: 3,
      Mike: 4,
      Oscar: 5,
    },
  },
  {
    Jeep: "42D",
    Routes: {
      Juliet: 1,
      November: 2,
      Oscar: 3,
      Quebec: 4,
      Romeo: 5,
    },
  },
];

document.addEventListener("DOMContentLoaded", function () {
  const myForm = document.getElementById("myForm");
  const textInput = document.getElementById("codeInput");

  myForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = "";

    const uniqueInput = [
      ...new Set(
        textInput.value
          .toUpperCase()
          .split(",")
          .map((value) => value.trim())
      ),
    ];

    const matchedRoutes = uniqueInput.map((value) => {
      return routes.find((route) => route.Jeep === value);
    });

    const validRoutes = matchedRoutes.filter((route) => route !== undefined);

    let counter = 1;
    const colorIDS = {};
    const destinationsCount = {};

    if (!validRoutes.length) {
      resultsContainer.textContent = "No matching routes found.";
    } else {
      validRoutes.forEach((route) => {
        for (const key in route.Routes) {
          if (!destinationsCount.hasOwnProperty(key)) {
            destinationsCount[key] = 1;
          } else {
            destinationsCount[key]++;
          }
        }
      });

      validRoutes.forEach((route) => {
        const p = document.createElement("p");
        const routeInfo = [];
        for (const key in route.Routes) {
          if (destinationsCount[key] > 1) {
            if (!colorIDS.hasOwnProperty(key)) {
              colorIDS[key] = `color${counter}`;
              counter++;
            }
            routeInfo.push(`<span id="${colorIDS[key]}"> ${key} </span>`);
          } else {
            routeInfo.push(` ${key} `);
          }
        }
        p.innerHTML = `<span id = "jeepCode">${
          route.Jeep
        }</span> => ${routeInfo.join("←→")}`;
        resultsContainer.appendChild(p);
      });
    }

    const content = document.getElementById("resultsContainer");
    content.style.opacity = 1;
    for (let i = 1; i <= counter; i++) {
      // randomColor = getRandomColor()
      randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
      let elements = document.querySelectorAll(`#color${i}`);
      elements.forEach((element) => {
        element.style.color = randomColor;
      });
    }
  });
});

// function getRandomColor() {
//     let color;
//     do {
//         color = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
//     } while (!isColorTooDark(color));
//     return color;
//     }

//     function isColorTooDark(color) {
//     const r = parseInt(color.slice(1, 3), 16);
//     const g = parseInt(color.slice(3, 5), 16);
//     const b = parseInt(color.slice(5, 7), 16);

//     const brightness = (r * 299 + g * 587 + b * 114) / 1000;

//     const maxBrightness = 1;
//     return brightness >= maxBrightness;
// }
