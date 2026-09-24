import React, { ReactNode } from 'react'
import { useScrollReveal } from '@scripts/useScrollReveal'

export interface RevealProps {
  children: ReactNode
  variante?: 'fade' | 'slide-up' | 'zoom-in'
  delayMs?: number
  className?: string
  as?: keyof JSX.IntrinsicElements
}

/**
 * Componente Reveal
 * 
 * Envoltorio que orquesta la animación de entrada al scrollear mediante useScrollReveal.
 * Aplica clases de transición y retraso escalonado (stagger) para listas de elementos.
 */
const Reveal: React.FC<RevealProps> = ({
  children,
  variante = 'slide-up',
  delayMs = 0,
  className = '',
  as = 'div',
}) => {
  const { ref, visible } = useScrollReveal<HTMLElement>({ delayMs, unaVez: true })

  const clasesBase = [
    'reveal',
    `reveal-${variante}`,
    visible ? 'reveal-visible' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const Component = as as any

  return (
    <Component ref={ref} className={clasesBase} style={{ transitionDelay: `${delayMs}ms` }}>
      {children}
    </Component>
  )
}

export default Reveal
