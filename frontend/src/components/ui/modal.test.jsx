import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from './modal'

describe('Modal', () => {
  it('nao renderiza quando open for false', () => {
    render(
      <Modal open={false} onClose={() => {}} title="Titulo">
        Conteudo
      </Modal>,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renderiza e fecha ao clicar no backdrop', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <Modal open onClose={onClose} title="Sair" description="Deseja sair?">
        Conteudo do modal
      </Modal>,
    )

    expect(screen.getByRole('dialog', { name: 'Sair' })).toBeInTheDocument()
    await user.click(screen.getByRole('presentation'))

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
