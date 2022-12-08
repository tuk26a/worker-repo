var sudoku;


//Ham tao Ma tran voi 81 phan tu
function generate() {
	sudoku = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	var saved = new Array();
	var savedSudoku = new Array();
	var i = 0;

	//Bien nextMove de kiem tra con o trong nao tiep theo khong
	var nextMove;
	
	//Bien whatToTry 
	var whatToTry;

	//Bien attempt
	var attempt;
	while (!isSolvedSudoku(sudoku)) {
		i++;
		nextMove = scanSudokuForUnique(sudoku);
		if (nextMove == false) {
			nextMove = saved.pop();
			sudoku = savedSudoku.pop();
		}
		whatToTry = nextRandom(nextMove);
		attempt = determineRandomPossibleValue(nextMove, whatToTry);
		if (nextMove[whatToTry].length > 1) {
			nextMove[whatToTry] = removeAttempt(nextMove[whatToTry], attempt);
			saved.push(nextMove.slice());
			savedSudoku.push(sudoku.slice());
		}
		sudoku[whatToTry] = attempt;
	}

	result = convertArray(sudoku);
	sudoku = convertArray(sudoku);

	return {result: result, sudoku: sudoku};
}

//Ham push la them phan tu vao cuoi mang, unshift la them phan tu vao dau mang, 
//ham slice la ham lay phan tu bat dau va cuoi cung nhung khong thay doi mang cu ma 
// tao ra mang moi 

function convertArray(sudoku) {
	arr = [];

	for (var i = 0; i < 9; i++) {
		arr.push(sudoku.slice(i * 9, (i + 1) * 9));
	}

	var arr = arr.map((x, i) => arr[i].map(y => ({ num: y, readOnly: true })));

	return arr;
}

//Tim vi tri cua hang khi dua vao vi tri cua o
function returnRow(cell) {
	return Math.floor(cell / 9);
}

// Tim vi tri cua cot khi dua vao 1 o
function returnCol(cell) {
	return cell % 9;
}

// Tra ve vi tri cua khoi khi dua vao 1 o
function returnBlock(cell) {
	return Math.floor(returnRow(cell) / 3) * 3 + Math.floor(returnCol(cell) / 3);
}

//Kiem tra so co bi trung trong hang khong

function isPossibleRow(number, row, sudoku) {
	for (var i = 0; i <= 8; i++) {
		if (sudoku[row * 9 + i] == number) {
			return false;
		}
	}
	return true;
}

//Kiem tra so co bi trung trong cot khong
function isPossibleCol(number, col, sudoku) {
	for (var i = 0; i <= 8; i++) {
		if (sudoku[col + 9 * i] == number) {
			return false;
		}
	}
	return true;
}

//Kiem tra so co bi trung trong khoi khong
function isPossibleBlock(number, block, sudoku) {
	for (var i = 0; i <= 8; i++) {
		if (sudoku[Math.floor(block / 3) * 27 + i % 3 + 9 * Math.floor(i / 3) + 3 * (block % 3)] == number) {
			return false;
		}
	}
	return true;
}

// Kiem tra ca 3 dieu kien tren xem so co thoa man khong
function isPossibleNumber(cell, number, sudoku) {
	var row = returnRow(cell);
	var col = returnCol(cell);
	var block = returnBlock(cell);
	return isPossibleRow(number, row, sudoku) && isPossibleCol(number, col, sudoku) && isPossibleBlock(number, block, sudoku);
}

//Kiem tra hang ca mot hang cua ma tran da dien co thoa man khong
function isCorrectRow(row, sudoku) {
	var rightSequence = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
	var rowTemp = new Array();
	for (var i = 0; i <= 8; i++) {
		rowTemp[i] = sudoku[row * 9 + i];
	}
	rowTemp.sort();
	return rowTemp.join() == rightSequence.join();
}

//Kiem tra mot cot dai da thoa man chua
function isCorrectCol(col, sudoku) {
	var rightSequence = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
	var colTemp = new Array();
	for (var i = 0; i <= 8; i++) {
		colTemp[i] = sudoku[col + i * 9];
	}
	colTemp.sort();
	return colTemp.join() == rightSequence.join();
}

//Kiem tra khoi da thoa man chua 
function isCorrectBlock(block, sudoku) {
	var rightSequence = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
	var blockTemp = new Array();
	for (var i = 0; i <= 8; i++) {
		blockTemp[i] = sudoku[Math.floor(block / 3) * 27 + i % 3 + 9 * Math.floor(i / 3) + 3 * (block % 3)];
	}
	blockTemp.sort();
	return blockTemp.join() == rightSequence.join();
}

//Tong hop lai 3 dieu kien tren xem ma tran da dien da thoa man chua
// Ket qua da dung hay chua
function isSolvedSudoku(sudoku) {
	for (var i = 0; i <= 8; i++) {
		if (!isCorrectBlock(i, sudoku) || !isCorrectRow(i, sudoku) || !isCorrectCol(i, sudoku)) {
			return false;
		}
	}
	return true;
}

// đã cho một ô và một sudoku, trả về một mảng với tất cả các giá trị có thể mà chúng ta có thể 
// ghi vào ô
function determinePossibleValues(cell, sudoku) {
	var possible = new Array();
	for (var i = 1; i <= 9; i++) {
		if (isPossibleNumber(cell, i, sudoku)) {
			possible.unshift(i);
		}
	}
	return possible;
}

//đưa ra một mảng các giá trị có thể có thể gán cho một ô, trả về một giá trị ngẫu nhiên được chọn từ mảng
function determineRandomPossibleValue(possible, cell) {
	var randomPicked = Math.floor(Math.random() * possible[cell].length);
	return possible[cell][randomPicked];
}

//đã cho một sudoku, trả về một mảng hai chiều với tất cả các giá trị có thể
function scanSudokuForUnique(sudoku) {
	var possible = new Array();
	for (var i = 0; i <= 80; i++) {
		if (sudoku[i] == 0) {
			possible[i] = new Array();
			possible[i] = determinePossibleValues(i, sudoku);
			if (possible[i].length == 0) {
				return false;
			}
		}
	}
	return possible;
}

//đã cho một mảng và một số, xóa số khỏi mảng
function removeAttempt(attemptArray, number) {
	var newArray = new Array();
	for (var i = 0; i < attemptArray.length; i++) {
		if (attemptArray[i] != number) {
			newArray.unshift(attemptArray[i]);
		}
	}
	return newArray;
}

//đã cho một mảng hai thứ nguyên của các giá trị có thể, trả về chỉ số của một ô nơi có ít số có thể hơn để chọn
function nextRandom(possible) {
	var max = 9;
	var minChoices = 0;
	for (var i = 0; i <= 80; i++) {
		if (possible[i] != undefined) {
			if ((possible[i].length <= max) && (possible[i].length > 0)) {
				max = possible[i].length;
				minChoices = i;
			}
		}
	}
	return minChoices;
}
