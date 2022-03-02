:- include('boardManipulation.pl').
:- include('calculateScore.pl').
:- use_module(library(random)).


random_pass_play(Board, ListOfValidMoves, NewBoard):-
    length(ListOfValidMoves, L),
    dif(L,0),
    random(0, L, R),
    nth0(R, ListOfValidMoves, Move),
    executeMove(Board, Move, NewBoard).

random_pass_play(Board, ListOfValidMoves, Board):-
    length(ListOfValidMoves, L),
    \+dif(L,0).

randomBot(Board, Turn, NewBoard):-
    valid_moves(Board, Turn, ListOfValidMoves),
    random_pass_play(Board, ListOfValidMoves, NewBoard).


get_board_score(Board, Turn, M, Score, NewBoard):-
    executeMove(Board, M, NewBoard),
    value(NewBoard, Turn, Score).

smart_pass_play(_, _, [], _, NewBoard, NewBoard).

smart_pass_play(Board, Turn, [M|T], CurrentMaxScore, _, NewBoard):-
    get_board_score(Board, Turn, M, Score, TempBoard),
    Score > CurrentMaxScore,
    smart_pass_play(Board, Turn, T, Score, TempBoard, NewBoard).

smart_pass_play(Board, Turn, [M|T], CurrentMaxScore, AuxBoard, NewBoard):-
    get_board_score(Board, Turn, M, Score, _),
    Score =< CurrentMaxScore,
    smart_pass_play(Board, Turn, T, Score, AuxBoard, NewBoard).


play_noplay(Board, _, [], Board).

play_noplay(Board, Turn, ListOfValidMoves, NewBoard):-
    smart_pass_play(Board, Turn, ListOfValidMoves, 0, Board, NewBoard).

smartBot(Board, Turn, NewBoard):-
    valid_moves(Board, Turn, ListOfValidMoves),
    play_noplay(Board, Turn, ListOfValidMoves, NewBoard).
