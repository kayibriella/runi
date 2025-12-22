"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useCurrentUser } from "../../lib/utils";

interface SignOutButtonProps {
  user?: {
    name?: string;
    fullName?: string;
    staff_full_name?: string;
    email?: string;
    businessName?: string;
  } | null;
  onLogout?: () => void;
}

export function SignOutButton({ user: propUser, onLogout }: SignOutButtonProps) {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const currentUser = useCurrentUser();

  // Use propUser if provided, otherwise use currentUser from hook
  const user = propUser !== undefined ? propUser : currentUser;

  // For staff, we might not be "authenticated" via Convex Auth, so we check if we have a user from props
  if (!isAuthenticated && !propUser) {
    return null;
  }

  // Get user's full name or fallback to email
  const fullName =
    (user as any)?.staff_full_name ||
    (user as any)?.fullName ||
    (user as any)?.name ||
    (user as any)?.businessName ||
    (user as any)?.email ||
    "User";

  // Extract initials from the full name
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .filter(Boolean)
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const initials = getInitials(fullName);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      void signOut();
    }
  };

  return (
    <div className="flex items-center justify-between w-full rounded-lg bg-white dark:bg-dark-card text-secondary dark:text-dark-text border border-gray-200 dark:border-dark-border font-medium shadow-sm px-3 py-2">
      <div className="flex items-center gap-2 max-w-[140px]">
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            {initials}
          </span>
        </div>
        <span className="truncate text-sm" title={fullName}>{fullName}</span>
      </div>
      <button
        className="flex-shrink-0 text-sm hover:bg-gray-100 dark:hover:bg-dark-card/50 rounded px-2 py-1 transition-colors ml-1"
        onClick={handleLogout}
      >
        Sign out
      </button>
    </div>
  );
}