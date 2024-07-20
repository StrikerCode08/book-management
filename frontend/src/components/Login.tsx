import Link from "react-router-dom";
import LabeledInput from "./LabeledInput";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
export default function Login() {
  const [data, setData] = useState({
    userName: "",
    password: "",
  });
  interface ValidationErrors {
    userName?: string;
    password?: string;
  }
  const [errors, setErrors] = useState<ValidationErrors>({});
  const navigate = useNavigate();
  const handlechange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const validate = (): boolean => {
    let validationErrors: ValidationErrors = {};

    if (!data.userName) {
      validationErrors.userName = "Username is required";
    } else if (data.userName.length < 3) {
      validationErrors.userName = "Username must be at least 3 characters long";
    }

    if (!data.password) {
      validationErrors.password = "Password is required";
    } else if (data.password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_URL}/user/login`,
        data
      );
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        navigate("/booklist");
      } else {
        alert("Invalid Inputs");
      }
    } catch (error: any) {
      if (error.response) {
        // Server responded with a status other than 200 range
        if (error.response.status === 401) {
          alert("Invalid username or password");
        } else if (error.response.status === 400) {
          alert("Bad request. Please check your inputs.");
        } else {
          alert("An unexpected error occurred. Please try again later.");
        }
      } else if (error.request) {
        // Request was made but no response received
        alert("No response from server. Please check your network connection.");
      } else {
        // Something happened in setting up the request
        alert(`Error: ${error.message}`);
      }
    }
  };
  return (
    <div className="flex justify-center h-screen items-center">
      <div>
        <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-black-600">
          Login
        </h1>
        <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
          Not Registered? <NavLink to={"/signup"}>Register</NavLink>
        </p>
        <LabeledInput
          type={"text"}
          onChange={handlechange}
          placeholder={"Enter User Name"}
          name={"userName"}
          label={"User Name"}
          value={data.userName}
          error={errors.userName}
        />
        <LabeledInput
          type={"password"}
          onChange={handlechange}
          placeholder={"Enter Password"}
          name={"password"}
          label={"Password"}
          value={data.password}
          error={errors.password}
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        >
          Login
        </button>
      </div>
    </div>
  );
}
