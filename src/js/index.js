const squares = {
    1: $('#square1'),
    2: $('#square2'),
    3: $('#square3'),
    4: $('#square4'),
    5: $('#square5'),
    6: $('#square6'),
    7: $('#square7'),
    8: $('#square8'),
    9: $('#square9'),
}

const winCombos = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['1', '4', '7'],
    ['2', '5', '8'],
    ['3', '6', '9'],
    ['1', '5', '9'],
    ['3', '5', '7'],
]

const p1scoreEl = $('#p1score')
const p2scoreEl = $('#p2score')
// const difficulty = $('#difficulty').val();
const turnEl = $('#turn')
const modal = $('#modal')
const modalWinner = $('#modalWinner')

let endOfGame = false
let turn = (Math.random() > 0.5) ? 'p1' : 'p2'
let p1score = 0
let p2score = 0
let p1pieces = ''
let p2pieces = ''
let opponent = ''
let userPiece = ''
let computerPiece = ''

function gameOver() {
    p1pieces = ''
    p2pieces = ''
    endOfGame = true
}

function clearBoard() {
    Object.keys(squares).forEach(num => {
        squares[num].removeClass('gamePiece o x')
    })

    turn = (Math.random() > 0.5) ? 'p1' : 'p2'
}

function onWin(winner) {
    if (winner === 'p1') {
        p1score += 1
        p1scoreEl.html(p1score)
        modalWinner.html(`${$('#player1').val()} wins!`)
    } else {
        p2score += 1
        p2scoreEl.html(p2score)
        modalWinner.html(`${$('#player2').val()} wins!`)
    }
    modal.slideDown()
    return false
}

function testWin() {
    return winCombos.some(combo => {
        let p1Found = 0
        let p2Found = 0
        combo.forEach(num => {
            if (p1pieces.indexOf(num) !== -1) p1Found += 1
            if (p2pieces.indexOf(num) !== -1) p2Found += 1
        })
        if (p1Found === 3) {
            onWin('p1')
            return true
        }
        if (p2Found === 3) {
            onWin('p2')
            return true
        }
        return false
    })
}

function testWinOrDraw() {
    // test draw
    if (p1pieces.length === 5 || p2pieces.length === 5) {
        modalWinner.html('It\'s a draw.')
        modal.slideDown()
        endOfGame = true
    }
    // test win
    if (p1pieces.length >= 3 || p2pieces.length >= 3) {
        if (testWin()) {
            gameOver()
        }
    }
}

function computerTurn() {
    function endComputerTurn() {
        turn = 'p1'
        turnEl.html($('#player1').val())
    }

    function randomAvailableSquare() {
        const index = Math.round(Math.random() * ($('.square:not(.gamePiece)').length - 1))
        return $('.square:not(.gamePiece)')[index]
    }

    if ($('.gamePiece').length < 3) {
        const randomSquare = randomAvailableSquare()
        $(randomSquare).addClass(`gamePiece ${computerPiece}`)
        p2pieces += randomSquare.classList[1].split('')[2]
        endComputerTurn()
        testWinOrDraw()
        return false
    }

    const currentBoard = {}

    $.each($('.square'), (index, square) => {
        currentBoard[index + 1] = square.classList
    })

    function findTwo() {
        const results = []
        for (let i = 0; i < winCombos.length; i += 1) {
            let computerFound = 0
            let humanFound = 0

            for (let x = 0; x < winCombos[i].length; x += 1) {
                const comboPiece = winCombos[i][x]
                if (currentBoard[comboPiece].contains(computerPiece)) {
                    computerFound += 1
                } else if (currentBoard[comboPiece].contains(userPiece)) {
                    humanFound += 1
                }
            }

            if (computerFound + humanFound === 3) {
                continue // eslint-disable-line no-continue
            } else if (computerFound === 2) {
                results.push(['computer has two', winCombos[i]])
            } else if (humanFound === 2) {
                results.push(['human has two', winCombos[i]])
            }
        }

        return results
    }

    let computerMove = null
    let almostWins = findTwo()

    if (almostWins.length === 0) {
        const randomSquare = randomAvailableSquare()
        $(randomSquare).addClass(`gamePiece ${computerPiece}`)
        p2pieces += randomSquare.classList[1].split('')[2]
        endComputerTurn()
        testWinOrDraw()
        return false
    }

    if (almostWins.length > 1) {
        almostWins = almostWins.sort((a, b) => a[0].localeCompare(b[0]))
    }

    function findComputerMove(comboWithTwo) {
        for (let i = 0; i < 3; i += 1) {
            const comboPiece = comboWithTwo[i]
            if (currentBoard[comboPiece].contains('gamePiece') === false) {
                return comboPiece
            }
        }
    }

    computerMove = findComputerMove(almostWins[0][1])

    $(`#square${computerMove}`).addClass(`gamePiece ${computerPiece}`)

    p2pieces += computerMove
    endComputerTurn()
    testWinOrDraw()
    return false
}

// squares click handler initalization
Object.keys(squares).forEach(num => {
    squares[num].on('click tap', () => {
        if (squares[num].hasClass('gamePiece')) return false

        if (turn === 'p1') {
            squares[num].addClass(`gamePiece ${userPiece}`)
            p1pieces += num
            turn = 'p2'
            turnEl.html($('#player2').val())
        } else if (turn === 'p2') {
            squares[num].addClass(`gamePiece ${computerPiece}`)
            p2pieces += num
            turn = 'p1'
            turnEl.html($('#player1').val())
        }

        testWinOrDraw()

        if (opponent === 'computer' && !endOfGame) {
            setTimeout(computerTurn, 500)
        }
    })
})

$('#human').click(() => {
    opponent = 'human'
    $('#select-piece').hide()
    $('#start').show()
})

$('#computer').click(() => {
    opponent = 'computer'
    $('#select-piece').show()
    if ($('input[name="choose-piece"]:checked').length > 0) {
        $('#start').show()
    } else {
        $('#start').hide()
    }
})

$('#x-piece').click(() => {
    userPiece = 'x'
    computerPiece = 'o'
    $('#start').show()
})
$('#o-piece').click(() => {
    userPiece = 'o'
    computerPiece = 'x'
    $('#start').show()
})

$('#start').on('click tap', () => {
    $('#select').fadeOut(() => {
        if (opponent === 'computer') {
            $('#player2').val('Computer')
        }
        const player = (turn === 'p1') ? $('#player1').val() : $('#player2').val()
        turnEl.html(player)
        endOfGame = false
        $('#game').fadeIn(() => {
            if (turn === 'p2' && opponent === 'computer') {
                computerTurn()
            }
        })
    })
})

$('#home').on('click tap', () => {
    $('#game').fadeOut(() => {
        modal.slideUp()
        gameOver()
        clearBoard()
        p1score = 0
        p2score = 0
        p1scoreEl.html('0')
        p2scoreEl.html('0')
        $('#select').fadeIn()
    })
})

$('#modalButton').on('click tap', () => {
    gameOver()
    clearBoard()
    endOfGame = false
    const player = (turn === 'p1') ? $('#player1').val() : $('#player2').val()
    turnEl.html(player)
    modal.slideUp(() => {
        if (turn === 'p2' && opponent === 'computer') {
            setTimeout(computerTurn, 200)
        }
    })
})
