import { useState, useContext } from "react";
import { StoreContext } from "../context/StoreContext";
import { X, Mail, Lock, User, Calendar, UserCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let newUrl = url + (currState === "Login" ? "/api/user/login" : "/api/user/register");

    try {
      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
        toast.success("Login successful! Welcome back.");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    }
    finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
      <div 
        className="absolute inset-0" 
        onClick={() => setShowLogin(false)}
      />
      
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 md:p-8 space-y-6 relative dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {currState === "Login" ? "Welcome Back" : "Create Account"}
          </h2>
          <button
            onClick={() => setShowLogin(false)}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Subtitle */}
        <p className="text-gray-600 dark:text-gray-300 -mt-2">
          {currState === "Login" 
            ? "Sign in to access your account" 
            : "Fill in your details to get started"}
        </p>

        {/* Form Fields */}
        <div className="space-y-4">
          {currState === "Sign up" && (
            <>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  name="name"
                  value={data.name}
                  onChange={onChangeHandler}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <Calendar size={18} />
                  </div>
                  <input
                    type="number"
                    placeholder="Age"
                    name="age"
                    min="13"
                    max="120"
                    value={data.age}
                    onChange={onChangeHandler}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <UserCircle size={18} />
                  </div>
                  <select
                    name="gender"
                    value={data.gender}
                    onChange={onChangeHandler}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </>
          )}
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              <Mail size={18} />
            </div>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={onChangeHandler}
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              <Lock size={18} />
            </div>
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              value={data.password}
              onChange={onChangeHandler}
              placeholder="Password"
              className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 dark:text-gray-400 cursor-pointer"
            >
              {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>
          
          {currState === "Login" && (
            <div className="flex justify-end">
              <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Forgot password?
              </button>
            </div>
          )}
        </div>

        {/* Terms & Consent */}
        <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input 
            type="checkbox" 
            id="terms-consent" 
            className="mt-1"
            checked={agreeToTerms}
            onChange={() => setAgreeToTerms(!agreeToTerms)}
          />
          <label htmlFor="terms-consent" className="cursor-pointer">
            By continuing, I agree to the{" "}
            <span className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer">
              Privacy Policy
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          disabled={isLoading || !agreeToTerms}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
          ) : null}
          {currState === "Login" ? "Sign In" : "Create Account"}
        </button>

        {/* Social Login Options */}
        <div className="relative flex items-center justify-center mt-6 mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative px-4 bg-white dark:bg-gray-800">
            <span className="text-sm text-gray-500 dark:text-gray-400">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            className="flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Google
          </button>
          <button
            className="flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Apple
          </button>
          <button
            className="flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Facebook
          </button>
        </div>

        {/* Switch between Login & Signup */}
        <p className="text-center text-gray-600 dark:text-gray-400">
          {currState === "Login" ? (
            <>
              Don&apos;t have an account?{" "}
              <span
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium cursor-pointer"
                onClick={() => setCurrState("Sign up")}
              >
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium cursor-pointer"
                onClick={() => setCurrState("Login")}
              >
                Sign in
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginPopup;