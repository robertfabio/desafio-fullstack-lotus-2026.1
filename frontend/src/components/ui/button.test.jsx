import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('renderiza com o texto informado', () => {
    render(<Button>Clique aqui</Button>)

    expect(screen.getByRole('button', { name: 'Clique aqui' })).toBeInTheDocument()
  })

  it('chama onClick quando clicado', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>Salvar</Button>)
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
