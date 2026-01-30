$i$m$p$o$r$t$ ${$ $m$e$m$o$ $}$ $f$r$o$m$ $'$r$e$a$c$t$'$;$$
$i$m$p$o$r$t$ ${$ $P$a$c$k$a$g$e$,$ $E$d$i$t$,$ $T$r$a$s$h$2$,$ $M$o$r$e$V$e$r$t$i$c$a$l$ $}$ $f$r$o$m$ $'$l$u$c$i$d$e$-$r$e$a$c$t$'$;$$
$i$m$p$o$r$t$ ${$ $P$r$o$d$u$c$t$ $}$ $f$r$o$m$ $'$@$/$s$e$r$v$i$c$e$s$/$p$r$o$d$u$c$t$s$'$;$$
$$
$i$n$t$e$r$f$a$c$e$ $P$r$o$d$u$c$t$R$o$w$P$r$o$p$s$ ${$$
$ $ $p$r$o$d$u$c$t$:$ $P$r$o$d$u$c$t$;$$
$ $ $i$s$S$e$l$e$c$t$e$d$:$ $b$o$o$l$e$a$n$;$$
$ $ $o$n$S$e$l$e$c$t$:$ $($p$r$o$d$u$c$t$I$d$:$ $n$u$m$b$e$r$)$ $=$>$ $v$o$i$d$;$$
$ $ $o$n$E$d$i$t$:$ $($p$r$o$d$u$c$t$:$ $P$r$o$d$u$c$t$)$ $=$>$ $v$o$i$d$;$$
$ $ $o$n$D$e$l$e$t$e$:$ $($p$r$o$d$u$c$t$I$d$:$ $n$u$m$b$e$r$)$ $=$>$ $v$o$i$d$;$$
$}$$
$$
$/$*$*$$
$ $*$ $M$e$m$o$i$z$e$d$ $P$r$o$d$u$c$t$R$o$w$ $c$o$m$p$o$n$e$n$t$$
$ $*$ $$
$ $*$ $T$h$i$s$ $c$o$m$p$o$n$e$n$t$ $i$s$ $o$p$t$i$m$i$z$e$d$ $t$o$ $p$r$e$v$e$n$t$ $u$n$n$e$c$e$s$s$a$r$y$ $r$e$-$r$e$n$d$e$r$s$.$$
$ $*$ $I$t$ $o$n$l$y$ $r$e$-$r$e$n$d$e$r$s$ $w$h$e$n$ $i$t$s$ $p$r$o$p$s$ $a$c$t$u$a$l$l$y$ $c$h$a$n$g$e$.$$
$ $*$ $$
$ $*$ $P$e$r$f$o$r$m$a$n$c$e$ $I$m$p$a$c$t$:$$
$ $*$ $-$ $W$i$t$h$o$u$t$ $m$e$m$o$:$ $A$l$l$ $1$0$0$+$ $r$o$w$s$ $r$e$-$r$e$n$d$e$r$ $o$n$ $A$N$Y$ $s$t$a$t$e$ $c$h$a$n$g$e$$
$ $*$ $-$ $W$i$t$h$ $m$e$m$o$:$ $O$n$l$y$ $c$h$a$n$g$e$d$ $r$o$w$s$ $r$e$-$r$e$n$d$e$r$ $($9$9$%$ $r$e$d$u$c$t$i$o$n$!$)$$
$ $*$/$$
$c$o$n$s$t$ $P$r$o$d$u$c$t$R$o$w$ $=$ $m$e$m$o$<$P$r$o$d$u$c$t$R$o$w$P$r$o$p$s$>$($(${$ $$
$ $ $p$r$o$d$u$c$t$,$ $$
$ $ $i$s$S$e$l$e$c$t$e$d$,$ $$
$ $ $o$n$S$e$l$e$c$t$,$ $$
$ $ $o$n$E$d$i$t$,$ $$
$ $ $o$n$D$e$l$e$t$e$ $$
$}$)$ $=$>$ ${$$
$ $ $/$/$ $C$a$l$c$u$l$a$t$e$ $s$t$o$c$k$ $s$t$a$t$u$s$$
$ $ $c$o$n$s$t$ $g$e$t$S$t$o$c$k$S$t$a$t$u$s$ $=$ $($)$:$ ${$ $l$a$b$e$l$:$ $s$t$r$i$n$g$;$ $c$o$l$o$r$:$ $s$t$r$i$n$g$ $}$ $=$>$ ${$$
$ $ $ $ $i$f$ $($p$r$o$d$u$c$t$.$s$t$o$c$k$ $=$=$=$ $0$)$ ${$$
$ $ $ $ $ $ $r$e$t$u$r$n$ ${$ $l$a$b$e$l$:$ $'$O$u$t$ $o$f$ $S$t$o$c$k$'$,$ $c$o$l$o$r$:$ $'$b$g$-$n$e$u$t$r$a$l$-$9$0$0$ $t$e$x$t$-$w$h$i$t$e$'$ $}$;$$
$ $ $ $ $}$ $e$l$s$e$ $i$f$ $($p$r$o$d$u$c$t$.$s$t$o$c$k$ $<$ $p$r$o$d$u$c$t$.$r$e$o$r$d$e$r$_$l$e$v$e$l$)$ ${$$
$ $ $ $ $ $ $r$e$t$u$r$n$ ${$ $l$a$b$e$l$:$ $'$L$o$w$ $S$t$o$c$k$'$,$ $c$o$l$o$r$:$ $'$b$g$-$n$e$u$t$r$a$l$-$3$0$0$ $t$e$x$t$-$n$e$u$t$r$a$l$-$9$0$0$'$ $}$;$$
$ $ $ $ $}$ $e$l$s$e$ ${$$
$ $ $ $ $ $ $r$e$t$u$r$n$ ${$ $l$a$b$e$l$:$ $'$I$n$ $S$t$o$c$k$'$,$ $c$o$l$o$r$:$ $'$b$g$-$n$e$u$t$r$a$l$-$1$0$0$ $t$e$x$t$-$n$e$u$t$r$a$l$-$7$0$0$'$ $}$;$$
$ $ $ $ $}$$
$ $ $}$;$$
$$
$ $ $c$o$n$s$t$ $s$t$a$t$u$s$ $=$ $g$e$t$S$t$o$c$k$S$t$a$t$u$s$($)$;$$
$$
$ $ $r$e$t$u$r$n$ $($$
$ $ $ $ $<$t$r$ $c$l$a$s$s$N$a$m$e$=$"$h$o$v$e$r$:$b$g$-$n$e$u$t$r$a$l$-$5$0$ $t$r$a$n$s$i$t$i$o$n$-$c$o$l$o$r$s$"$>$$
$ $ $ $ $ $ $<$t$d$ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$6$ $p$y$-$4$ $w$h$i$t$e$s$p$a$c$e$-$n$o$w$r$a$p$"$>$$
$ $ $ $ $ $ $ $ $<$i$n$p$u$t$$
$ $ $ $ $ $ $ $ $ $ $t$y$p$e$=$"$c$h$e$c$k$b$o$x$"$$
$ $ $ $ $ $ $ $ $ $ $c$h$e$c$k$e$d$=${$i$s$S$e$l$e$c$t$e$d$}$$
$ $ $ $ $ $ $ $ $ $ $o$n$C$h$a$n$g$e$=${$($)$ $=$>$ $o$n$S$e$l$e$c$t$($p$r$o$d$u$c$t$.$i$d$)$}$$
$ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$w$-$4$ $h$-$4$ $t$e$x$t$-$n$e$u$t$r$a$l$-$9$0$0$ $b$o$r$d$e$r$-$n$e$u$t$r$a$l$-$3$0$0$ $r$o$u$n$d$e$d$ $f$o$c$u$s$:$r$i$n$g$-$n$e$u$t$r$a$l$-$9$0$0$"$$
$ $ $ $ $ $ $ $ $/$>$$
$ $ $ $ $ $ $<$/$t$d$>$$
$ $ $ $ $ $ $<$t$d$ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$6$ $p$y$-$4$ $w$h$i$t$e$s$p$a$c$e$-$n$o$w$r$a$p$"$>$$
$ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$"$>$$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$w$-$1$0$ $h$-$1$0$ $b$g$-$n$e$u$t$r$a$l$-$1$0$0$ $r$o$u$n$d$e$d$-$l$g$ $f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$c$e$n$t$e$r$ $f$l$e$x$-$s$h$r$i$n$k$-$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$P$a$c$k$a$g$e$ $c$l$a$s$s$N$a$m$e$=$"$w$-$5$ $h$-$5$ $t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$m$l$-$4$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$9$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ ${$p$r$o$d$u$c$t$.$n$a$m$e$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ ${$p$r$o$d$u$c$t$.$d$e$s$c$r$i$p$t$i$o$n$ $&$&$ $($$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$5$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ ${$p$r$o$d$u$c$t$.$d$e$s$c$r$i$p$t$i$o$n$.$s$u$b$s$t$r$i$n$g$($0$,$ $3$0$)$}$.$.$.$$
$ $ $ $ $ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $)$}$$
$ $ $ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $<$/$t$d$>$$
$ $ $ $ $ $ $<$t$d$ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$6$ $p$y$-$4$ $w$h$i$t$e$s$p$a$c$e$-$n$o$w$r$a$p$"$>$$
$ $ $ $ $ $ $ $ $<$s$p$a$n$ $c$l$a$s$s$N$a$m$e$=$"$f$o$n$t$-$m$o$n$o$ $t$e$x$t$-$s$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$9$0$0$"$>${$p$r$o$d$u$c$t$.$s$k$u$}$<$/$s$p$a$n$>$$
$ $ $ $ $ $ $<$/$t$d$>$$
$ $ $ $ $ $ $<$t$d$ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$6$ $p$y$-$4$ $w$h$i$t$e$s$p$a$c$e$-$n$o$w$r$a$p$"$>$$
$ $ $ $ $ $ $ $ $<$s$p$a$n$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$7$0$0$"$>${$p$r$o$d$u$c$t$.$c$a$t$e$g$o$r$y$ $|$|$ $'$U$n$c$a$t$e$g$o$r$i$z$e$d$'$}$<$/$s$p$a$n$>$$
$ $ $ $ $ $ $<$/$t$d$>$$
$ $ $ $ $ $ $<$t$d$ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$6$ $p$y$-$4$ $w$h$i$t$e$s$p$a$c$e$-$n$o$w$r$a$p$"$>$$
$ $ $ $ $ $ $ $ $<$s$p$a$n$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$9$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ ${$p$r$o$d$u$c$t$.$s$t$o$c$k$}$ ${$p$r$o$d$u$c$t$.$u$n$i$t$ $|$|$ $'$u$n$i$t$s$'$}$$
$ $ $ $ $ $ $ $ $<$/$s$p$a$n$>$$
$ $ $ $ $ $ $<$/$t$d$>$$
$ $ $ $ $ $ $<$t$d$ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$6$ $p$y$-$4$ $w$h$i$t$e$s$p$a$c$e$-$n$o$w$r$a$p$"$>$$
$ $ $ $ $ $ $ $ $<$s$p$a$n$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ ${$p$r$o$d$u$c$t$.$r$e$o$r$d$e$r$_$l$e$v$e$l$}$ ${$p$r$o$d$u$c$t$.$u$n$i$t$ $|$|$ $'$u$n$i$t$s$'$}$$
$ $ $ $ $ $ $ $ $<$/$s$p$a$n$>$$
$ $ $ $ $ $ $<$/$t$d$>$$
$ $ $ $ $ $ $<$t$d$ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$6$ $p$y$-$4$ $w$h$i$t$e$s$p$a$c$e$-$n$o$w$r$a$p$"$>$$
$ $ $ $ $ $ $ $ $<$s$p$a$n$ $c$l$a$s$s$N$a$m$e$=$"$t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$ $t$e$x$t$-$n$e$u$t$r$a$l$-$9$0$0$"$>$$
$ $ $ $ $ $ $ $ $ $ $â$‚$¹${$p$r$o$d$u$c$t$.$p$r$i$c$e$.$t$o$L$o$c$a$l$e$S$t$r$i$n$g$($'$e$n$-$U$S$'$)$}$$
$ $ $ $ $ $ $ $ $<$/$s$p$a$n$>$$
$ $ $ $ $ $ $<$/$t$d$>$$
$ $ $ $ $ $ $<$t$d$ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$6$ $p$y$-$4$ $w$h$i$t$e$s$p$a$c$e$-$n$o$w$r$a$p$"$>$$
$ $ $ $ $ $ $ $ $<$s$p$a$n$ $c$l$a$s$s$N$a$m$e$=${$`$b$a$d$g$e$ $$${$s$t$a$t$u$s$.$c$o$l$o$r$}$`$}$>$$
$ $ $ $ $ $ $ $ $ $ ${$s$t$a$t$u$s$.$l$a$b$e$l$}$$
$ $ $ $ $ $ $ $ $<$/$s$p$a$n$>$$
$ $ $ $ $ $ $<$/$t$d$>$$
$ $ $ $ $ $ $<$t$d$ $c$l$a$s$s$N$a$m$e$=$"$p$x$-$6$ $p$y$-$4$ $w$h$i$t$e$s$p$a$c$e$-$n$o$w$r$a$p$ $t$e$x$t$-$r$i$g$h$t$ $t$e$x$t$-$s$m$ $f$o$n$t$-$m$e$d$i$u$m$"$>$$
$ $ $ $ $ $ $ $ $<$d$i$v$ $c$l$a$s$s$N$a$m$e$=$"$f$l$e$x$ $i$t$e$m$s$-$c$e$n$t$e$r$ $j$u$s$t$i$f$y$-$e$n$d$ $g$a$p$-$2$"$>$$
$ $ $ $ $ $ $ $ $ $ $<$b$u$t$t$o$n$ $$
$ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$l$i$c$k$=${$($)$ $=$>$ $o$n$E$d$i$t$($p$r$o$d$u$c$t$)$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$p$-$1$.$5$ $h$o$v$e$r$:$b$g$-$n$e$u$t$r$a$l$-$1$0$0$ $r$o$u$n$d$e$d$-$l$g$ $t$r$a$n$s$i$t$i$o$n$-$c$o$l$o$r$s$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $t$i$t$l$e$=$"$E$d$i$t$ $p$r$o$d$u$c$t$"$$
$ $ $ $ $ $ $ $ $ $ $>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$E$d$i$t$ $c$l$a$s$s$N$a$m$e$=$"$w$-$4$ $h$-$4$ $t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$b$u$t$t$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $<$b$u$t$t$o$n$ $$
$ $ $ $ $ $ $ $ $ $ $ $ $o$n$C$l$i$c$k$=${$($)$ $=$>$ $o$n$D$e$l$e$t$e$($p$r$o$d$u$c$t$.$i$d$)$}$$
$ $ $ $ $ $ $ $ $ $ $ $ $c$l$a$s$s$N$a$m$e$=$"$p$-$1$.$5$ $h$o$v$e$r$:$b$g$-$r$e$d$-$5$0$ $r$o$u$n$d$e$d$-$l$g$ $t$r$a$n$s$i$t$i$o$n$-$c$o$l$o$r$s$"$$
$ $ $ $ $ $ $ $ $ $ $ $ $t$i$t$l$e$=$"$D$e$l$e$t$e$ $p$r$o$d$u$c$t$"$$
$ $ $ $ $ $ $ $ $ $ $>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$T$r$a$s$h$2$ $c$l$a$s$s$N$a$m$e$=$"$w$-$4$ $h$-$4$ $t$e$x$t$-$r$e$d$-$6$0$0$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$b$u$t$t$o$n$>$$
$ $ $ $ $ $ $ $ $ $ $<$b$u$t$t$o$n$ $c$l$a$s$s$N$a$m$e$=$"$p$-$1$.$5$ $h$o$v$e$r$:$b$g$-$n$e$u$t$r$a$l$-$1$0$0$ $r$o$u$n$d$e$d$-$l$g$ $t$r$a$n$s$i$t$i$o$n$-$c$o$l$o$r$s$"$>$$
$ $ $ $ $ $ $ $ $ $ $ $ $<$M$o$r$e$V$e$r$t$i$c$a$l$ $c$l$a$s$s$N$a$m$e$=$"$w$-$4$ $h$-$4$ $t$e$x$t$-$n$e$u$t$r$a$l$-$6$0$0$"$ $/$>$$
$ $ $ $ $ $ $ $ $ $ $<$/$b$u$t$t$o$n$>$$
$ $ $ $ $ $ $ $ $<$/$d$i$v$>$$
$ $ $ $ $ $ $<$/$t$d$>$$
$ $ $ $ $<$/$t$r$>$$
$ $ $)$;$$
$}$)$;$$
$$
$/$/$ $D$i$s$p$l$a$y$ $n$a$m$e$ $f$o$r$ $R$e$a$c$t$ $D$e$v$T$o$o$l$s$$
$P$r$o$d$u$c$t$R$o$w$.$d$i$s$p$l$a$y$N$a$m$e$ $=$ $'$P$r$o$d$u$c$t$R$o$w$'$;$$
$$
$e$x$p$o$r$t$ $d$e$f$a$u$l$t$ $P$r$o$d$u$c$t$R$o$w$;$$
$
