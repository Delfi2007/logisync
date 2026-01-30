$i$m$p$o$r$t$ ${$ $u$s$e$S$t$a$t$e$,$ $u$s$e$E$f$f$e$c$t$,$ $l$a$z$y$,$ $S$u$s$p$e$n$s$e$,$ $u$s$e$C$a$l$l$b$a$c$k$ $}$ $f$r$o$m$ $'$r$e$a$c$t$'$;$$
$i$m$p$o$r$t$ ${$ $$
$ $ $S$e$a$r$c$h$,$ $$
$ $ $F$i$l$t$e$r$,$ $$
$ $ $B$u$i$l$d$i$n$g$2$,$ $$
$ $ $B$a$r$C$h$a$r$t$3$,$ $$
$ $ $P$a$c$k$a$g$e$,$ $$
$ $ $P$l$u$s$,$$
$ $ $L$o$a$d$e$r$2$,$$
$ $ $C$h$e$c$k$C$i$r$c$l$e$,$$
$ $ $X$C$i$r$c$l$e$,$$
$ $ $A$l$e$r$t$C$i$r$c$l$e$$
$}$ $f$r$o$m$ $'$l$u$c$i$d$e$-$r$e$a$c$t$'$;$$
$i$m$p$o$r$t$ $M$o$d$a$l$L$o$a$d$e$r$ $f$r$o$m$ $'$@$/$c$o$m$p$o$n$e$n$t$s$/$M$o$d$a$l$L$o$a$d$e$r$'$;$$
$i$m$p$o$r$t$ ${$ $w$a$r$e$h$o$u$s$e$s$S$e$r$v$i$c$e$,$ $W$a$r$e$h$o$u$s$e$,$ $W$a$r$e$h$o$u$s$e$S$t$a$t$u$s$ $}$ $f$r$o$m$ $'$@$/$s$e$r$v$i$c$e$s$/$w$a$r$e$h$o$u$s$e$s$'$;$$
$i$m$p$o$r$t$ $W$a$r$e$h$o$u$s$e$R$o$w$ $f$r$o$m$ $'$@$/$c$o$m$p$o$n$e$n$t$s$/$w$a$r$e$h$o$u$s$e$s$/$W$a$r$e$h$o$u$s$e$R$o$w$'$;$$
$i$m$p$o$r$t$ ${$ $u$s$e$D$e$b$o$u$n$c$e$ $}$ $f$r$o$m$ $'$@$/$h$o$o$k$s$/$u$s$e$D$e$b$o$u$n$c$e$'$;$$
$$
$/$/$ $L$a$z$y$ $l$o$a$d$ $t$h$e$ $m$o$d$a$l$ $c$o$m$p$o$n$e$n$t$$
$c$o$n$s$t$ $W$a$r$e$h$o$u$s$e$M$o$d$a$l$ $=$ $l$a$z$y$($($)$ $=$>$ $i$m$p$o$r$t$($'$@$/$c$o$m$p$o$n$e$n$t$s$/$w$a$r$e$h$o$u$s$e$s$/$W$a$r$e$h$o$u$s$e$M$o$d$a$l$'$)$)$;$$
$$
$e$x$p$o$r$t$ $d$e$f$a$u$l$t$ $f$u$n$c$t$i$o$n$ $W$a$r$e$h$o$u$s$e$s$($)$ ${$$
$ $ $c$o$n$s$t$ $[$w$a$r$e$h$o$u$s$e$s$,$ $s$e$t$W$a$r$e$h$o$u$s$e$s$]$ $=$ $u$s$e$S$t$a$t$e$<$W$a$r$e$h$o$u$s$e$[$]$>$($[$]$)$;$$
$ $ $c$o$n$s$t$ $[$l$o$a$d$i$n$g$,$ $s$e$t$L$o$a$d$i$n$g$]$ $=$ $u$s$e$S$t$a$t$e$($t$r$u$e$)$;$$
$ $ $c$o$n$s$t$ $[$e$r$r$o$r$,$ $s$e$t$E$r$r$o$r$]$ $=$ $u$s$e$S$t$a$t$e$<$s$t$r$i$n$g$ $|$ $n$u$l$l$>$($n$u$l$l$)$;$$
$ $ $c$o$n$s$t$ $[$s$e$a$r$c$h$T$e$r$m$,$ $s$e$t$S$e$a$r$c$h$T$e$r$m$]$ $=$ $u$s$e$S$t$a$t$e$($'$'$)$;$$
$ $ $c$o$n$s$t$ $[$s$t$a$t$u$s$F$i$l$t$e$r$,$ $s$e$t$S$t$a$t$u$s$F$i$l$t$e$r$]$ $=$ $u$s$e$S$t$a$t$e$<$'$a$l$l$'$ $|$ $W$a$r$e$h$o$u$s$e$S$t$a$t$u$s$>$($'$a$l$l$'$)$;$$
$ $ $c$o$n$s$t$ $[$v$e$r$i$f$i$e$d$F$i$l$t$e$r$,$ $s$e$t$V$e$r$i$f$i$e$d$F$i$l$t$e$r$]$ $=$ $u$s$e$S$t$a$t$e$<$'$a$l$l$'$ $|$ $'$v$e$r$i$f$i$e$d$'$ $|$ $'$u$n$v$e$r$i$f$i$e$d$'$>$($'$a$l$l$'$)$;$$
$ $ $c$o$n$s$t$ $[$c$u$r$r$e$n$t$P$a$g$e$,$ $s$e$t$C$u$r$r$e$n$t$P$a$g$e$]$ $=$ $u$s$e$S$t$a$t$e$($1$)$;$$
$ $ $c$o$n$s$t$ $[$t$o$t$a$l$P$a$g$e$s$,$ $s$e$t$T$o$t$a$l$P$a$g$e$s$]$ $=$ $u$s$e$S$t$a$t$e$($1$)$;$$
$ $ $c$o$n$s$t$ $[$t$o$t$a$l$C$o$u$n$t$,$ $s$e$t$T$o$t$a$l$C$o$u$n$t$]$ $=$ $u$s$e$S$t$a$t$e$($0$)$;$$
$ $ $c$o$n$s$t$ $[$s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$,$ $s$e$t$S$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$]$ $=$ $u$s$e$S$t$a$t$e$<$W$a$r$e$h$o$u$s$e$ $|$ $n$u$l$l$>$($n$u$l$l$)$;$$
$ $ $c$o$n$s$t$ $[$i$s$D$e$t$a$i$l$M$o$d$a$l$O$p$e$n$,$ $s$e$t$I$s$D$e$t$a$i$l$M$o$d$a$l$O$p$e$n$]$ $=$ $u$s$e$S$t$a$t$e$($f$a$l$s$e$)$;$$
$ $ $c$o$n$s$t$ $[$i$s$M$o$d$a$l$O$p$e$n$,$ $s$e$t$I$s$M$o$d$a$l$O$p$e$n$]$ $=$ $u$s$e$S$t$a$t$e$($f$a$l$s$e$)$;$$
$ $ $c$o$n$s$t$ $[$e$d$i$t$i$n$g$W$a$r$e$h$o$u$s$e$,$ $s$e$t$E$d$i$t$i$n$g$W$a$r$e$h$o$u$s$e$]$ $=$ $u$s$e$S$t$a$t$e$<$W$a$r$e$h$o$u$s$e$ $|$ $n$u$l$l$>$($n$u$l$l$)$;$$
$ $ $c$o$n$s$t$ $[$m$o$d$a$l$M$o$d$e$,$ $s$e$t$M$o$d$a$l$M$o$d$e$]$ $=$ $u$s$e$S$t$a$t$e$<$'$c$r$e$a$t$e$'$ $|$ $'$e$d$i$t$'$>$($'$c$r$e$a$t$e$'$)$;$$
$$
$ $ $/$/$ $B$u$l$k$ $s$e$l$e$c$t$i$o$n$ $s$t$a$t$e$$
$ $ $c$o$n$s$t$ $[$s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$s$,$ $s$e$t$S$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$s$]$ $=$ $u$s$e$S$t$a$t$e$<$S$e$t$<$n$u$m$b$e$r$>$>$($n$e$w$ $S$e$t$($)$)$;$$
$ $ $c$o$n$s$t$ $[$b$u$l$k$D$e$l$e$t$i$n$g$,$ $s$e$t$B$u$l$k$D$e$l$e$t$i$n$g$]$ $=$ $u$s$e$S$t$a$t$e$($f$a$l$s$e$)$;$$
$$
$ $ $/$/$ $D$e$b$o$u$n$c$e$ $s$e$a$r$c$h$ $t$e$r$m$ $t$o$ $r$e$d$u$c$e$ $A$P$I$ $c$a$l$l$s$$
$ $ $c$o$n$s$t$ $d$e$b$o$u$n$c$e$d$S$e$a$r$c$h$T$e$r$m$ $=$ $u$s$e$D$e$b$o$u$n$c$e$($s$e$a$r$c$h$T$e$r$m$,$ $5$0$0$)$;$$
$$
$ $ $/$/$ $S$t$a$t$s$ $s$t$a$t$e$$
$ $ $c$o$n$s$t$ $[$s$t$a$t$s$,$ $s$e$t$S$t$a$t$s$]$ $=$ $u$s$e$S$t$a$t$e$(${$$
$ $ $ $ $t$o$t$a$l$:$ $0$,$$
$ $ $ $ $a$c$t$i$v$e$:$ $0$,$$
$ $ $ $ $t$o$t$a$l$C$a$p$a$c$i$t$y$:$ $0$,$$
$ $ $ $ $t$o$t$a$l$O$c$c$u$p$i$e$d$:$ $0$,$$
$ $ $ $ $a$v$e$r$a$g$e$U$t$i$l$i$z$a$t$i$o$n$:$ $0$$
$ $ $}$)$;$$
$$
$ $ $c$o$n$s$t$ $i$t$e$m$s$P$e$r$P$a$g$e$ $=$ $1$0$;$$
$$
$ $ $/$/$ $F$e$t$c$h$ $w$a$r$e$h$o$u$s$e$s$$
$ $ $c$o$n$s$t$ $f$e$t$c$h$W$a$r$e$h$o$u$s$e$s$ $=$ $u$s$e$C$a$l$l$b$a$c$k$($a$s$y$n$c$ $($)$ $=$>$ ${$$
$ $ $ $ $t$r$y$ ${$$
$ $ $ $ $ $ $s$e$t$L$o$a$d$i$n$g$($t$r$u$e$)$;$$
$ $ $ $ $ $ $s$e$t$E$r$r$o$r$($n$u$l$l$)$;$$
$$
$ $ $ $ $ $ $c$o$n$s$t$ $f$i$l$t$e$r$s$:$ $a$n$y$ $=$ ${$$
$ $ $ $ $ $ $ $ $p$a$g$e$:$ $c$u$r$r$e$n$t$P$a$g$e$,$$
$ $ $ $ $ $ $ $ $l$i$m$i$t$:$ $i$t$e$m$s$P$e$r$P$a$g$e$,$$
$ $ $ $ $ $ $ $ $s$e$a$r$c$h$:$ $d$e$b$o$u$n$c$e$d$S$e$a$r$c$h$T$e$r$m$ $|$|$ $u$n$d$e$f$i$n$e$d$,$$
$ $ $ $ $ $ $}$;$$
$$
$ $ $ $ $ $ $i$f$ $($s$t$a$t$u$s$F$i$l$t$e$r$ $!$=$=$ $'$a$l$l$'$)$ ${$$
$ $ $ $ $ $ $ $ $f$i$l$t$e$r$s$.$s$t$a$t$u$s$ $=$ $s$t$a$t$u$s$F$i$l$t$e$r$;$$
$ $ $ $ $ $ $}$$
$$
$ $ $ $ $ $ $i$f$ $($v$e$r$i$f$i$e$d$F$i$l$t$e$r$ $=$=$=$ $'$v$e$r$i$f$i$e$d$'$)$ ${$$
$ $ $ $ $ $ $ $ $f$i$l$t$e$r$s$.$i$s$_$v$e$r$i$f$i$e$d$ $=$ $t$r$u$e$;$$
$ $ $ $ $ $ $}$ $e$l$s$e$ $i$f$ $($v$e$r$i$f$i$e$d$F$i$l$t$e$r$ $=$=$=$ $'$u$n$v$e$r$i$f$i$e$d$'$)$ ${$$
$ $ $ $ $ $ $ $ $f$i$l$t$e$r$s$.$i$s$_$v$e$r$i$f$i$e$d$ $=$ $f$a$l$s$e$;$$
$ $ $ $ $ $ $}$$
$$
$ $ $ $ $ $ $c$o$n$s$t$ $d$a$t$a$ $=$ $a$w$a$i$t$ $w$a$r$e$h$o$u$s$e$s$S$e$r$v$i$c$e$.$g$e$t$A$l$l$($f$i$l$t$e$r$s$)$;$$
$ $ $ $ $ $ $$
$ $ $ $ $ $ $/$/$ $N$o$r$m$a$l$i$z$e$ $w$a$r$e$h$o$u$s$e$ $d$a$t$a$ $-$ $b$a$c$k$e$n$d$ $r$e$t$u$r$n$s$ $'$a$v$a$i$l$a$b$l$e$_$s$p$a$c$e$'$,$ $f$r$o$n$t$e$n$d$ $u$s$e$s$ $'$a$v$a$i$l$a$b$l$e$'$$
$ $ $ $ $ $ $c$o$n$s$t$ $n$o$r$m$a$l$i$z$e$d$W$a$r$e$h$o$u$s$e$s$ $=$ $d$a$t$a$.$w$a$r$e$h$o$u$s$e$s$.$m$a$p$($w$ $=$>$ $(${$$
$ $ $ $ $ $ $ $ $.$.$.$w$,$$
$ $ $ $ $ $ $ $ $a$v$a$i$l$a$b$l$e$:$ $w$.$a$v$a$i$l$a$b$l$e$_$s$p$a$c$e$ $?$?$ $w$.$a$v$a$i$l$a$b$l$e$ $?$?$ $($w$.$c$a$p$a$c$i$t$y$ $-$ $w$.$o$c$c$u$p$i$e$d$)$$
$ $ $ $ $ $ $}$)$)$;$$
$ $ $ $ $ $ $$
$ $ $ $ $ $ $s$e$t$W$a$r$e$h$o$u$s$e$s$($n$o$r$m$a$l$i$z$e$d$W$a$r$e$h$o$u$s$e$s$)$;$$
$ $ $ $ $ $ $s$e$t$T$o$t$a$l$P$a$g$e$s$($d$a$t$a$.$p$a$g$i$n$a$t$i$o$n$.$t$o$t$a$l$P$a$g$e$s$)$;$$
$ $ $ $ $ $ $s$e$t$T$o$t$a$l$C$o$u$n$t$($d$a$t$a$.$p$a$g$i$n$a$t$i$o$n$.$t$o$t$a$l$)$;$$
$$
$ $ $ $ $ $ $/$/$ $C$a$l$c$u$l$a$t$e$ $s$t$a$t$s$ $f$r$o$m$ $f$e$t$c$h$e$d$ $d$a$t$a$$
$ $ $ $ $ $ $c$o$n$s$t$ $t$o$t$a$l$C$a$p$a$c$i$t$y$ $=$ $d$a$t$a$.$w$a$r$e$h$o$u$s$e$s$.$r$e$d$u$c$e$($($s$u$m$,$ $w$)$ $=$>$ $s$u$m$ $+$ $w$.$c$a$p$a$c$i$t$y$,$ $0$)$;$$
$ $ $ $ $ $ $c$o$n$s$t$ $t$o$t$a$l$O$c$c$u$p$i$e$d$ $=$ $d$a$t$a$.$w$a$r$e$h$o$u$s$e$s$.$r$e$d$u$c$e$($($s$u$m$,$ $w$)$ $=$>$ $s$u$m$ $+$ $w$.$o$c$c$u$p$i$e$d$,$ $0$)$;$$
$ $ $ $ $ $ $c$o$n$s$t$ $a$c$t$i$v$e$C$o$u$n$t$ $=$ $d$a$t$a$.$w$a$r$e$h$o$u$s$e$s$.$f$i$l$t$e$r$($w$ $=$>$ $w$.$s$t$a$t$u$s$ $=$=$=$ $'$a$c$t$i$v$e$'$)$.$l$e$n$g$t$h$;$$
$$
$ $ $ $ $ $ $s$e$t$S$t$a$t$s$(${$$
$ $ $ $ $ $ $ $ $t$o$t$a$l$:$ $d$a$t$a$.$p$a$g$i$n$a$t$i$o$n$.$t$o$t$a$l$ $|$|$ $0$,$$
$ $ $ $ $ $ $ $ $a$c$t$i$v$e$:$ $a$c$t$i$v$e$C$o$u$n$t$,$$
$ $ $ $ $ $ $ $ $t$o$t$a$l$C$a$p$a$c$i$t$y$,$$
$ $ $ $ $ $ $ $ $t$o$t$a$l$O$c$c$u$p$i$e$d$,$$
$ $ $ $ $ $ $ $ $a$v$e$r$a$g$e$U$t$i$l$i$z$a$t$i$o$n$:$ $t$o$t$a$l$C$a$p$a$c$i$t$y$ $>$ $0$ $?$ $($t$o$t$a$l$O$c$c$u$p$i$e$d$ $/$ $t$o$t$a$l$C$a$p$a$c$i$t$y$)$ $*$ $1$0$0$ $:$ $0$$
$ $ $ $ $ $ $}$)$;$$
$ $ $ $ $}$ $c$a$t$c$h$ $($e$r$r$:$ $a$n$y$)$ ${$$
$ $ $ $ $ $ $c$o$n$s$o$l$e$.$e$r$r$o$r$($'$E$r$r$o$r$ $f$e$t$c$h$i$n$g$ $w$a$r$e$h$o$u$s$e$s$:$'$,$ $e$r$r$)$;$$
$ $ $ $ $ $ $s$e$t$E$r$r$o$r$($e$r$r$.$m$e$s$s$a$g$e$ $|$|$ $'$F$a$i$l$e$d$ $t$o$ $f$e$t$c$h$ $w$a$r$e$h$o$u$s$e$s$'$)$;$$
$ $ $ $ $}$ $f$i$n$a$l$l$y$ ${$$
$ $ $ $ $ $ $s$e$t$L$o$a$d$i$n$g$($f$a$l$s$e$)$;$$
$ $ $ $ $}$$
$ $ $}$,$ $[$c$u$r$r$e$n$t$P$a$g$e$,$ $i$t$e$m$s$P$e$r$P$a$g$e$,$ $d$e$b$o$u$n$c$e$d$S$e$a$r$c$h$T$e$r$m$,$ $s$t$a$t$u$s$F$i$l$t$e$r$,$ $v$e$r$i$f$i$e$d$F$i$l$t$e$r$]$)$;$$
$$
$ $ $u$s$e$E$f$f$e$c$t$($($)$ $=$>$ ${$$
$ $ $ $ $f$e$t$c$h$W$a$r$e$h$o$u$s$e$s$($)$;$$
$ $ $}$,$ $[$f$e$t$c$h$W$a$r$e$h$o$u$s$e$s$]$)$;$$
$$
$ $ $c$o$n$s$t$ $h$a$n$d$l$e$V$i$e$w$D$e$t$a$i$l$s$ $=$ $u$s$e$C$a$l$l$b$a$c$k$($a$s$y$n$c$ $($w$a$r$e$h$o$u$s$e$:$ $W$a$r$e$h$o$u$s$e$)$ $=$>$ ${$$
$ $ $ $ $t$r$y$ ${$$
$ $ $ $ $ $ $/$/$ $F$e$t$c$h$ $f$u$l$l$ $w$a$r$e$h$o$u$s$e$ $d$e$t$a$i$l$s$ $i$n$c$l$u$d$i$n$g$ $a$m$e$n$i$t$i$e$s$$
$ $ $ $ $ $ $c$o$n$s$t$ $f$u$l$l$W$a$r$e$h$o$u$s$e$ $=$ $a$w$a$i$t$ $w$a$r$e$h$o$u$s$e$s$S$e$r$v$i$c$e$.$g$e$t$B$y$I$d$($w$a$r$e$h$o$u$s$e$.$i$d$)$;$$
$ $ $ $ $ $ $s$e$t$S$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$($f$u$l$l$W$a$r$e$h$o$u$s$e$)$;$$
$ $ $ $ $ $ $s$e$t$I$s$D$e$t$a$i$l$M$o$d$a$l$O$p$e$n$($t$r$u$e$)$;$$
$ $ $ $ $}$ $c$a$t$c$h$ $($e$r$r$:$ $a$n$y$)$ ${$$
$ $ $ $ $ $ $c$o$n$s$o$l$e$.$e$r$r$o$r$($'$E$r$r$o$r$ $f$e$t$c$h$i$n$g$ $w$a$r$e$h$o$u$s$e$ $d$e$t$a$i$l$s$:$'$,$ $e$r$r$)$;$$
$ $ $ $ $ $ $a$l$e$r$t$($'$F$a$i$l$e$d$ $t$o$ $l$o$a$d$ $w$a$r$e$h$o$u$s$e$ $d$e$t$a$i$l$s$'$)$;$$
$ $ $ $ $}$$
$ $ $}$,$ $[$]$)$;$$
$$
$ $ $c$o$n$s$t$ $h$a$n$d$l$e$A$d$d$W$a$r$e$h$o$u$s$e$ $=$ $u$s$e$C$a$l$l$b$a$c$k$($($)$ $=$>$ ${$$
$ $ $ $ $s$e$t$M$o$d$a$l$M$o$d$e$($'$c$r$e$a$t$e$'$)$;$$
$ $ $ $ $s$e$t$E$d$i$t$i$n$g$W$a$r$e$h$o$u$s$e$($n$u$l$l$)$;$$
$ $ $ $ $s$e$t$I$s$M$o$d$a$l$O$p$e$n$($t$r$u$e$)$;$$
$ $ $}$,$ $[$]$)$;$$
$$
$ $ $c$o$n$s$t$ $h$a$n$d$l$e$E$d$i$t$W$a$r$e$h$o$u$s$e$ $=$ $u$s$e$C$a$l$l$b$a$c$k$($($w$a$r$e$h$o$u$s$e$:$ $W$a$r$e$h$o$u$s$e$)$ $=$>$ ${$$
$ $ $ $ $s$e$t$M$o$d$a$l$M$o$d$e$($'$e$d$i$t$'$)$;$$
$ $ $ $ $s$e$t$E$d$i$t$i$n$g$W$a$r$e$h$o$u$s$e$($w$a$r$e$h$o$u$s$e$)$;$$
$ $ $ $ $s$e$t$I$s$M$o$d$a$l$O$p$e$n$($t$r$u$e$)$;$$
$ $ $}$,$ $[$]$)$;$$
$$
$ $ $c$o$n$s$t$ $h$a$n$d$l$e$C$l$o$s$e$M$o$d$a$l$ $=$ $u$s$e$C$a$l$l$b$a$c$k$($($)$ $=$>$ ${$$
$ $ $ $ $s$e$t$I$s$M$o$d$a$l$O$p$e$n$($f$a$l$s$e$)$;$$
$ $ $ $ $s$e$t$E$d$i$t$i$n$g$W$a$r$e$h$o$u$s$e$($n$u$l$l$)$;$$
$ $ $}$,$ $[$]$)$;$$
$$
$ $ $c$o$n$s$t$ $h$a$n$d$l$e$S$a$v$e$S$u$c$c$e$s$s$ $=$ $u$s$e$C$a$l$l$b$a$c$k$($($)$ $=$>$ ${$$
$ $ $ $ $f$e$t$c$h$W$a$r$e$h$o$u$s$e$s$($)$;$ $/$/$ $R$e$f$r$e$s$h$ $t$h$e$ $l$i$s$t$$
$ $ $}$,$ $[$f$e$t$c$h$W$a$r$e$h$o$u$s$e$s$]$)$;$$
$$
$ $ $c$o$n$s$t$ $h$a$n$d$l$e$D$e$l$e$t$e$W$a$r$e$h$o$u$s$e$ $=$ $u$s$e$C$a$l$l$b$a$c$k$($a$s$y$n$c$ $($w$a$r$e$h$o$u$s$e$I$d$:$ $n$u$m$b$e$r$,$ $w$a$r$e$h$o$u$s$e$N$a$m$e$:$ $s$t$r$i$n$g$)$ $=$>$ ${$$
$ $ $ $ $i$f$ $($w$i$n$d$o$w$.$c$o$n$f$i$r$m$($`$A$r$e$ $y$o$u$ $s$u$r$e$ $y$o$u$ $w$a$n$t$ $t$o$ $d$e$l$e$t$e$ $"$$${$w$a$r$e$h$o$u$s$e$N$a$m$e$}$"$?$ $T$h$i$s$ $a$c$t$i$o$n$ $c$a$n$n$o$t$ $b$e$ $u$n$d$o$n$e$.$`$)$)$ ${$$
$ $ $ $ $ $ $t$r$y$ ${$$
$ $ $ $ $ $ $ $ $a$w$a$i$t$ $w$a$r$e$h$o$u$s$e$s$S$e$r$v$i$c$e$.$d$e$l$e$t$e$($w$a$r$e$h$o$u$s$e$I$d$)$;$$
$ $ $ $ $ $ $ $ $a$w$a$i$t$ $f$e$t$c$h$W$a$r$e$h$o$u$s$e$s$($)$;$ $/$/$ $R$e$f$r$e$s$h$ $l$i$s$t$$
$ $ $ $ $ $ $ $ $a$l$e$r$t$($'$W$a$r$e$h$o$u$s$e$ $d$e$l$e$t$e$d$ $s$u$c$c$e$s$s$f$u$l$l$y$'$)$;$$
$ $ $ $ $ $ $}$ $c$a$t$c$h$ $($e$r$r$:$ $a$n$y$)$ ${$$
$ $ $ $ $ $ $ $ $c$o$n$s$o$l$e$.$e$r$r$o$r$($'$E$r$r$o$r$ $d$e$l$e$t$i$n$g$ $w$a$r$e$h$o$u$s$e$:$'$,$ $e$r$r$)$;$$
$ $ $ $ $ $ $ $ $a$l$e$r$t$($e$r$r$.$m$e$s$s$a$g$e$ $|$|$ $'$F$a$i$l$e$d$ $t$o$ $d$e$l$e$t$e$ $w$a$r$e$h$o$u$s$e$'$)$;$$
$ $ $ $ $ $ $}$$
$ $ $ $ $}$$
$ $ $}$,$ $[$f$e$t$c$h$W$a$r$e$h$o$u$s$e$s$]$)$;$$
$$
$ $ $/$/$ $B$u$l$k$ $s$e$l$e$c$t$i$o$n$ $h$a$n$d$l$e$r$s$ $w$r$a$p$p$e$d$ $i$n$ $u$s$e$C$a$l$l$b$a$c$k$$
$ $ $c$o$n$s$t$ $h$a$n$d$l$e$S$e$l$e$c$t$A$l$l$ $=$ $u$s$e$C$a$l$l$b$a$c$k$($($e$:$ $R$e$a$c$t$.$C$h$a$n$g$e$E$v$e$n$t$<$H$T$M$L$I$n$p$u$t$E$l$e$m$e$n$t$>$)$ $=$>$ ${$$
$ $ $ $ $i$f$ $($e$.$t$a$r$g$e$t$.$c$h$e$c$k$e$d$)$ ${$$
$ $ $ $ $ $ $c$o$n$s$t$ $a$l$l$I$d$s$ $=$ $n$e$w$ $S$e$t$($w$a$r$e$h$o$u$s$e$s$.$m$a$p$($w$ $=$>$ $w$.$i$d$)$)$;$$
$ $ $ $ $ $ $s$e$t$S$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$s$($a$l$l$I$d$s$)$;$$
$ $ $ $ $}$ $e$l$s$e$ ${$$
$ $ $ $ $ $ $s$e$t$S$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$s$($n$e$w$ $S$e$t$($)$)$;$$
$ $ $ $ $}$$
$ $ $}$,$ $[$w$a$r$e$h$o$u$s$e$s$]$)$;$$
$$
$ $ $c$o$n$s$t$ $h$a$n$d$l$e$S$e$l$e$c$t$W$a$r$e$h$o$u$s$e$ $=$ $u$s$e$C$a$l$l$b$a$c$k$($($w$a$r$e$h$o$u$s$e$I$d$:$ $n$u$m$b$e$r$)$ $=$>$ ${$$
$ $ $ $ $s$e$t$S$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$s$($p$r$e$v$ $=$>$ ${$$
$ $ $ $ $ $ $c$o$n$s$t$ $n$e$w$S$e$l$e$c$t$e$d$ $=$ $n$e$w$ $S$e$t$($p$r$e$v$)$;$$
$ $ $ $ $ $ $i$f$ $($n$e$w$S$e$l$e$c$t$e$d$.$h$a$s$($w$a$r$e$h$o$u$s$e$I$d$)$)$ ${$$
$ $ $ $ $ $ $ $ $n$e$w$S$e$l$e$c$t$e$d$.$d$e$l$e$t$e$($w$a$r$e$h$o$u$s$e$I$d$)$;$$
$ $ $ $ $ $ $}$ $e$l$s$e$ ${$$
$ $ $ $ $ $ $ $ $n$e$w$S$e$l$e$c$t$e$d$.$a$d$d$($w$a$r$e$h$o$u$s$e$I$d$)$;$$
$ $ $ $ $ $ $}$$
$ $ $ $ $ $ $r$e$t$u$r$n$ $n$e$w$S$e$l$e$c$t$e$d$;$$
$ $ $ $ $}$)$;$$
$ $ $}$,$ $[$]$)$;$$
$$
$ $ $c$o$n$s$t$ $h$a$n$d$l$e$B$u$l$k$D$e$l$e$t$e$ $=$ $a$s$y$n$c$ $($)$ $=$>$ ${$$
$ $ $ $ $i$f$ $($s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$s$.$s$i$z$e$ $=$=$=$ $0$)$ $r$e$t$u$r$n$;$$
$ $ $ $ $$
$ $ $ $ $c$o$n$s$t$ $c$o$u$n$t$ $=$ $s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$s$.$s$i$z$e$;$$
$ $ $ $ $i$f$ $($!$c$o$n$f$i$r$m$($`$A$r$e$ $y$o$u$ $s$u$r$e$ $y$o$u$ $w$a$n$t$ $t$o$ $d$e$l$e$t$e$ $$${$c$o$u$n$t$}$ $w$a$r$e$h$o$u$s$e$$${$c$o$u$n$t$ $>$ $1$ $?$ $'$s$'$ $:$ $'$'$}$?$ $T$h$i$s$ $a$c$t$i$o$n$ $c$a$n$n$o$t$ $b$e$ $u$n$d$o$n$e$.$`$)$)$ ${$$
$ $ $ $ $ $ $r$e$t$u$r$n$;$$
$ $ $ $ $}$$
$$
$ $ $ $ $s$e$t$B$u$l$k$D$e$l$e$t$i$n$g$($t$r$u$e$)$;$$
$ $ $ $ $l$e$t$ $s$u$c$c$e$s$s$C$o$u$n$t$ $=$ $0$;$$
$ $ $ $ $l$e$t$ $e$r$r$o$r$C$o$u$n$t$ $=$ $0$;$$
$$
$ $ $ $ $t$r$y$ ${$$
$ $ $ $ $ $ $f$o$r$ $($c$o$n$s$t$ $w$a$r$e$h$o$u$s$e$I$d$ $o$f$ $A$r$r$a$y$.$f$r$o$m$($s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$s$)$)$ ${$$
$ $ $ $ $ $ $ $ $t$r$y$ ${$$
$ $ $ $ $ $ $ $ $ $ $a$w$a$i$t$ $w$a$r$e$h$o$u$s$e$s$S$e$r$v$i$c$e$.$d$e$l$e$t$e$($w$a$r$e$h$o$u$s$e$I$d$)$;$$
$ $ $ $ $ $ $ $ $ $ $s$u$c$c$e$s$s$C$o$u$n$t$+$+$;$$
$ $ $ $ $ $ $ $ $}$ $c$a$t$c$h$ $($e$r$r$)$ ${$$
$ $ $ $ $ $ $ $ $ $ $c$o$n$s$o$l$e$.$e$r$r$o$r$($`$F$a$i$l$e$d$ $t$o$ $d$e$l$e$t$e$ $w$a$r$e$h$o$u$s$e$ $$${$w$a$r$e$h$o$u$s$e$I$d$}$:$`$,$ $e$r$r$)$;$$
$ $ $ $ $ $ $ $ $ $ $e$r$r$o$r$C$o$u$n$t$+$+$;$$
$ $ $ $ $ $ $ $ $}$$
$ $ $ $ $ $ $}$$
$$
$ $ $ $ $ $ $i$f$ $($e$r$r$o$r$C$o$u$n$t$ $=$=$=$ $0$)$ ${$$
$ $ $ $ $ $ $ $ $a$l$e$r$t$($`$S$u$c$c$e$s$s$f$u$l$l$y$ $d$e$l$e$t$e$d$ $$${$s$u$c$c$e$s$s$C$o$u$n$t$}$ $w$a$r$e$h$o$u$s$e$$${$s$u$c$c$e$s$s$C$o$u$n$t$ $>$ $1$ $?$ $'$s$'$ $:$ $'$'$}$`$)$;$$
$ $ $ $ $ $ $}$ $e$l$s$e$ ${$$
$ $ $ $ $ $ $ $ $a$l$e$r$t$($`$D$e$l$e$t$e$d$ $$${$s$u$c$c$e$s$s$C$o$u$n$t$}$ $w$a$r$e$h$o$u$s$e$$${$s$u$c$c$e$s$s$C$o$u$n$t$ $>$ $1$ $?$ $'$s$'$ $:$ $'$'$}$.$ $F$a$i$l$e$d$ $t$o$ $d$e$l$e$t$e$ $$${$e$r$r$o$r$C$o$u$n$t$}$.$`$)$;$$
$ $ $ $ $ $ $}$$
$$
$ $ $ $ $ $ $s$e$t$S$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$s$($n$e$w$ $S$e$t$($)$)$;$$
$ $ $ $ $ $ $f$e$t$c$h$W$a$r$e$h$o$u$s$e$s$($)$;$$
$ $ $ $ $}$ $f$i$n$a$l$l$y$ ${$$
$ $ $ $ $ $ $s$e$t$B$u$l$k$D$e$l$e$t$i$n$g$($f$a$l$s$e$)$;$$
$ $ $ $ $}$$
$ $ $}$;$$
$$
$ $ $c$o$n$s$t$ $h$a$n$d$l$e$E$x$p$o$r$t$C$S$V$ $=$ $($)$ $=$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $d$a$t$a$T$o$E$x$p$o$r$t$ $=$ $s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$s$.$s$i$z$e$ $>$ $0$$
$ $ $ $ $ $ $?$ $w$a$r$e$h$o$u$s$e$s$.$f$i$l$t$e$r$($w$ $=$>$ $s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$s$.$h$a$s$($w$.$i$d$)$)$$
$ $ $ $ $ $ $:$ $w$a$r$e$h$o$u$s$e$s$;$$
$$
$ $ $ $ $c$o$n$s$t$ $h$e$a$d$e$r$s$ $=$ $[$'$N$a$m$e$'$,$ $'$C$o$d$e$'$,$ $'$L$o$c$a$t$i$o$n$'$,$ $'$C$a$p$a$c$i$t$y$'$,$ $'$O$c$c$u$p$i$e$d$'$,$ $'$U$t$i$l$i$z$a$t$i$o$n$ $%$'$,$ $'$S$t$a$t$u$s$'$,$ $'$V$e$r$i$f$i$e$d$'$]$;$$
$ $ $ $ $c$o$n$s$t$ $r$o$w$s$ $=$ $d$a$t$a$T$o$E$x$p$o$r$t$.$m$a$p$($w$ $=$>$ $[$$
$ $ $ $ $ $ $w$.$n$a$m$e$,$$
$ $ $ $ $ $ $w$.$c$o$d$e$,$$
$ $ $ $ $ $ $`$$${$w$.$c$i$t$y$}$,$ $$${$w$.$s$t$a$t$e$}$`$,$$
$ $ $ $ $ $ $w$.$c$a$p$a$c$i$t$y$,$$
$ $ $ $ $ $ $w$.$o$c$c$u$p$i$e$d$ $|$|$ $0$,$$
$ $ $ $ $ $ $w$.$c$a$p$a$c$i$t$y$ $?$ $M$a$t$h$.$r$o$u$n$d$($($w$.$o$c$c$u$p$i$e$d$ $|$|$ $0$)$ $/$ $w$.$c$a$p$a$c$i$t$y$ $*$ $1$0$0$)$ $:$ $0$,$$
$ $ $ $ $ $ $w$.$s$t$a$t$u$s$,$$
$ $ $ $ $ $ $w$.$i$s$_$v$e$r$i$f$i$e$d$ $?$ $'$Y$e$s$'$ $:$ $'$N$o$'$$
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
$ $ $ $ $l$i$n$k$.$s$e$t$A$t$t$r$i$b$u$t$e$($'$d$o$w$n$l$o$a$d$'$,$ $`$w$a$r$e$h$o$u$s$e$s$_$e$x$p$o$r$t$_$$${$n$e$w$ $D$a$t$e$($)$.$t$o$I$S$O$S$t$r$i$n$g$($)$.$s$p$l$i$t$($'$T$'$)$[$0$]$}$.$c$s$v$`$)$;$$
$ $ $ $ $l$i$n$k$.$s$t$y$l$e$.$v$i$s$i$b$i$l$i$t$y$ $=$ $'$h$i$d$d$e$n$'$;$$
$ $ $ $ $d$o$c$u$m$e$n$t$.$b$o$d$y$.$a$p$p$e$n$d$C$h$i$l$d$($l$i$n$k$)$;$$
$ $ $ $ $l$i$n$k$.$c$l$i$c$k$($)$;$$
$ $ $ $ $d$o$c$u$m$e$n$t$.$b$o$d$y$.$r$e$m$o$v$e$C$h$i$l$d$($l$i$n$k$)$;$$
$ $ $}$;$$
$$
$ $ $c$o$n$s$t$ $h$a$n$d$l$e$U$p$d$a$t$e$S$t$a$t$u$s$ $=$ $u$s$e$C$a$l$l$b$a$c$k$($a$s$y$n$c$ $($w$a$r$e$h$o$u$s$e$I$d$:$ $n$u$m$b$e$r$,$ $n$e$w$S$t$a$t$u$s$:$ $W$a$r$e$h$o$u$s$e$S$t$a$t$u$s$)$ $=$>$ ${$$
$ $ $ $ $t$r$y$ ${$$
$ $ $ $ $ $ $a$w$a$i$t$ $w$a$r$e$h$o$u$s$e$s$S$e$r$v$i$c$e$.$u$p$d$a$t$e$($w$a$r$e$h$o$u$s$e$I$d$,$ ${$ $s$t$a$t$u$s$:$ $n$e$w$S$t$a$t$u$s$ $}$)$;$$
$ $ $ $ $ $ $a$w$a$i$t$ $f$e$t$c$h$W$a$r$e$h$o$u$s$e$s$($)$;$ $/$/$ $R$e$f$r$e$s$h$ $l$i$s$t$$
$ $ $ $ $}$ $c$a$t$c$h$ $($e$r$r$:$ $a$n$y$)$ ${$$
$ $ $ $ $ $ $c$o$n$s$o$l$e$.$e$r$r$o$r$($'$E$r$r$o$r$ $u$p$d$a$t$i$n$g$ $w$a$r$e$h$o$u$s$e$ $s$t$a$t$u$s$:$'$,$ $e$r$r$)$;$$
$ $ $ $ $ $ $a$l$e$r$t$($e$r$r$.$m$e$s$s$a$g$e$ $|$|$ $'$F$a$i$l$e$d$ $t$o$ $u$p$d$a$t$e$ $w$a$r$e$h$o$u$s$e$ $s$t$a$t$u$s$'$)$;$$
$ $ $ $ $}$$
$ $ $}$,$ $[$f$e$t$c$h$W$a$r$e$h$o$u$s$e$s$]$)$;$$
$$
$ $ $c$o$n$s$t$ $f$o$r$m$a$t$A$r$e$a$ $=$ $($c$a$p$a$c$i$t$y$:$ $n$u$m$b$e$r$)$ $=$>$ ${$$
$ $ $ $ $i$f$ $($c$a$p$a$c$i$t$y$ $>$=$ $1$0$0$0$0$0$)$ ${$$
$ $ $ $ $ $ $r$e$t$u$r$n$ $`$$${$($c$a$p$a$c$i$t$y$ $/$ $1$0$0$0$0$0$)$.$t$o$F$i$x$e$d$($1$)$}$L$ $u$n$i$t$s$`$;$$
$ $ $ $ $}$ $e$l$s$e$ $i$f$ $($c$a$p$a$c$i$t$y$ $>$=$ $1$0$0$0$)$ ${$$
$ $ $ $ $ $ $r$e$t$u$r$n$ $`$$${$($c$a$p$a$c$i$t$y$ $/$ $1$0$0$0$)$.$t$o$F$i$x$e$d$($1$)$}$K$ $u$n$i$t$s$`$;$$
$ $ $ $ $}$$
$ $ $ $ $r$e$t$u$r$n$ $`$$${$c$a$p$a$c$i$t$y$}$ $u$n$i$t$s$`$;$$
$ $ $}$;$$
$$
$ $ $c$o$n$s$t$ $g$e$t$S$t$a$t$u$s$B$a$d$g$e$ $=$ $($s$t$a$t$u$s$:$ $W$a$r$e$h$o$u$s$e$S$t$a$t$u$s$)$ $=$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $s$t$a$t$u$s$C$o$n$f$i$g$ $=$ ${$$
$ $ $ $ $ $ $a$c$t$i$v$e$:$ ${$$
$ $ $ $ $ $ $ $ $b$g$:$ $'$b$g$-$g$r$e$e$n$-$5$0$'$,$$
$ $ $ $ $ $ $ $ $t$e$x$t$:$ $'$t$e$x$t$-$g$r$e$e$n$-$7$0$0$'$,$$
$ $ $ $ $ $ $ $ $b$o$r$d$e$r$:$ $'$b$o$r$d$e$r$-$g$r$e$e$n$-$2$0$0$'$,$$
$ $ $ $ $ $ $ $ $i$c$o$n$:$ $C$h$e$c$k$C$i$r$c$l$e$,$$
$ $ $ $ $ $ $ $ $l$a$b$e$l$:$ $'$A$c$t$i$v$e$'$$
$ $ $ $ $ $ $}$,$$
$ $ $ $ $ $ $i$n$a$c$t$i$v$e$:$ ${$$
$ $ $ $ $ $ $ $ $b$g$:$ $'$b$g$-$g$r$a$y$-$5$0$'$,$$
$ $ $ $ $ $ $ $ $t$e$x$t$:$ $'$t$e$x$t$-$g$r$a$y$-$7$0$0$'$,$$
$ $ $ $ $ $ $ $ $b$o$r$d$e$r$:$ $'$b$o$r$d$e$r$-$g$r$a$y$-$2$0$0$'$,$$
$ $ $ $ $ $ $ $ $i$c$o$n$:$ $X$C$i$r$c$l$e$,$$
$ $ $ $ $ $ $ $ $l$a$b$e$l$:$ $'$I$n$a$c$t$i$v$e$'$$
$ $ $ $ $ $ $}$,$$
$ $ $ $ $ $ $m$a$i$n$t$e$n$a$n$c$e$:$ ${$$
$ $ $ $ $ $ $ $ $b$g$:$ $'$b$g$-$y$e$l$l$o$w$-$5$0$'$,$$
$ $ $ $ $ $ $ $ $t$e$x$t$:$ $'$t$e$x$t$-$y$e$l$l$o$w$-$7$0$0$'$,$$
$ $ $ $ $ $ $ $ $b$o$r$d$e$r$:$ $'$b$o$r$d$e$r$-$y$e$l$l$o$w$-$2$0$0$'$,$$
$ $ $ $ $ $ $ $ $i$c$o$n$:$ $A$l$e$r$t$C$i$r$c$l$e$,$$
$ $ $ $ $ $ $ $ $l$a$b$e$l$:$ $'$M$a$i$n$t$e$n$a$n$c$e$'$$
$ $ $ $ $ $ $}$$
$ $ $ $ $}$;$$
$$
$ $ $ $ $c$o$n$s$t$ $c$o$n$f$i$g$ $=$ $s$t$a$t$u$s$C$o$n$f$i$g$[$s$t$a$t$u$s$]$;$$
$ $ $ $ $c$o$n$s$t$ $I$c$o$n$ $=$ $c$o$n$f$i$g$.$i$c$o$n$;$$
$$
$ $ $ $ $r$e$t$u$r$n$ $($$
$ $ $ $ $ $ $<$s$p$a$n$ $c$l$a$s$s$N$a$m$e$=${$`$i$n$l$i$n$e$-$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $g$a$p$-$1$ $p$x$-$2$.$5$ $p$y$-$1$ $r$o$u$n$d$e$d$-$f$u$l$l$ $t$e$x$t$-$x$s$ $f$o$n$t$-$m$e$d$i$u$m$ $$${$c$o$n$f$i$g$.$b$g$}$ $$${$c$o$n$f$i$g$.$t$e$x$t$}$ $b$o$r$d$e$r$ $$${$c$o$n$f$i$g$.$b$o$r$d$e$r$}$`$}$>$$
$ $ $ $ $ $ $ $ $<$I$c$o$n$ $c$l$a$s$s$N$a$m$e$=$"$w$-$3$ $h$-$3$"$ $/$>$$
$ $ $ $ $ $ $ $ ${$c$o$n$f$i$g$.$l$a$b$e$l$}$$
$ $ $ $ $ $ $<$/$s$p$a$n$>$$
$ $ $ $ $)$;$$
$ $ $}$;$$
$$
$ $ $r$e$t$u$r$n$ $($$
$ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$s$p$a$c$e$-$y$-$6$"$>$$
$ $ $ $ $ $ ${$/$*$ $H$e$a$d$e$r$ $*$/$}$$
$ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$b$e$t$w$e$e$n$"$>$$
$ $ $ $ $ $ $ $ $<$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $<$h$1$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$2$x$l$ $f$o$n$t$-$b$o$l$d$ $t$e$x$t$-$g$r$a$y$-$9$0$0$"$>$W$a$r$e$h$o$u$s$e$s$<$/$h$1$>$$
$ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$g$r$a$y$-$5$0$0$ $m$t$-$1$"$>$M$a$n$a$g$e$ $y$o$u$r$ $w$a$r$e$h$o$u$s$e$ $l$o$c$a$t$i$o$n$s$ $a$n$d$ $c$a$p$a$c$i$t$y$<$/$p$>$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $<$b$u$t$t$o$n$$
$ $ $ $ $ $ $ $ $ $ $o$n$C$l$i$c$k$=${$h$a$n$d$l$e$A$d$d$W$a$r$e$h$o$u$s$e$}$$
$ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $g$a$p$-$2$ $p$x$-$4$ $p$y$-$2$ $b$g$-$b$l$a$c$k$ $t$e$x$t$-$w$h$i$t$e$ $r$o$u$n$d$e$d$-$l$g$ $h$o$v$e$r$:$b$g$-$g$r$a$y$-$8$0$0$ $t$r$a$n$s$i$t$i$o$n$-$c$o$l$o$r$s$"$$
$ $ $ $ $ $ $ $ $>$$
$ $ $ $ $ $ $ $ $ $ $<$P$l$u$s$ $c$l$a$s$s$N$a$m$e$=$"$w$-$4$ $h$-$4$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $A$d$d$ $W$a$r$e$h$o$u$s$e$$
$ $ $ $ $ $ $ $ $<$/$b$u$t$t$o$n$>$$
$ $ $ $ $ $ $<$/$d$i$v$>$$
$$
$ $ $ $ $ $ ${$/$*$ $S$t$a$t$s$ $C$a$r$d$s$ $*$/$}$$
$ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$g$r$i$d$ $g$r$i$d$-$c$o$l$s$-$1$ $m$d$:$g$r$i$d$-$c$o$l$s$-$2$ $l$g$:$g$r$i$d$-$c$o$l$s$-$4$ $g$a$p$-$6$"$>$$
$ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$b$g$-$w$h$i$t$e$ $p$-$6$ $r$o$u$n$d$e$d$-$l$g$ $b$o$r$d$e$r$ $b$o$r$d$e$r$-$g$r$a$y$-$2$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$b$e$t$w$e$e$n$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$g$r$a$y$-$5$0$0$ $m$b$-$1$"$>$T$o$t$a$l$ $W$a$r$e$h$o$u$s$e$s$<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$2$x$l$ $f$o$n$t$-$b$o$l$d$ $t$e$x$t$-$g$r$a$y$-$9$0$0$"$>${$s$t$a$t$s$.$t$o$t$a$l$ $|$|$ $0$}$<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$w$-$1$2$ $h$-$1$2$ $b$g$-$g$r$a$y$-$5$0$ $r$o$u$n$d$e$d$-$l$g$ $f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$c$e$n$t$e$r$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$B$u$i$l$d$i$n$g$2$ $c$l$a$s$s$N$a$m$e$=$"$w$-$6$ $h$-$6$ $t$e$x$t$-$g$r$a$y$-$9$0$0$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$$
$ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$b$g$-$w$h$i$t$e$ $p$-$6$ $r$o$u$n$d$e$d$-$l$g$ $b$o$r$d$e$r$ $b$o$r$d$e$r$-$g$r$a$y$-$2$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$b$e$t$w$e$e$n$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$g$r$a$y$-$5$0$0$ $m$b$-$1$"$>$A$c$t$i$v$e$ $W$a$r$e$h$o$u$s$e$s$<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$2$x$l$ $f$o$n$t$-$b$o$l$d$ $t$e$x$t$-$g$r$a$y$-$9$0$0$"$>${$s$t$a$t$s$.$a$c$t$i$v$e$}$<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$w$-$1$2$ $h$-$1$2$ $b$g$-$g$r$e$e$n$-$5$0$ $r$o$u$n$d$e$d$-$l$g$ $f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$c$e$n$t$e$r$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$C$h$e$c$k$C$i$r$c$l$e$ $c$l$a$s$s$N$a$m$e$=$"$w$-$6$ $h$-$6$ $t$e$x$t$-$g$r$e$e$n$-$6$0$0$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$$
$ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$b$g$-$w$h$i$t$e$ $p$-$6$ $r$o$u$n$d$e$d$-$l$g$ $b$o$r$d$e$r$ $b$o$r$d$e$r$-$g$r$a$y$-$2$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$b$e$t$w$e$e$n$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$g$r$a$y$-$5$0$0$ $m$b$-$1$"$>$T$o$t$a$l$ $C$a$p$a$c$i$t$y$<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$2$x$l$ $f$o$n$t$-$b$o$l$d$ $t$e$x$t$-$g$r$a$y$-$9$0$0$"$>${$f$o$r$m$a$t$A$r$e$a$($s$t$a$t$s$.$t$o$t$a$l$C$a$p$a$c$i$t$y$)$}$<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$w$-$1$2$ $h$-$1$2$ $b$g$-$g$r$a$y$-$5$0$ $r$o$u$n$d$e$d$-$l$g$ $f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$c$e$n$t$e$r$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$P$a$c$k$a$g$e$ $c$l$a$s$s$N$a$m$e$=$"$w$-$6$ $h$-$6$ $t$e$x$t$-$g$r$a$y$-$9$0$0$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$$
$ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$b$g$-$w$h$i$t$e$ $p$-$6$ $r$o$u$n$d$e$d$-$l$g$ $b$o$r$d$e$r$ $b$o$r$d$e$r$-$g$r$a$y$-$2$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$b$e$t$w$e$e$n$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$g$r$a$y$-$5$0$0$ $m$b$-$1$"$>$A$v$g$ $U$t$i$l$i$z$a$t$i$o$n$<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$2$x$l$ $f$o$n$t$-$b$o$l$d$ $t$e$x$t$-$g$r$a$y$-$9$0$0$"$>${$s$t$a$t$s$.$a$v$e$r$a$g$e$U$t$i$l$i$z$a$t$i$o$n$.$t$o$F$i$x$e$d$($1$)$}$%$<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$w$-$1$2$ $h$-$1$2$ $b$g$-$g$r$a$y$-$5$0$ $r$o$u$n$d$e$d$-$l$g$ $f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$c$e$n$t$e$r$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$B$a$r$C$h$a$r$t$3$ $c$l$a$s$s$N$a$m$e$=$"$w$-$6$ $h$-$6$ $t$e$x$t$-$g$r$a$y$-$9$0$0$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$m$t$-$3$ $w$-$f$u$l$l$ $b$g$-$g$r$a$y$-$1$0$0$ $r$o$u$n$d$e$d$-$f$u$l$l$ $h$-$2$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$b$g$-$g$r$a$y$-$9$0$0$ $h$-$2$ $r$o$u$n$d$e$d$-$f$u$l$l$ $t$r$a$n$s$i$t$i$o$n$-$a$l$l$ $d$u$r$a$t$i$o$n$-$3$0$0$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $s$t$y$l$e$=${${$ $w$i$d$t$h$:$ $`$$${$M$a$t$h$.$m$i$n$($s$t$a$t$s$.$a$v$e$r$a$g$e$U$t$i$l$i$z$a$t$i$o$n$,$ $1$0$0$)$}$%$`$ $}$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $/$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $<$/$d$i$v$>$$
$$
$ $ $ $ $ $ ${$/$*$ $S$e$a$r$c$h$ $a$n$d$ $F$i$l$t$e$r$s$ $*$/$}$$
$ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$b$g$-$w$h$i$t$e$ $p$-$4$ $r$o$u$n$d$e$d$-$l$g$ $b$o$r$d$e$r$ $b$o$r$d$e$r$-$g$r$a$y$-$2$0$0$"$>$$
$ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $f$l$e$x$-$c$o$l$ $s$m$:$f$l$e$x$-$r$o$w$ $g$a$p$-$4$"$>$$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$-$1$ $r$e$l$a$t$i$v$e$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$S$e$a$r$c$h$ $c$l$a$s$s$N$a$m$e$=$"$a$b$s$o$l$u$t$e$ $l$e$f$t$-$3$ $t$o$p$-$1$/$2$ $t$r$a$n$s$f$o$r$m$ $-$t$r$a$n$s$l$a$t$e$-$y$-$1$/$2$ $t$e$x$t$-$g$r$a$y$-$4$0$0$ $w$-$5$ $h$-$5$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$i$n$p$u$t$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $t$y$p$e$=$"$t$e$x$t$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $p$l$a$c$e$h$o$l$d$e$r$=$"$S$e$a$r$c$h$ $b$y$ $n$a$m$e$,$ $c$o$d$e$,$ $c$i$t$y$.$.$.$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $v$a$l$u$e$=${$s$e$a$r$c$h$T$e$r$m$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$h$a$n$g$e$=${$($e$)$ $=$>$ $s$e$t$S$e$a$r$c$h$T$e$r$m$($e$.$t$a$r$g$e$t$.$v$a$l$u$e$)$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$w$-$f$u$l$l$ $p$l$-$1$0$ $p$r$-$4$ $p$y$-$2$ $b$o$r$d$e$r$ $b$o$r$d$e$r$-$g$r$a$y$-$2$0$0$ $r$o$u$n$d$e$d$-$l$g$ $f$o$c$u$s$:$o$u$t$l$i$n$e$-$n$o$n$e$ $f$o$c$u$s$:$r$i$n$g$-$2$ $f$o$c$u$s$:$r$i$n$g$-$b$l$a$c$k$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $/$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $g$a$p$-$2$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$r$e$l$a$t$i$v$e$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$F$i$l$t$e$r$ $c$l$a$s$s$N$a$m$e$=$"$a$b$s$o$l$u$t$e$ $l$e$f$t$-$3$ $t$o$p$-$1$/$2$ $t$r$a$n$s$f$o$r$m$ $-$t$r$a$n$s$l$a$t$e$-$y$-$1$/$2$ $t$e$x$t$-$g$r$a$y$-$4$0$0$ $w$-$5$ $h$-$5$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$s$e$l$e$c$t$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $v$a$l$u$e$=${$s$t$a$t$u$s$F$i$l$t$e$r$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$h$a$n$g$e$=${$($e$)$ $=$>$ $s$e$t$S$t$a$t$u$s$F$i$l$t$e$r$($e$.$t$a$r$g$e$t$.$v$a$l$u$e$ $a$s$ $'$a$l$l$'$ $|$ $W$a$r$e$h$o$u$s$e$S$t$a$t$u$s$)$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$p$l$-$1$0$ $p$r$-$8$ $p$y$-$2$ $b$o$r$d$e$r$ $b$o$r$d$e$r$-$g$r$a$y$-$2$0$0$ $r$o$u$n$d$e$d$-$l$g$ $f$o$c$u$s$:$o$u$t$l$i$n$e$-$n$o$n$e$ $f$o$c$u$s$:$r$i$n$g$-$2$ $f$o$c$u$s$:$r$i$n$g$-$b$l$a$c$k$ $a$p$p$e$a$r$a$n$c$e$-$n$o$n$e$ $b$g$-$w$h$i$t$e$ $c$u$r$s$o$r$-$p$o$i$n$t$e$r$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$o$p$t$i$o$n$ $v$a$l$u$e$=$"$a$l$l$"$>$A$l$l$ $S$t$a$t$u$s$<$/$o$p$t$i$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$o$p$t$i$o$n$ $v$a$l$u$e$=$"$a$c$t$i$v$e$"$>$A$c$t$i$v$e$<$/$o$p$t$i$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$o$p$t$i$o$n$ $v$a$l$u$e$=$"$i$n$a$c$t$i$v$e$"$>$I$n$a$c$t$i$v$e$<$/$o$p$t$i$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$o$p$t$i$o$n$ $v$a$l$u$e$=$"$m$a$i$n$t$e$n$a$n$c$e$"$>$M$a$i$n$t$e$n$a$n$c$e$<$/$o$p$t$i$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$s$e$l$e$c$t$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$r$e$l$a$t$i$v$e$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$s$e$l$e$c$t$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $v$a$l$u$e$=${$v$e$r$i$f$i$e$d$F$i$l$t$e$r$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$h$a$n$g$e$=${$($e$)$ $=$>$ $s$e$t$V$e$r$i$f$i$e$d$F$i$l$t$e$r$($e$.$t$a$r$g$e$t$.$v$a$l$u$e$ $a$s$ $'$a$l$l$'$ $|$ $'$v$e$r$i$f$i$e$d$'$ $|$ $'$u$n$v$e$r$i$f$i$e$d$'$)$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$4$ $p$y$-$2$ $b$o$r$d$e$r$ $b$o$r$d$e$r$-$g$r$a$y$-$2$0$0$ $r$o$u$n$d$e$d$-$l$g$ $f$o$c$u$s$:$o$u$t$l$i$n$e$-$n$o$n$e$ $f$o$c$u$s$:$r$i$n$g$-$2$ $f$o$c$u$s$:$r$i$n$g$-$b$l$a$c$k$ $a$p$p$e$a$r$a$n$c$e$-$n$o$n$e$ $b$g$-$w$h$i$t$e$ $c$u$r$s$o$r$-$p$o$i$n$t$e$r$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$o$p$t$i$o$n$ $v$a$l$u$e$=$"$a$l$l$"$>$A$l$l$ $V$e$r$i$f$i$e$d$<$/$o$p$t$i$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$o$p$t$i$o$n$ $v$a$l$u$e$=$"$v$e$r$i$f$i$e$d$"$>$V$e$r$i$f$i$e$d$ $O$n$l$y$<$/$o$p$t$i$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$o$p$t$i$o$n$ $v$a$l$u$e$=$"$u$n$v$e$r$i$f$i$e$d$"$>$U$n$v$e$r$i$f$i$e$d$ $O$n$l$y$<$/$o$p$t$i$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$s$e$l$e$c$t$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $<$/$d$i$v$>$$
$$
$ $ $ $ $ $ ${$/$*$ $E$r$r$o$r$ $M$e$s$s$a$g$e$ $*$/$}$$
$ $ $ $ $ $ ${$e$r$r$o$r$ $&$&$ $($$
$ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$b$g$-$r$e$d$-$5$0$ $b$o$r$d$e$r$ $b$o$r$d$e$r$-$r$e$d$-$2$0$0$ $r$o$u$n$d$e$d$-$l$g$ $p$-$4$ $f$l$e$x$ $i$t$e$m$s$-$s$t$a$r$t$ $g$a$p$-$3$"$>$$
$ $ $ $ $ $ $ $ $ $ $<$A$l$e$r$t$C$i$r$c$l$e$ $c$l$a$s$s$N$a$m$e$=$"$w$-$5$ $h$-$5$ $t$e$x$t$-$r$e$d$-$6$0$0$ $f$l$e$x$-$s$h$r$i$n$k$-$0$ $m$t$-$0$.$5$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$h$3$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$r$e$d$-$8$0$0$"$>$E$r$r$o$r$ $L$o$a$d$i$n$g$ $W$a$r$e$h$o$u$s$e$s$<$/$h$3$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$r$e$d$-$7$0$0$ $m$t$-$1$"$>${$e$r$r$o$r$}$<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$b$u$t$t$o$n$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$l$i$c$k$=${$f$e$t$c$h$W$a$r$e$h$o$u$s$e$s$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$m$t$-$2$ $t$e$x$t$-$s$m$ $t$e$x$t$-$r$e$d$-$7$0$0$ $u$n$d$e$r$l$i$n$e$ $h$o$v$e$r$:$t$e$x$t$-$r$e$d$-$8$0$0$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $T$r$y$ $A$g$a$i$n$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$b$u$t$t$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $)$}$$
$$
$ $ $ $ $ $ ${$/$*$ $B$u$l$k$ $A$c$t$i$o$n$s$ $T$o$o$l$b$a$r$ $*$/$}$$
$ $ $ $ $ $ ${$s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$s$.$s$i$z$e$ $>$ $0$ $&$&$ $($$
$ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$b$e$t$w$e$e$n$ $p$-$4$ $b$g$-$n$e$u$t$r$a$l$-$5$0$ $b$o$r$d$e$r$ $b$o$r$d$e$r$-$n$e$u$t$r$a$l$-$2$0$0$ $r$o$u$n$d$e$d$-$l$g$"$>$$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $g$a$p$-$4$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$s$p$a$n$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$7$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ ${$s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$s$.$s$i$z$e$}$ $w$a$r$e$h$o$u$s$e${$s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$s$.$s$i$z$e$ $>$ $1$ $?$ $'$s$'$ $:$ $'$'$}$ $s$e$l$e$c$t$e$d$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$s$p$a$n$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$b$u$t$t$o$n$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$l$i$c$k$=${$($)$ $=$>$ $s$e$t$S$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$s$($n$e$w$ $S$e$t$($)$)$}$$
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
$ $ $ $ $ $ ${$/$*$ $W$a$r$e$h$o$u$s$e$s$ $T$a$b$l$e$ $*$/$}$$
$ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$b$g$-$w$h$i$t$e$ $r$o$u$n$d$e$d$-$l$g$ $b$o$r$d$e$r$ $b$o$r$d$e$r$-$g$r$a$y$-$2$0$0$ $o$v$e$r$f$l$o$w$-$h$i$d$d$e$n$"$>$$
$ $ $ $ $ $ $ $ ${$l$o$a$d$i$n$g$ $?$ $($$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$c$e$n$t$e$r$ $p$y$-$1$2$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$L$o$a$d$e$r$2$ $c$l$a$s$s$N$a$m$e$=$"$w$-$8$ $h$-$8$ $t$e$x$t$-$g$r$a$y$-$4$0$0$ $a$n$i$m$a$t$e$-$s$p$i$n$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $)$ $:$ $($$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$o$v$e$r$f$l$o$w$-$x$-$a$u$t$o$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$t$a$b$l$e$ $c$l$a$s$s$N$a$m$e$=$"$w$-$f$u$l$l$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$t$h$e$a$d$ $c$l$a$s$s$N$a$m$e$=$"$b$g$-$g$r$a$y$-$5$0$ $b$o$r$d$e$r$-$b$ $b$o$r$d$e$r$-$g$r$a$y$-$2$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$t$r$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$t$h$ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$6$ $p$y$-$3$ $w$-$1$2$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$i$n$p$u$t$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $t$y$p$e$=$"$c$h$e$c$k$b$o$x$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$h$e$c$k$e$d$=${$w$a$r$e$h$o$u$s$e$s$.$l$e$n$g$t$h$ $>$ $0$ $&$&$ $s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$s$.$s$i$z$e$ $=$=$=$ $w$a$r$e$h$o$u$s$e$s$.$l$e$n$g$t$h$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$h$a$n$g$e$=${$h$a$n$d$l$e$S$e$l$e$c$t$A$l$l$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$r$o$u$n$d$e$d$ $b$o$r$d$e$r$-$n$e$u$t$r$a$l$-$3$0$0$ $t$e$x$t$-$n$e$u$t$r$a$l$-$9$0$0$ $f$o$c$u$s$:$r$i$n$g$-$n$e$u$t$r$a$l$-$9$0$0$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$t$h$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$t$h$ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$6$ $p$y$-$3$ $t$e$x$t$-$l$e$f$t$ $t$e$x$t$-$x$s$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$g$r$a$y$-$5$0$0$ $u$p$p$e$r$c$a$s$e$ $t$r$a$c$k$i$n$g$-$w$i$d$e$r$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $W$a$r$e$h$o$u$s$e$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$t$h$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$t$h$ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$6$ $p$y$-$3$ $t$e$x$t$-$l$e$f$t$ $t$e$x$t$-$x$s$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$g$r$a$y$-$5$0$0$ $u$p$p$e$r$c$a$s$e$ $t$r$a$c$k$i$n$g$-$w$i$d$e$r$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $L$o$c$a$t$i$o$n$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$t$h$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$t$h$ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$6$ $p$y$-$3$ $t$e$x$t$-$l$e$f$t$ $t$e$x$t$-$x$s$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$g$r$a$y$-$5$0$0$ $u$p$p$e$r$c$a$s$e$ $t$r$a$c$k$i$n$g$-$w$i$d$e$r$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $C$a$p$a$c$i$t$y$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$t$h$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$t$h$ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$6$ $p$y$-$3$ $t$e$x$t$-$l$e$f$t$ $t$e$x$t$-$x$s$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$g$r$a$y$-$5$0$0$ $u$p$p$e$r$c$a$s$e$ $t$r$a$c$k$i$n$g$-$w$i$d$e$r$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $A$v$a$i$l$a$b$l$e$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$t$h$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$t$h$ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$6$ $p$y$-$3$ $t$e$x$t$-$l$e$f$t$ $t$e$x$t$-$x$s$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$g$r$a$y$-$5$0$0$ $u$p$p$e$r$c$a$s$e$ $t$r$a$c$k$i$n$g$-$w$i$d$e$r$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $U$t$i$l$i$z$a$t$i$o$n$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$t$h$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$t$h$ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$6$ $p$y$-$3$ $t$e$x$t$-$l$e$f$t$ $t$e$x$t$-$x$s$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$g$r$a$y$-$5$0$0$ $u$p$p$e$r$c$a$s$e$ $t$r$a$c$k$i$n$g$-$w$i$d$e$r$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $S$t$a$t$u$s$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$t$h$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$t$h$ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$6$ $p$y$-$3$ $t$e$x$t$-$l$e$f$t$ $t$e$x$t$-$x$s$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$g$r$a$y$-$5$0$0$ $u$p$p$e$r$c$a$s$e$ $t$r$a$c$k$i$n$g$-$w$i$d$e$r$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $V$e$r$i$f$i$e$d$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$t$h$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$t$h$ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$6$ $p$y$-$3$ $t$e$x$t$-$r$i$g$h$t$ $t$e$x$t$-$x$s$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$g$r$a$y$-$5$0$0$ $u$p$p$e$r$c$a$s$e$ $t$r$a$c$k$i$n$g$-$w$i$d$e$r$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $A$c$t$i$o$n$s$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$t$h$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$t$r$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$t$h$e$a$d$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$t$b$o$d$y$ $c$l$a$s$s$N$a$m$e$=$"$b$g$-$w$h$i$t$e$ $d$i$v$i$d$e$-$y$ $d$i$v$i$d$e$-$g$r$a$y$-$2$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ ${$w$a$r$e$h$o$u$s$e$s$.$l$e$n$g$t$h$ $=$=$=$ $0$ $?$ $($$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$t$r$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$t$d$ $c$o$l$S$p$a$n$=${$9$}$ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$6$ $p$y$-$1$2$ $t$e$x$t$-$c$e$n$t$e$r$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $f$l$e$x$-$c$o$l$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$c$e$n$t$e$r$ $t$e$x$t$-$g$r$a$y$-$5$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$B$u$i$l$d$i$n$g$2$ $c$l$a$s$s$N$a$m$e$=$"$w$-$1$2$ $h$-$1$2$ $m$b$-$3$ $t$e$x$t$-$g$r$a$y$-$3$0$0$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$"$>$N$o$ $w$a$r$e$h$o$u$s$e$s$ $f$o$u$n$d$<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$x$s$ $m$t$-$1$"$>$T$r$y$ $a$d$j$u$s$t$i$n$g$ $y$o$u$r$ $s$e$a$r$c$h$ $o$r$ $f$i$l$t$e$r$s$<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$t$d$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$t$r$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $)$ $:$ $($$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $w$a$r$e$h$o$u$s$e$s$.$m$a$p$($($w$a$r$e$h$o$u$s$e$)$ $=$>$ $($$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$W$a$r$e$h$o$u$s$e$R$o$w$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $k$e$y$=${$w$a$r$e$h$o$u$s$e$.$i$d$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $w$a$r$e$h$o$u$s$e$=${$w$a$r$e$h$o$u$s$e$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $i$s$S$e$l$e$c$t$e$d$=${$s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$s$.$h$a$s$($w$a$r$e$h$o$u$s$e$.$i$d$)$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$S$e$l$e$c$t$=${$h$a$n$d$l$e$S$e$l$e$c$t$W$a$r$e$h$o$u$s$e$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$V$i$e$w$=${$h$a$n$d$l$e$V$i$e$w$D$e$t$a$i$l$s$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$E$d$i$t$=${$h$a$n$d$l$e$E$d$i$t$W$a$r$e$h$o$u$s$e$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$D$e$l$e$t$e$=${$h$a$n$d$l$e$D$e$l$e$t$e$W$a$r$e$h$o$u$s$e$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$U$p$d$a$t$e$S$t$a$t$u$s$=${$h$a$n$d$l$e$U$p$d$a$t$e$S$t$a$t$u$s$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $)$)$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $)$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$t$b$o$d$y$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$t$a$b$l$e$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $)$}$$
$ $ $ $ $ $ $<$/$d$i$v$>$$
$$
$ $ $ $ $ $ ${$/$*$ $P$a$g$i$n$a$t$i$o$n$ $*$/$}$$
$ $ $ $ $ $ ${$!$l$o$a$d$i$n$g$ $&$&$ $t$o$t$a$l$P$a$g$e$s$ $>$ $1$ $&$&$ $($$
$ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$b$e$t$w$e$e$n$"$>$$
$ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$g$r$a$y$-$5$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $S$h$o$w$i$n$g$ $<$s$p$a$n$ $c$l$a$s$s$N$a$m$e$=$"$f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$g$r$a$y$-$9$0$0$"$>${$w$a$r$e$h$o$u$s$e$s$.$l$e$n$g$t$h$}$<$/$s$p$a$n$>$ $o$f${$'$ $'$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$s$p$a$n$ $c$l$a$s$s$N$a$m$e$=$"$f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$g$r$a$y$-$9$0$0$"$>${$t$o$t$a$l$C$o$u$n$t$}$<$/$s$p$a$n$>$ $w$a$r$e$h$o$u$s$e$s$$
$ $ $ $ $ $ $ $ $ $ $<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $g$a$p$-$2$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$b$u$t$t$o$n$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$l$i$c$k$=${$($)$ $=$>$ $s$e$t$C$u$r$r$e$n$t$P$a$g$e$($p$r$e$v$ $=$>$ $M$a$t$h$.$m$a$x$($1$,$ $p$r$e$v$ $-$ $1$)$)$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $d$i$s$a$b$l$e$d$=${$c$u$r$r$e$n$t$P$a$g$e$ $=$=$=$ $1$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$3$ $p$y$-$1$.$5$ $t$e$x$t$-$s$m$ $b$o$r$d$e$r$ $b$o$r$d$e$r$-$g$r$a$y$-$2$0$0$ $r$o$u$n$d$e$d$-$l$g$ $h$o$v$e$r$:$b$g$-$g$r$a$y$-$5$0$ $d$i$s$a$b$l$e$d$:$o$p$a$c$i$t$y$-$5$0$ $d$i$s$a$b$l$e$d$:$c$u$r$s$o$r$-$n$o$t$-$a$l$l$o$w$e$d$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $P$r$e$v$i$o$u$s$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$b$u$t$t$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$s$p$a$n$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$g$r$a$y$-$6$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $P$a$g$e$ ${$c$u$r$r$e$n$t$P$a$g$e$}$ $o$f$ ${$t$o$t$a$l$P$a$g$e$s$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$s$p$a$n$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$b$u$t$t$o$n$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$l$i$c$k$=${$($)$ $=$>$ $s$e$t$C$u$r$r$e$n$t$P$a$g$e$($p$r$e$v$ $=$>$ $M$a$t$h$.$m$i$n$($t$o$t$a$l$P$a$g$e$s$,$ $p$r$e$v$ $+$ $1$)$)$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $d$i$s$a$b$l$e$d$=${$c$u$r$r$e$n$t$P$a$g$e$ $=$=$=$ $t$o$t$a$l$P$a$g$e$s$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$3$ $p$y$-$1$.$5$ $t$e$x$t$-$s$m$ $b$o$r$d$e$r$ $b$o$r$d$e$r$-$g$r$a$y$-$2$0$0$ $r$o$u$n$d$e$d$-$l$g$ $h$o$v$e$r$:$b$g$-$g$r$a$y$-$5$0$ $d$i$s$a$b$l$e$d$:$o$p$a$c$i$t$y$-$5$0$ $d$i$s$a$b$l$e$d$:$c$u$r$s$o$r$-$n$o$t$-$a$l$l$o$w$e$d$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $N$e$x$t$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$b$u$t$t$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $)$}$$
$$
$ $ $ $ $ $ ${$/$*$ $S$i$m$p$l$e$ $D$e$t$a$i$l$ $M$o$d$a$l$ $($T$O$D$O$:$ $R$e$p$l$a$c$e$ $w$i$t$h$ $p$r$o$p$e$r$ $m$o$d$a$l$ $c$o$m$p$o$n$e$n$t$)$ $*$/$}$$
$ $ $ $ $ $ ${$i$s$D$e$t$a$i$l$M$o$d$a$l$O$p$e$n$ $&$&$ $s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$ $&$&$ $($$
$ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$i$x$e$d$ $i$n$s$e$t$-$0$ $b$g$-$b$l$a$c$k$ $b$g$-$o$p$a$c$i$t$y$-$5$0$ $f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$c$e$n$t$e$r$ $z$-$5$0$ $p$-$4$"$>$$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$b$g$-$w$h$i$t$e$ $r$o$u$n$d$e$d$-$l$g$ $m$a$x$-$w$-$2$x$l$ $w$-$f$u$l$l$ $m$a$x$-$h$-$[$9$0$v$h$]$ $o$v$e$r$f$l$o$w$-$y$-$a$u$t$o$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$p$-$6$ $b$o$r$d$e$r$-$b$ $b$o$r$d$e$r$-$g$r$a$y$-$2$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$b$e$t$w$e$e$n$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$h$2$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$x$l$ $f$o$n$t$-$b$o$l$d$ $t$e$x$t$-$g$r$a$y$-$9$0$0$"$>${$s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$.$n$a$m$e$}$<$/$h$2$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$b$u$t$t$o$n$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$l$i$c$k$=${$($)$ $=$>$ ${$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $s$e$t$I$s$D$e$t$a$i$l$M$o$d$a$l$O$p$e$n$($f$a$l$s$e$)$;$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $s$e$t$S$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$($n$u$l$l$)$;$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $}$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$g$r$a$y$-$4$0$0$ $h$o$v$e$r$:$t$e$x$t$-$g$r$a$y$-$6$0$0$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$X$C$i$r$c$l$e$ $c$l$a$s$s$N$a$m$e$=$"$w$-$6$ $h$-$6$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$b$u$t$t$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$p$-$6$ $s$p$a$c$e$-$y$-$4$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$h$3$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$g$r$a$y$-$5$0$0$ $m$b$-$2$"$>$W$a$r$e$h$o$u$s$e$ $C$o$d$e$<$/$h$3$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$g$r$a$y$-$9$0$0$"$>${$s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$.$c$o$d$e$}$<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$h$3$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$g$r$a$y$-$5$0$0$ $m$b$-$2$"$>$L$o$c$a$t$i$o$n$<$/$h$3$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$g$r$a$y$-$9$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ ${$s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$.$s$t$r$e$e$t$}$,$ ${$s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$.$c$i$t$y$}$,$ ${$s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$.$s$t$a$t$e$}$ $-$ ${$s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$.$p$i$n$c$o$d$e$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$g$r$i$d$ $g$r$i$d$-$c$o$l$s$-$2$ $g$a$p$-$4$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$h$3$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$g$r$a$y$-$5$0$0$ $m$b$-$2$"$>$C$a$p$a$c$i$t$y$<$/$h$3$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$g$r$a$y$-$9$0$0$"$>${$f$o$r$m$a$t$A$r$e$a$($s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$.$c$a$p$a$c$i$t$y$)$}$<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$h$3$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$g$r$a$y$-$5$0$0$ $m$b$-$2$"$>$O$c$c$u$p$i$e$d$<$/$h$3$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$g$r$a$y$-$9$0$0$"$>${$f$o$r$m$a$t$A$r$e$a$($s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$.$o$c$c$u$p$i$e$d$)$}$<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$h$3$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$g$r$a$y$-$5$0$0$ $m$b$-$2$"$>$A$v$a$i$l$a$b$l$e$<$/$h$3$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$g$r$a$y$-$9$0$0$"$>${$f$o$r$m$a$t$A$r$e$a$($s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$.$a$v$a$i$l$a$b$l$e$)$}$<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$h$3$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$g$r$a$y$-$5$0$0$ $m$b$-$2$"$>$U$t$i$l$i$z$a$t$i$o$n$<$/$h$3$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$g$r$a$y$-$9$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ ${$($($s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$.$o$c$c$u$p$i$e$d$ $/$ $s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$.$c$a$p$a$c$i$t$y$)$ $*$ $1$0$0$)$.$t$o$F$i$x$e$d$($1$)$}$%$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$h$3$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$g$r$a$y$-$5$0$0$ $m$b$-$2$"$>$S$t$a$t$u$s$<$/$h$3$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ ${$g$e$t$S$t$a$t$u$s$B$a$d$g$e$($s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$.$s$t$a$t$u$s$)$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ ${$s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$.$a$m$e$n$i$t$i$e$s$ $&$&$ $s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$.$a$m$e$n$i$t$i$e$s$.$l$e$n$g$t$h$ $>$ $0$ $&$&$ $($$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$h$3$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$g$r$a$y$-$5$0$0$ $m$b$-$2$"$>$A$m$e$n$i$t$i$e$s$<$/$h$3$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $f$l$e$x$-$w$r$a$p$ $g$a$p$-$2$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ ${$s$e$l$e$c$t$e$d$W$a$r$e$h$o$u$s$e$.$a$m$e$n$i$t$i$e$s$.$m$a$p$($($a$m$e$n$i$t$y$,$ $i$n$d$e$x$)$ $=$>$ $($$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$s$p$a$n$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $k$e$y$=${$i$n$d$e$x$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$2$.$5$ $p$y$-$1$ $b$g$-$g$r$a$y$-$1$0$0$ $t$e$x$t$-$g$r$a$y$-$7$0$0$ $t$e$x$t$-$x$s$ $r$o$u$n$d$e$d$-$f$u$l$l$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ ${$a$m$e$n$i$t$y$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$s$p$a$n$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $)$)$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $)$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $)$}$$
$$
$ $ $ $ $ $ ${$/$*$ $W$a$r$e$h$o$u$s$e$ $M$o$d$a$l$ $-$ $L$a$z$y$ $L$o$a$d$e$d$ $*$/$}$$
$ $ $ $ $ $ ${$i$s$M$o$d$a$l$O$p$e$n$ $&$&$ $($$
$ $ $ $ $ $ $ $ $<$S$u$s$p$e$n$s$e$ $f$a$l$l$b$a$c$k$=${$<$M$o$d$a$l$L$o$a$d$e$r$ $/$>$}$>$$
$ $ $ $ $ $ $ $ $ $ $<$W$a$r$e$h$o$u$s$e$M$o$d$a$l$$
$ $ $ $ $ $ $ $ $ $ $ $ $i$s$O$p$e$n$=${$i$s$M$o$d$a$l$O$p$e$n$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$l$o$s$e$=${$h$a$n$d$l$e$C$l$o$s$e$M$o$d$a$l$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $o$n$S$u$c$c$e$s$s$=${$h$a$n$d$l$e$S$a$v$e$S$u$c$c$e$s$s$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $w$a$r$e$h$o$u$s$e$=${$e$d$i$t$i$n$g$W$a$r$e$h$o$u$s$e$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $m$o$d$e$=${$m$o$d$a$l$M$o$d$e$}$$
$ $ $ $ $ $ $ $ $ $ $/$>$$
$ $ $ $ $ $ $ $ $<$/$S$u$s$p$e$n$s$e$>$$
$ $ $ $ $ $ $)$}$$
$ $ $ $ $<$/$d$i$v$>$$
$ $ $)$;$$
$}$$
$
