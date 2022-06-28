let board = [];
let rows = 8;
let columns = 8;

let minesCount =7;
let minesLocation = []; // "2-2", "3-4", "2-1"

let tilesClicked = 0; //phải click vào hết các tile số và trừ tile mìn
let flagEnabled = false;
let gameOver = false;

window.onload = function() {
    startGame();
}

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


// khi bắt đầu game: lấy id của số mìn và nút đặt cờ
function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    setMines();
    // đặt vị trí của mìn
    function setMines() {
        // minesLocation.push("0-0");
        // minesLocation.push("2-3");
        // minesLocation.push("5-6");
        // minesLocation.push("3-4");
        // minesLocation.push("1-1");
        let minesLeft = minesCount;
        while (minesLeft > 0) {
            let r = Math.floor(Math.random() * rows);
            let c = Math.floor(Math.random() * columns);
            let id = r.toString() + "-" + c.toString();

            if (!minesLocation.includes(id)) {
                minesLocation.push(id);
                minesLeft -= 1;
            }
        }
    }

    //Tạo bảng (mảng 8 hàng 8 cột)
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            //<div id="0-0"></div>
            // createElement:tạo ra biến tile được chỉ định bởi thẻ div
            // tile dùng để nhận biết khi click vào thì biết nó ở đâu trong board
            let tile = document.createElement("div");
            // toString: chuyển đổi kiểu Number sang chuỗi
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            // append: di chuyển 1 thành phần tile vào 1 thành phần khác (board)
            document.getElementById("board").append(tile)
            row.push(tile);
        }
        board.push(row);
    }
    console.log(board);
}
// Tạo hàm khởi động chế độ đặt cờ:
function setFlag(){
    if (flagEnabled){
        flagEnabled=false;
        document.getElementById("flag-button").style.backgroundColor="lightgray"
} else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "yellow";
    }
}

// Tạo hàm kích chuột vào từng ô để gắn cờ:
function clickTile() {
    // khi dò hết mìn => dừng game
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
        let tile = this;
        if (flagEnabled) {

            if (tile.innerText == "") {
                tile.innerText = "🚩";
            } else if (tile.innerText == "🚩") {
                tile.innerText = "";
            }
            return;
        }
        // nếu hàm mineLocation( ô có bom) có trong tile (ô vuông) => thua
        // include; kiểm tra xem mineLocation có chứa tile ko
        if (minesLocation.includes(tile.id)) {
            alert("Bạn quá đen =))))");
            gameOver = true;
            revealMines();
            // return;
        }
    }

// muốn biết bao nhiêu mìn xung quanh 1 số:
// split: chia 1 chuỗi thành một mảng các chuỗi con
    let caculate = tile.id.split("-");
    let r = parseInt(caculate[0]);
    let c = parseInt(caculate[1]);

// Tạo hàm hiển thị tất cả mìn khi clcik vào mìn
    function revealMines() {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                let tile = board[r][c];
                if (minesLocation.includes(tile.id)) {
                    tile.innerText = "💣";
                    tile.style.backgroundColor = "red";
                }
            }
        }
    }


    function checkMine(r, c) {
        if (r < 0 || r >= rows || c < 0 || c >= columns) {
            return;
        }
        if (board[r][c].classList.contains("tile-clicked")) {  //chứa "tile-clicked" thì là true, không thì false
            return;
        }

        board[r][c].classList.add("tile-clicked"); //thêm "tile-clicked" vào board
        tilesClicked += 1;

        // kiểm tra xem 8 ô xung quanh có mìn hay không
        let minesFound = 0;
        //3 ô hàng trên
        minesFound += checkTile(r - 1, c - 1);      //top left
        minesFound += checkTile(r - 1, c);        //tops
        minesFound += checkTile(r - 1, c + 1);      //top right

        //trái / phải
        minesFound += checkTile(r, c - 1);        //left
        minesFound += checkTile(r, c + 1);        //right

        //3 ô hàng dưới
        minesFound += checkTile(r + 1, c - 1);      //bottom left
        minesFound += checkTile(r + 1, c);        //bottom
        minesFound += checkTile(r + 1, c + 1);      //bottom right

        if (minesFound > 0) {
            board[r][c].innerText = minesFound;
            board[r][c].classList.add("x" + minesFound.toString());
        } else {
            //top 3
            checkMine(r - 1, c - 1);    //top left
            checkMine(r - 1, c);      //top
            checkMine(r - 1, c + 1);    //top right

            //left and right
            checkMine(r, c - 1);      //left
            checkMine(r, c + 1);      //right

            //bottom 3
            checkMine(r + 1, c - 1);    //bottom left
            checkMine(r + 1, c);      //bottom
            checkMine(r + 1, c + 1);    //bottom right
        }
        if (tilesClicked == rows * columns - minesCount) {
            document.getElementById("mines-count").innerText = "Cleared";
            gameOver = true;
        }
    }

    checkMine(r, c);

// hàm check xem nếu số cột và số hàng không thỏa mãn 1 ô vuông => không có mìn
    function checkTile(r, c) {
        if (r < 0 || r >= rows || c < 0 || c >= columns) {
            return 0;
        }
        if (minesLocation.includes(r.toString() + "-" + c.toString())) {
            return 1;
        }
        return 0;
    }
}