// Project Timeline — frontend/src/components/timeline/ProjectTimeline.tsx

import type { Project } from '../../types/project';
import { formatDate } from '../../utils/formatters';
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface TimelineEvent {
  label: string;
  date?: string;
  done: boolean;
  isKey?: boolean;
}

function getEvents(project: Project): TimelineEvent[] {
  const today = new Date();
  const parse = (d?: string) => (d ? new Date(d) : undefined);

  return [
    {
      label: 'Recommendation',
      date: project.recommendationDate,
      done: !!project.recommendationDate && parse(project.recommendationDate)! < today,
      isKey: true,
    },
    {
      label: 'Sanction',
      date: project.sanctionDate,
      done: !!project.sanctionDate && parse(project.sanctionDate)! < today,
      isKey: true,
    },
    {
      label: 'Work Order / Start',
      date: project.startDate,
      done: !!project.startDate && parse(project.startDate)! < today,
    },
    {
      label: 'Expected Completion',
      date: project.expectedCompletion,
      done: !!project.actualCompletion,
      isKey: true,
    },
    {
      label: 'Actual Completion',
      date: project.actualCompletion,
      done: !!project.actualCompletion,
      isKey: true,
    },
  ].filter((e) => e.date);
}

interface Props {
  project: Project;
}

export default function ProjectTimeline({ project }: Props) {
  const events = getEvents(project);

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-3.5 top-4 bottom-4 w-px bg-slate-200" />

      <div className="space-y-5">
        {events.map((event, i) => {
          const isLate =
            !event.done &&
            event.date &&
            new Date(event.date) < new Date() &&
            event.label === 'Expected Completion';

          return (
            <div key={i} className="flex items-start gap-4">
              {/* Icon */}
              <div className="relative z-10 flex-shrink-0">
                {event.done ? (
                  <CheckCircle className="w-7 h-7 text-green-500 bg-white" />
                ) : isLate ? (
                  <Clock className="w-7 h-7 text-red-500 bg-white" />
                ) : (
                  <Circle className="w-7 h-7 text-slate-300 bg-white" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <p className={`text-sm font-medium ${event.isKey ? 'text-slate-800' : 'text-slate-600'}`}>
                  {event.label}
                </p>
                <p className={`text-xs mt-0.5 ${isLate ? 'text-red-600 font-semibold' : 'text-slate-400'}`}>
                  {event.date ? formatDate(event.date) : '—'}
                  {isLate && ' — OVERDUE'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
