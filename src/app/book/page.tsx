'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Check,
  Upload,
  Lock,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import RoomCard from '@/components/RoomCard';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { MOCK_ROOMS, MOCK_BOOKING_RESPONSE } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { DateRange } from 'react-day-picker';

const steps = [
  { id: 1, name: 'Select Dates', icon: Calendar },
  { id: 2, name: 'Choose Room', icon: Calendar },
  { id: 3, name: 'Verify ID', icon: Lock },
];

const BookingWizardPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<
    typeof MOCK_BOOKING_RESPONSE | null
  >(null);
  const [isDragging, setIsDragging] = useState(false);

  const availableRooms = MOCK_ROOMS.filter((room) => room.status === 'CLEAN');

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return dateRange?.from && dateRange?.to;
      case 2:
        return selectedRoom !== null;
      case 3:
        return verificationResult?.success;
      default:
        return false;
    }
  };

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (
      file &&
      (file.type.startsWith('image/') || file.type === 'application/pdf')
    ) {
      setUploadedFile(file);
      handleVerification(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      handleVerification(file);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleVerification = async (_file: File) => {
    setIsVerifying(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setVerificationResult(MOCK_BOOKING_RESPONSE);
    setIsVerifying(false);
  };

  const handleCompleteBooking = async () => {
    toast.success('Booking Confirmed!', {
      description: `Your reservation for Room ${availableRooms.find((r) => r.id === selectedRoom)?.number} has been confirmed.`,
    });
    router.push(`/guest/stay/${MOCK_BOOKING_RESPONSE.bookingId}`);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Progress Steps */}
        <nav aria-label="Progress" className="mb-8 lg:mb-12">
          <ol className="flex items-center justify-center">
            {steps.map((step, index) => (
              <li key={step.id} className="flex items-center">
                <div
                  className={cn(
                    'flex items-center gap-3 rounded-full px-4 py-2 transition-colors',
                    currentStep === step.id &&
                      'bg-primary text-primary-foreground',
                    currentStep > step.id && 'bg-success/10 text-success',
                    currentStep < step.id && 'text-muted-foreground'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium',
                      currentStep === step.id &&
                        'border-primary-foreground bg-primary-foreground/20',
                      currentStep > step.id &&
                        'border-success bg-success text-success-foreground',
                      currentStep < step.id && 'border-current'
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </span>
                  <span className="hidden text-sm font-medium sm:block">
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'mx-2 h-0.5 w-8 sm:w-16',
                      currentStep > step.id ? 'bg-success' : 'bg-border'
                    )}
                  />
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Step Content */}
        <div className="animate-fade-in">
          {/* Step 1: Date Selection */}
          {currentStep === 1 && (
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
                className="border-border pointer-events-auto mx-auto rounded-lg border"
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

          {/* Step 2: Room Selection */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-foreground mb-6 text-center text-xl font-semibold">
                Choose Your Room
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {availableRooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={cn(
                      'cursor-pointer transition-all duration-200',
                      selectedRoom === room.id &&
                        'ring-primary rounded-lg ring-2 ring-offset-2'
                    )}
                  >
                    <RoomCard room={room} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: ID Verification */}
          {currentStep === 3 && (
            <div className="hotel-card mx-auto max-w-md">
              <h2 className="text-foreground mb-2 text-center text-xl font-semibold">
                Secure ID Verification
              </h2>
              <p className="text-muted-foreground mb-6 text-center text-sm">
                Upload your government-issued ID for secure verification
              </p>

              {!verificationResult && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  className={cn(
                    'rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200',
                    isDragging
                      ? 'border-primary bg-primary/5'
                      : 'border-border',
                    isVerifying && 'pointer-events-none opacity-60'
                  )}
                >
                  {isVerifying ? (
                    <div className="space-y-4">
                      <Loader2 className="text-primary mx-auto h-12 w-12 animate-spin" />
                      <p className="text-muted-foreground text-sm">
                        Verifying your ID...
                      </p>
                    </div>
                  ) : (
                    <>
                      <Lock className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                      <p className="text-foreground mb-2 font-medium">
                        Drag & drop your ID here
                      </p>
                      <p className="text-muted-foreground mb-4 text-sm">
                        or click to browse files
                      </p>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="id-upload"
                      />
                      <label
                        htmlFor="id-upload"
                        className="hotel-btn-secondary inline-flex cursor-pointer"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Select File
                      </label>
                    </>
                  )}
                </div>
              )}

              {verificationResult && (
                <div className="animate-scale-in space-y-4">
                  <div className="bg-success/10 flex items-center justify-center gap-3 rounded-xl p-4">
                    <div className="bg-success flex h-10 w-10 items-center justify-center rounded-full">
                      <Check className="text-success-foreground h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-foreground font-semibold">
                        ID Verified
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {verificationResult.extractedName}
                      </p>
                    </div>
                  </div>

                  <div className="bg-secondary rounded-xl p-4">
                    <p className="text-muted-foreground mb-2 text-xs tracking-wide uppercase">
                      AI Analysis
                    </p>
                    <p className="text-foreground text-sm">
                      {verificationResult.aiAnalysis}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Fraud Score</span>
                    <span className="text-success font-medium">
                      {verificationResult.fraudScore}/100 (Low Risk)
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={cn('hotel-btn-ghost', currentStep === 1 && 'invisible')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </button>

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="hotel-btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleCompleteBooking}
              disabled={!canProceed()}
              className="hotel-btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Complete Booking
              <Check className="ml-2 h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingWizardPage;
