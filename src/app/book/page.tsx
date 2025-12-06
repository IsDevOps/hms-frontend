'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';
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
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import RoomCard from '@/components/RoomCard';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { DateRange } from 'react-day-picker';
import { useGetRoomsQuery } from '@/store/services/admin-dashboard';

type VerificationResult = {
  success: boolean;
  extractedName?: string;
  fraudScore?: number;
  aiAnalysis?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
const steps = [
  { id: 0, name: 'Select Dates', icon: Calendar },
  { id: 1, name: 'Choose Room', icon: Calendar },
  { id: 2, name: 'Your Details', icon: User },
  { id: 3, name: 'Verify ID', icon: Lock },
] as const;

const BOOKING_API_URL = 'https://api-staging.medicate.health/api/v1/bookings';

const BookingWizardPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);

  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'uploading' | 'success' | 'error'
  >('idle');

  const { data } = useGetRoomsQuery();
  const availableRooms = data || [];

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

      const { success, aiReport, message } = response.data;

      if (success) {
        const fraudScore = aiReport?.fraud?.fraudScore;
        let successMessage = message || 'Booking Confirmed!';

        if (fraudScore < 60) {
          successMessage += ` (Fraud Score: ${fraudScore})`;
        }

        setVerificationResult({
          success: true,
          extractedName: guestName,
          fraudScore: fraudScore,
          aiAnalysis:
            'ID photo matches guest information. No tampering detected. ',
        });
        setUploadStatus('success');
        toast.success(successMessage);
      } else {
        throw new Error(message || 'Booking failed');
      }
    } catch (err: any) {
      const fraudScore = err.response?.data?.aiReport?.fraud?.fraudScore;
      let errorMessage =
        err.response?.data?.message || err.message || 'Unknown error';

      if (fraudScore) {
        errorMessage += ` (Fraud Score: ${fraudScore})`;
      }

      setUploadStatus('error');
      setVerificationResult({
        success: false,
        aiAnalysis: 'ID verification failed. Please try again.',
         fraudScore: fraudScore,
      });
      toast.error('Booking failed', {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto md:max-w-5xl px-4 py-12">
        {/* Progress */}
        {/* Progress Steps */}
        <nav className="mb-10">
          <ol className="mx-auto flex md:max-w-3xl items-center justify-between">
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
                          'border-green-500 bg-green-500 text-white',
                        isActive &&
                          'bg-primary border-primary text-primary-foreground shadow-md',
                        !isCompleted &&
                          !isActive &&
                          'border-muted-foreground text-muted-foreground'
                      )}
                    >
                      {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
                    </div>

                    <span
                      className={cn(
                        'hidden text-sm font-medium md:block',
                        isActive
                          ? 'text-primary'
                          : isCompleted
                            ? 'text-green-600'
                            : 'text-muted-foreground'
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
                          isCompleted ? 'bg-green-500' : 'bg-border'
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
        <div className="mb-12">
          {/* Step 0 – Dates */}
          {currentStep === 0 && (
            <div className="hotel-card mx-auto max-w-md">
              <h2 className="text-foreground mb-6 text-center text-xl font-semibold">
                Select Your Dates
              </h2>
              <CalendarComponent
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
                disabled={(date) => date < new Date()}
                className="pointer-events-auto mx-auto ml-[2rem] md:ml-[5rem]"
              />
              {dateRange?.from && dateRange?.to && (
                <div className="bg-secondary mt-6 rounded-lg p-4 text-center">
                  <p className="text-muted-foreground text-sm">Your stay</p>
                  <p className="text-foreground font-semibold">
                    {dateRange.from.toLocaleDateString()} —{' '}
                    {dateRange.to.toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 1 – Details */}
          {currentStep === 2 && (
            <div className="mx-auto max-w-md space-y-8">
              <h2 className="text-center text-3xl font-bold">Your Details</h2>
              <div className="space-y-6">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative mt-2">
                  <User className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                  <Input
                    id="name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="John Doe"
                    className="h-12 pl-11"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <Label htmlFor="name">Phone Number</Label>
                <div className="relative mt-2">
                  <Phone className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                  <Input
                    id="name"
                    type="tel"
                    pattern="[0-9]{10}"
                    placeholder="0800000000"
                    className="h-12 pl-11"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <Label htmlFor="address">Address</Label>
                <div className="relative mt-2">
                  <MapPin className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                  <Input
                    id="address"
                    placeholder="24 Baker Street"
                    className="h-12 pl-11"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <div className="relative mt-2">
                  <User className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                  <select
                    id="gender"
                    className="border-input bg-background h-12 w-full rounded-md border px-3 py-2 pl-11 text-sm"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-2">
                  <Mail className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                  <Input
                    id="email"
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="h-12 pl-11"
                  />
                </div>
                {guestEmail && !isValidEmail(guestEmail) && (
                  <p className="text-destructive text-sm">
                    Please enter a valid email address
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2 – Room */}
          {currentStep === 1 && (
            <div>
              <h2 className="mb-10 text-center text-3xl font-bold">
                Choose Your Room
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {availableRooms.map((room: any) => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={cn(
                      'cursor-pointer overflow-hidden rounded-xl transition-all',
                      selectedRoom === room.id &&
                        'ring-primary ring-4 ring-offset-4'
                    )}
                  >
                    <RoomCard room={room} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 – ID Upload */}
          {currentStep === 3 && (
            <div className="mx-auto max-w-lg">
              <h2 className="mb-4 text-center text-3xl font-bold">
                Verify Your Identity
              </h2>
              <p className="text-muted-foreground mb-10 text-center">
                Upload a government-issued ID for security
              </p>

              {uploadedFile ? (
                <div className="space-y-8">
                  {/* Uploaded file preview */}
                  <div className="bg-secondary flex items-center justify-between rounded-xl p-5">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 rounded-lg p-3">
                        <Upload className="text-primary h-7 w-7" />
                      </div>
                      <div>
                        <p className="font-medium">{uploadedFile.name}</p>
                        <p className="text-muted-foreground text-sm">
                          {(uploadedFile.size / 1024).toFixed(0)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeFile}
                      className="text-destructive hover:bg-destructive/10 rounded p-2"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Verification result – only after submit */}
                  {verificationResult && (
                    <div
                      className={cn(
                        'rounded-xl p-6 text-center',
                        verificationResult.success
                          ? 'border-2 border-green-300 bg-green-50'
                          : 'border-2 border-red-300 bg-red-50'
                      )}
                    >
                      {verificationResult.success ? (
                        <>
                          <Check className="mx-auto mb-4 h-14 w-14 text-green-600" />
                          <p className="text-2xl font-bold text-green-700">
                            ID Verified!
                          </p>
                          <p className="mt-2 text-green-600">
                            {verificationResult.aiAnalysis} <br />
                            Please proceed to your mail for check-in.

                          </p>
                        </>
                      ) : (
                        <>
                          <X className="mx-auto mb-4 h-14 w-14 text-red-600" />
                          <p className="text-2xl font-bold text-red-700">
                            Verification Failed
                          </p>
                          <p className="mt-2 text-red-600">
                            {verificationResult.aiAnalysis}
                            {verificationResult.fraudScore}
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* Upload zone */
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  className={cn(
                    'rounded-xl border-2 border-dashed p-16 text-center transition-colors',
                    isDragging ? 'border-primary bg-primary/5' : 'border-border'
                  )}
                >
                  <Lock className="text-muted-foreground mx-auto mb-6 h-16 w-16" />
                  <p className="mb-2 text-xl font-medium">Drop your ID here</p>
                  <p className="text-muted-foreground mb-6">
                    or click to browse
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
                    className="hotel-btn-secondary inline-flex cursor-pointer items-center"
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    Choose File
                  </label>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={cn(
              'hotel-btn-ghost flex items-center',
              currentStep === 0 && 'invisible'
            )}
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Back
          </button>

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="hotel-btn-primary flex items-center disabled:opacity-50"
            >
              Continue <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          ) : (
            uploadStatus !== 'success' && (
              <button
                onClick={handleCompleteBooking}
                disabled={!uploadedFile || uploadStatus === 'uploading'}
                className="hotel-btn-primary flex min-w-[200px] items-center justify-center gap-3"
              >
                {uploadStatus === 'uploading' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Complete Booking'
                )}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
export default BookingWizardPage;
