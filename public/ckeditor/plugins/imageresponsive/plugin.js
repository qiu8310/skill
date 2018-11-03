/*
 Copyright (c) 2003-2014, Clemens Krack. All rights reserved.

 @author Clemens Krack <info@clemenskrack.com>

 For licensing, see LICENSE.md or http://ckeditor.com/license

*/
(function(){CKEDITOR.plugins.add("imageresponsive",{lang:"en",requires:"widget,dialog,image2",beforeInit:function(c){c.on("widgetDefinition",function(a){a=a.data;"image"==a.name&&a.allowedContent.img&&a.allowedContent.img.attributes&&(-1==a.allowedContent.img.attributes.indexOf("srcset")&&(a.allowedContent.img.attributes+=",srcset"),-1==a.allowedContent.img.attributes.indexOf("sizes")&&(a.allowedContent.img.attributes+=",sizes"))})},init:function(c){c.widgets.on("instanceCreated",function(a){var b=
a.data;"image"==b.name&&(b.on("data",function(a){b=a.data;b.srcset?a.sender.parts.image.setAttribute("srcset",b.srcset):a.sender.parts.image.removeAttribute("srcset");b.sizes?a.sender.parts.image.setAttribute("sizes",b.sizes):a.sender.parts.image.removeAttribute("sizes")}),a=b.element,"img"!=a.getName()&&(a=a.findOne("img")),a={srcset:a.getAttribute("srcset")||"",sizes:a.getAttribute("sizes")||""},b.setData(a))});CKEDITOR.on("dialogDefinition",function(a){if(a.editor==c&&"image2"==a.data.name){var b=
a.data.definition.getContents("info");b.add({id:"srcset",type:"text",requiredContent:"img[srcset]",label:a.editor.lang.imageresponsive.srcset,setup:function(a){this.setValue(a.data.srcset)},commit:function(a){a.setData("srcset",this.getValue())}},"alt");b.add({id:"sizes",type:"text",requiredContent:"img[sizes]",label:a.editor.lang.imageresponsive.sizes,setup:function(a){this.setValue(a.data.sizes)},commit:function(a){a.setData("sizes",this.getValue())}},"alignment")}})}})})();