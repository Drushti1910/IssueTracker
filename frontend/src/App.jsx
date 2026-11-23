import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Check, ChevronDown, Circle, Plus, Search, Settings, X } from 'lucide-react'

const API_URL = '/api/issues'
const statuses = ['Open', 'In Progress', 'Closed']

const emptyForm = { title: '', description: '', status: 'Open', assignee: '' }

function statusStyle(status) {
  if (status === 'Open') return 'bg-amber-50 text-amber-700 ring-amber-600/20'
  if (status === 'In Progress') return 'bg-blue-50 text-blue-700 ring-blue-600/20'
  return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
}

function StatusMark({ status }) {
  if (status === 'Closed') return <span className="grid size-5 place-items-center rounded-full bg-emerald-600 text-white"><Check size={12} /></span>
  if (status === 'In Progress') return <span className="size-5 rounded-full border-[5px] border-blue-500 border-r-blue-200" />
  return <Circle size={20} className="text-amber-500" strokeWidth={2.5} />
}

function App() {
  const [issues, setIssues] = useState([])
  const [statusFilter, setStatusFilter] = useState('All')
  const [assigneeFilter, setAssigneeFilter] = useState('')
  const [search, setSearch] = useState('')
  const [dialog, setDialog] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  async function loadIssues() {
    const params = new URLSearchParams()
    if (statusFilter !== 'All') params.set('status', statusFilter)
    if (assigneeFilter.trim()) params.set('assignee', assigneeFilter.trim())
    try {
      const response = await fetch(`${API_URL}?${params}`)
      if (!response.ok) throw new Error('Could not load issues')
      const data = await response.json()
      setIssues(data.issues)
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  useEffect(() => { loadIssues() }, [statusFilter, assigneeFilter])

  const visibleIssues = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return issues
    return issues.filter((issue) =>
      issue.title.toLowerCase().includes(term) ||
      issue.description.toLowerCase().includes(term) ||
      issue.assignee.toLowerCase().includes(term)
    )
  }, [issues, search])

  function openCreate() {
    setForm(emptyForm)
    setDialog('create')
    setError('')
  }

  function openEdit(issue) {
    setForm({ title: issue.title, description: issue.description, status: issue.status, assignee: issue.assignee })
    setDialog(issue)
    setError('')
  }

  async function submitIssue(event) {
    event.preventDefault()
    setError('')
    const isEditing = typeof dialog === 'object'
    const payload = isEditing
      ? { description: form.description, status: form.status, assignee: form.assignee }
      : form

    try {
      const response = await fetch(isEditing ? `${API_URL}/${dialog.id}` : API_URL, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Could not save issue')
      setDialog(null)
      await loadIssues()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const counts = {
    All: issues.length,
    Open: issues.filter((issue) => issue.status === 'Open').length,
    'In Progress': issues.filter((issue) => issue.status === 'In Progress').length,
    Closed: issues.filter((issue) => issue.status === 'Closed').length,
  }

  return (
    <div className="min-h-screen bg-[#f6f7f9] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <div className="grid size-8 place-items-center rounded-md bg-[#1267a8] text-sm font-bold text-white">IT</div>
            <span className="text-[15px] font-semibold">Issue Tracker</span>
          </div>
          <button type="button" aria-label="Settings" className="grid size-9 place-items-center rounded-md text-slate-500 hover:bg-slate-100"><Settings size={18} /></button>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-5 py-8">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Workspace</p>
            <h1 className="text-2xl font-bold tracking-normal text-slate-900 bg-red-500 text-white px-3 py-1 rounded-md">Drushti</h1>
          </div>
          <button type="button" onClick={openCreate} className="flex h-10 items-center gap-2 rounded-md bg-[#1267a8] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#0d5993]">
            <Plus size={17} /> Create issue
          </button>
        </div>

        <section className="border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-3">
            <div className="relative mr-2 min-w-[220px] flex-1 sm:max-w-[320px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search issues" className="h-9 w-full rounded-md border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-[#1267a8]" />
            </div>
            <div className="relative">
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-9 appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-8 text-sm outline-none">
                <option value="All">All statuses</option>
                {statuses.map((status) => <option key={status}>{status}</option>)}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <input value={assigneeFilter} onChange={(event) => setAssigneeFilter(event.target.value)} placeholder="Filter by assignee" className="h-9 w-[180px] rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-[#1267a8]" />
          </div>

          {error && <div className="mx-4 mt-4 flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"><AlertCircle size={16} /> {error}</div>}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-400">
                  <th className="w-24 px-4 py-3">ID</th>
                  <th className="px-4 py-3">Issue</th>
                  <th className="w-40 px-4 py-3">Status</th>
                  <th className="w-64 px-4 py-3">Assignee</th>
                </tr>
              </thead>
              <tbody>
                {visibleIssues.map((issue) => (
                  <tr key={issue.id} onClick={() => openEdit(issue)} className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-4 text-sm font-medium text-slate-400">#{issue.id}</td>
                    <td className="px-4 py-4"><div className="flex items-start gap-3"><StatusMark status={issue.status} /><div className="min-w-0"><div className="text-sm font-semibold text-slate-900">{issue.title}</div><div className="mt-1 max-w-[520px] truncate text-sm text-slate-500">{issue.description}</div></div></div></td>
                    <td className="px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyle(issue.status)}`}>{issue.status}</span></td>
                    <td className="px-4 py-4"><span className="text-sm text-slate-600">{issue.assignee}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!visibleIssues.length && <div className="py-16 text-center text-sm text-slate-500">No issues match these filters.</div>}
          </div>
        </section>
      </main>

      {dialog && (
        <div className="fixed inset-0 z-20 grid place-items-center bg-slate-950/35 px-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null) }}>
          <form onSubmit={submitIssue} className="w-full max-w-xl rounded-lg border border-slate-200 bg-white shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-slate-200 px-5">
              <h2 className="text-base font-bold">{typeof dialog === 'object' ? `Edit issue #${dialog.id}` : 'Create issue'}</h2>
              <button type="button" onClick={() => setDialog(null)} className="grid size-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="space-y-4 p-5">
              {typeof dialog !== 'object' && <label className="block"><span className="mb-1.5 block text-sm font-semibold">Title</span><input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-[#1267a8]" /></label>}
              <label className="block"><span className="mb-1.5 block text-sm font-semibold">Description</span><textarea required rows={5} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#1267a8]" /></label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block"><span className="mb-1.5 block text-sm font-semibold">Status</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none">{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
                <label className="block"><span className="mb-1.5 block text-sm font-semibold">Assignee email</span><input required type="email" value={form.assignee} onChange={(event) => setForm({ ...form, assignee: event.target.value })} className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-[#1267a8]" /></label>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-3">
              <button type="button" onClick={() => setDialog(null)} className="h-9 rounded-md border border-slate-200 px-4 text-sm font-semibold hover:bg-slate-50">Cancel</button>
              <button type="submit" className="h-9 rounded-md bg-[#1267a8] px-4 text-sm font-semibold text-white hover:bg-[#0d5993]">Save issue</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default App
