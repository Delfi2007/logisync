$/$*$*$$
$ $*$ $E$m$a$i$l$ $V$e$r$i$f$i$c$a$t$i$o$n$ $B$a$n$n$e$r$$
$ $*$ $S$h$o$w$s$ $a$t$ $t$h$e$ $t$o$p$ $o$f$ $p$a$g$e$s$ $f$o$r$ $u$s$e$r$s$ $w$i$t$h$ $u$n$v$e$r$i$f$i$e$d$ $e$m$a$i$l$s$$
$ $*$ $I$n$c$l$u$d$e$s$ $r$e$s$e$n$d$ $f$u$n$c$t$i$o$n$a$l$i$t$y$ $w$i$t$h$ $r$a$t$e$ $l$i$m$i$t$i$n$g$$
$ $*$/$$
$$
$i$m$p$o$r$t$ $R$e$a$c$t$,$ ${$ $u$s$e$S$t$a$t$e$,$ $u$s$e$E$f$f$e$c$t$ $}$ $f$r$o$m$ $'$r$e$a$c$t$'$;$$
$i$m$p$o$r$t$ ${$ $M$a$i$l$,$ $X$,$ $L$o$a$d$e$r$2$,$ $C$h$e$c$k$C$i$r$c$l$e$,$ $A$l$e$r$t$C$i$r$c$l$e$ $}$ $f$r$o$m$ $'$l$u$c$i$d$e$-$r$e$a$c$t$'$;$$
$i$m$p$o$r$t$ $a$u$t$h$S$e$r$v$i$c$e$ $f$r$o$m$ $'$@$/$s$e$r$v$i$c$e$s$/$a$u$t$h$'$;$$
$$
$i$n$t$e$r$f$a$c$e$ $E$m$a$i$l$V$e$r$i$f$i$c$a$t$i$o$n$B$a$n$n$e$r$P$r$o$p$s$ ${$$
$ $ $u$s$e$r$E$m$a$i$l$:$ $s$t$r$i$n$g$;$$
$ $ $i$s$V$e$r$i$f$i$e$d$:$ $b$o$o$l$e$a$n$;$$
$ $ $o$n$D$i$s$m$i$s$s$?$:$ $($)$ $=$>$ $v$o$i$d$;$$
$}$$
$$
$c$o$n$s$t$ $E$m$a$i$l$V$e$r$i$f$i$c$a$t$i$o$n$B$a$n$n$e$r$:$ $R$e$a$c$t$.$F$C$<$E$m$a$i$l$V$e$r$i$f$i$c$a$t$i$o$n$B$a$n$n$e$r$P$r$o$p$s$>$ $=$ $(${$$
$ $ $u$s$e$r$E$m$a$i$l$,$$
$ $ $i$s$V$e$r$i$f$i$e$d$,$$
$ $ $o$n$D$i$s$m$i$s$s$$
$}$)$ $=$>$ ${$$
$ $ $c$o$n$s$t$ $[$d$i$s$m$i$s$s$e$d$,$ $s$e$t$D$i$s$m$i$s$s$e$d$]$ $=$ $u$s$e$S$t$a$t$e$($f$a$l$s$e$)$;$$
$ $ $c$o$n$s$t$ $[$s$e$n$d$i$n$g$,$ $s$e$t$S$e$n$d$i$n$g$]$ $=$ $u$s$e$S$t$a$t$e$($f$a$l$s$e$)$;$$
$ $ $c$o$n$s$t$ $[$s$e$n$t$,$ $s$e$t$S$e$n$t$]$ $=$ $u$s$e$S$t$a$t$e$($f$a$l$s$e$)$;$$
$ $ $c$o$n$s$t$ $[$e$r$r$o$r$,$ $s$e$t$E$r$r$o$r$]$ $=$ $u$s$e$S$t$a$t$e$($'$'$)$;$$
$ $ $c$o$n$s$t$ $[$c$o$u$n$t$d$o$w$n$,$ $s$e$t$C$o$u$n$t$d$o$w$n$]$ $=$ $u$s$e$S$t$a$t$e$($0$)$;$$
$$
$ $ $/$/$ $D$o$n$'$t$ $s$h$o$w$ $b$a$n$n$e$r$ $i$f$ $v$e$r$i$f$i$e$d$ $o$r$ $d$i$s$m$i$s$s$e$d$$
$ $ $i$f$ $($i$s$V$e$r$i$f$i$e$d$ $|$|$ $d$i$s$m$i$s$s$e$d$)$ ${$$
$ $ $ $ $r$e$t$u$r$n$ $n$u$l$l$;$$
$ $ $}$$
$$
$ $ $/$/$ $C$o$u$n$t$d$o$w$n$ $t$i$m$e$r$ $f$o$r$ $r$e$s$e$n$d$ $r$a$t$e$ $l$i$m$i$t$i$n$g$$
$ $ $u$s$e$E$f$f$e$c$t$($($)$ $=$>$ ${$$
$ $ $ $ $i$f$ $($c$o$u$n$t$d$o$w$n$ $>$ $0$)$ ${$$
$ $ $ $ $ $ $c$o$n$s$t$ $t$i$m$e$r$ $=$ $s$e$t$T$i$m$e$o$u$t$($($)$ $=$>$ ${$$
$ $ $ $ $ $ $ $ $s$e$t$C$o$u$n$t$d$o$w$n$($c$o$u$n$t$d$o$w$n$ $-$ $1$)$;$$
$ $ $ $ $ $ $}$,$ $1$0$0$0$)$;$$
$$
$ $ $ $ $ $ $r$e$t$u$r$n$ $($)$ $=$>$ $c$l$e$a$r$T$i$m$e$o$u$t$($t$i$m$e$r$)$;$$
$ $ $ $ $}$$
$ $ $}$,$ $[$c$o$u$n$t$d$o$w$n$]$)$;$$
$$
$ $ $/$/$ $H$a$n$d$l$e$ $r$e$s$e$n$d$ $v$e$r$i$f$i$c$a$t$i$o$n$ $e$m$a$i$l$$
$ $ $c$o$n$s$t$ $h$a$n$d$l$e$R$e$s$e$n$d$ $=$ $a$s$y$n$c$ $($)$ $=$>$ ${$$
$ $ $ $ $i$f$ $($c$o$u$n$t$d$o$w$n$ $>$ $0$)$ $r$e$t$u$r$n$;$$
$$
$ $ $ $ $t$r$y$ ${$$
$ $ $ $ $ $ $s$e$t$S$e$n$d$i$n$g$($t$r$u$e$)$;$$
$ $ $ $ $ $ $s$e$t$E$r$r$o$r$($'$'$)$;$$
$ $ $ $ $ $ $s$e$t$S$e$n$t$($f$a$l$s$e$)$;$$
$$
$ $ $ $ $ $ $a$w$a$i$t$ $a$u$t$h$S$e$r$v$i$c$e$.$r$e$s$e$n$d$V$e$r$i$f$i$c$a$t$i$o$n$($u$s$e$r$E$m$a$i$l$)$;$$
$$
$ $ $ $ $ $ $s$e$t$S$e$n$t$($t$r$u$e$)$;$$
$ $ $ $ $ $ $s$e$t$C$o$u$n$t$d$o$w$n$($6$0$)$;$ $/$/$ $6$0$ $s$e$c$o$n$d$ $c$o$o$l$d$o$w$n$$
$$
$ $ $ $ $ $ $/$/$ $H$i$d$e$ $s$u$c$c$e$s$s$ $m$e$s$s$a$g$e$ $a$f$t$e$r$ $5$ $s$e$c$o$n$d$s$$
$ $ $ $ $ $ $s$e$t$T$i$m$e$o$u$t$($($)$ $=$>$ ${$$
$ $ $ $ $ $ $ $ $s$e$t$S$e$n$t$($f$a$l$s$e$)$;$$
$ $ $ $ $ $ $}$,$ $5$0$0$0$)$;$$
$ $ $ $ $}$ $c$a$t$c$h$ $($e$r$r$:$ $a$n$y$)$ ${$$
$ $ $ $ $ $ $c$o$n$s$o$l$e$.$e$r$r$o$r$($'$R$e$s$e$n$d$ $v$e$r$i$f$i$c$a$t$i$o$n$ $e$r$r$o$r$:$'$,$ $e$r$r$)$;$$
$ $ $ $ $ $ $s$e$t$E$r$r$o$r$($e$r$r$.$r$e$s$p$o$n$s$e$?$.$d$a$t$a$?$.$m$e$s$s$a$g$e$ $|$|$ $'$F$a$i$l$e$d$ $t$o$ $s$e$n$d$ $v$e$r$i$f$i$c$a$t$i$o$n$ $e$m$a$i$l$'$)$;$$
$ $ $ $ $ $ $$
$ $ $ $ $ $ $/$/$ $H$i$d$e$ $e$r$r$o$r$ $a$f$t$e$r$ $5$ $s$e$c$o$n$d$s$$
$ $ $ $ $ $ $s$e$t$T$i$m$e$o$u$t$($($)$ $=$>$ ${$$
$ $ $ $ $ $ $ $ $s$e$t$E$r$r$o$r$($'$'$)$;$$
$ $ $ $ $ $ $}$,$ $5$0$0$0$)$;$$
$ $ $ $ $}$ $f$i$n$a$l$l$y$ ${$$
$ $ $ $ $ $ $s$e$t$S$e$n$d$i$n$g$($f$a$l$s$e$)$;$$
$ $ $ $ $}$$
$ $ $}$;$$
$$
$ $ $/$/$ $H$a$n$d$l$e$ $d$i$s$m$i$s$s$$
$ $ $c$o$n$s$t$ $h$a$n$d$l$e$D$i$s$m$i$s$s$ $=$ $($)$ $=$>$ ${$$
$ $ $ $ $s$e$t$D$i$s$m$i$s$s$e$d$($t$r$u$e$)$;$$
$ $ $ $ $i$f$ $($o$n$D$i$s$m$i$s$s$)$ ${$$
$ $ $ $ $ $ $o$n$D$i$s$m$i$s$s$($)$;$$
$ $ $ $ $}$$
$ $ $}$;$$
$$
$ $ $r$e$t$u$r$n$ $($$
$ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$b$g$-$g$r$a$d$i$e$n$t$-$t$o$-$r$ $f$r$o$m$-$a$m$b$e$r$-$5$0$0$ $t$o$-$o$r$a$n$g$e$-$5$0$0$ $b$o$r$d$e$r$-$b$ $b$o$r$d$e$r$-$o$r$a$n$g$e$-$6$0$0$ $s$h$a$d$o$w$-$m$d$"$>$$
$ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$m$a$x$-$w$-$7$x$l$ $m$x$-$a$u$t$o$ $p$x$-$4$ $s$m$:$p$x$-$6$ $l$g$:$p$x$-$8$"$>$$
$ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$p$y$-$3$"$>$$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$b$e$t$w$e$e$n$ $f$l$e$x$-$w$r$a$p$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ ${$/$*$ $L$e$f$t$ $s$i$d$e$ $-$ $I$c$o$n$ $a$n$d$ $M$e$s$s$a$g$e$ $*$/$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $f$l$e$x$-$1$ $m$i$n$-$w$-$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$s$p$a$n$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $p$-$2$ $r$o$u$n$d$e$d$-$l$g$ $b$g$-$w$h$i$t$e$ $b$g$-$o$p$a$c$i$t$y$-$2$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$M$a$i$l$ $c$l$a$s$s$N$a$m$e$=$"$h$-$6$ $w$-$6$ $t$e$x$t$-$w$h$i$t$e$"$ $a$r$i$a$-$h$i$d$d$e$n$=$"$t$r$u$e$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$s$p$a$n$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$m$l$-$3$ $f$l$e$x$-$1$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$w$h$i$t$e$ $f$o$n$t$-$m$e$d$i$u$m$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $V$e$r$i$f$y$ $y$o$u$r$ $e$m$a$i$l$ $a$d$d$r$e$s$s$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$o$r$a$n$g$e$-$1$0$0$ $t$e$x$t$-$s$m$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $W$e$ $s$e$n$t$ $a$ $v$e$r$i$f$i$c$a$t$i$o$n$ $e$m$a$i$l$ $t$o$ $<$s$p$a$n$ $c$l$a$s$s$N$a$m$e$=$"$f$o$n$t$-$s$e$m$i$b$o$l$d$"$>${$u$s$e$r$E$m$a$i$l$}$<$/$s$p$a$n$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$$
$ $ $ $ $ $ $ $ $ $ $ $ ${$/$*$ $R$i$g$h$t$ $s$i$d$e$ $-$ $A$c$t$i$o$n$s$ $*$/$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $s$p$a$c$e$-$x$-$3$ $m$t$-$3$ $s$m$:$m$t$-$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ ${$/$*$ $S$u$c$c$e$s$s$ $M$e$s$s$a$g$e$ $*$/$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ ${$s$e$n$t$ $&$&$ $($$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $b$g$-$g$r$e$e$n$-$5$0$0$ $t$e$x$t$-$w$h$i$t$e$ $p$x$-$3$ $p$y$-$1$.$5$ $r$o$u$n$d$e$d$-$l$g$ $t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$C$h$e$c$k$C$i$r$c$l$e$ $c$l$a$s$s$N$a$m$e$=$"$w$-$4$ $h$-$4$ $m$r$-$1$.$5$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $E$m$a$i$l$ $s$e$n$t$!$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $)$}$$
$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ ${$/$*$ $E$r$r$o$r$ $M$e$s$s$a$g$e$ $*$/$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ ${$e$r$r$o$r$ $&$&$ $($$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $b$g$-$r$e$d$-$5$0$0$ $t$e$x$t$-$w$h$i$t$e$ $p$x$-$3$ $p$y$-$1$.$5$ $r$o$u$n$d$e$d$-$l$g$ $t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$ $m$a$x$-$w$-$x$s$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$A$l$e$r$t$C$i$r$c$l$e$ $c$l$a$s$s$N$a$m$e$=$"$w$-$4$ $h$-$4$ $m$r$-$1$.$5$ $f$l$e$x$-$s$h$r$i$n$k$-$0$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$s$p$a$n$ $c$l$a$s$s$N$a$m$e$=$"$t$r$u$n$c$a$t$e$"$>${$e$r$r$o$r$}$<$/$s$p$a$n$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $)$}$$
$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ ${$/$*$ $R$e$s$e$n$d$ $B$u$t$t$o$n$ $*$/$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ ${$!$s$e$n$t$ $&$&$ $!$e$r$r$o$r$ $&$&$ $($$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$b$u$t$t$o$n$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$l$i$c$k$=${$h$a$n$d$l$e$R$e$s$e$n$d$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $d$i$s$a$b$l$e$d$=${$s$e$n$d$i$n$g$ $|$|$ $c$o$u$n$t$d$o$w$n$ $>$ $0$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $b$g$-$w$h$i$t$e$ $t$e$x$t$-$o$r$a$n$g$e$-$6$0$0$ $p$x$-$4$ $p$y$-$2$ $r$o$u$n$d$e$d$-$l$g$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$s$m$ $h$o$v$e$r$:$b$g$-$o$r$a$n$g$e$-$5$0$ $t$r$a$n$s$i$t$i$o$n$-$c$o$l$o$r$s$ $d$i$s$a$b$l$e$d$:$o$p$a$c$i$t$y$-$5$0$ $d$i$s$a$b$l$e$d$:$c$u$r$s$o$r$-$n$o$t$-$a$l$l$o$w$e$d$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ ${$s$e$n$d$i$n$g$ $?$ $($$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$L$o$a$d$e$r$2$ $c$l$a$s$s$N$a$m$e$=$"$w$-$4$ $h$-$4$ $m$r$-$2$ $a$n$i$m$a$t$e$-$s$p$i$n$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $S$e$n$d$i$n$g$.$.$.$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $)$ $:$ $c$o$u$n$t$d$o$w$n$ $>$ $0$ $?$ $($$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$>$R$e$s$e$n$d$ $i$n$ ${$c$o$u$n$t$d$o$w$n$}$s$<$/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $)$ $:$ $($$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$>$R$e$s$e$n$d$ $E$m$a$i$l$<$/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $)$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$b$u$t$t$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $)$}$$
$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ ${$/$*$ $D$i$s$m$i$s$s$ $B$u$t$t$o$n$ $*$/$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$b$u$t$t$o$n$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$l$i$c$k$=${$h$a$n$d$l$e$D$i$s$m$i$s$s$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$-$s$h$r$i$n$k$-$0$ $p$-$2$ $r$o$u$n$d$e$d$-$l$g$ $t$e$x$t$-$w$h$i$t$e$ $h$o$v$e$r$:$b$g$-$w$h$i$t$e$ $h$o$v$e$r$:$b$g$-$o$p$a$c$i$t$y$-$2$0$ $t$r$a$n$s$i$t$i$o$n$-$c$o$l$o$r$s$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $a$r$i$a$-$l$a$b$e$l$=$"$D$i$s$m$i$s$s$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$X$ $c$l$a$s$s$N$a$m$e$=$"$h$-$5$ $w$-$5$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$b$u$t$t$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $<$/$d$i$v$>$$
$ $ $)$;$$
$}$;$$
$$
$e$x$p$o$r$t$ $d$e$f$a$u$l$t$ $E$m$a$i$l$V$e$r$i$f$i$c$a$t$i$o$n$B$a$n$n$e$r$;$$
$
