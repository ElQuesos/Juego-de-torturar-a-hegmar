const height = 300;
const width = 1100;
const mainX = width / 8;
const mainY = height / 2;
const mainH = 100;
const mainW = 50;

const monsX = width / 2;
const monsY = height / 2;
const monsH = 100;
const monsW = 50;

let mainHealth = 4;
let energy = 4;
let usableModule;
let img; //.....................cambiar en el futuro cercano
let vecRandom = [];
let vecGrid;
let aliveMonster = [];

class monster {
    constructor(name, health, monsterImg, alive, stuned, bleeding) {
        this.name = name;
        this.health = health;
        this.monsterImg = monsterImg;
        this.alive = alive;
        this.stuned = stuned;
        this.bleeding = bleeding;
    }
}

const monster1 = new monster("Meaty", 6, img, true, false, false);
const monster2 = new monster("Slimy", 2, img, true, false, false);
const monster3 = new monster("Spiky", 3, img, true, false, false);
const monster4 = new monster("Ugly", 1, img, true, false, false);

class moduleUse {
    constructor(dmg, uses, name, moduleImg, special, calories) {
        this.dmg = dmg;
        this.uses = uses;
        this.moduleName = name;
        this.moduleImg = moduleImg;
        this.special = special;
        this.calories = calories;
    }
}

const module1 = new moduleUse(2, 0, "Teeth", img, "eat", 2);
const module2 = new moduleUse(5, 1, "SharpBones", img, "blood", 3);
const module3 = new moduleUse(0, 5, "GreasyBlader", img, "stun", 9);
const module4 = new moduleUse(3, 0, "HeavyHand", img, "shuffle", 0);

function specialModuleFunction(module, aliveMonster) {
    if (module.special === "eat") {
        energy += 1; // Increment energy
    }
    if (module.special === "blood") {
        // Using the first alive monster, consider changing if needed
        if (aliveMonster.length > 0) {
            aliveMonster[0].bleeding = true;
        }
    }
    if (module.special === "stun") {
        // Using the first alive monster, consider changing if needed
        if (aliveMonster.length > 0) {
            aliveMonster[0].stuned = true;
        }
    }
    if (module.special === "shuffle") {
        // Shuffling the monsters
        const aux = aliveMonster.shift(); // Remove the first monster
        aliveMonster.push(aux); // Add it to the end
    }
}

let back1 = {
    x: 0,
    y: 0,
    width: 1100,
    height: 300,
};

let back2 = {
    x: 1100,
    y: 0,
    width: 1100,
    height: 300,
};

let main = {
    x: mainX,
    y: mainY,
    width: mainW,
    height: mainH,
};

let canvas, ctx;

let isDPressed = false;
let isFighting = false;

document.addEventListener("DOMContentLoaded", function () {
    const gridContainer = document.querySelector(".grid");

    vecGrid = [
        gridContainer.querySelector(".grid1"),
        gridContainer.querySelector(".grid2"),
        gridContainer.querySelector(".grid3"),
        gridContainer.querySelector(".grid4"),
        gridContainer.querySelector(".grid5"),
        gridContainer.querySelector(".grid6"),
        gridContainer.querySelector(".grid7"),
        gridContainer.querySelector(".grid8")
    ];

    initializeGame();
});

function initializeGame() {
    canvas = document.getElementById("viewCanvas");
    canvas.height = height;
    canvas.width = width;
    ctx = canvas.getContext("2d");

    requestAnimationFrame(viewGame);
}

function viewGame() {
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "gray";
    ctx.fillRect(back1.x, back1.y, back1.width, back1.height);
    ctx.fillStyle = "orange";
    ctx.fillRect(back2.x, back2.y, back2.width, back2.height);

    // Draw the main character
    ctx.fillStyle = "red";
    ctx.fillRect(main.x, main.y, main.width, main.height);

    if (isDPressed && !isFighting) {
        back1.x -= 5;
        back2.x -= 5;
    }

    if (back1.x + back1.width <= 0) {
        back1.x = back2.x + back2.width;
    }
    if (back2.x + back2.width <= 0) {
        back2.x = back1.x + back1.width;
    }

    if (isDPressed && !isFighting) {
        let random = getRandomInt(10);
        console.log(random);
        if (random === 9) {
            isFighting = true;
            console.log("Start fight");
            startFight(energy);
        }
    }

    if (!isFighting) {
        requestAnimationFrame(viewGame);
    }
}

window.addEventListener("keydown", function (e) {
    if (e.code === "KeyD") {
        isDPressed = true;
    }
});

window.addEventListener("keyup", function (e) {
    if (e.code === "KeyD") {
        isDPressed = false;
    }
});

async function createModule(selectedDiv) {
    const existingModules = selectedDiv.getElementsByClassName("module");
    if (existingModules.length > 0) {
        return;
    }

    const randomModule = getRandomModule();
    vecRandom.push(randomModule);
    const module = document.createElement("div");
    module.classList.add("module", "dragging"); // Add 'dragging' class
    module.style.width = "18rem";

    module.innerHTML = `
        <div class="${randomModule.moduleId}" draggable="true">
            <img src="${randomModule.moduleImg}" alt="Module Image">
            <h3>${randomModule.moduleName}</h3>
        </div>
    `;
    selectedDiv.appendChild(module);
    vecRandom.push(module);

    module.addEventListener('dragstart', () => {
        module.classList.add('dragging');
    });

    module.addEventListener('dragend', () => {
        module.classList.remove('dragging');
    });

    vecGrid.forEach(container => {
        container.addEventListener('dragover', e => {
            e.preventDefault();
            const existingModules = container.getElementsByClassName("module");
            const draggedModule = document.querySelector('.module.dragging');
            if (existingModules.length === 0) {
                container.appendChild(draggedModule);
            } else {
                const indexToInsert = Array.from(container.children).indexOf(draggedModule);
                container.insertBefore(draggedModule, container.children[indexToInsert]);
            }
        });
    });
}



function getRandomModule() {
    const modules = [module1, module2, module3, module4];
    const randomIndex = getRandomInt(modules.length);
    return modules[randomIndex];
}

function createMonster(monster, position) {
    aliveMonster.push(monster);
    const spacing = 100;
    const X = monsX + position * spacing;
    const Y = monsY;
    console.log("Monster Position:", position, "X:", X);
    ctx.fillStyle = "red";
    ctx.fillRect(X, Y, monsW, monsH);
}

function getRandomMonster() {
    const monsters = [monster1, monster2, monster3, monster4];
    const randomIndex = getRandomInt(monsters.length);
    return monsters[randomIndex];
}

function startFight(energy) {
    energy = 4;
    let cont1 = energy;
    let position;
    let random = getRandomInt(5);
    let cont2 = random;

    do {
        position = document.querySelector(`.random${cont1}`);
        if (position) {
            createModule(position);
        }
        cont1 -= 1;
    } while (cont1 >= 1);

    do {
        const randomMonster = getRandomMonster();
        createMonster(randomMonster, cont2);
        cont2 -= 1;
    } while (cont2 >= 1);
    fight();
}

function fight() {
    do {
        aliveMonster.forEach(monster => {
            mainTurn(monster);
            monsterTurn(monster);
        });
    } while (win());
}

function win() {
    let cont = 0;
    aliveMonster.forEach(monster => {
        if (monster.alive === false) {
            cont += 1;
        }
    });
    if (cont === aliveMonster.length && mainHealth !== 0) {
        return true;
    } else if (mainHealth === 0) {
        alert("skill issue");
        return false;
    }
}

function mainTurn(monster) {
    usableModule = []; // Clear the array

    vecGrid.forEach(div => {
        usableModule.push(Array.from(div.getElementsByClassName("module")));
    });

    const flattenedModules = usableModule.flat();

    flattenedModules.forEach(moduleUse => {
        specialModuleFunction(moduleUse, aliveMonster);
        monster.health -= moduleUse.dmg;
    });
}
function monsterTurn(monster) {
    if (monster.stuned === true) {
        monster.stuned = false;
        return;
    }
    if (monster.bleeding === true) {
        monster.health -= 1;
    }
    mainHealth -= 1;
}

function endFight() {
    isFighting = false;
    let cont1 = 4;
    let position;
    do {
        position = document.querySelector(`.random${cont1}`);
        if (position) {
            position.remove();
        }
        cont1 -= 1;
    } while (cont1 >= 1);
    monsterTurn = [];
    usableModule = [];
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}