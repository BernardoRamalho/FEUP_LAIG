% includes
:- include('utils.pl').

:- include('startGame.pl').

:- include('menu.pl').

:- include('move.pl').

:- include('display.pl').


play:-
    display_game_name,
    select_mode(_,CPU1,CPU2,Size),
    createBoard(Board, Size, Size, 0),
    % removeMiddlePiece(Board, Size, Board),
    Turn is 0,
    CPUS = [CPU1, CPU2],
    mainLoop(Board, Turn, CPUS, 0), nl,
    print('Finished execution correctly.').

game_over(Board, 0):-
    value(Board, 0, Score0),
    value(Board, 1, Score1),
    Score0>Score1, !,
    format('Player 0 score: ~w.', Score0),nl,
    format('Player 1 score: ~w.', Score1),nl,
    write('Player 0 is the winner! Congratulations.').

game_over(Board, 1):-
    value(Board, 0, Score0),
    value(Board, 1, Score1),
    Score0<Score1, !,
    format('Player 0 score: ~w.', Score0),nl,
    format('Player 1 score: ~w.', Score1),nl,
    write('Player 1 is the winner! Congratulations.').

game_over(Board, _):-
    value(Board, 0, Score0),
    value(Board, 1, Score1),
    Score0 == Score1, !,
    format('Player 0 score: ~w.', Score0),nl,
    format('Player 1 score: ~w.', Score1),nl,
    write('Its a Tie...').

mainLoop(Board, _, _, 2):-
    game_over(Board, _).
    

mainLoop(Board, Turn, CPUS, N):-
    dif(N,2),
    Temp is Turn + 1,
    NextTurn is Temp mod 2,
    
    displayGame(Board), !,
    nextMove(Board, Turn, CPUS, NewBoard),
    checkBoardDif(Board, NewBoard, N, NewN),
    write(N), nl,
    mainLoop(NewBoard, NextTurn, CPUS, NewN).


checkBoardDif(Board, NewBoard, N, NewN):-
    \+dif(Board,NewBoard),
    NewN is N + 1.

checkBoardDif(Board, NewBoard, _, 0):-
    dif(Board,NewBoard).