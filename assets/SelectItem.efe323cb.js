import{A as o,bA as l,j as r,a0 as d,B as p,D as m,H as u,J as c,w as f,a4 as b,K as g}from"./vendor.fc320178.js";import{_,a as j}from"./index.ab59efba.js";import{b as v}from"./index.ff853832.js";/* empty css               *//* empty css               */import"./index.54ff3b02.js";import"./index.0ae744a4.js";import"./useWindowSizeFn.84f7533e.js";import"./useContentViewHeight.48a3d406.js";/* empty css               */import"./useSortable.ed662068.js";import"./lock.d9508f76.js";const S=o({name:"SelectItem",components:{Select:l},props:{event:{type:Number},disabled:{type:Boolean},title:{type:String},def:{type:[String,Number]},initValue:{type:[String,Number]},options:{type:Array,default:()=>[]}},setup(e){const{prefixCls:t}=j("setting-select-item"),s=r(()=>e.def?{value:e.def,defaultValue:e.initValue||e.def}:{});function n(a){e.event&&v(e.event,a)}return{prefixCls:t,handleChange:n,getBindValue:s}}});function C(e,t,s,n,a,y){const i=d("Select");return p(),m("div",{class:g(e.prefixCls)},[u("span",null,c(e.title),1),f(i,b(e.getBindValue,{class:`${e.prefixCls}-select`,onChange:e.handleChange,disabled:e.disabled,size:"small",options:e.options}),null,16,["class","onChange","disabled","options"])],2)}var H=_(S,[["render",C],["__scopeId","data-v-2dba4940"]]);export{H as default};
