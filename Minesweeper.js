var board = [];
var rows = 8;
var columns = 8;

let minesCount =7;
// var minesLocation = []; // "2-2", "3-4", "2-1"

// let tilesClicked = 0; //phải click vào hết các tile số và trừ tile mìn
// let flagEnabled = false;
// let gameOver = false;

window.onload = function() {
    startGame();
}

// function setMines() {
    // minesLocation.push("2-2");
    // minesLocation.push("2-3");
    // minesLocation.push("5-6");
    // minesLocation.push("3-4");
    // minesLocation.push("1-1");

//     let minesLeft = minesCount;
//     while (minesLeft > 0) {
//         let r = Math.floor(Math.random() * rows);
//         let c = Math.floor(Math.random() * columns);
//         let id = r.toString() + "-" + c.toString();
//
//         if (!minesLocation.includes(id)) {
//             minesLocation.push(id);
//             minesLeft -= 1;
//         }
//     }
// }


function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    // document.getElementById("flag-button").addEventListener("click", setFlag);
    // setMines();

    //populate our board
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            //<div id="0-0"></div>
            // createElement:tạo ra biến tile được chỉ định bởi thẻ div
            // tile dùng để nhận biết khi click vào thì biết nó ở đâu trong board
            let tile = document.createElement("div");
            // toString: chuyển đổi kiểu Number sang chuỗi
            tile.id = r.toString() + "-" + c.toString();
            // tile.addEventListener("click", clickTile);
            // append: di chuyển 1 thành phần tile vào 1 thành phần khác (board)
            document.getElementById("board").append(tile)
            row.push(tile);
        }
        board.push(row);
    }
    console.log(board);
}