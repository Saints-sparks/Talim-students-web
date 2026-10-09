"use client";

import React from "react";
import { GradePill, SubjectDot } from "@/components/tl/bits";
import { card as cardClass, pill } from "@/components/tl/styles";
import { formatLongDayMonthYear, formatPercent, formatScore, positionText } from "@/lib/learner/format";
import { gradeTone, scaleRows } from "@/lib/learner/grades";
import { maxTotal, schoolContactLine, schoolInitials } from "@/lib/results/report";
import type { ReportCard } from "@/types/learner";

const blockTitle = "mb-2.5 text-[15px] font-extrabold text-tl-brand";
const cellBase = "px-3.5 py-3 text-left align-middle";

/**
 * The school's logo, or a square with its initials when it has none.
 *
 * @param props - Component props.
 * @param props.school - B5 `school`.
 * @returns The badge.
 */
function SchoolBadge({ school }: { school: ReportCard["school"] }) {
  if (school.logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- the logo can live on any host the school uses
      <img src={school.logoUrl} alt={`${school.name} logo`} className="h-14 w-14 shrink-0 rounded-[14px] border border-tl-line object-contain" />
    );
  }
  return (
    <span aria-hidden className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] border border-tl-line bg-tl-success-bg text-[13px] font-extrabold text-tl-success">
      {schoolInitials(school.name)}
    </span>
  );
}

/**
 * The printable report card (`data-sheet="1"`): the school's header, the
 * student's details, the score table with the API's columns and maximum
 * scores, the overall row, then the grading scale, attendance and comments.
 * Every row avoids breaking across printed pages.
 *
 * @param props - Component props.
 * @param props.card - B5's answer (status "partial" or "published").
 * @returns The report card.
 */
export function ReportSheet({ card }: { card: ReportCard }) {
  const { school, student, columns, rows, overall, attendance, remarks } = card;
  const outOf = maxTotal(columns);
  const session = card.session ?? card.term.session ?? null;
  const contact = schoolContactLine(school);
  const toneOf = (grade: string | null) => gradeTone(grade, card.scale, card.passMark);
  const info = [
    { label: "Student name", value: student.name },
    { label: "Registration no.", value: student.admissionNumber || "—" },
    { label: "Class", value: student.class.name },
    { label: "Term", value: card.term.name },
    { label: "Session", value: session || "—" },
    { label: "Date issued", value: card.issuedAt ? formatLongDayMonthYear(card.issuedAt) : "—" },
  ];
  const attendanceLines = [
    { label: "Days present", value: attendance.present },
    { label: "Days absent", value: attendance.absent },
    { label: "Times late", value: attendance.late },
    { label: "Excused", value: attendance.excused },
    { label: "School days in term", value: attendance.schoolDays },
  ];

  return (
    <article data-sheet="1" data-guide="results-report-card" aria-labelledby="report-school" className={cardClass}>
      <header className="flex flex-wrap items-center gap-4 pb-[18px]">
        <SchoolBadge school={school} />
        <div className="min-w-[200px] flex-1">
          <h2 id="report-school" className="text-[clamp(19px,2.6vw,20px)] font-extrabold tracking-[-0.4px] text-tl-ink">
            {school.name}
          </h2>
          {contact ? <p className="mt-[3px] text-[13px] text-tl-muted">{contact}</p> : null}
        </div>
        <span className={`${pill} bg-tl-select px-3.5 py-2 text-tl-brand`}>Student report card</span>
      </header>

      <dl className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,160px),1fr))] gap-x-6 gap-y-3.5 border-y border-tl-line-soft py-5">
        {info.map((item) => (
          <div key={item.label}>
            <dt className="text-xs font-bold uppercase tracking-[0.05em] text-tl-faint">{item.label}</dt>
            <dd className="mt-1 text-[15px] font-bold text-tl-ink">{item.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 overflow-x-auto rounded-xl border border-tl-line-soft print:overflow-visible">
        <table className="w-full min-w-[680px] border-collapse print:min-w-0">
          <caption className="sr-only">
            Scores for {card.term.name}
            {session ? `, ${session}` : ""}
          </caption>
          <thead>
            <tr className="bg-tl-brand-fill text-tl-on-brand">
              <th scope="col" className={`${cellBase} w-[28%] text-xs font-extrabold uppercase tracking-[0.04em]`}>
                Subject
              </th>
              {columns.map((column) => (
                <th key={column.id} scope="col" className={`${cellBase} text-xs font-extrabold uppercase tracking-[0.04em]`}>
                  {column.name}
                  <span className="block text-[11px] font-bold normal-case tracking-normal">/{column.maxScore}</span>
                </th>
              ))}
              <th scope="col" className={`${cellBase} text-xs font-extrabold uppercase tracking-[0.04em]`}>
                Total
                <span className="block text-[11px] font-bold normal-case tracking-normal">/{outOf}</span>
              </th>
              <th scope="col" className={`${cellBase} text-xs font-extrabold uppercase tracking-[0.04em]`}>
                Grade
              </th>
              <th scope="col" className={`${cellBase} text-xs font-extrabold uppercase tracking-[0.04em]`}>
                Position
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.course.id} className={`tl-print-row border-t border-tl-line-soft ${index % 2 ? "bg-tl-subtle" : "bg-tl-surface"}`}>
                <th scope="row" className={`${cellBase} text-[15px] font-bold text-tl-ink`}>
                  <span className="flex min-w-0 items-center gap-2">
                    <SubjectDot toneKey={row.course.colourKey} />
                    {row.course.title}
                  </span>
                </th>
                {columns.map((column, columnIndex) => (
                  <td key={column.id} className={`${cellBase} text-sm text-tl-muted`}>
                    {formatScore(row.scores[columnIndex])}
                  </td>
                ))}
                <td className={`${cellBase} text-[15px] font-extrabold text-tl-ink`}>{formatScore(row.total)}</td>
                <td className={cellBase}>
                  <GradePill grade={row.grade} tone={toneOf(row.grade)} />
                </td>
                <td className={`${cellBase} text-sm text-tl-muted`}>{positionText(row.position)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="tl-print-row border-t-2 border-tl-brand bg-tl-bg">
              <th scope="row" className={`${cellBase} text-[15px] font-extrabold text-tl-ink`}>
                Overall
              </th>
              {columns.map((column) => (
                <td key={column.id} className={cellBase} />
              ))}
              <td className={`${cellBase} text-[15px] font-extrabold text-tl-ink`}>{formatPercent(overall.percent)}</td>
              <td className={cellBase}>
                <GradePill grade={overall.grade} tone={toneOf(overall.grade)} />
              </td>
              <td className={`${cellBase} text-sm font-bold text-tl-ink`}>{positionText(overall.position)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-5">
        <section aria-labelledby="report-scale" className="tl-print-row">
          <h3 id="report-scale" className={blockTitle}>
            Grading scale
          </h3>
          <ul className="flex flex-col gap-1.5 text-sm text-tl-body">
            {scaleRows(card.scale).map((band) => (
              <li key={band.letter}>
                <b>{band.letter}</b> · {band.range}
                {band.remark ? ` — ${band.remark}` : ""}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[13px] text-tl-muted">Pass mark: {card.passMark}%</p>
        </section>

        <section aria-labelledby="report-attendance" className="tl-print-row">
          <h3 id="report-attendance" className={blockTitle}>
            Attendance
          </h3>
          <ul className="flex flex-col gap-1.5 text-sm text-tl-body">
            {attendanceLines.map((line) => (
              <li key={line.label}>
                <b>{line.label}:</b> {line.value}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="report-comment" className="tl-print-row">
          <h3 id="report-comment" className={blockTitle}>
            Class teacher&apos;s comment
          </h3>
          {remarks?.classTeacher ? (
            <p className="text-sm leading-relaxed text-tl-body">{remarks.classTeacher}</p>
          ) : (
            <p className="text-sm leading-relaxed text-tl-muted">
              {remarks ? "No comment from your class teacher this term." : "Your class teacher's comment appears once the term's results are published."}
            </p>
          )}
          {remarks?.classTeacherName ? (
            <p className="mt-6 border-t border-tl-control pt-2 text-[13px] text-tl-muted">{remarks.classTeacherName} · Class teacher</p>
          ) : null}
          {remarks?.principal ? (
            <>
              <h3 className={`${blockTitle} mt-5`}>Principal&apos;s comment</h3>
              <p className="text-sm leading-relaxed text-tl-body">{remarks.principal}</p>
            </>
          ) : null}
        </section>
      </div>

      {card.nextTermStart ? (
        <p className="tl-print-row mt-6 border-t border-tl-line-soft pt-4 text-sm font-bold text-tl-ink">
          Next term begins {formatLongDayMonthYear(card.nextTermStart)}
        </p>
      ) : null}
    </article>
  );
}
