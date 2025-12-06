// 'use client';

// import { useState, useCallback } from 'react';
// import axios from 'axios';
// import {
//   Calendar,
//   Check,
//   Upload,
//   Lock,
//   ArrowLeft,
//   ArrowRight,
//   Loader2,
//   User,
//   Mail,
//   X,
//   MapPin,
//   Phone,
// } from 'lucide-react';
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import RoomCard from '@/components/RoomCard';
// import { Calendar as CalendarComponent } from '@/components/ui/calendar';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';
// import { DateRange } from 'react-day-picker';
// import { useGetRoomsQuery } from '@/store/services/admin-dashboard';

// type VerificationResult = {
//   success: boolean;
//   extractedName?: string;
//   fraudScore?: number;
//   aiAnalysis?: string;
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // Component
// // ─────────────────────────────────────────────────────────────────────────────
// const steps = [
//   { id: 0, name: 'Select Dates', icon: Calendar },
//   { id: 1, name: 'Choose Room', icon: Calendar },
//   { id: 2, name: 'Your Details', icon: User },
//   { id: 3, name: 'Verify ID', icon: Lock },
// ] as const;

// const BOOKING_API_URL = 'https://api-staging.medicate.health/api/v1/bookings';

// const BookingWizardPage = () => {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
//   const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);
//   const [guestName, setGuestName] = useState('');
//   const [guestEmail, setGuestEmail] = useState('');
//   const [isDragging, setIsDragging] = useState(false);

//   const [verificationResult, setVerificationResult] =
//     useState<VerificationResult | null>(null);

//   const [uploadStatus, setUploadStatus] = useState<
//     'idle' | 'uploading' | 'success' | 'error'
//   >('idle');

//   const { data } = useGetRoomsQuery();
//   const availableRooms = data || [];

//   const isValidEmail = (email: string): boolean => {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   };

//   const canProceed = (): boolean => {
//     switch (currentStep) {
//       case 0:
//         return !!dateRange?.from && !!dateRange?.to;
//       case 1:
//         return selectedRoom !== null;
//       case 2:
//         return guestName.trim() !== '' && isValidEmail(guestEmail);
//       case 3:
//         return uploadedFile !== null;
//       default:
//         return false;
//     }
//   };

//   const handleNext = () => currentStep < 3 && setCurrentStep((s) => s + 1);
//   const handleBack = () => currentStep > 0 && setCurrentStep((s) => s - 1);

//   const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(false);

//     const file = e.dataTransfer.files[0];
//     if (
//       file &&
//       (file.type.startsWith('image/') || file.type === 'application/pdf')
//     ) {
//       setUploadedFile(file);
//       setVerificationResult(null);
//     } else {
//       toast.error('Please upload an image or PDF.');
//     }
//   }, []);

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (
//       file &&
//       (file.type.startsWith('image/') || file.type === 'application/pdf')
//     ) {
//       setUploadedFile(file);
//       setVerificationResult(null);
//     } else if (file) {
//       toast.error('Only images and PDFs are allowed.');
//     }
//   };

//   const removeFile = () => {
//     setUploadedFile(null);
//     setVerificationResult(null);
//   };

//   const handleCompleteBooking = async () => {
//     if (!dateRange?.from || !dateRange?.to || !selectedRoom || !uploadedFile) {
//       toast.error('Please complete all steps.');
//       return;
//     }

//     setUploadStatus('uploading');
//     setVerificationResult(null);

//     const formData = new FormData();
//     formData.append('guestName', guestName);
//     formData.append('guestEmail', guestEmail);
//     formData.append('roomId', selectedRoom);
//     formData.append('checkInDate', dateRange.from.toISOString());
//     formData.append('checkOutDate', dateRange.to.toISOString());
//     formData.append('file', uploadedFile);

//     try {
//       const response = await axios.post(BOOKING_API_URL, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       const { success, aiReport, message } = response.data;

//       if (success) {
//         const fraudScore = aiReport?.fraud?.fraudScore;
//         let successMessage = message || 'Booking Confirmed!';

//         if (fraudScore < 60) {
//           successMessage += ` (Fraud Score: ${fraudScore})`;
//         }

//         setVerificationResult({
//           success: true,
//           extractedName: guestName,
//           fraudScore: fraudScore,
//           aiAnalysis:
//             'ID photo matches guest information. No tampering detected. ',
//         });
//         setUploadStatus('success');
//         toast.success(successMessage);
//       } else {
//         throw new Error(message || 'Booking failed');
//       }
//     } catch (err: any) {
//       const fraudScore = err.response?.data?.aiReport?.fraud?.fraudScore;
//       let errorMessage =
//         err.response?.data?.message || err.message || 'Unknown error';

//       if (fraudScore) {
//         errorMessage += ` (Fraud Score: ${fraudScore})`;
//       }

//       setUploadStatus('error');
//       setVerificationResult({
//         success: false,
//         aiAnalysis: 'ID verification failed. Please try again.',
//          fraudScore: fraudScore,
//       });
//       toast.error('Booking failed', {
//         description: errorMessage,
//       });
//     }
//   };

//   return (
//     <div className="bg-background min-h-screen">
//       <div className="mx-auto md:max-w-5xl px-4 py-12">
//         {/* Progress */}
//         {/* Progress Steps */}
//         <nav className="mb-10">
//           <ol className="mx-auto flex md:max-w-3xl items-center justify-between">
//             {steps.map((step, idx) => {
//               const isActive = currentStep === idx;
//               const isCompleted = currentStep > idx;

//               return (
//                 <li key={idx} className="flex flex-1 items-center">
//                   <div className="flex items-center gap-3">
//                     <div
//                       className={cn(
//                         'flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-all',
//                         isCompleted &&
//                           'border-green-500 bg-green-500 text-white',
//                         isActive &&
//                           'bg-primary border-primary text-primary-foreground shadow-md',
//                         !isCompleted &&
//                           !isActive &&
//                           'border-muted-foreground text-muted-foreground'
//                       )}
//                     >
//                       {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
//                     </div>

//                     <span
//                       className={cn(
//                         'hidden text-sm font-medium md:block',
//                         isActive
//                           ? 'text-primary'
//                           : isCompleted
//                             ? 'text-green-600'
//                             : 'text-muted-foreground'
//                       )}
//                     >
//                       {step.name}
//                     </span>
//                   </div>

//                   {idx < steps.length - 1 && (
//                     <div className="mx-3 flex-1">
//                       <div
//                         className={cn(
//                           'h-[2px] w-full rounded-full',
//                           isCompleted ? 'bg-green-500' : 'bg-border'
//                         )}
//                       />
//                     </div>
//                   )}
//                 </li>
//               );
//             })}
//           </ol>
//         </nav>

//         {/* Step Content */}
//         <div className="mb-12">
//           {/* Step 0 – Dates */}
//           {currentStep === 0 && (
//             <div className="hotel-card mx-auto max-w-md">
//               <h2 className="text-foreground mb-6 text-center text-xl font-semibold">
//                 Select Your Dates
//               </h2>
//               <CalendarComponent
//                 mode="range"
//                 selected={dateRange}
//                 onSelect={setDateRange}
//                 numberOfMonths={1}
//                 disabled={(date) => date < new Date()}
//                 className="pointer-events-auto mx-auto ml-[2rem] md:ml-[5rem]"
//               />
//               {dateRange?.from && dateRange?.to && (
//                 <div className="bg-secondary mt-6 rounded-lg p-4 text-center">
//                   <p className="text-muted-foreground text-sm">Your stay</p>
//                   <p className="text-foreground font-semibold">
//                     {dateRange.from.toLocaleDateString()} —{' '}
//                     {dateRange.to.toLocaleDateString()}
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Step 1 – Details */}
//           {currentStep === 2 && (
//             <div className="mx-auto max-w-md space-y-8">
//               <h2 className="text-center text-3xl font-bold">Your Details</h2>
//               <div className="space-y-6">
//                 <Label htmlFor="name">Full Name</Label>
//                 <div className="relative mt-2">
//                   <User className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
//                   <Input
//                     id="name"
//                     value={guestName}
//                     onChange={(e) => setGuestName(e.target.value)}
//                     placeholder="John Doe"
//                     className="h-12 pl-11"
//                   />
//                 </div>
//               </div>
//               <div className="space-y-6">
//                 <Label htmlFor="name">Phone Number</Label>
//                 <div className="relative mt-2">
//                   <Phone className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
//                   <Input
//                     id="name"
//                     type="tel"
//                     pattern="[0-9]{10}"
//                     placeholder="0800000000"
//                     className="h-12 pl-11"
//                   />
//                 </div>
//               </div>
//               <div className="space-y-6">
//                 <Label htmlFor="address">Address</Label>
//                 <div className="relative mt-2">
//                   <MapPin className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
//                   <Input
//                     id="address"
//                     placeholder="24 Baker Street"
//                     className="h-12 pl-11"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <Label htmlFor="gender">Gender</Label>
//                 <div className="relative mt-2">
//                   <User className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
//                   <select
//                     id="gender"
//                     className="border-input bg-background h-12 w-full rounded-md border px-3 py-2 pl-11 text-sm"
//                   >
//                     <option value="">Select gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <div className="relative mt-2">
//                   <Mail className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
//                   <Input
//                     id="email"
//                     type="email"
//                     value={guestEmail}
//                     onChange={(e) => setGuestEmail(e.target.value)}
//                     placeholder="john@example.com"
//                     className="h-12 pl-11"
//                   />
//                 </div>
//                 {guestEmail && !isValidEmail(guestEmail) && (
//                   <p className="text-destructive text-sm">
//                     Please enter a valid email address
//                   </p>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Step 2 – Room */}
//           {currentStep === 1 && (
//             <div>
//               <h2 className="mb-10 text-center text-3xl font-bold">
//                 Choose Your Room
//               </h2>
//               <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
//                 {availableRooms.map((room: any) => (
//                   <div
//                     key={room.id}
//                     onClick={() => setSelectedRoom(room.id)}
//                     className={cn(
//                       'cursor-pointer overflow-hidden rounded-xl transition-all',
//                       selectedRoom === room.id &&
//                         'ring-primary ring-4 ring-offset-4'
//                     )}
//                   >
//                     <RoomCard room={room} />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Step 3 – ID Upload */}
//           {currentStep === 3 && (
//             <div className="mx-auto max-w-lg">
//               <h2 className="mb-4 text-center text-3xl font-bold">
//                 Verify Your Identity
//               </h2>
//               <p className="text-muted-foreground mb-10 text-center">
//                 Upload a government-issued ID for security
//               </p>

//               {uploadedFile ? (
//                 <div className="space-y-8">
//                   {/* Uploaded file preview */}
//                   <div className="bg-secondary flex items-center justify-between rounded-xl p-5">
//                     <div className="flex items-center gap-4">
//                       <div className="bg-primary/10 rounded-lg p-3">
//                         <Upload className="text-primary h-7 w-7" />
//                       </div>
//                       <div>
//                         <p className="font-medium">{uploadedFile.name}</p>
//                         <p className="text-muted-foreground text-sm">
//                           {(uploadedFile.size / 1024).toFixed(0)} KB
//                         </p>
//                       </div>
//                     </div>
//                     <button
//                       onClick={removeFile}
//                       className="text-destructive hover:bg-destructive/10 rounded p-2"
//                     >
//                       <X className="h-5 w-5" />
//                     </button>
//                   </div>

//                   {/* Verification result – only after submit */}
//                   {verificationResult && (
//                     <div
//                       className={cn(
//                         'rounded-xl p-6 text-center',
//                         verificationResult.success
//                           ? 'border-2 border-green-300 bg-green-50'
//                           : 'border-2 border-red-300 bg-red-50'
//                       )}
//                     >
//                       {verificationResult.success ? (
//                         <>
//                           <Check className="mx-auto mb-4 h-14 w-14 text-green-600" />
//                           <p className="text-2xl font-bold text-green-700">
//                             ID Verified!
//                           </p>
//                           <p className="mt-2 text-green-600">
//                             {verificationResult.aiAnalysis} <br />
//                             Please proceed to your mail for check-in.

//                           </p>
//                         </>
//                       ) : (
//                         <>
//                           <X className="mx-auto mb-4 h-14 w-14 text-red-600" />
//                           <p className="text-2xl font-bold text-red-700">
//                             Verification Failed
//                           </p>
//                           <p className="mt-2 text-red-600">
//                             {verificationResult.aiAnalysis}
//                             {verificationResult.fraudScore}
//                           </p>
//                         </>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 /* Upload zone */
//                 <div
//                   onDragOver={(e) => {
//                     e.preventDefault();
//                     setIsDragging(true);
//                   }}
//                   onDragLeave={() => setIsDragging(false)}
//                   onDrop={handleFileDrop}
//                   className={cn(
//                     'rounded-xl border-2 border-dashed p-16 text-center transition-colors',
//                     isDragging ? 'border-primary bg-primary/5' : 'border-border'
//                   )}
//                 >
//                   <Lock className="text-muted-foreground mx-auto mb-6 h-16 w-16" />
//                   <p className="mb-2 text-xl font-medium">Drop your ID here</p>
//                   <p className="text-muted-foreground mb-6">
//                     or click to browse
//                   </p>
//                   <input
//                     type="file"
//                     accept="image/*,.pdf"
//                     onChange={handleFileSelect}
//                     id="id-upload"
//                     className="hidden"
//                   />
//                   <label
//                     htmlFor="id-upload"
//                     className="hotel-btn-secondary inline-flex cursor-pointer items-center"
//                   >
//                     <Upload className="mr-2 h-5 w-5" />
//                     Choose File
//                   </label>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Navigation */}
//         <div className="flex items-center justify-between">
//           <button
//             onClick={handleBack}
//             disabled={currentStep === 0}
//             className={cn(
//               'hotel-btn-ghost flex items-center',
//               currentStep === 0 && 'invisible'
//             )}
//           >
//             <ArrowLeft className="mr-2 h-5 w-5" /> Back
//           </button>

//           {currentStep < 3 ? (
//             <button
//               onClick={handleNext}
//               disabled={!canProceed()}
//               className="hotel-btn-primary flex items-center disabled:opacity-50"
//             >
//               Continue <ArrowRight className="ml-2 h-5 w-5" />
//             </button>
//           ) : (
//             uploadStatus !== 'success' && (
//               <button
//                 onClick={handleCompleteBooking}
//                 disabled={!uploadedFile || uploadStatus === 'uploading'}
//                 className="hotel-btn-primary flex min-w-[200px] items-center justify-center gap-3"
//               >
//                 {uploadStatus === 'uploading' ? (
//                   <>
//                     <Loader2 className="h-5 w-5 animate-spin" />
//                     Processing...
//                   </>
//                 ) : (
//                   'Complete Booking'
//                 )}
//               </button>
//             )
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
// export default BookingWizardPage;


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

  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

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
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      setUploadedFile(file);
      setVerificationResult(null);
    } else {
      toast.error('Please upload an image or PDF.');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
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
        title: "Booking Confirmed!",
        message: "Your identity has been verified and your room is secured. We have sent a digital key to your email.",
        fraudScore: fraudScore
      });

    } catch (err: any) {
      setUploadStatus('error');
     
      const responseData = err.response?.data || {};
      const fraudScore = responseData.fraudScore;
      const failureReason = responseData.reason || "Identity verification failed.";

      if (err.response?.status === 403) {
        // SECURITY BLOCK CASE (The one you asked for)
        setVerificationResult({
          success: false,
          title: "Security Verification Failed",
          message: "Our AI security system flagged this booking attempt as high risk.",
          reason: failureReason,
          fraudScore: fraudScore
        });
      } else {
        // GENERIC ERROR CASE
        setVerificationResult({
          success: false,
          title: "Booking Error",
          message: responseData.message || "Something went wrong. Please try again.",
          reason: "System Error"
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className={cn(
          "max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border p-8 text-center animate-in zoom-in-95 duration-300",
          isSuccess ? "border-emerald-100" : "border-red-100"
        )}>
         
          {/* ICON */}
          <div className="flex justify-center mb-6">
            <div className={cn(
              "h-24 w-24 rounded-full flex items-center justify-center shadow-sm",
              isSuccess ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
            )}>
              {isSuccess ? (
                <CheckCircle2 className="h-12 w-12" />
              ) : (
                <ShieldAlert className="h-12 w-12" />
              )}
            </div>
          </div>

          {/* TEXT */}
          <h2 className={cn("text-2xl font-bold mb-2", isSuccess ? "text-slate-900" : "text-red-600")}>
            {verificationResult.title}
          </h2>
         
          <p className="text-slate-600 mb-6 leading-relaxed">
            {verificationResult.message}
          </p>

          {/* FRAUD DETAILS (Only if failed or if you want to show score) */}
          {typeof verificationResult.fraudScore === 'number' && (
            <div className={cn(
              "mb-8 p-4 rounded-xl text-left text-sm border",
              isSuccess ? "bg-emerald-50/50 border-emerald-100" : "bg-red-50/50 border-red-100"
            )}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-700">Security Score</span>
                <span className={cn(
                  "font-bold px-2 py-0.5 rounded text-xs",
                  isSuccess ? "bg-emerald-200 text-emerald-800" : "bg-red-200 text-red-800"
                )}>
                  {isSuccess ? "PASSED" : "FAILED"}
                </span>
              </div>
             
              {/* Score Bar */}
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden mb-3">
                <div
                  className={cn("h-full transition-all duration-1000", isSuccess ? "bg-emerald-500" : "bg-red-500")}
                  style={{ width: `${Math.min(verificationResult.fraudScore || 0, 100)}%` }}
                />
              </div>

              {!isSuccess && verificationResult.reason && (
                <div className="mt-3 pt-3 border-t border-red-200">
                  <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">Risk Factors Detected:</p>
                  <p className="text-slate-600 italic">"{verificationResult.reason}"</p>
                </div>
              )}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex flex-col gap-3">
            {isSuccess ? (
              <Button
                onClick={() => router.push('/')}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 rounded-xl text-base"
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="w-full border-slate-200 hover:bg-slate-50 h-12 rounded-xl text-base"
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
      <div className="mx-auto md:max-w-5xl px-4 py-12">
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
                        isCompleted && 'border-emerald-500 bg-emerald-500 text-white',
                        isActive && 'bg-slate-900 border-slate-900 text-white shadow-md',
                        !isCompleted && !isActive && 'border-slate-200 text-slate-400'
                      )}
                    >
                      {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
                    </div>
                    <span className={cn(
                      'hidden text-sm font-medium md:block',
                      isActive ? 'text-slate-900' : isCompleted ? 'text-emerald-600' : 'text-slate-400'
                    )}>
                      {step.name}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="mx-3 flex-1">
                      <div className={cn('h-[2px] w-full rounded-full', isCompleted ? 'bg-emerald-500' : 'bg-slate-100')} />
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
            <div className="hotel-card mx-auto max-w-md animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-foreground mb-6 text-center text-xl font-semibold">Select Your Dates</h2>
              <div className="flex justify-center">
                <CalendarComponent
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={1}
                  disabled={(date) => date < new Date()}
                  className="rounded-xl border shadow-sm p-4"
                />
              </div>
            </div>
          )}

          {/* Step 1 – Room */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h2 className="mb-8 text-center text-3xl font-bold text-slate-900">Choose Your Sanctuary</h2>
             
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {paginatedRooms.map((room: any) => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={cn(
                      'group cursor-pointer overflow-hidden rounded-2xl border bg-white p-3 transition-all duration-300',
                      'hover:-translate-y-1 hover:shadow-xl hover:border-slate-300',
                      selectedRoom === room.id
                        ? 'border-slate-900 ring-2 ring-slate-900 ring-offset-2 shadow-md'
                        : 'border-slate-100 shadow-sm'
                    )}
                  >
                    <div className="overflow-hidden rounded-xl">
                      <RoomCard room={room} />
                    </div>
                    {selectedRoom === room.id && (
                      <div className="mt-3 flex justify-center">
                         <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
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
                    onClick={() => setRoomPage(p => Math.max(1, p - 1))}
                    disabled={roomPage === 1}
                    className="rounded-full h-12 w-12 border-slate-200 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                    Page <span className="text-slate-900 font-bold">{roomPage}</span> of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setRoomPage(p => Math.min(totalPages, p + 1))}
                    disabled={roomPage === totalPages}
                    className="rounded-full h-12 w-12 border-slate-200 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 2 – Details */}
          {currentStep === 2 && (
            <div className="mx-auto max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center mb-8">
                 <h2 className="text-3xl font-bold text-slate-900">Guest Information</h2>
                 <p className="text-slate-500 mt-2">Please tell us who will be staying</p>
              </div>
             
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="text-slate-400 absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                    <Input id="name" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="John Doe" className="h-12 pl-10" />
                  </div>
                </div>
               
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="text-slate-400 absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                    <Input id="email" type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="john@example.com" className="h-12 pl-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="text-slate-400 absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                    <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="h-12 pl-10" />
                  </div>
                </div>
               
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="text-slate-400 absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                    <Input id="address" placeholder="123 Main St, City" className="h-12 pl-10" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 – ID Upload */}
          {currentStep === 3 && (
            <div className="mx-auto max-w-lg animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center mb-8">
                 <h2 className="text-3xl font-bold text-slate-900">Identity Verification</h2>
                 <p className="text-slate-500 mt-2">Required for our AI Security Check</p>
              </div>

              {!uploadedFile ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  className={cn(
                    'rounded-3xl border-2 border-dashed p-12 text-center transition-all duration-300',
                    isDragging ? 'border-emerald-500 bg-emerald-50 scale-105' : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50'
                  )}
                >
                  <div className="bg-emerald-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                     <Lock className="text-emerald-600 h-10 w-10" />
                  </div>
                  <p className="mb-2 text-xl font-semibold text-slate-900">Upload Government ID</p>
                  <p className="text-slate-500 mb-8 text-sm">Drag and drop or click to browse</p>
                 
                  <input type="file" accept="image/*,.pdf" onChange={handleFileSelect} id="id-upload" className="hidden" />
                  <label htmlFor="id-upload" className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-slate-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800">
                    <Upload className="mr-2 h-4 w-4" /> Select Document
                  </label>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                   <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                         <div className="bg-emerald-100 p-3 rounded-xl">
                            <Check className="h-6 w-6 text-emerald-600" />
                         </div>
                         <div>
                            <p className="font-semibold text-slate-900">{uploadedFile.name}</p>
                            <p className="text-xs text-slate-500">{(uploadedFile.size / 1024).toFixed(1)} KB • Ready to verify</p>
                         </div>
                      </div>
                      <button onClick={removeFile} className="p-2 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-500 transition-colors">
                         <X className="h-5 w-5" />
                      </button>
                   </div>
                  
                   <div className="bg-slate-50 rounded-xl p-4 flex gap-3 items-start">
                      <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-600">
                        Our AI will analyze this document to verify your identity. Please ensure the name matches your booking details.
                      </p>
                   </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 md:static md:bg-transparent md:border-0 md:p-0">
           <div className="mx-auto flex max-w-5xl items-center justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className={cn('flex items-center px-6 py-3 rounded-xl font-medium transition-colors', currentStep === 0 ? 'invisible' : 'text-slate-600 hover:bg-slate-100')}
              >
                <ArrowLeft className="mr-2 h-5 w-5" /> Back
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-slate-900 text-white px-8 py-3 rounded-xl font-medium flex items-center transition-all hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-200"
                >
                  Continue <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={handleCompleteBooking}
                  disabled={!uploadedFile || uploadStatus === 'uploading'}
                  className={cn(
                    "flex min-w-[200px] items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg",
                    uploadStatus === 'uploading' ? "bg-slate-700 cursor-wait" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                  )}
                >
                  {uploadStatus === 'uploading' ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Verifying...
                    </>
                  ) : (
                    <>Complete Booking <Check className="ml-2 h-5 w-5" /></>
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