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

const projectSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome do projeto e obrigatorio')
    .min(2, 'Nome do projeto deve ter no minimo 2 caracteres')
    .max(255, 'Nome do projeto deve ter no maximo 255 caracteres'),
  description: z
    .string()
    .max(5000, 'Descricao deve ter no maximo 5000 caracteres')
    .optional()
    .or(z.literal('')),
  deadline: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((value) => {
      if (!value) {
        return true
      }

      return !Number.isNaN(new Date(value).getTime())
    }, 'Prazo invalido'),
  shared: z.boolean(),
})

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

function normalizeProjectPayload(values) {
  return {
    name: values.name.trim(),
    description: values.description?.trim() || null,
    deadline: values.deadline || null,
    shared: values.shared,
  }
}

function ProjectFormModal({ open, mode, initialProject, onClose, onSaved }) {
  const [submitError, setSubmitError] = useState('')

  const defaultValues = useMemo(
    () => ({
      name: initialProject?.name || '',
      description: initialProject?.description || '',
      deadline: toDateTimeLocalInput(initialProject?.deadline),
      shared: Boolean(initialProject?.shared),
    }),
    [initialProject],
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(projectSchema),
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
      const payload = normalizeProjectPayload(values)

      if (mode === 'create') {
        await api.post('/projects', payload)
      } else if (initialProject?.id) {
        await api.put(`/projects/${initialProject.id}`, payload)
      }

      onSaved()
      onClose()
    } catch (error) {
      setSubmitError(error.message || 'Nao foi possivel salvar o projeto')
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Novo projeto' : 'Editar projeto'}
      description="Preencha os campos para salvar o projeto."
      className="max-w-lg"
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-2">
          <Label htmlFor="project-name">Nome</Label>
          <Input id="project-name" placeholder="Projeto Lotus" {...register('name')} />
          {errors.name ? <p className="text-sm text-red-600">{errors.name.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="project-description">Descricao</Label>
          <textarea
            id="project-description"
            rows={4}
            className="flex w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm transition-colors placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Descreva o objetivo do projeto"
            {...register('description')}
          />
          {errors.description ? <p className="text-sm text-red-600">{errors.description.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="project-deadline">Prazo</Label>
          <Input id="project-deadline" type="datetime-local" {...register('deadline')} />
          {errors.deadline ? <p className="text-sm text-red-600">{errors.deadline.message}</p> : null}
        </div>

        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400"
            {...register('shared')}
          />
          Projeto compartilhado
        </label>

        {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onClose} className="w-auto">
            Cancelar
          </Button>
          <Button type="submit" className="w-auto" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [requestError, setRequestError] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const navigate = useNavigate()

  async function loadProjects() {
    setIsLoading(true)
    setRequestError('')

    try {
      const response = await api.get('/projects')
      setProjects(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      setRequestError(error.message || 'Nao foi possivel carregar os projetos')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">Projetos</h1>
            <p className="text-sm text-zinc-600">Lista de projetos acessiveis para o usuario autenticado.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="default" className="w-auto" onClick={() => setIsCreateOpen(true)}>
              Novo projeto
            </Button>
            <Button variant="outline" className="w-auto" onClick={() => navigate('/dashboard')}>
              Voltar para dashboard
            </Button>
          </div>
        </div>

        {isLoading ? <p className="text-sm text-zinc-600">Carregando projetos...</p> : null}
        {requestError ? <p className="text-sm text-red-600">{requestError}</p> : null}

        {!isLoading && !requestError && projects.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-zinc-600">
              Nenhum projeto encontrado.
            </CardContent>
          </Card>
        ) : null}

        {!isLoading && !requestError && projects.length > 0 ? (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
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
                  <div className="pt-2">
                    <Button variant="outline" className="w-auto" onClick={() => setEditingProject(project)}>
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        ) : null}
      </div>

      <ProjectFormModal
        open={isCreateOpen}
        mode="create"
        initialProject={null}
        onClose={() => setIsCreateOpen(false)}
        onSaved={loadProjects}
      />

      <ProjectFormModal
        open={Boolean(editingProject)}
        mode="edit"
        initialProject={editingProject}
        onClose={() => setEditingProject(null)}
        onSaved={loadProjects}
      />
    </main>
  )
}
