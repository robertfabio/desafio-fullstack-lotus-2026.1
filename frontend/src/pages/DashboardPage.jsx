import { useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import { useAuthStore } from '../stores/authStore'
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui'

export function DashboardPage() {
  const [isLoadingSummary, setIsLoadingSummary] = useState(true)
  const [summaryError, setSummaryError] = useState('')
  const [projectCount, setProjectCount] = useState(0)
  const [tasks, setTasks] = useState([])
  const user = useAuthStore((state) => state.user)

  const taskSummary = useMemo(() => {
    const byStatus = {
      pending: 0,
      in_progress: 0,
      done: 0,
    }

    for (const task of tasks) {
      if (task?.status === 'done') {
        byStatus.done += 1
      } else if (task?.status === 'in_progress') {
        byStatus.in_progress += 1
      } else {
        byStatus.pending += 1
      }
    }

    return {
      total: tasks.length,
      byStatus,
    }
  }, [tasks])

  const upcomingDeadlineTasks = useMemo(() => {
    const now = Date.now()

    return tasks
      .filter((task) => {
        if (task?.status === 'done' || !task?.due_date) {
          return false
        }

        const dueDate = new Date(task.due_date)
        if (Number.isNaN(dueDate.getTime())) {
          return false
        }

        return dueDate.getTime() >= now
      })
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
      .slice(0, 5)
  }, [tasks])

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

  function statusLabel(status) {
    if (status === 'in_progress') {
      return 'Em progresso'
    }

    if (status === 'pending') {
      return 'Pendente'
    }

    if (status === 'done') {
      return 'Concluida'
    }

    return '-'
  }

  function statusVariant(status) {
    if (status === 'in_progress') {
      return 'warning'
    }

    if (status === 'done') {
      return 'success'
    }

    return 'outline'
  }

  useEffect(() => {
    async function loadSummary() {
      setIsLoadingSummary(true)
      setSummaryError('')

      try {
        const [projectsResponse, tasksResponse] = await Promise.all([api.get('/projects'), api.get('/tasks')])
        const loadedProjects = Array.isArray(projectsResponse.data) ? projectsResponse.data : []
        const loadedTasks = Array.isArray(tasksResponse.data) ? tasksResponse.data : []

        setProjectCount(loadedProjects.length)
        setTasks(loadedTasks)
      } catch (error) {
        setSummaryError(error.message || 'Nao foi possivel carregar o resumo do dashboard')
      } finally {
        setIsLoadingSummary(false)
      }
    }

    loadSummary()
  }, [])

  return (
    <div className="mx-auto w-full max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Visao geral com total de projetos e status das tarefas.</CardDescription>
            <div className="pt-2">
              <Badge variant="success">Autenticado</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-zinc-200 bg-zinc-100 p-4 text-sm text-zinc-700">
              <p>
                Usuario atual: <strong>{user?.name || '-'}</strong>
              </p>
              <p>Email: {user?.email || '-'}</p>
            </div>

            {isLoadingSummary ? <p className="text-sm text-zinc-600">Carregando resumo...</p> : null}
            {summaryError ? <p className="text-sm text-red-600">{summaryError}</p> : null}

            {!isLoadingSummary && !summaryError ? (
              <>
                <section className="grid gap-3 sm:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Total de projetos</CardDescription>
                      <CardTitle className="text-3xl">{projectCount}</CardTitle>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Total de tarefas</CardDescription>
                      <CardTitle className="text-3xl">{taskSummary.total}</CardTitle>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Tarefas pendentes</CardDescription>
                      <CardTitle className="text-3xl">{taskSummary.byStatus.pending}</CardTitle>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Tarefas em progresso</CardDescription>
                      <CardTitle className="text-3xl">{taskSummary.byStatus.in_progress}</CardTitle>
                    </CardHeader>
                  </Card>

                  <Card className="sm:col-span-2">
                    <CardHeader className="pb-2">
                      <CardDescription>Tarefas concluidas</CardDescription>
                      <CardTitle className="text-3xl">{taskSummary.byStatus.done}</CardTitle>
                    </CardHeader>
                  </Card>
                </section>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Proximas tarefas com prazo</CardTitle>
                    <CardDescription>Mostrando as 5 tarefas mais proximas do vencimento.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {upcomingDeadlineTasks.length === 0 ? (
                      <p className="text-sm text-zinc-600">Nenhuma tarefa futura com prazo definida.</p>
                    ) : (
                      <ul className="space-y-3">
                        {upcomingDeadlineTasks.map((task) => (
                          <li key={task.id} className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-medium text-zinc-900">{task.title}</p>
                                <p className="text-sm text-zinc-600">Prazo: {formatDateTime(task.due_date)}</p>
                              </div>
                              <Badge variant={statusVariant(task.status)}>{statusLabel(task.status)}</Badge>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : null}
          </CardContent>
        </Card>
    </div>
  )
}
