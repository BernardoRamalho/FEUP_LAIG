:- include('declarations.pl').

replaceElement(Board, NewBoard, white, PieceNumber, ElementToBeReplaced, CollumnNumber, RowNumber):-
    
    color(ToPiece, black),
    stack(ToPiece, PieceNumber),

    X is RowNumber + 1,
    nth1(X, Board, Row),

    replaceOne(ElementToBeReplaced, ToPiece, CollumnNumber, Row, ToRow),
    replaceOne(Row, ToRow, RowNumber, Board, NewBoard).


replaceElement(Board, NewBoard, black, PieceNumber, ElementToBeReplaced, CollumnNumber, RowNumber):-
    color(ToPiece, white),
    stack(ToPiece, PieceNumber),

    X is RowNumber + 1,
    nth1(X, Board, Row),

    replaceOne(ElementToBeReplaced, ToPiece, CollumnNumber, Row, ToRow),
    replaceOne(Row, ToRow, RowNumber, Board, NewBoard).


valid_move(Board, Player, [X1,Y1,X2,Y2]):-
    length(Board, L),
    RealL is L - 1,
    X1>=0, Y1>=0, X2>=0,  Y2>=0,
    X1=< RealL, Y1=< RealL, X2=< RealL,  Y2=< RealL,
    getElementFromBoard(Board, X1, Y1, Elem1),
    getElementFromBoard(Board, X2, Y2, Elem2), !,
    checkPlayer(Player, Elem1, Elem2),
    checkDistance([X1,Y1,X2,Y2]).


checkDistance([X,Y1,X,Y2]):-
    abs(Y1 - Y2) =:= 1,
    !.

checkDistance([X1,Y,X2,Y]):-
    abs(X1 - X2) =:= 1,
    !.


checkPlayer(0, Elem1, Elem2):-
    color(Elem1, Color1),
    color(Elem2, Color2),

    Color1 == black,
    dif(Color1, Color2),
    
    stack(Elem1, Num1),
    stack(Elem2, Num2),
    Num1 == Num2,
    !.

checkPlayer(1, Elem1, Elem2):-
    color(Elem1, Color1),
    color(Elem2, Color2),

    Color1 == white,
    dif(Color1, Color2),
    
    stack(Elem1, Num1),
    stack(Elem2, Num2),
    Num1 == Num2,
    !.

valid_moves(Board, Player, ListOfValidMoves):-
    length(Board, LT),
    L is LT - 1,
    
    findall([X1,Y1,X2,Y2], 
    (between(0, L, X1), between(0, L, Y1), between(0, L, X2), between(0, L, Y2),
    valid_move(Board, Player, [X1,Y1,X2,Y2])), 
    ListOfValidMoves).




processCollumn('A', CollumnNumber):- CollumnNumber is 0.

processCollumn('B', CollumnNumber):- CollumnNumber is 1.

processCollumn('C', CollumnNumber):- CollumnNumber is 2.

processCollumn('D', CollumnNumber):- CollumnNumber is 3.

processCollumn('E', CollumnNumber):- CollumnNumber is 4.

processCollumn('F', CollumnNumber):- CollumnNumber is 5.

processCollumn('G', CollumnNumber):- CollumnNumber is 6.

processCollumn('H', CollumnNumber):- CollumnNumber is 7.

processCollumn('I', CollumnNumber):- CollumnNumber is 8.

processCollumn('a', CollumnNumber):- CollumnNumber is 0.

processCollumn('b', CollumnNumber):- CollumnNumber is 1.

processCollumn('c', CollumnNumber):- CollumnNumber is 2.

processCollumn('d', CollumnNumber):- CollumnNumber is 3.

processCollumn('e', CollumnNumber):- CollumnNumber is 4.

processCollumn('f', CollumnNumber):- CollumnNumber is 5.

processCollumn('g', CollumnNumber):- CollumnNumber is 6.

processCollumn('h', CollumnNumber):- CollumnNumber is 7.

processCollumn('i', CollumnNumber):- CollumnNumber is 8.

processCollumn(0, CollumnNumber):- CollumnNumber is 0.

processCollumn(1, CollumnNumber):- CollumnNumber is 1.

processCollumn(2, CollumnNumber):- CollumnNumber is 2.

processCollumn(3, CollumnNumber):- CollumnNumber is 3.

processCollumn(4, CollumnNumber):- CollumnNumber is 4.

processCollumn(5, CollumnNumber):- CollumnNumber is 5.

processCollumn(6, CollumnNumber):- CollumnNumber is 6.

processCollumn(7, CollumnNumber):- CollumnNumber is 7.

processCollumn(8, CollumnNumber):- CollumnNumber is 8.