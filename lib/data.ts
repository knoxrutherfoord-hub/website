export const profile = {
name: "Knox Rutherfoord",
grade: "11",
school: "Hilton College",
tagline: "Preformance Tracker",
};

export const navLinks = [{ href: "#academics", label: "Academics" }];

export type SubjectRow = {
id: string;
name: string;
marks: (number | null)[];
};

export type PrepDateCard = {
id: string;
kind: "date";
title: string;
subtitle: string;
date: string;
};

export type PrepTargetCard = {
id: string;
kind: "target";
title: string;
subtitle: string;
current: number;
target: number;
};

export type PrepCard = PrepDateCard | PrepTargetCard;

export type UpcomingItem = {
id: string;
subject: string;
type: string;
date: string;
notes: string;
};

export type AcademicsData = {
termLabels: string[];
subjects: SubjectRow[];
prep: PrepCard[];
upcoming: UpcomingItem[];
};

export const academicsDefaults: AcademicsData = {
termLabels: ["Term 1", "Term 2", "Term 3", "Term 4"],
subjects: [
{ id: "math", name: "Mathematics", marks: [72, 75, 78, 80] },
{
id: "it",
name: "Information Technology",
marks: [84, 86, 88, 89],
},
{ id: "english", name: "English", marks: [76, 79, 81, 82] },
{ id: "accounting", name: "Accounting", marks: [74, 76, 78, 80] },
{ id: "economics", name: "Economics", marks: [71, 73, 75, 77] },
{ id: "history", name: "History", marks: [77, 78, 80, 81] },
{ id: "afrikaans", name: "Afrikaans", marks: [69, 71, 73, 75] },
],
prep: [
{
id: "exams",
kind: "date",
title: "EXAMS",
subtitle: "Term 2",
date: "2026-06-05",
},
{
id: "prelims",
kind: "date",
title: "Final IEB Prelims",
subtitle: "Grade 12",
date: "2027-09-06",
},
{
id: "aggregates",
kind: "target",
title: "Subject Aggregates",
subtitle: "Target",
current: 78,
target: 85,
},
],
upcoming: [
{
id: "u1",
subject: "Mathematics",
type: "Test",
date: "2026-06-04",
notes: "Paper 1 — algebra & functions",
},
{
id: "u2",
subject: "English",
type: "Assignment",
date: "2026-06-10",
notes: "Essay first draft",
},
{
id: "u3",
subject: "Accounting",
type: "Exam",
date: "2026-06-17",
notes: "Mid-year paper",
},
],
};