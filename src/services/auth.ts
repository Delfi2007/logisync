$/$*$*$$
$ $*$ $A$u$t$h$e$n$t$i$c$a$t$i$o$n$ $S$e$r$v$i$c$e$$
$ $*$ $H$a$n$d$l$e$s$ $u$s$e$r$ $a$u$t$h$e$n$t$i$c$a$t$i$o$n$,$ $r$e$g$i$s$t$r$a$t$i$o$n$,$ $a$n$d$ $t$o$k$e$n$ $m$a$n$a$g$e$m$e$n$t$$
$ $*$/$$
$$
$i$m$p$o$r$t$ $a$p$i$C$l$i$e$n$t$,$ ${$ $A$p$i$S$u$c$c$e$s$s$R$e$s$p$o$n$s$e$,$ $h$a$n$d$l$e$A$p$i$R$e$s$p$o$n$s$e$ $}$ $f$r$o$m$ $'$.$/$a$p$i$'$;$$
$$
$/$/$ $T$y$p$e$s$$
$e$x$p$o$r$t$ $i$n$t$e$r$f$a$c$e$ $U$s$e$r$ ${$$
$ $ $i$d$:$ $n$u$m$b$e$r$;$$
$ $ $e$m$a$i$l$:$ $s$t$r$i$n$g$;$$
$ $ $f$i$r$s$t$_$n$a$m$e$:$ $s$t$r$i$n$g$;$$
$ $ $l$a$s$t$_$n$a$m$e$:$ $s$t$r$i$n$g$;$$
$ $ $f$u$l$l$_$n$a$m$e$?$:$ $s$t$r$i$n$g$;$ $/$/$ $A$d$d$e$d$ $f$o$r$ $c$o$m$p$a$t$i$b$i$l$i$t$y$$
$ $ $p$h$o$n$e$?$:$ $s$t$r$i$n$g$;$$
$ $ $i$s$_$a$c$t$i$v$e$:$ $b$o$o$l$e$a$n$;$$
$ $ $i$s$_$v$e$r$i$f$i$e$d$:$ $b$o$o$l$e$a$n$;$$
$ $ $r$o$l$e$s$:$ $A$r$r$a$y$<${$$
$ $ $ $ $i$d$:$ $n$u$m$b$e$r$;$$
$ $ $ $ $n$a$m$e$:$ $s$t$r$i$n$g$;$$
$ $ $ $ $d$e$s$c$r$i$p$t$i$o$n$:$ $s$t$r$i$n$g$;$$
$ $ $ $ $p$e$r$m$i$s$s$i$o$n$s$:$ $s$t$r$i$n$g$[$]$;$$
$ $ $}$>$;$$
$ $ $c$r$e$a$t$e$d$_$a$t$:$ $s$t$r$i$n$g$;$$
$}$$
$$
$e$x$p$o$r$t$ $i$n$t$e$r$f$a$c$e$ $L$o$g$i$n$C$r$e$d$e$n$t$i$a$l$s$ ${$$
$ $ $e$m$a$i$l$:$ $s$t$r$i$n$g$;$$
$ $ $p$a$s$s$w$o$r$d$:$ $s$t$r$i$n$g$;$$
$}$$
$$
$e$x$p$o$r$t$ $i$n$t$e$r$f$a$c$e$ $R$e$g$i$s$t$e$r$D$a$t$a$ ${$$
$ $ $f$i$r$s$t$N$a$m$e$:$ $s$t$r$i$n$g$;$$
$ $ $l$a$s$t$N$a$m$e$:$ $s$t$r$i$n$g$;$$
$ $ $e$m$a$i$l$:$ $s$t$r$i$n$g$;$$
$ $ $p$a$s$s$w$o$r$d$:$ $s$t$r$i$n$g$;$$
$ $ $p$h$o$n$e$?$:$ $s$t$r$i$n$g$;$$
$}$$
$$
$e$x$p$o$r$t$ $i$n$t$e$r$f$a$c$e$ $A$u$t$h$R$e$s$p$o$n$s$e$ ${$$
$ $ $u$s$e$r$:$ $U$s$e$r$;$$
$ $ $t$o$k$e$n$s$:$ ${$$
$ $ $ $ $a$c$c$e$s$s$T$o$k$e$n$:$ $s$t$r$i$n$g$;$$
$ $ $ $ $r$e$f$r$e$s$h$T$o$k$e$n$:$ $s$t$r$i$n$g$;$$
$ $ $ $ $e$x$p$i$r$e$s$I$n$:$ $s$t$r$i$n$g$;$$
$ $ $}$;$$
$}$$
$$
$/$/$ $A$u$t$h$e$n$t$i$c$a$t$i$o$n$ $A$P$I$ $c$a$l$l$s$$
$e$x$p$o$r$t$ $c$o$n$s$t$ $a$u$t$h$S$e$r$v$i$c$e$ $=$ ${$$
$ $ $/$*$*$$
$ $ $ $*$ $L$o$g$i$n$ $u$s$e$r$$
$ $ $ $*$ $@$p$a$r$a$m$ $c$r$e$d$e$n$t$i$a$l$s$ $E$m$a$i$l$ $a$n$d$ $p$a$s$s$w$o$r$d$$
$ $ $ $*$ $@$r$e$t$u$r$n$s$ $A$u$t$h$ $t$o$k$e$n$ $a$n$d$ $u$s$e$r$ $d$a$t$a$$
$ $ $ $*$/$$
$ $ $l$o$g$i$n$:$ $a$s$y$n$c$ $($c$r$e$d$e$n$t$i$a$l$s$:$ $L$o$g$i$n$C$r$e$d$e$n$t$i$a$l$s$)$:$ $P$r$o$m$i$s$e$<$A$u$t$h$R$e$s$p$o$n$s$e$>$ $=$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $r$e$s$p$o$n$s$e$ $=$ $a$w$a$i$t$ $a$p$i$C$l$i$e$n$t$.$p$o$s$t$<$A$p$i$S$u$c$c$e$s$s$R$e$s$p$o$n$s$e$<$A$u$t$h$R$e$s$p$o$n$s$e$>$>$($$
$ $ $ $ $ $ $'$/$a$u$t$h$/$l$o$g$i$n$'$,$$
$ $ $ $ $ $ $c$r$e$d$e$n$t$i$a$l$s$$
$ $ $ $ $)$;$$
$ $ $ $ $c$o$n$s$t$ $d$a$t$a$ $=$ $h$a$n$d$l$e$A$p$i$R$e$s$p$o$n$s$e$<$A$u$t$h$R$e$s$p$o$n$s$e$>$($r$e$s$p$o$n$s$e$)$;$$
$$
$ $ $ $ $/$/$ $S$t$o$r$e$ $t$o$k$e$n$s$ $a$n$d$ $u$s$e$r$ $i$n$ $l$o$c$a$l$S$t$o$r$a$g$e$$
$ $ $ $ $l$o$c$a$l$S$t$o$r$a$g$e$.$s$e$t$I$t$e$m$($'$a$u$t$h$T$o$k$e$n$'$,$ $d$a$t$a$.$t$o$k$e$n$s$.$a$c$c$e$s$s$T$o$k$e$n$)$;$$
$ $ $ $ $l$o$c$a$l$S$t$o$r$a$g$e$.$s$e$t$I$t$e$m$($'$r$e$f$r$e$s$h$T$o$k$e$n$'$,$ $d$a$t$a$.$t$o$k$e$n$s$.$r$e$f$r$e$s$h$T$o$k$e$n$)$;$$
$ $ $ $ $l$o$c$a$l$S$t$o$r$a$g$e$.$s$e$t$I$t$e$m$($'$u$s$e$r$'$,$ $J$S$O$N$.$s$t$r$i$n$g$i$f$y$($d$a$t$a$.$u$s$e$r$)$)$;$$
$$
$ $ $ $ $r$e$t$u$r$n$ $d$a$t$a$;$$
$ $ $}$,$$
$$
$ $ $/$*$*$$
$ $ $ $*$ $R$e$g$i$s$t$e$r$ $n$e$w$ $u$s$e$r$$
$ $ $ $*$ $@$p$a$r$a$m$ $u$s$e$r$D$a$t$a$ $U$s$e$r$ $r$e$g$i$s$t$r$a$t$i$o$n$ $d$a$t$a$$
$ $ $ $*$ $@$r$e$t$u$r$n$s$ $A$u$t$h$ $t$o$k$e$n$ $a$n$d$ $u$s$e$r$ $d$a$t$a$$
$ $ $ $*$/$$
$ $ $r$e$g$i$s$t$e$r$:$ $a$s$y$n$c$ $($u$s$e$r$D$a$t$a$:$ $R$e$g$i$s$t$e$r$D$a$t$a$)$:$ $P$r$o$m$i$s$e$<$A$u$t$h$R$e$s$p$o$n$s$e$>$ $=$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $r$e$s$p$o$n$s$e$ $=$ $a$w$a$i$t$ $a$p$i$C$l$i$e$n$t$.$p$o$s$t$<$A$p$i$S$u$c$c$e$s$s$R$e$s$p$o$n$s$e$<$A$u$t$h$R$e$s$p$o$n$s$e$>$>$($$
$ $ $ $ $ $ $'$/$a$u$t$h$/$r$e$g$i$s$t$e$r$'$,$$
$ $ $ $ $ $ $u$s$e$r$D$a$t$a$$
$ $ $ $ $)$;$$
$ $ $ $ $c$o$n$s$t$ $d$a$t$a$ $=$ $h$a$n$d$l$e$A$p$i$R$e$s$p$o$n$s$e$<$A$u$t$h$R$e$s$p$o$n$s$e$>$($r$e$s$p$o$n$s$e$)$;$$
$$
$ $ $ $ $/$/$ $S$t$o$r$e$ $t$o$k$e$n$s$ $a$n$d$ $u$s$e$r$ $i$n$ $l$o$c$a$l$S$t$o$r$a$g$e$$
$ $ $ $ $l$o$c$a$l$S$t$o$r$a$g$e$.$s$e$t$I$t$e$m$($'$a$u$t$h$T$o$k$e$n$'$,$ $d$a$t$a$.$t$o$k$e$n$s$.$a$c$c$e$s$s$T$o$k$e$n$)$;$$
$ $ $ $ $l$o$c$a$l$S$t$o$r$a$g$e$.$s$e$t$I$t$e$m$($'$r$e$f$r$e$s$h$T$o$k$e$n$'$,$ $d$a$t$a$.$t$o$k$e$n$s$.$r$e$f$r$e$s$h$T$o$k$e$n$)$;$$
$ $ $ $ $l$o$c$a$l$S$t$o$r$a$g$e$.$s$e$t$I$t$e$m$($'$u$s$e$r$'$,$ $J$S$O$N$.$s$t$r$i$n$g$i$f$y$($d$a$t$a$.$u$s$e$r$)$)$;$$
$$
$ $ $ $ $r$e$t$u$r$n$ $d$a$t$a$;$$
$ $ $}$,$$
$$
$ $ $/$*$*$$
$ $ $ $*$ $L$o$g$o$u$t$ $u$s$e$r$$
$ $ $ $*$ $C$l$e$a$r$s$ $t$o$k$e$n$ $a$n$d$ $u$s$e$r$ $d$a$t$a$ $f$r$o$m$ $l$o$c$a$l$S$t$o$r$a$g$e$$
$ $ $ $*$/$$
$ $ $l$o$g$o$u$t$:$ $($)$ $=$>$ ${$$
$ $ $ $ $l$o$c$a$l$S$t$o$r$a$g$e$.$r$e$m$o$v$e$I$t$e$m$($'$a$u$t$h$T$o$k$e$n$'$)$;$$
$ $ $ $ $l$o$c$a$l$S$t$o$r$a$g$e$.$r$e$m$o$v$e$I$t$e$m$($'$r$e$f$r$e$s$h$T$o$k$e$n$'$)$;$$
$ $ $ $ $l$o$c$a$l$S$t$o$r$a$g$e$.$r$e$m$o$v$e$I$t$e$m$($'$u$s$e$r$'$)$;$$
$ $ $}$,$$
$$
$ $ $/$*$*$$
$ $ $ $*$ $G$e$t$ $c$u$r$r$e$n$t$ $u$s$e$r$ $f$r$o$m$ $l$o$c$a$l$S$t$o$r$a$g$e$$
$ $ $ $*$ $@$r$e$t$u$r$n$s$ $U$s$e$r$ $d$a$t$a$ $o$r$ $n$u$l$l$$
$ $ $ $*$/$$
$ $ $g$e$t$C$u$r$r$e$n$t$U$s$e$r$:$ $($)$:$ $U$s$e$r$ $|$ $n$u$l$l$ $=$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $u$s$e$r$S$t$r$ $=$ $l$o$c$a$l$S$t$o$r$a$g$e$.$g$e$t$I$t$e$m$($'$u$s$e$r$'$)$;$$
$ $ $ $ $i$f$ $($u$s$e$r$S$t$r$)$ ${$$
$ $ $ $ $ $ $t$r$y$ ${$$
$ $ $ $ $ $ $ $ $r$e$t$u$r$n$ $J$S$O$N$.$p$a$r$s$e$($u$s$e$r$S$t$r$)$;$$
$ $ $ $ $ $ $}$ $c$a$t$c$h$ ${$$
$ $ $ $ $ $ $ $ $r$e$t$u$r$n$ $n$u$l$l$;$$
$ $ $ $ $ $ $}$$
$ $ $ $ $}$$
$ $ $ $ $r$e$t$u$r$n$ $n$u$l$l$;$$
$ $ $}$,$$
$$
$ $ $/$*$*$$
$ $ $ $*$ $G$e$t$ $c$u$r$r$e$n$t$ $a$u$t$h$ $t$o$k$e$n$$
$ $ $ $*$ $@$r$e$t$u$r$n$s$ $T$o$k$e$n$ $o$r$ $n$u$l$l$$
$ $ $ $*$/$$
$ $ $g$e$t$T$o$k$e$n$:$ $($)$:$ $s$t$r$i$n$g$ $|$ $n$u$l$l$ $=$>$ ${$$
$ $ $ $ $r$e$t$u$r$n$ $l$o$c$a$l$S$t$o$r$a$g$e$.$g$e$t$I$t$e$m$($'$a$u$t$h$T$o$k$e$n$'$)$;$$
$ $ $}$,$$
$$
$ $ $/$*$*$$
$ $ $ $*$ $G$e$t$ $r$e$f$r$e$s$h$ $t$o$k$e$n$$
$ $ $ $*$ $@$r$e$t$u$r$n$s$ $R$e$f$r$e$s$h$ $t$o$k$e$n$ $o$r$ $n$u$l$l$$
$ $ $ $*$/$$
$ $ $g$e$t$R$e$f$r$e$s$h$T$o$k$e$n$:$ $($)$:$ $s$t$r$i$n$g$ $|$ $n$u$l$l$ $=$>$ ${$$
$ $ $ $ $r$e$t$u$r$n$ $l$o$c$a$l$S$t$o$r$a$g$e$.$g$e$t$I$t$e$m$($'$r$e$f$r$e$s$h$T$o$k$e$n$'$)$;$$
$ $ $}$,$$
$$
$ $ $/$*$*$$
$ $ $ $*$ $R$e$f$r$e$s$h$ $a$c$c$e$s$s$ $t$o$k$e$n$ $u$s$i$n$g$ $r$e$f$r$e$s$h$ $t$o$k$e$n$$
$ $ $ $*$ $@$r$e$t$u$r$n$s$ $N$e$w$ $t$o$k$e$n$s$$
$ $ $ $*$/$$
$ $ $r$e$f$r$e$s$h$A$c$c$e$s$s$T$o$k$e$n$:$ $a$s$y$n$c$ $($)$:$ $P$r$o$m$i$s$e$<${$ $a$c$c$e$s$s$T$o$k$e$n$:$ $s$t$r$i$n$g$;$ $r$e$f$r$e$s$h$T$o$k$e$n$:$ $s$t$r$i$n$g$ $}$ $|$ $n$u$l$l$>$ $=$>$ ${$$
$ $ $ $ $t$r$y$ ${$$
$ $ $ $ $ $ $c$o$n$s$t$ $r$e$f$r$e$s$h$T$o$k$e$n$ $=$ $l$o$c$a$l$S$t$o$r$a$g$e$.$g$e$t$I$t$e$m$($'$r$e$f$r$e$s$h$T$o$k$e$n$'$)$;$$
$ $ $ $ $ $ $i$f$ $($!$r$e$f$r$e$s$h$T$o$k$e$n$)$ ${$$
$ $ $ $ $ $ $ $ $r$e$t$u$r$n$ $n$u$l$l$;$$
$ $ $ $ $ $ $}$$
$$
$ $ $ $ $ $ $c$o$n$s$t$ $r$e$s$p$o$n$s$e$ $=$ $a$w$a$i$t$ $a$p$i$C$l$i$e$n$t$.$p$o$s$t$<$A$p$i$S$u$c$c$e$s$s$R$e$s$p$o$n$s$e$<${$ $t$o$k$e$n$s$:$ ${$ $a$c$c$e$s$s$T$o$k$e$n$:$ $s$t$r$i$n$g$;$ $r$e$f$r$e$s$h$T$o$k$e$n$:$ $s$t$r$i$n$g$;$ $e$x$p$i$r$e$s$I$n$:$ $s$t$r$i$n$g$ $}$ $}$>$>$($$
$ $ $ $ $ $ $ $ $'$/$a$u$t$h$/$r$e$f$r$e$s$h$-$t$o$k$e$n$'$,$$
$ $ $ $ $ $ $ $ ${$ $r$e$f$r$e$s$h$T$o$k$e$n$ $}$$
$ $ $ $ $ $ $)$;$$
$ $ $ $ $ $ $c$o$n$s$t$ $d$a$t$a$ $=$ $h$a$n$d$l$e$A$p$i$R$e$s$p$o$n$s$e$($r$e$s$p$o$n$s$e$)$;$$
$$
$ $ $ $ $ $ $/$/$ $U$p$d$a$t$e$ $t$o$k$e$n$s$ $i$n$ $l$o$c$a$l$S$t$o$r$a$g$e$$
$ $ $ $ $ $ $l$o$c$a$l$S$t$o$r$a$g$e$.$s$e$t$I$t$e$m$($'$a$u$t$h$T$o$k$e$n$'$,$ $d$a$t$a$.$t$o$k$e$n$s$.$a$c$c$e$s$s$T$o$k$e$n$)$;$$
$ $ $ $ $ $ $l$o$c$a$l$S$t$o$r$a$g$e$.$s$e$t$I$t$e$m$($'$r$e$f$r$e$s$h$T$o$k$e$n$'$,$ $d$a$t$a$.$t$o$k$e$n$s$.$r$e$f$r$e$s$h$T$o$k$e$n$)$;$$
$$
$ $ $ $ $ $ $r$e$t$u$r$n$ ${$$
$ $ $ $ $ $ $ $ $a$c$c$e$s$s$T$o$k$e$n$:$ $d$a$t$a$.$t$o$k$e$n$s$.$a$c$c$e$s$s$T$o$k$e$n$,$$
$ $ $ $ $ $ $ $ $r$e$f$r$e$s$h$T$o$k$e$n$:$ $d$a$t$a$.$t$o$k$e$n$s$.$r$e$f$r$e$s$h$T$o$k$e$n$$
$ $ $ $ $ $ $}$;$$
$ $ $ $ $}$ $c$a$t$c$h$ $($e$r$r$o$r$)$ ${$$
$ $ $ $ $ $ $/$/$ $I$f$ $r$e$f$r$e$s$h$ $f$a$i$l$s$,$ $l$o$g$o$u$t$ $u$s$e$r$$
$ $ $ $ $ $ $a$u$t$h$S$e$r$v$i$c$e$.$l$o$g$o$u$t$($)$;$$
$ $ $ $ $ $ $r$e$t$u$r$n$ $n$u$l$l$;$$
$ $ $ $ $}$$
$ $ $}$,$$
$$
$ $ $/$*$*$$
$ $ $ $*$ $C$h$e$c$k$ $i$f$ $u$s$e$r$ $i$s$ $a$u$t$h$e$n$t$i$c$a$t$e$d$$
$ $ $ $*$ $@$r$e$t$u$r$n$s$ $t$r$u$e$ $i$f$ $t$o$k$e$n$ $e$x$i$s$t$s$$
$ $ $ $*$/$$
$ $ $i$s$A$u$t$h$e$n$t$i$c$a$t$e$d$:$ $($)$:$ $b$o$o$l$e$a$n$ $=$>$ ${$$
$ $ $ $ $r$e$t$u$r$n$ $!$!$l$o$c$a$l$S$t$o$r$a$g$e$.$g$e$t$I$t$e$m$($'$a$u$t$h$T$o$k$e$n$'$)$;$$
$ $ $}$,$$
$$
$ $ $/$*$*$$
$ $ $ $*$ $V$e$r$i$f$y$ $e$m$a$i$l$ $w$i$t$h$ $t$o$k$e$n$$
$ $ $ $*$ $@$p$a$r$a$m$ $t$o$k$e$n$ $V$e$r$i$f$i$c$a$t$i$o$n$ $t$o$k$e$n$ $f$r$o$m$ $e$m$a$i$l$$
$ $ $ $*$ $@$r$e$t$u$r$n$s$ $V$e$r$i$f$i$c$a$t$i$o$n$ $r$e$s$u$l$t$$
$ $ $ $*$/$$
$ $ $v$e$r$i$f$y$E$m$a$i$l$:$ $a$s$y$n$c$ $($t$o$k$e$n$:$ $s$t$r$i$n$g$)$:$ $P$r$o$m$i$s$e$<${$ $m$e$s$s$a$g$e$:$ $s$t$r$i$n$g$;$ $v$e$r$i$f$i$e$d$:$ $b$o$o$l$e$a$n$ $}$>$ $=$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $r$e$s$p$o$n$s$e$ $=$ $a$w$a$i$t$ $a$p$i$C$l$i$e$n$t$.$g$e$t$<$A$p$i$S$u$c$c$e$s$s$R$e$s$p$o$n$s$e$<${$ $m$e$s$s$a$g$e$:$ $s$t$r$i$n$g$;$ $v$e$r$i$f$i$e$d$:$ $b$o$o$l$e$a$n$ $}$>$>$($$
$ $ $ $ $ $ $`$/$a$u$t$h$/$v$e$r$i$f$y$-$e$m$a$i$l$/$$${$t$o$k$e$n$}$`$$
$ $ $ $ $)$;$$
$ $ $ $ $r$e$t$u$r$n$ $h$a$n$d$l$e$A$p$i$R$e$s$p$o$n$s$e$($r$e$s$p$o$n$s$e$)$;$$
$ $ $}$,$$
$$
$ $ $/$*$*$$
$ $ $ $*$ $R$e$s$e$n$d$ $v$e$r$i$f$i$c$a$t$i$o$n$ $e$m$a$i$l$$
$ $ $ $*$ $@$p$a$r$a$m$ $e$m$a$i$l$ $U$s$e$r$ $e$m$a$i$l$ $a$d$d$r$e$s$s$$
$ $ $ $*$ $@$r$e$t$u$r$n$s$ $S$u$c$c$e$s$s$ $m$e$s$s$a$g$e$$
$ $ $ $*$/$$
$ $ $r$e$s$e$n$d$V$e$r$i$f$i$c$a$t$i$o$n$:$ $a$s$y$n$c$ $($e$m$a$i$l$:$ $s$t$r$i$n$g$)$:$ $P$r$o$m$i$s$e$<${$ $m$e$s$s$a$g$e$:$ $s$t$r$i$n$g$ $}$>$ $=$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $r$e$s$p$o$n$s$e$ $=$ $a$w$a$i$t$ $a$p$i$C$l$i$e$n$t$.$p$o$s$t$<$A$p$i$S$u$c$c$e$s$s$R$e$s$p$o$n$s$e$<${$ $m$e$s$s$a$g$e$:$ $s$t$r$i$n$g$ $}$>$>$($$
$ $ $ $ $ $ $'$/$a$u$t$h$/$r$e$s$e$n$d$-$v$e$r$i$f$i$c$a$t$i$o$n$'$,$$
$ $ $ $ $ $ ${$ $e$m$a$i$l$ $}$$
$ $ $ $ $)$;$$
$ $ $ $ $r$e$t$u$r$n$ $h$a$n$d$l$e$A$p$i$R$e$s$p$o$n$s$e$($r$e$s$p$o$n$s$e$)$;$$
$ $ $}$,$$
$$
$ $ $/$*$*$$
$ $ $ $*$ $R$e$q$u$e$s$t$ $p$a$s$s$w$o$r$d$ $r$e$s$e$t$$
$ $ $ $*$ $@$p$a$r$a$m$ $e$m$a$i$l$ $U$s$e$r$ $e$m$a$i$l$ $a$d$d$r$e$s$s$$
$ $ $ $*$ $@$r$e$t$u$r$n$s$ $S$u$c$c$e$s$s$ $m$e$s$s$a$g$e$$
$ $ $ $*$/$$
$ $ $f$o$r$g$o$t$P$a$s$s$w$o$r$d$:$ $a$s$y$n$c$ $($e$m$a$i$l$:$ $s$t$r$i$n$g$)$:$ $P$r$o$m$i$s$e$<${$ $m$e$s$s$a$g$e$:$ $s$t$r$i$n$g$ $}$>$ $=$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $r$e$s$p$o$n$s$e$ $=$ $a$w$a$i$t$ $a$p$i$C$l$i$e$n$t$.$p$o$s$t$<$A$p$i$S$u$c$c$e$s$s$R$e$s$p$o$n$s$e$<${$ $m$e$s$s$a$g$e$:$ $s$t$r$i$n$g$ $}$>$>$($$
$ $ $ $ $ $ $'$/$a$u$t$h$/$f$o$r$g$o$t$-$p$a$s$s$w$o$r$d$'$,$$
$ $ $ $ $ $ ${$ $e$m$a$i$l$ $}$$
$ $ $ $ $)$;$$
$ $ $ $ $r$e$t$u$r$n$ $h$a$n$d$l$e$A$p$i$R$e$s$p$o$n$s$e$($r$e$s$p$o$n$s$e$)$;$$
$ $ $}$,$$
$$
$ $ $/$*$*$$
$ $ $ $*$ $R$e$s$e$t$ $p$a$s$s$w$o$r$d$ $w$i$t$h$ $t$o$k$e$n$$
$ $ $ $*$ $@$p$a$r$a$m$ $t$o$k$e$n$ $R$e$s$e$t$ $t$o$k$e$n$ $f$r$o$m$ $e$m$a$i$l$$
$ $ $ $*$ $@$p$a$r$a$m$ $n$e$w$P$a$s$s$w$o$r$d$ $N$e$w$ $p$a$s$s$w$o$r$d$$
$ $ $ $*$ $@$r$e$t$u$r$n$s$ $S$u$c$c$e$s$s$ $m$e$s$s$a$g$e$$
$ $ $ $*$/$$
$ $ $r$e$s$e$t$P$a$s$s$w$o$r$d$:$ $a$s$y$n$c$ $($t$o$k$e$n$:$ $s$t$r$i$n$g$,$ $n$e$w$P$a$s$s$w$o$r$d$:$ $s$t$r$i$n$g$)$:$ $P$r$o$m$i$s$e$<${$ $m$e$s$s$a$g$e$:$ $s$t$r$i$n$g$ $}$>$ $=$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $r$e$s$p$o$n$s$e$ $=$ $a$w$a$i$t$ $a$p$i$C$l$i$e$n$t$.$p$o$s$t$<$A$p$i$S$u$c$c$e$s$s$R$e$s$p$o$n$s$e$<${$ $m$e$s$s$a$g$e$:$ $s$t$r$i$n$g$ $}$>$>$($$
$ $ $ $ $ $ $'$/$a$u$t$h$/$r$e$s$e$t$-$p$a$s$s$w$o$r$d$'$,$$
$ $ $ $ $ $ ${$ $t$o$k$e$n$,$ $p$a$s$s$w$o$r$d$:$ $n$e$w$P$a$s$s$w$o$r$d$,$ $c$o$n$f$i$r$m$P$a$s$s$w$o$r$d$:$ $n$e$w$P$a$s$s$w$o$r$d$ $}$$
$ $ $ $ $)$;$$
$ $ $ $ $r$e$t$u$r$n$ $h$a$n$d$l$e$A$p$i$R$e$s$p$o$n$s$e$($r$e$s$p$o$n$s$e$)$;$$
$ $ $}$,$$
$}$;$$
$$
$e$x$p$o$r$t$ $d$e$f$a$u$l$t$ $a$u$t$h$S$e$r$v$i$c$e$;$$
$
