% Tabuleiros 9*9 exemplos
test([
  [b1, p1],
  [p1, b1]]).

initial([
  [b1, p1, b1, p1, b1, p1, b1, p1],
  [p1, b1, p1, b1, p1, b1, p1, b1],
  [b1, p1, b1, p1, b1, p1, b1, p1],
  [p1, b1, p1, b1, p1, b1, p1, b1],
  [b1, p1, b1, p1, b1, p1, b1, p1],
  [p1, b1, p1, b1, p1, b1, p1, b1],
  [b1, p1, b1, p1, b1, p1, b1, p1],
  [p1, b1, p1, b1, p1, b1, p1, b1]
  ]).

mid([
  [b2, p1, p3, p1, p1, p1, b4, p1, p1],
  [p1, p1, b4, b2, b4, p1, b2, p3, p1],
  [p1, p1, b2, b4, p1, p3, p1, p1, p1],
  [p1, p3, p1, p1, p3, p1, b2, p1, p1],
  [p3, p1, p1, b4, p1, p3, p1, p1, p1],
  [p1, b4, b2, b2, p1, p1, b2, b2, p1],
  [p1, p3, p1, p3, p3, p1, b2, p1, p1],
  [b4, p1, b2, p1, b2, p1, p3, p1, p1],
  [p1, p1, p3, p1, p1, p3, p1, p1, b4]
  ]).

final([
  [b4, p1, p3, p1, b2, p1, b4, p1, p1],
  [p1, p1, b4, b2, b4, p1, b2, p3, p1],
  [b2, b2, b2, b4, p1, p3, p1, b2, b2],
  [p1, p3, p1, p1, p3, p1, b2, p1, p1],
  [p3, p1, p1, b4, p1, p3, p1, b2, b2],
  [p1, b4, b2, b2, p1, p1, b2, p3, p1],
  [p1, p3, p1, p3, p3, p1, b2, p1, p1],
  [b4, b2, b2, p1, b2, p1, p3, p1, p1],
  [p1, p1, p3, b2, p1, p3, p1, b2, b4]
  ]).
% ------------------------------

createWhiteHand([], 0).
createWhiteHand([b1|T], N):-
  N1 is N - 1,
  createWhiteHand(T, N1).

createBlackHand([], 0).
createBlackHand([p1|T], N):-
  N1 is N - 1,
  createBlackHand(T, N1).


createBoard([], 0, _, _).
createBoard([H|T], N, Total, 0):-
  N > 0,
  N1 is N-1,
  NT is Total,
  createRow(H, NT, 0),
  createBoard(T, N1, Total, 1).


createBoard([H|T], N, Total, 1):-
  N > 0,
  N1 is N-1,
  NT is Total,
  createRow(H, NT, 1),
  createBoard(T, N1, Total, 0).

createRow([], 0, _).
createRow([b1|Row], N, 0):-
  N > 0,
  N1 is N-1,
  createRow(Row, N1, 1).

createRow([p1|Row], N, 1):-
  N > 0,
  N1 is N-1,
  createRow(Row, N1, 0).

removeMiddlePiece(Board, Size, NewBoard):-
  1 is mod(Size, 2),
  X is Size/2,
  Y is truncate(X),
  write(Y), nl,
  nth0(Y, Board, Row),
  replaceOne(b1, empty, Y, Row, NewRow),
  replaceOne(Row, NewRow, Y, Board, NewBoard),
  write(NewBoard), nl.
