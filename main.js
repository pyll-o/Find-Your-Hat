const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';


class Field {
    constructor(field) {
        this._field = field;
    }
    get field() {
        return this._field;
    }
    print() {
        this.field.forEach(row => {
            console.log(row.join(''));
        });
    }
    startPosition() {
        let mapArr = this.field.map(row => row.indexOf(pathCharacter));
        let coordinates =[];
        for (let i = 0; i < mapArr.length; i++) {
            if (mapArr[i] > -1) {
                coordinates.push(i, mapArr[i]);
            }
        }
        return coordinates;
    }
    size() {
        let height = this.field.length;
        let width = this.field[0].length;
        return height * width;
    }
    play() {
        let coordinates = this.startPosition();
        do {
            this.print();
            let direction;
            do {
                direction = prompt('Which way (u/d/l/r)? ');
            } while (direction !== 'd' && direction !== 'u' && direction !== 'r' && direction !== 'l');
            if (direction === 'd') {
                coordinates.splice(0, 1, coordinates[0] + 1);            
            } else if (direction === 'u') {
                coordinates.splice(0, 1, coordinates[0] - 1);
            } else if (direction === 'r') {
                coordinates.splice(1, 1, coordinates[1] + 1);
            } else if (direction === 'l') {
                coordinates.splice(1, 1, coordinates[1] - 1);
            };
            if (coordinates[0] <= -1 || coordinates[1] <= -1 || this.field[coordinates[0]] === undefined || this.field[coordinates[0]][coordinates[1]] === undefined) {
                console.log('You left the field... Bye!');
                break;
            } else if (this.field[coordinates[0]][coordinates[1]] === hat) {
                console.log('Congratulations, you found your hat!');
                break;
            } else if (this.field[coordinates[0]][coordinates[1]] === hole) {
                console.log('You fell in a hole and broke your leg. Game over!');
                break;
            } else if (this.field[coordinates[0]][coordinates[1]] === pathCharacter) {
                console.log('When you decided to turn back, the demons from your past crushed your soul... Game over!');
                break;
            };
            this.field[coordinates[0]].splice(coordinates[1], 1, pathCharacter);
        } while (coordinates[0] > -1 && coordinates[1] > -1);        
    }
    playHard() {
        let coordinates = this.startPosition();
        let difficulty = prompt('Select difficulty (1-10) ');
        let difficultyNum = parseInt(difficulty);
        while (difficultyNum < 1 || difficultyNum > 10 || !difficultyNum) {
            difficulty = prompt(`Don't try to outsmart me! Select difficulty (1-10) `);
            difficultyNum = parseInt(difficulty);
        };
        do {
            let chance = Math.floor(Math.random() * (14 - difficultyNum));
            if (chance < 3) {
                let randomCoordinate = [Math.floor(Math.random() * this.field.length), Math.floor(Math.random() * this.field[0].length)];
                if (this.field[randomCoordinate[0]][randomCoordinate[1]] !== fieldCharacter) {
                    do {
                        randomCoordinate = [Math.floor(Math.random() * this.field.length), Math.floor(Math.random() * this.field[0].length)];
                    } while (this.field[randomCoordinate[0]][randomCoordinate[1]] !== fieldCharacter);
                };
                this.field[randomCoordinate[0]].splice(randomCoordinate[1], 1, hole);
            }
            this.print();
            let direction;
            do {
                direction = prompt('Which way (u/d/l/r)? ');
            } while (direction !== 'd' && direction !== 'u' && direction !== 'r' && direction !== 'l');
            if (direction === 'd') {
                coordinates.splice(0, 1, coordinates[0] + 1);            
            } else if (direction === 'u') {
                coordinates.splice(0, 1, coordinates[0] - 1);
            } else if (direction === 'r') {
                coordinates.splice(1, 1, coordinates[1] + 1);
            } else if (direction === 'l') {
                coordinates.splice(1, 1, coordinates[1] - 1);
            };
            if (coordinates[0] <= -1 || coordinates[1] <= -1 || this.field[coordinates[0]] === undefined || this.field[coordinates[0]][coordinates[1]] === undefined) {
                console.log('You left the field... Bye!');
                break;
            } else if (this.field[coordinates[0]][coordinates[1]] === hat) {
                console.log('Congratulations, you found your hat!');
                break;
            } else if (this.field[coordinates[0]][coordinates[1]] === hole) {
                console.log('You fell in a hole and broke your leg. Game over!');
                break;
            } else if (this.field[coordinates[0]][coordinates[1]] === pathCharacter) {
                console.log('When you decided to turn back, the demons from your past crushed your soul... Game over!');
                break;
            };
            this.field[coordinates[0]].splice(coordinates[1], 1, pathCharacter);
        } while (coordinates[0] > -1 && coordinates[1] > -1);
    }
    canFieldBeSolved() {
        let coordinates = this.startPosition();
        let startTime = Date.now();
        do {
            let destination = coordinates.slice();
            let randomDirection = Math.floor(Math.random() * 4);
            if (randomDirection === 0) {
                destination.splice(0, 1, destination[0] + 1);
            } else if (randomDirection === 1) {
                destination.splice(0, 1, destination[0] - 1);
            } else if (randomDirection === 2) {
                destination.splice(1, 1, destination[1] + 1);
            } else if (randomDirection === 3) {
                destination.splice(1, 1, destination[1] - 1);
            };
            if (destination[0] <= -1 || destination[1] <= -1 || this.field[destination[0]] === undefined || this.field[destination[0]][destination[1]] === undefined || this.field[destination[0]][destination[1]] === hole) {
            } else if (this.field[destination[0]][destination[1]] === hat) {
                return true;
            } else if (this.field[destination[0]][destination[1]] === fieldCharacter || this.field[destination[0]][destination[1]] === pathCharacter) {
                coordinates = destination;
            }
        } while (Date.now() - startTime < this.size() * this.size() * 0.1);
        return false;
    }
    static generateField(height, width, percentageOfHoles) {
        let primeArr = [];
        let fieldArr = [];
        let primeArrLength = height * width;
        for (let i = 0; i < primeArrLength; i++) {
            primeArr.push(fieldCharacter);
        };
        let numberOfHoles = Math.floor(primeArrLength * percentageOfHoles / 100);
        let startPosition = Math.floor(Math.random() * primeArrLength);
        primeArr.splice(startPosition, 1, pathCharacter);
        let hatPosition;
        do {
            hatPosition = Math.floor(Math.random() * primeArrLength);
        } while (hatPosition === startPosition);
        primeArr.splice(hatPosition, 1, hat);
        for (let j = 0; j < numberOfHoles; j++) {
            let holePosition;        
            do {
                holePosition = Math.floor(Math.random() * primeArrLength);
            } while (primeArr[holePosition] !== fieldCharacter);
            primeArr.splice(holePosition, 1, hole);
        };
        for (let k = 0; k < height; k++) {
            let row = primeArr.slice(k * width, k * width + width);
            fieldArr.push(row);
        };
        return fieldArr;
    }
}

const game = () => { 
    let myField = new Field(Field.generateField(10, 20, 30)); 
    console.log('New field generated. Checking validity...');
    if (myField.canFieldBeSolved()){
        console.log('Field validated.');
        let easyOrHard;        
        do {
            easyOrHard = prompt('Game difficulty: easy (e) or hard (h)? ');
        } while (easyOrHard !== 'e' && easyOrHard !== 'h');
        if (easyOrHard === 'e') {
            myField.play();
        } else if (easyOrHard === 'h') {
            myField.playHard();
        };     
    } else {
        console.log('Field invalid. Apologies. Trying again...');
        return false;
    };
    return true;
}

while (!game()) {
    game();
}
