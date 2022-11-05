import { cva, cx, VariantProps } from 'class-variance-authority'

const styles = cva(
  ' border rounded-md items-center transition-colors duration-100 cursor-default disabled:opacity-50',
  {
    variants: {
      disabled: {
        true: 'opacity-70 pointer-events-none cursor-not-allowed',
      },
      size: {
        icon: '!p-1',
        md: 'py-1 px-3 text-md font-medium',
        sm: 'py-1 px-2 text-sm font-medium',
      },
      variant: {
        default: [
          'text-white',
          'bg-blue-700 hover:bg-blue-800 placeholder:focus:ring-blue-300',
          'dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
          'tfocus:ring-4 focus:outline-none rounded-lg inline-flex',
        ],

        bare: '',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  },
)

export function Button(props: ButtonProps) {
  const className = cx(styles(props))
  return <button className={className} {...props} />
}

export type ButtonProps = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>

export interface ButtonBaseProps extends VariantProps<typeof styles> {}
