"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Progress, AIBadge } from "@/components/ui";
import { Modal } from "@/components/modal";
import {
  createGoal,
  updateGoal,
  updateGoalProgress,
  deleteGoal,
  type GoalInput
} from "@/app/actions/goals";
import { aiGoalPlan, type GoalPlanResult } from "@/app/actions/ai";
import type { Goal } from "@/lib/types";
import { peso, cn } from "@/lib/utils";
import {
  Target,
  Plus,
  Pencil,
  Check,
  Trash2,
  Loader2,
  Sparkles,
  CalendarClock,
  TrendingUp,
  Flag,
  Trophy,
  ArrowRight,
  X
} from "lucide-react";

/* ── Date helpers ──────────────────────────────────────────────────────────── */

const parseYMD = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
};
const daysUntil = (deadline: string) => {
  const end = parseYMD(deadline);
  end.setHours(23, 59, 59, 999);
  return Math.ceil((end.getTime() - Date.now()) / 86_400_000);
};
const fmtDeadline = (s: string) =>
  parseYMD(s).toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

/* ── Main ──────────────────────────────────────────────────────────────────── */

export function GoalsClient({ goals }: { goals: Goal[] }) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (g: Goal) => {
    setEditing(g);
    setFormOpen(true);
  };

  return (
    <div className="animate-in">
      <PageHeader
        title="Goals"
        subtitle="Track production targets — incentive trips, MDRT, quotas — with an AI game plan"
        icon={Target}
        accent="gold"
        actions={
          <button
            onClick={openNew}
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" /> New goal
          </button>
        }
      />

      {goals.length === 0 ? (
        <EmptyState onNew={openNew} />
      ) : (
        <div className="space-y-5">
          {goals.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              onEdit={() => openEdit(g)}
              onChanged={() => router.refresh()}
            />
          ))}
        </div>
      )}

      {formOpen && (
        <GoalFormModal
          key={editing?.id ?? "new"}
          editing={editing}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-600 ring-1 ring-inset ring-gold-600/20">
        <Flag className="h-7 w-7" />
      </div>
      <div>
        <p className="font-display text-4xl font-medium text-navy-900">
          Set your first goal
        </p>
      </div>
      <button
        onClick={onNew}
        className="mt-1 flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        <Plus className="h-4 w-4" /> Create a goal
      </button>
    </div>
  );
}

/* ── Goal card ─────────────────────────────────────────────────────────────── */

function GoalCard({
  goal,
  onEdit,
  onChanged
}: {
  goal: Goal;
  onEdit: () => void;
  onChanged: () => void;
}) {
  const remaining = Math.max(0, goal.targetApe - goal.currentApe);
  const pct = goal.targetApe
    ? Math.min(100, Math.round((goal.currentApe / goal.targetApe) * 100))
    : 0;
  const achieved = goal.currentApe >= goal.targetApe && goal.targetApe > 0;
  const days = daysUntil(goal.deadline);
  const weeksLeft = Math.max(1, Math.ceil(Math.max(days, 0) / 7));
  const apePerWeek = Math.round(remaining / weeksLeft);

  const overdue = days < 0;
  const dueTone = achieved
    ? "bg-money-500/10 text-money-700 ring-money-500/20"
    : overdue
      ? "bg-risk-500/10 text-risk-600 ring-risk-500/20"
      : days <= 14
        ? "bg-gold-500/10 text-gold-600 ring-gold-500/20"
        : "bg-slate-500/10 text-slate-600 ring-slate-500/20";
  const dueLabel = overdue
    ? `${Math.abs(days)}d past deadline`
    : days === 0
      ? "Due today"
      : `${days} days left`;

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl ring-1 ring-inset",
              achieved
                ? "bg-money-500/10 text-money-600 ring-money-500/20"
                : "bg-gold-500/10 text-gold-600 ring-gold-600/20"
            )}
          >
            {achieved ? (
              <Trophy className="h-5 w-5" />
            ) : (
              <Target className="h-5 w-5" />
            )}
          </div>
          <div>
            <h2 className="font-display text-xl font-medium leading-tight text-navy-900">
              {goal.title}
            </h2>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
              <CalendarClock className="h-3.5 w-3.5" />
              {fmtDeadline(goal.deadline)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
              dueTone
            )}
          >
            {dueLabel}
          </span>
          <button
            onClick={onEdit}
            aria-label="Edit goal"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-6">
        <div className="mb-2 flex items-end justify-between">
          <CurrentApeEditor goal={goal} onSaved={onChanged} />
          <p className="text-right text-sm text-slate-500">
            of{" "}
            <span className="font-semibold text-navy-900">
              {peso(goal.targetApe)}
            </span>{" "}
            target
          </p>
        </div>
        <Progress
          value={pct}
          tone={achieved ? "money" : "gold"}
          className="h-2.5"
        />
        <p className="mt-1.5 text-xs font-medium text-slate-500">
          {pct}% to target
        </p>
      </div>

      {/* Key figures */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Figure
          label={achieved ? "Surplus" : "APE still needed"}
          value={
            achieved ? peso(goal.currentApe - goal.targetApe) : peso(remaining)
          }
          tone={achieved ? "money" : "brand"}
          icon={achieved ? Trophy : Flag}
        />
        <Figure
          label="Pace needed"
          value={achieved ? "—" : `${peso(apePerWeek)}/wk`}
          sub={achieved ? "Goal reached" : `over ~${weeksLeft} weeks`}
          icon={TrendingUp}
        />
        <Figure
          label="Time remaining"
          value={overdue ? "Past due" : `${Math.max(days, 0)} days`}
          icon={CalendarClock}
        />
      </div>

      {goal.note && (
        <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
          {goal.note}
        </p>
      )}

      {/* AI plan */}
      <GoalPlanPanel goal={goal} achieved={achieved} />

      <DeleteRow goal={goal} onDeleted={onChanged} />
    </div>
  );
}

function Figure({
  label,
  value,
  sub,
  tone = "neutral",
  icon: Icon
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "neutral" | "brand" | "money";
  icon: React.ComponentType<{ className?: string }>;
}) {
  const valueTone =
    tone === "brand"
      ? "text-brand-700"
      : tone === "money"
        ? "text-money-700"
        : "text-navy-900";
  return (
    <div className="rounded-xl border border-hairline p-3.5">
      <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <p className={cn("mt-1 font-display text-xl font-medium", valueTone)}>
        {value}
      </p>
      {sub && <p className="text-[11px] text-slate-400">{sub}</p>}
    </div>
  );
}

/* ── Inline current-APE editor (handles double/triple-credit closings) ──────── */

function CurrentApeEditor({
  goal,
  onSaved
}: {
  goal: Goal;
  onSaved: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(goal.currentApe));
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const n = Number(value);
    if (!(n >= 0)) return;
    setSaving(true);
    const res = await updateGoalProgress(goal.id, n);
    setSaving(false);
    if (!("error" in res)) {
      setEditing(false);
      onSaved();
    }
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="flex items-center rounded-lg border border-brand-400 bg-surface px-2.5 py-1 ring-2 ring-brand-500/15">
          <span className="text-lg font-semibold text-slate-400">₱</span>
          <input
            autoFocus
            type="number"
            min={0}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") setEditing(false);
            }}
            className="w-32 bg-transparent text-lg font-semibold text-navy-900 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <button
          onClick={save}
          disabled={saving}
          aria-label="Save current APE"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={() => setEditing(false)}
          aria-label="Cancel"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        setValue(String(goal.currentApe));
        setEditing(true);
      }}
      className="group flex items-center gap-2 rounded-lg text-left"
      title="Click to update credited APE (double/triple credits)"
    >
      <span className="font-display text-2xl font-medium leading-none text-navy-900">
        {peso(goal.currentApe)}
      </span>
      <Pencil className="h-3.5 w-3.5 text-slate-400 transition group-hover:text-brand-600" />
    </button>
  );
}

/* ── AI game plan ──────────────────────────────────────────────────────────── */

function GoalPlanPanel({ goal, achieved }: { goal: Goal; achieved: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<GoalPlanResult | null>(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiGoalPlan({
        title: goal.title,
        targetApe: goal.targetApe,
        currentApe: goal.currentApe,
        deadline: goal.deadline
      });
      setPlan(res);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Couldn't generate a plan. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (achieved && !plan) {
    return (
      <div className="ai-ring mt-5 flex items-center gap-2 rounded-xl bg-money-500/[0.06] px-4 py-3 text-sm font-medium text-money-700">
        <Trophy className="h-4 w-4" /> Goal reached — congratulations! 🎉
      </div>
    );
  }

  return (
    <div className="mt-5">
      {!plan && (
        <button
          onClick={run}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-ai-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-ai-700 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {loading ? "Analyzing your pipeline…" : "Get AI game plan"}
        </button>
      )}

      {error && (
        <p className="mt-3 rounded-lg border border-risk-500/20 bg-risk-500/5 px-3 py-2 text-sm text-risk-700">
          {error}
        </p>
      )}

      {plan && (
        <div className="ai-ring rounded-xl bg-ai-500/[0.04] p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AIBadge>Game Plan</AIBadge>
              <span className="font-display text-base font-medium text-navy-900">
                {plan.verdict}
              </span>
            </div>
            <button
              onClick={run}
              disabled={loading}
              className="flex items-center gap-1 text-xs font-semibold text-ai-700 transition hover:underline disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Sparkles className="h-3 w-3" />
              )}
              Regenerate
            </button>
          </div>

          <p className="text-sm leading-relaxed text-slate-700">
            {plan.assessment}
          </p>

          <div className="mt-3 flex items-start gap-2 rounded-lg bg-surface px-3 py-2.5 text-sm text-navy-900 ring-1 ring-inset ring-hairline">
            <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-ai-600" />
            <span>{plan.activity}</span>
          </div>

          {plan.focus?.length > 0 && (
            <div className="mt-4">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Focus here
              </p>
              <ul className="space-y-1.5">
                {plan.focus.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-slate-700"
                  >
                    <Flag className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {plan.plan?.length > 0 && (
            <div className="mt-4">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Action plan
              </p>
              <ul className="space-y-1.5">
                {plan.plan.map((p, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-slate-700"
                  >
                    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ai-600" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DeleteRow({ goal, onDeleted }: { goal: Goal; onDeleted: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    setBusy(true);
    const res = await deleteGoal(goal.id);
    setBusy(false);
    if (!("error" in res)) onDeleted();
  };

  return (
    <div className="mt-4 flex justify-end border-t border-hairline pt-3">
      {confirming ? (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500">Delete this goal?</span>
          <button
            onClick={remove}
            disabled={busy}
            className="flex items-center gap-1 rounded-lg bg-risk-600 px-3 py-1.5 font-semibold text-white transition hover:bg-risk-700 disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            Delete
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="rounded-lg px-3 py-1.5 font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-400 transition hover:text-risk-600"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
      )}
    </div>
  );
}

/* ── Create / edit form ────────────────────────────────────────────────────── */

const inputCls =
  "w-full rounded-lg border border-hairline bg-surface px-3 py-2 text-sm text-navy-900 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15";

function GoalFormModal({
  editing,
  onClose,
  onSaved
}: {
  editing: Goal | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(editing?.title ?? "");
  const [targetApe, setTargetApe] = useState(
    editing ? String(editing.targetApe) : ""
  );
  const [currentApe, setCurrentApe] = useState(
    editing ? String(editing.currentApe) : "0"
  );
  const [deadline, setDeadline] = useState(editing?.deadline ?? "");
  const [note, setNote] = useState(editing?.note ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    const input: GoalInput = {
      title,
      targetApe: Number(targetApe) || 0,
      currentApe: Number(currentApe) || 0,
      deadline,
      note
    };
    setSaving(true);
    const res = editing
      ? await updateGoal(editing.id, input)
      : await createGoal(input);
    setSaving(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    onSaved();
  };

  return (
    <Modal title={editing ? "Edit goal" : "New goal"} onClose={onClose}>
      <div className="space-y-4 px-5 py-5">
        {error && (
          <p className="rounded-lg border border-risk-500/20 bg-risk-500/5 px-3 py-2 text-sm text-risk-700">
            {error}
          </p>
        )}

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy-900">
            Goal name
          </span>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Japan Incentive Trip 2026"
            className={inputCls}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy-900">
              Target APE (₱)
            </span>
            <input
              type="number"
              min={0}
              value={targetApe}
              onChange={(e) => setTargetApe(e.target.value)}
              placeholder="1000000"
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy-900">
              Deadline
            </span>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className={inputCls}
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy-900">
            Current credited APE (₱)
          </span>
          <input
            type="number"
            min={0}
            value={currentApe}
            onChange={(e) => setCurrentApe(e.target.value)}
            placeholder="0"
            className={inputCls}
          />
          <span className="mt-1 block text-xs text-slate-400">
            Editable anytime — log credited APE here, including double/triple
            credits, even if it differs from raw policy APE.
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy-900">
            Note <span className="font-normal text-slate-400">(optional)</span>
          </span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="e.g. Qualify for the Tokyo convention — needs 50% persistency too."
            className={cn(inputCls, "resize-none")}
          />
        </label>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-hairline px-5 py-3.5">
        <button
          onClick={onClose}
          className="rounded-lg border border-hairline bg-surface px-4 py-2 text-sm font-semibold text-navy-900 transition hover:bg-surface-2"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {editing ? "Save changes" : "Create goal"}
        </button>
      </div>
    </Modal>
  );
}
