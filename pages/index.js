import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function IndexPage() {
  const router = useRouter();

  return (
    <div className="font-[Poppins,sans-serif]">
      <header className="bg-[#a1ccd2] text-black p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Keep Notes</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><button onClick={() => router.push("/login")} className="hover:underline">Login</button></li>
            <li><button onClick={() => router.push("/register")} className="hover:underline">Register</button></li>
          </ul>
        </nav>
      </header>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="flex h-screen items-center justify-center bg-yellow-100"
      >
        <div className="text-center">
          <motion.h2
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-4"  // Reduced the bottom margin
          >
            Welcome to Notes
          </motion.h2>

          {/* Login and Register buttons */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"  // Added gap between buttons
          >
            <button
              onClick={() => router.push("/login")}
              className="w-40 py-2 bg-orange-400 text-white rounded-lg shadow-md hover:bg-orange-500 transition-all duration-300"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/register")}
              className="w-40 py-2 bg-blue-400 text-white rounded-lg shadow-md hover:bg-blue-500 transition-all duration-300"
            >
              Register
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
