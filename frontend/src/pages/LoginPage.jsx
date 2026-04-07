import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
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

const loginSchema = z.object({
  email: z.string().min(1, 'Email e obrigatorio').email('Email invalido'),
  password: z
    .string()
    .min(1, 'Senha e obrigatoria')
    .min(6, 'Senha deve ter no minimo 6 caracteres'),
})

export function LoginPage() {
  const [requestError, setRequestError] = useState('')
  const setAuth = useAuthStore((state) => state.setAuth)
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values) {
    setRequestError('')

    try {
      const response = await api.post('/auth/login', values)
      setAuth({
        token: response.data.token,
        user: response.data.user,
      })
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setRequestError(error.message || 'Nao foi possivel fazer login')
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>
              Use seu email e senha para acessar o painel Lotus.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
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
                {errors.email ? (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="******"
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  {...register('password')}
                />
                {errors.password ? (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                ) : null}
              </div>

              {requestError ? <p className="text-sm text-red-600">{requestError}</p> : null}

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            {user ? (
              <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                Usuario autenticado: {user.name} ({user.email})
              </div>
            ) : null}

            <div className="mt-4 text-center text-sm text-zinc-600">
              Ainda nao possui conta?{' '}
              <Link to="/register" className="font-medium text-zinc-900 underline-offset-4 hover:underline">
                Criar conta
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
