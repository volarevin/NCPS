import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, User as UserIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface TopBarProps {
  onProfileClick?: () => void;
}

export default function TopBar({ onProfileClick }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  
  // Get user from session storage
  const getUser = () => {
    try {
      const userStr = sessionStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  };

  const user = getUser();
  const firstName = user?.first_name || user?.firstName || "User";
  const profilePic = user?.profile_picture || "";

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      // Default fallback if no handler provided, though dashboards should provide one
      // to switch tabs or navigate
      console.log("Profile clicked");
    }
  };

  return (
    <header className="w-full h-16 px-4 md:px-6 border-b border-border bg-background flex items-center justify-between transition-colors duration-200">
      <div className="flex items-center gap-4">
        {/* Left side content (breadcrumbs or title could go here) */}
        <h2 className="text-lg font-semibold text-foreground hidden md:block">
          {/* Optional: Dashboard Title or Breadcrumb */}
        </h2>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-medium text-muted-foreground">
            Welcome back, {firstName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 transition-all" />
            ) : (
              <Moon className="h-5 w-5 transition-all" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border border-gray-200 dark:border-gray-700">
                <Avatar className="h-full w-full">
                  <AvatarImage src={profilePic} alt={firstName} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
                    {firstName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 dark:bg-gray-900 dark:border-gray-800">
              <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer dark:text-gray-200 dark:focus:bg-gray-800">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer md:hidden dark:text-gray-200 dark:focus:bg-gray-800">
                {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
