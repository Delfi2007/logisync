$i$m$p$o$r$t$ ${$ $m$e$m$o$ $}$ $f$r$o$m$ $'$r$e$a$c$t$'$;$$
$i$m$p$o$r$t$ ${$ $E$y$e$,$ $E$d$i$t$,$ $T$r$a$s$h$2$,$ $M$a$i$l$,$ $P$h$o$n$e$,$ $B$u$i$l$d$i$n$g$2$ $}$ $f$r$o$m$ $'$l$u$c$i$d$e$-$r$e$a$c$t$'$;$$
$i$m$p$o$r$t$ ${$ $C$u$s$t$o$m$e$r$ $}$ $f$r$o$m$ $'$@$/$s$e$r$v$i$c$e$s$/$c$u$s$t$o$m$e$r$s$'$;$$
$$
$i$n$t$e$r$f$a$c$e$ $C$u$s$t$o$m$e$r$R$o$w$P$r$o$p$s$ ${$$
$ $ $c$u$s$t$o$m$e$r$:$ $C$u$s$t$o$m$e$r$;$$
$ $ $i$s$S$e$l$e$c$t$e$d$:$ $b$o$o$l$e$a$n$;$$
$ $ $o$n$S$e$l$e$c$t$:$ $($c$u$s$t$o$m$e$r$I$d$:$ $n$u$m$b$e$r$)$ $=$>$ $v$o$i$d$;$$
$ $ $o$n$V$i$e$w$:$ $($c$u$s$t$o$m$e$r$:$ $C$u$s$t$o$m$e$r$)$ $=$>$ $v$o$i$d$;$$
$ $ $o$n$E$d$i$t$:$ $($c$u$s$t$o$m$e$r$:$ $C$u$s$t$o$m$e$r$)$ $=$>$ $v$o$i$d$;$$
$ $ $o$n$D$e$l$e$t$e$:$ $($c$u$s$t$o$m$e$r$I$d$:$ $n$u$m$b$e$r$)$ $=$>$ $v$o$i$d$;$$
$}$$
$$
$c$o$n$s$t$ $C$u$s$t$o$m$e$r$R$o$w$ $=$ $m$e$m$o$<$C$u$s$t$o$m$e$r$R$o$w$P$r$o$p$s$>$($(${$ $$
$ $ $c$u$s$t$o$m$e$r$,$ $$
$ $ $i$s$S$e$l$e$c$t$e$d$,$ $$
$ $ $o$n$S$e$l$e$c$t$,$ $$
$ $ $o$n$V$i$e$w$,$$
$ $ $o$n$E$d$i$t$,$ $$
$ $ $o$n$D$e$l$e$t$e$ $$
$}$)$ $=$>$ ${$$
$ $ $c$o$n$s$t$ $f$o$r$m$a$t$C$u$r$r$e$n$c$y$ $=$ $($a$m$o$u$n$t$:$ $n$u$m$b$e$r$)$ $=$>$ ${$$
$ $ $ $ $r$e$t$u$r$n$ $n$e$w$ $I$n$t$l$.$N$u$m$b$e$r$F$o$r$m$a$t$($'$e$n$-$U$S$'$,$ ${$$
$ $ $ $ $ $ $s$t$y$l$e$:$ $'$c$u$r$r$e$n$c$y$'$,$$
$ $ $ $ $ $ $c$u$r$r$e$n$c$y$:$ $'$U$S$D$'$,$$
$ $ $ $ $ $ $m$a$x$i$m$u$m$F$r$a$c$t$i$o$n$D$i$g$i$t$s$:$ $0$,$$
$ $ $ $ $}$)$.$f$o$r$m$a$t$($a$m$o$u$n$t$)$;$$
$ $ $}$;$$
$$
$ $ $c$o$n$s$t$ $f$o$r$m$a$t$D$a$t$e$ $=$ $($d$a$t$e$S$t$r$i$n$g$:$ $s$t$r$i$n$g$)$ $=$>$ ${$$
$ $ $ $ $r$e$t$u$r$n$ $n$e$w$ $D$a$t$e$($d$a$t$e$S$t$r$i$n$g$)$.$t$o$L$o$c$a$l$e$D$a$t$e$S$t$r$i$n$g$($'$e$n$-$U$S$'$,$ ${$$
$ $ $ $ $ $ $y$e$a$r$:$ $'$n$u$m$e$r$i$c$'$,$$
$ $ $ $ $ $ $m$o$n$t$h$:$ $'$s$h$o$r$t$'$,$$
$ $ $ $ $ $ $d$a$y$:$ $'$n$u$m$e$r$i$c$'$$
$ $ $ $ $}$)$;$$
$ $ $}$;$$
$$
$ $ $c$o$n$s$t$ $g$e$t$S$e$g$m$e$n$t$B$a$d$g$e$ $=$ $($s$e$g$m$e$n$t$:$ $'$p$r$e$m$i$u$m$'$ $|$ $'$r$e$g$u$l$a$r$'$ $|$ $'$n$e$w$'$)$ $=$>$ ${$$
$ $ $ $ $c$o$n$s$t$ $s$t$y$l$e$s$ $=$ ${$$
$ $ $ $ $ $ $p$r$e$m$i$u$m$:$ $'$b$g$-$n$e$u$t$r$a$l$-$9$0$0$ $t$e$x$t$-$w$h$i$t$e$ $b$o$r$d$e$r$-$n$e$u$t$r$a$l$-$9$0$0$'$,$$
$ $ $ $ $ $ $r$e$g$u$l$a$r$:$ $'$b$g$-$n$e$u$t$r$a$l$-$3$0$0$ $t$e$x$t$-$n$e$u$t$r$a$l$-$9$0$0$ $b$o$r$d$e$r$-$n$e$u$t$r$a$l$-$4$0$0$'$,$$
$ $ $ $ $ $ $n$e$w$:$ $'$b$g$-$n$e$u$t$r$a$l$-$1$0$0$ $t$e$x$t$-$n$e$u$t$r$a$l$-$7$0$0$ $b$o$r$d$e$r$-$n$e$u$t$r$a$l$-$2$0$0$'$,$$
$ $ $ $ $}$;$$
$ $ $ $ $$
$ $ $ $ $r$e$t$u$r$n$ $($$
$ $ $ $ $ $ $<$s$p$a$n$ $c$l$a$s$s$N$a$m$e$=${$`$p$x$-$2$ $p$y$-$1$ $t$e$x$t$-$x$s$ $f$o$n$t$-$m$e$d$i$u$m$ $b$o$r$d$e$r$ $r$o$u$n$d$e$d$ $c$a$p$i$t$a$l$i$z$e$ $$${$s$t$y$l$e$s$[$s$e$g$m$e$n$t$]$}$`$}$>$$
$ $ $ $ $ $ $ $ ${$s$e$g$m$e$n$t$}$$
$ $ $ $ $ $ $<$/$s$p$a$n$>$$
$ $ $ $ $)$;$$
$ $ $}$;$$
$$
$ $ $r$e$t$u$r$n$ $($$
$ $ $ $ $<$t$r$ $c$l$a$s$s$N$a$m$e$=$"$h$o$v$e$r$:$b$g$-$n$e$u$t$r$a$l$-$5$0$"$>$$
$ $ $ $ $ $ $<$t$d$ $c$l$a$s$s$N$a$m$e$=$"$p$y$-$4$ $p$x$-$6$"$>$$
$ $ $ $ $ $ $ $ $<$i$n$p$u$t$$
$ $ $ $ $ $ $ $ $ $ $t$y$p$e$=$"$c$h$e$c$k$b$o$x$"$$
$ $ $ $ $ $ $ $ $ $ $c$h$e$c$k$e$d$=${$i$s$S$e$l$e$c$t$e$d$}$$
$ $ $ $ $ $ $ $ $ $ $o$n$C$h$a$n$g$e$=${$($)$ $=$>$ $o$n$S$e$l$e$c$t$($c$u$s$t$o$m$e$r$.$i$d$)$}$$
$ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$r$o$u$n$d$e$d$ $b$o$r$d$e$r$-$n$e$u$t$r$a$l$-$3$0$0$ $t$e$x$t$-$n$e$u$t$r$a$l$-$9$0$0$ $f$o$c$u$s$:$r$i$n$g$-$n$e$u$t$r$a$l$-$9$0$0$"$$
$ $ $ $ $ $ $ $ $/$>$$
$ $ $ $ $ $ $<$/$t$d$>$$
$ $ $ $ $ $ $<$t$d$ $c$l$a$s$s$N$a$m$e$=$"$p$y$-$4$ $p$x$-$6$"$>$$
$ $ $ $ $ $ $ $ $<$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$9$0$0$"$>${$c$u$s$t$o$m$e$r$.$n$a$m$e$}$<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ ${$c$u$s$t$o$m$e$r$.$g$s$t$_$n$u$m$b$e$r$ $&$&$ $($$
$ $ $ $ $ $ $ $ $ $ $ $ $<$p$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$x$s$ $t$e$x$t$-$n$e$u$t$r$a$l$-$5$0$0$"$>$G$S$T$:$ ${$c$u$s$t$o$m$e$r$.$g$s$t$_$n$u$m$b$e$r$}$<$/$p$>$$
$ $ $ $ $ $ $ $ $ $ $)$}$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $<$/$t$d$>$$
$ $ $ $ $ $ $<$t$d$ $c$l$a$s$s$N$a$m$e$=$"$p$y$-$4$ $p$x$-$6$"$>$$
$ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$s$p$a$c$e$-$y$-$1$"$>$$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $g$a$p$-$2$ $t$e$x$t$-$s$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$M$a$i$l$ $c$l$a$s$s$N$a$m$e$=$"$w$-$4$ $h$-$4$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$s$p$a$n$ $c$l$a$s$s$N$a$m$e$=$"$t$r$u$n$c$a$t$e$ $m$a$x$-$w$-$[$2$0$0$p$x$]$"$>${$c$u$s$t$o$m$e$r$.$e$m$a$i$l$}$<$/$s$p$a$n$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $g$a$p$-$2$ $t$e$x$t$-$s$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$P$h$o$n$e$ $c$l$a$s$s$N$a$m$e$=$"$w$-$4$ $h$-$4$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$s$p$a$n$>${$c$u$s$t$o$m$e$r$.$p$h$o$n$e$}$<$/$s$p$a$n$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $<$/$t$d$>$$
$ $ $ $ $ $ $<$t$d$ $c$l$a$s$s$N$a$m$e$=$"$p$y$-$4$ $p$x$-$6$"$>$$
$ $ $ $ $ $ $ $ ${$c$u$s$t$o$m$e$r$.$b$u$s$i$n$e$s$s$_$n$a$m$e$ $?$ $($$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $g$a$p$-$2$ $t$e$x$t$-$s$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$7$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$B$u$i$l$d$i$n$g$2$ $c$l$a$s$s$N$a$m$e$=$"$w$-$4$ $h$-$4$ $t$e$x$t$-$n$e$u$t$r$a$l$-$4$0$0$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$s$p$a$n$>${$c$u$s$t$o$m$e$r$.$b$u$s$i$n$e$s$s$_$n$a$m$e$}$<$/$s$p$a$n$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $)$ $:$ $($$
$ $ $ $ $ $ $ $ $ $ $<$s$p$a$n$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$4$0$0$"$>$â$€$”$<$/$s$p$a$n$>$$
$ $ $ $ $ $ $ $ $)$}$$
$ $ $ $ $ $ $<$/$t$d$>$$
$ $ $ $ $ $ $<$t$d$ $c$l$a$s$s$N$a$m$e$=$"$p$y$-$4$ $p$x$-$6$"$>$$
$ $ $ $ $ $ $ $ ${$g$e$t$S$e$g$m$e$n$t$B$a$d$g$e$($c$u$s$t$o$m$e$r$.$s$e$g$m$e$n$t$)$}$$
$ $ $ $ $ $ $<$/$t$d$>$$
$ $ $ $ $ $ $<$t$d$ $c$l$a$s$s$N$a$m$e$=$"$p$y$-$4$ $p$x$-$6$"$>$$
$ $ $ $ $ $ $ $ $<$s$p$a$n$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$9$0$0$ $f$o$n$t$-$m$e$d$i$u$m$"$>${$c$u$s$t$o$m$e$r$.$t$o$t$a$l$_$o$r$d$e$r$s$}$<$/$s$p$a$n$>$$
$ $ $ $ $ $ $<$/$t$d$>$$
$ $ $ $ $ $ $<$t$d$ $c$l$a$s$s$N$a$m$e$=$"$p$y$-$4$ $p$x$-$6$"$>$$
$ $ $ $ $ $ $ $ $<$s$p$a$n$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$9$0$0$ $f$o$n$t$-$m$e$d$i$u$m$"$>$$
$ $ $ $ $ $ $ $ $ $ ${$f$o$r$m$a$t$C$u$r$r$e$n$c$y$($c$u$s$t$o$m$e$r$.$t$o$t$a$l$_$r$e$v$e$n$u$e$)$}$$
$ $ $ $ $ $ $ $ $<$/$s$p$a$n$>$$
$ $ $ $ $ $ $<$/$t$d$>$$
$ $ $ $ $ $ $<$t$d$ $c$l$a$s$s$N$a$m$e$=$"$p$y$-$4$ $p$x$-$6$"$>$$
$ $ $ $ $ $ $ $ $<$s$p$a$n$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$"$>${$f$o$r$m$a$t$D$a$t$e$($c$u$s$t$o$m$e$r$.$c$r$e$a$t$e$d$_$a$t$)$}$<$/$s$p$a$n$>$$
$ $ $ $ $ $ $<$/$t$d$>$$
$ $ $ $ $ $ $<$t$d$ $c$l$a$s$s$N$a$m$e$=$"$p$y$-$4$ $p$x$-$6$"$>$$
$ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$e$n$d$ $g$a$p$-$2$"$>$$
$ $ $ $ $ $ $ $ $ $ $<$b$u$t$t$o$n$$
$ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$l$i$c$k$=${$($)$ $=$>$ $o$n$V$i$e$w$($c$u$s$t$o$m$e$r$)$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$p$-$2$ $t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$ $h$o$v$e$r$:$t$e$x$t$-$n$e$u$t$r$a$l$-$9$0$0$ $h$o$v$e$r$:$b$g$-$n$e$u$t$r$a$l$-$1$0$0$ $r$o$u$n$d$e$d$-$l$g$ $t$r$a$n$s$i$t$i$o$n$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $t$i$t$l$e$=$"$V$i$e$w$ $D$e$t$a$i$l$s$"$$
$ $ $ $ $ $ $ $ $ $ $>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$E$y$e$ $c$l$a$s$s$N$a$m$e$=$"$w$-$4$ $h$-$4$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$b$u$t$t$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $<$b$u$t$t$o$n$$
$ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$l$i$c$k$=${$($)$ $=$>$ $o$n$E$d$i$t$($c$u$s$t$o$m$e$r$)$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$p$-$2$ $t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$ $h$o$v$e$r$:$t$e$x$t$-$n$e$u$t$r$a$l$-$9$0$0$ $h$o$v$e$r$:$b$g$-$n$e$u$t$r$a$l$-$1$0$0$ $r$o$u$n$d$e$d$-$l$g$ $t$r$a$n$s$i$t$i$o$n$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $t$i$t$l$e$=$"$E$d$i$t$"$$
$ $ $ $ $ $ $ $ $ $ $>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$E$d$i$t$ $c$l$a$s$s$N$a$m$e$=$"$w$-$4$ $h$-$4$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$b$u$t$t$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $<$b$u$t$t$o$n$$
$ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$l$i$c$k$=${$($)$ $=$>$ $o$n$D$e$l$e$t$e$($c$u$s$t$o$m$e$r$.$i$d$)$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$p$-$2$ $t$e$x$t$-$r$e$d$-$6$0$0$ $h$o$v$e$r$:$t$e$x$t$-$r$e$d$-$7$0$0$ $h$o$v$e$r$:$b$g$-$r$e$d$-$5$0$ $r$o$u$n$d$e$d$-$l$g$ $t$r$a$n$s$i$t$i$o$n$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $t$i$t$l$e$=$"$D$e$l$e$t$e$"$$
$ $ $ $ $ $ $ $ $ $ $>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$T$r$a$s$h$2$ $c$l$a$s$s$N$a$m$e$=$"$w$-$4$ $h$-$4$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$b$u$t$t$o$n$>$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $<$/$t$d$>$$
$ $ $ $ $<$/$t$r$>$$
$ $ $)$;$$
$}$)$;$$
$$
$C$u$s$t$o$m$e$r$R$o$w$.$d$i$s$p$l$a$y$N$a$m$e$ $=$ $'$C$u$s$t$o$m$e$r$R$o$w$'$;$$
$$
$e$x$p$o$r$t$ $d$e$f$a$u$l$t$ $C$u$s$t$o$m$e$r$R$o$w$;$$
$
