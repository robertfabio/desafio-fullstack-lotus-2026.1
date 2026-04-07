import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import api from '../services/api'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Modal,
} from '../components/ui'

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

const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Titulo e obrigatorio')
    .min(2, 'Titulo deve ter no minimo 2 caracteres')
    .max(255, 'Titulo deve ter no maximo 255 caracteres'),
  description: z
    .string()
    .max(5000, 'Descricao deve ter no maximo 5000 caracteres')
    .optional()
    .or(z.literal('')),
  status: z.enum(['pending', 'in_progress', 'done'], {
    message: 'Status invalido',
  }),
  priority: z.enum(['low', 'medium', 'high'], {
    message: 'Prioridade invalida',
  }),
  dueDate: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((value) => {
      if (!value) {
        return true
      }

      return !Number.isNaN(new Date(value).getTime())
    }, 'Data limite invalida'),
  projectId: z.string().uuid('Projeto invalido'),
})

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

function toDateTimeLocalInput(value) {
  if (!value) {
    return ''
  }

  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }

  const timezoneOffsetInMs = parsedDate.getTimezoneOffset() * 60000
  return new Date(parsedDate.getTime() - timezoneOffsetInMs).toISOString().slice(0, 16)
}

function normalizeTaskPayload(values) {
  return {
    title: values.title.trim(),
    description: values.description?.trim() || null,
    status: values.status,
    priority: values.priority,
    due_date: values.dueDate || null,
    project_id: values.projectId,
  }
}

function TaskFormModal({ open, mode, projects, initialTask, onClose, onSaved }) {
  const [submitError, setSubmitError] = useState('')

  const defaultValues = useMemo(
    () => ({
      title: initialTask?.title || '',
      description: initialTask?.description || '',
      status: initialTask?.status || 'pending',
      priority: initialTask?.priority || 'medium',
      dueDate: toDateTimeLocalInput(initialTask?.due_date),
      projectId: initialTask?.project_id || projects[0]?.id || '',
    }),
    [initialTask, projects],
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues,
  })

  useEffect(() => {
    if (!open) {
      return
    }

    reset(defaultValues)
    setSubmitError('')
  }, [defaultValues, open, reset])

  async function onSubmit(values) {
    setSubmitError('')

    try {
      const payload = normalizeTaskPayload(values)

      if (mode === 'create') {
        await api.post('/tasks', payload)
      } else if (initialTask?.id) {
        await api.put(`/tasks/${initialTask.id}`, payload)
      }

      onSaved()
      onClose()
    } catch (error) {
      setSubmitError(error.message || 'Nao foi possivel salvar a tarefa')
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Nova tarefa' : 'Editar tarefa'}
      description="Preencha os campos para salvar a tarefa."
      className="max-w-lg"
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-2">
          <Label htmlFor="task-title">Titulo</Label>
          <Input id="task-title" placeholder="Minha tarefa" {...register('title')} />
          {errors.title ? <p className="text-sm text-red-600">{errors.title.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="task-description">Descricao</Label>
          <textarea
            id="task-description"
            rows={4}
            className="flex w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm transition-colors placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Descreva a tarefa"
            {...register('description')}
          />
          {errors.description ? <p className="text-sm text-red-600">{errors.description.message}</p> : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="task-status">Status</Label>
            <select
              id="task-status"
              className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400"
              {...register('status')}
            >
              {STATUS_OPTIONS.filter((option) => option.value).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.status ? <p className="text-sm text-red-600">{errors.status.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-priority">Prioridade</Label>
            <select
              id="task-priority"
              className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400"
              {...register('priority')}
            >
              {PRIORITY_OPTIONS.filter((option) => option.value).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.priority ? <p className="text-sm text-red-600">{errors.priority.message}</p> : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="task-project">Projeto</Label>
          <select
            id="task-project"
            disabled={projects.length === 0}
            className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-60"
            {...register('projectId')}
          >
            {projects.length === 0 ? <option value="">Nenhum projeto disponivel</option> : null}
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {errors.projectId ? <p className="text-sm text-red-600">{errors.projectId.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="task-due-date">Data limite</Label>
          <Input id="task-due-date" type="datetime-local" {...register('dueDate')} />
          {errors.dueDate ? <p className="text-sm text-red-600">{errors.dueDate.message}</p> : null}
        </div>

        {projects.length === 0 ? (
          <p className="text-sm text-amber-700">Crie um projeto antes de cadastrar tarefas.</p>
        ) : null}

        {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onClose} className="w-auto">
            Cancelar
          </Button>
          <Button type="submit" className="w-auto" disabled={isSubmitting || projects.length === 0}>
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export function TasksPage() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [requestError, setRequestError] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [statusUpdatingByTaskId, setStatusUpdatingByTaskId] = useState({})
  const [statusErrorByTaskId, setStatusErrorByTaskId] = useState({})
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

  async function handleInlineStatusChange(task, nextStatus) {
    if (!task?.id || !nextStatus || nextStatus === task.status) {
      return
    }

    setStatusErrorByTaskId((current) => ({ ...current, [task.id]: '' }))
    setStatusUpdatingByTaskId((current) => ({ ...current, [task.id]: true }))

    try {
      const response = await api.patch(`/tasks/${task.id}/status`, { status: nextStatus })
      const updatedTask = response.data

      setTasks((current) =>
        current.map((item) => {
          if (item.id !== task.id) {
            return item
          }

          return {
            ...item,
            status: updatedTask.status,
            updated_at: updatedTask.updated_at,
          }
        }),
      )
    } catch (error) {
      setStatusErrorByTaskId((current) => ({
        ...current,
        [task.id]: error.message || 'Nao foi possivel atualizar o status',
      }))
    } finally {
      setStatusUpdatingByTaskId((current) => ({ ...current, [task.id]: false }))
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">Tarefas</h1>
            <p className="text-sm text-zinc-600">Listagem de tarefas com filtros por status, prioridade, projeto e data.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="default" className="w-auto" onClick={() => setIsCreateOpen(true)}>
              Nova tarefa
            </Button>
            <Button variant="outline" className="w-auto" onClick={() => navigate('/dashboard')}>
              Voltar para dashboard
            </Button>
          </div>
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
                  <div className="space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">Atualizacao rapida de status</span>
                    <select
                      value={task.status}
                      disabled={Boolean(statusUpdatingByTaskId[task.id])}
                      onChange={(event) => handleInlineStatusChange(task, event.target.value)}
                      className="h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {STATUS_OPTIONS.filter((option) => option.value).map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {statusUpdatingByTaskId[task.id] ? <p className="text-xs text-zinc-500">Atualizando status...</p> : null}
                    {statusErrorByTaskId[task.id] ? (
                      <p className="text-xs text-red-600">{statusErrorByTaskId[task.id]}</p>
                    ) : null}
                  </div>

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
                  <div className="pt-2">
                    <Button variant="outline" className="w-auto" onClick={() => setEditingTask(task)}>
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        ) : null}
      </div>

      <TaskFormModal
        open={isCreateOpen}
        mode="create"
        projects={projects}
        initialTask={null}
        onClose={() => setIsCreateOpen(false)}
        onSaved={() => loadTasks(filters)}
      />

      <TaskFormModal
        open={Boolean(editingTask)}
        mode="edit"
        projects={projects}
        initialTask={editingTask}
        onClose={() => setEditingTask(null)}
        onSaved={() => loadTasks(filters)}
      />
    </main>
  )
}
