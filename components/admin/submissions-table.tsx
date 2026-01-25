"use client";

import { useState } from "react";
import { Submission } from "@/types/submission";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SubmissionsTableProps {
  submissions: Submission[];
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onEdit: (submission: Submission) => void;
  onBulkApprove: (ids: string[]) => Promise<void>;
  onBulkReject: (ids: string[]) => Promise<void>;
}

export function SubmissionsTable({
  submissions,
  onApprove,
  onReject,
  onEdit,
  onBulkApprove,
  onBulkReject,
}: SubmissionsTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const handleSelectToggle = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === submissions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(submissions.map((s) => s.id!)));
    }
  };

  const handleApprove = async (id: string) => {
    setLoadingIds(new Set(loadingIds).add(id));
    try {
      await onApprove(id);
    } finally {
      const newLoadingIds = new Set(loadingIds);
      newLoadingIds.delete(id);
      setLoadingIds(newLoadingIds);
    }
  };

  const handleReject = async (id: string) => {
    setLoadingIds(new Set(loadingIds).add(id));
    try {
      await onReject(id);
    } finally {
      const newLoadingIds = new Set(loadingIds);
      newLoadingIds.delete(id);
      setLoadingIds(newLoadingIds);
    }
  };

  const handleBulkApprove = async () => {
    setBulkLoading(true);
    try {
      await onBulkApprove(Array.from(selectedIds));
      setSelectedIds(new Set());
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkReject = async () => {
    setBulkLoading(true);
    try {
      await onBulkReject(Array.from(selectedIds));
      setSelectedIds(new Set());
    } finally {
      setBulkLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No pending submissions</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === submissions.length}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  URL
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Platform
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Submitted
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {submissions.map((submission) => {
                const isLoading = loadingIds.has(submission.id!);
                const isSelected = selectedIds.has(submission.id!);

                return (
                  <tr
                    key={submission.id}
                    className={`hover:bg-muted/30 transition-colors ${
                      isSelected ? "bg-muted/50" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectToggle(submission.id!)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {submission.name}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={submission.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm"
                      >
                        {truncateUrl(submission.url)}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="text-xs">
                        {submission.category}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {submission.platform}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {submission.price === 0
                        ? "Free"
                        : `$${submission.price}`}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(submission.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEdit(submission)}
                          disabled={isLoading}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApprove(submission.id!)}
                          disabled={isLoading}
                        >
                          {isLoading ? "..." : "Approve"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(submission.id!)}
                          disabled={isLoading}
                        >
                          {isLoading ? "..." : "Reject"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card shadow-lg">
          <div className="container mx-auto max-w-7xl px-4 py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {selectedIds.size} submission{selectedIds.size > 1 ? "s" : ""}{" "}
                selected
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIds(new Set())}
                  disabled={bulkLoading}
                >
                  Clear
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleBulkApprove}
                  disabled={bulkLoading}
                >
                  {bulkLoading ? "Approving..." : "Approve All"}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkReject}
                  disabled={bulkLoading}
                >
                  {bulkLoading ? "Rejecting..." : "Reject All"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
