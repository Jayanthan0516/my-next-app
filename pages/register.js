import { useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { HiEye, HiEyeOff } from "react-icons/hi"; // Eye icon import

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // To toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // To toggle confirm password visibility
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      alert("Please fill in all the fields!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Check if email is in the correct format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailPattern.test(formData.email)) {
      alert("Please enter a valid Gmail address.");
      return;
    }

    const res = await fetch("http://127.0.0.1:8001/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password
      })
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Registration successful!");
      alert("Registration successful! Redirecting to login page.");
      router.push("/login");
    } else {
      setMessage(data.detail || "Registration failed");
    }
  };

  return (
    <div className="font-[Poppins,sans-serif]">
      <header className="bg-[#a1ccd2] text-black p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Keep Notes</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><button onClick={() => router.push("/")} className="hover:underline">Home</button></li>
            <li><button onClick={() => router.push("/register")} className="hover:underline">Register</button></li>
            <li><button onClick={() => router.push("/login")} className="hover:underline">Login</button></li>
          </ul>
        </nav>
      </header>
      <div className="flex h-screen items-center justify-center bg-yellow-100">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1.2 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-lg w-96 text-center border"
        >
          <h2 className="text-2xl font-bold mb-6 text-black">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 text-left">
              <label className="block text-sm font-semibold text-black">Username</label>
              <input
                type="text"
                name="username"
                className="w-full p-2 border rounded text-black"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4 text-left">
              <label className="block text-sm font-semibold text-black">Email</label>
              <input
                type="email"
                name="email"
                className="w-full p-2 border rounded text-black"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4 text-left">
              <label className="block text-sm font-semibold text-black">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full p-2 border rounded text-black"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
            </div>
            <div className="mb-4 text-left">
              <label className="block text-sm font-semibold text-black">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="w-full p-2 border rounded text-black"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
            </div>
            <button
              className="w-full bg-orange-400 text-white py-2 rounded hover:bg-orange-500"
              type="submit"
            >
              Register
            </button>
          </form>
          {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
          <p className="mt-4 text-sm text-black">
            Already have an account? 
            <button onClick={() => router.push("/login")} className="text-blue-500 hover:underline"> Login</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
