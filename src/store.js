import React,{createContext,useContext,useState} from 'react';
import {Alert} from 'react-native';
const Ctx=createContext();
export const useApp=()=>useContext(Ctx);
export const iso=(x=new Date())=>x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');
const ago=n=>{const x=new Date();x.setDate(x.getDate()-n);return iso(x)};
export const CATS=[{name:'Food',icon:'fast-food',budget:5000},{name:'Travel',icon:'car',budget:3000},{name:'Shopping',icon:'cart',budget:4000},{name:'Bills',icon:'receipt',budget:6000},{name:'Salary',icon:'cash',budget:0}];
export const fmt=n=>'₹'+Number(n).toLocaleString('en-IN');
export const sum=(l,t)=>l.filter(x=>x.type===t).reduce((a,x)=>a+x.amount,0);
export const inPeriod=(d,p)=>p==='daily'?d===iso():p==='weekly'?d>=ago(6):d.slice(0,7)===iso().slice(0,7);
const U='user@app.com';
const seed=[
{id:'1',email:U,title:'Salary',amount:45000,type:'income',category:'Salary',date:ago(0)},
{id:'2',email:U,title:'Lunch',amount:180,type:'expense',category:'Food',date:ago(0)},
{id:'3',email:U,title:'Bus pass',amount:600,type:'expense',category:'Travel',date:ago(2)},
{id:'4',email:U,title:'Shoes',amount:2200,type:'expense',category:'Shopping',date:ago(5)},
{id:'5',email:U,title:'EB bill',amount:1400,type:'expense',category:'Bills',date:ago(12)},
{id:'6',email:U,title:'Groceries',amount:1500,type:'expense',category:'Food',date:ago(35)}];
export function AppProvider({children}){
 const [users,setUsers]=useState([
  {name:'Admin',email:'admin@app.com',password:'admin123',phone:'9000000000',role:'admin'},
  {name:'Arun',email:U,password:'user123',phone:'9111111111',role:'customer'}]);
 const [user,setUser]=useState(null);
 const [tx,setTx]=useState(seed);
 const mine=tx.filter(t=>t.email===user?.email);
 const signUp=u=>{if(users.some(x=>x.email===u.email))return 'Email already registered';setUsers([...users,u]);return null};
 const signIn=(email,password,role)=>{const f=users.find(x=>x.email===email&&x.password===password);
  if(!f)return 'Invalid email or password';if(f.role!==role)return `This account is not a ${role}`;setUser(f);return null};
 const signOut=()=>setUser(null);
 const updateProfile=p=>{const nu={...user,...p};setUsers(users.map(x=>x.email===user.email?nu:x));setUser(nu);
  Alert.alert('Profile updated',`Hi ${nu.name}, your profile changes are saved.`)};
 const addTx=t=>{setTx([{id:Date.now().toString(),email:user.email,date:iso(),...t},...tx]);
  if(t.type==='income')return Alert.alert(`Hi ${user.name}! 🎉`,`${fmt(t.amount)} income added.`);
  const cat=CATS.find(c=>c.name===t.category);
  const spent=mine.filter(x=>x.category===t.category&&x.type==='expense').reduce((a,x)=>a+x.amount,0)+t.amount;
  Alert.alert(`Hi ${user.name}!`,`${fmt(t.amount)} added to ${t.category}. `+(cat.budget&&spent>cat.budget?`⚠️ You crossed your ${fmt(cat.budget)} budget!`:`${fmt(Math.max(cat.budget-spent,0))} budget left.`))};
 const delTx=t=>{setTx(tx.filter(x=>x.id!==t.id));Alert.alert(`Hi ${user.name}`,`"${t.title}" (${fmt(t.amount)}) was deleted.`)};
 return <Ctx.Provider value={{users,user,tx,mine,signUp,signIn,signOut,updateProfile,addTx,delTx}}>{children}</Ctx.Provider>}