import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const { loading: reduxLoading, error: reduxError } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [localError, setLocalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Input change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear field-specific error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (localError) setLocalError("");
  };

  // Basic validation
  const validate = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit using the useAuth hook layer
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setLocalError("");

    try {
      await handleLogin({
        email: formData.email.trim(),
        password: formData.password,
      });
      // Redirect on successful login
      navigate("/");
    } catch (err) {
      setLocalError(
        err.response?.data?.message ||
        err.message ||
        "Unable to log in. Please check your credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || reduxLoading;
  const displayError = localError || (reduxError ? String(reduxError) : "");

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col lg:flex-row font-sans selection:bg-white selection:text-black">
      {/* Left Section: SNITCH Brand & Fashion Campaign */}
      <div className="relative w-full lg:w-1/2 min-h-[380px] lg:min-h-screen flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden bg-neutral-950 border-b lg:border-b-0 lg:border-r border-neutral-800">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop"
            alt="SNITCH Editorial Streetwear"
            className="w-full h-full object-cover object-top opacity-60 filter contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        </div>

        {/* Top Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="inline-block">
            <span className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
              SNITCH<span className="text-neutral-500">.</span>
            </span>
          </Link>
          <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-neutral-400 bg-white/10 px-3 py-1 border border-white/15">
            MEMBER ARCHIVE
          </span>
        </div>

        {/* Campaign Statement */}
        <div className="relative z-10 my-10 lg:my-auto max-w-md">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 font-semibold mb-3">
            Autumn / Winter 2026
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight uppercase text-white mb-5">
            BREAK
            <br />
            THE RULES.
            <br />
            DEFINE
            <br />
            YOUR STYLE<span className="text-neutral-500">.</span>
          </h2>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Welcome back to SNITCH. Access your saved orders, private member
            drops, and bespoke streetwear collection.
          </p>
        </div>

        {/* Left Footer */}
        <div className="relative z-10 text-[11px] text-neutral-500 tracking-widest uppercase">
          © 2026 SNITCH APPAREL CORP. ALL RIGHTS RESERVED.
        </div>
      </div>

      {/* Right Section: Clean, Simple Login Form */}
      <div className="w-full lg:w-1/2 min-h-screen bg-white text-black flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-16">
        {/* Top Navigation */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
          <Link
            to="/"
            className="text-xs font-bold tracking-widest uppercase text-neutral-500 hover:text-black transition-colors"
          >
            ← Store
          </Link>
          <p className="text-xs text-neutral-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-black font-bold uppercase underline underline-offset-4 hover:text-neutral-600 transition-colors"
            >
              Register
            </Link>
          </p>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <div className="mb-8">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-neutral-400 block mb-1">
              Account Access
            </span>
            <h1 className="font-display text-3xl font-black uppercase tracking-tight text-black">
              Sign In
            </h1>
            <p className="text-sm text-neutral-600 mt-2">
              Enter your email and password to continue.
            </p>
          </div>

          {/* Error Banner */}
          {displayError && (
            <div className="mb-6 p-4 bg-neutral-900 text-white text-xs border-l-4 border-red-500 flex flex-col gap-1">
              <span className="font-bold uppercase tracking-wider text-red-400">
                Notice
              </span>
              <span>{displayError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold tracking-wider uppercase text-neutral-800 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className={`w-full h-12 px-4 bg-neutral-50 text-black text-sm border transition-colors outline-none focus:bg-white ${formErrors.email
                    ? "border-red-500"
                    : "border-neutral-300 focus:border-black"
                  }`}
              />
              {formErrors.email && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">
                  {formErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold tracking-wider uppercase text-neutral-800"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "Please contact support@snitch.co.in to reset your password."
                    )
                  }
                  className="text-xs text-neutral-500 hover:text-black underline underline-offset-4"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full h-12 pl-4 pr-12 bg-neutral-50 text-black text-sm border transition-colors outline-none focus:bg-white ${formErrors.password
                      ? "border-red-500"
                      : "border-neutral-300 focus:border-black"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-black transition-colors"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-700 select-none">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 accent-black rounded-none cursor-pointer"
                />
                <span>Remember me on this device</span>
              </label>
            </div>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-neutral-400 uppercase tracking-wider">
                  Or continue with
                </span>
              </div>
            </div>

        <a href="/api/auth/google">continue with google</a>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-13 bg-black text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 active:scale-[0.99] disabled:bg-neutral-400 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              {isLoading ? "AUTHENTICATING..." : "SIGN IN →"}
            </button>
          </form>

          {/* Quick Switch */}
          <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
            <p className="text-xs text-neutral-500">
              New to SNITCH?{" "}
              <Link
                to="/register"
                className="text-black font-bold uppercase tracking-wider underline underline-offset-4 ml-1"
              >
                Create an Account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-[10px] text-neutral-400 tracking-wider uppercase pt-4 border-t border-neutral-100">
          256-BIT ENCRYPTED LOGIN • SNITCH FASHION CORP
        </div>
      </div>
    </div>
  );
};

export default Login;
