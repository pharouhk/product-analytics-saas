import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const checkUserEmail = (import.meta.env.VITE_APP_USER_EMAIL).toLowerCase();
  const checkUserPass = import.meta.env.VITE_APP_USER_PASS;

  const checkGlobalEmail = (import.meta.env.VITE_APP_EMBEDDED_USER_EMAIL).toLowerCase();
  const checkGlobalPass = import.meta.env.VITE_APP_EMBEDDED_USER_PASS;

  const checkObservEmail = (import.meta.env.VITE_APP_OBSERV_USER_EMAIL).toLowerCase();
  const checkObservPass = import.meta.env.VITE_APP_OBSERV_USER_PASS;

  const validObj = {
    [checkUserEmail]: checkUserPass,
    [checkGlobalEmail]: checkGlobalPass,
    [checkObservEmail]: checkObservPass
  }
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    const validObjEmailsArr = Object.keys(validObj);
    
    if (validObjEmailsArr.indexOf(email.toLowerCase()) >= 0 && password === validObj[email.toLowerCase()]) {
       await login({ email });
    } else {
      alert("Invalid email or password. You may not have access to view this dashboard");
    }
  };
  return (
    <div className='loginPageContainer'>
        <div className='logoImgDiv'>
            <img className='logoImg' src="https://sterling.ng/wp-content/uploads/2019/02/cropped-cropped-Sterling_favicon.png" alt="Sterling Logo" />
        </div>
        <div className='loginCard'>
            <h1 className='welcomeText'>Welcome Back!</h1>
            <form onSubmit={handleLogin}>
                <div className='emailFieldDiv'>
                    <label className='labelFieldText' for="email">
                        Email Address
                    </label>
                    <input className='inputBox' type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com" required 
                    />
                </div>
                {/* <div>
                <label htmlFor="username">Username:</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                </div> */}
                <div className='passwordFieldDiv'>
                    <label className='labelFieldText' for="password">
                        Password
                    </label>
                    <input className='inputBox' type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Enter your password" required 
                    />
                </div>
                {/* <div>
                <label htmlFor="password">Password:</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </div> */}
                {/* <button type="submit">Login</button> */}
                <button className='loginButton' type="submit">
                    Login
                </button>
            </form>
        </div>
    </div>
  );
};


export default LoginPage;