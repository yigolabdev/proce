# 🧪 Testing Guide - Critical Functionality

**Last Updated**: 2025-01-06  
**Purpose**: Manual testing checklist for critical user flows

---

## 🎯 Critical User Flows

### 1. Authentication Flow ✅

#### Company Sign Up
- [ ] Navigate to `/auth/company-signup`
- [ ] Fill all required fields (Step 1: Company Info)
- [ ] Verify email verification flow works
  - [ ] Email input
  - [ ] Code sent notification
  - [ ] Code verification
  - [ ] Timer countdown
  - [ ] Resend functionality
- [ ] Complete Step 2: Account Setup
- [ ] Complete Step 3: Business Info (Industry selection - 27 categories)
- [ ] Complete Step 4: Additional Info
- [ ] Verify redirect to onboarding
- [ ] Check data saved in localStorage (`companyInfo`)

#### Employee Sign Up
- [ ] Navigate to `/auth/employee-signup`
- [ ] **NEW**: Enter Username (ID field at top)
  - [ ] Verify minimum 3 characters
  - [ ] Verify auto-lowercase conversion
  - [ ] Verify no spaces allowed
- [ ] Enter email and request verification code
  - [ ] Email input
  - [ ] Code sent
  - [ ] Code verification
  - [ ] Timer and resend
- [ ] Enter invite code
- [ ] Complete employee information form
- [ ] Verify email becomes read-only after verification
- [ ] Verify redirect to dashboard
- [ ] Check data saved in localStorage

#### Sign In
- [ ] Navigate to `/auth/sign-in` (or root `/`)
- [ ] Test with valid credentials
- [ ] Test with invalid credentials
- [ ] Verify redirect to dashboard on success
- [ ] Check user saved in localStorage (`user`)

---

### 2. Work Input Flow ✅

**Location**: `/app/input`

#### Basic Input
- [ ] Navigate to Work Input page
- [ ] Fill all required fields:
  - [ ] Title
  - [ ] Description
  - [ ] Date
  - [ ] Time spent
  - [ ] **Category** (10 new English categories)
    - [ ] Select "Other"
    - [ ] **NEW**: Verify custom input field appears
    - [ ] Enter custom category
    - [ ] Submit and verify saved
- [ ] Optional fields:
  - [ ] Project selection
  - [ ] OKR selection
  - [ ] File attachments
  - [ ] Links
- [ ] Submit work entry
- [ ] Verify saved to localStorage (`workEntries`)
- [ ] Verify appears in Work History

#### Draft Management
- [ ] Create partial entry
- [ ] Verify auto-save (every 30 seconds)
- [ ] Click "Save Draft"
- [ ] Verify draft appears in drafts list
- [ ] Load draft
- [ ] Verify all fields restored (including custom category if used)
- [ ] Complete and submit

#### Category Management
- [ ] Verify 10 categories displayed
- [ ] Test "Other" + custom input flow
- [ ] Navigate to `/app/admin/system-settings`
- [ ] Add a new category
- [ ] Return to Work Input
- [ ] Verify new category appears in dropdown
- [ ] **DEV MEMO**: Both pages show note about shared categories

---

### 3. OKR Management ✅

**Location**: `/app/okr`

#### Create OKR
- [ ] Navigate to OKR page
- [ ] Click "Add Objective"
- [ ] Fill objective details:
  - [ ] Title
  - [ ] Description
  - [ ] Start/End dates
  - [ ] Status
- [ ] Add Key Results:
  - [ ] Title
  - [ ] Target value
  - [ ] Current value
  - [ ] Unit
- [ ] Save objective
- [ ] Verify saved to localStorage (`objectives`)

#### Update Progress
- [ ] Select an existing objective
- [ ] Update key result progress
- [ ] Verify progress bar updates
- [ ] Verify objective status recalculates
- [ ] Verify status badge color changes
- [ ] Check mock data (30 diverse OKRs)

#### Filter & Search
- [ ] Test status filters (All/Active/Completed)
- [ ] Test search functionality
- [ ] Verify results update in real-time

---

### 4. Company Settings ✅

**Location**: `/app/admin/company-settings`

#### Tab Order (NEW - Reordered)
- [ ] Verify tab order:
  1. Company Info
  2. Business
  3. Leadership
  4. Company Goals (KPIs)
  5. Financial
  6. Workplace
  7. Documents

#### Company Info Tab (Merged Basic + Contact)
- [ ] Fill basic information
- [ ] Fill contact information
- [ ] Add social links
- [ ] Save
- [ ] Verify saved to localStorage (`companyInfo`)
- [ ] Verify progress bar updates

#### Business Tab
- [ ] Fill vision/mission
- [ ] Fill products/services
- [ ] **NEW**: Fill target market
- [ ] **NEW**: Fill target customers
- [ ] **NEW**: Fill competitive advantage
- [ ] Save
- [ ] Verify saved

#### Leadership Tab (Enhanced)
- [ ] Click "Add Leader"
- [ ] Fill leader details:
  - [ ] Name
  - [ ] **Position (dropdown)** - verify all positions available
  - [ ] Email
  - [ ] Phone
  - [ ] Department
- [ ] Save leader
- [ ] Verify appears in list
- [ ] Edit leader (inline editing)
- [ ] Delete leader
- [ ] Verify localStorage (`leadership`)

#### Company Goals (KPI) Tab (Redesigned)
- [ ] Click "Add KPI"
- [ ] Step 1: Select category (6 categories)
  - [ ] Financial
  - [ ] Customer
  - [ ] Operational
  - [ ] HR
  - [ ] Growth
  - [ ] Strategic
- [ ] Step 2: Fill KPI details
  - [ ] Name, Description
  - [ ] Target/Current value
  - [ ] Unit
  - [ ] Period (monthly/quarterly/annual)
  - [ ] Start/End dates
- [ ] Step 3: Assign responsibility
  - [ ] Owner
  - [ ] Department
- [ ] Step 4: Measurement
  - [ ] Frequency
  - [ ] Data source
  - [ ] Priority
- [ ] Save KPI
- [ ] **Verify auto-calculated**:
  - [ ] Progress percentage
  - [ ] Status (on-track/at-risk/behind/achieved)
  - [ ] Color coding
- [ ] Edit KPI inline
- [ ] Delete KPI
- [ ] Verify localStorage (`companyKPIs`)

#### Financial Tab (Enhanced)
- [ ] Add financial year
- [ ] Fill financial data:
  - [ ] Revenue, Profit, Assets, Liabilities
- [ ] **NEW**: Upload financial documents
  - [ ] Click upload button
  - [ ] Select file
  - [ ] Verify file attached
  - [ ] Verify file list shows name, size, date
  - [ ] Delete uploaded file
- [ ] Save
- [ ] Verify localStorage (`financialData`)

#### Workplace Tab (NEW - Moved from Org Setup)
- [ ] **Locale Settings**:
  - [ ] Language (en/ko)
  - [ ] Timezone
  - [ ] Working days (checkboxes)
  - [ ] Working hours (start/end)
  - [ ] Add holidays
  - [ ] Quiet hours
- [ ] **Decision Defaults**:
  - [ ] Decision mode (hybrid/ai/human)
  - [ ] Require evidence
  - [ ] Show confidence
  - [ ] Auto-approve low risk
  - [ ] Escalation window
- [ ] Save
- [ ] Verify localStorage (`workplaceSettings`)

#### Documents Tab (NEW)
- [ ] **Upload General Documents**:
  - [ ] Click "Upload Documents"
  - [ ] Select category (9 types):
    - Financial Reports
    - Legal Documents
    - Contracts
    - HR Documents
    - Marketing Materials
    - Product Docs
    - Strategic Plans
    - Meeting Minutes
    - Other
  - [ ] Select multiple files
  - [ ] Upload
  - [ ] Verify files appear grouped by category
- [ ] **Document Management**:
  - [ ] View document details (name, size, category, date)
  - [ ] Download document (UI only, not functional)
  - [ ] Delete document
  - [ ] Verify localStorage (`companyDocuments`)

---

### 5. Analytics & Insights (Merged Executive Dashboard) ✅

**Location**: `/app/executive`

#### Overview Tab (Executive Only)
- [ ] Navigate to Analytics page
- [ ] **As Executive user**: Verify Overview tab visible
- [ ] **As Admin user**: Verify Overview tab visible
- [ ] Verify displays:
  - [ ] Key metrics cards
  - [ ] Charts and graphs
  - [ ] Strategic insights

#### Departments Tab
- [ ] Switch to Departments tab
- [ ] Verify department performance data
- [ ] Test filters and sorting

#### Team Members Tab
- [ ] Switch to Team Members tab
- [ ] Verify team member list
- [ ] Test search and filters

#### Role-Based Access
- [ ] **Test as Executive**: All tabs accessible
- [ ] **Test as Admin**: All tabs accessible
- [ ] **Test as User**: Page not accessible (should redirect)

---

### 6. Admin Features ✅

#### User Management
**Location**: `/app/admin/users`

- [ ] Navigate to Users page
- [ ] View user list
- [ ] **Verify NO role dropdown in list** (removed as requested)
- [ ] Click Edit on a user
- [ ] Modify user details in modal
  - [ ] Name
  - [ ] Email
  - [ ] Role (in modal only)
  - [ ] Department
- [ ] Save changes
- [ ] Delete a user
- [ ] Verify localStorage (`users`)

#### System Settings
**Location**: `/app/admin/system-settings`

- [ ] Navigate to System Settings
- [ ] **DEV MEMO**: Verify note about shared categories with Work Input
- [ ] Test Add Category feature:
  - [ ] Add new work category
  - [ ] Verify appears in list
  - [ ] Navigate to Work Input
  - [ ] Verify new category appears in dropdown
  - [ ] Return to System Settings
  - [ ] Edit category
  - [ ] Delete category
- [ ] Verify localStorage (`workCategories`)

---

### 7. Navigation & UI ✅

#### Sidebar Menu
- [ ] Verify menu structure:
  - **Work** (All roles)
    - Dashboard
    - Work Input
    - **Notifications** (moved below Work Input)
    - Work History
    - Projects
    - My Goals (OKR)
  - **Administration** (Admin + Executive)
    - User Management
    - System Settings
  - **Executive** (Executive + Admin)
    - Analytics & Insights (merged page)
    - **Company Settings** (moved from Administration)
  - **Personal** (All roles)
    - My Settings

#### Menu Item Accessibility
- [ ] **As User**: Only "Work" and "Personal" visible
- [ ] **As Admin**: "Work", "Administration", "Executive", "Personal" visible
- [ ] **As Executive**: All menu groups visible

#### Redirects (Deleted Pages)
- [ ] Navigate to `/app/policy` → Should redirect or 404
- [ ] Navigate to `/app/help` → Should redirect or 404
- [ ] Navigate to `/app/org/setup` → Should redirect to `/app/admin/company-settings?tab=workplace`
- [ ] Navigate to `/app/analytics` → Should redirect to `/app/executive`

---

### 8. Inbox & Notifications ✅

**Location**: `/app/inbox`

#### AI Recommendations Tab (Redesigned)
- [ ] Navigate to Inbox
- [ ] Switch to AI Recommendations tab
- [ ] Verify recommendations based on:
  - [ ] Low OKR progress (<30%)
  - [ ] Inactive projects (no activity in 7+ days)
  - [ ] Upcoming deadlines (within 3 days)
- [ ] Verify insights show:
  - [ ] Type (okr_progress/project_inactive/deadline)
  - [ ] Title, description
  - [ ] Severity (high/medium/low)
  - [ ] Relevant metrics
- [ ] Verify recommendations update when:
  - [ ] OKR progress is updated
  - [ ] Work entry is added to project
  - [ ] Deadlines approach

#### Notifications Tab
- [ ] Check general notifications
- [ ] Test mark as read/unread
- [ ] Test delete notification

---

### 9. Projects ✅

**Location**: `/app/projects`

#### Create Project
- [ ] Click "Create Project"
- [ ] Fill project details
- [ ] Add objectives
- [ ] Add team members
- [ ] Set dates and status
- [ ] Save project
- [ ] Verify saved to localStorage (`projects`)

#### Project Details
- [ ] Click on a project
- [ ] View project details
- [ ] Edit project information
- [ ] Track work entries linked to project
- [ ] Update project status

---

### 10. Work History ✅

**Location**: `/app/work-history`

#### View History
- [ ] Navigate to Work History
- [ ] Verify all work entries displayed
- [ ] Test filters:
  - [ ] Date range
  - [ ] Category
  - [ ] Project
  - [ ] Status
- [ ] Test search

#### Edit Entry
- [ ] Click Edit on an entry
- [ ] Verify redirects to Work Input with data pre-filled
- [ ] Modify entry
- [ ] Save
- [ ] Return to Work History
- [ ] Verify changes reflected

#### Delete Entry
- [ ] Delete a work entry
- [ ] Verify confirmation dialog
- [ ] Confirm deletion
- [ ] Verify removed from list

---

## 🔍 Cross-Cutting Concerns

### localStorage Data Integrity
- [ ] Clear all localStorage
- [ ] Use app normally
- [ ] Refresh page
- [ ] Verify all data persists correctly
- [ ] Check browser console for errors

### Error Handling
- [ ] Corrupt localStorage data manually:
  ```javascript
  localStorage.setItem('companyInfo', 'invalid json{')
  ```
- [ ] Refresh page
- [ ] Verify app doesn't crash
- [ ] Verify error message shown
- [ ] Verify graceful degradation

### Responsive Design
- [ ] Test on mobile (375px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1920px)
- [ ] Verify all features accessible
- [ ] Verify no horizontal scroll

### Dark Mode
- [ ] Toggle dark mode
- [ ] Navigate through all pages
- [ ] Verify all text readable
- [ ] Verify all colors appropriate
- [ ] Test all interactive elements

### Performance
- [ ] Add 100+ work entries
- [ ] Add 50+ OKRs
- [ ] Add 20+ projects
- [ ] Navigate between pages
- [ ] Verify no lag
- [ ] Check Chrome DevTools Performance tab

---

## 🐛 Known Issues / Limitations

### Current Development Limitations:
1. **Mock Authentication**: All credentials accepted
2. **No Backend**: All data in localStorage
3. **File Upload**: Metadata only, no actual file storage
4. **No Real-Time Sync**: Manual page refresh needed
5. **No Search Index**: Search is client-side only

### To Be Addressed Before Production:
1. Real authentication with backend
2. API integration
3. Real file upload to cloud storage
4. WebSocket for real-time updates
5. Server-side search with pagination

---

## ✅ Testing Completion Checklist

### Phase 1: Critical Paths (Must Pass)
- [ ] User can sign up (company)
- [ ] User can sign up (employee)
- [ ] User can sign in
- [ ] User can create work entry
- [ ] User can create OKR
- [ ] User can manage company settings
- [ ] All navigation works
- [ ] Data persists after refresh

### Phase 2: Feature Complete (Should Pass)
- [ ] All 10 critical flows tested
- [ ] All tabs in Company Settings work
- [ ] All CRUD operations work
- [ ] Error handling tested
- [ ] Cross-cutting concerns verified

### Phase 3: Polish (Nice to Have)
- [ ] Responsive on all devices
- [ ] Dark mode works everywhere
- [ ] Performance acceptable with large data
- [ ] No console errors or warnings

---

## 📊 Test Results Template

```markdown
### Test Run: [Date]
**Tester**: [Name]
**Environment**: Development
**Browser**: Chrome 120

#### Results:
- Phase 1: ✅ 8/8 passed
- Phase 2: ✅ 45/45 passed
- Phase 3: ⚠️ 2/3 passed (1 minor issue)

#### Issues Found:
1. [Issue description]
   - Severity: Low/Medium/High/Critical
   - Steps to reproduce: ...
   - Expected: ...
   - Actual: ...

#### Notes:
- [Any additional observations]
```

---

## 🚀 Automated Testing (Future)

### Recommended Test Stack:
```bash
# Unit Tests
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Integration Tests
npm install --save-dev @testing-library/react-hooks

# E2E Tests
npm install --save-dev @playwright/test
```

### Priority Test Cases:
1. **Unit**: safeStorage utility functions
2. **Unit**: usePersistedState hook
3. **Integration**: Auth flow
4. **Integration**: Work entry creation
5. **E2E**: Complete user journey (signup → work input → OKR)

---

**Last Manual Test**: 2025-01-06  
**Next Test**: After major feature addition  
**Test Coverage Goal**: 70%+

