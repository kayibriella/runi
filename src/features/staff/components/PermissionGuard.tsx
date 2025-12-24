import { ReactNode } from "react";
import { useStaffPermissions, StaffPermissions } from "../hooks/useStaffPermissions";

interface PermissionGuardProps {
    requiredPermission: keyof StaffPermissions;
    fallback?: ReactNode;
    children: ReactNode;
}

export function PermissionGuard({
    requiredPermission,
    fallback = null,
    children
}: PermissionGuardProps) {
    const { hasPermission, isLoading } = useStaffPermissions();

    if (isLoading) {
        // Optionally return a loading spinner or null while checking
        return null;
    }

    if (!hasPermission(requiredPermission)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
