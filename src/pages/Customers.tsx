$i$m$p$o$r$t$ ${$ $u$s$e$S$t$a$t$e$,$ $u$s$e$E$f$f$e$c$t$,$ $l$a$z$y$,$ $S$u$s$p$e$n$s$e$,$ $u$s$e$C$a$l$l$b$a$c$k$,$ $u$s$e$M$e$m$o$ $}$ $f$r$o$m$ $'$r$e$a$c$t$'$;$$
$i$m$p$o$r$t$ ${$ $$
$ $ $U$s$e$r$s$,$ $$
$ $ $T$r$e$n$d$i$n$g$U$p$,$ $$
$ $ $U$s$e$r$P$l$u$s$,$ $$
$ $ $S$e$a$r$c$h$,$ $$
$ $ $F$i$l$t$e$r$$
$}$ $f$r$o$m$ $'$l$u$c$i$d$e$-$r$e$a$c$t$'$;$$
$i$m$p$o$r$t$ $C$u$s$t$o$m$e$r$R$o$w$ $f$r$o$m$ $'$@$/$c$o$m$p$o$n$e$n$t$s$/$c$u$s$t$o$m$e$r$s$/$C$u$s$t$o$m$e$r$R$o$w$'$;$$
$i$m$p$o$r$t$ $M$o$d$a$l$L$o$a$d$e$r$ $f$r$o$m$ $'$@$/$c$o$m$p$o$n$e$n$t$s$/$M$o$d$a$l$L$o$a$d$e$r$'$;$$
$i$m$p$o$r$t$ $c$u$s$t$o$m$e$r$s$S$e$r$v$i$c$e$,$ ${$ $$
$ $ $C$u$s$t$o$m$e$r$$
$}$ $f$r$o$m$ $'$@$/$s$e$r$v$i$c$e$s$/$c$u$s$t$o$m$e$r$s$'$;$$
$i$m$p$o$r$t$ ${$ $u$s$e$D$e$b$o$u$n$c$e$ $}$ $f$r$o$m$ $'$@$/$h$o$o$k$s$/$u$s$e$D$e$b$o$u$n$c$e$'$;$$
$$
$/$/$ $L$a$z$y$ $l$o$a$d$ $t$h$e$ $m$o$d$a$l$ $c$o$m$p$o$n$e$n$t$$
$c$o$n$s$t$ $C$u$s$t$o$m$e$r$M$o$d$a$l$ $=$ $l$a$z$y$($($)$ $=$>$ $i$m$p$o$r$t$($'$@$/$c$o$m$p$o$n$e$n$t$s$/$c$u$s$t$o$m$e$r$s$/$C$u$s$t$o$m$e$r$M$o$d$a$l$'$)$)$;$$
$$
$e$x$p$o$r$t$ $d$e$f$a$u$l$t$ $f$u$n$c$t$i$o$n$ $C$u$s$t$o$m$e$r$s$($)$ ${$$
$ $ $c$o$n$s$t$ $[$c$u$s$t$o$m$e$r$s$,$ $s$e$t$C$u$s$t$o$m$e$r$s$]$ $=$ $u$s$e$S$t$a$t$e$<$C$u$s$t$o$m$e$r$[$]$>$($[$]$)$;$$
$ $ $c$o$n$s$t$ $[$l$o$a$d$i$n$g$,$ $s$e$t$L$o$a$d$i$n$g$]$ $=$ $u$s$e$S$t$a$t$e$($t$r$u$e$)$;$$
$ $ $c$o$n$s$t$ $[$e$r$r$o$r$,$ $s$e$t$E$r$r$o$r$]$ $=$ $u$s$e$S$t$a$t$e$<$s$t$r$i$n$g$ $|$ $n$u$l$l$>$($n$u$l$l$)$;$$
$ $ $$
$ $ $/$/$ $F$i$l$t$e$r$s$ $a$n$d$ $s$e$a$r$c$h$$
$ $ $c$o$n$s$t$ $[$s$e$a$r$c$h$T$e$r$m$,$ $s$e$t$S$e$a$r$c$h$T$e$r$m$]$ $=$ $u$s$e$S$t$a$t$e$($'$'$)$;$$
$ $ $c$o$n$s$t$ $[$s$e$g$m$e$n$t$F$i$l$t$e$r$,$ $s$e$t$S$e$g$m$e$n$t$F$i$l$t$e$r$]$ $=$ $u$s$e$S$t$a$t$e$<$'$a$l$l$'$ $|$ $'$p$r$e$m$i$u$m$'$ $|$ $'$r$e$g$u$l$a$r$'$ $|$ $'$n$e$w$'$>$($'$a$l$l$'$)$;$$
$ $ $c$o$n$s$t$ $[$c$u$r$r$e$n$t$P$a$g$e$,$ $s$e$t$C$u$r$r$e$n$t$P$a$g$e$]$ $=$ $u$s$e$S$t$a$t$e$($1$)$;$$
$ $ $c$o$n$s$t$ $[$t$o$t$a$l$P$a$g$e$s$,$ $s$e$t$T$o$t$a$l$P$a$g$e$s$]$ $=$ $u$s$e$S$t$a$t$e$($1$)$;$$
$ $ $c$o$n$s$t$ $[$t$o$t$a$l$C$u$s$t$o$m$e$r$s$,$ $s$e$t$T$o$t$a$l$C$u$s$t$o$m$e$r$s$]$ $=$ $u$s$e$S$t$a$t$e$($0$)$;$$
$ $ $$
$ $ $/$/$ $B$u$l$k$ $s$e$l$e$c$t$i$o$n$ $s$t$a$t$e$$
$ $ $c$o$n$s$t$ $[$s$e$l$e$c$t$e$d$C$u$s$t$o$m$e$r$s$,$ $s$e$t$S$e$l$e$c$t$e$d$C$u$s$t$o$m$e$r$s$]$ $=$ $u$s$e$S$t$a$t$e$<$S$e$t$<$n$u$m$b$e$r$>$>$($n$e$w$ $S$e$t$($)$)$;$$
$ $ $c$o$n$s$t$ $[$b$u$l$k$D$e$l$e$t$i$n$g$,$ $s$e$t$B$u$l$k$D$e$l$e$t$i$n$g$]$ $=$ $u$s$e$S$t$a$t$e$($f$a$l$s$e$)$;$$
$ $ $$
$ $ $/$/$ $M$o$d$a$l$s$$
$ $ $c$o$n$s$t$ $[$i$s$M$o$d$a$l$O$p$e$n$,$ $s$e$t$I$s$M$o$d$a$l$O$p$e$n$]$ $=$ $u$s$e$S$t$a$t$e$($f$a$l$s$e$)$;$$
$ $ $c$o$n$s$t$ $[$e$d$i$t$i$n$g$C$u$s$t$o$m$e$r$,$ $s$e$t$E$d$i$t$i$n$g$C$u$s$t$o$m$e$r$]$ $=$ $u$s$e$S$t$a$t$e$<$C$u$s$t$o$m$e$r$ $|$ $n$u$l$l$>$($n$u$l$l$)$;$$
$ $ $c$o$n$s$t$ $[$m$o$d$a$l$M$o$d$e$,$ $s$e$t$M$o$d$a$l$M$o$d$e$]$ $=$ $u$s$e$S$t$a$t$e$<$'$c$r$e$a$t$e$'$ $|$ $'$e$d$i$t$'$>$($'$c$r$e$a$t$e$'$)$;$$
$$
$ $ $/$/$ $D$e$b$o$u$n$c$e$ $s$e$a$r$c$h$ $t$e$r$m$ $t$o$ $r$e$d$u$c$e$ $A$P$I$ $c$a$l$l$s$$
$ $ $c$o$n$s$t$ $d$e$b$o$u$n$c$e$d$S$e$a$r$c$h$T$e$r$m$ $=$ $u$s$e$D$e$b$o$u$n$c$e$($s$e$a$r$c$h$T$e$r$m$,$ $5$0$0$)$;$$
$$
$ $ $/$/$ $F$e$t$c$h$ $c$u$s$t$o$m$e$r$s$ $w$r$a$p$p$e$d$ $i$n$ $u$s$e$C$a$l$l$b$a$c$k$$
$ $ $c$o$n$s$t$ $f$e$t$c$h$C$u$s$t$o$m$e$r$s$ $=$ $u$s$e$C$a$l$l$b$a$c$k$($a$s$y$n$c$ $($)$ $=$>$ ${$$
$ $ $ $ $t$r$y$ ${$$
$ $ $ $ $ $ $s$e$t$L$o$a$d$i$n$g$($t$r$u$e$)$;$$
$ $ $ $ $ $ $s$e$t$E$r$r$o$r$($n$u$l$l$)$;$$
$ $ $ $ $ $ $$
$ $ $ $ $ $ $c$o$n$s$t$ $f$i$l$t$e$r$s$ $=$ ${$$
$ $ $ $ $ $ $ $ $p$a$g$e$:$ $c$u$r$r$e$n$t$P$a$g$e$,$$
$ $ $ $ $ $ $ $ $l$i$m$i$t$:$ $1$0$,$$
$ $ $ $ $ $ $ $ $.$.$.$($s$e$g$m$e$n$t$F$i$l$t$e$r$ $!$=$=$ $'$a$l$l$'$ $&$&$ ${$ $s$e$g$m$e$n$t$:$ $s$e$g$m$e$n$t$F$i$l$t$e$r$ $}$)$,$$
$ $ $ $ $ $ $ $ $.$.$.$($d$e$b$o$u$n$c$e$d$S$e$a$r$c$h$T$e$r$m$ $&$&$ ${$ $s$e$a$r$c$h$:$ $d$e$b$o$u$n$c$e$d$S$e$a$r$c$h$T$e$r$m$ $}$)$,$$
$ $ $ $ $ $ $ $ $s$o$r$t$B$y$:$ $'$c$r$e$a$t$e$d$_$a$t$'$ $a$s$ $c$o$n$s$t$,$$
$ $ $ $ $ $ $ $ $o$r$d$e$r$:$ $'$D$E$S$C$'$ $a$s$ $c$o$n$s$t$$
$ $ $ $ $ $ $}$;$$
$ $ $ $ $ $ $$
$ $ $ $ $ $ $c$o$n$s$t$ $r$e$s$p$o$n$s$e$ $=$ $a$w$a$i$t$ $c$u$s$t$o$m$e$r$s$S$e$r$v$i$c$e$.$g$e$t$A$l$l$($f$i$l$t$e$r$s$)$;$$
$ $ $ $ $ $ $s$e$t$C$u$s$t$o$m$e$r$s$($r$e$s$p$o$n$s$e$.$c$u$s$t$o$m$e$r$s$)$;$$
$ $ $ $ $ $ $s$e$t$T$o$t$a$l$P$a$g$e$s$($r$e$s$p$o$n$s$e$.$p$a$g$i$n$a$t$i$o$n$.$t$o$t$a$l$P$a$g$e$s$)$;$$
$ $ $ $ $ $ $s$e$t$T$o$t$a$l$C$u$s$t$o$m$e$r$s$($r$e$s$p$o$n$s$e$.$p$a$g$i$n$a$t$i$o$n$.$t$o$t$a$l$)$;$$
$ $ $ $ $}$ $c$a$t$c$h$ $($e$r$r$:$ $a$n$y$)$ ${$$
$ $ $ $ $ $ $s$e$t$E$r$r$o$r$($e$r$r$.$m$e$s$s$a$g$e$ $|$|$ $'$F$a$i$l$e$d$ $t$o$ $l$o$a$d$ $c$u$s$t$o$m$e$r$s$'$)$;$$
$ $ $ $ $ $ $c$o$n$s$o$l$e$.$e$r$r$o$r$($'$E$r$r$o$r$ $f$e$t$c$h$i$n$g$ $c$u$s$t$o$m$e$r$s$:$'$,$ $e$r$r$)$;$$
$ $ $ $ $}$ $f$i$n$a$l$l$y$ ${$$
$ $ $ $ $ $ $s$e$t$L$o$a$d$i$n$g$($f$a$l$s$e$)$;$$
$ $ $ $ $}$$
$ $ $}$,$ $[$c$u$r$r$e$n$t$P$a$g$e$,$ $s$e$g$m$e$n$t$F$i$l$t$e$r$,$ $d$e$b$o$u$n$c$e$d$S$e$a$r$c$h$T$e$r$m$]$)$;$$
$$
$ $ $/$/$ $F$e$t$c$h$ $c$u$s$t$o$m$e$r$s$$
$ $ $u$s$e$E$f$f$e$c$t$($($)$ $=$>$ ${$$
$ $ $ $ $f$e$t$c$h$C$u$s$t$o$m$e$r$s$($)$;$$
$ $ $}$,$ $[$f$e$t$c$h$C$u$s$t$o$m$e$r$s$]$)$;$$
$$
$ $ $/$/$ $M$e$m$o$i$z$e$ $s$t$a$t$i$s$t$i$c$s$ $c$a$l$c$u$l$a$t$i$o$n$s$ $-$ $O$n$l$y$ $r$e$c$a$l$c$u$l$a$t$e$ $w$h$e$n$ $c$u$s$t$o$m$e$r$s$ $a$r$r$a$y$ $c$h$a$n$g$e$s$$
$ $ $c$o$n$s$t$ $s$t$a$t$s$ $=$ $u$s$e$M$e$m$o$($($)$ $=$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $p$r$e$m$i$u$m$ $=$ $c$u$s$t$o$m$e$r$s$.$f$i$l$t$e$r$($c$ $=$>$ $c$.$s$e$g$m$e$n$t$ $=$=$=$ $'$p$r$e$m$i$u$m$'$)$.$l$e$n$g$t$h$;$$
$ $ $ $ $c$o$n$s$t$ $r$e$g$u$l$a$r$ $=$ $c$u$s$t$o$m$e$r$s$.$f$i$l$t$e$r$($c$ $=$>$ $c$.$s$e$g$m$e$n$t$ $=$=$=$ $'$r$e$g$u$l$a$r$'$)$.$l$e$n$g$t$h$;$$
$ $ $ $ $c$o$n$s$t$ $n$e$w$C$u$s$t$o$m$e$r$s$ $=$ $c$u$s$t$o$m$e$r$s$.$f$i$l$t$e$r$($c$ $=$>$ $c$.$s$e$g$m$e$n$t$ $=$=$=$ $'$n$e$w$'$)$.$l$e$n$g$t$h$;$$
$ $ $ $ $c$o$n$s$t$ $t$o$t$a$l$R$e$v$e$n$u$e$ $=$ $c$u$s$t$o$m$e$r$s$.$r$e$d$u$c$e$($($s$u$m$,$ $c$)$ $=$>$ $s$u$m$ $+$ $($c$.$t$o$t$a$l$_$r$e$v$e$n$u$e$ $|$|$ $0$)$,$ $0$)$;$$
$ $ $ $ $$
$ $ $ $ $r$e$t$u$r$n$ ${$$
$ $ $ $ $ $ $t$o$t$a$l$:$ $t$o$t$a$l$C$u$s$t$o$m$e$r$s$ $|$|$ $0$,$$
$ $ $ $ $ $ $p$r$e$m$i$u$m$,$$
$ $ $ $ $ $ $r$e$g$u$l$a$r$,$$
$ $ $ $ $ $ $n$e$w$:$ $n$e$w$C$u$s$t$o$m$e$r$s$,$$
$ $ $ $ $ $ $t$o$t$a$l$R$e$v$e$n$u$e$,$$
$ $ $ $ $}$;$$
$ $ $}$,$ $[$c$u$s$t$o$m$e$r$s$,$ $t$o$t$a$l$C$u$s$t$o$m$e$r$s$]$)$;$$
$$
$ $ $/$/$ $M$e$m$o$i$z$e$ $c$u$r$r$e$n$c$y$ $f$o$r$m$a$t$t$e$r$ $t$o$ $a$v$o$i$d$ $r$e$c$r$e$a$t$i$n$g$ $o$n$ $e$v$e$r$y$ $r$e$n$d$e$r$$
$ $ $c$o$n$s$t$ $f$o$r$m$a$t$C$u$r$r$e$n$c$y$ $=$ $u$s$e$M$e$m$o$($($)$ $=$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $f$o$r$m$a$t$t$e$r$ $=$ $n$e$w$ $I$n$t$l$.$N$u$m$b$e$r$F$o$r$m$a$t$($'$e$n$-$U$S$'$,$ ${$$
$ $ $ $ $ $ $s$t$y$l$e$:$ $'$c$u$r$r$e$n$c$y$'$,$$
$ $ $ $ $ $ $c$u$r$r$e$n$c$y$:$ $'$U$S$D$'$,$$
$ $ $ $ $ $ $m$a$x$i$m$u$m$F$r$a$c$t$i$o$n$D$i$g$i$t$s$:$ $0$,$$
$ $ $ $ $}$)$;$$
$ $ $ $ $r$e$t$u$r$n$ $($a$m$o$u$n$t$:$ $n$u$m$b$e$r$)$ $=$>$ $f$o$r$m$a$t$t$e$r$.$f$o$r$m$a$t$($a$m$o$u$n$t$)$;$$
$ $ $}$,$ $[$]$)$;$$
$$
$ $ $c$o$n$s$t$ $h$a$n$d$l$e$V$i$e$w$C$u$s$t$o$m$e$r$ $=$ $u$s$e$C$a$l$l$b$a$c$k$($a$s$y$n$c$ $($c$u$s$t$o$m$e$r$:$ $C$u$s$t$o$m$e$r$)$ $=$>$ ${$$
$ $ $ $ $t$r$y$ ${$$
$ $ $ $ $ $ $/$/$ $F$e$t$c$h$ $f$u$l$l$ $c$u$s$t$o$m$e$r$ $d$e$t$a$i$l$s$ $i$n$c$l$u$d$i$n$g$ $a$d$d$r$e$s$s$e$s$$
$ $ $ $ $ $ $c$o$n$s$t$ $f$u$l$l$C$u$s$t$o$m$e$r$ $=$ $a$w$a$i$t$ $c$u$s$t$o$m$e$r$s$S$e$r$v$i$c$e$.$g$e$t$B$y$I$d$($c$u$s$t$o$m$e$r$.$i$d$)$;$$
$ $ $ $ $ $ $/$/$ $O$p$e$n$ $e$d$i$t$ $m$o$d$a$l$ $t$o$ $v$i$e$w$ $c$u$s$t$o$m$e$r$ $d$e$t$a$i$l$s$$
$ $ $ $ $ $ $s$e$t$E$d$i$t$i$n$g$C$u$s$t$o$m$e$r$($f$u$l$l$C$u$s$t$o$m$e$r$)$;$$
$ $ $ $ $ $ $s$e$t$M$o$d$a$l$M$o$d$e$($'$e$d$i$t$'$)$;$$
$ $ $ $ $ $ $s$e$t$I$s$M$o$d$a$l$O$p$e$n$($t$r$u$e$)$;$$
$ $ $ $ $}$ $c$a$t$c$h$ $($e$r$r$:$ $a$n$y$)$ ${$$
$ $ $ $ $ $ $a$l$e$r$t$($'$F$a$i$l$e$d$ $t$o$ $l$o$a$d$ $c$u$s$t$o$m$e$r$ $d$e$t$a$i$l$s$:$ $'$ $+$ $e$r$r$.$m$e$s$s$a$g$e$)$;$$
$ $ $ $ $}$$
$ $ $}$,$ $[$]$)$;$$
$$
$ $ $c$o$n$s$t$ $h$a$n$d$l$e$E$d$i$t$C$u$s$t$o$m$e$r$ $=$ $u$s$e$C$a$l$l$b$a$c$k$($($c$u$s$t$o$m$e$r$:$ $C$u$s$t$o$m$e$r$)$ $=$>$ ${$$
$ $ $ $ $s$e$t$M$o$d$a$l$M$o$d$e$($'$e$d$i$t$'$)$;$$
$ $ $ $ $s$e$t$E$d$i$t$i$n$g$C$u$s$t$o$m$e$r$($c$u$s$t$o$m$e$r$)$;$$
$ $ $ $ $s$e$t$I$s$M$o$d$a$l$O$p$e$n$($t$r$u$e$)$;$$
$ $ $}$,$ $[$]$)$;$$
$$
$ $ $c$o$n$s$t$ $h$a$n$d$l$e$D$e$l$e$t$e$C$u$s$t$o$m$e$r$ $=$ $u$s$e$C$a$l$l$b$a$c$k$($a$s$y$n$c$ $($c$u$s$t$o$m$e$r$I$d$:$ $n$u$m$b$e$r$)$ $=$>$ ${$$
$ $ $ $ $i$f$ $($w$i$n$d$o$w$.$c$o$n$f$i$r$m$($'$A$r$e$ $y$o$u$ $s$u$r$e$ $y$o$u$ $w$a$n$t$ $t$o$ $d$e$l$e$t$e$ $t$h$i$s$ $c$u$s$t$o$m$e$r$?$ $T$h$i$s$ $a$c$t$i$o$n$ $c$a$n$n$o$t$ $b$e$ $u$n$d$o$n$e$.$'$)$)$ ${$$
$ $ $ $ $ $ $t$r$y$ ${$$
$ $ $ $ $ $ $ $ $a$w$a$i$t$ $c$u$s$t$o$m$e$r$s$S$e$r$v$i$c$e$.$d$e$l$e$t$e$($c$u$s$t$o$m$e$r$I$d$)$;$$
$ $ $ $ $ $ $ $ $f$e$t$c$h$C$u$s$t$o$m$e$r$s$($)$;$ $/$/$ $R$e$f$r$e$s$h$ $t$h$e$ $l$i$s$t$$
$ $ $ $ $ $ $}$ $c$a$t$c$h$ $($e$r$r$:$ $a$n$y$)$ ${$$
$ $ $ $ $ $ $ $ $a$l$e$r$t$($'$F$a$i$l$e$d$ $t$o$ $d$e$l$e$t$e$ $c$u$s$t$o$m$e$r$:$ $'$ $+$ $e$r$r$.$m$e$s$s$a$g$e$)$;$$
$ $ $ $ $ $ $}$$
$ $ $ $ $}$$
$ $ $}$,$ $[$f$e$t$c$h$C$u$s$t$o$m$e$r$s$]$)$;$$
$$
$ $ $/$/$ $B$u$l$k$ $s$e$l$e$c$t$i$o$n$ $h$a$n$d$l$e$r$s$ $w$r$a$p$p$e$d$ $i$n$ $u$s$e$C$a$l$l$b$a$c$k$$
$ $ $c$o$n$s$t$ $h$a$n$d$l$e$S$e$l$e$c$t$A$l$l$ $=$ $u$s$e$C$a$l$l$b$a$c$k$($($e$:$ $R$e$a$c$t$.$C$h$a$n$g$e$E$v$e$n$t$<$H$T$M$L$I$n$p$u$t$E$l$e$m$e$n$t$>$)$ $=$>$ ${$$
$ $ $ $ $i$f$ $($e$.$t$a$r$g$e$t$.$c$h$e$c$k$e$d$)$ ${$$
$ $ $ $ $ $ $c$o$n$s$t$ $a$l$l$I$d$s$ $=$ $n$e$w$ $S$e$t$($c$u$s$t$o$m$e$r$s$.$m$a$p$($c$ $=$>$ $c$.$i$d$)$)$;$$
$ $ $ $ $ $ $s$e$t$S$e$l$e$c$t$e$d$C$u$s$t$o$m$e$r$s$($a$l$l$I$d$s$)$;$$
$ $ $ $ $}$ $e$l$s$e$ ${$$
$ $ $ $ $ $ $s$e$t$S$e$l$e$c$t$e$d$C$u$s$t$o$m$e$r$s$($n$e$w$ $S$e$t$($)$)$;$$
$ $ $ $ $}$$
$ $ $}$,$ $[$c$u$s$t$o$m$e$r$s$]$)$;$$
$$
$ $ $c$o$n$s$t$ $h$a$n$d$l$e$S$e$l$e$c$t$C$u$s$t$o$m$e$r$ $=$ $u$s$e$C$a$l$l$b$a$c$k$($($c$u$s$t$o$m$e$r$I$d$:$ $n$u$m$b$e$r$)$ $=$>$ ${$$
$ $ $ $ $s$e$t$S$e$l$e$c$t$e$d$C$u$s$t$o$m$e$r$s$($p$r$e$v$ $=$>$ ${$$
$ $ $ $ $ $ $c$o$n$s$t$ $n$e$w$S$e$l$e$c$t$e$d$ $=$ $n$e$w$ $S$e$t$($p$r$e$v$)$;$$
$ $ $ $ $ $ $i$f$ $($n$e$w$S$e$l$e$c$t$e$d$.$h$a$s$($c$u$s$t$o$m$e$r$I$d$)$)$ ${$$
$ $ $ $ $ $ $ $ $n$e$w$S$e$l$e$c$t$e$d$.$d$e$l$e$t$e$($c$u$s$t$o$m$e$r$I$d$)$;$$
$ $ $ $ $ $ $}$ $e$l$s$e$ ${$$
$ $ $ $ $ $ $ $ $n$e$w$S$e$l$e$c$t$e$d$.$a$d$d$($c$u$s$t$o$m$e$r$I$d$)$;$$
$ $ $ $ $ $ $}$$
$ $ $ $ $ $ $r$e$t$u$r$n$ $n$e$w$S$e$l$e$c$t$e$d$;$$
$ $ $ $ $}$)$;$$
$ $ $}$,$ $[$]$)$;$$
$$
$ $ $c$o$n$s$t$ $h$a$n$d$l$e$B$u$l$k$D$e$l$e$t$e$ $=$ $a$s$y$n$c$ $($)$ $=$>$ ${$$
$ $ $ $ $i$f$ $($s$e$l$e$c$t$e$d$C$u$s$t$o$m$e$r$s$.$s$i$z$e$ $=$=$=$ $0$)$ $r$e$t$u$r$n$;$$
$ $ $ $ $$
$ $ $ $ $c$o$n$s$t$ $c$o$u$n$t$ $=$ $s$e$l$e$c$t$e$d$C$u$s$t$o$m$e$r$s$.$s$i$z$e$;$$
$ $ $ $ $i$f$ $($!$c$o$n$f$i$r$m$($`$A$r$e$ $y$o$u$ $s$u$r$e$ $y$o$u$ $w$a$n$t$ $t$o$ $d$e$l$e$t$e$ $$${$c$o$u$n$t$}$ $c$u$s$t$o$m$e$r$$${$c$o$u$n$t$ $>$ $1$ $?$ $'$s$'$ $:$ $'$'$}$?$ $T$h$i$s$ $a$c$t$i$o$n$ $c$a$n$n$o$t$ $b$e$ $u$n$d$o$n$e$.$`$)$)$ ${$$
$ $ $ $ $ $ $r$e$t$u$r$n$;$$
$ $ $ $ $}$$
$$
$ $ $ $ $s$e$t$B$u$l$k$D$e$l$e$t$i$n$g$($t$r$u$e$)$;$$
$ $ $ $ $l$e$t$ $s$u$c$c$e$s$s$C$o$u$n$t$ $=$ $0$;$$
$ $ $ $ $l$e$t$ $e$r$r$o$r$C$o$u$n$t$ $=$ $0$;$$
$$
$ $ $ $ $t$r$y$ ${$$
$ $ $ $ $ $ $f$o$r$ $($c$o$n$s$t$ $c$u$s$t$o$m$e$r$I$d$ $o$f$ $A$r$r$a$y$.$f$r$o$m$($s$e$l$e$c$t$e$d$C$u$s$t$o$m$e$r$s$)$)$ ${$$
$ $ $ $ $ $ $ $ $t$r$y$ ${$$
$ $ $ $ $ $ $ $ $ $ $a$w$a$i$t$ $c$u$s$t$o$m$e$r$s$S$e$r$v$i$c$e$.$d$e$l$e$t$e$($c$u$s$t$o$m$e$r$I$d$)$;$$
$ $ $ $ $ $ $ $ $ $ $s$u$c$c$e$s$s$C$o$u$n$t$+$+$;$$
$ $ $ $ $ $ $ $ $}$ $c$a$t$c$h$ $($e$r$r$:$ $a$n$y$)$ ${$$
$ $ $ $ $ $ $ $ $ $ $c$o$n$s$o$l$e$.$e$r$r$o$r$($`$F$a$i$l$e$d$ $t$o$ $d$e$l$e$t$e$ $c$u$s$t$o$m$e$r$ $$${$c$u$s$t$o$m$e$r$I$d$}$:$`$,$ $e$r$r$)$;$$
$ $ $ $ $ $ $ $ $ $ $c$o$n$s$o$l$e$.$e$r$r$o$r$($'$E$r$r$o$r$ $d$e$t$a$i$l$s$:$'$,$ $e$r$r$.$r$e$s$p$o$n$s$e$?$.$d$a$t$a$ $|$|$ $e$r$r$.$m$e$s$s$a$g$e$)$;$$
$ $ $ $ $ $ $ $ $ $ $e$r$r$o$r$C$o$u$n$t$+$+$;$$
$ $ $ $ $ $ $ $ $}$$
$ $ $ $ $ $ $}$$
$$
$ $ $ $ $ $ $i$f$ $($e$r$r$o$r$C$o$u$n$t$ $=$=$=$ $0$)$ ${$$
$ $ $ $ $ $ $ $ $a$l$e$r$t$($`$S$u$c$c$e$s$s$f$u$l$l$y$ $d$e$l$e$t$e$d$ $$${$s$u$c$c$e$s$s$C$o$u$n$t$}$ $c$u$s$t$o$m$e$r$$${$s$u$c$c$e$s$s$C$o$u$n$t$ $>$ $1$ $?$ $'$s$'$ $:$ $'$'$}$`$)$;$$
$ $ $ $ $ $ $}$ $e$l$s$e$ ${$$
$ $ $ $ $ $ $ $ $a$l$e$r$t$($`$D$e$l$e$t$e$d$ $$${$s$u$c$c$e$s$s$C$o$u$n$t$}$ $c$u$s$t$o$m$e$r$$${$s$u$c$c$e$s$s$C$o$u$n$t$ $>$ $1$ $?$ $'$s$'$ $:$ $'$'$}$.$ $F$a$i$l$e$d$ $t$o$ $d$e$l$e$t$e$ $$${$e$r$r$o$r$C$o$u$n$t$}$.$`$)$;$$
$ $ $ $ $ $ $}$$
$$
$ $ $ $ $ $ $s$e$t$S$e$l$e$c$t$e$d$C$u$s$t$o$m$e$r$s$($n$e$w$ $S$e$t$($)$)$;$$
$ $ $ $ $ $ $a$w$a$i$t$ $f$e$t$c$h$C$u$s$t$o$m$e$r$s$($)$;$$
$ $ $ $ $}$ $c$a$t$c$h$ $($e$r$r$o$r$:$ $a$n$y$)$ ${$$
$ $ $ $ $ $ $c$o$n$s$o$l$e$.$e$r$r$o$r$($'$B$u$l$k$ $d$e$l$e$t$e$ $e$r$r$o$r$:$'$,$ $e$r$r$o$r$)$;$$
$ $ $ $ $ $ $a$l$e$r$t$($'$F$a$i$l$e$d$ $t$o$ $c$o$m$p$l$e$t$e$ $b$u$l$k$ $d$e$l$e$t$e$ $o$p$e$r$a$t$i$o$n$:$ $'$ $+$ $($e$r$r$o$r$.$m$e$s$s$a$g$e$ $|$|$ $'$U$n$k$n$o$w$n$ $e$r$r$o$r$'$)$)$;$$
$ $ $ $ $}$ $f$i$n$a$l$l$y$ ${$$
$ $ $ $ $ $ $s$e$t$B$u$l$k$D$e$l$e$t$i$n$g$($f$a$l$s$e$)$;$$
$ $ $ $ $}$$
$ $ $}$;$$
$$
$ $ $c$o$n$s$t$ $h$a$n$d$l$e$E$x$p$o$r$t$C$S$V$ $=$ $($)$ $=$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $d$a$t$a$T$o$E$x$p$o$r$t$ $=$ $s$e$l$e$c$t$e$d$C$u$s$t$o$m$e$r$s$.$s$i$z$e$ $>$ $0$$
$ $ $ $ $ $ $?$ $c$u$s$t$o$m$e$r$s$.$f$i$l$t$e$r$($c$ $=$>$ $s$e$l$e$c$t$e$d$C$u$s$t$o$m$e$r$s$.$h$a$s$($c$.$i$d$)$)$$
$ $ $ $ $ $ $:$ $c$u$s$t$o$m$e$r$s$;$$
$$
$ $ $ $ $c$o$n$s$t$ $h$e$a$d$e$r$s$ $=$ $[$'$N$a$m$e$'$,$ $'$E$m$a$i$l$'$,$ $'$P$h$o$n$e$'$,$ $'$B$u$s$i$n$e$s$s$ $N$a$m$e$'$,$ $'$S$e$g$m$e$n$t$'$,$ $'$T$o$t$a$l$ $O$r$d$e$r$s$'$,$ $'$T$o$t$a$l$ $R$e$v$e$n$u$e$'$]$;$$
$ $ $ $ $c$o$n$s$t$ $r$o$w$s$ $=$ $d$a$t$a$T$o$E$x$p$o$r$t$.$m$a$p$($c$ $=$>$ $[$$
$ $ $ $ $ $ $c$.$n$a$m$e$,$$
$ $ $ $ $ $ $c$.$e$m$a$i$l$,$$
$ $ $ $ $ $ $c$.$p$h$o$n$e$,$$
$ $ $ $ $ $ $c$.$b$u$s$i$n$e$s$s$_$n$a$m$e$ $|$|$ $'$'$,$$
$ $ $ $ $ $ $c$.$s$e$g$m$e$n$t$,$$
$ $ $ $ $ $ $c$.$t$o$t$a$l$_$o$r$d$e$r$s$,$$
$ $ $ $ $ $ $c$.$t$o$t$a$l$_$r$e$v$e$n$u$e$$
$ $ $ $ $]$)$;$$
$$
$ $ $ $ $c$o$n$s$t$ $c$s$v$C$o$n$t$e$n$t$ $=$ $[$$
$ $ $ $ $ $ $h$e$a$d$e$r$s$.$j$o$i$n$($'$,$'$)$,$$
$ $ $ $ $ $ $.$.$.$r$o$w$s$.$m$a$p$($r$o$w$ $=$>$ $r$o$w$.$m$a$p$($c$e$l$l$ $=$>$ $`$"$$${$c$e$l$l$}$"$`$)$.$j$o$i$n$($'$,$'$)$)$$
$ $ $ $ $]$.$j$o$i$n$($'$\$n$'$)$;$$
$$
$ $ $ $ $c$o$n$s$t$ $b$l$o$b$ $=$ $n$e$w$ $B$l$o$b$($[$c$s$v$C$o$n$t$e$n$t$]$,$ ${$ $t$y$p$e$:$ $'$t$e$x$t$/$c$s$v$;$c$h$a$r$s$e$t$=$u$t$f$-$8$;$'$ $}$)$;$$
$ $ $ $ $c$o$n$s$t$ $l$i$n$k$ $=$ $d$o$c$u$m$e$n$t$.$c$r$e$a$t$e$E$l$e$m$e$n$t$($'$a$'$)$;$$
$ $ $ $ $c$o$n$s$t$ $u$r$l$ $=$ $U$R$L$.$c$r$e$a$t$e$O$b$j$e$c$t$U$R$L$($b$l$o$b$)$;$$
$ $ $ $ $l$i$n$k$.$s$e$t$A$t$t$r$i$b$u$t$e$($'$h$r$e$f$'$,$ $u$r$l$)$;$$
$ $ $ $ $l$i$n$k$.$s$e$t$A$t$t$r$i$b$u$t$e$($'$d$o$w$n$l$o$a$d$'$,$ $`$c$u$s$t$o$m$e$r$s$_$e$x$p$o$r$t$_$$${$n$e$w$ $D$a$t$e$($)$.$t$o$I$S$O$S$t$r$i$n$g$($)$.$s$p$l$i$t$($'$T$'$)$[$0$]$}$.$c$s$v$`$)$;$$
$ $ $ $ $l$i$n$k$.$s$t$y$l$e$.$v$i$s$i$b$i$l$i$t$y$ $=$ $'$h$i$d$d$e$n$'$;$$
$ $ $ $ $d$o$c$u$m$e$n$t$.$b$o$d$y$.$a$p$p$e$n$d$C$h$i$l$d$($l$i$n$k$)$;$$
$ $ $ $ $l$i$n$k$.$c$l$i$c$k$($)$;$$
$ $ $ $ $d$o$c$u$m$e$n$t$.$b$o$d$y$.$r$e$m$o$v$e$C$h$i$l$d$($l$i$n$k$)$;$$
$ $ $}$;$$
$$
$ $ $c$o$n$s$t$ $h$a$n$d$l$e$A$d$d$C$u$s$t$o$m$e$r$ $=$ $u$s$e$C$a$l$l$b$a$c$k$($($)$ $=$>$ ${$$
$ $ $ $ $s$e$t$M$o$d$a$l$M$o$d$e$($'$c$r$e$a$t$e$'$)$;$$
$ $ $ $ $s$e$t$E$d$i$t$i$n$g$C$u$s$t$o$m$e$r$($n$u$l$l$)$;$$
$ $ $ $ $s$e$t$I$s$M$o$d$a$l$O$p$e$n$($t$r$u$e$)$;$$
$ $ $}$,$ $[$]$)$;$$
$$
$ $ $c$o$n$s$t$ $h$a$n$d$l$e$C$l$o$s$e$M$o$d$a$l$ $=$ $u$s$e$C$a$l$l$b$a$c$k$($($)$ $=$>$ ${$$
$ $ $ $ $s$e$t$I$s$M$o$d$a$l$O$p$e$n$($f$a$l$s$e$)$;$$
$ $ $ $ $s$e$t$E$d$i$t$i$n$g$C$u$s$t$o$m$e$r$($n$u$l$l$)$;$$
$ $ $}$,$ $[$]$)$;$$
$$
$ $ $c$o$n$s$t$ $h$a$n$d$l$e$S$a$v$e$S$u$c$c$e$s$s$ $=$ $u$s$e$C$a$l$l$b$a$c$k$($($)$ $=$>$ ${$$
$ $ $ $ $f$e$t$c$h$C$u$s$t$o$m$e$r$s$($)$;$ $/$/$ $R$e$f$r$e$s$h$ $t$h$e$ $l$i$s$t$$
$ $ $}$,$ $[$f$e$t$c$h$C$u$s$t$o$m$e$r$s$]$)$;$$
$$
$ $ $c$o$n$s$t$ $h$a$n$d$l$e$S$e$a$r$c$h$ $=$ $u$s$e$C$a$l$l$b$a$c$k$($($e$:$ $R$e$a$c$t$.$F$o$r$m$E$v$e$n$t$)$ $=$>$ ${$$
$ $ $ $ $e$.$p$r$e$v$e$n$t$D$e$f$a$u$l$t$($)$;$$
$ $ $ $ $s$e$t$C$u$r$r$e$n$t$P$a$g$e$($1$)$;$ $/$/$ $R$e$s$e$t$ $t$o$ $f$i$r$s$t$ $p$a$g$e$ $o$n$ $s$e$a$r$c$h$$
$ $ $ $ $f$e$t$c$h$C$u$s$t$o$m$e$r$s$($)$;$$
$ $ $}$,$ $[$f$e$t$c$h$C$u$s$t$o$m$e$r$s$]$)$;$$
$$
$ $ $i$f$ $($l$o$a$d$i$n$g$ $&$&$ $c$u$s$t$o$m$e$r$s$.$l$e$n$g$t$h$ $=$=$=$ $0$)$ ${$$
$ $ $ $ $r$e$t$u$r$n$ $($$
$ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$p$-$6$ $f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$c$e$n$t$e$r$ $m$i$n$-$h$-$s$c$r$e$e$n$"$>$$
$ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$c$e$n$t$e$r$"$>$$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$i$n$l$i$n$e$-$b$l$o$c$k$ $a$n$i$m$a$t$e$-$s$p$i$n$ $r$o$u$n$d$e$d$-$f$u$l$l$ $h$-$1$2$ $w$-$1$2$ $b$o$r$d$e$r$-$b$-$2$ $b$o$r$d$e$r$-$n$e$u$t$r$a$l$-$9$0$0$"$>$<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$m$t$-$4$ $t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$"$>$L$o$a$d$i$n$g$ $c$u$s$t$o$m$e$r$s$.$.$.$<$/$p$>$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $)$;$$
$ $ $}$$
$$
$ $ $r$e$t$u$r$n$ $($$
$ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$p$-$6$ $s$p$a$c$e$-$y$-$6$"$>$$
$ $ $ $ $ $ ${$/$*$ $H$e$a$d$e$r$ $*$/$}$$
$ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$b$e$t$w$e$e$n$"$>$$
$ $ $ $ $ $ $ $ $<$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $<$h$1$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$3$x$l$ $f$o$n$t$-$b$o$l$d$ $t$e$x$t$-$n$e$u$t$r$a$l$-$9$0$0$"$>$C$u$s$t$o$m$e$r$s$<$/$h$1$>$$
$ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$ $m$t$-$1$"$>$M$a$n$a$g$e$ $y$o$u$r$ $c$u$s$t$o$m$e$r$ $r$e$l$a$t$i$o$n$s$h$i$p$s$<$/$p$>$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $<$b$u$t$t$o$n$ $o$n$C$l$i$c$k$=${$h$a$n$d$l$e$A$d$d$C$u$s$t$o$m$e$r$}$ $c$l$a$s$s$N$a$m$e$=$"$b$t$n$-$p$r$i$m$a$r$y$ $f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $g$a$p$-$2$"$>$$
$ $ $ $ $ $ $ $ $ $ $<$U$s$e$r$P$l$u$s$ $c$l$a$s$s$N$a$m$e$=$"$w$-$4$ $h$-$4$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $A$d$d$ $C$u$s$t$o$m$e$r$$
$ $ $ $ $ $ $ $ $<$/$b$u$t$t$o$n$>$$
$ $ $ $ $ $ $<$/$d$i$v$>$$
$$
$ $ $ $ $ $ ${$/$*$ $E$r$r$o$r$ $M$e$s$s$a$g$e$ $*$/$}$$
$ $ $ $ $ $ ${$e$r$r$o$r$ $&$&$ $($$
$ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$b$g$-$n$e$u$t$r$a$l$-$5$0$ $b$o$r$d$e$r$ $b$o$r$d$e$r$-$n$e$u$t$r$a$l$-$3$0$0$ $t$e$x$t$-$n$e$u$t$r$a$l$-$9$0$0$ $p$x$-$4$ $p$y$-$3$ $r$o$u$n$d$e$d$"$>$$
$ $ $ $ $ $ $ $ $ $ ${$e$r$r$o$r$}$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $)$}$$
$$
$ $ $ $ $ $ ${$/$*$ $S$t$a$t$s$ $C$a$r$d$s$ $*$/$}$$
$ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$g$r$i$d$ $g$r$i$d$-$c$o$l$s$-$1$ $m$d$:$g$r$i$d$-$c$o$l$s$-$2$ $l$g$:$g$r$i$d$-$c$o$l$s$-$4$ $g$a$p$-$6$"$>$$
$ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$c$a$r$d$ $p$-$6$"$>$$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$b$e$t$w$e$e$n$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$"$>$T$o$t$a$l$ $C$u$s$t$o$m$e$r$s$<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$2$x$l$ $f$o$n$t$-$b$o$l$d$ $t$e$x$t$-$n$e$u$t$r$a$l$-$9$0$0$ $m$t$-$1$"$>${$s$t$a$t$s$.$t$o$t$a$l$ $|$|$ $0$}$<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$p$-$3$ $b$g$-$n$e$u$t$r$a$l$-$1$0$0$ $r$o$u$n$d$e$d$-$l$g$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$U$s$e$r$s$ $c$l$a$s$s$N$a$m$e$=$"$w$-$6$ $h$-$6$ $t$e$x$t$-$n$e$u$t$r$a$l$-$7$0$0$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$$
$ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$c$a$r$d$ $p$-$6$"$>$$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$b$e$t$w$e$e$n$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$"$>$P$r$e$m$i$u$m$<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$2$x$l$ $f$o$n$t$-$b$o$l$d$ $t$e$x$t$-$n$e$u$t$r$a$l$-$9$0$0$ $m$t$-$1$"$>${$s$t$a$t$s$.$p$r$e$m$i$u$m$}$<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$x$s$ $t$e$x$t$-$n$e$u$t$r$a$l$-$5$0$0$ $m$t$-$1$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ ${$s$t$a$t$s$.$t$o$t$a$l$ $>$ $0$ $?$ $($($s$t$a$t$s$.$p$r$e$m$i$u$m$ $/$ $s$t$a$t$s$.$t$o$t$a$l$)$ $*$ $1$0$0$)$.$t$o$F$i$x$e$d$($0$)$ $:$ $0$}$%$ $o$f$ $t$o$t$a$l$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$p$-$3$ $b$g$-$n$e$u$t$r$a$l$-$1$0$0$ $r$o$u$n$d$e$d$-$l$g$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$T$r$e$n$d$i$n$g$U$p$ $c$l$a$s$s$N$a$m$e$=$"$w$-$6$ $h$-$6$ $t$e$x$t$-$n$e$u$t$r$a$l$-$7$0$0$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$$
$ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$c$a$r$d$ $p$-$6$"$>$$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$b$e$t$w$e$e$n$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$"$>$R$e$g$u$l$a$r$<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$2$x$l$ $f$o$n$t$-$b$o$l$d$ $t$e$x$t$-$n$e$u$t$r$a$l$-$9$0$0$ $m$t$-$1$"$>${$s$t$a$t$s$.$r$e$g$u$l$a$r$}$<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$x$s$ $t$e$x$t$-$n$e$u$t$r$a$l$-$5$0$0$ $m$t$-$1$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ ${$s$t$a$t$s$.$t$o$t$a$l$ $>$ $0$ $?$ $($($s$t$a$t$s$.$r$e$g$u$l$a$r$ $/$ $s$t$a$t$s$.$t$o$t$a$l$)$ $*$ $1$0$0$)$.$t$o$F$i$x$e$d$($0$)$ $:$ $0$}$%$ $o$f$ $t$o$t$a$l$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$p$-$3$ $b$g$-$n$e$u$t$r$a$l$-$1$0$0$ $r$o$u$n$d$e$d$-$l$g$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$U$s$e$r$s$ $c$l$a$s$s$N$a$m$e$=$"$w$-$6$ $h$-$6$ $t$e$x$t$-$n$e$u$t$r$a$l$-$7$0$0$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$$
$ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$c$a$r$d$ $p$-$6$"$>$$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$b$e$t$w$e$e$n$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$"$>$T$o$t$a$l$ $R$e$v$e$n$u$e$<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$2$x$l$ $f$o$n$t$-$b$o$l$d$ $t$e$x$t$-$n$e$u$t$r$a$l$-$9$0$0$ $m$t$-$1$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ ${$f$o$r$m$a$t$C$u$r$r$e$n$c$y$($s$t$a$t$s$.$t$o$t$a$l$R$e$v$e$n$u$e$)$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$p$-$3$ $b$g$-$n$e$u$t$r$a$l$-$1$0$0$ $r$o$u$n$d$e$d$-$l$g$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$T$r$e$n$d$i$n$g$U$p$ $c$l$a$s$s$N$a$m$e$=$"$w$-$6$ $h$-$6$ $t$e$x$t$-$n$e$u$t$r$a$l$-$7$0$0$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $<$/$d$i$v$>$$
$$
$ $ $ $ $ $ ${$/$*$ $F$i$l$t$e$r$s$ $a$n$d$ $S$e$a$r$c$h$ $*$/$}$$
$ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$c$a$r$d$ $p$-$6$"$>$$
$ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $f$l$e$x$-$c$o$l$ $m$d$:$f$l$e$x$-$r$o$w$ $g$a$p$-$4$"$>$$
$ $ $ $ $ $ $ $ $ $ ${$/$*$ $S$e$a$r$c$h$ $*$/$}$$
$ $ $ $ $ $ $ $ $ $ $<$f$o$r$m$ $o$n$S$u$b$m$i$t$=${$h$a$n$d$l$e$S$e$a$r$c$h$}$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$-$1$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$r$e$l$a$t$i$v$e$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$S$e$a$r$c$h$ $c$l$a$s$s$N$a$m$e$=$"$a$b$s$o$l$u$t$e$ $l$e$f$t$-$3$ $t$o$p$-$1$/$2$ $t$r$a$n$s$f$o$r$m$ $-$t$r$a$n$s$l$a$t$e$-$y$-$1$/$2$ $w$-$5$ $h$-$5$ $t$e$x$t$-$n$e$u$t$r$a$l$-$4$0$0$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$i$n$p$u$t$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $t$y$p$e$=$"$t$e$x$t$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $p$l$a$c$e$h$o$l$d$e$r$=$"$S$e$a$r$c$h$ $b$y$ $n$a$m$e$,$ $e$m$a$i$l$,$ $p$h$o$n$e$,$ $o$r$ $b$u$s$i$n$e$s$s$.$.$.$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $v$a$l$u$e$=${$s$e$a$r$c$h$T$e$r$m$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$h$a$n$g$e$=${$($e$)$ $=$>$ $s$e$t$S$e$a$r$c$h$T$e$r$m$($e$.$t$a$r$g$e$t$.$v$a$l$u$e$)$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$w$-$f$u$l$l$ $p$l$-$1$0$ $p$r$-$4$ $p$y$-$2$ $b$o$r$d$e$r$ $b$o$r$d$e$r$-$n$e$u$t$r$a$l$-$3$0$0$ $r$o$u$n$d$e$d$-$l$g$ $f$o$c$u$s$:$r$i$n$g$-$2$ $f$o$c$u$s$:$r$i$n$g$-$n$e$u$t$r$a$l$-$9$0$0$ $f$o$c$u$s$:$b$o$r$d$e$r$-$t$r$a$n$s$p$a$r$e$n$t$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$f$o$r$m$>$$
$$
$ $ $ $ $ $ $ $ $ $ ${$/$*$ $S$e$g$m$e$n$t$ $F$i$l$t$e$r$ $*$/$}$$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $g$a$p$-$2$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$F$i$l$t$e$r$ $c$l$a$s$s$N$a$m$e$=$"$w$-$5$ $h$-$5$ $t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$s$e$l$e$c$t$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $v$a$l$u$e$=${$s$e$g$m$e$n$t$F$i$l$t$e$r$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$h$a$n$g$e$=${$($e$)$ $=$>$ ${$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $s$e$t$S$e$g$m$e$n$t$F$i$l$t$e$r$($e$.$t$a$r$g$e$t$.$v$a$l$u$e$ $a$s$ $a$n$y$)$;$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $s$e$t$C$u$r$r$e$n$t$P$a$g$e$($1$)$;$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $}$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$4$ $p$y$-$2$ $b$o$r$d$e$r$ $b$o$r$d$e$r$-$n$e$u$t$r$a$l$-$3$0$0$ $r$o$u$n$d$e$d$-$l$g$ $f$o$c$u$s$:$r$i$n$g$-$2$ $f$o$c$u$s$:$r$i$n$g$-$n$e$u$t$r$a$l$-$9$0$0$ $f$o$c$u$s$:$b$o$r$d$e$r$-$t$r$a$n$s$p$a$r$e$n$t$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$o$p$t$i$o$n$ $v$a$l$u$e$=$"$a$l$l$"$>$A$l$l$ $S$e$g$m$e$n$t$s$<$/$o$p$t$i$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$o$p$t$i$o$n$ $v$a$l$u$e$=$"$p$r$e$m$i$u$m$"$>$P$r$e$m$i$u$m$<$/$o$p$t$i$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$o$p$t$i$o$n$ $v$a$l$u$e$=$"$r$e$g$u$l$a$r$"$>$R$e$g$u$l$a$r$<$/$o$p$t$i$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$o$p$t$i$o$n$ $v$a$l$u$e$=$"$n$e$w$"$>$N$e$w$<$/$o$p$t$i$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$s$e$l$e$c$t$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $<$/$d$i$v$>$$
$$
$ $ $ $ $ $ ${$/$*$ $B$u$l$k$ $A$c$t$i$o$n$s$ $T$o$o$l$b$a$r$ $*$/$}$$
$ $ $ $ $ $ ${$s$e$l$e$c$t$e$d$C$u$s$t$o$m$e$r$s$.$s$i$z$e$ $>$ $0$ $&$&$ $($$
$ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$b$e$t$w$e$e$n$ $p$-$4$ $b$g$-$n$e$u$t$r$a$l$-$5$0$ $b$o$r$d$e$r$ $b$o$r$d$e$r$-$n$e$u$t$r$a$l$-$2$0$0$ $r$o$u$n$d$e$d$-$l$g$"$>$$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $g$a$p$-$4$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$s$p$a$n$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$7$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ ${$s$e$l$e$c$t$e$d$C$u$s$t$o$m$e$r$s$.$s$i$z$e$}$ $c$u$s$t$o$m$e$r${$s$e$l$e$c$t$e$d$C$u$s$t$o$m$e$r$s$.$s$i$z$e$ $>$ $1$ $?$ $'$s$'$ $:$ $'$'$}$ $s$e$l$e$c$t$e$d$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$s$p$a$n$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$b$u$t$t$o$n$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$l$i$c$k$=${$($)$ $=$>$ $s$e$t$S$e$l$e$c$t$e$d$C$u$s$t$o$m$e$r$s$($n$e$w$ $S$e$t$($)$)$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$ $h$o$v$e$r$:$t$e$x$t$-$n$e$u$t$r$a$l$-$9$0$0$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $C$l$e$a$r$ $s$e$l$e$c$t$i$o$n$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$b$u$t$t$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $g$a$p$-$2$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$b$u$t$t$o$n$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$l$i$c$k$=${$h$a$n$d$l$e$E$x$p$o$r$t$C$S$V$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $d$i$s$a$b$l$e$d$=${$b$u$l$k$D$e$l$e$t$i$n$g$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$4$ $p$y$-$2$ $t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$7$0$0$ $b$g$-$w$h$i$t$e$ $b$o$r$d$e$r$ $b$o$r$d$e$r$-$n$e$u$t$r$a$l$-$3$0$0$ $r$o$u$n$d$e$d$-$l$g$ $h$o$v$e$r$:$b$g$-$n$e$u$t$r$a$l$-$5$0$ $d$i$s$a$b$l$e$d$:$o$p$a$c$i$t$y$-$5$0$ $d$i$s$a$b$l$e$d$:$c$u$r$s$o$r$-$n$o$t$-$a$l$l$o$w$e$d$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $E$x$p$o$r$t$ $C$S$V$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$b$u$t$t$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$b$u$t$t$o$n$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$l$i$c$k$=${$h$a$n$d$l$e$B$u$l$k$D$e$l$e$t$e$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $d$i$s$a$b$l$e$d$=${$b$u$l$k$D$e$l$e$t$i$n$g$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$4$ $p$y$-$2$ $t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$w$h$i$t$e$ $b$g$-$r$e$d$-$6$0$0$ $r$o$u$n$d$e$d$-$l$g$ $h$o$v$e$r$:$b$g$-$r$e$d$-$7$0$0$ $d$i$s$a$b$l$e$d$:$o$p$a$c$i$t$y$-$5$0$ $d$i$s$a$b$l$e$d$:$c$u$r$s$o$r$-$n$o$t$-$a$l$l$o$w$e$d$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ ${$b$u$l$k$D$e$l$e$t$i$n$g$ $?$ $'$D$e$l$e$t$i$n$g$.$.$.$'$ $:$ $'$D$e$l$e$t$e$ $S$e$l$e$c$t$e$d$'$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$b$u$t$t$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $)$}$$
$$
$ $ $ $ $ $ ${$/$*$ $C$u$s$t$o$m$e$r$s$ $T$a$b$l$e$ $*$/$}$$
$ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$c$a$r$d$ $o$v$e$r$f$l$o$w$-$h$i$d$d$e$n$"$>$$
$ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$o$v$e$r$f$l$o$w$-$x$-$a$u$t$o$"$>$$
$ $ $ $ $ $ $ $ $ $ $<$t$a$b$l$e$ $c$l$a$s$s$N$a$m$e$=$"$w$-$f$u$l$l$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$t$h$e$a$d$ $c$l$a$s$s$N$a$m$e$=$"$b$g$-$n$e$u$t$r$a$l$-$5$0$ $b$o$r$d$e$r$-$b$ $b$o$r$d$e$r$-$n$e$u$t$r$a$l$-$2$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$t$r$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$t$h$ $c$l$a$s$s$N$a$m$e$=$"$p$y$-$3$ $p$x$-$6$ $w$-$1$2$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$i$n$p$u$t$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $t$y$p$e$=$"$c$h$e$c$k$b$o$x$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$h$e$c$k$e$d$=${$c$u$s$t$o$m$e$r$s$.$l$e$n$g$t$h$ $>$ $0$ $&$&$ $s$e$l$e$c$t$e$d$C$u$s$t$o$m$e$r$s$.$s$i$z$e$ $=$=$=$ $c$u$s$t$o$m$e$r$s$.$l$e$n$g$t$h$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$h$a$n$g$e$=${$h$a$n$d$l$e$S$e$l$e$c$t$A$l$l$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$r$o$u$n$d$e$d$ $b$o$r$d$e$r$-$n$e$u$t$r$a$l$-$3$0$0$ $t$e$x$t$-$n$e$u$t$r$a$l$-$9$0$0$ $f$o$c$u$s$:$r$i$n$g$-$n$e$u$t$r$a$l$-$9$0$0$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$t$h$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$t$h$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$l$e$f$t$ $p$y$-$3$ $p$x$-$6$ $t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$"$>$C$u$s$t$o$m$e$r$<$/$t$h$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$t$h$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$l$e$f$t$ $p$y$-$3$ $p$x$-$6$ $t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$"$>$C$o$n$t$a$c$t$<$/$t$h$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$t$h$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$l$e$f$t$ $p$y$-$3$ $p$x$-$6$ $t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$"$>$B$u$s$i$n$e$s$s$<$/$t$h$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$t$h$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$l$e$f$t$ $p$y$-$3$ $p$x$-$6$ $t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$"$>$S$e$g$m$e$n$t$<$/$t$h$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$t$h$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$l$e$f$t$ $p$y$-$3$ $p$x$-$6$ $t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$"$>$O$r$d$e$r$s$<$/$t$h$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$t$h$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$l$e$f$t$ $p$y$-$3$ $p$x$-$6$ $t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$"$>$R$e$v$e$n$u$e$<$/$t$h$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$t$h$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$l$e$f$t$ $p$y$-$3$ $p$x$-$6$ $t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$"$>$J$o$i$n$e$d$<$/$t$h$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$t$h$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$r$i$g$h$t$ $p$y$-$3$ $p$x$-$6$ $t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$"$>$A$c$t$i$o$n$s$<$/$t$h$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$t$r$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$t$h$e$a$d$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$t$b$o$d$y$ $c$l$a$s$s$N$a$m$e$=$"$d$i$v$i$d$e$-$y$ $d$i$v$i$d$e$-$n$e$u$t$r$a$l$-$2$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ ${$c$u$s$t$o$m$e$r$s$.$l$e$n$g$t$h$ $=$=$=$ $0$ $?$ $($$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$t$r$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$t$d$ $c$o$l$S$p$a$n$=${$9$}$ $c$l$a$s$s$N$a$m$e$=$"$p$y$-$1$2$ $t$e$x$t$-$c$e$n$t$e$r$ $t$e$x$t$-$n$e$u$t$r$a$l$-$5$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $N$o$ $c$u$s$t$o$m$e$r$s$ $f$o$u$n$d$.$ ${$s$e$a$r$c$h$T$e$r$m$ $|$|$ $s$e$g$m$e$n$t$F$i$l$t$e$r$ $!$=$=$ $'$a$l$l$'$ $?$ $'$T$r$y$ $a$d$j$u$s$t$i$n$g$ $y$o$u$r$ $f$i$l$t$e$r$s$.$'$ $:$ $'$A$d$d$ $y$o$u$r$ $f$i$r$s$t$ $c$u$s$t$o$m$e$r$ $t$o$ $g$e$t$ $s$t$a$r$t$e$d$.$'$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$t$d$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$t$r$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $)$ $:$ $($$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$u$s$t$o$m$e$r$s$.$m$a$p$($($c$u$s$t$o$m$e$r$)$ $=$>$ $($$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$C$u$s$t$o$m$e$r$R$o$w$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $k$e$y$=${$c$u$s$t$o$m$e$r$.$i$d$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$u$s$t$o$m$e$r$=${$c$u$s$t$o$m$e$r$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $i$s$S$e$l$e$c$t$e$d$=${$s$e$l$e$c$t$e$d$C$u$s$t$o$m$e$r$s$.$h$a$s$($c$u$s$t$o$m$e$r$.$i$d$)$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$S$e$l$e$c$t$=${$h$a$n$d$l$e$S$e$l$e$c$t$C$u$s$t$o$m$e$r$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$V$i$e$w$=${$h$a$n$d$l$e$V$i$e$w$C$u$s$t$o$m$e$r$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$E$d$i$t$=${$h$a$n$d$l$e$E$d$i$t$C$u$s$t$o$m$e$r$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$D$e$l$e$t$e$=${$h$a$n$d$l$e$D$e$l$e$t$e$C$u$s$t$o$m$e$r$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $)$)$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $)$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$t$b$o$d$y$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$t$a$b$l$e$>$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$$
$ $ $ $ $ $ $ $ ${$/$*$ $P$a$g$i$n$a$t$i$o$n$ $*$/$}$$
$ $ $ $ $ $ $ $ ${$t$o$t$a$l$P$a$g$e$s$ $>$ $1$ $&$&$ $($$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$b$o$r$d$e$r$-$t$ $b$o$r$d$e$r$-$n$e$u$t$r$a$l$-$2$0$0$ $p$x$-$6$ $p$y$-$4$ $f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$b$e$t$w$e$e$n$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $P$a$g$e$ ${$c$u$r$r$e$n$t$P$a$g$e$}$ $o$f$ ${$t$o$t$a$l$P$a$g$e$s$}$ $(${$t$o$t$a$l$C$u$s$t$o$m$e$r$s$}$ $t$o$t$a$l$ $c$u$s$t$o$m$e$r$s$)$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $g$a$p$-$2$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$b$u$t$t$o$n$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$l$i$c$k$=${$($)$ $=$>$ $s$e$t$C$u$r$r$e$n$t$P$a$g$e$($p$ $=$>$ $M$a$t$h$.$m$a$x$($1$,$ $p$ $-$ $1$)$)$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $d$i$s$a$b$l$e$d$=${$c$u$r$r$e$n$t$P$a$g$e$ $=$=$=$ $1$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$4$ $p$y$-$2$ $b$o$r$d$e$r$ $b$o$r$d$e$r$-$n$e$u$t$r$a$l$-$3$0$0$ $r$o$u$n$d$e$d$-$l$g$ $h$o$v$e$r$:$b$g$-$n$e$u$t$r$a$l$-$5$0$ $d$i$s$a$b$l$e$d$:$o$p$a$c$i$t$y$-$5$0$ $d$i$s$a$b$l$e$d$:$c$u$r$s$o$r$-$n$o$t$-$a$l$l$o$w$e$d$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $P$r$e$v$i$o$u$s$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$b$u$t$t$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$b$u$t$t$o$n$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$l$i$c$k$=${$($)$ $=$>$ $s$e$t$C$u$r$r$e$n$t$P$a$g$e$($p$ $=$>$ $M$a$t$h$.$m$i$n$($t$o$t$a$l$P$a$g$e$s$,$ $p$ $+$ $1$)$)$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $d$i$s$a$b$l$e$d$=${$c$u$r$r$e$n$t$P$a$g$e$ $=$=$=$ $t$o$t$a$l$P$a$g$e$s$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$4$ $p$y$-$2$ $b$o$r$d$e$r$ $b$o$r$d$e$r$-$n$e$u$t$r$a$l$-$3$0$0$ $r$o$u$n$d$e$d$-$l$g$ $h$o$v$e$r$:$b$g$-$n$e$u$t$r$a$l$-$5$0$ $d$i$s$a$b$l$e$d$:$o$p$a$c$i$t$y$-$5$0$ $d$i$s$a$b$l$e$d$:$c$u$r$s$o$r$-$n$o$t$-$a$l$l$o$w$e$d$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $N$e$x$t$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$b$u$t$t$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $)$}$$
$ $ $ $ $ $ $<$/$d$i$v$>$$
$$
$ $ $ $ $ $ ${$/$*$ $C$u$s$t$o$m$e$r$ $M$o$d$a$l$ $-$ $L$a$z$y$ $L$o$a$d$e$d$ $*$/$}$$
$ $ $ $ $ $ ${$i$s$M$o$d$a$l$O$p$e$n$ $&$&$ $($$
$ $ $ $ $ $ $ $ $<$S$u$s$p$e$n$s$e$ $f$a$l$l$b$a$c$k$=${$<$M$o$d$a$l$L$o$a$d$e$r$ $/$>$}$>$$
$ $ $ $ $ $ $ $ $ $ $<$C$u$s$t$o$m$e$r$M$o$d$a$l$$
$ $ $ $ $ $ $ $ $ $ $ $ $i$s$O$p$e$n$=${$i$s$M$o$d$a$l$O$p$e$n$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$l$o$s$e$=${$h$a$n$d$l$e$C$l$o$s$e$M$o$d$a$l$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $o$n$S$u$c$c$e$s$s$=${$h$a$n$d$l$e$S$a$v$e$S$u$c$c$e$s$s$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $c$u$s$t$o$m$e$r$=${$e$d$i$t$i$n$g$C$u$s$t$o$m$e$r$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $m$o$d$e$=${$m$o$d$a$l$M$o$d$e$}$$
$ $ $ $ $ $ $ $ $ $ $/$>$$
$ $ $ $ $ $ $ $ $<$/$S$u$s$p$e$n$s$e$>$$
$ $ $ $ $ $ $)$}$$
$$
$ $ $ $ $ $ ${$/$*$ $T$O$D$O$:$ $I$m$p$l$e$m$e$n$t$ $C$u$s$t$o$m$e$r$ $D$e$t$a$i$l$ $M$o$d$a$l$ $*$/$}$$
$ $ $ $ $ $ ${$/$*$ $<$C$u$s$t$o$m$e$r$D$e$t$a$i$l$M$o$d$a$l$$
$ $ $ $ $ $ $ $ $c$u$s$t$o$m$e$r$=${$s$e$l$e$c$t$e$d$C$u$s$t$o$m$e$r$}$$
$ $ $ $ $ $ $ $ $i$s$O$p$e$n$=${$i$s$D$e$t$a$i$l$M$o$d$a$l$O$p$e$n$}$$
$ $ $ $ $ $ $ $ $o$n$C$l$o$s$e$=${$($)$ $=$>$ $s$e$t$I$s$D$e$t$a$i$l$M$o$d$a$l$O$p$e$n$($f$a$l$s$e$)$}$$
$ $ $ $ $ $ $/$>$ $*$/$}$$
$ $ $ $ $<$/$d$i$v$>$$
$ $ $)$;$$
$}$$
$
