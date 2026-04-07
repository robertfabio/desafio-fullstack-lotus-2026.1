import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui'

function formatDate(value) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

export function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [summary, setSummary] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [requestError, setRequestError] = useState('')

  useEffect(() => {
    async function loadProjectDetail() {
      setIsLoading(true)
      setRequestError('')

      try {
        const [projectResponse, summaryResponse] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get(`/projects/${id}/summary`),
        ])

        setProject(projectResponse.data)
        setSummary(summaryResponse.data)
      } catch (error) {
        setRequestError(error.message || 'Nao foi possivel carregar o detalhe do projeto')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      loadProjectDetail()
    }
  }, [id])

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">Detalhe do projeto</h1>
            <p className="text-sm text-zinc-600">Visualizacao detalhada com resumo das tarefas.</p>
          </div>
          <Button variant="outline" className="w-auto" onClick={() => navigate('/projects')}>
            Voltar para projetos
          </Button>
        </div>

        {isLoading ? <p className="text-sm text-zinc-600">Carregando detalhes...</p> : null}
        {requestError ? <p className="text-sm text-red-600">{requestError}</p> : null}

        {!isLoading && !requestError && project ? (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle>{project.name}</CardTitle>
                <Badge variant={project.shared ? 'success' : 'outline'}>
                  {project.shared ? 'Compartilhado' : 'Privado'}
                </Badge>
              </div>
              <CardDescription>{project.description || 'Sem descricao cadastrada.'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-zinc-600">
              <p>
                <span className="font-medium text-zinc-800">Prazo:</span> {formatDate(project.deadline)}
              </p>
              <p>
                <span className="font-medium text-zinc-800">Criado em:</span> {formatDate(project.created_at)}
              </p>
              <p>
                <span className="font-medium text-zinc-800">Atualizado em:</span> {formatDate(project.updated_at)}
              </p>
            </CardContent>
          </Card>
        ) : null}

        {!isLoading && !requestError && summary ? (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Total</CardDescription>
                <CardTitle className="text-3xl">{summary.total}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Pendentes</CardDescription>
                <CardTitle className="text-3xl">{summary.pending}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Em progresso</CardDescription>
                <CardTitle className="text-3xl">{summary.in_progress}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Concluidas</CardDescription>
                <CardTitle className="text-3xl">{summary.done}</CardTitle>
              </CardHeader>
            </Card>
          </section>
        ) : null}
      </div>
    </main>
  )
}
