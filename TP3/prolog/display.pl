piece(N, white, Code):-
  Code is 10111 + N.

piece(N, black, Code):-
  Code is 10121 + N.


displayHeaderTop(N, N):-
  printLineDivision, put_code(9559), nl.

displayHeaderTop(0, N):-
  write('      '), put_code(9556),
  displayHeaderTop(1, N).

displayHeaderTop(N,Nmax):-
  printLineDivision, put_code(9574),
  NewN is N+1,
  displayHeaderTop(NewN, Nmax).

displayHeaderBot(N, N):-
  Letter is 64 + N,
  write('  '), put_code(Letter), write('  '), put_code(9553), nl.

displayHeaderBot(0, N):-
  write(' y/x  '), put_code(9553),
  displayHeaderBot(1, N).

displayHeaderBot(N,Nmax):-
  Letter is 64 + N,
  write('  '), put_code(Letter), write('  '), put_code(9553),
  NewN is N+1,
  displayHeaderBot(NewN, Nmax).

displayHeader(Nmax):-
  displayHeaderTop(0, Nmax),
  displayHeaderBot(0, Nmax).
displayRowTop(N, N):-
  printLineDivision, put_code(9571), nl.

displayRowTop(0, N):-
  put_code(9556), printLineDivision, put_code(9580),
  displayRowTop(1, N).

displayRowTop(N,Nmax):-
  printLineDivision, put_code(9580),
  NewN is N+1,
  displayRowTop(NewN, Nmax).

displayRowMiddle(N, N):-
  printLineDivision, put_code(9571), nl.

displayRowMiddle(0, N):-
  put_code(9568), printLineDivision, put_code(9580),
  displayRowMiddle(1, N).

displayRowMiddle(N,Nmax):-
  printLineDivision, put_code(9580),
  NewN is N+1,
  displayRowMiddle(NewN, Nmax).


displayRowBot(N, N):-
  printLineDivision, put_code(9565), nl.

displayRowBot(0, N):-
  put_code(9562), printLineDivision, put_code(9577),
  displayRowBot(1, N).

displayRowBot(N,Nmax):-
  printLineDivision, put_code(9577),
  NewN is N+1,
  displayRowBot(NewN, Nmax).

displayBoard(Board, Nmax):-
  displayRowTop(0, Nmax),
  displayBoardAux(Board, 0, Nmax).

displayRow(_, N1, N2):-
  N1 \== N2,
  displayRowMiddle(0,N2).

displayRow(_, N1, N1):-
  displayRowBot(0,N1).
displayBoardAux([], N, N).
displayBoardAux([H|T], RowNumber, Nmax):-
  put_code(9553), write('  '), write(RowNumber), write('  '), put_code(9553),
  displayRowValues(H, 0, Nmax), nl,
  N1 is RowNumber + 1,
  displayRow(0, N1, Nmax),
  displayBoardAux(T, N1, Nmax).

displayRowValues([], N, N).
displayRowValues([H|T], N, Nmax):-
  N1 is N + 1,
  displayValue(H),
  put_code(9553),
  displayRowValues(T, N1, Nmax).

displayValue(Elem):-
  color(Elem, X),
  stack(Elem, Y),
  printCel(Y, X).

displayGame(Board):-
  length(Board, Nmax),
  displayHeader(Nmax),
  displayBoard(Board, Nmax).

displayHand([]).
displayHand([H|T]):-
  stack(H, Num),
  color(H, Color),
  printCel(Num, Color),
  displayHand(T).

printCel(Elem, _) :-
  Elem == 00,
  write('     ').

printCel(Elem, Elemcolor) :-
  piece(Elem, Elemcolor, Code), 
  write('  '), put_code(Code), write(' ').

printLineDivision :-  
  put_code(9552), put_code(9552), put_code(9552), put_code(9552), put_code(9552).