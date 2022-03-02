% modules
:- use_module(library(lists)).

% Returns the element at Row RowNumber and Collumn CollumnNumber.
getElementFromBoard(Board, RowNumber, CollumnNumber, Elem):-
  A is RowNumber + 1,
  B is CollumnNumber + 1,
  nth1(A, Board, Row),
  nth1(B, Row, Elem).

% Replace an element on a list for another
replaceAll(_, _, [], []).
replaceAll(O, R, [O|T], [R|T2]) :- replaceAll(O, R, T, T2).
replaceAll(O, R, [H|T], [H|T2]) :- dif(H,O), replaceAll(O, R, T, T2).

% Replace an element at a specified index for another
replaceOne(_, _, _, [], []).
replaceOne(ElemToReplace, NewElem, 0, [_|T], [NewElem|T2]):-
  replaceOne(ElemToReplace, NewElem, -1, T, T2).
replaceOne(ElemToReplace, NewElem, Index, [H|T], [H|T2]):-
  dif(Index, 0),
  NewIndex is Index - 1,
  replaceOne(ElemToReplace, NewElem, NewIndex, T, T2).


pop([_|T], T).