/**
 * @description - Creates a Dino Constructor
 * @param {string} species
 * @param {number} weight
 * @param {number} height
 * @param {string} diet
 * @param {string} where
 * @param {string} when
 * @param {string} fact
 */
const Dino = function (species, weight, height, diet, where, when, fact) {
  if (
    species.length < 1 ||
    diet.length < 1 ||
    where.length < 1 ||
    when.length < 1 ||
    fact.length < 1
  ) {
    const errorString = `
                Invalid Dino object. Provided values are:
                species: ${species},
                diet: ${diet},
                where: ${where},
                when: ${when},
                fact: ${fact}
            `;
    throw errorString;
  }

  if (weight < 0 || height < 0) {
    const errorString = `Dino's Weight or height cannot be < 0.
                            weight: ${weight}, height: ${height}`;
    throw errorString;
  }

  this.species = species;
  this.weight = weight;
  this.height = height;
  this.diet = diet;
  this.where = where;
  this.when = when;
  this.fact = fact;
};

/**
 * @description Creates and returns Dino objects
 * @param {any[]} dinos
 * @returns {Dino[]}
 */
function createDinoObjects(dinos) {
  return dinos.map((dino) => {
    function checkAndReturnNumber(n) {
      return typeof n === "string" ? parseFloat(n) : n;
    }
    return new Dino(
      dino.species,
      checkAndReturnNumber(dino.weight),
      checkAndReturnNumber(dino.height),
      dino.diet,
      dino.where,
      dino.when,
      dino.fact
    );
  });
}

/**
 * @description Creates a Human object
 * @param {string} name
 * @param {{feet: number, inches: number}} height
 * @param {number} weight
 * @param {string} diet
 */
const Human = function (name, height, weight, diet) {
  this.name = name;
  this.height = {
    feet: height.feet,
    inches: height.inches,
  };
  this.heightInches = height.inches;
  this.weight = weight;
  this.diet = diet;
};

/**
 * @description - Compares dino weigt with that of humans and returns --
 * coparison string
 * @param {number} humanWeight
 * @returns {string}
 */
Dino.prototype.comapreWeight = function (humanWeight) {
  const weightDiff = this.weight - humanWeight;
  if (weightDiff !== 0) {
    return `You are ${Math.abs(weightDiff)} pounds ${
      weightDiff > 0 ? "ligher" : "heavier"
    } than ${this.species}.`;
  }
  return `You and ${this.species} both weight the same.`;
};

/**
 * @description - Compares human diet with a given dino's diet
 * @param {string} humanDiet
 * @returns {string}
 */
Dino.prototype.compareDiet = function (humanDiet) {
  if (this.diet.toLowerCase() !== humanDiet.toLowerCase()) {
    return `You are a(n) ${humanDiet} while the ${this.species} is a(n) ${this.diet}.`;
  }
  return `You both are ${this.diet}'s.`;
};

/**
 * @description - Compares human height with dino height
 * @param {{feet: number, inches: number}} humanHeight
 * @returns
 */
Dino.prototype.compareHeight = function (humanHeight) {
  // If feet or inches is NaN, use 0 instead
  let humanHeightInches =
    (humanHeight.feet || 0) * 12 + (humanHeight.inches || 0);
  const heigtDiff = this.height - humanHeightInches;
  if (heigtDiff !== 0) {
    return `You are ${Math.abs(heigtDiff)} inches ${
      heigtDiff < 0 ? "taller" : "shorter"
    } than ${this.species}.`;
  }
  return `You and the ${this.species} are the same height.`;
};

/**
 * @description - Generates tiles for each dino and the human
 * @param {Dino[]} dinoObjects
 * @param {Human} human
 * @returns {HTMLDivElement[]}
 */
function createTiles(dinoObjects, human) {
  const dinoGridItems = [];
  // Get random indices to compare dinos with human
  const randomIndices = [];
  let randomIndex = -1;
  while (randomIndices.length !== 3) {
    randomIndex = Math.trunc(Math.random() * (dinoObjects.length - 1));
    if (
      randomIndices.indexOf(randomIndex) === -1 &&
      dinoObjects[randomIndex].species.toLowerCase() !== "pigeon"
    ) {
      randomIndices.push(randomIndex);
    }
  }
  // Initialize number of comparisons
  let comparsions = 0;

  // Create dino html elements for each dino object
  // And group them under a div
  dinoObjects.forEach((dino, index) => {
    let fact = "";
    // If the the current index is in random indices array,
    // Compare dino with human
    if (randomIndices.indexOf(index) !== -1) {
      if (comparsions === 1) {
        fact = dino.compareDiet(human.diet);
      } else if (comparsions === 2) {
        fact = dino.compareHeight(human.height);
      } else {
        fact = dino.comapreWeight(human.weight);
      }
      comparsions++;
    } else {
      // Otherwise display dino's random fact
      if (dino.species !== "Pigeon") {
        const factProps = ["where", "when", "fact"];
        const randomFactIndex = Math.round(
          Math.random() * (factProps.length - 1)
        );
        const randomFact = dino[factProps[randomFactIndex]];
        switch (randomFactIndex) {
          case 0:
            fact = `${dino.species} is from ${randomFact}`;
            break;
          case 1:
            fact = `${dino.species} lived during ${randomFact}`;
            break;
          default:
            fact = dino.fact;
        }
      } else {
        fact = dino.fact;
      }
    }
    dinoGridItems.push(createGridItemChildren(fact, dino.species));
  });
  // Get the middle of the dino grid items array
  // And add the human grid item there
  const middleOfTheGrid = Math.round(dinoGridItems.length / 2);
  dinoGridItems.splice(
    middleOfTheGrid,
    0,
    createGridItemChildren("", human.name)
  );
  return dinoGridItems;
}

/**
 * @description - Returns a Div that has children
 * @param {string} fact
 * @param {string} species
 * @returns {HTMLDivElement}
 */
function createGridItemChildren(fact, species) {
  // Container to hold dino properties
  const dinoTile = document.createElement("div");
  // Element for image
  const dinoImg = document.createElement("img");
  // Element for name
  const dinoName = document.createElement("h3");
  // Element for fact
  const dinoFact = document.createElement("p");
  // Add css for the div container holding name, image and fact
  dinoTile.classList.add("grid-item");
  if (fact !== undefined && fact.length > 0) {
    dinoFact.textContent = fact;
    dinoTile.appendChild(dinoFact);
  }

  dinoName.textContent = species;
  dinoTile.appendChild(dinoName);
  // No facts for boring human
  if(fact.length > 0) {
    dinoImg.src = `./images/${species.toLowerCase()}.png`;
  } else {
    dinoImg.src = `./images/human.png`;
  }
  dinoTile.appendChild(dinoImg);
  return dinoTile;
}

/**
 * @description - Unpacks grid item array and adds it to the DOM
 * @param {HTMLDivElement[]} gridItems
 */
function addTilesToDom(gridItems) {
  const grid = document.getElementById("grid");
  gridItems.forEach((gridItem) => {
    grid.appendChild(gridItem);
  });
}

/**
 * @description - Removes human data form from the UI
 */
function removeForm() {
  document.getElementById("dino-compare").remove();
}

/**
 * @description - Validates the data entered on the froms
 * Alerts and throws exception to the console if a validation error occurs
 * @param {Human} humanData
 */
function validateFormData(humanData) {
  let errorMsg = "";
  // Validate name
  if (humanData.name.length < 1) {
    errorMsg = "Human name cannot be empty.\n";
  }
  // Validate weight
  if (isNaN(humanData.weight)) {
    errorMsg += "Human weight cannot be empty.\n";
  } else if (humanData.weight <= 0) {
    errorMsg += "Human weight cannot be negative or 0\n";
  }

  // Validate height
  if (isNaN(humanData.height.feet) && isNaN(humanData.height.inches)) {
    errorMsg += "Human height(feet and inches) cannot be empty.";
  } else {
    const inches = humanData.height.inches || 0;
    const feet = humanData.height.feet || 0;
    if (inches < 0 || feet < 0) {
      errorMsg += "Height (feet or inches) cannot be negative";
    } else if(inches === 0 && feet === 0) {
      errorMsg += "Human height(feet and inches) cannot be 0.";
    }
  }
  if (errorMsg.length > 0) {
    alert(errorMsg);
    throw errorMsg;
  }
}

// On button click, prepare and display infographic
document.getElementById("btn").addEventListener("click", async function () {
  // Get human data using IIFE
  const humanData = (function () {
    return {
      name: document.getElementById("name").value,
      height: {
        feet: parseFloat(document.getElementById("feet").value),
        inches: parseFloat(document.getElementById("inches").value),
      },
      weight: parseFloat(document.getElementById("weight").value),
      diet: document.getElementById("diet").value,
    };
  })();

  // Validate form data
  validateFormData(humanData);
  // Create human object
  const human = new Human(
    humanData.name,
    humanData.height,
    humanData.weight,
    humanData.diet
  );

  // Read data from dino.json file
  const dinoJsonData = await (async function () {
    const data = await fetch("./dino.json");
    const jsonData = await data.json();
    return jsonData;
  })();

  // Create dino objects using the data read from JSON
  const dinoObjects = createDinoObjects(dinoJsonData.Dinos);
  // Send human and dino data to create grid items
  const gridItems = createTiles(dinoObjects, human);
  // Add grid items to main grid
  addTilesToDom(gridItems);
  // Remove human data form from the UI
  removeForm();
});
