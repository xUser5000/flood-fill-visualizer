/**
 * 0 -> Initial state
 * 1 -> Running
 */
let state = 0;

let colors = {
    WHITE: [255, 255, 255],
    BLACK: [0, 0, 0],
    VISITED: [241, 196, 15]
};
let cols = 10;
let rows = 10;
let grid = [];  // Grid Data

function setup() {
    let canvas = createCanvas(550, 550);
    canvas.parent('container');
    // Initializing the state of the grid to be empty
    for (let i = 0; i < rows; i++) {
        grid.push([]);
        for (let j = 0; j < cols; j++) grid[i][j] = 0;
    }
}

function draw () {
    background(255);
    if (state === 0 && mouseIsPressed && isInside(mouseX, mouseY)) {
        let [i, j] = getCell(mouseX, mouseY);
        grid[i][j] = -1;
    }
    drawGrid();
}

async function run () {
    state = 1;
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (isValid(i, j)) await floodFill(i, j);
        }
    }
    state = 0;
}

/**
 * The recursive flood fill algorithm
 */
let di = [1, -1, 0, 0];
let dj = [0, 0, 1, -1];
let delay = 100;
async function floodFill (i, j) {
    grid[i][j] = 1;
    for (let k = 0; k < 4; k++) {
        let a = i + di[k];
        let b = j + dj[k];
        if (isValid(a, b)) {
            await sleep(delay);
            floodFill(a, b);
        }
    }
}

function isValid (i, j) {
    return i >= 0 && i < 10 && j >= 0 && j < 10 && grid[i][j] === 0;
}

/**
 * Draw the current state of the grid
 */
function drawGrid () {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let color;
            switch (grid[i][j]) {
                case -1:
                    color = colors.BLACK;
                    break;
                case 0:
                    color = colors.WHITE;
                    break;
                case 1:
                    color = colors.VISITED
            }
            colorCell(i, j, color);
        }
    }
}

/**
 * Given cell coordinates, paint the cell with the specified color
 */
function colorCell (i, j, colorCode) {
    let x = i * 50;
    let y = j * 50;
    fill(colorCode[0], colorCode[1], colorCode[2]);
    stroke(0);
    rect(x, y, 50, 50);
}

/**
 * Clear the grid
 */
function clearGrid () {
    if (state !== 0) return;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = 0;     // Make all grid cells available to traversing
        }
    }
}

/**
 * Given the mouse coordinates, determines if it's inside the canvas or not 
 */
function isInside (x, y) {
    return x >= 0 && x < 500 && y >= 0 && y < 500;
}

/**
 * Given some coordiantes, return the dimension of that cell in the grid
 */
function getCell (x, y) {
    let i = Math.floor(x/50);
    if (i === 10) i--;
    let j = Math.floor(y/50);
    if (j === 10) j--;
    return [i, j];
}

/**
 * Randomly choose an avaialable cell and turn it into an obstacle
 */
function randomize () {
    if (state !== 0) return;
    clearGrid();
    let cnt = 20;
    while (cnt > 0) {
        let i = Math.floor(Math.random() * 10);
        let j = Math.floor(Math.random() * 10);
        if (grid[i][j] !== -1) {
            grid[i][j] = -1;
            cnt--;
        }
    }
}

/**
 * Utility sleep function
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}