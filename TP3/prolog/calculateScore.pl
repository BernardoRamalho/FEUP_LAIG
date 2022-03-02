% Point = [Elem, X, Y], X = Row Y = Collumn
% Path = List of Points [[Elem1, X1,Y1],[Elem2, X2,Y2]]
% List of Paths is a List of Lists that contain points (which are lists too) ([[[Elem1, X1,Y1],[Elem2, X2,Y2]], [[Elem3, X3,Y3], [Elem4, X3, Y4]]])

%All Points Exist
createPath(Board, RowNumber, CollumnNumber, Path, _, 0, Path):-
    getElementFromBoard(Board, RowNumber, CollumnNumber, Elem), color(Elem, white), !.
createPath(Board, RowNumber, CollumnNumber, Path, _, 0, Path):-
    getElementFromBoard(Board, RowNumber, CollumnNumber, Elem),
    color(Elem, black),

    Point = [Elem, RowNumber, CollumnNumber],
    member(Point, Path).

createPath(Board, RowNumber, CollumnNumber, CurrentPath, BoardSize, 0, NewPath):-
    getElementFromBoard(Board, RowNumber, CollumnNumber, Elem),
    color(Elem, black),

    Point = [Elem, RowNumber, CollumnNumber],
    \+member(Point, CurrentPath), !,
    append(CurrentPath, [Point], Path0),
    UpY is RowNumber - 1,
    RightX is CollumnNumber + 1,
    LeftX is CollumnNumber - 1,
    DownY is RowNumber + 1,

    getUpPath(Board, UpY, CollumnNumber, Path0, BoardSize, 0, Path1), !,
    getLeftPath(Board, RowNumber, LeftX, Path1, BoardSize, 0, Path2), !, 
    getRightPath(Board, RowNumber, RightX, Path2, BoardSize, 0, Path3), !,
    getDownPath(Board, DownY, CollumnNumber, Path3, BoardSize, 0, NewPath), !.

% Case of White Player
createPath(Board, RowNumber, CollumnNumber, Path, _, 1, Path):- 
    getElementFromBoard(Board, RowNumber, CollumnNumber, Elem), color(Elem, black), !.

createPath(Board, RowNumber, CollumnNumber, Path, _, 1, Path):-
    getElementFromBoard(Board, RowNumber, CollumnNumber, Elem),
    color(Elem, white),

    Point = [Elem, RowNumber, CollumnNumber],
    member(Point, Path).

createPath(Board, RowNumber, CollumnNumber, CurrentPath, BoardSize, 1, NewPath):-
    getElementFromBoard(Board, RowNumber, CollumnNumber, Elem),
    color(Elem, white),

    Point = [Elem, RowNumber, CollumnNumber],
    \+member(Point, CurrentPath), !,
    append(CurrentPath, [Point], Path0),
    UpY is RowNumber - 1,
    RightX is CollumnNumber + 1,
    LeftX is CollumnNumber - 1,
    DownY is RowNumber + 1,

    getUpPath(Board, UpY, CollumnNumber, Path0, BoardSize, 1, Path1), !,
    getLeftPath(Board, RowNumber, LeftX, Path1, BoardSize, 1, Path2), !,
    getRightPath(Board, RowNumber, RightX, Path2, BoardSize, 1, Path3), !,
    getDownPath(Board, DownY, CollumnNumber, Path3, BoardSize, 1, NewPath), !.

getUpPath(_, RowNumber, _, Path, _, _, Path):-RowNumber < 0, !.
getUpPath(Board, RowNumber, CollumnNumber, Path, BoardSize, Player, NewPath):-
    RowNumber >= 0,
    createPath(Board, RowNumber, CollumnNumber, Path, BoardSize, Player, NewPath).

getLeftPath(_, _, CollumnNumber, Path, _, _, Path):-CollumnNumber < 0, !.
getLeftPath(Board, RowNumber, CollumnNumber, Path, BoardSize, Player, NewPath):-
    CollumnNumber >= 0,
    createPath(Board, RowNumber, CollumnNumber, Path, BoardSize, Player, NewPath).

getRightPath(_, _, CollumnNumber, Path, BoardSize, _, Path):-CollumnNumber > BoardSize, !.
getRightPath(Board, RowNumber, CollumnNumber, Path, BoardSize, Player, NewPath):-
    CollumnNumber =< BoardSize,
    createPath(Board, RowNumber, CollumnNumber, Path, BoardSize, Player, NewPath).

getDownPath(_, RowNumber, _, Path, BoardSize, _, Path):-RowNumber > BoardSize, !.
getDownPath(Board, RowNumber, CollumnNumber, Path, BoardSize, Player, NewPath):-
    RowNumber =< BoardSize,
    createPath(Board, RowNumber, CollumnNumber, Path, BoardSize, Player, NewPath).

iterateRow(_, _, [], _, _, _, Paths, Paths).
iterateRow(FixedBoard, BoardSize, [_|T], RowNumber, CollumnNumber, Player, CurrentPaths, NewPaths):-
    createPath(FixedBoard, RowNumber, CollumnNumber, [], BoardSize, Player, Path),
    append(CurrentPaths, [Path], Paths1),
    Col is CollumnNumber + 1,
    iterateRow(FixedBoard, BoardSize, T, RowNumber, Col, Player, Paths1, NewPaths).

getAllPaths(_, _, [], _, _, Paths, Paths).
getAllPaths(FixedBoard, BoardSize, [L|T], RowNumber, Player, CurrentPaths, AllPaths):-
    iterateRow(FixedBoard, BoardSize, L, RowNumber, 0, Player, CurrentPaths, Paths1),
    Row is RowNumber + 1,
    getAllPaths(FixedBoard, BoardSize, T, Row, Player, Paths1, AllPaths).


calculateValueOfPath([], 0).
calculateValueOfPath([H|T], Value):-
    calculateValueOfPath(T, Value1),
    [Elem | _] = H,
    stack(Elem, X),
    Value is Value1 + X.
    
calculateMaxValuePath([], 0).
calculateMaxValuePath([Path|T], Value):-
    calculateValueOfPath(Path, V),
    calculateMaxValuePath(T, Value1),
    V =< Value1, !,
    Value = Value1.
calculateMaxValuePath([Path|T], Value):-
    calculateValueOfPath(Path, V),
    calculateMaxValuePath(T, Value1),
    V > Value1, !,
    Value = V.

value(Board, Player, Value):-
    length(Board, Size),
    S is Size - 1,
    getAllPaths(Board, S, Board, 0, Player, [], Paths),
    calculateMaxValuePath(Paths, Value).