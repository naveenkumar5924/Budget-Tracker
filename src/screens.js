import React,{useState} from 'react';
import {View,Text,Alert} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useApp,CATS,fmt,sum,inPeriod} from './store';
import {C,Screen,Card,H,Btn,Input,Seg,Bar,TxRow,Grad} from './ui';
const mail=/^\S+@\S+\.\S+$/;

export function Home({navigation}){const [role,setRole]=useState('customer');
 return <Grad style={{flex:1,padding:24,justifyContent:'center'}}>
  <View style={{alignSelf:'center',backgroundColor:'rgba(255,255,255,.18)',padding:22,borderRadius:40,marginBottom:14}}><Ionicons name="wallet" size={64} color="#fff"/></View>
  <Text style={{color:'#fff',fontSize:32,fontWeight:'800',textAlign:'center'}}>Budget Tracker</Text>
  <Text style={{color:'#D9D2FF',textAlign:'center',marginBottom:28}}>Track income, expenses & budgets</Text>
  <View style={{backgroundColor:'rgba(255,255,255,.14)',borderRadius:24,padding:18}}>
   <Seg opts={['customer','admin']} val={role} set={setRole}/>
   <Btn title={`Sign In as ${role}`} onPress={()=>navigation.navigate('Auth',{mode:'in',role})}/>
   <Btn outline title={`Sign Up as ${role}`} onPress={()=>navigation.navigate('Auth',{mode:'up',role})}/></View></Grad>}

export function Auth({route,navigation}){const {mode,role}=route.params;const {signIn,signUp}=useApp();
 const [f,setF]=useState({name:'',email:'',phone:'',password:''});const [e,setE]=useState({});
 const set=k=>v=>setF({...f,[k]:v});
 const go=()=>{const x={};
  if(mode==='up'&&f.name.trim().length<3)x.name='Name must be at least 3 characters';
  if(!mail.test(f.email))x.email='Enter a valid email';
  if(mode==='up'&&!/^\d{10}$/.test(f.phone))x.phone='Phone must be 10 digits';
  if(f.password.length<6)x.password='Password must be at least 6 characters';
  setE(x);if(Object.keys(x).length)return;
  if(mode==='up'){const r=signUp({...f,role});if(r)return Alert.alert('Error',r);Alert.alert('Success','Account created. Please sign in.');navigation.replace('Auth',{mode:'in',role})}
  else{const r=signIn(f.email,f.password,role);if(r)Alert.alert('Login failed',r)}};
 return <Screen><H>{mode==='in'?'Sign In':'Sign Up'} ({role})</H>
  {mode==='up'&&<Input label="Name" value={f.name} onChangeText={set('name')} error={e.name}/>}
  <Input label="Email" autoCapitalize="none" keyboardType="email-address" value={f.email} onChangeText={set('email')} error={e.email}/>
  {mode==='up'&&<Input label="Phone" keyboardType="number-pad" maxLength={10} value={f.phone} onChangeText={set('phone')} error={e.phone}/>}
  <Input label="Password" secureTextEntry value={f.password} onChangeText={set('password')} error={e.password}/>
  <Btn title={mode==='in'?'Sign In':'Create Account'} onPress={go}/>
  <Text style={{color:C.mut,textAlign:'center',marginTop:10}}>Demo: user@app.com / user123 • admin@app.com / admin123</Text></Screen>}

export function Reports(){const {mine,user}=useApp();const [p,setP]=useState('daily');
 const l=mine.filter(t=>inPeriod(t.date,p));const i=sum(l,'income'),x=sum(l,'expense');
 return <Screen><Text style={{fontSize:22,fontWeight:'800',color:C.txt}}>Hello, {user.name} 👋</Text>
  <Grad style={{borderRadius:22,padding:20,marginTop:12,marginBottom:14}}><Text style={{color:'#D9D2FF'}}>Total Balance</Text><Text style={{color:'#fff',fontSize:34,fontWeight:'800'}}>{fmt(sum(mine,'income')-sum(mine,'expense'))}</Text></Grad>
  <Seg opts={['daily','weekly','monthly']} val={p} set={setP}/>
  <View style={{flexDirection:'row',gap:10}}><Card style={{flex:1}}><Text style={{color:C.mut}}>↓ Income</Text><Text style={{color:C.g,fontWeight:'800',fontSize:19}}>{fmt(i)}</Text></Card>
  <Card style={{flex:1}}><Text style={{color:C.mut}}>↑ Expense</Text><Text style={{color:C.red,fontWeight:'800',fontSize:19}}>{fmt(x)}</Text></Card></View>
  <H>{p[0].toUpperCase()+p.slice(1)} Transactions</H>{l.length?l.map(t=><TxRow key={t.id} t={t}/>):<Text style={{color:C.mut}}>No transactions for this period.</Text>}</Screen>}

export function Transactions(){const {mine,addTx,delTx}=useApp();const [m,setM]=useState(new Date());
 const [show,setShow]=useState(false);const [f,setF]=useState({title:'',amount:'',type:'expense',category:'Food'});const [e,setE]=useState({});
 const key=m.getFullYear()+'-'+String(m.getMonth()+1).padStart(2,'0');const l=mine.filter(t=>t.date.startsWith(key));
 const shift=n=>setM(new Date(m.getFullYear(),m.getMonth()+n,1));
 const save=()=>{const x={};if(!f.title.trim())x.title='Title required';if(!(Number(f.amount)>0))x.amount='Enter amount greater than 0';
  setE(x);if(Object.keys(x).length)return;addTx({...f,amount:Number(f.amount)});setF({...f,title:'',amount:''});setShow(false)};
 return <Screen><View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
  <Ionicons name="chevron-back" size={26} color={C.p} onPress={()=>shift(-1)}/><H>{m.toLocaleString('default',{month:'long',year:'numeric'})}</H><Ionicons name="chevron-forward" size={26} color={C.p} onPress={()=>shift(1)}/></View>
  <Text style={{color:C.mut,marginBottom:8}}>Income {fmt(sum(l,'income'))} • Expense {fmt(sum(l,'expense'))}</Text>
  <Btn title={show?'Close':'+ Add Transaction'} onPress={()=>setShow(!show)}/>
  {show&&<Card><Input label="Title" value={f.title} onChangeText={v=>setF({...f,title:v})} error={e.title}/>
   <Input label="Amount" keyboardType="numeric" value={f.amount} onChangeText={v=>setF({...f,amount:v})} error={e.amount}/>
   <Seg opts={['expense','income']} val={f.type} set={v=>setF({...f,type:v,category:v==='income'?'Salary':'Food'})}/>
   <Seg opts={CATS.filter(c=>f.type==='income'?c.name==='Salary':c.name!=='Salary').map(c=>c.name)} val={f.category} set={v=>setF({...f,category:v})}/>
   <Btn title="Save" onPress={save}/></Card>}
  <Text style={{color:C.mut,marginVertical:6}}>Long-press a row to delete</Text>
  {l.length?l.map(t=><TxRow key={t.id} t={t} onLong={()=>Alert.alert('Delete?',t.title,[{text:'Cancel'},{text:'Delete',style:'destructive',onPress:()=>delTx(t)}])}/>):<Text style={{color:C.mut}}>No transactions this month.</Text>}</Screen>}

export function Categories({navigation}){const {mine}=useApp();
 return <Screen><H>Overall Categories</H>{CATS.map(c=>{const sp=sum(mine.filter(t=>t.category===c.name),c.name==='Salary'?'income':'expense');
  return <Card key={c.name}><View style={{flexDirection:'row',alignItems:'center'}} ><Ionicons name={c.icon} size={26} color={C.p}/>
   <Text style={{flex:1,marginLeft:10,fontWeight:'700',color:C.txt}} onPress={()=>navigation.navigate('CategoryDetails',{name:c.name})}>{c.name}</Text>
   <Text style={{fontWeight:'700'}}>{fmt(sp)}</Text><Ionicons name="chevron-forward" size={20} onPress={()=>navigation.navigate('CategoryDetails',{name:c.name})}/></View>
   {c.budget>0&&<Bar label="Budget used" value={sp} max={c.budget} color={sp>c.budget?C.red:C.p}/>}</Card>})}</Screen>}

export function CategoryDetails({route}){const {mine}=useApp();const c=CATS.find(x=>x.name===route.params.name);
 const l=mine.filter(t=>t.category===c.name);const sp=sum(l,c.name==='Salary'?'income':'expense');
 return <Screen><Card><Ionicons name={c.icon} size={36} color={C.p}/><H>{c.name}</H><Text>Total: {fmt(sp)}</Text>
  {c.budget>0&&<><Text style={{marginBottom:8,color:C.mut}}>Budget {fmt(c.budget)} • Left {fmt(Math.max(c.budget-sp,0))}</Text><Bar label="Used" value={sp} max={c.budget} color={sp>c.budget?C.red:C.p}/></>}</Card>
  <H>Transactions</H>{l.length?l.map(t=><TxRow key={t.id} t={t}/>):<Text style={{color:C.mut}}>No transactions in this category.</Text>}</Screen>}

export function Analysis(){const {user,mine,tx,users}=useApp();const admin=user.role==='admin';const d=admin?tx:mine;
 const ex=CATS.filter(c=>c.name!=='Salary').map(c=>({n:c.name,v:sum(d.filter(t=>t.category===c.name),'expense')}));const mx=Math.max(...ex.map(e=>e.v),1);
 return <Screen><H>{admin?'All Users Analysis':'My Analysis'}</H>
  {admin&&<Card><Text>Total users: {users.filter(u=>u.role==='customer').length}</Text><Text>Total transactions: {tx.length}</Text></Card>}
  <Card><Bar label="Income" value={sum(d,'income')} max={Math.max(sum(d,'income'),sum(d,'expense'))} color={C.g}/><Bar label="Expense" value={sum(d,'expense')} max={Math.max(sum(d,'income'),sum(d,'expense'))} color={C.red}/></Card>
  <Card><H>Expense by Category</H>{ex.map(e=><Bar key={e.n} label={e.n} value={e.v} max={mx}/>)}</Card></Screen>}

export function Users(){const {users}=useApp();return <Screen><H>Registered Users</H>{users.map(u=><Card key={u.email}><Text style={{fontWeight:'700'}}>{u.name} ({u.role})</Text><Text style={{color:C.mut}}>{u.email} • {u.phone}</Text></Card>)}</Screen>}

export function Profile({navigation}){const {user}=useApp();
 return <Screen><Card style={{alignItems:'center'}}><Ionicons name="person-circle" size={90} color={C.p}/><H>{user.name}</H><Text>{user.email}</Text><Text>{user.phone}</Text></Card>
  <Btn title="Edit Profile" onPress={()=>navigation.navigate('EditProfile')}/></Screen>}

export function EditProfile({navigation}){const {user,updateProfile}=useApp();const [n,setN]=useState(user.name),[p,setP]=useState(user.phone),[e,setE]=useState({});
 const save=()=>{const x={};if(n.trim().length<3)x.n='Name must be at least 3 characters';if(!/^\d{10}$/.test(p))x.p='Phone must be 10 digits';setE(x);
  if(Object.keys(x).length)return;updateProfile({name:n.trim(),phone:p});navigation.goBack()};
 return <Screen><Input label="Name" value={n} onChangeText={setN} error={e.n}/><Input label="Email (cannot change)" value={user.email} editable={false}/>
  <Input label="Phone" keyboardType="number-pad" maxLength={10} value={p} onChangeText={setP} error={e.p}/><Btn title="Save Changes" onPress={save}/></Screen>}