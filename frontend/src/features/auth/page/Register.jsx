import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { handleRegister } = useAuth();
  const { loading: reduxLoading, error: reduxError } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [localError, setLocalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeRole, setActiveRole] = useState("buyer"); // "buyer" | "seller"

  // Handle inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (localError) setLocalError("");
  };

  // Form validation
  const validate = () => {
    const errors = {};

    if (!formData.fullname.trim()) {
      errors.fullname = "Full name is required";
    } else if (formData.fullname.trim().length < 2) {
      errors.fullname = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Enter a valid email address";
    }

    if (!formData.contact.trim()) {
      errors.contact = "Contact number is required";
    } else if (formData.contact.trim().length < 8) {
      errors.contact = "Enter a valid contact number";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Core submit logic calling useAuth hook
  const executeRegister = async (asSeller) => {
    if (!validate()) return;

    setIsSubmitting(true);
    setLocalError("");

    try {
      await handleRegister({
        fullname: formData.fullname.trim(),
        email: formData.email.trim(),
        contact: formData.contact.trim(),
        password: formData.password,
        isSeller: asSeller,
      });

      // Redirect to login upon successful registration
      navigate("/login");
    } catch (err) {
      setLocalError(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Please check your information."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || reduxLoading;
  const displayError = localError || (reduxError ? String(reduxError) : "");

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col lg:flex-row font-sans selection:bg-white selection:text-black">
      {/* Left Section: SNITCH Editorial Fashion Brand */}
      <div className="relative w-full lg:w-1/2 min-h-[380px] lg:min-h-screen flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden bg-neutral-950 border-b lg:border-b-0 lg:border-r border-neutral-800">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1600&auto=format&fit=crop"
            alt="SNITCH High-End Fashion Editorial"
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
            JOIN COMMUNITY
          </span>
        </div>

        {/* Campaign Statement */}
        <div className="relative z-10 my-10 lg:my-auto max-w-md">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 font-semibold mb-3">
            Streetwear Atelier // 2026
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
            Create your account to access weekly exclusive drops, personal
            wardrobe styling, or partner with us as a verified SNITCH seller.
          </p>
        </div>

        {/* Left Footer */}
        <div className="relative z-10 text-[11px] text-neutral-500 tracking-widest uppercase">
          © 2026 SNITCH APPAREL CORP. ALL RIGHTS RESERVED.
        </div>
      </div>

      {/* Right Section: Clean, Simple Register Form */}
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
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-black font-bold uppercase underline underline-offset-4 hover:text-neutral-600 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <div className="mb-6">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-neutral-400 block mb-1">
              New Membership
            </span>
            <h1 className="font-display text-3xl font-black uppercase tracking-tight text-black">
              Create Account
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              Join SNITCH as a fashion customer or register as a merchant seller.
            </p>
          </div>

          {/* Account Type Selector (Simple & Clear) */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 mb-6">
            <button
              type="button"
              onClick={() => setActiveRole("buyer")}
              className={`py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                activeRole === "buyer"
                  ? "bg-black text-white shadow-sm"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              Buyer / Customer
            </button>
            <button
              type="button"
              onClick={() => setActiveRole("seller")}
              className={`py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                activeRole === "seller"
                  ? "bg-black text-white shadow-sm"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              Seller / Merchant
            </button>
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

          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeRegister(activeRole === "seller");
            }}
            noValidate
            className="space-y-4"
          >
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullname"
                className="block text-xs font-bold tracking-wider uppercase text-neutral-800 mb-1.5"
              >
                Full Name
              </label>
              <input
                id="fullname"
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Alexander McQueen"
                className={`w-full h-11 px-4 bg-neutral-50 text-black text-sm border transition-colors outline-none focus:bg-white ${
                  formErrors.fullname
                    ? "border-red-500"
                    : "border-neutral-300 focus:border-black"
                }`}
              />
              {formErrors.fullname && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  {formErrors.fullname}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold tracking-wider uppercase text-neutral-800 mb-1.5"
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
                className={`w-full h-11 px-4 bg-neutral-50 text-black text-sm border transition-colors outline-none focus:bg-white ${
                  formErrors.email
                    ? "border-red-500"
                    : "border-neutral-300 focus:border-black"
                }`}
              />
              {formErrors.email && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  {formErrors.email}
                </p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label
                htmlFor="contact"
                className="block text-xs font-bold tracking-wider uppercase text-neutral-800 mb-1.5"
              >
                Contact Number
              </label>
              <input
                id="contact"
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className={`w-full h-11 px-4 bg-neutral-50 text-black text-sm border transition-colors outline-none focus:bg-white ${
                  formErrors.contact
                    ? "border-red-500"
                    : "border-neutral-300 focus:border-black"
                }`}
              />
              {formErrors.contact && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  {formErrors.contact}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold tracking-wider uppercase text-neutral-800 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className={`w-full h-11 pl-4 pr-12 bg-neutral-50 text-black text-sm border transition-colors outline-none focus:bg-white ${
                    formErrors.password
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
                <p className="mt-1 text-xs text-red-600 font-medium">
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-bold tracking-wider uppercase text-neutral-800 mb-1.5"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className={`w-full h-11 pl-4 pr-12 bg-neutral-50 text-black text-sm border transition-colors outline-none focus:bg-white ${
                    formErrors.confirmPassword
                      ? "border-red-500"
                      : "border-neutral-300 focus:border-black"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-black transition-colors"
                >
                  {showConfirmPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Action Buttons: Primary & Dedicated Seller Button */}
            <div className="pt-2 space-y-2.5">
              {/* Primary Submit Button */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setActiveRole("buyer");
                  executeRegister(false);
                }}
                className="w-full h-12 bg-black text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 active:scale-[0.99] disabled:bg-neutral-400 transition-all flex items-center justify-center cursor-pointer"
              >
                {isLoading && activeRole === "buyer"
                  ? "CREATING ACCOUNT..."
                  : "CREATE ACCOUNT"}
              </button>

              {/* Extra Dedicated Seller Button */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setActiveRole("seller");
                  executeRegister(true);
                }}
                className="w-full h-12 bg-white text-black border-2 border-black text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-100 active:scale-[0.99] disabled:border-neutral-400 disabled:text-neutral-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading && activeRole === "seller"
                  ? "REGISTERING SELLER..."
                  : "REGISTER AS A SELLER →"}
              </button>
            </div>
          </form>

          {/* Quick Switch */}
          <div className="mt-6 pt-5 border-t border-neutral-100 text-center">
            <p className="text-xs text-neutral-500">
              Already a member?{" "}
              <Link
                to="/login"
                className="text-black font-bold uppercase tracking-wider underline underline-offset-4 ml-1"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-[10px] text-neutral-400 tracking-wider uppercase pt-4 border-t border-neutral-100">
          BY REGISTERING YOU AGREE TO OUR TERMS OF SERVICE & PRIVACY POLICY
        </div>
      </div>
    </div>
  );
};

export default Register;
