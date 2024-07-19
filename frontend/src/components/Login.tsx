import Link from "react-router-dom"
import LabeledInput from "./LabeledInput"
import { useState } from "react"

export default function Login(){
  const [data,setData] = useState({
    userName:'',
    password:''
  })
  const handlechange = (event: React.ChangeEvent<HTMLInputElement>) =>{
    const { name, value } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
    return (
      <div >
        <LabeledInput type={"text"} onChange={handlechange} placeholder={"Enter User Name"} name={"userName"} label={"User Name"}/>
        <LabeledInput type={"password"} onChange={handlechange} placeholder={"Enter Password"} name={"password"} label={"Password"}/>
      </div>
    )
}