'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Check,
  Upload,
  Lock,
  ArrowLeft,
  ArrowRight,
  Loader2,
  User,
  Mail,
  X,
  MapPin,
  Phone,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Home,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import RoomCard from '@/components/RoomCard';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { DateRange } from 'react-day-picker';
import { useGetRoomsQuery } from '@/store/services/admin-dashboard';
import { Button } from '@/components/ui/button';

// --- TYPES ---
type VerificationResult = {
  success: boolean;
  title: string;
  message: string;
  fraudScore?: number;
  reason?: string;
};

const steps = [
  { id: 0, name: 'Select Dates', icon: Calendar },
  { id: 1, name: 'Choose Room', icon: Calendar },
  { id: 2, name: 'Your Details', icon: User },
  { id: 3, name: 'Verify ID', icon: Lock },
] as const;

const BOOKING_API_URL = 'https://api-staging.medicate.health/api/v1/bookings';
const ROOMS_PER_PAGE = 6;

const BookingWizardPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [roomPage, setRoomPage] = useState(1);

  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'uploading' | 'success' | 'error'
  >('idle');

  const { data } = useGetRoomsQuery();
  const availableRooms = data || [];

  // Pagination Logic
  const totalPages = Math.ceil(availableRooms.length / ROOMS_PER_PAGE);
  const paginatedRooms = availableRooms.slice(
    (roomPage - 1) * ROOMS_PER_PAGE,
    roomPage * ROOMS_PER_PAGE
  );

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0:
        return !!dateRange?.from && !!dateRange?.to;
      case 1:
        return selectedRoom !== null;
      case 2:
        return guestName.trim() !== '' && isValidEmail(guestEmail);
      case 3:
        return uploadedFile !== null;
      default:
        return false;
    }
  };

  const handleNext = () => currentStep < 3 && setCurrentStep((s) => s + 1);
  const handleBack = () => currentStep > 0 && setCurrentStep((s) => s - 1);

  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (
      file &&
      (file.type.startsWith('image/') || file.type === 'application/pdf')
    ) {
      setUploadedFile(file);
      setVerificationResult(null);
    } else {
      toast.error('Please upload an image or PDF.');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      file &&
      (file.type.startsWith('image/') || file.type === 'application/pdf')
    ) {
      setUploadedFile(file);
      setVerificationResult(null);
    } else if (file) {
      toast.error('Only images and PDFs are allowed.');
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setVerificationResult(null);
  };

  const handleCompleteBooking = async () => {
    if (!dateRange?.from || !dateRange?.to || !selectedRoom || !uploadedFile) {
      toast.error('Please complete all steps.');
      return;
    }

    setUploadStatus('uploading');
    setVerificationResult(null);

    const formData = new FormData();
    formData.append('guestName', guestName);
    formData.append('guestEmail', guestEmail);
    formData.append('roomId', selectedRoom);
    formData.append('checkInDate', dateRange.from.toISOString());
    formData.append('checkOutDate', dateRange.to.toISOString());
    formData.append('file', uploadedFile);

    try {
      const response = await axios.post(BOOKING_API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { success, aiReport, message } = response.data;
      const fraudScore = aiReport?.fraud?.fraudScore || 0;

      // SUCCESS CASE
      setUploadStatus('success');
      setVerificationResult({
        success: true,
        title: 'Booking Confirmed!',
        message:
          'Your identity has been verified and your room is secured. We have sent a digital key to your email.',
        fraudScore: fraudScore,
      });
    } catch (err: any) {
      setUploadStatus('error');

      const responseData = err.response?.data || {};
      const fraudScore = responseData.fraudScore;
      const failureReason =
        responseData.reason || 'Identity verification failed.';

      if (err.response?.status === 403) {
        // SECURITY BLOCK CASE (The one you asked for)
        setVerificationResult({
          success: false,
          title: 'Security Verification Failed',
          message:
            'Our AI security system flagged this booking attempt as high risk.',
          reason: failureReason,
          fraudScore: fraudScore,
        });
      } else {
        // GENERIC ERROR CASE
        setVerificationResult({
          success: false,
          title: 'Booking Error',
          message:
            responseData.message || 'Something went wrong. Please try again.',
          reason: 'System Error',
        });
      }
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RESULT VIEW (This replaces the wizard when done)
  // ─────────────────────────────────────────────────────────────────────────────
  if (verificationResult) {
    const isSuccess = verificationResult.success;

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div
          className={cn(
            'animate-in zoom-in-95 w-full max-w-md overflow-hidden rounded-3xl border bg-white p-8 text-center shadow-xl duration-300',
            isSuccess ? 'border-emerald-100' : 'border-red-100'
          )}
        >
          {/* ICON */}
          <div className="mb-6 flex justify-center">
            <div
              className={cn(
                'flex h-24 w-24 items-center justify-center rounded-full shadow-sm',
                isSuccess
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-red-50 text-red-600'
              )}
            >
              {isSuccess ? (
                <CheckCircle2 className="h-12 w-12" />
              ) : (
                <ShieldAlert className="h-12 w-12" />
              )}
            </div>
          </div>

          {/* TEXT */}
          <h2
            className={cn(
              'mb-2 text-2xl font-bold',
              isSuccess ? 'text-slate-900' : 'text-red-600'
            )}
          >
            {verificationResult.title}
          </h2>

          <p className="mb-6 leading-relaxed text-slate-600">
            {verificationResult.message}
          </p>

          {/* FRAUD DETAILS (Only if failed or if you want to show score) */}
          {typeof verificationResult.fraudScore === 'number' && (
            <div
              className={cn(
                'mb-8 rounded-xl border p-4 text-left text-sm',
                isSuccess
                  ? 'border-emerald-100 bg-emerald-50/50'
                  : 'border-red-100 bg-red-50/50'
              )}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-slate-700">
                  Security Score
                </span>
                <span
                  className={cn(
                    'rounded px-2 py-0.5 text-xs font-bold',
                    isSuccess
                      ? 'bg-emerald-200 text-emerald-800'
                      : 'bg-red-200 text-red-800'
                  )}
                >
                  {isSuccess ? 'PASSED' : 'FAILED'}
                </span>
              </div>

              {/* Score Bar */}
              <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className={cn(
                    'h-full transition-all duration-1000',
                    isSuccess ? 'bg-emerald-500' : 'bg-red-500'
                  )}
                  style={{
                    width: `${Math.min(verificationResult.fraudScore || 0, 100)}%`,
                  }}
                />
              </div>

              {!isSuccess && verificationResult.reason && (
                <div className="mt-3 border-t border-red-200 pt-3">
                  <p className="mb-1 text-xs font-bold tracking-wider text-red-700 uppercase">
                    Risk Factors Detected:
                  </p>
                  <p className="text-slate-600 italic">
                    "{verificationResult.reason}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex flex-col gap-3">
            {isSuccess ? (
              <Button
                onClick={() => router.push('/')}
                className="h-12 w-full rounded-xl bg-slate-900 text-base text-white hover:bg-slate-800"
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="h-12 w-full rounded-xl border-slate-200 text-base hover:bg-slate-50"
              >
                <Home className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // WIZARD RENDER (Existing logic)
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto px-4 py-12 md:max-w-5xl">
        {/* Progress Steps */}
        <nav className="mb-10">
          <ol className="mx-auto flex items-center justify-between md:max-w-3xl">
            {steps.map((step, idx) => {
              const isActive = currentStep === idx;
              const isCompleted = currentStep > idx;

              return (
                <li key={idx} className="flex flex-1 items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-all',
                        isCompleted &&
                          'border-emerald-500 bg-emerald-500 text-white',
                        isActive &&
                          'border-slate-900 bg-slate-900 text-white shadow-md',
                        !isCompleted &&
                          !isActive &&
                          'border-slate-200 text-slate-400'
                      )}
                    >
                      {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
                    </div>
                    <span
                      className={cn(
                        'hidden text-sm font-medium md:block',
                        isActive
                          ? 'text-slate-900'
                          : isCompleted
                            ? 'text-emerald-600'
                            : 'text-slate-400'
                      )}
                    >
                      {step.name}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="mx-3 flex-1">
                      <div
                        className={cn(
                          'h-[2px] w-full rounded-full',
                          isCompleted ? 'bg-emerald-500' : 'bg-slate-100'
                        )}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Step Content */}
        <div className="mb-12 min-h-[400px]">
          {/* Step 0 – Dates */}
          {currentStep === 0 && (
            <div className="hotel-card animate-in fade-in slide-in-from-bottom-4 mx-auto max-w-md">
              <h2 className="text-foreground mb-6 text-center text-xl font-semibold">
                Select Your Dates
              </h2>
              <div className="flex justify-center">
                <CalendarComponent
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={1}
                  disabled={(date) => date < new Date()}
                  className="rounded-xl border p-4 shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Step 1 – Room */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h2 className="mb-8 text-center text-3xl font-bold text-slate-900">
                Choose Your Sanctuary
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {paginatedRooms.map((room: any) => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={cn(
                      'group cursor-pointer overflow-hidden rounded-2xl border bg-white p-3 transition-all duration-300',
                      'hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl',
                      selectedRoom === room.id
                        ? 'border-slate-900 shadow-md ring-2 ring-slate-900 ring-offset-2'
                        : 'border-slate-100 shadow-sm'
                    )}
                  >
                    <div className="overflow-hidden rounded-xl">
                      <RoomCard room={room} />
                    </div>
                    {selectedRoom === room.id && (
                      <div className="mt-3 flex justify-center">
                        <span className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-900 uppercase">
                          <CheckCircle2 className="h-4 w-4" /> Selected
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-6">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setRoomPage((p) => Math.max(1, p - 1))}
                    disabled={roomPage === 1}
                    className="h-12 w-12 rounded-full border-slate-200 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <span className="text-sm font-medium tracking-widest text-slate-500 uppercase">
                    Page{' '}
                    <span className="font-bold text-slate-900">{roomPage}</span>{' '}
                    of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setRoomPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={roomPage === totalPages}
                    className="h-12 w-12 rounded-full border-slate-200 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 2 – Details */}
          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto max-w-md space-y-6">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-slate-900">
                  Guest Information
                </h2>
                <p className="mt-2 text-slate-500">
                  Please tell us who will be staying
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="John Doe"
                      className="h-12 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="h-12 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="h-12 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="address"
                      placeholder="123 Main St, City"
                      className="h-12 pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 – ID Upload */}
          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto max-w-lg">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-slate-900">
                  Identity Verification
                </h2>
                <p className="mt-2 text-slate-500">
                  Required for our AI Security Check
                </p>
              </div>

              {!uploadedFile ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  className={cn(
                    'rounded-3xl border-2 border-dashed p-12 text-center transition-all duration-300',
                    isDragging
                      ? 'scale-105 border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50'
                  )}
                >
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                    <Lock className="h-10 w-10 text-emerald-600" />
                  </div>
                  <p className="mb-2 text-xl font-semibold text-slate-900">
                    Upload Government ID
                  </p>
                  <p className="mb-8 text-sm text-slate-500">
                    Drag and drop or click to browse
                  </p>

                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileSelect}
                    id="id-upload"
                    className="hidden"
                  />
                  <label
                    htmlFor="id-upload"
                    className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-slate-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                  >
                    <Upload className="mr-2 h-4 w-4" /> Select Document
                  </label>
                </div>
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-xl bg-emerald-100 p-3">
                        <Check className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(uploadedFile.size / 1024).toFixed(1)} KB • Ready to
                          verify
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeFile}
                      className="rounded-full p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                    <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
                    <p className="text-sm text-slate-600">
                      Our AI will analyze this document to verify your identity.
                      Please ensure the name matches your booking details.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Bar */}
        <div className="fixed right-0 bottom-0 left-0 border-t border-slate-200 bg-white p-4 md:static md:border-0 md:bg-transparent md:p-0">
          <div className="mx-auto flex max-w-[60%] items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={cn(
                'flex items-center rounded-xl px-6 py-3 font-medium transition-colors',
                currentStep === 0
                  ? 'invisible'
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Back
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center rounded-xl bg-slate-900 px-8 py-3 font-medium text-white shadow-lg shadow-slate-200 transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={handleCompleteBooking}
                disabled={!uploadedFile || uploadStatus === 'uploading'}
                className={cn(
                  'flex min-w-[200px] items-center justify-center gap-2 rounded-xl px-8 py-3 font-bold text-white shadow-lg transition-all',
                  uploadStatus === 'uploading'
                    ? 'cursor-wait bg-slate-700'
                    : 'bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700'
                )}
              >
                {uploadStatus === 'uploading' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    Complete Booking <Check className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingWizardPage;
