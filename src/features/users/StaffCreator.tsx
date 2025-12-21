import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { X, Upload, CheckCircle, Loader2, User, Mail, Phone, Lock, FileText, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { toast } from "sonner";

interface StaffCreatorProps {
    isOpen: boolean;
    onClose: () => void;
}

export function StaffCreator({ isOpen, onClose }: StaffCreatorProps) {
    const generateUploadUrl = useMutation(api.staff.generateUploadUrl);
    const createStaff = useMutation(api.staff.create);
    const getOrCreateFolder = useMutation(api.folders.getOrCreateByName);
    const createFileRecord = useMutation(api.files.create);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const [idFront, setIdFront] = useState<File | null>(null);
    const [idBack, setIdBack] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const idFrontInputRef = useRef<HTMLInputElement>(null);
    const idBackInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error("Please select an image file");
                return;
            }
            if (type === 'front') setIdFront(file);
            else setIdBack(file);
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.fullName) newErrors.fullName = "Full name is required";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
        if (!formData.phone) newErrors.phone = "Phone number is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        if (!idFront) newErrors.idFront = "ID Card Front is required";
        if (!idBack) newErrors.idBack = "ID Card Back is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsUploading(true);
        try {
            // 1. Upload ID Front
            const uploadUrlFront = await generateUploadUrl();
            const resultFront = await fetch(uploadUrlFront, {
                method: "POST",
                headers: { "Content-Type": idFront!.type },
                body: idFront,
            });
            const { storageId: storageIdFront } = await resultFront.json();
            const storageUrlFront = `${window.location.origin}/api/storage/${storageIdFront}`; // This is a placeholder, usually handled by a query to get storage URL

            // 2. Upload ID Back
            const uploadUrlBack = await generateUploadUrl();
            const resultBack = await fetch(uploadUrlBack, {
                method: "POST",
                headers: { "Content-Type": idBack!.type },
                body: idBack,
            });
            const { storageId: storageIdBack } = await resultBack.json();

            // 3. Save files to "Staff" folder
            const folderId = await getOrCreateFolder({ folder_name: "Staff" });

            // Create file record for Front ID
            await createFileRecord({
                storageId: storageIdFront,
                fileName: `ID_Front_${formData.fullName.replace(/\s+/g, '_')}_${Date.now()}.jpg`, // normalized name
                fileType: idFront!.type,
                fileSize: idFront!.size,
                folderId: folderId,
            });

            // Create file record for Back ID
            await createFileRecord({
                storageId: storageIdBack,
                fileName: `ID_Back_${formData.fullName.replace(/\s+/g, '_')}_${Date.now()}.jpg`,
                fileType: idBack!.type,
                fileSize: idBack!.size,
                folderId: folderId,
            });

            // 4. Create Staff Record
            await createStaff({
                staff_full_name: formData.fullName,
                email_address: formData.email.trim().toLowerCase(),
                phone_number: formData.phone,
                id_card_front_url: storageIdFront, // Storing storageId is better for Convex
                id_card_back_url: storageIdBack,
                password: formData.password,
            });

            toast.success("Staff member created successfully!");
            onClose();
            resetForm();
        } catch (error: any) {
            toast.error(error.message || "Failed to create staff member");
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setFormData({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
        setIdFront(null);
        setIdBack(null);
        setErrors({});
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-white dark:bg-[#1a1a1a] rounded-[2rem] shadow-2xl border border-white/20 dark:border-white/5 overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white">Create Staff</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-sans mt-0.5">Register team member</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Full Name"
                                        placeholder="John Doe"
                                        icon={<User size={16} />}
                                        value={formData.fullName}
                                        onChange={(e) => handleChange('fullName', e.target.value)}
                                        error={errors.fullName}
                                        disabled={isUploading}
                                        className="h-11"
                                    />
                                    <Input
                                        label="Email Address"
                                        placeholder="john@example.com"
                                        type="email"
                                        icon={<Mail size={16} />}
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        error={errors.email}
                                        disabled={isUploading}
                                        className="h-11"
                                    />
                                    <Input
                                        label="Phone Number"
                                        placeholder="+1234567890"
                                        icon={<Phone size={16} />}
                                        value={formData.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        error={errors.phone}
                                        disabled={isUploading}
                                        className="h-11"
                                    />
                                    <div className="hidden md:block" />

                                    <Input
                                        label="Password"
                                        type="password"
                                        icon={<Lock size={16} />}
                                        value={formData.password}
                                        onChange={(e) => handleChange('password', e.target.value)}
                                        error={errors.password}
                                        disabled={isUploading}
                                        className="h-11"
                                    />
                                    <Input
                                        label="Confirm"
                                        type="password"
                                        icon={<Lock size={16} />}
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                        error={errors.confirmPassword}
                                        disabled={isUploading}
                                        className="h-11"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* ID Front */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400 ml-1 font-display flex items-center gap-1.5">
                                            <ImageIcon size={12} className="text-blue-500" />
                                            ID Front
                                        </label>
                                        <div
                                            onClick={() => idFrontInputRef.current?.click()}
                                            className={`relative border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${idFront ? 'border-emerald-500 bg-emerald-500/5' : 'border-gray-200 dark:border-white/10 hover:border-blue-500/50'
                                                }`}
                                        >
                                            <input type="file" ref={idFrontInputRef} onChange={(e) => handleFileChange(e, 'front')} className="hidden" accept="image/*" />
                                            {idFront ? (
                                                <CheckCircle size={18} className="mx-auto text-emerald-600" />
                                            ) : (
                                                <Upload size={18} className="mx-auto text-gray-400" />
                                            )}
                                        </div>
                                    </div>

                                    {/* ID Back */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400 ml-1 font-display flex items-center gap-1.5">
                                            <ImageIcon size={12} className="text-blue-500" />
                                            ID Back
                                        </label>
                                        <div
                                            onClick={() => idBackInputRef.current?.click()}
                                            className={`relative border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${idBack ? 'border-emerald-500 bg-emerald-500/5' : 'border-gray-200 dark:border-white/10 hover:border-blue-500/50'
                                                }`}
                                        >
                                            <input type="file" ref={idBackInputRef} onChange={(e) => handleFileChange(e, 'back')} className="hidden" accept="image/*" />
                                            {idBack ? (
                                                <CheckCircle size={18} className="mx-auto text-emerald-600" />
                                            ) : (
                                                <Upload size={18} className="mx-auto text-gray-400" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={isUploading}
                                        className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-blue-500/20 group transition-all active:scale-95"
                                    >
                                        {isUploading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 size={20} className="animate-spin" />
                                                <span>Creating...</span>
                                            </div>
                                        ) : (
                                            "Register Staff"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
