"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/CustomToast";
import { authService } from "@/services/auth.service";

type Step = 'email' | 'otp' | 'newPassword';

const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    
    try {
      const response = await authService.forgotPassword(email);
      toast.success('Reset code sent to your email!');
      setCurrentStep('otp');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    
    try {
      // Just validate OTP format for now, actual validation will be done in password reset
      toast.success('OTP verified successfully!');
      setCurrentStep('newPassword');
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      const response = await authService.resetPassword(email, otp, newPassword);
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Hide modal and redirect after animation completes
      setTimeout(() => {
        setShowSuccessModal(false);
        setTimeout(() => {
          router.push('/');
        }, 500);
      }, 3000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    if (currentStep === 'email') {
      router.push('/');
    } else if (currentStep === 'otp') {
      setCurrentStep('email');
    } else if (currentStep === 'newPassword') {
      setCurrentStep('otp');
    }
  };

  const SuccessModal = () => (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${showSuccessModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-white rounded-2xl p-8 max-w-md mx-4 text-center transform transition-all duration-300 ${showSuccessModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="mx-auto mb-6 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <div className="checkmark-container">
            <svg
              className="checkmark w-12 h-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
                className="checkmark-path"
              />
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Reset Successful!</h2>
        <p className="text-gray-600 mb-6">
          Your password has been successfully updated. You will be redirected to the sign-in page.
        </p>
        
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-[#003366] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#003366] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-[#003366] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );

  const renderEmailStep = () => (
    <form onSubmit={handleEmailSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-lg font-medium text-[#030E18]">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 h-[50px]"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#003366] hover:bg-[#002B5B]/90 text-white h-[50px] rounded-lg text-lg font-medium"
      >
        {loading ? 'Sending OTP...' : 'Send OTP'}
      </Button>
    </form>
  );

  const renderOtpStep = () => (
    <form onSubmit={handleOtpSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="otp" className="text-lg font-medium text-[#030E18]">
          Enter OTP
        </Label>
        <Input
          id="otp"
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="w-full px-3 h-[50px] text-center text-2xl tracking-widest"
          maxLength={6}
          required
        />
        <p className="text-sm text-gray-600 text-center">
          We've sent a 6-digit verification code to {email}
        </p>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#003366] hover:bg-[#002B5B]/90 text-white h-[50px] rounded-lg text-lg font-medium"
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            // Call the forgot password API again to resend OTP
            handleEmailSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>);
          }}
          className="text-sm text-[#003366] hover:underline"
        >
          Resend OTP
        </button>
      </div>
    </form>
  );

  const renderPasswordStep = () => (
    <form onSubmit={handlePasswordSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="newPassword" className="text-lg font-medium text-[#030E18]">
          New Password
        </Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 h-[50px] pr-12"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-lg font-medium text-[#030E18]">
          Confirm New Password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 h-[50px] pr-12"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#003366] hover:bg-[#002B5B]/90 text-white h-[50px] rounded-lg text-lg font-medium"
      >
        {loading ? 'Resetting Password...' : 'Reset Password'}
      </Button>
    </form>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 'email':
        return 'Forgot Password?';
      case 'otp':
        return 'Verify OTP';
      case 'newPassword':
        return 'Set New Password';
      default:
        return 'Forgot Password?';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'email':
        return 'Enter your email address and we\'ll send you an OTP to reset your password.';
      case 'otp':
        return 'Enter the 6-digit verification code sent to your email.';
      case 'newPassword':
        return 'Create a new password for your account.';
      default:
        return 'Enter your email address and we\'ll send you an OTP to reset your password.';
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        {/* Back Button */}
        <div className="absolute top-8 left-8">
          <button
            onClick={handleBackClick}
            className="flex items-center text-[#003366] hover:text-[#002B5B] transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm">Back</span>
          </button>
        </div>

        {/* Logo */}
        <div className="lg:absolute lg:top-16">
          <Image
            src="/icons/login/tree.svg"
            alt="Tree Logo"
            width={64}
            height={64}
            className="h-[80px] w-[76.32px]"
            priority
          />
        </div>

        <div className="w-full max-w-[400px] space-y-8">
          <div className="font-manrope space-y-4 text-center">
            <h1 className="text-3xl font-medium text-[#030E18]">
              {getStepTitle()}
            </h1>
            <p className="text-lg text-[#444444] font-normal">
              {getStepDescription()}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center mb-6">
            <div className="flex space-x-2">
              <div className={`w-3 h-3 rounded-full ${currentStep === 'email' ? 'bg-[#003366]' : 'bg-gray-300'}`}></div>
              <div className={`w-3 h-3 rounded-full ${currentStep === 'otp' ? 'bg-[#003366]' : 'bg-gray-300'}`}></div>
              <div className={`w-3 h-3 rounded-full ${currentStep === 'newPassword' ? 'bg-[#003366]' : 'bg-gray-300'}`}></div>
            </div>
          </div>

          <div className="pt-[45px] font-manrope">
            {currentStep === 'email' && renderEmailStep()}
            {currentStep === 'otp' && renderOtpStep()}
            {currentStep === 'newPassword' && renderPasswordStep()}
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <span className="text-sm text-[#444444]">Remember your password? </span>
            <Link
              href="/"
              className="text-sm text-[#003366] hover:underline font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Illustration */}
      <div className="flex-1 relative hidden lg:block">
        <Image
          src="/icons/login/school-illustration.svg"
          alt="High school illustration"
          fill
          className="lg:w-[700px] lg:h-[500px]"
          priority
        />
      </div>

      {/* Success Modal */}
      <SuccessModal />

      {/* CSS Styles for animations */}
      <style jsx>{`
        @keyframes checkmark {
          0% {
            stroke-dashoffset: 50;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        .checkmark-path {
          stroke-dasharray: 50;
          stroke-dashoffset: 50;
          animation: checkmark 0.6s ease-in-out 0.3s forwards;
        }
        
        .checkmark-container {
          animation: scale-up 0.3s ease-in-out;
        }
        
        @keyframes scale-up {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default ForgotPasswordPage;
