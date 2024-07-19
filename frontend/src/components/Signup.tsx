import { useState } from "react";
import LabeledInput from "./LabeledInput";
export default function Signup() {
  const [data, setData] = useState({
    userName: "",
    password: "",
    name: "",
  });
  const handlechange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div>
      <LabeledInput
        type={"text"}
        onChange={handlechange}
        placeholder={"User Name"}
        name={"userName"}
        label={"Enter User Name"}
      />
      <LabeledInput
        type={"text"}
        onChange={handlechange}
        placeholder={"Enter Name"}
        name={"name"}
        label={"Name"}
      />
      <LabeledInput
        type={"password"}
        onChange={handlechange}
        placeholder={"Enter Password"}
        name={"password"}
        label={"Password"}
      />
    </div>
  );
}
