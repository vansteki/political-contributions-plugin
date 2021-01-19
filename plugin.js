//licence: MIT
(function() {
//fuse.js
!function(t){function e(t,n){this.list=t,this.options=n=n||{},this.options.sort="sort"in n?n.sort:e.defaultOptions.sort,this.options.includeScore="includeScore"in n?n.includeScore:e.defaultOptions.includeScore,this.options.searchFn=n.searchFn||e.defaultOptions.searchFn,this.options.sortFn=n.sortFn||e.defaultOptions.sortFn,this.options.keys=n.keys||e.defaultOptions.keys}var n=function(t,e){if(e=e||{},this.options=e,this.options.location=e.location||n.defaultOptions.location,this.options.distance="distance"in e?e.distance:n.defaultOptions.distance,this.options.threshold="threshold"in e?e.threshold:n.defaultOptions.threshold,this.options.maxPatternLength=e.maxPatternLength||n.defaultOptions.maxPatternLength,this.pattern=e.caseSensitive?t:t.toLowerCase(),this.patternLen=t.length,this.patternLen>this.options.maxPatternLength)throw new Error("Pattern length is too long");this.matchmask=1<<this.patternLen-1,this.patternAlphabet=this._calculatePatternAlphabet()};n.defaultOptions={location:0,distance:100,threshold:.6,maxPatternLength:32},n.prototype._calculatePatternAlphabet=function(){var t={},e=0;for(e=0;e<this.patternLen;e++)t[this.pattern.charAt(e)]=0;for(e=0;e<this.patternLen;e++)t[this.pattern.charAt(e)]|=1<<this.pattern.length-e-1;return t},n.prototype._bitapScore=function(t,e){var n=t/this.patternLen,i=Math.abs(this.options.location-e);return this.options.distance?n+i/this.options.distance:i?1:n},n.prototype.search=function(t){if(t=this.options.caseSensitive?t:t.toLowerCase(),this.pattern===t)return{isMatch:!0,score:0};var e,n,i,o,s,r,a,h,p,c=t.length,l=this.options.location,u=this.options.threshold,f=t.indexOf(this.pattern,l),d=this.patternLen+c,m=1,L=[];for(-1!=f&&(u=Math.min(this._bitapScore(0,f),u),f=t.lastIndexOf(this.pattern,l+this.patternLen),-1!=f&&(u=Math.min(this._bitapScore(0,f),u))),f=-1,e=0;e<this.patternLen;e++){for(i=0,o=d;o>i;)this._bitapScore(e,l+o)<=u?i=o:d=o,o=Math.floor((d-i)/2+i);for(d=o,s=Math.max(1,l-o+1),r=Math.min(l+o,c)+this.patternLen,a=Array(r+2),a[r+1]=(1<<e)-1,n=r;n>=s;n--)if(p=this.patternAlphabet[t.charAt(n-1)],a[n]=0===e?(a[n+1]<<1|1)&p:(a[n+1]<<1|1)&p|((h[n+1]|h[n])<<1|1)|h[n+1],a[n]&this.matchmask&&(m=this._bitapScore(e,n-1),u>=m)){if(u=m,f=n-1,L.push(f),!(f>l))break;s=Math.max(1,2*l-f)}if(this._bitapScore(e+1,l)>u)break;h=a}return{isMatch:f>=0,score:m}};var i={deepValue:function(t,e){for(var n=0,e=e.split("."),i=e.length;i>n;n++){if(!t)return null;t=t[e[n]]}return t}};e.defaultOptions={id:null,caseSensitive:!1,includeScore:!1,shouldSort:!0,searchFn:n,sortFn:function(t,e){return t.score-e.score},keys:[]},e.prototype.search=function(t){var e,n,o,s,r,a=new this.options.searchFn(t,this.options),h=this.list,p=h.length,c=this.options,l=this.options.keys,u=l.length,f=[],d={},m=[],L=function(t,e,n){void 0!==t&&null!==t&&"string"==typeof t&&(s=a.search(t),s.isMatch&&(r=d[n],r?r.score=Math.min(r.score,s.score):(d[n]={item:e,score:s.score},f.push(d[n]))))};if("string"==typeof h[0])for(var e=0;p>e;e++)L(h[e],e,e);else for(var e=0;p>e;e++)for(o=h[e],n=0;u>n;n++)L(i.deepValue(o,l[n]),o,e);c.shouldSort&&f.sort(c.sortFn);for(var S=c.includeScore?function(t){return f[t]}:function(t){return f[t].item},g=c.id?function(t){return i.deepValue(S(t),c.id)}:function(t){return S(t)},e=0,b=f.length;b>e;e++)m.push(g(e));return m},"object"==typeof exports?module.exports=e:"function"==typeof define&&define.amd?define(function(){return e}):t.Fuse=e}(this);
var getUnique = function(arr) {
    var que = [];
    for(var i = 0; i < arr.length; i++) {
        for(var j = i + 1; j < arr.length; j++) {
          if(arr[i] === arr[j]) j = ++i;
        }
        que.push(arr[i]);
    }
    return que;
};
 
var cellInfoReg = /第\s*(\d*)\s*頁\s*\((\d*),\s*(\d*)\s*\)/;
var $cell = $('.cell-info');
var cellSt = $cell.text();
var regRes = cellSt.match(cellInfoReg);
var cellPage = regRes[1];
var cellRow = regRes[2];
var cellCol = regRes[3];
var api = "http://campaign-finance.g0v.ctiml.tw/api/getcells/";
var ansArr = [];
 
var syncApi = function(page) {
    cellPage = (page === undefined ? cellPage : page);
    $.getJSON(api+cellPage, function(data) {
      data.forEach(function(v,k) {
        if(v.ans !== null && v.ans !=="" && v.ans !=='是') ansArr.push(v.ans);
      });
      ansArr = getUnique(ansArr);
    });
};
syncApi();
 
var pt = -1;
var currentVal = function() { $('#ans').val($($('.fu-item')[pt]).text()); };
 
$('#ans')
.keyup(function(e) {
    if (e.keyCode !== 38 && e.keyCode !== 40 ){
      var f = new Fuse(ansArr, {threshold:0.2});
      var result = f.search($(this).val());
      var filtRes = []; 
      result.forEach(function(v,k) { filtRes.push('<tr class=fu-item><th>' + ansArr[v] + '</th></tr>'); });
      $('.XD').html(filtRes);
      $('.fu-item').on('click',function() { $('#ans').val($(this).text()).focus(); });
    }
    //move up down
    var arrSize = $('.fu-item').length;
    $($('.XD tr')).css('background-color','#ffffff');
    if (e.which === 40 && pt <= arrSize) {
        pt++;
        if (pt <= arrSize) { 
            $($('.XD tr')[pt]).css('background-color','#dddddd');
            currentVal();
        }
        if (pt >= arrSize) {
            pt--;
            $($('.XD tr')[pt]).css('background-color','#dddddd');
            currentVal();
        }
     }
     if (e.which === 38 && pt <= arrSize) {
         pt--;
         if (pt >= 0) {
             $($('.XD tr')[pt]).css('background-color','#dddddd');
             currentVal();
         }
         if (pt <= -1) {
             pt++;
             $($('.XD tr')[pt]).css('background-color','#dddddd');
             currentVal();
         }
     }    
})
.keydown(function (e) {
    if (e.ctrlKey && e.keyCode == 13) {
        $(this).val( $('.XD').find('tr').first().text() );
        pt = -1;   
    }
    if (e.keyCode == 8 || e.keyCode == 13 || e.keyCode == 37 || e.keyCode == 39) pt = -1;
});
 
$('.container').append($("<table>", {
    style:['width:200px; top:90; position:absolute; font-family:monospace;'] , 
    'class':'XD table table-hover'}
));
 
//monit DOM change then syncApi
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    //console.log(mutation.type);
  });
  syncApi($('.cell-info').text().match(cellInfoReg)[1]);
});
observer.observe($cell[0], {childList: true, characterData: true });
console.log('try it!');
})();