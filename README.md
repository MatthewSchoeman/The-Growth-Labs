# The Growth Lab · An Interactive Curriculum

`21 pages` · `239 modules` · `163 interactive labs` · all self-contained HTML

A twenty-one-piece interactive curriculum: six CS-fundamentals courses, a four-course C# application track, a capstone project, a front-end engineering course, a software-lifecycle course, advanced SQL, Angular, Angular internals, advanced C# (and its Vol. II), a TypeScript type-system deep dive, and a distributed-systems course.

**Start here → [`the-growth-lab.html`](the-growth-lab.html)** — the index. Every course links back to it from its sidebar and topbar.

---

## Structure

```
*.html      21 pages (open the-growth-lab.html to start)
css/*.css   one stylesheet per page
js/*.js     one script per page
```

Keep the folder together — pages reference `css/` and `js/` by relative path, course cards on the index open each course in a new tab, and every course links back to the index.

---

## Curriculum

### TRACK 01 · CS Fundamentals — six courses
Start here. The ideas every language and framework sits on.

| # | Course | Focus | Meta |
|---|---|---|---|
| 01 | [Mastering Big O Complexity](mastering-big-o-complexity.html) | reading growth curves, comparing algorithms live | 11 modules · 7 visual labs |
| 02 | [Mastering Data Structures](mastering-data-structures.html) | arrays, hash maps, trees, stacks, queues — animated | 12 modules · 8 interactive labs |
| 03 | [Mastering Design Patterns](mastering-design-patterns.html) | creational, structural, behavioral patterns, live | 12 modules · 9 interactive labs |
| 04 | [Mastering SQL & PostgreSQL](mastering-sql-postgresql.html) | tables, keys, joins, constraints, the index | 12 modules · 5 labs · 25 code samples |
| 05 | [Mastering OOP & Coding Principles](mastering-oop-coding-principles.html) | encapsulation, SOLID, composition over inheritance | 12 modules · 8 interactive labs |
| 06 | [Mastering Bits, Pointers & Overflow](mastering-bits-pointers-overflow.html) | binary, two's complement, pointers, flags | 12 modules · 7 interactive labs |

### TRACK 02 · The C# Application Track — four courses
One language, taken seriously — language → web → data → proof.

| # | Course | Focus | Meta |
|---|---|---|---|
| 07 | [Mastering C#](mastering-csharp.html) | records, LINQ, pattern matching, async/await, generics | 12 modules · 8 interactive labs |
| 08 | [Mastering ASP.NET Core](mastering-aspnet-core.html) | minimal APIs, middleware, DI lifetimes, model binding | 12 modules · 7 interactive labs |
| 09 | [Mastering Entity Framework Core](mastering-ef-core.html) | Fluent API mapping, LINQ→SQL, migrations, change tracking | 12 modules · 7 interactive labs |
| 10 | [Mastering Testing in .NET](mastering-testing-dotnet.html) | xUnit, mocks, property-based tests, TDD | 12 modules · 7 interactive labs |

### TRACK 03 · The Capstone — ★ the synthesis
Ten courses become one working system.

| Course | Focus | Meta |
|---|---|---|
| [The Capstone: Building Snip](capstone-building-snip.html) | a URL shortener end to end — domain model, base-62 encoder, Postgres schema, cached redirects, DI, minimal API, full test suite | 12 modules · 6 interactive labs · full architecture diagram |

### TRACK 04 · The Interface — ▣ the front end
The system gets a face — taught in the medium itself.

| Course | Focus | Meta |
|---|---|---|
| [Mastering Front-End Engineering](mastering-front-end-engineering.html) | UI = f(state) — rendering, the DOM, events, components, routing, the 16 ms budget | 12 modules · 10 interactive labs |

### TRACK 05 · The Process Layer — ↻ how software ships
Plan, review, ship, operate — again and again.

| Course | Focus | Meta |
|---|---|---|
| [Mastering the Software Development Lifecycle](mastering-software-development-lifecycle.html) | user stories, design docs, CI/CD, rolling/blue-green/canary releases | 12 modules · 7 interactive labs |

### TRACK 06 · Go Deeper — ⌁◆ sequels & deep dives
Second passes that sharpen one edge.

| Course | Sequel to | Meta |
|---|---|---|
| [Mastering Advanced SQL & PostgreSQL](mastering-advanced-sql-postgresql.html) | ⌁ 04 SQL & PostgreSQL | 12 modules · 8 interactive labs |
| [Mastering Angular](mastering-angular.html) | ⌁ 14 Front-End Engineering | 12 modules · 9 interactive labs |
| [Angular Internals](angular-internals.html) | ◆ under Mastering Angular | 12 modules · 10 interactive labs |
| [Advanced C#](advanced-csharp.html) | ◆ under Mastering C# | 12 modules · 10 interactive labs |
| [Advanced C# · Vol. II](advanced-csharp-vol2.html) | ◆ under Mastering C# | 12 modules · 10 interactive labs |
| [TypeScript · The Type System](typescript-type-system.html) | ◆ the front-end type layer | 12 modules · 10 interactive labs |
| [Distributed Systems](distributed-systems.html) | ◆ scaling out, beyond the Capstone | 12 modules · 10 interactive labs |

---

`courses reference each other · Snip carries the same running example from the Capstone through every sequel`
