$/$*$*$$
$ $*$ $B$a$s$e$ $A$P$I$ $C$o$n$f$i$g$u$r$a$t$i$o$n$$
$ $*$ $H$a$n$d$l$e$s$ $a$x$i$o$s$ $s$e$t$u$p$,$ $i$n$t$e$r$c$e$p$t$o$r$s$,$ $a$n$d$ $c$o$m$m$o$n$ $A$P$I$ $u$t$i$l$i$t$i$e$s$$
$ $*$/$$
$$
$i$m$p$o$r$t$ $a$x$i$o$s$,$ ${$ $A$x$i$o$s$E$r$r$o$r$,$ $A$x$i$o$s$R$e$s$p$o$n$s$e$,$ $I$n$t$e$r$n$a$l$A$x$i$o$s$R$e$q$u$e$s$t$C$o$n$f$i$g$ $}$ $f$r$o$m$ $'$a$x$i$o$s$'$;$$
$$
$/$/$ $A$P$I$ $b$a$s$e$ $U$R$L$ $-$ $u$s$e$s$ $e$n$v$i$r$o$n$m$e$n$t$ $v$a$r$i$a$b$l$e$ $w$i$t$h$ $f$a$l$l$b$a$c$k$$
$c$o$n$s$t$ $A$P$I$_$B$A$S$E$_$U$R$L$ $=$ $i$m$p$o$r$t$.$m$e$t$a$.$e$n$v$.$V$I$T$E$_$A$P$I$_$B$A$S$E$_$U$R$L$ $|$|$ $'$h$t$t$p$:$/$/$l$o$c$a$l$h$o$s$t$:$5$0$0$0$/$a$p$i$'$;$$
$$
$/$/$ $C$r$e$a$t$e$ $a$x$i$o$s$ $i$n$s$t$a$n$c$e$ $w$i$t$h$ $d$e$f$a$u$l$t$ $c$o$n$f$i$g$$
$e$x$p$o$r$t$ $c$o$n$s$t$ $a$p$i$C$l$i$e$n$t$ $=$ $a$x$i$o$s$.$c$r$e$a$t$e$(${$$
$ $ $b$a$s$e$U$R$L$:$ $A$P$I$_$B$A$S$E$_$U$R$L$,$$
$ $ $t$i$m$e$o$u$t$:$ $3$0$0$0$0$,$ $/$/$ $3$0$ $s$e$c$o$n$d$s$$
$ $ $h$e$a$d$e$r$s$:$ ${$$
$ $ $ $ $'$C$o$n$t$e$n$t$-$T$y$p$e$'$:$ $'$a$p$p$l$i$c$a$t$i$o$n$/$j$s$o$n$'$,$$
$ $ $}$,$$
$}$)$;$$
$$
$/$/$ $R$e$q$u$e$s$t$ $i$n$t$e$r$c$e$p$t$o$r$ $-$ $A$d$d$ $a$u$t$h$ $t$o$k$e$n$ $t$o$ $a$l$l$ $r$e$q$u$e$s$t$s$$
$a$p$i$C$l$i$e$n$t$.$i$n$t$e$r$c$e$p$t$o$r$s$.$r$e$q$u$e$s$t$.$u$s$e$($$
$ $ $($c$o$n$f$i$g$:$ $I$n$t$e$r$n$a$l$A$x$i$o$s$R$e$q$u$e$s$t$C$o$n$f$i$g$)$ $=$>$ ${$$
$ $ $ $ $/$/$ $G$e$t$ $t$o$k$e$n$ $f$r$o$m$ $l$o$c$a$l$S$t$o$r$a$g$e$$
$ $ $ $ $c$o$n$s$t$ $t$o$k$e$n$ $=$ $l$o$c$a$l$S$t$o$r$a$g$e$.$g$e$t$I$t$e$m$($'$a$u$t$h$T$o$k$e$n$'$)$;$$
$ $ $ $ $$
$ $ $ $ $/$/$ $A$d$d$ $A$u$t$h$o$r$i$z$a$t$i$o$n$ $h$e$a$d$e$r$ $i$f$ $t$o$k$e$n$ $e$x$i$s$t$s$$
$ $ $ $ $i$f$ $($t$o$k$e$n$ $&$&$ $c$o$n$f$i$g$.$h$e$a$d$e$r$s$)$ ${$$
$ $ $ $ $ $ $c$o$n$f$i$g$.$h$e$a$d$e$r$s$.$A$u$t$h$o$r$i$z$a$t$i$o$n$ $=$ $`$B$e$a$r$e$r$ $$${$t$o$k$e$n$}$`$;$$
$ $ $ $ $}$$
$ $ $ $ $$
$ $ $ $ $r$e$t$u$r$n$ $c$o$n$f$i$g$;$$
$ $ $}$,$$
$ $ $($e$r$r$o$r$:$ $A$x$i$o$s$E$r$r$o$r$)$ $=$>$ ${$$
$ $ $ $ $r$e$t$u$r$n$ $P$r$o$m$i$s$e$.$r$e$j$e$c$t$($e$r$r$o$r$)$;$$
$ $ $}$$
$)$;$$
$$
$/$/$ $R$e$s$p$o$n$s$e$ $i$n$t$e$r$c$e$p$t$o$r$ $-$ $H$a$n$d$l$e$ $c$o$m$m$o$n$ $e$r$r$o$r$s$$
$a$p$i$C$l$i$e$n$t$.$i$n$t$e$r$c$e$p$t$o$r$s$.$r$e$s$p$o$n$s$e$.$u$s$e$($$
$ $ $($r$e$s$p$o$n$s$e$:$ $A$x$i$o$s$R$e$s$p$o$n$s$e$)$ $=$>$ ${$$
$ $ $ $ $/$/$ $R$e$t$u$r$n$ $t$h$e$ $d$a$t$a$ $d$i$r$e$c$t$l$y$ $f$o$r$ $s$u$c$c$e$s$s$f$u$l$ $r$e$s$p$o$n$s$e$s$$
$ $ $ $ $r$e$t$u$r$n$ $r$e$s$p$o$n$s$e$;$$
$ $ $}$,$$
$ $ $a$s$y$n$c$ $($e$r$r$o$r$:$ $A$x$i$o$s$E$r$r$o$r$<$A$p$i$E$r$r$o$r$R$e$s$p$o$n$s$e$>$)$ $=$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $o$r$i$g$i$n$a$l$R$e$q$u$e$s$t$ $=$ $e$r$r$o$r$.$c$o$n$f$i$g$ $a$s$ $I$n$t$e$r$n$a$l$A$x$i$o$s$R$e$q$u$e$s$t$C$o$n$f$i$g$ $&$ ${$ $_$r$e$t$r$y$?$:$ $b$o$o$l$e$a$n$ $}$;$$
$ $ $ $ $$
$ $ $ $ $/$/$ $H$a$n$d$l$e$ $d$i$f$f$e$r$e$n$t$ $e$r$r$o$r$ $s$c$e$n$a$r$i$o$s$$
$ $ $ $ $i$f$ $($e$r$r$o$r$.$r$e$s$p$o$n$s$e$)$ ${$$
$ $ $ $ $ $ $/$/$ $S$e$r$v$e$r$ $r$e$s$p$o$n$d$e$d$ $w$i$t$h$ $e$r$r$o$r$ $s$t$a$t$u$s$$
$ $ $ $ $ $ $c$o$n$s$t$ ${$ $s$t$a$t$u$s$,$ $d$a$t$a$ $}$ $=$ $e$r$r$o$r$.$r$e$s$p$o$n$s$e$;$$
$ $ $ $ $ $ $$
$ $ $ $ $ $ $s$w$i$t$c$h$ $($s$t$a$t$u$s$)$ ${$$
$ $ $ $ $ $ $ $ $c$a$s$e$ $4$0$1$:$$
$ $ $ $ $ $ $ $ $ $ $/$/$ $U$n$a$u$t$h$o$r$i$z$e$d$ $-$ $t$r$y$ $t$o$ $r$e$f$r$e$s$h$ $t$o$k$e$n$$
$ $ $ $ $ $ $ $ $ $ $i$f$ $($!$o$r$i$g$i$n$a$l$R$e$q$u$e$s$t$.$_$r$e$t$r$y$)$ ${$$
$ $ $ $ $ $ $ $ $ $ $ $ $o$r$i$g$i$n$a$l$R$e$q$u$e$s$t$.$_$r$e$t$r$y$ $=$ $t$r$u$e$;$$
$ $ $ $ $ $ $ $ $ $ $ $ $$
$ $ $ $ $ $ $ $ $ $ $ $ $t$r$y$ ${$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $/$/$ $D$y$n$a$m$i$c$a$l$l$y$ $i$m$p$o$r$t$ $a$u$t$h$S$e$r$v$i$c$e$ $t$o$ $a$v$o$i$d$ $c$i$r$c$u$l$a$r$ $d$e$p$e$n$d$e$n$c$y$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$o$n$s$t$ ${$ $d$e$f$a$u$l$t$:$ $a$u$t$h$S$e$r$v$i$c$e$ $}$ $=$ $a$w$a$i$t$ $i$m$p$o$r$t$($'$.$/$a$u$t$h$'$)$;$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$o$n$s$t$ $t$o$k$e$n$s$ $=$ $a$w$a$i$t$ $a$u$t$h$S$e$r$v$i$c$e$.$r$e$f$r$e$s$h$A$c$c$e$s$s$T$o$k$e$n$($)$;$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $i$f$ $($t$o$k$e$n$s$ $&$&$ $o$r$i$g$i$n$a$l$R$e$q$u$e$s$t$.$h$e$a$d$e$r$s$)$ ${$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $/$/$ $U$p$d$a$t$e$ $A$u$t$h$o$r$i$z$a$t$i$o$n$ $h$e$a$d$e$r$ $w$i$t$h$ $n$e$w$ $t$o$k$e$n$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$r$i$g$i$n$a$l$R$e$q$u$e$s$t$.$h$e$a$d$e$r$s$.$A$u$t$h$o$r$i$z$a$t$i$o$n$ $=$ $`$B$e$a$r$e$r$ $$${$t$o$k$e$n$s$.$a$c$c$e$s$s$T$o$k$e$n$}$`$;$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $/$/$ $R$e$t$r$y$ $t$h$e$ $o$r$i$g$i$n$a$l$ $r$e$q$u$e$s$t$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $r$e$t$u$r$n$ $a$p$i$C$l$i$e$n$t$($o$r$i$g$i$n$a$l$R$e$q$u$e$s$t$)$;$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $}$$
$ $ $ $ $ $ $ $ $ $ $ $ $}$ $c$a$t$c$h$ $($r$e$f$r$e$s$h$E$r$r$o$r$)$ ${$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $/$/$ $R$e$f$r$e$s$h$ $f$a$i$l$e$d$,$ $r$e$d$i$r$e$c$t$ $t$o$ $l$o$g$i$n$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $l$o$c$a$l$S$t$o$r$a$g$e$.$r$e$m$o$v$e$I$t$e$m$($'$a$u$t$h$T$o$k$e$n$'$)$;$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $l$o$c$a$l$S$t$o$r$a$g$e$.$r$e$m$o$v$e$I$t$e$m$($'$r$e$f$r$e$s$h$T$o$k$e$n$'$)$;$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $l$o$c$a$l$S$t$o$r$a$g$e$.$r$e$m$o$v$e$I$t$e$m$($'$u$s$e$r$'$)$;$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $i$f$ $($!$w$i$n$d$o$w$.$l$o$c$a$t$i$o$n$.$p$a$t$h$n$a$m$e$.$i$n$c$l$u$d$e$s$($'$/$l$o$g$i$n$'$)$)$ ${$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $w$i$n$d$o$w$.$l$o$c$a$t$i$o$n$.$h$r$e$f$ $=$ $'$/$l$o$g$i$n$'$;$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $r$e$t$u$r$n$ $P$r$o$m$i$s$e$.$r$e$j$e$c$t$($r$e$f$r$e$s$h$E$r$r$o$r$)$;$$
$ $ $ $ $ $ $ $ $ $ $ $ $}$$
$ $ $ $ $ $ $ $ $ $ $}$$
$ $ $ $ $ $ $ $ $ $ $$
$ $ $ $ $ $ $ $ $ $ $/$/$ $I$f$ $r$e$t$r$y$ $f$a$i$l$e$d$ $o$r$ $a$l$r$e$a$d$y$ $r$e$t$r$i$e$d$,$ $c$l$e$a$r$ $a$u$t$h$ $a$n$d$ $r$e$d$i$r$e$c$t$$
$ $ $ $ $ $ $ $ $ $ $l$o$c$a$l$S$t$o$r$a$g$e$.$r$e$m$o$v$e$I$t$e$m$($'$a$u$t$h$T$o$k$e$n$'$)$;$$
$ $ $ $ $ $ $ $ $ $ $l$o$c$a$l$S$t$o$r$a$g$e$.$r$e$m$o$v$e$I$t$e$m$($'$r$e$f$r$e$s$h$T$o$k$e$n$'$)$;$$
$ $ $ $ $ $ $ $ $ $ $l$o$c$a$l$S$t$o$r$a$g$e$.$r$e$m$o$v$e$I$t$e$m$($'$u$s$e$r$'$)$;$$
$ $ $ $ $ $ $ $ $ $ $$
$ $ $ $ $ $ $ $ $ $ $i$f$ $($!$w$i$n$d$o$w$.$l$o$c$a$t$i$o$n$.$p$a$t$h$n$a$m$e$.$i$n$c$l$u$d$e$s$($'$/$l$o$g$i$n$'$)$)$ ${$$
$ $ $ $ $ $ $ $ $ $ $ $ $w$i$n$d$o$w$.$l$o$c$a$t$i$o$n$.$h$r$e$f$ $=$ $'$/$l$o$g$i$n$'$;$$
$ $ $ $ $ $ $ $ $ $ $}$$
$ $ $ $ $ $ $ $ $ $ $b$r$e$a$k$;$$
$ $ $ $ $ $ $ $ $ $ $$
$ $ $ $ $ $ $ $ $c$a$s$e$ $4$0$3$:$$
$ $ $ $ $ $ $ $ $ $ $/$/$ $F$o$r$b$i$d$d$e$n$ $-$ $u$s$e$r$ $d$o$e$s$n$'$t$ $h$a$v$e$ $p$e$r$m$i$s$s$i$o$n$$
$ $ $ $ $ $ $ $ $ $ $c$o$n$s$o$l$e$.$e$r$r$o$r$($'$A$c$c$e$s$s$ $f$o$r$b$i$d$d$e$n$:$'$,$ $d$a$t$a$.$e$r$r$o$r$)$;$$
$ $ $ $ $ $ $ $ $ $ $b$r$e$a$k$;$$
$ $ $ $ $ $ $ $ $ $ $$
$ $ $ $ $ $ $ $ $c$a$s$e$ $4$0$4$:$$
$ $ $ $ $ $ $ $ $ $ $/$/$ $N$o$t$ $f$o$u$n$d$$
$ $ $ $ $ $ $ $ $ $ $c$o$n$s$o$l$e$.$e$r$r$o$r$($'$R$e$s$o$u$r$c$e$ $n$o$t$ $f$o$u$n$d$:$'$,$ $d$a$t$a$.$e$r$r$o$r$)$;$$
$ $ $ $ $ $ $ $ $ $ $b$r$e$a$k$;$$
$ $ $ $ $ $ $ $ $ $ $$
$ $ $ $ $ $ $ $ $c$a$s$e$ $5$0$0$:$$
$ $ $ $ $ $ $ $ $ $ $/$/$ $S$e$r$v$e$r$ $e$r$r$o$r$$
$ $ $ $ $ $ $ $ $ $ $c$o$n$s$o$l$e$.$e$r$r$o$r$($'$S$e$r$v$e$r$ $e$r$r$o$r$:$'$,$ $d$a$t$a$.$e$r$r$o$r$)$;$$
$ $ $ $ $ $ $ $ $ $ $b$r$e$a$k$;$$
$ $ $ $ $ $ $ $ $ $ $$
$ $ $ $ $ $ $ $ $d$e$f$a$u$l$t$:$$
$ $ $ $ $ $ $ $ $ $ $c$o$n$s$o$l$e$.$e$r$r$o$r$($'$A$P$I$ $e$r$r$o$r$:$'$,$ $d$a$t$a$.$e$r$r$o$r$)$;$$
$ $ $ $ $ $ $}$$
$ $ $ $ $ $ $$
$ $ $ $ $ $ $/$/$ $R$e$t$u$r$n$ $f$o$r$m$a$t$t$e$d$ $e$r$r$o$r$$
$ $ $ $ $ $ $r$e$t$u$r$n$ $P$r$o$m$i$s$e$.$r$e$j$e$c$t$(${$$
$ $ $ $ $ $ $ $ $s$t$a$t$u$s$,$$
$ $ $ $ $ $ $ $ $m$e$s$s$a$g$e$:$ $d$a$t$a$.$m$e$s$s$a$g$e$ $|$|$ $d$a$t$a$.$e$r$r$o$r$ $|$|$ $'$A$n$ $e$r$r$o$r$ $o$c$c$u$r$r$e$d$'$,$$
$ $ $ $ $ $ $ $ $e$r$r$o$r$s$:$ $d$a$t$a$.$e$r$r$o$r$s$ $|$|$ $[$]$,$$
$ $ $ $ $ $ $}$)$;$$
$ $ $ $ $}$ $e$l$s$e$ $i$f$ $($e$r$r$o$r$.$r$e$q$u$e$s$t$)$ ${$$
$ $ $ $ $ $ $/$/$ $R$e$q$u$e$s$t$ $m$a$d$e$ $b$u$t$ $n$o$ $r$e$s$p$o$n$s$e$ $r$e$c$e$i$v$e$d$$
$ $ $ $ $ $ $c$o$n$s$o$l$e$.$e$r$r$o$r$($'$N$e$t$w$o$r$k$ $e$r$r$o$r$:$'$,$ $e$r$r$o$r$.$m$e$s$s$a$g$e$)$;$$
$ $ $ $ $ $ $r$e$t$u$r$n$ $P$r$o$m$i$s$e$.$r$e$j$e$c$t$(${$$
$ $ $ $ $ $ $ $ $s$t$a$t$u$s$:$ $0$,$$
$ $ $ $ $ $ $ $ $m$e$s$s$a$g$e$:$ $'$N$e$t$w$o$r$k$ $e$r$r$o$r$ $-$ $p$l$e$a$s$e$ $c$h$e$c$k$ $y$o$u$r$ $c$o$n$n$e$c$t$i$o$n$'$,$$
$ $ $ $ $ $ $ $ $e$r$r$o$r$s$:$ $[$]$,$$
$ $ $ $ $ $ $}$)$;$$
$ $ $ $ $}$ $e$l$s$e$ ${$$
$ $ $ $ $ $ $/$/$ $S$o$m$e$t$h$i$n$g$ $e$l$s$e$ $h$a$p$p$e$n$e$d$$
$ $ $ $ $ $ $c$o$n$s$o$l$e$.$e$r$r$o$r$($'$E$r$r$o$r$:$'$,$ $e$r$r$o$r$.$m$e$s$s$a$g$e$)$;$$
$ $ $ $ $ $ $r$e$t$u$r$n$ $P$r$o$m$i$s$e$.$r$e$j$e$c$t$(${$$
$ $ $ $ $ $ $ $ $s$t$a$t$u$s$:$ $0$,$$
$ $ $ $ $ $ $ $ $m$e$s$s$a$g$e$:$ $e$r$r$o$r$.$m$e$s$s$a$g$e$,$$
$ $ $ $ $ $ $ $ $e$r$r$o$r$s$:$ $[$]$,$$
$ $ $ $ $ $ $}$)$;$$
$ $ $ $ $}$$
$ $ $}$$
$)$;$$
$$
$/$/$ $T$y$p$e$s$$
$e$x$p$o$r$t$ $i$n$t$e$r$f$a$c$e$ $A$p$i$E$r$r$o$r$R$e$s$p$o$n$s$e$ ${$$
$ $ $s$u$c$c$e$s$s$:$ $f$a$l$s$e$;$$
$ $ $m$e$s$s$a$g$e$?$:$ $s$t$r$i$n$g$;$ $ $/$/$ $B$a$c$k$e$n$d$ $c$a$n$ $r$e$t$u$r$n$ $e$i$t$h$e$r$ $m$e$s$s$a$g$e$ $o$r$ $e$r$r$o$r$$
$ $ $e$r$r$o$r$?$:$ $s$t$r$i$n$g$;$$
$ $ $e$r$r$o$r$s$?$:$ $A$r$r$a$y$<${$$
$ $ $ $ $f$i$e$l$d$:$ $s$t$r$i$n$g$;$$
$ $ $ $ $m$e$s$s$a$g$e$:$ $s$t$r$i$n$g$;$$
$ $ $}$>$;$$
$}$$
$$
$e$x$p$o$r$t$ $i$n$t$e$r$f$a$c$e$ $A$p$i$S$u$c$c$e$s$s$R$e$s$p$o$n$s$e$<$T$ $=$ $a$n$y$>$ ${$$
$ $ $s$u$c$c$e$s$s$:$ $t$r$u$e$;$$
$ $ $m$e$s$s$a$g$e$?$:$ $s$t$r$i$n$g$;$$
$ $ $d$a$t$a$:$ $T$;$$
$}$$
$$
$e$x$p$o$r$t$ $i$n$t$e$r$f$a$c$e$ $P$a$g$i$n$a$t$i$o$n$M$e$t$a$ ${$$
$ $ $p$a$g$e$:$ $n$u$m$b$e$r$;$$
$ $ $l$i$m$i$t$:$ $n$u$m$b$e$r$;$$
$ $ $t$o$t$a$l$I$t$e$m$s$:$ $n$u$m$b$e$r$;$$
$ $ $t$o$t$a$l$P$a$g$e$s$:$ $n$u$m$b$e$r$;$$
$}$$
$$
$e$x$p$o$r$t$ $i$n$t$e$r$f$a$c$e$ $P$a$g$i$n$a$t$e$d$R$e$s$p$o$n$s$e$<$T$>$ ${$$
$ $ $s$u$c$c$e$s$s$:$ $t$r$u$e$;$$
$ $ $d$a$t$a$:$ ${$$
$ $ $ $ $i$t$e$m$s$:$ $T$[$]$;$$
$ $ $ $ $p$a$g$i$n$a$t$i$o$n$:$ $P$a$g$i$n$a$t$i$o$n$M$e$t$a$;$$
$ $ $}$;$$
$}$$
$$
$/$/$ $U$t$i$l$i$t$y$ $f$u$n$c$t$i$o$n$ $t$o$ $h$a$n$d$l$e$ $A$P$I$ $r$e$s$p$o$n$s$e$s$$
$e$x$p$o$r$t$ $c$o$n$s$t$ $h$a$n$d$l$e$A$p$i$R$e$s$p$o$n$s$e$ $=$ $<$T$>$($r$e$s$p$o$n$s$e$:$ $A$x$i$o$s$R$e$s$p$o$n$s$e$<$A$p$i$S$u$c$c$e$s$s$R$e$s$p$o$n$s$e$<$T$>$>$)$:$ $T$ $=$>$ ${$$
$ $ $r$e$t$u$r$n$ $r$e$s$p$o$n$s$e$.$d$a$t$a$.$d$a$t$a$;$$
$}$;$$
$$
$/$/$ $U$t$i$l$i$t$y$ $f$u$n$c$t$i$o$n$ $t$o$ $h$a$n$d$l$e$ $A$P$I$ $e$r$r$o$r$s$$
$e$x$p$o$r$t$ $c$o$n$s$t$ $h$a$n$d$l$e$A$p$i$E$r$r$o$r$ $=$ $($e$r$r$o$r$:$ $a$n$y$)$:$ $s$t$r$i$n$g$ $=$>$ ${$$
$ $ $i$f$ $($e$r$r$o$r$.$e$r$r$o$r$s$ $&$&$ $e$r$r$o$r$.$e$r$r$o$r$s$.$l$e$n$g$t$h$ $>$ $0$)$ ${$$
$ $ $ $ $/$/$ $R$e$t$u$r$n$ $f$i$r$s$t$ $v$a$l$i$d$a$t$i$o$n$ $e$r$r$o$r$$
$ $ $ $ $r$e$t$u$r$n$ $e$r$r$o$r$.$e$r$r$o$r$s$[$0$]$.$m$e$s$s$a$g$e$;$$
$ $ $}$$
$ $ $r$e$t$u$r$n$ $e$r$r$o$r$.$m$e$s$s$a$g$e$ $|$|$ $'$A$n$ $u$n$e$x$p$e$c$t$e$d$ $e$r$r$o$r$ $o$c$c$u$r$r$e$d$'$;$$
$}$;$$
$$
$e$x$p$o$r$t$ $d$e$f$a$u$l$t$ $a$p$i$C$l$i$e$n$t$;$$
$
