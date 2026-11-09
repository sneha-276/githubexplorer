# GitHub Explorer — Trending Repositories, Profile Search & Activity Analytics

A modern, production-grade GitHub Explorer application built with **React**, **Vite**, **Redux Toolkit**, **Redux Saga**, **Material UI (MUI)**, and **Highcharts**.

The application combines **Trending Repository Discovery**, **GitHub Profile & Repository Search**, and **Weekly Repository Activity Analytics** into a cohesive, responsive experience.

---

## 🚀 Key Modules & Capabilities

### 1. Trending Repository Discovery (Default Landing Page)
- **Automatic Load:** Automatically retrieves and displays the most-starred GitHub repositories created recently upon initial launch without requiring a username search.
- **Dynamic Date Filters:**
  - **Last 1 Week** (past 7 days)
  - **Last 2 Weeks** (past 14 days)
  - **Last 1 Month** (past 30 days / calendar month - default selection)
  - Dynamically computes the `created:>=YYYY-MM-DD` query threshold against current date.
- **Infinite Scrolling:** Automatically loads subsequent pages using an `IntersectionObserver` as the user scrolls, with duplicate prevention and loading indicators.
- **Rich Repository Cards:** Full repository name, owner avatar and username, description, stars, forks, open issues, creation date, link to GitHub, and a direct **View Analytics** action.

### 2. GitHub Profile & Repository Search (Preserved & Enhanced)
- **User Profile Search:** Search GitHub users to inspect their avatar, bio, location, company, website, twitter, and 4 KPI statistics cards:
  1. Public Repositories
  2. Followers
  3. Following
  4. Public Gists
- **User Repository Explorer:** Filter user repositories by name, description, programming language, repository type (sources vs. forks), and sort by stars, forks, updated date, size, or name.
- **Global Repository Search:** Search repositories globally by keyword, topic, or description using `GET /search/repositories?q={query}`.
- **State Isolation:** Trending repositories, user repositories, and search results are maintained independently in distinct Redux slices.

### 3. Repository Activity Analytics (Mandatory Assignment Requirement)
When selecting any repository from trending results, search results, or profile repositories, the application opens a detailed weekly development analytics screen:
- **Repository Header:** Repository full name, description, owner details, stars, forks, issues, creation date, and external link, with a **Back** button to return to the previous view.
- **Activity Metric Selector:** Unified dropdown offering:
  1. **Commits** (weekly total commits)
  2. **Additions** (weekly additions count)
  3. **Deletions** (weekly deletions count)
  - A single selection updates both charts simultaneously.
- **Graph 1: Total Repository Activity:**
  - Highcharts area chart displaying weekly total additions, deletions, or commits over up to 52 weeks (1 year).
  - Human-readable week start dates on the X-axis (e.g., `02 Nov 2026`) and formatted hover tooltips.
- **Graph 2: Contributor Activity:**
  - Multi-line Highcharts spline chart displaying individual contributor weekly contributions.
  - Aligned weekly timeline matching Graph 1.
  - Distinct colors per contributor.
- **Interactive Contributor Legend:** Click any contributor chip to toggle their line visibility on the chart without removing their data from state.
- **GitHub API 202 Handling:** Gracefully handles asynchronous calculation status from GitHub statistics endpoints with automatic retries and user feedback.

### 4. Supplementary Analytics Dashboard
- Comprehensive overview visualizations across repositories:
  - **Summary KPI Banner:** Total stars earned, total forks, primary language, and top repository.
  - **Language Donut Chart:** Programming language breakdown.
  - **Stars Bar Chart:** Top-starred repositories.
  - **Forks Bar Chart:** Most-forked repositories.
  - **Repo Size Chart:** Disk space distribution.

### 5. Theme, Rate Limits & Token Configuration
- **Dark / Light Mode:** GitHub-inspired dark and light palettes with instant toggle and local storage persistence.
- **API Rate Limit Tracking:** Inspects response headers (`x-ratelimit-remaining`, `x-ratelimit-limit`, `x-ratelimit-reset`) in real time.
- **Optional Personal Access Token (PAT):** Evaluators can input an optional GitHub token to elevate rate limits from 60 to 5,000 requests/hour.

---

## 🛠️ Technical Stack

| Technology | Purpose |
|---|---|
| **React 18** | Functional components with Hooks (`useState`, `useMemo`, `useRef`, `useEffect`) |
| **Redux Toolkit** | Centralized state slices (`trending`, `search`, `analytics`, `user`, `repos`, `ui`) |
| **Redux Saga** | Asynchronous operations with watchers and workers (`takeLatest`, `call`, `put`, `all`) |
| **Material UI (MUI v5)** | Component library, responsive layout, dark/light themes |
| **Highcharts & Highcharts React** | Interactive data visualizations with custom tooltips and themes |
| **Axios** | HTTP communication with interceptors for auth tokens and rate-limit tracking |
| **Vite** | Fast build tooling and development server |

---

## 📁 Architecture & File Structure

```
src/
├── api/
│   ├── client.js                       # Axios instance, token interceptor & rate-limit listeners
│   └── githubService.js                # Official GitHub REST API endpoints with HTTP 202 retry logic
├── app/
│   ├── store.js                        # Redux store with Redux Saga middleware
│   ├── rootReducer.js                  # Combined reducers (trending, search, analytics, user, repos, ui)
│   └── rootSaga.js                     # Root saga orchestrating all domain sagas
├── features/
│   ├── trending/                       # Trending repositories slice & saga
│   │   ├── trendingSlice.js
│   │   └── trendingSagas.js
│   ├── search/                         # Global repository and user search slice & saga
│   │   ├── searchSlice.js
│   │   └── searchSagas.js
│   ├── analytics/                      # Weekly repository activity & contributor stats
│   │   ├── analyticsSlice.js
│   │   └── analyticsSagas.js
│   ├── user/                           # User profile slice & saga
│   │   ├── userSlice.js
│   │   └── userSagas.js
│   ├── repos/                          # User profile repositories slice & saga
│   │   ├── reposSlice.js
│   │   └── reposSagas.js
│   └── ui/                             # Theme, navigation (activeNav), PAT & rate limit
│       └── uiSlice.js
├── components/
│   ├── trending/
│   │   ├── TrendingView.jsx            # Default landing view with infinite scroll & cards
│   │   └── DateFilter.jsx              # Last 1 Week, 2 Weeks, 1 Month button group
│   ├── repositoryAnalytics/
│   │   ├── RepositoryAnalyticsView.jsx # Weekly analytics view with header & Back button
│   │   ├── TotalActivityChart.jsx      # Highcharts Graph 1: Total weekly activity
│   │   ├── ContributorActivityChart.jsx# Highcharts Graph 2: Multi-line contributor activity
│   │   ├── ContributorLegend.jsx       # Interactive contributor toggle chips
│   │   └── ActivityMetricSelect.jsx    # Additions, Deletions, Commits dropdown
│   ├── search/
│   │   ├── SearchGitHubView.jsx        # Dual-mode view: User profiles & Global repos
│   │   ├── SearchBar.jsx
│   │   └── RecentSearches.jsx
│   ├── profile/
│   │   ├── UserProfileCard.jsx
│   │   └── UserStatsGrid.jsx
│   ├── repos/
│   │   ├── RepoCard.jsx                # Universal repo card with owner avatar & View Analytics
│   │   ├── RepoList.jsx
│   │   ├── RepoFilters.jsx
│   │   └── RepoDetailModal.jsx
│   ├── analytics/
│   │   ├── AnalyticsDashboard.jsx
│   │   ├── LanguageDonutChart.jsx
│   │   ├── StarsBarChart.jsx
│   │   ├── ForksBarChart.jsx
│   │   └── RepoSizeChart.jsx
│   └── common/
│       ├── Header.jsx                  # Top navigation (Trending, Search, Dashboard), theme & token
│       ├── Footer.jsx
│       ├── Icons.jsx
│       ├── Loader.jsx
│       ├── ErrorAlert.jsx
│       ├── EmptyState.jsx
│       └── TokenModal.jsx
├── utils/
│   ├── dateUtils.js                    # Dynamic date calculator & week formatting
│   ├── chartUtils.js                   # Timeline alignment & Highcharts themes
│   ├── colors.js
│   ├── formatters.js
│   └── storage.js
├── theme/
│   └── theme.js
├── App.jsx
└── main.jsx
```

---

## 💻 Local Development & Evaluation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18, v20, or v22 recommended)
- `npm`

### Installation & Run
```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Build for production preview
npm run build
npm run preview
```

Open `http://localhost:3000` (or the port output by Vite) in your browser.

---

## 🌐 CodeSandbox Import Instructions

1. Push this repository or upload the folder to [CodeSandbox.io](https://codesandbox.io).
2. Select **Import Project**.
3. CodeSandbox detects `package.json` and Vite automatically.
4. Click **Install** if prompted and start exploring.
