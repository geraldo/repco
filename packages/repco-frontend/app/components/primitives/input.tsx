import React from 'react'
import type { VariantProps } from 'class-variance-authority'
import { cva, cx } from 'class-variance-authority'
import type { ClassProp } from 'class-variance-authority/dist/types'

const styles = cva(
  'border transition-colors duration-100 cursor-default disabled:opacity-50',
  {
    variants: {
      disabled: {
        true: 'opacity-70 pointer-events-none cursor-not-allowed',
      },
      variantSize: {
        md: 'py-1 px-3 text-md font-medium',
        sm: 'py-1 px-2 text-sm font-medium',
        full: 'w-full',
      },
      variant: {
        default: ['block w-full', 'text-gray-900 placeholder-gray-400'],
        icon: ['block w-full', 'text-gray-900 placeholder-gray-400', 'pl-10'],
        bare: '',
      },
      responsive: {
        md: ['text-md'],
        lg: ['text-lg'],
        xl: ['text-xl'],
      },
    },
    defaultVariants: {
      variantSize: 'md',
      variant: 'default',
      responsive: null,
    },
  },
)

export type InputIconProps = InputProps & {
  icon?: React.ReactNode
  tooltip?: string
  label?: string
  responsive?: 'md' | 'lg' | 'xl' | null
}

export function InputWithIcon(props: InputIconProps) {
  const className = cx(styles({ ...props, variant: 'icon' }))
  const { icon, tooltip, label, responsive, ...inputProps } = props
  return (
    <div className="relative">
      <div
        className="flex absolute inset-y-0 left-0 items-center pl-3"
        aria-hidden="true"
      >
        {icon ? icon : null}
      </div>
      <label htmlFor={inputProps.id} className="sr-only">
        {label}
      </label>

      <input
        className={cx(className, responsive && styles({ responsive }))}
        {...inputProps}
        aria-label={tooltip}
      />
    </div>
  )
}

export type InputProps = InputBaseProps &
  React.InputHTMLAttributes<HTMLInputElement> &
  ClassProp

export interface InputBaseProps extends VariantProps<typeof styles> {}
