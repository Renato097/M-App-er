const map = document.querySelector('main .map');
const tileset = document.querySelector('main .menu .tiles');
const tiles = tileset.querySelectorAll('.tile');
const pinset = document.querySelector('main .menu .pins');
const pins = pinset.querySelectorAll('.pin');

const drawBtn = document.getElementById('draw');
const eraseBtn = document.getElementById('erase');
const pinBtn = document.getElementById('pin');
const clearBtn = document.getElementById('clear');
const drawAllBtn = document.getElementById('drawAll');
const sizeSel = document.getElementById('sizeSel');
const rotateBtn = document.getElementById('rotateBtn');
const textIn = document.getElementById('pinText');
const WxH = document.getElementById('WxH');

let mapTiles;
let draw = 1;

let sqSize = localStorage.getItem("sqSize") ? Number(localStorage.getItem("sqSize")) : 70;
sizeSel.value = sqSize;
localStorage.setItem("sqSize", sqSize);

let selectedTile = tiles[0].querySelector('.t');
tiles[0].classList.add('selected');
let tileFlag = [false, false, 0]; //[0]='rand', [1]='ang', [2]=rotate

let selectedPin = pins[0].querySelector('.p');
pins[0].classList.add('selected');
let pinText = '';

//-------------------------------------------------------------------------------------------------

document.documentElement.style.setProperty('--sqSize', `${sqSize}px`);
sizeSel.parentElement.querySelector('span').innerHTML = sqSize;

mapGenerate();

//-------------------------------------------------------------------------------------------------

function mapGenerate() {
    let mapWidth = Math.floor((map.offsetWidth - 10) / sqSize);
    let mapHeight = Math.floor((map.offsetHeight - 10) / sqSize);
    WxH.innerHTML = `Map: ${mapWidth * 1.5} m x ${mapHeight * 1.5} m`

    map.innerHTML = '';

    for (let i = 0; i < (mapWidth * mapHeight); i++) {
        let div = document.createElement('div');
        div.classList.add('mapTile');
        map.append(div)
    }

    mapTiles = map.querySelectorAll('.mapTile');

    mouseHandler();

    mapTiles.forEach(square => {

        // Click
        square.addEventListener('click', function () {
            let tile = square.querySelector('.t');
            let pin = square.querySelector('.p');

            if (draw === 1) { //Draw
                if (tile) { tile.remove() };

                square.append(selectedTile.cloneNode(true));

                tile = square.querySelector('.t');
                if (tileFlag[0]) { tile.style.rotate = `${randomRotation()}deg` };
                if (tileFlag[1]) { tile.style.rotate = `${tileRotation()}deg` };
            }
            else if (draw === 0) { //Erase
                if (tile) { tile.remove() };
            }
            else if (draw === 2) { //Pin
                if (pin) {
                    pin.remove();
                    square.title = '';
                }
                else {
                    square.append(selectedPin.cloneNode(true));
                    square.title = pinText;
                }
            }
        })


        // Right Click
        square.addEventListener('contextmenu', function (ev) {
            ev.preventDefault(); //don't show right click menu

            let cktile = square.querySelector('.t');
            let ckpin = square.querySelector('.p');

            if (draw === 1) { //Tile
                if (cktile) {
                    selectedTile = cktile;
                    
                    tiles.forEach(tile => {
                        tile.classList.remove('selected');
                        if (tile.querySelector('.t').src == selectedTile.src) {
                            tile.classList.add('selected');
                            
                            if (tile.classList.contains('rand')) { tileFlag[0] = true }
                            else { tileFlag[0] = false }
                            if (tile.classList.contains('ang')) { tileFlag[1] = true }
                            else { tileFlag[1] = false }
                            
                            selectedTile = tile;
                        }
                    })
                }
            } else if (draw === 2) { //Pin
                if (ckpin) {
                    selectedPin = ckpin;
                    pinText = square.title;
                    
                    pins.forEach(pin => {
                        pin.classList.remove('selected');
                        if (pin.querySelector('.p').src == selectedPin.src) { pin.classList.add('selected') }
                    })
                }
            }

            return false;
        }, false)

    })
}

function randomRotation() {
    let r = Math.floor(Math.random() * 4)
    switch (r) {
        case 0: return 0;
        case 1: return 90;
        case 2: return 180;
        case 3: return 270;
    }
}

function tileRotation() {
    switch (tileFlag[2]) {
        case 0: return 0;
        case 1: return 90;
        case 2: return 180;
        case 3: return 270;
    }
}

//-------------------------------------------------------------------------------------------------

// window.addEventListener("resize", function () { mapGenerate(); })

drawBtn.addEventListener('click', function () {
    drawBtn.classList.add('active');
    eraseBtn.classList.remove('active');
    pinBtn.classList.remove('active');
    draw = 1;
})

eraseBtn.addEventListener('click', function () {
    drawBtn.classList.remove('active');
    eraseBtn.classList.add('active');
    pinBtn.classList.remove('active');
    draw = 0
})

pinBtn.addEventListener('click', function () {
    drawBtn.classList.remove('active');
    eraseBtn.classList.remove('active');
    pinBtn.classList.add('active');
    draw = 2
})

clearBtn.addEventListener('click', function () {
    mapTiles.forEach(square => {
        square.innerHTML = '';
        square.title = '';
    })
})

drawAllBtn.addEventListener('click', function () {
    mapTiles.forEach(square => {
        drawBtn.click();
        square.click();
    })
})

sizeSel.addEventListener('input', function () {
    sqSize = sizeSel.value;
    document.documentElement.style.setProperty('--sqSize', `${sqSize}px`);
    sizeSel.parentElement.querySelector('span').innerHTML = sqSize;
    localStorage.setItem("sqSize", sqSize);
    mapGenerate();
})

rotateBtn.addEventListener('click', function () {
    if (tileFlag[2] < 3) { tileFlag[2]++ }
    else { tileFlag[2] = 0 }

    tiles.forEach(tile => {
        if (tile.classList.contains('ang')) {
            tile.querySelector('img').style.rotate = `${tileRotation()}deg`
        }
    })
})

textIn.addEventListener('input', function () { pinText = textIn.value })
textIn.addEventListener('focus', function () { pinText = '' })

//-------------------------------------------------------------------------------------------------

tiles.forEach(tile => {
    tile.addEventListener('click', function () {
        tiles.forEach(tile => { tile.classList.remove('selected') })
        tile.classList.add('selected');

        drawBtn.click();

        if (tile.classList.contains('rand')) { tileFlag[0] = true }
        else { tileFlag[0] = false }
        if (tile.classList.contains('ang')) { tileFlag[1] = true }
        else { tileFlag[1] = false }

        selectedTile = tile.querySelector('.t');
    })
})

pins.forEach(pin => {
    pin.addEventListener('click', function () {
        pins.forEach(pin => { pin.classList.remove('selected') })
        pin.classList.add('selected');

        pinBtn.click();

        selectedPin = pin.querySelector('.p');
        pinText = textIn.value;
    })
})


//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
let mouseHold = false;
function mouseHandler() {

    mapTiles.forEach(tile => {
        tile.addEventListener('mousedown', function () {
            mouseHold = true
        })
        tile.addEventListener('mousemove', function () {
            if (mouseHold && (draw === 1 || draw === 0)) { tile.click() }
        })
        tile.addEventListener('mouseup', function () {
            mouseHold = false
        })
    })

    document.querySelector('main .menu').addEventListener('mouseout', function () {
        if (mouseHold) {
            mouseHold = false
        }
    })

    document.addEventListener("mouseleave", function () {
        if (mouseHold) {
            mouseHold = false
        }
    })

}
//-------------------------------------------------------------------------------------------------