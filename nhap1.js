let board = [];
let rows = 8;
let columns = 8;

let minesCount = 8;
let minesLocation = [];

let tilesClicked = 0; //phải click vào hết các tile số và trừ tile mìn
let flagEnabled = false;

let gameOver = false;

window.onload = function() {
    startGame();
}

// khi bắt đầu game: lấy id của số mìn và nút đặt cờ
function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);

// Đặt số lượng mìn random
    function setMines() {
    let minesLeft = minesCount;
    while (minesLeft > 0) {
        // Math.floor: Làm tròn giá tri
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();
        // kiểm tra xem id có nằm trong chuỗi minesLocation, nếu ko thì push id vào, giảm trừ số lượng mìn đi 1 ô
        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
} setMines();

    //Tạo bảng (mảng 8 hàng 8 cột)
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            //<div id="0-0"></div>
            // createElement:tạo ra biến tile được chỉ định bởi thẻ div
            let tile = document.createElement("div");
            // toString: chuyển đổi kiểu Number sang chuỗi
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            // append: di chuyển 1 thành phần tile vào 1 thành phần khác (board)
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}
// Tạo hàm khởi động chế độ đặt cờ:
function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}
// Tạo hàm kích chuột vào từng ô để gắn cờ:
function clickTile() {
    // khi dò hết mìn => dừng game => return và ko xét các điều kiện sau
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;
    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
        }
        else if (tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }
    // nếu hàm mineLocation( ô có bom) có trong tile (ô vuông) => thua
    // include; kiểm tra xem mineLocation có chứa tile ko
    if (minesLocation.includes(tile.id)) {
        alert("Bạn quá gà");
        gameOver = true;
        revealMines();
        return;
    }

    // muốn biết bao nhiêu mìn xung quanh 1 số:
    // split: chia 1 chuỗi thành một mảng các chuỗi con
    let caculate = tile.id.split("-"); // "0-0" -> ["0", "0"]
    let r = parseInt(caculate[0]);
    let c = parseInt(caculate[1]);
    checkMine(r, c);

}
// Tạo hàm hiển thị tất cả mìn khi click vào mìn
function revealMines() {
    for (let r= 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}
// Hàm kiểm tra số lượng mìn
function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    // xét điều kiện "tile-clicked" đã được click => return hàm, ko xét điều kiện dưới
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }
    // mỗi lần click sẽ mở 1 ô => thắng khi mở hết các ô
    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;
// kiểm tra xem 8 ô xung quanh có mìn hay không
    let minesFound = 0;

    //3 ô hàng trên
    minesFound += checkTile(r-1, c-1);      // trên bên trái
    minesFound += checkTile(r-1, c);           //trên
    minesFound += checkTile(r-1, c+1);      //trên bên phải

    //trái / phải
    minesFound += checkTile(r, c-1);        //trái
    minesFound += checkTile(r, c+1);        //phải

    //3 ô hàng dưới
    minesFound += checkTile(r+1, c-1);      //dưới bên trái
    minesFound += checkTile(r+1, c);           //dưới
    minesFound += checkTile(r+1, c+1);      //dưới bên phải

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        // Số thay đổi màu khi tương ứng với số mìn
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        //Hàng trên
        checkMine(r-1, c-1);    //top left
        checkMine(r-1, c);      //top
        checkMine(r-1, c+1);    //top right

        //trái phải
        checkMine(r, c-1);      //left
        checkMine(r, c+1);      //right

        //Hàng dưới
        checkMine(r+1, c-1);    //bottom left
        checkMine(r+1, c);      //bottom
        checkMine(r+1, c+1);    //bottom right
    }
    // điều kiện khi đã click hết các ô:
    if (tilesClicked == rows * columns - minesCount) {
        alert("Ừ THÌ BẠN THẮNG NHƯNG CHẮC LÀ ĂN RÙA THÔI")
        gameOver = true;
    }

}

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