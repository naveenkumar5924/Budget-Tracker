import React from 'react';
import {View,Text,TextInput,TouchableOpacity,ScrollView,StyleSheet} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {fmt} from './store';
export const C={p:'#6C5CE7',d:'#2D1B69',g:'#00B894',bg:'#F5F3FF',red:'#FF5C7A',txt:'#1E1B3A',mut:'#8A87A5'};
export const Grad=({children,style})=><LinearGradient colors={[C.d,C.p]} start={{x:0,y:0}} end={{x:1,y:1}} style={style}>{children}</LinearGradient>;
export const Screen=({children})=><ScrollView style={{flex:1,backgroundColor:C.bg}} contentContainerStyle={{padding:16}}>{children}</ScrollView>;
export const Card=({children,style})=><View style={[s.card,style]}>{children}</View>;
export const H=({children})=><Text style={s.h}>{children}</Text>;
export const Btn=({title,onPress,outline,color})=>outline
 ?<TouchableOpacity onPress={onPress} style={[s.btn,{backgroundColor:'#fff',borderWidth:1.5,borderColor:C.p}]}><Text style={{color:C.p,fontWeight:'700',fontSize:15}}>{title}</Text></TouchableOpacity>
 :<TouchableOpacity onPress={onPress} activeOpacity={.85} style={{marginVertical:5}}><LinearGradient colors={color?[color,color]:[C.p,'#8E7CFF']} start={{x:0,y:0}} end={{x:1,y:1}} style={[s.btn,{marginVertical:0}]}><Text style={{color:'#fff',fontWeight:'700',fontSize:15}}>{title}</Text></LinearGradient></TouchableOpacity>;
export const Input=({label,error,...p})=><View style={{marginBottom:10}}><Text style={s.lbl}>{label}</Text><TextInput {...p} placeholderTextColor="#aab" style={[s.in,error&&{borderColor:C.red}]}/>{!!error&&<Text style={{color:C.red,fontSize:12,marginTop:2}}>{error}</Text>}</View>;
export const Seg=({opts,val,set})=><View style={s.seg}>{opts.map(o=><TouchableOpacity key={o} onPress={()=>set(o)} style={[s.segI,val===o&&{backgroundColor:C.p}]}><Text style={{color:val===o?'#fff':C.txt,textTransform:'capitalize',fontWeight:'600'}}>{o}</Text></TouchableOpacity>)}</View>;
export const Bar=({label,value,max,color})=><View style={{marginBottom:12}}><View style={{flexDirection:'row',justifyContent:'space-between'}}><Text style={{color:C.txt,fontWeight:'600'}}>{label}</Text><Text style={{color:C.mut}}>{fmt(value)}</Text></View><View style={s.track}><View style={{height:10,borderRadius:5,backgroundColor:color||C.p,width:`${Math.min(100,max?value/max*100:0)}%`}}/></View></View>;
export const TxRow=({t,onLong})=><TouchableOpacity onLongPress={onLong} style={s.row}>
 <View style={[s.dot,{backgroundColor:t.type==='income'?'#DFF8F0':'#FFE8ED'}]}><Text style={{fontSize:16,fontWeight:'800',color:t.type==='income'?C.g:C.red}}>{t.type==='income'?'↓':'↑'}</Text></View>
 <View style={{flex:1}}><Text style={{fontWeight:'700',color:C.txt}}>{t.title}</Text><Text style={{color:C.mut,fontSize:12}}>{t.category} • {t.date}</Text></View>
 <Text style={{fontWeight:'800',color:t.type==='income'?C.g:C.red}}>{t.type==='income'?'+':'-'}{fmt(t.amount)}</Text></TouchableOpacity>;
const s=StyleSheet.create({card:{backgroundColor:'#fff',borderRadius:20,padding:16,marginBottom:14,elevation:3,shadowColor:C.p,shadowOpacity:.12,shadowRadius:10,shadowOffset:{width:0,height:4}},
h:{fontSize:19,fontWeight:'800',color:C.txt,marginBottom:10},btn:{padding:15,borderRadius:14,alignItems:'center',marginVertical:5},
lbl:{color:C.mut,marginBottom:4,fontSize:13,fontWeight:'600'},in:{backgroundColor:'#fff',borderWidth:1.5,borderColor:'#E4E0F7',borderRadius:12,padding:13,color:C.txt},
seg:{flexDirection:'row',backgroundColor:'#E9E5FF',borderRadius:14,padding:4,marginBottom:12},segI:{flex:1,alignItems:'center',padding:10,borderRadius:11},
track:{height:10,borderRadius:5,backgroundColor:'#E9E5FF',marginTop:5},row:{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',padding:12,borderRadius:16,marginBottom:8,elevation:1},
dot:{width:40,height:40,borderRadius:20,alignItems:'center',justifyContent:'center',marginRight:12}});