$/$*$*$$
$ $*$ $U$s$e$r$ $M$a$n$a$g$e$m$e$n$t$ $A$P$I$ $S$e$r$v$i$c$e$$
$ $*$ $H$a$n$d$l$e$s$ $a$l$l$ $u$s$e$r$-$r$e$l$a$t$e$d$ $A$P$I$ $c$a$l$l$s$$
$ $*$/$$
$$
$i$m$p$o$r$t$ ${$ $a$p$i$C$l$i$e$n$t$ $}$ $f$r$o$m$ $'$.$/$a$p$i$'$;$$
$i$m$p$o$r$t$ $t$y$p$e$ ${$ $$
$ $ $U$s$e$r$D$e$t$a$i$l$e$d$,$ $$
$ $ $U$s$e$r$s$R$e$s$p$o$n$s$e$,$ $$
$ $ $A$c$t$i$v$i$t$y$R$e$s$p$o$n$s$e$,$ $$
$ $ $R$o$l$e$,$$
$ $ $U$s$e$r$F$i$l$t$e$r$s$,$$
$ $ $A$c$t$i$v$i$t$y$F$i$l$t$e$r$s$ $$
$}$ $f$r$o$m$ $'$.$.$/$t$y$p$e$s$/$u$s$e$r$'$;$$
$$
$e$x$p$o$r$t$ $c$o$n$s$t$ $u$s$e$r$S$e$r$v$i$c$e$ $=$ ${$$
$ $ $/$*$*$$
$ $ $ $*$ $G$e$t$ $a$l$l$ $u$s$e$r$s$ $w$i$t$h$ $f$i$l$t$e$r$s$ $a$n$d$ $p$a$g$i$n$a$t$i$o$n$$
$ $ $ $*$/$$
$ $ $a$s$y$n$c$ $g$e$t$A$l$l$($f$i$l$t$e$r$s$?$:$ $U$s$e$r$F$i$l$t$e$r$s$)$:$ $P$r$o$m$i$s$e$<$U$s$e$r$s$R$e$s$p$o$n$s$e$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $p$a$r$a$m$s$ $=$ $n$e$w$ $U$R$L$S$e$a$r$c$h$P$a$r$a$m$s$($)$;$$
$ $ $ $ $$
$ $ $ $ $i$f$ $($f$i$l$t$e$r$s$?$.$s$e$a$r$c$h$)$ $p$a$r$a$m$s$.$a$p$p$e$n$d$($'$s$e$a$r$c$h$'$,$ $f$i$l$t$e$r$s$.$s$e$a$r$c$h$)$;$$
$ $ $ $ $i$f$ $($f$i$l$t$e$r$s$?$.$r$o$l$e$)$ $p$a$r$a$m$s$.$a$p$p$e$n$d$($'$r$o$l$e$'$,$ $f$i$l$t$e$r$s$.$r$o$l$e$)$;$$
$ $ $ $ $i$f$ $($f$i$l$t$e$r$s$?$.$s$t$a$t$u$s$ $&$&$ $f$i$l$t$e$r$s$.$s$t$a$t$u$s$ $!$=$=$ $'$a$l$l$'$)$ ${$$
$ $ $ $ $ $ $p$a$r$a$m$s$.$a$p$p$e$n$d$($'$s$t$a$t$u$s$'$,$ $f$i$l$t$e$r$s$.$s$t$a$t$u$s$)$;$$
$ $ $ $ $}$$
$ $ $ $ $i$f$ $($f$i$l$t$e$r$s$?$.$p$a$g$e$)$ $p$a$r$a$m$s$.$a$p$p$e$n$d$($'$p$a$g$e$'$,$ $f$i$l$t$e$r$s$.$p$a$g$e$.$t$o$S$t$r$i$n$g$($)$)$;$$
$ $ $ $ $i$f$ $($f$i$l$t$e$r$s$?$.$l$i$m$i$t$)$ $p$a$r$a$m$s$.$a$p$p$e$n$d$($'$l$i$m$i$t$'$,$ $f$i$l$t$e$r$s$.$l$i$m$i$t$.$t$o$S$t$r$i$n$g$($)$)$;$$
$ $ $ $ $i$f$ $($f$i$l$t$e$r$s$?$.$s$o$r$t$B$y$)$ $p$a$r$a$m$s$.$a$p$p$e$n$d$($'$s$o$r$t$B$y$'$,$ $f$i$l$t$e$r$s$.$s$o$r$t$B$y$)$;$$
$ $ $ $ $i$f$ $($f$i$l$t$e$r$s$?$.$s$o$r$t$O$r$d$e$r$)$ $p$a$r$a$m$s$.$a$p$p$e$n$d$($'$s$o$r$t$O$r$d$e$r$'$,$ $f$i$l$t$e$r$s$.$s$o$r$t$O$r$d$e$r$)$;$$
$$
$ $ $ $ $c$o$n$s$t$ $q$u$e$r$y$S$t$r$i$n$g$ $=$ $p$a$r$a$m$s$.$t$o$S$t$r$i$n$g$($)$;$$
$ $ $ $ $c$o$n$s$t$ $u$r$l$ $=$ $`$/$u$s$e$r$s$$${$q$u$e$r$y$S$t$r$i$n$g$ $?$ $`$?$$${$q$u$e$r$y$S$t$r$i$n$g$}$`$ $:$ $'$'$}$`$;$$
$$
$ $ $ $ $c$o$n$s$t$ $r$e$s$p$o$n$s$e$ $=$ $a$w$a$i$t$ $a$p$i$C$l$i$e$n$t$.$g$e$t$<${$ $d$a$t$a$:$ $U$s$e$r$s$R$e$s$p$o$n$s$e$ $}$>$($u$r$l$)$;$$
$ $ $ $ $r$e$t$u$r$n$ $r$e$s$p$o$n$s$e$.$d$a$t$a$.$d$a$t$a$;$$
$ $ $}$,$$
$$
$ $ $/$*$*$$
$ $ $ $*$ $G$e$t$ $u$s$e$r$ $b$y$ $I$D$$
$ $ $ $*$/$$
$ $ $a$s$y$n$c$ $g$e$t$B$y$I$d$($i$d$:$ $n$u$m$b$e$r$)$:$ $P$r$o$m$i$s$e$<$U$s$e$r$D$e$t$a$i$l$e$d$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $r$e$s$p$o$n$s$e$ $=$ $a$w$a$i$t$ $a$p$i$C$l$i$e$n$t$.$g$e$t$<${$ $d$a$t$a$:$ $U$s$e$r$D$e$t$a$i$l$e$d$ $}$>$($`$/$u$s$e$r$s$/$$${$i$d$}$`$)$;$$
$ $ $ $ $r$e$t$u$r$n$ $r$e$s$p$o$n$s$e$.$d$a$t$a$.$d$a$t$a$;$$
$ $ $}$,$$
$$
$ $ $/$*$*$$
$ $ $ $*$ $A$s$s$i$g$n$ $r$o$l$e$s$ $t$o$ $u$s$e$r$ $($r$e$p$l$a$c$e$s$ $e$x$i$s$t$i$n$g$ $r$o$l$e$s$)$$
$ $ $ $*$/$$
$ $ $a$s$y$n$c$ $a$s$s$i$g$n$R$o$l$e$s$($u$s$e$r$I$d$:$ $n$u$m$b$e$r$,$ $r$o$l$e$I$d$s$:$ $n$u$m$b$e$r$[$]$)$:$ $P$r$o$m$i$s$e$<$U$s$e$r$D$e$t$a$i$l$e$d$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $r$e$s$p$o$n$s$e$ $=$ $a$w$a$i$t$ $a$p$i$C$l$i$e$n$t$.$p$u$t$<${$ $d$a$t$a$:$ $U$s$e$r$D$e$t$a$i$l$e$d$ $}$>$($$
$ $ $ $ $ $ $`$/$u$s$e$r$s$/$$${$u$s$e$r$I$d$}$/$r$o$l$e$s$`$,$$
$ $ $ $ $ $ ${$ $r$o$l$e$I$d$s$ $}$$
$ $ $ $ $)$;$$
$ $ $ $ $r$e$t$u$r$n$ $r$e$s$p$o$n$s$e$.$d$a$t$a$.$d$a$t$a$;$$
$ $ $}$,$$
$$
$ $ $/$*$*$$
$ $ $ $*$ $A$d$d$ $a$ $r$o$l$e$ $t$o$ $u$s$e$r$ $($a$p$p$e$n$d$)$$
$ $ $ $*$/$$
$ $ $a$s$y$n$c$ $a$d$d$R$o$l$e$($u$s$e$r$I$d$:$ $n$u$m$b$e$r$,$ $r$o$l$e$I$d$:$ $n$u$m$b$e$r$)$:$ $P$r$o$m$i$s$e$<$U$s$e$r$D$e$t$a$i$l$e$d$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $r$e$s$p$o$n$s$e$ $=$ $a$w$a$i$t$ $a$p$i$C$l$i$e$n$t$.$p$o$s$t$<${$ $d$a$t$a$:$ $U$s$e$r$D$e$t$a$i$l$e$d$ $}$>$($$
$ $ $ $ $ $ $`$/$u$s$e$r$s$/$$${$u$s$e$r$I$d$}$/$r$o$l$e$s$`$,$$
$ $ $ $ $ $ ${$ $r$o$l$e$I$d$ $}$$
$ $ $ $ $)$;$$
$ $ $ $ $r$e$t$u$r$n$ $r$e$s$p$o$n$s$e$.$d$a$t$a$.$d$a$t$a$;$$
$ $ $}$,$$
$$
$ $ $/$*$*$$
$ $ $ $*$ $R$e$m$o$v$e$ $r$o$l$e$ $f$r$o$m$ $u$s$e$r$$
$ $ $ $*$/$$
$ $ $a$s$y$n$c$ $r$e$m$o$v$e$R$o$l$e$($u$s$e$r$I$d$:$ $n$u$m$b$e$r$,$ $r$o$l$e$I$d$:$ $n$u$m$b$e$r$)$:$ $P$r$o$m$i$s$e$<$U$s$e$r$D$e$t$a$i$l$e$d$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $r$e$s$p$o$n$s$e$ $=$ $a$w$a$i$t$ $a$p$i$C$l$i$e$n$t$.$d$e$l$e$t$e$<${$ $d$a$t$a$:$ $U$s$e$r$D$e$t$a$i$l$e$d$ $}$>$($$
$ $ $ $ $ $ $`$/$u$s$e$r$s$/$$${$u$s$e$r$I$d$}$/$r$o$l$e$s$/$$${$r$o$l$e$I$d$}$`$$
$ $ $ $ $)$;$$
$ $ $ $ $r$e$t$u$r$n$ $r$e$s$p$o$n$s$e$.$d$a$t$a$.$d$a$t$a$;$$
$ $ $}$,$$
$$
$ $ $/$*$*$$
$ $ $ $*$ $U$p$d$a$t$e$ $u$s$e$r$ $s$t$a$t$u$s$ $($a$c$t$i$v$a$t$e$/$d$e$a$c$t$i$v$a$t$e$)$$
$ $ $ $*$/$$
$ $ $a$s$y$n$c$ $u$p$d$a$t$e$S$t$a$t$u$s$($u$s$e$r$I$d$:$ $n$u$m$b$e$r$,$ $i$s$A$c$t$i$v$e$:$ $b$o$o$l$e$a$n$)$:$ $P$r$o$m$i$s$e$<$U$s$e$r$D$e$t$a$i$l$e$d$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $r$e$s$p$o$n$s$e$ $=$ $a$w$a$i$t$ $a$p$i$C$l$i$e$n$t$.$p$u$t$<${$ $d$a$t$a$:$ $U$s$e$r$D$e$t$a$i$l$e$d$ $}$>$($$
$ $ $ $ $ $ $`$/$u$s$e$r$s$/$$${$u$s$e$r$I$d$}$/$s$t$a$t$u$s$`$,$$
$ $ $ $ $ $ ${$ $i$s$A$c$t$i$v$e$ $}$$
$ $ $ $ $)$;$$
$ $ $ $ $r$e$t$u$r$n$ $r$e$s$p$o$n$s$e$.$d$a$t$a$.$d$a$t$a$;$$
$ $ $}$,$$
$$
$ $ $/$*$*$$
$ $ $ $*$ $G$e$t$ $u$s$e$r$ $a$c$t$i$v$i$t$y$ $l$o$g$$
$ $ $ $*$/$$
$ $ $a$s$y$n$c$ $g$e$t$A$c$t$i$v$i$t$y$($u$s$e$r$I$d$:$ $n$u$m$b$e$r$,$ $f$i$l$t$e$r$s$?$:$ $A$c$t$i$v$i$t$y$F$i$l$t$e$r$s$)$:$ $P$r$o$m$i$s$e$<$A$c$t$i$v$i$t$y$R$e$s$p$o$n$s$e$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $p$a$r$a$m$s$ $=$ $n$e$w$ $U$R$L$S$e$a$r$c$h$P$a$r$a$m$s$($)$;$$
$ $ $ $ $$
$ $ $ $ $i$f$ $($f$i$l$t$e$r$s$?$.$p$a$g$e$)$ $p$a$r$a$m$s$.$a$p$p$e$n$d$($'$p$a$g$e$'$,$ $f$i$l$t$e$r$s$.$p$a$g$e$.$t$o$S$t$r$i$n$g$($)$)$;$$
$ $ $ $ $i$f$ $($f$i$l$t$e$r$s$?$.$l$i$m$i$t$)$ $p$a$r$a$m$s$.$a$p$p$e$n$d$($'$l$i$m$i$t$'$,$ $f$i$l$t$e$r$s$.$l$i$m$i$t$.$t$o$S$t$r$i$n$g$($)$)$;$$
$ $ $ $ $i$f$ $($f$i$l$t$e$r$s$?$.$a$c$t$i$o$n$)$ $p$a$r$a$m$s$.$a$p$p$e$n$d$($'$a$c$t$i$o$n$'$,$ $f$i$l$t$e$r$s$.$a$c$t$i$o$n$)$;$$
$ $ $ $ $i$f$ $($f$i$l$t$e$r$s$?$.$s$t$a$r$t$D$a$t$e$)$ $p$a$r$a$m$s$.$a$p$p$e$n$d$($'$s$t$a$r$t$D$a$t$e$'$,$ $f$i$l$t$e$r$s$.$s$t$a$r$t$D$a$t$e$)$;$$
$ $ $ $ $i$f$ $($f$i$l$t$e$r$s$?$.$e$n$d$D$a$t$e$)$ $p$a$r$a$m$s$.$a$p$p$e$n$d$($'$e$n$d$D$a$t$e$'$,$ $f$i$l$t$e$r$s$.$e$n$d$D$a$t$e$)$;$$
$$
$ $ $ $ $c$o$n$s$t$ $q$u$e$r$y$S$t$r$i$n$g$ $=$ $p$a$r$a$m$s$.$t$o$S$t$r$i$n$g$($)$;$$
$ $ $ $ $c$o$n$s$t$ $u$r$l$ $=$ $`$/$u$s$e$r$s$/$$${$u$s$e$r$I$d$}$/$a$c$t$i$v$i$t$y$$${$q$u$e$r$y$S$t$r$i$n$g$ $?$ $`$?$$${$q$u$e$r$y$S$t$r$i$n$g$}$`$ $:$ $'$'$}$`$;$$
$$
$ $ $ $ $c$o$n$s$t$ $r$e$s$p$o$n$s$e$ $=$ $a$w$a$i$t$ $a$p$i$C$l$i$e$n$t$.$g$e$t$<${$ $d$a$t$a$:$ $A$c$t$i$v$i$t$y$R$e$s$p$o$n$s$e$ $}$>$($u$r$l$)$;$$
$ $ $ $ $r$e$t$u$r$n$ $r$e$s$p$o$n$s$e$.$d$a$t$a$.$d$a$t$a$;$$
$ $ $}$,$$
$$
$ $ $/$*$*$$
$ $ $ $*$ $G$e$t$ $a$l$l$ $a$c$t$i$v$i$t$y$ $($a$d$m$i$n$ $o$n$l$y$)$$
$ $ $ $*$/$$
$ $ $a$s$y$n$c$ $g$e$t$A$l$l$A$c$t$i$v$i$t$y$($f$i$l$t$e$r$s$?$:$ $A$c$t$i$v$i$t$y$F$i$l$t$e$r$s$)$:$ $P$r$o$m$i$s$e$<$A$c$t$i$v$i$t$y$R$e$s$p$o$n$s$e$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $p$a$r$a$m$s$ $=$ $n$e$w$ $U$R$L$S$e$a$r$c$h$P$a$r$a$m$s$($)$;$$
$ $ $ $ $$
$ $ $ $ $i$f$ $($f$i$l$t$e$r$s$?$.$p$a$g$e$)$ $p$a$r$a$m$s$.$a$p$p$e$n$d$($'$p$a$g$e$'$,$ $f$i$l$t$e$r$s$.$p$a$g$e$.$t$o$S$t$r$i$n$g$($)$)$;$$
$ $ $ $ $i$f$ $($f$i$l$t$e$r$s$?$.$l$i$m$i$t$)$ $p$a$r$a$m$s$.$a$p$p$e$n$d$($'$l$i$m$i$t$'$,$ $f$i$l$t$e$r$s$.$l$i$m$i$t$.$t$o$S$t$r$i$n$g$($)$)$;$$
$ $ $ $ $i$f$ $($f$i$l$t$e$r$s$?$.$u$s$e$r$I$d$)$ $p$a$r$a$m$s$.$a$p$p$e$n$d$($'$u$s$e$r$I$d$'$,$ $f$i$l$t$e$r$s$.$u$s$e$r$I$d$.$t$o$S$t$r$i$n$g$($)$)$;$$
$ $ $ $ $i$f$ $($f$i$l$t$e$r$s$?$.$a$c$t$i$o$n$)$ $p$a$r$a$m$s$.$a$p$p$e$n$d$($'$a$c$t$i$o$n$'$,$ $f$i$l$t$e$r$s$.$a$c$t$i$o$n$)$;$$
$ $ $ $ $i$f$ $($f$i$l$t$e$r$s$?$.$s$t$a$r$t$D$a$t$e$)$ $p$a$r$a$m$s$.$a$p$p$e$n$d$($'$s$t$a$r$t$D$a$t$e$'$,$ $f$i$l$t$e$r$s$.$s$t$a$r$t$D$a$t$e$)$;$$
$ $ $ $ $i$f$ $($f$i$l$t$e$r$s$?$.$e$n$d$D$a$t$e$)$ $p$a$r$a$m$s$.$a$p$p$e$n$d$($'$e$n$d$D$a$t$e$'$,$ $f$i$l$t$e$r$s$.$e$n$d$D$a$t$e$)$;$$
$$
$ $ $ $ $c$o$n$s$t$ $q$u$e$r$y$S$t$r$i$n$g$ $=$ $p$a$r$a$m$s$.$t$o$S$t$r$i$n$g$($)$;$$
$ $ $ $ $c$o$n$s$t$ $u$r$l$ $=$ $`$/$a$c$t$i$v$i$t$y$/$a$l$l$$${$q$u$e$r$y$S$t$r$i$n$g$ $?$ $`$?$$${$q$u$e$r$y$S$t$r$i$n$g$}$`$ $:$ $'$'$}$`$;$$
$$
$ $ $ $ $c$o$n$s$t$ $r$e$s$p$o$n$s$e$ $=$ $a$w$a$i$t$ $a$p$i$C$l$i$e$n$t$.$g$e$t$<${$ $d$a$t$a$:$ $A$c$t$i$v$i$t$y$R$e$s$p$o$n$s$e$ $}$>$($u$r$l$)$;$$
$ $ $ $ $r$e$t$u$r$n$ $r$e$s$p$o$n$s$e$.$d$a$t$a$.$d$a$t$a$;$$
$ $ $}$,$$
$}$;$$
$$
$e$x$p$o$r$t$ $c$o$n$s$t$ $r$o$l$e$S$e$r$v$i$c$e$ $=$ ${$$
$ $ $/$*$*$$
$ $ $ $*$ $G$e$t$ $a$l$l$ $r$o$l$e$s$$
$ $ $ $*$/$$
$ $ $a$s$y$n$c$ $g$e$t$A$l$l$($)$:$ $P$r$o$m$i$s$e$<$R$o$l$e$[$]$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $r$e$s$p$o$n$s$e$ $=$ $a$w$a$i$t$ $a$p$i$C$l$i$e$n$t$.$g$e$t$<${$ $d$a$t$a$:$ $R$o$l$e$[$]$ $}$>$($'$/$r$o$l$e$s$'$)$;$$
$ $ $ $ $r$e$t$u$r$n$ $r$e$s$p$o$n$s$e$.$d$a$t$a$.$d$a$t$a$;$$
$ $ $}$,$$
$$
$ $ $/$*$*$$
$ $ $ $*$ $G$e$t$ $r$o$l$e$ $b$y$ $I$D$$
$ $ $ $*$/$$
$ $ $a$s$y$n$c$ $g$e$t$B$y$I$d$($i$d$:$ $n$u$m$b$e$r$)$:$ $P$r$o$m$i$s$e$<$R$o$l$e$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $r$e$s$p$o$n$s$e$ $=$ $a$w$a$i$t$ $a$p$i$C$l$i$e$n$t$.$g$e$t$<${$ $d$a$t$a$:$ $R$o$l$e$ $}$>$($`$/$r$o$l$e$s$/$$${$i$d$}$`$)$;$$
$ $ $ $ $r$e$t$u$r$n$ $r$e$s$p$o$n$s$e$.$d$a$t$a$.$d$a$t$a$;$$
$ $ $}$,$$
$$
$ $ $/$*$*$$
$ $ $ $*$ $G$e$t$ $r$o$l$e$ $b$y$ $n$a$m$e$$
$ $ $ $*$/$$
$ $ $a$s$y$n$c$ $g$e$t$B$y$N$a$m$e$($n$a$m$e$:$ $s$t$r$i$n$g$)$:$ $P$r$o$m$i$s$e$<$R$o$l$e$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $r$e$s$p$o$n$s$e$ $=$ $a$w$a$i$t$ $a$p$i$C$l$i$e$n$t$.$g$e$t$<${$ $d$a$t$a$:$ $R$o$l$e$ $}$>$($`$/$r$o$l$e$s$/$n$a$m$e$/$$${$n$a$m$e$}$`$)$;$$
$ $ $ $ $r$e$t$u$r$n$ $r$e$s$p$o$n$s$e$.$d$a$t$a$.$d$a$t$a$;$$
$ $ $}$,$$
$$
$ $ $/$*$*$$
$ $ $ $*$ $G$e$t$ $r$o$l$e$ $p$e$r$m$i$s$s$i$o$n$s$$
$ $ $ $*$/$$
$ $ $a$s$y$n$c$ $g$e$t$P$e$r$m$i$s$s$i$o$n$s$($i$d$:$ $n$u$m$b$e$r$)$:$ $P$r$o$m$i$s$e$<$s$t$r$i$n$g$[$]$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $r$e$s$p$o$n$s$e$ $=$ $a$w$a$i$t$ $a$p$i$C$l$i$e$n$t$.$g$e$t$<${$ $d$a$t$a$:$ $s$t$r$i$n$g$[$]$ $}$>$($`$/$r$o$l$e$s$/$$${$i$d$}$/$p$e$r$m$i$s$s$i$o$n$s$`$)$;$$
$ $ $ $ $r$e$t$u$r$n$ $r$e$s$p$o$n$s$e$.$d$a$t$a$.$d$a$t$a$;$$
$ $ $}$,$$
$$
$ $ $/$*$*$$
$ $ $ $*$ $G$e$t$ $a$l$l$ $u$n$i$q$u$e$ $p$e$r$m$i$s$s$i$o$n$s$$
$ $ $ $*$/$$
$ $ $a$s$y$n$c$ $g$e$t$A$l$l$P$e$r$m$i$s$s$i$o$n$s$($)$:$ $P$r$o$m$i$s$e$<$s$t$r$i$n$g$[$]$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $r$e$s$p$o$n$s$e$ $=$ $a$w$a$i$t$ $a$p$i$C$l$i$e$n$t$.$g$e$t$<${$ $d$a$t$a$:$ $s$t$r$i$n$g$[$]$ $}$>$($'$/$r$o$l$e$s$/$p$e$r$m$i$s$s$i$o$n$s$/$a$l$l$'$)$;$$
$ $ $ $ $r$e$t$u$r$n$ $r$e$s$p$o$n$s$e$.$d$a$t$a$.$d$a$t$a$;$$
$ $ $}$,$$
$$
$ $ $/$*$*$$
$ $ $ $*$ $G$e$t$ $r$o$l$e$ $s$t$a$t$i$s$t$i$c$s$$
$ $ $ $*$/$$
$ $ $a$s$y$n$c$ $g$e$t$S$t$a$t$s$($)$:$ $P$r$o$m$i$s$e$<$a$n$y$[$]$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $r$e$s$p$o$n$s$e$ $=$ $a$w$a$i$t$ $a$p$i$C$l$i$e$n$t$.$g$e$t$<${$ $d$a$t$a$:$ $a$n$y$[$]$ $}$>$($'$/$r$o$l$e$s$/$s$t$a$t$s$'$)$;$$
$ $ $ $ $r$e$t$u$r$n$ $r$e$s$p$o$n$s$e$.$d$a$t$a$.$d$a$t$a$;$$
$ $ $}$,$$
$}$;$$
$
