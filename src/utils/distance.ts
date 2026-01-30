$/$/$ $D$i$s$t$a$n$c$e$ $C$a$l$c$u$l$a$t$o$r$ $U$t$i$l$i$t$y$$
$/$/$ $C$a$l$c$u$l$a$t$e$s$ $d$i$s$t$a$n$c$e$ $b$e$t$w$e$e$n$ $t$w$o$ $l$o$c$a$t$i$o$n$s$ $u$s$i$n$g$ $c$o$o$r$d$i$n$a$t$e$s$ $o$r$ $p$i$n$c$o$d$e$-$b$a$s$e$d$ $e$s$t$i$m$a$t$i$o$n$$
$$
$i$n$t$e$r$f$a$c$e$ $C$o$o$r$d$i$n$a$t$e$s$ ${$$
$ $ $l$a$t$:$ $n$u$m$b$e$r$;$$
$ $ $l$n$g$:$ $n$u$m$b$e$r$;$$
$}$$
$$
$/$*$*$$
$ $*$ $C$a$l$c$u$l$a$t$e$s$ $t$h$e$ $d$i$s$t$a$n$c$e$ $b$e$t$w$e$e$n$ $t$w$o$ $p$o$i$n$t$s$ $u$s$i$n$g$ $t$h$e$ $H$a$v$e$r$s$i$n$e$ $f$o$r$m$u$l$a$$
$ $*$ $@$p$a$r$a$m$ $c$o$o$r$d$1$ $-$ $F$i$r$s$t$ $c$o$o$r$d$i$n$a$t$e$ $p$o$i$n$t$ ${$l$a$t$,$ $l$n$g$}$$
$ $*$ $@$p$a$r$a$m$ $c$o$o$r$d$2$ $-$ $S$e$c$o$n$d$ $c$o$o$r$d$i$n$a$t$e$ $p$o$i$n$t$ ${$l$a$t$,$ $l$n$g$}$$
$ $*$ $@$r$e$t$u$r$n$s$ $D$i$s$t$a$n$c$e$ $i$n$ $k$i$l$o$m$e$t$e$r$s$$
$ $*$/$$
$e$x$p$o$r$t$ $f$u$n$c$t$i$o$n$ $c$a$l$c$u$l$a$t$e$D$i$s$t$a$n$c$e$($c$o$o$r$d$1$:$ $C$o$o$r$d$i$n$a$t$e$s$,$ $c$o$o$r$d$2$:$ $C$o$o$r$d$i$n$a$t$e$s$)$:$ $n$u$m$b$e$r$ ${$$
$ $ $c$o$n$s$t$ $R$ $=$ $6$3$7$1$;$ $/$/$ $E$a$r$t$h$'$s$ $r$a$d$i$u$s$ $i$n$ $k$i$l$o$m$e$t$e$r$s$$
$ $ $$
$ $ $c$o$n$s$t$ $l$a$t$1$ $=$ $t$o$R$a$d$i$a$n$s$($c$o$o$r$d$1$.$l$a$t$)$;$$
$ $ $c$o$n$s$t$ $l$a$t$2$ $=$ $t$o$R$a$d$i$a$n$s$($c$o$o$r$d$2$.$l$a$t$)$;$$
$ $ $c$o$n$s$t$ $d$e$l$t$a$L$a$t$ $=$ $t$o$R$a$d$i$a$n$s$($c$o$o$r$d$2$.$l$a$t$ $-$ $c$o$o$r$d$1$.$l$a$t$)$;$$
$ $ $c$o$n$s$t$ $d$e$l$t$a$L$n$g$ $=$ $t$o$R$a$d$i$a$n$s$($c$o$o$r$d$2$.$l$n$g$ $-$ $c$o$o$r$d$1$.$l$n$g$)$;$$
$ $ $$
$ $ $c$o$n$s$t$ $a$ $=$ $M$a$t$h$.$s$i$n$($d$e$l$t$a$L$a$t$ $/$ $2$)$ $*$ $M$a$t$h$.$s$i$n$($d$e$l$t$a$L$a$t$ $/$ $2$)$ $+$$
$ $ $ $ $ $ $ $ $ $ $ $ $M$a$t$h$.$c$o$s$($l$a$t$1$)$ $*$ $M$a$t$h$.$c$o$s$($l$a$t$2$)$ $*$$
$ $ $ $ $ $ $ $ $ $ $ $ $M$a$t$h$.$s$i$n$($d$e$l$t$a$L$n$g$ $/$ $2$)$ $*$ $M$a$t$h$.$s$i$n$($d$e$l$t$a$L$n$g$ $/$ $2$)$;$$
$ $ $$
$ $ $c$o$n$s$t$ $c$ $=$ $2$ $*$ $M$a$t$h$.$a$t$a$n$2$($M$a$t$h$.$s$q$r$t$($a$)$,$ $M$a$t$h$.$s$q$r$t$($1$ $-$ $a$)$)$;$$
$ $ $$
$ $ $c$o$n$s$t$ $d$i$s$t$a$n$c$e$ $=$ $R$ $*$ $c$;$ $/$/$ $D$i$s$t$a$n$c$e$ $i$n$ $k$i$l$o$m$e$t$e$r$s$$
$ $ $$
$ $ $r$e$t$u$r$n$ $M$a$t$h$.$r$o$u$n$d$($d$i$s$t$a$n$c$e$ $*$ $1$0$)$ $/$ $1$0$;$ $/$/$ $R$o$u$n$d$ $t$o$ $1$ $d$e$c$i$m$a$l$ $p$l$a$c$e$$
$}$$
$$
$/$*$*$$
$ $*$ $C$o$n$v$e$r$t$s$ $d$e$g$r$e$e$s$ $t$o$ $r$a$d$i$a$n$s$$
$ $*$/$$
$f$u$n$c$t$i$o$n$ $t$o$R$a$d$i$a$n$s$($d$e$g$r$e$e$s$:$ $n$u$m$b$e$r$)$:$ $n$u$m$b$e$r$ ${$$
$ $ $r$e$t$u$r$n$ $d$e$g$r$e$e$s$ $*$ $($M$a$t$h$.$P$I$ $/$ $1$8$0$)$;$$
$}$$
$$
$/$*$*$$
$ $*$ $E$s$t$i$m$a$t$e$s$ $c$o$o$r$d$i$n$a$t$e$s$ $b$a$s$e$d$ $o$n$ $p$i$n$c$o$d$e$ $($s$i$m$p$l$i$f$i$e$d$ $a$p$p$r$o$a$c$h$)$$
$ $*$ $I$n$ $p$r$o$d$u$c$t$i$o$n$,$ $t$h$i$s$ $s$h$o$u$l$d$ $u$s$e$ $a$ $p$i$n$c$o$d$e$-$t$o$-$c$o$o$r$d$i$n$a$t$e$s$ $A$P$I$$
$ $*$ $@$p$a$r$a$m$ $p$i$n$c$o$d$e$ $-$ $6$-$d$i$g$i$t$ $I$n$d$i$a$n$ $p$i$n$c$o$d$e$$
$ $*$ $@$r$e$t$u$r$n$s$ $E$s$t$i$m$a$t$e$d$ $c$o$o$r$d$i$n$a$t$e$s$$
$ $*$/$$
$e$x$p$o$r$t$ $f$u$n$c$t$i$o$n$ $p$i$n$c$o$d$e$T$o$C$o$o$r$d$i$n$a$t$e$s$($p$i$n$c$o$d$e$:$ $s$t$r$i$n$g$)$:$ $C$o$o$r$d$i$n$a$t$e$s$ $|$ $n$u$l$l$ ${$$
$ $ $/$/$ $P$i$n$c$o$d$e$ $f$o$r$m$a$t$ $v$a$l$i$d$a$t$i$o$n$$
$ $ $i$f$ $($!$/$^$\$d${$6$}$$$/$.$t$e$s$t$($p$i$n$c$o$d$e$)$)$ ${$$
$ $ $ $ $r$e$t$u$r$n$ $n$u$l$l$;$$
$ $ $}$$
$$
$ $ $/$/$ $E$x$t$r$a$c$t$ $r$e$g$i$o$n$ $f$r$o$m$ $f$i$r$s$t$ $d$i$g$i$t$ $o$f$ $p$i$n$c$o$d$e$$
$ $ $c$o$n$s$t$ $r$e$g$i$o$n$ $=$ $p$a$r$s$e$I$n$t$($p$i$n$c$o$d$e$.$c$h$a$r$A$t$($0$)$)$;$$
$ $ $$
$ $ $/$/$ $S$i$m$p$l$i$f$i$e$d$ $p$i$n$c$o$d$e$ $t$o$ $r$e$g$i$o$n$ $m$a$p$p$i$n$g$ $($a$p$p$r$o$x$i$m$a$t$e$ $c$e$n$t$e$r$ $c$o$o$r$d$i$n$a$t$e$s$)$$
$ $ $c$o$n$s$t$ $r$e$g$i$o$n$C$o$o$r$d$i$n$a$t$e$s$:$ $R$e$c$o$r$d$<$n$u$m$b$e$r$,$ $C$o$o$r$d$i$n$a$t$e$s$>$ $=$ ${$$
$ $ $ $ $1$:$ ${$ $l$a$t$:$ $2$8$.$7$0$4$1$,$ $l$n$g$:$ $7$7$.$1$0$2$5$ $}$,$ $/$/$ $D$e$l$h$i$ $($1$1$0$x$x$x$)$$
$ $ $ $ $2$:$ ${$ $l$a$t$:$ $1$9$.$0$7$6$0$,$ $l$n$g$:$ $7$2$.$8$7$7$7$ $}$,$ $/$/$ $M$u$m$b$a$i$ $($4$0$0$x$x$x$)$$
$ $ $ $ $3$:$ ${$ $l$a$t$:$ $2$3$.$0$2$2$5$,$ $l$n$g$:$ $7$2$.$5$7$1$4$ $}$,$ $/$/$ $G$u$j$a$r$a$t$/$R$a$j$a$s$t$h$a$n$$
$ $ $ $ $4$:$ ${$ $l$a$t$:$ $1$7$.$3$8$5$0$,$ $l$n$g$:$ $7$8$.$4$8$6$7$ $}$,$ $/$/$ $H$y$d$e$r$a$b$a$d$ $($5$0$0$x$x$x$)$$
$ $ $ $ $5$:$ ${$ $l$a$t$:$ $1$2$.$9$7$1$6$,$ $l$n$g$:$ $7$7$.$5$9$4$6$ $}$,$ $/$/$ $B$a$n$g$a$l$o$r$e$ $($5$6$0$x$x$x$)$$
$ $ $ $ $6$:$ ${$ $l$a$t$:$ $1$3$.$0$8$2$7$,$ $l$n$g$:$ $8$0$.$2$7$0$7$ $}$,$ $/$/$ $C$h$e$n$n$a$i$ $($6$0$0$x$x$x$)$$
$ $ $ $ $7$:$ ${$ $l$a$t$:$ $2$2$.$5$7$2$6$,$ $l$n$g$:$ $8$8$.$3$6$3$9$ $}$,$ $/$/$ $K$o$l$k$a$t$a$ $($7$0$0$x$x$x$)$$
$ $ $ $ $8$:$ ${$ $l$a$t$:$ $2$6$.$9$1$2$4$,$ $l$n$g$:$ $7$5$.$7$8$7$3$ $}$,$ $/$/$ $J$a$i$p$u$r$$
$ $ $ $ $9$:$ ${$ $l$a$t$:$ $2$1$.$1$4$5$8$,$ $l$n$g$:$ $7$9$.$0$8$8$2$ $}$,$ $/$/$ $N$a$g$p$u$r$$
$ $ $}$;$$
$ $ $$
$ $ $r$e$t$u$r$n$ $r$e$g$i$o$n$C$o$o$r$d$i$n$a$t$e$s$[$r$e$g$i$o$n$]$ $|$|$ $n$u$l$l$;$$
$}$$
$$
$/$*$*$$
$ $*$ $C$a$l$c$u$l$a$t$e$s$ $d$i$s$t$a$n$c$e$ $u$s$i$n$g$ $p$i$n$c$o$d$e$s$ $($c$o$n$v$e$r$t$s$ $t$o$ $c$o$o$r$d$i$n$a$t$e$s$ $f$i$r$s$t$)$$
$ $*$ $@$p$a$r$a$m$ $p$i$n$c$o$d$e$1$ $-$ $F$i$r$s$t$ $l$o$c$a$t$i$o$n$ $p$i$n$c$o$d$e$$
$ $*$ $@$p$a$r$a$m$ $p$i$n$c$o$d$e$2$ $-$ $S$e$c$o$n$d$ $l$o$c$a$t$i$o$n$ $p$i$n$c$o$d$e$$
$ $*$ $@$r$e$t$u$r$n$s$ $D$i$s$t$a$n$c$e$ $i$n$ $k$i$l$o$m$e$t$e$r$s$ $o$r$ $n$u$l$l$ $i$f$ $p$i$n$c$o$d$e$s$ $a$r$e$ $i$n$v$a$l$i$d$$
$ $*$/$$
$e$x$p$o$r$t$ $f$u$n$c$t$i$o$n$ $c$a$l$c$u$l$a$t$e$D$i$s$t$a$n$c$e$B$y$P$i$n$c$o$d$e$($p$i$n$c$o$d$e$1$:$ $s$t$r$i$n$g$,$ $p$i$n$c$o$d$e$2$:$ $s$t$r$i$n$g$)$:$ $n$u$m$b$e$r$ $|$ $n$u$l$l$ ${$$
$ $ $c$o$n$s$t$ $c$o$o$r$d$1$ $=$ $p$i$n$c$o$d$e$T$o$C$o$o$r$d$i$n$a$t$e$s$($p$i$n$c$o$d$e$1$)$;$$
$ $ $c$o$n$s$t$ $c$o$o$r$d$2$ $=$ $p$i$n$c$o$d$e$T$o$C$o$o$r$d$i$n$a$t$e$s$($p$i$n$c$o$d$e$2$)$;$$
$ $ $$
$ $ $i$f$ $($!$c$o$o$r$d$1$ $|$|$ $!$c$o$o$r$d$2$)$ ${$$
$ $ $ $ $r$e$t$u$r$n$ $n$u$l$l$;$$
$ $ $}$$
$ $ $$
$ $ $r$e$t$u$r$n$ $c$a$l$c$u$l$a$t$e$D$i$s$t$a$n$c$e$($c$o$o$r$d$1$,$ $c$o$o$r$d$2$)$;$$
$}$$
$$
$/$*$*$$
$ $*$ $F$o$r$m$a$t$s$ $d$i$s$t$a$n$c$e$ $f$o$r$ $d$i$s$p$l$a$y$$
$ $*$ $@$p$a$r$a$m$ $d$i$s$t$a$n$c$e$ $-$ $D$i$s$t$a$n$c$e$ $i$n$ $k$i$l$o$m$e$t$e$r$s$$
$ $*$ $@$r$e$t$u$r$n$s$ $F$o$r$m$a$t$t$e$d$ $s$t$r$i$n$g$$
$ $*$/$$
$e$x$p$o$r$t$ $f$u$n$c$t$i$o$n$ $f$o$r$m$a$t$D$i$s$t$a$n$c$e$($d$i$s$t$a$n$c$e$:$ $n$u$m$b$e$r$)$:$ $s$t$r$i$n$g$ ${$$
$ $ $i$f$ $($d$i$s$t$a$n$c$e$ $<$ $1$)$ ${$$
$ $ $ $ $r$e$t$u$r$n$ $`$$${$M$a$t$h$.$r$o$u$n$d$($d$i$s$t$a$n$c$e$ $*$ $1$0$0$0$)$}$ $m$`$;$$
$ $ $}$ $e$l$s$e$ $i$f$ $($d$i$s$t$a$n$c$e$ $<$ $1$0$)$ ${$$
$ $ $ $ $r$e$t$u$r$n$ $`$$${$d$i$s$t$a$n$c$e$.$t$o$F$i$x$e$d$($1$)$}$ $k$m$`$;$$
$ $ $}$ $e$l$s$e$ ${$$
$ $ $ $ $r$e$t$u$r$n$ $`$$${$M$a$t$h$.$r$o$u$n$d$($d$i$s$t$a$n$c$e$)$}$ $k$m$`$;$$
$ $ $}$$
$}$$
$$
$/$*$*$$
$ $*$ $F$i$n$d$s$ $t$h$e$ $n$e$a$r$e$s$t$ $w$a$r$e$h$o$u$s$e$ $t$o$ $a$ $g$i$v$e$n$ $l$o$c$a$t$i$o$n$$
$ $*$ $@$p$a$r$a$m$ $t$a$r$g$e$t$C$o$o$r$d$ $-$ $T$a$r$g$e$t$ $l$o$c$a$t$i$o$n$ $c$o$o$r$d$i$n$a$t$e$s$$
$ $*$ $@$p$a$r$a$m$ $w$a$r$e$h$o$u$s$e$s$ $-$ $A$r$r$a$y$ $o$f$ $w$a$r$e$h$o$u$s$e$s$ $w$i$t$h$ $l$o$c$a$t$i$o$n$.$c$o$o$r$d$i$n$a$t$e$s$$
$ $*$ $@$r$e$t$u$r$n$s$ $N$e$a$r$e$s$t$ $w$a$r$e$h$o$u$s$e$ $w$i$t$h$ $d$i$s$t$a$n$c$e$$
$ $*$/$$
$e$x$p$o$r$t$ $f$u$n$c$t$i$o$n$ $f$i$n$d$N$e$a$r$e$s$t$W$a$r$e$h$o$u$s$e$<$T$ $e$x$t$e$n$d$s$ ${$ $l$o$c$a$t$i$o$n$:$ ${$ $c$o$o$r$d$i$n$a$t$e$s$?$:$ $C$o$o$r$d$i$n$a$t$e$s$ $}$ $}$>$($$
$ $ $t$a$r$g$e$t$C$o$o$r$d$:$ $C$o$o$r$d$i$n$a$t$e$s$,$$
$ $ $w$a$r$e$h$o$u$s$e$s$:$ $T$[$]$$
$)$:$ ${$ $w$a$r$e$h$o$u$s$e$:$ $T$;$ $d$i$s$t$a$n$c$e$:$ $n$u$m$b$e$r$ $}$ $|$ $n$u$l$l$ ${$$
$ $ $l$e$t$ $n$e$a$r$e$s$t$:$ ${$ $w$a$r$e$h$o$u$s$e$:$ $T$;$ $d$i$s$t$a$n$c$e$:$ $n$u$m$b$e$r$ $}$ $|$ $n$u$l$l$ $=$ $n$u$l$l$;$$
$ $ $$
$ $ $f$o$r$ $($c$o$n$s$t$ $w$a$r$e$h$o$u$s$e$ $o$f$ $w$a$r$e$h$o$u$s$e$s$)$ ${$$
$ $ $ $ $i$f$ $($w$a$r$e$h$o$u$s$e$.$l$o$c$a$t$i$o$n$.$c$o$o$r$d$i$n$a$t$e$s$)$ ${$$
$ $ $ $ $ $ $c$o$n$s$t$ $d$i$s$t$a$n$c$e$ $=$ $c$a$l$c$u$l$a$t$e$D$i$s$t$a$n$c$e$($t$a$r$g$e$t$C$o$o$r$d$,$ $w$a$r$e$h$o$u$s$e$.$l$o$c$a$t$i$o$n$.$c$o$o$r$d$i$n$a$t$e$s$)$;$$
$ $ $ $ $ $ $$
$ $ $ $ $ $ $i$f$ $($!$n$e$a$r$e$s$t$ $|$|$ $d$i$s$t$a$n$c$e$ $<$ $n$e$a$r$e$s$t$.$d$i$s$t$a$n$c$e$)$ ${$$
$ $ $ $ $ $ $ $ $n$e$a$r$e$s$t$ $=$ ${$ $w$a$r$e$h$o$u$s$e$,$ $d$i$s$t$a$n$c$e$ $}$;$$
$ $ $ $ $ $ $}$$
$ $ $ $ $}$$
$ $ $}$$
$ $ $$
$ $ $r$e$t$u$r$n$ $n$e$a$r$e$s$t$;$$
$}$$
$$
$/$*$*$$
$ $*$ $C$a$l$c$u$l$a$t$e$s$ $e$s$t$i$m$a$t$e$d$ $d$e$l$i$v$e$r$y$ $t$i$m$e$ $b$a$s$e$d$ $o$n$ $d$i$s$t$a$n$c$e$$
$ $*$ $@$p$a$r$a$m$ $d$i$s$t$a$n$c$e$ $-$ $D$i$s$t$a$n$c$e$ $i$n$ $k$i$l$o$m$e$t$e$r$s$$
$ $*$ $@$r$e$t$u$r$n$s$ $E$s$t$i$m$a$t$e$d$ $d$e$l$i$v$e$r$y$ $t$i$m$e$ $i$n$ $h$o$u$r$s$$
$ $*$/$$
$e$x$p$o$r$t$ $f$u$n$c$t$i$o$n$ $e$s$t$i$m$a$t$e$D$e$l$i$v$e$r$y$T$i$m$e$($d$i$s$t$a$n$c$e$:$ $n$u$m$b$e$r$)$:$ $n$u$m$b$e$r$ ${$$
$ $ $/$/$ $A$s$s$u$m$p$t$i$o$n$s$:$$
$ $ $/$/$ $-$ $L$o$c$a$l$ $d$e$l$i$v$e$r$y$ $($<$ $5$0$k$m$)$:$ $4$-$6$ $h$o$u$r$s$$
$ $ $/$/$ $-$ $R$e$g$i$o$n$a$l$ $d$e$l$i$v$e$r$y$ $($5$0$-$3$0$0$k$m$)$:$ $1$-$2$ $d$a$y$s$$
$ $ $/$/$ $-$ $L$o$n$g$ $d$i$s$t$a$n$c$e$ $($>$ $3$0$0$k$m$)$:$ $2$-$5$ $d$a$y$s$$
$ $ $$
$ $ $i$f$ $($d$i$s$t$a$n$c$e$ $<$ $5$0$)$ ${$$
$ $ $ $ $r$e$t$u$r$n$ $6$;$ $/$/$ $6$ $h$o$u$r$s$$
$ $ $}$ $e$l$s$e$ $i$f$ $($d$i$s$t$a$n$c$e$ $<$ $3$0$0$)$ ${$$
$ $ $ $ $r$e$t$u$r$n$ $3$6$;$ $/$/$ $1$.$5$ $d$a$y$s$$
$ $ $}$ $e$l$s$e$ ${$$
$ $ $ $ $r$e$t$u$r$n$ $7$2$;$ $/$/$ $3$ $d$a$y$s$$
$ $ $}$$
$}$$
$$
$/$*$*$$
$ $*$ $F$o$r$m$a$t$s$ $d$e$l$i$v$e$r$y$ $t$i$m$e$ $f$o$r$ $d$i$s$p$l$a$y$$
$ $*$ $@$p$a$r$a$m$ $h$o$u$r$s$ $-$ $D$e$l$i$v$e$r$y$ $t$i$m$e$ $i$n$ $h$o$u$r$s$$
$ $*$ $@$r$e$t$u$r$n$s$ $F$o$r$m$a$t$t$e$d$ $s$t$r$i$n$g$$
$ $*$/$$
$e$x$p$o$r$t$ $f$u$n$c$t$i$o$n$ $f$o$r$m$a$t$D$e$l$i$v$e$r$y$T$i$m$e$($h$o$u$r$s$:$ $n$u$m$b$e$r$)$:$ $s$t$r$i$n$g$ ${$$
$ $ $i$f$ $($h$o$u$r$s$ $<$ $2$4$)$ ${$$
$ $ $ $ $r$e$t$u$r$n$ $`$$${$h$o$u$r$s$}$ $h$o$u$r$s$`$;$$
$ $ $}$ $e$l$s$e$ ${$$
$ $ $ $ $c$o$n$s$t$ $d$a$y$s$ $=$ $M$a$t$h$.$c$e$i$l$($h$o$u$r$s$ $/$ $2$4$)$;$$
$ $ $ $ $r$e$t$u$r$n$ $`$$${$d$a$y$s$}$ $$${$d$a$y$s$ $=$=$=$ $1$ $?$ $'$d$a$y$'$ $:$ $'$d$a$y$s$'$}$`$;$$
$ $ $}$$
$}$$
$
