"use client";

import { useState, useEffect } from "react";
import { Submission } from "@/types/submission";
import { SubmissionsTable } from "@/components/admin/submissions-table";
import { SubmissionEditDialog } from "@/components/admin/submission-edit-dialog";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(
    null
  );

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/admin/submissions");
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to fetch submissions");
        return;
      }

      setSubmissions(data.submissions || []);
    } catch (err) {
      setError("An error occurred while fetching submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to approve submission");
      }

      // Remove from list
      setSubmissions(submissions.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve submission");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reject submission");
      }

      // Remove from list
      setSubmissions(submissions.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject submission");
    }
  };

  const handleEdit = (submission: Submission) => {
    setEditingSubmission(submission);
  };

  const handleSaveEdit = async (
    id: string,
    data: Partial<Submission>
  ) => {
    console.log(id)
    const response = await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", data }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to update submission");
    }

    setSubmissions(
      submissions.map((s) =>
        s.id === id ? { ...s, ...data } : s
      )
    );
  };

  const handleBulkApprove = async (ids: string[]) => {
    try {
      const response = await fetch("/api/admin/submissions/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, action: "approve" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to bulk approve");
      }

      // Remove from list
      setSubmissions(submissions.filter((s) => !ids.includes(s.id!)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to bulk approve");
    }
  };

  const handleBulkReject = async (ids: string[]) => {
    try {
      const response = await fetch("/api/admin/submissions/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, action: "reject" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to bulk reject");
      }

      // Remove from list
      setSubmissions(submissions.filter((s) => !ids.includes(s.id!)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to bulk reject");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading submissions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchSubmissions} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pending Submissions</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {submissions.length} submission{submissions.length !== 1 ? "s" : ""}{" "}
            awaiting review
          </p>
        </div>
        <Button onClick={fetchSubmissions} variant="outline">
          Refresh
        </Button>
      </div>

      <SubmissionsTable
        submissions={submissions}
        onApprove={handleApprove}
        onReject={handleReject}
        onEdit={handleEdit}
        onBulkApprove={handleBulkApprove}
        onBulkReject={handleBulkReject}
      />

      <SubmissionEditDialog
        submission={editingSubmission}
        isOpen={!!editingSubmission}
        onClose={() => setEditingSubmission(null)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
