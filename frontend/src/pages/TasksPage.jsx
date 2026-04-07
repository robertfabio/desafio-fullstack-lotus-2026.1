import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui'

const STATUS_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: 'Pendente', value: 'pending' },
  { label: 'Em progresso', value: 'in_progress' },
  { label: 'Concluida', value: 'done' },
]

const PRIORITY_OPTIONS = [
  { label: 'Todas', value: '' },
  { label: 'Baixa', value: 'low' },
  { label: 'Media', value: 'medium' },
  { label: 'Alta', value: 'high' },
]

function formatDateTime(value) {
  if (!value) {
    return '-'
  }

  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) {
    return '-'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(parsedDate)
}

function statusBadgeVariant(status) {
  if (status === 'done') {
    return 'success'
  }

  if (status === 'in_progress') {
    return 'warning'
  }

  return 'outline'
}

function priorityBadgeVariant(priority) {
  if (priority === 'high') {
    return 'danger'
  }

  if (priority === 'medium') {
    return 'warning'
  }

  return 'outline'
}

function labelize(value) {
  if (!value) {
    return '-'
  }

  return value.replaceAll('_', ' ')
}

export function TasksPage() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [requestError, setRequestError] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    projectId: '',
    dueDate: '',
  })

  const projectNameById = useMemo(() => {
    return new Map(projects.map((project) => [project.id, project.name]))
  }, [projects])

  async function loadProjects() {
    try {
      const response = await api.get('/projects')
      setProjects(Array.isArray(response.data) ? response.data : [])
    } catch {
      setProjects([])
    }
  }

  async function loadTasks(activeFilters) {
    setIsLoading(true)
    setRequestError('')

    const params = {}

    if (activeFilters.status) {
      params.status = activeFilters.status
    }

    if (activeFilters.priority) {
      params.priority = activeFilters.priority
    }

    if (activeFilters.projectId) {
      params.project_id = activeFilters.projectId
    }

    if (activeFilters.dueDate) {
      params.due_date = activeFilters.dueDate
    }

    try {
      const response = await api.get('/tasks', { params })
      setTasks(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      setRequestError(error.message || 'Nao foi possivel carregar as tarefas')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
    loadTasks(filters)
  }, [])

  function handleFilterChange(event) {
    const { name, value } = event.target
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function handleApplyFilters(event) {
    event.preventDefault()
    loadTasks(filters)
  }

  function handleClearFilters() {
    const resetFilters = {
      status: '',
      priority: '',
      projectId: '',
      dueDate: '',
    }

    setFilters(resetFilters)
    loadTasks(resetFilters)
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">Tarefas</h1>
            <p className="text-sm text-zinc-600">Listagem de tarefas com filtros por status, prioridade, projeto e data.</p>
          </div>
          <Button variant="outline" className="w-auto" onClick={() => navigate('/dashboard')}>
            Voltar para dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
            <CardDescription>Refine os resultados da listagem de tarefas.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5" onSubmit={handleApplyFilters}>
              <label className="flex flex-col gap-1 text-sm text-zinc-700">
                <span>Status</span>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value || 'all-status'} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-sm text-zinc-700">
                <span>Prioridade</span>
                <select
                  name="priority"
                  value={filters.priority}
                  onChange={handleFilterChange}
                  className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <option key={option.value || 'all-priority'} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-sm text-zinc-700">
                <span>Projeto</span>
                <select
                  name="projectId"
                  value={filters.projectId}
                  onChange={handleFilterChange}
                  className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                >
                  <option value="">Todos</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-sm text-zinc-700">
                <span>Data limite</span>
                <input
                  type="date"
                  name="dueDate"
                  value={filters.dueDate}
                  onChange={handleFilterChange}
                  className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                />
              </label>

              <div className="flex items-end gap-2">
                <Button type="submit" className="w-auto">
                  Filtrar
                </Button>
                <Button type="button" variant="outline" className="w-auto" onClick={handleClearFilters}>
                  Limpar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {isLoading ? <p className="text-sm text-zinc-600">Carregando tarefas...</p> : null}
        {requestError ? <p className="text-sm text-red-600">{requestError}</p> : null}

        {!isLoading && !requestError && tasks.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-zinc-600">Nenhuma tarefa encontrada.</CardContent>
          </Card>
        ) : null}

        {!isLoading && !requestError && tasks.length > 0 ? (
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <CardDescription>{task.description || 'Sem descricao cadastrada.'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-zinc-600">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={statusBadgeVariant(task.status)}>{labelize(task.status)}</Badge>
                    <Badge variant={priorityBadgeVariant(task.priority)}>{labelize(task.priority)}</Badge>
                  </div>
                  <p>
                    <span className="font-medium text-zinc-800">Projeto:</span>{' '}
                    {projectNameById.get(task.project_id) || task.project_id}
                  </p>
                  <p>
                    <span className="font-medium text-zinc-800">Prazo:</span> {formatDateTime(task.due_date)}
                  </p>
                  <p>
                    <span className="font-medium text-zinc-800">Criada em:</span> {formatDateTime(task.created_at)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </section>
        ) : null}
      </div>
    </main>
  )
}
