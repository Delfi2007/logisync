$i$m$p$o$r$t$ ${$ $u$s$e$E$f$f$e$c$t$,$ $u$s$e$R$e$f$ $}$ $f$r$o$m$ $'$r$e$a$c$t$'$;$$
$i$m$p$o$r$t$ ${$ $X$ $}$ $f$r$o$m$ $'$l$u$c$i$d$e$-$r$e$a$c$t$'$;$$
$$
$i$n$t$e$r$f$a$c$e$ $M$o$d$a$l$P$r$o$p$s$ ${$$
$ $ $i$s$O$p$e$n$:$ $b$o$o$l$e$a$n$;$$
$ $ $o$n$C$l$o$s$e$:$ $($)$ $=$>$ $v$o$i$d$;$$
$ $ $t$i$t$l$e$:$ $s$t$r$i$n$g$;$$
$ $ $c$h$i$l$d$r$e$n$:$ $R$e$a$c$t$.$R$e$a$c$t$N$o$d$e$;$$
$ $ $s$i$z$e$?$:$ $'$s$m$'$ $|$ $'$m$d$'$ $|$ $'$l$g$'$ $|$ $'$x$l$'$ $|$ $'$f$u$l$l$'$;$$
$ $ $s$h$o$w$C$l$o$s$e$B$u$t$t$o$n$?$:$ $b$o$o$l$e$a$n$;$$
$}$$
$$
$e$x$p$o$r$t$ $d$e$f$a$u$l$t$ $f$u$n$c$t$i$o$n$ $M$o$d$a$l$(${$$
$ $ $i$s$O$p$e$n$,$$
$ $ $o$n$C$l$o$s$e$,$$
$ $ $t$i$t$l$e$,$$
$ $ $c$h$i$l$d$r$e$n$,$$
$ $ $s$i$z$e$ $=$ $'$m$d$'$,$$
$ $ $s$h$o$w$C$l$o$s$e$B$u$t$t$o$n$ $=$ $t$r$u$e$,$$
$}$:$ $M$o$d$a$l$P$r$o$p$s$)$ ${$$
$ $ $c$o$n$s$t$ $m$o$d$a$l$R$e$f$ $=$ $u$s$e$R$e$f$<$H$T$M$L$D$i$v$E$l$e$m$e$n$t$>$($n$u$l$l$)$;$$
$$
$ $ $/$/$ $H$a$n$d$l$e$ $E$S$C$ $k$e$y$ $p$r$e$s$s$$
$ $ $u$s$e$E$f$f$e$c$t$($($)$ $=$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $h$a$n$d$l$e$E$s$c$a$p$e$ $=$ $($e$:$ $K$e$y$b$o$a$r$d$E$v$e$n$t$)$ $=$>$ ${$$
$ $ $ $ $ $ $i$f$ $($e$.$k$e$y$ $=$=$=$ $'$E$s$c$a$p$e$'$ $&$&$ $i$s$O$p$e$n$)$ ${$$
$ $ $ $ $ $ $ $ $o$n$C$l$o$s$e$($)$;$$
$ $ $ $ $ $ $}$$
$ $ $ $ $}$;$$
$$
$ $ $ $ $i$f$ $($i$s$O$p$e$n$)$ ${$$
$ $ $ $ $ $ $d$o$c$u$m$e$n$t$.$a$d$d$E$v$e$n$t$L$i$s$t$e$n$e$r$($'$k$e$y$d$o$w$n$'$,$ $h$a$n$d$l$e$E$s$c$a$p$e$)$;$$
$ $ $ $ $ $ $/$/$ $P$r$e$v$e$n$t$ $b$o$d$y$ $s$c$r$o$l$l$ $w$h$e$n$ $m$o$d$a$l$ $i$s$ $o$p$e$n$$
$ $ $ $ $ $ $d$o$c$u$m$e$n$t$.$b$o$d$y$.$s$t$y$l$e$.$o$v$e$r$f$l$o$w$ $=$ $'$h$i$d$d$e$n$'$;$$
$ $ $ $ $}$$
$$
$ $ $ $ $r$e$t$u$r$n$ $($)$ $=$>$ ${$$
$ $ $ $ $ $ $d$o$c$u$m$e$n$t$.$r$e$m$o$v$e$E$v$e$n$t$L$i$s$t$e$n$e$r$($'$k$e$y$d$o$w$n$'$,$ $h$a$n$d$l$e$E$s$c$a$p$e$)$;$$
$ $ $ $ $ $ $d$o$c$u$m$e$n$t$.$b$o$d$y$.$s$t$y$l$e$.$o$v$e$r$f$l$o$w$ $=$ $'$u$n$s$e$t$'$;$$
$ $ $ $ $}$;$$
$ $ $}$,$ $[$i$s$O$p$e$n$,$ $o$n$C$l$o$s$e$]$)$;$$
$$
$ $ $/$/$ $H$a$n$d$l$e$ $b$a$c$k$d$r$o$p$ $c$l$i$c$k$$
$ $ $c$o$n$s$t$ $h$a$n$d$l$e$B$a$c$k$d$r$o$p$C$l$i$c$k$ $=$ $($e$:$ $R$e$a$c$t$.$M$o$u$s$e$E$v$e$n$t$<$H$T$M$L$D$i$v$E$l$e$m$e$n$t$>$)$ $=$>$ ${$$
$ $ $ $ $i$f$ $($e$.$t$a$r$g$e$t$ $=$=$=$ $e$.$c$u$r$r$e$n$t$T$a$r$g$e$t$)$ ${$$
$ $ $ $ $ $ $o$n$C$l$o$s$e$($)$;$$
$ $ $ $ $}$$
$ $ $}$;$$
$$
$ $ $/$/$ $D$o$n$'$t$ $r$e$n$d$e$r$ $i$f$ $n$o$t$ $o$p$e$n$$
$ $ $i$f$ $($!$i$s$O$p$e$n$)$ $r$e$t$u$r$n$ $n$u$l$l$;$$
$$
$ $ $/$/$ $M$o$d$a$l$ $s$i$z$e$ $c$l$a$s$s$e$s$$
$ $ $c$o$n$s$t$ $s$i$z$e$C$l$a$s$s$e$s$ $=$ ${$$
$ $ $ $ $s$m$:$ $'$m$a$x$-$w$-$m$d$'$,$$
$ $ $ $ $m$d$:$ $'$m$a$x$-$w$-$l$g$'$,$$
$ $ $ $ $l$g$:$ $'$m$a$x$-$w$-$2$x$l$'$,$$
$ $ $ $ $x$l$:$ $'$m$a$x$-$w$-$4$x$l$'$,$$
$ $ $ $ $f$u$l$l$:$ $'$m$a$x$-$w$-$f$u$l$l$ $m$x$-$4$'$,$$
$ $ $}$;$$
$$
$ $ $r$e$t$u$r$n$ $($$
$ $ $ $ $<$d$i$v$$
$ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$f$i$x$e$d$ $i$n$s$e$t$-$0$ $z$-$5$0$ $f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$c$e$n$t$e$r$ $p$-$4$ $b$g$-$b$l$a$c$k$ $b$g$-$o$p$a$c$i$t$y$-$5$0$ $b$a$c$k$d$r$o$p$-$b$l$u$r$-$s$m$ $a$n$i$m$a$t$e$-$f$a$d$e$I$n$"$$
$ $ $ $ $ $ $o$n$C$l$i$c$k$=${$h$a$n$d$l$e$B$a$c$k$d$r$o$p$C$l$i$c$k$}$$
$ $ $ $ $ $ $r$o$l$e$=$"$d$i$a$l$o$g$"$$
$ $ $ $ $ $ $a$r$i$a$-$m$o$d$a$l$=$"$t$r$u$e$"$$
$ $ $ $ $ $ $a$r$i$a$-$l$a$b$e$l$l$e$d$b$y$=$"$m$o$d$a$l$-$t$i$t$l$e$"$$
$ $ $ $ $>$$
$ $ $ $ $ $ $<$d$i$v$$
$ $ $ $ $ $ $ $ $r$e$f$=${$m$o$d$a$l$R$e$f$}$$
$ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=${$`$b$g$-$w$h$i$t$e$ $r$o$u$n$d$e$d$-$l$g$ $s$h$a$d$o$w$-$2$x$l$ $w$-$f$u$l$l$ $$${$s$i$z$e$C$l$a$s$s$e$s$[$s$i$z$e$]$}$ $m$a$x$-$h$-$[$9$0$v$h$]$ $f$l$e$x$ $f$l$e$x$-$c$o$l$ $a$n$i$m$a$t$e$-$s$l$i$d$e$U$p$`$}$$
$ $ $ $ $ $ $>$$
$ $ $ $ $ $ $ $ ${$/$*$ $H$e$a$d$e$r$ $*$/$}$$
$ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$b$e$t$w$e$e$n$ $p$x$-$6$ $p$y$-$4$ $b$o$r$d$e$r$-$b$ $b$o$r$d$e$r$-$n$e$u$t$r$a$l$-$2$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $<$h$2$$
$ $ $ $ $ $ $ $ $ $ $ $ $i$d$=$"$m$o$d$a$l$-$t$i$t$l$e$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$x$l$ $f$o$n$t$-$b$o$l$d$ $t$e$x$t$-$n$e$u$t$r$a$l$-$9$0$0$"$$
$ $ $ $ $ $ $ $ $ $ $>$$
$ $ $ $ $ $ $ $ $ $ $ $ ${$t$i$t$l$e$}$$
$ $ $ $ $ $ $ $ $ $ $<$/$h$2$>$$
$ $ $ $ $ $ $ $ $ $ ${$s$h$o$w$C$l$o$s$e$B$u$t$t$o$n$ $&$&$ $($$
$ $ $ $ $ $ $ $ $ $ $ $ $<$b$u$t$t$o$n$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$l$i$c$k$=${$o$n$C$l$o$s$e$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$p$-$2$ $h$o$v$e$r$:$b$g$-$n$e$u$t$r$a$l$-$1$0$0$ $r$o$u$n$d$e$d$-$l$g$ $t$r$a$n$s$i$t$i$o$n$-$c$o$l$o$r$s$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $a$r$i$a$-$l$a$b$e$l$=$"$C$l$o$s$e$ $m$o$d$a$l$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$X$ $c$l$a$s$s$N$a$m$e$=$"$w$-$5$ $h$-$5$ $t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$b$u$t$t$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $)$}$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$$
$ $ $ $ $ $ $ $ ${$/$*$ $C$o$n$t$e$n$t$ $*$/$}$$
$ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$-$1$ $o$v$e$r$f$l$o$w$-$y$-$a$u$t$o$ $p$x$-$6$ $p$y$-$4$"$>$$
$ $ $ $ $ $ $ $ $ $ ${$c$h$i$l$d$r$e$n$}$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $<$/$d$i$v$>$$
$ $ $)$;$$
$}$$
$
