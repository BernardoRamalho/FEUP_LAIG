% includes
:- include('computer.pl').
:- use_module(library(between)).


nextMove(Board, 0, [0, 0], NewBoard):-
    readPlay(Board, 0, NewBoard).

nextMove(Board, 1, [0, 0], NewBoard):-
    readPlay(Board, 1, NewBoard).

nextMove(Board, 0, [1, 0], NewBoard):-
    readPlay(Board, 0, NewBoard).

nextMove(Board, 1, [1, 0], NewBoard):-
    randomBot(Board, 1, NewBoard).

nextMove(Board, 0, [2, 0], NewBoard):-
    readPlay(Board, 0, NewBoard).

nextMove(Board, 1, [2, 0], NewBoard):-
    smartBot(Board, 1, NewBoard).

nextMove(Board, 0, [1, 1], NewBoard):-
    randomBot(Board, 0, NewBoard).

nextMove(Board, 0, [1, 2], NewBoard):-
    randomBot(Board, 0, NewBoard).

nextMove(Board, 1, [_, 1], NewBoard):-
    randomBot(Board, 1, NewBoard).

nextMove(Board, 0, [2, N], NewBoard):-
    dif(N,0),
    smartBot(Board, 0, NewBoard).

nextMove(Board, 1, [_, 2], NewBoard):-
    smartBot(Board, 1, NewBoard).

decidePlay(Var, Board, Turn, NewBoard):-
    Var \= 'play',
    Var \= 'pass',
    readPlay(Board,Turn, NewBoard).

decidePlay(Var, Board, Turn, NewBoard):-
    Var == 'play',
    readMove(Board, Turn, NewBoard).

decidePlay(Var, Board, _, Board):-
    Var == 'pass'.

readPlay(Board, Turn, NewBoard):-
    %verify if move list is not empty and ask to play
    nl,
    format('Jogador ~w insira "pass" para passar a jogada ou "play" para fazer uma jogada.', Turn),
    read(Var),
    decidePlay(Var, Board, Turn, NewBoard).

validate_inputs(Board, Turn, M, M):-
    valid_move(Board, Turn, M), !.

validate_inputs(Board, Turn, M, M1):-
    \+valid_move(Board, Turn, M),
    write('Por favor faca uma jogada valida...'), nl,
    readInputs(Board, Turn, M1).


readInputs(Board, Turn, M):-
    write('Insira a linha de onde mover: '),
    read(FromRow),
    write('Insira a Coluna de onde mover: '),
    read(FromCollumn),
    write('Insira a linha para onde vai mover: '),
    read(ToRow),
    write('Insira a Coluna para onde vai mover: '),
    read(ToCollumn),

    %Process both collumns 
    processCollumn(FromCollumn, FromCollumnNumber),
    processCollumn(ToCollumn, ToCollumnNumber),

    M1 = [FromRow, FromCollumnNumber, ToRow, ToCollumnNumber],
    validate_inputs(Board, Turn, M1, M).

readMove(Board, Turn, NewBoard):-
    !,
    readInputs(Board, Turn, M),
    [FromRow, FromCollumnNumber, ToRow, ToCollumnNumber] = M,

    Move = [Turn, FromRow, FromCollumnNumber, ToRow, ToCollumnNumber],
    
    move(Board, Move, NewBoard).

move(Board, Move, NewBoard):-
    [_, X1, Y1, X2, Y2] = Move,
    executeMove(Board, [X1, Y1, X2, Y2], NewBoard).


executeMove(Board, [FromRow, FromCollumn, ToRow, ToCollumn], NewBoard):-

    getElementFromBoard(Board, FromRow, FromCollumn, Elem1),

    color(Elem1, FromPieceColor),
    stack(Elem1, FromPieceNumber),
    
    replaceElement(Board, TempBoard, FromPieceColor, FromPieceNumber, Elem1, FromCollumn, FromRow),
    
    getElementFromBoard(TempBoard, ToRow, ToCollumn, Elem2),

    color(Elem2, ToPieceColor),
    stack(Elem2, PieceNumber),

    ToPieceNumber is PieceNumber + 1,
    replaceElement(TempBoard, NewBoard, ToPieceColor, ToPieceNumber, Elem2, ToCollumn, ToRow).