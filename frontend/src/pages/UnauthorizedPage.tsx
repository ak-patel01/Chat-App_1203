import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LockIcon } from "@/components/icons";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] px-4 text-center">
      <div className="bg-destructive/10 p-6 rounded-full mb-6 flex items-center justify-center">
        <LockIcon className="w-16 h-16 text-destructive" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-foreground">
        Access Denied
      </h1>
      <p className="text-lg text-muted-foreground max-w-md mb-8">
        You do not have permission to view this page. If you believe this is an
        error, please contact your administrator.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate(-1)} variant="outline">
          Go Back
        </Button>
        <Button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
