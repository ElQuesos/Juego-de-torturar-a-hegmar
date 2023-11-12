const height = 300;
const width = 1100;
const mainX = width / 8;
const mainY = height / 2;
const mainH = 100;
const mainW = 50;
let img; //.....................cambiar en el futuro cercano 
let vecRandom = [];
let vecGrid;
let usableModule = [];

class monster {
    constructor(name, health, monsterImg) {
        this.name = name;
        this.health = health;
        this.monsterImg = monsterImg;
    }
}

const monster1 = new monster("Meaty", 6, img);
const monster2 = new monster("Slimy", 2, img);
const monster3 = new monster("Spiky", 3, img);
const monster4 = new monster("Ugly", 1, img);

class moduleUse {
    constructor(dmg, uses, name, moduleImg) {
        this.dmg = dmg;
        this.uses = uses;
        this.moduleName = name;
        this.moduleImg = moduleImg;
    }
}

const module1 = new moduleUse(2, 0, "Teeth", img);
const module2 = new moduleUse(5, 1, "SharpBones", img);
const module3 = new moduleUse(0, 5, "GreasyBlader", img);
const module4 = new moduleUse(3, 0, "HeavyHand", img);

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

    initializeGame()
});

function initializeGame() {
    canvas = document.getElementById("viewCanvas");
    canvas.height = height;
    canvas.width = width;
    ctx = canvas.getContext("2d");

    // Start the game loop
    requestAnimationFrame(viewGame);
}

function viewGame() {
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = "gray";
    ctx.fillRect(back1.x, back1.y, back1.width, back1.height);
    ctx.fillStyle = "orange";
    ctx.fillRect(back2.x, back2.y, back2.width, back2.height);

    // Draw the main character
    ctx.fillStyle = "red";
    ctx.fillRect(main.x, main.y, main.width, main.height);

    // Move the background at a fixed speed when "D" is held down
    if (isDPressed && !isFighting) {
        back1.x -= 5; // Adjust this value to control the speed
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
            alert("10");
            startFight();
        }
    }

    if (!isFighting) {
        requestAnimationFrame(viewGame);
    }
}

// Add event listeners to handle key presses
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
    // Check if the selected div already contains a module
    const existingModules = selectedDiv.getElementsByClassName("module");
    if (existingModules.length > 0) {
        // You can choose to do nothing or handle this case as needed
        console.log("This div already contains a module");
        return;
    }

    const randomModule = getRandomModule();
    const module = document.createElement("div");
    module.classList.add("module");
    module.style.width = "18rem";

    module.innerHTML = `
        <div class="${randomModule.moduleId}" draggable="true">
            <img src="${randomModule.moduleImg}" alt="Module Image">
            <h3>${randomModule.moduleName}</h3>
        </div>
    `;
    selectedDiv.appendChild(module)
    vecRandom.push(module)

    vecRandom.forEach(module => {
        module.addEventListener('dragstart', () => {
            module.classList.add('dragging');
        });
        module.addEventListener('dragend', () => {
            module.classList.remove('dragging');
        });
    });

    vecGrid.forEach(container => {
        container.addEventListener('dragover', e => {
            e.preventDefault();
            const existingModules = container.getElementsByClassName("module");
            const module = document.querySelector('.module.dragging');
            if(existingModules.length > 0){
                    
            }
            else{
                container.appendChild(module); // Fix the typo here
            }
        });
    });
    
}

function getRandomModule() {
    const modules = [module1, module2, module3, module4];
    const randomIndex = getRandomInt(modules.length);
    return modules[randomIndex];
}

function createMonster(selectedPosition) {
    // Implementation for creating a monster
}

function getRandomMonster() {
    const monsters = [monster1, monster2, monster3, monster4];
    const randomIndex = getRandomInt(monsters.length);
    return monsters[randomIndex];
}

function startFight() {
    let cont1 = 4;
    let position;
    do {
        position = document.querySelector(`.random${cont1}`);
        if (position) {
            createModule(position);
        }
        cont1 -= 1;
    } while (cont1 >= 1);
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
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}