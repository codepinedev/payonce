"use client";

import { useState } from "react";
import { AddToolForm } from "@/components/admin/add-tool-form";
import { useRouter } from "next/navigation";

export default function AddToolPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Add New Tool</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manually add a tool with all details and settings
          </p>
        </div>
        <button
          onClick={() => router.push("/admin")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to Submissions
        </button>
      </div>

      {showSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-medium">
            Tool created successfully! It&apos;s now live on the site.
          </p>
        </div>
      )}

      <div className="rounded-lg border border-border p-6 bg-card">
        <AddToolForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
