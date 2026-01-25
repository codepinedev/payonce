"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ThumbsUpIcon,
  ThumbsDownIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";

interface ToolFeedbackProps {
  toolId: string;
}

export function ToolFeedback({ toolId }: ToolFeedbackProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [selectedUseful, setSelectedUseful] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");

  async function submitFeedback(useful: boolean, feedbackComment?: string) {
    setLoading(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool_id: toolId,
          useful,
          comment: feedbackComment || undefined,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch {
      // Silently fail - feedback is non-critical
    } finally {
      setLoading(false);
    }
  }

  function handleVote(useful: boolean) {
    setSelectedUseful(useful);
    setShowComment(true);
  }

  function handleSubmitWithComment() {
    if (selectedUseful !== null) {
      submitFeedback(selectedUseful, comment);
    }
  }

  function handleSkipComment() {
    if (selectedUseful !== null) {
      submitFeedback(selectedUseful);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            size={16}
            className="text-green-500"
          />
          Thanks for your feedback!
        </div>
      </div>
    );
  }

  if (showComment) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm font-medium mb-3">
          {selectedUseful
            ? "What did you find helpful?"
            : "How can we improve?"}
        </p>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Optional feedback..."
          className="mb-3"
        />
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleSubmitWithComment}
            disabled={loading}
            className="flex-1"
          >
            {loading ? "Sending..." : "Submit"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSkipComment}
            disabled={loading}
          >
            Skip
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm font-medium text-center mb-3">
        Was this tool listing useful?
      </p>
      <div className="flex gap-2 justify-center">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleVote(true)}
          disabled={loading}
          className="flex items-center gap-1.5"
        >
          <HugeiconsIcon icon={ThumbsUpIcon} size={14} />
          Yes
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleVote(false)}
          disabled={loading}
          className="flex items-center gap-1.5"
        >
          <HugeiconsIcon icon={ThumbsDownIcon} size={14} />
          No
        </Button>
      </div>
    </div>
  );
}
