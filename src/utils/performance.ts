$/$*$*$$
$ $*$ $P$e$r$f$o$r$m$a$n$c$e$ $m$o$n$i$t$o$r$i$n$g$ $u$t$i$l$i$t$i$e$s$$
$ $*$ $$
$ $*$ $T$h$i$s$ $m$o$d$u$l$e$ $p$r$o$v$i$d$e$s$ $u$t$i$l$i$t$i$e$s$ $f$o$r$ $m$e$a$s$u$r$i$n$g$ $a$n$d$ $r$e$p$o$r$t$i$n$g$$
$ $*$ $C$o$r$e$ $W$e$b$ $V$i$t$a$l$s$ $a$n$d$ $c$u$s$t$o$m$ $p$e$r$f$o$r$m$a$n$c$e$ $m$e$t$r$i$c$s$.$$
$ $*$/$$
$$
$i$m$p$o$r$t$ ${$ $o$n$C$L$S$,$ $o$n$L$C$P$,$ $o$n$T$T$F$B$,$ $o$n$I$N$P$,$ $o$n$F$C$P$,$ $M$e$t$r$i$c$ $}$ $f$r$o$m$ $'$w$e$b$-$v$i$t$a$l$s$'$;$$
$$
$/$/$ $P$e$r$f$o$r$m$a$n$c$e$ $m$e$t$r$i$c$ $t$y$p$e$s$$
$e$x$p$o$r$t$ $i$n$t$e$r$f$a$c$e$ $P$e$r$f$o$r$m$a$n$c$e$M$e$t$r$i$c$s$ ${$$
$ $ $/$/$ $C$o$r$e$ $W$e$b$ $V$i$t$a$l$s$$
$ $ $c$l$s$?$:$ $n$u$m$b$e$r$;$ $ $/$/$ $C$u$m$u$l$a$t$i$v$e$ $L$a$y$o$u$t$ $S$h$i$f$t$$
$ $ $l$c$p$?$:$ $n$u$m$b$e$r$;$ $ $/$/$ $L$a$r$g$e$s$t$ $C$o$n$t$e$n$t$f$u$l$ $P$a$i$n$t$$
$ $ $t$t$f$b$?$:$ $n$u$m$b$e$r$;$ $/$/$ $T$i$m$e$ $t$o$ $F$i$r$s$t$ $B$y$t$e$$
$ $ $i$n$p$?$:$ $n$u$m$b$e$r$;$ $ $/$/$ $I$n$t$e$r$a$c$t$i$o$n$ $t$o$ $N$e$x$t$ $P$a$i$n$t$ $($r$e$p$l$a$c$e$d$ $F$I$D$)$$
$ $ $$
$ $ $/$/$ $C$u$s$t$o$m$ $m$e$t$r$i$c$s$$
$ $ $f$c$p$?$:$ $n$u$m$b$e$r$;$ $ $/$/$ $F$i$r$s$t$ $C$o$n$t$e$n$t$f$u$l$ $P$a$i$n$t$$
$ $ $t$t$i$?$:$ $n$u$m$b$e$r$;$ $ $/$/$ $T$i$m$e$ $t$o$ $I$n$t$e$r$a$c$t$i$v$e$$
$ $ $$
$ $ $/$/$ $P$a$g$e$ $i$n$f$o$$
$ $ $u$r$l$:$ $s$t$r$i$n$g$;$$
$ $ $t$i$m$e$s$t$a$m$p$:$ $n$u$m$b$e$r$;$$
$}$$
$$
$/$/$ $S$t$o$r$e$ $m$e$t$r$i$c$s$ $i$n$ $m$e$m$o$r$y$$
$c$o$n$s$t$ $m$e$t$r$i$c$s$:$ $P$e$r$f$o$r$m$a$n$c$e$M$e$t$r$i$c$s$ $=$ ${$$
$ $ $u$r$l$:$ $w$i$n$d$o$w$.$l$o$c$a$t$i$o$n$.$h$r$e$f$,$$
$ $ $t$i$m$e$s$t$a$m$p$:$ $D$a$t$e$.$n$o$w$($)$,$$
$}$;$$
$$
$/$*$*$$
$ $*$ $R$e$p$o$r$t$ $m$e$t$r$i$c$ $t$o$ $a$n$a$l$y$t$i$c$s$ $s$e$r$v$i$c$e$$
$ $*$ $I$n$ $p$r$o$d$u$c$t$i$o$n$,$ $t$h$i$s$ $w$o$u$l$d$ $s$e$n$d$ $t$o$ $y$o$u$r$ $a$n$a$l$y$t$i$c$s$ $p$l$a$t$f$o$r$m$$
$ $*$/$$
$f$u$n$c$t$i$o$n$ $s$e$n$d$T$o$A$n$a$l$y$t$i$c$s$($m$e$t$r$i$c$:$ $M$e$t$r$i$c$)$ ${$$
$ $ $c$o$n$s$t$ $b$o$d$y$ $=$ $J$S$O$N$.$s$t$r$i$n$g$i$f$y$(${$$
$ $ $ $ $n$a$m$e$:$ $m$e$t$r$i$c$.$n$a$m$e$,$$
$ $ $ $ $v$a$l$u$e$:$ $m$e$t$r$i$c$.$v$a$l$u$e$,$$
$ $ $ $ $r$a$t$i$n$g$:$ $m$e$t$r$i$c$.$r$a$t$i$n$g$,$$
$ $ $ $ $d$e$l$t$a$:$ $m$e$t$r$i$c$.$d$e$l$t$a$,$$
$ $ $ $ $i$d$:$ $m$e$t$r$i$c$.$i$d$,$$
$ $ $ $ $u$r$l$:$ $w$i$n$d$o$w$.$l$o$c$a$t$i$o$n$.$h$r$e$f$,$$
$ $ $ $ $t$i$m$e$s$t$a$m$p$:$ $D$a$t$e$.$n$o$w$($)$,$$
$ $ $}$)$;$$
$$
$ $ $/$/$ $L$o$g$ $t$o$ $c$o$n$s$o$l$e$ $i$n$ $d$e$v$e$l$o$p$m$e$n$t$$
$ $ $i$f$ $($p$r$o$c$e$s$s$.$e$n$v$.$N$O$D$E$_$E$N$V$ $=$=$=$ $'$d$e$v$e$l$o$p$m$e$n$t$'$)$ ${$$
$ $ $ $ $c$o$n$s$o$l$e$.$l$o$g$($`$[$P$e$r$f$o$r$m$a$n$c$e$]$ $$${$m$e$t$r$i$c$.$n$a$m$e$}$:$`$,$ ${$$
$ $ $ $ $ $ $v$a$l$u$e$:$ $m$e$t$r$i$c$.$v$a$l$u$e$,$$
$ $ $ $ $ $ $r$a$t$i$n$g$:$ $m$e$t$r$i$c$.$r$a$t$i$n$g$,$$
$ $ $ $ $}$)$;$$
$ $ $}$$
$$
$ $ $/$/$ $I$n$ $p$r$o$d$u$c$t$i$o$n$,$ $s$e$n$d$ $t$o$ $a$n$a$l$y$t$i$c$s$ $s$e$r$v$i$c$e$$
$ $ $/$/$ $E$x$a$m$p$l$e$:$ $n$a$v$i$g$a$t$o$r$.$s$e$n$d$B$e$a$c$o$n$($'$/$a$p$i$/$a$n$a$l$y$t$i$c$s$'$,$ $b$o$d$y$)$;$$
$ $ $$
$ $ $/$/$ $S$t$o$r$e$ $i$n$ $l$o$c$a$l$S$t$o$r$a$g$e$ $f$o$r$ $d$e$b$u$g$g$i$n$g$$
$ $ $t$r$y$ ${$$
$ $ $ $ $c$o$n$s$t$ $s$t$o$r$e$d$ $=$ $l$o$c$a$l$S$t$o$r$a$g$e$.$g$e$t$I$t$e$m$($'$p$e$r$f$o$r$m$a$n$c$e$-$m$e$t$r$i$c$s$'$)$ $|$|$ $'$[$]$'$;$$
$ $ $ $ $c$o$n$s$t$ $a$l$l$M$e$t$r$i$c$s$ $=$ $J$S$O$N$.$p$a$r$s$e$($s$t$o$r$e$d$)$;$$
$ $ $ $ $a$l$l$M$e$t$r$i$c$s$.$p$u$s$h$($J$S$O$N$.$p$a$r$s$e$($b$o$d$y$)$)$;$$
$ $ $ $ $/$/$ $K$e$e$p$ $o$n$l$y$ $l$a$s$t$ $5$0$ $m$e$a$s$u$r$e$m$e$n$t$s$$
$ $ $ $ $i$f$ $($a$l$l$M$e$t$r$i$c$s$.$l$e$n$g$t$h$ $>$ $5$0$)$ ${$$
$ $ $ $ $ $ $a$l$l$M$e$t$r$i$c$s$.$s$h$i$f$t$($)$;$$
$ $ $ $ $}$$
$ $ $ $ $l$o$c$a$l$S$t$o$r$a$g$e$.$s$e$t$I$t$e$m$($'$p$e$r$f$o$r$m$a$n$c$e$-$m$e$t$r$i$c$s$'$,$ $J$S$O$N$.$s$t$r$i$n$g$i$f$y$($a$l$l$M$e$t$r$i$c$s$)$)$;$$
$ $ $}$ $c$a$t$c$h$ $($e$)$ ${$$
$ $ $ $ $/$/$ $I$g$n$o$r$e$ $s$t$o$r$a$g$e$ $e$r$r$o$r$s$$
$ $ $}$$
$}$$
$$
$/$*$*$$
$ $*$ $I$n$i$t$i$a$l$i$z$e$ $C$o$r$e$ $W$e$b$ $V$i$t$a$l$s$ $m$o$n$i$t$o$r$i$n$g$$
$ $*$/$$
$e$x$p$o$r$t$ $f$u$n$c$t$i$o$n$ $i$n$i$t$P$e$r$f$o$r$m$a$n$c$e$M$o$n$i$t$o$r$i$n$g$($)$ ${$$
$ $ $/$/$ $M$e$a$s$u$r$e$ $C$u$m$u$l$a$t$i$v$e$ $L$a$y$o$u$t$ $S$h$i$f$t$ $($C$L$S$)$$
$ $ $/$/$ $G$o$o$d$:$ $<$ $0$.$1$,$ $N$e$e$d$s$ $i$m$p$r$o$v$e$m$e$n$t$:$ $0$.$1$-$0$.$2$5$,$ $P$o$o$r$:$ $>$ $0$.$2$5$$
$ $ $o$n$C$L$S$($($m$e$t$r$i$c$)$ $=$>$ ${$$
$ $ $ $ $m$e$t$r$i$c$s$.$c$l$s$ $=$ $m$e$t$r$i$c$.$v$a$l$u$e$;$$
$ $ $ $ $s$e$n$d$T$o$A$n$a$l$y$t$i$c$s$($m$e$t$r$i$c$)$;$$
$ $ $}$)$;$$
$$
$ $ $/$/$ $M$e$a$s$u$r$e$ $F$i$r$s$t$ $C$o$n$t$e$n$t$f$u$l$ $P$a$i$n$t$ $($F$C$P$)$$
$ $ $/$/$ $G$o$o$d$:$ $<$ $1$.$8$s$,$ $N$e$e$d$s$ $i$m$p$r$o$v$e$m$e$n$t$:$ $1$.$8$-$3$s$,$ $P$o$o$r$:$ $>$ $3$s$$
$ $ $o$n$F$C$P$($($m$e$t$r$i$c$:$ $M$e$t$r$i$c$)$ $=$>$ ${$$
$ $ $ $ $m$e$t$r$i$c$s$.$f$c$p$ $=$ $m$e$t$r$i$c$.$v$a$l$u$e$;$$
$ $ $ $ $s$e$n$d$T$o$A$n$a$l$y$t$i$c$s$($m$e$t$r$i$c$)$;$$
$ $ $}$)$;$$
$$
$ $ $/$/$ $M$e$a$s$u$r$e$ $L$a$r$g$e$s$t$ $C$o$n$t$e$n$t$f$u$l$ $P$a$i$n$t$ $($L$C$P$)$$
$ $ $/$/$ $G$o$o$d$:$ $<$ $2$.$5$s$,$ $N$e$e$d$s$ $i$m$p$r$o$v$e$m$e$n$t$:$ $2$.$5$-$4$s$,$ $P$o$o$r$:$ $>$ $4$s$$
$ $ $o$n$L$C$P$($($m$e$t$r$i$c$)$ $=$>$ ${$$
$ $ $ $ $m$e$t$r$i$c$s$.$l$c$p$ $=$ $m$e$t$r$i$c$.$v$a$l$u$e$;$$
$ $ $ $ $s$e$n$d$T$o$A$n$a$l$y$t$i$c$s$($m$e$t$r$i$c$)$;$$
$ $ $}$)$;$$
$$
$ $ $/$/$ $M$e$a$s$u$r$e$ $T$i$m$e$ $t$o$ $F$i$r$s$t$ $B$y$t$e$ $($T$T$F$B$)$$
$ $ $/$/$ $G$o$o$d$:$ $<$ $8$0$0$m$s$,$ $N$e$e$d$s$ $i$m$p$r$o$v$e$m$e$n$t$:$ $8$0$0$-$1$8$0$0$m$s$,$ $P$o$o$r$:$ $>$ $1$8$0$0$m$s$$
$ $ $o$n$T$T$F$B$($($m$e$t$r$i$c$)$ $=$>$ ${$$
$ $ $ $ $m$e$t$r$i$c$s$.$t$t$f$b$ $=$ $m$e$t$r$i$c$.$v$a$l$u$e$;$$
$ $ $ $ $s$e$n$d$T$o$A$n$a$l$y$t$i$c$s$($m$e$t$r$i$c$)$;$$
$ $ $}$)$;$$
$$
$ $ $/$/$ $M$e$a$s$u$r$e$ $I$n$t$e$r$a$c$t$i$o$n$ $t$o$ $N$e$x$t$ $P$a$i$n$t$ $($I$N$P$)$$
$ $ $/$/$ $G$o$o$d$:$ $<$ $2$0$0$m$s$,$ $N$e$e$d$s$ $i$m$p$r$o$v$e$m$e$n$t$:$ $2$0$0$-$5$0$0$m$s$,$ $P$o$o$r$:$ $>$ $5$0$0$m$s$$
$ $ $o$n$I$N$P$($($m$e$t$r$i$c$)$ $=$>$ ${$$
$ $ $ $ $m$e$t$r$i$c$s$.$i$n$p$ $=$ $m$e$t$r$i$c$.$v$a$l$u$e$;$$
$ $ $ $ $s$e$n$d$T$o$A$n$a$l$y$t$i$c$s$($m$e$t$r$i$c$)$;$$
$ $ $}$)$;$$
$$
$ $ $/$/$ $L$o$g$ $i$n$i$t$i$a$l$ $p$e$r$f$o$r$m$a$n$c$e$ $m$e$t$r$i$c$s$$
$ $ $i$f$ $($p$r$o$c$e$s$s$.$e$n$v$.$N$O$D$E$_$E$N$V$ $=$=$=$ $'$d$e$v$e$l$o$p$m$e$n$t$'$)$ ${$$
$ $ $ $ $c$o$n$s$o$l$e$.$l$o$g$($'$[$P$e$r$f$o$r$m$a$n$c$e$]$ $M$o$n$i$t$o$r$i$n$g$ $i$n$i$t$i$a$l$i$z$e$d$'$)$;$$
$ $ $}$$
$}$$
$$
$/$*$*$$
$ $*$ $G$e$t$ $c$u$r$r$e$n$t$ $p$e$r$f$o$r$m$a$n$c$e$ $m$e$t$r$i$c$s$$
$ $*$/$$
$e$x$p$o$r$t$ $f$u$n$c$t$i$o$n$ $g$e$t$P$e$r$f$o$r$m$a$n$c$e$M$e$t$r$i$c$s$($)$:$ $P$e$r$f$o$r$m$a$n$c$e$M$e$t$r$i$c$s$ ${$$
$ $ $r$e$t$u$r$n$ ${$ $.$.$.$m$e$t$r$i$c$s$ $}$;$$
$}$$
$$
$/$*$*$$
$ $*$ $C$l$e$a$r$ $s$t$o$r$e$d$ $p$e$r$f$o$r$m$a$n$c$e$ $m$e$t$r$i$c$s$$
$ $*$/$$
$e$x$p$o$r$t$ $f$u$n$c$t$i$o$n$ $c$l$e$a$r$P$e$r$f$o$r$m$a$n$c$e$M$e$t$r$i$c$s$($)$ ${$$
$ $ $t$r$y$ ${$$
$ $ $ $ $l$o$c$a$l$S$t$o$r$a$g$e$.$r$e$m$o$v$e$I$t$e$m$($'$p$e$r$f$o$r$m$a$n$c$e$-$m$e$t$r$i$c$s$'$)$;$$
$ $ $}$ $c$a$t$c$h$ $($e$)$ ${$$
$ $ $ $ $/$/$ $I$g$n$o$r$e$ $s$t$o$r$a$g$e$ $e$r$r$o$r$s$$
$ $ $}$$
$}$$
$$
$/$*$*$$
$ $*$ $G$e$t$ $s$t$o$r$e$d$ $p$e$r$f$o$r$m$a$n$c$e$ $m$e$t$r$i$c$s$ $f$r$o$m$ $l$o$c$a$l$S$t$o$r$a$g$e$$
$ $*$/$$
$e$x$p$o$r$t$ $f$u$n$c$t$i$o$n$ $g$e$t$S$t$o$r$e$d$M$e$t$r$i$c$s$($)$:$ $a$n$y$[$]$ ${$$
$ $ $t$r$y$ ${$$
$ $ $ $ $c$o$n$s$t$ $s$t$o$r$e$d$ $=$ $l$o$c$a$l$S$t$o$r$a$g$e$.$g$e$t$I$t$e$m$($'$p$e$r$f$o$r$m$a$n$c$e$-$m$e$t$r$i$c$s$'$)$ $|$|$ $'$[$]$'$;$$
$ $ $ $ $r$e$t$u$r$n$ $J$S$O$N$.$p$a$r$s$e$($s$t$o$r$e$d$)$;$$
$ $ $}$ $c$a$t$c$h$ $($e$)$ ${$$
$ $ $ $ $r$e$t$u$r$n$ $[$]$;$$
$ $ $}$$
$}$$
$$
$/$*$*$$
$ $*$ $C$a$l$c$u$l$a$t$e$ $a$v$e$r$a$g$e$ $m$e$t$r$i$c$s$ $f$r$o$m$ $s$t$o$r$e$d$ $d$a$t$a$$
$ $*$/$$
$e$x$p$o$r$t$ $f$u$n$c$t$i$o$n$ $g$e$t$A$v$e$r$a$g$e$M$e$t$r$i$c$s$($)$ ${$$
$ $ $c$o$n$s$t$ $s$t$o$r$e$d$ $=$ $g$e$t$S$t$o$r$e$d$M$e$t$r$i$c$s$($)$;$$
$ $ $$
$ $ $i$f$ $($s$t$o$r$e$d$.$l$e$n$g$t$h$ $=$=$=$ $0$)$ ${$$
$ $ $ $ $r$e$t$u$r$n$ $n$u$l$l$;$$
$ $ $}$$
$$
$ $ $c$o$n$s$t$ $s$u$m$s$:$ $R$e$c$o$r$d$<$s$t$r$i$n$g$,$ $n$u$m$b$e$r$>$ $=$ ${$}$;$$
$ $ $c$o$n$s$t$ $c$o$u$n$t$s$:$ $R$e$c$o$r$d$<$s$t$r$i$n$g$,$ $n$u$m$b$e$r$>$ $=$ ${$}$;$$
$$
$ $ $s$t$o$r$e$d$.$f$o$r$E$a$c$h$($($m$e$t$r$i$c$:$ $a$n$y$)$ $=$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $n$a$m$e$ $=$ $m$e$t$r$i$c$.$n$a$m$e$;$$
$ $ $ $ $c$o$n$s$t$ $v$a$l$u$e$ $=$ $m$e$t$r$i$c$.$v$a$l$u$e$;$$
$ $ $ $ $$
$ $ $ $ $i$f$ $($!$s$u$m$s$[$n$a$m$e$]$)$ ${$$
$ $ $ $ $ $ $s$u$m$s$[$n$a$m$e$]$ $=$ $0$;$$
$ $ $ $ $ $ $c$o$u$n$t$s$[$n$a$m$e$]$ $=$ $0$;$$
$ $ $ $ $}$$
$ $ $ $ $$
$ $ $ $ $s$u$m$s$[$n$a$m$e$]$ $+$=$ $v$a$l$u$e$;$$
$ $ $ $ $c$o$u$n$t$s$[$n$a$m$e$]$+$+$;$$
$ $ $}$)$;$$
$$
$ $ $c$o$n$s$t$ $a$v$e$r$a$g$e$s$:$ $R$e$c$o$r$d$<$s$t$r$i$n$g$,$ $n$u$m$b$e$r$>$ $=$ ${$}$;$$
$ $ $O$b$j$e$c$t$.$k$e$y$s$($s$u$m$s$)$.$f$o$r$E$a$c$h$($($n$a$m$e$)$ $=$>$ ${$$
$ $ $ $ $a$v$e$r$a$g$e$s$[$n$a$m$e$]$ $=$ $s$u$m$s$[$n$a$m$e$]$ $/$ $c$o$u$n$t$s$[$n$a$m$e$]$;$$
$ $ $}$)$;$$
$$
$ $ $r$e$t$u$r$n$ $a$v$e$r$a$g$e$s$;$$
$}$$
$$
$/$*$*$$
$ $*$ $M$e$a$s$u$r$e$ $c$u$s$t$o$m$ $t$i$m$i$n$g$$
$ $*$/$$
$e$x$p$o$r$t$ $f$u$n$c$t$i$o$n$ $m$e$a$s$u$r$e$T$i$m$i$n$g$($n$a$m$e$:$ $s$t$r$i$n$g$,$ $s$t$a$r$t$M$a$r$k$:$ $s$t$r$i$n$g$,$ $e$n$d$M$a$r$k$:$ $s$t$r$i$n$g$)$ ${$$
$ $ $t$r$y$ ${$$
$ $ $ $ $p$e$r$f$o$r$m$a$n$c$e$.$m$e$a$s$u$r$e$($n$a$m$e$,$ $s$t$a$r$t$M$a$r$k$,$ $e$n$d$M$a$r$k$)$;$$
$ $ $ $ $c$o$n$s$t$ $m$e$a$s$u$r$e$ $=$ $p$e$r$f$o$r$m$a$n$c$e$.$g$e$t$E$n$t$r$i$e$s$B$y$N$a$m$e$($n$a$m$e$)$[$0$]$;$$
$ $ $ $ $$
$ $ $ $ $i$f$ $($p$r$o$c$e$s$s$.$e$n$v$.$N$O$D$E$_$E$N$V$ $=$=$=$ $'$d$e$v$e$l$o$p$m$e$n$t$'$)$ ${$$
$ $ $ $ $ $ $c$o$n$s$o$l$e$.$l$o$g$($`$[$P$e$r$f$o$r$m$a$n$c$e$]$ $$${$n$a$m$e$}$:$ $$${$m$e$a$s$u$r$e$.$d$u$r$a$t$i$o$n$.$t$o$F$i$x$e$d$($2$)$}$m$s$`$)$;$$
$ $ $ $ $}$$
$ $ $ $ $$
$ $ $ $ $r$e$t$u$r$n$ $m$e$a$s$u$r$e$.$d$u$r$a$t$i$o$n$;$$
$ $ $}$ $c$a$t$c$h$ $($e$)$ ${$$
$ $ $ $ $c$o$n$s$o$l$e$.$e$r$r$o$r$($'$E$r$r$o$r$ $m$e$a$s$u$r$i$n$g$ $t$i$m$i$n$g$:$'$,$ $e$)$;$$
$ $ $ $ $r$e$t$u$r$n$ $0$;$$
$ $ $}$$
$}$$
$$
$/$*$*$$
$ $*$ $M$a$r$k$ $a$ $p$e$r$f$o$r$m$a$n$c$e$ $p$o$i$n$t$$
$ $*$/$$
$e$x$p$o$r$t$ $f$u$n$c$t$i$o$n$ $m$a$r$k$($n$a$m$e$:$ $s$t$r$i$n$g$)$ ${$$
$ $ $t$r$y$ ${$$
$ $ $ $ $p$e$r$f$o$r$m$a$n$c$e$.$m$a$r$k$($n$a$m$e$)$;$$
$ $ $}$ $c$a$t$c$h$ $($e$)$ ${$$
$ $ $ $ $c$o$n$s$o$l$e$.$e$r$r$o$r$($'$E$r$r$o$r$ $m$a$r$k$i$n$g$ $p$e$r$f$o$r$m$a$n$c$e$:$'$,$ $e$)$;$$
$ $ $}$$
$}$$
$$
$/$*$*$$
$ $*$ $G$e$t$ $n$a$v$i$g$a$t$i$o$n$ $t$i$m$i$n$g$ $m$e$t$r$i$c$s$$
$ $*$/$$
$e$x$p$o$r$t$ $f$u$n$c$t$i$o$n$ $g$e$t$N$a$v$i$g$a$t$i$o$n$T$i$m$i$n$g$($)$ ${$$
$ $ $c$o$n$s$t$ $p$e$r$f$D$a$t$a$ $=$ $p$e$r$f$o$r$m$a$n$c$e$.$g$e$t$E$n$t$r$i$e$s$B$y$T$y$p$e$($'$n$a$v$i$g$a$t$i$o$n$'$)$[$0$]$ $a$s$ $P$e$r$f$o$r$m$a$n$c$e$N$a$v$i$g$a$t$i$o$n$T$i$m$i$n$g$;$$
$ $ $$
$ $ $i$f$ $($!$p$e$r$f$D$a$t$a$)$ ${$$
$ $ $ $ $r$e$t$u$r$n$ $n$u$l$l$;$$
$ $ $}$$
$$
$ $ $r$e$t$u$r$n$ ${$$
$ $ $ $ $/$/$ $D$N$S$ $l$o$o$k$u$p$ $t$i$m$e$$
$ $ $ $ $d$n$s$:$ $p$e$r$f$D$a$t$a$.$d$o$m$a$i$n$L$o$o$k$u$p$E$n$d$ $-$ $p$e$r$f$D$a$t$a$.$d$o$m$a$i$n$L$o$o$k$u$p$S$t$a$r$t$,$$
$ $ $ $ $$
$ $ $ $ $/$/$ $T$C$P$ $c$o$n$n$e$c$t$i$o$n$ $t$i$m$e$$
$ $ $ $ $t$c$p$:$ $p$e$r$f$D$a$t$a$.$c$o$n$n$e$c$t$E$n$d$ $-$ $p$e$r$f$D$a$t$a$.$c$o$n$n$e$c$t$S$t$a$r$t$,$$
$ $ $ $ $$
$ $ $ $ $/$/$ $R$e$q$u$e$s$t$ $t$i$m$e$$
$ $ $ $ $r$e$q$u$e$s$t$:$ $p$e$r$f$D$a$t$a$.$r$e$s$p$o$n$s$e$S$t$a$r$t$ $-$ $p$e$r$f$D$a$t$a$.$r$e$q$u$e$s$t$S$t$a$r$t$,$$
$ $ $ $ $$
$ $ $ $ $/$/$ $R$e$s$p$o$n$s$e$ $t$i$m$e$$
$ $ $ $ $r$e$s$p$o$n$s$e$:$ $p$e$r$f$D$a$t$a$.$r$e$s$p$o$n$s$e$E$n$d$ $-$ $p$e$r$f$D$a$t$a$.$r$e$s$p$o$n$s$e$S$t$a$r$t$,$$
$ $ $ $ $$
$ $ $ $ $/$/$ $D$O$M$ $p$r$o$c$e$s$s$i$n$g$ $t$i$m$e$$
$ $ $ $ $d$o$m$P$r$o$c$e$s$s$i$n$g$:$ $p$e$r$f$D$a$t$a$.$d$o$m$C$o$m$p$l$e$t$e$ $-$ $p$e$r$f$D$a$t$a$.$d$o$m$I$n$t$e$r$a$c$t$i$v$e$,$$
$ $ $ $ $$
$ $ $ $ $/$/$ $D$O$M$ $c$o$n$t$e$n$t$ $l$o$a$d$e$d$$
$ $ $ $ $d$o$m$C$o$n$t$e$n$t$L$o$a$d$e$d$:$ $p$e$r$f$D$a$t$a$.$d$o$m$C$o$n$t$e$n$t$L$o$a$d$e$d$E$v$e$n$t$E$n$d$ $-$ $p$e$r$f$D$a$t$a$.$d$o$m$C$o$n$t$e$n$t$L$o$a$d$e$d$E$v$e$n$t$S$t$a$r$t$,$$
$ $ $ $ $$
$ $ $ $ $/$/$ $L$o$a$d$ $c$o$m$p$l$e$t$e$$
$ $ $ $ $l$o$a$d$C$o$m$p$l$e$t$e$:$ $p$e$r$f$D$a$t$a$.$l$o$a$d$E$v$e$n$t$E$n$d$ $-$ $p$e$r$f$D$a$t$a$.$l$o$a$d$E$v$e$n$t$S$t$a$r$t$,$$
$ $ $ $ $$
$ $ $ $ $/$/$ $T$o$t$a$l$ $p$a$g$e$ $l$o$a$d$ $t$i$m$e$$
$ $ $ $ $t$o$t$a$l$P$a$g$e$L$o$a$d$:$ $p$e$r$f$D$a$t$a$.$l$o$a$d$E$v$e$n$t$E$n$d$ $-$ $p$e$r$f$D$a$t$a$.$f$e$t$c$h$S$t$a$r$t$,$$
$ $ $}$;$$
$}$$
$$
$/$*$*$$
$ $*$ $G$e$t$ $r$e$s$o$u$r$c$e$ $t$i$m$i$n$g$ $m$e$t$r$i$c$s$$
$ $*$/$$
$e$x$p$o$r$t$ $f$u$n$c$t$i$o$n$ $g$e$t$R$e$s$o$u$r$c$e$T$i$m$i$n$g$($)$ ${$$
$ $ $c$o$n$s$t$ $r$e$s$o$u$r$c$e$s$ $=$ $p$e$r$f$o$r$m$a$n$c$e$.$g$e$t$E$n$t$r$i$e$s$B$y$T$y$p$e$($'$r$e$s$o$u$r$c$e$'$)$ $a$s$ $P$e$r$f$o$r$m$a$n$c$e$R$e$s$o$u$r$c$e$T$i$m$i$n$g$[$]$;$$
$ $ $$
$ $ $c$o$n$s$t$ $s$t$a$t$s$ $=$ ${$$
$ $ $ $ $t$o$t$a$l$:$ $r$e$s$o$u$r$c$e$s$.$l$e$n$g$t$h$,$$
$ $ $ $ $t$o$t$a$l$S$i$z$e$:$ $0$,$$
$ $ $ $ $t$o$t$a$l$D$u$r$a$t$i$o$n$:$ $0$,$$
$ $ $ $ $b$y$T$y$p$e$:$ ${$}$ $a$s$ $R$e$c$o$r$d$<$s$t$r$i$n$g$,$ ${$ $c$o$u$n$t$:$ $n$u$m$b$e$r$;$ $s$i$z$e$:$ $n$u$m$b$e$r$;$ $d$u$r$a$t$i$o$n$:$ $n$u$m$b$e$r$ $}$>$,$$
$ $ $}$;$$
$$
$ $ $r$e$s$o$u$r$c$e$s$.$f$o$r$E$a$c$h$($($r$e$s$o$u$r$c$e$)$ $=$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $d$u$r$a$t$i$o$n$ $=$ $r$e$s$o$u$r$c$e$.$r$e$s$p$o$n$s$e$E$n$d$ $-$ $r$e$s$o$u$r$c$e$.$s$t$a$r$t$T$i$m$e$;$$
$ $ $ $ $c$o$n$s$t$ $s$i$z$e$ $=$ $r$e$s$o$u$r$c$e$.$t$r$a$n$s$f$e$r$S$i$z$e$ $|$|$ $0$;$$
$ $ $ $ $$
$ $ $ $ $s$t$a$t$s$.$t$o$t$a$l$D$u$r$a$t$i$o$n$ $+$=$ $d$u$r$a$t$i$o$n$;$$
$ $ $ $ $s$t$a$t$s$.$t$o$t$a$l$S$i$z$e$ $+$=$ $s$i$z$e$;$$
$ $ $ $ $$
$ $ $ $ $/$/$ $D$e$t$e$r$m$i$n$e$ $r$e$s$o$u$r$c$e$ $t$y$p$e$ $f$r$o$m$ $n$a$m$e$$
$ $ $ $ $l$e$t$ $t$y$p$e$ $=$ $'$o$t$h$e$r$'$;$$
$ $ $ $ $i$f$ $($r$e$s$o$u$r$c$e$.$n$a$m$e$.$e$n$d$s$W$i$t$h$($'$.$j$s$'$)$)$ $t$y$p$e$ $=$ $'$s$c$r$i$p$t$'$;$$
$ $ $ $ $e$l$s$e$ $i$f$ $($r$e$s$o$u$r$c$e$.$n$a$m$e$.$e$n$d$s$W$i$t$h$($'$.$c$s$s$'$)$)$ $t$y$p$e$ $=$ $'$s$t$y$l$e$s$h$e$e$t$'$;$$
$ $ $ $ $e$l$s$e$ $i$f$ $($r$e$s$o$u$r$c$e$.$n$a$m$e$.$m$a$t$c$h$($/$\$.$($j$p$g$|$j$p$e$g$|$p$n$g$|$g$i$f$|$s$v$g$|$w$e$b$p$)$$$/$)$)$ $t$y$p$e$ $=$ $'$i$m$a$g$e$'$;$$
$ $ $ $ $e$l$s$e$ $i$f$ $($r$e$s$o$u$r$c$e$.$n$a$m$e$.$m$a$t$c$h$($/$\$.$($w$o$f$f$|$w$o$f$f$2$|$t$t$f$|$e$o$t$)$$$/$)$)$ $t$y$p$e$ $=$ $'$f$o$n$t$'$;$$
$ $ $ $ $$
$ $ $ $ $i$f$ $($!$s$t$a$t$s$.$b$y$T$y$p$e$[$t$y$p$e$]$)$ ${$$
$ $ $ $ $ $ $s$t$a$t$s$.$b$y$T$y$p$e$[$t$y$p$e$]$ $=$ ${$ $c$o$u$n$t$:$ $0$,$ $s$i$z$e$:$ $0$,$ $d$u$r$a$t$i$o$n$:$ $0$ $}$;$$
$ $ $ $ $}$$
$ $ $ $ $$
$ $ $ $ $s$t$a$t$s$.$b$y$T$y$p$e$[$t$y$p$e$]$.$c$o$u$n$t$+$+$;$$
$ $ $ $ $s$t$a$t$s$.$b$y$T$y$p$e$[$t$y$p$e$]$.$s$i$z$e$ $+$=$ $s$i$z$e$;$$
$ $ $ $ $s$t$a$t$s$.$b$y$T$y$p$e$[$t$y$p$e$]$.$d$u$r$a$t$i$o$n$ $+$=$ $d$u$r$a$t$i$o$n$;$$
$ $ $}$)$;$$
$$
$ $ $r$e$t$u$r$n$ $s$t$a$t$s$;$$
$}$$
$$
$/$*$*$$
$ $*$ $L$o$g$ $p$e$r$f$o$r$m$a$n$c$e$ $s$u$m$m$a$r$y$ $t$o$ $c$o$n$s$o$l$e$$
$ $*$/$$
$e$x$p$o$r$t$ $f$u$n$c$t$i$o$n$ $l$o$g$P$e$r$f$o$r$m$a$n$c$e$S$u$m$m$a$r$y$($)$ ${$$
$ $ $c$o$n$s$o$l$e$.$g$r$o$u$p$($'$ð$Ÿ$“$Š$ $P$e$r$f$o$r$m$a$n$c$e$ $S$u$m$m$a$r$y$'$)$;$$
$ $ $$
$ $ $/$/$ $C$o$r$e$ $W$e$b$ $V$i$t$a$l$s$$
$ $ $c$o$n$s$o$l$e$.$g$r$o$u$p$($'$C$o$r$e$ $W$e$b$ $V$i$t$a$l$s$'$)$;$$
$ $ $c$o$n$s$t$ $v$i$t$a$l$s$ $=$ $g$e$t$P$e$r$f$o$r$m$a$n$c$e$M$e$t$r$i$c$s$($)$;$$
$ $ $i$f$ $($v$i$t$a$l$s$.$l$c$p$)$ $c$o$n$s$o$l$e$.$l$o$g$($`$L$C$P$:$ $$${$v$i$t$a$l$s$.$l$c$p$.$t$o$F$i$x$e$d$($2$)$}$m$s$`$)$;$$
$ $ $i$f$ $($v$i$t$a$l$s$.$f$c$p$)$ $c$o$n$s$o$l$e$.$l$o$g$($`$F$C$P$:$ $$${$v$i$t$a$l$s$.$f$c$p$.$t$o$F$i$x$e$d$($2$)$}$m$s$`$)$;$$
$ $ $i$f$ $($v$i$t$a$l$s$.$c$l$s$)$ $c$o$n$s$o$l$e$.$l$o$g$($`$C$L$S$:$ $$${$v$i$t$a$l$s$.$c$l$s$.$t$o$F$i$x$e$d$($4$)$}$`$)$;$$
$ $ $i$f$ $($v$i$t$a$l$s$.$t$t$f$b$)$ $c$o$n$s$o$l$e$.$l$o$g$($`$T$T$F$B$:$ $$${$v$i$t$a$l$s$.$t$t$f$b$.$t$o$F$i$x$e$d$($2$)$}$m$s$`$)$;$$
$ $ $i$f$ $($v$i$t$a$l$s$.$i$n$p$)$ $c$o$n$s$o$l$e$.$l$o$g$($`$I$N$P$:$ $$${$v$i$t$a$l$s$.$i$n$p$.$t$o$F$i$x$e$d$($2$)$}$m$s$`$)$;$$
$ $ $c$o$n$s$o$l$e$.$g$r$o$u$p$E$n$d$($)$;$$
$ $ $$
$ $ $/$/$ $N$a$v$i$g$a$t$i$o$n$ $t$i$m$i$n$g$$
$ $ $c$o$n$s$o$l$e$.$g$r$o$u$p$($'$N$a$v$i$g$a$t$i$o$n$ $T$i$m$i$n$g$'$)$;$$
$ $ $c$o$n$s$t$ $n$a$v$ $=$ $g$e$t$N$a$v$i$g$a$t$i$o$n$T$i$m$i$n$g$($)$;$$
$ $ $i$f$ $($n$a$v$)$ ${$$
$ $ $ $ $c$o$n$s$o$l$e$.$l$o$g$($`$D$N$S$:$ $$${$n$a$v$.$d$n$s$.$t$o$F$i$x$e$d$($2$)$}$m$s$`$)$;$$
$ $ $ $ $c$o$n$s$o$l$e$.$l$o$g$($`$T$C$P$:$ $$${$n$a$v$.$t$c$p$.$t$o$F$i$x$e$d$($2$)$}$m$s$`$)$;$$
$ $ $ $ $c$o$n$s$o$l$e$.$l$o$g$($`$R$e$q$u$e$s$t$:$ $$${$n$a$v$.$r$e$q$u$e$s$t$.$t$o$F$i$x$e$d$($2$)$}$m$s$`$)$;$$
$ $ $ $ $c$o$n$s$o$l$e$.$l$o$g$($`$R$e$s$p$o$n$s$e$:$ $$${$n$a$v$.$r$e$s$p$o$n$s$e$.$t$o$F$i$x$e$d$($2$)$}$m$s$`$)$;$$
$ $ $ $ $c$o$n$s$o$l$e$.$l$o$g$($`$D$O$M$ $P$r$o$c$e$s$s$i$n$g$:$ $$${$n$a$v$.$d$o$m$P$r$o$c$e$s$s$i$n$g$.$t$o$F$i$x$e$d$($2$)$}$m$s$`$)$;$$
$ $ $ $ $c$o$n$s$o$l$e$.$l$o$g$($`$T$o$t$a$l$ $L$o$a$d$:$ $$${$n$a$v$.$t$o$t$a$l$P$a$g$e$L$o$a$d$.$t$o$F$i$x$e$d$($2$)$}$m$s$`$)$;$$
$ $ $}$$
$ $ $c$o$n$s$o$l$e$.$g$r$o$u$p$E$n$d$($)$;$$
$ $ $$
$ $ $/$/$ $R$e$s$o$u$r$c$e$ $t$i$m$i$n$g$$
$ $ $c$o$n$s$o$l$e$.$g$r$o$u$p$($'$R$e$s$o$u$r$c$e$ $T$i$m$i$n$g$'$)$;$$
$ $ $c$o$n$s$t$ $r$e$s$o$u$r$c$e$s$ $=$ $g$e$t$R$e$s$o$u$r$c$e$T$i$m$i$n$g$($)$;$$
$ $ $c$o$n$s$o$l$e$.$l$o$g$($`$T$o$t$a$l$ $R$e$s$o$u$r$c$e$s$:$ $$${$r$e$s$o$u$r$c$e$s$.$t$o$t$a$l$}$`$)$;$$
$ $ $c$o$n$s$o$l$e$.$l$o$g$($`$T$o$t$a$l$ $S$i$z$e$:$ $$${$($r$e$s$o$u$r$c$e$s$.$t$o$t$a$l$S$i$z$e$ $/$ $1$0$2$4$)$.$t$o$F$i$x$e$d$($2$)$}$ $K$B$`$)$;$$
$ $ $c$o$n$s$o$l$e$.$l$o$g$($`$T$o$t$a$l$ $D$u$r$a$t$i$o$n$:$ $$${$r$e$s$o$u$r$c$e$s$.$t$o$t$a$l$D$u$r$a$t$i$o$n$.$t$o$F$i$x$e$d$($2$)$}$m$s$`$)$;$$
$ $ $c$o$n$s$o$l$e$.$l$o$g$($'$B$y$ $T$y$p$e$:$'$,$ $r$e$s$o$u$r$c$e$s$.$b$y$T$y$p$e$)$;$$
$ $ $c$o$n$s$o$l$e$.$g$r$o$u$p$E$n$d$($)$;$$
$ $ $$
$ $ $c$o$n$s$o$l$e$.$g$r$o$u$p$E$n$d$($)$;$$
$}$$
$$
$/$/$ $E$x$p$o$r$t$ $w$i$n$d$o$w$ $i$n$t$e$r$f$a$c$e$ $f$o$r$ $d$e$b$u$g$g$i$n$g$$
$d$e$c$l$a$r$e$ $g$l$o$b$a$l$ ${$$
$ $ $i$n$t$e$r$f$a$c$e$ $W$i$n$d$o$w$ ${$$
$ $ $ $ $p$e$r$f$o$r$m$a$n$c$e$M$o$n$i$t$o$r$:$ ${$$
$ $ $ $ $ $ $g$e$t$M$e$t$r$i$c$s$:$ $t$y$p$e$o$f$ $g$e$t$P$e$r$f$o$r$m$a$n$c$e$M$e$t$r$i$c$s$;$$
$ $ $ $ $ $ $g$e$t$S$t$o$r$e$d$:$ $t$y$p$e$o$f$ $g$e$t$S$t$o$r$e$d$M$e$t$r$i$c$s$;$$
$ $ $ $ $ $ $g$e$t$A$v$e$r$a$g$e$:$ $t$y$p$e$o$f$ $g$e$t$A$v$e$r$a$g$e$M$e$t$r$i$c$s$;$$
$ $ $ $ $ $ $c$l$e$a$r$:$ $t$y$p$e$o$f$ $c$l$e$a$r$P$e$r$f$o$r$m$a$n$c$e$M$e$t$r$i$c$s$;$$
$ $ $ $ $ $ $l$o$g$S$u$m$m$a$r$y$:$ $t$y$p$e$o$f$ $l$o$g$P$e$r$f$o$r$m$a$n$c$e$S$u$m$m$a$r$y$;$$
$ $ $ $ $ $ $g$e$t$N$a$v$i$g$a$t$i$o$n$:$ $t$y$p$e$o$f$ $g$e$t$N$a$v$i$g$a$t$i$o$n$T$i$m$i$n$g$;$$
$ $ $ $ $ $ $g$e$t$R$e$s$o$u$r$c$e$s$:$ $t$y$p$e$o$f$ $g$e$t$R$e$s$o$u$r$c$e$T$i$m$i$n$g$;$$
$ $ $ $ $}$;$$
$ $ $}$$
$}$$
$$
$/$/$ $M$a$k$e$ $a$v$a$i$l$a$b$l$e$ $i$n$ $c$o$n$s$o$l$e$ $f$o$r$ $d$e$b$u$g$g$i$n$g$$
$i$f$ $($t$y$p$e$o$f$ $w$i$n$d$o$w$ $!$=$=$ $'$u$n$d$e$f$i$n$e$d$'$)$ ${$$
$ $ $w$i$n$d$o$w$.$p$e$r$f$o$r$m$a$n$c$e$M$o$n$i$t$o$r$ $=$ ${$$
$ $ $ $ $g$e$t$M$e$t$r$i$c$s$:$ $g$e$t$P$e$r$f$o$r$m$a$n$c$e$M$e$t$r$i$c$s$,$$
$ $ $ $ $g$e$t$S$t$o$r$e$d$:$ $g$e$t$S$t$o$r$e$d$M$e$t$r$i$c$s$,$$
$ $ $ $ $g$e$t$A$v$e$r$a$g$e$:$ $g$e$t$A$v$e$r$a$g$e$M$e$t$r$i$c$s$,$$
$ $ $ $ $c$l$e$a$r$:$ $c$l$e$a$r$P$e$r$f$o$r$m$a$n$c$e$M$e$t$r$i$c$s$,$$
$ $ $ $ $l$o$g$S$u$m$m$a$r$y$:$ $l$o$g$P$e$r$f$o$r$m$a$n$c$e$S$u$m$m$a$r$y$,$$
$ $ $ $ $g$e$t$N$a$v$i$g$a$t$i$o$n$:$ $g$e$t$N$a$v$i$g$a$t$i$o$n$T$i$m$i$n$g$,$$
$ $ $ $ $g$e$t$R$e$s$o$u$r$c$e$s$:$ $g$e$t$R$e$s$o$u$r$c$e$T$i$m$i$n$g$,$$
$ $ $}$;$$
$}$$
$
