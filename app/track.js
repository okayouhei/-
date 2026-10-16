// 来訪経路（?src=）をこの端末に記録。※集計は端末ごと。全体集計はLINE/Insta分析やスタッフ申告と併用してください。
(function(){
  const q=new URLSearchParams(location.search);
  const src=q.get("src")||"direct";
  const KEY="gb_events";
  function load(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){return[]}}
  window.GB={
    log(type,extra){try{const a=load();a.push({t:Date.now(),type,src,...extra});localStorage.setItem(KEY,JSON.stringify(a.slice(-500)))}catch(e){}},
    all:load, src
  };
  GB.log("visit");
})();
