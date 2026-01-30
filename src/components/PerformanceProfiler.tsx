$i$m$p$o$r$t$ ${$ $P$r$o$f$i$l$e$r$,$ $P$r$o$f$i$l$e$r$O$n$R$e$n$d$e$r$C$a$l$l$b$a$c$k$ $}$ $f$r$o$m$ $'$r$e$a$c$t$'$;$$
$i$m$p$o$r$t$ ${$ $R$e$a$c$t$N$o$d$e$ $}$ $f$r$o$m$ $'$r$e$a$c$t$'$;$$
$$
$/$*$*$$
$ $*$ $P$e$r$f$o$r$m$a$n$c$e$ $P$r$o$f$i$l$e$r$ $C$o$m$p$o$n$e$n$t$$
$ $*$ $$
$ $*$ $W$r$a$p$s$ $c$o$m$p$o$n$e$n$t$s$ $t$o$ $m$e$a$s$u$r$e$ $r$e$n$d$e$r$ $p$e$r$f$o$r$m$a$n$c$e$$
$ $*$ $L$o$g$s$ $m$e$t$r$i$c$s$ $i$n$ $d$e$v$e$l$o$p$m$e$n$t$ $m$o$d$e$$
$ $*$/$$
$$
$i$n$t$e$r$f$a$c$e$ $P$e$r$f$o$r$m$a$n$c$e$P$r$o$f$i$l$e$r$P$r$o$p$s$ ${$$
$ $ $i$d$:$ $s$t$r$i$n$g$;$$
$ $ $c$h$i$l$d$r$e$n$:$ $R$e$a$c$t$N$o$d$e$;$$
$ $ $l$o$g$R$e$s$u$l$t$s$?$:$ $b$o$o$l$e$a$n$;$$
$}$$
$$
$/$/$ $S$t$o$r$e$ $r$e$n$d$e$r$ $t$i$m$e$s$ $f$o$r$ $a$n$a$l$y$s$i$s$$
$c$o$n$s$t$ $r$e$n$d$e$r$T$i$m$e$s$:$ $R$e$c$o$r$d$<$s$t$r$i$n$g$,$ $n$u$m$b$e$r$[$]$>$ $=$ ${$}$;$$
$$
$/$*$*$$
$ $*$ $C$a$l$l$b$a$c$k$ $f$u$n$c$t$i$o$n$ $f$o$r$ $P$r$o$f$i$l$e$r$$
$ $*$/$$
$c$o$n$s$t$ $o$n$R$e$n$d$e$r$C$a$l$l$b$a$c$k$:$ $P$r$o$f$i$l$e$r$O$n$R$e$n$d$e$r$C$a$l$l$b$a$c$k$ $=$ $($$
$ $ $i$d$,$$
$ $ $p$h$a$s$e$,$$
$ $ $a$c$t$u$a$l$D$u$r$a$t$i$o$n$,$$
$ $ $b$a$s$e$D$u$r$a$t$i$o$n$,$$
$ $ $s$t$a$r$t$T$i$m$e$,$$
$ $ $c$o$m$m$i$t$T$i$m$e$$
$)$ $=$>$ ${$$
$ $ $/$/$ $S$t$o$r$e$ $r$e$n$d$e$r$ $t$i$m$e$$
$ $ $i$f$ $($!$r$e$n$d$e$r$T$i$m$e$s$[$i$d$]$)$ ${$$
$ $ $ $ $r$e$n$d$e$r$T$i$m$e$s$[$i$d$]$ $=$ $[$]$;$$
$ $ $}$$
$ $ $r$e$n$d$e$r$T$i$m$e$s$[$i$d$]$.$p$u$s$h$($a$c$t$u$a$l$D$u$r$a$t$i$o$n$)$;$$
$$
$ $ $/$/$ $L$o$g$ $i$n$ $d$e$v$e$l$o$p$m$e$n$t$ $m$o$d$e$$
$ $ $i$f$ $($p$r$o$c$e$s$s$.$e$n$v$.$N$O$D$E$_$E$N$V$ $=$=$=$ $'$d$e$v$e$l$o$p$m$e$n$t$'$)$ ${$$
$ $ $ $ $c$o$n$s$o$l$e$.$l$o$g$($`$[$P$r$o$f$i$l$e$r$]$ $$${$i$d$}$ $-$ $$${$p$h$a$s$e$}$:$`$,$ ${$$
$ $ $ $ $ $ $a$c$t$u$a$l$D$u$r$a$t$i$o$n$:$ $`$$${$a$c$t$u$a$l$D$u$r$a$t$i$o$n$.$t$o$F$i$x$e$d$($2$)$}$m$s$`$,$$
$ $ $ $ $ $ $b$a$s$e$D$u$r$a$t$i$o$n$:$ $`$$${$b$a$s$e$D$u$r$a$t$i$o$n$.$t$o$F$i$x$e$d$($2$)$}$m$s$`$,$$
$ $ $ $ $ $ $s$t$a$r$t$T$i$m$e$:$ $`$$${$s$t$a$r$t$T$i$m$e$.$t$o$F$i$x$e$d$($2$)$}$m$s$`$,$$
$ $ $ $ $ $ $c$o$m$m$i$t$T$i$m$e$:$ $`$$${$c$o$m$m$i$t$T$i$m$e$.$t$o$F$i$x$e$d$($2$)$}$m$s$`$,$$
$ $ $ $ $}$)$;$$
$ $ $}$$
$$
$ $ $/$/$ $W$a$r$n$i$n$g$ $f$o$r$ $s$l$o$w$ $r$e$n$d$e$r$s$$
$ $ $i$f$ $($a$c$t$u$a$l$D$u$r$a$t$i$o$n$ $>$ $1$6$)$ ${$$
$ $ $ $ $c$o$n$s$o$l$e$.$w$a$r$n$($$
$ $ $ $ $ $ $`$[$P$r$o$f$i$l$e$r$]$ $S$l$o$w$ $r$e$n$d$e$r$ $d$e$t$e$c$t$e$d$ $i$n$ $$${$i$d$}$:$ $$${$a$c$t$u$a$l$D$u$r$a$t$i$o$n$.$t$o$F$i$x$e$d$($2$)$}$m$s$ $($>$$${$1$6$}$m$s$ $t$h$r$e$s$h$o$l$d$)$`$$
$ $ $ $ $)$;$$
$ $ $}$$
$}$;$$
$$
$/$*$*$$
$ $*$ $P$e$r$f$o$r$m$a$n$c$e$ $P$r$o$f$i$l$e$r$ $C$o$m$p$o$n$e$n$t$$
$ $*$/$$
$e$x$p$o$r$t$ $f$u$n$c$t$i$o$n$ $P$e$r$f$o$r$m$a$n$c$e$P$r$o$f$i$l$e$r$(${$$
$ $ $i$d$,$$
$ $ $c$h$i$l$d$r$e$n$,$$
$ $ $l$o$g$R$e$s$u$l$t$s$ $=$ $f$a$l$s$e$,$$
$}$:$ $P$e$r$f$o$r$m$a$n$c$e$P$r$o$f$i$l$e$r$P$r$o$p$s$)$ ${$$
$ $ $r$e$t$u$r$n$ $($$
$ $ $ $ $<$P$r$o$f$i$l$e$r$ $i$d$=${$i$d$}$ $o$n$R$e$n$d$e$r$=${$l$o$g$R$e$s$u$l$t$s$ $?$ $o$n$R$e$n$d$e$r$C$a$l$l$b$a$c$k$ $:$ $($)$ $=$>$ ${$}$}$>$$
$ $ $ $ $ $ ${$c$h$i$l$d$r$e$n$}$$
$ $ $ $ $<$/$P$r$o$f$i$l$e$r$>$$
$ $ $)$;$$
$}$$
$$
$/$*$*$$
$ $*$ $G$e$t$ $r$e$n$d$e$r$ $s$t$a$t$i$s$t$i$c$s$ $f$o$r$ $a$ $c$o$m$p$o$n$e$n$t$$
$ $*$/$$
$e$x$p$o$r$t$ $f$u$n$c$t$i$o$n$ $g$e$t$R$e$n$d$e$r$S$t$a$t$s$($i$d$:$ $s$t$r$i$n$g$)$ ${$$
$ $ $c$o$n$s$t$ $t$i$m$e$s$ $=$ $r$e$n$d$e$r$T$i$m$e$s$[$i$d$]$ $|$|$ $[$]$;$$
$ $ $$
$ $ $i$f$ $($t$i$m$e$s$.$l$e$n$g$t$h$ $=$=$=$ $0$)$ ${$$
$ $ $ $ $r$e$t$u$r$n$ $n$u$l$l$;$$
$ $ $}$$
$$
$ $ $c$o$n$s$t$ $s$u$m$ $=$ $t$i$m$e$s$.$r$e$d$u$c$e$($($a$,$ $b$)$ $=$>$ $a$ $+$ $b$,$ $0$)$;$$
$ $ $c$o$n$s$t$ $a$v$g$ $=$ $s$u$m$ $/$ $t$i$m$e$s$.$l$e$n$g$t$h$;$$
$ $ $c$o$n$s$t$ $m$i$n$ $=$ $M$a$t$h$.$m$i$n$($.$.$.$t$i$m$e$s$)$;$$
$ $ $c$o$n$s$t$ $m$a$x$ $=$ $M$a$t$h$.$m$a$x$($.$.$.$t$i$m$e$s$)$;$$
$ $ $$
$ $ $r$e$t$u$r$n$ ${$$
$ $ $ $ $c$o$u$n$t$:$ $t$i$m$e$s$.$l$e$n$g$t$h$,$$
$ $ $ $ $a$v$e$r$a$g$e$:$ $a$v$g$,$$
$ $ $ $ $m$i$n$,$$
$ $ $ $ $m$a$x$,$$
$ $ $ $ $t$o$t$a$l$:$ $s$u$m$,$$
$ $ $}$;$$
$}$$
$$
$/$*$*$$
$ $*$ $G$e$t$ $a$l$l$ $r$e$n$d$e$r$ $s$t$a$t$i$s$t$i$c$s$$
$ $*$/$$
$e$x$p$o$r$t$ $f$u$n$c$t$i$o$n$ $g$e$t$A$l$l$R$e$n$d$e$r$S$t$a$t$s$($)$ ${$$
$ $ $c$o$n$s$t$ $s$t$a$t$s$:$ $R$e$c$o$r$d$<$s$t$r$i$n$g$,$ $a$n$y$>$ $=$ ${$}$;$$
$ $ $$
$ $ $O$b$j$e$c$t$.$k$e$y$s$($r$e$n$d$e$r$T$i$m$e$s$)$.$f$o$r$E$a$c$h$($($i$d$)$ $=$>$ ${$$
$ $ $ $ $s$t$a$t$s$[$i$d$]$ $=$ $g$e$t$R$e$n$d$e$r$S$t$a$t$s$($i$d$)$;$$
$ $ $}$)$;$$
$ $ $$
$ $ $r$e$t$u$r$n$ $s$t$a$t$s$;$$
$}$$
$$
$/$*$*$$
$ $*$ $C$l$e$a$r$ $r$e$n$d$e$r$ $s$t$a$t$i$s$t$i$c$s$$
$ $*$/$$
$e$x$p$o$r$t$ $f$u$n$c$t$i$o$n$ $c$l$e$a$r$R$e$n$d$e$r$S$t$a$t$s$($)$ ${$$
$ $ $O$b$j$e$c$t$.$k$e$y$s$($r$e$n$d$e$r$T$i$m$e$s$)$.$f$o$r$E$a$c$h$($($k$e$y$)$ $=$>$ ${$$
$ $ $ $ $d$e$l$e$t$e$ $r$e$n$d$e$r$T$i$m$e$s$[$k$e$y$]$;$$
$ $ $}$)$;$$
$}$$
$$
$/$*$*$$
$ $*$ $L$o$g$ $r$e$n$d$e$r$ $s$t$a$t$i$s$t$i$c$s$ $t$o$ $c$o$n$s$o$l$e$$
$ $*$/$$
$e$x$p$o$r$t$ $f$u$n$c$t$i$o$n$ $l$o$g$R$e$n$d$e$r$S$t$a$t$s$($)$ ${$$
$ $ $c$o$n$s$o$l$e$.$g$r$o$u$p$($'$ð$Ÿ$“$Š$ $C$o$m$p$o$n$e$n$t$ $R$e$n$d$e$r$ $S$t$a$t$i$s$t$i$c$s$'$)$;$$
$ $ $$
$ $ $c$o$n$s$t$ $s$t$a$t$s$ $=$ $g$e$t$A$l$l$R$e$n$d$e$r$S$t$a$t$s$($)$;$$
$ $ $$
$ $ $O$b$j$e$c$t$.$e$n$t$r$i$e$s$($s$t$a$t$s$)$.$f$o$r$E$a$c$h$($($[$i$d$,$ $s$t$a$t$]$)$ $=$>$ ${$$
$ $ $ $ $i$f$ $($!$s$t$a$t$)$ $r$e$t$u$r$n$;$$
$ $ $ $ $$
$ $ $ $ $c$o$n$s$o$l$e$.$g$r$o$u$p$($i$d$)$;$$
$ $ $ $ $c$o$n$s$o$l$e$.$l$o$g$($`$R$e$n$d$e$r$s$:$ $$${$s$t$a$t$.$c$o$u$n$t$}$`$)$;$$
$ $ $ $ $c$o$n$s$o$l$e$.$l$o$g$($`$A$v$e$r$a$g$e$:$ $$${$s$t$a$t$.$a$v$e$r$a$g$e$.$t$o$F$i$x$e$d$($2$)$}$m$s$`$)$;$$
$ $ $ $ $c$o$n$s$o$l$e$.$l$o$g$($`$M$i$n$:$ $$${$s$t$a$t$.$m$i$n$.$t$o$F$i$x$e$d$($2$)$}$m$s$`$)$;$$
$ $ $ $ $c$o$n$s$o$l$e$.$l$o$g$($`$M$a$x$:$ $$${$s$t$a$t$.$m$a$x$.$t$o$F$i$x$e$d$($2$)$}$m$s$`$)$;$$
$ $ $ $ $c$o$n$s$o$l$e$.$l$o$g$($`$T$o$t$a$l$:$ $$${$s$t$a$t$.$t$o$t$a$l$.$t$o$F$i$x$e$d$($2$)$}$m$s$`$)$;$$
$ $ $ $ $c$o$n$s$o$l$e$.$g$r$o$u$p$E$n$d$($)$;$$
$ $ $}$)$;$$
$ $ $$
$ $ $c$o$n$s$o$l$e$.$g$r$o$u$p$E$n$d$($)$;$$
$}$$
$$
$/$/$ $M$a$k$e$ $a$v$a$i$l$a$b$l$e$ $g$l$o$b$a$l$l$y$ $f$o$r$ $d$e$b$u$g$g$i$n$g$$
$d$e$c$l$a$r$e$ $g$l$o$b$a$l$ ${$$
$ $ $i$n$t$e$r$f$a$c$e$ $W$i$n$d$o$w$ ${$$
$ $ $ $ $r$e$n$d$e$r$P$r$o$f$i$l$e$r$:$ ${$$
$ $ $ $ $ $ $g$e$t$S$t$a$t$s$:$ $t$y$p$e$o$f$ $g$e$t$R$e$n$d$e$r$S$t$a$t$s$;$$
$ $ $ $ $ $ $g$e$t$A$l$l$S$t$a$t$s$:$ $t$y$p$e$o$f$ $g$e$t$A$l$l$R$e$n$d$e$r$S$t$a$t$s$;$$
$ $ $ $ $ $ $c$l$e$a$r$S$t$a$t$s$:$ $t$y$p$e$o$f$ $c$l$e$a$r$R$e$n$d$e$r$S$t$a$t$s$;$$
$ $ $ $ $ $ $l$o$g$S$t$a$t$s$:$ $t$y$p$e$o$f$ $l$o$g$R$e$n$d$e$r$S$t$a$t$s$;$$
$ $ $ $ $}$;$$
$ $ $}$$
$}$$
$$
$i$f$ $($t$y$p$e$o$f$ $w$i$n$d$o$w$ $!$=$=$ $'$u$n$d$e$f$i$n$e$d$'$)$ ${$$
$ $ $w$i$n$d$o$w$.$r$e$n$d$e$r$P$r$o$f$i$l$e$r$ $=$ ${$$
$ $ $ $ $g$e$t$S$t$a$t$s$:$ $g$e$t$R$e$n$d$e$r$S$t$a$t$s$,$$
$ $ $ $ $g$e$t$A$l$l$S$t$a$t$s$:$ $g$e$t$A$l$l$R$e$n$d$e$r$S$t$a$t$s$,$$
$ $ $ $ $c$l$e$a$r$S$t$a$t$s$:$ $c$l$e$a$r$R$e$n$d$e$r$S$t$a$t$s$,$$
$ $ $ $ $l$o$g$S$t$a$t$s$:$ $l$o$g$R$e$n$d$e$r$S$t$a$t$s$,$$
$ $ $}$;$$
$}$$
$$
$e$x$p$o$r$t$ $d$e$f$a$u$l$t$ $P$e$r$f$o$r$m$a$n$c$e$P$r$o$f$i$l$e$r$;$$
$
