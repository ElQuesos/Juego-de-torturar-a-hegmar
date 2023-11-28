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

let mainHealth = 6;
let energy = 4;
let canStartFight = true;
let usableModule;
let img; //.....................cambiar en el futuro cercano
let vecRandom = [];
let vecGrid = [] ;
let aliveMonsters = [];
let createdMonsters = [];

class monster {
    constructor(name, health, monsterImg, alive, stuned, bleeding, dmg) {
        this.name = name;
        this.health = health;
        this.originalHealth = health; // Store the original health value
        this.monsterImg = monsterImg;
        this.alive = alive;
        this.stuned = stuned;
        this.bleeding = bleeding;
        this.dmg = dmg;
    }
}

const monster1 = new monster("Meaty", 6, img, true, false, false, 1);
const monster2 = new monster("Slimy", 2, img, true, false, false, 1);
const monster3 = new monster("Spiky", 3, img, true, false, false, 1);
const monster4 = new monster("Ugly", 1, img, true, false, false, 1);

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
const module3 = new moduleUse(0, 5, "GreasyBlader", img, "stun", 10);
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
    updateInfo();
}

function viewGame() {
    ctx.clearRect(0, 0, width, height);
    drawBackground();
    drawMainCharacter();
    updateInfo();
    if (!isFighting) {
        updateInfo();
        checkDPressed();
        checkRandomForFight();
    } else {
        updateInfo();
        showMonsters();
    }

    requestAnimationFrame(viewGame);
}

function drawBackground() {
    ctx.fillStyle = "gray";
    ctx.fillRect(back1.x, back1.y, back1.width, back1.height);
    ctx.fillStyle = "orange";
    ctx.fillRect(back2.x, back2.y, back2.width, back2.height);
}

function drawMainCharacter() {
    ctx.fillStyle = "red";
    ctx.fillRect(main.x, main.y, main.width, main.height);

    ctx.fillStyle = "green";
    ctx.font = "12px Arial";
    ctx.fillText(`Health: ${mainHealth}`, mainX, mainY + 120);
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

function checkDPressed() {
    if (isDPressed && !isFighting) {
        back1.x -= 5;
        back2.x -= 5;

        if (back1.x + back1.width <= 0) {
            back1.x = back2.x + back2.width;
        }
        if (back2.x + back2.width <= 0) {
            back2.x = back1.x + back1.width;
        }
    }
}

function checkRandomForFight() {
    if (canStartFight && isDPressed) {
        console.log("Checking for fight...");
        let random = getRandomInt(10);
        if (random === 9 && !isFighting) {
            random = 0;
            canStartFight = false; // Prevent further checks until the fight is over
            isFighting = true;
            console.log("Start fight");
            createMonster();
            startTurn();
        }
    }
}



async function createModule(selectedDiv) {
    const existingModules = selectedDiv.getElementsByClassName("module");
    if (existingModules.length > 0) {
        return;
    }

    const randomModule = getRandomModule();
    vecRandom.push(randomModule);
    const module = document.createElement("div");
    module.classList.add("module");
    module.style.width = "18rem";

    module.innerHTML = `
    <div class="${randomModule.moduleId}" data-module-calories="${randomModule.calories}" draggable="true">
        <img src="${randomModule.moduleImg}" alt="Module Image">
        <h3>${randomModule.moduleName}</h3>
    </div>
`;
    selectedDiv.appendChild(module);

    module.addEventListener('dragstart', (e) => {
        e.currentTarget.classList.add('dragging');
    });

    module.addEventListener('dragend', (e) => {
        e.currentTarget.classList.remove('dragging');
    });
    

    const mouth = document.querySelector(".mouth");
    mouth.addEventListener('dragover', e => {
        e.preventDefault();
        const dmodule = document.querySelector('.module.dragging');
        if (dmodule !== null) {
            mouth.appendChild(dmodule);
            const moduleCalories = parseInt(dmodule.getAttribute('data-module-calories'));
            console.log("Module calories:", moduleCalories);
            energy += moduleCalories;
            dmodule.remove(); 
            updateInfo();
            if (energy >= 10) {
                mainHealth += 1;
                energy -= 10;
            }
        }
    });

    vecGrid.forEach(container => {
        container.addEventListener('dragover', e => {
            e.preventDefault();
            const existingModules = container.getElementsByClassName("module");
            let draggedModule = document.querySelector('.module.dragging');
            if (existingModules.length === 0) {
                container.appendChild(draggedModule);
            }
        });
    });
}


function getRandomModule() {
    const modules = [module1, module2, module3, module4];
    const randomIndex = getRandomInt(modules.length);
    return modules[randomIndex];
}

function createMonster() {
    let random = getRandomInt(5);
    let cont2 = random;
    
    do {
        const randomMonster = getRandomMonster();
        cont2 -= 1;
        createdMonsters.push(randomMonster);
        console.log(randomMonster);
    } while (cont2 != 0);
}

function showMonsters() {
    const monsterSpacing = 120; // Espacio entre los monstruos

    aliveMonsters.forEach((monster, index) => {
        const X = monsX + index * monsterSpacing; // Calcula la posición X única para cada monstruo
        const Y = monsY - 10; // Y fijo para todos los monstruos

        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
        ctx.fillText(monster.name, X, Y);

        ctx.fillStyle = "green";
        ctx.font = "12px Arial";
        ctx.fillText(`Health: ${monster.health}`, X, Y + 120);

        ctx.fillStyle = "red";
        ctx.fillRect(X, monsY, monsW, monsH); // Dibuja un rectángulo para cada monstruo
    });
}

function getRandomMonster() {
    const monsters = [monster1, monster2, monster3, monster4];
    const randomIndex = getRandomInt(monsters.length);
    return monsters[randomIndex];
}
let buttonTurn;
document.addEventListener("DOMContentLoaded", function () {
    buttonTurn = document.querySelector(".endTurn");
    buttonTurn.disabled = true;
    buttonTurn.addEventListener("click", mainTurn);
});

function startTurn() {
    buttonTurn.disabled = false;
    console.log("Start turn");
    cleanModules();
    createdMonsters.forEach(monster => {
        if (monster.health > 0) {
            aliveMonsters.push(monster);
        }
    });

    if (aliveMonsters.length > 0 && mainHealth > 0) {
        isFighting = true;
        let cont1 = energy;
        let position;

        do {
            position = document.querySelector(`.random${cont1}`);
            if (position) {
                createModule(position);
                // Decrement energy only if a module is created successfully
                if (energy > 0) {
                    energy -= 1;
                }
            }
            cont1 -= 1;
        } while (cont1 >= 1);

        updateInfo();
    } else {
        endFight();
    }
}


function mainTurn() {
    canStartFight = true;
    console.log("Start fight");
    let monster;
    usableModule = []; 
    vecGrid.forEach(div => {
        usableModule.push(Array.from(div.getElementsByClassName("module")));
    });

    const flattenedModules = [].concat.apply([], usableModule);

    flattenedModules.forEach(moduleUse => {
        monster = aliveMonsters[0];
        if (monster && monster.health > 0) { 
            specialModuleFunction(moduleUse, monster);
            monster.health -= moduleUse.dmg;
        } else if (monster) {
            aliveMonsters.splice(0, 1); 
        }
    });
    updateInfo();
    monsterTurn();
}

function monsterTurn () {
    updateInfo();
        aliveMonsters.forEach(monster => {
            if (monster.stuned === true) {
                monster.stuned = false;
                return;
            }
            if (monster.bleeding === true) {
                monster.health -= 1;
            }

            setTimeout(() => {alert(monster.name + " does an attack for " + monster.dmg + " damage")}, 100);
            mainHealth -= monster.dmg;
        });
        aliveMonsters=[]
    updateInfo();
    startTurn();
}




function endFight() {
    if (aliveMonsters.length <= 0 && mainHealth > 0) {
        alert("you win");
    } else {
        alert("you lose");
    }

    createdMonsters.forEach(monster => {
        monster.health = monster.originalHealth;
    });

    // Resetting all arrays and variables
    isFighting = false;
    energy = 4;
    cleanModules();
    aliveMonsters = [];
    usableModule = [];
    createdMonsters = []; 
    updateInfo();
    buttonTurn.disabled = true;
}

function cleanModules() {
    vecGrid.forEach(grid => {
        const modules = grid.querySelectorAll(".module");
        modules.forEach(module => {
            module.remove();
        });
    });
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

async function updateInfo() {
    let divHealth = document.querySelector(".healthNumber");
    let divEnergy = document.querySelector(".energy");


    if (divHealth && divEnergy) {
        divHealth.innerText = mainHealth;
        divEnergy.innerText = energy;
    }


    ctx.clearRect(0, 0, width, height);
    drawBackground();
    drawMainCharacter();
    if (isFighting) {
        showMonsters();
    }
}

