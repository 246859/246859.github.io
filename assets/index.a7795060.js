import{_ as I,G as v,p as b,a as x,f as $,o as w,b as S}from"./index.ab59efba.js";import{A,aA as U,az as y,j as N,a0 as n,B as a,D as O,w as t,a5 as f,a1 as k,ac as g,H as r,K as i,J as B,aa as V}from"./vendor.fc320178.js";import{D as E}from"./siteSetting.c485f07c.js";import{c as j,u as P}from"./index.54ff3b02.js";import{a as R}from"./index.6f9943d0.js";import{h as z}from"./header.d801b988.js";import"./index.0ae744a4.js";import"./useWindowSizeFn.84f7533e.js";import"./useContentViewHeight.48a3d406.js";/* empty css               *//* empty css               */import"./useSortable.ed662068.js";import"./lock.d9508f76.js";const F=A({name:"UserDropdown",components:{Dropdown:U,Menu:y,MenuItem:j(()=>v(()=>import("./DropMenuItem.d3b5a8af.js"),["assets/DropMenuItem.d3b5a8af.js","assets/vendor.fc320178.js","assets/vendor.98da702d.css","assets/index.ab59efba.js","assets/index.865259a4.css"])),MenuDivider:y.Divider,LockAction:j(()=>v(()=>import("./LockModal.1badc4e1.js"),["assets/LockModal.1badc4e1.js","assets/LockModal.0068f88c.css","assets/index.33f55d6d.css","assets/index.ccc15a38.css","assets/index.35b5cf30.css","assets/index.9af86382.css","assets/index.75235a75.css","assets/index.c4896195.css","assets/index.c6079871.css","assets/index.da2da8e5.css","assets/index.ab59efba.js","assets/index.865259a4.css","assets/vendor.fc320178.js","assets/vendor.98da702d.css","assets/index.6f9943d0.js","assets/index.2439e102.css","assets/useWindowSizeFn.84f7533e.js","assets/useForm.4c365324.js","assets/useForm.e40a8bc7.css","assets/index.d392ece0.js","assets/index.7b8b5e30.css","assets/download.bcd9d414.js","assets/index.173d9303.js","assets/index.88b1d373.css","assets/lock.d9508f76.js","assets/header.d801b988.js"]))},props:{theme:b.oneOf(["dark","light"])},setup(){const{prefixCls:e}=x("header-user-dropdown"),{t:s}=S(),{getShowDoc:_,getUseLockPage:h}=P(),d=$(),C=N(()=>{const{realName:m="",avatar:L,desc:M}=d.getUserInfo||{};return{realName:m,avatar:L||z,desc:M}}),[o,{openModal:l}]=R();function c(){l(!0)}function u(){d.confirmLoginOut()}function p(){w(E)}function D(m){switch(m.key){case"logout":u();break;case"doc":p();break;case"lock":c();break}}return{prefixCls:e,t:s,openWindow:w,getUserInfo:C,handleMenuClick:D,getShowDoc:_,register:o,getUseLockPage:h}}}),H=["src"];function T(e,s,_,h,d,C){const o=n("MenuItem"),l=n("MenuDivider"),c=n("Menu"),u=n("Dropdown"),p=n("LockAction");return a(),O(V,null,[t(u,{placement:"bottomLeft",overlayClassName:`${e.prefixCls}-dropdown-overlay`},{overlay:f(()=>[t(c,{onClick:e.handleMenuClick},{default:f(()=>[t(o,{text:"\u8D22\u52A1\u5B98\u7F51",icon:"ion:document-text-outline",onClick:s[0]||(s[0]=D=>e.openWindow("https://cloud.candycake.cloud/index.html"))}),e.getShowDoc?(a(),k(o,{key:"doc",text:e.t("layout.header.dropdownItemDoc"),icon:"ion:document-text-outline"},null,8,["text"])):g("",!0),e.getShowDoc?(a(),k(l,{key:1})):g("",!0),e.getUseLockPage?(a(),k(o,{key:"lock",text:e.t("layout.header.tooltipLock"),icon:"ion:lock-closed-outline"},null,8,["text"])):g("",!0),t(o,{key:"logout",text:e.t("layout.header.dropdownItemLoginOut"),icon:"ion:power-outline"},null,8,["text"])]),_:1},8,["onClick"])]),default:f(()=>[r("span",{class:i([[e.prefixCls,`${e.prefixCls}--${e.theme}`],"flex"])},[r("img",{class:i(`${e.prefixCls}__header`),src:e.getUserInfo.avatar},null,10,H),r("span",{class:i(`${e.prefixCls}__info hidden md:block`)},[r("span",{class:i([`${e.prefixCls}__name  `,"truncate"])},B(e.getUserInfo.realName),3)],2)],2)]),_:1},8,["overlayClassName"]),t(p,{onRegister:e.register},null,8,["onRegister"])],64)}var se=I(F,[["render",T]]);export{se as default};
