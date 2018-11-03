﻿/*
 Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.

 For licensing, see LICENSE.md or http://ckeditor.com/license

*/
(function(){CKEDITOR.plugins.add("chart",{requires:"widget,dialog",icons:"chart",lang:"en",afterInit:function(){var a=this;"undefined"===typeof Chart&&CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(a.path+"lib/chart.min.js"),function(){a.drawCharts()})},init:function(a){var n=this,q=a.config.chart_height||300,g=a.config.chart_colors||{fillColor:"rgba(151,187,205,0.5)",strokeColor:"rgba(151,187,205,0.8)",highlightFill:"rgba(151,187,205,0.75)",highlightStroke:"rgba(151,187,205,1)",data:"#B33131 #B66F2D #B6B330 #71B232 #33B22D #31B272 #2DB5B5 #3172B6 #3232B6 #6E31B2 #B434AF #B53071".split(" ")},
k={Bar:a.config.chart_configBar||{animation:!1},Doughnut:a.config.chart_configDoughnut||{animateRotate:!1},Line:a.config.chart_configLine||{animation:!1},Pie:a.config.chart_configPie||{animateRotate:!1},PolarArea:a.config.chart_configPolarArea||{animateRotate:!1}},p=a.config.chart_maxItems||8;a.addContentsCss(CKEDITOR.getUrl(n.path+"chart.css"));a.on("contentPreview",function(b){b.data.dataValue=b.data.dataValue.replace(/<\/head>/,'\x3cscript\x3evar chartjs_colors_json \x3d "'+JSON.stringify(g).replace(/\"/g,
'\\"')+'";\x3c/script\x3e\x3cscript\x3evar chartjs_config_json \x3d "'+JSON.stringify(k).replace(/\"/g,'\\"')+'";\x3c/script\x3e\x3cscript src\x3d"'+CKEDITOR.getUrl(n.path+"lib/chart.min.js")+'"\x3e\x3c/script\x3e\x3cscript src\x3d"'+CKEDITOR.getUrl(n.path+"widget2chart.js")+'"\x3e\x3c/script\x3e\x3c/head\x3e')});CKEDITOR.dialog.add("chart",function(b){for(var a={title:b.lang.chart.dialogTitle,minWidth:200,minHeight:100,onShow:function(){var m=b.widgets.focused;if(m)for(var a=0;a<p;a++)m.data.values[a]&&
(this.setValueOf("data","value"+a,m.data.values[a].value.toString()),this.setValueOf("data","label"+a,m.data.values[a].label))},onOk:function(){for(var b=this.widget,a=[],d,c=0;c<p;c++)(d=this.getValueOf("data","value"+c))&&a.push({value:parseFloat(this.getValueOf("data","value"+c)),label:this.getValueOf("data","label"+c)});b.setData("values",a);b.setData("chart",this.getValueOf("data","chart"));b.setData("height",this.getValueOf("data","height"))},contents:[{id:"data",elements:[{type:"hbox",children:[{id:"chart",
type:"select",label:b.lang.chart.chartType,labelLayout:"horizontal",labelStyle:"display:block;padding: 4px 6px;",items:[[b.lang.chart.bar,"bar"],[b.lang.chart.line,"line"],[b.lang.chart.pie,"pie"],[b.lang.chart.polar,"polar"],[b.lang.chart.doughnut,"doughnut"]],style:"margin-bottom:10px",setup:function(b){this.setValue(b.data.chart)}},{id:"height",type:"text",label:b.lang.chart.height,labelLayout:"horizontal",labelStyle:"display:block;padding: 4px 6px;",width:"50px",setup:function(b){this.setValue(b.data.height)},
validate:function(){var a=this.getValue(),a=!a||!!(CKEDITOR.dialog.validate.number(a)&&0<=a);a||(alert(b.lang.common.validateNumberFailed),this.select());return a}}]}]}]},d=0;d<p;d++)a.contents[0].elements.push({type:"hbox",children:[{id:"value"+d,type:"text",labelLayout:"horizontal",label:b.lang.chart.value,labelStyle:"display:block;padding: 4px 6px;",width:"50px",validate:function(){var a=this.getValue(),a=!a||!!(CKEDITOR.dialog.validate.number(a)&&0<=a);a||(alert(b.lang.common.validateNumberFailed),
this.select());return a}},{id:"label"+d,type:"text",label:b.lang.chart.label,labelLayout:"horizontal",labelStyle:"display:block;padding: 4px 6px;",width:"200px"}]});return a});this.drawCharts=function(){for(var b in a.widgets.instances)"chart"==a.widgets.instances[b].name&&a.widgets.instances[b].fire("data")};a.widgets.add("chart",{button:a.lang.chart.chart,dialog:"chart",template:'\x3cdiv class\x3d"chartjs" data-chart\x3d"bar" data-chart-height\x3d"'+q+'"\x3e\x3ccanvas height\x3d"'+q+'"\x3e\x3c/canvas\x3e\x3cdiv class\x3d"chartjs-legend"\x3e\x3c/div\x3e\x3c/div\x3e',
styleableElements:"div",pathName:"chart",init:function(){this.element.data("chart-value")&&this.setData("values",JSON.parse(this.element.data("chart-value")));this.setData("chart",this.element.data("chart"));this.setData("height",this.element.data("chart-height"));this.on("dialog",function(a){a.data.widget=this},this)},data:function(){if("undefined"!==typeof Chart&&this.data.values){var b=a.document.createElement("canvas",{attributes:{height:this.data.height}});b.replace(this.element.getChild(0));
var f=this.element.getChild(1).$,b=b.$;if(b.getContext){var d=this.data;setTimeout(function(){var a=d,e=a.values,h=a.chart,c;c=b.getContext("2d");var l=new Chart(c);if("bar"!=h)for(c=0;c<e.length;c++)e[c].color=g.data[c],e[c].highlight=g.data[c];if("bar"==h||"line"==h){a={datasets:[{label:"",fillColor:g.fillColor,strokeColor:g.strokeColor,highlightFill:g.highlightFill,highlightStroke:g.highlightStroke,data:[]}],labels:[]};for(c=0;c<e.length;c++)e[c].value&&(a.labels.push(e[c].label),a.datasets[0].data.push(e[c].value));
f.innerHTML=""}"bar"==h?l.Bar(a,k.Bar):"line"==h?l.Line(a,k.Line):f.innerHTML="polar"==h?l.PolarArea(e,k.PolarArea).generateLegend():"pie"==h?l.Pie(e,k.Pie).generateLegend():l.Doughnut(e,k.Doughnut).generateLegend()},0)}}},allowedContent:"div(!chartjs)[data-*];",requiredContent:"div(chartjs)[data-chart-value,data-chart,data-chart-height]",upcast:function(a){if("div"==a.name&&a.hasClass("chartjs")){a.setHtml("");var f=new CKEDITOR.htmlParser.element("canvas",{height:a.attributes["data-chart-height"]});
a.add(f);f=new CKEDITOR.htmlParser.element("div",{"class":"chartjs-legend"});a.add(f);return a}},downcast:function(b){var f=[];if(this.data.values){for(var d=0;d<this.data.values.length;d++)f.push({value:this.data.values[d].value,label:this.data.values[d].label});return new CKEDITOR.htmlParser.element("div",{"class":b.attributes["class"],"data-chart":this.data.chart,"data-chart-height":this.data.height,"data-chart-value":a.getSelectedHtml?JSON.stringify(f):CKEDITOR.tools.htmlEncodeAttr(JSON.stringify(f))})}}})}})})();