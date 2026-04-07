import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import api from '../services/api'
import { useAuthStore } from '../stores/authStore'
import { Button } from '../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nome e obrigatorio')
      .min(2, 'Nome deve ter no minimo 2 caracteres'),
    email: z.string().min(1, 'Email e obrigatorio').email('Email invalido'),
    password: z
      .string()
      .min(1, 'Senha e obrigatoria')
      .min(6, 'Senha deve ter no minimo 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirmacao de senha e obrigatoria'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'As senhas devem ser iguais',
    path: ['confirmPassword'],
  })

export function RegisterPage() {
  const [requestError, setRequestError] = useState('')
  const setAuth = useAuthStore((state) => state.setAuth)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values) {
    setRequestError('')

    try {
      const response = await api.post('/auth/register', {
        name: values.name,
        email: values.email,
        password: values.password,
      })

      setAuth({
        token: response.data.token,
        user: response.data.user,
      })
      toast.success('Conta criada com sucesso')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      toast.error(error.message || 'Nao foi possivel criar a conta')
      setRequestError(error.message || 'Nao foi possivel criar a conta')
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Criar conta</CardTitle>
            <CardDescription>
              Cadastre-se para acessar seus projetos e tarefas no Lotus.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  {...register('name')}
                />
                {errors.name ? <p className="text-sm text-red-600">{errors.name.message}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="voce@empresa.com"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  {...register('email')}
                />
                {errors.email ? <p className="text-sm text-red-600">{errors.email.message}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="******"
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.password)}
                  {...register('password')}
                />
                {errors.password ? (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="******"
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.confirmPassword)}
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword ? (
                  <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                ) : null}
              </div>

              {requestError ? <p className="text-sm text-red-600">{requestError}</p> : null}

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Cadastrando...' : 'Criar conta'}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-zinc-600">
              Ja possui conta?{' '}
              <Link to="/login" className="font-medium text-zinc-900 underline-offset-4 hover:underline">
                Entrar
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
