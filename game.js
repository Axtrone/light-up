//MAPS
let maps = {
    easy : [["white", "white", "white", "1", "white", "white", "white"],
            ["white", "0", "white", "white", "white", "2", "white"],
            ["white", "white", "white","white", "white", "white","white"],
            ["", "white", "white", "", "white", "white", ""],
            ["white", "white", "white","white", "white", "white","white"],
            ["white", "", "white", "white", "white", "2", "white"],
            ["white", "white", "white", "3", "white", "white", "white"]],
    medium : [["white", "white", "0", "white", "", "white", "white"],
              ["white", "white", "white", "white", "white", "white", "white"],
              ["", "white", "", "white", "3", "white", ""],
              ["white", "white", "white", "1", "white", "white", "white"],
              ["2", "white", "", "white", "", "white", ""],
              ["white", "white", "white", "white", "white", "white", "white"],
              ["white", "white", "", "white", "2", "white", "white"]],
    hard : [["white", "", "white","white", "white", "white","white", 'white', 'white', 'white'],
            ["white", "white", "white","white", "white", "3","white", '2', 'white', ''],
            ["white", "0", "","white", "white", "white","white", '', 'white', 'white'],
            ["white", "white", "white","white", "", "white","white", 'white', 'white', 'white'],
            ["white", "1", "white","white", "", "1","", 'white', 'white', 'white'],
            ["white", "white", "white","", "", "","white", 'white', '3', 'white'],
            ["white", "white", "white","white", "white", "","white", 'white', 'white', 'white'],
            ["white", "white", "1","white", "white", "white","white", '0', '', 'white'],
            ["3", "white", "","white", "0", "white","white", 'white', 'white', 'white'],
            ["white", "white", "white","white", "white", "white","white", 'white', '0', 'white']]
}

//VARIABLES
let playingMap = [[]]
let savedMaps = []
let mapName = ""
let playerName = ""
let hBoard = []
const table = document.querySelector("table")
const mapSelectDiv = document.querySelector("#mapSelect")
const gameSpaceDiv = document.querySelector("#gameSpace")
const newMapSelector = document.querySelector("#newMap")
const btnStart = document.querySelector("#btnStart")
const timerDiv = document.querySelector("#timer")
const inpName = document.querySelector("#name")
const winModal = new bootstrap.Modal('#winnerModal')
const btnNewgame = document.querySelector("#newGameBtn")
const btnBack = document.querySelector("#mapSelectBtn")
const savedMapsUl = document.querySelector("#savedMaps")
const btnSave = document.querySelector("#btnSave")
let timer = null
let totalSeconds = null
let gameState = 0 //0-STOPPED  1-RUNNING






//FUNCTIONS
function drawMap(){
    //Térkép kirajzolása
    const generated = playingMap.map((e, y) => "<tr>" + e.map((f, x) => {
        switch (f) {
            case "white":
                return '<td class="white"></td>';
            case "lit":
                return '<td class="lit"></td>'
            case "bulb":
                return '<td class="bulb">💡</td>'
            case "wrong":
                return '<td class="wrong">💡</td>'
            default:
                if(f != "" && isGoodDark(x, y)) return `<td class="good">${f}</td>`
                else return `<td class="dark">${f}</td>`
        }
    }).join('')+"</tr>").join('')
    table.innerHTML = generated
}
function startNewGame(map, name, time = "0"){
    timer = null
    timerDiv.innerHTML = "00:00";
    if(time != "0") playingMap = map.map(arr => arr.slice())
    else playingMap = maps[map].map(arr => arr.slice());
    gameState = 1
    playerName = name
    drawMap()
    startTimer(parseInt(time))
}
function putBulb(x, y){
    // Villanykörte behelyezése i, j-re
    if(playingMap[y][x] != "white" && playingMap[y][x] != "lit"){
        alert("Rossz mező!")
    }
    else{
        playingMap[y][x] = 'bulb'
        drawMap()
        setTimeout(() => {putAnimation(x,y)},100)
    }
}
function removeBulb(x, y){
    if(!seeBulb(x, y)) playingMap[y][x] = 'white'
    else playingMap[y][x] = 'lit'
    drawMap()
    setTimeout(() => {removeAnimation(x,y)},100)
}
function isGoodDark(x, y){
    let size = playingMap[0].length
    const goal = parseInt(playingMap[y][x])
    let curr = 0;
    if(x > 0 && (playingMap[y][x-1] == "bulb" || playingMap[y][x-1] == "wrong")) curr++
    if(y > 0 && (playingMap[y-1][x] == "bulb" || playingMap[y-1][x] == "wrong")) curr++
    if(x < size-1 && (playingMap[y][x+1] == "bulb" || playingMap[y][x+1] == "wrong")) curr++
    if(y < size-1 && (playingMap[y+1][x] == "bulb" || playingMap[y+1][x] == "wrong")) curr++
    return goal == curr
}
function allGood(){
    let  win= true;
    let i = 0
    while(i < playingMap[0].length && win){
        let j = 0
        while(j < playingMap[0].length && win){
            let e = playingMap[i][j]
            if(!(["bulb", "wrong", "white", "lit", ""].includes(e))) win = isGoodDark(j, i)
            if(e == 'white' || e == 'wrong') win = false
            j++
        }
        i++
    }
    return win
}
function putAnimation(x, y, i = 1, xpMore = true, xmMore = true, ypMore = true, ymMore = true){
    if (xpMore || ypMore || xmMore || ymMore) {
        let size = playingMap[0].length;
        let xp = x+i
        let xm = x-i
        let yp = y+i
        let ym = y-i
        if(xp < size && xpMore){
            if(playingMap[y][xp] == 'white'){
                playingMap[y][xp] = "lit";
            }
            else if(playingMap[y][xp] == 'bulb' || playingMap[y][xp] == 'wrong'){
                playingMap[y][xp] = 'wrong'
                playingMap[y][x] = 'wrong'
            }
            else if(playingMap[y][xp] != 'lit'){
                xpMore = false
            }
        } else xpMore = false
        if(xm > -1 && xmMore){
            if(playingMap[y][xm] == 'white'){
                playingMap[y][xm] = "lit";
            }
            else if(playingMap[y][xm] == 'bulb' || playingMap[y][xm] == 'wrong'){
                playingMap[y][xm] = 'wrong'
                playingMap[y][x] = 'wrong'
            }
            else if(playingMap[y][xm] != 'lit'){
                xmMore = false
            }
        } else xmMore = false
        if(yp < size && ypMore){
            if(playingMap[yp][x] == 'white'){
                playingMap[yp][x] = "lit";
            }
            else if(playingMap[yp][x] == 'bulb' || playingMap[yp][x] == 'wrong'){
                playingMap[yp][x] = 'wrong'
                playingMap[y][x] = 'wrong'
            }
            else if(playingMap[yp][x] != 'lit'){
                ypMore = false
            }
        } else ypMore = false
        if(ym > -1 && ymMore){
            if(playingMap[ym][x] == 'white'){
                playingMap[ym][x] = "lit";
            }
            else if(playingMap[ym][x] == 'bulb' || playingMap[ym][x] == 'wrong'){
                playingMap[ym][x] = 'wrong'
                playingMap[y][x] = 'wrong'
            }
            else if(playingMap[ym][x] != 'lit'){
                ymMore = false
            }
        } else ymMore = false
        drawMap()
        setTimeout(() => putAnimation(x, y, i + 1, xpMore, xmMore, ypMore, ymMore), 100)
    }
}
function removeAnimation(x, y, i = 1, xpMore = true, xmMore = true, ypMore = true, ymMore = true){
    if (xpMore || ypMore || xmMore || ymMore) {
        let size = playingMap[0].length;
        let xp = x+i
        let xm = x-i
        let yp = y+i
        let ym = y-i
        if(xp < size && xpMore){
            if(playingMap[y][xp] == 'lit'){
                if(!seeBulb(xp, y)) playingMap[y][xp] = "white";
            }
            else if(playingMap[y][xp] == 'wrong'){
                if(!seeBulb(xp, y)) playingMap[y][xp] = 'bulb'
            }
            else{
                xpMore = false
            }
        } else xpMore = false
        if(xm > -1 && xmMore){
            if(playingMap[y][xm] == 'lit'){
                if(!seeBulb(xm, y)) playingMap[y][xm] = "white";
            }
            else if(playingMap[y][xm] == 'wrong'){
                if(!seeBulb(xm, y)) playingMap[y][xm] = 'bulb'
            }
            else{
                xmMore = false
            }
        } else xmMore = false
        if(yp < size && ypMore){
            if(playingMap[yp][x] == 'lit'){
                if(!seeBulb(x, yp)) playingMap[yp][x] = "white";
            }
            else if(playingMap[yp][x] == 'wrong'){
                if(!seeBulb(x, yp)) playingMap[yp][x] = 'bulb'
            }
            else{
                ypMore = false
            }
        } else ypMore = false
        if(ym > -1 && ymMore){
            if(playingMap[ym][x] == 'lit'){
                if(!seeBulb(x, ym)) playingMap[ym][x] = "white";
            }
            else if(playingMap[ym][x] == 'wrong'){
                if(!seeBulb(x, ym)) playingMap[ym][x] = 'bulb'
            }
            else{
                ymMore = false
            }
        } else ymMore = false
        drawMap()
        setTimeout(() => removeAnimation(x, y, i + 1, xpMore, xmMore, ypMore, ymMore), 100)
    }
}
function seeBulb(x, y){
    for (let i = x+1; i < playingMap[0].length; i++){
        if(playingMap[y][i] == "bulb" || playingMap[y][i] == "wrong") return true
        if(playingMap[y][i] != "lit" && playingMap[y][i] != "white") break
    }
    for (let i = y+1; i < playingMap[0].length; i++){
        if(playingMap[i][x] == "bulb" || playingMap[i][x] == "wrong") return true
        if(playingMap[i][x] != "lit" && playingMap[i][x] != "white") break
    }
    for (let i = x-1; i >= 0; i--){
        if(playingMap[y][i] == "bulb" || playingMap[y][i] == "wrong") return true
        if(playingMap[y][i] != "lit" && playingMap[y][i] != "white") break
    }
    for (let i = y-1; i >= 0; i--){
        if(playingMap[i][x] == "bulb" || playingMap[i][x] == "wrong") return true
        if(playingMap[i][x] != "lit" && playingMap[i][x] != "white") break
    }
    return false
}
function checkWin(){
    if(allGood()){
        const toSaveH = {
            name: playerName,
            map: mapName,
            time: timerDiv.innerHTML
        }
        hBoard.push(toSaveH)
        localStorage.hBoard = JSON.stringify(hBoard)
        winModal.show()
        gameState = 0
        stopTimer()
    }
}
function startTimer(start){
    totalSeconds = start
    timer = setInterval(() => {
        ++totalSeconds;
        updateTimer(totalSeconds)
    }, 1000)
}
function updateTimer(secs){
    var minute = Math.floor(secs/60);
    var seconds = secs - (minute*60);
    if(minute < 10) minute = "0"+minute;
    if(seconds < 10) seconds = "0"+seconds;
    timerDiv.innerHTML = minute + ":" + seconds;
}
function returnMapsSelect(){
    updateMapSelect()
    mapSelectDiv.classList.remove("visually-hidden")
    gameSpaceDiv.classList.add("visually-hidden")
}
function stopTimer() {clearInterval(timer)}
function xyCoord(td) {
    return {
      x: td.cellIndex,
      y: td.parentNode.sectionRowIndex,
    }
}
function loadSavedMaps(){
    if(localStorage.savedMaps != null) savedMaps = JSON.parse(localStorage.savedMaps)
}
function loadHBoard(){
    if(localStorage.hBoard != null) hBoard = JSON.parse(localStorage.hBoard)
}
function fullName(Fname){
    switch (Fname){
        case "easy":
            return "Könnyű"
        case "hard":
            return "Extrém"
        case "medium":
            return "Haladó"
    }
}
function updateMapSelect(){
    loadSavedMaps()
    const savedList = savedMaps
        .map(e => `<li class="mt-2">${e.date} <strong>${e.time}</strong><button type="button" class="btn btn-dark ms-3" data-name="${e.id}">Folytatás</button></li>`)
        .join('')
    savedMapsUl.innerHTML = savedList
    loadHBoard()
    const hList = hBoard.map(e => `<li><strong>${e.name}</strong> - ${fullName(e.map)} - <strong>${e.time}</strong></li>`).join('')
    document.querySelector("#hUL").innerHTML = hList
}





//EVENT LISTENERS
btnStart.addEventListener("click", () => {
    if(newMapSelector.value == "_mapselect") alert("Válassz pályát!")
    else if(inpName.value == "") alert("Válassz nevet!")
    else{
        mapSelectDiv.classList.add("visually-hidden")
        gameSpaceDiv.classList.remove("visually-hidden")
        mapName = newMapSelector.value
        startNewGame(newMapSelector.value, inpName.value)
    }
})
table.addEventListener("click", e =>{
    if(e.target.matches("td")){
        let coords = xyCoord(e.target)
        if(playingMap[coords.y][coords.x] != "bulb" && playingMap[coords.y][coords.x] != "wrong"){
            putBulb(coords.x, coords.y)
        }
        else{
            removeBulb(coords.x, coords.y)
        }
        setTimeout(() => {
            checkWin()
        }, playingMap[0].length * 100)
    }
})
btnNewgame.addEventListener("click", () => {
    startNewGame(mapName, playerName)
})
btnBack.addEventListener("click", () => {
    returnMapsSelect()
})
savedMapsUl.addEventListener("click", e => {
    if(e.target.matches("button")){
        const id = e.target.dataset.name
        savedMaps.forEach(e => {
            if(e.id == id){
                mapSelectDiv.classList.add("visually-hidden")
                gameSpaceDiv.classList.remove("visually-hidden")
                mapName = e.originalMapName
                startNewGame(e.modifiedMap, e.name, e.timer)
                updateTimer(e.timer)
            }
        })
    }
})
btnSave.addEventListener("click", () => {
    const date = new Date()
    forSaveMap = {
        name: playerName,
        date: date.toLocaleDateString(),
        time: `${date.getHours() > 9 ? date.getHours() : "0" + date.getHours()}:${(date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes())}`,
        id: `${playerName}-${date.toLocaleString()}`,
        originalMapName: mapName,
        modifiedMap: playingMap,
        timer: totalSeconds
    }
    savedMaps.push(forSaveMap)
    localStorage.savedMaps = JSON.stringify(savedMaps)
    gameState = 0
    stopTimer()
    alert("Sikeres mentés!")
    returnMapsSelect()
})



updateMapSelect()