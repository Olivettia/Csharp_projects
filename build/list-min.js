(function(){var a=function(){};a.prototype.item=function(){throw"abstract enumerator should not be instantiated"},a.prototype.next=function(){throw"abstract enumerator should not be instantiated"},a.prototype.reset=function(){throw"abstract enumerator should not be instantiated"};var b=function(a){var b=0,c=1,d=2,e=b,f=0;this.item=function(){if(e==c)return a[f];if(e==b)throw"incorrect index";if(e==d)throw"incorrect index"},this.next=function(){switch(e){case b:a.length===0?e=d:e=c;break;case c:f++,f>=a.length&&(e=d);break;case d:}return e!=d},this.reset=function(){e=b,f=0}};b.prototype=new a;var c=function(a){var b=NaN,c=[];this.item=function(){if(b>=0){b in c||(c[b]=a.item());return c[b]}return a.item()},this.next=function(){b>=-1&&b++;return a.next()},this.reset=function(){b=-1;return a.reset()},this.cache=function(){return[].slice.call(c,0)}};c.prototype=new a;var d=function(a){this.item=a.item,this.next=a.next,this.reset=a.reset};d.prototype=new a;var e=function(a,b){this.item=a.item,this.next=a.next,this.reset=a.reset,b.item&&(this.item=function(){return b.item(a)}),b.next&&(this.next=function(){return b.next(a)}),b.reset&&(this.reset=function(){return b.reset(a)})};e.prototype=new a;var f=function(a){this.yield=function(b){a.yield&&a.yield(b)},this.end=function(){a.end&&a.end()}},g=function(c){var d,e=[],f=-1;if(!c)d=new b([]),e=[],f=0;else if(arguments.length>1)d=new b([].slice.call(arguments,0)),e=[].slice.call(arguments,0),f=e.length;else if(c instanceof Array)d=new b([].slice.call(c,0)),e=[].slice.call(c,0),f=e.length;else if(c instanceof a)d=c;else throw"source should be an array";this.at=function(a){var b=0;if(a<0)throw"incorrect index";if(e.length>a)return e[a];if(f>=0&&a>=f)throw"incorrect index";d.reset();while(d.next()){e[b]=d.item();if(a===0){var c=e[b];return c}a--,b++}f=b;throw"incorrect index"},this.length=function(){if(f<0){d.reset(),f=0;while(d.next())f++}return f},this.each=function(a){d.reset();for(var b=0;b<e.length;b++)d.next(),a.call(e[b],e[b]);var c=e.length;while(d.next())e[c]=d.item(),a.call(e[c],e[c]),c++;f=c;return this},this.toArray=function(){if(f<0||e.length<f){d.reset();for(var a=0;a<e.length;a++)d.next();var b=e.length;while(d.next())e[b]=d.item(),b++;f=b}return[].slice.call(e,0)},this.enumerator=function(){return d},this.cache=function(){return[].slice.call(e,0)}};g.prototype.reverse=function(){return new g(this.toArray().reverse())},g.prototype.map=function(a){var b=this,d=new e(b.enumerator(),{item:function(b){return a.call(b.item(),b.item())}});return new g(new c(d))},g.prototype.filter=function(a){var b=this,d=new e(b.enumerator(),{next:function(b){var c=!0;while((c=c&&b.next())&&!a.call(b.item(),b.item()));return c}});return new g(new c(d))},g.prototype.fold=function(a,b){var c=b;this.each(function(b){c=a.call(b,c,b)});return c},g.prototype.scan=function(a,b){var d=0,f=1,h=2,i=this,j=d,k,l=new e(i.enumerator(),{item:function(a){switch(j){case d:throw"incorrect index";case f:return k;case h:throw"incorrect index"}},next:function(c){var e,g;switch(j){case d:j=f,k=b;break;case f:g=c.next(),g?(e=c.item(),k=a.call(e,k,e)):j=h;break;case h:}return j!=h},reset:function(a){j=d,a.reset()}});return new g(new c(l))},g.prototype.takeWhile=function(a){var b=0,d=1,f=this,h=b,i=new e(f.enumerator(),{next:function(c){var e=!0;switch(h){case b:e=c.next()&&a.call(c.item(),c.item()),e||(h=d);break;case d:}return h!=d},reset:function(a){h=b,a.reset()}});return new g(new c(i))},g.prototype.take=function(a){var b=this,d=0,f=new e(b.enumerator(),{item:function(b){if(d<=a)return b.item();throw"incorrect index"},next:function(b){if(d<a){d++;return b.next()}return!1},reset:function(a){d=0,a.reset()}});return new g(new c(f))},g.prototype.dropWhile=function(a){var b=0,d=1,f=2,h=this,i=b,j=new e(h.enumerator(),{next:function(c){var e=!0;switch(i){case b:while((e=c.next())&&a.call(c.item(),c.item()));e?i=d:i=f;break;case d:e=c.next(),e||(i=f);break;case f:}return i!=f},reset:function(a){i=b,a.reset()}});return new g(new c(j))},g.prototype.drop=function(a){var b=0,d=1,f=2,h=this,i=b,j=new e(h.enumerator(),{next:function(c){var e=0,g=!0;switch(i){case b:while((g=c.next())&&e<a)e++;g?i=d:i=f;break;case d:g=c.next(),g||(i=f);break;case f:}return i!=f},reset:function(a){i=b,a.reset()}});return new g(new c(j))},g.prototype.cycle=function(){var a=this,b=new e(a.enumerator(),{next:function(a){if(a.next())return!0;a.reset();return a.next()?!0:!1}});return new g(new c(b))},g.generate=function(a){var b=0,e=1,h=2,i,j=b,k=e,l=[],m=NaN,n=new f({yield:function(a){k!=h&&(l[l.length]=a)},end:function(){k=h}}),o=new d({item:function(){switch(j){case b:throw"incorrect index";case e:return l[m];case h:throw"incorrect index"}},next:function(){switch(j){case b:case e:m++;if(k!=h)while(m>=l.length&&k!=h)a.call(n,n);j=k;break;case h:}return j!=h},reset:function(){m=-1,j=b}});return new g(new c(o))},g.iterate=function(a,b){var e=0,f=1,h,i=e,j=new d({item:function(){switch(i){case e:throw"incorrect index";case f:return h}},next:function(){switch(i){case e:h=b,i=f;break;case f:h=a.call(h,h)}return!0},reset:function(){i=e}});return new g(new c(j))},g.count=function(a,b){a=a||0,b=b||1;return g.iterate(function(a){return a+b},a)},g.repeat=function(a){return g.iterate(function(a){return a},a)},g.concatenate=function(){var a=0,b=1,e=2,f=[].slice.call(arguments,0),h=0,i=a,j=new d({item:function(){return f[h].enumerator().item()},next:function(){switch(i){case a:f[h].enumerator().reset(),i=b;return j.next();case b:if(!f[h].enumerator().next()){h++;if(h<f.length){i=a;return j.next()}i=e}break;case e:}return i!=e},reset:functi