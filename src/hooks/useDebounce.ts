$i$m$p$o$r$t$ ${$ $u$s$e$S$t$a$t$e$,$ $u$s$e$E$f$f$e$c$t$ $}$ $f$r$o$m$ $'$r$e$a$c$t$'$;$$
$$
$/$*$*$$
$ $*$ $C$u$s$t$o$m$ $h$o$o$k$ $t$o$ $d$e$b$o$u$n$c$e$ $a$ $v$a$l$u$e$$
$ $*$ $$
$ $*$ $D$e$l$a$y$s$ $u$p$d$a$t$i$n$g$ $t$h$e$ $r$e$t$u$r$n$e$d$ $v$a$l$u$e$ $u$n$t$i$l$ $t$h$e$ $i$n$p$u$t$ $v$a$l$u$e$ $h$a$s$n$'$t$ $c$h$a$n$g$e$d$ $$
$ $*$ $f$o$r$ $t$h$e$ $s$p$e$c$i$f$i$e$d$ $d$e$l$a$y$ $p$e$r$i$o$d$.$ $U$s$e$f$u$l$ $f$o$r$ $r$e$d$u$c$i$n$g$ $A$P$I$ $c$a$l$l$s$ $d$u$r$i$n$g$ $t$y$p$i$n$g$.$$
$ $*$ $$
$ $*$ $@$p$a$r$a$m$ $v$a$l$u$e$ $-$ $T$h$e$ $v$a$l$u$e$ $t$o$ $d$e$b$o$u$n$c$e$$
$ $*$ $@$p$a$r$a$m$ $d$e$l$a$y$ $-$ $T$h$e$ $d$e$l$a$y$ $i$n$ $m$i$l$l$i$s$e$c$o$n$d$s$ $($d$e$f$a$u$l$t$:$ $5$0$0$m$s$)$$
$ $*$ $@$r$e$t$u$r$n$s$ $T$h$e$ $d$e$b$o$u$n$c$e$d$ $v$a$l$u$e$$
$ $*$ $$
$ $*$ $@$e$x$a$m$p$l$e$$
$ $*$ $`$`$`$t$s$x$$
$ $*$ $c$o$n$s$t$ $[$s$e$a$r$c$h$Q$u$e$r$y$,$ $s$e$t$S$e$a$r$c$h$Q$u$e$r$y$]$ $=$ $u$s$e$S$t$a$t$e$($'$'$)$;$$
$ $*$ $c$o$n$s$t$ $d$e$b$o$u$n$c$e$d$Q$u$e$r$y$ $=$ $u$s$e$D$e$b$o$u$n$c$e$($s$e$a$r$c$h$Q$u$e$r$y$,$ $5$0$0$)$;$$
$ $*$ $$
$ $*$ $u$s$e$E$f$f$e$c$t$($($)$ $=$>$ ${$$
$ $*$ $ $ $/$/$ $T$h$i$s$ $o$n$l$y$ $r$u$n$s$ $5$0$0$m$s$ $a$f$t$e$r$ $u$s$e$r$ $s$t$o$p$s$ $t$y$p$i$n$g$$
$ $*$ $ $ $f$e$t$c$h$R$e$s$u$l$t$s$($d$e$b$o$u$n$c$e$d$Q$u$e$r$y$)$;$$
$ $*$ $}$,$ $[$d$e$b$o$u$n$c$e$d$Q$u$e$r$y$]$)$;$$
$ $*$ $`$`$`$$
$ $*$/$$
$e$x$p$o$r$t$ $f$u$n$c$t$i$o$n$ $u$s$e$D$e$b$o$u$n$c$e$<$T$>$($v$a$l$u$e$:$ $T$,$ $d$e$l$a$y$:$ $n$u$m$b$e$r$ $=$ $5$0$0$)$:$ $T$ ${$$
$ $ $c$o$n$s$t$ $[$d$e$b$o$u$n$c$e$d$V$a$l$u$e$,$ $s$e$t$D$e$b$o$u$n$c$e$d$V$a$l$u$e$]$ $=$ $u$s$e$S$t$a$t$e$<$T$>$($v$a$l$u$e$)$;$$
$$
$ $ $u$s$e$E$f$f$e$c$t$($($)$ $=$>$ ${$$
$ $ $ $ $/$/$ $S$e$t$ $u$p$ $a$ $t$i$m$e$r$ $t$o$ $u$p$d$a$t$e$ $t$h$e$ $d$e$b$o$u$n$c$e$d$ $v$a$l$u$e$ $a$f$t$e$r$ $t$h$e$ $d$e$l$a$y$$
$ $ $ $ $c$o$n$s$t$ $t$i$m$e$r$ $=$ $s$e$t$T$i$m$e$o$u$t$($($)$ $=$>$ ${$$
$ $ $ $ $ $ $s$e$t$D$e$b$o$u$n$c$e$d$V$a$l$u$e$($v$a$l$u$e$)$;$$
$ $ $ $ $}$,$ $d$e$l$a$y$)$;$$
$$
$ $ $ $ $/$/$ $C$l$e$a$n$ $u$p$ $t$h$e$ $t$i$m$e$r$ $i$f$ $v$a$l$u$e$ $c$h$a$n$g$e$s$ $b$e$f$o$r$e$ $d$e$l$a$y$ $e$x$p$i$r$e$s$$
$ $ $ $ $/$/$ $T$h$i$s$ $e$n$s$u$r$e$s$ $w$e$ $o$n$l$y$ $u$p$d$a$t$e$ $a$f$t$e$r$ $u$s$e$r$ $s$t$o$p$s$ $t$y$p$i$n$g$$
$ $ $ $ $r$e$t$u$r$n$ $($)$ $=$>$ ${$$
$ $ $ $ $ $ $c$l$e$a$r$T$i$m$e$o$u$t$($t$i$m$e$r$)$;$$
$ $ $ $ $}$;$$
$ $ $}$,$ $[$v$a$l$u$e$,$ $d$e$l$a$y$]$)$;$$
$$
$ $ $r$e$t$u$r$n$ $d$e$b$o$u$n$c$e$d$V$a$l$u$e$;$$
$}$$
$$
$e$x$p$o$r$t$ $d$e$f$a$u$l$t$ $u$s$e$D$e$b$o$u$n$c$e$;$$
$
